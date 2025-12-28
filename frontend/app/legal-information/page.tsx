"use client";

import Image from "next/image";
import { Navbar } from "@/components/Navbar";

export default function LegalInformationPage() {
    return (
        <div className="min-h-screen bg-white">
            <Navbar ctaText="Contact Us" />

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-[#030814] text-white">
                    <Image
                        src="/images/services/our-service.png"
                        alt="Legal Information"
                        width={1600}
                        height={400}
                        className="absolute inset-0 h-full w-full object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
                    <div className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                                Legal Information
                            </h1>
                            <p className="mt-4 text-gray-300">Company information and regulatory compliance</p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="px-4 py-12 sm:px-6 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-4xl space-y-8">
                        {/* Company Information */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">Company Information</h2>
                            <div className="bg-gray-50 rounded-xl p-6 space-y-2">
                                <p className="text-[#0c1b33] font-semibold text-lg">MS Performance Ltd</p>
                                <p className="text-[#5c6c86]">Registered Address: Unit 16, Bakers Ln, Chelmsford CM2 8LD</p>
                                <p className="text-[#5c6c86]">Company Registration Number: [Company Number]</p>
                                <p className="text-[#5c6c86]">VAT Registration Number: [VAT Number]</p>
                            </div>
                        </div>

                        {/* ECU Remapping Legal Notice */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">ECU Remapping & Vehicle Modifications</h2>
                            <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 space-y-4">
                                <p className="text-amber-800 font-semibold">Important Legal Notice</p>
                                <p className="text-[#5c6c86] leading-relaxed">
                                    ECU remapping and performance modifications may affect your vehicle's warranty. We recommend discussing any modifications with your vehicle manufacturer or dealer before proceeding. MS Performance is not responsible for any warranty claims denied by manufacturers as a result of our services.
                                </p>
                            </div>
                            <p className="text-[#5c6c86] leading-relaxed">
                                All ECU remapping services provided by MS Performance are designed to work within safe operational parameters. However, increased performance may result in increased wear on engine components. We recommend regular maintenance and servicing to ensure longevity.
                            </p>
                        </div>

                        {/* Insurance Notification */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">Insurance Requirements</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                <strong>Important:</strong> You are legally required to inform your insurance provider of any modifications made to your vehicle, including ECU remapping. Failure to disclose modifications may invalidate your insurance policy. MS Performance provides documentation of all work carried out for your records.
                            </p>
                        </div>

                        {/* Emissions Compliance */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">Emissions & MOT Compliance</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                All our tuning solutions are designed to comply with UK emissions regulations for road-legal vehicles. We do not offer DPF or catalytic converter removal for road-going vehicles as this is illegal under UK law. Such modifications are only available for off-road or motorsport use.
                            </p>
                            <p className="text-[#5c6c86] leading-relaxed">
                                Vehicles modified by MS Performance should continue to pass MOT emissions tests. However, if you have any concerns, we are happy to assist with pre-MOT checks.
                            </p>
                        </div>

                        {/* Liability */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">Limitation of Liability</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                While we take every precaution to ensure the quality and safety of our work, MS Performance's liability is limited to the value of the services provided. We are not liable for any indirect, incidental, or consequential damages arising from the use of our services.
                            </p>
                            <p className="text-[#5c6c86] leading-relaxed">
                                Our services are provided "as is" and we make no warranties regarding specific performance gains, as results may vary depending on vehicle condition, fuel quality, and environmental factors.
                            </p>
                        </div>

                        {/* Intellectual Property */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">Intellectual Property</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                All content on this website, including text, graphics, logos, images, and software, is the property of MS Performance Ltd and is protected by copyright and intellectual property laws. Unauthorized use or reproduction is prohibited.
                            </p>
                        </div>

                        {/* Dispute Resolution */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">Dispute Resolution</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                Any disputes arising from our services will be governed by English law and subject to the exclusive jurisdiction of the courts of England and Wales. We encourage customers to contact us directly to resolve any issues before pursuing legal action.
                            </p>
                        </div>

                        {/* Consumer Rights */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-bold text-[#0c1b33]">Your Consumer Rights</h2>
                            <p className="text-[#5c6c86] leading-relaxed">
                                Nothing in these terms affects your statutory rights as a consumer under the Consumer Rights Act 2015. You have the right to receive services that are carried out with reasonable care and skill.
                            </p>
                        </div>

                        {/* Contact */}
                        <div className="bg-gray-50 rounded-xl p-6 space-y-2">
                            <p className="text-[#0c1b33] font-semibold">Legal Inquiries</p>
                            <p className="text-[#5c6c86]">Email: info@msperformance.co.uk</p>
                            <p className="text-[#5c6c86]">Address: Unit 16, Bakers Ln, Chelmsford CM2 8LD</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
