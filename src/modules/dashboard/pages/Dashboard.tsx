import BeauticianProfiles from '@/components/layout/BeuticianProfile';
import OngoingOrders from '@/components/layout/OngoingOrders';
import OrdersChart from '@/components/layout/OrdersChart';
import React, { useState } from 'react';

const DashBoard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Monthly');
  const [selectedRevenueTimeframe, setSelectedRevenueTimeframe] = useState('Monthly');

  return (
    <div className="flex h-screen overflow-y-scroll overflow-x-hidden bg-gray-100 w-full">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 sm:gap-6 sm:p-6 md:grid-cols-2 md:gap-6 md:p-6 lg:grid-cols-2">
          {/* Left side */}
          <div className="space-y-4 sm:space-y-6">
            <div className="grid grid-cols-2 grid-rows-2 gap-2 bg-white p-4 rounded-lg shadow-md sm:gap-4 sm:p-6">
              <div className="border-r border-b p-2 sm:p-4">
                <div className="text-gray-600">Client Orders</div>
                <div className="text-2xl font-bold sm:text-3xl">--</div>
              </div>
              <div className="border-b p-2 sm:p-4">
                <div className="text-gray-600">App Users</div>
                <div className="text-2xl font-bold sm:text-3xl">--</div>
              </div>
              <div className="border-r p-2 sm:p-4">
                <div className="text-gray-600">Revenue</div>
                <div className="text-2xl font-bold sm:text-3xl">--</div>
              </div>
              <div className="p-2 sm:p-4">
                <div className="text-gray-600">New Applications</div>
                <div className="text-2xl font-bold sm:text-3xl">--</div>
              </div>
            </div>

            {/* Orders */}
            <div className="bg-white p-4 rounded-lg shadow-md relative sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold sm:text-xl">Orders</div>

                {/* Buttons */}
                <div className="flex space-x-2 flex-grow w-full max-w-xs sm:max-w-sm flex-wrap">
                  <button
                    onClick={() => setSelectedTimeframe('Daily')}
                    className={`px-2 py-1 flex-1 rounded-full ${
                      selectedTimeframe === 'Daily' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 1vw, 1rem)' }}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setSelectedTimeframe('Weekly')}
                    className={`px-2 py-1 flex-1 rounded-full ${
                      selectedTimeframe === 'Weekly' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 1vw, 1rem)' }}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setSelectedTimeframe('Monthly')}
                    className={`px-2 py-1 flex-1 rounded-full ${
                      selectedTimeframe === 'Monthly' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 1vw, 1rem)' }}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div className="flex space-x-4 mb-4">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2"></span>
                  <span className="text-sm sm:text-base text-gray-600">Completed</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2"></span>
                  <span className="text-sm sm:text-base text-gray-600">Scheduled</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2"></span>
                  <span className="text-sm sm:text-base text-gray-600">Cancelled</span>
                </div>
              </div>

              <div className="h-30 bg-white-300 rounded-lg">
                <OrdersChart />
              </div>
            </div>

            {/* Top Rated Beauticians */}
            <div className="bg-white p-4 rounded-lg shadow-md sm:p-6">
              <div className="text-lg font-bold sm:text-xl mb-4">Top Rated Beauticians</div>
              <div className="bg-white-300 rounded-lg">
                <BeauticianProfiles />
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-4 sm:space-y-6">
            {/* Ongoing Orders */}
            <div className="bg-white p-4 rounded-lg shadow-md sm:p-6">
              <div className="text-lg font-bold sm:text-xl mb-4">Ongoing Orders</div>
              <div className="bg-white-300 rounded-lg">
                <OngoingOrders />
              </div>
            </div>

            {/* Revenue */}
            <div className="bg-white p-4 rounded-lg shadow-md relative sm:p-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-lg font-bold sm:text-xl">Revenue</div>

                {/* Timeframe buttons */}
                <div className="flex space-x-2 flex-grow w-full max-w-xs sm:max-w-sm flex-wrap">
                  <button
                    onClick={() => setSelectedRevenueTimeframe('Daily')}
                    className={`px-2 py-1 flex-1 rounded-full ${
                      selectedRevenueTimeframe === 'Daily' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 1vw, 1rem)' }}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setSelectedRevenueTimeframe('Weekly')}
                    className={`px-2 py-1 flex-1 rounded-full ${
                      selectedRevenueTimeframe === 'Weekly' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 1vw, 1rem)' }}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setSelectedRevenueTimeframe('Monthly')}
                    className={`px-2 py-1 flex-1 rounded-full ${
                      selectedRevenueTimeframe === 'Monthly' ? 'bg-red-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 1vw, 1rem)' }}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div className="flex space-x-4 mb-4">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-sm inline-block mr-2"></span>
                  <span className="text-sm sm:text-base text-gray-600">Income</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gray-500 rounded-sm inline-block mr-2"></span>
                  <span className="text-sm sm:text-base text-gray-600">Expense</span>
                </div>
              </div>
              <div style={{ height: '340px' }} className="bg-white-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
