import { z } from "zod";

const baseAssetSchema = z.object({
  id: z.string().min(1),
  src: z.string().min(1),
  publishStatus: z.enum(["public", "internal", "missing"]),
  source: z.string().min(1),
});

export const imageAssetSchema = baseAssetSchema.extend({
  kind: z.literal("image"),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const zipAssetSchema = baseAssetSchema.extend({
  kind: z.literal("zip"),
  sizeBytes: z.number().int().nonnegative().optional(),
});

export const audioAssetSchema = baseAssetSchema.extend({
  kind: z.literal("audio"),
  sizeBytes: z.number().int().nonnegative().optional(),
  durationSeconds: z.number().positive().optional(),
});

export const assetSchema = z.discriminatedUnion("kind", [
  imageAssetSchema,
  zipAssetSchema,
  audioAssetSchema,
]);

export const assetsManifestSchema = z.array(assetSchema);

export type Asset = z.infer<typeof assetSchema>;
