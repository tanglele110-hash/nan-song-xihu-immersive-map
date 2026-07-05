import { copyFileSync, mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const packageRoot = dirname(fileURLToPath(import.meta.url));
const workspaceRoot = resolve(packageRoot, "../..");
const legacyAppFiles = ["content-data.js", "app-api.js", "main.js"];

function copyDirectory(sourceDir: string, outputDir: string) {
  mkdirSync(outputDir, { recursive: true });
  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = join(sourceDir, entry.name);
    const outputPath = join(outputDir, entry.name);
    if (entry.isDirectory()) {
      copyDirectory(sourcePath, outputPath);
    } else if (entry.isFile()) {
      copyFileSync(sourcePath, outputPath);
    }
  }
}

function directoryStats(sourceDir: string) {
  let count = 0;
  let bytes = 0;

  for (const entry of readdirSync(sourceDir, { withFileTypes: true })) {
    const sourcePath = join(sourceDir, entry.name);
    if (entry.isDirectory()) {
      const child = directoryStats(sourcePath);
      count += child.count;
      bytes += child.bytes;
    } else if (entry.isFile()) {
      count += 1;
      bytes += statSync(sourcePath).size;
    }
  }

  return { count, bytes };
}

export default defineConfig({
  root: workspaceRoot,
  publicDir: false,
  plugins: [
    {
      name: "copy-legacy-demo-scripts",
      closeBundle() {
        copyFileSync(resolve(workspaceRoot, "index.html"), resolve(packageRoot, "dist/index.html"));

        const outputAppDir = resolve(packageRoot, "dist/app");
        mkdirSync(outputAppDir, { recursive: true });
        for (const file of legacyAppFiles) {
          copyFileSync(resolve(workspaceRoot, "app", file), resolve(outputAppDir, file));
        }
        const sourceAssetsDir = resolve(workspaceRoot, "app/assets");
        const outputAssetsDir = resolve(outputAppDir, "assets");
        copyDirectory(sourceAssetsDir, outputAssetsDir);

        const sourceStats = directoryStats(sourceAssetsDir);
        const outputStats = directoryStats(outputAssetsDir);
        if (sourceStats.count !== outputStats.count || sourceStats.bytes !== outputStats.bytes) {
          throw new Error(
            `Copied app assets are incomplete: source=${sourceStats.count}/${sourceStats.bytes}, output=${outputStats.count}/${outputStats.bytes}`
          );
        }
      },
    },
  ],
  server: {
    fs: {
      allow: [workspaceRoot],
    },
    proxy: {
      "/api": "http://127.0.0.1:4174",
      "/content-assets": "http://127.0.0.1:4174",
    },
  },
  build: {
    outDir: resolve(packageRoot, "dist"),
    emptyOutDir: true,
    rollupOptions: {
      input: resolve(workspaceRoot, "app/index.html"),
    },
  },
  test: {
    include: ["apps/web/test/**/*.test.ts"],
  },
});
