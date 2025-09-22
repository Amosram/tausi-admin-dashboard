import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Calendar, AlertCircle } from "lucide-react";
import { Professional } from "@/models";

interface BoothAssignmentProps {
  assignment: Professional;
}

const BoothAssignmentCard = ({ assignment }: BoothAssignmentProps) => {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {assignment?.assignments?.map((boothAssignment) => (
        <Card className="mt-6" key={boothAssignment.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Booth Assignment</span>
              <Badge
                variant={
                  boothAssignment.isLapsed || boothAssignment.isTerminated
                    ? "destructive"
                    : "success"
                }
              >
                {boothAssignment.isLapsed
                  ? "Lapsed"
                  : boothAssignment.isTerminated
                    ? "Terminated"
                    : "Active"}
              </Badge>
            </CardTitle>
            <CardDescription>{boothAssignment.booth.name}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {/* Booth Details */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{boothAssignment.booth.locationAddress}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(boothAssignment.startDate).toLocaleDateString()} -{" "}
                    {new Date(boothAssignment.endDate).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                  <span>Stations: {boothAssignment.booth.numberOfStations}</span>
                </div>
                <Badge>{boothAssignment.booth.occupancyStatus}</Badge>
              </div>
  
              {/* Booth Image */}
              <div className="relative h-48 overflow-hidden rounded-lg">
                {boothAssignment.booth.imageUrl ? (
                  <img
                    src={boothAssignment.booth.imageUrl || "/placeholder.png"}
                    alt={boothAssignment.booth.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
  
export default BoothAssignmentCard;
