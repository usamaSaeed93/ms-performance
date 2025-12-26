"use client";

import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { services as baseServices } from "@/lib/constants/services";

export default function ServicesPage() {
    // Combine base services with the additional ones
    const allServices = [
        ...baseServices,
        {
            title: "Turbo Upgrades",
            description: "Enhanced turbo systems for maximum power and reliability.",
            image: "/images/services/Services.png",
        },
        {
            title: "Performance Tuning",
            description: "Professional engine tuning for optimal performance gains.",
            image: "/images/services/Services1.png",
        },
        {
            title: "ECU Diagnostics",
            description: "Comprehensive ECU diagnostics and fault code reading.",
            image: "/images/services/our-service.png",
        },
        {
            title: "Stage Upgrades",
            description: "Complete stage upgrade packages for your vehicle.",
            image: "/images/services/our-services.png",
        },
    ];

    const getServiceLink = (title: string) => {
        switch (title) {
            case "ECU Remapping": return "/services/ecu-remapping";
            case "Dyno Tests": return "/services/dyno-tests";
            case "Custom Exhausts": return "/services/custom-exhausts";
            case "DPF & EGR Services": return "/services/dpf-egr-services";
            case "Turbo Upgrades": return "/services/turbo-upgrades";
            case "Performance Tuning": return "/services/performance-tuning";
            case "ECU Diagnostics": return "/services/ecu-diagnostics";
            case "Stage Upgrades": return "/services/stage-upgrades";
            default: return "/services";
        }
    };

    return (
        <div className="min-h-screen bg-black">
            <Navbar ctaText="Contact Us" />

            <main className="space-y-20 pb-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-[#030814] text-white">
                    <Image
                        src="/images/services/Services.png"
                        alt="Our Services"
                        width={1600}
                        height={700}
                        className="absolute inset-0 h-full w-full object-cover opacity-60"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/50 to-black" />
                    <div className="relative px-4 py-20 sm:px-6 sm:py-24 md:px-8 md:py-32 lg:px-12">
                        <div className="space-y-4 max-w-4xl mx-auto text-center sm:space-y-6">
                            <p className="text-xs font-semibold tracking-[0.2em] text-[#1d70ff] uppercase sm:text-sm animate-subtitle">
                                Expert Solutions
                            </p>
                            <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl lg:text-7xl animate-heading">
                                Our Premium Services
                            </h1>
                            <p className="mx-auto max-w-2xl text-base text-gray-300 sm:text-lg md:text-xl">
                                From simple diagnostics to full competition builds, we have the tools, expertise, and passion to take your vehicle to the next level.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Services Grid */}
                <section className="px-4 sm:px-6 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-7xl">
                        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {allServices.map((service, index) => (
                                <Link
                                    key={service.title}
                                    href={getServiceLink(service.title)}
                                    className={`group flex flex-col gap-4 rounded-2xl bg-[#0a0a0a] p-4 transition-all duration-300 hover:-translate-y-1 hover:bg-[#111] hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-white/5 sm:rounded-[24px] sm:p-5 card-hover ${index % 4 === 0 ? 'animate-card' :
                                            index % 4 === 1 ? 'animate-card-delay-1' :
                                                index % 4 === 2 ? 'animate-card-delay-2' :
                                                    'animate-card-delay-3'
                                        }`}
                                >
                                    <div className="relative overflow-hidden rounded-[16px] aspect-[4/3]">
                                        <Image
                                            src={service.image}
                                            alt={service.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                                    </div>

                                    <div className="flex flex-1 flex-col space-y-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-[#1d70ff] transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-gray-400 line-clamp-3">
                                            {service.description}
                                        </p>

                                        <div className="mt-auto pt-4">
                                            <div className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-white/5 px-4 py-3 text-sm font-semibold text-white transition-all group-hover:bg-[#1d70ff] group-hover:text-white">
                                                Learn More
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="transition-transform group-hover:translate-x-1">
                                                    <path d="M5 12h14m-7-7l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="border-t border-white/10 px-8 py-12 bg-black">
                    <div className="mx-auto max-w-7xl grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
                        <div className="space-y-4">
                            <Link href="/">
                                <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={160} height={48} />
                            </Link>
                            <p className="text-sm leading-relaxed text-gray-400">
                                At MSPerformance, we specialize in car performance boosting services, ranging from ECU
                                remapping to custom exhausts. We provide expert care for every vehicle that enters our workshop.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Contact</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Unit 16, Bakers Ln</li>
                                <li>Chelmsford CM2 8LD</li>
                                <li className="text-[#1d70ff]">0775 179 8827</li>
                                <li className="text-[#1d70ff]">info@msperformance.co.uk</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Hours</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li>Mon - Fri: 9:30 - 18:00</li>
                                <li>Saturday: 9:30 - 16:00</li>
                                <li>Sunday: Closed</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Legal</h3>
                            <ul className="space-y-2 text-sm text-gray-400">
                                <li><a href="#" className="hover:text-[#1d70ff]">Privacy Policy</a></li>
                                <li><a href="#" className="hover:text-[#1d70ff]">Terms & Conditions</a></li>
                                <li><a href="#" className="hover:text-[#1d70ff]">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mx-auto max-w-7xl mt-12 pt-8 border-t border-white/5 text-center text-sm text-gray-500">
                        <p>© Copyright 2025 MSPerformance. All rights reserved.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}
