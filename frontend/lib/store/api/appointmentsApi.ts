import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

// Types
export interface ShopHours {
    id: number;
    day_of_week: number;
    is_open: boolean;
    open_time: string | null;
    close_time: string | null;
    slot_duration_minutes: number;
}

export interface TimeSlot {
    time: string;
    available: boolean;
}

export interface AvailableSlotsResponse {
    date: string;
    slots: TimeSlot[];
    is_open: boolean;
}

export interface Appointment {
    id: number;
    appointment_date: string;
    appointment_time: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_registration?: string;
    service_type: string;
    notes?: string;
    status: string;
    created_at: string;
}

export interface AppointmentCreate {
    appointment_date: string;
    appointment_time: string;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    vehicle_make?: string;
    vehicle_model?: string;
    vehicle_registration?: string;
    service_type: string;
    notes?: string;
}

export interface AppointmentsResponse {
    appointments: Appointment[];
    total: number;
    page: number;
    per_page: number;
    total_pages: number;
}

// Base query setup
const baseQuery = fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/ecommerce/v1`,
    prepareHeaders: (headers) => {
        if (typeof window !== 'undefined') {
            // Check for admin token first (for admin dashboard operations)
            // Then fall back to customer token (for customer booking)
            const adminToken = localStorage.getItem('admin_token');
            const customerToken = localStorage.getItem('customer_token');
            const token = adminToken || customerToken;
            if (token) {
                headers.set('Authorization', `Bearer ${token}`);
            }
        }
        return headers;
    },
});

const baseQueryWithErrorHandling: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    const result = await baseQuery(args, api, extraOptions);
    return result;
};

// API Definition
export const appointmentsApi = createApi({
    reducerPath: 'appointmentsApi',
    baseQuery: baseQueryWithErrorHandling,
    tagTypes: ['ShopHours', 'Appointments', 'AvailableSlots'],
    endpoints: (builder) => ({
        // Get shop hours
        getShopHours: builder.query<{ hours: ShopHours[] }, void>({
            query: () => '/shop-hours',
            transformResponse: (response: { data: { hours: ShopHours[] } }) => response.data,
            providesTags: ['ShopHours'],
        }),

        // Update shop hours
        updateShopHours: builder.mutation<{ hours: ShopHours[] }, { hours: Partial<ShopHours>[] }>({
            query: (body) => ({
                url: '/shop-hours',
                method: 'PUT',
                body,
            }),
            transformResponse: (response: { data: { hours: ShopHours[] } }) => response.data,
            invalidatesTags: ['ShopHours', 'AvailableSlots'],
        }),

        // Get available slots for a date
        getAvailableSlots: builder.query<AvailableSlotsResponse, { date: string }>({
            query: ({ date }) => `/available-slots?date=${date}`,
            transformResponse: (response: { data: AvailableSlotsResponse }) => response.data,
            providesTags: (result, error, { date }) => [{ type: 'AvailableSlots', id: date }],
        }),

        // Create appointment
        createAppointment: builder.mutation<{ appointment: Appointment }, AppointmentCreate>({
            query: (body) => ({
                url: '/appointments',
                method: 'POST',
                body,
            }),
            transformResponse: (response: { data: { appointment: Appointment } }) => response.data,
            invalidatesTags: ['Appointments', 'AvailableSlots'],
        }),

        // Get all appointments (admin)
        getAppointments: builder.query<AppointmentsResponse, {
            page?: number;
            per_page?: number;
            status?: string;
            from_date?: string;
            to_date?: string;
        }>({
            query: (params) => {
                const searchParams = new URLSearchParams();
                if (params.page) searchParams.append('page', params.page.toString());
                if (params.per_page) searchParams.append('per_page', params.per_page.toString());
                if (params.status) searchParams.append('status', params.status);
                if (params.from_date) searchParams.append('from_date', params.from_date);
                if (params.to_date) searchParams.append('to_date', params.to_date);
                return `/appointments?${searchParams.toString()}`;
            },
            transformResponse: (response: { data: AppointmentsResponse }) => response.data,
            providesTags: ['Appointments'],
        }),

        // Cancel appointment
        cancelAppointment: builder.mutation<{ message: string }, number>({
            query: (appointmentId) => ({
                url: `/appointments/${appointmentId}`,
                method: 'DELETE',
            }),
            transformResponse: (response: { data: { message: string } }) => response.data,
            invalidatesTags: ['Appointments', 'AvailableSlots'],
        }),

        // Update appointment status
        updateAppointmentStatus: builder.mutation<{ appointment: Appointment }, { id: number; status: string }>({
            query: ({ id, status }) => ({
                url: `/appointments/${id}/status`,
                method: 'PUT',
                body: { status },
            }),
            transformResponse: (response: { data: { appointment: Appointment } }) => response.data,
            invalidatesTags: ['Appointments'],
        }),
    }),
});

export const {
    useGetShopHoursQuery,
    useUpdateShopHoursMutation,
    useGetAvailableSlotsQuery,
    useCreateAppointmentMutation,
    useGetAppointmentsQuery,
    useCancelAppointmentMutation,
    useUpdateAppointmentStatusMutation,
} = appointmentsApi;
