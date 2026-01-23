import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../config';

export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  link: string;
  image_url: string;
  display_order: number;
}

export interface UpdateServiceRequest {
  id: number;
  image_url?: string;
  link?: string;
  description?: string;
}

export const servicesApi = createApi({
  reducerPath: 'servicesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${BASE_URL}/ecommerce/v1`,
    prepareHeaders: (headers) => {
      // Try admin_token first (for admin dashboard), then token (for customer)
      const adminToken = localStorage.getItem('admin_token');
      const customerToken = localStorage.getItem('token');
      const token = adminToken || customerToken;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Services'],
  endpoints: (builder) => ({
    getServices: builder.query<Service[], void>({
      query: () => '/services',
      transformResponse: (response: any) => {
        // Backend returns: { status_code, success, message, data: { services: [...] } }
        if (response?.data?.services) {
          return response.data.services;
        }
        if (response?.services) {
          return response.services;
        }
        if (Array.isArray(response)) {
          return response;
        }
        return [];
      },
      providesTags: ['Services'],
    }),
    updateService: builder.mutation<Service, UpdateServiceRequest>({
      query: ({ id, ...body }) => ({
        url: `/services/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Services'],
    }),
  }),
});

export const { useGetServicesQuery, useUpdateServiceMutation } = servicesApi;
