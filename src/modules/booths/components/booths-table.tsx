import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Booth } from "@/models";
import TanStackTable from "@/components/ui/Table/Table";
import { boothColumns } from "../components/booths-columns";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface BoothsTableProps {
  booths: Booth[];
}

export const BoothsTable = ({ booths }: BoothsTableProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredData, setFilteredData] = useState<Booth[]>(booths);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get("filter");

    let filtered = booths;

    switch (filterParam) {
      case "maintenance":
        filtered = booths.filter((booth) => booth.underMaintenance);
        setSelectedFilter("Maintenance");
        break;
      case "fully-occupied":
        filtered = booths.filter(
          (booth) =>
            booth.occupancyStatus === "occupied" &&
            booth.assignments.length === booth.numberOfStations
        );
        setSelectedFilter("Fully Occupied");
        break;
      case "partially-occupied":
        filtered = booths.filter(
          (booth) =>
            booth.occupancyStatus === "occupied" &&
            booth.assignments.length > 0 &&
            booth.assignments.length < booth.numberOfStations
        );
        setSelectedFilter("Partially Occupied");
        break;
      case "empty":
        filtered = booths.filter(
          (booth) =>
            booth.occupancyStatus === "empty" || booth.assignments.length === 0
        );
        setSelectedFilter("Empty");
        break;
      default:
        filtered = booths;
        setSelectedFilter(null);
    }

    setFilteredData(filtered);
  }, [location.search, booths]);

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

  return (
    <div>
      {selectedFilter && (
        <div className="p-4 bg-gray-100 text-gray-700 rounded-md mb-4">
          Showing {selectedFilter} Booths
        </div>
      )}
      <TanStackTable
        data={filteredData}
        columns={boothColumns}
        columnToBeFiltered="occupancyStatus"
        STATUS_OPTIONS={OCCUPANCY_STATUS}
        button={AddBoothButton}
      />
    </div>
  );
};
