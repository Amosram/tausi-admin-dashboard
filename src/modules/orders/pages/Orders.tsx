import React from "react";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import { useGetOrdersQuery } from "../api/ordersApi";
import { PartialOrdersTable } from "../components/partial-table";
import OrdersChart from "@/components/layout/OrdersChart";

const Orders: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetOrdersQuery(50);
  const { toast } = useToast();

  const ordersData = data?.data || [];

  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

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

  const isDataEmpty = !ordersData || ordersData.length === 0;
  if (isLoading && isDataEmpty) return <Loader />;
  if (error && retryCount >= maxRetries && isDataEmpty)
    return <div>Error: Unable to load order data after multiple attempts.</div>;
  if (isDataEmpty) return <div>No orders found.</div>;

  return (
    <div className=" flex flex-col gap-5 px-6 py-6">
      <div className="shadow-lg bg-white">
        <h1 className="text-center font-bold text-xl uppercase underline mt-2">
          Orders Chart
        </h1>
        <div className="flex space-x-4 mb-4 justify-center mt-3">
          <div className="flex items-center">
            <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2"></span>
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Completed
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2"></span>
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Pending
            </span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2"></span>
            <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Cancelled
            </span>
          </div>
        </div>
        <OrdersChart />
      </div>
      <div className="w-full">
        <PartialOrdersTable orders={ordersData} />
      </div>
    </div>
  );
};

export default Orders;
