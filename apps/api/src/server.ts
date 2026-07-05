import Fastify from "fastify";
import { randomUUID } from "node:crypto";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { configureContentRepository } from "./contentRepository.js";
import { type ApiServerConfig, readApiServerConfig } from "./config.js";
import { registerContentRoutes } from "./routes/contentRoutes.js";

function requestIdFromHeader(header: string | string[] | undefined) {
  if (Array.isArray(header)) return header[0] || randomUUID();
  return header || randomUUID();
}

function errorResponse(code: string, message: string, requestId: string) {
  return {
    error: {
      code,
      message,
      requestId,
    },
  };
}

export function buildServer(config: ApiServerConfig = readApiServerConfig()) {
  configureContentRepository({
    cacheTtlMs: config.contentCacheTtlMs,
    contentRoot: config.contentRoot,
  });

  const app = Fastify({
    logger: { level: config.logLevel },
    genReqId: (request) => requestIdFromHeader(request.headers["x-request-id"]),
  });

  app.addHook("onRequest", async (request, reply) => {
    reply.header("X-Request-Id", request.id);
  });

  app.setNotFoundHandler(async (request, reply) => {
    return reply
      .code(404)
      .send(errorResponse("ROUTE_NOT_FOUND", "Requested route does not exist.", request.id));
  });

  app.setErrorHandler((error, request, reply) => {
    const candidateStatusCode =
      typeof error === "object" && error !== null && "statusCode" in error
        ? Number((error as { statusCode?: unknown }).statusCode)
        : 500;
    const statusCode = candidateStatusCode >= 400 ? candidateStatusCode : 500;
    const isServerError = statusCode >= 500;
    const message = error instanceof Error ? error.message : "Request failed.";

    request.log.error({ err: error }, "request failed");
    reply.code(statusCode).send(
      errorResponse(
        isServerError ? "INTERNAL_SERVER_ERROR" : "REQUEST_FAILED",
        isServerError ? "Unexpected server error." : message,
        request.id
      )
    );
  });

  registerContentRoutes(app);
  return app;
}

const isDirectRun = process.argv[1]
  ? resolve(process.argv[1]) === fileURLToPath(import.meta.url)
  : false;

if (isDirectRun) {
  startServer().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}

async function startServer() {
  const config = readApiServerConfig();
  const app = buildServer(config);
  await app.listen({ host: config.host, port: config.port });
}
