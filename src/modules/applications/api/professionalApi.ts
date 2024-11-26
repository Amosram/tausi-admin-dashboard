import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import { ApiResponse, PortfolioApiResponse, Professional, ProfessionalApiResponse } from "@/models";

export const professionalApi = createApi({
  reducerPath: 'professionalApi',
  baseQuery: axiosBaseQuery({isAuthorizedApi: true}),
  tagTypes: ['Professionals', 'ProfessionalsDetails'],
  refetchOnMountOrArgChange:true,
  endpoints: (builder) => ({
    getProfessionals: builder.query<ApiResponse<Professional[]>, number>({
      query: (limit) => ({
        url: `/professionals?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ['Professionals'],
    }),
    getProfessionalsById: builder.query<ProfessionalApiResponse, string> ({
      query: (professionalId) => ({
        url: `/professionals/${professionalId}`,
        method: "GET",
      }),
      providesTags: ['ProfessionalsDetails']
    }),
    getProfessionalsPorfolio: builder.query<PortfolioApiResponse, string> ({
      query: (professionalId) => ({
        url: `/professionals/${professionalId}/portfolio`,
        method: "GET",
      }),
      providesTags: ['ProfessionalsDetails']
    }),
  }),
});

export const {useGetProfessionalsQuery, useGetProfessionalsByIdQuery, useGetProfessionalsPorfolioQuery} = professionalApi;