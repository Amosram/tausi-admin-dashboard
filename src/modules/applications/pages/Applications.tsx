import { Professional } from "@/models";
import { ColumnDef } from "@tanstack/react-table";
import { useGetProfessionalsQuery } from "../api/professionalApi";
import TanStackTable from "@/components/ui/Table/Table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";

const ProfessionalDashboard = () => {
  const {data, isLoading, isError} = useGetProfessionalsQuery();

  const getStatusBadge = (status: string) => {
    switch (status) {
    case "Pending":
      return (
        <Badge className="bg-transparent border-2 font-semibold text-md border-gray-500 text-gray-500">
          {status}
        </Badge>
      );
    case "In Review":
      return (
        <Badge className="bg-transparent border-2 font-semibold text-md border-blue-500 text-blue-500">
          {status}
        </Badge>
      );
    case "Rejected":
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

  const columns: ColumnDef<Professional>[] = [
    {
      accessorKey: 'id',
      header: 'Application ID',
      cell: ({row}) => (
        <div className="flex items-center space-x-2">
          <span>{row.original.id}</span>
        </div>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Date Applied",
      cell: ({ row }) => {
        const date = new Date(row.original.createdAt);
        return <span>{format(date, 'MMM dd, yyyy')}</span>;
      }
    },
    {
      accessorKey: "businessName",
      header: "Beutician",
      cell: ({row}) => <span>{row.original.businessName}</span>
    },
    {
      accessorKey: "locationAddress",
      header: "Location",
      cell: ({row}) => <span>{row.original.locationAddress}</span>
    },
    {
      accessorKey: "user.phoneNumber",
      header: "Contact",
      cell: ({ row }) => <span>+{row.original.user?.phoneNumber || "N/A"}</span>
    },
    {
      accessorKey: "isVerified",
      header: "Status",
      cell: ({row}) => getStatusBadge(row.original.isVerified ? "Verified" : "Pending")
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
                to={`/professional/${row.original.id}`}
                state={{ professional: row.original }}
                className="hover:text-primary"
              >
                  View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Edit:", row.original)}
              className="cursor-pointer"
            >
                Edit professional
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Delete:", row.original)}
              className="bg-destructive text-white cursor-pointer"
            >
                Delete professional
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
    return <div>Error loading Countries</div>;
  }

  return (
    <TanStackTable data={data.data} columns={columns} />
  );
};

export default ProfessionalDashboard;