import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInputField } from "@/components/ui/Form/FormInputField";
import { useGetBoothByIdQuery, useUpdateBoothMutation } from "../api/boothsApi";
import { Booth, BoothsApiResponse, Coordinates } from "@/models";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Maps from "@/components/ui/maps";
import Loader from "@/components/layout/Loader";

const boothFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  locationAddress: z.string().min(5, "Location must be at least 5 characters"),
  numberOfBeauticians: z
    .number()
    .refine(
      (value) => Number.isInteger(value) && value > 0,
      "Must be a positive integer"
    )
    .refine((value) => value <= 100, "Too many beauticians"),
  numberOfStations: z
    .number()
    .refine(
      (value) => Number.isInteger(value) && value > 0,
      "Must be a positive integer"
    )
    .refine((value) => value <= 50, "Too many stations"),
  occupancyStatus: z.enum(["empty", "occupied"], {
    required_error: "Please select the occupancy status",
  }),
  imagePath: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional(),
  coordinates: z.object({
    x: z.number().min(-180).max(180, "Longitude must be between -180 and 180"),
    y: z.number().min(-90).max(90, "Latitude must be between -90 and 90"),
  }),
  isActive: z.boolean().optional(),
});

type BoothFormValues = z.infer<typeof boothFormSchema>;

const EditBoothPage: React.FC = () => {
  const { boothId } = useParams<{ boothId: string }>();
  const { toast } = useToast();
  const navigate = useNavigate();

  const {
    data: boothData,
    isLoading: isBoothLoading,
    isError,
  } = useGetBoothByIdQuery(boothId || "", {
    skip: !boothId,
  });

  const [updateBooth, { isLoading: isUpdating }] = useUpdateBoothMutation();
  const [isCoordinateModalOpen, setIsCoordinateModalOpen] = useState(false);

  const form = useForm<BoothFormValues>({
    resolver: zodResolver(boothFormSchema),
    defaultValues: {
      name: "",
      locationAddress: "",
      occupancyStatus: "empty",
      imagePath: "",
      imageUrl: "",
      coordinates: { x: 0, y: 0 },
      isActive: true,
    },
  });

  useEffect(() => {
    if (boothData?.data) {
      const booth = boothData.data;
      form.reset({
        name: booth.name,
        locationAddress: booth.locationAddress,
        numberOfBeauticians: booth.numberOfBeauticians,
        numberOfStations: booth.numberOfStations,
        occupancyStatus: booth.occupancyStatus as "empty" | "occupied",
        imagePath: booth.imagePath || "",
        imageUrl: booth.imageUrl || "",
        coordinates: {
          x: booth.coordinates.x,
          y: booth.coordinates.y,
        },
        isActive: booth.isActive,
      });
    }
  }, [boothData, form]);

  const onSubmit = async (formData: BoothFormValues) => {
    try {
      if (!boothId) throw new Error("Booth ID is required");

      const boothData: { id: string; data: Partial<Booth> } = {
        id: boothId,
        data: {
          name: formData.name,
          locationAddress: formData.locationAddress,
          numberOfBeauticians: formData.numberOfBeauticians,
          numberOfStations: formData.numberOfStations,
          occupancyStatus: formData.occupancyStatus,
          imagePath: formData.imagePath,
          imageUrl: formData.imageUrl,
          coordinates: {
            x: formData.coordinates.x,
            y: formData.coordinates.y,
          },
          boundaries: null,
          underMaintenance: false,
        },
      };

      const response: BoothsApiResponse<Booth> = await updateBooth(boothData).unwrap();

      toast({
        title: "Success",
        description: "Booth updated successfully",
      });

      navigate(`/booths/${response.data.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      toast({
        title: "Failed to update booth",
        description: `Error: ${errorMessage}`,
        variant: "destructive",
      });

      console.error("Booth update error:", error);
    }
  };

  const handleCoordinatesSelect = (coordinates: Coordinates) => {
    form.setValue("coordinates.x", coordinates.x);
    form.setValue("coordinates.y", coordinates.y);
    setIsCoordinateModalOpen(false);
  };

  if (isBoothLoading) {
    return <Loader />;
  }

  if (isError || !boothData?.data) {
    return (
      <div className="container mx-auto py-10">
        <p>Error loading booth details. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Edit Booth</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormInputField
                form={form}
                name="name"
                label="Booth Name"
                placeholder="Enter booth name"
              />

              <FormInputField
                form={form}
                name="locationAddress"
                label="Location Address"
                placeholder="Enter booth location"
              />

              <FormInputField
                form={form}
                name="numberOfBeauticians"
                label="Number of Beauticians"
                placeholder="e.g 1"
                type="number"
                description="Number of beauticians in this booth"
              />

              <FormInputField
                form={form}
                name="numberOfStations"
                label="Number of Stations"
                placeholder="e.g 1"
                type="number"
                description="Number of stations in this booth"
              />

              <FormInputField
                form={form}
                name="occupancyStatus"
                label="Occupancy Status"
                type="select"
                options={[
                  { label: "Empty", value: "empty" },
                  { label: "Occupied", value: "occupied" },
                ]}
              />

              <FormInputField
                form={form}
                name="imagePath"
                label="Image Path"
                placeholder="/path/to/image.jpg"
                description="Optional: Path to the booth's image on the server"
              />

              <FormInputField
                form={form}
                name="imageUrl"
                label="Image URL"
                placeholder="https://example.com/booth.jpg"
                description="Optional: URL to the booth's image"
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInputField
                  form={form}
                  name="coordinates.x"
                  label="X Coordinate *"
                  placeholder="0.0"
                  description="X coordinate (Longitude)"
                />

                <FormInputField
                  form={form}
                  name="coordinates.y"
                  label="Y Coordinate *"
                  placeholder="0.0"
                  description="Y coordinate (Latitude)"
                />

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCoordinateModalOpen(true)}
                  className="col-span-2"
                >
                  Select Coordinates on Map
                </Button>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/booths/${boothId}`)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update Booth"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Dialog
        open={isCoordinateModalOpen}
        onOpenChange={setIsCoordinateModalOpen}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Booth Coordinates</DialogTitle>
          </DialogHeader>
          <Maps
            coordinates={{
              lat: form.getValues("coordinates.y") || -1.286389,
              lng: form.getValues("coordinates.x") || 36.817223,
            }}
            setCoordinates={(coords) => {
              handleCoordinatesSelect({
                x: coords.lng,
                y: coords.lat,
              });
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditBoothPage;
