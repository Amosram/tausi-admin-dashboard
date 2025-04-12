import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import { TausiUser, TausiUserDetails } from "@/models/user";
import { CreateUserRequest, SingleUserApiResponse, UsersApiResponse } from "../types";
import { GenericResponse } from "@/constants/types";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery({ isAuthorizedApi: true }),
  tagTypes: ["Users", "UserDetails"],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getUsers: builder.query<GenericResponse<TausiUser[]>, number>({
      query: (limit) => ({
        url: `/users?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Users"],
      keepUnusedDataFor: 0,
    }),
    getUserById: builder.query<GenericResponse<TausiUserDetails>, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: SingleUserApiResponse): GenericResponse<TausiUserDetails> => ({
        data: response.data,
        message: response.message,
        statusCode: response.statusCode as any,
        code: response.code
      }),
      providesTags: ["UserDetails"],
      keepUnusedDataFor: 0,
    }),
    createUser: builder.mutation<GenericResponse<TausiUserDetails>, CreateUserRequest>({
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
