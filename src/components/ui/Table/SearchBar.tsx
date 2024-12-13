import React, { useState } from "react";
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

interface SearchBarProps {
  columns: string[];
  onSearch: (
    column: string,
    value: string,
    operator?: SearchCriteriaType["operator"],
    timeRange?: string
  ) => void;
  onClear?: () => void;
  isSearchActive?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  columns,
  onSearch,
  onClear,
  isSearchActive = false,
}) => {
  const [selectedColumn, setSelectedColumn] = useState(columns[0]);
  const [searchValue, setSearchValue] = useState("");
  const [searchOperator, setSearchOperator] =
    useState<SearchCriteriaType["operator"]>("like");
  const [timeRange, setTimeRange] = useState("");

  const handleSearch = () => {
    if (!selectedColumn) {
      return;
    }
    onSearch(selectedColumn, searchValue, searchOperator, timeRange);
  };

  const handleClearSearch = () => {
    setSearchValue("");
    setSelectedColumn(columns[0]);
    setSearchOperator("like");
    setTimeRange("");
    if (onClear) {
      onClear();
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleSearch();
    }
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
            <SelectValue placeholder="Operator" />
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
        <Select value={selectedColumn} onValueChange={setSelectedColumn}>
          <SelectTrigger className="w-48">{selectedColumn}</SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col} value={col}>
                {col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Time Range Selector */}
        <Select value={timeRange} onValueChange={setTimeRange}>
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
          onClick={handleSearch}
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
