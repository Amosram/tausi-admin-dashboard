import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import { Booth, BoothsApiResponse, CreateBoothPayload } from "@/models";

export const boothsApi = createApi({
  reducerPath: "boothsApi",
  baseQuery: axiosBaseQuery({ isAuthorizedApi: true }),
  tagTypes: ["Booths"],
  refetchOnMountOrArgChange: false,
  endpoints: (builder) => ({
    getBooths: builder.query<BoothsApiResponse<Booth[]>, void>({
      query: () => ({
        url: `/booths`,
        method: "GET",
      }),
      providesTags: ["Booths"],
      keepUnusedDataFor: 60,
    }),
    createBooth: builder.mutation<BoothsApiResponse<Booth>, CreateBoothPayload>({
      query: (newBooth) => ({
        url: `/booths`,
        method: "POST",
        data: newBooth,
      }),
      invalidatesTags: ["Booths"],
    }),
  }),
});

export const { useGetBoothsQuery, useCreateBoothMutation } = boothsApi;
