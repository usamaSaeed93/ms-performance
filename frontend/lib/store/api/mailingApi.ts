import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../config';

export interface MailingSubscription {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MailingJob {
  id: number;
  subject: string;
  content: string;
  status: string;
  scheduled_at?: string | null;
  total_recipients: number;
  sent_count: number;
  failed_count: number;
  last_error?: string | null;
  started_at?: string | null;
  completed_at?: string | null;
  created_at: string;
}

export interface CreateMailingSubscriptionRequest {
  name: string;
  email: string;
}

export interface CreateMailingJobRequest {
  subject: string;
  content: string;
  scheduled_at?: string | null;
  attachments?: MailingAttachmentUpload[];
}

export interface MailingAttachmentUpload {
  url: string;
  object_name: string;
  filename: string;
  content_type: string;
  size: number;
}

export interface MailingAttachmentUploadResponse extends MailingAttachmentUpload {}

const baseQuery = fetchBaseQuery({
  baseUrl: `${BASE_URL}/ecommerce/v1`,
  prepareHeaders: (headers) => {
    const adminToken = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null;
    if (adminToken) {
      headers.set('authorization', `Bearer ${adminToken}`);
    }
    return headers;
  },
});

const baseQueryWithAuth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  const result = await baseQuery(args, api, extraOptions);
  return result;
};

export const mailingApi = createApi({
  reducerPath: 'mailingApi',
  baseQuery: baseQueryWithAuth,
  tagTypes: ['MailingSubscribers', 'MailingJobs'],
  endpoints: (builder) => ({
    createMailingSubscription: builder.mutation<MailingSubscription, CreateMailingSubscriptionRequest>({
      query: (body) => ({
        url: '/mailing-subscriptions',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: MailingSubscription }) => response.data,
      invalidatesTags: ['MailingSubscribers'],
    }),
    getMailingSubscriptions: builder.query<MailingSubscription[], void>({
      query: () => '/mailing-subscriptions',
      transformResponse: (response: { data: MailingSubscription[] }) => response.data,
      providesTags: ['MailingSubscribers'],
    }),
    createMailingJob: builder.mutation<MailingJob, CreateMailingJobRequest>({
      query: (body) => ({
        url: '/mailing-jobs',
        method: 'POST',
        body,
      }),
      transformResponse: (response: { data: MailingJob }) => response.data,
      invalidatesTags: ['MailingJobs'],
    }),
    uploadMailingAttachment: builder.mutation<MailingAttachmentUploadResponse, File>({
      query: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return {
          url: '/mailing-attachments',
          method: 'POST',
          body: formData,
        };
      },
      transformResponse: (response: { data: MailingAttachmentUploadResponse }) => response.data,
    }),
    getMailingJobs: builder.query<MailingJob[], void>({
      query: () => '/mailing-jobs',
      transformResponse: (response: { data: MailingJob[] }) => response.data,
      providesTags: ['MailingJobs'],
    }),
  }),
});

export const {
  useCreateMailingSubscriptionMutation,
  useGetMailingSubscriptionsQuery,
  useCreateMailingJobMutation,
  useGetMailingJobsQuery,
  useUploadMailingAttachmentMutation,
} = mailingApi;
