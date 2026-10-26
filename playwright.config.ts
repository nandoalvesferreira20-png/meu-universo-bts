import { defineConfig } from "@playwright/test";

const npm = process.platform === "win32" ? "npm.cmd" : "npm";
export default defineConfig({
  testDir: "./tests/browser",
  timeout: 60_000,
  expect: { timeout: 10_000 },
  workers: 1,
  outputDir: "test-artifacts/browser",
  reporter: [
    ["list"],
    [
      "html",
      { outputFolder: "test-artifacts/playwright-report", open: "never" },
    ],
  ],
  use: {
    baseURL: "http://localhost:3100",
    channel: process.platform === "win32" ? "msedge" : undefined,
    headless: true,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { viewport: { width: 1440, height: 900 } } },
    {
      name: "tablet",
      use: { viewport: { width: 768, height: 1024 }, hasTouch: true },
    },
    {
      name: "mobile",
      use: {
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],
  webServer: {
    command: `${npm} run build && ${npm} run start -- --port 3100`,
    url: "http://localhost:3100/army-pass",
    reuseExistingServer: false,
    timeout: 120_000,
  },
});
