import React from "react";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Globe,
  ShieldCheck,
  Trash2,
  Briefcase,
  Star,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const dummyUserData = {
  id: "dummy-user-001",
  name: "John Doe",
  email: "john.doe@example.com",
  phoneNumber: "+1 (555) 123-4567",
  bio: "Passionate professional dedicated to excellence",
  profilePictureUrl: "/default-avatar.png",
  phoneVerified: true,
  emailVerified: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  isActive: true,
  latitude: 40.7128,
  longitude: -74.0060,
  locationAddress: "123 Main St, New York, NY 10001",
  sessionData: {
    userTypeSession: "Dummy Professional Data"
  },
  professional: {
    businessType: "Consulting",
    specialization: "Business Strategy",
    businessName: "Doe Consulting Inc.",
    registrationProgress: "Complete",
    isVerified: true,
    rating: 4.8,
    topRated: true,
    verificationData: {
      verificationStatus: "Verified",
      verificationTitle: "Professional Verification",
      verificationDescription: "Comprehensive background check completed",
      reviewedBy: "Admin Team"
    }
  }
};

const UserProfileCard: React.FC = () => (
  <Card>
    <CardHeader className="flex flex-row justify-between items-center">
      <CardTitle>Profile</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center text-center">
      <Avatar className="h-auto w-[50%]">
        <AvatarImage
          src={dummyUserData.profilePictureUrl || "/default-avatar.png"}
          alt={dummyUserData.name}
        />
        <AvatarFallback>
          {dummyUserData.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <p className="font-semibold md:text-4xl text-3xl">{dummyUserData.name}</p>
        <p className="text-muted-foreground text-md md:text-xl">{dummyUserData.email}</p>
        {dummyUserData.bio && <p className="text-sm mt-1">{dummyUserData.bio}</p>}
      </div>
    </CardContent>
  </Card>
);

const ContactInformationCard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Contact Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Phone size={16} />
          <span>{dummyUserData.phoneNumber}</span>
          <Badge variant={dummyUserData.phoneVerified ? "secondary" : "outline"}>
            {dummyUserData.phoneVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Mail size={16} />
          <span>{dummyUserData.email}</span>
          <Badge variant={dummyUserData.emailVerified ? "secondary" : "outline"}>
            {dummyUserData.emailVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ProfessionalDetailsCard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Professional Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center space-x-2">
        <Briefcase size={16} />
        <span>Business Type: {dummyUserData.professional.businessType}</span>
      </div>
      {dummyUserData.professional.specialization && (
        <div className="flex items-center space-x-2">
          <Star size={16} />
          <span>Specialization: {dummyUserData.professional.specialization}</span>
        </div>
      )}
      {dummyUserData.professional.businessName && (
        <div className="flex items-center space-x-2">
          <Globe size={16} />
          <span>Business Name: {dummyUserData.professional.businessName}</span>
        </div>
      )}
      <div className="flex items-center space-x-2">
        <ShieldCheck size={16} />
        <span>Registration Progress: {dummyUserData.professional.registrationProgress}</span>
        <Badge variant={dummyUserData.professional.isVerified ? "default" : "outline"}>
          {dummyUserData.professional.isVerified ? "Verified" : "Pending"}
        </Badge>
      </div>
      <div className="flex items-center space-x-2">
        <Star size={16} />
        <span>Rating: {dummyUserData.professional.rating.toFixed(1)}</span>
        <Badge variant={dummyUserData.professional.topRated ? "secondary" : "outline"}>
          {dummyUserData.professional.topRated ? "Top Rated" : "Regular"}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

const VerificationDetailsCard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Verification Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center space-x-2">
        <ShieldCheck size={16} />
        <span>Status: {dummyUserData.professional.verificationData.verificationStatus}</span>
      </div>
      <div>
        <p className="font-semibold">
          Title: {dummyUserData.professional.verificationData.verificationTitle}
        </p>
        <p className="text-sm text-muted-foreground">
          {dummyUserData.professional.verificationData.verificationDescription}
        </p>
      </div>
      {dummyUserData.professional.verificationData.reviewedBy && (
        <div className="flex items-center space-x-2">
          <Calendar size={16} />
          <span>Reviewed By: {dummyUserData.professional.verificationData.reviewedBy}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const AccountDetailsCard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Account Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center space-x-2">
        <Calendar size={16} />
        <span>Created: {format(new Date(dummyUserData.createdAt), "PPP")}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Calendar size={16} />
        <span>Last Updated: {format(new Date(dummyUserData.updatedAt), "PPP")}</span>
      </div>
    </CardContent>
  </Card>
);

const LocationDetailsCard: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Location Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Globe size={16} />
          <span>Latitude: {dummyUserData.latitude || "N/A"}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Globe size={16} />
          <span>Longitude: {dummyUserData.longitude || "N/A"}</span>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MapPin size={16} />
          <span>Full Address: {dummyUserData.locationAddress || "N/A"}</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Main Component
const DummyUserDetails: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      {/* User Management Section */}
      <div className="w-full bg-muted p-4 rounded-lg flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold uppercase">
            {dummyUserData.sessionData.userTypeSession}
          </h2>
          <Badge variant={dummyUserData.isActive ? "default" : "destructive"}>
            {dummyUserData.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex">
          <Button
            variant="destructive"
            className="flex items-center space-x-2"
            disabled
          >
            <Trash2 size={16} />
            <span>Delete User</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 grid grid-cols-1 gap-4">
          <UserProfileCard />
          <ProfessionalDetailsCard />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 gap-4">
          <ContactInformationCard />
          <LocationDetailsCard />
          <VerificationDetailsCard />
        </div>
        <div className="md:col-span-3 grid-cols-1">
          <AccountDetailsCard />
        </div>
      </div>
    </div>
  );
};

export default DummyUserDetails;