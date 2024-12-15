import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import {
  ApiResponse,
  Appointment,
  AppointmentsApiResponse,
  OrdersSearchApiResponse,
} from "@/models";
import { SearchCriteriaType } from "@/hooks/useSearch";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: axiosBaseQuery({ isAuthorizedApi: true }),
  tagTypes: ["Orders", "OrderDetails"],
  refetchOnMountOrArgChange: false,
  endpoints: (builder) => ({
    getOrders: builder.query<ApiResponse<Appointment[]>, number>({
      query: (limit) => ({
        url: `/appointments?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ["Orders"],
      keepUnusedDataFor: 60,
    }),
    getOrderById: builder.query<AppointmentsApiResponse, string>({
      query: (orderId) => ({
        url: `/appointments/${orderId}`,
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
  }),
});

export const {
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useSearchOrdersMutation,
} = ordersApi;
