import { useState } from "react";
import { useCreateLoanBookMutation, useGetLedgersQuery } from "../api/ledgersApi";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@radix-ui/react-dialog";
import Select from 'react-select';
import { Input } from "@/components/ui/input";


interface CreateLoanBookModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateLoanBookModal: React.FC<CreateLoanBookModalProps> = ({isOpen, onClose}) => {

  const toast = useToast();

  const [name, setName] = useState("");
  const [selectedLedger, setSelectedLedger] = useState<{label: string; value: string} | null>(null);

  const {data: ledgers, isLoading:loadingLedgers, isError} = useGetLedgersQuery();
  const [createLoanBook, {isLoading: creating}] = useCreateLoanBookMutation();

  const ledgerOptions = ledgers?.data.map((ledger) => ({
    value: ledger.id,
    label: ledger.name,
  }));

  const handleSubmit = async () => {
        
    if (!name || !selectedLedger) {
      toast.toast({
        title: "Fill all the fields",
        description: "Missing a field. Please fill it."
      });
      return;
    }
        
    try{
      await createLoanBook({name, ledgerId: selectedLedger.value}).unwrap();
      toast.toast({
        title: "Loan book created",
        description: "You've successfully created a new loan book. "
      });
      onClose();
    }
    catch (error) {
      console.error("Error creating a loan book:======>", error);
      toast.toast({
        title: "Error creating a loan book",
        description: "An error occured while creating a new loan book."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
        <DialogContent className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg w-1/3 p-6 shadow-lg">
            <DialogTitle className="text-lg font-bold mb-4">Create Loan Book</DialogTitle>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Loan Book Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter loan book name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Ledger</label>
                <Select
                  options={ledgerOptions}
                  isLoading={loadingLedgers}
                  onChange={(option) => setSelectedLedger(option)}
                  value={selectedLedger}
                  placeholder="Search and select a ledger"
                  isSearchable
                />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={creating}
                className="w-full bg-primary text-white py-2 rounded"
              >
                {creating ? "Creating..." : "Create Loan Book"}
              </button>
            </form>
            <DialogClose asChild>
              <button className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded">
              Close
              </button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CreateLoanBookModal;
