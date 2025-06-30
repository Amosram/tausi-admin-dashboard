import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import { ApiResponse, BeauticianNearMeResponse, PortfolioApiResponse, Professional, ProfessionalApiResponse, ProfSearchApiResponse, VerifiedBeauticians, VerifiedBeauticiansResponse } from "@/models";
import { SearchCriteriaType } from "@/hooks/useSearch";

export const professionalApi = createApi({
  reducerPath: 'professionalApi',
  baseQuery: axiosBaseQuery({isAuthorizedApi: true}),
  tagTypes: ['Professionals', 'ProfessionalsDetails', 'VerifiedBeauticians', 'VerifiedBeauticiansDetails'],
  refetchOnMountOrArgChange:true,
  endpoints: (builder) => ({
    getProfessionals: builder.query<ApiResponse<Professional[]>, number>({
      query: (limit) => ({
        url: `/professionals?limit=20000`,
        method: "GET",
      }),
      providesTags: ['Professionals'],
      keepUnusedDataFor: 0,
    }),

    getBeauticianNearby: builder.query<BeauticianNearMeResponse, { latitude: string; longitude: string; limit: number }>({
      query: ({ latitude, longitude, limit }) => ({
        url: `/professionals?latitude=${latitude}&longitude=${longitude}&limit=${limit}`,
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
      providesTags: ['ProfessionalsDetails'],
      keepUnusedDataFor: 0,
    }),

    getProfessionalsPorfolio: builder.query<PortfolioApiResponse, string> ({
      query: (professionalId) => ({
        url: `/professionals/${professionalId}/portfolio`,
        method: "GET",
      }),
      providesTags: ['ProfessionalsDetails'],
      keepUnusedDataFor: 0,
    }),

    updateProfessional: builder.mutation<ProfessionalApiResponse, Partial<Professional>>({
      query: (data) => ({
        url: `/professionals/${data.id}`,
        method: "PATCH",
        data: data,
      }),
      invalidatesTags: ['ProfessionalsDetails'],
    }),

    getVerifiedBeauticians: builder.query<ApiResponse<VerifiedBeauticians[]>, number>({
      query: (limit) => ({
        url: `/dashboard/verifications?limit=${limit}`,
        method: "GET",
      }),
      providesTags: ['VerifiedBeauticians'],
      keepUnusedDataFor: 0,
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
          url: `/professionals/search?limit=20000`,
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
  useGetBeauticianNearbyQuery,
  useGetProfessionalsByIdQuery,
  useGetProfessionalsPorfolioQuery,
  useGetVerifiedBeauticiansQuery,
  useUseGetVerifiedBeauticianByIdQuery,
  useUpdateverifiedBeauticiansMutation,
  useUpdateProfessionalMutation,
  useSearchProfessionalsMutation
} = professionalApi;