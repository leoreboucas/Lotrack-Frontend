import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useList } from "@refinedev/core";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ICategory } from "@/types/category";
import { productSchema, type ProductFormData } from "./schema";
import { CanAccess } from "@/components/canAccess";

const defaultValues: ProductFormData = {
  categoryId: "",
  name: "",
  sku: "",
  barcode: "",
  unitOfMeasure: "un",
  minimumStock: 0,
};

type Props = { action: "create" | "edit" };

export const ProductForm = ({ action }: Props) => {
  const navigate = useNavigate();
  const { result: categoriesResult } = useList<ICategory>({ resource: "categories", pagination: { mode: "off" } });
  const resolver = zodResolver(productSchema) as unknown as import("react-hook-form").Resolver<ProductFormData>;
  const { register, handleSubmit, formState: { errors }, refineCore: { onFinish, formLoading } } = useForm<any, any, ProductFormData>({
    resolver,
    defaultValues,
    refineCoreProps: { action, redirect: false, onMutationSuccess: () => navigate("/products") },
  });
  const categories = categoriesResult?.data ?? [];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[.12em] text-primary">ESTOQUE</p>
        <h1 className="mt-1 text-2xl font-semibold">
          {action === "create" ? "Novo produto" : "Editar produto"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Os campos de status são definidos automaticamente pelo sistema.
        </p>
      </div>

      <Card className="border py-0">
        <CardHeader className="border-b py-5">
          <CardTitle>Dados do produto</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit((data) => onFinish({ ...data, barcode: data.barcode || undefined }))}>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name")} />
              {typeof errors.name?.message === "string" && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="sku">SKU</Label>
              <Input id="sku" {...register("sku")} />
              {typeof errors.sku?.message === "string" && <p className="text-xs text-destructive">{errors.sku.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="barcode">Código de barras</Label>
              <Input id="barcode" {...register("barcode")} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="categoryId">Categoria</Label>
              <select id="categoryId" className="flex h-9 w-full rounded-md border bg-background px-3 text-sm" {...register("categoryId")}>
                <option value="">Selecione uma categoria</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              {typeof errors.categoryId?.message === "string" && <p className="text-xs text-destructive">{errors.categoryId.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="unitOfMeasure">Unidade de medida</Label>
              <Input id="unitOfMeasure" placeholder="un, kg, l, cx" {...register("unitOfMeasure")} />
              {typeof errors.unitOfMeasure?.message === "string" && <p className="text-xs text-destructive">{errors.unitOfMeasure.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="minimumStock">Estoque mínimo</Label>
              <Input id="minimumStock" type="number" min="0" step="0.0001" {...register("minimumStock")} />
              {typeof errors.minimumStock?.message === "string" && <p className="text-xs text-destructive">{errors.minimumStock.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => navigate("/products")}>
                Cancelar
              </Button>
              <CanAccess resource="products" action={action}>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? "Salvando..." : "Salvar produto"}
                </Button>
              </CanAccess>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
