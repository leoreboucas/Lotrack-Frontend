// exit/schema.ts
import { z } from "zod";

export const exitSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  quantity: z.coerce.number().positive("Quantidade deve ser maior que zero"),
});

export type ExitFormData = z.input<typeof exitSchema>;