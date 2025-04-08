import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BoothLog } from "@/models";
import { FaChevronLeft } from "react-icons/fa";
import { useBoothLogs } from "../hooks/useBoothLogs";

const BoothLogs: React.FC = () => {
  const { boothId } = useParams<{ boothId: string }>();
  const [selectedLog, setSelectedLog] = useState<BoothLog | null>(null);

  const { logs, isLoading, isError } = useBoothLogs(boothId!);

  if (isLoading) {
    return <p>Loading booth logs...</p>;
  }

  if (isError) {
    return <p>Error loading logs</p>;
  }

  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold flex flex-col gap-1 items-start">
            All Booth Logs
            <Button
              variant="link"
              className="text-blue-600"
              asChild
            >
              <span className="flex gap-2 items-center">
                <FaChevronLeft />
                <Link to={`/booths/${boothId}`}>Go Back</Link>
              </span>
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {sortedLogs.map((log) => (
            <div
              key={log.id}
              className="flex justify-between items-center w-full py-4 px-2 border-b last:border-none gap-4"
            >
              <div className="flex flex-col flex-grow gap-2">
                <h4 className="text-md font-semibold text-gray-800">
                  {log.description || "No description provided"}
                </h4>
                <div className="text-sm text-gray-600">
                  <p>
                    <span className="font-bold">Performed By:</span>{" "}
                    {log.performedBy}
                  </p>
                  <p>
                    <span className="font-bold">Booth ID:</span> {log.boothId}
                  </p>
                  {log.isDeleted && (
                    <>
                      <p>
                        <span className="font-bold">Deleted At:</span>{" "}
                        {log.deletedAt}
                      </p>
                      <p>
                        <span className="font-bold">Deleted Reason:</span>{" "}
                        {log.deletedReason || "No reason provided"}
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div
                  className={`flex-shrink-0 flex flex-col items-center justify-center text-white text-sm font-medium py-2 px-4 rounded-md ${
                    log.action === "update"
                      ? "bg-blue-500"
                      : log.action === "delete"
                        ? "bg-red-500"
                        : log.action === "create"
                          ? "bg-green-500"
                          : log.action === "assign"
                            ? "bg-yellow-500"
                            : "bg-gray-500"
                  }`}
                >
                  <span>{log.action.toUpperCase()}</span>
                  <span className="text-xs text-gray-200 mt-1">
                    {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <Button variant="link" className="text-blue-500"
                  onClick={() => setSelectedLog(log)}>
                  View More
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedLog && (
        <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Details</DialogTitle>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-gray-500 font-medium">Description</div>
              <div className="text-gray-700">
                {selectedLog.description || "N/A"}
              </div>

              <div className="text-gray-500 font-medium">Performed By</div>
              <div className="text-gray-700">{selectedLog.performedBy}</div>

              <div className="text-gray-500 font-medium">Action</div>
              <div className="text-gray-700">{selectedLog.action}</div>

              <div className="text-gray-500 font-medium">Booth ID</div>
              <div className="text-gray-700">{selectedLog.boothId}</div>

              {selectedLog.isDeleted && (
                <>
                  <div className="text-gray-500 font-medium">Deleted At</div>
                  <div className="text-gray-700">{selectedLog.deletedAt}</div>

                  <div className="text-gray-500 font-medium">
                    Deleted Reason
                  </div>
                  <div className="text-gray-700">
                    {selectedLog.deletedReason || "No reason provided"}
                  </div>
                </>
              )}

              <div className="text-gray-500 font-medium">Created At</div>
              <div className="text-gray-700">
                {new Date(selectedLog.createdAt).toLocaleString()}
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default BoothLogs;
