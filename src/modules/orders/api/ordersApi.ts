import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import { ApiResponse, Appointment, AppointmentsApiResponse } from "@/models";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: axiosBaseQuery({ isAuthorizedApi: true }),
  tagTypes: ["Orders", "OrderDetails"],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponse<Appointment[]>, number>({
      query: (limit) => ({
        url: `/appointments?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
    }),
    getOrderById: builder.query<AppointmentsApiResponse, string>({
      query: (orderId) => ({
        url: `/appointments/${orderId}`,
        method: "GET",
      }),
      providesTags: ["OrderDetails"],
    }),
  }),
});

export const { useGetOrdersQuery, useGetOrderByIdQuery } = ordersApi;
