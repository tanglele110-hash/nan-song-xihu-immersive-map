import { z } from "zod";

export const siteNavigationItemSchema = z.object({
  id: z.enum(["map", "scroll", "notes", "inquiry"]),
  label: z.string().min(1),
  href: z.string().min(1),
});

export const siteSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().min(1),
  mvpDeviceScope: z.literal("desktop-web"),
  navigation: z.array(siteNavigationItemSchema).min(1),
});

export type Site = z.infer<typeof siteSchema>;
