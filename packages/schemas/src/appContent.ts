import type { Asset } from "./assets.js";
import type { ColdKnowledgeSection } from "./inquiry.js";
import type { MapPoint } from "./map.js";
import type { Note } from "./notes.js";
import type { ScrollNode, ScrollSegment } from "./scroll.js";
import type { Site } from "./site.js";

export type AppContentSource = {
  assets: Asset[];
  coldKnowledgeSections: ColdKnowledgeSection[];
  inquiries: unknown[];
  mapPoints: MapPoint[];
  notes: Note[];
  scrollNodes: ScrollNode[];
  scrollSegments: ScrollSegment[];
  siteNavigation: Site["navigation"];
};

function browserAssetPath(asset: Asset) {
  const src = asset.src.replace(/\\/g, "/");

  if (src.startsWith("app/")) {
    return `./${src.slice("app/".length)}`;
  }
  return `../${src}`;
}

function basename(path: string) {
  return path.replace(/\\/g, "/").split("/").pop() || path;
}

export function buildAppContent(source: AppContentSource) {
  const assetById = new Map(source.assets.map((asset) => [asset.id, asset]));

  function assetFor(assetId: string) {
    const asset = assetById.get(assetId);
    if (!asset) {
      throw new Error(`Missing asset: ${assetId}`);
    }
    return asset;
  }

  const scrollSegments = source.scrollSegments.map((segment) => {
    const asset = assetFor(segment.imageAssetId);

    return {
      id: segment.id,
      title: segment.title,
      src: browserAssetPath(asset),
      image: basename(asset.src),
      width: segment.width,
      height: segment.height,
      ...(segment.cropLeft === undefined ? {} : { cropLeft: segment.cropLeft }),
      ...(segment.cropRight === undefined ? {} : { cropRight: segment.cropRight }),
      ...(segment.aliases === undefined ? {} : { aliases: segment.aliases }),
    };
  });

  const scrollPanoramaNodes = source.scrollNodes.map((node) => ({
    id: node.id,
    title: node.title,
    category: node.category,
    sourceStatus: node.sourceStatus,
    position: {
      x: node.x + node.width / 2,
      y: node.y + node.height / 2,
    },
    subtitle: node.card.pinyin,
    summary: node.summary,
    source: "content/scroll-nodes.json",
    noteId: "note-north-bank",
    hit: {
      x: node.x,
      y: node.y,
      width: node.width,
      height: node.height,
    },
    segmentId: node.segmentId,
    card: node.card,
    markerLabel: node.card.markerLabel || node.title,
  }));

  const coldKnowledgeSections = source.coldKnowledgeSections.map((section) => ({
    id: section.id,
    title: section.title,
    subtitle: section.subtitle,
    description: section.description,
    ...(section.packDownloadAssetId
      ? { packDownload: browserAssetPath(assetFor(section.packDownloadAssetId)) }
      : {}),
    cards: section.cards.map((card) => {
      if (card.type === "placeholder") {
        return card;
      }

      const asset = assetFor(card.assetId);
      if (asset.kind !== "image") {
        throw new Error(`Cold knowledge card asset must be an image: ${card.assetId}`);
      }

      return {
        type: "image" as const,
        title: card.title,
        label: card.label,
        src: browserAssetPath(asset),
        width: asset.width,
        height: asset.height,
        alt: card.alt,
        downloadName: `${section.title}-${card.label}.png`,
      };
    }),
  }));

  return {
    siteNavigation: source.siteNavigation,
    scrollSegments,
    scrollPanoramaNodes,
    coldKnowledgeSections,
    mapPoints: source.mapPoints,
    notes: source.notes,
    inquiries: source.inquiries,
  };
}

export type AppContent = ReturnType<typeof buildAppContent>;
