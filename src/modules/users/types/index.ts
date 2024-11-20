import { SessionData, TausiUser } from "@/models/user";

export type UserTableData = Pick<
  TausiUser,
  "id" | "name" | "email" | "phoneNumber" | "role" | "isActive" | "createdAt"
>;


export interface UsersApiResponse {
  users: TausiUser;
  userSessionData: SessionData;
}