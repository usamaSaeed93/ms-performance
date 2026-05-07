"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { services as baseServices } from "@/lib/constants/services";
import { useGetServicesQuery } from "@/lib/store/api/servicesApi";

export default function ServicesPage() {
    const { data: servicesData } = useGetServicesQuery();

    // Use API data with dynamic images, fallback to static
    const allServices = useMemo(() => {
        const excludedTitles = new Set([
            "ECU Diagnostics",
            "Stage Upgrades",
            "Performance Tuning",
        ]);
        if (servicesData && servicesData.length > 0) {
            return servicesData
                .filter((service) => !excludedTitles.has(service.title))
                .map(s => ({
                    ...s,
                    image: s.image_url || `/images/services/IMG_4403.png`,
                }));
        }
        // Fallback to static data
        return [
            ...baseServices,
            {
                title: "Servicing",
                description: "Enhanced turbo systems for maximum power and reliability.",
                image: "/images/services/IMG_4403.png",
            },
        ].filter((service) => !excludedTitles.has(service.title));
    }, [servicesData]);

    const getServiceLink = (title: string, apiLink?: string) => {
        // Use API-provided link if available
        if (apiLink) return apiLink;
        // Fallback for static data
        switch (title) {
            case "ECU Remapping": return "/services/ecu-remapping";
            case "Dyno Tests": return "/services/dyno-tests";
            case "Custom Exhausts": return "/services/custom-exhausts";
            case "DPF & EGR Services": return "/services/dpf-egr-services";
            case "Turbo Upgrades": return "/services/servicing";
            case "Servicing": return "/services/servicing";
            default: return "/services";
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar ctaText="Contact Us" />

            <main className="space-y-20 pb-20">
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-[#030814] text-white">
                    <Image
                        src="/images/services/IMG_4394.png"
                        alt="Our Services"
                        width={1600}
                        height={700}
                        className="absolute inset-0 h-full w-full object-cover object-center scale-110 origin-center opacity-60"
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
                                    href={getServiceLink(service.title, service.link)}
                                    className={`group flex flex-col gap-4 rounded-2xl bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-gray-100 sm:rounded-[24px] sm:p-5 shadow-sm card-hover ${index % 4 === 0 ? 'animate-card' :
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
                                        <h3 className="text-xl font-bold text-[#0c1b33] group-hover:text-[#1d70ff] transition-colors">
                                            {service.title}
                                        </h3>
                                        <p className="text-sm text-[#5c6c86] line-clamp-3">
                                            {service.description}
                                        </p>

                                        <div className="mt-auto pt-4">
                                            <div className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-gray-100 px-4 py-3 text-sm font-semibold text-[#0c1b33] transition-all group-hover:bg-[#1d70ff] group-hover:text-white">
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
            </main>
        </div>
    );
}
