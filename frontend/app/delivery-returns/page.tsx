"use client";

import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { CONTACT_PHONE_DISPLAY } from "@/lib/constants/contact";

export default function DeliveryReturnsPage() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar ctaText="Contact Us" />

            <main>
                {/* Hero Section */}
                <section className="relative overflow-hidden bg-[#030814] text-white">
                    <Image
                        src="/images/services/Services1.png"
                        alt="Delivery & Returns"
                        width={1600}
                        height={400}
                        className="absolute inset-0 h-full w-full object-cover opacity-40"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
                    <div className="relative px-4 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24 lg:px-12">
                        <div className="mx-auto max-w-4xl text-center">
                            <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
                                Delivery & Returns
                            </h1>
                            <p className="mt-4 text-gray-300">Shipping information and return policy</p>
                        </div>
                    </div>
                </section>

                {/* Content Section */}
                <section className="px-4 py-12 sm:px-6 md:px-8 lg:px-12">
                    <div className="mx-auto max-w-4xl space-y-8">
                        {/* Delivery Section */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-[#0c1b33] border-b border-gray-200 pb-4">Delivery Information</h2>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-[#0c1b33]">UK Mainland Delivery</h3>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="bg-gray-50 rounded-xl p-5">
                                        <p className="font-semibold text-[#0c1b33]">Standard Delivery</p>
                                        <p className="text-[#5c6c86]">3-5 working days</p>
                                        <p className="text-[#1d70ff] font-bold mt-2">£4.99</p>
                                        <p className="text-sm text-[#5c6c86]">Free on orders over £50</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-5">
                                        <p className="font-semibold text-[#0c1b33]">Express Delivery</p>
                                        <p className="text-[#5c6c86]">1-2 working days</p>
                                        <p className="text-[#1d70ff] font-bold mt-2">£9.99</p>
                                        <p className="text-sm text-[#5c6c86]">Order before 2pm</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-5">
                                        <p className="font-semibold text-[#0c1b33]">Next Day Delivery</p>
                                        <p className="text-[#5c6c86]">Next working day</p>
                                        <p className="text-[#1d70ff] font-bold mt-2">£14.99</p>
                                        <p className="text-sm text-[#5c6c86]">Order before 12pm</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-xl p-5">
                                        <p className="font-semibold text-[#0c1b33]">Collection</p>
                                        <p className="text-[#5c6c86]">From our workshop</p>
                                        <p className="text-green-600 font-bold mt-2">FREE</p>
                                        <p className="text-sm text-[#5c6c86]">Chelmsford, CM2 8LD</p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-[#0c1b33]">International Delivery</h3>
                                <p className="text-[#5c6c86] leading-relaxed">
                                    We ship to most European countries. International delivery times vary between 5-14 working days depending on location. Shipping costs are calculated at checkout based on weight and destination.
                                </p>
                                <p className="text-[#5c6c86] leading-relaxed">
                                    <strong>Please note:</strong> International orders may be subject to customs duties and taxes, which are the responsibility of the customer.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-[#0c1b33]">Services & Bookings</h3>
                                <p className="text-[#5c6c86] leading-relaxed">
                                    For our workshop services (ECU remapping, dyno testing, custom exhausts, etc.), delivery does not apply. You will need to bring your vehicle to our workshop at:
                                </p>
                                <div className="bg-[#1d70ff]/5 border border-[#1d70ff]/20 rounded-xl p-5">
                                    <p className="font-semibold text-[#0c1b33]">MS Performance</p>
                                    <p className="text-[#5c6c86]">Unit 16, Bakers Ln</p>
                                    <p className="text-[#5c6c86]">Chelmsford CM2 8LD</p>
                                    <p className="text-[#5c6c86] mt-2">Mon-Sat: 9:30am - 6:00pm</p>
                                </div>
                            </div>
                        </div>

                        {/* Returns Section */}
                        <div className="space-y-6">
                            <h2 className="text-3xl font-bold text-[#0c1b33] border-b border-gray-200 pb-4">Returns Policy</h2>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-[#0c1b33]">30-Day Return Policy</h3>
                                <p className="text-[#5c6c86] leading-relaxed">
                                    We want you to be completely satisfied with your purchase. If you're not happy with your order, you can return most items within 30 days of delivery for a full refund or exchange.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-[#0c1b33]">Conditions for Returns</h3>
                                <ul className="list-disc pl-6 space-y-2 text-[#5c6c86]">
                                    <li>Items must be unused, in original packaging, and in resalable condition</li>
                                    <li>Proof of purchase is required (order confirmation or receipt)</li>
                                    <li>Return shipping costs are the responsibility of the customer unless the item is faulty</li>
                                    <li>Refunds will be processed within 5-7 working days of receiving the return</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-[#0c1b33]">Non-Returnable Items</h3>
                                <p className="text-[#5c6c86] leading-relaxed">The following items cannot be returned:</p>
                                <ul className="list-disc pl-6 space-y-2 text-[#5c6c86]">
                                    <li>Custom or bespoke products made to your specifications</li>
                                    <li>ECU tuning files and software</li>
                                    <li>Items that have been fitted to a vehicle</li>
                                    <li>Electrical components that have been opened or tested</li>
                                </ul>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-[#0c1b33]">Faulty or Damaged Items</h3>
                                <p className="text-[#5c6c86] leading-relaxed">
                                    If you receive a faulty or damaged item, please contact us within 48 hours of delivery with photos of the damage. We will arrange a free collection and send a replacement or issue a full refund.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="text-xl font-bold text-[#0c1b33]">How to Return</h3>
                                <ol className="list-decimal pl-6 space-y-2 text-[#5c6c86]">
                                    <li>Contact us at info@msperformance.co.uk with your order number</li>
                                    <li>We will provide you with a returns authorization number</li>
                                    <li>Pack the item securely in its original packaging</li>
                                    <li>Include your returns authorization number with the package</li>
                                    <li>Ship to: MS Performance, Unit 16, Bakers Ln, Chelmsford CM2 8LD</li>
                                </ol>
                            </div>
                        </div>

                        {/* Contact */}
                        <div className="bg-gray-50 rounded-xl p-6 space-y-2">
                            <p className="text-[#0c1b33] font-semibold">Need Help?</p>
                            <p className="text-[#5c6c86]">Email: info@msperformance.co.uk</p>
                            <p className="text-[#5c6c86]">Phone: {CONTACT_PHONE_DISPLAY}</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
