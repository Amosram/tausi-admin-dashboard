import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useGetVerifiedBeauticiansQuery } from "../api/professionalApi";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { VerifiedBeauticians } from "@/models";
import { Link } from "react-router-dom";
import TanStackTable from "@/components/ui/Table/Table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";


const VerifiedBeuticans = () => {

  const {data, isLoading, isError} = useGetVerifiedBeauticiansQuery(10000);

  const STATUS_OPTIONS = [
    { label: "All Options", value: null }
  ];

  const columns: ColumnDef<VerifiedBeauticians>[] = [
    {
      accessorKey: "id",
      header: "Beutician ID",
      cell: ({row}) => (
        <Link
          to={`/beauticians/${row.getValue("id")}`}
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
      accessorKey: "businessName",
      header:"Bussiness Name",
      cell: ({row}) => <span>{row.original.businessName}</span>
    },
    {
      accessorKey: "businessType",
      header: "Bussiness Type",
      cell: ({row}) => <span>{row.original.businessType}</span>
    },
    {
      accessorKey: "locationAddress",
      header:"Location",
      cell: ({row}) => <span>{row.original.locationAddress}</span>
    },
    {
      id: "isVerified",
      accessorKey: "isVerified",
      header: "Status",
      cell: ({ row }) => {
        const isVerified = row.getValue("isVerified");
    
        if (isVerified === true) {
          return (
            <Badge className="bg-transparent font-semibold text-blue-900 text-md">
                Verified
            </Badge>
          );
        }
    
        if (isVerified === false) {
          return (
            <Badge className="bg-transparent font-semibold text-destructive text-md">
                Unverified
            </Badge>
          );
        }
    
        return <Badge variant="outline">Unknown</Badge>;
      },
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
                to={`/beauticians/${row.original.id}`}
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
    return <div>Loading...</div>;
  }
    
  if (isError) {
    return <div>Error loading Verified Beauticians</div>;
  }

  return (
    <div className="pr-6 pl-6">
      <TanStackTable
        data={data.data}
        columns={columns}
        STATUS_OPTIONS={STATUS_OPTIONS}
      />
    </div>
  );
};

export default VerifiedBeuticans;
