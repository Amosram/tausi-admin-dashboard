import { ColumnDef } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { MoreVertical } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { UserTableData } from "../types";

const TruncatedCell = ({ content }: { content: string | null | undefined }) => {
  if (!content) return <span>-</span>;
  return (
    <span className="truncate block max-w-[150px]" title={content}>
      {content}
    </span>
  );
};

export const columns: ColumnDef<UserTableData>[] = [
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
    cell: () => <TruncatedCell content={"Client"} />,
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.getValue("isActive");

      if (isActive === true) {
        return <Badge variant="default">Active</Badge>;
      }

      if (isActive === false) {
        return <Badge variant="destructive">Inactive</Badge>;
      }

      return <Badge variant="outline">Unknown</Badge>;
    },
  },
  {
    id: "createdAt",
    accessorKey: "createdAt",
    header: "Created On",
    cell: ({ row }) => <TruncatedCell content={row.getValue("createdAt")} />,
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
