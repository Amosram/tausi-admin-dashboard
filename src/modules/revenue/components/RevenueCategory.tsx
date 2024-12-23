import React, { useState, useEffect } from 'react';
import { LineChart, Line, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from '@radix-ui/react-icons';
import * as Select from '@radix-ui/react-select';
import { useGetDashboardAnalyticsQuery } from '@/modules/dashboard/api/dashboardApi';
import { DashboardAnalyticsData, CategoriesRevenue, Barber } from '@/models';
import dayjs from 'dayjs';
import Loader from '@/components/layout/Loader';

// Custom tooltip component
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg text-center">
        <p className="font-semibold text-gray-800 dark:text-gray-100">KES {payload[0].value.toLocaleString()}</p>
        <p className="text-xs text-gray-500 dark:text-gray-300">Transaction Date: {new Date(payload[0].payload.created_at_transactions).toLocaleDateString()}</p>
      </div>
    );
  }
  return null;
};

const RevenueCategory: React.FC = () => {
  const { data, isLoading, isError } = useGetDashboardAnalyticsQuery('revenue');
  const [category, setCategory] = useState<string>('Hair Dressing ');
  const [categoryData, setCategoryData] = useState<Barber[]>([]);

  useEffect(() => {
    if (data) {
      const categoriesRevenue: CategoriesRevenue = data.data.data.categoriesRevenue;
      const selectedCategoryData = categoriesRevenue[category] || [];
      setCategoryData(selectedCategoryData);
    }
  }, [category, data]);
  
  if (isLoading) return <Loader />;

  if (isError) return <div>Error fetching data</div>;

  // Format date to "MMM YYYY"
  const formatDate = (date: Date) => {
    return dayjs(date).format('MMM YYYY');
  };

  // Process data to include formatted date
  const formattedData = categoryData.map((item) => ({
    ...item,
    formattedDate: formatDate(item.created_at_transactions),
  }));

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
                {['Massage', 'DreadLocks', 'Hair Dressing ', 'Barber', 'Makeup', 'Nail Tech'].map((item) => (
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

      {/* Chart Section */}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="formattedDate"
            tickFormatter={(tick) => tick} // Ensures the formatted date is used for X-axis
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" align="left" height={36} />
          <Line type="monotone" dataKey="Amount" stroke="#3b82f6" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueCategory;
