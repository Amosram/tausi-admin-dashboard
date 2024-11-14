import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

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

// Define the custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 rounded-lg shadow-lg text-center">
        <p className="font-semibold text-gray-800">${payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-gray-500">July 2022</p>
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
    // Optionally update data here based on timeFrame
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mt-4 text-sm">
        <div className="flex items-center gap-2">
          <span className="text-red-500">■</span>
          <span>Income</span>
          <span className="font-semibold">$122,239</span>
          <span className="text-green-600">+0.4%</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">■</span>
          <span>Expense</span>
          <span className="font-semibold">$8,345</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}
        className="mt-6">
        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="left"
            height={36} />
          <Bar dataKey="income" fill="#ff4500"
            barSize={20} />
          <Bar dataKey="expense" fill="#888888"
            barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueChart;
