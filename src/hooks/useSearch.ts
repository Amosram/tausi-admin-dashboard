import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchCriteriaType } from "@/models";

// Extend the existing interface to support multiple search criteria
interface UseSearchOptions<T, MutationHook> {
  /**
   * The initial data to be used when no search is active
   */
  initialData: T[];

  /**
   * Optional column name for date filtering with time range
   */
  dateFilterColumn?: string;

  /**
   * The mutation hook for searching (from RTK Query)
   */
  searchMutation: MutationHook;

  /**
   * Columns that can be searched
   */
  searchableColumns: string[];

  /**
   * Optional default limit for search results
   */
  defaultLimit?: number;

  /**
   * Optional callback to handle search errors
   */
  onSearchError?: (error: any) => void;

  /**
   * Optional callback to handle clearing search
   */
  onClearSearch?: () => void;

  /**
   * Optional parameter name for search column in URL
   */
  columnParamName?: string;

  /**
   * Optional parameter name for search value in URL
   */
  valueParamName?: string;

  /**
   * Optional parameter name for search operator in URL
   */
  operatorParamName?: string;

  /**
   * Optional parameter name for time range in URL
   */
  timeRangeParamName?: string;
}

interface UseSearchReturn<T> {
  /**
   * Current data to be displayed (either initial or search results)
   */
  data: T[];

  /**
   * Whether a search is currently active
   */
  isSearchActive: boolean;

  /**
   * Trigger a search with specific criteria
   */
  triggerSearch: (
    column: string,
    value: string,
    operator?: SearchCriteriaType["operator"],
    timeRange?: string
  ) => Promise<void>;

  /**
   * Clear the current search and reset to initial data
   */
  clearSearch: () => void;

  /**
   * Searchable columns for the current data type
   */
  searchableColumns: string[];

  /**
   * Current search parameters
   */
  searchParams: {
    column: string;
    value: string;
    operator: SearchCriteriaType["operator"];
    timeRange?: string;
  };
}

export function calculateDateRange(range: string): {
  startDate: string;
  endDate: string;
} {
  const now = new Date();
  let startDate: Date;

  // Helper function to format date to match backend format
  const formatDate = (date: Date): string => {
    return date.toISOString().replace("T", " ").split(".")[0];
  };

  switch (range) {
  case "today":
    startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(now),
    };
  case "past1week":
    startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(now),
    };
  case "past1month":
    startDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(now),
    };
  case "past6months":
    startDate = new Date(
      now.getFullYear(),
      now.getMonth() - 6,
      now.getDate()
    );
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(now),
    };
  case "pastyear":
    startDate = new Date(
      now.getFullYear() - 1,
      now.getMonth(),
      now.getDate()
    );
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(now),
    };
  case "past10years":
    startDate = new Date(
      now.getFullYear() - 10,
      now.getMonth(),
      now.getDate()
    );
    return {
      startDate: formatDate(startDate),
      endDate: formatDate(now),
    };
  case "alltime":
  default:
    // Return a very old date for "all time"
    return {
      startDate: formatDate(new Date(1970, 0, 1)),
      endDate: formatDate(now),
    };
  }
}

