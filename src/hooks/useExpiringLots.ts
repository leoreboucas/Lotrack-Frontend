import { useList } from "@refinedev/core";

import type { ILot } from "@/types/lot";

export const useExpiringLots = () => {
  const { result, query } = useList<ILot>({
    resource: "lots/expiring",
    pagination: { mode: "off" },
  });

  return {
    lots: result?.data ?? [],
    isLoading: query.isLoading,
  };
};