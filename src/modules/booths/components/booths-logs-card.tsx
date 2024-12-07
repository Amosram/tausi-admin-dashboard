import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BoothLog } from "@/models";

interface BoothsLogsCardProps {
  currentBoothLogs: BoothLog[];
}

const BoothsLogsCard: React.FC<BoothsLogsCardProps> = ({
  currentBoothLogs,
}) => {
  // Sort the logs by createdAt in descending order and take the latest 2
  const latestLogs = [...currentBoothLogs]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 2);

  return (
    <div className="flex-1 space-y-4">
      {latestLogs.map((log, key) => (
        <Card className="w-full" key={key}>
          <CardHeader>
            <CardTitle>{log.id}</CardTitle>
            <CardDescription>{log.action}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-700">{log.description}</p>
            <p className="mt-2 text-sm text-gray-500">
              Performed by: {log.performedBy}
            </p>
            <p className="text-xs text-gray-400">
              {new Date(log.createdAt).toLocaleString()}
            </p>
          </CardContent>
          <CardFooter>
            {log.isActive ? (
              <span className="text-green-500 text-xs">Active</span>
            ) : (
              <span className="text-red-500 text-xs">Inactive</span>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default BoothsLogsCard;
