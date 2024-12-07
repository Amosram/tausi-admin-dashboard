import React, { useEffect } from "react";
import { BoothsTable } from "../components/booths-table";
import BoothsMap from "../components/booths-maps";
import { useGetBoothsQuery } from "../api/boothsApi";
import { Booth } from "@/models";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import { BoothStats } from "../components/booth-stats";

const Booths = () => {
  const { data, error, isLoading, refetch } = useGetBoothsQuery();
  const { toast } = useToast();

  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const booths: Booth[] = data?.data || [];

  useEffect(() => {
    if (error) {
      if (retryCount < maxRetries) {
        setTimeout(() => {
          setRetryCount((prev) => prev + 1);
          refetch();
        }, 2000);
      } else {
        toast({
          title: "Data Load Error",
          description:
            "We couldn't load booth data. Please refresh the page or contact support for assistance.",
        });
      }
    }
  }, [error, toast, retryCount, refetch]);

  const isDataEmpty = !booths.length;

  if (isLoading && isDataEmpty) return <Loader />;
  if (error && retryCount >= maxRetries && isDataEmpty)
    return <div>Error: Unable to load booth data after multiple attempts.</div>;
  if (isDataEmpty) return <div>No booths found.</div>;

  return (
    <div>
      {/* <BoothsMap coordinates={boothCoordinates} />
      <BoothsTable booths={booths} /> */}
      <BoothStats booths={booths}/>
    </div>
  );
};

export default Booths;
