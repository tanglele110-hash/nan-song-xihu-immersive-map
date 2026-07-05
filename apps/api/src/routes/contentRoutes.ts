import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { extname } from "node:path";
import type { FastifyInstance } from "fastify";
import {
  getAppContent,
  getAssetById,
  getAssetsManifest,
  getColdKnowledgeSections,
  getContentReadiness,
  getInquiries,
  getMapPoints,
  getNotes,
  getScrollNodes,
  getScrollSegments,
  getSite,
  resolveWorkspacePath,
} from "../contentRepository.js";

const schemaVersion = "1";

function meta() {
  return {
    schemaVersion,
    generatedAt: new Date().toISOString(),
  };
}

function assetMimeType(path: string) {
  const ext = extname(path).toLowerCase();
  if (ext === ".png") return "image/png";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  if (ext === ".gif") return "image/gif";
  if (ext === ".zip") return "application/zip";
  return "application/octet-stream";
}

export function registerContentRoutes(app: FastifyInstance) {
  app.get("/api/v1/health", async () => ({
    data: { ok: true, uptimeSeconds: Math.round(process.uptime()) },
    meta: meta(),
  }));

  app.get("/api/v1/ready", async (request, reply) => {
    try {
      return {
        data: { ok: true, checks: await getContentReadiness() },
        meta: meta(),
      };
    } catch (error) {
      request.log.error({ err: error }, "readiness check failed");
      return reply.code(503).send({
        error: {
          code: "CONTENT_NOT_READY",
          message: "Content files are not ready to serve.",
          requestId: request.id,
        },
      });
    }
  });

  app.get("/api/v1/app-content", async () => ({
    data: await getAppContent(),
    meta: meta(),
  }));

  app.get("/api/v1/assets/manifest", async () => ({
    data: await getAssetsManifest(),
    meta: meta(),
  }));

  app.get("/api/v1/site", async () => ({
    data: await getSite(),
    meta: meta(),
  }));

  app.get<{ Params: { assetId: string } }>("/content-assets/:assetId", async (request, reply) => {
    const asset = await getAssetById(request.params.assetId);

    if (!asset || asset.publishStatus === "missing") {
      return reply.code(404).send({
        error: {
          code: "ASSET_NOT_FOUND",
          message: "Requested content asset is not available.",
          requestId: request.id,
        },
      });
    }

    const assetPath = resolveWorkspacePath(asset.src);
    const assetInfo = await stat(assetPath);

    reply.header("Cache-Control", "public, max-age=300");
    reply.header("Content-Length", assetInfo.size);
    return reply.type(assetMimeType(asset.src)).send(createReadStream(assetPath));
  });

  app.get("/api/v1/map-points", async () => ({
    data: await getMapPoints(),
    meta: meta(),
  }));

  app.get("/api/v1/scroll/segments", async () => ({
    data: await getScrollSegments(),
    meta: meta(),
  }));

  app.get("/api/v1/scroll/nodes", async () => ({
    data: await getScrollNodes(),
    meta: meta(),
  }));

  app.get("/api/v1/cold-knowledge/sections", async () => ({
    data: await getColdKnowledgeSections(),
    meta: meta(),
  }));

  app.get("/api/v1/notes", async () => ({
    data: await getNotes(),
    meta: meta(),
  }));

  app.get("/api/v1/inquiries", async () => ({
    data: await getInquiries(),
    meta: meta(),
  }));

  app.post("/api/v1/inquiries", async (request, reply) => {
    return reply.code(501).send({
      error: {
        code: "INQUIRY_SUBMISSION_NOT_ENABLED",
        message: "Inquiry submissions are planned for a later release.",
        requestId: request.id,
      },
    });
  });
}
