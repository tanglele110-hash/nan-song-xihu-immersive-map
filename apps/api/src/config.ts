export type ApiServerConfig = {
  host: string;
  port: number;
  logLevel: string;
  contentCacheTtlMs: number;
  contentRoot?: string;
};

function readInteger(value: string | undefined, fallback: number) {
  if (!value) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

export function readApiServerConfig(env: NodeJS.ProcessEnv = process.env): ApiServerConfig {
  return {
    host: env.HOST || "127.0.0.1",
    port: readInteger(env.PORT, 4174),
    logLevel: env.LOG_LEVEL || "info",
    contentCacheTtlMs: readInteger(env.CONTENT_CACHE_TTL_MS, 1000),
    contentRoot: env.CONTENT_ROOT,
  };
}
