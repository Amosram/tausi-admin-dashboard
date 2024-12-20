import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { TausiUser } from "@/models/user";
import { format } from "date-fns";

const TruncatedCell = ({ content }: { content: string | null | undefined }) => {
  if (!content) return <span>-</span>;
  return (
    <span className="truncate block max-w-[150px]" title={content}>
      {content}
    </span>
  );
};

export const usersColumns: ColumnDef<TausiUser>[] = [
  {
    id: "id",
    accessorKey: "id",
    header: "User ID",
    cell: ({ row }) => (
      <Link
        to={`/users/${row.getValue("id")}`}
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
    header: "User Name",
    cell: ({ row }) => <TruncatedCell content={row.getValue("name")} />,
    enableSorting: true,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => <TruncatedCell content={row.getValue("email")} />,
    enableSorting: true,
  },
  {
    id: "phoneNumber",
    accessorKey: "phoneNumber",
    header: "Contact",
    cell: ({ row }) => <TruncatedCell content={row.getValue("phoneNumber")} />,
  },
  {
    id: "role",
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role");
      const formattedRole =
        typeof role === "string"
          ? role.charAt(0).toUpperCase() + role.slice(1)
          : String(role || "");
      return <TruncatedCell content={formattedRole} />;
    },
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
              to={`/users/${row.original.id}`}
              state={{ user: row.original }}
              className="hover:text-primary"
            >
              View User Details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Edit:", row.original)}
            className="cursor-pointer"
          >
            Edit User
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete:", row.original)}
            className="bg-destructive text-white cursor-pointer"
          >
            Delete User
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
