import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const OrdersChart = () => {
  const data = [
    { month: "March", Completed: 10, Scheduled: 20, Canceled: 5 },
    { month: "April", Completed: 20, Scheduled: 15, Canceled: 10 },
    { month: "May", Completed: 30, Scheduled: 25, Canceled: 5 },
    { month: "June", Completed: 40, Scheduled: 35, Canceled: 10 },
    { month: "July", Completed: 50, Scheduled: 30, Canceled: 5 },
    { month: "August", Completed: 60, Scheduled: 25, Canceled: 10 },
    { month: "September", Completed: 50, Scheduled: 20, Canceled: 5 },
    { month: "October", Completed: 40, Scheduled: 15, Canceled: 10 },
  ];

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <div style={{ height: "400px", width: "100%" }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 50, right: 40, left: 30, bottom: 50 }}
          >
            {/* Cartesian grid for better readability */}
            <CartesianGrid strokeDasharray="3 3" />
            {/* X-Axis showing months */}
            <XAxis
              dataKey="month"
              label={{ value: "Months", position: "insideBottom", offset: -10 }}
            />
            {/* Y-Axis showing order count */}
            <YAxis
              label={{ value: "Orders", angle: -90, position: "insideLeft" }}
            />
            {/* Tooltip for hover functionality */}
            <Tooltip />
            {/* Legend for the lines */}
            <Legend verticalAlign="top" height={36} />
            {/* Lines for different order types */}
            <Line
              type="monotone"
              dataKey="Completed"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Scheduled"
              stroke="#2196F3"
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="Canceled"
              stroke="#F44336"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersChart;
