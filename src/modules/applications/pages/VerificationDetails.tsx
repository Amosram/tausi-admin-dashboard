import { lazy, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Coordinates, VerifiedBeauticians } from "@/models";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  Phone,
  Mail,
  Globe,
  ShieldCheck,
  Briefcase,
  Star,
  CheckCircle,
  XCircle,
  Clock10,
  CircleEllipsis,
  GalleryThumbnails,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProfessionalsPorfolioQuery, useUpdateverifiedBeauticiansMutation, useUseGetVerifiedBeauticianByIdQuery } from "../api/professionalApi";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_LOCATION } from "@/Utils/constants";
import DeclineDialog from "../components/DeclineDialog";
import { ImageLightbox } from "../components/ImageGallery";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import VerificationDocuments from "../components/VerificationDocuments";

const Maps = lazy(() => import("@/components/ui/maps"));

// verified beautician personal profile

const ProfileCard: React.FC<{
  beautician: VerifiedBeauticians;
}> = ({ beautician }) => (
  <Card>
    <CardHeader className="flex flex-row justify-between items-center">
      <CardTitle>Personal Profile</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center text-center">
      <Avatar className="h-auto w-[50%] rounded-full object-contain">
        <AvatarImage
          src={beautician.user?.profilePictureUrl || "/default-avatar.png"}
          alt={beautician.user?.name}
        />
        <AvatarFallback>
          {beautician.user?.name
            .split(" ")
            .map((name) => name[0])
            .join("")
            .toUpperCase()
          }
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <p className="font-semibold md:text-4xl text-3xl">{beautician.user?.name}</p>
        <p className="text-muted-foreground text-md md:text-xl">{beautician.user?.email}</p>
        {beautician.user?.bio && <p className="text-sm mt-1">{beautician.user?.bio}</p>}
      </div>
    </CardContent>
  </Card>
);

// Contact information

