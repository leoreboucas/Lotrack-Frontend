import { useCreate, useGetIdentity, useList } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { IProduct } from "@/types/product";

import { stockMovementSchema, type StockMovementFormData } from "./schema";

const defaultValues: StockMovementFormData = {
  type: "ENTRY",
  direction: null,
  productId: "",
  totalQuantity: 1,
  reason: "",
};

const resourceSuffixByType: Record<StockMovementFormData["type"], string> = {
  ENTRY: "entries",
  EXIT: "exits",
  DISPOSAL: "disposals",
  ADJUSTMENT: "adjustments",
};

export const StockMovementForm = () => {
  const navigate = useNavigate();
  const { mutate: create, mutation } = useCreate();
  const { result: productsResult } = useList<IProduct>({
    resource: "products",
    pagination: { mode: "off" },
  });
  const { data: identity } = useGetIdentity<{ id: string; role: string }>();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StockMovementFormData>({
    resolver: zodResolver(stockMovementSchema),
    defaultValues,
  });

  const movementType = watch("type");
  const showDirection = movementType === "ADJUSTMENT";
  const showReason =
    movementType === "DISPOSAL" || movementType === "ADJUSTMENT";

  useEffect(() => {
    if (!showDirection) {
      setValue("direction", null);
    }

    if (!showReason) {
      setValue("reason", "");
    }
  }, [showDirection, showReason, setValue]);

  const products = productsResult?.data ?? [];

  const onSubmit = (data: StockMovementFormData) => {
    const payload = {
      ...data,
      userId: identity?.id,
      direction: data.type === "ADJUSTMENT" ? data.direction : null,
      reason: showReason ? data.reason : undefined,
    };

    create(
      {
        resource: `movements/${resourceSuffixByType[data.type]}`,
        values: payload,
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
        <h1 className="mt-1 text-2xl font-semibold">Nova movimentação</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Registre entradas, saídas, descarte ou ajustes de estoque.
        </p>
      </div>
      <Card className="border py-0">
        <CardHeader className="border-b py-5">
          <CardTitle>Dados da movimentação</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form
            className="grid gap-5 sm:grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
                {...register("type")}
              >
                <option value="ENTRY">Entrada</option>
                <option value="EXIT">Saída</option>
                <option value="DISPOSAL">Descarte</option>
                <option value="ADJUSTMENT">Ajuste</option>
              </select>
            </div>

            {showDirection && (
              <div className="space-y-2">
                <Label htmlFor="direction">Direção</Label>
                <select
                  id="direction"
                  className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
                  {...register("direction")}
                >
                  <option value="">Selecione</option>
                  <option value="INCREASE">Aumento</option>
                  <option value="DECREASE">Redução</option>
                </select>
                {typeof errors.direction?.message === "string" && (
                  <p className="text-xs text-destructive">
                    {errors.direction.message}
                  </p>
                )}
              </div>
            )}

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="productId">Produto</Label>
              <select
                id="productId"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
                {...register("productId")}
              >
                <option value="">Selecione um produto</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name}
                  </option>
                ))}
              </select>
              {typeof errors.productId?.message === "string" && (
                <p className="text-xs text-destructive">
                  {errors.productId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalQuantity">Quantidade</Label>
              <Input
                id="totalQuantity"
                type="number"
                min="0"
                step="0.0001"
                {...register("totalQuantity")}
              />
              {typeof errors.totalQuantity?.message === "string" && (
                <p className="text-xs text-destructive">
                  {errors.totalQuantity.message}
                </p>
              )}
            </div>

            {showReason && (
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="reason">Motivo</Label>
                <Input id="reason" {...register("reason")} />
                {typeof errors.reason?.message === "string" && (
                  <p className="text-xs text-destructive">
                    {errors.reason.message}
                  </p>
                )}
              </div>
            )}

            <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/movements")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "Salvando..." : "Salvar movimentação"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
