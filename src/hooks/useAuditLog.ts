import { useEffect, useState } from "react";

import { httpService } from "@/services/httpService";
import type { IAuditLog } from "@/types/auditLog";
import type { SpringPage } from "@/types/springPage";

type Filters = {
  userId?: string;
  entityType?: string;
  action?: string;
  from?: string;
  to?: string;
};

type UseAuditLogsParams = {
  page: number; 
  size: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  filters?: Filters;
};

export const useAuditLogs = ({ page, size, sortField, sortOrder, filters }: UseAuditLogsParams) => {
  const [data, setData] = useState<SpringPage<IAuditLog> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

    const fromStartOfDay = (dateStr: string): string | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(`${dateStr}T00:00:00.000`);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
    };

    const toEndOfDay = (dateStr: string): string | undefined => {
    if (!dateStr) return undefined;
    const date = new Date(`${dateStr}T23:59:59.999`);
    return isNaN(date.getTime()) ? undefined : date.toISOString();
    };

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setError(null);

    const query: Record<string, string | number> = {
      page: page - 1,
      size,
    };

    if (sortField) {
      query.sort = `${sortField},${sortOrder ?? "asc"}`;
    }

    if (filters?.userId) query.userId = filters.userId;
    if (filters?.entityType) query.entityType = filters.entityType;
    if (filters?.action) query.action = filters.action;
    if (filters?.from) {
      const fromIso = fromStartOfDay(filters.from);
      if (fromIso) query.from = fromIso;
    }
    if (filters?.to) {
      const toIso = toEndOfDay(filters.to);
      if (toIso) query.to = toIso;
    }


    
    httpService
      .fetchJson<SpringPage<IAuditLog>>("/audit-logs", { query })
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error("Erro ao buscar logs"));
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [page, size, sortField, sortOrder, filters?.userId, filters?.entityType, filters?.action, filters?.from, filters?.to]);

  return { data, isLoading, error };
};