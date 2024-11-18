import React, { useEffect } from "react";
import { OrdersDataTable } from "../components/orders-data-table";
import { columns } from "../components/orders-columns";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchOrders, setInitialized } from "@/redux/reducers/ordersSlice";
import { useToast } from "@/hooks/use-toast";
import { useSidebar } from "@/components/ui/sidebar";

const Orders: React.FC = () => {
  const { toast } = useToast();
  const { open, isMobile } = useSidebar();
  const dispatch = useAppDispatch();
  const { data, loading, error, lastUpdated, isInitialized } = useAppSelector(
    (state) => state.orders
  );

  useEffect(() => {
    if (!isInitialized) {
      dispatch(setInitialized());
    }
  }, [dispatch, isInitialized]);

  useEffect(() => {
    if (!isInitialized) return;

    // Only fetch if we have no data or it's been more than 5 minutes since last update
    const shouldFetch =
      !data.length ||
      (lastUpdated &&
        Date.now() - new Date(lastUpdated).getTime() > 5 * 60 * 1000);

    if (shouldFetch) {
      dispatch(fetchOrders(50))
        .unwrap()
        .catch(() => {
          toast({
            title: "Error fetching data",
            description: "Showing cached data",
          });
        });
    }
  }, [dispatch, isInitialized, data.length, lastUpdated]);

  if (!isInitialized) return <div>Loading...</div>;
  if (loading && !data.length) return <div>Loading...</div>;
  if (error && !data.length) return <div>Error: {error}</div>;
  if (!data.length) return <div>No orders found.</div>;

  if (isMobile) {
    return (
      <div className="max-w-[100vw] w-full">
        {loading && <p className="text-sm text-blue-500 mb-4">Refreshing...</p>}
        <div className="w-full">
          <OrdersDataTable columns={columns} data={data} />
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: open ? "calc(100vw - 18rem)" : "calc(100vw - 4rem)" }}>
      {loading && <p className="text-sm text-blue-500 mb-4">Refreshing...</p>}
      <div className="w-full">
        <OrdersDataTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export default Orders;