import { lazy, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Coordinates, Professional } from "@/models";
import {
  Phone,
  Mail,
  CheckCircle,
  Briefcase,
  Globe,
  ShieldCheck,
  Star,
  GalleryThumbnails,
  StarIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useGetBeauticianNearbyQuery, useGetProfessionalsByIdQuery, useGetProfessionalsPorfolioQuery, useUpdateProfessionalMutation } from "../api/professionalApi";
import { Skeleton } from "@/components/ui/skeleton";
import { ImageLightbox } from "../components/ImageGallery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import DeactivateDialog from "../components/DeactivateDialog";
import { toast } from "@/hooks/use-toast";
import BoothAssignmentCard from "../components/BoothAssignmentCard";
import ProfessionalProfileCard from "../components/ProfessionalProfileCard";

const Maps = lazy(() => import("@/components/ui/maps"));

// Contact information

const ContactInformationCard: React.FC<{
  professional: Professional;
}> = ({ professional }) => (
  <Card>
    <CardHeader>
      <CardTitle>Contact Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Phone size={16} />
          <span>{professional?.user?.phoneNumber}</span>
          <Badge variant={professional?.user?.phoneVerified ? "secondary" : "outline"}>
            {professional?.user?.phoneVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Mail size={16} />
          <span>{professional?.user?.email}</span>
          <Badge variant={professional?.user?.emailVerified ? "secondary" : "outline"}>
            {professional?.user?.emailVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

// professional Card

const ProfessionalDetailsCard: React.FC<{
  professional: Professional;
}> = ({ professional }) => (
  <Card>
    <CardHeader>
      <CardTitle>Professional Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center space-x-2">
        <Briefcase size={16} />
        <span>Business Type: {professional.businessType}</span>
      </div>
      {professional.specialization && (
        <div className="flex items-center space-x-2">
          <Star size={16} />
          <span>Specialization: {professional.specialization}</span>
        </div>
      )}
      {professional.businessName && (
        <div className="flex items-center space-x-2">
          <Globe size={16} />
          <span>Business Name: {professional.businessName}</span>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <ShieldCheck size={16} />
        <span>Registration Progress: {professional.registrationProgress}</span>
        <Badge variant={professional.isVerified ? "default" : "outline"}>
          {professional.isVerified ? "Verified" : "Pending"}
        </Badge>
      </div>
      <div className="flex items-center space-x-2">
        <Star size={16} />
        <span>Rating: {professional?.rating.toFixed(1)}</span>
        <Badge variant={professional.topRated ? "success" : "secondary"}>
          {professional.topRated ? "Top Rated" : "Regular"}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

// business card

const BusinessCard: React.FC<{
  professional: Professional;
}> = ({professional}) => (
  <Card>
    <CardHeader className="flex flex-row items-start gap-4">
      <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
        <div className="w-8 h-8 relative">
          <div className="absolute inset-0 bg-white rounded-full" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-yellow-300 rounded-full" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-green-500 rounded-full" />
        </div>
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl mb-1">Service Provider</CardTitle>
            <div className="space-y-1">
              <div>
                <span className="text-muted-foreground capitalize">{professional.user.name}</span>
                <p className="text-lg font-semibold text-blue-900 dark:text-blue-400">{professional.businessName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Provider Location</span>
                <p className="text-lg font-semibold text-blue-900 dark:text-blue-400">{professional.locationAddress}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-red-500 text-red-500" />
            <span className="text-2xl">{professional.rating}</span>
          </div>
        </div>
        {/*TODO: FETCH THE DATA FROM THE API  */}
        <div className="grid grid-cols-3 gap-4 my-6 py-6 border-y">
          <div>
            <p className="text-muted-foreground">Completed Orders</p>
            <p className="text-xl font-semibold text-blue-900 dark:text-gray-300">__</p>
          </div>
          <div>
            <p className="text-muted-foreground">Cancelled Orders</p>
            <p className="text-xl font-semibold text-blue-900 dark:text-gray-300">__</p>
          </div>
          <div>
            <p className="text-muted-foreground">Total Revenue</p>
            <p className="text-xl font-semibold text-blue-900 dark:text-gray-300">__</p>
          </div>
        </div>
      
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-muted-foreground">Provider Phone</p>
            <p className="text-lg font-semibold text-blue-900 dark:text-gray-300">{professional.user.phoneNumber}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Provider Email;</p>
            <p className="text-lg font-semibold text-blue-900 dark:text-gray-300">{professional.user.email}</p>
          </div>
        </div>
      </div>
    </CardHeader>
  </Card>
  
);

// service provided card
const ServiceProvidedCard: React.FC<{
  professional: Professional;
}> = (professional) => (
  <Card>
    <CardHeader>
      <CardTitle>Services</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 gap-4">
        {professional.professional?.services.map((service, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-4">
                <img
                  src={service.serviceData.imageUrl}
                  alt={service.serviceData.name}
                  width={100}
                  height={100}
                  className="rounded-md"
                />
                <div>
                  <CardTitle className="text-xl capitalize mb-2">{service.serviceData.name}</CardTitle>
                  {/* <CardDescription className="text-lg"> Category: {service.serviceData.}</CardDescription> */}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-2">{service.serviceData.description}</p>
              <p className="font-medium"><b>Price:</b> KES {service.price}</p>
              <p className="font-medium"><b>Duration:</b> {Math.floor(service.duration / 60)} min</p>
              <p className="font-medium mt-1"><b>Last Updated:</b> {new Date(service.serviceData.updatedAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </CardContent>
  </Card>
);

// products card
const ProductCard: React.FC<{
  professional: Professional;
}> = (professional) => (
  <Card>
    <CardHeader>
      <CardTitle>Products</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {professional.professional.services.map((product, index) => (
          <div key={index} className="flex items-center space-x-4 p-2 rounded-lg hover:bg-muted">
            <img
              src='/tausi-logo.png'
              width={50}
              height={50}
              className="rounded-md"
            />
            <div>
              <h3 className="font-semibold capitalize text-xl">{product.brands}</h3>
              {/* <p className="text-sm text-muted-foreground">{product.description}</p>
              <p className="font-semibold mt-1">KES{product.price}</p> */}
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);


const ProfessionalDetails = () => {
  const {professionalId} = useParams();
  const {data, isLoading, isError} = useGetProfessionalsByIdQuery(professionalId!);
  const {data: portfolio, isLoading: isPortfolioLoading, isError: isPortfolioError} = useGetProfessionalsPorfolioQuery(professionalId!);
  const [updateProfessional] = useUpdateProfessionalMutation();
  
  const professional = data?.data;

  // using the map component
  const [coordinates, setCoordinates] = useState<Coordinates>(professional?.coordinates || { x: -1.286389, y: 36.817223 });
  
  const {data: beauticianNearby, isLoading:isBeauticianNearbyLoading, isError:isBeauticianNearbyError} = useGetBeauticianNearbyQuery({
    latitude: coordinates.x.toString(),
    longitude: coordinates.y.toString(),
    limit: 10,
  });
  
  if (!professionalId) {
    return <div>Invalid professional ID</div>;
  }

  if (isLoading || isPortfolioLoading || isBeauticianNearbyLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-[600px] w-full" />
          <div className="md:col-span-2 grid grid-cols-1 gap-4">
            <Skeleton className="h-[400px] w-full" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !professional || isPortfolioError || isBeauticianNearbyError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-destructive text-destructive-foreground p-4 rounded-lg">
          Unable to load Verified Beautician details. Please try again later.
        </div>
      </div>
    );
  }

  // Generate markers for beauticians nearby
  const markers = beauticianNearby?.data?.map((item) => ({
    id: item.id,
    lat: Number(item.latitude),
    lng: Number(item.longitude),
    profilePictureUrl: item.user.profilePictureUrl,
    name: item.user.name,
    locationName: item.locationAddress || null,
  })) || [];

  // infobody for markers
  const infoBody = (name: string, profilePictureUrl: string, locationName: string) => {

    // Fallback for profile picture and location name
    const sanitizedProfilePictureUrl = profilePictureUrl || "/tausi-logo.png";
    const sanitizedBeauticianName = name || "Beautician not available";
    const sanitizedLocationName = locationName || "Location not available";

    return (
      <div className="flex flex-col items-center p-4">
        <img
          src={sanitizedProfilePictureUrl}
          alt={`Profile of ${name}`}
          className="w-16 h-16 object-cover rounded-full"
          onError={(e) => {
            e.currentTarget.src = "/tausi-logo.png"; // Fallback if image fails to load
          }}
        />
        <h3 className="text-lg font-semibold mt-2 text-center capitalize text-gray-500">{sanitizedBeauticianName}</h3>
        <p className="text-sm text-gray-500 text-center">{sanitizedLocationName}</p>
      </div>
    );
  };

  const handleActivate = async () => {
    try {
      await updateProfessional({
        id: professional.id,
        isActive: true,
        deactivatedAt: null,
        deactivatedBy: null,
        deactivatedReason: null,
      }).unwrap();

      toast({
        title: "Success",
        description: "Beautician has been activated successfully.",
        variant: "success",
      });
    }  catch(error) {
      toast({
        title: "Error",
        description: "An error occurred while activating the Beautician.",
        variant: "destructive",
      });
    }
  };

  const handleTopRatedBeautician = async () => {
    try {
      await updateProfessional({
        id: professional.id,
        topRated: true
      }).unwrap;
      toast({ title: "Success", description: "Successfully Top rated the beautician", variant: "success" });
    }
    catch (error) {
      console.error("Failed to Top rate a beautician", error);
      toast({ title: "Error", description: "An error occurred while top rating a beautician.", variant: "destructive" });
    }
  };

  const handleUnmarkTopRatedBeautician = async () => {
    try {
      await updateProfessional({
        id: professional.id,
        topRated: false
      }).unwrap;
      toast({ title: "Success", description: "Successfully unmarked the beautician as top rated", variant: "success" });
    }
    catch (error) {
      console.error("Failed to unmark a beautician as top rated", error);
      toast({ title: "Error", description: "An error occurred while unmarking a beautician as top rated.", variant: "destructive" });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Professional Management */}
      <div className="w-full bg-muted p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">
                 Beautician Management
          </h2>
          <Badge variant={professional.isActive ? "default" : "destructive"}>
            {professional.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex gap-3">
          {!professional.isActive && (
            <Button
              className="flex items-center space-x-2 bg-green-600"
              onClick={handleActivate}
            >
              <CheckCircle size={16} />
              <span>Activate</span>
            </Button>
          )}
          {professional.isActive && (
            <>
              <DeactivateDialog professionalId={professionalId} />
              {professional.topRated ? (
                <Button
                  className="bg-gray-500"
                  onClick={handleUnmarkTopRatedBeautician}
                >
                  <StarIcon size={16} />
                  <span>Unmark Top Rated</span>
                </Button>
              ) : (
                <Button
                  className="bg-yellow-500"
                  onClick={handleTopRatedBeautician}
                >
                  <StarIcon size={16} />
                  <span>Mark as Top Rated</span>
                </Button>
              )}
            </>
          )}
        </div>
      </div>
      {/* professional Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 grid grid-cols-1 gap-4">
          <ProfessionalProfileCard professional={professional} />
          <ProfessionalDetailsCard professional={professional} />
        </div>
        {/* Contact information */}
        <div className="md:col-span-2 grid grid-cols-1 gap-4">
          <ContactInformationCard professional={professional} />
          {/* Business Card */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <BusinessCard professional={professional} />
          </div>
        </div>
      </div>
      {/* Service and Product Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-start">
        <div className="md:col-span-1 grid grid-cols-1 gap-4">
          <ServiceProvidedCard professional={professional} />
        </div>
        <div className="md:col-span-1 grid grid-cols-1 gap-4">
          <ProductCard professional={professional} />
        </div>
      </div>

      {/* Booth Assignemts */}
      <BoothAssignmentCard assignment={professional} />

      {/* Tab Layout for Portfolio and Location */}
      <Tabs className="w-full mt-8" defaultValue="location">
        {/* Tab List */}
        <TabsList className="flex border-b border-muted space-x-4 pb-2 " aria-label="Portfolio and Location">
          <TabsTrigger
            value="location"
            className={cn(
              "border-b-4 border-transparent px-4 py-2 font-medium text-lg",
              "data-[state=active]:border-red-500 data-[state=active]:text-red-500"
            )}
          >
            Location
          </TabsTrigger>
          <TabsTrigger
            value="portfolio"
            className={cn(
              "border-b-4 border-transparent px-4 py-2 font-medium text-lg",
              "data-[state=active]:border-red-500 data-[state=active]:text-red-500"
            )}
          >
            Portfolio
          </TabsTrigger>
        </TabsList>

        {/* Tab Content */}
        <TabsContent value="portfolio" className="mt-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
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
                        className="w-full h-64 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openLightbox(index)}
                      />
                    ))}
                  </>
                )}
              />
            ) : (
              <GalleryThumbnails size={30} />
            )}
          </div>
        </TabsContent>

        <TabsContent value="location" className="mt-4">
          <div className="md:col-span-3 grid-cols-3">
            <Maps
              coordinates={markers}
              setCoordinates={(coords) => setCoordinates({ x: coords.lat, y: coords.lng })}
              infoBody={(index) => {
                const marker = markers[index];
                return infoBody(marker?.name, marker?.profilePictureUrl, marker?.locationName);
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfessionalDetails;
