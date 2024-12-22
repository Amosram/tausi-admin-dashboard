import { useMemo } from "react";
import { Appointment } from "@/models";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { FaChevronRight } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { ordersColumns } from "./orders-columns";

interface PartialOrdersTableProps {
  orders: Appointment[];
  maxRows?: number;
  onViewMore?: () => void;
}

export const PartialOrdersTable = ({
  orders,
  maxRows = 2,
  onViewMore,
}: PartialOrdersTableProps) => {
  const navigate = useNavigate();

  const partialData = useMemo(
    () => orders.slice(0, maxRows),
    [orders, maxRows]
  );

  const table = useReactTable({
    data: partialData,
    columns: ordersColumns,
    getCoreRowModel: getCoreRowModel(),
  });

  const handleViewMore =
    onViewMore ||
    (() => {
      navigate("/orders/list");
    });

  return (
    <div className="sm:max-w-[90vw] max-w-[80vw] mx-auto bg-white border border-gray-300 shadow-lg overflow-hidden">
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
              <tr
                key={row.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
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
          View All Orders
          <FaChevronRight />
        </Button>
      </div>
    </div>
  );
};
