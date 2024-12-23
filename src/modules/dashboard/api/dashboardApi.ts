import {DashboardAnalyticsResponse, TopRatedBeauticianResponse  } from "@/models";
import { axiosBaseQuery } from "@/Utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";

// Define the allowed analysis pages
type AnalysisPage = 'orders' | 'dashboard' | 'users' | 'revenue';

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
    getTopRatedBeauticians: builder.query<TopRatedBeauticianResponse, number>({
      query:(limit) => ({
        url: `/professionals/top-rated?limit=${limit}`,
        method: "GET",
      }),
    }),
  }),
});

export const { useGetDashboardAnalyticsQuery, useGetTopRatedBeauticiansQuery } = dashboardApi;
