import {DashboardAnalyticsResponse  } from "@/models";
import { axiosBaseQuery } from "@/Utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";

// Define the allowed analysis pages
type AnalysisPage = 'orders' | 'dashboard';

export const dashboardApi = createApi({
  reducerPath: 'dashboardApi',
  baseQuery: axiosBaseQuery({ isAuthorizedApi: true }),
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<DashboardAnalyticsResponse, AnalysisPage>({
      query: (page) => ({
        url: `/analytics/${page}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery } = dashboardApi;
