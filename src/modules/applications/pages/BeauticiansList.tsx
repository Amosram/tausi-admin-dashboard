import { Professional } from "@/models";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { useGetProfessionalsQuery, useSearchProfessionalsMutation } from "../api/professionalApi";
import TanStackTable from "@/components/ui/Table/Table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import Loader from "@/components/layout/Loader";
import BeauticianListStats from "../components/BeauticianListStats";
import { useSearch } from "@/hooks/useSearch";
import { toast } from "@/hooks/use-toast";
import SearchBar from "@/components/ui/Table/SearchBar";

const ProfessionalDashboard = () => {
  const {data, isLoading, isError, refetch} = useGetProfessionalsQuery(10_000);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const professionalData = data?.data || [];

  const columnLabels: Record<string, string> = {
    businessName: "Business",
    locationAddress: "Location",
  };

  const searchableColumns = Object.keys(columnLabels);

  const {
    data: displayData,
    isSearchActive,
    isLoading: isSearchLoading,
    triggerSearch,
    clearSearch,
  } = useSearch({
    initialData: professionalData,
    searchMutation: useSearchProfessionalsMutation,
    searchableColumns: searchableColumns,
    onSearchError: (error) => {
      toast({
        title: "Search Error",
        description: "Failed to perform search. Please try again.",
        variant: "destructive",
      });
      console.error("Search error:", error);
    },
    // Custom clear handler to refetch original data
    onClearSearch: () => {
      refetch();
    },
  });


  const handleStatusFilter = (status: string | null) => {
    setColumnFilters((prevFilters) => {
      const newFilters = prevFilters.filter((filter) => filter.id !== "isActive");
      if (status !== null) {
        newFilters.push({ id: "isActive", value: status === "Active" });
      }
      return newFilters;
    });
  };

  const STATUS_OPTIONS = useMemo(() => {
    if (!data?.data) return [];

    const uniqueStatuses = Array.from(
      new Set(data.data.map(item => item.isActive ? "Active" : "Inactive"))
    );

    return [
      { label: "All Statuses", value: null },
      ...uniqueStatuses.map(status => ({
        label: status,
        value: status
      }))
    ];
  }, [data]);

  const getStatusBadge = (status: string) => {
    switch (status) {
    case "Active":
      return (
        <Badge className="bg-transparent border-2 font-semibold text-md border-gray-500 text-gray-500">
          {status}
        </Badge>
      );
    case "inActive":
      return (
        <Badge className="bg-transparent border-2 font-semibold text-md border-red-500 text-red-500">
          {status}
        </Badge>
      );
    default:
      return (
        <Badge className="bg-transparent border-2 font-semibold text-md border-gray-500 text-gray-500">
          {status}
        </Badge>
      );
    }
  };

  const handleClearFilters = () => {
    clearSearch();
  };

  const TruncatedCell = ({ content }: { content: string | null | undefined }) => {
    if (!content) return <span>-</span>;
    return (
      <span className="truncate block max-w-[150px]" title={content}>
        {content}
      </span>
    );
  };

  const columns: ColumnDef<Professional>[] = [
    {
      id:"id",
      accessorKey: 'id',
      header: 'Beautician ID',
      cell: ({row}) => (
        <Link
          to={`/professionals/${row.getValue("id")}`}
          state={{professional: row.original}}
          className="hover:text-primary hover:underline truncate block max-w-[150px]"
        >
          {row.getValue("id")}
        </Link>
      ),
    },
    {
      id: "name",
      accessorKey: "user.name",
      header: "FullNames",
      cell: ({ row }) => <span>{row.original.user?.name || "-"}</span>
    },
    {
      id:"createdAt",
      accessorKey: "createdAt",
      header: "Date Applied",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return <span>{format(date, 'MMM dd, yyyy')}</span>;
      }
    },
    {
      id: "businessName",
      accessorKey: "businessName",
      header: "Business",
      cell: ({ row }) => <TruncatedCell content={row.getValue("businessName")} />,
    },
    {
      id: "locationAddress",
      accessorKey: "locationAddress",
      header: "Location",
      cell: ({ row }) => <TruncatedCell content={row.getValue("locationAddress")} />,
    },
    {
      id: "phoneNumber",
      accessorKey: "phoneNumber",
      header: "Contact",
      cell: ({ row }) => <span>{row.original.user?.phoneNumber || "-"}</span>
    },
    // {
    //   id: "isActive",
    //   accessorKey: "isActive",
    //   header: "Status",
    //   cell: ({row}) => getStatusBadge(row.getValue("isActive") ? "Active" : "Inactive")
    // },
    // {
    //   header: 'Actions',
    //   enableSorting: false,
    //   cell: ({ row }) => (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger className="h-8 w-8 p-0">
    //         <span className="sr-only">Open menu</span>
    //         <MoreVertical className="h-4 w-4" />
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end">
    //         <DropdownMenuItem>
    //           <Link
    //             to={`/professionals/${row.original.id}`}
    //             state={{ professional: row.original }}
    //             className="hover:text-primary"
    //           >
    //               View Beauticians Details
    //           </Link>
    //         </DropdownMenuItem>
    //         <DropdownMenuItem
    //           onClick={() => console.log("Edit:", row.original)}
    //           className="cursor-pointer"
    //         >
    //             Edit Beauticians
    //         </DropdownMenuItem>
    //         <DropdownMenuItem
    //           onClick={() => console.log("Delete:", row.original)}
    //           className="bg-destructive text-white cursor-pointer"
    //         >
    //             Deactivate Beauticians
    //         </DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    // }
  ];

  // const handleRowSelection = (selectedRows: Professional[]) => {
  //   console.log('Selected professionals:', selectedRows);
  //   // Handle selected rows as needed
  // };

  const handleCombinedSearch = (criteria, updateSearchParams = true) => {
    criteria.forEach(({ column, value, operator, timeRange }) => {
      triggerSearch(column, value, operator, timeRange, updateSearchParams);
    });
  };

  if (isLoading || isSearchLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error loading Beauticians List</div>;
  }

  return (
    <>
      <div className="pr-6 pl-6">
        {/* <Filters
        filters={searchPresets.professionals.defaultFilters}
        onFilterSelect={(filter) =>
          handleCombinedSearch([
            {
              column: filter.column,
              value: filter.value,
              operator: filter.operator,
            },
          ])
        }
      /> */}
        <BeauticianListStats beauticians={professionalData} />
        <SearchBar
          columns={searchableColumns}
          onSearch={(column, value, operator, timeRange) =>
            handleCombinedSearch([{ column, value, operator, timeRange }])
          }
          onClear={handleClearFilters}
          columnLabels={columnLabels}
        />


        {/**
         * Ensure you maintain how data is being passed to the table
         */}
        <TanStackTable
          data={isSearchActive ? displayData : professionalData}
          columns={columns}
          withSearch={false}
        />
      </div>
      {/* <div className="pr-6 pl-6">
      <BeauticianListStats beauticians={data.data} />
      <TanStackTable
        data={data.data}
        columns={columns}
        columnFilters={columnFilters}
        handleStatusFilter={handleStatusFilter}
        // STATUS_OPTIONS={STATUS_OPTIONS}
        onRowSelection={handleRowSelection}
      />
    </div> */}
    </>
  );
};

export default ProfessionalDashboard;