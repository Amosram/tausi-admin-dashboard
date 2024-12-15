import { BoothAssignmentDetails } from "@/models";
import { useGetBoothByIdQuery } from "../api/boothsApi";

/**
 * Custom hook to fetch booth assignments by booth ID
 * @param {string} boothId - The ID of the booth
 * @returns {object} - Contains assignments, isLoading, isError, and error states
 */
export const useBoothAssignments = (boothId: string) => {
  const { data, isLoading, isError, error, refetch, isFetching } =
    useGetBoothByIdQuery(boothId, {
      skip: !boothId,
    });

  // Incase polling is needed
  //   const { data, isLoading, isError, error } = useBoothPolling(boothId, {
  //     pollingInterval: 5000,
  //     enabled: true,
  //   });

  const assignments: BoothAssignmentDetails[] = data?.data?.assignments || [];

  return { assignments, isLoading, isError, error, refetch, isFetching };
};
