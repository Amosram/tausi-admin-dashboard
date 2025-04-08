import { SessionData, TausiUser, TausiUserDetails } from "@/models/user";

export interface UsersApiResponse {
  users: TausiUser;
  userSessionData: SessionData;
}

export interface SingleUserApiResponse {
  statusCode: string;
  code: number;
  message: string;
  data: TausiUserDetails;
}

export interface CreateUserRequest {
  id?: string;
  name: string;
  email: string;
  phoneNumber: string;
  userTypeSession: "professional" | "client" | "user";
  bio: string;
  profilePictureUrl?: string;
  profilePicturePath?: string;
}
