import { useNavigate, useLocation } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { filterDataByTime, timeFilterOptions } from "./timeFilterUtils";


interface TimeFilterProps<T> {
  queryParam: string;
  data: T[];
  field: keyof T;
  onFilter: (filteredData: T[]) => void;
}

export const TimeFilter = <T,>({
  queryParam,
  data,
  field,
  onFilter,
}: TimeFilterProps<T>) => {
  const navigate = useNavigate();
  const location = useLocation();
  const activeFilter = new URLSearchParams(location.search).get(queryParam);

  const handleFilterChange = (label: string) => {
    const params = new URLSearchParams(location.search);
    if (label) {
      params.set(queryParam, label);
    } else {
      params.delete(queryParam);
    }
    navigate({ search: params.toString() });

    const filteredData = filterDataByTime(data, field, label);
    onFilter(filteredData);
  };

  return (
    <Select value={activeFilter || ""} onValueChange={handleFilterChange}>
      <SelectTrigger className="w-full border-gray-400 bg-white">
        <SelectValue placeholder="Select Time Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {timeFilterOptions.map((option) => (
            <SelectItem
              key={option.label}
              value={option.label}
              className={`${
                activeFilter === option.label ? "bg-primary text-white" : ""
              }`}
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};
