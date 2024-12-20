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
    <div className="flex gap-2 flex-wrap justify-start">
      {filters.map((filter) => (
      <button
        key={filter.value}
        onClick={() => handleFilterChange(filter.value)}
          className={`px-4 py-2 rounded-3xl w-auto text-sm transition-colors duration-300 dark:hover:bg-orange-600 ${
        activeFilter === filter.value
          ? `${activeClassName} dark:bg-orange-600 dark:text-gray-300`
          : `${inactiveClassName} dark:bg-gray-700 dark:text-gray-300`
        }`}
      >
        {filter.label}
      </button>
      ))}
    </div>
  );
};
