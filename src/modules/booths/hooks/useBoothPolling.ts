import { useEffect } from "react";
import { useGetBoothByIdQuery } from "../api/boothsApi";

export const useBoothPolling = (
  boothId: string,
  options?: {
    pollingInterval?: number;
    enabled?: boolean;
  }
) => {
  const { data, isLoading, isError, error, refetch } = useGetBoothByIdQuery(
    boothId,
    {
      skip: !boothId,
    }
  );

  useEffect(() => {
    const interval = options?.pollingInterval || 5000;

    if (options?.enabled !== false) {
      const pollTimer = setInterval(() => {
        refetch();
      }, interval);

      return () => clearInterval(pollTimer);
    }
  }, [boothId, options?.pollingInterval, options?.enabled, refetch]);

  return { data, isLoading, isError, error, refetch };
};
