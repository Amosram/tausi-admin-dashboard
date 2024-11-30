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
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useUseGetVerifiedBeauticianByIdQuery } from "../api/professionalApi";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_LOCATION } from "@/Utils/constants";

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
          {verificationData.verificationData?.verificationStatus === "review" && <CheckCircle className="mr-2 h-5 w-5 text-green-500" />}
          {verificationData.verificationData?.verificationStatus === "rejected" && <XCircle className="mr-2 h-5 w-5 text-red-500" />}
          {verificationData.verificationData?.verificationStatus === "pending" && <Clock className="mr-2 h-5 w-5 text-yellow-500" />}
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
      <CardTitle>beautician Information</CardTitle>
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


const VerificationDetails: React.FC = () => {
  
  const {beauticianId} = useParams();
  const {data, isLoading, isError} = useUseGetVerifiedBeauticianByIdQuery(beauticianId!);

  const beautician = data?.data;

  // using the map component
  const [coordinates, setCoordinates] = useState<Coordinates>(beautician?.coordinates || DEFAULT_LOCATION);

  if (!beauticianId) {
    return <div>Invalid beautician ID</div>;
  }

  if (isLoading) {
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

  if (isError || !beautician) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-destructive text-destructive-foreground p-4 rounded-lg">
          Unable to load beautician details. Please try again later.
        </div>
      </div>
    );
  }
  return (
    <div className="container mx-auto p-4">
      {/* Verification Management */}
      <div className="w-full bg-muted p-4 rounded-lg flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">
                 Verification Management
          </h2>
          <Badge variant={beautician.isVerified ? "default" : "destructive"}>
            {beautician.isVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
        <div className="flex gap-3">
          <Button className="flex items-center space-x-2 bg-green-600">
            <CheckCircle size={16} />
            <span>Approve</span>
          </Button>
          <Button variant="destructive" className="flex items-center space-x-2">
            <XCircle size={16} />
            <span>Decline</span>
          </Button>
        </div>
      </div>
      {/* beautician Profile */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 grid grid-cols-1 gap-4">
          <ProfileCard beautician={beautician} />
          <ProfessionalDetailsCard beautician={beautician} />
        </div>

        {/* Contact informatin */}
        <div className="md:cols-span-2 grid grid-cols-1 gap-4">
          <ContactInformationCard beautician={beautician} />
          {/* Verification Details */}
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
            <VerificationDetailsCard verificationData={beautician}/>
          </div>
        </div>
        {/* Location*/}
        <div className="md:col-span-3 grid-cols-1">
          {/* TODO: ADD MAP COMPONENT HERE */}
          <Maps
            coordinates={{
              lat: Number(beautician.latitude) || coordinates.x,
              lng: Number(beautician.longitude) || coordinates.y,
            }}
            setCoordinates={(coords) => {
              setCoordinates({
                x: coords.lat,
                y: coords.lng
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default VerificationDetails;
