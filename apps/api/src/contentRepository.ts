import { existsSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  buildAppContent,
  type Asset,
  assetsManifestSchema,
  coldKnowledgeSectionsSchema,
  inquiriesSchema,
  mapPointsSchema,
  notesSchema,
  scrollNodesSchema,
  scrollSegmentsSchema,
  siteSchema,
} from "../../../packages/schemas/src/index.js";

const apiDir = dirname(fileURLToPath(import.meta.url));
let workspaceRoot = findContentRoot();
const contentCache = new Map<string, { expiresAt: number; value: unknown }>();
let contentCacheTtlMs = 1000;

function hasContentRoot(path: string) {
  return existsSync(resolve(path, "content/assets-manifest.json"));
}

function findContentRoot() {
  if (process.env.CONTENT_ROOT) {
    return resolve(process.env.CONTENT_ROOT);
  }

  for (const start of [process.cwd(), apiDir]) {
    let candidate = resolve(start);
    for (let depth = 0; depth < 8; depth += 1) {
      if (hasContentRoot(candidate)) return candidate;
      const parent = resolve(candidate, "..");
      if (parent === candidate) break;
      candidate = parent;
    }
  }

  return resolve(process.cwd());
}

export function configureContentRepository(options: { cacheTtlMs?: number; contentRoot?: string }) {
  workspaceRoot = options.contentRoot ? resolve(options.contentRoot) : findContentRoot();
  contentCacheTtlMs = Math.max(0, options.cacheTtlMs ?? contentCacheTtlMs);
  contentCache.clear();
}

async function readJson(file: string): Promise<unknown> {
  const cached = contentCache.get(file);
  const now = Date.now();

  if (cached && cached.expiresAt > now) {
    return cached.value;
  }

  const raw = await readFile(resolve(workspaceRoot, file), "utf8");
  const value = JSON.parse(raw.replace(/^\uFEFF/, ""));

  if (contentCacheTtlMs > 0) {
    contentCache.set(file, { expiresAt: now + contentCacheTtlMs, value });
  }

  return value;
}

export async function getAssetsManifest() {
  return assetsManifestSchema.parse(await readJson("content/assets-manifest.json"));
}

export async function getSite() {
  return siteSchema.parse(await readJson("content/site.json"));
}

export async function getAssetById(assetId: string): Promise<Asset | null> {
  const assets = await getAssetsManifest();
  return assets.find((asset) => asset.id === assetId) ?? null;
}

export function resolveWorkspacePath(path: string) {
  const resolved = resolve(workspaceRoot, path);
  const relativePath = relative(workspaceRoot, resolved);

  if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
    throw new Error(`Path escapes workspace root: ${path}`);
  }

  return resolved;
}

export async function getAppContent() {
  return buildAppContent({
    assets: await getAssetsManifest(),
    coldKnowledgeSections: await getColdKnowledgeSections(),
    inquiries: await getInquiries(),
    mapPoints: await getMapPoints(),
    notes: await getNotes(),
    scrollNodes: await getScrollNodes(),
    scrollSegments: await getScrollSegments(),
    siteNavigation: (await getSite()).navigation,
  });
}

export async function getContentReadiness() {
  const [assets, site, mapPoints, scrollSegments, scrollNodes, coldKnowledgeSections, notes, inquiries] =
    await Promise.all([
      getAssetsManifest(),
      getSite(),
      getMapPoints(),
      getScrollSegments(),
      getScrollNodes(),
      getColdKnowledgeSections(),
      getNotes(),
      getInquiries(),
    ]);

  return {
    assets: assets.length,
    siteNavigation: site.navigation.length,
    mapPoints: mapPoints.length,
    scrollSegments: scrollSegments.length,
    scrollNodes: scrollNodes.length,
    coldKnowledgeSections: coldKnowledgeSections.length,
    notes: notes.length,
    inquiries: inquiries.length,
  };
}

export async function getMapPoints() {
  return mapPointsSchema.parse(await readJson("content/map-points.json"));
}

export async function getScrollSegments() {
  return scrollSegmentsSchema.parse(await readJson("content/scroll-segments.json"));
}

export async function getScrollNodes() {
  return scrollNodesSchema.parse(await readJson("content/scroll-nodes.json"));
}

export async function getColdKnowledgeSections() {
  return coldKnowledgeSectionsSchema.parse(await readJson("content/cold-knowledge.json"));
}

export async function getNotes() {
  return notesSchema.parse(await readJson("content/notes.json"));
}

export async function getInquiries() {
  return inquiriesSchema.parse(await readJson("content/inquiries.json"));
}
