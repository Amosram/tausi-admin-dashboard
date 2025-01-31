import { MapPin, RefreshCw } from "lucide-react";
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
import { useGetAssignmentQuery } from "../../api/boothsApi";

interface BoothsAssignmentCardProps {
  currentBooth: Booth;
  handleRefresh: () => void;
  isFetching: boolean;
}

const AssignmentItem = ({ assignment }) => {
  const { data: assignmentDetails } = useGetAssignmentQuery(assignment.id, {
    skip: !assignment.id
  });

  const businessName = assignmentDetails?.data?.beautician?.businessName;

  return (
    <div className="mb-2 p-2 border rounded">
      <div className="flex justify-between">
        <div>
          <p className="font-semibold">Beautician</p>
          <p>{businessName || 'Loading...'}</p>
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
  );
};

export const BoothsAssignmentCard: React.FC<BoothsAssignmentCardProps> = ({
  currentBooth,
  handleRefresh,
  isFetching,
}) => {
  const recentAssignments = [...currentBooth.assignments]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 2);

    const assignmentsLength = currentBooth?.assignments.length || 0;

  return (
    <Card className="flex-1 flex flex-col border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4 border-b">
        <CardTitle className="flex justify-between">
          <div className="flex items-center gap-3">
            Total Assignments: {assignmentsLength}
          </div>
          <button
            onClick={handleRefresh}
            disabled={isFetching}
            className="hover:bg-gray-100 dark:hover:bg-gray-700 p-1 rounded-full transition-colors"
          >
            <RefreshCw
              className={`h-5 w-5 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {recentAssignments.length > 0 ? (
          <div className="mt-2">
            {recentAssignments.map((assignment) => (
              <AssignmentItem key={assignment.id} assignment={assignment} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">No assignments</p>
        )}
      </CardContent>
      <CardFooter className="mt-auto">
        <Button variant="link" asChild>
          <Link to="assignments">View More</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};