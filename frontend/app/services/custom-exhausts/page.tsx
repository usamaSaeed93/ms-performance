"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
    {
        question: "How often should I change my car's oil?",
        answer:
            "For most modern vehicles, we recommend changing your oil every 5,000-7,500 miles or every 6 months, whichever comes first. However, if you drive in severe conditions (frequent short trips, dusty environments, or towing), you may need to change it more frequently. Always check your owner's manual for manufacturer recommendations.",
    },
    {
        question: "Is professional installation necessary for a custom exhaust system?",
        answer:
            "Yes, professional installation is highly recommended. A properly fitted exhaust system requires precise welding, correct alignment, and secure mounting to prevent rattles, leaks, and potential damage. Our technicians ensure perfect fitment and optimal performance from your new exhaust system.",
    },
    {
        question: "Are catalytic controlled exhaust systems worth considering?",
        answer:
            "Absolutely. These are custom exhaust systems allow you to control exhaust flow via a valve at the back. They offer versatility, enabling you to switch between an aggressive performance sound and a more subtle, everyday mode. This makes them perfect for vehicles that are both daily drivers and weekend track cars.",
    },
    {
        question: "What are the benefits of installing a custom exhaust system?",
        answer:
            "Custom exhaust systems offer improved exhaust flow, resulting in better engine performance and fuel efficiency. They also provide a more aggressive or refined sound depending on your preference, reduced weight compared to stock systems, and enhanced aesthetics with polished tips and quality craftsmanship.",
    },
    {
        question: "Do you keep a copy of the original files?",
        answer:
            "Yes, we always keep a backup of your vehicle's original ECU files before any remapping work. This ensures we can restore your vehicle to its factory settings at any time if needed, providing complete peace of mind for our customers.",
    },
    {
        question: "What about insurance?",
        answer:
            "We recommend informing your insurance company about any modifications to your vehicle, including ECU remapping and exhaust upgrades. Many insurers are understanding of performance modifications, and some specialist insurers cater specifically to modified vehicles. We can provide documentation of any work performed.",
    },
    {
        question: "Is remapping safe for the vehicles?",
        answer:
            "When performed by experienced professionals like us, remapping is completely safe. We ensure all parameters remain within safe limits for your engine and transmission. Our tuning process takes into account the engine's design, cooling capacity, and overall mechanical condition to deliver reliable performance gains.",
    },
    {
        question: "What is remapping?",
        answer:
            "Remapping (also known as ECU tuning) is the process of modifying the software in your vehicle's Engine Control Unit to optimize performance. This can unlock additional power and torque, improve throttle response, and even enhance fuel efficiency. The remapping process takes the factory settings and adjusts them based on your vehicle and preferences.",
    },
];

export default function CustomExhaustsPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { heroImage, content1Image, content2Image } = useServicePageImages("custom-exhausts");

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="overflow-hidden">
                <Navbar ctaText="Get a Quote" />

                <main className="space-y-20">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden bg-[#030814] text-white">
                        <Image
                            src={heroImage}
                            alt="Custom Exhausts"
                            width={1600}
                            height={700}
                            className="absolute inset-0 h-full w-full object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="relative px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12">
                            <div className="space-y-4 max-w-3xl sm:space-y-5 md:space-y-6">
                                <p className="flex items-center gap-2 text-xs font-semibold text-[#7ab6ff] sm:gap-3 sm:text-sm animate-subtitle">
                                    <span className="h-px w-8 bg-[#7ab6ff] sm:w-12" />
                                    Sound & Performance Redefined
                                </p>
                                <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl animate-heading">
                                    Custom Exhausts
                                </h1>
                            </div>
                        </div>
                    </section>

                    {/* Section 1: Intro */}
                    <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12" style={{ gridAutoRows: '1fr' }}>
                            <div className="space-y-4 flex flex-col sm:space-y-5 md:space-y-6">
                                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl lg:text-5xl">
                                        Tailored Tones & Optimized Flow
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#5c6c86] sm:text-base md:text-lg">
                                        A custom exhaust system is one of the most rewarding upgrades for any car enthusiast. At MSPerformance, we hand-craft exhaust systems to match your exact specifications. From manifold back to cat-back systems, we ensure perfect fitment and optimized gas flow for maximum performance gains.
                                    </p>
                                </div>
                                <div className="relative overflow-hidden rounded-[20px] flex-shrink-0 animate-slide-right">
                                    <Image
                                        src={content1Image}
                                        alt="Welding Exhaust"
                                        width={600}
                                        height={400}
                                        className="w-full h-auto object-cover animate-image-hover"
                                    />
                                </div>
                            </div>
                            <div className="relative overflow-hidden h-[650px] rounded-[20px] border-2 border-[#1d70ff] flex animate-slide-right">
                                <Image
                                    src={content2Image}
                                    alt="Car Underside"
                                    width={600}
                                    height={400}
                                    className="w-full h-auto object-cover animate-image-hover"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Why Choose Us */}
                    <section className="px-8 py-10 lg:px-12">
                        <div className="mx-auto max-w-4xl text-center space-y-6">
                            <h2 className="text-4xl font-black text-[#0c1b33] lg:text-5xl">
                                Master Craftsmanship
                            </h2>
                            <p className="text-base leading-relaxed text-[#0c1b33] lg:text-lg">
                                We believe an exhaust is a piece of art. Our TIG welding specialists take pride in creating beautiful, functional headers and pipes. We use mandrel bends to maintain constant diameter, ensuring no restriction in airflow, which translates directly to better throttle response and more power.
                            </p>
                        </div>
                    </section>

                    {/* Section 3: Key Benefits */}
                    <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
                        <div className="bg-white rounded-xl p-4 sm:rounded-2xl sm:p-6 md:rounded-[20px] md:p-8 lg:p-12">
                            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
                                <div className="space-y-4 animate-slide-left sm:space-y-5 md:space-y-6">
                                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl lg:text-4xl animate-heading">
                                        Key Advantages
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#0c1b33] sm:text-base md:text-lg">
                                        Whether you are looking for a weight saving titanium system or a durable stainless steel setup, we have the material and expertise to deliver.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                                                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-base text-[#0c1b33]">Lifetime Warranty on Piping</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                                                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-base text-[#0c1b33]">Bespoke Sound Tuning</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                                                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-base text-[#0c1b33]">Performance Gains You Can Feel</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d70ff]">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                                                <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#0c1b33]">Aesthetic Appeal</h3>
                                            <p className="mt-2 text-base text-[#0c1b33]">Stunning tips and welds that make your car stand out.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Section 4: FAQ */}
                    <section className="px-8 py-10 lg:px-12">
                        <div className="mx-auto max-w-4xl space-y-8">
                            <h2 className="text-center text-4xl font-black text-[#0c1b33] lg:text-5xl">
                                Frequently Asked Questions
                            </h2>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="rounded-[16px] bg-white shadow-sm">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                            className="flex w-full items-center justify-between p-6 text-left"
                                        >
                                            <span className="text-lg font-semibold text-[#0c1b33]">{faq.question}</span>
                                            <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                className={`transition-transform ${openFaq === index ? "rotate-45" : ""} text-[#1d70ff]`}
                                            >
                                                <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </button>
                                        {openFaq === index && (
                                            <div className="border-t border-[#dfe6f2] p-6">
                                                <p className="text-base leading-relaxed text-[#5c6c86]">{faq.answer}</p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}

