import { z } from "zod";

const baseSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  totalQuantity: z.coerce.number().positive("Informe a quantidade")
});

export const stockMovementSchema = z.discriminatedUnion("type", [
  baseSchema.extend({
    type: z.literal("ENTRY"),
    direction: z.enum(["INCREASE", "DECREASE"]).nullable().optional(),
    reason: z.string().optional(),
  }),
  baseSchema.extend({
    type: z.literal("EXIT"),
    direction: z.enum(["INCREASE", "DECREASE"]).nullable().optional(),
    reason: z.string().optional(),
  }),
  baseSchema.extend({
    type: z.literal("DISPOSAL"),
    direction: z.enum(["INCREASE", "DECREASE"]).nullable().optional(),
    reason: z.string().trim().min(1, "Informe o motivo do descarte"),
  }),
  baseSchema.extend({
    type: z.literal("ADJUSTMENT"),
    direction: z.enum(["INCREASE", "DECREASE"]),
    reason: z.string().trim().min(1, "Informe o motivo do ajuste"),
  }),
]);

export type StockMovementFormData = z.input<typeof stockMovementSchema>;