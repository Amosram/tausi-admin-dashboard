import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { Button } from "../button";
import { timeRangeOptions } from "@/hooks/useSearch";

interface SearchBarProps {
  columns: string[];
  columnLabels: Record<string, string>;
  onSearch: (
    column: string,
    value: string,
    operator: string,
    timeRange?: string
  ) => void;
  onClear?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  columns,
  onSearch,
  onClear,
  columnLabels
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedColumn, setSelectedColumn] = useState<string | undefined>(
    searchParams.get("column") || undefined
  );
  const [searchValue, setSearchValue] = useState<string>(
    searchParams.get("q") || ""
  );
  const [searchOperator, setSearchOperator] = useState<string>(
    searchParams.get("operator") || "eq"
  );
  const [timeRange, setTimeRange] = useState<string | undefined>(
    searchParams.get("timeRange") || undefined
  );

  useEffect(() => {
    const column = searchParams.get("column");
    const q = searchParams.get("q");
    const operator = searchParams.get("operator");
    const range = searchParams.get("timeRange");

    if (column && columns.includes(column)) setSelectedColumn(column);
    else setSelectedColumn(undefined);

    setSearchValue(q || "");
    setSearchOperator(operator || "eq");
    setTimeRange(range || undefined);
  }, [searchParams, columns]);

  const handleSearch = () => {
    const newParams: Record<string, string> = {};

    if (selectedColumn) newParams.column = selectedColumn;
    if (searchValue) newParams.q = searchValue;
    if (searchOperator) newParams.operator = searchOperator;
    if (timeRange) newParams.timeRange = timeRange;

    setSearchParams(newParams);
    onSearch(selectedColumn || "", searchValue, searchOperator, timeRange);
  };

  const handleClearSearch = () => {
    setSelectedColumn(undefined);
    setSearchValue("");
    setSearchOperator("");
    setTimeRange(undefined);

    setSearchParams({});
    if (onClear) onClear();
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") handleSearch();
  };

  return (
    <div className="flex flex-col gap-4 p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm">
      <div className="w-full">
        <Input
          type="text"
          placeholder="Enter search value"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full border border-gray-400 rounded-md p-2 text-sm text-black"
        />
      </div>
      <div className="flex w-full items-center gap-4">
        {/* Operator Selector */}
        <Select
          value={searchOperator || ""}
          onValueChange={(value) => setSearchOperator(value || "eq")}
        >
          <SelectTrigger>
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
        <Select
          value={selectedColumn || ""}
          onValueChange={(value) => setSelectedColumn(value || undefined)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map((col) => (
              <SelectItem key={col} value={col}>
                {columnLabels[col] || col}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Time Range Selector */}
        <Select
          value={timeRange || ""}
          onValueChange={(value) => setTimeRange(value || undefined)}
        >
          <SelectTrigger>
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

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleSearch}
            className="bg-blue-500 text-white px-4 py-2 rounded-md"
            disabled={!searchValue && !timeRange}
          >
            Search
          </Button>
          <Button
            onClick={handleClearSearch}
            className="bg-red-500 text-white px-4 py-2 rounded-md"
            variant="destructive"
          >
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
