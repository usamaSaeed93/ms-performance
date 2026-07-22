"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";
import { useServicePageContent } from "@/hooks/useServicePageContent";

export default function PerformanceTuningPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { heroImage, content1Image, content2Image } = useServicePageImages("performance-tuning");
    const { content } = useServicePageContent("performance-tuning");

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="overflow-hidden">
                <Navbar ctaText="Tune Your Car" />

                <main className="space-y-20">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden bg-[#030814] text-white">
                        {heroImage && (
                            <Image
                                src={heroImage}
                                alt="Performance Tuning"
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
                                    {content.hero.eyebrow}
                                </p>
                                <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl animate-heading">
                                    {content.hero.title}
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
                                        {content.intro.title}
                                    </h2>
                                    {content.intro.paragraphs.map((paragraph, index) => (
                                        <p key={index} className="text-sm leading-relaxed text-[#5c6c86] sm:text-base md:text-lg">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                                <div className="relative overflow-hidden rounded-[20px] flex-shrink-0 animate-slide-right">
                                    {content1Image && (
                                        <Image
                                            src={content1Image}
                                            alt="Tuning Workshop"
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
                                        alt="Mechanic Tuning"
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
                                {content.why.title}
                            </h2>
                            <p className="text-base leading-relaxed text-[#0c1b33] lg:text-lg">
                                {content.why.paragraph}
                            </p>
                        </div>
                    </section>

                    {/* Section 3: Key Benefits */}
                    <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
                        <div className="bg-white rounded-xl p-4 sm:rounded-2xl sm:p-6 md:rounded-[20px] md:p-8 lg:p-12">
                            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
                                <div className="space-y-4 animate-slide-left sm:space-y-5 md:space-y-6">
                                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl lg:text-4xl animate-heading">
                                        {content.benefits.title}
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#0c1b33] sm:text-base md:text-lg">
                                        {content.benefits.paragraph}
                                    </p>
                                    <ul className="space-y-4">
                                        {content.benefits.bullets.map((bullet, index) => (
                                            <li key={index} className="flex items-start gap-3">
                                                <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                                                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </div>
                                                <span className="text-base text-[#0c1b33]">{bullet}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d70ff]">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                                                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-[#0c1b33]">{content.benefits.features[0].title}</h3>
                                            <p className="mt-2 text-base text-[#0c1b33]">{content.benefits.features[0].desc}</p>
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
                                {content.faq.title}
                            </h2>
                            <div className="space-y-4">
                                {content.faq.items.map((faq, index) => (
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
