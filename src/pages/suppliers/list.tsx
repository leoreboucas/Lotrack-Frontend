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
import { Building2, Search, Plus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { RowActions } from "@/components/rowActions";
import { Link, useNavigate } from "react-router-dom";

import { SortableTableHead } from "@/components/sortableTableHead";

export const SupplierList = () => {
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
    resource: "suppliers",
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

  const suppliers = tableQuery.data?.data ?? [];

  if (tableQuery.isLoading) {
    return <>{t("suppliers.loading")}</>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          <Building2 className="size-4" />
          PARCEIROS
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          {t("suppliers.title")}
        </h1>

        <p className="text-sm text-muted-foreground">
          Consulte os parceiros vinculados à sua operação.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="relative w-full sm:w-72">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={t("suppliers.searchPlaceholder")}
            className="pl-9"
          />
        </div>

        <Button render={<Link to="/suppliers/create" />}>
          <Plus /> Novo fornecedor
        </Button>
      </div>

      <Card className="border border-border/80 py-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  field="name"
                  label={t("suppliers.name")}
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <SortableTableHead
                  field="contactName"
                  label={t("suppliers.contact")}
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <SortableTableHead
                  field="contactEmail"
                  label={t("suppliers.email")}
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <SortableTableHead
                  field="contactPhone"
                  label={t("suppliers.phone")}
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <TableHead className="text-right">
                  {t("suppliers.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>

                  <TableCell>{supplier.contactName ?? "-"}</TableCell>

                  <TableCell>{supplier.contactEmail ?? "-"}</TableCell>

                  <TableCell>{supplier.contactPhone ?? "-"}</TableCell>

                  <TableCell className="text-right">
                    <Button
                      onClick={() => navigate(`/suppliers/show/${supplier.id}`)}
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      {t("suppliers.show")}
                    </Button>
                    <RowActions
                      resource="suppliers"
                      id={supplier.id!}
                      editPath={`/suppliers/edit/${supplier.id}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {suppliers.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              {t("suppliers.empty")}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          {t("suppliers.itemsPerPage")}

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
          {t("suppliers.previous")}
        </Button>

        <span className="text-sm text-muted-foreground">
          {t("suppliers.page", {
            current: currentPage,
            total: pageCount,
          })}
        </span>

        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          {t("suppliers.next")}
        </Button>
      </div>
    </div>
  );
};
