import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import { TausiUser } from "@/models/user";
import { UsersApiResponse } from "@/models";

export const usersApi = createApi({
  reducerPath: "usersApi",
  baseQuery: axiosBaseQuery({ isAuthorizedApi: true }),
  tagTypes: ["Users"],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getUsers: builder.query<TausiUser[], number>({
      query: (limit) =>  ({
        url: `/users?limit=${limit}`,
        method: "GET",
      }),
      transformResponse: (response: UsersApiResponse[]) =>
        response.map((item) => item.users),
      providesTags: ["Users"],
    }),
  }),
});

export const { useGetUsersQuery } = usersApi;
