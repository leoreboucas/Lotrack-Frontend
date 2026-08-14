import { useOne } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ISupplier } from "@/types/supplier";
import { useTranslation } from "react-i18next";

export const SupplierShow = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { result: supplier, query: supplierQuery } = useOne<ISupplier>({
    resource: "suppliers",
    id: id!,
  });


  const isLoading = supplierQuery.isLoading;

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Carregando fornecedor...</div>
    );
  }

  if (!supplier) {
    return (
      <div className="text-sm text-muted-foreground">
        Fornecedor não encontrado.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/suppliers")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-primary">
            Fornecedor
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {supplier.name}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-4" />
            Dados do fornecedor
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">{t("suppliers.name")}</p>
            <p className="font-medium">{supplier.name}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("suppliers.contact")}</p>
            <p className="font-medium">{supplier.contactName || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("suppliers.email")}</p>
            <p className="font-medium">{supplier.contactEmail || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("suppliers.phone")}</p>
            <p className="font-medium">{supplier.contactPhone || "—"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
