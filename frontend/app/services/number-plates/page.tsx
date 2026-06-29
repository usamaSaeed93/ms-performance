"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
    {
        question: "Are your number plates road-legal?",
        answer:
            "Yes. All standard number plates we produce meet current UK DVLA regulations — correct font (Charles Wright), reflective background, and BS AU 145e compliance. Show plates are marked accordingly and supplied for display purposes only.",
    },
    {
        question: "Can I get a custom shaped or 4D plate?",
        answer:
            "Absolutely. We offer gel (3D) and acrylic (4D) raised-letter plates in a variety of styles. These remain road-legal as long as the characters and spacing conform to DVLA standards.",
    },
    {
        question: "What do I need to bring to order road-legal plates?",
        answer:
            "UK law requires proof of entitlement (V5C logbook, new keeper slip, or insurance certificate) and valid photographic ID (driving licence or passport). Without these we can only produce show plates.",
    },
    {
        question: "How quickly can I get my plates?",
        answer:
            "Standard plates are usually ready the same day or next working day. Custom 3D/4D plates typically take 2–3 working days. We'll confirm turnaround when you place your order.",
    },
];

const CheckIcon = () => (
    <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
            <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    </div>
);

export default function NumberPlatesPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);
    const { heroImage, content1Image, content2Image } = useServicePageImages("number-plates");

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="overflow-hidden">
                <Navbar ctaText="Order Plates" />

                <main className="space-y-20">
                    {/* Hero Section */}
                    <section className="relative overflow-hidden bg-[#030814] text-white">
                        {heroImage && (
                            <Image
                                src={heroImage}
                                alt="Number Plates"
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
                                    Road-Legal & Show Plates
                                </p>
                                <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl animate-heading">
                                    Number Plates
                                </h1>
                                <p className="text-sm text-gray-300 sm:text-base md:text-lg animate-subtitle">
                                    Standard, 3D gel, and 4D acrylic number plates made to order — road-legal and show styles available.
                                </p>
                            </div>
                        </div>
                        <div className="relative px-4 pb-8 sm:px-6 md:px-8 lg:px-12">
                            <a
                                href="/contact-us"
                                className="inline-block rounded-xl bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(29,112,255,0.35)] hover:bg-[#1565e0] transition-colors"
                            >
                                Get a Quote
                            </a>
                        </div>
                    </section>

                    {/* Section 1: Intro */}
                    <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
                        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                            <div className="space-y-4 flex flex-col sm:space-y-5 md:space-y-6">
                                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl lg:text-5xl">
                                        Plates That Make an Impression
                                    </h2>
                                    <p className="text-sm leading-relaxed text-[#5c6c86] sm:text-base md:text-lg">
                                        Whether you need a straightforward replacement set or want to make a statement with premium 3D gel or 4D acrylic lettering, we have you covered. All road-legal plates are produced in accordance with current DVLA standards, and show plates are clearly marked for display use only.
                                    </p>
                                </div>
                                <div className="relative overflow-hidden rounded-[20px] flex-shrink-0 animate-slide-right">
                                    {content1Image && (
                                        <Image
                                            src={content1Image}
                                            alt="Number Plate Example"
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
                                        alt="Custom Plates"
                                        width={600}
                                        height={400}
                                        className="w-full h-auto object-cover animate-image-hover"
                                    />
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Section 2: Styles */}
                    <section className="px-8 py-10 lg:px-12">
                        <div className="mx-auto max-w-4xl text-center space-y-6">
                            <h2 className="text-4xl font-black text-[#0c1b33] lg:text-5xl">
                                Every Style, Every Finish
                            </h2>
                            <p className="text-base leading-relaxed text-[#0c1b33] lg:text-lg">
                                From the classic flat plate to eye-catching 4D raised characters, we produce plates that complement your vehicle and reflect your personality — without ever compromising on legality.
                            </p>
                        </div>
                    </section>

                    {/* Section 3: Options */}
                    <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
                        <div className="bg-white rounded-xl p-4 sm:rounded-2xl sm:p-6 md:rounded-[20px] md:p-8 lg:p-12">
                            <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
                                <div className="space-y-4 animate-slide-left sm:space-y-5 md:space-y-6">
                                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl animate-heading">
                                        Available Options
                                    </h2>
                                    <ul className="space-y-4">
                                        {["Standard flat road-legal plates", "3D gel raised characters", "4D acrylic laser-cut characters", "Custom show plates (any background)", "Motorcycle & trailer plates"].map((item) => (
                                            <li key={item} className="flex items-start gap-3">
                                                <CheckIcon />
                                                <span className="text-base text-[#0c1b33]">{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="space-y-8">
                                    {[
                                        { icon: "🔵", title: "Standard Plates", desc: "Flat reflective plates fully compliant with BS AU 145e, ready same day." },
                                        { icon: "✨", title: "3D Gel Plates", desc: "Gloss gel domes give characters a striking raised look while staying road-legal." },
                                        { icon: "⬛", title: "4D Plates", desc: "Laser-cut acrylic characters bonded to the plate for maximum depth and impact." },
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
