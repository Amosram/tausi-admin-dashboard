import React, { useState } from 'react';
import { BarChart, Bar, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';

interface RevenueCategoryData {
  date: string;
  income: number;
  expense: number;
}

const monthlyData: RevenueCategoryData[] = [
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

const RevenueCategory: React.FC = () => {
  const [category, setCategory] = useState('Hair Styling');

  return (
    <div className="p-6 bg-white dark:bg-card rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Revenue By Category</h2>
        <div className="flex items-center gap-2 bg-gray-100 dark:bg-card rounded-2xl">
          {/* Select Component */}
          <Select.Root value={category} onValueChange={(value) => setCategory(value)}>
            <Select.Trigger className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-white dark:bg-gray-800 shadow cursor-pointer">
              <Select.Value placeholder="Select Category" />
              <Select.Icon asChild>
                {category ? <ChevronDownIcon /> : <ChevronUpIcon />}
              </Select.Icon>
            </Select.Trigger>
            <Select.Content className="bg-white dark:bg-gray-800 shadow-lg rounded-md">
              <Select.ScrollUpButton />
              <Select.Viewport className="p-2">
                {['Hair Styling', 'Make Up', 'Nail Art'].map((item) => (
                  <Select.Item
                    key={item}
                    value={item}
                    className="flex items-center gap-2 px-4 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <Select.ItemIndicator className="text-blue-500">
                      <CheckIcon />
                    </Select.ItemIndicator>
                    <Select.ItemText>{item}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
              <Select.ScrollDownButton />
            </Select.Content>
          </Select.Root>
        </div>
      </div>

      {/* Income and Expense Details */}
      <div className="flex justify-between items-center text-sm mb-4">
        <div className="flex items-center gap-2">
          <span className="text-blue-500">■</span>
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

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="left" height={36} />
          <Bar dataKey="income" fill="#3b82f6" barSize={20} />
          <Bar dataKey="expense" fill="#888888" barSize={20} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueCategory;
