import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import { ApiResponse, Professional } from "@/models";

export const professionalApi = createApi({
  reducerPath: 'professionalApi',
  baseQuery: axiosBaseQuery({isAuthorizedApi: true}),
  tagTypes: ['Professionals'],
  refetchOnMountOrArgChange:true,
  endpoints: (builder) => ({
    getProfessionals: builder.query<ApiResponse<Professional[]>, void>({
      query: () => ({
        url: "/professionals",
        method: "GET",
      }),
      providesTags: ['Professionals'],
    })
  }),
});

export const {useGetProfessionalsQuery} = professionalApi;