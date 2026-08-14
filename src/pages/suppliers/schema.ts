import { z } from "zod";

export const supplierSchema = z.object({
  name: z.string().min(1, "Informe o nome do fornecedor"),
  contactName: z.string().optional(),
  contactEmail: z.union([z.string().email("Informe um e-mail válido"), z.literal("")]).optional(),
  contactPhone: z.string().optional(),
});

export type SupplierFormData = z.infer<typeof supplierSchema>;
