import { z } from "zod";
import { sourceStatusSchema } from "./map.js";

export const noteStatusSchema = z.union([
  sourceStatusSchema,
  z.literal("创作性解读"),
]);

export const noteSchema = z.object({
  id: z.string().min(1),
  category: z.string().min(1),
  title: z.string().min(1),
  status: noteStatusSchema,
  relatedNode: z.string().min(1),
  summary: z.string().min(1),
  source: z.string().min(1),
});

export const notesSchema = z.array(noteSchema);

export type Note = z.infer<typeof noteSchema>;
