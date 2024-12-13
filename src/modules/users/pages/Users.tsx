import React from "react";
import { usersColumns } from "../components/users-columns";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import { useGetUsersQuery } from "../api/usersApi";
import TanStackTable from "@/components/ui/Table/Table";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Users: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data, error, isLoading, refetch } = useGetUsersQuery(2000);

  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const usersData =
    data?.map((item) => ({
      ...item,
      role: item.sessionData?.userTypeSession,
    })) || [];

  const ROLE_OPTIONS = [
    { label: "All Roles", value: null },
    { label: "Service Providers", value: "professional" },
    { label: "Clients", value: "client" },
    { label: "Internal Users", value: "user" },
  ];

  const AddUserButton = {
    label: "Add User",
    onClick: () => navigate("/users/create-user"),
    className: "rounded-3xl",
    icon: <FaPlus size={20} />,
  };

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
    <TanStackTable
      data={usersData}
      columns={usersColumns}
      columnToBeFiltered="role"
      STATUS_OPTIONS={ROLE_OPTIONS}
      button={AddUserButton}
    />
  );
};

export default Users;
