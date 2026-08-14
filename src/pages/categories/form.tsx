import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigate } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categorySchema, type CategoryFormData } from "./schema";

const defaultValues: CategoryFormData = {
  name: "",
  description: "",
};

type Props = { action: "create" | "edit"; onClose?: () => void | Promise<void> };

export const CategoryForm = ({ action, onClose }: Props) => {
  const navigate = useNavigate();
  const resolver = zodResolver(categorySchema) as unknown as import("react-hook-form").Resolver<CategoryFormData>;
  const { register, handleSubmit, formState: { errors }, refineCore: { onFinish, formLoading } } = useForm<any, any, CategoryFormData>({
    resolver,
    defaultValues,
    refineCoreProps: { action, redirect: false, onMutationSuccess: () => { if (onClose) { void onClose(); } else { navigate("/categories"); } } },
  });

  const handleCancel = () => {
    if (onClose) {
      void onClose();
      return;
    }

    navigate("/categories");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[.12em] text-primary">CADASTROS</p>
        <h1 className="mt-1 text-2xl font-semibold">{action === "create" ? "Nova categoria" : "Editar categoria"}</h1>
        <p className="mt-1 text-sm text-muted-foreground">Organize os grupos que classificam seu catálogo.</p>
      </div>
      <Card className="border py-0">
        <CardHeader className="border-b py-5">
          <CardTitle>Dados da categoria</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit((data) => onFinish({ ...data, description: data.description || undefined }))}>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name")} />
              {typeof errors.name?.message === "string" && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Descrição</Label>
              <Input id="description" {...register("description")} />
            </div>
            <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
              <Button type="button" variant="outline" onClick={handleCancel}>Cancelar</Button>
              <Button type="submit" disabled={formLoading}>{formLoading ? "Salvando..." : "Salvar categoria"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
