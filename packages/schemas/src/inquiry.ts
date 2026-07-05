import { z } from "zod";

export const inquiryItemSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["question", "discussion", "clue", "correction", "task"]),
  title: z.string().min(1),
  status: z.string().min(1),
  related: z.string().min(1),
  content: z.string().min(1),
});

export const inquiriesSchema = z.array(inquiryItemSchema);

export const coldKnowledgeImageCardSchema = z.object({
  type: z.literal("image"),
  title: z.string().min(1),
  label: z.string().min(1),
  assetId: z.string().min(1),
  alt: z.string().min(1),
});

export const coldKnowledgePlaceholderCardSchema = z.object({
  type: z.literal("placeholder"),
  title: z.string().min(1),
  label: z.string().min(1),
  note: z.string().min(1),
});

export const coldKnowledgeCardSchema = z.discriminatedUnion("type", [
  coldKnowledgeImageCardSchema,
  coldKnowledgePlaceholderCardSchema,
]);

export const coldKnowledgeSectionSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().min(1),
  description: z.string().min(1),
  packDownloadAssetId: z.string().min(1).optional(),
  cards: z.array(coldKnowledgeCardSchema).min(1),
});

export const coldKnowledgeSectionsSchema = z.array(coldKnowledgeSectionSchema);

export type ColdKnowledgeImageCard = z.infer<typeof coldKnowledgeImageCardSchema>;
export type ColdKnowledgePlaceholderCard = z.infer<typeof coldKnowledgePlaceholderCardSchema>;
export type ColdKnowledgeCard = z.infer<typeof coldKnowledgeCardSchema>;
export type ColdKnowledgeSection = z.infer<typeof coldKnowledgeSectionSchema>;
export type InquiryItem = z.infer<typeof inquiryItemSchema>;
