import { ColumnDef } from "@tanstack/react-table";
import { Appointment } from "@/models";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export const boothOrderColumns: ColumnDef<Appointment>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Order ID",
    cell: ({ row }) => {
      const id = row.getValue("id");
      return (
        <Link
          to={`/orders/${id}`}
          className="hover:text-primary hover:underline"
        >
          {String(id)}
        </Link>
      );
    },
  },
  {
    id: "appointmentDate",
    accessorKey: "appointmentDate",
    header: "Appointment Date",
    sortingFn: "datetime",
    cell: ({ row }) => {
      const date = row.getValue("appointmentDate");
      if (!date) return "-";
      return format(new Date(date as string), "MMM dd, yyyy");
    },
  },
  {
    id: "totalPrice",
    accessorKey: "totalPrice",
    header: "Total Amount",
    enableSorting: true,
    cell: ({ row }) => {
      const price = row.getValue("totalPrice");
      return `KES ${price || 0}`;
    },
  },
  {
    id: "amountUpfront",
    accessorKey: "amountUpfront",
    header: "Amount Upfront",
    enableSorting: true,
    cell: ({ row }) => {
      const amount = row.getValue("amountUpfront");
      return `KES ${amount || 0}`;
    },
  },
  {
    id: "isPaid",
    accessorKey: "isPaid",
    header: "Payment Status",
    enableSorting: true,
    cell: ({ row }) => {
      const isPaid = Boolean(row.getValue("isPaid"));
      return (
        <Badge
          className={`${
            isPaid
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {isPaid ? "Paid" : "Not Paid"}
        </Badge>
      );
    },
  },
  {
    id: "status",
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return <span className="capitalize">{String(status || "-")}</span>;
    },
  },
];