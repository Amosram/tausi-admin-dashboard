import { ApiResponse, Books } from "@/models";
import { axiosBaseQuery } from "@/Utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";


export const ledgersApi = createApi({
  reducerPath:'ledgersApi',
  baseQuery: axiosBaseQuery({isAuthorizedApi: true}),
  tagTypes: ['ledgers'],
  refetchOnMountOrArgChange: true,
  endpoints: (builder) => ({
    getBooks: builder.query<ApiResponse<Books[]>, void>({
      query: () => ({
        url: "/ledgers",
        method:"GET",
      }),
      providesTags: ['ledgers']
    })
  }),
});

export const {useGetBooksQuery} = ledgersApi;