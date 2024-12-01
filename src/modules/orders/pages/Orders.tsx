import React from "react";
import { ordersColumns } from "../components/orders-columns";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import { useGetOrdersQuery } from "../api/ordersApi";
import TanStackTable from "@/components/ui/Table/Table";

const Orders: React.FC = () => {
  const { toast } = useToast();
  const { data, error, isLoading, refetch } = useGetOrdersQuery(50);

  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const STATUS_OPTIONS = [
    { label: "All Statuses", value: null },
    { label: "Completed", value: "completed" },
    { label: "Pending", value: "pending" },
    { label: "Cancelled", value: "cancelled" },
  ];

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
            "We couldn't load order data. Please refresh the page or contact support for assistance.",
        });
      }
    }
  }, [error, toast, retryCount, refetch]);

  const ordersData = data?.data;

  const isDataEmpty = !ordersData || !ordersData.length;

  if (isLoading && isDataEmpty) return <Loader />;
  if (error && retryCount >= maxRetries && isDataEmpty)
    return <div>Error: Unable to load order data after multiple attempts.</div>;
  if (isDataEmpty) return <div>No orders found.</div>;

  return (
    <TanStackTable
      data={ordersData}
      columns={ordersColumns}
      STATUS_OPTIONS={STATUS_OPTIONS}
      dateSortingId="appointmentDate"
    />
  );
};

export default Orders;
