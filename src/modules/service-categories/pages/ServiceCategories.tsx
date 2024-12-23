import TanStackTable from '@/components/ui/Table/Table';
import React from 'react';
import { useGetServiceCategoriesQuery } from '../api/service-category';
import { ColumnDef } from '@tanstack/react-table';
import { ServiceCategory } from '@/models/user';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical } from 'lucide-react';

const ServiceCategories = () => {
  const { data, isLoading, isError, isFetching } = useGetServiceCategoriesQuery();

  console.log(data);

  const columns: ColumnDef<ServiceCategory>[] = [
    {
      id: "id",
      accessorKey: "id",
      header: "ID",
      cell: ({ row }) => <span>{row.getValue("id")}</span>,
      enableSorting: true,
    },
    {
      id: "name",
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <span>{row.getValue("name")}</span>,
      enableSorting: true,
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <span>{row.getValue("description")}</span>,
      enableSorting: true,
    },
    {
      id: "actions",
      enableHiding: true,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => console.log("Edit:", row.original)}
              className="cursor-pointer"
            >
                Edit Service Category
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Delete:", row.original)}
              className="bg-destructive text-white cursor-pointer"
            >
                Delete Service Category
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];
  return (
    <div className='px-6'>
      {!isLoading && data.data.length > 0 && <TanStackTable data={data.data} columns={columns} />}
    </div>

  );
};

export default ServiceCategories;