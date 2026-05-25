import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  email_confirmed?: boolean;
  email?: string;
}

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

export interface SignupResponse {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  email_confirmed: boolean;
}

export interface ConfirmEmailRequest {
  token: string;
}

export interface ConfirmEmailResponse {
  email_confirmed: boolean;
  message: string;
}

export interface ResendConfirmationRequest {
  email: string;
}

export interface ResendConfirmationResponse {
  message: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface ResetPasswordResponse {
  message: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${API_BASE_URL}/ecommerce/v1/`,
    prepareHeaders: (headers, { getState }) => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('customer_token') : null;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login_user',
        method: 'POST',
        body: credentials,
      }),
      transformResponse: (response: any) => {
        if (response?.data?.access_token) {
          return { 
            access_token: response.data.access_token,
            email_confirmed: response.data.email_confirmed,
            email: response.data.email
          };
        }
        if (response?.access_token) {
          return { 
            access_token: response.access_token,
            email_confirmed: response.email_confirmed,
            email: response.email
          };
        }
        return response;
      },
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (typeof window !== 'undefined' && data?.access_token) {
            localStorage.setItem('customer_token', data.access_token);
          }
        } catch (error) {
          // Handle error
        }
      },
    }),
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (userData) => ({
        url: 'signup',
        method: 'POST',
        body: userData,
      }),
      transformResponse: (response: any) => {
        if (response?.data) {
          return response.data;
        }
        return response;
      },
    }),
    confirmEmail: builder.mutation<ConfirmEmailResponse, ConfirmEmailRequest>({
      query: ({ token }) => ({
        url: `confirm_email?token=${token}`,
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        if (response?.data) {
          return response.data;
        }
        return response;
      },
    }),
    resendConfirmation: builder.mutation<ResendConfirmationResponse, ResendConfirmationRequest>({
      query: (data) => ({
        url: 'resend_confirmation_email',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => {
        if (response?.data) {
          return response.data;
        }
        return response;
      },
    }),
    forgotPassword: builder.mutation<ForgotPasswordResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: 'forgot_password',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => {
        if (response?.data) {
          return response.data;
        }
        return response;
      },
    }),
    resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: 'reset_password',
        method: 'POST',
        body: data,
      }),
      transformResponse: (response: any) => {
        if (response?.data) {
          return response.data;
        }
        return response;
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useConfirmEmailMutation,
  useResendConfirmationMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;