const ContactInformationCard: React.FC<{
  beautician: VerifiedBeauticians;
}> = ({ beautician }) => (
  <Card>
    <CardHeader>
      <CardTitle>Contact Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Phone size={16} />
          <span>{beautician?.user?.phoneNumber}</span>
          <Badge variant={beautician?.user?.phoneVerified ? "secondary" : "outline"}>
            {beautician?.user?.phoneVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Mail size={16} />
          <span>{beautician?.user?.email}</span>
          <Badge variant={beautician?.user?.emailVerified ? "secondary" : "outline"}>
            {beautician?.user?.emailVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

// verification status

const VerificationDetailsCard: React.FC<{ verificationData: VerifiedBeauticians }> =
({ verificationData }) =>
  (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center capitalize">
          {verificationData.verificationData?.verificationStatus === "review" && <Clock10 className="mr-2 h-5 w-5 text-red-500" />}
          {verificationData.verificationData?.verificationStatus === "rejected" && <XCircle className="mr-2 h-5 w-5 text-red-500" />}
          {verificationData.verificationData?.verificationStatus === "pending" && <CircleEllipsis className="mr-2 h-5 w-5 text-yellow-500" />}
          Verification Status: {verificationData.verificationData?.verificationStatus}
        </CardTitle>
        <CardDescription className='text-sm text-muted-foreground font-semibold'>{verificationData.verificationData?.verificationTitle}</CardDescription>
      </CardHeader>
      <CardContent className='space-y-3'>
        <p className="text-sm mb-4">{verificationData.verificationData?.verificationDescription}</p>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground">
          Last updated: {new Date(verificationData.verificationData?.updatedAt).toLocaleDateString()}
        </p>
      </CardFooter>
    </Card>
  );

// beautician Card

const ProfessionalDetailsCard: React.FC<{
  beautician: VerifiedBeauticians;
}> = ({ beautician }) => (
  <Card>
    <CardHeader>
      <CardTitle>Beautician Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center space-x-2">
        <Briefcase size={16} />
        <span>Business Type: {beautician.businessType}</span>
      </div>
      {beautician.specialization && (
        <div className="flex items-center space-x-2">
          <Star size={16} />
          <span>Specialization: {beautician.specialization}</span>
        </div>
      )}
      {beautician.businessName && (
        <div className="flex items-center space-x-2">
          <Globe size={16} />
          <span>Business Name: {beautician.businessName}</span>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <ShieldCheck size={16} />
        <span>Registration Progress: {beautician.registrationProgress}</span>
        <Badge variant={beautician.isVerified ? "default" : "outline"}>
          {beautician.isVerified ? "Verified" : "Pending"}
        </Badge>
      </div>
      <div className="flex items-center space-x-2">
        <Star size={16} />
        <span>Rating: {beautician?.rating.toFixed(1)}</span>
        <Badge variant={beautician.topRated ? "secondary" : "outline"}>
          {beautician.topRated ? "Top Rated" : "Regular"}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

// service card

const ServiceProvidedCard: React.FC<{
  beautician: VerifiedBeauticians;
}> = (beautician) => (
  <Card>
    <CardHeader>
      <CardTitle>Services</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 gap-4">
        {beautician.beautician?.services.map((service, index) => (
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
                  <CardDescription className="text-lg"> Category: N/A</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-2">{service.serviceData.description}</p>
              <p className="font-medium"><b>Price:</b> KES {service.serviceData.minimumPrice}</p>
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
  beautician: VerifiedBeauticians;
}> = (beautician) => (
  <Card>
    <CardHeader>
      <CardTitle>Products</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-4">
        {beautician.beautician.services.map((product, index) => (
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

const VerificationDetails: React.FC = () => {
  
  const {professionalId} = useParams();
  const {data, isLoading, isError} = useUseGetVerifiedBeauticianByIdQuery(professionalId!);
  const {data: portfolio, isLoading: isPortfolioLoading, isError: isPortfolioError} = useGetProfessionalsPorfolioQuery(professionalId!);
  const [updateVerifiedBeauticians] = useUpdateverifiedBeauticiansMutation();
  const navigate = useNavigate();

  const beautician = data?.data;
  
  // using the map component
  const [coordinates, setCoordinates] = useState<Coordinates>(beautician?.coordinates || DEFAULT_LOCATION);
  
  if (!professionalId) {
    return <div>Invalid beautician ID</div>;
  }

  if (isLoading || isPortfolioLoading) {
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

  if (isError || !beautician || isPortfolioError) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-destructive text-destructive-foreground p-4 rounded-lg">
          Unable to load beautician details. Please try again later.
        </div>
      </div>
    );
  }

  const handleApprove = async () => {
    try{
      await updateVerifiedBeauticians({
        id: beautician.id,
        isVerified: true,
        verificationStatus: "approved",
        verificationTitle: "Verification Approved",
        verificationDescription: "Verification approved successfully",
      }).unwrap();
      toast({ title: "Success", description: "Application approved successfully!", variant: "success" });
      navigate(`/professionals/${beautician.id}`);
    }
    catch (error) {
      console.error("Approve failed:", error);
      toast({ title: "Error", description: "An error occurred while approving the application.", variant: "destructive" });
    }
  };

  const isActionCompleted = beautician.isVerified || beautician.verificationData?.verificationStatus === "rejected";

  return (
    <div className="container mx-auto p-4">
      {/* Verification Management */}
      <div className="w-full bg-muted p-4 rounded-lg flex flex-col sm:flex-row justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">
                 Verification Management
          </h2>
          <Badge variant={beautician.isVerified ? "default" : "destructive"}>
            {beautician.isVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
        <div className="flex gap-3">
          {!beautician.verificationData?.verificationStatus.includes("rejected") && !beautician.isVerified && (
            <Button
              className="flex items-center space-x-2 bg-green-600"
              onClick={handleApprove}
              disabled={beautician.isVerified || beautician.verificationData?.verificationStatus.includes("approved")}
            >
              <CheckCircle size={16} />
              <span>Approve</span>
            </Button>
          )}
          {!beautician.verificationData?.verificationStatus.includes("approved") && !beautician.isVerified && !isActionCompleted && !beautician.isVerified && (
            <DeclineDialog beauticianId={professionalId}/>
          )}
        </div>
      </div>
      {/* beautician Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 grid grid-cols-1 gap-4">
          <ProfileCard beautician={beautician} />
          <ProfessionalDetailsCard beautician={beautician} />
        </div>
        {/* Contact information */}
        <div className="md:col-span-2 grid grid-cols-1 gap-4">
          <ContactInformationCard beautician={beautician} />
          {/* Verification Details */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <VerificationDetailsCard verificationData={beautician}/>
          </div>
          {/* Business Card */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            {/* <BusinessCard beautician={beautician} /> */}
          </div>
        </div>
      </div>
      {/* Service and Product Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 items-start">
        <div className="md:col-span-1 grid grid-cols-1 gap-4">
          <ServiceProvidedCard beautician={beautician} />
        </div>
        <div className="md:col-span-1 grid grid-cols-1 gap-4">
          <ProductCard beautician={beautician} />
        </div>
      </div>
      {/* Verification Documents */}
          <VerificationDocuments verificationDocuments={beautician} />

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
          <div className="md:col-span-3 grid-cols-3">
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
                        onLoad={() => console.log(`Image ${item.id} loaded successfully:`, item.imageUrl)}
                        onError={() => console.error(`Failed to load image ${item.id}:`, item.imageUrl)}
                      />
                    ))}
                  </>
                )}
              />
            ) : (
              <GalleryThumbnails size={30}/>
            )}
          </div>
        </TabsContent>

        <TabsContent value="location" className="mt-4">
          <div className="md:col-span-3 grid-cols-3">
            <Maps
              coordinates={{
                lat: Number(beautician.latitude) || coordinates.x,
                lng: Number(beautician.longitude) || coordinates.y,
              }}
              setCoordinates={(coords) => {
                setCoordinates({
                  x: coords.lat,
                  y: coords.lng,
                });
              }}
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default VerificationDetails;
