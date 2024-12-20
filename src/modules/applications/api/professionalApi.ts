import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import { ApiResponse, PortfolioApiResponse, Professional, ProfessionalApiResponse, ProfSearchApiResponse, VerifiedBeauticians, VerifiedBeauticiansResponse } from "@/models";
import { SearchCriteriaType } from "@/hooks/useSearch";

export const professionalApi = createApi({
  reducerPath: 'professionalApi',
  baseQuery: axiosBaseQuery({isAuthorizedApi: true}),
  tagTypes: ['Professionals', 'ProfessionalsDetails', 'VerifiedBeauticians', 'VerifiedBeauticiansDetails'],
  refetchOnMountOrArgChange:false,
  endpoints: (builder) => ({
    getProfessionals: builder.query<ApiResponse<Professional[]>, number>({
      query: (limit) => ({
        url: `/professionals?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ['Professionals'],
      keepUnusedDataFor: 0,
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

    updateProfessional: builder.mutation<ProfessionalApiResponse, Partial<Professional>>({
      query: (data) => ({
        url: `/professionals/${data.id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ['ProfessionalsDetails']
    }),

    getVerifiedBeauticians: builder.query<ApiResponse<VerifiedBeauticians[]>, number>({
      query: (limit) => ({
        url: `/dashboard/verifications?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ['VerifiedBeauticians'],
    }),

    useGetVerifiedBeauticianById: builder.query<VerifiedBeauticiansResponse, string>({
      query: (professionalId) => ({
        url: `/dashboard/verifications/${professionalId}`,
        method: "GET",
      }),
      providesTags: ['VerifiedBeauticiansDetails'],
    }),

    updateverifiedBeauticians: builder.mutation<VerifiedBeauticiansResponse, Partial<VerifiedBeauticians>>({
      query: (data) => ({
        url: `/dashboard/verifications/${data.id}`,
        method: "POST",
        data: data,
      }),
      invalidatesTags: ['VerifiedBeauticiansDetails'],
    }),
    searchProfessionals: builder.mutation<
      ProfSearchApiResponse,
      { searchCriteria: SearchCriteriaType[] }
    >({
      query: ({ searchCriteria }) => {
        return {
          url: `/professionals/search?limit=2000`,
          method: "POST",
          data: {
            searchCriteria,
          },
        };
      },
      invalidatesTags: ["Professionals"],
    }),
  }),
});

export const {
  useGetProfessionalsQuery,
  useGetProfessionalsByIdQuery,
  useGetProfessionalsPorfolioQuery,
  useGetVerifiedBeauticiansQuery,
  useUseGetVerifiedBeauticianByIdQuery,
  useUpdateverifiedBeauticiansMutation,
  useUpdateProfessionalMutation,
  useSearchProfessionalsMutation
} = professionalApi;