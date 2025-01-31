import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import { Booth } from "@/models";
import TanStackTable from "@/components/ui/Table/Table";
import { boothColumns } from "../components/booths-columns";
import { TableFilters } from "@/components/ui/Filters/TableFilters";
import { TimeFilter } from "@/components/ui/Filters/TimeFilters";
import { filterDataByTime } from "@/components/ui/Filters/timeFilterUtils";

interface BoothsTableProps {
  booths: Booth[];
}

export const BoothsTable = ({ booths }: BoothsTableProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredData, setFilteredData] = useState<Booth[]>(booths);
  const [timeFilteredData, setTimeFilteredData] = useState<Booth[]>(booths);

  const boothFilters = [
    { label: "All", value: null },
    { label: "Under Maintenance", value: "maintenance" },
    { label: "Fully Occupied", value: "fully-occupied" },
    { label: "Partially Occupied", value: "partially-occupied" },
    { label: "Empty", value: "empty" },
  ];

  useEffect(() => {
    if (booths.length > 0) {
      const searchParams = new URLSearchParams(location.search);
      const timeFilterParam = searchParams.get("timeFilter");

      const processedTimeFilteredData = filterDataByTime(
        booths,
        "createdAt",
        timeFilterParam
      );

      setTimeFilteredData(processedTimeFilteredData);

      const filterParam = searchParams.get("filter");
      let finalFilteredData = processedTimeFilteredData;

      if (filterParam) {
        switch (filterParam) {
        case "maintenance":
          finalFilteredData = finalFilteredData.filter(
            (booth) => booth.underMaintenance
          );
          break;
        case "fully-occupied":
          finalFilteredData = finalFilteredData.filter(
            (booth) =>
              booth.occupancyStatus === "occupied" &&
                (booth.assignments?.length ?? 0) === booth.numberOfStations
          );
          break;
        case "partially-occupied":
          finalFilteredData = finalFilteredData.filter(
            (booth) =>
              booth.occupancyStatus === "occupied" &&
                (booth.assignments?.length ?? 0) > 0 &&
                (booth.assignments?.length ?? 0) < booth.numberOfStations
          );
          break;
        case "empty":
          finalFilteredData = finalFilteredData.filter(
            (booth) =>
              booth.occupancyStatus === "empty" ||
                (booth.assignments?.length ?? 0) === 0
          );
          break;
        default:
          finalFilteredData = timeFilteredData;
        }
      }

      setFilteredData(finalFilteredData);
    }
  }, [location.search, booths]);

  const AddBoothButton = {
    label: "Create Booth",
    onClick: () => navigate("/booths/create-booth"),
    className: "rounded-3xl",
    icon: <FaPlus size={20} />,
  };

  const totalItemsReturned = filteredData.length || 0;

  return (
    <div>
      <div className="md:px-4 px-1 my-4 flex gap-2 md:flex-row md:justify-between flex-col items-center">
        <div className="flex flex-col">
          <TableFilters filters={boothFilters} queryParam="filter" />
          <h1 className="text-gray-500 mt-5 text-sm">Total Items: <strong>{totalItemsReturned}</strong></h1>
        </div>
        <TimeFilter
          queryParam="timeFilter"
          data={booths}
          field="createdAt"
          onFilter={setTimeFilteredData}
        />
      </div>
      <TanStackTable
        data={filteredData}
        columns={boothColumns}
        columnToBeFiltered="occupancyStatus"
        button={AddBoothButton}
      />
    </div>
  );
};
