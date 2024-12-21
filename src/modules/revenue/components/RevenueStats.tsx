import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChartNoAxesCombined, FileSearch2 } from 'lucide-react';

const RevenueStats = () => {

  const formatter = new Intl.NumberFormat('en-US');

  const revenueData = [
    { period: 'Today', amount: 3566, orders: 35 },
    { period: 'Past week', amount: 13566, orders: 835 },
    { period: 'Past month', amount: 123566, orders: 20635 },
    { period: 'Past year', amount: 1453566, orders: 845235 },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {revenueData.map((item) => (
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
              <p className="text-sm text-gray-500 mt-2">{item.orders} Orders</p>
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
