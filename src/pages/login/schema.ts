import { z } from "zod";
import { i18nProvider } from "@/providers/i18nProvider";

export const loginSchema = z.object({
  email: z.string().email(i18nProvider.t("login.invalidEmail")),
  password: z.string().min(1, i18nProvider.t("login.passwordRequired")),
});

export type LoginFormData = z.infer<typeof loginSchema>;
