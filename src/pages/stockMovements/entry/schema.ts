import { z } from "zod";

export const entrySchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  supplierId: z.string().min(1, "Selecione um fornecedor"),
  lotNumber: z.string().optional(),
  quantity: z.coerce.number().positive("Quantidade deve ser maior que zero"),
  unitCost: z.coerce.number().min(0, "Custo não pode ser negativo"),
  expirationDate: z.string().min(1, "Informe a data de validade"),
});

export type EntryFormData = z.input<typeof entrySchema>;