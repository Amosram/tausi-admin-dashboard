import { Appointment } from "@/models";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { boothOrderColumns } from "./booth-order-columns";
import React, { useState, useMemo } from "react";
import { ArrowUp, ArrowDown, ArrowUpDown, List } from "lucide-react";
import { Link } from "react-router-dom";

interface OrdersTableProps {
  orders: Appointment[];
  onRowClick?: (order: Appointment) => void;
}

export const BoothOrdersTable = React.memo(({ orders, onRowClick }: OrdersTableProps) => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  const table = useReactTable({
    data: orders,
    columns: boothOrderColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  });

  const paginatedOrders = useMemo(() => {
    return table.getRowModel().rows.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [table.getRowModel().rows, currentPage]);

  const totalPages = Math.ceil(table.getRowModel().rows.length / rowsPerPage);

  return (
    <div className="w-full">
      <div className="flex justify-between mb-4 items-center">
        <div></div>
        <Link
          to="/orders/list"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-white"
        >
          <List className="h-4 w-4" />
          View All Orders
        </Link>
      </div>
      <div className="overflow-x-auto border rounded-lg">
        <table className="w-full table-auto">
          <thead className="bg-gray-100 dark:bg-gray-800 border-b">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <th className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                  #
                </th>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="p-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex items-center space-x-1 ${
                          header.column.getCanSort()
                            ? "cursor-pointer select-none"
                            : ""
                        }`}
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getCanSort() && (
                          header.column.getIsSorted() === "asc" ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDown className="h-4 w-4" />
                          ) : (
                            <ArrowUpDown className="h-4 w-4" />
                          )
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="bg-white dark:bg-card divide-y divide-gray-200">
            {paginatedOrders.map((row, index) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                onClick={() => onRowClick?.(row.original)}
              >
                <td className="p-3 text-sm text-gray-500 text-center">
                  {(currentPage - 1) * rowsPerPage + index + 1}
                </td>
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
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400"
        >
          Previous
        </button>
        <span className="text-sm text-gray-600 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm text-gray-600 bg-gray-200 rounded disabled:opacity-50 dark:bg-gray-800 dark:text-gray-400"
        >
          Next
        </button>
      </div>
    </div>
  );
});
