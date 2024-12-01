import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useGetVerifiedBeauticiansQuery } from "../api/professionalApi";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { VerifiedBeauticians } from "@/models";
import { Link } from "react-router-dom";
import TanStackTable from "@/components/ui/Table/Table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import Loader from "@/components/layout/Loader";


const VerifiedBeuticans: React.FC = () => {

  const {data, isLoading, isError} = useGetVerifiedBeauticiansQuery(10000);

  const STATUS_OPTIONS = useMemo(() => {
    if (!data?.data) return [];
    
    const uniqueStatuses = Array.from(
      new Set(data.data.map(item => item.verificationData.verificationStatus))
    );

    return [
      { label: "All Statuses", value: null },
      ...uniqueStatuses.map(verificationStatus => ({
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

  const columns: ColumnDef<VerifiedBeauticians>[] = [
    {
      accessorKey: "id",
      header: "Beutician ID",
      cell: ({row}) => (
        <Link
          to={`/dashboard/verifications/${row.getValue("id")}`}
          state={{verifiedBeautician: row.original}}
          className="hover:text-primary hover:underline truncate block max-w-[150px]"
        >
          {row.original.id}
        </Link>
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
      cell: ({ row }) => getStatusBadge(row.getValue("verificationStatus"))
    },
    {
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link
                to={`/dashboard/verifications/${row.original.id}`}
                state={{ professional: row.original }}
                className="hover:text-primary"
              >
                        View Beauticians Details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Edit:", row.original)}
              className="cursor-pointer"
            >
                      Edit Beauticians
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Delete:", row.original)}
              className="bg-destructive text-white cursor-pointer"
            >
                      Delete Beauticians
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
  ];

  if (isLoading) {
    return <Loader />;
  }
    
  if (isError) {
    return <div>Error loading Verified Beauticians</div>;
  }

  return (
    <div className="pr-6 pl-6">
      <TanStackTable
        data={data.data}
        columns={columns}
        columnToBeFiltered="verificationStatus"
        STATUS_OPTIONS={STATUS_OPTIONS}
      />
    </div>
  );
};

export default VerifiedBeuticans;
