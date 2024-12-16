import React from "react";
import { Check } from "lucide-react";
import { useSearchParams } from "react-router-dom";

interface Filter {
  label: string;
  column: string;
  value: any;
  operator: string;
}

interface FiltersProps<T> {
  filters: Array<T>;
  onFilterSelect: (filter: T) => void;
  searchParamMappings?: {
    column: string;
    value: string;
    operator: string;
  };
}

const Filters: React.FC<FiltersProps<Filter>> = ({
  filters,
  onFilterSelect,
  searchParamMappings = {
    column: "column",
    value: "q",
    operator: "op",
  },
}) => {
  const [searchParams] = useSearchParams();

  const isFilterActive = React.useCallback(
    (filter: Filter) => {
      const currentColumn = searchParams.get(searchParamMappings.column);
      const currentValue = searchParams.get(searchParamMappings.value);
      const currentOperator = searchParams.get(searchParamMappings.operator);

      // Normalize value for consistent comparison
      const normalizeValue = (value: any) => {
        if (value === null || value === undefined) return null;
        if (typeof value === "boolean") return String(value).toLowerCase();
        return String(value); // Ensure all values are compared as strings
      };

      return (
        currentColumn === filter.column &&
        normalizeValue(currentValue) === normalizeValue(filter.value) &&
        currentOperator === filter.operator
      );
    },
    [searchParams, searchParamMappings]
  );

  return (
    <div className="px-6">
      <div className="flex flex-wrap gap-2 mb-4 items-center border-gray-300 border rounded-3xl py-2 px-4 bg-white mt-2">
        <span className="text-sm font-medium text-gray-600 mr-2">Filters:</span>
        {filters.map((filter) => (
          <button
            key={filter.label}
            onClick={() => onFilterSelect(filter)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all duration-200
            ${
              isFilterActive(filter)
                ? "bg-primary text-white shadow-lg scale-105"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }
          `}
          >
            {isFilterActive(filter) && <Check size={16} className="mr-1" />}
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Filters;
