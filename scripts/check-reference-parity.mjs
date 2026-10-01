import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { chromium } from 'playwright';

const server = spawn(process.execPath, ['scripts/preview.mjs'], {env:{...process.env,PORT:'4176'},windowsHide:true,stdio:['ignore','pipe','inherit']});
let browser;
const report=[];
const pass=s=>{report.push(s);console.log('PASS',s)};
try {
 await new Promise((resolve,reject)=>{server.stdout.once('data',resolve);server.once('error',reject)});
 await mkdir('test-results/parity',{recursive:true});
 browser=await chromium.launch({channel:process.env.BROWSER_CHANNEL||'chrome',headless:true});
 for(const width of [320,390,768,1440]) {
  const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  page.on('console',m=>{if(m.type()==='error')errors.push(m.text())});
  for(const route of ['/','/about/','/services/','/projects/','/support/','/approach/','/contact/']) {
   assert.equal((await page.goto('http://localhost:4176'+route)).status(),200);
   assert.equal((await page.reload()).status(),200);
   await page.waitForTimeout(200);
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`${route}: overflow at ${width}`);
   for(let y=0;y<await page.locator('body').evaluate(e=>e.scrollHeight);y+=650){await page.evaluate(y=>scrollTo(0,y),y);await page.waitForTimeout(30)}
   await page.evaluate(()=>scrollTo({top:0,behavior:"instant"}));
   await page.screenshot({path:`test-results/parity/nexora-${route.replaceAll('/','')||'home'}-${width}.png`,fullPage:true});
   const broken=await page.locator('img').evaluateAll(es=>es.filter(e=>e.getClientRects().length&&(!e.complete||!e.naturalWidth)).map(e=>e.src));
   assert.deepEqual(broken,[]);
   for(const href of await page.locator('a[href^="https://wa.me/"]').evaluateAll(es=>es.map(e=>e.href))){const u=new URL(href);assert.equal(u.pathname,'/94786620728');assert.ok(u.searchParams.get('text'))}
   for(const href of await page.locator('a[href^="tel:"]').evaluateAll(es=>es.map(e=>e.href)))assert.equal(href,'tel:+94786620728');
  }
  await page.goto('http://localhost:4176/');
  await page.waitForTimeout(300);
  assert.equal(await page.locator('.hero-dot').count(),4);
  await page.locator('.hero-arrow').first().click();await page.waitForTimeout(200);
  assert.equal(await page.locator('.hero-dot').nth(3).getAttribute('aria-pressed'),'true');
  await page.locator('.hero-arrow').last().click();await page.waitForTimeout(200);
  assert.equal(await page.locator('.hero-dot').first().getAttribute('aria-pressed'),'true');
  await page.locator('.hero-dot').nth(2).hover();await page.waitForTimeout(100);
  assert.equal(await page.locator('.hero-dot').first().getAttribute('aria-pressed'),'true');
  await page.locator('.hero-dot').nth(2).focus();await page.keyboard.press('Enter');await page.waitForTimeout(200);
  assert.equal(await page.locator('.hero-dot').nth(2).getAttribute('aria-pressed'),'true');
  await page.locator('.gallery-prev').click();assert.equal(await page.locator('.gallery-dots button').nth(7).getAttribute('aria-pressed'),'true');
  await page.locator('.gallery-next').click();assert.equal(await page.locator('.gallery-dots button').first().getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('.gallery-photo:not([hidden])').count(),3);
  if(width<981){
   await page.evaluate(()=>scrollTo(0,0));await page.locator('.mobile-menu summary').click();
   await page.screenshot({path:`test-results/parity/menu-${width}.png`});
   assert.equal(await page.locator('.mobile-panel').evaluate(e=>Math.round(e.getBoundingClientRect().width)),Math.round(Math.min(340,width*.9)));
   await page.keyboard.press('Escape');assert.equal(await page.locator('.mobile-menu').getAttribute('open'),null);
   assert.equal(await page.locator('.mobile-menu summary').evaluate(e=>e===document.activeElement),true);
   await page.locator('.mobile-menu summary').click();await page.locator('.mobile-links a').filter({hasText:'About'}).click();await page.waitForURL('**/about/');
   assert.equal(await page.locator('.mobile-menu').getAttribute('open'),null);
  }
  assert.deepEqual(errors,[]);pass(`${width}px: seven routes/refresh, overflow, images, console, contact URLs, hero/gallery controls, keyboard and drawer`);
  await context.close();
 }
 const page=await browser.newPage({viewport:{width:1440,height:900}});
 await page.goto('http://localhost:4176/');await page.waitForTimeout(1000);
 assert.equal(await page.locator('.hero-background').first().evaluate(e=>getComputedStyle(e).transitionDuration),'1.2s, 7s');
 await page.waitForTimeout(5900);assert.equal(await page.locator('.hero-dot').nth(1).getAttribute('aria-pressed'),'true');
 await page.locator('.hero-dot').nth(3).click();await page.waitForTimeout(200);assert.equal(await page.locator('.hero-dot').nth(3).getAttribute('aria-pressed'),'true');
 await page.waitForTimeout(6600);assert.equal(await page.locator('.hero-dot').first().getAttribute('aria-pressed'),'true');
 await page.locator('.reference-gallery').scrollIntoViewIfNeeded();await page.locator('.reference-gallery').hover();const before=await page.locator('.gallery-dots button[aria-pressed="true"]').getAttribute('aria-label');await page.waitForTimeout(5200);assert.equal(await page.locator('.gallery-dots button[aria-pressed="true"]').getAttribute('aria-label'),before);
 await page.mouse.move(1,1);await page.waitForTimeout(5200);assert.notEqual(await page.locator('.gallery-dots button[aria-pressed="true"]').getAttribute('aria-label'),before);
 await page.locator(".gallery-dots button").nth(2).click();await page.waitForTimeout(5200);assert.equal(await page.locator(".gallery-dots button").nth(3).getAttribute("aria-pressed"),"true");
 await page.emulateMedia({reducedMotion:'reduce'});const active=await page.locator('.hero-dot[aria-pressed="true"]').getAttribute('aria-label');await page.waitForTimeout(6700);assert.equal(await page.locator('.hero-dot[aria-pressed="true"]').getAttribute('aria-label'),active);
 pass('Normal motion: 6.5s hero autoplay/reset/wrap, 1.2s fade/7s scale, gallery hover pause/restart and manual reset while hovered; reduced motion stops autoplay');
 await writeFile('test-results/parity/results.txt',report.join('\n'));
} finally {await browser?.close();server.kill()}
