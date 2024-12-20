import React, { useCallback, useState, useEffect } from "react";
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
  Row,
  RowSelectionState,
} from "@tanstack/react-table";
import { DebouncedInput } from "../DebounceInput";
import { filterFunctions } from "@/Utils/filter-functions";
import { ChevronUp, ChevronDown, Clock } from "lucide-react";
import { Button } from "../button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "../dropdown-menu";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Checkbox } from "../checkbox";
import { FileDown, Printer, Share2 } from "lucide-react";
import {
  exportSelectedRows,
  printSelectedRows,
  shareSelectedRows,
} from "@/Utils/table-actions";

interface ButtonProps {
  label: string;
  onClick: () => void;
  className: string;
  icon?: React.ReactNode;
}

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
  onRowSelection?: (selectedRows: T[]) => void;
  columnToBeFiltered?: string;
  dateSortingId?: string;
  button?: ButtonProps;
  withSearch?: boolean;
}

const TanStackTable = <T,>({
  columns,
  data,
  showFooter = false,
  showNavigation = true,
  showGlobalFilter = true,
  STATUS_OPTIONS = [],
  filterFn = filterFunctions.fuzzy,
  onRowSelection,
  columnToBeFiltered,
  dateSortingId = "createdAt",
  button,
  withSearch = true,
}: TableProps<T>) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const defaultColumn = "status";

  const table = useReactTable({
    data,
    columns,
    state: {
      columnFilters,
      sorting,
      globalFilter,
      rowSelection,
    },
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: filterFn,
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  useEffect(() => {
    if (onRowSelection) {
      const selectedRows = table
        .getSelectedRowModel()
        .rows.map((row) => row.original);
      onRowSelection(selectedRows);
    }
  }, [rowSelection, onRowSelection, table]);

  const SelectAllCheckbox = () => (
    <Checkbox
      checked={table.getIsAllPageRowsSelected()}
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
      className="dark:bg-gray-300"
    />
  );

  const RowCheckbox = ({ row }: { row: Row<T> }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
      className="dark:bg-gray-300"
    />
  );

  {
    /* THIS NOW DEFAULTS TO THE "status" COLUMN ID BUT ALSO ACCEPTS THE COLUMN NAME FROM THE PROPS */
  }
  const handleStatusFilter = useCallback(
    (status: string | null) => {
      setColumnFilters((filters) => {
        const column = columnToBeFiltered || defaultColumn;
        const newFilters = filters.filter((f) => f.id !== column);
        if (status !== null) {
          newFilters.push({ id: column, value: status });
        }
        return newFilters;
      });
    },
    [columnToBeFiltered]
  );

  const PaginationButtons = () => {
    return (
      <nav
        className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-0 sm:grid-cols-12"
        aria-label="Pagination"
      >
        <div className="hidden sm:flex space-x-5 items-center">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing page{" "}
            <span className="font-bold text-gray-900 dark:text-gray-300">
              {table.getState().pagination.pageIndex + 1}{" "}
            </span>{" "}
            of{" "}
            <span className="font-bold text-gray-900 dark:text-gray-300">
              {table.getPageCount()}
            </span>
          </p>
            <select
            className="block w-26 bg-gray-800 text-white rounded-md border-0 py-2 pl-3 pr-10 ring-1 ring-inset ring-gray-700 focus:ring-2 focus:ring-orange-600 sm:text-sm sm:leading-6"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            >
            {[10, 20, 30, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
              Show {pageSize}
              </option>
            ))}
            </select>
        </div>

        <div className="flex-1 flex justify-between sm:justify-end ml-3">
          <button
            className="relative inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-card hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-orange-600 cursor-pointer"
            onClick={() =>
              table.setPageIndex(
                Math.max(0, table.getState().pagination.pageIndex - 5)
              )
            }
            disabled={table.getState().pagination.pageIndex < 5}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
              ></path>
            </svg>
          </button>

          <button
            className="ml-3 relative inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light hover:text-gray-700 dark:bg-card dark:text-gray-300 dark:hover:bg-orange-600 cursor-pointer"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </button>

          <button
            className="ml-3 relative inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light hover:text-gray-700 dark:bg-card dark:text-gray-300 dark:hover:bg-orange-600 cursor-pointer"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </button>

          <button
            className="ml-3 relative inline-flex items-center px-4 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-card hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-orange-600 cursor-pointer"
            onClick={() =>
              table.setPageIndex(table.getState().pagination.pageIndex + 5)
            }
            disabled={
              table.getState().pagination.pageIndex + 5 >= table.getPageCount()
            }
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 5l7 7-7 7M5 5l7 7-7 7"
              ></path>
            </svg>
          </button>
        </div>
      </nav>
    );
  };

  const renderSelectedRowsHeader = () => {
    const selectedRowsCount = Object.keys(rowSelection).length;
    const selectedRows = table.getSelectedRowModel().rows;

    if (selectedRowsCount === 0) return null;

    return (
      <tr className="bg-primary/10">
        <th colSpan={columns.length + 1} className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setRowSelection({})}
                className="bg-primary text-white dark:bg-card dark:text-gray-300 dark:hover:bg-orange-600"
              >
                Clear Selection
              </Button>
              <div className="text-sm font-semibold">
                {selectedRowsCount} Selected
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  printSelectedRows(selectedRows, columns, flexRender)
                }
                title="Print Selected Rows"
              >
                <Printer className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  shareSelectedRows(selectedRows.map((row) => row.original))
                }
                title="Share Selected Rows"
              >
                <Share2 className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  exportSelectedRows(
                    selectedRows.map((row) => row.original),
                    columns
                  )
                }
                title="Export Selected Rows"
              >
                <FileDown className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </th>
      </tr>
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
                    {STATUS_OPTIONS?.length > 0 &&
                      STATUS_OPTIONS.map((status) => (
                        <Button
                          key={status.label}
                          variant={
                            status.value ===
                            (columnFilters.find(
                              (f) =>
                                f.id === (columnToBeFiltered || defaultColumn)
                            )?.value ?? null)
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
                  {withSearch && (
                    <>
                      <DebouncedInput
                        value={globalFilter ?? ""}
                        onChange={(value) => setGlobalFilter(String(value))}
                        className="font-lg border p-2 shadow bg-card rounded-full w-1/2 border-gray-400 flex-1 px-4"
                        placeholder="Search all columns..."
                      />

                      {!button ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild className="outline-none">
                            <Button
                              variant="light"
                              className="gap-1 rounded-full dark:bg-card dark:text-gray-300 dark:hover:bg-orange-600"
                            >
                              <Clock className="h-4 w-4" />
                              {sorting[0]?.desc
                                ? "Newest First"
                                : "Oldest First"}
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                setSorting([{ id: dateSortingId, desc: true }])
                              }
                              className={sorting[0]?.desc ? "bg-accent" : ""}
                            >
                              Newest First
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setSorting([{ id: dateSortingId, desc: false }])
                              }
                              className={!sorting[0]?.desc ? "bg-accent" : ""}
                            >
                              Oldest First
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button
                          onClick={button.onClick}
                          className={`${button.className} flex items-center dark:bg-card dark:text-gray-300 dark:hover:bg-orange-600`}
                        >
                          {button.icon && <span>{button.icon}</span>}
                          {button.label}
                        </Button>
                      )}
                    </>
                  )}
                </>
              ) : null}
            </div>
            <table className="w-full mt-2 text-sm text-left text-gray-600 dark:text-gray-300 shadow-md border round-xl">
              {/* <TableHeader table={table} /> */}
              {/* NOTE: IF YOU FIND ERRORS JUST UNCOMMENT THE ABOVE COMPONENT AND COMMENT OUT THE BELOW TABLE HEAD */}
              <thead>
                {renderSelectedRowsHeader()}
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    <th className="w-4 p-3">
                      <SelectAllCheckbox />
                    </th>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        colSpan={header.colSpan}
                        className="cursor-pointer select-none px-4 py-2 text-left"
                        onClick={
                          header.column.getCanSort()
                            ? () => header.column.toggleSorting()
                            : undefined
                        }
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                        {header.column.getCanSort() && (
                          <span className="ml-2 inline-flex items-center">
                            {header.column.getIsSorted() === "asc" && (
                              <ChevronUp className="w-4 h-4 text-gray-600" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ChevronDown className="w-4 h-4 text-gray-600" />
                            )}
                          </span>
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>

              <tbody className="bg-white dark:bg-card border-b hover:bg-gray-50">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="bg-white dark:bg-card border-b hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <td className="w-4 p-3">
                        <RowCheckbox row={row} />
                      </td>
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="py-3 px-2 whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={table.getAllColumns().length} // Span all columns
                      className="py-4 px-3 text-center text-gray-500"
                    >
                      No data available
                    </td>
                  </tr>
                )}
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
              {table.getPageCount() > 1 &&
                (showNavigation ? PaginationButtons() : null)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TanStackTable;
