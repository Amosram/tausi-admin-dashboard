import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useDeleteBoothMutation } from "../api/boothsApi";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

interface DeleteBoothDialogProps {
  isDeleteDialogOpen: boolean;
  setIsDeleteDialogOpen: (
    value: boolean | ((prevState: boolean) => boolean)
  ) => void;
  boothId: string | null;
}

export const DeleteBoothDialog: React.FC<DeleteBoothDialogProps> = ({
  isDeleteDialogOpen,
  setIsDeleteDialogOpen,
  boothId,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteReason, setDeleteReason] = useState("");
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  const [deleteBooth, { isLoading: isDeleting }] = useDeleteBoothMutation();

  const handleDelete = async () => {
    try {
      if (!boothId) return;

      await deleteBooth({
        id: boothId,
        deletedReason: deleteReason,
      }).unwrap();

      toast({
        title: "Booth Deleted",
        description: "The booth has been successfully deleted.",
        variant: "default",
      });

      navigate("/booths");
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: `Unable to delete the booth. Please try again. ${error}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setIsConfirmDialogOpen(false);
    }
  };
  return (
    <div>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
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
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setIsConfirmDialogOpen(true);
              }}
              disabled={!deleteReason.trim()}
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
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? "Deleting..." : "Confirm Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
