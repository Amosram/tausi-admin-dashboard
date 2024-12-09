import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import BoothsMap from "../components/booths-maps";
import { useGetBoothsQuery } from "../api/boothsApi";
import { Booth } from "@/models";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import { BoothStats } from "../components/booth-stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PartialBoothsTable } from "../components/partial-table";
import { AlertCircle, Map, Table } from "lucide-react";

const Booths = () => {
  const { data, error, isLoading, refetch } = useGetBoothsQuery();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const booths: Booth[] = data?.data || [];

  const boothCoordinates = booths.map((booth) => ({
    lat: booth.coordinates.y,
    lng: booth.coordinates.x,
  }));

  useEffect(() => {
    if (error) {
      if (retryCount < maxRetries) {
        const timeoutId = setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          refetch();
        }, 2000);
        return () => clearTimeout(timeoutId);
      } else {
        toast({
          variant: "destructive",
          title: "Data Load Error",
          description:
            "Couldn't load booth data. Please refresh or contact support.",
        });
      }
    }
  }, [error, toast, retryCount, refetch]);

  const renderContent = () => {
    if (isLoading && !booths.length) {
      return (
        <div className="flex justify-center items-center h-64">
          <Loader />
        </div>
      );
    }

    if (error && retryCount >= maxRetries && !booths.length) {
      return (
        <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">Data Loading Failed</h2>
          <p className="text-muted-foreground">
            Unable to load booth data after multiple attempts. Please check your
            connection or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      );
    }

    if (!booths.length) {
      return (
        <div className="flex flex-col items-center justify-center h-64 p-4 text-center">
          <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Booths Found</h2>
          <p className="text-muted-foreground">
            There are currently no booths in the system.
          </p>
        </div>
      );
    }

    return (
      <Tabs defaultValue="table" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="table" className="flex items-center gap-2">
            <Table className="h-4 w-4" /> Table View
          </TabsTrigger>
          <TabsTrigger value="map" className="flex items-center gap-2">
            <Map className="h-4 w-4" /> Map View
          </TabsTrigger>
        </TabsList>
        <TabsContent value="map">
          <BoothsMap coordinates={boothCoordinates} />
        </TabsContent>
        <TabsContent value="table">
          <BoothStats booths={booths} />
          <PartialBoothsTable
            booths={booths}
            maxRows={2}
            onViewMore={() => navigate("/booths/list")}
          />
        </TabsContent>
      </Tabs>
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {renderContent()}
    </div>
  );
};

export default Booths;
