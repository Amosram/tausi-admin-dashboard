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
                booth.assignments.length === booth.numberOfStations
          );
          break;
        case "partially-occupied":
          finalFilteredData = finalFilteredData.filter(
            (booth) =>
              booth.occupancyStatus === "occupied" &&
                booth.assignments.length > 0 &&
                booth.assignments.length < booth.numberOfStations
          );
          break;
        case "empty":
          finalFilteredData = finalFilteredData.filter(
            (booth) =>
              booth.occupancyStatus === "empty" ||
                booth.assignments.length === 0
          );
          break;
        default:
          finalFilteredData = timeFilteredData;
        }
      }

      setFilteredData(finalFilteredData);
    }
  }, [location.search, timeFilteredData]);

  const AddBoothButton = {
    label: "Create Booth",
    onClick: () => navigate("/booths/create-booth"),
    className: "rounded-3xl",
    icon: <FaPlus size={20} />,
  };

  return (
    <div>
      <div className="md:px-4 px-1 my-4 flex gap-2 md:flex-row flex-col items-center">
        <div className="flex-1">
          <TableFilters filters={boothFilters} queryParam="filter" />
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
