import React from "react";
import { columns } from "../components/users-columns";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import { useGetUsersQuery } from "../api/useraApi";
import TanStackTable from "@/components/ui/Table/Table";

const Users: React.FC = () => {
  const { toast } = useToast();

  const { data: usersData, error, isLoading } = useGetUsersQuery(10000);

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching data",
        description: "Failed to load orders. Please try again later.",
      });
    }
  }, [error, toast]);

  const isDataEmpty = !usersData || !usersData.length;

  if (isLoading && isDataEmpty) return <Loader />;
  if (error && isDataEmpty) return <div>Error: Unable to load users.</div>;
  if (isDataEmpty) return <div>No users found.</div>;

  return <TanStackTable data={usersData || []} columns={columns} />;
};

export default Users;
