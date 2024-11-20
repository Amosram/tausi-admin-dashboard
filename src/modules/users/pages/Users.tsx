import React from "react";
import { columns } from "../components/users-columns";
import { useFetchUsersQuery } from "@/modules/users/api";
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from "@/components/ui/sidebar";
import {
  DataTable,
  FilterOption,
} from "@/components/layout/DataTable/DataTable";
import Loader from "@/components/layout/Loader";

const Users: React.FC = () => {
  const { toast } = useToast();
  const { open, isMobile } = useSidebar();

  const {
    data: usersData,
    error,
    isLoading,
  } = useFetchUsersQuery(10000);

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

  const USER_OPTIONS: FilterOption[] = [
    { label: "All users", value: null },
    { label: "Service Providers", value: "client" },
    { label: "Clients", value: "client" },
    { label: "Internal Users", value: "client" },
  ];

  return (
    <div
      style={{
        maxWidth: isMobile
          ? "100vw"
          : open
          ? "calc(100vw - 18rem)"
          : "calc(100vw - 4rem)",
      }}
    >
      <DataTable
        columns={columns}
        data={usersData || []}
        filterConfig={{ field: "status", options: USER_OPTIONS }}
        sortByDate={false}
        btnText="Add User"
      />
    </div>
  );
};

export default Users;
