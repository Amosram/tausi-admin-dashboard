import { useGetDashboardAnalyticsQuery } from '@/modules/dashboard/api/dashboardApi';
import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { DashboardAnalyticsResponse, DashboardAnalyticsData, Last } from '@/models'; // Adjust path if necessary
import Loader from './Loader';

const OrdersChart = () => {
  const [timeRange, setTimeRange] = useState('last_7_days'); // Default to 'last_7_days'

  const { data, isLoading, isError } = useGetDashboardAnalyticsQuery('dashboard');

  if (isLoading) return <Loader />;

  if (isError) return <div>Error fetching data</div>;

  const analyticsData = data as DashboardAnalyticsResponse | undefined;
  const ordersData: DashboardAnalyticsData['orders'] | undefined = analyticsData.data.data.orders;

  // Helper Functions
  const formatLast7Days = (data: Last[]) => {
    return data.map(({ appointment_date, status, total_appointments }) => {
      const date = new Date(appointment_date);
      const day = date.toLocaleDateString('en-US', { weekday: 'short' });
      return { day, [status]: total_appointments };
    });
  };

  const groupByWeek = (data: Last[]) => {
    const groupedData = data.reduce((acc, { appointment_date, status, total_appointments }) => {
      const date = new Date(appointment_date);
      const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
      const diffInDays = Math.floor((date.getTime() - startOfMonth.getTime()) / (1000 * 60 * 60 * 24));
      const week = Math.floor(diffInDays / 7) + 1;

      if (!acc[`Week ${week}`]) {
        acc[`Week ${week}`] = { week: `Week ${week}`, pending: 0, completed: 0, scheduled: 0 };
      }
      acc[`Week ${week}`][status] = (acc[`Week ${week}`][status] || 0) + total_appointments;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedData);
  };

  const formatByMonth = (data: Last[], monthsToInclude: number) => {
    const groupedData = data.reduce((acc, { appointment_date, status, total_appointments }) => {
      const date = new Date(appointment_date);
      const monthKey = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();

      if (!acc[monthKey]) {
        acc[monthKey] = { month: monthKey, pending: 0, completed: 0, scheduled: 0 };
      }
      acc[monthKey][status] = (acc[monthKey][status] || 0) + total_appointments;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedData).slice(-monthsToInclude);
  };

  const formatLastYear = (data: Last[]) => {
    const groupedData = data.reduce((acc, { appointment_date, status, total_appointments }) => {
      const date = new Date(appointment_date);
      const month = date.toLocaleString('default', { month: 'short' }) + ' ' + date.getFullYear();

      if (!acc[month]) {
        acc[month] = { month, pending: 0, completed: 0, scheduled: 0 };
      }
      acc[month][status] = (acc[month][status] || 0) + total_appointments;
      return acc;
    }, {} as Record<string, any>);

    return Object.values(groupedData);
  };

  // Select Data Based on Time Range
  const selectedData = (() => {
    if (!ordersData) return [];

    switch (timeRange) {
    case 'last_7_days':
      return formatLast7Days(ordersData.last_7_days || []);
    case 'last_1_month':
      return groupByWeek(ordersData.last_1_month || []);
    case 'last_90_days':
      return formatByMonth(ordersData.last_90_days || [], 3);
    case 'last_6_months':
      return formatByMonth(ordersData.last_6_months || [], 6);
    case 'last_year':
      return formatLastYear(ordersData.last_year || []);
    default:
      return [];
    }
  })();

  // Handle Dropdown Change
  const handleTimeRangeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTimeRange(e.target.value);
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      {/* Dropdown for Time Range */}
      <div className="flex justify-end items-center mb-4">
        <label htmlFor="timeRange" className="mr-2">Select Time Range:</label>
        <select
          id="timeRange"
          value={timeRange}
          onChange={handleTimeRangeChange}
          className="p-2 border rounded bg-card"
        >
          <option value="last_7_days">Last 7 Days</option>
          <option value="last_1_month">Last 1 Month (Weekly)</option>
          <option value="last_90_days">Last 90 Days (Last 3 Months)</option>
          <option value="last_6_months">Last 6 Months</option>
          <option value="last_year">Last Year</option>
        </select>
      </div>

      <div style={{ height: '400px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={selectedData}
            margin={{ top: 50, right: 40, left: 30, bottom: 50 }}
          >
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
            <YAxis label={{ value: 'Appointments', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend verticalAlign="top" height={36} />
            <Line type="monotone" dataKey="pending"
              stroke="#2196F3" strokeWidth={2}
              dot={false} name="Pending" />
            <Line type="monotone" dataKey="completed"
              stroke="#4CAF50" strokeWidth={2}
              dot={false} name="Completed" />
            <Line type="monotone" dataKey="cancelled"
              stroke="#F44336" strokeWidth={2}
              dot={false} name="Cancelled" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default OrdersChart;
