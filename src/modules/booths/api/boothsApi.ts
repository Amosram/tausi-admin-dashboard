import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import {
  Booth,
  BoothAssignmentResponse,
  BoothsApiResponse,
  CreateBoothAssignmentRequest,
  CreateBoothPayload,
} from "@/models";
import { BoothAssignmentResponseNew, BoothAvailabilityResponseNew } from "../types";

export const boothsApi = createApi({
  reducerPath: "boothsApi",
  baseQuery: axiosBaseQuery({ isAuthorizedApi: true }),
  tagTypes: ["Booths", "BoothDetails", "BoothAssignments"],
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getBooths: builder.query<BoothsApiResponse<Booth[]>, void>({
      query: () => ({
        url: `/booths/admin/dashboard`,
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
      providesTags: ["BoothDetails"],
      keepUnusedDataFor: 0,
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
    updateBooth: builder.mutation<
      BoothsApiResponse<Booth>,
      { id: string; data: Partial<Booth> }
    >({
      query: ({ id, data }) => ({
        url: `/booths/${id}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: ["Booths", "BoothDetails"],
    }),
    assignBooth: builder.mutation<
      BoothAssignmentResponse,
      CreateBoothAssignmentRequest
    >({
      query: (assignmentRequest) => ({
        url: `/booth-assignments`,
        method: "POST",
        data: assignmentRequest,
      }),
      invalidatesTags: ["BoothDetails", "BoothAssignments"],
    }),
    getAssignment: builder.query<BoothAssignmentResponseNew, string>({
      query: (assignmentId) => ({
        url: `/booth-assignments/${assignmentId}`,
        method: "GET",
      }),
      providesTags: ["BoothAssignments"],
      keepUnusedDataFor: 0,
    }),
    getBoothAssignments: builder.query<BoothAssignmentResponse, string>({
      query: (boothId) => ({
        url: `/booth-assignments/booth/${boothId}`,
        method: "GET",
      }),
      providesTags: ["BoothAssignments"],
      keepUnusedDataFor: 0,
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
    deleteBoothAssignment: builder.mutation<
      void,
      { id: string; deletedReason?: string }
    >({
      query: ({ id, deletedReason }) => ({
        url: `/booth-assignments/${id}`,
        method: "DELETE",
        data: { deletedReason },
      }),
      invalidatesTags: ["BoothAssignments", "BoothDetails", "BoothAssignments"],
    }),
    getBoothAvailability: builder.query<
      BoothAvailabilityResponseNew,
      { boothId: string; startTime: string; endTime: string }
    >({
      query: ({ boothId, startTime, endTime }) => ({
        url: `/booths/availability/${boothId}`,
        method: "GET",
        params: {
          startTime,
          endTime,
        },
      }),
      providesTags: ["BoothDetails"],
    }),
  }),
});

export const {
  useGetBoothsQuery,
  useCreateBoothMutation,
  useDeleteBoothMutation,
  useUpdateBoothMutation,
  useGetBoothByIdQuery,
  useAssignBoothMutation,
  useGetBoothAssignmentsQuery,
  useDeleteBoothAssignmentMutation,
  useGetBoothAvailabilityQuery,
  useGetAssignmentQuery
} = boothsApi;
