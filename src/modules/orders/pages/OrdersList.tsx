import React from "react";
import { ordersColumns } from "../components/orders-columns";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import { useGetOrdersQuery, useSearchOrdersMutation } from "../api/ordersApi";
import TanStackTable from "@/components/ui/Table/Table";
import SearchBar from "@/components/ui/Table/SearchBar";
import { searchPresets, useSearch } from "@/hooks/useSearch";
import Filters from "@/components/ui/Table/Filters";

const OrdersList: React.FC = () => {
  const { data, error, isLoading, refetch } = useGetOrdersQuery(50);
  const { toast } = useToast();

  const ordersData = data?.data || [];

  const columnLabels: Record<string, string> = {
    // professionalId: "Professional ID",
    // clientId: "Client ID",
    locationAddress: "Location Address",
    amountUpfront: "Upfront Amount",
    totalPrice: "Total Price"
    // serviceId: "Service ID",
    // id: "Order ID",
  };

  const searchableColumns = Object.keys(columnLabels);

  const {
    data: displayData,
    isSearchActive,
    isLoading: isSearchLoading,
    triggerSearch,
    clearSearch,
  } = useSearch({
    initialData: ordersData,
    searchMutation: useSearchOrdersMutation,
    searchableColumns: searchableColumns,
    onSearchError: (error) => {
      toast({
        title: "Search Failed",
        description: "No results found. Consider trying other filters.",
        variant: "destructive",
      });
      console.error("Search error:", error);
    },
    onClearSearch: () => {
      refetch();
    },
  });

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

  const handleClearFilters = () => {
    clearSearch(); // Clear all search and filter params
  };

  const handleCombinedSearch = (criteria, updateSearchParams = true) => {
    criteria.forEach(({ column, value, operator, timeRange }) => {
      triggerSearch(column, value, operator, timeRange, updateSearchParams);
    });
  };

  if (isSearchLoading) {
    return <Loader />;
  }
  if (isLoading && isDataEmpty) return <Loader />;
  if (error && retryCount >= maxRetries && isDataEmpty)
    return <div>Error: Unable to load order data after multiple attempts.</div>;
  if (isDataEmpty) return <div>No orders found.</div>;

  return (
    <div className="">
      <Filters
        filters={searchPresets.orders.defaultFilters}
        onFilterSelect={(filter) =>
          handleCombinedSearch([
            {
              column: filter.column,
              value: filter.value,
              operator: filter.operator,
            },
          ])
        }
      />

      <SearchBar
        columns={searchableColumns}
        onSearch={(column, value, operator, timeRange) =>
          handleCombinedSearch([{ column, value, operator, timeRange }])
        }
        onClear={handleClearFilters}
        columnLabels={columnLabels}
      />

      <div className="pl-6 pr-1">
        <TanStackTable
          data={isSearchActive ? displayData : ordersData}
          columns={ordersColumns}
          dateSortingId="appointmentDate"
          withSearch={false}
        />
      </div>
    </div>
  );
};

export default OrdersList;
