import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

interface EditBoothDialogProps {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: (
    value: boolean | ((prevState: boolean) => boolean)
  ) => void;
  boothId: string | null;
  boothData: { data: { name: string } };
}

export const EditBoothDialog: React.FC<EditBoothDialogProps> = ({
  isEditDialogOpen,
  setIsEditDialogOpen,
  boothId,
  boothData,
}) => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleEdit = async () => {
    try {
      if (!boothId) return;
      setIsEditDialogOpen(false);
      navigate(`/booths/${boothId}/edit`);
    } catch (error) {
      toast({
        title: "Edit Failed",
        description: `Unable to edit the booth. Please try again. ${error}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booth</DialogTitle>
            <DialogDescription>
              You are about to edit details for Booth: {boothData.data.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              You will be redirected to the edit page. Do you want to continue?
            </p>
          </div>
          <DialogFooter>
            <Button
              className="dark:bg-black dark:hover:bg-card"
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button className="dark:text-gray-300 dark:bg-orange-600 dark:hover:bg-green-800" onClick={handleEdit}>Proceed to Edit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
