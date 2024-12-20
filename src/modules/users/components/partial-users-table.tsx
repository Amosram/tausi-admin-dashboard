import { useMemo } from "react";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { TausiUser } from "@/models/user";
import { usersColumns } from "./users-columns";

interface PartialUsersTableProps {
  users: TausiUser[];
  maxRows?: number;
  onViewMore?: () => void;
}

export const PartialUsersTable = ({
  users,
  maxRows = 2,
  onViewMore,
}: PartialUsersTableProps) => {
  const navigate = useNavigate();

  const partialData = useMemo(
    () => users.slice(0, maxRows),
    [users, maxRows]
  );

  const table = useReactTable({
    data: partialData,
    columns: usersColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleViewMore =
    onViewMore ||
    (() => {
      navigate("/users/list");
    });

  return (
    <div className="sm:max-w-[90vw] max-w-[80vw] mx-auto border border-gray-300 shadow-lg overflow-hidden">
      <p className="text-lg uppercase text-center font-semibold mb-2">
        Table overview
      </p>
      <div className="overflow-x-auto sm:max-w-[90vw] max-w-[80vw] mx-auto border border-gray-300 shadow-lg">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-800 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-card divide-y divide-gray-200">
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-3 text-sm text-gray-500">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-center mt-4 mb-3">
        <Button
          onClick={handleViewMore}
          variant="outline"
          className="flex items-center gap-2 hover:bg-primary hover:text-white dark:hover:bg-orange-600"
        >
          View All Users
          <FaChevronRight />
        </Button>
      </div>
    </div>
  );
};
