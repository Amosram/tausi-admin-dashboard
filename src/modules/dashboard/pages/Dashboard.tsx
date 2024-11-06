import React, { useState } from 'react';

const DashBoard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Monthly');
  const [selectedRevenueTimeframe, setSelectedRevenueTimeframe] = useState('Monthly');
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 grid grid-cols-2 gap-6 p-6">
          {/* Left side */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 grid-rows-2 gap-4 bg-white p-6 rounded-lg shadow-md">
              <div className="border-r border-b p-4">
                <div className="text-gray-600">Client Orders</div>
                <div className="text-3xl font-bold">--</div>
              </div>
              <div className="border-b p-4">
                <div className="text-gray-600">App Users</div>
                <div className="text-3xl font-bold">--</div>
              </div>
              <div className="border-r p-4">
                <div className="text-gray-600">Revenue</div>
                <div className="text-3xl font-bold">--</div>
              </div>
              <div className="p-4">
                <div className="text-gray-600">New Applications</div>
                <div className="text-3xl font-bold">--</div>
              </div>
            </div>

            {/* Orders */}
            <div className="bg-white p-6 rounded-lg shadow-md relative">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-bold">Orders</div>

                {/* Buttons */}
                <div className="flex space-x-2 flex-grow w-full max-w-xs"> {/* Applied flex-grow */}
                  <button
                    onClick={() => setSelectedTimeframe('Daily')}
                    className={`px-2 py-1 flex-1 min-w-0 rounded-full ${
                      selectedTimeframe === 'Daily' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}  // Font scaling with clamp
                    > 
                    Daily
                  </button>
                  <button
                    onClick={() => setSelectedTimeframe('Weekly')}
                    className={`px-2 py-1 flex-1 min-w-0 rounded-full ${
                     selectedTimeframe === 'Weekly' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}  // Font scaling with clamp
                    >
                    Weekly
                  </button>
                  <button
                    onClick={() => setSelectedTimeframe('Monthly')}
                    className={`px-2 py-1 flex-1 min-w-0 rounded-full ${
                      selectedTimeframe === 'Monthly' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}  // Font scaling with clamp
                    >
                    Monthly
                  </button>
                </div>
              </div>
              <div className="flex space-x-4 mb-4">
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-green-500 rounded-full inline-block mr-2"></span>
                  <span className="text-gray-600">Completed</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-blue-500 rounded-full inline-block mr-2"></span>
                  <span className="text-gray-600">Scheduled</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-full inline-block mr-2"></span>
                  <span className="text-gray-600">Cancelled</span>
                </div>
              </div>


              <div className="h-64 bg-white-300 rounded-lg"></div> {/* Placeholder for Orders chart */}
            </div>

            {/*Top Rated Beauticians */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-xl font-bold mb-4">Top Rated Beauticians</div>
              <div className="h-40 bg-white-300 rounded-lg"></div> {/* Placeholder for Top Rated Beauticians */}
            </div>
          </div>

          {/* Right side */}
          <div className="space-y-6">
            {/* Ongoing Orders */}
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-xl font-bold mb-4">Ongoing Orders</div>
              <div className="h-96 bg-white-300 rounded-lg"></div> {/* Placeholder for Ongoing Orders */}
            </div>
  
            {/* Revenue */}
            <div className="bg-white p-6 rounded-lg shadow-md relative">
              <div className="flex justify-between items-center mb-4">
                <div className="text-xl font-bold">Revenue</div>
                {/* Timeframe buttons */}
                <div className="flex space-x-2 flex-grow w-full max-w-xs">
                  <button
                    onClick={() => setSelectedRevenueTimeframe('Daily')}
                    className={`px-2 py-1 flex-1 min-w-0 rounded-full ${
                      selectedRevenueTimeframe === 'Daily' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
                  >
                    Daily
                  </button>
                  <button
                    onClick={() => setSelectedRevenueTimeframe('Weekly')}
                    className={`px-2 py-1 flex-1 min-w-0 rounded-full ${
                      selectedRevenueTimeframe === 'Weekly' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
                  >
                    Weekly
                  </button>
                  <button
                    onClick={() => setSelectedRevenueTimeframe('Monthly')}
                    className={`px-2 py-1 flex-1 min-w-0 rounded-full ${
                      selectedRevenueTimeframe === 'Monthly' ? 'bg-orange-500 text-white' : 'bg-white text-gray-700'
                    }`}
                    style={{ fontSize: 'clamp(0.75rem, 1.5vw, 1rem)' }}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              <div className="flex space-x-10 mb-4"> 
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-red-500 rounded-sm inline-block mr-2"></span>
                  <span className="text-gray-600">Income</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-gray-500 rounded-sm inline-block mr-2"></span>
                  <span className="text-gray-600">Expense</span>
                </div>
              </div>
              <div style={{ height: '340px' }} className="bg-white-300 rounded-lg"></div> {/* Placeholder for Revenue chart */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
