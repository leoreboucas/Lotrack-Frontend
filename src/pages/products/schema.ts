import { z } from "zod";

export const productSchema = z.object({
  categoryId: z.string().min(1, "Selecione uma categoria"),
  name: z.string().min(1, "Informe o nome do produto"),
  sku: z.string().min(1, "Informe o SKU"),
  barcode: z.string().optional(),
  unitOfMeasure: z.string().min(1, "Informe a unidade de medida"),
  minimumStock: z.coerce.number().min(0, "O estoque mínimo não pode ser negativo"),
});

export type ProductFormData = z.infer<typeof productSchema>;