export function useSearch<T, MutationHook extends (...args: any[]) => any>({
  initialData,
  searchMutation,
  searchableColumns,
  defaultLimit = 80,
  onSearchError,
  onClearSearch,
  columnParamName = "column",
  valueParamName = "q",
  operatorParamName = "op",
  timeRangeParamName = "timeRange",
  dateFilterColumn = "createdAt",
}: UseSearchOptions<T, MutationHook>): UseSearchReturn<T> {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchData, setSearchData] = useState<T[]>(initialData);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const [searchMutationTrigger] = searchMutation();

  const currentColumn =
    searchParams.get(columnParamName) || searchableColumns[0];
  const currentValue = searchParams.get(valueParamName) || "";
  const currentOperator = (searchParams.get(operatorParamName) ||
    "like") as SearchCriteriaType["operator"];
  const currentTimeRange = searchParams.get(timeRangeParamName) || "";

  const clearSearch = useCallback(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete(columnParamName);
    newSearchParams.delete(valueParamName);
    newSearchParams.delete(operatorParamName);
    newSearchParams.delete(timeRangeParamName);

    setSearchParams(newSearchParams);
    setSearchData(initialData);
    setIsSearchActive(false);

    // Call the optional onClearSearch callback
    if (onClearSearch) {
      onClearSearch();
    }
  }, [
    initialData,
    searchParams,
    setSearchParams,
    columnParamName,
    valueParamName,
    operatorParamName,
    timeRangeParamName,
    onClearSearch,
  ]);

  const triggerSearch = useCallback(
    async (
      column: string,
      value: string,
      operator: SearchCriteriaType["operator"] = "like",
      timeRange?: string
    ) => {
      if (!value && !timeRange) {
        clearSearch();
        return;
      }

      try {
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.set(columnParamName, column);

        // Prepare search criteria
        const searchCriteria: SearchCriteriaType[] = [];

        // Add value-based search criteria if value exists
        if (value) {
          newSearchParams.set(valueParamName, value);
          searchCriteria.push({
            field: column,
            operator,
            value,
          });
        }

        // Add time range criteria if time range is specified
        if (timeRange) {
          newSearchParams.set(timeRangeParamName, timeRange);
          const { startDate, endDate } = calculateDateRange(timeRange);

          // Use the provided date filter column or default to "appointmentDate"
          const dateFilterField = dateFilterColumn || "appointmentDate";
          searchCriteria.push({
            field: dateFilterField,
            operator: "between",
            value: [`${startDate}`, `${endDate}`],
          });
        }

        setSearchParams(newSearchParams);

        const response = await searchMutationTrigger({
          searchCriteria,
          limit: defaultLimit,
        }).unwrap();

        if (response.data) {
          setSearchData(response.data);
          setIsSearchActive(true);
        }
      } catch (error) {
        if (onSearchError) {
          onSearchError(error);
        }
        console.error("Search failed:", error);
      }
    },
    [
      searchMutationTrigger,
      defaultLimit,
      onSearchError,
      clearSearch,
      searchParams,
      setSearchParams,
      columnParamName,
      valueParamName,
      timeRangeParamName,
      dateFilterColumn, // Include this dependency
    ]
  );

  useEffect(() => {
    // Trigger initial search if value or time range exists
    if (currentValue || currentTimeRange) {
      triggerSearch(
        currentColumn,
        currentValue,
        currentOperator,
        currentTimeRange
      );
    }
  }, []);

  return {
    data: searchData,
    isSearchActive,
    triggerSearch,
    clearSearch,
    searchableColumns,
    searchParams: {
      column: currentColumn,
      value: currentValue,
      operator: currentOperator,
      timeRange: currentTimeRange,
    },
  };
}

export const timeRangeOptions = [
  { value: "today", label: "Today" },
  { value: "past1week", label: "Past 1 Week" },
  { value: "past1month", label: "Past 1 Month" },
  { value: "past6months", label: "Past 6 Months" },
  { value: "pastyear", label: "Past Year" },
  { value: "past10years", label: "Past 10 Years" },
  { value: "alltime", label: "All Time" },
  { value: null, label: "Reset" },
];

export type SearchOperator =
  | "in"
  | "eq"
  | "ne"
  | "gt"
  | "lt"
  | "gte"
  | "lte"
  | "like"
  | "between"
  | "ilike";

export const searchPresets = {
  orders: {
    defaultFilters: [
      {
        label: "Upcoming Appointments",
        column: "status",
        value: "scheduled",
        operator: "eq" as SearchOperator,
      },
      {
        label: "Today's Appointments",
        column: "appointmentDate",
        value: new Date().toISOString().split("T")[0],
        operator: "eq" as SearchOperator,
      },
    ],
  },
};
