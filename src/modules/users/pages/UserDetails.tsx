import React, { useState } from "react";
import { format } from "date-fns";
import { ShieldCheck, Trash2 } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TausiProfessional,
  TausiUserDetails,
  VerificationData,
} from "@/models/user";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../api/usersApi";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";

const ProfileOverviewCard: React.FC<{ user: TausiUserDetails }> = ({
  user,
}) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-center">User Profile</CardTitle>
    </CardHeader>
    <CardContent className="flex flex-col items-center text-center space-y-2">
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={user.profilePictureUrl || "/default-avatar.png"}
          alt={user.name}
        />
        <AvatarFallback>{user.name[0]}</AvatarFallback>
      </Avatar>
      <p className="font-semibold text-xl">{user.name}</p>
      <Badge variant={user.isActive ? "default" : "destructive"}>
        {user.isActive ? "Active" : "Inactive"}
      </Badge>
    </CardContent>
  </Card>
);

// Contact Information Card
const ContactInformationCard: React.FC<{ user: TausiUserDetails }> = ({
  user,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Contact Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="flex justify-between">
        <span>Email: {user.email}</span>
        <Badge variant={user.emailVerified ? "default" : "outline"}>
          {user.emailVerified ? "Verified" : "Unverified"}
        </Badge>
      </div>
      <div className="flex justify-between">
        <span>Phone: {user.phoneNumber}</span>
        <Badge variant={user.phoneVerified ? "default" : "outline"}>
          {user.phoneVerified ? "Verified" : "Unverified"}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

// Location Details Card
const LocationDetailsCard: React.FC<{ user: TausiUserDetails }> = ({
  user,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Location</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Address: {user.locationAddress || "Not Provided"}</p>
      <p>
        Coordinates:{" "}
        {user.latitude && user.longitude
          ? `${user.latitude}, ${user.longitude}`
          : "Not Available"}
      </p>
    </CardContent>
  </Card>
);

// Professional Information Card
const ProfessionalDetailsCard: React.FC<{
  professional: TausiProfessional;
}> = ({ professional }) => (
  <Card>
    <CardHeader>
      <CardTitle>Professional Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <p>Business Type: {professional.businessType}</p>
      {professional.specialization && (
        <p>Specialization: {professional.specialization}</p>
      )}
      {professional.businessName && (
        <p>Business Name: {professional.businessName}</p>
      )}
      <div>
        <p>Registration Progress: {professional.registrationProgress} / 3</p>
        <Badge variant={professional.isVerified ? "default" : "outline"}>
          {professional.isVerified ? "Verified" : "Pending Verification"}
        </Badge>
      </div>
      <p>
        Rating: {professional.rating.toFixed(1)}{" "}
        {professional.topRated && <Badge>Top Rated</Badge>}
      </p>
    </CardContent>
  </Card>
);

// Account Metadata Card
const AccountMetadataCard: React.FC<{ user: TausiUserDetails }> = ({
  user,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Account Information</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Account Created: {format(new Date(user.createdAt), "PPP")}</p>
      <p>Last Updated: {format(new Date(user.updatedAt), "PPP")}</p>
    </CardContent>
  </Card>
);

// Verification Details Card
const VerificationDetailsCard: React.FC<{
  verificationData: VerificationData;
  professionalData: TausiProfessional;
}> = ({ verificationData, professionalData }) => (
  <Card>
    <CardHeader>
      <CardTitle>Verification Status</CardTitle>
    </CardHeader>
    <CardContent className="space-y-2">
      <div className="flex items-center space-x-2">
        <ShieldCheck size={16} />
        <span>Status: {verificationData?.verificationStatus}</span>
      </div>
      <div>
        <p className="font-semibold">
          Title: {verificationData?.verificationTitle}
        </p>
        <p className="text-sm text-muted-foreground">
          {verificationData?.verificationDescription}
        </p>
      </div>
    </CardContent>
    {verificationData?.verificationStatus === "pending" && (
      <CardFooter>
        <Button disabled variant="link">
          {/* CHANGE TO "asChild" once data matches */}
          <Link to={`/verifications/${professionalData?.id}`}>
            Check status
          </Link>
        </Button>
      </CardFooter>
    )}
  </Card>
);

// User Details Page Component
const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isLoading, isError } = useGetUserByIdQuery(userId || "");
  const [updateUser] = useUpdateUserMutation();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isAlertOpen, setAlertOpen] = useState(false);
  const [deleteReason, setDeleteReason] = useState("");

  const handleDelete = async () => {
    try {
      if (!user?.id) {
        console.error("User ID is missing or invalid.");
        return;
      }

      console.log("ID being passed to updateUser:", user?.id, typeof user?.id);

      const beauticianDetails = {
        id: user.id,
        name: user?.name,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        profilePictureUrl: user?.profilePictureUrl,
        profilePicturePath: user?.profilePicturePath,
        bio: user?.bio,
        locationAddress: user?.locationAddress,
        isActive: user?.isActive,
        deactivatedAt: user?.deactivatedAt,
        deactivatedBy: user?.deactivatedBy,
        deactivatedReason: user?.deactivatedReason,
        phoneVerified: user?.phoneVerified,
        emailVerified: user?.emailVerified,
        isDeleted: true,
        deletedAt: user?.deletedAt,
        deletedReason: deleteReason,
        createdAt: user?.createdAt,
        updatedAt: user?.updatedAt,
        latitude: user?.latitude,
        longitude: user?.longitude,
        coordinates: user?.coordinates,
        fcmToken: user?.fcmToken,
        userTypeSession: user?.sessionData?.userTypeSession,
      };

      await updateUser(beauticianDetails);
      setDialogOpen(false);
      setAlertOpen(false);

      toast({
        title: "Success",
        description: "User has been deleted successfully.",
        variant: "success",
      });

      navigate("/users/list");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  if (isLoading) return <Skeleton />;
  if (isError || !user) return <div>Error loading user data.</div>;

  return (
    <div className="container mx-auto p-4">
      {/* User Management Section */}
      <div className="w-full bg-muted p-4 rounded-lg flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold uppercase">
            {user.sessionData.userTypeSession}
          </h2>
          <Badge variant={user.isActive ? "default" : "destructive"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex">
          <Button
            variant="destructive"
            className="flex items-center space-x-2"
            onClick={() => setDialogOpen(true)}
          >
            <Trash2 size={16} />
            <span>Delete User</span>
          </Button>
        </div>
      </div>

      {/* Delete User Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Enter a reason for deleting this user:</p>
            <Input
              placeholder="Reason for deletion"
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setDialogOpen(false);
                setAlertOpen(true);
              }}
              disabled={!deleteReason.trim()}
            >
              Proceed
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Alert */}
      <AlertDialog open={isAlertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogTrigger asChild />
        <AlertDialogContent>
          <AlertDialogHeader>
            <h3 className="text-primary text-2xl">Are you sure?</h3>
            <p>This action will delete the user permanently.</p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={!deleteReason}>
              Confirm Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Main Content */}
      <div className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <ProfileOverviewCard user={user} />
          <ContactInformationCard user={user} />
        </div>
        <LocationDetailsCard user={user} />
        {user.sessionData.userTypeSession === "professional" && (
          <ProfessionalDetailsCard professional={user.professional} />
        )}
        <AccountMetadataCard user={user} />
        {user.professional && user.professional.verificationData && (
          <VerificationDetailsCard
            verificationData={user.professional.verificationData}
            professionalData={user.professional}
          />
        )}
      </div>
    </div>
  );
};

export default UserDetails;
