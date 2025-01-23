import React, { useState, useEffect } from "react";
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
import { useSearchProfessionalsMutation, useUpdateProfessionalMutation } from "@/modules/applications/api/professionalApi";
import { DebouncedInput } from "@/components/ui/DebounceInput";
import { useAssignBoothMutation, useGetBoothByIdQuery } from "../../api/boothsApi";
import { SearchCriteriaType } from "@/hooks/useSearch";
import { Assignment } from "@/models";

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
  const [searchProfessionals, { data: searchResults, isLoading }] =
    useSearchProfessionalsMutation();

  const { data: booth } = useGetBoothByIdQuery(boothId);

  const [updateProfessional] = useUpdateProfessionalMutation();

  const [searchTerm, setSearchTerm] = useState("");
  const [professionals, setProfessionals] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const fetchDefaultProfessionals = async () => {
    const defaultCriteria: SearchCriteriaType[] = [
      {
        field: "createdAt",
        operator: "between",
        value: [
          new Date(
            new Date().setFullYear(new Date().getFullYear() - 50)
          ).toISOString(),
          new Date().toISOString(),
        ],
      },
    ];

    const response = await searchProfessionals({
      searchCriteria: defaultCriteria,
    }).unwrap();

    setProfessionals(response.data || []);
  };

  useEffect(() => {
    if (searchTerm) {
      const dynamicCriteria: SearchCriteriaType[] = [
        {
          field: "businessName",
          operator: "ilike",
          value: searchTerm,
        },
      ];

      searchProfessionals({ searchCriteria: dynamicCriteria })
        .unwrap()
        .then((response) => setProfessionals(response.data || []));
    } else {
      fetchDefaultProfessionals();
    }
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        event.target instanceof HTMLElement &&
        !event.target.closest(".dropdown-container")
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

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
      const assignmentData = {
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
      toast({
        title: "Failed to assign booth",
        description: `Error: ${error.message || "Something went wrong"}`,
        variant: "destructive",
      });
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
            <div className="relative text-black">
              {/* Search Input */}
              <DebouncedInput
                value={selectedValue || searchTerm} // Show the selected value or the search term
                onChange={(value) => {
                  if (!selectedValue) {
                    setSearchTerm(value as string);
                    setIsDropdownOpen(true); // Open dropdown only when no value is selected
                  }
                }}
                placeholder="Search Beauticians..."
                className="w-full p-2 border rounded text-black"
                disabled={!!selectedValue} // Disable input when a value is selected
              />

              {/* Clear Button */}
              {selectedValue && (
                <button
                  onClick={() => {
                    setSelectedValue(""); // Clear the selected value
                    setSearchTerm(""); // Reset search term
                    setIsDropdownOpen(false); // Close dropdown
                  }}
                  className="absolute top-1/2 right-2 transform -translate-y-1/2 text-gray-500 hover:text-black"
                >
                  Clear
                </button>
              )}

              {/* Dropdown for Search Results */}
              {isDropdownOpen && professionals.length > 0 && (
                <ul className="absolute mt-2 bg-white border rounded w-full max-h-48 overflow-y-auto z-10">
                  {professionals.map((p) => (
                    <li
                      key={p.id}
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                      onClick={() => {
                        // Set the selected beautician's ID in the form
                        form.setValue("beauticianId", p.id, {
                          shouldValidate: true,
                        });

                        // Set the selected value and stop further search
                        setSelectedValue(p.businessName || "");
                        setSearchTerm(""); // Clear search term to stop queries
                        setIsDropdownOpen(false); // Close dropdown
                      }}
                    >
                      {p.businessName || "Unknown"}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <FormInputField
              form={form}
              name="startDate"
              label="Start Date"
              type="date"
            />

            <FormInputField
              form={form}
              name="endDate"
              label="End Date"
              type="date"
            />

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isAssigning}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isAssigning}>
                {isAssigning ? "Assigning..." : "Assign Booth"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
