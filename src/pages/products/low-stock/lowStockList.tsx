// src/pages/products/low-stock/LowStockList.tsx
import { useList } from "@refinedev/core";
import { AlertTriangle } from "lucide-react";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import type { IProductBalance } from "@/types/productBalance";

export const LowStockList = () => {
  const { result, query } = useList<IProductBalance>({
    resource: "products/low-stock",
    pagination: { mode: "off" },
  });

  const products = result?.data ?? [];

  if (query.isLoading) {
    return <div className="text-sm text-muted-foreground">Carregando produtos...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.12em] text-primary">ESTOQUE</p>
        <div className="mt-1 flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Estoque baixo</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Produtos abaixo da quantidade mínima recomendada.
            </p>
          </div>
          <div className="ml-auto hidden size-10 items-center justify-center rounded-lg bg-destructive/10 text-destructive sm:flex">
            <AlertTriangle className="size-5" />
          </div>
        </div>
      </div>

      <Card className="border border-border/80 py-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Produto</TableHead>
                <TableHead>Quantidade atual</TableHead>
                <TableHead>Mínimo</TableHead>
                <TableHead>Unidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  <TableCell className="text-destructive font-semibold">
                    {product.currentQuantity}
                  </TableCell>
                  <TableCell>{product.minimumStock}</TableCell>
                  <TableCell>{product.unitOfMeasure}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {products.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Nenhum produto abaixo do estoque mínimo.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};