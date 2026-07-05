import { describe, expect, it } from "vitest";
import { assetSchema } from "./assets";
import { coldKnowledgeSectionSchema, inquiryItemSchema } from "./inquiry";
import { mapPointSchema } from "./map";
import { noteSchema } from "./notes";
import { scrollNodeSchema } from "./scroll";
import { siteSchema } from "./site";

describe("mapPointSchema", () => {
  it("rejects coordinates outside 0..1", () => {
    const result = mapPointSchema.safeParse({
      id: "bad-point",
      label: "坏坐标",
      region: "西湖北岸",
      status: "open",
      targetType: "node",
      scrollTarget: "duanqiao",
      sourceStatus: "待考证",
      summary: "坐标越界示例",
      position: { x: 1.5, y: 0.2 },
    });

    expect(result.success).toBe(false);
  });

  it("accepts an open map point with a node target", () => {
    const result = mapPointSchema.safeParse({
      id: "map-duanqiao",
      label: "断桥入口",
      region: "西湖北岸",
      status: "open",
      targetType: "node",
      scrollTarget: "duanqiao",
      sourceStatus: "较可信",
      summary: "从湖东桥路入北岸，进入断桥一带的长卷观察。",
      position: { x: 0.82, y: 0.58 },
    });

    expect(result.success).toBe(true);
  });
});

describe("scrollNodeSchema", () => {
  it("rejects a node card without sections", () => {
    const result = scrollNodeSchema.safeParse({
      id: "duanqiao",
      title: "断桥",
      category: "桥梁",
      segmentId: "volume-dashifo-yuan",
      x: 0.2,
      y: 0.4,
      width: 0.04,
      height: 0.18,
      sourceStatus: "较可信",
      summary: "北岸入卷处的桥路节点。",
      card: {
        markerLabel: "断桥",
        pinyin: "DUAN QIAO",
        status: "南宋 · 西湖桥梁",
        intro: ["南宋西湖北岸"],
        seal: "桥",
        sections: [],
      },
    });

    expect(result.success).toBe(false);
  });
});

describe("coldKnowledgeSectionSchema", () => {
  it("keeps image and placeholder cards in one discriminated union", () => {
    const result = coldKnowledgeSectionSchema.safeParse({
      id: "hushan-sui-shi",
      title: "湖山岁时",
      subtitle: "节气习俗",
      description: "从岁时令节进入南宋临安的湖山风物。",
      packDownloadAssetId: "cold-hushan-zip",
      cards: [
        {
          type: "image",
          title: "湖山岁时 01",
          label: "01",
          assetId: "cold-hushan-01",
          alt: "湖山岁时第 01 张冷识卡片",
        },
        {
          type: "placeholder",
          title: "桥梁题名",
          label: "01",
          note: "待补冷识卡片",
        },
      ],
    });

    expect(result.success).toBe(true);
  });
});

describe("assetSchema", () => {
  it("allows zip assets without image dimensions", () => {
    const result = assetSchema.safeParse({
      id: "cold-hushan-sui-shi-zip",
      src: "exports/西湖繁胜冷识集-湖山岁时-24张.zip",
      kind: "zip",
      publishStatus: "public",
      source: "legacy cold knowledge export",
      sizeBytes: 1024,
    });

    expect(result.success).toBe(true);
  });
});

describe("siteSchema", () => {
  it("accepts desktop Web site navigation", () => {
    const result = siteSchema.safeParse({
      title: "West Lake Panorama",
      subtitle: "Digital Scroll",
      mvpDeviceScope: "desktop-web",
      navigation: [
        { id: "map", label: "Map", href: "/map" },
        { id: "scroll", label: "Scroll", href: "/scroll" },
        { id: "notes", label: "Notes", href: "/notes" },
        { id: "inquiry", label: "Inquiry", href: "/inquiry" },
      ],
    });

    expect(result.success).toBe(true);
  });
});

describe("noteSchema", () => {
  it("accepts an extracted note record", () => {
    const result = noteSchema.safeParse({
      id: "note-entry-map",
      category: "画作概览",
      title: "从卷首到鸟瞰入口",
      status: "创作性解读",
      relatedNode: "duanqiao",
      summary: "帮助用户先建立观看仪式和方位感。",
      source: "项目设计说明，待补外部史料。",
    });

    expect(result.success).toBe(true);
  });
});

describe("inquiryItemSchema", () => {
  it("accepts a static inquiry item", () => {
    const result = inquiryItemSchema.safeParse({
      id: "inq-001",
      type: "question",
      title: "Static inquiry example",
      status: "pending",
      related: "global",
      content: "This item keeps the future community workflow typed.",
    });

    expect(result.success).toBe(true);
  });
});
