import { ApiResponse, BookDetails, Books, BooksApiResponse, CreateUpdateLoanBook, Ledgers, LedgersApiResponse } from "@/models";
import { axiosBaseQuery } from "@/Utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";


export const ledgersApi = createApi({
  reducerPath:'ledgersApi',
  baseQuery: axiosBaseQuery({isAuthorizedApi: true}),
  tagTypes: ['Ledgers', 'Books', 'LedgersDetails'],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getLedgers: builder.query<ApiResponse<Ledgers[]>, void>({
      query: () => ({
        url: "/ledgers",
        method:"GET",
      }),
      providesTags: ['Ledgers']
    }),
    getBooks: builder.query<ApiResponse<Books[]>, void>({
      query: () => ({
        url: "/ledgers/books/all",
        method: "GET"
      }),
      providesTags: ['Books']
    }),
    getBooksById: builder.query<BookDetails, string>({
      query: (bookId) => ({
        url: `/ledgers/books/${bookId}`,
        method: "GET"
      }),
      providesTags: ['Books']
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
    }),
    deleteLoanBook: builder.mutation<void, string>({
      query: (id) => ({
        url: `/ledgers/books/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ["Books"]
    }),
  }),
});

export const {useGetLedgersQuery, useGetLedgersByIdQuery, useCreateLoanBookMutation, useUpdateLoanBookMutation, useGetBooksQuery, useGetBooksByIdQuery, useDeleteLoanBookMutation} = ledgersApi;