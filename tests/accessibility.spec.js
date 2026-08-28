import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

// Executable companion to ACCESSIBILITY_REVIEW.md (WCAG 2.1/2.2 AA). Runs
// against a real Chromium render — no Anthropic key needed, since every
// check here is about static UI structure (labels, focus, contrast, layout)
// that renders before any API call is made.
//
// Some tests are expected to FAIL until the matching finding in
// ACCESSIBILITY_REVIEW.md is fixed — that's intentional: a red test here is
// the finding, made executable. When you fix a finding, its test should go
// green; update the review doc in the same change.

test.describe("axe-core scan", () => {
  test("empty state has no critical/serious violations", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    const bad = results.violations.filter(v => v.impact === "critical" || v.impact === "serious");
    expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
  });

  test("open Settings dialog has no critical/serious violations", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "API key settings" }).click();
    await expect(page.getByTestId("settings-dialog")).toBeVisible();
    const results = await new AxeBuilder({ page }).analyze();
    const bad = results.violations.filter(v => v.impact === "critical" || v.impact === "serious");
    expect(bad, JSON.stringify(bad, null, 2)).toEqual([]);
  });
});

test.describe("zoom and reflow (WCAG 1.4.4, 1.4.10)", () => {
  test("viewport meta does not disable pinch-zoom", async ({ page }) => {
    await page.goto("/");
    const content = await page.locator('meta[name="viewport"]').getAttribute("content");
    expect(content).not.toMatch(/user-scalable=no/i);
    expect(content).not.toMatch(/maximum-scale/i);
  });

  test("reflows at a 320px-equivalent width without horizontal scrolling", async ({ page }) => {
    // 320 CSS px is the standard WCAG 1.4.10 stand-in for "1280px zoomed to 400%".
    await page.setViewportSize({ width: 320, height: 256 });
    await page.goto("/");
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth);
  });
});

test.describe("forced-colors mode (Windows High Contrast)", () => {
  test("key affordances still render under forced-colors", async ({ page }) => {
    await page.emulateMedia({ forcedColors: "active" });
    await page.goto("/");
    // Smoke check + artifact: forced-colors strips author colors, which most
    // often breaks elements whose visibility depends only on background-color
    // (no border) — screenshot is attached to the report for manual review.
    for (const locator of [page.locator('[aria-label="Attach file"]'), page.getByRole("button", { name: "Send" })]) {
      const box = await locator.boundingBox();
      expect(box, "affordance should still have a visible bounding box").not.toBeNull();
      expect(box.width).toBeGreaterThan(0);
      expect(box.height).toBeGreaterThan(0);
    }
    await test.info().attach("forced-colors-screenshot", {
      body: await page.screenshot(),
      contentType: "image/png",
    });
  });
});

test.describe("keyboard focus (WCAG 2.4.7, 2.4.3)", () => {
  test("message composer shows a visible focus indicator", async ({ page }) => {
    await page.goto("/");
    await page.getByPlaceholder("Bring a system, problem, file, or pattern…").focus();
    const outlineStyle = await page.evaluate(() => getComputedStyle(document.activeElement).outlineStyle);
    expect(outlineStyle).not.toBe("none");
  });

  test("Tab does not escape the open Settings dialog into the page behind it", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "API key settings" }).click();
    const dialog = page.getByTestId("settings-dialog");
    await expect(dialog).toBeVisible();

    for (let i = 0; i < 15; i++) {
      await page.keyboard.press("Tab");
      const inside = await dialog.evaluate((el) => el.contains(document.activeElement));
      expect(inside, `focus escaped the dialog after ${i + 1} Tab presses`).toBe(true);
    }
  });

  test("Settings dialog has dialog semantics and moves focus in on open", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "API key settings" }).click();
    const dialog = page.getByRole("dialog", { name: /API key/i });
    await expect(dialog).toBeVisible();
    // Initial focus should land inside the dialog, not stay on the trigger.
    const inside = await dialog.evaluate((el) => el.contains(document.activeElement));
    expect(inside).toBe(true);
  });

  test("Escape closes the Settings dialog and returns focus to the trigger", async ({ page }) => {
    await page.goto("/");
    const trigger = page.getByRole("button", { name: "API key settings" });
    await trigger.click();
    await expect(page.getByTestId("settings-dialog")).toBeVisible();

    await page.keyboard.press("Escape");
    await expect(page.getByTestId("settings-dialog")).toBeHidden();
    await expect(trigger).toBeFocused();
  });
});

