import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
  Edit,
  Lock,
  Globe,
  CreditCard,
  Cloud,
  ShieldCheck,
  UserPlus,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { format } from "date-fns";
import { TausiUser } from "@/models/user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

// Reusable Inline Edit Dialog
const EditFieldDialog: React.FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  currentValue: string;
  onSave: (newValue: string) => void;
  inputType?: "input" | "textarea";
}> = ({
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

const UserDetails: React.FC = () => {
  const [user, setUser] = useState<TausiUser>({
    id: "default-user-001",
    name: "Jane Alexandra Doe",
    email: "jane.doe@innovatetech.com",
    phoneNumber: "+1 (555) 123-4567",
    locationAddress: "456 Innovation Drive, Tech Valley, CA 94000",
    bio: "Senior Software Architect specializing in scalable cloud solutions and AI-driven technologies. Passionate about creating transformative digital experiences.",
    isActive: true,
    emailVerified: false,
    phoneVerified: false,
    profilePictureUrl: null,
    profilePicturePath: null,
    createdAt: new Date("2022-06-15"),
    updatedAt: new Date("2024-01-15"),
    deactivatedAt: null,
    deactivatedBy: null,
    deactivatedReason: null,
    deletedAt: null,
    deletedReason: null,
    isDeleted: false,
    fcmToken: null,
    latitude: "37.7749",
    longitude: "-122.4194",
    sessionData: {
      id: 1,
      userId: "default-user-001",
      userTypeSession: "Professional",
      createdAt: new Date("2022-06-15"),
      updatedAt: new Date("2024-01-15"),
      deletedAt: null,
      isDeleted: false,
    },
  });

  const [editDialogOpen, setEditDialogOpen] = useState<{
    field: string;
    value: string;
    open: boolean;
    inputType?: "input" | "textarea";
  }>({
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

  const handleSaveField = (newValue: string) => {
    setUser((prev) => ({
      ...prev,
      [editDialogOpen.field]: newValue,
    }));
    setEditDialogOpen({ field: "", value: "", open: false });
  };

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
        <div className="flex space-x-2">
          <Button variant="outline" className="flex items-center space-x-2">
            <UserPlus size={16} />
            <span>Add User</span>
          </Button>
          <Button variant="destructive" className="flex items-center space-x-2">
            <Trash2 size={16} />
            <span>Delete User</span>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-1 grid grid-cols-1 gap-4">
          {/* User Profile Card */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>User Profile</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditField("name", user.name)}
              >
                <Edit size={16} />
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              <Avatar className="h-16 w-16">
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
              <div>
                <p className="font-semibold">{user.name}</p>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
            </CardContent>
          </Card>

          {/* Security Details Card */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Security Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-2">
                <Lock size={16} />
                <span>Account Status</span>
                <Badge variant={!user.isDeleted ? "secondary" : "destructive"}>
                  {!user.isDeleted ? "Active" : "Deleted"}
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <ShieldCheck size={16} />
                <span>Verification Status</span>
                <Badge
                  variant={
                    user.emailVerified && user.phoneVerified
                      ? "default"
                      : "outline"
                  }
                >
                  {user.emailVerified && user.phoneVerified
                    ? "Fully Verified"
                    : "Partial Verification"}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 grid grid-cols-1 gap-4">
          {/* Contact Information Card */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
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
                  onClick={() =>
                    handleEditField("phoneNumber", user.phoneNumber)
                  }
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
                  onClick={() => handleEditField("email", user.email)}
                >
                  <Edit size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Two-column layout for remaining details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Account Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>
                    Created: {format(new Date(user.createdAt), "PPP")}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>
                    Last Updated: {format(new Date(user.updatedAt), "PPP")}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Session Details Card */}
            <Card>
              <CardHeader>
                <CardTitle>Session Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Cloud size={16} />
                  <span>Session Type: {user.sessionData.userTypeSession}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CreditCard size={16} />
                  <span>Session ID: {user.sessionData.id}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Details Card */}
          <Card>
            <CardHeader className="flex flex-row justify-between items-center">
              <CardTitle>Location Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Globe size={16} />
                  <span>Latitude: {user.latitude}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditField("latitude", user.latitude)}
                >
                  <Edit size={16} />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <Globe size={16} />
                  <span>Longitude: {user.longitude}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditField("longitude", user.longitude)}
                >
                  <Edit size={16} />
                </Button>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <MapPin size={16} />
                  <span>Full Address: {user.locationAddress}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    handleEditField(
                      "locationAddress",
                      user.locationAddress,
                      "textarea"
                    )
                  }
                >
                  <Edit size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Inline Edit Dialog */}
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

export default UserDetails;
