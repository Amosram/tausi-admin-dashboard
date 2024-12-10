import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { BoothAssignmentDetails } from "@/models";
import { useDeleteBoothAssignmentMutation } from "../../api/boothsApi";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import {  ShieldAlert } from "lucide-react";

interface DeleteBoothAssignmentDialogProps {
  isDeleteDialogOpen: boolean;
  setDeleteDialogOpen: (
    value: boolean | ((prevState: boolean) => boolean)
  ) => void;
  assignment: BoothAssignmentDetails;
  boothId: string;
}

export const DeleteBoothAssignmentDialog = ({
  isDeleteDialogOpen,
  setDeleteDialogOpen,
  assignment,
}: DeleteBoothAssignmentDialogProps) => {
  const { toast } = useToast();
  const [deleteReason, setDeleteReason] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [deleteBoothAssignment, { isLoading }] =
    useDeleteBoothAssignmentMutation();

  const handleDeleteAssignment = async (assignmentId) => {
    try {
      console.log(assignmentId);

      await deleteBoothAssignment({
        id: assignmentId,
        deletedReason: deleteReason,
      }).unwrap();

      toast({
        title: "Successfully deleted",
        description: "The booth assignment has been removed.",
        variant: "success",
      });
      setDeleteDialogOpen(false);
    } catch (error) {
      toast({
        title: "Failed to delete",
        description: `Error: ${error?.message || "An unknown error occurred."}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Booth</DialogTitle>
            <DialogDescription>
              Provide a reason for deleting this booth
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Reason for deletion"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDeleteDialogOpen(false);
                setIsConfirmDialogOpen(true);
              }}
              disabled={!deleteReason}
            >
              Proceed to Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={isConfirmDialogOpen}
        onOpenChange={setIsConfirmDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <ShieldAlert className="mr-2 h-6 w-6 text-destructive" />
              Are you absolutely sure?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              booth.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteAssignment(assignment.id)}
              disabled={isLoading}
            >
              {isLoading ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
