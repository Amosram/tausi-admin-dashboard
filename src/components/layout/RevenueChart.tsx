import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

interface RevenueData {
  date: string;
  income: number;
  expense: number;
}

const monthlyData: RevenueData[] = [
  { date: '01', income: 52000, expense: 8345 },
  { date: '02', income: 42000, expense: 7345 },
  { date: '03', income: 46000, expense: 8345 },
  { date: '04', income: 38000, expense: 8345 },
  { date: '05', income: 45000, expense: 8345 },
  { date: '06', income: 35000, expense: 7345 },
  { date: '07', income: 41000, expense: 8345 },
  { date: '08', income: 53000, expense: 8345 },
  { date: '09', income: 30000, expense: 8345 },
  { date: '10', income: 50000, expense: 8345 },
  { date: '11', income: 47000, expense: 7345 },
  { date: '12', income: 52000, expense: 8345 },
  { date: '13', income: 33000, expense: 7345 },
];

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg text-center">
        <p className="font-semibold text-gray-800 dark:text-gray-100">${payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-gray-500 dark:text-gray-300">July {new Date().getFullYear()}</p>
      </div>
    );
  }
  return null;
};

// Main component
const RevenueChart: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  const handleTimeFrameChange = (frame: 'daily' | 'weekly' | 'monthly') => {
    setTimeFrame(frame);
  };

  return (
    <div className="p-6 bg-white dark:bg-card rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Revenue</h2>
      </div>

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="left" height={36} />
          <Line type="monotone" dataKey="income" stroke="#ff4500" strokeWidth={2} />
          {/* <Line type="monotone" dataKey="expense" stroke="#888888" strokeWidth={2} /> */}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
