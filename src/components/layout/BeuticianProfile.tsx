import React, { useState } from 'react';
import { Frown, MapPin, Star } from 'lucide-react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { FaChevronDown } from 'react-icons/fa';
import { useGetProfessionalsQuery } from '@/modules/applications/api/professionalApi';
import Loader from './Loader';
import { useNavigate } from 'react-router-dom';

const sortOptions = ['Newest', 'Highest Rated', 'Most Reviews'];

export default function BeauticianProfiles() {
  // State to track the selected sort option
  const [selectedSort, setSelectedSort] = useState<string>('Newest');
  const {data, isLoading, isError} = useGetProfessionalsQuery(15);
  const navigate = useNavigate();
  
  const topRatedData = data?.data || [];

  const handleSortChange = (option: string) => {
    setSelectedSort(option);
  };

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <Frown size={30} />;
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Top rated Beauticians</h2>
        {/* <DropdownMenu.Root>
          <DropdownMenu.Trigger asChild>
            <div className="flex items-center space-x-1 cursor-pointer bg-gray-200 text-gray-600 rounded-full px-3 py-2">
              <span>{selectedSort}</span>
              <FaChevronDown size={12} />
            </div>
          </DropdownMenu.Trigger>
          <DropdownMenu.Content className="bg-white rounded-md shadow-lg p-1 mt-1">
            {sortOptions.map((option, index) => (
              <DropdownMenu.Item
                key={index}
                className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md cursor-pointer"
                onClick={() => handleSortChange(option)}
              >
                {option}
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Root> */}
      </div>
      <div className="overflow-x-auto">
        <div className="flex gap-4">
          {topRatedData
            .filter((beautician) => beautician.topRated)
            .map((beautician, index) => (
              <div
                key={index}
                className="min-w-[250px] border border-gray-300 rounded-lg overflow-hidden flex flex-col items-center p-4 cursor-pointer hover:shadow-md hover:bg-gray-100 dark:hover:bg-black"
                onClick={() => navigate(`/professionals/${beautician.id}`)}
              >
                <div className="w-20 h-20 rounded-lg flex items-center justify-center mb-4">
                  <img
                    src={beautician.user.profilePictureUrl}
                    alt={`${beautician.user.name}'s profile`}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-bold text-center">{beautician.businessName}</h3>
                <p className="text-red-500 text-center">{beautician.user.name}</p>
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {beautician.locationAddress}
                </div>
                <div className="mt-2 flex items-center">
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="font-bold mr-1">{beautician.rating}</span>
                </div>
              </div>
            ))}
        </div>
      </div>

    </div>
  );
}
