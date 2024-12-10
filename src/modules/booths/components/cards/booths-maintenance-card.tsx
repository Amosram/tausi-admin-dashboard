import React, { useState } from "react";
import { Calendar, RefreshCw, ShieldAlert, Tag } from "lucide-react";
import { toZonedTime, format as formatWithTZ } from "date-fns-tz";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Booth } from "@/models";
import { useGetBoothByIdQuery, useUpdateBoothMutation } from "../../api/boothsApi";

interface BoothsMaintenanceCardProps {
  currentBooth: Booth;
  isAssignButtonDisabled: boolean;
  setIsAssignButtonDisabled: (
    value: boolean | ((prevState: boolean) => boolean)
  ) => void;
}

export const BoothsMaintenanceCard: React.FC<BoothsMaintenanceCardProps> = ({
  currentBooth,
  isAssignButtonDisabled,
  setIsAssignButtonDisabled,
}) => {
  const [updateBooth, { isLoading: isUpdating }] = useUpdateBoothMutation();
  const { refetch, isFetching } = useGetBoothByIdQuery(currentBooth.id, {
    skip: !currentBooth.id,
  });
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleToggleMaintenance = async () => {
    setDialogOpen(false);
    try {
      await updateBooth({
        id: currentBooth.id,
        data: {
          underMaintenance: !currentBooth.underMaintenance,
          isActive: !currentBooth.isActive,
        },
      }).unwrap();
      await refetch();
      alert(
        currentBooth.underMaintenance
          ? "The booth is now operational."
          : "The booth is now under maintenance."
      );

      setIsAssignButtonDisabled(!isAssignButtonDisabled);
    } catch (error) {
      alert(`Failed to update maintenance status. Please try again. ${error}`);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  const timeZone = "Africa/Nairobi";
  const serverTime = currentBooth.updatedAt;
  const parsedDate = new Date(`${serverTime}Z`);
  const zonedTime = toZonedTime(parsedDate, timeZone);
  const formattedDate = formatWithTZ(zonedTime, "PPP p", { timeZone });

  return (
    <Card className="flex-1 flex justify-between flex-col border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gray-50 p-4 border-b">
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5" />
            Maintenance
          </div>
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="hover:bg-gray-100 p-1 rounded-full transition-colors"
          >
            <RefreshCw
              className={`h-5 w-5 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>Last Maintenance</span>
          </div>
          <span>{formattedDate}</span>
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
      <CardFooter>
        <AlertDialog open={isDialogOpen} onOpenChange={setDialogOpen}>
          <AlertDialogTrigger asChild>
            <button
              className={`px-4 py-2 rounded ${
                currentBooth.underMaintenance
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-blue-500 text-white hover:bg-blue-600"
              }`}
              disabled={isUpdating}
            >
              {currentBooth.underMaintenance
                ? "Remove from Maintenance"
                : "Place under Maintenance"}
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Action</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to{" "}
                {currentBooth.underMaintenance
                  ? "remove this booth from maintenance"
                  : "place this booth under maintenance"}
                ? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleToggleMaintenance}>
                Confirm
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};
