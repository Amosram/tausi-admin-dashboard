import React from "react";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import { useGetUsersQuery } from "../api/usersApi";
import { UserStats } from "../components/user-stats";
import { PartialUsersTable } from "../components/partial-users-table";
import { useNavigate } from "react-router-dom";

const Users: React.FC = () => {
  const { toast } = useToast();
  const { data, error, isLoading, refetch } = useGetUsersQuery(20000);
  const navigate = useNavigate();

  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const usersData =
    data
      ?.map((item) => ({
        ...item,
        role: item.sessionData?.userTypeSession,
      }))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()) || [];

  React.useEffect(() => {
    if (error) {
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount(retryCount + 1);
          refetch();
        }, 2000);
      } else {
        toast({
          title: "Data Load Error",
          description:
            "We encountered an issue loading user data. Please refresh the page or contact support if the issue persists.",
        });
      }
    }
  }, [error, toast, retryCount, refetch]);

  const isDataEmpty = !usersData || !usersData.length;

  if (isLoading && isDataEmpty) return <Loader />;
  if (error && retryCount >= maxRetries && isDataEmpty)
    return <div>Error: Unable to load user data after multiple attempts.</div>;
  if (isDataEmpty) return <div>No users found.</div>;

  return (
    <div className="p-3">
      <UserStats users={usersData} />
      <PartialUsersTable
        users={usersData}
        maxRows={2}
        onViewMore={() => navigate("/users/list")}
      />
    </div>
  );
};

export default Users;
