import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from "recharts";
import * as TooltipRadix from "@radix-ui/react-tooltip";

const data = [
  { location: "Kitengela", complete: 30000, incomplete: 10000 },
  { location: "Karen", complete: 20000, incomplete: 5000 },
  { location: "Ngong", complete: 10000, incomplete: 8000 },
  { location: "Kilimani", complete: 41000, incomplete: 2000 },
  { location: "Rongai", complete: 15000, incomplete: 3000 },
  { location: "Runda", complete: 25000, incomplete: 7000 },
  { location: "Thika Rd.", complete: 28000, incomplete: 6000 },
];

const CustomTooltip: React.FC<any> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <TooltipRadix.Root>
        <TooltipRadix.Trigger className="focus:outline-none">
          <div className="bg-white dark:bg-gray-800 shadow-lg p-2 rounded-md">
            <p className="font-semibold">{label}</p>
            <p>Revenue: ${payload[0].value.toLocaleString()}</p>
          </div>
        </TooltipRadix.Trigger>
      </TooltipRadix.Root>
    );
  }

  return null;
};

const RevenueByLocation: React.FC = () => {
  return (
    <div className="bg-white dark:bg-card shadow-md rounded-lg p-4">
      <h2 className="text-lg font-medium mb-4">Revenue by Location</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="location" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar dataKey="incomplete" fill="#1A1A1A"
            name="Incomplete Orders" barSize={15}/>
          <Bar dataKey="complete" fill="#FF5733"
            name="Complete Orders" barSize={15}/>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};


export default RevenueByLocation;
