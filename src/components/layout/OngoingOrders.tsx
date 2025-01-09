import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { FaChevronDown } from "react-icons/fa";
import { useGetOrdersQuery } from "@/modules/orders/api/ordersApi";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const OngoingOrders = () => {
  // State to track the selected sorting option
  const [selectedOption, setSelectedOption] = useState("Newest");
  const { data, isLoading, isError } = useGetOrdersQuery(10);
  const navigate = useNavigate();

  const ordersData = data?.data || [];

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Error fetching Pending Orders</div>;
  }

  // Function to sort orders based on createdAt
  const sortOrders = (orders: any[]) => {
    return orders.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);
      if (selectedOption === "Newest") {
        return dateB.getTime() - dateA.getTime(); // Newest first
      } else {
        return dateA.getTime() - dateB.getTime(); // Oldest first
      }
    });
  };

  const filteredOrders = ordersData
    .filter((order) => order.status.includes("pending"))
    .slice(0, 5); // Limit to 5 orders

  const sortedOrders = sortOrders(filteredOrders); // Apply sorting

  return (
    <div className="bg-white dark:bg-card p-6 rounded-lg shadow-md w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Pending Orders</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-1 cursor-pointer bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full px-3 py-2">
              <span>{selectedOption}</span>
              <FaChevronDown size={12} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="
                min-w-[200px]
                mt-2
                rounded-md
                bg-card
                p-[5px]
                shadow-lg
                border
                "
            sideOffset={5}
          >
            <DropdownMenuItem
              className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-300"
              onClick={() => setSelectedOption("Newest")}
            >
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem
              className="p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-300"
              onClick={() => setSelectedOption("Oldest")}
            >
              Oldest
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Timeline List */}
      <div className="space-y-6">
        {sortedOrders.map((order, index) => (
          <div
            key={index}
            className="flex justify-between items-center space-x-4 cursor-pointer"
            onClick={() => navigate(`/orders/${order.id}`)}
          >
            {/* Left Section: Icon and Info */}
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div
                className="w-10 h-10 bg-blue-500 flex items-center justify-center rounded-md text-white"
              >
                {/* Add any icon or content you wish here */}
              </div>
              {/* Order Info */}
              <div>
                <p className="text-gray-800 font-semibold dark:text-gray-300">
                  {order.service.name || "N/A"}
                </p>
                <p className="text-gray-500 text-sm">{order.appointmentDate}</p>
              </div>
            </div>

            {/* Right Section: Location */}
            <p className="text-gray-500 text-sm text-right w-1/3 dark:text-gray-400">
              {order.locationAddress}
            </p>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="mt-6 flex justify-center">
        <Button
          className="text-white border-red-600 rounded-full px-6 py-2 hover:bg-black dark:hover:bg-orange-600 dark:hover:text-gray-100"
          onClick={() => navigate("/orders")}
        >
          View more
        </Button>
      </div>
    </div>
  );
};

export default OngoingOrders;
