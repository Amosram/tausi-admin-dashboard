import { useState } from "react";
import { useDeleteLedgerMutation, useGetLedgersQuery } from "../api/ledgersApi";
import { ColumnDef, ColumnFiltersState } from "@tanstack/react-table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Books, Ledgers } from "@/models";
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
  const {data, isLoading, isError} = useGetLedgersQuery();
  const {refetch} = useGetLedgersQuery();
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Ledgers | null>(null);
  const [editData, setEditData] = useState<{ id: string; name: string; ledgerId: string, ownerId: string } | null>(
    null
  );

  const [deleteBook, {
    isSuccess: isDeleteSuccess,
  }] = useDeleteLedgerMutation();

  const handleDelete = async (ledger: Ledgers) => {
    setSelectedBook(ledger);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedBook) {
      return;
    }
  
    const response = await deleteBook(selectedBook.ownerId);
  
    if (response.error) {
      toast.toast({
        title: "Error",
        description: "Error deleting book",
        variant: "destructive",
      });
    } else {
      toast.toast({
        title: "Success",
        description: "Book deleted successfully",
        variant: "success",
      });
  
      // Refetch ledgers after deletion
      await refetch();
  
      // Close the delete dialog
      setDeleteDialogOpen(false);
      setSelectedBook(null);
    }
  };

  const columns: ColumnDef<Ledgers>[] = [
    {
      accessorKey: 'ownerId',
      header: 'Owner ID',
      cell: ({row}) => (
        <Link
          to={`/ledgers/${row.getValue("ownerId")}`}
          state={{professional: row.original}}
          className="hover:text-primary hover:underline truncate block max-w-[150px]"
        >
          {row.getValue("ownerId")}
        </Link>
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
      accessorKey:'owner',
      header: 'Owner',
      cell: ({row}) => <span>{row.original.owner.businessName}</span>
    },
    {
      accessorKey:'createdAt',
      header: 'Creation Date',
      cell: ({row}) => {
        const date = new Date(row.original.createdAt);
        return <span>{format(date, 'MMM dd, yyyy')}</span>;
      }
    },
    // {
    //   header: 'Actions',
    //   enableSorting: false,
    //   cell: ({ row }) => (
    //     <DropdownMenu>
    //       <DropdownMenuTrigger className="h-8 w-8 p-0">
    //         <span className="sr-only">Open menu</span>
    //         <MoreVertical className="h-4 w-4" />
    //       </DropdownMenuTrigger>
    //       <DropdownMenuContent align="end">
    //         <DropdownMenuItem>
    //           <Link
    //             to={`/ledgers/${row.original.ownerId}`}
    //             state={{ ledger: row.original }}
    //             className="hover:text-primary"
    //           >
    //                 View details
    //           </Link>
    //         </DropdownMenuItem>
    //         <DropdownMenuItem
    //           onClick={() => {
    //             setEditData({
    //               id: row.original.id,
    //               name: row.original.name,
    //               ledgerId: row.original.id,
    //               ownerId: row.original.ownerId,
    //             });
    //             setModalOpen(true);
    //           }}
    //           className="cursor-pointer"
    //         >
    //           Edit Loan Book
    //         </DropdownMenuItem>
    //         <DropdownMenuItem
    //           onClick={() => handleDelete(row.original)}
    //           className="bg-destructive text-white cursor-pointer"
    //         >
    //               Delete Book
    //         </DropdownMenuItem>
    //       </DropdownMenuContent>
    //     </DropdownMenu>
    //   ),
    // }
  ];

  const AddLoanButton = {
    label: "Create Book",
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
    <div className="p-6 dark:bg-gray-900">
      <TanStackTable
        data={data.data}
        columns={columns}
        // button={AddLoanButton}
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
              This action cannot be undone. This will permanently delete the Ledger.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-black text-white">Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-500 hover:bg-red-600 dark:text-gray-300" onClick={() => handleDeleteConfirm()}>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Ledger;