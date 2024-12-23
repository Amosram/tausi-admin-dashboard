import { axiosBaseQuery } from "@/Utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ServiceCategory } from '../../../models/user';
import { ApiResponse } from "@/models";

export const serviceCategoryApi = createApi({
  reducerPath: "serviceCategoryApi",
  baseQuery: axiosBaseQuery({ isAuthorizedApi: true }),
  tagTypes: ["ServiceCategory"],
  refetchOnMountOrArgChange: false,
  endpoints: (builder) => ({
    getServiceCategories: builder.query<ApiResponse<ServiceCategory []>, void>({
      query: () => ({
        url: "/service-categories",
        method: "GET",
      }),
      providesTags: ["ServiceCategory"],
      keepUnusedDataFor: 60,
    }),
    getServiceCategoryById: builder.query({
      query: (serviceCategoryId: string) => ({
        url: `/service-categories/${serviceCategoryId}`,
        method: "GET",
      }),
      providesTags: ["ServiceCategory"],
    }),
    createServiceCategory: builder.mutation({
      query: (serviceCategory) => ({
        url: "/service-categories",
        method: "POST",
        body: serviceCategory,
      }),
      invalidatesTags: ["ServiceCategory"],
    }),
    updateServiceCategory: builder.mutation({
      query: (serviceCategory) => ({
        url: `/service-categories/${serviceCategory.id}`,
        method: "PATCH",
        body: serviceCategory,
      }),
      invalidatesTags: ["ServiceCategory"],
    }),
    deleteServiceCategory: builder.mutation({
      query: (serviceCategoryId: string) => ({
        url: `/service-categories/${serviceCategoryId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["ServiceCategory"],
    }),
  }),
});

export const {
  useGetServiceCategoriesQuery,
  useGetServiceCategoryByIdQuery,
  useCreateServiceCategoryMutation,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
} = serviceCategoryApi;