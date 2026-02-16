"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
    {
        question: "What does ECU diagnostics do?",
        answer:
            "ECU diagnostics involve using specialized computers to communicate with your car's On-Board Diagnostics (OBD) system. This allows us to read fault codes, view live sensor data, and check the health of various electronic modules to pinpoint issues.",
    },
    {
        question: "Why is my engine warning light on?",
        answer:
            "The 'Check Engine' light can trigger for hundreds of reasons, from a loose gas cap to a failing catalytic converter. Our diagnostics service will read the specific error code to tell you exactly what is wrong, avoiding guesswork.",
    },
    {
        question: "Can you reset airbag or ABS lights?",
        answer:
            "Yes, we can diagnose and reset warning lights for Airbags, ABS, Traction Control, and more—provided the underlying fault has been rectified. We prioritize safety and will ensure the system is functioning correctly.",
    },
    {
        question: "Do you offer dealer-level coding?",
        answer:
            "For many makes, yes. We can perform coding and adaptation for new modules, unlock hidden features, and update software versions, offering a dealer-level service at a fraction of the cost.",
    },
];

export default function EcuDiagnosticsPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { heroImage, content1Image, content2Image } = useServicePageImages("ecu-diagnostics");

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="overflow-hidden">
                <Navbar ctaText="Scan Now" />

                <main className="space-y-20">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden bg-[#030814] text-white">
                        <Image
                            src={heroImage}
                            alt="Diagnostics"
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
                                    Pinpoint Accuracy
                                </p>
                                <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl animate-heading">
                                    ECU Diagnostics
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
                                        Stop Guessing, Start Fixing
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#5c6c86] sm:text-base md:text-lg">
                                        Modern cars are computers on wheels. When a problem arises, you need more than just a spanner; you need advanced diagnostic capability. We use state-of-the-art diagnostic tools to talk to your car's ECU, TCM, BCM, and other modules to identify faults quickly and accurately.
                                    </p>
                                </div>
                                <div className="relative overflow-hidden rounded-[20px] flex-shrink-0 animate-slide-right">
                                    <Image
                                        src={content1Image}
                                        alt="Laptop Diagnostics"
                                        width={600}
                                        height={400}
                                        className="w-full h-auto object-cover animate-image-hover"
                                    />
                                </div>
                            </div>
                            <div className="relative overflow-hidden h-[650px] rounded-[20px] border-2 border-[#1d70ff] flex animate-slide-right">
                                <Image
                                    src={content2Image}
                                    alt="Car Dashboard"
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
                                Advanced Troubleshooting
                            </h2>
                            <p className="text-base leading-relaxed text-[#0c1b33] lg:text-lg">
                                We don't just read codes; we interpret live data. By analyzing sensor outputs in real-time, we can catch intermittent faults and issues that haven't yet triggered a warning light. This preventative approach saves you money on major repairs down the line.
                            </p>
                        </div>
                    </section>

                    {/* Section 3: Key Benefits */}
                    <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
                        <div className="bg-white rounded-xl p-4 sm:rounded-2xl sm:p-6 md:rounded-[20px] md:p-8 lg:p-12">
                            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
                                <div className="space-y-4 animate-slide-left sm:space-y-5 md:space-y-6">
                                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl lg:text-4xl animate-heading">
                                        Diagnostic Services
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#0c1b33] sm:text-base md:text-lg">
                                        Comprehensive scanning for all vehicle makes and models.
                                    </p>
                                    <ul className="space-y-4">
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                                                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-base text-[#0c1b33]">Full System Scans</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                                                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-base text-[#0c1b33]">Live Data Logging</span>
                                        </li>
                                        <li className="flex items-start gap-3">
                                            <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                                                    <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                            <span className="text-base text-[#0c1b33]">Module Coding & Programming</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d70ff]">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#0c1b33]">Clear Reports</h3>
                                            <p className="mt-2 text-base text-[#0c1b33]">We explain the jargon so you know exactly what is wrong.</p>
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

