import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useUseGetVerifiedBeauticianByIdQuery } from "@/modules/applications/api/professionalApi";
import { assignmentDetailsArray } from "../constants";

export const AssignmentDetailsDialog = ({
  assignment,
  isOpen,
  onOpenChange,
  boothId,
}) => {
  const {
    data,
    isLoading: beauticianLoading,
    isError: beauticianError,
  } = useUseGetVerifiedBeauticianByIdQuery(assignment.beauticianId);
  
  const handleTerminateAssignment = (assignmentId) => {
    console.log(`Terminating assignment ${assignmentId}`);
    // API call to terminate assignment
  };

  const handleRestoreAssignment = (assignmentId) => {
    console.log(`Restoring assignment ${assignmentId}`);
    // API call to restore assignment
  };

  const beautician = data?.data;

  const assignmentDetails = assignmentDetailsArray({
    beauticianLoading,
    beauticianError,
    beautician,
    assignment,
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Assignment Details</DialogTitle>
          <DialogDescription>
            Detailed information about the booth assignment
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-2">
          {assignmentDetails.map((detail) => (
            <div className="flex justify-between" key={detail.id}>
              <label className="text-right font-semibold">{detail.label}</label>
              {detail.content}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-4">
          <Button
            className="bg-green-500"
            disabled={!assignment.isTerminated}
            onClick={() => handleRestoreAssignment(assignment.id)}
          >
            Restore Assignment
          </Button>
          <Button
            variant="destructive"
            onClick={() => handleTerminateAssignment(assignment.id)}
            disabled={assignment.isTerminated}
          >
            <X className="h-4 w-4" /> Terminate Assignment
          </Button>
        </div>
        {beautician && (
          <div className="mt-4">
            <a
              href={`/beauticians/${beautician.id}`}
              className="text-blue-500 text-sm hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Beautician Details
            </a>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
