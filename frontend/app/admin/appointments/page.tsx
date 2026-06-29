"use client";

import { useState } from "react";
import {
    useGetAppointmentsQuery,
    useCancelAppointmentMutation,
    useUpdateAppointmentStatusMutation,
    useApproveAppointmentMutation,
    useDenyAppointmentMutation,
    Appointment
} from "@/lib/store/api/appointmentsApi";
import { toast } from "sonner";
import Link from "next/link";

const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    confirmed: "bg-green-100 text-green-700 border-green-200",
    completed: "bg-blue-100 text-blue-700 border-blue-200",
    cancelled: "bg-gray-100 text-gray-600 border-gray-200",
    denied: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_TABS = [
    { label: "All", value: "" },
    { label: "Pending", value: "pending" },
    { label: "Confirmed", value: "confirmed" },
    { label: "Completed", value: "completed" },
    { label: "Denied", value: "denied" },
    { label: "Cancelled", value: "cancelled" },
];

export default function AdminAppointmentsPage() {
    const [statusFilter, setStatusFilter] = useState<string>("pending");
    const [page, setPage] = useState(1);

    const { data, isLoading, refetch } = useGetAppointmentsQuery({
        page,
        per_page: 20,
        status: statusFilter || undefined,
    });

    // Separate query just to get the pending count for the badge
    const { data: pendingData } = useGetAppointmentsQuery({
        page: 1,
        per_page: 1,
        status: "pending",
    });

    const [cancelAppointment, { isLoading: isCancelling }] = useCancelAppointmentMutation();
    const [updateStatus] = useUpdateAppointmentStatusMutation();
    const [approveAppointment, { isLoading: isApproving }] = useApproveAppointmentMutation();
    const [denyAppointment, { isLoading: isDenying }] = useDenyAppointmentMutation();

    const [actioningId, setActioningId] = useState<number | null>(null);

    const handleApprove = async (id: number) => {
        setActioningId(id);
        try {
            await approveAppointment(id).unwrap();
            toast.success("Appointment approved — customer notified and added to Setmore.");
        } catch {
            toast.error("Failed to approve appointment");
        } finally {
            setActioningId(null);
        }
    };

    const handleDeny = async (id: number) => {
        if (!confirm("Deny this appointment? The customer will be notified by email.")) return;
        setActioningId(id);
        try {
            await denyAppointment(id).unwrap();
            toast.success("Appointment denied — customer notified.");
        } catch {
            toast.error("Failed to deny appointment");
        } finally {
            setActioningId(null);
        }
    };

    const handleStatusChange = async (id: number, newStatus: string) => {
        try {
            await updateStatus({ id, status: newStatus }).unwrap();
            toast.success(`Appointment marked as ${newStatus}`);
        } catch {
            toast.error("Failed to update status");
        }
    };

    const handleCancel = async (id: number) => {
        if (!confirm("Are you sure you want to cancel this appointment?")) return;
        try {
            await cancelAppointment(id).unwrap();
            toast.success("Appointment cancelled");
        } catch {
            toast.error("Failed to cancel appointment");
        }
    };

    const handleTabChange = (value: string) => {
        setStatusFilter(value);
        setPage(1);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "numeric",
            month: "short",
            year: "numeric",
        });
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":");
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    const pendingCount = pendingData?.total ?? 0;

    const AppointmentActions = ({ appt, compact = false }: { appt: Appointment; compact?: boolean }) => {
        const busy = actioningId === appt.id;
        const btnBase = compact
            ? "px-3 py-1 text-xs rounded-lg font-medium transition-colors disabled:opacity-50"
            : "flex-1 px-4 py-2 text-sm rounded-lg font-medium transition-colors disabled:opacity-50";

        if (appt.status === "pending") {
            return (
                <div className={compact ? "flex gap-2" : "flex gap-2"}>
                    <button
                        onClick={() => handleApprove(appt.id)}
                        disabled={busy}
                        className={`${btnBase} bg-green-100 text-green-700 hover:bg-green-200`}
                    >
                        {busy ? "…" : "Approve"}
                    </button>
                    <button
                        onClick={() => handleDeny(appt.id)}
                        disabled={busy}
                        className={`${btnBase} bg-red-100 text-red-700 hover:bg-red-200`}
                    >
                        {busy ? "…" : "Deny"}
                    </button>
                </div>
            );
        }
        if (appt.status === "confirmed") {
            return (
                <div className={compact ? "flex gap-2" : "flex gap-2"}>
                    <button
                        onClick={() => handleStatusChange(appt.id, "completed")}
                        className={`${btnBase} bg-blue-100 text-blue-700 hover:bg-blue-200`}
                    >
                        Complete
                    </button>
                    <button
                        onClick={() => handleCancel(appt.id)}
                        className={`${btnBase} bg-gray-100 text-gray-700 hover:bg-gray-200`}
                    >
                        Cancel
                    </button>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Appointments</h1>
                        {pendingCount > 0 && (
                            <span className="inline-flex items-center justify-center min-w-[24px] h-6 px-2 bg-yellow-500 text-white text-xs font-bold rounded-full animate-pulse">
                                {pendingCount}
                            </span>
                        )}
                    </div>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        {pendingCount > 0
                            ? `${pendingCount} appointment${pendingCount > 1 ? "s" : ""} waiting for approval`
                            : "Manage customer appointment bookings"}
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => refetch()}
                        className="px-3 sm:px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-sm"
                    >
                        Refresh
                    </button>
                    <Link
                        href="/admin/shop-hours"
                        className="px-4 py-2 bg-[#1d70ff] text-white rounded-lg font-medium hover:bg-[#1565e0] transition-colors text-center text-sm"
                    >
                        Shop Hours
                    </Link>
                </div>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-6 border-b border-gray-200 pb-0">
                {STATUS_TABS.map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => handleTabChange(tab.value)}
                        className={`relative px-3 sm:px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                            statusFilter === tab.value
                                ? "border-[#1d70ff] text-[#1d70ff] bg-blue-50"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                        }`}
                    >
                        {tab.label}
                        {tab.value === "pending" && pendingCount > 0 && (
                            <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-yellow-500 text-white text-[10px] font-bold rounded-full">
                                {pendingCount}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Content */}
            {isLoading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin h-8 w-8 border-4 border-[#1d70ff] border-t-transparent rounded-full" />
                </div>
            ) : data?.appointments?.length === 0 ? (
                <div className="text-center py-12">
                    {statusFilter === "pending" ? (
                        <div className="space-y-2">
                            <div className="text-5xl">✅</div>
                            <p className="text-gray-600 font-medium">No pending appointments</p>
                            <p className="text-gray-400 text-sm">All caught up!</p>
                        </div>
                    ) : (
                        <p className="text-gray-500">No appointments found</p>
                    )}
                </div>
            ) : (
                <>
                    {/* Pending banner */}
                    {statusFilter === "pending" && (data?.appointments?.length ?? 0) > 0 && (
                        <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-xl flex items-start gap-3">
                            <span className="text-2xl">⏳</span>
                            <div>
                                <p className="font-semibold text-yellow-800">Action required</p>
                                <p className="text-yellow-700 text-sm">
                                    These appointments are waiting for your approval. Approving will send a confirmation
                                    email to the customer and add the booking to your Setmore calendar.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Mobile Cards View */}
                    <div className="block lg:hidden space-y-4">
                        {data?.appointments?.map((appt: Appointment) => (
                            <div
                                key={appt.id}
                                className={`bg-white rounded-xl border p-4 shadow-sm ${
                                    appt.status === "pending" ? "border-yellow-300 ring-1 ring-yellow-200" : "border-gray-200"
                                }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <div className="font-semibold text-gray-900">{formatDate(appt.appointment_date)}</div>
                                        <div className="text-sm text-[#1d70ff] font-medium">{formatTime(appt.appointment_time)}</div>
                                    </div>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[appt.status] || "bg-gray-100 text-gray-600"}`}>
                                        {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                    </span>
                                </div>

                                <div className="mb-3 pb-3 border-b border-gray-100">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Customer</div>
                                    <div className="font-medium text-gray-900">{appt.customer_name}</div>
                                    <div className="text-sm text-gray-500">{appt.customer_email}</div>
                                    <div className="text-sm text-gray-500">{appt.customer_phone}</div>
                                </div>

                                <div className="mb-3 pb-3 border-b border-gray-100">
                                    <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Service</div>
                                    <div className="font-medium text-gray-900">{appt.service_type}</div>
                                    {appt.notes && <div className="text-sm text-gray-500 mt-1">{appt.notes}</div>}
                                </div>

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

                                <AppointmentActions appt={appt} />
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
                                        <tr
                                            key={appt.id}
                                            className={`hover:bg-gray-50 ${appt.status === "pending" ? "bg-yellow-50/40" : ""}`}
                                        >
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
                                                <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${STATUS_COLORS[appt.status] || "bg-gray-100 text-gray-600"}`}>
                                                    {appt.status.charAt(0).toUpperCase() + appt.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-4 py-4">
                                                <AppointmentActions appt={appt} compact />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

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
