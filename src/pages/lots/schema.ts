import { z } from "zod";

export const lotSchema = z.object({
  productId: z.string().min(1, "Selecione um produto"),
  supplierId: z.string().min(1, "Selecione um fornecedor"),
  lotNumber: z.string().optional(),
  initialQuantity: z.coerce.number().positive("Informe a quantidade inicial"),
  currentQuantity: z.coerce.number().min(0, "O saldo atual não pode ser negativo"),
  unitCost: z.coerce.number().min(0, "O custo unitário não pode ser negativo"),
  expirationDate: z.string().min(1, "Informe a data de validade"),
});

export type LotFormData = z.infer<typeof lotSchema>;
