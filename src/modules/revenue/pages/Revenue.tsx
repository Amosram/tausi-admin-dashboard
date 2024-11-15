import React from 'react';
import RevenueStats from '../components/RevenueStats';
import RevenueChart from '@/components/layout/RevenueChart';

const Revenue = () => {
  return (
    <div className='p-6 space-y-6 bg-gray-50 min-h-screen'>
      <RevenueStats />
      <div className="grid md:grid-cols-2 gap-6">
        <RevenueChart />
      </div>
    </div>
  );
};

export default Revenue;