test.describe("status messages (WCAG 4.1.3)", () => {
  test("message log is a live region", async ({ page }) => {
    await page.goto("/");
    const log = page.getByRole("log");
    await expect(log).toBeVisible();
    await expect(log).toHaveAttribute("aria-live", "polite");
  });

  test("typing indicator has a text alternative while a reply is in flight", async ({ page }) => {
    // No real key needed: stub the Anthropic call so the app's own loading
    // state (and its live-region announcement) can be exercised end to end.
    await page.addInitScript(() => localStorage.setItem("kellybot.key.anthropic", "sk-ant-test-key"));
    await page.route("**/v1/messages", async (route) => {
      await new Promise((r) => setTimeout(r, 300));
      await route.fulfill({
        json: { content: [{ type: "text", text: "Test reply from Kelly." }] },
      });
    });
    await page.goto("/");

    await page.getByRole("textbox", { name: /message/i }).fill("Hello");
    await page.getByRole("button", { name: "Send" }).click();

    // While the request is in flight, the sr-only "Kelly is typing…" text
    // should be present inside the live region (visually hidden, not
    // display:none, so it's still queryable).
    await expect(page.getByText("Kelly is typing…")).toBeAttached();

    // And once the reply lands, it should be inside the same log region.
    await expect(page.getByRole("log").getByText("Test reply from Kelly.")).toBeVisible();
  });

  test("copy button announces success via a status region", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.addInitScript(() => localStorage.setItem("kellybot.key.anthropic", "sk-ant-test-key"));
    await page.route("**/v1/messages", async (route) => {
      await route.fulfill({ json: { content: [{ type: "text", text: "Reply text" }] } });
    });
    await page.goto("/");
    await page.getByRole("textbox", { name: /message/i }).fill("Hi");
    await page.getByRole("button", { name: "Send" }).click();
    await expect(page.getByRole("log").getByText("Reply text")).toBeVisible();

    await page.getByRole("button", { name: "Copy response" }).click();
    await expect(page.getByRole("status")).toHaveText("Copied to clipboard");
  });
});

test.describe("headings and landmarks (WCAG 1.3.1, 2.4.1, 2.4.6)", () => {
  test("a single h1 names the app, and the empty state uses a heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Kelly" })).toBeVisible();
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("heading", { level: 2, name: /kelly is listening/i })).toBeVisible();
  });

  test("nav, messages, and composer are exposed as landmarks", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner")).toBeVisible();
    await expect(page.getByRole("main")).toBeVisible();
    await expect(page.getByRole("form", { name: /send a message/i })).toBeVisible();
  });
});

test.describe("target size (WCAG 2.5.8)", () => {
  test("the model-reload button meets the 24x24 minimum", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "API key settings" }).click();
    const box = await page.getByRole("button", { name: "Load models" }).boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(24);
    expect(box.height).toBeGreaterThanOrEqual(24);
  });

  test("the pending-attachment remove button meets the 24x24 minimum", async ({ page }) => {
    await page.goto("/");
    await page.locator('input[type="file"]').setInputFiles({
      name: "test.png",
      mimeType: "image/png",
      buffer: Buffer.from([0, 1, 2, 3]),
    });
    const box = await page.getByRole("button", { name: "Remove" }).boundingBox();
    expect(box.width).toBeGreaterThanOrEqual(24);
    expect(box.height).toBeGreaterThanOrEqual(24);
  });
});

test.describe("form field labels (WCAG 1.3.1, 3.3.2, 4.1.2)", () => {
  test("Settings fields expose an accessible name", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "API key settings" }).click();
    await expect(page.getByTestId("settings-dialog")).toBeVisible();

    await expect(page.getByRole("textbox", { name: /api key/i })).toBeVisible();
    await expect(page.getByRole("combobox", { name: /model/i })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /workspace/i })).toBeVisible();
  });

  test("message composer exposes an accessible name", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("textbox", { name: /message/i })).toBeVisible();
  });
});
