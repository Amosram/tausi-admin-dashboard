import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { FaChevronDown } from "react-icons/fa";

const OngoingOrders = () => {
  // State to track the selected sorting option
  const [selectedOption, setSelectedOption] = useState("Newest");

  // Sample data
  const orders = [
    {
      id: 1,
      title: "Bubbles Hair Studios - Simple Hair",
      time: "8 min ago",
      location: "Evergreen Apartments, Kilimani, Nairobi",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Bubbles Hair Studios - Simple Hair",
      time: "8 min ago",
      location: "Evergreen Apartments, Kilimani, Nairobi",
      color: "bg-yellow-500",
    },
    {
      id: 3,
      title: "Bubbles Hair Studios - Simple Hair",
      time: "8 min ago",
      location: "Evergreen Apartments, Kilimani, Nairobi",
      color: "bg-green-500",
    },
    {
      id: 4,
      title: "Bubbles Hair Studios - Simple Hair",
      time: "8 min ago",
      location: "Evergreen Apartments, Kilimani, Nairobi",
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-bold">Ongoing Orders</h3>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center space-x-1 cursor-pointer bg-gray-200 text-gray-600 rounded-full px-3 py-2">
              <span>{selectedOption}</span>
              <FaChevronDown size={12} />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="
                min-w-[200px]
                mt-2
                rounded-md
                bg-white
                p-[5px]
                shadow-lg
                border
                "
            sideOffset={5}
          >
            <DropdownMenuItem
              className="p-2 cursor-pointer hover:bg-gray-100 text-gray-800"
              onClick={() => setSelectedOption("Newest")}
            >
              Newest
            </DropdownMenuItem>
            <DropdownMenuItem
              className="p-2 cursor-pointer hover:bg-gray-100 text-gray-800"
              onClick={() => setSelectedOption("Oldest")}
            >
              Oldest
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Timeline List */}
      <div className="space-y-6">
        {orders.map((order) => (
          <div
            key={order.id}
            className="flex justify-between items-center space-x-4"
          >
            {/* Left Section: Icon and Info */}
            <div className="flex items-center space-x-4">
              {/* Icon */}
              <div
                className={`w-10 h-10 ${order.color} flex items-center justify-center rounded-md text-white`}
              >
              </div>
              {/* Order Info */}
              <div>
                <p className="text-gray-800 font-semibold">{order.title}</p>
                <p className="text-gray-500 text-sm">{order.time}</p>
              </div>
            </div>

            {/* Right Section: Location */}
            <p className="text-gray-500 text-sm text-right w-1/3">
              {order.location}
            </p>
          </div>
        ))}
      </div>

      {/* View More Button */}
      <div className="mt-6 flex justify-center">
        <button className="text-red-600 border border-red-600 rounded-full px-6 py-2 hover:bg-red-50">
          View more
        </button>
      </div>
    </div>
  );
};

export default OngoingOrders;
