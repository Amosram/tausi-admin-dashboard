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
      query: ({ id, ...updates }) => ({
        url: `/users/${id}`,
        method: "PATCH",
        data: updates,
      }),
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
