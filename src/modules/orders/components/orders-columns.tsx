import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { format, parse } from "date-fns";
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
      return (
        <Badge className="bg-transparent border-2 font-semibold text-md border-green-500 text-green-500">
          {status}
        </Badge>
      );
    case "pending":
      return (
        <Badge className="bg-transparent border-2 font-semibold text-md border-blue-500 text-blue-500">
          {status}
        </Badge>
      );
    case "cancelled":
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

  const dateObject = parse(orderDateString, 'M/d/yyyy', new Date());
  if (isNaN(dateObject.getTime())) {
    return 'Invalid date';
  }

  const formattedDate = format(dateObject, 'MMM dd, yyyy');
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
    id: "orderId",
    accessorKey: "orderId",
    header: "Order ID",
    cell: ({ row }) => (
      <Link
        to={`/orders/${row.getValue("orderId")}`}
        state={{ order: row.original }}
        className="hover:text-primary hover:underline truncate block max-w-[150px]"
      >
        {row.getValue("orderId")}
      </Link>
    ),
    enableSorting: true,
  },
  {
    id: "orderDate",
    accessorKey: "orderDate",
    header: "Order Date",
    cell: ({ row }) => {
      const orderDate = row.getValue("orderDate");
      const startTime = row.original.startTime;
      return <TruncatedCell content={formatDate(orderDate, startTime)} />;
    },
    enableSorting: true,
  },
  {
    id: "serviceProvider",
    accessorKey: "serviceProvider",
    header: "Service Provider",
    cell: ({ row }) => (
      <TruncatedCell content={row.getValue("serviceProvider")} />
    ),
    enableSorting: true,
  },
  {
    id: "category",
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => <TruncatedCell content={row.getValue("category")} />,
  },
  {
    id: "location",
    accessorKey: "location",
    header: "Location",
    cell: ({ row }) => <TruncatedCell content={row.getValue("location")} />,
  },
  {
    id: "contact",
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
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => getStatusBadge(row.getValue("status")),
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link
              to={`/orders/${row.original.orderId}`}
              state={{ order: row.original }}
              className="hover:text-primary"
            >
              View details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Edit:", row.original)}
            className="cursor-pointer"
          >
            Edit order
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete:", row.original)}
            className="bg-destructive text-white cursor-pointer"
          >
            Delete order
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
