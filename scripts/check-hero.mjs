import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { chromium } from "playwright";

const base = "http://127.0.0.1:4174";
const report = [];
const passed = (message) => {
  report.push(message);
  console.log(`PASS ${message}`);
};
const server = spawn(process.execPath, ["scripts/preview.mjs"], {
  env: { ...process.env, PORT: "4174" },
  windowsHide: true,
  stdio: ["ignore", "pipe", "inherit"],
});
let browser;
const active = (page) =>
  page.locator('.hero-dot[aria-pressed="true"]').getAttribute("aria-label");
const expectActive = (page, index) =>
  page.waitForFunction(
    (i) =>
      document
        .querySelectorAll(".hero-dot")
        [i]?.getAttribute("aria-pressed") === "true",
    index,
  );
const ready = (page) =>
  page.locator(".hero-controls").waitFor({ state: "visible" });

try {
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(
      () => reject(new Error("Preview startup timeout")),
      15000,
    );
    server.stdout.once("data", () => {
      clearTimeout(timeout);
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
    viewport: { width: 1440, height: 900 },
    reducedMotion: "no-preference",
  });
  await context.addInitScript(() => {
    window.heroFrames = [];
    window.heroEntrances = [];
    document.addEventListener("animationstart", (event) => {
      if (event.animationName === "hero-enter")
        window.heroEntrances.push(performance.now());
    });
    const sample = () => {
      const copy = document.querySelector(".hero-copy");
      if (copy && window.heroFrames.length < 3000) {
        const style = getComputedStyle(copy);
        const rect = copy.getBoundingClientRect();
        window.heroFrames.push({
          time: performance.now(),
          opacity: Number(style.opacity),
          y: new DOMMatrixReadOnly(style.transform).m42,
          width: rect.width,
          height: rect.height,
          duration: style.animationDuration,
          delay: style.animationDelay,
        });
      }
      requestAnimationFrame(sample);
    };
    requestAnimationFrame(sample);
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });

  const verifyEntrance = async (name) => {
    await ready(page);
    await page.waitForTimeout(1000);
    const frames = await page.evaluate(() => window.heroFrames);
    const starts = frames.filter(
      (frame) => frame.opacity < 0.3 && frame.y > 0,
    );
    assert.ok(
      starts.length >= 1,
      `${name}: starting pose must persist across rendered frames`,
    );

    assert.ok(
      frames.some(
        (frame) =>
          frame.opacity > 0 &&
          frame.opacity < 0.9 &&
          frame.y > 0 &&
          frame.y < 22,
      ),
    );
    assert.equal(frames.at(-1).opacity, 1);
    assert.equal(frames.at(-1).y, 0);
    assert.equal(frames[0].duration, "0.7s");
    assert.equal(frames[0].delay, "0s");
    assert.equal(await page.evaluate(() => window.heroEntrances.length), 1);
    await writeFile(
      `test-results/hero-${name}-frames.json`,
      JSON.stringify(frames, null, 2),
    );
    passed(
      `${name}: painted starting pose across ${starts.length} sampled frames, visible fade/rise, 700ms entrance finishes at opacity 1`,
    );
  };
  await page.goto(base, { waitUntil: "load" });
  await verifyEntrance("fresh");
  await page.reload({ waitUntil: "load" });
  await verifyEntrance("refresh");

  const dots = page.locator(".hero-dot");
  const headingBox = await page.locator("h1").boundingBox();
  const heroBox = await page.locator(".home-hero").boundingBox();
  assert.ok(heroBox.height >= 900 * 0.9 && heroBox.height <= 900 * 0.94);
  assert.equal(await page.locator('.hero-background[alt=""]').count(), 4);
  assert.equal(
    await page.locator('.hero-backgrounds[aria-hidden="true"]').count(),
    1,
  );
  await page.getByRole("button", { name: "Previous background image" }).click();
  await expectActive(page, 3);
  await page.getByRole("button", { name: "Next background image" }).click();
  await expectActive(page, 0);
  for (let i = 0; i < 4; i++) {
    await dots.nth(i).click();
    await expectActive(page, i);
  }
  await dots.nth(1).hover();
  await expectActive(page, 3);
  await page.mouse.move(10, 100);
  await page.waitForTimeout(1250);
  assert.equal(await active(page), "Show development workspace background");
  await dots.nth(2).focus();
  await page.keyboard.press("Space");
  await expectActive(page, 2);
  assert.equal(
    await dots.nth(2).evaluate((el) => getComputedStyle(el).outlineStyle),
    "solid",
  );
  await dots.nth(0).focus();
  await page.keyboard.press("Enter");
  await expectActive(page, 0);
  await page.waitForTimeout(1250);
  await page.evaluate(() => scrollTo({top:0,behavior:"instant"}));
  await page.waitForTimeout(50);
  assert.deepEqual(await page.locator("h1").boundingBox(), headingBox);
  assert.deepEqual(await page.locator(".home-hero").boundingBox(), heroBox);
  assert.equal(await page.evaluate(() => window.heroEntrances.length), 1);
  assert.equal(
    await page
      .locator(".hero-background")
      .first()
      .evaluate((el) => getComputedStyle(el).transitionDuration),
    "1.2s, 7s",
  );
  await dots.nth(2).click();
  await expectActive(page, 2);
  await page.waitForTimeout(130);
  const fades = await page
    .locator(".hero-background")
    .evaluateAll((els) =>
      els.map((el) => Number(getComputedStyle(el).opacity)),
    );
  assert.ok(
    fades[0] > 0 && fades[0] < 1 && fades[2] > 0 && fades[2] < 1,
    `Crossfade missing: ${fades}`,
  );
  passed(
    "previous/next wrapping; every dot click; hover does not select; Enter/Space and focus ring; 1200ms overlapping crossfade; text/layout stable and entrance not restarted",
  );

  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "About", exact: true })
    .click();
  await page.waitForURL("**/about/");
  await page.waitForTimeout(200);
  await page.evaluate(() => {
    window.heroFrames = [];
    window.heroEntrances = [];
  });
  await page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await page.waitForURL(base + "/");
  await verifyEntrance("route-return");
  assert.deepEqual(errors, []);
  await context.close();

  // Inspect every image at the requested widths and save screenshots for review.
  for (const width of [320, 390, 768, 1440]) {
    const layout = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const view = await layout.newPage();
    await view.goto(base, { waitUntil: "networkidle" });
    await ready(view);
    for (let i = 0; i < 4; i++) {
      await view.locator(".hero-dot").nth(i).click();
      await expectActive(view, i);
      assert.equal(
        await view.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
        true,
      );
      const image = view.locator(".hero-background").nth(i);
      assert.equal(
        await image.evaluate((el) => el.complete && el.naturalWidth > 0),
        true,
      );
      assert.equal(
        await image.evaluate((el) => getComputedStyle(el).objectFit),
        "cover",
      );
      const box = await image.boundingBox();
      assert.equal(box.width, width);
      assert.equal(
        await view
          .locator(".hero-copy")
          .evaluate((el) => getComputedStyle(el).opacity),
        "1",
      );
      assert.equal(
        await view
          .locator(".hero-copy")
          .evaluate((el) => el.getAnimations().length),
        0,
      );
      assert.equal(await image.evaluate((el) => el.getAnimations().length), 0);
      await view.mouse.move(0, 0);
      await view.screenshot({
        path: `test-results/hero-${width}-${i + 1}.png`,
      });
    }
    assert.match(
      await view.locator(".hero-copy").innerText(),
      /Practical tech\.[\s\S]*For your business\./i,
    );
    passed(
      `${width}px: all 4 photos loaded, cover cropping, full width, no overflow; reduced motion shows content immediately with no entrance/crossfade`,
    );
    await layout.close();
  }

  // The shared header must remain usable after scrolling on every route.
  for (const width of [390, 1440]) {
    const headerContext = await browser.newContext({
      viewport: { width, height: 900 }, reducedMotion: "reduce",
    });
    const view = await headerContext.newPage();
    for (const route of ["/", "/about", "/services", "/support", "/approach", "/projects", "/contact"]) {
      await view.goto(base + route, { waitUntil: "networkidle" });
      await view.evaluate(() => scrollTo({ top: 650, behavior: "instant" }));
      await view.waitForTimeout(100);
      const header = view.locator(".site-header");
      assert.equal((await header.boundingBox()).y, 0);
      assert.equal(await header.evaluate((el) => getComputedStyle(el).backgroundColor), "rgba(11, 20, 36, 0.86)");
      assert.equal(await header.locator(".brand").isVisible(), true);
      if (width === 390) {
        await view.locator(".mobile-menu summary").click();
        assert.equal(await view.locator(".mobile-panel").isVisible(), true);
        await view.keyboard.press("Escape");
        assert.equal(await view.locator(".mobile-panel").isVisible(), false);
      } else {
        assert.equal(await view.locator('.main-links [aria-current="page"]').count(), route === "/projects" ? 0 : 1);
      }
    }
    passed(`${width}px: sticky header remains at top with readable navy surface; navigation works while scrolled on all seven routes`);
    await headerContext.close();
  }

  const touch = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const touchPage = await touch.newPage();
  await touchPage.goto(base, { waitUntil: "networkidle" });
  assert.equal(
    await touchPage.evaluate(
      () => matchMedia("(hover: hover) and (pointer: fine)").matches,
    ),
    false,
  );
  await touchPage
    .locator(".hero-dot")
    .nth(1)
    .dispatchEvent("pointerenter", { pointerType: "mouse" });
  await touchPage.waitForTimeout(100);
  await expectActive(touchPage, 0);
  for (let i = 0; i < 4; i++) {
    await touchPage.locator(".hero-dot").nth(i).tap();
    await expectActive(touchPage, i);
  }
  await touchPage.getByRole("button", { name: "Next background image" }).tap();
  await expectActive(touchPage, 0);
  await touchPage
    .getByRole("button", { name: "Previous background image" })
    .tap();
  await expectActive(touchPage, 3);
  passed(
    "390px touch emulation: dot/arrow taps work; hover selection ignored without hover capability",
  );
  await touch.close();

  const slow = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    reducedMotion: "reduce",
  });
  let releaseImage;
  const gate = new Promise((resolve) => {
    releaseImage = resolve;
  });
  await slow.route("**/it-support.webp", async (route) => {
    await gate;
    await route.continue();
  });
  const slowPage = await slow.newPage();
  await slowPage.goto(base, { waitUntil: "domcontentloaded" });
  await ready(slowPage);
  await slowPage.waitForFunction(
    () => document.querySelector(".hero-background").naturalWidth > 0,
  );
  await slowPage.locator(".hero-dot").nth(1).click();
  await slowPage.waitForTimeout(200);
  await expectActive(slowPage, 0);
  assert.equal(
    await slowPage
      .locator(".hero-background")
      .first()
      .evaluate((el) => getComputedStyle(el).opacity),
    "1",
  );
  // A newer choice must win even if an older, slow image finishes later.
  await slowPage.locator(".hero-dot").nth(2).click();
  await expectActive(slowPage, 2);
  releaseImage();
  await slowPage.waitForLoadState("networkidle");
  await expectActive(slowPage, 2);
  await slowPage.locator(".hero-dot").nth(1).click();
  await expectActive(slowPage, 1);
  passed(
    "delayed image: previous photo stays visible; late loads cannot override newer selections; image switches after decode",
  );
  await slow.close();

  for (const mode of ["disabled", "blocked"]) {
    const fallback = await browser.newContext({
      viewport: { width: 390, height: 844 },
      javaScriptEnabled: mode !== "disabled",
    });
    if (mode === "blocked")
      await fallback.route("**/*", (route) =>
        route.request().resourceType() === "script"
          ? route.abort()
          : route.continue(),
      );
    const view = await fallback.newPage();
    await view.goto(base, { waitUntil: "networkidle" });
    await view.waitForTimeout(850);
    assert.equal(
      await view
        .locator(".hero-copy")
        .evaluate((el) => getComputedStyle(el).opacity),
      "1",
    );
    assert.equal(await view.locator(".hero-controls").isVisible(), false);
    assert.equal(
      await view
        .locator(".hero-background")
        .first()
        .evaluate(
          (el) =>
            el.complete &&
            el.naturalWidth > 0 &&
            getComputedStyle(el).opacity === "1",
        ),
      true,
    );
    assert.equal(
      await view.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
      true,
    );
    await view
      .getByRole("link", { name: "Explore Services", exact: true })
      .click();
    await view.waitForURL("**/services/");
    passed(
      `JavaScript ${mode}: content and first photo visible; inactive controls hidden; CTA navigates`,
    );
    await fallback.close();
  }
  await writeFile(
    "test-results/hero-checks.txt",
    report.map((line) => `PASS ${line}`).join("\n") + "\n",
  );
} finally {
  await browser?.close();
  server.kill();
}
