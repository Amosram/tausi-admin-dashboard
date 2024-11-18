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
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  Clock,
  FileDown,
  Printer,
  Share2,
} from "lucide-react";
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../../components/ui/pagination";
import { Button } from "../../../components/ui/button";
import { OrdersTableSearch } from "./order-search";
import { exportSelectedRows, printSelectedRows, shareSelectedRows } from "../utils/table-actions";

interface OrdersDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

type SortOption = "newest" | "oldest";
type PageSizeOption = 5 | 10 | 20;

const STATUS_OPTIONS = [
  { label: "All Statuses", value: null },
  { label: "Completed", value: "completed" },
  { label: "Ongoing", value: "pending" },
  { label: "Cancelled", value: "cancelled" },
] as const;

const PAGE_SIZE_OPTIONS: PageSizeOption[] = [5, 10, 20];

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
    pageSize: 10 as PageSizeOption,
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

  const handlePageSizeChange = (size: PageSizeOption) => {
    setPagination((prev) => ({
      ...prev,
      pageSize: size,
      pageIndex: 0,
    }));
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

  const renderPagination = () => {
    const currentPage = table.getState().pagination.pageIndex + 1;
    const totalPages = table.getPageCount();

    const getPageNumbers = () => {
      const pages = [];
      if (currentPage > 1) pages.push(currentPage - 1);
      pages.push(currentPage);
      if (currentPage + 1 <= totalPages) pages.push(currentPage + 1);
      if (currentPage + 2 <= totalPages) pages.push(currentPage + 2);

      return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
      <Pagination>
        <PaginationContent className="flex items-center gap-2">
          <PaginationItem>
            {currentPage > 5 && (
              <PaginationLink
                onClick={() => table.setPageIndex(currentPage - 6)}
                className="px-3 py-1 text-muted-foreground hover:underline cursor-pointer"
              >
                {"<< 5"}
              </PaginationLink>
            )}
          </PaginationItem>
          <PaginationItem>
            {table.getCanPreviousPage() ? (
              <PaginationPrevious
                onClick={() => table.previousPage()}
                className="px-4 py-2 bg-primary text-white hover:bg-primary-light cursor-pointer"
              >
                Previous
              </PaginationPrevious>
            ) : (
              <span className="px-4 py-2 text-muted-foreground opacity-50">
                Previous
              </span>
            )}
          </PaginationItem>
          {pageNumbers[0] > 2 && (
            <PaginationItem className="md:block hidden">
              <PaginationEllipsis />
            </PaginationItem>
          )}
          {pageNumbers.map((page) => (
            <PaginationItem key={page} className="md:block hidden">
              <PaginationLink
                onClick={() => table.setPageIndex(page - 1)}
                isActive={page === currentPage}
                className={`px-3 py-1 ${
                  page === currentPage
                    ? "bg-primary text-white hover:bg-primary hover:text-white"
                    : "text-muted-foreground hover:bg-primary-light cursor-pointer"
                }`}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ))}
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <PaginationItem className="md:block hidden">
              <PaginationEllipsis />
            </PaginationItem>
          )}
          <PaginationItem>
            {table.getCanNextPage() ? (
              <PaginationNext
                onClick={() => table.nextPage()}
                className="px-4 py-2 bg-primary text-white hover:bg-primary-light cursor-pointer"
              >
                Next
              </PaginationNext>
            ) : (
              <span className="px-4 py-2 text-muted-foreground opacity-50">
                Next
              </span>
            )}
          </PaginationItem>
          <PaginationItem>
            {currentPage + 5 <= totalPages && (
              <PaginationLink
                onClick={() => table.setPageIndex(currentPage + 4)}
                className="px-3 py-1 text-muted-foreground hover:underline cursor-pointer"
              >
                {"5 >>"}
              </PaginationLink>
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  const renderTableControls = () => (
    <div className="flex items-center justify-between mb-4 md:flex-row flex-col md:gap-0 gap-4">
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

      <div className="flex-1 mx-6 md:w-auto w-full">
        <OrdersTableSearch data={data} onSearch={setFilteredData} />
      </div>

      <div className="flex md:w-auto w-full">
        <DropdownMenu>
          <DropdownMenuTrigger asChild className=" outline-none">
            <Button variant="light" className="gap-2 w-full md:rounded-3xl">
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

  const renderSelectedRowsHeader = () => {
    const selectedRowsCount = Object.keys(rowSelection).length;
    const selectedRows = table.getSelectedRowModel().rows;

    return (
      <TableRow className="bg-primary/10">
        <TableHead colSpan={columns.length} className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button size="sm" onClick={() => setRowSelection({})}>
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
        </TableHead>
      </TableRow>
    );
  };

  const renderTableHeader = (headerGroup: any) => {
    if (Object.keys(rowSelection).length > 0) {
      return renderSelectedRowsHeader();
    }

    return (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <TableHead key={header.id} className={getHeaderClassName(header.id)}>
            {header.isPlaceholder ? null : (
              <div
                className={`flex items-center gap-2 ${
                  header.column.getCanSort() ? "cursor-pointer select-none" : ""
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
    );
  };

  return (
    <div className="space-y-4 p-4">
      {renderTableControls()}

      <div className="rounded-lg border shadow-md relative">
        <div className="overflow-x-auto custom-scrollbar">
          <Table>
            <TableHeader>
              {table
                .getHeaderGroups()
                .map((headerGroup) => renderTableHeader(headerGroup))}
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

      <div className="flex items-center justify-between pt-4 px-10 md:flex-row flex-col md:gap-0 gap-4">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-black">
            Page {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="ml-2">
                {pageSize} per page <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {PAGE_SIZE_OPTIONS.map((size) => (
                <DropdownMenuItem
                  key={size}
                  onSelect={() => handlePageSizeChange(size)}
                  className={pageSize === size ? "bg-accent" : ""}
                >
                  {size} per page
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center space-x-2">{renderPagination()}</div>
      </div>
    </div>
  );
}
