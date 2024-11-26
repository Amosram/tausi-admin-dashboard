import Loader from '@/components/layout/Loader';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProfessionalsByIdQuery } from '../api/professionalApi';
import { Image, MapPin } from 'lucide-react';

const ApplicationDetails: React.FC = () => {
  const {professionalId} = useParams();
  const {data, isLoading, isError} = useGetProfessionalsByIdQuery(professionalId!);


  if (isLoading) return <Loader />;


  return (
    <div className='flex flex-col md:flex-row flex-1 p-4 space-y-4 md:space-y-0 md:space-x-4'>
      {/* Left Panel */}
      <div className='w-full md:w-1/3 bg-white p-6 rounded-lg shadow-sm'>
        <div className='text-center mt-8'>
          <img
            src={data?.data.user.profilePictureUrl}
            alt='Professional'
            className='w-40 h-40 rounded-lg mx-auto border-2 border-red-500 object-cover'
          />
          <h2 className='text-2xl font-medium mt-6 capitalize'>{data?.data.businessName}</h2>
          <p className='text-gray-600 capitalize text-lg mt-2'>{data?.data.bio}</p>
          <div className='flex items-center justify-center mt-4 '>
            <MapPin className='mr-2'/>
            <p className='text-gray-600 font-medium'>{data?.data.locationAddress}</p>
          </div>
          <div className='flex items-center text-white justify-start mt-4 mb-6 bg-primary rounded-l-none rounded-lg text-xl p-2 w-[75%]'>
            <Image className='mr-2'/>
            <p className=' font-medium'>Professional</p>
          </div>
          <div className='grid grid-cols-3 gap-2 mt-4'>
            <img
              src={data?.data.user.profilePictureUrl}
              alt='Professional'
              className='w-full h-full object-cover rounded-lg'
            />
            <img
              src={data?.data.user.profilePictureUrl}
              alt='Professional'
              className='w-full h-full object-cover rounded-lg'
            />
            <img
              src={data?.data.user.profilePictureUrl}
              alt='Professional'
              className='w-full h-full object-cover rounded-lg'
            />
            <img
              src={data?.data.user.profilePictureUrl}
              alt='Professional'
              className='w-full h-full object-cover rounded-lg'
            />
            <img
              src={data?.data.user.profilePictureUrl}
              alt='Professional'
              className='w-full h-full object-cover rounded-lg'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicationDetails;
