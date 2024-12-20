import { BoothLog } from "@/models";
import { useGetBoothByIdQuery } from "@/modules/booths/api/boothsApi";

/**
 * Custom hook to fetch booth logs by booth ID
 * @param {string} boothId - The ID of the booth
 * @returns {object} - Contains logs, isLoading, isError, and error states
 */
export const useBoothLogs = (boothId: string) => {
  const { data, isLoading, isError, error } = useGetBoothByIdQuery(boothId, {
    skip: !boothId,
  });

  const logs: BoothLog[] = data?.data?.logs || [];

  return { logs, isLoading, isError, error };
};
