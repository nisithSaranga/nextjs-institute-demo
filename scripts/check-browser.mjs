import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { mkdir, writeFile, readFile, stat } from 'node:fs/promises';
import { chromium } from 'playwright';
const routes = ['/', '/about/', '/services/', '/support/', '/approach/', '/contact/', '/projects/'];
const base = 'http://127.0.0.1:4173';
const server = spawn(process.execPath, ['scripts/preview.mjs'], { env: { ...process.env, PORT: '4173' }, windowsHide: true, stdio: ['ignore', 'pipe', 'inherit'] });
let browser;
const report = [];
const pass = s => { report.push(s); console.log('PASS', s); };
try {
    await new Promise((resolve, reject) => { server.stdout.once('data', resolve); server.once('error', reject); });
    await mkdir('test-results/inner', { recursive: true });
    browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
    const links = new Set();
    for (const route of routes) {
        const html = await readFile(`out${route}index.html`, 'utf8');
        assert.doesNotMatch(html, /ATHEEQ|94779883311|Enroll Now|Students Trained/);
    }
    for (const width of [320, 390, 768, 1440]) {
        const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
        const page = await context.newPage();
        const errors = [];
        page.on('pageerror', e => errors.push(e.message));
        page.on('console', m => { if (m.type() === 'error')
            errors.push(m.text()); });
        for (const route of routes) {
            assert.equal((await page.goto(base + route)).status(), 200);
            assert.equal((await page.reload()).status(), 200);
            await page.waitForTimeout(150);
            assert.equal(await page.locator('main h1').count(), 1);
            assert.ok((await page.title()).includes('Nexora'));
            assert.ok(await page.locator('meta[name="description"]').getAttribute('content'));
            assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `${route} overflow at ${width}`);
            for (const href of await page.locator('a[href]').evaluateAll(es => es.map(e => e.href))) {
                const url = new URL(href);
                if (url.origin === locationOrigin(base))
                    links.add(url.pathname + url.hash);
                if (url.hostname === 'wa.me') {
                    assert.equal(url.pathname, '/94786620728');
                    assert.ok(url.searchParams.get('text'));
                }
                if (url.protocol === 'tel:')
                    assert.equal(href, 'tel:+94786620728');
            }
            for (let y = 0; y < await page.locator('body').evaluate(e => e.scrollHeight); y += 650) {
                await page.evaluate(y => scrollTo(0, y), y);
                await page.waitForTimeout(25);
            }
            assert.deepEqual(await page.locator('img').evaluateAll(es => es.filter(e => e.getClientRects().length && (!e.complete || !e.naturalWidth)).map(e => e.src)), []);
            await page.evaluate(() => scrollTo({ top: 0, behavior: 'instant' }));
            await page.screenshot({ path: `test-results/inner/${route.replaceAll('/', '') || 'home'}-${width}.png`, fullPage: true });
            if (route !== '/projects/') {
                const expected = route === '/' ? 'Home' : route.slice(1, -1) === 'about' ? 'About' : route.slice(1, -1) === 'services' ? 'Services' : route.slice(1, -1) === 'support' ? 'Support' : route.slice(1, -1) === 'approach' ? 'Approach' : 'Contact';
                const nav = width <= 980 ? page.locator('.mobile-links') : page.locator('.main-links');
                assert.equal(await nav.locator('[aria-current="page"]').textContent(), expected);
            }
        }
        await page.goto(base + '/about/');
        if (width <= 980) {
            await page.locator('.mobile-menu summary').click();
            assert.equal(await page.locator('.mobile-links a').count(), 6);
            await page.screenshot({ path: `test-results/inner/menu-${width}.png` });
            await page.keyboard.press('Escape');
            assert.equal(await page.locator('.mobile-menu').getAttribute('open'), null);
            assert.ok(await page.locator('.mobile-menu summary').evaluate(e => e === document.activeElement));
            await page.locator('.mobile-menu summary').click();
            await page.locator('.mobile-links a[href="/support/"]').click();
            await page.waitForURL('**/support/');
        }
        else {
            await page.locator('.main-links a').filter({ hasText: 'Support' }).focus();
            await page.keyboard.press('Enter');
            await page.waitForURL('**/support/');
        }
        assert.equal(await page.locator('.evidence-slides img').count(), 3);
        assert.deepEqual(errors, []);
        pass(`${width}px: seven direct routes and refresh, metadata, active navigation, image loading, contact destinations, no overflow/console errors, keyboard menu and navigation`);
        await context.close();
    }
    const page = await browser.newPage();
    for (const target of links) {
        const u = new URL(target, base);
        assert.ok(routes.includes(u.pathname), `Unmapped link ${target}`);
        assert.equal((await page.request.get(u.origin + u.pathname)).status(), 200);
        await page.goto(u.href);
        if (u.hash) {
            const id = decodeURIComponent(u.hash.slice(1));
            assert.equal(await page.locator(`[id="${id}"]`).count(), 1);
            await page.waitForTimeout(100);
            const top = await page.locator(`[id="${id}"]`).evaluate(e => e.getBoundingClientRect().top);
            assert.ok(id === "main" || top >= 70, `Obscured anchor ${target}: ${top}`);
        }
    }
    await page.close();
    pass('Every collected local navigation/CTA destination resolves; anchor targets clear the fixed header');
    const nojs = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 900 } });
    const np = await nojs.newPage();
    for (const route of routes) {
        await np.goto(base + route);
        assert.ok(await np.locator('h1').isVisible());
        assert.ok(await np.locator('[data-reveal]').evaluateAll(es => es.every(e => getComputedStyle(e).opacity !== '0')));
    }
    await np.goto(base + '/contact/');
    assert.ok(await np.getByText('The form needs JavaScript').isVisible());
    assert.ok(await np.locator('button[type="submit"]').first().isDisabled());
    await np.locator('.evidence-faq summary').first().click();
    assert.equal(await np.locator('.evidence-faq details').first().getAttribute('open'), '');
    await nojs.close();
    pass('JavaScript disabled: all pages readable; native FAQ opens; forms disabled with direct contact fallback');
    await writeFile('test-results/checks.txt', report.join('\n'));
}
finally {
    await browser?.close();
    server.kill();
}
function locationOrigin(url) { return new URL(url).origin; }
