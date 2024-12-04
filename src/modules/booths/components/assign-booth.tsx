import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { FormInputField } from "@/components/ui/Form/FormInputField";
import { useAssignBoothMutation } from "../api/boothsApi";
import { CreateBoothAssignmentRequest } from "@/models";
import { useGetUsersQuery } from "@/modules/users/api/usersApi";

// Zod schema for booth assignment validation
const boothAssignmentSchema = z
  .object({
    beauticianId: z.string().min(1, "Beautician is required"),
    startDate: z.string().refine(
      (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      { message: "Invalid start date" }
    ),
    endDate: z.string().refine(
      (value) => {
        const date = new Date(value);
        return !isNaN(date.getTime());
      },
      { message: "Invalid end date" }
    ),
  })
  .refine((data) => new Date(data.startDate) < new Date(data.endDate), {
    message: "End date must be after start date",
    path: ["endDate"],
  });

type BoothAssignmentFormValues = z.infer<typeof boothAssignmentSchema>;

interface AssignBoothDialogProps {
  boothId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AssignBoothDialog: React.FC<AssignBoothDialogProps> = ({
  boothId,
  isOpen,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [assignBooth, { isLoading }] = useAssignBoothMutation();

  // Fetch users to populate beautician dropdown
  const { data: users, isLoading: isUsersLoading } = useGetUsersQuery(100);

  const form = useForm<BoothAssignmentFormValues>({
    resolver: zodResolver(boothAssignmentSchema),
    defaultValues: {
      beauticianId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
        .toISOString()
        .split("T")[0],
    },
  });

  const onSubmit = async (formData: BoothAssignmentFormValues) => {
    try {
      const assignmentData: CreateBoothAssignmentRequest = {
        boothId,
        beauticianId: formData.beauticianId,
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate).toISOString(),
      };

      await assignBooth(assignmentData).unwrap();

      toast({
        title: "Success",
        description: "Booth assigned successfully",
      });

      onOpenChange(false);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      toast({
        title: "Failed to assign booth",
        description: `Error: ${errorMessage}`,
        variant: "destructive",
      });

      console.error("Booth assignment error:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Booth</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormInputField
              form={form}
              name="beauticianId"
              label="Beautician"
              type="select"
              options={
                users?.map((user) => ({
                  label: `${user.users.name}`,
                  value: user.users.id,
                })) || []
              }
              placeholder="Select a beautician"
            />

            <FormInputField
              form={form}
              name="startDate"
              label="Start Date"
              type="date"
              description="Date when the booth assignment begins"
            />

            <FormInputField
              form={form}
              name="endDate"
              label="End Date"
              type="date"
              description="Date when the booth assignment ends"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isUsersLoading}>
                {isLoading ? "Assigning..." : "Assign Booth"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
