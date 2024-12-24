import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInputField } from "@/components/ui/Form/FormInputField";
import { useCreateBoothMutation } from "../api/boothsApi";
import {
  Booth,
  BoothsApiResponse,
  Coordinates,
  CreateBoothPayload,
} from "@/models";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Maps from "@/components/ui/maps";
import { AutocompleteAddress } from "../components/location-autocomplete";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const boothFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  locationAddress: z.string().min(5, "Location must be at least 5 characters"),
  numberOfBeauticians: z
    .string()
    .transform((value) => parseInt(value, 10))
    .refine(
      (value) => Number.isInteger(value) && value > 0,
      "Must be a positive integer"
    )
    .refine((value) => value <= 100, "Too many beauticians"),
  numberOfStations: z
    .string()
    .transform((value) => parseInt(value, 10))
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
});

type BoothFormValues = z.infer<typeof boothFormSchema>;

const CreateBoothPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [createBooth, { isLoading }] = useCreateBoothMutation();
  const [isCoordinateModalOpen, setIsCoordinateModalOpen] = useState(false);

  const form = useForm<BoothFormValues>({
    resolver: zodResolver(boothFormSchema),
    defaultValues: {
      name: "",
      occupancyStatus: "empty",
      imagePath: "",
      imageUrl: "",
      coordinates: { x: 0, y: 0 },
    },
  });

  const onSubmit = async (formData: BoothFormValues) => {
    try {
      const boothData: CreateBoothPayload = {
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
      };

      const response = (await createBooth(
        boothData
      ).unwrap()) as BoothsApiResponse<Booth>;

      toast({
        title: "Success",
        description: "Booth created successfully",
      });

      navigate(`/booths/${response.data.id}`);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      toast({
        title: "Failed to create booth",
        description: `Error: ${errorMessage}`,
        variant: "destructive",
      });

      console.error("Booth creation error:", error);
    }
  };

  const handleCoordinatesSelect = async (coordinates: Coordinates) => {
    form.setValue("coordinates.x", coordinates.x); // Set x
    form.setValue("coordinates.y", coordinates.y); // Set y

    try {
      // Reverse geocode to get the address
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${coordinates.y},${coordinates.x}&key=${API_KEY}`
      );
      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const address = data.results[0].formatted_address;
        form.setValue("locationAddress", address);
      } else {
        console.error("Geocoding failed:", data.status, data.error_message);
      }
    } catch (error) {
      console.error("Failed to fetch address:", error);
    }

    setIsCoordinateModalOpen(false);
  };

  const handleAddressSelect = (
    address: string,
    coordinates: { lat: number; lng: number }
  ) => {
    form.setValue("locationAddress", address);
    form.setValue("coordinates.x", coordinates.lng); // Set longitude as x
    form.setValue("coordinates.y", coordinates.lat); // Set latitude as y
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Booth</CardTitle>
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
                name="imageUrl"
                label="Image URL"
                placeholder="https://example.com/booth.jpg"
                description="Optional: URL to the booth's image"
              />

              <AutocompleteAddress
                value={form.watch("locationAddress")}
                onChange={(value) => form.setValue("locationAddress", value)}
                onAddressSelect={handleAddressSelect}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormInputField
                  form={form}
                  name="coordinates.x"
                  label="X Coordinate *"
                  placeholder="0.0"
                  description="X coordinate (Latitude)"
                />

                <FormInputField
                  form={form}
                  name="coordinates.y"
                  label="Y Coordinate *"
                  placeholder="0.0"
                  description="Y coordinate (Longitude)"
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
                  onClick={() => navigate("/booths")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Booth"}
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
              lat: form.getValues("coordinates.y") || -1.286389, // Map y to lat
              lng: form.getValues("coordinates.x") || 36.817223, // Map x to lng
            }}
            setCoordinates={(coords) => {
              // Map lat/lng back to x/y for the form
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

export default CreateBoothPage;
