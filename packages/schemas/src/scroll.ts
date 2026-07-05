import { z } from "zod";
import { sourceStatusSchema } from "./map.js";

export const scrollSegmentSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  imageAssetId: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  cropLeft: z.number().nonnegative().optional(),
  cropRight: z.number().nonnegative().optional(),
  aliases: z.array(z.string().min(1)).optional(),
});

export const nodeCardSectionSchema = z.tuple([z.string().min(1), z.string().min(1)]);

export const nodeCardSchema = z.object({
  markerLabel: z.string().min(1),
  pinyin: z.string().min(1),
  status: z.string().min(1),
  intro: z.array(z.string().min(1)).min(1),
  seal: z.string().min(1),
  sections: z.array(nodeCardSectionSchema).min(1),
});

export const scrollNodeSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  segmentId: z.string().min(1),
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
  width: z.number().min(0).max(1),
  height: z.number().min(0).max(1),
  sourceStatus: sourceStatusSchema,
  summary: z.string().min(1),
  card: nodeCardSchema,
});

export const scrollSegmentsSchema = z.array(scrollSegmentSchema);
export const scrollNodesSchema = z.array(scrollNodeSchema);

export type ScrollSegment = z.infer<typeof scrollSegmentSchema>;
export type NodeCard = z.infer<typeof nodeCardSchema>;
export type ScrollNode = z.infer<typeof scrollNodeSchema>;
