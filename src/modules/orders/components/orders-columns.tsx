import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { OrdersTableData } from "../types";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FaPhoneAlt } from "react-icons/fa";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "completed":
      return <Badge className="bg-transparent border-2 font-semibold text-md border-green-500 text-green-500">{status}</Badge>;
    case "pending":
      return <Badge className="bg-transparent border-2 font-semibold text-md border-blue-500 text-blue-500">{status}</Badge>;
    case "cancelled":
      return <Badge className="bg-transparent border-2 font-semibold text-md border-red-500 text-red-500">{status}</Badge>;
    default:
      return <Badge className="bg-transparent border-2 font-semibold text-md border-gray-500 text-gray-500">{status}</Badge>;
  }
};

const TruncatedCell = ({ content }: { content: string | null | undefined }) => {
  if (!content) return <span>-</span>;
  return (
    <span className="truncate block max-w-[150px]" title={content}>
      {content}
    </span>
  );
};

const formatDate = (orderDate: unknown, startTime: unknown) => {
  const orderDateString = orderDate as string;
  const startTimeString = startTime as string;

  const dateObject = new Date(orderDateString);
  const formattedDate = format(dateObject, "MMM dd, yyyy");

  const formattedTime = startTimeString;
  
  return `${formattedDate} at ${formattedTime}`;
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
    cell: ({ row }) => {
      const orderDate = row.getValue("orderDate");
      const startTime = row.original.startTime;
      return <span>{formatDate(orderDate, startTime)}</span>;
    },
    enableSorting: true,
  },
  {
    accessorKey: "serviceProvider",
    header: "Service Provider",
    cell: ({ row }) => (
      <TruncatedCell content={row.getValue("serviceProvider")} />
    ),
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
    cell: ({ row }) => {
      const contact = row.getValue("contact") as string;
      return (
        <div className="flex items-center space-x-2">
          <FaPhoneAlt className="text-gray-500" />
          <span>{contact}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
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
            <DropdownMenuItem
              onClick={() => console.log("View:", row.original)}
            >
              View details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Edit:", row.original)}
            >
              Edit order
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => console.log("Delete:", row.original)}
            >
              Delete order
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
