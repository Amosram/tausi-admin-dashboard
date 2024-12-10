import { Professional } from "@/models";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { useGetProfessionalsQuery } from "../api/professionalApi";
import TanStackTable from "@/components/ui/Table/Table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import Loader from "@/components/layout/Loader";

const ProfessionalDashboard = () => {
  const {data, isLoading, isError} = useGetProfessionalsQuery(10000);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);


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

  const columns: ColumnDef<Professional>[] = [
    {
      accessorKey: 'id',
      header: 'Application ID',
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
      cell: ({ row }) => <span>{row.original.user?.phoneNumber || "N/A"}</span>
    },
    // {
    //   id: "isActive",
    //   accessorKey: "isActive",
    //   header: "Status",
    //   cell: ({row}) => getStatusBadge(row.getValue("isActive") ? "Active" : "Inactive")
    // },
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
                to={`/professionals/${row.original.id}`}
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
                Deactivate Beauticians
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
  ];

  const handleRowSelection = (selectedRows: Professional[]) => {
    console.log('Selected professionals:', selectedRows);
    // Handle selected rows as needed
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error loading Beauticians List</div>;
  }

  return (
    <div className="pr-6 pl-6">
      <TanStackTable
        data={data.data}
        columns={columns}
        columnFilters={columnFilters}
        handleStatusFilter={handleStatusFilter}
        // STATUS_OPTIONS={STATUS_OPTIONS}
        onRowSelection={handleRowSelection}
      />
    </div>
  );
};

export default ProfessionalDashboard;