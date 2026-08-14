import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "@refinedev/react-hook-form";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supplierSchema, type SupplierFormData } from "./schema";

const defaultValues: SupplierFormData = {
  name: "",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
};

type Props = { action: "create" | "edit" };
export const SupplierForm = ({ action }: Props) => {
  const navigate = useNavigate();
  const resolver = zodResolver(supplierSchema) as unknown as import("react-hook-form").Resolver<SupplierFormData>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    refineCore: { onFinish, formLoading },
  } = useForm<any, any, SupplierFormData>({
    resolver,
    defaultValues,
    refineCoreProps: {
      action,
      redirect: false,
      onMutationSuccess: () => navigate("/suppliers"),
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[.12em] text-primary">PARCEIROS</p>
        <h1 className="mt-1 text-2xl font-semibold">
          {action === "create" ? "Novo fornecedor" : "Editar fornecedor"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          O status do fornecedor é definido pelo sistema.
        </p>
      </div>

      <Card className="border py-0">
        <CardHeader className="border-b py-5">
          <CardTitle>Dados do fornecedor</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={handleSubmit((data) => onFinish(data))}>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" {...register("name")} />
              {typeof errors.name?.message === "string" && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">Nome do contato</Label>
              <Input id="contactName" {...register("contactName")} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Telefone</Label>
              <Input id="contactPhone" {...register("contactPhone")} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="contactEmail">E-mail</Label>
              <Input id="contactEmail" type="email" {...register("contactEmail")} />
              {typeof errors.contactEmail?.message === "string" && <p className="text-xs text-destructive">{errors.contactEmail.message}</p>}
            </div>

            <div className="flex justify-end gap-3 pt-2 sm:col-span-2">
              <Button type="button" variant="outline" onClick={() => navigate("/suppliers")}>
                Cancelar
              </Button>
              <Button type="submit" disabled={formLoading}>
                {formLoading ? "Salvando..." : "Salvar fornecedor"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
