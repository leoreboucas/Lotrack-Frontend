import { useOne } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProductBalance } from "@/hooks/useProductBalance";
import type { IProduct } from "@/types/product";
import { useTranslation } from "react-i18next";

export const ProductShow = () => {
    const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { result: product, query: productQuery } = useOne<IProduct>({
    resource: "products",
    id: id!,
  });

  const { data: balance, isLoading: balanceLoading } = useProductBalance(id);

  const isLoading = productQuery.isLoading || balanceLoading;
  const isLowStock = balance && balance.currentQuantity < balance.minimumStock;

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Carregando produto...</div>
    );
  }

  if (!product) {
    return (
      <div className="text-sm text-muted-foreground">
        Produto não encontrado.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/products")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-primary">
            ESTOQUE
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {product.name}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-4" />
            Dados do produto
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">{t("products.sku")}</p>
            <p className="font-medium">{product.sku}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("products.barcode")}</p>
            <p className="font-medium">{product.barcode || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("products.category")}</p>
            <p className="font-medium">{product.categoryName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("products.unitOfMeasure")}</p>
            <p className="font-medium">{product.unitOfMeasure}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {t("products.stockInformation")}
            {isLowStock && (
              <Badge variant="destructive" className="gap-1">
                <AlertTriangle className="size-3" />
                {t("products.lowStock")}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">{t("products.currentQuantity")}</p>
            <p
              className={
                isLowStock
                  ? "text-lg font-semibold text-destructive"
                  : "text-lg font-semibold"
              }
            >
              {balance?.currentQuantity} {balance?.unitOfMeasure}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{t("products.minimumStock")}</p>
            <p className="text-lg font-semibold">
              {balance?.minimumStock} {balance?.unitOfMeasure}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
