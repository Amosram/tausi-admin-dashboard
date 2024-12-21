import { DashboardAnalyticsData, DashboardAnalyticsResponse, Last } from '@/models';
import { useGetDashboardAnalyticsQuery } from '@/modules/dashboard/api/dashboardApi';
import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import Loader from './Loader';


// Custom tooltip component
// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const revenue = payload[0]?.value || 0;

    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg">
        <p className="text-sm font-bold text-gray-900 dark:text-white">
          {label} {/* Label will dynamically display the day, week, or month */}
        </p>
        <p className="text-md font-semibold text-orange-500">
          Revenue: KES{revenue.toLocaleString()}
        </p>
      </div>
    );
  }
  return null;
};


// Main component
const RevenueChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState('last_year');

  const {data, isLoading, isError } = useGetDashboardAnalyticsQuery('dashboard');

  if (isLoading) return <Loader />;

  if (isError) return <div>Error fetching data</div>;

  const revenueAnalyticsData = data as DashboardAnalyticsResponse | undefined;
  const revenueData: DashboardAnalyticsData['revenue'] | undefined = revenueAnalyticsData.data.data.revenue;
  console.log("revenueData ========>",revenueData);

  // Helper Function
  const formatLast7Days = (data: Last[]) => {
    return data.map(({created_at, revenue}) => {
      const date = new Date(created_at);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      return {day, income: revenue};
    });
  };

  const groupByWeek = (data: Last[]) => {
    const groupedData = data.reduce((acc, {created_at, revenue}) => {
      const date = new Date(created_at);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const diffInDays = Math.floor((date.getTime() - startOfMonth.getTime() / (1000 * 60 * 60 * 24)));
      const week = Math.floor(diffInDays / 7) + 1;

      if (!acc[`Week ${week}`]) {
        acc[`Week ${week}`] = {week: `Week ${week}`, income: 0};
      }
      acc[`Week ${week}`].income = (acc[`Week ${week}`].income || 0) + revenue;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedData);
  };

  const formatByMonth = (data: Last[], monthsToInclude: number) => {
    const groupedData = data.reduce((acc, {created_at, revenue}) => {
      const date = new Date(created_at);
      const monthKey = date.toLocaleString('default', {month: 'short'}) + ' ' + date.getFullYear();

      if (!acc[monthKey]) {
        acc[monthKey] = {month: monthKey, income: 0};
      }
      acc[monthKey].income = (acc[monthKey].income || 0) + revenue;

      return acc;
    }, {} as Record<string, any>);
    
    return Object.values(groupedData).slice(-monthsToInclude);
  };

  const formatLastYear = (data: Last[]) => {
    const groupedData = data.reduce((acc, {created_at, revenue}) => {
      const date = new Date(created_at);
      const month = date.toLocaleString('default', {month: 'short'}) + ' ' + date.getFullYear();

      if (!acc[month]) {
        acc[month] = {month, income: 0};
      }
      acc[month].income = (acc[month].income || 0) + revenue;

      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedData);
  };

  const selectedData = (() => {
    if (!revenueData) return [];

    switch (timeRange) {
    case 'last_7_days':
      return formatLast7Days(revenueData.last_7_days || []);
    case 'last_1_month':
      return groupByWeek(revenueData.last_1_month || []);
    case 'last_90_days':
      return formatByMonth(revenueData.last_90_days || [], 3);
    case 'last_6_months':
      return formatByMonth(revenueData.last_6_months || [], 6);
    case 'last_year':
      return formatLastYear(revenueData.last_year || []);
    default:
      return [];
    }
  }) ();

  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);

  };

  return (
    <div className="p-6 bg-white dark:bg-card rounded-lg shadow-lg">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Revenue</h2>
      </div>
      {/* Dropdown for Time Range */}
      <div className="flex justify-end items-center mb-4 w-full">
        <label htmlFor="timeRange" className="mr-2 font-semibold">Time Range:</label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={handleTimeRangeChange}
          className="p-2 border rounded bg-card w-full md:w-auto"
        >
          <option value="last_7_days">Last 7 Days</option>
          <option value="last_1_month">Last 1 Month (Weekly)</option>
          <option value="last_90_days">Last 90 Days (Last 3 Months)</option>
          <option value="last_6_months">Last 6 Months</option>
          <option value="last_year">Last Year</option>
        </select>
      </div>
      {/* Chart Section */}
      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={selectedData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey={timeRange === 'last_7_days' ? 'day' : timeRange === 'last_1_month' ? 'week' : 'month'}
              label={{
                value:
                  timeRange === 'last_7_days' ? 'Days' :
                    timeRange === 'last_1_month' ? 'Weeks' : 'Months',
                position: 'insideBottom',
                offset: -10,
              }}
            />
            <YAxis
              label={{
                value: 'Revenue',
                angle: -90,
                position: 'insideLeft',
              }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend verticalAlign="top" height={36} />
            <Line
              type="monotone"
              dataKey="income" // Ensure `selectedData` maps revenue -> income
              stroke="#ff4500"
              dot={false}
              name="Income"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>

      </div>
    </div>
  );
};

export default RevenueChart;
