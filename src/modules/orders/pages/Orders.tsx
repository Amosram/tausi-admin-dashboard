import React from "react";
import { columns } from "../components/orders-columns";
import { useFetchOrdersQuery } from "@/modules/orders/api";
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from "@/components/ui/sidebar";
import { DataTable, FilterOption } from "@/components/layout/DataTable/DataTable";
import Loader from "@/components/layout/Loader";

const Orders: React.FC = () => {
  const { toast } = useToast();
  const { open, isMobile } = useSidebar();

  const {
    data: ordersData,
    error,
    isLoading,
  } = useFetchOrdersQuery(50, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching data",
        description: "Failed to load orders. Please try again later.",
      });
    }
  }, [error, toast]);

  const isDataEmpty = !ordersData || !ordersData.length;

  if (isLoading && isDataEmpty) return <Loader />;
  if (error && isDataEmpty) return <div>Error: Unable to load orders.</div>;
  if (isDataEmpty) return <div>No orders found.</div>;

  const STATUS_OPTIONS: FilterOption[] = [
    { label: "All Statuses", value: null },
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
    { label: "Cancelled", value: "cancelled" },
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
        data={ordersData || []}
        filterConfig={{ field: "status", options: STATUS_OPTIONS }}
        sortByDate={true}
      />
    </div>
  );
};

export default Orders;
