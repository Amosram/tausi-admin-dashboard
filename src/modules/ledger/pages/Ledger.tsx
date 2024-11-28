import { useState } from "react";
import { useGetLedgersQuery } from "../api/ledgersApi";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ledgers } from "@/models";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/components/layout/Loader";
import TanStackTable from "@/components/ui/Table";
import { FaPlus } from "react-icons/fa";


const Ledger = () => {

  const navigate = useNavigate();

  const {data, isLoading, isError} = useGetLedgersQuery();

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const columns: ColumnDef<Ledgers>[] = [
    {
      accessorKey: 'id',
      header: 'Ledger ID',
      cell: ({row}) => (
        <div className="flex items-center space-x-2">
          <span>{row.original.id}</span>
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({row}) => (
        <span>{row.original.name}</span>
      )
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({row}) => <span>{row.original.description}</span>
    },
    {
      accessorKey:'createdAt',
      header: 'Creation Date',
      cell: ({row}) => {
        const date = new Date(row.original.createdAt);
        return <span>{format(date, 'MMM dd, yyyy')}</span>;
      }
    },
    {
      accessorKey:'ownerId',
      header: 'Owner ID',
      cell: ({row}) => <span>{row.original.ownerId}</span>
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
                to={`/ledgers/${row.original.id}`}
                state={{ ledger: row.original }}
                className="hover:text-primary"
              >
                    View details
              </Link>
            </DropdownMenuItem>
            {/* <DropdownMenuItem
                onClick={() => console.log("Edit:", row.original)}
                className="cursor-pointer"
              >
                  Edit professional
              </DropdownMenuItem> */}
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

  const handleRowSelection = (selectedRows: Ledgers[]) => {
    console.log('Selected professionals:', selectedRows);
    // Handle selected rows as needed
  };

  const AddLoanButton = {
    label: "Add Loan",
    onClick: () => navigate("/ledgers/create-loan"),
    className: "rounded-3xl",
    icon: <FaPlus size={20} />,
  };

  if (isLoading){
    return <Loader />;
  }

  if (isError) {
    return <div>Error loading Ledgers</div>;
  }

  return (
    <TanStackTable
      data={data.data}
      columns={columns}
      onRowSelection={handleRowSelection}
      button={AddLoanButton}
    />
  );
};

export default Ledger;