import React from 'react';
import RevenueStats from '../components/RevenueStats';
import RevenueChart from '@/components/layout/RevenueChart';
import RevenueCategory from '../components/RevenueCategory';
import RevenueByLocation from '../components/RevenueByLocation';
import TopRevenueCategories from '../components/TopRevenueCategories';

const Revenue = () => {
  return (
    <div className='p-6 space-y-6 bg-gray-50 min-h-screen dark:bg-gray-800'>
      <RevenueStats />
      <div className="grid md:grid-cols-2 gap-6">
        <RevenueChart />
        <RevenueCategory />
        <RevenueByLocation />
        <TopRevenueCategories />
      </div>
    </div>
  );
};

export default Revenue;