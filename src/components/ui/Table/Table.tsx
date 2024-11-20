import React, { useState } from 'react';
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

interface TableProps<T> {
    data: T[];
    columns: ColumnDef<T>[];
    showFooter?: boolean;
    showNavigation?: boolean;
    showGlobalFilter?: boolean;
    filterFn?: FilterFn<T>;
}

const TanStackTable = <T,>({
  columns,
  data,
  showFooter = false,
  showNavigation = true,
  showGlobalFilter = true,
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


  const PaginationButtons = () => {
    return (
      <nav
        className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-0 sm:grid-cols-12"
        aria-label="Pagination"
      >
        <div className="hidden sm:flex space-x-5 items-center">
          <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium text-gray-900">{2} </span> of <span className="font-medium text-gray-900">{20}</span>
          </p>
          <select className='py-0.5 text-xs outline:focus-none rounded-lg focus:ring-blue-300 focus:ring-1' value={10}
            // onChange={e => setPageSize(Number(e.target.value))}
          >
            {
              [10, 20, 30, 50].map(pageSize => (
                <option key={pageSize} defaultValue={pageSize}>
                                    Show {pageSize}
                </option>
              ))
            }
          </select>
        </div>

        <div className="flex-1 flex justify-between sm:justify-end">
          <button
            className="relative inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            // onClick={() => gotoPage(0)}
            disabled={false}
          >
            <svg className="w-4 h-4" fill="none"
              stroke="currentColor" viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round"
                strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path>
            </svg>
          </button>

          <button
            className="ml-3 relative inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            disabled={!false}
          >Previous</button>

          <button
            className="ml-3 relative inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            // onClick={() => nextPage()}
            disabled={false}
          >Next</button>

          <button
            className="ml-3 relative inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            // onClick={}
            disabled={false}
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
            <div className="flex justify-between  items-center">
              {showGlobalFilter ? (
                <>
                  <DebouncedInput
                    value={globalFilter ?? ""}
                    onChange={(value) => setGlobalFilter(String(value))}
                    className="font-lg border-block border p-2 shadow mb-2 rounded"
                    placeholder="Search all columns..."
                  />
                </>
              ) : null}
            </div>
            <table className="w-full mt-5 text-sm text-left text-gray-600 shadow-md border  rounded-xl">
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
