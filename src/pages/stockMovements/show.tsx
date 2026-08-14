import { useOne } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Package } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IStockMovement } from "@/types/stockMovement";
import { useTranslation } from "react-i18next";

export const StockMovementShow = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { result: stockMovement, query: stockMovementQuery } = useOne<IStockMovement>({
    resource: "stock-movements",
    id: id!,
  });

  const isLoading = stockMovementQuery.isLoading;

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Carregando movimentação...</div>
    );
  }

  if (!stockMovement) {
    return (
      <div className="text-sm text-muted-foreground">
        Movimentação não encontrada.
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/")}
        >
          <ArrowLeft className="size-4" />
        </Button>
        <div>
          <p className="text-xs font-semibold tracking-[0.12em] text-primary">
            MOVIMENTAÇÃO DE ESTOQUE
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {stockMovement.productName}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-4" />
            {t("stockMovements.productDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">
              {t("stockMovements.productName")}
            </p>
            <p className="font-medium">{stockMovement.productName || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("stockMovements.type")}
            </p>
            <p className="font-medium">{stockMovement.type || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("stockMovements.direction")}
            </p>
            <p className="font-medium">{stockMovement.direction || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("stockMovements.totalQuantity")}
            </p>
            <p className="font-medium">{stockMovement.totalQuantity || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("stockMovements.productSku")}
            </p>
            <p className="font-medium">{stockMovement.productSku || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("stockMovements.productBarcode")}
            </p>
            <p className="font-medium">{stockMovement.productBarcode || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("stockMovements.reason")}
            </p>
            <p className="font-medium">{stockMovement.reason || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("stockMovements.userName")}
            </p>
            <p className="font-medium">{stockMovement.userName || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("stockMovements.createdAt")}
            </p>
            <p className="font-medium">
              {new Date(stockMovement.createdAt).toLocaleDateString() || "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
