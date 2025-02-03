import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import TanStackTable from "@/components/ui/Table/Table";
import { TableFilters } from "@/components/ui/Filters/TableFilters";
import { TimeFilter } from "@/components/ui/Filters/TimeFilters";
import { filterDataByTime } from "@/components/ui/Filters/timeFilterUtils";
import { usersColumns } from "./users-columns";
import { TausiUser } from "@/models/user";

interface UsersTableProps {
  users: TausiUser[];
}

export const UsersTable = ({ users }: UsersTableProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [filteredData, setFilteredData] = useState<TausiUser[]>(users);
  const [timeFilteredData, setTimeFilteredData] = useState<TausiUser[]>(users);

  const usersFilters = [
    { label: "All", value: null },
    { label: "Active Users", value: "active-users" },
    { label: "Verified Users", value: "verified-users" },
    { label: "Partially Verified Users", value: "partially-verified-users" },
    { label: "Unverified Users", value: "unverified-users" },
    { label: "Professionals", value: "professionals" },
    { label: "Verified Professionals", value: "professionals-verified" },
    { label: "Clients", value: "clients" },
    { label: "Active Professionals", value: "active-professionals" },
    { label: "Active Clients", value: "active-clients" },
  ];

  useEffect(() => {
    if (users.length > 0) {
      const searchParams = new URLSearchParams(location.search);
      const timeFilterParam = searchParams.get("timeFilter");

      const processedTimeFilteredData = filterDataByTime(
        users,
        "createdAt",
        timeFilterParam
      );

      setTimeFilteredData(processedTimeFilteredData);

      const filterParam = searchParams.get("filter");
      let finalFilteredData = processedTimeFilteredData;

      if (filterParam) {
        switch (filterParam) {
        case "active-users":
          finalFilteredData = finalFilteredData.filter(
            (user) => user.isActive
          );
          break;
        case "verified-users":
          finalFilteredData = finalFilteredData.filter(
            (user) => user.emailVerified && user.phoneVerified
          );
          break;
        case "partially-verified-users":
          finalFilteredData = finalFilteredData.filter(
            (user) => user.emailVerified || user.phoneVerified
          );
          break;
        case "unverified-user":
          finalFilteredData = finalFilteredData.filter(
            (user) => !user.emailVerified && !user.phoneVerified
          );
          break;
        case "professionals":
          finalFilteredData = finalFilteredData.filter(
            (user) => user.professional !== null
          );
          break;
        case "professionals-verified":
          finalFilteredData = finalFilteredData.filter(
            (user) =>
              user.professional !== null && user.professional.isVerified
          );
          break;
        case "clients":
          finalFilteredData = finalFilteredData.filter(
            (user) => user.professional === null
          );
          break;
        case "active-professionals":
          finalFilteredData = finalFilteredData.filter(
            (user) => user.professional?.isActive
          );
          break;
        case "active-clients":
          finalFilteredData = finalFilteredData.filter(
            (user) => user.professional === null && user.isActive
          );
          break;
        default:
          finalFilteredData = timeFilteredData;
        }
      }

      setFilteredData(finalFilteredData);
    }
  }, [location.search, timeFilteredData]);

  const AddUserButton = {
    label: "Add User",
    onClick: () => navigate("/users/create-user"),
    className: "rounded-3xl",
    icon: <FaPlus size={20} />,
  };

  // const totalItemsReturned = filteredData.length || 0;

  return (
    <div className="p-6">
      <div className="md:px-4 px-1 my-4 flex gap-3 md:flex-row md:justify-between flex-col items-center">
        <div className="flex flex-col">
          <TableFilters filters={usersFilters} queryParam="filter" />
          {/* <h1 className="text-gray-500 mt-5 text-sm">Total Items: <strong>{totalItemsReturned}</strong></h1> */}
        </div>
        <TimeFilter
          queryParam="timeFilter"
          data={users}
          field="createdAt"
          onFilter={setTimeFilteredData}
        />
      </div>
      <TanStackTable
        data={filteredData}
        columns={usersColumns}
        columnToBeFiltered="occupancyStatus"
        button={AddUserButton}
      />
    </div>
  );
};
