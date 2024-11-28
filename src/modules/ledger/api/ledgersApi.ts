import { ApiResponse, CreateUpdateLoanBook, Ledgers, LedgersApiResponse } from "@/models";
import { axiosBaseQuery } from "@/Utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";


export const ledgersApi = createApi({
  reducerPath:'ledgersApi',
  baseQuery: axiosBaseQuery({isAuthorizedApi: true}),
  tagTypes: ['Ledgers', 'LedgersDetails'],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getLedgers: builder.query<ApiResponse<Ledgers[]>, void>({
      query: () => ({
        url: "/ledgers",
        method:"GET",
      }),
      providesTags: ['Ledgers']
    }),
    getLedgersById: builder.query<LedgersApiResponse, string> ({
      query:(ledgersId) => ({
        url: `/ledgers/${ledgersId}`,
        method:"GET"
      }),
      providesTags: ['LedgersDetails']
    }),
    createLoanBook: builder.mutation<Ledgers, CreateUpdateLoanBook>({
      query: (data) => ({
        url: "/ledgers/books",
        method: "POST",
        data
      }),
      invalidatesTags: ["Ledgers"]
    }),
    updateLoanBook: builder.mutation<Ledgers, Partial<Ledgers>>({
      query:(data) => ({
        url: `/ledgers/books/{id}`,
        method: "PATCH",
        data
      }),
      invalidatesTags: ["Ledgers"]
    })
  }),
});

export const {useGetLedgersQuery, useGetLedgersByIdQuery, useCreateLoanBookMutation, useUpdateLoanBookMutation} = ledgersApi;