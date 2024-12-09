import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

import { Booth } from "@/models";
import TanStackTable from "@/components/ui/Table/Table";
import { boothColumns } from "../components/booths-columns";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BoothsFilter from "./booths-filter";

interface BoothsTableProps {
  booths: Booth[];
}

const timeFilterOptions = [
  { label: "Today", days: 1 },
  { label: "Past 1 Week", days: 7 },
  { label: "Past 1 Month", days: 30 },
  { label: "Past 90 Days", days: 90 },
  { label: "Past 1 Year", days: 365 },
  { label: "Past 10 Years", days: 3650 },
  { label: "All Time", days: null },
];

export const BoothsTable = ({ booths }: BoothsTableProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredData, setFilteredData] = useState<Booth[]>(booths);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string | null>(
    null
  );

  const isDateWithinRange = (date: string, days: number | null) => {
    if (!days) return true;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - days);
    return new Date(date) >= targetDate;
  };

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const filterParam = searchParams.get("filter");
    const timeFilter = searchParams.get("timeFilter");

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

    if (timeFilter) {
      const selectedTimeOption = timeFilterOptions.find(
        (option) => option.label === timeFilter
      );
      if (selectedTimeOption) {
        filtered = filtered.filter((booth) =>
          isDateWithinRange(booth.createdAt, selectedTimeOption.days)
        );
        setSelectedTimeFilter(selectedTimeOption.label);
      }
    }

    setFilteredData(filtered);
  }, [location.search, booths]);

  const AddBoothButton = {
    label: "Create Booth",
    onClick: () => navigate("/booths/create-booth"),
    className: "rounded-3xl",
    icon: <FaPlus size={20} />,
  };

  return (
    <div>
      <div className=" md:px-4 px-1 my-4 flex gap-2 md:flex-row flex-col items-center">
        <div className="flex-1">
          <BoothsFilter />
        </div>
        <Select
          value={selectedTimeFilter}
          onValueChange={(value) => {
            const searchParams = new URLSearchParams(location.search);
            searchParams.set("timeFilter", value);
            navigate({ search: searchParams.toString() });
          }}
        >
          <SelectTrigger className="max-w-[30%] border border-black bg-white">
            <SelectValue placeholder="Select Time Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {timeFilterOptions.map((option) => (
                <SelectItem
                  key={option.label}
                  value={option.label}
                  className={`${
                    selectedTimeFilter === option.label
                      ? "bg-blue-500 text-white"
                      : ""
                  }`}
                >
                  {option.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
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
