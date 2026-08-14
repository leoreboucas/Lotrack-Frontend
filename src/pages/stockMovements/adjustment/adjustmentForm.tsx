// adjustment/AdjustmentForm.tsx
import { useCreate, useList } from "@refinedev/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ILot } from "@/types/lot";

import { adjustmentSchema, type AdjustmentFormData } from "./schema";

export const AdjustmentForm = () => {
  const navigate = useNavigate();
  const { mutate: create, mutation } = useCreate();
  const { result: lotsResult } = useList<ILot>({
    resource: "lots",
    pagination: { mode: "off" },
  });

  const location = useLocation();
  const prefill = location.state as { lotId?: string } | null;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdjustmentFormData>({
    resolver: zodResolver(adjustmentSchema),
    defaultValues: {
      lotId: prefill?.lotId ?? "",
      direction: "INCREASE",
      quantity: 0,
      reason: "",
    },
  });

  const lots = lotsResult?.data ?? [];

  const prefilledLot = prefill?.lotId
    ? lots.find((l) => l.id === prefill.lotId)
    : undefined;

  const onSubmit = (data: AdjustmentFormData) => {
    create(
      { resource: "movements/adjustments", values: data },
      { onSuccess: () => navigate("/") },
    );
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[.12em] text-primary">
          ESTOQUE
        </p>
        <h1 className="mt-1 text-2xl font-semibold">Novo ajuste</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajuste manualmente a quantidade de um lote em estoque.
        </p>
      </div>
      <Card className="border py-0">
        <CardHeader className="border-b py-5">
          <CardTitle>Dados do ajuste</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form
            className="grid gap-5 sm:grid-cols-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="lotId">Lote</Label>
              {prefilledLot ? (
                <div className="flex h-9 items-center rounded-md border bg-muted px-3 text-sm text-muted-foreground">
                  Produto: {prefilledLot.productName}{" "}
                  {prefilledLot.lotNumber
                    ? `· Lote: ${prefilledLot.lotNumber} · ${new Date(prefilledLot.expirationDate).toLocaleDateString("pt-BR")} · ${prefilledLot.currentQuantity} ${prefilledLot.productUnitOfMeasure}`
                    : `· ${new Date(prefilledLot.expirationDate).toLocaleDateString("pt-BR")} · ${prefilledLot.currentQuantity} ${prefilledLot.productUnitOfMeasure} (sem nº de lote)`}
                </div>
              ) : (
                <select
                  id="lotId"
                  className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
                  {...register("lotId")}
                >
                  <option value="">Selecione um lote</option>
                  {lots.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      Produto: {lot.productName}{" "}
                      {lot.lotNumber
                        ? `Lote: ${lot.lotNumber} · ${new Date(lot.expirationDate).toLocaleDateString("pt-BR")} · ${lot.currentQuantity} ${lot.productUnitOfMeasure}.`
                        : `${new Date(lot.expirationDate).toLocaleDateString("pt-BR")} · ${lot.currentQuantity} ${lot.productUnitOfMeasure}. (Sem nº de lote)`}
                    </option>
                  ))}
                </select>
              )}
              {errors.lotId && (
                <p className="text-xs text-destructive">
                  {errors.lotId.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="direction">Direção</Label>
              <select
                id="direction"
                className="flex h-9 w-full rounded-md border bg-background px-3 text-sm"
                {...register("direction")}
              >
                <option value="INCREASE">Aumento</option>
                <option value="DECREASE">Redução</option>
              </select>
              {errors.direction && (
                <p className="text-xs text-destructive">
                  {errors.direction.message}
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

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="reason">Motivo</Label>
              <Input id="reason" {...register("reason")} />
              {errors.reason && (
                <p className="text-xs text-destructive">
                  {errors.reason.message}
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
                {mutation.isPending ? "Salvando..." : "Registrar ajuste"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
