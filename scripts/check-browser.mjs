import assert from "node:assert/strict";
import { mkdir, readFile, writeFile, stat } from "node:fs/promises";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const routes = ["/", "/about", "/services", "/projects", "/contact"];
const labels = ["Home", "About", "Services", "Projects", "Contact"];
const baseURL = "http://127.0.0.1:4173";
const normalize = (path) => path.replace(/\/$/, "") || "/";
const server = spawn(process.execPath, ["scripts/preview.mjs"], {
  env: { ...process.env, PORT: "4173" },
  windowsHide: true,
  stdio: ["ignore", "pipe", "inherit"],
});
let browser;
const report = [];
const passed = (message) => {
  report.push(message);
  console.log(`PASS ${message}`);
};
try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Preview failed to start")),
      15000,
    );
    server.stdout.once("data", () => {
      clearTimeout(timeout);
      resolve();
    });
    server.once("error", (error) => {
      clearTimeout(timeout);
      reject(error);
    });
    server.once("exit", (code) => {
      if (code) {
        clearTimeout(timeout);
        reject(new Error(`Preview exited: ${code}`));
      }
    });
  });
  await mkdir("test-results", { recursive: true });
  for (const route of routes) {
    const file = `out${route === "/" ? "" : route}/index.html`;
    assert.ok((await stat(file)).size > 0);
    assert.doesNotMatch(
      await readFile(file, "utf8"),
      /ATHEEQ|Technical Institute|demo-contact|94779883311|Students Trained|Enroll Now/i,
    );
  }
  passed(
    "static HTML exists for all five routes; no former business content in exports",
  );
  browser = await chromium.launch({
    channel: process.env.BROWSER_CHANNEL || "chrome",
    headless: true,
  });
  const internalURLs = new Set();
  const pageTitles = new Set();
  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      const response = await page.goto(`${baseURL}${route}`, {
        waitUntil: "networkidle",
      });
      assert.equal(response.status(), 200);
      assert.equal(
        (await page.reload({ waitUntil: "networkidle" })).status(),
        200,
      );
      assert.equal(await page.locator("h1").count(), 1);
      assert.match(await page.title(), /Nexora Technologies/);
      if (width === 320) pageTitles.add(await page.title());
      assert.ok(
        (await page.locator('meta[name="description"]').getAttribute("content"))
          .length > 30,
      );
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
        `Overflow: ${route} at ${width}`,
      );
      for (const location of [width < 960 ? "Mobile" : "Main", "Footer"]) {
        const current = page
          .getByRole("navigation", {
            name: `${location} navigation`,
            includeHidden: true,
          })
          .locator('[aria-current="page"]');
        assert.equal(await current.count(), 1);
        assert.equal(await current.textContent(), labels[i]);
      }
      const links = await page
        .locator("a[href]")
        .evaluateAll((elements) =>
          elements.map((element) => ({
            href: element.href,
            target: element.target,
            rel: element.rel,
          })),
        );
      if (route === "/services") {
        const serviceLinks = await page
          .locator('.service-detail a[href*="wa.me"]')
          .evaluateAll((elements) =>
            elements.map((element) =>
              new URL(element.href).searchParams.get("text"),
            ),
          );
        assert.ok(serviceLinks[0].includes("website design and development"));
        assert.ok(serviceLinks[1].includes("computer maintenance"));
        assert.ok(serviceLinks[2].includes("network setup or troubleshooting"));
      }
      for (const link of links) {
        const url = new URL(link.href);
        if (url.origin === baseURL) internalURLs.add(url.pathname + url.hash);
        if (url.hostname === "wa.me") {
          assert.equal(url.pathname, "/94786620728");
          assert.ok(url.searchParams.get("text")?.includes("Nexora"));
          assert.equal(link.target, "_blank");
          assert.ok(
            link.rel.includes("noopener") && link.rel.includes("noreferrer"),
          );
        }
        if (url.protocol === "tel:")
          assert.equal(link.href, "tel:+94786620728");
      }
      for (const image of await page.locator("img").all())
        await image.scrollIntoViewIfNeeded();
      await page.locator("img").evaluateAll(async (images) => {
        await Promise.all(images.map((image) => image.decode()));
      });
      assert.equal(
        await page.evaluate(() => document.getAnimations().length),
        0,
      );
      assert.match(
        await page
          .locator("body")
          .evaluate((body) => getComputedStyle(body).fontFamily),
        /manrope/i,
      );
      assert.equal(await page.evaluate(() => document.fonts.status), "loaded");
      await page.evaluate(() =>
        window.scrollTo({ top: 0, behavior: "instant" }),
      );
      await page.screenshot({
        path: `test-results/${route === "/" ? "home" : route.slice(1)}-${width}.png`,
        fullPage: true,
      });
      if (route === "/")
        await page.screenshot({ path: `test-results/hero-${width}.png` });
    }
    assert.deepEqual(errors, [], `Browser errors at ${width}`);
    passed(
      `${width}px: all five routes load/refresh; metadata, active links, images, local Manrope, no overflow, reduced motion, no console errors`,
    );
    await context.close();
  }
  assert.equal(pageTitles.size, 5, "Page titles must be unique");
  // Verify links and cross-page anchors in the actual exported documents.
  for (const target of internalURLs) {
    const url = new URL(target, baseURL);
    const route = normalize(url.pathname);
    assert.ok(routes.includes(route), `Unexpected route ${target}`);
    if (url.hash) {
      const html = await readFile(
        `out${route === "/" ? "" : route}/index.html`,
        "utf8",
      );
      assert.ok(
        html.includes(`id="${url.hash.slice(1)}"`),
        `Missing target ${target}`,
      );
    }
  }
  passed(
    "every internal link and cross-page anchor resolves to an exported page/element",
  );

  for (const width of [390, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    await page.goto(baseURL, { waitUntil: "networkidle" });
    for (let i = 1; i < routes.length; i++) {
      const mobile = width < 960;
      if (mobile) {
        const toggle = page.locator(".mobile-menu summary");
        await toggle.focus();
        await page.keyboard.press("Enter");
        await page.keyboard.press("Tab");
        assert.equal(
          await page.evaluate(() => document.activeElement.textContent),
          "Home",
        );
        await page.keyboard.press("Escape");
        assert.equal(
          await page.locator(".mobile-menu").getAttribute("open"),
          null,
        );
        assert.equal(
          await toggle.evaluate(
            (element) => element === document.activeElement,
          ),
          true,
        );
        assert.notEqual(
          await toggle.evaluate(
            (element) => getComputedStyle(element).outlineStyle,
          ),
          "none",
        );
        await toggle.press("Enter");
      }
      const nav = page.getByRole("navigation", {
        name: `${mobile ? "Mobile" : "Main"} navigation`,
        exact: true,
        includeHidden: true,
      });
      await nav.getByRole("link", { name: labels[i], exact: true }).focus();
      await page.keyboard.press("Enter");
      await page.waitForURL((url) => normalize(url.pathname) === routes[i]);
      await page.waitForTimeout(100);
      assert.equal(
        await nav.locator('[aria-current="page"]').textContent(),
        labels[i],
      );
      if (mobile) {
        assert.equal(
          await page.locator(".mobile-menu").getAttribute("open"),
          null,
        );
        assert.equal(
          await page.evaluate(() => document.activeElement.id),
          "page-title",
        );
      }
    }
    await page
      .getByRole("navigation", { name: "Footer navigation" })
      .getByRole("link", { name: "Services", exact: true })
      .click();
    await page.waitForURL((url) => normalize(url.pathname) === "/services");
    const faq = page.locator(".faq-list summary").first();
    await faq.focus();
    await page.keyboard.press("Enter");
    assert.equal(
      await page.locator(".faq-list details").first().getAttribute("open"),
      "",
    );
    await page
      .getByRole("link", { name: "Nexora Technologies home", exact: true })
      .first()
      .click();
    await page.waitForURL((url) => url.pathname === "/");
    passed(
      `${width}px keyboard navigation, active state, footer, logo, FAQ${width < 960 ? ", menu Escape/closure/focus transfer" : ""}`,
    );
    await context.close();
  }

  const noJS = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 900 },
  });
  const noJSPage = await noJS.newPage();
  for (const route of routes) {
    await noJSPage.goto(baseURL + route);
    assert.equal(await noJSPage.locator("h1").isVisible(), true);
    assert.equal(
      await noJSPage
        .locator("[data-reveal]")
        .evaluateAll((elements) =>
          elements.every(
            (element) => getComputedStyle(element).opacity === "1",
          ),
        ),
      true,
    );
    assert.equal(
      await noJSPage.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
  }
  await noJSPage.locator(".mobile-menu summary").click();
  assert.equal(
    await noJSPage
      .getByRole("navigation", { name: "Mobile navigation" })
      .isVisible(),
    true,
  );
  await noJSPage
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  assert.equal(normalize(new URL(noJSPage.url()).pathname), "/about");
  await noJSPage.goto(baseURL + "/contact");
  assert.equal(
    await noJSPage
      .getByRole("button", { name: /Prepare WhatsApp/ })
      .isDisabled(),
    true,
  );
  assert.equal(await noJSPage.locator(".form-fallback").isVisible(), true);
  await noJS.close();
  passed(
    "JavaScript disabled: all pages readable, native menu navigates, form cannot leak data through a native submission",
  );

  const formContext = await browser.newContext({
    viewport: { width: 390, height: 900 },
    reducedMotion: "reduce",
  });
  await formContext.addInitScript(() => {
    window.openedDrafts = [];
    window.open = (...args) => {
      window.openedDrafts.push(args);
      return null;
    };
  });
  const formPage = await formContext.newPage();
  const foreignRequests = [];
  await formContext.route("**/*", async (route) => {
    if (new URL(route.request().url()).origin !== baseURL) {
      foreignRequests.push(route.request().url());
      await route.abort();
    } else await route.continue();
  });
  await formPage.goto(baseURL + "/contact", { waitUntil: "networkidle" });
  const submit = formPage.getByRole("button", {
    name: /Prepare WhatsApp enquiry/,
  });
  await submit.click();
  assert.equal(await formPage.locator('[aria-invalid="true"]').count(), 3);
  assert.equal(
    await formPage.evaluate(() => document.activeElement.id),
    "name",
  );
  await formPage
    .getByLabel("Name", { exact: false })
    .fill("  Sam & Co + team  ");
  await formPage
    .getByLabel("Service", { exact: false })
    .selectOption("networks");
  await formPage.getByLabel("Email", { exact: false }).fill("not-an-email");
  await formPage
    .getByLabel("Message", { exact: false })
    .fill(
      "Need Wi-Fi upstairs & downstairs.\nBudget discussion: 50% now? #network",
    );
  await submit.click();
  assert.equal(
    await formPage.evaluate(() => document.activeElement.id),
    "email",
  );
  assert.equal(await formPage.locator("#email-error").isVisible(), true);
  assert.equal(await formPage.evaluate(() => window.openedDrafts.length), 0);
  await formPage
    .getByLabel("Email", { exact: false })
    .fill("sam+project@example.com");
  await submit.click();
  const [url, target, features] = await formPage.evaluate(() =>
    window.openedDrafts.at(-1),
  );
  const draftURL = new URL(url);
  assert.equal(
    draftURL.origin + draftURL.pathname,
    "https://wa.me/94786620728",
  );
  assert.equal(target, "_blank");
  assert.equal(features, "noopener,noreferrer");
  const message = draftURL.searchParams.get("text");
  assert.ok(message.includes("Name: Sam & Co + team"));
  assert.ok(message.includes("Service: Network setup & troubleshooting"));
  assert.ok(message.includes("Email: sam+project@example.com"));
  assert.ok(
    message.includes(
      "Need Wi-Fi upstairs & downstairs.\nBudget discussion: 50% now? #network",
    ),
  );
  assert.equal(
    await formPage
      .locator(".draft-status")
      .evaluate((element) => element === document.activeElement),
    true,
  );
  assert.equal(
    await formPage
      .getByRole("link", { name: /Open your prepared draft/ })
      .getAttribute("href"),
    url,
  );
  await formPage.getByLabel("Email", { exact: false }).fill("");
  await submit.click();
  assert.equal(
    new URL(
      await formPage.evaluate(() => window.openedDrafts.at(-1)[0]),
    ).searchParams
      .get("text")
      .includes("Email:"),
    false,
  );
  await formPage.getByLabel("Name", { exact: false }).fill("   ");
  await submit.click();
  assert.equal(await formPage.locator("#name-error").isVisible(), true);
  assert.equal(await formPage.evaluate(() => window.openedDrafts.length), 2);
  assert.deepEqual(foreignRequests, []);
  assert.equal(
    await formPage.evaluate(() => localStorage.length + sessionStorage.length),
    0,
  );
  await formPage.screenshot({
    path: "test-results/contact-validation.png",
    fullPage: true,
  });
  await formContext.close();
  passed(
    "form required/whitespace/email validation, focus, optional email, URL encoding, correct WhatsApp draft, popup fallback; zero external requests or stored form data",
  );

  const motionContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  await motionContext.addInitScript(() => {
    window.revealLog = [];
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (...args) {
      if (this.matches("[data-reveal]")) {
        const box = this.getBoundingClientRect();
        window.revealLog.push({
          route: location.pathname,
          text: this.textContent.trim().slice(0, 60),
          probe: this.dataset.probe,
          top: Math.round(box.top),
          viewport: innerHeight,
          scrollY,
          options: args[1],
          keyframes: args[0],
        });
      }
      return animate.apply(this, args);
    };
  });
  const motionPage = await motionContext.newPage();
  await motionPage.goto(baseURL, { waitUntil: "networkidle" });
  const motionLog = [];
  for (const [route, selector] of [
    ["/", ".service-card"],
    ["/about", ".principle-card"],
  ]) {
    if (route !== "/") {
      await motionPage
        .getByRole("navigation", { name: "Main navigation" })
        .getByRole("link", { name: "About", exact: true })
        .click();
      await motionPage.waitForURL((url) => normalize(url.pathname) === route);
      await motionPage.waitForTimeout(120);
    }
    const target = motionPage.locator(selector).first();
    await target.evaluate((element) => {
      element.dataset.probe = "target";
    });
    assert.equal(
      await motionPage.evaluate(() =>
        window.revealLog.some(
          (entry) =>
            entry.probe === "target" && entry.route === location.pathname,
        ),
      ),
      false,
    );
    let triggered = false;
    for (let scroll = 0; scroll < 100; scroll++) {
      await motionPage.mouse.wheel(0, 60);
      await motionPage.waitForTimeout(45);
      triggered = await motionPage.evaluate(() =>
        window.revealLog.some(
          (entry) =>
            entry.probe === "target" && entry.route === location.pathname,
        ),
      );
      if (triggered) break;
    }
    assert.equal(triggered, true, `Scroll reveal did not trigger on ${route}`);
    const entry = await motionPage.evaluate(() =>
      window.revealLog.findLast((entry) => entry.probe === "target"),
    );
    assert.ok(
      entry.top <= entry.viewport - 100,
      `Reveal too early: ${JSON.stringify(entry)}`,
    );
    assert.equal(entry.options.duration, 720);
    assert.equal(entry.keyframes[0].transform, "translateY(24px)");
    assert.ok(
      Number(
        await target.evaluate((element) => getComputedStyle(element).opacity),
      ) < 0.95,
      "Fade must be visible during actual scroll",
    );
    await motionPage.screenshot({
      path: `test-results/reveal-${route === "/" ? "home" : "about"}.png`,
    });
    if (route === "/") {
      await target.getByRole("link").focus();
      assert.equal(
        await target.evaluate((element) => getComputedStyle(element).opacity),
        "1",
        "Focused controls must never remain faded",
      );
    } else {
      await motionPage.emulateMedia({ reducedMotion: "reduce" });
      await motionPage.waitForTimeout(80);
      assert.equal(
        await motionPage.evaluate(() => document.getAnimations().length),
        0,
      );
    }
    motionLog.push(entry);
    await motionPage.waitForTimeout(1000);
    const before = await motionPage.evaluate(
      () =>
        window.revealLog.filter(
          (entry) =>
            entry.probe === "target" && entry.route === location.pathname,
        ).length,
    );
    await motionPage.mouse.wheel(0, -500);
    await motionPage.waitForTimeout(100);
    await motionPage.mouse.wheel(0, 500);
    await motionPage.waitForTimeout(100);
    assert.equal(
      await motionPage.evaluate(
        () =>
          window.revealLog.filter(
            (entry) =>
              entry.probe === "target" && entry.route === location.pathname,
          ).length,
      ),
      before,
      "Reveals should run once per visit",
    );
  }
  const delays = await motionPage.evaluate(() =>
    window.revealLog
      .filter((entry) => entry.text.startsWith("/0"))
      .map((entry) => entry.options.delay),
  );
  assert.ok(
    delays.includes(80) && delays.includes(160),
    "Related cards should stagger",
  );
  await writeFile(
    "test-results/reveal-after.json",
    JSON.stringify(motionLog, null, 2),
  );
  await motionContext.close();
  passed(
    "actual wheel scrolling on Home and About after client navigation: 24px/720ms visible reveals, later trigger, stagger, once per visit, focus visibility, live reduced-motion cancellation",
  );
  await writeFile(
    "test-results/checks.txt",
    report.map((line) => `PASS ${line}`).join("\n") + "\n",
  );
} finally {
  await browser?.close();
  server.kill();
}
