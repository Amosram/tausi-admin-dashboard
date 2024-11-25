import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import { TausiUser } from "@/models/user";
import { CreateUserRequest, UsersApiResponse } from "@/models";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery({ isAuthorizedApi: true }),
  tagTypes: ["Users", "UsersDetails"],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getUsers: builder.query<UsersApiResponse[], number>({
      query: (limit) =>  ({
        url: `/users?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Users"],
    }),
    getUserById: builder.query<TausiUser, string>({
      query: (userId) => ({
        url: `/users/${userId}`,
        method: "GET",
      }),
      transformResponse: (response: UsersApiResponse) => response.users,
      providesTags: ["UsersDetails"]
    }),
    createUser: builder.mutation<UsersApiResponse, CreateUserRequest>({
      query: (userData) => ({
        url: '/users',
        method: 'POST',
        data: userData,
      }),
      // Invalidate the Users tag to trigger a refetch of the users list
      invalidatesTags: ['Users'],
    }),
  }),
});

export const { useGetUsersQuery, useCreateUserMutation } = usersApi;
