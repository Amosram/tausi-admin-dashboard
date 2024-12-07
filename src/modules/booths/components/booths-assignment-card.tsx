import { MapPin } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Booth } from "@/models";

interface BoothsAssignmentCardProps {
  currentBooth: Booth;
}

export const BoothsAssignmentCard: React.FC<BoothsAssignmentCardProps> = ({
  currentBooth,
}) => {
  const recentAssignments = currentBooth.assignments.slice(0, 2);
  return (
    <Card className="flex-1 flex flex-col border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gray-50 p-4 border-b">
        <CardTitle className="flex items-center gap-3">
          <MapPin className="h-5 w-5" />
          Assignments
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentAssignments.length > 0 ? (
          <div className="mt-2">
            {recentAssignments.map((assignment) => (
              <div key={assignment.id} className="mb-2 p-2 border rounded">
                <div className="flex justify-between">
                  <div>
                    <p className="font-semibold">Beautician ID</p>
                    <p>{assignment.beauticianId}</p>
                  </div>
                  <div>
                    <p className="font-semibold">Assignment Period</p>
                    <p>
                      {new Date(assignment.startDate).toLocaleDateString()} -{" "}
                      {new Date(assignment.endDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="mt-2 flex justify-between">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      assignment.isLapsed
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-green-100 text-green-800"
                    }`}
                  >
                    {assignment.isLapsed ? "Lapsed" : "Active"}
                  </span>
                  {assignment.isTerminated && (
                    <span className="px-2 py-1 rounded text-sm bg-red-100 text-red-800">
                      Terminated
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">No assignments</p>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button variant="link" asChild>
          <Link to="">View More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
