import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  RowSelectionState,
  getSortedRowModel,
  SortingState,
  getFilteredRowModel,
  ColumnFiltersState,
} from "@tanstack/react-table";
import { useState, useCallback } from "react";
import { ChevronDown, ChevronUp, ChevronsUpDown, Clock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from "../../../components/ui/pagination";
import { Button } from "../../../components/ui/button";
import { OrdersTableSearch } from "./order-search";

interface OrdersDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

type SortOption = "newest" | "oldest";

const STATUS_OPTIONS = [
  { label: "All Statuses", value: null },
  { label: "Completed", value: "completed" },
  { label: "Ongoing", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
] as const;

export function OrdersDataTable<TData, TValue>({
  columns,
  data,
}: OrdersDataTableProps<TData, TValue>) {
  const [filteredData, setFilteredData] = useState(data);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [{ pageIndex, pageSize }, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sortOption, setSortOption] = useState<SortOption>("oldest");

  const reorderedColumns = [...columns].sort((a, b) => {
    if (a.id === "actions") return 1;
    if (b.id === "actions") return -1;
    return 0;
  });

  const handleSortOptionChange = (option: SortOption) => {
    setSortOption(option);
    setSorting([
      {
        id: "orderDate",
        desc: option === "oldest",
      },
    ]);
  };

  const table = useReactTable({
    data: filteredData,
    columns: reorderedColumns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      rowSelection,
      pagination: { pageIndex, pageSize },
      sorting,
      columnFilters,
    },
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

  const renderSortIcon = (header: any) => {
    if (!header.column.getCanSort()) return null;

    const sortDirection = header.column.getIsSorted();
    return (
      <div className="w-4">
        {sortDirection === "asc" ? (
          <ChevronUp className="h-4 w-4" />
        ) : sortDirection === "desc" ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronsUpDown className="h-4 w-4" />
        )}
      </div>
    );
  };

  const renderPagination = () => (
    <Pagination>
      <PaginationContent className="flex items-center gap-2">
        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-4 py-2"
          >
            Previous
          </Button>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink className="text-sm text-muted-foreground w-full">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-4 py-2"
          >
            Next
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  const renderTableControls = () => (
    <div className="flex items-center justify-between mb-4">
      <div className="flex gap-2">
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
            className="px-4 py-2"
          >
            {status.label}
          </Button>
        ))}
      </div>

      <div className="flex-1 mx-6">
        <OrdersTableSearch data={data} onSearch={setFilteredData} />
      </div>

      <div className="flex">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className=" outline-none">
            <Button variant="outline" className="gap-2">
              <Clock className="h-4 w-4" />
              {sortOption === "newest" ? "Newest First" : "Oldest First"}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => handleSortOptionChange("newest")}
              className={sortOption === "newest" ? "bg-accent" : ""}
            >
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleSortOptionChange("oldest")}
              className={sortOption === "oldest" ? "bg-accent" : ""}
            >
              Oldest First
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );

  // Styles
  const getHeaderClassName = (headerId: string) =>
    `px-4 py-2 text-left ${
      headerId === "actions"
        ? "sticky right-0 bg-background z-10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-4 before:bg-gradient-to-r before:from-gray-200/50 before:to-transparent dark:before:from-gray-800/50"
        : ""
    }`;

  const getCellClassName = (columnId: string) =>
    `px-4 py-3 ${
      columnId === "actions"
        ? "sticky right-0 bg-background z-10 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-4 before:bg-gradient-to-r before:from-gray-200/50 before:to-transparent dark:before:from-gray-800/50"
        : ""
    }`;

  return (
    <div className="space-y-4 p-4">
      {renderTableControls()}

      <div className="rounded-lg border shadow-md relative">
        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={getHeaderClassName(header.id)}
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={`flex items-center gap-2 ${
                            header.column.getCanSort()
                              ? "cursor-pointer select-none"
                              : ""
                          }`}
                          onClick={
                            header.column.getCanSort()
                              ? header.column.getToggleSortingHandler()
                              : undefined
                          }
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {renderSortIcon(header)}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="hover:bg-muted"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className={getCellClassName(cell.column.id)}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 px-10">
        <div className="text-sm text-primary">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        {renderPagination()}
      </div>
    </div>
  );
}
