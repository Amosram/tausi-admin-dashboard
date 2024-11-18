import React from 'react';
import { TabProps } from '../utils/Types';

const Tabs: React.FC<TabProps> = ({ activeTab, setActiveTab }) => {
  const tabs = ["All Status", "PENDING", "IN REVIEW", "REJECTED"];

  return (
    <div className='flex gap-4 mb-4 w-fit bg-white rounded-full pr-2 pl-0'>
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setActiveTab(tab)}
          className={`px-4 py-2 rounded-full ${
            activeTab === tab
              ? "bg-red-500 text-white"
              : " text-gray-800"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default Tabs;
