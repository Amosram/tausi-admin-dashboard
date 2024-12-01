import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
import {
  Building,
  MapPin,
  Info,
  Trash2,
  Edit,
  ShieldAlert,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";

import {
  useGetBoothByIdQuery,
  useDeleteBoothMutation,
  useUpdateBoothMutation,
} from "../api/boothsApi";
import DummyBoothDetails from "../components/dummy-booth-details";

const BoothDetails: React.FC = () => {
  const { boothId } = useParams<{ boothId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [deleteReason, setDeleteReason] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const {
    data: boothData,
    isLoading,
    isError,
  } = useGetBoothByIdQuery(boothId || "", {
    skip: !boothId,
  });

  const [deleteBooth, { isLoading: isDeleting }] = useDeleteBoothMutation();
  const [updateBooth, { isLoading: isUpdating }] = useUpdateBoothMutation();

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
        description: "Unable to delete the booth. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleteDialogOpen(false);
      setIsConfirmDialogOpen(false);
    }
  };

  const handleEdit = async () => {
    try {
      if (!boothId) return;

      //TODO: Implement edit logic here
      toast({
        title: "Edit Functionality",
        description: "Edit functionality will be implemented soon.",
        variant: "default",
      });

      setIsEditDialogOpen(false);
    } catch (error) {
      toast({
        title: "Edit Failed",
        description: "Unable to edit the booth. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isError || !boothId) {
    return <DummyBoothDetails />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!boothData?.data) {
    return <DummyBoothDetails />;
  }

  const currentBooth = boothData.data;

  return (
    <div className="p-6 space-y-6">
      <div className="w-full bg-muted p-4 rounded-lg flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold uppercase">Booth Details</h2>
          <Badge variant={currentBooth.isActive ? "default" : "destructive"}>
            {currentBooth.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsEditDialogOpen(true)}
            disabled={isUpdating}
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeleting}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="mr-2 h-5 w-5" /> Location
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{currentBooth.locationAddress}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Building className="mr-2 h-5 w-5" /> Booth Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Booth ID:</strong> {currentBooth.id}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {format(new Date(currentBooth.createdAt), "PPP")}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Info className="mr-2 h-5 w-5" /> Additional Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              <strong>Status:</strong>{" "}
              {currentBooth.isActive ? "Active" : "Inactive"}
            </p>
          </CardContent>
        </Card>
      </div>

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

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Booth</DialogTitle>
            <DialogDescription>
              Make changes to the booth details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <p>Edit functionality coming soon...</p>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoothDetails;
