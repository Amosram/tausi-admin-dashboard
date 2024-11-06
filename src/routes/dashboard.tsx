import React, { useState } from 'react';
import TausiLogo from '../assets/tausiLogo.png'; 
import dashboardIcon from '../assets/dashboardIcon.png';
import orderIcon from '../assets/ordersIcon.png';
import revenueIcon from '../assets/revenueIcon.png';
import userIcon from '../assets/usersIcon.png';
import applicationIcon from '../assets/applicationIcon.png';
import messengingIcon from '../assets/messengingIcon.png';
import settingsIcon from '../assets/settingsIcon.png';
import bellIcon from '../assets/bellIcon.png';
import messagingNotificationIcon from '../assets/messagingNotificationIcon.png';
import searchIcon from '../assets/searchIcon.png';
import menuIcon from '../assets/menuIcon.png';


const DashBoard: React.FC = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('Monthly');
  const [selectedRevenueTimeframe, setSelectedRevenueTimeframe] = useState('Monthly');
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      {/* Sidebar */}
      <div className="w-1/5 bg-white space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center mb-10 pt-5">
          <img src={TausiLogo} alt="Tausi Logo" className="w-24" />
        </div>
        {/* Sidebar Menu */}
        <ul className="space-y-6 text-base">
          <li className="relative flex items-center bg-orange-50 text-orange-500 pr-0 pl-4 py-2 w-full">
            <div className="flex items-center flex-grow">
              <img src={dashboardIcon} alt="icon" className="w-6 h-6 mr-2" />
              <span className="whitespace-nowrap">Dashboard</span>
            </div>
            <span className="absolute inset-y-0 right-0 w-2 bg-orange-600 rounded-md"></span> 
          </li>
          <li className="flex items-center hover:text-orange-500">
            <img src={orderIcon} alt="icon" className="w-6 h-6 mr-2" />
            <span className="whitespace-nowrap">Orders</span>
          </li>
          <li className="flex items-center hover:text-orange-500">
            <img src={revenueIcon} alt="icon" className="w-6 h-6 mr-2" />
            <span className="whitespace-nowrap">Revenues</span>
          </li>
          <li className="flex items-center hover:text-orange-500">
            <img src={userIcon} alt="icon" className="w-6 h-6 mr-2" /> 
            <span className="whitespace-nowrap">Users</span>
          </li>
          <li className="flex items-center hover:text-orange-500">
            <img src={applicationIcon} alt="icon" className="w-6 h-6 mr-2" /> 
            <span className="whitespace-nowrap">Applications</span>
          </li>
          <li className="flex items-center hover:text-orange-500">
            <img src={messengingIcon} alt="icon" className="w-6 h-6 mr-2" />
            <span className="whitespace-nowrap">Messaging</span>
          </li>
          <li className="flex items-center hover:text-orange-500">
            <img src={settingsIcon} alt="icon" className="w-6 h-6 mr-2" /> 
            <span className="whitespace-nowrap">Settings</span>
          </li>
        </ul>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="w-full bg-white p-4 shadow-md flex items-center justify-between">
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src={menuIcon} alt="Menu Icon" className="w-5 h-5 text-gray-500" />
            </div>
            <div className="relative">
              <div className="text-gray-600 font-bold">DashBoard</div>
            </div>
          </div>
          <div className="flex items-center space-x-4"></div>
            {/* Search Bar */}
            <div className="relative max-w-xs w-full mr-4">
              <input
                type="text"
                className="border rounded-lg p-2 w-full bg-gray-100 pl-4 pr-10 text-gray-700"
              />
              <span className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <img src={searchIcon} alt="Search Icon" className="w-5 h-5 text-gray-500" />
              </span>
          </div>
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              {/* notification code = <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 absolute top-0 right-0">2</span>*/}
              <img src={messagingNotificationIcon} alt="Notification Icon" className="w-6 h-6 cursor-pointer" />
            </div>
            <div className="relative">
              {/*<span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 absolute top-0 right-0">2</span>*/}
              <img src={bellIcon} alt="Bell Icon" className="w-6 h-6 cursor-pointer" />
            </div>
            {/* Avatar */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gray-300 rounded-md cursor-pointer"></div>
              <div className="flex flex-col">
                <span className="text-gray-700">Franklin</span>
                <span className="text-gray-500 text-sm">Admin</span>
              </div>
            </div>
          </div>
        </div>

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
