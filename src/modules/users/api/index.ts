import { TausiUser } from "@/models/user";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { UsersApiResponse } from "../types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    fetchUsers: builder.query<TausiUser[], number>({
      query: (limit) => `users?limit=${limit}`,
      transformResponse: (response: UsersApiResponse[]) =>
        response.map((item) => item.users),
      providesTags: ["Users"],
    }),
  }),
});

export const { useFetchUsersQuery } = usersApi;
