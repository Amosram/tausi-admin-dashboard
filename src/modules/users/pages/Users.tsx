import React from "react";
import { columns } from "../components/users-columns";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import { useGetUsersQuery } from "../api/useraApi";
import TanStackTable from "@/components/ui/Table/Table";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Users: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetUsersQuery(10000);

  const usersData = data?.map((item) => ({
    ...item.users,
    role: item.userSessionData?.userTypeSession,
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
      console.error("Error fetching users:", error);
      toast({
        title: "Error fetching data",
        description: "Failed to load users. Please try again later.",
      });
    }
  }, [error, toast]);

  const isDataEmpty = !usersData || !usersData.length;

  if (isLoading) return <Loader />;
  if (error) return <div>Error: Unable to load users.</div>;
  if (isDataEmpty) return <div>No users found.</div>;

  return (
    <TanStackTable
      data={usersData}
      columns={columns}
      columnToBeFiltered="role"
      STATUS_OPTIONS={ROLE_OPTIONS}
      button={AddUserButton}
    />
  );
};

export default Users;
