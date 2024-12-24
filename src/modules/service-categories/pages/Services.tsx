import { useToast } from "@/hooks/use-toast";
import { useGetAllServicesQuery } from "../api/service-category";
import Loader from "@/components/layout/Loader";
import { ColumnDef } from "@tanstack/react-table";
import type { Services } from "@/models/user";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import TanStackTable from "@/components/ui/Table";

const Services = () => {

  const {data, isLoading, isError} = useGetAllServicesQuery();

  const toast = useToast();

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    <div>Error Fetching table data</div>;
  }

  const columns: ColumnDef<Services>[] = [
    { accessorKey: 'id', header: 'ID' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'description', header: 'Description' },
    {accessorKey: 'minimumPrice', header: 'Minimum Price'},
    {accessorKey: "serviceCategory.name", header: "Service Category"},
    {
      id: 'actions',
      cell: (row) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem
              className="bg-destructive text-white"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
  ];

  return (
    <div className="px-6">
      {data?.data.length > 0 && <TanStackTable
        data={data.data}
        columns={columns}
      />
      }
    </div>
  );
};

export default Services;