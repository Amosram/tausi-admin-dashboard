import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import {
  ApiResponse,
  Appointment,
  AppointmentsApiResponse,
  OrdersSearchApiResponse,
} from "@/models";
import { SearchCriteriaType } from "@/hooks/useSearch";

export interface GetOrdersByBoothIdApiResponse {
  statusCode: string;
  message: string;
  code: number;
  data: Appointment[];
}

export interface GetTotalsApiResponse {
  statusCode: string;
  message: string;
  code: number;
  data: Array<{
    status: string;
    totalAppointments: number;
    totalAmount: number;
    [key: string]: any; // For any additional fields
  }>;
}

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: axiosBaseQuery({ isAuthorizedApi: true }),
  tagTypes: ["Orders", "OrderDetails"],
  refetchOnMountOrArgChange: true,
  keepUnusedDataFor: 0,
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponse<Appointment[]>, number>({
      query: (limit) => ({
        url: `/appointments?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
      keepUnusedDataFor: 0,
    }),
    getOrderById: builder.query<AppointmentsApiResponse, string>({
      query: (orderId) => ({
        url: `/appointments/${orderId}`,
        method: "GET",
      }),
      providesTags: ["OrderDetails"],
    }),
    getOrderByBoothId: builder.query<GetOrdersByBoothIdApiResponse, string>({
      query: (boothId) => ({
        url: `/appointments/booth/${boothId}`,
        method: "GET",
      }),
      providesTags: ["OrderDetails"],
    }),
    searchOrders: builder.mutation<
      OrdersSearchApiResponse,
      { searchCriteria: SearchCriteriaType[]; limit?: number }
    >({
      query: ({ searchCriteria, limit = 8000 }) => {
        // Ensure the limit is validated and defaulted
        const validatedLimit = limit > 0 ? limit : 8000;

        return {
          url: `/appointments/search?limit=${validatedLimit}`,
          method: "POST",
          data: {
            searchCriteria,
          },
        };
      },
      invalidatesTags: ["Orders"],
    }),
    getAppointmentTotals: builder.query<GetTotalsApiResponse, {
      beauticianId?: string;
      date?: string;
      startDate?: string;
      endDate?: string;
    }>({
      query: ({ beauticianId, date, startDate, endDate }) => {
        const params = new URLSearchParams();
        if (beauticianId) params.append("beauticianId", beauticianId);
        if (date) params.append("date", date);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);

        return {
          url: `/appointments/query/totals?${params.toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Orders"],
    }),
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useGetOrderByBoothIdQuery,
  useSearchOrdersMutation,
  useGetAppointmentTotalsQuery,
} = ordersApi;
