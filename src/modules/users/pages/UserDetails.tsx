import React, { useState } from "react";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  Edit,
  Globe,
  CreditCard,
  Cloud,
  ShieldCheck,
  Trash2,
  Briefcase,
  Star,
} from "lucide-react";
import { useParams } from "react-router-dom";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  SessionData,
  TausiProfessional,
  TausiUserDetails,
  VerificationData,
} from "@/models/user";
import { useGetUserByIdQuery, useUpdateUserMutation } from "../api/usersApi";

// Components
const EditFieldDialog: React.FC<EditFieldDialogProps> = ({
  open,
  onOpenChange,
  title,
  currentValue,
  onSave,
  inputType = "input",
}) => {
  const [editValue, setEditValue] = useState(currentValue);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit {title}</DialogTitle>
        </DialogHeader>
        {inputType === "input" ? (
          <Input
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="mb-4"
          />
        ) : (
          <Textarea
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            className="mb-4"
          />
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              onSave(editValue);
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const UserProfileCard: React.FC<{
  user: TausiUserDetails;
  onEditField: (field: string, value: string) => void;
}> = ({ user, onEditField }) => (
  <Card>
    <CardHeader className="flex flex-row justify-between items-center">
      <CardTitle>User Profile</CardTitle>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onEditField("name", user.name)}
      >
        <Edit size={16} />
      </Button>
    </CardHeader>
    <CardContent className="flex flex-col items-center text-center">
      <Avatar className="h-auto w-[50%]">
        <AvatarImage
          src={user.profilePictureUrl || "/default-avatar.png"}
          alt={user.name}
        />
        <AvatarFallback>
          {user.name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="space-y-2">
        <p className="font-semibold md:text-4xl text-3xl">{user.name}</p>
        <p className="text-muted-foreground text-md md:text-xl">{user.email}</p>
        {user.bio && <p className="text-sm mt-1">{user.bio}</p>}
      </div>
    </CardContent>
  </Card>
);

const ContactInformationCard: React.FC<{
  user: TausiUserDetails;
  onEditField: (field: string, value: string) => void;
}> = ({ user, onEditField }) => (
  <Card>
    <CardHeader>
      <CardTitle>Contact Information</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Phone size={16} />
          <span>{user.phoneNumber}</span>
          <Badge variant={user.phoneVerified ? "secondary" : "outline"}>
            {user.phoneVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEditField("phoneNumber", user.phoneNumber)}
        >
          <Edit size={16} />
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Mail size={16} />
          <span>{user.email}</span>
          <Badge variant={user.emailVerified ? "secondary" : "outline"}>
            {user.emailVerified ? "Verified" : "Unverified"}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEditField("email", user.email)}
        >
          <Edit size={16} />
        </Button>
      </div>
    </CardContent>
  </Card>
);

const ProfessionalDetailsCard: React.FC<{
  professional: TausiProfessional;
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
        <span>Rating: {professional.rating.toFixed(1)}</span>
        <Badge variant={professional.topRated ? "secondary" : "outline"}>
          {professional.topRated ? "Top Rated" : "Regular"}
        </Badge>
      </div>
    </CardContent>
  </Card>
);

const VerificationDetailsCard: React.FC<{
  verificationData: VerificationData;
}> = ({ verificationData }) => (
  <Card>
    <CardHeader>
      <CardTitle>Verification Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center space-x-2">
        <ShieldCheck size={16} />
        <span>Status: {verificationData.verificationStatus}</span>
      </div>
      <div>
        <p className="font-semibold">
          Title: {verificationData.verificationTitle}
        </p>
        <p className="text-sm text-muted-foreground">
          {verificationData.verificationDescription}
        </p>
      </div>
      {verificationData.reviewedBy && (
        <div className="flex items-center space-x-2">
          <Calendar size={16} />
          <span>Reviewed By: {verificationData.reviewedBy}</span>
        </div>
      )}
    </CardContent>
  </Card>
);

const AccountDetailsCard: React.FC<{ user: TausiUserDetails }> = ({ user }) => (
  <Card>
    <CardHeader>
      <CardTitle>Account Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center space-x-2">
        <Calendar size={16} />
        <span>Created: {format(new Date(user.createdAt), "PPP")}</span>
      </div>
      <div className="flex items-center space-x-2">
        <Calendar size={16} />
        <span>Last Updated: {format(new Date(user.updatedAt), "PPP")}</span>
      </div>
    </CardContent>
  </Card>
);

const SessionDetailsCard: React.FC<{ sessionData: SessionData }> = ({
  sessionData,
}) => (
  <Card>
    <CardHeader>
      <CardTitle>Session Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex items-center space-x-2">
        <Cloud size={16} />
        <span>Session Type: {sessionData.userTypeSession}</span>
      </div>
      <div className="flex items-center space-x-2">
        <CreditCard size={16} />
        <span>Session ID: {sessionData.id}</span>
      </div>
    </CardContent>
  </Card>
);

const LocationDetailsCard: React.FC<{
  user: TausiUserDetails;
  onEditField: (
    field: string,
    value: string,
    inputType?: "input" | "textarea"
  ) => void;
}> = ({ user, onEditField }) => (
  <Card>
    <CardHeader>
      <CardTitle>Location Details</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Globe size={16} />
          <span>Latitude: {user.latitude || "N/A"}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEditField("latitude", user.latitude || "")}
        >
          <Edit size={16} />
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Globe size={16} />
          <span>Longitude: {user.longitude || "N/A"}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEditField("longitude", user.longitude || "")}
        >
          <Edit size={16} />
        </Button>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <MapPin size={16} />
          <span>Full Address: {user.locationAddress || "N/A"}</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            onEditField(
              "locationAddress",
              user.locationAddress || "",
              "textarea"
            )
          }
        >
          <Edit size={16} />
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Main Component
const UserDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { data: user, isLoading, isError } = useGetUserByIdQuery(userId || "");
  const [updateUser] = useUpdateUserMutation();

  const [editDialogOpen, setEditDialogOpen] = useState<EditDialogState>({
    field: "",
    value: "",
    open: false,
    inputType: "input",
  });

  const handleEditField = (
    field: string,
    currentValue: string,
    inputType: "input" | "textarea" = "input"
  ) => {
    setEditDialogOpen({
      field,
      value: currentValue,
      open: true,
      inputType,
    });
  };

  const handleSaveField = async (newValue: string) => {
    if (userId && editDialogOpen.field) {
      try {
        const updatedUser = await updateUser({
          id: userId,
          [editDialogOpen.field]: newValue,
        }).unwrap();
        console.log("User updated successfully:", updatedUser);
      } catch (error) {
        console.error("Error updating user:", error);
      }
    }
    setEditDialogOpen({ field: "", value: "", open: false });
  };

  if (!userId) {
    return <div>User ID is missing in the URL.</div>;
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

  if (isError || !user) {
    return (
      <div className="container mx-auto p-4">
        <div className="bg-destructive text-destructive-foreground p-4 rounded-lg">
          Unable to load user details. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      {/* User Management Section */}
      <div className="w-full bg-muted p-4 rounded-lg flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-bold">User Management</h2>
          <Badge variant={user.isActive ? "default" : "destructive"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex">
          <Button variant="destructive" className="flex items-center space-x-2">
            <Trash2 size={16} />
            <span>Delete User</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 grid grid-cols-1 gap-4">
          <UserProfileCard user={user} onEditField={handleEditField} />
          {user.sessionData.userTypeSession === "professional" && (
            <ProfessionalDetailsCard professional={user.professional} />
          )}
        </div>

        <div className="md:col-span-2 grid grid-cols-1 gap-4">
          <ContactInformationCard user={user} onEditField={handleEditField} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.sessionData.userTypeSession === "professional" && (
              <VerificationDetailsCard
                verificationData={user.professional.verificationData}
              />
            )}
            <SessionDetailsCard sessionData={user.sessionData} />
          </div>

          <LocationDetailsCard user={user} onEditField={handleEditField} />
        </div>
        <div className="md:col-span-3 grid-cols-1">
          <AccountDetailsCard user={user} />
        </div>
      </div>

      <EditFieldDialog
        open={editDialogOpen.open}
        onOpenChange={(open) =>
          setEditDialogOpen((prev) => ({ ...prev, open }))
        }
        title={editDialogOpen.field}
        currentValue={editDialogOpen.value}
        onSave={handleSaveField}
        inputType={editDialogOpen.inputType}
      />
    </div>
  );
};

interface EditFieldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  currentValue: string;
  onSave: (newValue: string) => void;
  inputType?: "input" | "textarea";
}

interface EditDialogState {
  field: string;
  value: string;
  open: boolean;
  inputType?: "input" | "textarea";
}

export default UserDetails;
