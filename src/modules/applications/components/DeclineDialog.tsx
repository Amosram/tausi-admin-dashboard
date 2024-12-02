import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { VerificationStatus, VerifiedBeauticians } from "@/models";
import { useUpdateverifiedBeauticiansMutation } from "../api/professionalApi";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";


const DeclineDialog = ({ beauticianId }: { beauticianId: string }) => {
  const [description, setDescription] = useState("");
  const [reviewedBy, setReviewedBy] = useState("")
  const [updateVerifiedBeauticians, { isLoading }] = useUpdateverifiedBeauticiansMutation();

  const handleDecline = async () => {
    if (!description.trim() || !reviewedBy.trim()) {
      toast({ title: "Error", description: "Please provide a reason for declining.", variant: "destructive" });
      return;
    }
    try {
      await updateVerifiedBeauticians({
        id: beauticianId,
        verificationStatus: VerificationStatus.Rejected,
        verificationDescription: description,
        reviewedBy:  reviewedBy as VerifiedBeauticians["reviewedBy"],
      }).unwrap();

      toast({ title: "Success", description: "Application declined successfully!" });
    } catch (error) {
      console.error("Decline failed:", error);
      toast({ title: "Error", description: "An error occurred while declining the application.", variant: "destructive" });
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button variant="destructive" className="flex items-center space-x-2">
          <XCircle size={16} />
          <span>Decline</span>
        </Button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
        <Dialog.Content className="fixed inset-0 flex items-center justify-center p-4">
          <div className="bg-white rounded-md shadow-lg max-w-md w-full p-6">
            <Dialog.Title className="text-xl font-semibold">Decline Application</Dialog.Title>
            <Dialog.Description className="mt-2 text-sm text-gray-500">
              Please provide a reason for declining this application.
            </Dialog.Description>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter reason here..."
              className="w-full mt-4 p-2 border rounded-md"
            />
            <Input
              defaultValue={reviewedBy}
              onChange={(e) => setReviewedBy(e.target.value)}
              placeholder="Reviewed by"
              className="w-full mt-4 p-2 border rounded-md"
            />
            <div className="mt-4 flex justify-end gap-4">
              <Dialog.Close asChild>
                <Button className="bg-black" disabled={isLoading}>
                  Cancel
                </Button>
              </Dialog.Close>
              <Button onClick={handleDecline} className="bg-red-600"
                disabled={isLoading}>
                {isLoading ? "Processing..." : "Decline"}
              </Button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default DeclineDialog;
