import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import { TausiUser, TausiUserDetails } from "@/models/user";
import { CreateUserRequest, SingleUserApiResponse, UsersApiResponse } from "../types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery({ isAuthorizedApi: true }),
  tagTypes: ["Users", "UserDetails"],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getUsers: builder.query<TausiUser[], number>({
      query: (limit) => ({
        url: `/users?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Users"],
      keepUnusedDataFor: 0,
    }),
    getUserById: builder.query<TausiUserDetails, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: SingleUserApiResponse) => response.data,
      providesTags: ["UserDetails"],
    }),
    createUser: builder.mutation<UsersApiResponse, CreateUserRequest>({
      query: (userData) => ({
        url: "/users",
        method: "POST",
        data: userData,
      }),
      // Invalidate the Users tag to trigger a refetch of the users list
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation<
      TausiUserDetails,
      Partial<TausiUserDetails> & { id: string }
    >({
      query: ({ id, ...updates }) => {
        // Ensure the id is explicitly passed
        if (!id || typeof id !== "string") {
          throw new Error("Invalid or missing ID in updateUser mutation.");
        }

        // Return the manual query configuration
        return {
          url: `/users/${id}`, // Pass the id explicitly in the URL
          method: "PATCH",
          data: { id, ...updates }, // Optionally include id in the payload if the backend requires it
        };
      },
      invalidatesTags: ["UserDetails", "Users"],
    }),

  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} = usersApi;
