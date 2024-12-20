import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormInputField } from "@/components/ui/Form/FormInputField";
import { useCreateUserMutation } from "../api/usersApi";
import { CreateUserRequest } from "../types";

const userFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  userTypeSession: z.enum(["professional", "client", "user"], {
    required_error: "Please select a user type",
  }),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must not exceed 500 characters"),
  profilePictureUrl: z.string().url("Invalid URL").optional(),
  profilePicturePath: z.string().optional(),
});

type UserFormValues = z.infer<typeof userFormSchema>;

const USER_TYPE_OPTIONS = [
  { label: "Service Provider", value: "professional" },
  { label: "Client", value: "client" },
  { label: "Internal User", value: "user" },
];

const CreateUserPage: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [createUser, { isLoading }] = useCreateUserMutation();

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      userTypeSession: "professional",
      bio: "",
      profilePictureUrl: "",
      profilePicturePath: "",
    },
  });

  const onSubmit = async (formData: UserFormValues) => {
    try {
      const userData: CreateUserRequest = {
        id: "id2",
        name: formData.name,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        userTypeSession: formData.userTypeSession,
        bio: formData.bio,
        profilePictureUrl:
          formData.profilePictureUrl || "https://placeholder.com/user",
        profilePicturePath: formData.profilePicturePath || "/users/default.jpg",
      };

      await createUser(userData).unwrap();
      toast({
        title: "Success",
        description: "User created successfully",
      });
      navigate("/users");
    } catch (error) {
      toast({
        title: `Failed to create user. ${error.data.message}`,
        description: `Error Code ${error.data.code}: ${error.data.data.message}`,
        variant: "destructive",
      });

      console.log(error);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New User</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormInputField
                form={form}
                name="name"
                label="Full Name"
                placeholder="John Doe"
              />

              <FormInputField
                form={form}
                name="email"
                label="Email"
                type="email"
                placeholder="john@example.com"
              />

              <FormInputField
                form={form}
                name="phoneNumber"
                label="Phone Number"
                type="tel"
                placeholder="0712345678"
                description="Enter a 10-digit phone number"
              />

              <FormInputField
                form={form}
                name="userTypeSession"
                label="User Type"
                type="select"
                placeholder="Select user type"
                options={USER_TYPE_OPTIONS}
              />

              <FormInputField
                form={form}
                name="bio"
                label="Bio"
                type="textarea"
                placeholder="Tell us about yourself..."
                description="Brief description about the user (10-500 characters)"
              />

              <FormInputField
                form={form}
                name="profilePictureUrl"
                label="Profile Picture URL"
                placeholder="https://example.com/profile.jpg"
                description="Optional: Enter a URL for the user's profile picture"
              />

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/users")}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create User"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateUserPage;
