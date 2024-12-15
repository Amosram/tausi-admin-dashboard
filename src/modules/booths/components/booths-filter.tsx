import { useNavigate, useLocation } from "react-router-dom";

const BoothsFilter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const filters = [
    { label: "All", value: null },
    { label: "Maintenance", value: "maintenance" },
    { label: "Fully Occupied", value: "fully-occupied" },
    { label: "Partially Occupied", value: "partially-occupied" },
    { label: "Empty", value: "empty" },
  ];

  const handleFilterChange = (filterValue: string | null) => {
    const params = new URLSearchParams(location.search);
    if (filterValue) {
      params.set("filter", filterValue);
    } else {
      params.delete("filter");
    }
    navigate({ search: params.toString() });
  };

  const activeFilter = new URLSearchParams(location.search).get("filter");

  return (
    <div className="flex space-x-4 mb-4">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => handleFilterChange(filter.value)}
          className={`px-4 py-2 rounded-md ${
            activeFilter === filter.value
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

export default BoothsFilter;
