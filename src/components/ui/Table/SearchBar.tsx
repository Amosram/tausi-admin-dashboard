import React from "react";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Button } from "../button";
import { SearchCriteriaType } from "@/models";
import { X } from "lucide-react";
import { timeRangeOptions } from "@/hooks/useSearch";
import { useSearchParams } from "react-router-dom";

interface SearchBarProps {
  columns: string[];
  triggerSearch: (
    column: string,
    value: string,
    operator?: SearchCriteriaType["operator"],
    timeRange?: string
  ) => void;
  clearSearch: () => void;
  isSearchActive: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  columns,
  triggerSearch,
  clearSearch,
  isSearchActive,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchValue, setSearchValue] = React.useState(
    searchParams.get("value") || ""
  );
  const [selectedColumn, setSelectedColumn] = React.useState("");
  const [searchOperator, setSearchOperator] = React.useState<
    SearchCriteriaType["operator"]
  >("");
  const [timeRange, setTimeRange] = React.useState("");

  // Update URL and trigger search when values change
  React.useEffect(() => {
    const params = new URLSearchParams();
    if (searchValue) params.set("value", searchValue);
    if (selectedColumn) params.set("column", selectedColumn);
    if (searchOperator) params.set("operator", searchOperator);
    if (timeRange) params.set("timeRange", timeRange);
    setSearchParams(params);

    // Trigger search with updated values
    if (searchValue || timeRange) {
      triggerSearch(selectedColumn, searchValue, searchOperator, timeRange);
    }
  }, [searchValue, selectedColumn, searchOperator, timeRange, setSearchParams]);

  const handleClearSearch = () => {
    setSearchValue("");
    setSelectedColumn("");
    setSearchOperator("");
    setTimeRange("");
    setSearchParams(new URLSearchParams());
    clearSearch();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter")
      triggerSearch(selectedColumn, searchValue, searchOperator, timeRange);
  };

  return (
    <div className="flex flex-col gap-2 p-1">
      <div className="flex items-center gap-2">
        {/* Input Field */}
        <div className="relative flex items-center flex-1">
          <Input
            type="text"
            placeholder="Enter search value"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleKeyPress}
            className="border border-gray-400 bg-white text-black focus:ring ring-primary"
          />
          {isSearchActive && (
            <X
              onClick={handleClearSearch}
              className="text-destructive cursor-pointer absolute right-3"
            />
          )}
        </div>

        {/* Operator Selector */}
        <Select
          value={searchOperator}
          onValueChange={(value: SearchCriteriaType["operator"]) =>
            setSearchOperator(value)
          }
        >
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select Operator" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="like">Contains</SelectItem>
            <SelectItem value="eq">Equals</SelectItem>
            <SelectItem value="gt">Greater Than</SelectItem>
            <SelectItem value="lt">Less Than</SelectItem>
            <SelectItem value="gte">Greater/Equal</SelectItem>
            <SelectItem value="lte">Less/Equal</SelectItem>
            <SelectItem value="ne">Not Equal</SelectItem>
            <SelectItem value="ilike">Contains (Case Insensitive)</SelectItem>
          </SelectContent>
        </Select>

        {/* Column Selector */}
        <Select
          value={selectedColumn}
          onValueChange={setSelectedColumn}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Time Range Selector */}
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Time Range" />
          </SelectTrigger>
          <SelectContent>
            {timeRangeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Search Button */}
        <Button
          onClick={() =>
            triggerSearch(selectedColumn, searchValue, searchOperator, timeRange)
          }
          className="ml-2"
          disabled={!selectedColumn || (!searchValue && !timeRange)}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default SearchBar;
