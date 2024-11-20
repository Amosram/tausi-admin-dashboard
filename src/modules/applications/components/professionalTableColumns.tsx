import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { Link } from "react-router-dom";
import { format, parse } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Professional, Service } from "@/modules/applications/professional";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { FaPhoneAlt } from "react-icons/fa";


const getStatusBadge = (status: string) => {
  switch (status) {
  case "Pending":
    return (
      <Badge className="bg-transparent border-2 font-semibold text-md border-gray-500 text-gray-500">
        {status}
      </Badge>
    );
  case "In Review":
    return (
      <Badge className="bg-transparent border-2 font-semibold text-md border-blue-500 text-blue-500">
        {status}
      </Badge>
    );
  case "Rejected":
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

const TruncatedCell = ({content}: {content: string | null | undefined}) => {
  if (!content) return <span>-</span>;
  return (
    <span className="truncate block max-w-[150px]" title={content}>
      {content}
    </span>
  );
};

const formDate = (dateApplied: unknown, dateReviewed: unknown) => {
  const dateAppliedString = dateApplied as string;
  const dateReviewedString = dateReviewed as string;

  const dateAppliedObject = parse(dateAppliedString, 'M/d/yyyy', new Date());
  if (isNaN(dateAppliedObject.getTime())) {
    return 'Invalid date';
  }

  const formattedDateApplied = format(dateAppliedObject, 'MMM dd, yyyy');
  const formattedDateReviewed = format(dateReviewedString, 'MMM dd, yyyy');

  return `${formattedDateApplied} - ${formattedDateReviewed}`;
};

export const columns: ColumnDef<Professional>[] = [
  {
    id: 'select',
    header: ({table}) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() ? true
          : table.getIsSomePageRowsSelected() ? "indeterminate"
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
    cell: ({row}) => (
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
    accessorKey: "id",
    header:"Application ID",
    cell: ({row}) => (
      <Link
        to={`/professional/${row.getValue("id")}`}
        state={{professional: row.original}}
        className="hover:text-primary hover:underline"
      >
        {row.getValue("professionalId")}
      </Link>
    ),
    enableSorting: true,
  },
  {
    accessorKey: "createdAt",
    header: "Date Applied",
    cell: ({row}) => {
      const date = row.getValue("createdAt");
      return <TruncatedCell content={format(new Date(date as string), 'MMM dd, yyyy')} />;
    },
    enableSorting: true,
  },
  {
    accessorKey: "businessName",
    header: "Beutician",
    cell: ({row}) => <TruncatedCell content={row.getValue("businessName")} />,
  },
  {
    accessorKey: "services",
    header: "Services",
    cell: ({row}) => {
      const services = row.getValue("services") as Service[];
      return <TruncatedCell content={services.map(s => s.name).join(", ")} />;
    },
  },
  {
    accessorKey: "locationAddress", // Changed from location
    header: "Location",
    cell: ({row}) => <TruncatedCell content={row.getValue("locationAddress")} />,
  },
  {
    accessorKey: "user.phoneNumber", // Changed from contact
    header: "Contact",
    cell: ({ row }) => {
      const user = row.original.user;
      return (
        <div className="flex items-center space-x-2">
          <FaPhoneAlt className="text-gray-500" />
          <span>{user.phoneNumber}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "isVerified",
    header: "Status",
    cell: ({ row }) => {
      const isVerified = row.getValue("isVerified");
      const isActive = row.original.isActive;
      let status = "Pending";
      if (!isActive) status = "Rejected";
      else if (isVerified) status = "Verified";
      return getStatusBadge(status);
    },
  },
  {
    id: "actions",
    cell: ({row}) => (
      <DropdownMenu>
        <DropdownMenuTrigger className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreVertical className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <Link
              to={`/professional/${row.original.id}`}
              state={{ professional: row.original }}
              className="hover:text-primary"
            >
                  View details
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Edit:", row.original)}
            className="cursor-pointer"
          >
                Edit professional
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => console.log("Delete:", row.original)}
            className="bg-destructive text-white cursor-pointer"
          >
                Delete professional
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];