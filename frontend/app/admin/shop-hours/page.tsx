"use client";

import { useState, useEffect } from "react";
import {
    useGetShopHoursQuery,
    useUpdateShopHoursMutation,
    ShopHours
} from "@/lib/store/api/appointmentsApi";
import { toast } from "sonner";
import Link from "next/link";

const DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

export default function AdminShopHoursPage() {
    const { data, isLoading } = useGetShopHoursQuery();
    const [updateShopHours, { isLoading: isSaving }] = useUpdateShopHoursMutation();

    const [hours, setHours] = useState<Array<{
        day_of_week: number;
        is_open: boolean;
        open_time: string;
        close_time: string;
        slot_duration_minutes: number;
    }>>([]);

    // Initialize hours from API data
    useEffect(() => {
        if (data?.hours) {
            setHours(data.hours.map(h => ({
                day_of_week: h.day_of_week,
                is_open: h.is_open,
                open_time: h.open_time || "09:00",
                close_time: h.close_time || "17:00",
                slot_duration_minutes: h.slot_duration_minutes,
            })));
        }
    }, [data]);

    const handleToggle = (dayIndex: number) => {
        setHours(prev => prev.map(h =>
            h.day_of_week === dayIndex ? { ...h, is_open: !h.is_open } : h
        ));
    };

    const handleTimeChange = (dayIndex: number, field: 'open_time' | 'close_time', value: string) => {
        setHours(prev => prev.map(h =>
            h.day_of_week === dayIndex ? { ...h, [field]: value } : h
        ));
    };

    const handleDurationChange = (dayIndex: number, value: number) => {
        setHours(prev => prev.map(h =>
            h.day_of_week === dayIndex ? { ...h, slot_duration_minutes: value } : h
        ));
    };

    const handleSave = async () => {
        try {
            await updateShopHours({ hours }).unwrap();
            toast.success("Shop hours updated successfully");
        } catch (error) {
            toast.error("Failed to update shop hours");
        }
    };

    const applyToAllWeekdays = () => {
        const mondayHours = hours.find(h => h.day_of_week === 0);
        if (!mondayHours) return;

        setHours(prev => prev.map(h =>
            h.day_of_week < 5 ? {
                ...h,
                is_open: mondayHours.is_open,
                open_time: mondayHours.open_time,
                close_time: mondayHours.close_time,
                slot_duration_minutes: mondayHours.slot_duration_minutes,
            } : h
        ));
        toast.success("Applied Monday hours to all weekdays");
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin h-8 w-8 border-4 border-[#1d70ff] border-t-transparent rounded-full" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Shop Hours</h1>
                    <p className="text-gray-500 mt-1">Configure your weekly opening hours and appointment slot duration</p>
                </div>
                <Link
                    href="/admin/appointments"
                    className="px-4 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50"
                >
                    ← Back to Appointments
                </Link>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">Weekly Schedule</span>
                    <button
                        onClick={applyToAllWeekdays}
                        className="text-sm text-[#1d70ff] hover:underline"
                    >
                        Apply Monday to all weekdays
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {hours.sort((a, b) => a.day_of_week - b.day_of_week).map((day) => (
                        <div key={day.day_of_week} className="p-4 flex items-center gap-6">
                            {/* Day Name */}
                            <div className="w-28">
                                <span className="font-medium text-gray-900">{DAY_NAMES[day.day_of_week]}</span>
                            </div>

                            {/* Toggle */}
                            <button
                                onClick={() => handleToggle(day.day_of_week)}
                                className={`relative w-12 h-6 rounded-full transition-colors ${day.is_open ? 'bg-[#1d70ff]' : 'bg-gray-300'
                                    }`}
                            >
                                <span
                                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${day.is_open ? 'translate-x-6' : ''
                                        }`}
                                />
                            </button>
                            <span className={`w-16 text-sm ${day.is_open ? 'text-green-600' : 'text-gray-400'}`}>
                                {day.is_open ? 'Open' : 'Closed'}
                            </span>

                            {/* Time Inputs */}
                            {day.is_open && (
                                <>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="time"
                                            value={day.open_time}
                                            onChange={(e) => handleTimeChange(day.day_of_week, 'open_time', e.target.value)}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                        <span className="text-gray-400">to</span>
                                        <input
                                            type="time"
                                            value={day.close_time}
                                            onChange={(e) => handleTimeChange(day.day_of_week, 'close_time', e.target.value)}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">Slot:</span>
                                        <select
                                            value={day.slot_duration_minutes}
                                            onChange={(e) => handleDurationChange(day.day_of_week, parseInt(e.target.value))}
                                            className="px-3 py-2 border border-gray-200 rounded-lg text-sm"
                                        >
                                            <option value={15}>15 min</option>
                                            <option value={30}>30 min</option>
                                            <option value={45}>45 min</option>
                                            <option value={60}>60 min</option>
                                            <option value={90}>90 min</option>
                                            <option value={120}>2 hours</option>
                                        </select>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="px-6 py-3 bg-[#1d70ff] text-white rounded-lg font-semibold hover:bg-[#1565e0] disabled:opacity-50 flex items-center gap-2"
                >
                    {isSaving ? (
                        <>
                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                            Saving...
                        </>
                    ) : (
                        'Save Changes'
                    )}
                </button>
            </div>
        </div>
    );
}
