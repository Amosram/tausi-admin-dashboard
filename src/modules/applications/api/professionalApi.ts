import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "../../../Utils/axios";
import { Professional } from "@/modules/orders/types";

export const professionalApi = createApi({
  reducerPath: 'professionalApi',
  baseQuery: axiosBaseQuery({isAuthorizedApi: true}),
  tagTypes: ['Professionals'],
  endpoints: (builder) => ({
    getProfessionals: builder.query<Professional[], void>({
      query: () => ({
        url: "/professionals",
        method: "GET",
      }),
      providesTags: ['Professionals'],
    })
  }),
});

export const {useGetProfessionalsQuery} = professionalApi;