import React from 'react';
import * as Popover from '@radix-ui/react-popover';
import { ChartNoAxesCombined, FileSearch2, FileUp } from 'lucide-react';

const RevenueStats = () => {

  const revenueData = [
    { period: 'Today', amount: 3566, orders: 35 },
    { period: 'Past week', amount: 13566, orders: 835 },
    { period: 'Past month', amount: 123566, orders: 20635 },
    { period: 'Past year', amount: 1453566, orders: 845235 },
  ];

  return (
    <div className="p-0 space-y-6 bg-gray-50  dark:bg-gray-800">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full">
        {revenueData.map((item) => (
          <div
            key={item.period}
            className="bg-white dark:bg-card p-4 rounded-2xl shadow-md border border-gray-200"
          >
            <div className="flex items-center">
              <div className="bg-red-100 dark:bg-gray-800 p-4 rounded-full mr-3">
                <FileSearch2 className="h-5 w-5 text-red-500" />
              </div>
              <span><p className="text-2xl text-black dark:text-gray-300 font-medium capitalize">{item.period}</p></span>
              <Popover.Root>
                <Popover.Trigger asChild>
         
                </Popover.Trigger>
                <Popover.Content className="p-2 bg-white border border-gray-200 rounded-lg shadow-lg">
                  <p className="text-sm">More options here</p>
                </Popover.Content>
              </Popover.Root>
            </div>
            <div className="flex flex-col mt-5 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-3xl font-normal">${item.amount}/-</h3>
                  <p className="text-sm text-gray-500 mt-2 font-bold">{item.orders} Orders</p>
                </div>
                <button className="text-blue-500 p-1 mt-6 rounded-full hover:bg-gray-100">
                  <ChartNoAxesCombined size={30} />
                </button>
              </div>
            </div>
          </div>
        ))}
        <div className="bg-red-100 p-4 dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200">
          <div className="flex flex-col items-center mt-10">
            <FileUp className="text-red-500 bg-red-500 p-2 rounded-full cursor-pointer" size={40}
              fill='#fff'/>
            <p className="text-2xl text-black dark:text-gray-300 mt-2">Export Data</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueStats;
