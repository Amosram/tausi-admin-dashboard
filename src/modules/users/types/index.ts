import { TausiUser } from "@/models/user";

export type UserTableData = Pick<
  TausiUser,
  "id" | "name" | "email" | "phoneNumber" | "role" | "isActive" | "createdAt"
>;
