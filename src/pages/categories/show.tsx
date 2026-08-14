import { useOne } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IProduct } from "@/types/product";
import { useTranslation } from "react-i18next";

export const CategoryShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { result: category, query: categoryQuery } = useOne<IProduct>({
    resource: "categories",
    id: id!,
  });

  const { t } = useTranslation();

  const isLoading = categoryQuery.isLoading;

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Carregando categoria...</div>
    );
  }

  if (!category) {
    return (
      <div className="text-sm text-muted-foreground">
        Categoria não encontrada.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/categories")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {category.name}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-4" />
            Dados da categoria
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">{t("categories.name")}</p>
            <p className="font-medium">{category.name}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
