import { useState, useEffect } from "react";
import { useCreateLoanBookMutation, useGetLedgersQuery, useUpdateLoanBookMutation } from "../api/ledgersApi";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import { DialogClose, DialogContent, DialogOverlay, DialogPortal, DialogTitle } from "@radix-ui/react-dialog";
import Select from 'react-select';
import { Input } from "@/components/ui/input";


interface CreateLoanBookModalProps {
    isOpen: boolean;
    onClose: () => void;
    editData?: { id: string; name: string; ledgerId: string };
}

const CreateLoanBookModal: React.FC<CreateLoanBookModalProps> = ({isOpen, onClose, editData}) => {

  const toast = useToast();

  const [name, setName] = useState("");
  const [selectedLedger, setSelectedLedger] = useState<{label: string; value: string} | null>(null);

  const {data: ledgers, isLoading:loadingLedgers, isError} = useGetLedgersQuery();
  const [createLoanBook, {isLoading: creating}] = useCreateLoanBookMutation();
  const [updateLoanBook, { isLoading: updating }] = useUpdateLoanBookMutation();

  const ledgerOptions = ledgers?.data.map((ledger) => ({
    value: ledger.id,
    label: ledger.name,
  }));

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setSelectedLedger(
        ledgerOptions?.find((option) => option.value === editData.ledgerId) || null
      );
    } else {
      setName("");
      setSelectedLedger(null);
    }
  }, [editData, ledgerOptions]);

  const handleSubmit = async () => {
    if (!name || !selectedLedger) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      if (editData) {
        // Update loan book
        await updateLoanBook({ id: editData.id, name }).unwrap();
        alert("Loan book updated successfully!");
      } else {
        // Create new loan book
        await createLoanBook({ name, ledgerId: selectedLedger.value }).unwrap();
        alert("Loan book created successfully!");
      }
      onClose();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save loan book.");
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
                  defaultValue={name}
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
                  isDisabled={!!editData}
                />
              </div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={creating || updating}
                className="w-full bg-primary text-white py-2 rounded"
              >
                {creating || updating ? "Saving..." : "Save Loan Book"}
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


