import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";
import { spawnSync } from "node:child_process";
import {
  assetsManifestSchema,
  scrollSegmentsSchema,
} from "../packages/schemas/src/index.js";

type TileJob = {
  source: string;
  output: string;
  scaledWidth: number;
  scaledHeight: number;
  x: number;
  y: number;
  width: number;
  height: number;
};

const shouldWrite = process.argv.includes("--write");
const tileSize = readNumberArg("--tile-size", 1024);
const quality = readNumberArg("--quality", 82);
const outputRoot = readStringArg("--out", "data/processed/tiles/scroll");
const levels = readStringArg("--levels", "1,0.5,0.25")
  .split(",")
  .map((value) => Number(value.trim()))
  .filter((value) => Number.isFinite(value) && value > 0 && value <= 1);

function readNumberArg(name: string, fallback: number) {
  const raw = readStringArg(name, "");
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function readStringArg(name: string, fallback: string) {
  const prefix = `${name}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : fallback;
}

function readJson(path: string) {
  return JSON.parse(readFileSync(resolve(path), "utf8").replace(/^\uFEFF/, ""));
}

function runFfmpeg(job: TileJob) {
  mkdirSync(dirname(job.output), { recursive: true });

  const filter = `scale=${job.scaledWidth}:${job.scaledHeight}:flags=lanczos,crop=${job.width}:${job.height}:${job.x}:${job.y}`;
  const result = spawnSync(
    "ffmpeg",
    [
      "-hide_banner",
      "-loglevel",
      "error",
      "-y",
      "-i",
      job.source,
      "-vf",
      filter,
      "-compression_level",
      "6",
      "-quality",
      String(quality),
      job.output,
    ],
    { stdio: "inherit" }
  );

  if (result.status !== 0) {
    throw new Error(`ffmpeg failed for ${job.output}`);
  }
}

const assets = assetsManifestSchema.parse(readJson("content/assets-manifest.json"));
const scrollSegments = scrollSegmentsSchema.parse(readJson("content/scroll-segments.json"));
const assetById = new Map(assets.map((asset) => [asset.id, asset]));
const jobs: TileJob[] = [];

for (const segment of scrollSegments) {
  const asset = assetById.get(segment.imageAssetId);
  if (!asset) throw new Error(`Missing asset ${segment.imageAssetId}`);

  const source = resolve(asset.src);
  if (!existsSync(source)) throw new Error(`Missing source image ${asset.src}`);

  for (const level of levels) {
    const scaledWidth = Math.ceil(segment.width * level);
    const scaledHeight = Math.ceil(segment.height * level);
    const columns = Math.ceil(scaledWidth / tileSize);
    const rows = Math.ceil(scaledHeight / tileSize);
    const levelName = `z${Math.round(level * 100)}`;

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const x = column * tileSize;
        const y = row * tileSize;
        jobs.push({
          source,
          output: resolve(outputRoot, segment.id, levelName, `${column}-${row}.webp`),
          scaledWidth,
          scaledHeight,
          x,
          y,
          width: Math.min(tileSize, scaledWidth - x),
          height: Math.min(tileSize, scaledHeight - y),
        });
      }
    }
  }
}

console.log(
  `${shouldWrite ? "Generating" : "Planned"} ${jobs.length} scroll tiles in ${relative(process.cwd(), resolve(outputRoot))}`
);

if (!shouldWrite) {
  console.log("Dry run only. Add --write to generate WebP tiles with ffmpeg.");
  process.exit(0);
}

const ffmpegCheck = spawnSync("ffmpeg", ["-version"], { stdio: "ignore" });
if (ffmpegCheck.status !== 0) {
  throw new Error("ffmpeg is required to generate tiles. Install ffmpeg or run without --write.");
}

for (const job of jobs) {
  runFfmpeg(job);
}
