"use client";

import { useState } from "react";
import {
    useGetAppointmentsQuery,
    useCancelAppointmentMutation,
    useUpdateAppointmentStatusMutation,
    Appointment
} from "@/lib/store/api/appointmentsApi";
import { toast } from "sonner";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700 border-green-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function AdminAppointmentsPage() {
    const [statusFilter, setStatusFilter] = useState<string>("");
    const [page, setPage] = useState(1);

    const { data, isLoading, refetch } = useGetAppointmentsQuery({
        page,
        per_page: 20,
        status: statusFilter || undefined,
    });

    const [cancelAppointment] = useCancelAppointmentMutation();
    const [updateStatus] = useUpdateAppointmentStatusMutation();

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await updateStatus({ id, status: newStatus }).unwrap();
            toast.success(`Appointment marked as ${newStatus}`);
        } catch (error) {
            toast.error("Failed to update status");
        }
    };

    const handleCancel = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await cancelAppointment(id).unwrap();
            toast.success("Appointment cancelled");
        } catch (error) {
            toast.error("Failed to cancel appointment");
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Appointments</h1>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">Manage customer appointment bookings</p>
                </div>
                <Link
                    href="/admin/shop-hours"
                    className="px-4 py-2 bg-[#1d70ff] text-white rounded-lg font-medium hover:bg-[#1565e0] transition-colors text-center text-sm sm:text-base"
                >
                    Manage Shop Hours
                </Link>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2 sm:gap-4 mb-6">
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="flex-1 sm:flex-none px-3 sm:px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1d70ff] text-sm sm:text-base"
                >
                    <option value="">All Statuses</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
                <button
                    onClick={() => refetch()}
                    className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm sm:text-base"
                >
                    Refresh
                </button>
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-[#1d70ff] border-t-transparent rounded-full" />
                </div>
            ) : data?.appointments?.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                    No appointments found
                </div>
            ) : (
                <>
                    {/* Mobile Cards View */}
                    <div className="block lg:hidden space-y-4">
                        {data?.appointments?.map((appt: Appointment) => (
                            <div key={appt.id} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                {/* Header with date and status */}
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="font-semibold text-gray-900">{formatDate(appt.appointment_date)}</div>
                                        <div className="text-sm text-[#1d70ff] font-medium">{formatTime(appt.appointment_time)}</div>
                                    </div>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[appt.status] || 'bg-gray-100 text-gray-600'}`}>
                                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                    </span>
                                </div>

                                {/* Customer Info */}
                                <div className="mb-3 pb-3 border-b border-gray-100">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer</div>
                                    <div className="font-medium text-gray-900">{appt.customer_name}</div>
                                    <div className="text-sm text-gray-500">{appt.customer_email}</div>
                                    <div className="text-sm text-gray-500">{appt.customer_phone}</div>
                                </div>

                                {/* Service */}
                                <div className="mb-3 pb-3 border-b border-gray-100">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Service</div>
                                    <div className="font-medium text-gray-900">{appt.service_type}</div>
                                    {appt.notes && <div className="text-sm text-gray-500 mt-1">{appt.notes}</div>}
                                </div>

                                {/* Vehicle */}
                                <div className="mb-4">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Vehicle</div>
                                    {appt.vehicle_make || appt.vehicle_model ? (
                                        <>
                                            <div className="text-gray-900">{appt.vehicle_make} {appt.vehicle_model}</div>
                                            {appt.vehicle_registration && (
                                                <div className="text-sm text-gray-500">{appt.vehicle_registration}</div>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-gray-400">Not provided</span>
                                    )}
                                </div>

                                {/* Actions */}
                                {appt.status === 'confirmed' && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleStatusChange(appt.id, 'completed')}
                                            className="flex-1 px-4 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium"
                                        >
                                            Complete
                                        </button>
                                        <button
                                            onClick={() => handleCancel(appt.id)}
                                            className="flex-1 px-4 py-2 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Desktop Table View */}
                    <div className="hidden lg:block bg-white rounded-xl border border-gray-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date & Time</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Service</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Vehicle</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                                        <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {data?.appointments?.map((appt: Appointment) => (
                                        <tr key={appt.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-gray-900">{formatDate(appt.appointment_date)}</div>
                                                <div className="text-sm text-gray-500">{formatTime(appt.appointment_time)}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-gray-900">{appt.customer_name}</div>
                                                <div className="text-sm text-gray-500">{appt.customer_email}</div>
                                                <div className="text-sm text-gray-500">{appt.customer_phone}</div>
                                            </td>
                                            <td className="px-4 py-4">
                                                <div className="font-medium text-gray-900">{appt.service_type}</div>
                                                {appt.notes && <div className="text-sm text-gray-500 max-w-xs truncate">{appt.notes}</div>}
                                            </td>
                                            <td className="px-4 py-4">
                                                {appt.vehicle_make || appt.vehicle_model ? (
                                                    <>
                                                        <div className="text-gray-900">{appt.vehicle_make} {appt.vehicle_model}</div>
                                                        {appt.vehicle_registration && (
                                                            <div className="text-sm text-gray-500">{appt.vehicle_registration}</div>
                                                        )}
                                                    </>
                                                ) : (
                                                    <span className="text-gray-400">Not provided</span>
                                                )}
                                            </td>
                                            <td className="px-4 py-4">
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[appt.status] || 'bg-gray-100 text-gray-600'}`}>
                                                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                {appt.status === 'confirmed' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleStatusChange(appt.id, 'completed')}
                                                            className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                                        >
                                                            Complete
                                                        </button>
                                                        <button
                                                            onClick={() => handleCancel(appt.id)}
                                                            className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {data && data.total_pages > 1 && (
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 py-3 bg-gray-50 border-t border-gray-200">
                                <p className="text-sm text-gray-600">
                                    Page {data.page} of {data.total_pages} ({data.total} total)
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="px-3 py-1 border border-gray-200 rounded-lg disabled:opacity-50"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setPage(p => p + 1)}
                                        disabled={page >= data.total_pages}
                                        className="px-3 py-1 border border-gray-200 rounded-lg disabled:opacity-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Mobile Pagination */}
                    {data && data.total_pages > 1 && (
                        <div className="block lg:hidden mt-4 flex flex-col items-center gap-3 bg-white rounded-xl border border-gray-200 p-4">
                            <p className="text-sm text-gray-600">
                                Page {data.page} of {data.total_pages} ({data.total} total)
                            </p>
                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 text-sm"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page >= data.total_pages}
                                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg disabled:opacity-50 text-sm"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
