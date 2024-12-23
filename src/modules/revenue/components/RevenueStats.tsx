import React from 'react';
import { ChartNoAxesCombined, FileSearch2 } from 'lucide-react';
import { useGetDashboardAnalyticsQuery } from '@/modules/dashboard/api/dashboardApi';
import Loader from '@/components/layout/Loader';

const RevenueStats = () => {
  const formatter = new Intl.NumberFormat('en-US');

  const { data: revenueData, isLoading: isRevenueDataLoading, isError: isRevenueDataError } =
    useGetDashboardAnalyticsQuery('revenue');

  if (isRevenueDataLoading) return <Loader />;
  if (isRevenueDataError || !revenueData?.data?.data.metrics) return <div>Error fetching data</div>;

  // Extract metrics and convert to number
  const metrics = revenueData.data.data.metrics;
  const revenueMetrics = [
    { period: 'Today', amount: Number(metrics.today) },
    { period: 'Last 7 Days', amount: Number(metrics.last_7_days) },
    { period: 'Last 1 Month', amount: Number(metrics.last_1_month) },
    { period: 'Last 90 Days', amount: Number(metrics.last_90_days) },
    { period: 'Last 6 Months', amount: Number(metrics.last_6_months) },
    { period: 'Last Year', amount: Number(metrics.last_year) },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {revenueMetrics.map((item) => (
          <div
            key={item.period}
            className="bg-white dark:bg-card p-6 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between"
          >
            <div className="flex items-center mb-4">
              <div className="bg-red-100 dark:bg-gray-800 p-4 rounded-full mr-4">
                <FileSearch2 className="h-6 w-6 text-red-500" />
              </div>
              <p className="text-xl font-semibold text-black dark:text-gray-300 capitalize">
                {item.period}
              </p>
            </div>
            <div>
              <h3 className="text-3xl font-semibold text-black dark:text-gray-100">
                KES {formatter.format(item.amount)}/-
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mt-3">Total Revenue</p> {/* TODO: YOU CAN REPLACE HERE WITH THE TOTAL ORDERS */}
            </div>
            <div className="mt-4 flex justify-end">
              <button className="text-blue-500 p-2 rounded-full hover:bg-gray-100">
                <ChartNoAxesCombined size={24} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RevenueStats;
