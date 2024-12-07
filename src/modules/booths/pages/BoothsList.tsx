import { useEffect, useState } from "react";
import { BoothsTable } from "../components/booths-table";
import Loader from "@/components/layout/Loader";
import { Booth } from "@/models";
import { useGetBoothsQuery } from "../api/boothsApi";
import { useToast } from "@/hooks/use-toast";
import BoothsFilter from "../components/booths-filter";

const BoothsList = () => {
  const { data, error, isLoading, refetch } = useGetBoothsQuery();
  const { toast } = useToast();

  const [retryCount, setRetryCount] = useState(0);
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
      <BoothsFilter />
      <BoothsTable booths={booths} />
    </div>
  );
};

export default BoothsList;
