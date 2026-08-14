// src/pages/lots/list/LotList.tsx
import { useEffect, useState } from "react";
import { useList, useTable } from "@refinedev/core";
import type { CrudSort } from "@refinedev/core";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Boxes, Search } from "lucide-react";

import type { ILot } from "@/types/lot";
import type { IProduct } from "@/types/product";
import { SortableTableHead } from "@/components/sortableTableHead";

const isExpiringSoon = (date: string) => {
  const days = Math.ceil(
    (new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
  );
  return days <= 30 && days >= 0;
};

const isExpired = (date: string) => new Date(date).getTime() < Date.now();

export const LotList = () => {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState("expirationDate");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
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
  } = useTable<ILot>({
    resource: "lots",
    filters: { mode: "server", initial: [] },
  });

  const { result: productsResult } = useList<IProduct>({
    resource: "products",
    pagination: { mode: "off" },
  });

  useEffect(() => {
    const nextFilters = [];

    if (searchValue) {
      nextFilters.push({
        field: "search",
        operator: "contains" as const,
        value: searchValue,
      });
    }

    setFilters(nextFilters, "replace");
    setCurrentPage(1);
  }, [searchValue, setFilters, setCurrentPage]);

  useEffect(() => {
    const nextSorters: CrudSort[] = [{ field: sortField, order: sortOrder }];
    setSorters(nextSorters);
  }, [sortField, sortOrder, setSorters]);

  const lots = tableQuery.data?.data ?? [];

  if (tableQuery.isLoading) {
    return (
      <div className="text-sm text-muted-foreground">Carregando lotes...</div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Boxes className="size-4" />
          ESTOQUE
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Lotes</h1>

        <p className="text-sm text-muted-foreground">
          Todos os lotes cadastrados, com validade e quantidade atual.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder="Buscar por número de lote"
            className="pl-9"
          />
        </div>
      </div>

      <Card className="border border-border/80 py-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  field="productName"
                  label="Produto"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <TableHead>Lote</TableHead>

                <TableHead>Fornecedor</TableHead>

                <SortableTableHead
                  field="currentQuantity"
                  label="Qtd. atual"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <SortableTableHead
                  field="expirationDate"
                  label="Validade"
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {lots.map((lot) => (
                <TableRow key={lot.id}>
                  <TableCell>{lot.productName}</TableCell>

                  <TableCell>{lot.lotNumber || "—"}</TableCell>

                  <TableCell>{lot.supplierName}</TableCell>

                  <TableCell>{lot.currentQuantity}</TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      {new Date(lot.expirationDate).toLocaleDateString("pt-BR")}
                      {isExpired(lot.expirationDate) && (
                        <Badge variant="destructive">Vencido</Badge>
                      )}
                      {!isExpired(lot.expirationDate) &&
                        isExpiringSoon(lot.expirationDate) && (
                          <Badge
                            variant="destructive"
                            className="bg-amber-500 text-white"
                          >
                            Vencendo
                          </Badge>
                        )}
                    </div>
                  </TableCell>

                  <TableCell className="text-right">
                    <Button
                      onClick={() => navigate(`/lots/show/${lot.id}`)}
                      variant="outline"
                      size="sm"
                    >
                      Ver detalhes
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {lots.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              Nenhum lote encontrado.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          Itens por página
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
          Anterior
        </Button>

        <span className="text-sm text-muted-foreground">
          Página {currentPage} de {pageCount}
        </span>

        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          Próxima
        </Button>
      </div>
    </div>
  );
};
