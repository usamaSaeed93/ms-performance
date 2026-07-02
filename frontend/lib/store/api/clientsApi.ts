import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../config';

export interface Client {
  id: number;
  name: string;
  details: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
}

export interface CreateClientRequest {
  name: string;
  details?: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface UpdateClientRequest {
  id: number;
  name?: string;
  details?: string;
  image_url?: string;
  display_order?: number;
  is_active?: boolean;
}

export interface DeleteClientRequest {
  client_id: number;
}

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/ecommerce/v1`,
  prepareHeaders: (headers) => {
    const adminToken = localStorage.getItem('admin_token');
    const customerToken = localStorage.getItem('token');
    const token = adminToken || customerToken;
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);
  if (result.error) {
    if (result.error.status === 401 || result.error.status === 403) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        if (window.location.pathname.startsWith('/admin')) {
          window.location.href = '/admin/login';
        }
      }
    }
  }
  return result;
};

export const clientsApi = createApi({
  reducerPath: 'clientsApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['Clients'],
  endpoints: (builder) => ({
    getClients: builder.query<Client[], void>({
      query: () => '/clients',
      transformResponse: (response: any) => {
        if (response?.data?.clients) return response.data.clients;
        if (response?.clients) return response.clients;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: ['Clients'],
    }),
    getAllClients: builder.query<Client[], void>({
      query: () => '/admin/clients',
      transformResponse: (response: any) => {
        if (response?.data?.clients) return response.data.clients;
        if (response?.clients) return response.clients;
        if (Array.isArray(response)) return response;
        return [];
      },
      providesTags: ['Clients'],
    }),
    createClient: builder.mutation<Client, CreateClientRequest>({
      query: (body) => ({
        url: '/clients',
        method: 'PUT',
        body,
      }),
      transformResponse: (response: any) => {
        if (response?.data?.client) return response.data.client;
        if (response?.client) return response.client;
        return response;
      },
      invalidatesTags: ['Clients'],
    }),
    updateClient: builder.mutation<Client, UpdateClientRequest>({
      query: ({ id, ...body }) => ({
        url: `/clients/${id}`,
        method: 'PUT',
        body,
      }),
      transformResponse: (response: any) => {
        if (response?.data?.client) return response.data.client;
        if (response?.client) return response.client;
        return response;
      },
      invalidatesTags: ['Clients'],
    }),
    deleteClient: builder.mutation<{ success: boolean }, DeleteClientRequest>({
      query: (body) => ({
        url: '/delete_client',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Clients'],
    }),
  }),
});

export const {
  useGetClientsQuery,
  useGetAllClientsQuery,
  useCreateClientMutation,
  useUpdateClientMutation,
  useDeleteClientMutation,
} = clientsApi;
