import { z } from "zod";

export const sourceStatusSchema = z.enum(["已证实", "较可信", "待考证", "创作性推演"]);

export const normalizedPointSchema = z.object({
  x: z.number().min(0).max(1),
  y: z.number().min(0).max(1),
});

export const mapPointSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  region: z.string().min(1),
  status: z.enum(["open", "locked", "pending"]),
  targetType: z.enum(["region", "scrollX", "node"]),
  scrollTarget: z.string().min(1),
  sourceStatus: sourceStatusSchema,
  summary: z.string().min(1),
  position: normalizedPointSchema,
});

export const mapPointsSchema = z.array(mapPointSchema);

export type SourceStatus = z.infer<typeof sourceStatusSchema>;
export type NormalizedPoint = z.infer<typeof normalizedPointSchema>;
export type MapPoint = z.infer<typeof mapPointSchema>;
