import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useList } from "@refinedev/core";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IProduct } from "@/types/product";
import type { ISupplier } from "@/types/supplier";
import { lotSchema, type LotFormData } from "./schema";

const defaultValues: LotFormData = {
  productId: "",
  supplierId: "",
  lotNumber: "",
  initialQuantity: 0,
  currentQuantity: 0,
  unitCost: 0,
  expirationDate: "",
};

type Props = { action: "create" | "edit" };

export const LotForm = ({ action }: Props) => {
  const navigate = useNavigate();
  const { result: productsResult } = useList<IProduct>({ resource: "products", pagination: { mode: "off" } });
  const { result: suppliersResult } = useList<ISupplier>({ resource: "suppliers", pagination: { mode: "off" } });
  const resolver = zodResolver(lotSchema) as unknown as import("react-hook-form").Resolver<LotFormData>;
  const { register, handleSubmit, formState: { errors }, refineCore: { onFinish, formLoading } } = useForm<any, any, LotFormData>({
    resolver,
    defaultValues,
    refineCoreProps: { action, redirect: false, onMutationSuccess: () => navigate("/lots") },
  });

  const products = productsResult?.data ?? [];
  const suppliers = suppliersResult?.data ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[.12em] text-primary">ESTOQUE</p>
        <h1 className="mt-1 text-2xl font-semibold">{action === "create" ? "Novo lote" : "Editar lote"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Cadastre os lotes recebidos e a validade associada.</p>
      </div>
      <Card className="border py-0">
        <CardHeader className="border-b py-5">
          <CardTitle>Dados do lote</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit((data) => onFinish(data))}>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="productId">Produto</Label>
              <select id="productId" className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" {...register("productId")}>
                <option value="">Selecione um produto</option>
                {products.map((product) => <option key={product.id} value={product.id}>{product.name}</option>)}
              </select>
              {typeof errors.productId?.message === "string" && <p className="text-xs text-destructive">{errors.productId.message}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="supplierId">Fornecedor</Label>
              <select id="supplierId" className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" {...register("supplierId")}>
                <option value="">Selecione um fornecedor</option>
                {suppliers.map((supplier) => <option key={supplier.id} value={supplier.id}>{supplier.name}</option>)}
              </select>
              {typeof errors.supplierId?.message === "string" && <p className="text-xs text-destructive">{errors.supplierId.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lotNumber">Número do lote</Label>
              <Input id="lotNumber" {...register("lotNumber")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Validade</Label>
              <Input id="expirationDate" type="date" {...register("expirationDate")} />
              {typeof errors.expirationDate?.message === "string" && <p className="text-xs text-destructive">{errors.expirationDate.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="initialQuantity">Quantidade inicial</Label>
              <Input id="initialQuantity" type="number" min="0" step="0.0001" {...register("initialQuantity")} />
              {typeof errors.initialQuantity?.message === "string" && <p className="text-xs text-destructive">{errors.initialQuantity.message}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="unitCost">Custo unitário</Label>
              <Input id="unitCost" type="number" min="0" step="0.0001" {...register("unitCost")} />
              {typeof errors.unitCost?.message === "string" && <p className="text-xs text-destructive">{errors.unitCost.message}</p>}
            </div>
            <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => navigate("/lots")}>Cancelar</Button>
              <Button type="submit" disabled={formLoading}>{formLoading ? "Salvando..." : "Salvar lote"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
