"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
    {
        question: "What are DPF and EGR?",
        answer:
            "DPF (Diesel Particulate Filter) captures soot from diesel exhaust, while EGR (Exhaust Gas Recirculation) recirculates exhaust gases to reduce NOx emissions. Both systems are critical for emissions control but can become clogged or fail over time, checking engine performance.",
    },
    {
        question: "How do I know if my DPF is blocked?",
        answer:
            "Common signs include a warning light on your dashboard, loss of power (limp mode), increased fuel consumption, and more frequent regeneration cycles. If ignored, a blocked DPF can cause significant engine damage.",
    },
    {
        question: "What is DPF cleaning?",
        answer:
            "DPF cleaning involves removing the ash and soot buildup from the filter to restore it to near-new condition. This is a cost-effective alternative to replacing the entire DPF unit, which can be very expensive.",
    },
    {
        question: "Is it legal to remove the DPF?",
        answer:
            "In the UK, it is illegal to drive a vehicle that has had its DPF removed if it was fitted with one as standard. We offer cleaning and maintenance solutions to keep your system legal and functional. Removal is strictly for off-road or motorsport use.",
    },
];

export default function DpfEgrPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { heroImage, content1Image, content2Image } = useServicePageImages("dpf-egr-services");

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="overflow-hidden">
                <Navbar ctaText="Book a Checkup" />

                <main className="space-y-20">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden bg-[#030814] text-white">
                        <Image
                            src={heroImage}
                            alt="DPF & EGR Services"
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
                                    Restore Efficiency & Reliability
                                </p>
                                <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl animate-heading">
                                    DPF & EGR Solutions
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
                                        Keep It Clean, Keep It Running
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#5c6c86] sm:text-base md:text-lg">
                                        Modern diesel engines rely on complex emissions systems like DPFs and EGR valves. When these clog, performance plummets and bills skyrocket. We offer comprehensive diagnostics, cleaning, and software solutions to fix these issues at the source, saving you money and restoring your vehicle's health.
                                    </p>
                                </div>
                                <div className="relative overflow-hidden rounded-[20px] flex-shrink-0 animate-slide-right">
                                    <Image
                                        src={content1Image}
                                        alt="DPF Cleaning"
                                        width={600}
                                        height={400}
                                        className="w-full h-auto object-cover animate-image-hover"
                                    />
                                </div>
                            </div>
                            <div className="relative overflow-hidden h-[650px] rounded-[20px] border-2 border-[#1d70ff] flex animate-slide-right">
                                <Image
                                    src={content2Image}
                                    alt="Mechanic Diagnostics"
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
                                Expert Diagnosis
                            </h2>
                            <p className="text-base leading-relaxed text-[#0c1b33] lg:text-lg">
                                Don't just replace parts; fix the problem. Often, a blocked DPF is a symptom of another issue. Our expert technicians use dealer-level diagnostics to find the root cause, whether it's a faulty sensor, thermostat, or driving habit, ensuring the problem doesn't return.
                            </p>
                        </div>
                    </section>

                    {/* Section 3: Key Benefits */}
                    <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
                        <div className="bg-white rounded-xl p-4 sm:rounded-2xl sm:p-6 md:rounded-[20px] md:p-8 lg:p-12">
                            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
                                <div className="space-y-4 animate-slide-left sm:space-y-5 md:space-y-6">
                                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl lg:text-4xl animate-heading">
                                        Benefits Of Our Service
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#0c1b33] sm:text-base md:text-lg">
                                        Restoring your emissions system isn't just about turning off a light on the dashboard; it's about efficiency and longevity.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                                                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-base text-[#0c1b33]">Better Fuel Economy</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                                                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-base text-[#0c1b33]">Prevent Turbo Damage</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                                                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-base text-[#0c1b33]">Restore Lost Power</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d70ff]">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#0c1b33]">Cost Saving</h3>
                                            <p className="mt-2 text-base text-[#0c1b33]">Cleaning is a fraction of the cost of replacement.</p>
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

