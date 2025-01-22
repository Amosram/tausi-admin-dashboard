import React, { useState } from "react";
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
import {
  useAssignBoothMutation,
  useGetBoothByIdQuery,
} from "../../api/boothsApi";
import { Assignment, CreateBoothAssignmentRequest } from "@/models";
import {
  useGetProfessionalsQuery,
  useUpdateProfessionalMutation,
} from "@/modules/applications/api/professionalApi";
import { DebouncedInput } from "@/components/ui/DebounceInput";

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
  assignBooth: ReturnType<typeof useAssignBoothMutation>[0];
  isAssigning: boolean;
}

export const AssignBoothDialog: React.FC<AssignBoothDialogProps> = ({
  boothId,
  isOpen,
  onOpenChange,
  assignBooth,
  isAssigning,
}) => {
  const { toast } = useToast();

  const { data: professionalData, isLoading: isProfessionalsLoading } =
    useGetProfessionalsQuery(100);
  const { data: booth } = useGetBoothByIdQuery(boothId);

  const [updateProfessional, { isLoading }] = useUpdateProfessionalMutation();

  const professional = professionalData?.data || [];

  const [searchTerm, setSearchTerm] = useState(""); // State for the search term

  // Filter professionals based on search term
  const filteredProfessionals = professional.filter((p) =>
    p.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

      const assignedBoothResponse = await assignBooth(assignmentData).unwrap();

      const assignmentsArray = Array.isArray(assignedBoothResponse?.data)
        ? assignedBoothResponse.data
        : [assignedBoothResponse?.data];

      const mappedAssignmentsArray: Assignment[] = assignmentsArray.map(
        (item) => ({
          ...item,
          booth: booth.data,
        })
      );

      await updateProfessional({
        id: formData.beauticianId,
        assignments: mappedAssignmentsArray,
      }).unwrap();

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

  const SearchableSelect = ({ options, value, onChange, placeholder }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    const filteredOptions = options.filter((option) =>
      option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="relative">
        <h1 className="text-sm mb-3">Beautician</h1>
        <div
          className="border rounded-md cursor-pointer p-2"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {value
            ? options.find((o) => o.value === value)?.label || placeholder
            : placeholder}
        </div>

        {isOpen && (
          <div className="absolute z-10 mt-1 w-full bg-secondary text-black border rounded-md shadow-lg">
            <DebouncedInput
              value={searchTerm}
              onChange={(value) => setSearchTerm(value as string)}
              className="w-full p-2 border-b"
              placeholder="Search..."
            />
            <ul className="max-h-60 overflow-auto">
              {filteredOptions.map((option) => (
                <li
                  key={option.value}
                  className="cursor-pointer p-2 hover:bg-gray-200"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {option.label}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Booth</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <SearchableSelect
              options={
                professional?.map((p) => ({
                  label: p.businessName || "Unknown",
                  value: p.id,
                })) || []
              }
              value={form.watch("beauticianId")}
              onChange={(value) => form.setValue("beauticianId", value)}
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
                className="dark:bg-black dark:hover:bg-card"
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                className="dark:text-gray-300 dark:bg-orange-600 dark:hover:bg-green-800"
                type="submit"
                disabled={isAssigning || isProfessionalsLoading}
              >
                {isAssigning ? "Assigning..." : "Assign Booth"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
