import { existsSync } from "node:fs";
import { defineConfig, devices } from "@playwright/test";

// Some sandboxed dev environments (e.g. Claude Code's remote runner) ship a
// pre-installed Chromium outside Playwright's usual cache, at a revision
// that can drift from what this @playwright/test version expects — pointing
// at it directly avoids a failed auto-download in those sandboxes. Everyone
// else falls through to Playwright's normal resolution (run
// `npx playwright install chromium` once if that hasn't been done).
const sandboxChromium = "/opt/pw-browsers/chromium";
const launchOptions = existsSync(sandboxChromium) ? { executablePath: sandboxChromium } : {};

// Accessibility checks only — no live Anthropic key needed. Everything
// exercised here (viewport, contrast, focus, dialog semantics, labels) is
// static UI structure that renders without a key; see tests/accessibility.spec.js.
export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5173/kelly-bot/",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev",
    url: "http://localhost:5173/kelly-bot/",
    reuseExistingServer: !process.env.CI,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"], launchOptions },
    },
  ],
});
