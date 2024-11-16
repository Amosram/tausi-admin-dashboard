import { ColumnDef } from "@tanstack/react-table";
import { OrdersTableData } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

const TruncatedCell = ({ content }: { content: string | null | undefined }) => {
  if (!content) return <span>-</span>;
  return (
    <span className="truncate block max-w-[150px]" title={content}>
      {content}
    </span>
  );
};

export const columns: ColumnDef<OrdersTableData>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected()
            ? true
            : table.getIsSomePageRowsSelected()
            ? "indeterminate"
            : false
        }
        onCheckedChange={(value) => {
          const isSelected = !!value;
          table.getRowModel().rows.forEach((row) => {
            row.toggleSelected(isSelected);
          });
        }}
        aria-label="Select all on this page"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => <TruncatedCell content={row.getValue("orderId")} />,
    enableSorting: true,
  },
  {
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => <TruncatedCell content={row.getValue("orderDate")} />,
    enableSorting: true,
  },
  {
    accessorKey: "serviceProvider",
    header: "Service Provider",
    cell: ({ row }) => <TruncatedCell content={row.getValue("serviceProvider")} />,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <TruncatedCell content={row.getValue("category")} />,
  },
  {
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <TruncatedCell content={row.getValue("location")} />,
  },
  {
    accessorKey: "contact",
    header: "Contact",
    cell: ({ row }) => <TruncatedCell content={row.getValue("contact")} />,
  },
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => console.log("View:", row.original)}>
              View details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Edit:", row.original)}>
              Edit order
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => console.log("Delete:", row.original)}>
              Delete order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
