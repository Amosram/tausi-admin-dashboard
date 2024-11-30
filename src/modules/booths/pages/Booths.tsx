import React from "react";
import { useGetBoothsQuery } from "../api/boothsApi";
import { Booth } from "@/models";
import { useToast } from "@/hooks/use-toast";
import Loader from "@/components/layout/Loader";
import TanStackTable from "@/components/ui/Table/Table";
import { boothColumns } from "../components/booths-columns";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Booths = () => {
  const { data, error, isLoading, refetch } = useGetBoothsQuery();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [retryCount, setRetryCount] = React.useState(0);
  const maxRetries = 3;

  const booths: Booth[] = data?.data || [];

  React.useEffect(() => {
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

  const AddBoothButton = {
    label: "Create Booth",
    onClick: () => navigate("/booths/create-booth"),
    className: "rounded-3xl",
    icon: <FaPlus size={20} />,
  };

  const OCCUPANCY_STATUS = [
    { label: "All", value: null },
    { label: "Occupied", value: "occupied" },
    { label: "Empty", value: "empty" },
  ];

  const isDataEmpty = !booths.length;

  if (isLoading && isDataEmpty) return <Loader />;
  if (error && retryCount >= maxRetries && isDataEmpty)
    return <div>Error: Unable to load booth data after multiple attempts.</div>;
  if (isDataEmpty) return <div>No booths found.</div>;

  console.log(booths);
  return (
    <TanStackTable
      data={booths}
      columns={boothColumns}
      columnToBeFiltered="occupancyStatus"
      STATUS_OPTIONS={OCCUPANCY_STATUS}
      button={AddBoothButton}
    />
  );
};

export default Booths;
