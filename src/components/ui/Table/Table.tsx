import React, { useCallback, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  SortingState,
  FilterFn,
} from "@tanstack/react-table";
import { DebouncedInput } from "../DebounceInput";
import { filterFunctions } from "@/Utils/filter-functions";
import TableHeader from './TableHeader';
import { Clock } from 'lucide-react';
import { Button } from '../button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem } from '../dropdown-menu';
import { DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface TableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    showFooter?: boolean;
    showNavigation?: boolean;
    showGlobalFilter?: boolean;
    filterFn?: FilterFn<T>;
    columnFilters?: ColumnFiltersState;
    handleStatusFilter?: (status: string | null) => void;
    STATUS_OPTIONS?: { label: string; value: string | null }[];
}

const TanStackTable = <T,>({
  columns,
  data,
  showFooter = false,
  showNavigation = true,
  showGlobalFilter = true,
  STATUS_OPTIONS=[],
  filterFn = filterFunctions.fuzzy,
}: TableProps<T>) => {

  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      globalFilter,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: filterFn,
  });

  const handleStatusFilter = useCallback((status: string | null) => {
    setColumnFilters((filters) => {
      const newFilters = filters.filter((f) => f.id !== "status");
      if (status !== null) {
        newFilters.push({ id: "status", value: status });
      }
      return newFilters;
    });
  }, []);


  const PaginationButtons = () => {
    return (
      <nav
        className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-0 sm:grid-cols-12"
        aria-label="Pagination"
      >
        <div className="hidden sm:flex space-x-5 items-center">
          <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium text-gray-900">{table.getState().pagination.pageIndex + 1} </span> of <span className="font-medium text-gray-900">{table.getPageCount()}</span>
          </p>
          <select
            className="block w-24 bg-background rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset focus:ring-2 focus:ring-orange-600 sm:text-sm sm:leading-6"
            value={table.getState().pagination.pageSize}
            onChange={e => table.setPageSize(Number(e.target.value))}
          >
            {
              [10, 20, 30, 50].map(pageSize => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))
            }
          </select>
        </div>

        <div className="flex-1 flex justify-between sm:justify-end ml-3">
          <button
            className="relative inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => table.setPageIndex(Math.max(0, table.getState().pagination.pageIndex - 5))}
            disabled={table.getState().pagination.pageIndex < 5}
          >
            <svg className="w-4 h-4" fill="none"
              stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          </button>

          <button
            className="ml-3 relative inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light hover:text-gray-700"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >Previous</button>

          <button
            className="ml-3 relative inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light hover:text-gray-700"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >Next</button>

          <button
            className="ml-3 relative inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            onClick={() => table.setPageIndex(table.getState().pagination.pageIndex + 5)}
            disabled={table.getState().pagination.pageIndex + 5 >= table.getPageCount()}
          >
            <svg className="w-4 h-4" fill="none"
              stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
            </svg>
          </button>
        </div>
      </nav>
    );
  };


  return (
    <div className="flex flex-col w-full">
      <div className="overflow-auto">
        <div className="inline-block min-w-full p-1">
          <div className="flex flex-col">
            <div className="flex justify-between items-center gap-1 mt-3 mb-2">
              {showGlobalFilter ? (
                <>
                  <div className="flex gap-2 md:flex-row flex-col md:w-auto w-full">
                    {STATUS_OPTIONS.map((status) => (
                      <Button
                        key={status.label}
                        variant={
                          status.value ===
              (columnFilters.find((f) => f.id === "status")?.value ?? null)
                            ? "default"
                            : "outline"
                        }
                        onClick={() => handleStatusFilter(status.value)}
                        className="px-4 py-2 md:rounded-3xl"
                      >
                        {status.label}
                      </Button>
                    ))}
                  </div>
                  <DebouncedInput
                    value={globalFilter ?? ""}
                    onChange={(value) => setGlobalFilter(String(value))}
                    className="font-lg border-block border p-2 shadow bg-background rounded-full w-1/2 border-gray-400"
                    placeholder="Search all columns..."
                  />
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="outline-none">
                      <Button variant="light" className="gap-1 rounded-full">
                        <Clock className="h-4 w-4" />
                        {sorting[0]?.desc ? "Newest First" : "Oldest First"}
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => setSorting([{ id: "createdAt", desc: true }])}
                        className={sorting[0]?.desc ? "bg-accent" : ""}
                      >
                        Newest First
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => setSorting([{ id: "createdAt", desc: false }])}
                        className={!sorting[0]?.desc ? "bg-accent" : ""}
                      >
                        Oldest First
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : null}
            </div>
            <table className="w-full mt-2 text-sm text-left text-gray-600 shadow-md border round-xl">
              <TableHeader table={table} />
              <tbody className="bg-white border-b hover:bg-gray-50">
                {table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="bg-white border-b hover:bg-gray-50"
                  >
                    <td className="w-4 p-3">
                      <div className="flex items-center">
                        <input id="checkbox-table-1" type="checkbox"
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-1" />
                        <label htmlFor="checkbox-table-1" className="sr-only">checkbox</label>
                      </div>
                    </td>

                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="py-3 px-2 whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
              {showFooter ? (
                <tfoot className="border-t bg-gray-50">
                  {table.getFooterGroups().map((footerGroup) => (
                    <tr key={footerGroup.id}>
                      {footerGroup.headers.map((header) => (
                        <th key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                              header.column.columnDef.footer,
                              header.getContext()
                            )}
                        </th>
                      ))}
                    </tr>
                  ))}
                </tfoot>
              ) : null}
            </table>
            <div className="bottom-0 flex items-baseline justify-end mt-3">
              {showNavigation ? (
                PaginationButtons()
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TanStackTable;
