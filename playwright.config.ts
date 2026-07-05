import { defineConfig } from "@playwright/test";

function normalizeBaseUrl(value: string) {
  const trimmed = value.trim();
  return trimmed.endsWith("/") ? trimmed : `${trimmed}/`;
}

const externalBaseUrl = process.env.E2E_BASE_URL;
const localWebPort = process.env.E2E_WEB_PORT || "5478";
const localWebBaseUrl = `http://127.0.0.1:${localWebPort}`;
const baseURL = normalizeBaseUrl(externalBaseUrl || localWebBaseUrl);
const useManagedWebServer = process.env.PW_SKIP_WEB_SERVER !== "1" && !externalBaseUrl;
const browserChannel = process.env.PLAYWRIGHT_CHANNEL || (process.env.CI ? undefined : "chrome");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  reporter: [["list"]],
  timeout: 45_000,
  expect: {
    timeout: 10_000,
  },
  use: {
    baseURL,
    ...(browserChannel ? { channel: browserChannel } : {}),
    trace: "on-first-retry",
  },
  webServer: useManagedWebServer
    ? [
        {
          command: "node node_modules/tsx/dist/cli.mjs apps/api/src/server.ts",
          url: "http://127.0.0.1:4174/api/v1/health",
          reuseExistingServer: true,
          timeout: 30_000,
        },
        {
          command:
            `node apps/web/node_modules/vite/bin/vite.js --config apps/web/vite.config.ts --host 127.0.0.1 --port ${localWebPort} --strictPort`,
          url: `${localWebBaseUrl}/app/index.html`,
          reuseExistingServer: true,
          timeout: 30_000,
        },
      ]
    : undefined,
  projects: [
    {
      name: "desktop-1440",
      use: {
        viewport: { width: 1440, height: 900 },
      },
    },
    {
      name: "desktop-1024",
      use: {
        viewport: { width: 1024, height: 768 },
      },
    },
  ],
});
