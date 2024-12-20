import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useUpdateProfessionalMutation } from "../api/professionalApi";
import { Professional } from "@/models";


const DeactivateDialog = ({ professionalId }: { professionalId: string }) => {
  const [reason, setReason] = useState("");
  const [deactivatedBy, setDeactivatedBy] = useState("");
  const [updateProfessional, { isLoading }] = useUpdateProfessionalMutation();
  const [isOpen, setIsOpen] = useState(true);

  const handleDeactivate = async () => {
    if (!reason.trim() || !deactivatedBy.trim()) {
      toast({ title: "Error", description: "Please provide a reason for deactivation.", variant: "destructive" });
      return;
    }
    try {
      await updateProfessional({
        id: professionalId,
        isActive: false,
        deactivatedReason: reason,
        deactivatedBy: deactivatedBy,
        deactivatedAt: new Date().toISOString(),
      }).unwrap();

      toast({
        title: "Success",
        description: "User has been deactivated successfully.",
        variant: "success",
      });

      setIsOpen(false);

      // reset form fields
      setReason("");
      setDeactivatedBy("");
    } catch (error) {
      console.error("Deactivate failed:", error);
      toast({ title: "Error", description: "An error occurred while deactivating the User.", variant: "destructive" });
    }
  };

  return (
    <Dialog.Root onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        <Button variant="destructive" className="flex items-center space-x-2">
          <XCircle size={16} />
          <span>Deactivate</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-lg max-w-md w-full p-6">
            <Dialog.Title className="text-xl font-semibold">Deactivate User</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500">
              Please provide a reason for deactivating this User.
            </Dialog.Description>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason here..."
              className="w-full mt-4 p-2 border rounded-md"
            />
            <Input
              defaultValue={deactivatedBy}
              onChange={(e) => setDeactivatedBy(e.target.value)}
              placeholder="Deactivated by"
              className="w-full mt-4 p-2 border rounded-md"
            />
            <div className="mt-4 flex justify-end gap-4">
              <Dialog.Close asChild>
                <Button className="bg-black" disabled={isLoading}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={handleDeactivate} className="bg-red-600"
                disabled={isLoading}>
                {isLoading ? "Processing..." : "Deactivate"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeactivateDialog;
