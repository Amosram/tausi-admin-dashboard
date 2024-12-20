import { useState } from "react";
import { MapPin, Edit } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useBoothAssignments } from "../hooks/useBoothAssignments";
import { Link, useParams } from "react-router-dom";
import { AssignmentDetailsDialog } from "../components/dialogs/assignment-details-dialog";
import { DeleteBoothAssignmentDialog } from "../components/dialogs/delete-assignment-dialog";

const BoothsAssignments = () => {
  const { boothId } = useParams();
  const { assignments, isLoading, isError } = useBoothAssignments(boothId);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [isTerminateDialogOpen, setTerminateDialogOpen] = useState(false);

  const handleOpenDetailsDialog = (assignment) => {
    setSelectedAssignment(assignment);
  };

  if (isLoading) return <p>Loading assignments...</p>;
  if (isError) return <p>Error: Failed to load assignments</p>;

  const sortedAssignments = [...assignments].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="space-y-4 px-6">
      <Link
        to={`/booths/${boothId}`}
        className="w-full items-center flex flex-col p-4 hover:underline text-blue-500"
      >
        Go Back
      </Link>
      {sortedAssignments.length > 0 ? (
        sortedAssignments.map((assignment) => (
          <Card
            key={assignment.id}
            className="hover:shadow-lg transition-shadow duration-300"
          >
            <CardHeader className="bg-gray-50 p-4 border-b flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-gray-600" />
                Assignment ID: {assignment.id}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleOpenDetailsDialog(assignment)}
              >
                <Edit className="h-4 w-4 mr-2" /> Details
              </Button>
            </CardHeader>
            <CardContent className="p-4">
              <div className="flex justify-between px-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Beautician ID</p>
                  <p className="font-semibold">{assignment.beauticianId}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1 items-end flex flex-col">
                    Assignment Period
                  </p>
                  <p className="font-semibold">
                    {new Date(assignment.startDate).toLocaleDateString()} -{" "}
                    {new Date(assignment.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="mt-4 flex items-center space-x-2 px-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    assignment.isLapsed
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {assignment.isLapsed ? "Lapsed" : "Active"}
                </span>
                {assignment.isTerminated && (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                    Terminated
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-gray-500 text-center py-4">
          No assignments available
        </p>
      )}

      {selectedAssignment && (
        <AssignmentDetailsDialog
          assignment={selectedAssignment}
          isOpen={!!selectedAssignment}
          onOpenChange={() => setSelectedAssignment(null)}
          // boothId={boothId}
          setTerminateDialogOpen={setTerminateDialogOpen}
        />
      )}

      <DeleteBoothAssignmentDialog
        isDeleteDialogOpen={isTerminateDialogOpen}
        setDeleteDialogOpen={setTerminateDialogOpen}
        assignment={selectedAssignment}
        boothId={boothId}
      />
    </div>
  );
};

export default BoothsAssignments;
