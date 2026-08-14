// adjustment/schema.ts
import { z } from "zod";

export const adjustmentSchema = z.object({
  lotId: z.string().min(1, "Selecione um lote"),
  direction: z.enum(["INCREASE", "DECREASE"], { message: "Selecione a direção" }),
  quantity: z.coerce.number().positive("Quantidade deve ser maior que zero"),
  reason: z.string().min(1, "Informe o motivo"),
});

export type AdjustmentFormData = z.input<typeof adjustmentSchema>;