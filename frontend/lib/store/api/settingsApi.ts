import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { BASE_URL } from '../../config';

export interface Setting {
    key: string;
    value: string;
    description: string;
    type: string;
}

export interface UpdateSettingRequest {
    key: string;
    value: string;
    description?: string;
    type?: string;
}

const baseQuery = fetchBaseQuery({
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
});

const baseQueryWithAuth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

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

export const settingsApi = createApi({
    reducerPath: 'settingsApi',
    baseQuery: baseQueryWithAuth,
    tagTypes: ['Settings'],
    endpoints: (builder) => ({
        getSettings: builder.query<Setting[], void>({
            query: () => '/settings',
            transformResponse: (response: any) => {
                // Backend returns: { status_code, success, message, data: { settings: [...] } }
                if (response?.data?.settings) {
                    return response.data.settings;
                }
                if (response?.settings) {
                    return response.settings;
                }
                if (Array.isArray(response)) {
                    return response;
                }
                return [];
            },
            providesTags: ['Settings'],
        }),
        getSetting: builder.query<Setting, string>({
            query: (key) => `/settings/${key}`,
            providesTags: (result, error, key) => [{ type: 'Settings', id: key }],
        }),
        updateSetting: builder.mutation<Setting, UpdateSettingRequest>({
            query: ({ key, ...body }) => ({
                url: `/settings/${key}`,
                method: 'PUT',
                body,
            }),
            invalidatesTags: ['Settings'],
        }),
    }),
});

export const {
    useGetSettingsQuery,
    useGetSettingQuery,
    useUpdateSettingMutation
} = settingsApi;
