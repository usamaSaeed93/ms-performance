"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
    {
        question: "What is AdBlue and why does my car need it?",
        answer:
            "AdBlue is a non-toxic aqueous urea solution injected into the exhaust stream of diesel vehicles with Selective Catalytic Reduction (SCR) systems. It converts harmful nitrogen oxides (NOx) into harmless nitrogen and water, allowing modern diesels to meet strict Euro 5 and Euro 6 emissions standards.",
    },
    {
        question: "What happens if I run out of AdBlue?",
        answer:
            "Most vehicles will warn you well before the tank is empty. Once the tank is completely dry the engine will not restart (a legal requirement in Euro 6 vehicles), so it is important to top up promptly when the warning light appears.",
    },
    {
        question: "Can the AdBlue system be deleted?",
        answer:
            "We provide delete solutions strictly for off-road, competition, or export use where local regulations permit. It is illegal to drive a vehicle with the AdBlue system disabled on UK public roads, and it will fail an MOT. We always discuss legal obligations with customers before undertaking any such work.",
    },
    {
        question: "How long does an AdBlue refill take?",
        answer:
            "A standard refill takes around 15–20 minutes including a system reset. Fault diagnosis or injector replacement will take longer — we'll advise on timing when you book.",
    },
];

const CheckIcon = () => (
    <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

export default function AdblueSolutionsPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { heroImage, content1Image, content2Image } = useServicePageImages("adblue-solutions");

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="overflow-hidden">
                <Navbar ctaText="Book a Checkup" />

                <main className="space-y-20">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden bg-[#030814] text-white">
                        {heroImage && (
                            <Image
                                src={heroImage}
                                alt="Adblue Solutions"
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
                                    SCR & AdBlue Specialists
                                </p>
                                <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl animate-heading">
                                    Adblue Solutions
                                </h1>
                                <p className="text-sm text-gray-300 sm:text-base md:text-lg animate-subtitle">
                                    Refills, fault diagnosis, injector replacement, and system resets for all diesel vehicles with SCR technology.
                                </p>
                            </div>
                        </div>
                        <div className="relative px-4 pb-8 sm:px-6 md:px-8 lg:px-12">
                            <a
                                href="/book-appointment"
                                className="inline-block rounded-xl bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(29,112,255,0.35)] hover:bg-[#1565e0] transition-colors"
                            >
                                Book a Checkup
                            </a>
                        </div>
                    </section>

                    {/* Section 1: Intro */}
                    <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                            <div className="space-y-4 flex flex-col sm:space-y-5 md:space-y-6">
                                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl lg:text-5xl">
                                        Diagnose, Fix & Reset
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#5c6c86] sm:text-base md:text-lg">
                                        AdBlue and SCR faults are among the most common warning lights on modern Euro 5 and Euro 6 diesel vehicles. Left unresolved, they can leave you stranded — many cars will simply refuse to start once the tank is empty or a sensor fault is detected. Our technicians carry specialist diagnostic tools to identify the exact cause, top up the fluid correctly, and clear faults so you can get back on the road without delay.
                                    </p>
                                </div>
                                <div className="relative overflow-hidden rounded-[20px] flex-shrink-0 animate-slide-right">
                                    {content1Image && (
                                        <Image
                                            src={content1Image}
                                            alt="AdBlue System"
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
                                        alt="Diagnostics"
                                        width={600}
                                        height={400}
                                        className="w-full h-auto object-cover animate-image-hover"
                                    />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Why us */}
                    <section className="px-8 py-10 lg:px-12">
                        <div className="mx-auto max-w-4xl text-center space-y-6">
                            <h2 className="text-4xl font-black text-[#0c1b33] lg:text-5xl">
                                Dealer-Level Diagnostics
                            </h2>
                            <p className="text-base leading-relaxed text-[#0c1b33] lg:text-lg">
                                We use the same OBD and manufacturer-specific tools as main dealers to read AdBlue level sensors, NOx sensors, SCR catalyst efficiency, and injector health — giving us a complete picture before we recommend any repair.
                            </p>
                        </div>
                    </section>

                    {/* Section 3: Services */}
                    <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
                        <div className="bg-white rounded-xl p-4 sm:rounded-2xl sm:p-6 md:rounded-[20px] md:p-8 lg:p-12">
                            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
                                <div className="space-y-4 animate-slide-left sm:space-y-5 md:space-y-6">
                                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl animate-heading">
                                        What We Offer
                                    </h2>
                                    <ul className="space-y-4">
                                        {["AdBlue tank refill", "SCR & NOx sensor diagnostics", "Injector replacement & testing", "System fault code clearing", "AdBlue pump & module replacement"].map((item) => (
                                            <li key={item} className="flex items-start gap-3">
                                                <CheckIcon />
                                                <span className="text-base text-[#0c1b33]">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-8">
                                    {[
                                        { icon: "💧", title: "AdBlue Refill", desc: "Correct-grade solution filled to the manufacturer spec with a system reset." },
                                        { icon: "🔍", title: "Fault Diagnosis", desc: "Full SCR system scan — sensors, injector, pump, and tank level check." },
                                        { icon: "🔧", title: "Component Repair", desc: "Injector, pump, and NOx sensor replacement using quality parts." },
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
