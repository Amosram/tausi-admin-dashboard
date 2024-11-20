import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ApiResponse, Appointment, OrdersTableData } from "@/modules/orders/types";
import { transformToTableData } from "@/modules/orders/utils/transform-orders-data";

export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
  }),
  tagTypes: ["Orders", "OrderDetails"],
  endpoints: (builder) => ({
    fetchOrders: builder.query<OrdersTableData[], number>({
      query: (limit) => `appointments?limit=${limit}`,
      transformResponse: (response: { data: Appointment[] }) =>
        transformToTableData(response.data),
      providesTags: ["Orders"],
    }),
    fetchOrderDetails: builder.query<Appointment, string>({
      query: (orderId) => `appointments/${orderId}`,
      transformResponse: (response: ApiResponse) => {
        return response.data;
      },
      providesTags: (result, error, orderId) => [{ type: "OrderDetails", id: orderId }],
    }),
    
  }),
});

export const { useFetchOrdersQuery, useFetchOrderDetailsQuery } = ordersApi;
