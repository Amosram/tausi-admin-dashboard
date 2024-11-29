import { useState } from "react";
import { useDeleteLoanBookMutation, useGetBooksQuery } from "../api/ledgersApi";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Books } from "@/models";
import { format } from "date-fns";
import { MoreVertical } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Loader from "@/components/layout/Loader";
import TanStackTable from "@/components/ui/Table";
import { FaPlus } from "react-icons/fa";
import CreateLoanBookModal from "../components/CreateLoanBookModal";
import { useToast } from "@/hooks/use-toast";


const Ledger = () => {

  const navigate = useNavigate();
  const toast = useToast();
  const {data, isLoading, isError} = useGetBooksQuery();
  const {refetch} = useGetBooksQuery();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Books | null>(null);
  const [editData, setEditData] = useState<{ id: string; name: string; ledgerId: string } | null>(
    null
  );

  const [deleteBook, {
    isSuccess: isDeleteSuccess,
  }] = useDeleteLoanBookMutation();

  const handleDelete = async (book: Books) => {
    setSelectedBook(book);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBook) {
      return;
    }
  
    const response = await deleteBook(selectedBook.id);
  
    if (response.error) {
      toast.toast({
        title: "Error",
        description: "Error deleting book",
      });
    } else {
      toast.toast({
        title: "Success",
        description: "Book deleted successfully",
      });
  
      // Refetch books after deletion
      await refetch();
  
      // Close the delete dialog
      setDeleteDialogOpen(false);
      setSelectedBook(null);
    }
  };
  

  const columns: ColumnDef<Books>[] = [
    {
      accessorKey: 'id',
      header: 'Book ID',
      cell: ({row}) => (
        <div className="flex items-center space-x-2">
          <span>{row.original.id}</span>
        </div>
      ),
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({row}) => (
        <span>{row.original.name}</span>
      )
    },
    {
      accessorKey:'createdAt',
      header: 'Creation Date',
      cell: ({row}) => {
        const date = new Date(row.original.createdAt);
        return <span>{format(date, 'MMM dd, yyyy')}</span>;
      }
    },
    {
      accessorKey:'ledgerId',
      header: 'Ledger ID',
      cell: ({row}) => <span>{row.original.ledgerId}</span>
    },
    {
      header: 'Actions',
      enableSorting: false,
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreVertical className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Link
                to={`/ledgers/${row.original.id}`}
                state={{ ledger: row.original }}
                className="hover:text-primary"
              >
                    View details
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setEditData({
                  id: row.original.id,
                  name: row.original.name,
                  ledgerId: row.original.id,
                });
                setModalOpen(true);
              }}
              className="cursor-pointer"
            >
              Edit Loan Book
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(row.original)}
              className="bg-destructive text-white cursor-pointer"
            >
                  Delete Book
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }
  ];

  const AddLoanButton = {
    label: "Add Loan",
    onClick: () => {
      setEditData(null); // Reset edit data for create mode
      setModalOpen(true);
    },
    className: "rounded-3xl",
    icon: <FaPlus size={20} />,
  };

  if (isLoading){
    return <Loader />;
  }

  if (isError) {
    return <div>Error loading Ledgers</div>;
  }

  return (
    <>
      <TanStackTable
        data={data.data}
        columns={columns}
        button={AddLoanButton}
      />
      <CreateLoanBookModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        editData={editData}
      />
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the Country.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-black text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600" onClick={() => handleDeleteConfirm()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Ledger;