import React from 'react';
import { GiHamburgerMenu } from "react-icons/gi";

const Header = () => {
  return (
    <header className="sticky top-0 bg-white border-b border-slate-200 z-30 flex justify-between w-full shadow-sm px-4 py-6">
      <div className="w-full bg-white hadow-md flex items-center justify-between">

        <div className="flex items-center space-x-3">
          <div className="relative">
            <img src="/menuIcon.png" alt="Menu Icon" className="w-5 h-5 text-gray-500" />
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
            <img src="/searchIcon.png" alt="Search Icon" className="w-5 h-5 text-gray-500" />
          </span>
        </div>
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            {/* notification code = <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 absolute top-0 right-0">2</span>*/}
            <img src="/messagingNotificationIcon.png" alt="Notification Icon" className="w-6 h-6 cursor-pointer" />
          </div>
          <div className="relative">
            {/*<span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 absolute top-0 right-0">2</span>*/}
            <img src="/bellIcon.png" alt="Bell Icon" className="w-6 h-6 cursor-pointer" />
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
    </header>
  )
}

export default Header
