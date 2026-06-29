"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
    {
        question: "What is included in a full service?",
        answer:
            "A full service covers engine oil and filter change, air filter, fuel filter, spark plugs (petrol), cabin filter, brake fluid check, tyre condition and pressure, battery health check, and a comprehensive visual inspection of all major systems.",
    },
    {
        question: "How often should I service my vehicle?",
        answer:
            "Most manufacturers recommend an annual service or every 10,000–12,000 miles, whichever comes first. If you drive in demanding conditions — short trips, heavy loads, or track days — more frequent intervals are advisable.",
    },
    {
        question: "Do you use genuine parts?",
        answer:
            "We use OEM-quality or better parts from reputable suppliers. Where a manufacturer-specific part is required for warranty purposes, we can source genuine items. All parts used are detailed on your service receipt.",
    },
    {
        question: "Will a service affect my vehicle warranty?",
        answer:
            "No. Under UK consumer law you are free to have your vehicle serviced by any competent independent garage without voiding the manufacturer's warranty, provided the correct parts and service intervals are followed and a detailed record is kept.",
    },
];

const CheckIcon = () => (
    <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

export default function ServicingPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { heroImage, content1Image, content2Image } = useServicePageImages("servicing");

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="overflow-hidden">
                <Navbar ctaText="Book a Service" />

                <main className="space-y-20">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden bg-[#030814] text-white">
                        {heroImage && (
                            <Image
                                src={heroImage}
                                alt="Servicing"
                                width={1600}
                                height={700}
                                className="absolute inset-0 h-full w-full object-cover"
                                priority
                            />
                        )}
                        <div className="absolute inset-0 bg-black/60" />
                        <div className="relative px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12">
                            <div className="space-y-4 max-w-3xl sm:space-y-5 md:space-y-6">
                                <p className="flex items-center gap-2 text-xs font-semibold text-[#7ab6ff] sm:gap-3 sm:text-sm animate-subtitle">
                                    <span className="h-px w-8 bg-[#7ab6ff] sm:w-12" />
                                    Keeping Your Car at Its Best
                                </p>
                                <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl animate-heading">
                                    Servicing
                                </h1>
                                <p className="text-sm text-gray-300 sm:text-base md:text-lg animate-subtitle">
                                    Comprehensive vehicle servicing by qualified technicians using quality parts and the latest diagnostic equipment.
                                </p>
                            </div>
                        </div>
                        <div className="relative px-4 pb-8 sm:px-6 md:px-8 lg:px-12">
                            <a
                                href="/book-appointment"
                                className="inline-block rounded-xl bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(29,112,255,0.35)] hover:bg-[#1565e0] transition-colors"
                            >
                                Book a Service
                            </a>
                        </div>
                    </section>

                    {/* Section 1: Intro */}
                    <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                            <div className="space-y-4 flex flex-col sm:space-y-5 md:space-y-6">
                                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl lg:text-5xl">
                                        Full & Interim Servicing
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#5c6c86] sm:text-base md:text-lg">
                                        Regular servicing is the single most important thing you can do to protect your investment and ensure safe, reliable motoring. At MS Performance we follow manufacturer schedules to the letter, using the correct grade oils and OEM-quality parts, then stamp and record your service history so your vehicle's value is fully maintained.
                                    </p>
                                </div>
                                <div className="relative overflow-hidden rounded-[20px] flex-shrink-0 animate-slide-right">
                                    {content1Image && (
                                        <Image
                                            src={content1Image}
                                            alt="Vehicle Service"
                                            width={600}
                                            height={400}
                                            className="w-full h-auto object-cover animate-image-hover"
                                        />
                                    )}
                                </div>
                            </div>
                            <div className="relative overflow-hidden h-[650px] rounded-[20px] border-2 border-[#1d70ff] flex animate-slide-right">
                                {content2Image && (
                                    <Image
                                        src={content2Image}
                                        alt="Workshop"
                                        width={600}
                                        height={400}
                                        className="w-full h-auto object-cover animate-image-hover"
                                    />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Why Choose Us */}
                    <section className="px-8 py-10 lg:px-12">
                        <div className="mx-auto max-w-4xl text-center space-y-6">
                            <h2 className="text-4xl font-black text-[#0c1b33] lg:text-5xl">
                                Expertise You Can Trust
                            </h2>
                            <p className="text-base leading-relaxed text-[#0c1b33] lg:text-lg">
                                Our technicians are fully trained and backed by state-of-the-art diagnostic equipment covering all makes and models. Every service includes a detailed health check report so you leave knowing exactly what condition your vehicle is in.
                            </p>
                        </div>
                    </section>

                    {/* Section 3: Key Benefits */}
                    <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
                        <div className="bg-white rounded-xl p-4 sm:rounded-2xl sm:p-6 md:rounded-[20px] md:p-8 lg:p-12">
                            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
                                <div className="space-y-4 animate-slide-left sm:space-y-5 md:space-y-6">
                                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl animate-heading">
                                        What We Cover
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#0c1b33] sm:text-base">
                                        Each service is tailored to your vehicle's age and mileage.
                                    </p>
                                    <ul className="space-y-4">
                                        {["Engine oil & filter", "Air & cabin filters", "Brakes, tyres & lights inspection", "Battery & charging system", "Coolant, brake & power-steering fluid levels"].map((item) => (
                                            <li key={item} className="flex items-start gap-3">
                                                <CheckIcon />
                                                <span className="text-base text-[#0c1b33]">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-8">
                                    {[
                                        { icon: "🔧", title: "Interim Service", desc: "Oil & filter change plus 25-point check — ideal every 6 months." },
                                        { icon: "📋", title: "Full Service", desc: "Complete manufacturer schedule — all fluids, filters, and a thorough inspection." },
                                        { icon: "🚗", title: "Major Service", desc: "Everything in a full service plus spark plugs, timing belt check, and brake fluid change." },
                                    ].map((s) => (
                                        <div key={s.title} className="space-y-2">
                                            <div className="text-2xl">{s.icon}</div>
                                            <h3 className="text-xl font-bold text-[#0c1b33]">{s.title}</h3>
                                            <p className="text-base text-[#5c6c86]">{s.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* FAQ */}
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
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                                className={`transition-transform ${openFaq === index ? "rotate-45" : ""} text-[#1d70ff]`}>
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
