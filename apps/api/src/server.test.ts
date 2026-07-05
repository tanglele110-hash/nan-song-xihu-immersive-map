import { describe, expect, it } from "vitest";
import type { ApiServerConfig } from "./config";
import { buildServer } from "./server";

const testConfig: ApiServerConfig = {
  host: "127.0.0.1",
  port: 0,
  logLevel: "silent",
  contentCacheTtlMs: 0,
};

function buildTestServer() {
  return buildServer(testConfig);
}

describe("api server", () => {
  it("serves health", async () => {
    const app = buildTestServer();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/health",
      headers: { "x-request-id": "test-health" },
    });

    expect(response.statusCode).toBe(200);
    expect(response.headers["x-request-id"]).toBe("test-health");
    expect(response.json().data.ok).toBe(true);
  });

  it("reports readiness from content files", async () => {
    const app = buildTestServer();
    const response = await app.inject({ method: "GET", url: "/api/v1/ready" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data.ok).toBe(true);
    expect(body.data.checks).toEqual(
      expect.objectContaining({
        assets: 54,
        mapPoints: 6,
        scrollSegments: 3,
        scrollNodes: 18,
        notes: 5,
        inquiries: 3,
      })
    );
  });

  it("returns a structured request id for missing routes", async () => {
    const app = buildTestServer();
    const response = await app.inject({
      method: "GET",
      url: "/api/v1/missing",
      headers: { "x-request-id": "missing-route" },
    });

    expect(response.statusCode).toBe(404);
    expect(response.json().error).toEqual({
      code: "ROUTE_NOT_FOUND",
      message: "Requested route does not exist.",
      requestId: "missing-route",
    });
  });

  it("serves legacy app content for the optional frontend API bridge", async () => {
    const app = buildTestServer();
    const response = await app.inject({ method: "GET", url: "/api/v1/app-content" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data.siteNavigation).toHaveLength(4);
    expect(body.data.scrollSegments).toHaveLength(3);
    expect(body.data.scrollSegments[0].src).toMatch(/^\.\/assets\/scroll\//);
    expect(body.data.scrollPanoramaNodes.length).toBeGreaterThan(10);
    expect(body.data.coldKnowledgeSections[0].cards[0].src).toMatch(/^\.\/assets\/cold-knowledge\//);
    expect(body.data.inquiries).toHaveLength(3);
  });

  it("keeps inquiry submissions disabled for MVP", async () => {
    const app = buildTestServer();
    const response = await app.inject({
      method: "POST",
      url: "/api/v1/inquiries",
      headers: { "x-request-id": "submit-disabled" },
    });

    expect(response.statusCode).toBe(501);
    expect(response.json().error.code).toBe("INQUIRY_SUBMISSION_NOT_ENABLED");
    expect(response.json().error.requestId).toBe("submit-disabled");
  });

  it("serves the extracted asset manifest", async () => {
    const app = buildTestServer();
    const response = await app.inject({ method: "GET", url: "/api/v1/assets/manifest" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "landing-bg", kind: "image" }),
        expect.objectContaining({ id: "map-overview-bg", kind: "image" }),
        expect.objectContaining({ id: "cold-hushan-sui-shi-zip", kind: "zip" }),
      ])
    );
  });

  it("serves site metadata and navigation", async () => {
    const app = buildTestServer();
    const response = await app.inject({ method: "GET", url: "/api/v1/site" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data.mvpDeviceScope).toBe("desktop-web");
    expect(body.data.navigation).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: "map", href: "/map" }),
        expect.objectContaining({ id: "inquiry", href: "/inquiry" }),
      ])
    );
  });

  it("serves content assets by manifest id", async () => {
    const app = buildTestServer();
    const response = await app.inject({ method: "GET", url: "/content-assets/landing-bg" });

    expect(response.statusCode).toBe(200);
    expect(response.headers["content-type"]).toContain("image/png");
  });

  it("serves map points with open node targets", async () => {
    const app = buildTestServer();
    const response = await app.inject({ method: "GET", url: "/api/v1/map-points" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data).toHaveLength(6);
    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "map-duanqiao",
          status: "open",
          scrollTarget: "duanqiao",
        }),
      ])
    );
  });

  it("serves scroll nodes and cold knowledge sections", async () => {
    const app = buildTestServer();
    const nodesResponse = await app.inject({ method: "GET", url: "/api/v1/scroll/nodes" });
    const coldResponse = await app.inject({ method: "GET", url: "/api/v1/cold-knowledge/sections" });

    expect(nodesResponse.statusCode).toBe(200);
    expect(nodesResponse.json().data.length).toBeGreaterThan(10);
    expect(coldResponse.statusCode).toBe(200);
    expect(coldResponse.json().data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "hushan-sui-shi",
          packDownloadAssetId: "cold-hushan-sui-shi-zip",
        }),
      ])
    );
  });

  it("serves notes from extracted content", async () => {
    const app = buildTestServer();
    const response = await app.inject({ method: "GET", url: "/api/v1/notes" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "note-entry-map",
          relatedNode: "duanqiao",
        }),
      ])
    );
  });

  it("serves static inquiry examples for the future community workflow", async () => {
    const app = buildTestServer();
    const response = await app.inject({ method: "GET", url: "/api/v1/inquiries" });
    const body = response.json();

    expect(response.statusCode).toBe(200);
    expect(body.data).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "inq-001",
          type: "question",
        }),
      ])
    );
  });
});
