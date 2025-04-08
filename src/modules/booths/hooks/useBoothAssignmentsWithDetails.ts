import { useGetAssignmentQuery } from "../api/boothsApi";

export const useBoothAssignmentsWithDetails = (assignmentId: string) => {
  const { data, isLoading, isError } = useGetAssignmentQuery(assignmentId);

  return {
    assignmentDetails: data,
    isLoading,
    isError,
  };
};

