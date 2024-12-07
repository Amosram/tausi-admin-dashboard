import { ApiResponse, BookCategories, BookDetails, BookEntries, Books, CreateUpdateBookEntry, CreateUpdateLoanBook, LedgerDetails, LedgerDetailsApiResponse, Ledgers, LedgersApiResponse, PaymentModes } from "@/models";
import { axiosBaseQuery } from "@/Utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";
import { create } from "domain";


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

    getLedgersById: builder.query<LedgerDetailsApiResponse, string> ({
      query:(ownerId) => ({
        url: `/ledgers/${ownerId}`,
        method:"GET"
      }),
      providesTags: ['LedgersDetails']
    }),

    deleteLedger: builder.mutation<void, string>({
      query: (ownerId) => ({
        url: `/ledgers/${ownerId}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Ledgers']
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

    getAllBookEntries: builder.query<ApiResponse<BookEntries[]>, void>({
      query: () => ({
        url: "/books/records/all",
        method: "GET"
      }),
      providesTags: ['Books']
    }),

    createBookEntry: builder.mutation<BookEntries, CreateUpdateBookEntry>({
      query: (data) => ({
        url: "/books/records",
        method: "POST",
        data
      }),
      invalidatesTags: ['Books']
    }),

    deleteBookEntry: builder.mutation<void, string>({
      query: (id) => ({
        url: `/books/records/${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Books']
    }),

    getAllCategories: builder.query<ApiResponse<BookCategories[]>, void>({
      query: () => ({
        url: "/books/categories",
        method: "GET"
      }),
      providesTags: ['Books']
    }),

    getAllCategoriesById: builder.query<BookCategories, string>({
      query: (id) => ({
        url: `/books/categories/${id}`,
        method: "GET"
      }),
      providesTags: ['Books']
    }),

    getAllPaymentModes: builder.query<ApiResponse<PaymentModes[]>, void> ({
      query: () => ({
        url: "/books/payment-mode/all",
        method: "GET"
      }),
      providesTags: ['Books']
    }),

    getAllPaymentModesById: builder.query<PaymentModes, string>({
      query: (id) => ({
        url: `/books/payment-mode/${id}`,
        method: "GET"
      }),
      providesTags: ['Books']
    }),
  }),
});

export const {
  useGetLedgersQuery,
  useGetLedgersByIdQuery,
  useCreateLoanBookMutation,
  useUpdateLoanBookMutation,
  useGetBooksQuery,
  useGetBooksByIdQuery,
  useDeleteLoanBookMutation,
  useGetAllBookEntriesQuery,
  useGetAllCategoriesQuery,
  useGetAllPaymentModesQuery,
  useCreateBookEntryMutation,
  useDeleteLedgerMutation,
  useDeleteBookEntryMutation
} = ledgersApi;