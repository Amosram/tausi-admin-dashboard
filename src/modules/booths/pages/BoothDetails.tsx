import React, { useState } from "react";
import { useParams } from "react-router-dom";
import {
  Trash2,
  Edit,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loader from "@/components/layout/Loader";

import {
  useGetBoothByIdQuery,
  useDeleteBoothMutation,
  useAssignBoothMutation,
} from "../api/boothsApi";
import DummyBoothDetails from "../components/dummy-booth-details";
import Maps from "@/components/ui/maps";
import { Coordinates } from "@/models";
import { DEFAULT_LOCATION } from "@/Utils/constants";
import { AssignBoothDialog } from "../components/dialogs/assign-booth";
import { EditBoothDialog } from "../components/dialogs/edit-booth-dialog";
import { DeleteBoothDialog } from "../components/dialogs/delete-booth-dialog";
import { BoothsAssignmentCard } from "../components/cards/booths-assignment-card";
import { BoothsMaintenanceCard } from "../components/cards/booths-maintenance-card";
import BoothsLogsCard from "../components/cards/booths-logs-card";
import { boothDetails } from "../constants";

const BoothDetails: React.FC = () => {
  const { boothId } = useParams<{ boothId: string }>();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isAssignButtonDisabled, setIsAssignButtonDisabled] = useState(false);
  const [deleteBooth, { isLoading: isDeleting }] = useDeleteBoothMutation();

  const {
    data: boothData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useGetBoothByIdQuery(boothId || "", {
    skip: !boothId,
  });

  const [assignBooth, { isLoading: isAssigning }] =
    useAssignBoothMutation();

  // Incase polling is needed
  // const {
  //   data: boothData,
  //   isLoading,
  //   isError,
  // } = useBoothPolling(boothId || "", {
  //   pollingInterval: 50000, // 5 seconds
  //   enabled: true // You can toggle this based on user preference or app state
  // });

  const currentBooth = boothData?.data;
  const [coordinates, setCoordinates] = useState<Coordinates>(
    currentBooth?.coordinates || DEFAULT_LOCATION
  );

  if (isError || !boothId) {
    return <DummyBoothDetails />;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (!boothData?.data) {
    return <DummyBoothDetails />;
  }

  const details = boothDetails(currentBooth);

  const handleRefresh = () => {
    refetch();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="w-full bg-muted p-4 rounded-lg flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold uppercase">{currentBooth.name}</h2>
          <Badge variant={currentBooth.isActive ? "success" : "destructive"}>
            {currentBooth.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsAssignDialogOpen(true)}
            disabled={isAssignButtonDisabled}
            className="hover:bg-gray-700 hover:text-white"
          >
            <Edit className="mr-2 h-4 w-4" /> Assign Booth
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEditDialogOpen(true)}
            className="hover:bg-gray-700 hover:text-white"
          >
            <Edit className="mr-2 h-4 w-4" /> Edit
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
            disabled={isDeleting}
            className="hover:bg-red-700 hover:text-white"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="flex w-full gap-4 flex-col lg:flex-row">
        {details.map((details) => (
          <Card
            key={details.id}
            className="flex-1 flex flex-col border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4 border-b">
              <div className="flex items-center gap-4">
                {details.icon}
                <CardTitle>{details.label}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              {details.content.map((content) => (
                <div
                  key={content.id}
                  className="flex justify-between items-center w-full py-2 border-b last:border-none"
                >
                  <span className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                    {content.icon}
                    {content.label}
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-500">
                    {content.value}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex w-full gap-4 flex-col lg:flex-row">
        <BoothsAssignmentCard
          currentBooth={currentBooth}
          handleRefresh={handleRefresh}
          isFetching={isFetching}
        />
        <BoothsMaintenanceCard
          currentBooth={currentBooth}
          isAssignButtonDisabled={isAssignButtonDisabled}
          setIsAssignButtonDisabled={setIsAssignButtonDisabled}
        />
      </div>

      <div className="flex w-full">
        <BoothsLogsCard currentBoothLogs={currentBooth.logs} />
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Map</h3>
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

      <DeleteBoothDialog
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        boothId={boothId}
      />

      <EditBoothDialog
        isEditDialogOpen={isEditDialogOpen}
        setIsEditDialogOpen={setIsEditDialogOpen}
        boothData={boothData}
        boothId={boothId}
      />

      <AssignBoothDialog
        boothId={boothId}
        isOpen={isAssignDialogOpen}
        onOpenChange={setIsAssignDialogOpen}
        assignBooth={assignBooth}
        isAssigning={isAssigning}
      />
    </div>
  );
};

export default BoothDetails;
