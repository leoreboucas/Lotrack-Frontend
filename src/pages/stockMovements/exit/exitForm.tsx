// exit/ExitForm.tsx
import { useCreate, useList } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IProduct } from "@/types/product";

import { exitSchema, type ExitFormData } from "./schema";
import { ProductCombobox } from "@/components/productCombobox";
import { useState } from "react";

export const ExitForm = () => {
  const navigate = useNavigate();
  const { mutate: create, mutation } = useCreate();
  const { result: productsResult } = useList<IProduct>({
    resource: "products",
    pagination: { mode: "off" },
  });

  const location = useLocation();
  const prefill = location.state as { productId?: string } | null;

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ExitFormData>({
    resolver: zodResolver(exitSchema),
    defaultValues: {
      productId: prefill?.productId ?? "",
      quantity: 0,
    },
  });

  const products = productsResult?.data ?? [];

  const prefilledProduct = prefill?.productId
    ? products.find((p) => p.id === prefill.productId)
    : undefined;
  
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = (data: ExitFormData) => {
    setSubmitError(null);

    create(
      { resource: "movements/exits", values: data },
      {
        onSuccess: () => navigate("/"),
        onError: (error) => {
          setSubmitError(error.message);
        },
      },
    );
  };



  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[.12em] text-primary">
          ESTOQUE
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Nova saída</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registre a saída de um produto do estoque.
        </p>
      </div>
      <Card className="border py-0">
        <CardHeader className="border-b py-5">
          <CardTitle>Dados da saída</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form
            className="grid gap-5 sm:grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            {submitError && (
              <div className="sm:col-span-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {submitError}
              </div>
            )}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="productId">Produto</Label>
              {prefilledProduct ? (
                <div className="flex h-9 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                  {prefilledProduct.name} · SKU: {prefilledProduct.sku} ·{" "}
                  {prefilledProduct.categoryName}
                </div>
              ) : (
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
              )}
              {errors.productId && (
                <p className="text-xs text-destructive">
                  {errors.productId.message}
                </p>
              )}
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

            <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Registrar saída"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
