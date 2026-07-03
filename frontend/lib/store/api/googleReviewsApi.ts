import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../config';

export interface GoogleReview {
  id: number;
  author_name: string;
  profile_photo_url: string;
  rating: number;
  text: string;
  relative_time: string;
  display_order: number;
  is_active: boolean;
}

export interface CreateReviewRequest {
  author_name: string;
  rating: number;
  text?: string;
  profile_photo_url?: string;
  relative_time?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateReviewRequest {
  id: number;
  author_name?: string;
  rating?: number;
  text?: string;
  profile_photo_url?: string;
  relative_time?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface DeleteReviewRequest {
  id: number;
}

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${BASE_URL}/ecommerce/v1`,
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('admin_token');
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  });
  return rawBaseQuery(args, api, extraOptions);
};

export const googleReviewsApi = createApi({
  reducerPath: 'googleReviewsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Reviews'],
  endpoints: (builder) => ({
    getGoogleReviews: builder.query<GoogleReview[], void>({
      query: () => '/reviews',
      transformResponse: (response: any) => {
        if (response?.data?.reviews) return response.data.reviews;
        if (response?.reviews) return response.reviews;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: ['Reviews'],
    }),
    getAllReviews: builder.query<GoogleReview[], void>({
      query: () => '/admin/reviews',
      transformResponse: (response: any) => {
        if (response?.data?.reviews) return response.data.reviews;
        if (response?.reviews) return response.reviews;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: ['Reviews'],
    }),
    createReview: builder.mutation<GoogleReview, CreateReviewRequest>({
      query: (body) => ({ url: '/reviews', method: 'PUT', body }),
      transformResponse: (response: any) => response?.data?.review ?? response?.review ?? response,
      invalidatesTags: ['Reviews'],
    }),
    updateReview: builder.mutation<GoogleReview, UpdateReviewRequest>({
      query: ({ id, ...body }) => ({ url: `/reviews/${id}`, method: 'PUT', body }),
      transformResponse: (response: any) => response?.data?.review ?? response?.review ?? response,
      invalidatesTags: ['Reviews'],
    }),
    deleteReview: builder.mutation<{ success: boolean }, DeleteReviewRequest>({
      query: (body) => ({ url: '/delete_review', method: 'POST', body }),
      transformResponse: (response: any) => response?.data ?? response,
      invalidatesTags: ['Reviews'],
    }),
  }),
});

export const {
  useGetGoogleReviewsQuery,
  useGetAllReviewsQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
} = googleReviewsApi;
