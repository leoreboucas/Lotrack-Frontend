import { useEffect, useState } from "react";
import { useTable } from "@refinedev/core";
import type { CrudSort } from "@refinedev/core";

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
import { PackageSearch, Search, Plus, AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RowActions } from "@/components/rowActions";
import { Link, useNavigate } from "react-router-dom";

import type { IProduct } from "@/types/product";
import { SortableTableHead } from "@/components/sortableTableHead";
import { CanAccess } from "@/components/canAccess";

export const ProductList = () => {
  const { t } = useTranslation();

  const [searchValue, setSearchValue] = useState("");
  const [sortField, setSortField] = useState("name");
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
  } = useTable({
    resource: "products",
    filters: {
      mode: "server",
      initial: [],
    },
  });
  

  const navigate = useNavigate();

  useEffect(() => {
    setFilters(
      searchValue
        ? [
            {
              field: "search",
              operator: "contains",
              value: searchValue,
            },
          ]
        : [],
      "replace",
    );

    setCurrentPage(1);
  }, [searchValue, setFilters, setCurrentPage]);

  useEffect(() => {
    const nextSorters: CrudSort[] = [
      {
        field: sortField,
        order: sortOrder,
      },
    ];

    setSorters(nextSorters);
  }, [sortField, sortOrder, setSorters]);

  const products = tableQuery.data?.data ?? [];

  if (tableQuery.isLoading) {
    return <>{t("products.loading")}</>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <PackageSearch className="size-4" />
          ESTOQUE
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          {t("products.title")}
        </h1>

        <p className="text-sm text-muted-foreground">
          Acompanhe os itens cadastrados e seus níveis mínimos.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={t("products.searchPlaceholder")}
            className="pl-9"
          />
        </div>

        <Button
          variant="outline"
          className="cursor-pointer"
          onClick={() => navigate("/products/low-stock")}
        >
          <AlertTriangle className="size-4" />
          Produtos com estoque baixo
        </Button>

        <CanAccess resource="products" action="create">
          <Button render={<Link to="/products/create" />}>
            <Plus /> Novo produto
          </Button>
        </CanAccess>
      </div>

      <Card className="border border-border/80 py-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  field="name"
                  label={t("products.name")}
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <SortableTableHead
                  field="sku"
                  label={t("products.sku")}
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <SortableTableHead
                  field="barcode"
                  label={t("products.barcode")}
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <SortableTableHead
                  field="categoryName"
                  label={t("products.category")}
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <SortableTableHead
                  field="unitOfMeasure"
                  label={t("products.unitOfMeasure")}
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <SortableTableHead
                  field="minimumStock"
                  label={t("products.minimumStock")}
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <TableHead className="text-right">
                  {t("products.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>

                  <TableCell>{product.sku}</TableCell>

                  <TableCell>{product.barcode ? product.barcode : "N/A"}</TableCell>

                  <TableCell>{product.categoryName}</TableCell>

                  <TableCell>{product.unitOfMeasure}</TableCell>

                  <TableCell>{product.minimumStock}</TableCell>

                  <TableCell className="text-right">
                    <Button
                      onClick={() => navigate(`/products/show/${product.id}`)}
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      {t("products.show")}
                    </Button>
                    <CanAccess resource="products" action="edit">
                      <RowActions
                        resource="products"
                        id={product.id!}
                        editPath={`/products/edit/${product.id}`}
                      />
                    </CanAccess>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {products.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              {t("products.empty")}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          {t("products.itemsPerPage")}

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
          {t("products.previous")}
        </Button>

        <span className="text-sm text-muted-foreground">
          {t("products.page", {
            current: currentPage,
            total: pageCount,
          })}
        </span>

        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          {t("products.next")}
        </Button>
      </div>
    </div>
  );
};
