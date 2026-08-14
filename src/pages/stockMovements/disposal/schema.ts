// disposal/schema.ts
import { z } from "zod";

export const disposalSchema = z.object({
  lotId: z.string().min(1, "Selecione um lote"),
  quantity: z.coerce.number().positive("Quantidade deve ser maior que zero"),
  reason: z.string().min(1, "Motivo da baixa é obrigatório"),
});

export type DisposalFormData = z.input<typeof disposalSchema>;