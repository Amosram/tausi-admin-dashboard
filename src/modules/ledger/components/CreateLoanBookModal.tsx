import { useState, useEffect, useMemo } from "react";
import {
  useCreateLoanBookMutation,
  useGetLedgersQuery,
  useUpdateLoanBookMutation,
} from "../api/ledgersApi";
import { useToast } from "@/hooks/use-toast";
import { Dialog } from "@/components/ui/dialog";
import {
  DialogClose,
  DialogContent,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
} from "@radix-ui/react-dialog";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface CreateLoanBookModalProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: { id: string; name: string; ledgerId: string; ownerId: string };
}

const CreateLoanBookModal: React.FC<CreateLoanBookModalProps> = ({
  isOpen,
  onClose,
  editData,
}) => {
  const toast = useToast();

  const [name, setName] = useState("");
  const [selectedLedger, setSelectedLedger] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedOwner, setSelectedOwner] = useState<{
    label: string;
    value: string;
  } | null>(null);

  const { data: ledgers, isLoading: loadingLedgers } = useGetLedgersQuery();
  const [createLoanBook, { isLoading: creating }] = useCreateLoanBookMutation();
  const [updateLoanBook, { isLoading: updating }] = useUpdateLoanBookMutation();

  // Memoized options for Select components
  const ledgerOptions = useMemo(
    () =>
      ledgers?.data.map((ledger) => ({
        value: ledger.id,
        label: ledger.name,
      })) || [],
    [ledgers]
  );

  const ownerOptions = useMemo(
    () =>
      ledgers?.data.map((ledger) => ({
        value: ledger.ownerId,
        label: ledger.owner?.businessName,
      })) || [],
    [ledgers]
  );

  const resetForm = () => {
    setName("");
    setSelectedLedger(null);
    setSelectedOwner(null);
  };

  useEffect(() => {
    if (editData) {
      setName(editData.name);
      setSelectedLedger(
        ledgerOptions.find((option) => option.value === editData.ledgerId) || null
      );
      setSelectedOwner(
        ownerOptions.find((option) => option.value === editData.ownerId) || null
      );
    } else {
      resetForm();
    }
  }, [editData, ledgerOptions, ownerOptions]);

  const handleSubmit = async () => {
    if (!name || !selectedLedger?.value || !selectedOwner?.value) {
      toast.toast({
        title: "Missing fields",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }

    const payload = {
      name,
      ledgerId: selectedLedger.value,
      ownerId: selectedOwner.value,
    };

    try {
      if (editData) {
        await updateLoanBook({ id: editData.id, name }).unwrap();
        toast.toast({
          title: "Loan book updated successfully!",
          description: "Loan book has been updated successfully.",
          variant: "success",
        });
      } else {
        await createLoanBook(payload).unwrap();
        toast.toast({
          title: "Loan book created successfully!",
          description: "Loan book has been created successfully.",
          variant: "success",
        });
      }
      onClose();
    } catch (error: any) {
      console.error("Error submitting loan book:", error);
      toast.toast({
        title: "Error",
        description: error?.data?.message || "Failed to save loan book.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogPortal>
        <DialogOverlay className="fixed inset-0 bg-black bg-opacity-50" />
        <DialogContent className="fixed inset-0 flex items-center justify-center">
          <div className="bg-white rounded-lg w-1/3 p-6 shadow-lg">
            <DialogTitle className="text-lg font-bold mb-4">
              {editData ? "Edit Loan Book" : "Create New Book"}
            </DialogTitle>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Book Name</label>
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded"
                  placeholder="Enter loan book name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Owner</label>
                <Select
                  options={ownerOptions}
                  isLoading={loadingLedgers}
                  value={selectedOwner}
                  onChange={setSelectedOwner}
                  placeholder="Search and select an owner"
                  isSearchable
                  isDisabled={!!editData}
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Select Ledger</label>
                <Select
                  options={ledgerOptions}
                  isLoading={loadingLedgers}
                  value={selectedLedger}
                  onChange={setSelectedLedger}
                  placeholder="Search and select a ledger"
                  isSearchable
                  isDisabled={!!editData}
                />
              </div>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={creating || updating}
                className="w-full bg-primary text-white py-2 rounded"
              >
                {creating || updating ? "Saving..." : "Save Book"}
              </Button>
            </form>
            <DialogClose asChild>
              <Button className="mt-4 w-full bg-gray-200 text-gray-700 py-2 rounded">
                Close
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default CreateLoanBookModal;
