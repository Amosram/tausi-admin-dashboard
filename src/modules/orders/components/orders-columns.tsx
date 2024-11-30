import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FaPhoneAlt } from "react-icons/fa";
import { Appointment } from "@/models";

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

export const ordersColumns: ColumnDef<Appointment>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => (
      <Link
        to={`/orders/${row.getValue("id")}`}
        state={{ order: row.original }}
        className="hover:text-primary hover:underline truncate block max-w-[150px]"
      >
        {row.getValue("id")}
      </Link>
    ),
    enableSorting: true,
  },
  {
    id: "appointmentDate",
    accessorKey: "appointmentDate",
    header: "Order Date",
    cell: ({ row }) => {
      const appointmentDate = row.getValue("appointmentDate") as string;
      const formattedDate = appointmentDate
        ? format(new Date(appointmentDate), "MMM dd, yyyy")
        : "Invalid date";
      return <TruncatedCell content={formattedDate} />;
    },
    enableSorting: true,
  },
  {
    id: "professional.businessName",
    accessorKey: "professional.businessName",
    header: "Service Provider",
    cell: ({ row }) => (
      <TruncatedCell content={row.getValue("professional.businessName")} />
    ),
    enableSorting: true,
  },
  {
    id: "service.category",
    accessorKey: "service.category",
    header: "Category",
    cell: ({ row }) => (
      <TruncatedCell content={row.getValue("service.category")} />
    ),
  },
  {
    id: "locationAddress",
    accessorKey: "locationAddress",
    header: "Location",
    cell: ({ row }) => (
      <TruncatedCell content={row.getValue("locationAddress")} />
    ),
  },
  {
    id: "client.phoneNumber",
    accessorKey: "client.phoneNumber",
    header: "Contact",
    cell: ({ row }) => {
      const contact = row.getValue("client.phoneNumber") as string;
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
              to={`/orders/${row.original.id}`}
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
