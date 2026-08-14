// components/sortable-table-head.tsx
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { TableHead } from "@/components/ui/table";
import { cn } from "@/lib/utils";

type SortableTableHeadProps = {
  field: string;
  label: string;
  currentSortField: string;
  currentSortOrder: "asc" | "desc";
  onSort: (field: string) => void;
  className?: string;
};

export const SortableTableHead = ({
  field,
  label,
  currentSortField,
  currentSortOrder,
  onSort,
  className,
}: SortableTableHeadProps) => {
  const isActive = currentSortField === field;

  return (
    <TableHead className={className}>
      <button
        type="button"
        onClick={() => onSort(field)}
        className={cn(
          "flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground",
          isActive && "text-foreground",
        )}
      >
        {label}
        {isActive ? (
          currentSortOrder === "asc" ? (
            <ArrowUp className="size-3.5" />
          ) : (
            <ArrowDown className="size-3.5" />
          )
        ) : (
          <ArrowUpDown className="size-3.5 opacity-40" />
        )}
      </button>
    </TableHead>
  );
};
