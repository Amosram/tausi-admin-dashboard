import React, { useEffect, useState } from "react";
import { ordersColumns } from "../components/orders-columns";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import { useGetOrdersQuery } from "../api/ordersApi";
import TanStackTable from "@/components/ui/Table/Table";
import { useLocation } from "react-router-dom";
import { Appointment } from "@/models";
import { TableFilters } from "@/components/ui/Filters/TableFilters";
import { TimeFilter } from "@/components/ui/Filters/TimeFilters";
import { filterDataByTime } from "@/components/ui/Filters/timeFilterUtils";

const Orders: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetOrdersQuery(50);
  const { toast } = useToast();
  const location = useLocation();

  const ordersData = data?.data || [];

  const [filteredData, setFilteredData] = useState<Appointment[]>([]);
  const [timeFilteredData, setTimeFilteredData] = useState<Appointment[]>([]);

  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  useEffect(() => {
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

  // Initial data setup and filtering
  useEffect(() => {
    if (ordersData.length > 0) {
      const searchParams = new URLSearchParams(location.search);
      const timeFilterParam = searchParams.get("timeFilter");

      const processedTimeFilteredData = filterDataByTime(
        ordersData,
        "createdAt",
        timeFilterParam
      );

      setTimeFilteredData(processedTimeFilteredData);

      // Then, handle status/other filtering based on URL
      const filterParam = searchParams.get("filter");
      let finalFilteredData = processedTimeFilteredData;

      if (filterParam) {
        switch (filterParam) {
          // Appointment Status
          case "pending":
            finalFilteredData = finalFilteredData.filter(
              (order) => order.status === "pending"
            );
            break;
          case "completed":
            finalFilteredData = finalFilteredData.filter(
              (order) => order.status === "completed"
            );
            break;
          case "cancelled":
            finalFilteredData = finalFilteredData.filter(
              (order) => order.status === "cancelled"
            );
            break;
          // Payment Status
          case "paid":
            finalFilteredData = finalFilteredData.filter(
              (order) => order.isPaid
            );
            break;
          case "unpaid":
            finalFilteredData = finalFilteredData.filter(
              (order) => !order.isPaid
            );
            break;
          // Booking Type
          case "group":
            finalFilteredData = finalFilteredData.filter(
              (order) => order.bookingForGroup
            );
            break;
          case "individual":
            finalFilteredData = finalFilteredData.filter(
              (order) => !order.bookingForGroup
            );
            break;
          // Price Range
          case "low":
            finalFilteredData = finalFilteredData.filter(
              (order) => order.totalPrice < 50
            );
            break;
          case "medium":
            finalFilteredData = finalFilteredData.filter(
              (order) => order.totalPrice >= 50 && order.totalPrice <= 150
            );
            break;
          case "high":
            finalFilteredData = finalFilteredData.filter(
              (order) => order.totalPrice > 150
            );
            break;
          case "active":
            finalFilteredData = finalFilteredData.filter(
              (order) => !order.isDeleted
            );
            break;
          default:
            finalFilteredData = processedTimeFilteredData;
        }
      }

      setFilteredData(finalFilteredData);
    }
  }, [ordersData, location.search]);

  const orderFilters = [
    { label: "All", value: null },
    { label: "Pending", value: "pending" },
    { label: "Completed", value: "completed" },
    { label: "Cancelled", value: "cancelled" },
    { label: "Paid", value: "paid" },
    { label: "Unpaid", value: "unpaid" },
    { label: "Group Booking", value: "group" },
    { label: "Individual Booking", value: "individual" },
    { label: "Low Price", value: "low" },
    { label: "Medium Price", value: "medium" },
    { label: "High Price", value: "high" },
    { label: "Active", value: "active" },
  ];

  const isDataEmpty = !ordersData || ordersData.length === 0;

  if (isLoading && isDataEmpty) return <Loader />;
  if (error && retryCount >= maxRetries && isDataEmpty)
    return <div>Error: Unable to load order data after multiple attempts.</div>;
  if (isDataEmpty) return <div>No orders found.</div>;

  return (
    <>
      <div className="md:px-4 px-1 my-4 flex gap-2 md:flex-row flex-col items-center">
        <div className="flex-1">
          <TableFilters filters={orderFilters} queryParam="filter" />
        </div>
        <TimeFilter
          queryParam="timeFilter"
          data={ordersData}
          field="createdAt"
          onFilter={setTimeFilteredData}
        />
      </div>
      <TanStackTable
        data={filteredData}
        columns={ordersColumns}
        dateSortingId="appointmentDate"
      />
    </>
  );
};

export default Orders;
