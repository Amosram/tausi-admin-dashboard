import React from "react";
import { ordersColumns } from "../components/orders-columns";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import { useGetOrdersQuery, useSearchOrdersMutation } from "../api/ordersApi";
import TanStackTable from "@/components/ui/Table/Table";
import SearchBar from "@/components/ui/Table/SearchBar";
import { searchPresets, useSearch } from "@/hooks/useSearch";

const Orders: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetOrdersQuery(50);
  const { toast } = useToast();

  // Ensure initial data fallback
  const ordersData = data?.data || [];

  const searchableColumns = [
    "appointmentDate",
    "customerName",
    "status",
    "serviceType",
    "createdAt", // Default time filter column
  ];

  const {
    data: displayData,
    isSearchActive,
    isLoading: isSearchLoading,
    triggerSearch,
    clearSearch,
    searchParams: currentSearchParams,
  } = useSearch({
    initialData: ordersData, // Use ordersData as initial state
    searchMutation: useSearchOrdersMutation,
    searchableColumns: searchableColumns,
    onSearchError: (error) => {
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      });
      console.error("Search error:", error);
    },
    onClearSearch: () => {
      refetch(); // Refetch original data on clear
    },
  });

  // Retry logic for data fetching
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

  // Determine if data is empty
  const isDataEmpty =
    (!isLoading &&
      !isSearchActive &&
      (!ordersData || ordersData.length === 0)) ||
    (isSearchActive && (!displayData || displayData.length === 0));

  const handleClearFilters = () => {
    clearSearch(); // Clear all search and filter params
  };

  const handleCombinedSearch = (criteria) => {
    criteria.forEach(({ column, value, operator, timeRange }) => {
      triggerSearch(column, value, operator, timeRange);
    });
  };

  // Loading and error states
  if (isSearchLoading) return <Loader />;
  if (isLoading && !ordersData.length) return <Loader />;
  if (error && retryCount >= maxRetries && !ordersData.length)
    return <div>Error: Unable to load order data after multiple attempts.</div>;
  if (isDataEmpty) return <div>No orders found.</div>;

  return (
    <div>
      {/* SearchBar Component */}
      <SearchBar
        columns={searchableColumns}
        triggerSearch={triggerSearch}
        clearSearch={handleClearFilters}
        isSearchActive={isSearchActive}
      />

      {/* Preset Filter Buttons */}
      <div className="flex gap-2 my-4">
        {searchPresets.orders.defaultFilters.map((filter) => (
          <button
            key={filter.label}
            onClick={() =>
              handleCombinedSearch([
                {
                  column: filter.column,
                  value: filter.value,
                  operator: filter.operator,
                },
              ])
            }
            className={`px-4 py-2 rounded ${
              currentSearchParams?.column === filter.column &&
              currentSearchParams?.value === filter.value
                ? "bg-red-500"
                : "bg-blue-500"
            } text-white`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Render Table with fallback data */}
      <TanStackTable
        data={
          displayData?.length > 0 ? displayData : ordersData || []
        }
        columns={ordersColumns}
        dateSortingId="appointmentDate"
      />
    </div>
  );
};

export default Orders;
