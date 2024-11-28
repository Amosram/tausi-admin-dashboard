import Loader from '@/components/layout/Loader';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetProfessionalsByIdQuery, useGetProfessionalsPorfolioQuery } from '../api/professionalApi';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { Button } from '@/components/ui/button';
import { Image, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ImageLightbox } from '../components/ImageGallery';
import { IoPricetagOutline } from 'react-icons/io5';

const ApplicationDetails: React.FC = () => {
  const { professionalId } = useParams();
  const { data, isLoading, isError } = useGetProfessionalsByIdQuery(professionalId!);
  const { data: portfolio, isLoading: isPortfolioLoading, isError: isPortfolioError } = useGetProfessionalsPorfolioQuery(professionalId!);

  if (isLoading || isPortfolioLoading) return <Loader />;
  if (isError || isPortfolioError) return <p>Error loading data.</p>;

  const professional = data?.data;
  const { services, resumeUrl, businessName, bio, locationAddress, user } = professional || {};

  return (
    <div className='p-6'>
      <div className='flex flex-col md:flex-row flex-1 p-4 space-y-4 md:space-y-0 md:space-x-4 lg:space-x-10'>
        {/* Left Panel */}
        <div className='w-full md:w-1/3 bg-white p-6 rounded-2xl shadow-sm'>
          <div className='text-center mt-8'>
            <img
              src={user?.profilePictureUrl}
              alt='Professional'
              className='w-40 h-40 rounded-lg mx-auto border-2 border-red-500 object-cover'
            />
            <h2 className='text-2xl font-medium mt-6 capitalize'>{businessName}</h2>
            <p className='text-gray-600 capitalize text-lg mt-2'>{bio}</p>
            <div className='flex items-center justify-center mt-4 '>
              <MapPin className='mr-2'/>
              <p className='text-gray-600 font-medium'>{locationAddress}</p>
            </div>
            <div className='flex items-center sm:w-fit text-white justify-start mt-4 mb-6 bg-primary rounded-l-none rounded-lg text-xl p-2 lg:w-[60%]'>
              <Image className='mr-2'/>
              <p className='font-medium'>Professional</p>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-2 gap-2 mt-4">
              {Array.isArray(portfolio?.data) ? (
                <ImageLightbox
                  images={portfolio.data}
                  trigger={(openLightbox) => (
                    <>
                      {portfolio.data.map((item, index) => (
                        <img
                          key={item.id}
                          src={item.imageUrl}
                          alt="Portfolio Image"
                          className="w-full h-full object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={() => openLightbox(index)}
                        />
                      ))}
                    </>
                  )}
                />
              ) : (
                <p>No images available in the portfolio.</p>
              )}
            </div>

          </div>
        </div>

        {/* Right Side Content */}
        <div className='w-full md:w-2/3 bg-white p-4 rounded-2xl shadow-md'>
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <Tabs defaultValue="services">
              <TabsList className="mb-6">
                <TabsTrigger
                  value="services"
                  className={cn(
                    "border-b-4 border-transparent px-4 py-2 font-medium text-lg",
                    "data-[state=active]:border-red-500 data-[state=active]:text-red-500"
                  )}
                >
                Service List
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className={cn(
                    "border-b-4 border-transparent px-4 py-2 font-medium text-lg",
                    "data-[state=active]:border-red-500 data-[state=active]:text-red-500"
                  )}
                >
                Product List
                </TabsTrigger>
                <TabsTrigger
                  value="resume"
                  className={cn(
                    "border-b-4 border-transparent px-4 py-2 font-medium text-lg",
                    "data-[state=active]:border-red-500 data-[state=active]:text-red-500"
                  )}
                >
                Resume
                </TabsTrigger>
              </TabsList>
              {/* Service Tab */}
              <TabsContent value="services" className="space-y-4">
                {services && services.length > 0 ? (
                  services.map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between border-b pb-4 last:border-0"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 overflow-hidden rounded-lg">
                          <img
                            src={service?.serviceData.imageUrl || "/tausi-logo.png"}
                            alt={service?.serviceData.name || "Service"}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <span className="font-medium">{service?.serviceData.name || "Unnamed Service"}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="flex items-center gap-2">
                          <IoPricetagOutline className="h-5 w-5" />
                        Ksh {service.price || "N/A"}
                        </span>
                        <span className="flex items-center gap-2">
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {Math.floor(service.duration / 60)} min
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No services available.</p>
                )}
              </TabsContent>
            
              {/** Products Tab **/}
              <TabsContent value="products" className="space-y-4">
                {services && services.some((service) => service.brands.length > 0) ? (
                  <div className="space-y-4">
                    {services
                      .filter((service) => service.brands.length > 0)
                      .map((service, index) =>
                        service.brands.map((brand, brandIndex) => (
                          <div
                            key={`${index}-${brandIndex}`}
                            className="flex items-start gap-8 p-4 border-b pb-4 last:border-0"
                          >
                            <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-gray-100">
                              {/* Replace with brand image URL if available */}
                              <span className="text-gray-500 text-lg font-medium">
                                {/* {brand || 'Brand'} */}
                                <img src='/tausi-logo.png' />
                              </span>
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-lg font-medium text-gray-800">
                                {brand || 'Unnamed Product'}
                              </h3>
                              <p className="text-sm text-gray-500">
                  Category: {brand.category || 'N/A'}
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                  </div>
                ) : (
                  <p className="text-gray-500">No products available.</p>
                )}
              </TabsContent>
            
              {/* Resume Tab */}
              <TabsContent value="resume" className="space-y-4">
                {resumeUrl ? (
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg">
                      <img src="/pdf.png" alt="Upload"
                        className="w-10 h-10"/>
                    </div>
                    <a
                      href={resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                    View Resume
                    </a>
                  </div>
                ) : (
                  <p className="text-gray-500">No resume uploaded.</p>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
      {/* TODO: GET RID OF THE BUTTONS */}
      {/* <div className="mt-6 flex justify-end gap-6">
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          <Button
            variant="ghost"
            className="w-full md:w-60 bg-gray-600 hover:bg-black text-white"
          >
      Decline
          </Button>
          <Button
            variant="link"
            className="w-full md:w-auto text-gray-500 text-center"
          >
      Request for more Info
          </Button>
        </div>
        <Button
          className="w-full md:w-60 bg-blue-500 hover:bg-blue-600"
        >
    Approve
        </Button>
      </div> */}


    </div>
  );
};

export default ApplicationDetails;
