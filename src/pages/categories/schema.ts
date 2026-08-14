import { z } from "zod";
import { i18nProvider } from "@/providers/i18nProvider";

export const categorySchema = z.object({
  name: z.string().min(1, i18nProvider.t("categories.nameRequired")),
  description: z.string().optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
