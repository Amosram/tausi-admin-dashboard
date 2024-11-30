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
import { Booth } from "@/models";

const TruncatedCell = ({ content }: { content: string | null | undefined }) => {
  if (!content) return <span>-</span>;
  return (
    <span className="truncate block max-w-[150px]" title={content}>
      {content}
    </span>
  );
};

export const boothColumns: ColumnDef<Booth>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "Booth ID",
    cell: ({ row }) => (
      <Link
        to={`/booths/${row.getValue("id")}`}
        state={{ user: row.original }}
        className="hover:text-primary hover:underline truncate block max-w-[150px]"
      >
        {row.getValue("id")}
      </Link>
    ),
    enableSorting: true,
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <TruncatedCell content={row.getValue("name")} />,
    enableSorting: true,
  },
  {
    id: "locationAddress",
    accessorKey: "locationAddress",
    header: "Location",
    cell: ({ row }) => (
      <TruncatedCell content={row.getValue("locationAddress")} />
    ),
    enableSorting: true,
  },
  {
    id: "numberOfStations",
    accessorKey: "numberOfStations",
    header: "Number of Stations",
    cell: ({ row }) => (
      <TruncatedCell content={row.getValue("numberOfStations")} />
    ),
  },
  {
    id: "numberOfBeauticians",
    accessorKey: "numberOfBeauticians",
    header: "Number of Beauticians",
    cell: ({ row }) => (
      <TruncatedCell content={row.getValue("numberOfBeauticians")} />
    ),
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");

      if (isActive === true) {
        return (
          <Badge className="bg-transparent font-semibold text-blue-900 text-md">
            Active
          </Badge>
        );
      }

      if (isActive === false) {
        return (
          <Badge className="bg-transparent font-semibold text-destructive text-md">
            Inactive
          </Badge>
        );
      }

      return <Badge variant="outline">Unknown</Badge>;
    },
  },
  {
    id: "occupancyStatus",
    accessorKey: "occupancyStatus",
    header: "Occupancy Status",
    cell: ({ row }) => {
      const occupancyStatus = row.getValue("occupancyStatus");

      if (occupancyStatus === "empty") {
        return (
          <Badge className="bg-transparent font-semibold text-green-600 border-green-500 text-md">
            Empty
          </Badge>
        );
      }

      if (occupancyStatus === "occupied") {
        return (
          <Badge className="bg-transparent font-semibold text-blue-600 border-blue-500 text-md">
            Occupied
          </Badge>
        );
      }

      return <Badge variant="outline">{row.getValue("occupancyStatus")}</Badge>;
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created On",
    cell: ({ row }) => {
      const createdAt = row.getValue("createdAt") as string;
      const formattedDate = createdAt
        ? format(new Date(createdAt), "MMM dd, yyyy")
        : "Invalid date";
      return <TruncatedCell content={formattedDate} />;
    },
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
            Edit Booth
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete:", row.original)}
            className="bg-destructive text-white cursor-pointer"
          >
            Delete Booth
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
