import { axiosBaseQuery } from "@/Utils/axios";
import { createApi } from "@reduxjs/toolkit/query/react";
import { ServiceCategory, Services } from '../../../models/user';
import { ApiResponse } from "@/models";

export const serviceCategoryApi = createApi({
  reducerPath: "serviceCategoryApi",
  baseQuery: axiosBaseQuery({ isAuthorizedApi: true }),
  tagTypes: ["ServiceCategory", "Services"],
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

    getAllServices: builder.query<ApiResponse<Services []>, void>({
      query: () => ({
        url: "/services",
        method: "GET",
      }),
      providesTags: ["Services"],
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
        data: serviceCategory,
      }),
      invalidatesTags: ["ServiceCategory"],
    }),

    createService: builder.mutation({
      query: (service) => ({
        url: "/services",
        method: "POST",
        data: service,
      }),
      invalidatesTags: ["Services"],
    }),

    updateService: builder.mutation({
      query: (service) => ({
        url: `/services/${service.id}`,
        method: "PATCH",
        data: service,
      }),
      invalidatesTags: ["Services"],
    }),

    updateServiceCategory: builder.mutation({
      query: (serviceCategory) => ({
        url: `/service-categories/${serviceCategory.id}`,
        method: "PATCH",
        data: serviceCategory,
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
  useGetAllServicesQuery,
  useCreateServiceMutation,
  useGetServiceCategoryByIdQuery,
  useCreateServiceCategoryMutation,
  useUpdateServiceMutation,
  useUpdateServiceCategoryMutation,
  useDeleteServiceCategoryMutation,
} = serviceCategoryApi;