import { mkdirSync, readdirSync, statSync } from "node:fs";
import { dirname, extname, join, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";

type ImageJob = {
  source: string;
  output: string;
  quality: number;
};

const sourceRoot = resolve("app/assets");
const outputRoot = resolve(sourceRoot, "optimized");
const sourceDirs = ["landing", "map", "header", "scroll", "cold-knowledge"];
const imageExtensions = new Set([".png", ".jpg", ".jpeg"]);

function collectImages(dir: string, jobs: ImageJob[]) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const entryPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      collectImages(entryPath, jobs);
      continue;
    }

    if (!entry.isFile()) continue;

    const extension = extname(entry.name).toLowerCase();
    if (!imageExtensions.has(extension)) continue;

    const assetRelativePath = relative(sourceRoot, entryPath);
    const outputRelativePath = assetRelativePath.replace(/\.(png|jpe?g)$/i, ".webp");
    jobs.push({
      source: entryPath,
      output: join(outputRoot, outputRelativePath),
      quality: assetRelativePath.startsWith(`scroll\\`) || assetRelativePath.startsWith("scroll/") ? 84 : 90,
    });
  }
}

function convertToWebp(job: ImageJob) {
  mkdirSync(dirname(job.output), { recursive: true });
  const result = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      job.source,
      "-frames:v",
      "1",
      "-map_metadata",
      "-1",
      "-c:v",
      "libwebp",
      "-quality",
      String(job.quality),
      "-compression_level",
      "6",
      job.output,
    ],
    { stdio: "inherit" }
  );

  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${relative(process.cwd(), job.source)}`);
  }
}

function formatBytes(bytes: number) {
  return `${(bytes / 1024 / 1024).toFixed(2)} MiB`;
}

const ffmpegCheck = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
if (ffmpegCheck.status !== 0) {
  throw new Error("ffmpeg is required to generate display derivatives.");
}

const jobs: ImageJob[] = [];
for (const dir of sourceDirs) {
  collectImages(resolve(sourceRoot, dir), jobs);
}

let originalBytes = 0;
let optimizedBytes = 0;

for (const job of jobs) {
  convertToWebp(job);
  originalBytes += statSync(job.source).size;
  optimizedBytes += statSync(job.output).size;
}

const savedBytes = originalBytes - optimizedBytes;
console.log(
  `Generated ${jobs.length} WebP display derivatives: ${formatBytes(originalBytes)} -> ${formatBytes(
    optimizedBytes
  )} (${formatBytes(savedBytes)} lighter).`
);
