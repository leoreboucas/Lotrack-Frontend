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
import { Plus, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { RowActions } from "@/components/rowActions";

import { SortableTableHead } from "@/components/sortableTableHead";

export const CategoryList = () => {
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
    resource: "categories",
    filters: {
      mode: "server",
      initial: [],
    },
  });

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

  const navigate = useNavigate();

  useEffect(() => {
    const nextSorters: CrudSort[] = [
      {
        field: sortField,
        order: sortOrder,
      },
    ];

    setSorters(nextSorters);
  }, [sortField, sortOrder, setSorters]);

  const categories = tableQuery.data?.data ?? [];

  if (tableQuery.isLoading) {
    return <>{t("categories.loading")}</>;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {t("categories.eyebrow")}
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          {t("categories.title")}
        </h1>

        <p className="text-sm text-muted-foreground">
          {t("categories.description")}
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            placeholder={t("categories.searchPlaceholder")}
            className="w-full pl-9"
          />
        </div>

        <Button render={<Link to="/categories/create" />} className="h-9">
          <Plus /> {t("categories.new")}
        </Button>
      </div>

      <Card className="border border-border/80 py-0 shadow-sm">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <SortableTableHead
                  field="name"
                  label={t("categories.name")}
                  currentSortField={sortField}
                  currentSortOrder={sortOrder}
                  onSort={handleSort}
                />

                <TableHead className="text-right">
                  {t("categories.actions")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.name}</TableCell>

                  <TableCell className="text-right">
                    <Button
                      onClick={() => navigate(`/categories/show/${category.id}`)}
                      variant="outline"
                      size="sm"
                      className="mr-2"
                    >
                      {t("categories.show")}
                    </Button>
                    <RowActions
                      resource="categories"
                      id={category.id!}
                      editPath={`/categories/edit/${category.id}`}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {categories.length === 0 && (
            <p className="p-8 text-center text-sm text-muted-foreground">
              {t("categories.empty")}
            </p>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-card px-3 py-2">
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          {t("categories.itemsPerPage")}

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
          {t("categories.previous")}
        </Button>

        <span className="text-sm text-muted-foreground">
          {t("categories.page", {
            current: currentPage,
            total: pageCount,
          })}
        </span>

        <Button
          variant="outline"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage === pageCount}
        >
          {t("categories.next")}
        </Button>
      </div>
    </div>
  );
};
