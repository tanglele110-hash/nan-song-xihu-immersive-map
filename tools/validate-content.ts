import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  assetsManifestSchema,
  coldKnowledgeSectionsSchema,
  inquiriesSchema,
  mapPointsSchema,
  notesSchema,
  scrollNodesSchema,
  scrollSegmentsSchema,
  siteSchema,
} from "../packages/schemas/src";

function readJson(path: string) {
  return JSON.parse(readFileSync(resolve(path), "utf8").replace(/^\uFEFF/, ""));
}

function assertUnique(ids: string[], label: string) {
  const seen = new Set<string>();
  for (const id of ids) {
    if (seen.has(id)) {
      throw new Error(`Duplicate ${label} id: ${id}`);
    }
    seen.add(id);
  }
}

const assets = assetsManifestSchema.parse(readJson("content/assets-manifest.json"));
const site = siteSchema.parse(readJson("content/site.json"));
const mapPoints = mapPointsSchema.parse(readJson("content/map-points.json"));
const scrollSegments = scrollSegmentsSchema.parse(readJson("content/scroll-segments.json"));
const scrollNodes = scrollNodesSchema.parse(readJson("content/scroll-nodes.json"));
const coldKnowledgeSections = coldKnowledgeSectionsSchema.parse(readJson("content/cold-knowledge.json"));
const inquiries = inquiriesSchema.parse(readJson("content/inquiries.json"));
const notes = notesSchema.parse(readJson("content/notes.json"));

const assetIds = new Set(assets.map((asset) => asset.id));
const segmentIds = new Set(scrollSegments.map((segment) => segment.id));
const segmentAliases = new Set(scrollSegments.flatMap((segment) => segment.aliases ?? []));
const nodeIds = new Set(scrollNodes.map((node) => node.id));

assertUnique(assets.map((asset) => asset.id), "asset");
assertUnique(site.navigation.map((item) => item.id), "site navigation");
assertUnique(mapPoints.map((point) => point.id), "map point");
assertUnique(scrollSegments.map((segment) => segment.id), "scroll segment");
assertUnique(scrollNodes.map((node) => node.id), "scroll node");
assertUnique(notes.map((note) => note.id), "note");
assertUnique(inquiries.map((inquiry) => inquiry.id), "inquiry");

for (const asset of assets) {
  if (asset.publishStatus !== "missing" && !existsSync(resolve(asset.src))) {
    throw new Error(`Asset file does not exist: ${asset.id} -> ${asset.src}`);
  }
}

for (const requiredAssetId of ["landing-bg", "map-overview-bg"]) {
  if (!assetIds.has(requiredAssetId)) {
    throw new Error(`Missing required asset: ${requiredAssetId}`);
  }
}

for (const segment of scrollSegments) {
  if (!assetIds.has(segment.imageAssetId)) {
    throw new Error(`Scroll segment references missing image asset: ${segment.id}`);
  }
}

for (const node of scrollNodes) {
  if (!segmentIds.has(node.segmentId) && !segmentAliases.has(node.segmentId)) {
    throw new Error(`Scroll node references missing segment: ${node.id} -> ${node.segmentId}`);
  }
}

for (const point of mapPoints) {
  if (point.status !== "open") continue;
  if (!nodeIds.has(point.scrollTarget) && !segmentIds.has(point.scrollTarget) && !segmentAliases.has(point.scrollTarget)) {
    throw new Error(`Open map point references missing target: ${point.id} -> ${point.scrollTarget}`);
  }
}

for (const section of coldKnowledgeSections) {
  if (section.packDownloadAssetId && !assetIds.has(section.packDownloadAssetId)) {
    throw new Error(`Cold knowledge section references missing pack: ${section.id}`);
  }
  for (const card of section.cards) {
    if (card.type === "image" && !assetIds.has(card.assetId)) {
      throw new Error(`Cold knowledge card references missing asset: ${section.id} -> ${card.assetId}`);
    }
  }
}

console.log(
  `content ok: ${mapPoints.length} map points, ${scrollSegments.length} scroll segments, ${scrollNodes.length} scroll nodes, ${notes.length} notes, ${inquiries.length} inquiries, ${coldKnowledgeSections.length} cold sections, ${assets.length} assets`
);
