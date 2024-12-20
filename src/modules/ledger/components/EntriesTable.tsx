import { BookEntries, LedgerDetails } from "@/models";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from "@/components/ui/table";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@radix-ui/react-label";
import { useDeleteBookEntryMutation } from "../api/ledgersApi";
import { useToast } from "@/hooks/use-toast";

// Define a union type for flexibility
type EntriesTableProps =
  | { ledgerDetails: LedgerDetails[]; entries?: never } // Using LedgerDetails
  | { entries: (BookEntries & { bookName: string })[]; ledgerDetails?: never }; // Using pre-flattened entries

const EntriesTable = (props: EntriesTableProps) => {
  const [selectedEntries, setSelectedEntries] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [deleteBookEntry, {isLoading:isDeleting}] = useDeleteBookEntryMutation();
  const toast = useToast();
  
  const handleDelete = async () => {
    try {
      await Promise.all(selectedEntries.map((id) => deleteBookEntry(id).unwrap()));
      toast.toast({
        title: "Success",
        description: "Entries deleted successfully",
        variant: "success",
      });
      setSelectedEntries([]);
    } catch (error) {
      toast.toast({
        title: "Error",
        description: "Error deleting entries",
        variant: "destructive",
      });
    }
  };

  // Flatten entries if LedgerDetails is passed, otherwise use the provided entries
  const allEntries =
    props.ledgerDetails?.flatMap((ledger) =>
      ledger.books?.flatMap((book) =>
        book.bookEntries?.map((entry) => ({
          ...entry,
          bookName: book.name,
          ledgerName: ledger.name,
        }))
      )
    ) || props.entries || [];

  const totalPages = Math.ceil(allEntries.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEntries = allEntries.slice(startIndex, endIndex);

  const toggleSelectAll = () => {
    if (selectedEntries.length === currentEntries.length) {
      setSelectedEntries((prev) => prev.filter((id) => !currentEntries.some((entry) => entry.id === id)));
    } else {
      setSelectedEntries((prev) => [...new Set([...prev, ...currentEntries.map((entry) => entry.id)])]);
    }
  };

  const toggleSelectEntry = (id: string) => {
    setSelectedEntries((prev) =>
      prev.includes(id) ? prev.filter((entryId) => entryId !== id) : [...prev, id]
    );
  };

  const clearSelections = () => {
    setSelectedEntries([]);
  };

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="select-all"
            checked={currentEntries.length > 0 && currentEntries.every((entry) => selectedEntries.includes(entry.id))}
            onCheckedChange={toggleSelectAll}
            className="dark:bg-gray-300"
          />
          <Label htmlFor="select-all">Select All</Label>
        </div>
        <div className="space-x-2">
          {/* <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={selectedEntries.length === 0 || isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete Selected"}
          </Button> */}
          <Button
            variant="outline"
            size="sm"
            onClick={clearSelections}
            disabled={selectedEntries.length === 0}
            className="dark:bg-card dark:hover:bg-orange-600 mt-2 hover:bg-primary hover:text-white"
          >
            Clear Selections
          </Button>
        </div>
      </div>
      <Table className="dark:bg-card">
        <TableHeader className="dark:bg-gray-800">
          <TableRow>
            <TableHead className="w-[50px]">Select</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Book Name</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentEntries.map((entry) => (
            <TableRow className="dark:hover:bg-gray-700" key={entry.id}>
              <TableCell>
                <Checkbox
                  checked={selectedEntries.includes(entry.id)}
                  onCheckedChange={() => toggleSelectEntry(entry.id)}
                  className="dark:bg-gray-300"
                />
              </TableCell>
              <TableCell>{entry.title}</TableCell>
              <TableCell>
                <Badge variant={entry.type === "Expense" ? "destructive" : "success"}>{entry.type}</Badge>
              </TableCell>
              <TableCell>KES {Number(entry.amount).toFixed(2)}</TableCell>
              <TableCell>{entry.bookName}</TableCell>
              <TableCell>{format(new Date(entry.createdAt), "PPpp")}</TableCell>
              <TableCell>{format(new Date(entry.updatedAt), "PPpp")}</TableCell>
              <TableCell>
                {entry.isDeleted ? (
                  <Badge variant="destructive">Deleted</Badge>
                ) : (
                  <Badge className="bg-gray-600 dark:bg-gray-300">Active</Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="mt-4 flex items-center justify-between">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {startIndex + 1} to {Math.min(endIndex, allEntries.length)} of {allEntries.length} entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm dark:text-gray-300">
        Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EntriesTable;
