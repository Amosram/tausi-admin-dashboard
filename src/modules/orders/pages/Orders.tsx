import React from "react";
import { columns } from "../components/orders-columns";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import { useGetOrdersQuery } from "../api/ordersApi";
import TanStackTable from "@/components/ui/Table/Table";

const Orders: React.FC = () => {
  const { toast } = useToast();

  const { data, error, isLoading } = useGetOrdersQuery(50);

  React.useEffect(() => {
    if (error) {
      toast({
        title: "Error fetching data",
        description: "Failed to load orders. Please try again later.",
      });
    }
  }, [error, toast]);

  const ordersData = data?.data;

  const isDataEmpty = !ordersData || !ordersData;

  if (isLoading && isDataEmpty) return <Loader />;
  if (error && isDataEmpty) return <div>Error: Unable to load orders.</div>;
  if (isDataEmpty) return <div>No orders found.</div>;

  return <TanStackTable data={ordersData || []} columns={columns} />;
};

export default Orders;
