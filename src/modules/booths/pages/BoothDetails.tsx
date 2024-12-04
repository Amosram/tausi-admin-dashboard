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
  Tag,
  LayoutGrid,
  Users,
  Calendar,
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
import Maps from "@/components/ui/maps";
import { Coordinates } from "@/models";
import { DEFAULT_LOCATION } from "@/Utils/constants";

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

  const currentBooth = boothData?.data;
  console.log("Current bootc, ", currentBooth)

  const [coordinates, setCoordinates] = useState<Coordinates>(
    currentBooth?.coordinates || DEFAULT_LOCATION
  );

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
        description: `Unable to delete the booth. Please try again. ${error}`,
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

  if (isError || !boothId) {
    return <DummyBoothDetails />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!boothData?.data) {
    return <DummyBoothDetails />;
  }

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
          <Button variant="outline" onClick={() => setIsEditDialogOpen(true)}>
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

      <div className="grid md:grid-cols-2 gap-4">
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
          <CardHeader className="flex-row items-center space-x-3 pb-2">
            <Users className="h-6 w-6" />
            <CardTitle className="m-0">Beautician Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>Total Beauticians</span>
              </div>
              <span className="font-semibold">
                {currentBooth.numberOfBeauticians || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Last Beautician Update</span>
              </div>
              <span>
                {currentBooth.updatedAt
                  ? format(new Date(currentBooth.updatedAt), "PPP")
                  : "N/A"}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center space-x-3 pb-2">
            <ShieldAlert className="h-6 w-6" />
            <CardTitle className="m-0">Maintenance History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Last Maintenance</span>
              </div>
              <span>
                {currentBooth.updatedAt
                  ? format(new Date(currentBooth.updatedAt), "PPP")
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>Maintenance Status</span>
              </div>
              <span className="font-semibold">
                {currentBooth.underMaintenance
                  ? "Under Maintenance"
                  : "Operational"}
              </span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center space-x-3 pb-2">
            <Trash2 className="h-6 w-6" />
            <CardTitle className="m-0">Deleted Booth History</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>Deleted At</span>
              </div>
              <span>
                {currentBooth.deletedAt
                  ? format(new Date(currentBooth.deletedAt), "PPP")
                  : "N/A"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span>Reason for Deletion</span>
              </div>
              <span>{currentBooth.deletedReason || "No reason provided"}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center space-x-3 pb-2">
            <LayoutGrid className="h-6 w-6" />
            <CardTitle className="m-0">Station Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span>Total Stations</span>
              </div>
              <span className="font-semibold">
                {currentBooth.numberOfStations || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>Stations Occupied</span>
              </div>
              <span className="font-semibold">TBD</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex-row items-center space-x-3 pb-2">
            <ShieldAlert className="h-6 w-6" />
            <CardTitle className="m-0">Booth Security</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Info className="h-4 w-4 text-muted-foreground" />
                <span>Occupancy Status</span>
              </div>
              <Badge
                variant={
                  currentBooth.occupancyStatus === "occupied"
                    ? "default"
                    : "outline"
                }
              >
                {currentBooth.occupancyStatus || "Unknown"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ShieldAlert className="h-4 w-4 text-muted-foreground" />
                <span>Security Alert</span>
              </div>
              <span>
                {currentBooth.isActive ? "No alerts" : "Security Alert"}
              </span>
            </div>
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

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Map View</h3>
        <Maps
          coordinates={{
            lat: currentBooth.coordinates.y,
            lng: currentBooth.coordinates.x,
          }}
          setCoordinates={(coords) => {
            setCoordinates({
              x: coords.lng,
              y: coords.lat,
            });
          }}
        />
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
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleEdit} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Proceed to Edit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BoothDetails;
