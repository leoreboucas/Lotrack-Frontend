import { useEffect, useState } from "react";

import { httpService } from "@/services/httpService";
import type { IProductBalance } from "@/types/productBalance";

type UseProductBalanceResult = {
  data: IProductBalance | null;
  isLoading: boolean;
  error: Error | null;
};

export const useProductBalance = (productId: string | undefined): UseProductBalanceResult => {
  const [data, setData] = useState<IProductBalance | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!productId) {
      setIsLoading(false);
      return;
    }

    let cancelled = false;

    setIsLoading(true);
    setError(null);

    httpService
      .fetchJson<IProductBalance>(`/products/${productId}/balance`)
      .then((result) => {
        if (!cancelled) {
          setData(result);
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err : new Error("Erro ao buscar balanço"));
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  return { data, isLoading, error };
};