import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Make up", value: 90, color: "#FFC107" },
  { name: "Hair Styling", value: 68, color: "#FF5733" },
  { name: "Nail Art", value: 85, color: "#1A75FF" },
];

const TopRevenueCategories: React.FC = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4">Top 3 Revenue Categories</h2>
      <div className="flex flex-col lg:flex-row items-center justify-between">
        {/* Left side: Progress bars */}
        <div className="w-full lg:w-1/2">
          {data.map((item, index) => (
            <div key={index} className="mb-4">
              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-200 rounded-full">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${item.value}%`,
                    backgroundColor: item.color,
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <div className="flex items-center">
                  {/* <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div> */}
                  <span className="ml-2">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right side: Donut chart */}
        <div className="w-full lg:w-1/2">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                fill="#8884d8"
              >
                {data.map((item, index) => (
                  <Cell key={`cell-${index}`} fill={item.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TopRevenueCategories;
