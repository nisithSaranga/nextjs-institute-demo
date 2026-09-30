import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { chromium } from "playwright";

const base = "http://127.0.0.1:4175";
const routes = ["about", "services", "projects", "contact"];
const targets = {
  about: ".principle-card",
  services: ".service-detail:nth-child(2) .service-visual",
  projects: ".project-detail:nth-child(2) .project-detail-heading",
  contact: ".contact-next",
};
const server = spawn(process.execPath, ["scripts/preview.mjs"], {
  env: { ...process.env, PORT: "4175" },
  windowsHide: true,
  stdio: ["ignore", "pipe", "inherit"],
});
const report = [];
const passed = (text) => {
  report.push(text);
  console.log(`PASS ${text}`);
};
let browser;
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Preview timeout")), 15000);
    server.stdout.once("data", () => {
      clearTimeout(timer);
      resolve();
    });
    server.once("error", reject);
  });
  await mkdir("test-results", { recursive: true });
  browser = await chromium.launch({
    channel: process.env.BROWSER_CHANNEL || "chrome",
    headless: true,
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 800 },
    reducedMotion: "no-preference",
  });
  await context.addInitScript(() => {
    window.introFrames = [];
    window.entrances = [];
    window.reveals = [];
    window.liveObservers = new Map();
    window.disconnects = 0;
    const NativeObserver = window.IntersectionObserver;
    window.IntersectionObserver = class extends NativeObserver {
      constructor(callback, options) {
        super(callback, options);
        this.tracked = options?.rootMargin?.includes("-");
        if (this.tracked) window.liveObservers.set(this, new Set());
      }
      observe(target) {
        if (this.tracked) window.liveObservers.get(this)?.add(target);
        super.observe(target);
      }
      unobserve(target) {
        if (this.tracked) window.liveObservers.get(this)?.delete(target);
        super.unobserve(target);
      }
      disconnect() {
        if (this.tracked) {
          window.liveObservers.delete(this);
          window.disconnects++;
        }
        super.disconnect();
      }
    };
    const animate = Element.prototype.animate;
    Element.prototype.animate = function (frames, options) {
      window.reveals.push({
        probe: this.dataset.probe,
        route: location.pathname,
        top: this.getBoundingClientRect().top,
        frames,
        options,
      });
      return animate.call(this, frames, options);
    };
    document.addEventListener("animationstart", (event) => {
      if (event.animationName === "page-enter")
        window.entrances.push(location.pathname);
    });
    function sample() {
      const el = document.querySelector(".page-intro-copy");
      if (el && window.introFrames.length < 1500) {
        const style = getComputedStyle(el);
        window.introFrames.push({
          opacity: Number(style.opacity),
          y: new DOMMatrixReadOnly(style.transform).m42,
          duration: style.animationDuration,
        });
      }
      requestAnimationFrame(sample);
    }
    requestAnimationFrame(sample);
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const verifyEntrance = async (label) => {
    await page.waitForTimeout(1000);
    const frames = await page.evaluate(() => window.introFrames);
    assert.ok(
      frames.some((frame) => frame.opacity === 0 && frame.y === 22),
      `${label}: starting pose`,
    );
    assert.ok(
      frames.some((frame) => frame.opacity > 0 && frame.opacity < 1),
      `${label}: visible transition`,
    );
    assert.equal(frames.at(-1).opacity, 1);
    assert.equal(frames.at(-1).y, 0);
    assert.equal(frames[0].duration, "0.7s");
    assert.equal(
      await page.evaluate(() => window.entrances.length),
      1,
      `${label}: once per visit`,
    );
    assert.equal(
      await page.evaluate(() => window.liveObservers.size),
      1,
      `${label}: one current reveal observer`,
    );
  };
  const navigate = async (name) => {
    await page
      .getByRole("navigation", { name: "Main navigation", exact: true })
      .getByRole("link", { name, exact: true })
      .click();
    await page.waitForURL(
      (url) =>
        url.pathname.replaceAll("/", "").toLowerCase() ===
        (name === "Home" ? "" : name.toLowerCase()),
    );
  };
  for (const route of routes) {
    await page.goto(`${base}/${route}/`, { waitUntil: "load" });
    await verifyEntrance(`${route} direct`);
    await page.reload({ waitUntil: "load" });
    await verifyEntrance(`${route} refresh`);
    for (let visit = 0; visit < 2; visit++) {
      await navigate("Home");
      await page.evaluate(() => {
        window.introFrames = [];
        window.entrances = [];
      });
      await navigate(route[0].toUpperCase() + route.slice(1));
      await verifyEntrance(`${route} navigation ${visit + 1}`);
    }
    assert.ok(await page.evaluate(() => window.disconnects >= 4));
    assert.equal(
      await page.evaluate(() =>
        [...window.liveObservers.values()].every((targets) =>
          [...targets].every(
            (target) =>
              target.isConnected &&
              document.querySelector("main").contains(target),
          ),
        ),
      ),
      true,
    );
    const target = page.locator(targets[route]).first();
    await target.evaluate((el) => {
      el.dataset.probe = "scroll-target";
    });
    assert.equal(
      await page.evaluate(() =>
        window.reveals.some((entry) => entry.probe === "scroll-target"),
      ),
      false,
    );
    let triggered = false;
    for (let step = 0; step < 120; step++) {
      await page.mouse.wheel(0, 65);
      await page.waitForTimeout(35);
      triggered = await page.evaluate(() =>
        window.reveals.some((entry) => entry.probe === "scroll-target"),
      );
      if (triggered) break;
    }
    assert.equal(
      triggered,
      true,
      `${route}: scroll target observed after navigation`,
    );
    const reveal = await page.evaluate(() =>
      window.reveals.find((entry) => entry.probe === "scroll-target"),
    );
    assert.equal(reveal.options.duration, 720);
    assert.equal(reveal.frames[0].transform, "translateY(24px)");
    assert.ok(reveal.top < 710);
    assert.ok(
      Number(await target.evaluate((el) => getComputedStyle(el).opacity)) < 1,
    );
    await page.waitForTimeout(1000);
    await page.mouse.wheel(0, -400);
    await page.waitForTimeout(150);
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(150);
    assert.equal(
      await page.evaluate(
        () =>
          window.reveals.filter((entry) => entry.probe === "scroll-target")
            .length,
      ),
      1,
    );
    await page.emulateMedia({ reducedMotion: "reduce" });
    assert.equal(await page.evaluate(() => document.getAnimations().length), 0);
    await page.emulateMedia({ reducedMotion: "no-preference" });
    passed(
      `${route}: direct/refresh/header/return entrance; visible 24px/720ms wheel reveal once; one live observer with old targets cleaned up; reduced motion`,
    );
  }
  assert.deepEqual(errors, []);
  await context.close();

  for (const width of [320, 390, 768, 1440]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const view = await context.newPage();
    for (const route of routes) {
      await view.goto(`${base}/${route}/`, { waitUntil: "networkidle" });
      for (const image of await view.locator("img").all())
        await image.scrollIntoViewIfNeeded();
      await view
        .locator("img")
        .evaluateAll((images) =>
          Promise.all(images.map((image) => image.decode())),
        );
      assert.equal(
        await view.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
      assert.equal(
        await view
          .locator(".page-intro-copy")
          .evaluate((el) => getComputedStyle(el).opacity),
        "1",
      );
      assert.equal(
        await view
          .locator(".page-intro-copy")
          .evaluate((el) => el.getAnimations().length),
        0,
      );
      await view.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
      await view.screenshot({
        path: `test-results/inner-${route}-${width}.png`,
        fullPage: true,
      });
    }
    await view.goto(`${base}/projects/`, { waitUntil: "networkidle" });
    for (const details of await view.locator(".concept-details").all()) {
      const summary = details.locator("summary");
      await summary.focus();
      await summary.press("Enter");
      assert.equal(await details.getAttribute("open"), "");
      assert.equal(
        await summary.evaluate((el) => getComputedStyle(el).outlineStyle),
        "solid",
      );
      assert.equal(
        await details.locator(".concept-detail-content").isVisible(),
        true,
      );
      await summary.press("Escape");
      assert.equal(await details.getAttribute("open"), null);
      assert.equal(
        await summary.evaluate((el) => el === document.activeElement),
        true,
      );
      await summary.press("Space");
      assert.equal(await details.getAttribute("open"), "");
      await summary.press("Space");
      assert.equal(await details.getAttribute("open"), null);
    }
    await view.goto(`${base}/contact/`, { waitUntil: "networkidle" });
    for (const service of ["websites", "it-support", "networks"]) {
      await view.locator("#service").selectOption(service);
      const text = await view.locator("#service-guidance").textContent();
      assert.ok(
        text.includes(
          service === "websites"
            ? "pages"
            : service === "it-support"
              ? "device"
              : "workspace",
        ),
      );
      assert.equal(
        await view.locator("#service").getAttribute("aria-describedby"),
        "service-guidance",
      );
    }
    await view.locator("#name").focus();
    assert.equal(
      await view
        .locator("#name")
        .evaluate((el) => getComputedStyle(el).outlineStyle),
      "solid",
    );
    passed(
      `${width}px: all four layouts/images and screenshots; no overflow; concept keyboard/Space/Escape/focus; contextual service guidance and field focus`,
    );
    await context.close();
  }
  const fallback = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const view = await fallback.newPage();
  for (const route of routes) {
    await view.goto(`${base}/${route}/`, { waitUntil: "networkidle" });
    await view.waitForTimeout(850);
    assert.equal(
      await view
        .locator(".page-intro-copy")
        .evaluate((el) => getComputedStyle(el).opacity),
      "1",
    );
    if (route === "projects") {
      await view.locator(".concept-details summary").first().click();
      assert.equal(
        await view.locator(".concept-detail-content").first().isVisible(),
        true,
      );
    }
    if (route === "services") {
      await view.locator(".faq-list summary").first().click();
      assert.equal(
        await view.locator(".faq-list details").first().getAttribute("open"),
        "",
      );
    }
  }
  await fallback.close();
  passed(
    "JavaScript disabled: all inner introductions visible; native concept details and FAQ work",
  );
  await writeFile(
    "test-results/inner-checks.txt",
    report.map((line) => `PASS ${line}`).join("\n") + "\n",
  );
} finally {
  await browser?.close();
  server.kill();
}
