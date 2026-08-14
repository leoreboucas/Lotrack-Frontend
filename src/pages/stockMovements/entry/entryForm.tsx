import { useCreate, useList } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IProduct } from "@/types/product";
import type { ISupplier } from "@/types/supplier";

import { entrySchema, type EntryFormData } from "./schema";
import { ProductCombobox } from "@/components/productCombobox";

export const EntryForm = () => {
  const navigate = useNavigate();
  const { mutate: create, mutation } = useCreate();

  const { result: productsResult } = useList<IProduct>({
    resource: "products",
    pagination: { mode: "off" },
  });
  const { result: suppliersResult } = useList<ISupplier>({
    resource: "suppliers",
    pagination: { mode: "off" },
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<EntryFormData>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      productId: "",
      supplierId: "",
      lotNumber: "",
      quantity: 0,
      unitCost: 0,
      expirationDate: "",
    },
  });

  const products = productsResult?.data ?? [];
  const suppliers = suppliersResult?.data ?? [];

  const onSubmit = (data: EntryFormData) => {
    create(
      {
        resource: "movements/entries",
        values: data,
      },
      {
        onSuccess: () => navigate("/"),
      },
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[.12em] text-primary">
          ESTOQUE
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Nova entrada</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registre a entrada de um lote de produto no estoque.
        </p>
      </div>
      <Card className="border py-0">
        <CardHeader className="border-b py-5">
          <CardTitle>Dados da entrada</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form
            className="grid gap-5 sm:grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="productId">Produto</Label>
              <Controller
                control={control}
                name="productId"
                render={({ field }) => (
                  <ProductCombobox
                    products={products}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {errors.productId && (
                <p className="text-xs text-destructive">
                  {errors.productId.message}
                </p>
              )}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="supplierId">Fornecedor</Label>
              <select
                id="supplierId"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
                {...register("supplierId")}
              >
                <option value="">Selecione um fornecedor</option>
                {suppliers.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>
                    {supplier.name}
                  </option>
                ))}
              </select>
              {errors.supplierId && (
                <p className="text-xs text-destructive">
                  {errors.supplierId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lotNumber">Número do lote (opcional)</Label>
              <Input id="lotNumber" {...register("lotNumber")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                step="0.0001"
                {...register("quantity")}
              />
              {errors.quantity && (
                <p className="text-xs text-destructive">
                  {errors.quantity.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitCost">Custo unitário</Label>
              <Input
                id="unitCost"
                type="number"
                min="0"
                step="0.01"
                {...register("unitCost")}
              />
              {errors.unitCost && (
                <p className="text-xs text-destructive">
                  {errors.unitCost.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="expirationDate">Data de validade</Label>
              <Input
                id="expirationDate"
                type="date"
                {...register("expirationDate")}
              />
              {errors.expirationDate && (
                <p className="text-xs text-destructive">
                  {errors.expirationDate.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Registrar entrada"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
