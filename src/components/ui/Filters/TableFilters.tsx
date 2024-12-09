import { useNavigate, useLocation } from "react-router-dom";

interface FilterOption {
  label: string;
  value: string | null;
}

interface TableFiltersProps {
  filters: FilterOption[];
  queryParam: string;
  activeClassName?: string;
  inactiveClassName?: string;
}

export const TableFilters: React.FC<TableFiltersProps> = ({
  filters,
  queryParam,
  activeClassName = "bg-primary text-white",
  inactiveClassName = "bg-gray-200 text-gray-700",
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleFilterChange = (filterValue: string | null) => {
    const params = new URLSearchParams(location.search);
    if (filterValue) {
      params.set(queryParam, filterValue);
    } else {
      params.delete(queryParam);
    }
    navigate({ search: params.toString() });
  };

  const activeFilter = new URLSearchParams(location.search).get(queryParam);

  return (
    <div className="flex gap-3 flex-wrap justify-start">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => handleFilterChange(filter.value)}
          className={`px-4 py-2 rounded-md w-auto ${
            activeFilter === filter.value ? activeClassName : inactiveClassName
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};
