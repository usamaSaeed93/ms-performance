"use client";

import Image from "next/image";
import { Navbar } from "@/components/Navbar";

export default function TermsConditionsPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar ctaText="Contact Us" />

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-[#030814] text-white">
                    <Image
                        src="/images/services/our-services.png"
                        alt="Terms & Conditions"
                        width={1600}
                        height={400}
                        className="absolute inset-0 h-full w-full object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
                    <div className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                                Terms & Conditions
                            </h1>
                            <p className="mt-4 text-gray-300">Last updated: December 2024</p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="px-4 py-12 sm:px-6 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-4xl space-y-8">
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">1. Introduction</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                These Terms and Conditions govern your use of the MS Performance website and services. By accessing our website or using our services, you agree to be bound by these terms. If you do not agree with any part of these terms, please do not use our services.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">2. Services</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                MS Performance provides vehicle tuning, performance modification, and related automotive services including but not limited to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-[#5c6c86]">
                                <li>ECU remapping and tuning</li>
                                <li>Dyno testing and calibration</li>
                                <li>Custom exhaust fabrication</li>
                                <li>DPF and EGR services</li>
                                <li>Turbo upgrades and installation</li>
                                <li>Performance parts sales</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">3. Bookings & Appointments</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                All bookings are subject to availability. A deposit may be required to secure your booking. Cancellations must be made at least 48 hours in advance for a full refund of any deposit. Late cancellations or no-shows may result in forfeiture of the deposit.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">4. Pricing & Payment</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                All prices are displayed in British Pounds (GBP) and include VAT where applicable. We reserve the right to change prices at any time, though confirmed bookings will be honored at the quoted price.
                            </p>
                            <p className="text-[#5c6c86] leading-relaxed">
                                We accept the following payment methods:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-[#5c6c86]">
                                <li>Credit and debit cards (Visa, Mastercard)</li>
                                <li>Stripe payments</li>
                                <li>Cash on Delivery (for certain products)</li>
                                <li>Bank transfer</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">5. Vehicle Requirements</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                For all services, your vehicle must be presented in a roadworthy condition with valid MOT and insurance. We reserve the right to refuse service if the vehicle is deemed unsafe or if pre-existing faults could affect our work.
                            </p>
                            <p className="text-[#5c6c86] leading-relaxed">
                                You are responsible for ensuring your vehicle has adequate fuel for testing purposes. Diesel vehicles should have at least a quarter tank; performance testing may require more.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">6. Warranties</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                <strong>Tuning Services:</strong> Our ECU remaps come with a lifetime software warranty. If your ECU is reset or overwritten by a dealer, we will reinstall your map free of charge (labour charges may apply).
                            </p>
                            <p className="text-[#5c6c86] leading-relaxed">
                                <strong>Parts:</strong> All parts sold carry the manufacturer's warranty. Custom fabricated parts (e.g., exhausts) carry a 12-month warranty against manufacturing defects.
                            </p>
                            <p className="text-[#5c6c86] leading-relaxed">
                                Warranties do not cover damage resulting from misuse, accidents, racing, or failure to maintain the vehicle properly.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">7. Customer Responsibilities</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                By using our services, you agree to:
                            </p>
                            <ul className="list-disc pl-6 space-y-2 text-[#5c6c86]">
                                <li>Inform your insurance company of any modifications</li>
                                <li>Ensure the vehicle is legally roadworthy</li>
                                <li>Provide accurate information about your vehicle</li>
                                <li>Collect your vehicle within 24 hours of service completion (storage fees may apply after this period)</li>
                            </ul>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">8. Online Store</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                Products purchased through our online store are subject to our Delivery & Returns policy. Product images are for illustration purposes and actual items may vary slightly. We make every effort to display accurate product information.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">9. Limitation of Liability</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                MS Performance shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our services. Our total liability for any claim shall not exceed the amount paid for the service in question.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">10. Intellectual Property</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                All tuning files, software, and calibration data remain the intellectual property of MS Performance. You are granted a non-transferable license to use the tuning on the vehicle for which it was purchased. Redistribution or resale of tuning files is prohibited.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">11. Privacy</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                Your use of our services is also governed by our Privacy Policy, which explains how we collect, use, and protect your personal information.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">12. Modifications to Terms</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated revision date. Continued use of our services after changes are posted constitutes acceptance of the new terms.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">13. Governing Law</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                These terms are governed by and construed in accordance with the laws of England and Wales. Any disputes shall be subject to the exclusive jurisdiction of the courts of England and Wales.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">14. Contact</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                If you have any questions about these Terms & Conditions, please contact us:
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
