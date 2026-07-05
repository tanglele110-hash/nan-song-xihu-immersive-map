import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), "../../..");

function readWorkspaceFile(path: string) {
  return readFileSync(resolve(workspaceRoot, path), "utf8");
}

describe("web wrapper boundary", () => {
  it("keeps the confirmed app demo as the runtime entry", () => {
    const appHtml = readWorkspaceFile("app/index.html");
    const viteConfig = readWorkspaceFile("apps/web/vite.config.ts");
    const contentScriptIndex = appHtml.indexOf("./content-data.js");
    const apiBridgeScriptIndex = appHtml.indexOf("./app-api.js");
    const mainScriptIndex = appHtml.indexOf('data-main="./main.js');

    expect(contentScriptIndex).toBeGreaterThan(-1);
    expect(apiBridgeScriptIndex).toBeGreaterThan(contentScriptIndex);
    expect(mainScriptIndex).toBeGreaterThan(apiBridgeScriptIndex);
    expect(appHtml).toContain('<script src="./app-api.js?v=api-bridge" data-main="./main.js?v=juanzhong-weishi-4cards"></script>');
    expect(viteConfig).toContain('"app-api.js"');
    expect(viteConfig).toContain('resolve(packageRoot, "dist/index.html")');
    expect(viteConfig).toContain('input: resolve(workspaceRoot, "app/index.html")');
    expect(existsSync(resolve(workspaceRoot, "apps/web/src"))).toBe(false);
    expect(existsSync(resolve(workspaceRoot, "app/content-data.js"))).toBe(true);
    expect(existsSync(resolve(workspaceRoot, "app/assets"))).toBe(true);
  });

  it("does not ship React dependencies in the current MVP wrapper", () => {
    const packageJson = JSON.parse(readWorkspaceFile("apps/web/package.json")) as {
      dependencies?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    const dependencyNames = [
      ...Object.keys(packageJson.dependencies ?? {}),
      ...Object.keys(packageJson.devDependencies ?? {}),
    ];

    expect(dependencyNames).not.toContain("react");
    expect(dependencyNames).not.toContain("react-dom");
    expect(dependencyNames).not.toContain("@vitejs/plugin-react");
  });
});
