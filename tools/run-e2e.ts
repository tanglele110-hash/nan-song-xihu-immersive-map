import { spawn, spawnSync, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { setTimeout as delay } from "node:timers/promises";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const externalBaseUrl = process.env.E2E_BASE_URL?.trim();
const localWebPort = process.env.E2E_WEB_PORT?.trim() || "5478";
const localWebBaseUrl = `http://127.0.0.1:${localWebPort}`;

function normalizeBaseUrl(value: string) {
  return value.endsWith("/") ? value : `${value}/`;
}

function fromExternalBase(path: string) {
  if (!externalBaseUrl) {
    throw new Error("E2E_BASE_URL is not configured.");
  }

  return new URL(path, normalizeBaseUrl(externalBaseUrl)).toString();
}

function startProcess(name: string, args: string[]) {
  const child = spawn(process.execPath, args, {
    cwd: root,
    env: { ...process.env, FORCE_COLOR: "1" },
    stdio: ["ignore", "inherit", "inherit"],
    windowsHide: true,
  });

  child.once("exit", (code, signal) => {
    if (code !== null && code !== 0) {
      console.error(`[${name}] exited with code ${code}`);
    }
    if (signal) {
      console.error(`[${name}] exited with signal ${signal}`);
    }
  });

  return child;
}

async function waitForUrl(url: string, label: string) {
  const deadline = Date.now() + 30_000;
  let lastError: unknown;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2_000) });
      if (response.ok) return;
      lastError = new Error(`${label} responded ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await delay(250);
  }

  throw new Error(`Timed out waiting for ${label} at ${url}: ${String(lastError)}`);
}

async function isUrlAvailable(url: string) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(1_000) });
    return response.ok;
  } catch {
    return false;
  }
}

async function runPlaywright() {
  const child = spawn(
    process.execPath,
    ["node_modules/@playwright/test/cli.js", "test"],
    {
      cwd: root,
      env: { ...process.env, PW_SKIP_WEB_SERVER: "1", FORCE_COLOR: "1" },
      stdio: "inherit",
      windowsHide: true,
    },
  );
  const [code, signal] = (await once(child, "exit")) as [number | null, NodeJS.Signals | null];
  return code ?? (signal ? 1 : 0);
}

function stopProcess(child: ChildProcess) {
  if (!child.pid || child.exitCode !== null) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
    return;
  }

  child.kill("SIGTERM");
}

let api: ChildProcess | undefined;
let web: ChildProcess | undefined;

try {
  if (externalBaseUrl) {
    await waitForUrl(fromExternalBase("app/index.html"), "external web");
    process.exitCode = await runPlaywright();
  } else {
    if (!(await isUrlAvailable("http://127.0.0.1:4174/api/v1/health"))) {
      api = startProcess("api", ["node_modules/tsx/dist/cli.mjs", "apps/api/src/server.ts"]);
    }

    if (!(await isUrlAvailable(`${localWebBaseUrl}/app/index.html`))) {
      web = startProcess("web", [
        "apps/web/node_modules/vite/bin/vite.js",
        "--config",
        "apps/web/vite.config.ts",
        "--host",
        "127.0.0.1",
        "--port",
        localWebPort,
        "--strictPort",
      ]);
    }

    await waitForUrl("http://127.0.0.1:4174/api/v1/health", "api");
    await waitForUrl(`${localWebBaseUrl}/app/index.html`, "web");
    process.exitCode = await runPlaywright();
  }
} finally {
  if (web) stopProcess(web);
  if (api) stopProcess(api);
}

process.exit(process.exitCode ?? 0);
