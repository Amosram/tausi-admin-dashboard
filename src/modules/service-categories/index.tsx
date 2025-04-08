import React from 'react';
import {  Routes, Route } from 'react-router-dom';
import ServiceCategories from './pages/ServiceCategories';

const ServiceCategory = () => {
  return (
    <Routes>
      <Route path="/" element={<ServiceCategories/>} />
    </Routes>
  );
};

export default ServiceCategory;