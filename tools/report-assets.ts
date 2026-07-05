import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import {
  assetsManifestSchema,
  scrollSegmentsSchema,
} from "../packages/schemas/src/index.js";

type FileRecord = {
  path: string;
  bytes: number;
  ext: string;
  group: string;
};

const shouldWrite = process.argv.includes("--write");
const outputPath = resolve("docs/02_execution/asset-optimization-report.md");

function readJson(path: string) {
  return JSON.parse(readFileSync(resolve(path), "utf8").replace(/^\uFEFF/, ""));
}

function walkFiles(dir: string, root = dir): FileRecord[] {
  const files: FileRecord[] = [];

  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...walkFiles(path, root));
    } else if (entry.isFile()) {
      const rel = relative(root, path).replace(/\\/g, "/");
      files.push({
        path: rel,
        bytes: statSync(path).size,
        ext: extname(path).toLowerCase() || "(none)",
        group: rel.split("/")[0] || "(root)",
      });
    }
  }

  return files;
}

function formatBytes(bytes: number) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(2)} KB`;
  return `${bytes} B`;
}

function sumBy(files: FileRecord[], key: "ext" | "group") {
  const totals = new Map<string, { count: number; bytes: number }>();
  for (const file of files) {
    const current = totals.get(file[key]) || { count: 0, bytes: 0 };
    current.count += 1;
    current.bytes += file.bytes;
    totals.set(file[key], current);
  }
  return [...totals.entries()].sort((a, b) => b[1].bytes - a[1].bytes);
}

function markdownTable(headers: string[], rows: string[][]) {
  return [
    `| ${headers.join(" | ")} |`,
    `| ${headers.map(() => "---").join(" | ")} |`,
    ...rows.map((row) => `| ${row.join(" | ")} |`),
  ].join("\n");
}

const assetsDir = resolve("app/assets");
if (!existsSync(assetsDir)) {
  throw new Error("Missing app/assets. Run the frontend asset sync before reporting.");
}

const manifest = assetsManifestSchema.parse(readJson("content/assets-manifest.json"));
const scrollSegments = scrollSegmentsSchema.parse(readJson("content/scroll-segments.json"));
const files = walkFiles(assetsDir);
const totalBytes = files.reduce((sum, file) => sum + file.bytes, 0);
const largestFiles = [...files].sort((a, b) => b.bytes - a.bytes).slice(0, 12);
const tileSize = 1024;
const tileLevels = [1, 0.5, 0.25];

const tilePlan = scrollSegments.map((segment) => {
  const levels = tileLevels.map((scale) => {
    const width = Math.ceil(segment.width * scale);
    const height = Math.ceil(segment.height * scale);
    const columns = Math.ceil(width / tileSize);
    const rows = Math.ceil(height / tileSize);
    return {
      scale,
      width,
      height,
      columns,
      rows,
      tiles: columns * rows,
    };
  });

  return {
    id: segment.id,
    title: segment.title,
    sourceSize: `${segment.width}x${segment.height}`,
    tiles: levels.reduce((sum, level) => sum + level.tiles, 0),
    levels,
  };
});

const report = `# Asset Optimization Report

Updated: 2026-07-04

## Summary

- Manifest assets: ${manifest.length}
- Published files in \`app/assets\`: ${files.length}
- Published asset size: ${formatBytes(totalBytes)}
- Proposed scroll tile size: ${tileSize}px
- Proposed scroll tile levels: ${tileLevels.map((level) => `${Math.round(level * 100)}%`).join(", ")}

## Size By Group

${markdownTable(
  ["Group", "Files", "Size"],
  sumBy(files, "group").map(([group, value]) => [group, String(value.count), formatBytes(value.bytes)])
)}

## Size By Extension

${markdownTable(
  ["Extension", "Files", "Size"],
  sumBy(files, "ext").map(([ext, value]) => [ext, String(value.count), formatBytes(value.bytes)])
)}

## Largest Files

${markdownTable(
  ["File", "Size"],
  largestFiles.map((file) => [file.path, formatBytes(file.bytes)])
)}

## Scroll Tile Plan

${markdownTable(
  ["Segment", "Source", "Levels", "Tiles"],
  tilePlan.map((segment) => [
    segment.id,
    segment.sourceSize,
    segment.levels.map((level) => `${Math.round(level.scale * 100)}%:${level.columns}x${level.rows}`).join("<br>"),
    String(segment.tiles),
  ])
)}

## Recommendations

- First priority: create WebP or AVIF derivatives for the three scroll JPG files and keep JPG as fallback.
- Second priority: generate 1024px scroll tiles at 100%, 50%, and 25% levels. This makes the scroll view eligible for lazy loading instead of loading three full-width JPG files up front.
- Third priority: recompress cold-knowledge PNG cards or create WebP derivatives while keeping the original PNG cards available for download packs.
- Keep the confirmed \`app/index.html\` presentation unchanged until the tiled renderer has its own E2E coverage.
`;

if (shouldWrite) {
  mkdirSync(dirname(outputPath), { recursive: true });
  writeFileSync(outputPath, report, "utf8");
  console.log(`wrote ${relative(process.cwd(), outputPath)}`);
} else {
  console.log(report);
}
