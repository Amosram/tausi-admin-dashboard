import { useGetVerifiedBeauticiansQuery, useSearchProfessionalsMutation, useUpdateverifiedBeauticiansMutation } from "../api/professionalApi";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { VerifiedBeauticians } from "@/models";
import { Link } from "react-router-dom";
import TanStackTable from "@/components/ui/Table/Table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import Loader from "@/components/layout/Loader";
import { useToast } from "@/hooks/use-toast";
import UnVerifiedBeauticianStats from "../components/UnVerifiedStats";
import { useSearch } from "@/hooks/useSearch";
import SearchBar from "@/components/ui/Table/SearchBar";


const VerifiedBeuticans: React.FC = () => {

  const {data, isLoading, isError, refetch} = useGetVerifiedBeauticiansQuery(10000);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const applicationData = data?.data || [];

  const columnLabels: Record<string, string> = {
    businessName: "Business",
    locationAddress: "Location",
  };

  const searchableColumns = Object.keys(columnLabels);
  
  const toast = useToast();
  
  const {
    data: displayData,
    isSearchActive,
    isLoading: isSearchLoading,
    triggerSearch,
    clearSearch,
  } = useSearch({
    initialData: applicationData,
    searchMutation: useSearchProfessionalsMutation,
    searchableColumns: searchableColumns,
    onSearchError: (error) => {
      toast.toast({
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
      new Set(data.data.map(item => item.verificationData.verificationStatus))
    );

    const filteredStatuses = uniqueStatuses.filter(
      (status: string) => status !== "approved"
    );

    // remove filteredStatuses to uniqueStatuses (if there are no any fixes for approved status)

    return [
      { label: "All Statuses", value: null },
      ...filteredStatuses.map(verificationStatus => ({
        label: verificationStatus,
        value: verificationStatus
      }))
    ];
  }, [data]);

  const getStatusBadge = (verificationStatus: string) => {
    switch (verificationStatus) {
    case "pending":
      return (
        <Badge className="bg-transparent border-2 font-semibold text-md border-gray-500 text-gray-500">
          {verificationStatus}
        </Badge>
      );
    case "review":
      return (
        <Badge className="bg-transparent border-2 font-semibold text-md border-blue-500 text-blue-500">
          {verificationStatus}
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-transparent border-2 font-semibold text-md border-red-500 text-red-500">
          {verificationStatus}
        </Badge>
      );
    default:
      return (
        <Badge className="bg-transparent border-2 font-semibold text-md border-gray-500 text-gray-500">
          {verificationStatus}
        </Badge>
      );
    }
  };

  const BeauticianIdCell: React.FC<{
    id: string;
    verificationStatus: string;
    originalData: VerifiedBeauticians;
  }> = ({ id, verificationStatus, originalData }) => {
    const [updateVerifiedBeauticians] = useUpdateverifiedBeauticiansMutation();
  
    const handleIdClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault();
  
      if (verificationStatus === "pending") {
        try {
          await updateVerifiedBeauticians({
            id: id,
            verificationStatus: "review",
            verificationTitle: "Your verification status is under review",
            verificationDescription: "Your verification status is under review while we verify your details",
          }).unwrap();
        } catch (error) {
          toast.toast({
            "title": "Error",
            "description": "Failed to update verification status",
            "variant": "destructive",
          });
          return;
        }
      }
  
      // Navigate after successful update
      window.location.href = `/dashboard/verifications/${id}`;
    };
  
    return (
      <Link
        to={`/dashboard/verifications/${id}`}
        state={{ verifiedBeautician: originalData }}
        onClick={handleIdClick}
        className="hover:text-primary hover:underline truncate block max-w-[150px]"
      >
        {id}
      </Link>
    );
  };

  const handleClearFilters = () => {
    clearSearch();
  };

  const columns: ColumnDef<VerifiedBeauticians>[] = [
    {
      accessorKey: "id",
      header: "Beautician ID",
      cell: ({ row }) => (
        <BeauticianIdCell
          id={row.original.id}
          verificationStatus={row.original.verificationData?.verificationStatus || "unknown"}
          originalData={row.original}
        />
      ),
    },
    {
      accessorKey:'user.name',
      header: "FullNames",
      cell: ({row}) => <span>{row.original?.user.name}</span>
    },
    {
      accessorKey: 'user.email',
      header: "Email Address",
      cell: ({row}) => <span>{row.original?.user.email}</span>
    },
    {
      accessorKey: "user.phoneNumber",
      header: "Phone Number",
      cell: ({row}) => <span>{row.original.user.phoneNumber}</span>
    },
    {
      accessorKey: "businessName",
      header:"Bussiness Name",
      cell: ({row}) => <span>{row.original.businessName}</span>
    },
    {
      accessorKey: "locationAddress",
      header:"Location",
      cell: ({row}) => <span>{row.original.locationAddress}</span>
    },
    {
      accessorKey: "createdAt",
      header: "Creation Date",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return <span>{format(date, 'MMM dd, yyyy')}</span>;
      }
    },
    {
      id: "verificationStatus",
      accessorKey: "verificationData.verificationStatus",
      header: "Verification Status",
      cell: ({ row }) => getStatusBadge(row.getValue("verificationStatus") ? row.getValue("verificationStatus") : "approved")
    },
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
    //             to={`/dashboard/verifications/${row.original.id}`}
    //             state={{ professional: row.original }}
    //             className="hover:text-primary"
    //           >
    //                     View Beauticians Details
    //           </Link>
    //         </DropdownMenuItem>
    //         <DropdownMenuItem
    //           onClick={() => console.log("Edit:", row.original)}
    //           className="cursor-pointer"
    //         >
    //                   Edit Beauticians
    //         </DropdownMenuItem>
    //         <DropdownMenuItem
    //           onClick={() => console.log("Delete:", row.original)}
    //           className="bg-destructive text-white cursor-pointer"
    //         >
    //                   Delete Beauticians
    //         </DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    // }
  ];

  const handleCombinedSearch = (criteria, updateSearchParams = true) => {
    criteria.forEach(({ column, value, operator, timeRange }) => {
      triggerSearch(column, value, operator, timeRange, updateSearchParams);
    });
  };

  if (isLoading || isSearchLoading) {
    return <Loader />;
  }
    
  if (isError) {
    return <div>Error loading Verified Beauticians</div>;
  }


  return (
    <>
      <div className="pr-6 pl-6">
        < UnVerifiedBeauticianStats beauticians = { data.data } />
        {/* TODO: ENSURE CORRECT IMPLEMENTATION AFTER BACKEND FIX */}
        {/* <Filters
        filters={searchPresets.applications.defaultFilters}
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
          data={isSearchActive ? displayData : applicationData}
          columns={columns}
          withSearch={false}
          columnFilters={columnFilters}
        />
      </div>
      {/* <div className="pr-6 pl-6">
       <UnVerifiedBeauticianStats beauticians={data.data} />
       <TanStackTable
         data={data.data}
         columns={columns}
         columnToBeFiltered="verificationStatus"
         STATUS_OPTIONS={STATUS_OPTIONS}
       />
     </div> */}

    </>
  );
};

export default VerifiedBeuticans;
