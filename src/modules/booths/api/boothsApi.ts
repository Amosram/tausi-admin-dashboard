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
    getBoothById: builder.query<BoothsApiResponse<Booth>, string>({
      query: (boothId) => ({
        url: `/booths/${boothId}`,
        method: "GET",
      }),
      providesTags: (result, error, boothId) =>
        result ? [{ type: "Booths", id: boothId }] : [],
    }),
    createBooth: builder.mutation<BoothsApiResponse<Booth>, CreateBoothPayload>(
      {
        query: (newBooth) => ({
          url: `/booths`,
          method: "POST",
          data: newBooth,
        }),
        invalidatesTags: ["Booths"],
      }
    ),
    updateBooth: builder.mutation<BoothsApiResponse<Booth>, { id: string; data: Partial<Booth> }>({
      query: ({ id, data }) => ({
        url: `/booths/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (result, error, { id }) =>
        result ? [{ type: "Booths", id }] : [],
    }),
    deleteBooth: builder.mutation<void, { id: string; deletedReason?: string }>(
      {
        query: ({ id, deletedReason }) => ({
          url: `/booths/${id}`,
          method: "DELETE",
          data: { deletedReason },
        }),
        invalidatesTags: ["Booths"],
      }
    ),
  }),
});

export const {
  useGetBoothsQuery,
  useCreateBoothMutation,
  useDeleteBoothMutation,
  useUpdateBoothMutation,
  useGetBoothByIdQuery
} = boothsApi;
