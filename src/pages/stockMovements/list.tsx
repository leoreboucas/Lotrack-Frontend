import { useEffect, useState } from "react";
import { useList, useTable } from "@refinedev/core";
import type { CrudFilter, CrudSort } from "@refinedev/core";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertTriangle, ArrowRightLeft, Calendar, ChevronDown, FileText, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import { httpService } from "@/services/httpService";
import type { IStockMovement } from "@/types/stockMovement";
import { SortableTableHead } from "@/components/sortableTableHead";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useTranslation } from "react-i18next";
import type { IProductBalance } from "@/types/productBalance";
import { useExpiringLots } from "@/hooks/useExpiringLots";

export const StockMovementList = () => {
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortField, setSortField] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const { t } = useTranslation();

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const {
    tableQuery,
    currentPage,
    setCurrentPage,
    pageCount,
    pageSize,
    setPageSize,
    setFilters,
    setSorters,
  } = useTable<IStockMovement>({
    resource: "stock-movements",
    filters: { mode: "server", initial: [] },
  });

  useEffect(() => {
    const nextFilters: CrudFilter[] = [];

    if (searchValue) {
      nextFilters.push({ field: "search", operator: "contains", value: searchValue });
    }

    if (typeFilter !== "all") {
      nextFilters.push({ field: "type", operator: "eq", value: typeFilter });
    }

    setFilters(nextFilters, "replace");
    setCurrentPage(1);
  }, [searchValue, typeFilter, setFilters, setCurrentPage]);

  const navigate = useNavigate();

  useEffect(() => {
    const nextSorters: CrudSort[] = [{ field: sortField, order: sortOrder }];
    setSorters(nextSorters);
  }, [sortField, sortOrder, setSorters]);

  const movements = tableQuery.data?.data ?? [];

  const handleGenerateReceipt = async (movementId: string) => {
    try {
      const response = await httpService.request(`/stock-movements/${movementId}/receipt`, { method: "GET" });

      if (!response.ok) {
        throw new Error("Não foi possível gerar o comprovante.");
      }

      
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `recibo-movimentacao-${movementId}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
      window.alert("Não foi possível gerar o comprovante.");
    }
  };

  const { lots: expiringLots } = useExpiringLots();
  const { result: lowStockResult } = useList<IProductBalance>({
    resource: "products/low-stock",
    pagination: { mode: "off" },
  });
  const lowStockCount = lowStockResult?.data?.length ?? 0;
  
  if (tableQuery.isLoading) {
    return <div className="text-sm text-muted-foreground">Carregando movimentações...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.12em] text-primary">
          ESTOQUE
        </p>
        <div className="mt-1 flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Movimentações
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Histórico das operações de entrada, saída, descarte e ajuste.
            </p>
          </div>
          <div className="ml-auto hidden size-10 items-center justify-center rounded-lg bg-primary/10 text-primary sm:flex">
            <ArrowRightLeft className="size-5" />
          </div>
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Card
          className="cursor-pointer border-amber-200 bg-amber-50 transition hover:border-amber-300 dark:border-amber-900/40 dark:bg-amber-950/20"
          onClick={() => navigate("/lots")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <Calendar className="size-8 text-amber-600" />
            <div>
              <p className="text-2xl font-semibold text-amber-700 dark:text-amber-400">
                {expiringLots.length}
              </p>
              <p className="text-sm text-muted-foreground">
                Lotes vencendo em breve
              </p>
            </div>
          </CardContent>
        </Card>

        <Card
          className="cursor-pointer border-destructive/30 bg-destructive/5 transition hover:border-destructive/50"
          onClick={() => navigate("/products/low-stock")}
        >
          <CardContent className="flex items-center gap-3 p-4">
            <AlertTriangle className="size-8 text-destructive" />
            <div>
              <p className="text-2xl font-semibold text-destructive">
                {lowStockCount}
              </p>
              <p className="text-sm text-muted-foreground">
                Produtos com estoque baixo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-end">
        <div className="relative w-full lg:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Buscar por produto, SKU, código de barras, usuário ou motivo"
            className="pl-9"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(event) => setTypeFilter(event.target.value)}
          className="h-9 rounded-md border bg-background px-3 text-sm"
        >
          <option value="all">Todos os tipos</option>
          <option value="ENTRY">Entrada</option>
          <option value="EXIT">Saída</option>
          <option value="DISPOSAL">Descarte</option>
          <option value="ADJUSTMENT">Ajuste</option>
        </select>
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button />}>
            <Plus className="size-4" />
            {t("stockMovements.newMovement")}
            <ChevronDown className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate("/movements/entries/create")}
            >
              {t("stockMovements.entry")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/movements/exits/create")}
            >
              {t("stockMovements.exit")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/movements/adjustments/create")}
            >
              {t("stockMovements.adjustment")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => navigate("/movements/disposals/create")}
            >
              {t("stockMovements.disposal")}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Card className="border border-border/80 py-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  field="type"
                  label="Tipo"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHead
                  field="productName"
                  label="Produto"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <SortableTableHead
                  field="totalQuantity"
                  label="Qtd."
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <TableHead>{t("stockMovements.userName")}</TableHead>
                <SortableTableHead
                  field="createdAt"
                  label="Data da movimentação"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />
                <TableHead className="w-40 text-right">
                  {t("stockMovements.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => (
                <TableRow key={movement.id}>
                  <TableCell>{movement.type}</TableCell>
                  <TableCell>{movement.productName}</TableCell>
                  <TableCell>{movement.totalQuantity}</TableCell>
                  <TableCell>{movement.userName}</TableCell>
                  <TableCell>
                    {new Date(movement.createdAt).toLocaleString()}
                  </TableCell>
                  
                  <TableCell className="text-right">
                    <Button
                      onClick={() =>
                        navigate(`/stock-movements/show/${movement.id}`)
                      }
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      {t("stockMovements.show")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => void handleGenerateReceipt(movement.id)}
                    >
                      <FileText className="size-4" />
                      {t("stockMovements.generateReceipt")}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {movements.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              {t("stockMovements.noMovements")}
            </p>
          )}
        </CardContent>
      </Card>
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          {t("stockMovements.itemsPerPage")}
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setCurrentPage(1);
            }}
            className="h-8 rounded-md border bg-background px-2 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring/50"
          >
            {[10, 25, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {t("stockMovements.previous")}
        </Button>
        <span className="text-sm text-muted-foreground">
          {t("stockMovements.page", { current: currentPage, total: pageCount })}
        </span>
        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          {t("stockMovements.next")}
        </Button>
      </div>
    </div>
  );
};
