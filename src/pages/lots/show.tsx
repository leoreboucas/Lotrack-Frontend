import { useOne } from "@refinedev/core";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, Package, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ILot } from "@/types/lot";
import { useTranslation } from "react-i18next";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export const LotShow = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const navigate = useNavigate();

  const { result: lot, query: lotQuery } = useOne<ILot>({
    resource: "lots",
    id: id!,
  });


  const isLoading = lotQuery.isLoading;

  if (isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Carregando lote...</div>
    );
  }

  if (!lot) {
    return (
      <div className="text-sm text-muted-foreground">
        Lote não encontrado.
      </div>
    );
  }

  const goToMovement = (type: "exits" | "disposals" | "adjustments") => {
    navigate(`/movements/${type}/create`, {
      state: {
        lotId: lot.id,
        productId: lot.productId,
      },
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/lots")}
          >
            <ArrowLeft className="size-4" />
          </Button>
          <div>
            <p className="text-xs font-semibold tracking-[0.12em] text-primary">
              {t("lots.lotNumber")}: {lot.lotNumber}
            </p>
            <h1 className="text-2xl font-semibold tracking-tight">
              {lot.productName}
            </h1>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            <Plus className="size-4" />
            Nova movimentação
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => goToMovement("exits")}>
              Saída
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => goToMovement("disposals")}>
              Descarte
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => goToMovement("adjustments")}>
              Ajuste
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="size-4" />
            Dados do lote
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-muted-foreground">
              {t("lots.lotNumber")}
            </p>
            <p className="font-medium">{lot.lotNumber || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("lots.productName")}
            </p>
            <p className="font-medium">{lot.productName || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("lots.supplierName")}
            </p>
            <p className="font-medium">{lot.supplierName}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("lots.initialQuantity")}
            </p>
            <p className="font-medium">{lot.initialQuantity || "—"}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("lots.currentQuantity")}
            </p>
            <p className="font-medium">{lot.currentQuantity}</p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("lots.unitCost")}
            </p>
            <p className="font-medium">
              R$ {lot.unitCost.toFixed(2).replace(".", ",") || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("lots.expiration")}
            </p>
            <p className="font-medium">
              {new Date(lot.expirationDate).toLocaleDateString() || "—"}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">
              {t("lots.receivedAt")}
            </p>
            <p className="font-medium">
              {new Date(lot.receivedAt).toLocaleDateString() || "—"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};