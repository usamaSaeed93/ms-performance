"use client";

import Image from "next/image";
import { Navbar } from "@/components/Navbar";

export default function PrivacyPolicyPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar ctaText="Contact Us" />

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-[#030814] text-white">
                    <Image
                        src="/images/services/Services.png"
                        alt="Privacy Policy"
                        width={1600}
                        height={400}
                        className="absolute inset-0 h-full w-full object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
                    <div className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                                Privacy Policy
                            </h1>
                            <p className="mt-4 text-gray-300">Last updated: May 2026</p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="px-4 py-12 sm:px-6 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-4xl space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">1. Introduction</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                MS Performance Ltd ("we", "our", or "us") is committed to protecting the privacy of our customers and website visitors. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our services.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">2. Information We Collect</h2>
                            <p className="text-[#5c6c86] leading-relaxed">We may collect the following types of information:</p>
                            <ul className="list-disc pl-6 space-y-2 text-[#5c6c86]">
                                <li><strong>Personal Information:</strong> Name, email address, phone number, postal address, and payment details when you make a purchase or booking.</li>
                                <li><strong>Vehicle Information:</strong> Make, model, registration number, and VIN for service purposes.</li>
                                <li><strong>Technical Data:</strong> IP address, browser type, device information, and cookies when you visit our website.</li>
                                <li><strong>Communication Data:</strong> Records of correspondence when you contact us.</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">3. How We Use Your Information</h2>
                            <p className="text-[#5c6c86] leading-relaxed">We use the information we collect to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-[#5c6c86]">
                                <li>Process orders and provide our tuning and performance services</li>
                                <li>Communicate with you about your bookings and orders</li>
                                <li>Send promotional materials (with your consent)</li>
                                <li>Improve our website and services</li>
                                <li>Comply with legal obligations</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">4. Data Sharing</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                We do not sell your personal information. We may share your data with trusted third parties who assist us in operating our business, such as payment processors (Stripe), shipping carriers, and marketing platforms. All third parties are required to maintain the confidentiality of your information.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">5. Data Security</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted using SSL technology.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">6. Your Rights</h2>
                            <p className="text-[#5c6c86] leading-relaxed">Under GDPR, you have the right to:</p>
                            <ul className="list-disc pl-6 space-y-2 text-[#5c6c86]">
                                <li>Access your personal data</li>
                                <li>Rectify inaccurate data</li>
                                <li>Request deletion of your data</li>
                                <li>Object to processing of your data</li>
                                <li>Data portability</li>
                                <li>Withdraw consent at any time</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">7. Cookies</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                Our website uses cookies to enhance your browsing experience. You can control cookie settings through your browser preferences. Essential cookies are required for the website to function properly.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">8. Contact Us</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                If you have any questions about this Privacy Policy or wish to exercise your rights, please contact us at:
                            </p>
                            <div className="bg-gray-50 rounded-xl p-6 space-y-2">
                                <p className="text-[#0c1b33] font-semibold">MS Performance Ltd</p>
                                <p className="text-[#5c6c86]">Unit 16, Bakers Ln, Chelmsford CM2 8LD</p>
                                <p className="text-[#5c6c86]">Email: info@msperformance.co.uk</p>
                                <p className="text-[#5c6c86]">Phone: 0775 179 8827</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
