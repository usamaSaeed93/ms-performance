"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import {
    useGetAvailableSlotsQuery,
    useCreateAppointmentMutation,
    TimeSlot
} from "@/lib/store/api/appointmentsApi";
import { toast } from "sonner";

const SERVICE_TYPES = [
    { id: "ecu-remapping", name: "ECU Remapping", description: "Unlock your vehicle's true potential" },
    { id: "dyno-test", name: "Dyno Test", description: "4WD dyno sessions with live logging" },
    { id: "custom-exhaust", name: "Custom Exhaust", description: "Hand-built exhaust systems" },
    { id: "dpf-egr", name: "DPF & EGR Services", description: "DPF cleaning and EGR solutions" },
    { id: "servicing", name: "Servicing", description: "Enhanced turbo systems" },
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function BookAppointmentPage() {
    const [step, setStep] = useState(1);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [selectedService, setSelectedService] = useState<string | null>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    // Form state
    const [formData, setFormData] = useState({
        customer_name: "",
        customer_email: "",
        customer_phone: "",
        vehicle_make: "",
        vehicle_model: "",
        vehicle_registration: "",
        notes: "",
    });

    // Format date for API
    const formattedDate = selectedDate ? selectedDate.toISOString().split('T')[0] : "";

    // Fetch available slots with 60-second polling
    const { data: slotsData, isLoading: slotsLoading, refetch } = useGetAvailableSlotsQuery(
        { date: formattedDate },
        {
            skip: !formattedDate,
            pollingInterval: 60000, // Poll every 60 seconds
        }
    );

    const [createAppointment, { isLoading: isSubmitting }] = useCreateAppointmentMutation();

    // Generate calendar days
    const calendarDays = useMemo(() => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const days: (Date | null)[] = [];

        // Add empty days for padding
        for (let i = 0; i < firstDay.getDay(); i++) {
            days.push(null);
        }

        // Add actual days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    }, [currentMonth]);

    const isDateDisabled = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleDateSelect = (date: Date) => {
        if (!isDateDisabled(date)) {
            setSelectedDate(date);
            setSelectedTime(null);
        }
    };

    const handleTimeSelect = (time: string) => {
        setSelectedTime(time);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        if (!selectedDate || !selectedTime || !selectedService) {
            toast.error("Please complete all booking details");
            return;
        }

        if (!formData.customer_name || !formData.customer_email || !formData.customer_phone) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            await createAppointment({
                appointment_date: formattedDate,
                appointment_time: selectedTime,
                customer_name: formData.customer_name,
                customer_email: formData.customer_email,
                customer_phone: formData.customer_phone,
                vehicle_make: formData.vehicle_make || undefined,
                vehicle_model: formData.vehicle_model || undefined,
                vehicle_registration: formData.vehicle_registration || undefined,
                service_type: SERVICE_TYPES.find(s => s.id === selectedService)?.name || selectedService,
                notes: formData.notes || undefined,
            }).unwrap();

            toast.success("Appointment booked successfully! Check your email for confirmation.");
            setStep(4); // Success step
        } catch (error: any) {
            toast.error(error?.data?.error || "Failed to book appointment. Please try again.");
        }
    };

    const formatTime = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar ctaText="Contact Us" />

            <main className="px-4 py-12 sm:px-6 md:px-8 lg:px-12">
                <div className="mx-auto max-w-4xl">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1d70ff] mb-4">
                            Book Your Appointment
                        </p>
                        <h1 className="text-3xl font-black text-gray-900 sm:text-4xl md:text-5xl mb-4">
                            Schedule Your Visit
                        </h1>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Select a service, choose your preferred date and time, and we'll take care of the rest.
                        </p>
                    </div>

                    {/* Progress Steps */}
                    <div className="flex justify-center mb-12">
                        <div className="flex items-center gap-4">
                            {[1, 2, 3].map((s) => (
                                <div key={s} className="flex items-center gap-4">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${step >= s
                                            ? 'bg-[#1d70ff] text-white'
                                            : 'bg-gray-100 text-gray-500'
                                            }`}
                                    >
                                        {step > s ? '✓' : s}
                                    </div>
                                    {s < 3 && (
                                        <div className={`w-16 h-1 rounded ${step > s ? 'bg-[#1d70ff]' : 'bg-gray-200'}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Step 1: Select Service */}
                    {step === 1 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Select a Service</h2>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {SERVICE_TYPES.map((service) => (
                                    <button
                                        key={service.id}
                                        onClick={() => {
                                            setSelectedService(service.id);
                                            setStep(2);
                                        }}
                                        className={`p-6 rounded-2xl border-2 text-left transition-all hover:border-[#1d70ff] hover:bg-blue-50 ${selectedService === service.id
                                            ? 'border-[#1d70ff] bg-blue-50'
                                            : 'border-gray-200 bg-gray-50'
                                            }`}
                                    >
                                        <h3 className="text-lg font-bold text-gray-900 mb-2">{service.name}</h3>
                                        <p className="text-sm text-gray-600">{service.description}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Step 2: Select Date & Time */}
                    {step === 2 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Choose Date & Time</h2>

                            <div className="grid gap-8 lg:grid-cols-2">
                                {/* Calendar */}
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                    <div className="flex items-center justify-between mb-6">
                                        <button
                                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                                            className="p-2 rounded-lg hover:bg-gray-200 text-gray-700"
                                        >
                                            ←
                                        </button>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            {MONTH_NAMES[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                                        </h3>
                                        <button
                                            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                                            className="p-2 rounded-lg hover:bg-gray-200 text-gray-700"
                                        >
                                            →
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {DAY_NAMES.map((day) => (
                                            <div key={day} className="text-center text-xs text-gray-500 py-2">
                                                {day}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-7 gap-1">
                                        {calendarDays.map((date, i) => (
                                            <div key={i} className="aspect-square">
                                                {date && (
                                                    <button
                                                        onClick={() => handleDateSelect(date)}
                                                        disabled={isDateDisabled(date)}
                                                        className={`w-full h-full rounded-lg flex items-center justify-center text-sm font-medium transition-all ${selectedDate?.toDateString() === date.toDateString()
                                                            ? 'bg-[#1d70ff] text-white'
                                                            : isDateDisabled(date)
                                                                ? 'text-gray-400 cursor-not-allowed'
                                                                : 'text-gray-900 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        {date.getDate()}
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Time Slots */}
                                <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                                        {selectedDate
                                            ? `Available Times - ${selectedDate.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short' })}`
                                            : 'Select a date first'
                                        }
                                    </h3>

                                    {!selectedDate ? (
                                        <p className="text-gray-500 text-center py-8">Please select a date to view available times</p>
                                    ) : slotsLoading ? (
                                        <div className="flex justify-center py-8">
                                            <div className="animate-spin h-8 w-8 border-4 border-[#1d70ff] border-t-transparent rounded-full" />
                                        </div>
                                    ) : !slotsData?.is_open ? (
                                        <p className="text-gray-500 text-center py-8">Shop is closed on this day</p>
                                    ) : slotsData?.slots?.length === 0 ? (
                                        <p className="text-gray-500 text-center py-8">No available slots for this date</p>
                                    ) : (
                                        <div className="grid grid-cols-3 gap-2 max-h-[300px] overflow-y-auto pr-2">
                                            {slotsData?.slots?.map((slot: TimeSlot) => (
                                                <button
                                                    key={slot.time}
                                                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                                                    disabled={!slot.available}
                                                    className={`py-3 px-2 rounded-lg text-sm font-medium transition-all ${selectedTime === slot.time
                                                        ? 'bg-[#1d70ff] text-white'
                                                        : slot.available
                                                            ? 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                                                            : 'bg-gray-100 text-gray-400 cursor-not-allowed line-through'
                                                        }`}
                                                >
                                                    {formatTime(slot.time)}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <p className="text-xs text-gray-500 mt-4 text-center">
                                        Slots refresh automatically every minute
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={() => selectedDate && selectedTime && setStep(3)}
                                    disabled={!selectedDate || !selectedTime}
                                    className="px-8 py-3 rounded-xl bg-[#1d70ff] text-white font-semibold hover:bg-[#1565e0] disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    Continue →
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Contact Details */}
                    {step === 3 && (
                        <div className="animate-fade-in">
                            <h2 className="text-xl font-bold text-gray-900 mb-6 text-center">Your Details</h2>

                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 max-w-2xl mx-auto">
                                {/* Booking Summary */}
                                <div className="bg-blue-50 rounded-xl p-4 mb-6 border border-blue-200">
                                    <h3 className="text-sm font-semibold text-[#1d70ff] mb-2">Booking Summary</h3>
                                    <div className="flex flex-wrap gap-4 text-sm text-gray-900">
                                        <span>📅 {selectedDate?.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                                        <span>🕐 {selectedTime && formatTime(selectedTime)}</span>
                                        <span>🔧 {SERVICE_TYPES.find(s => s.id === selectedService)?.name}</span>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Full Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="customer_name"
                                                value={formData.customer_name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1d70ff] focus:ring-2 focus:ring-[#1d70ff]/20"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="tel"
                                                name="customer_phone"
                                                value={formData.customer_phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1d70ff] focus:ring-2 focus:ring-[#1d70ff]/20"
                                                placeholder="+44 7XXX XXXXXX"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email Address <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="customer_email"
                                            value={formData.customer_email}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1d70ff] focus:ring-2 focus:ring-[#1d70ff]/20"
                                            placeholder="john@example.com"
                                            required
                                        />
                                    </div>

                                    <div className="border-t border-gray-200 pt-4 mt-4">
                                        <h4 className="text-sm font-semibold text-gray-700 mb-4">Vehicle Details (Optional)</h4>
                                        <div className="grid gap-4 sm:grid-cols-3">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-2">Make</label>
                                                <input
                                                    type="text"
                                                    name="vehicle_make"
                                                    value={formData.vehicle_make}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1d70ff]"
                                                    placeholder="BMW"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-2">Model</label>
                                                <input
                                                    type="text"
                                                    name="vehicle_model"
                                                    value={formData.vehicle_model}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1d70ff]"
                                                    placeholder="M4"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-gray-600 mb-2">Registration</label>
                                                <input
                                                    type="text"
                                                    name="vehicle_registration"
                                                    value={formData.vehicle_registration}
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1d70ff]"
                                                    placeholder="AB12 CDE"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                                        <textarea
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-[#1d70ff] resize-none"
                                            placeholder="Any specific requirements or information..."
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between mt-8 max-w-2xl mx-auto">
                                <button
                                    onClick={() => setStep(2)}
                                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
                                >
                                    ← Back
                                </button>
                                <button
                                    onClick={handleSubmit}
                                    disabled={isSubmitting || !formData.customer_name || !formData.customer_email || !formData.customer_phone}
                                    className="px-8 py-3 rounded-xl bg-[#1d70ff] text-white font-semibold hover:bg-[#1565e0] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                            Booking...
                                        </>
                                    ) : (
                                        'Confirm Booking'
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Success */}
                    {step === 4 && (
                        <div className="animate-fade-in text-center py-12">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
                                <span className="text-4xl text-green-600">✓</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Booking Confirmed!</h2>
                            <p className="text-gray-600 mb-8 max-w-md mx-auto">
                                Your appointment has been booked successfully. We've sent a confirmation email to {formData.customer_email}.
                            </p>
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 max-w-md mx-auto mb-8">
                                <div className="space-y-3 text-left">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Date</span>
                                        <span className="text-gray-900 font-medium">
                                            {selectedDate?.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Time</span>
                                        <span className="text-gray-900 font-medium">{selectedTime && formatTime(selectedTime)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Service</span>
                                        <span className="text-gray-900 font-medium">
                                            {SERVICE_TYPES.find(s => s.id === selectedService)?.name}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <a
                                href="/home"
                                className="inline-block px-8 py-3 rounded-xl bg-[#1d70ff] text-white font-semibold hover:bg-[#1565e0]"
                            >
                                Back to Home
                            </a>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
