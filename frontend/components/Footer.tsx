"use client";

import Image from "next/image";
import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-[#1d70ff]/100 px-8 py-12 bg-white">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
                <div className="space-y-4">
                    <Link href="/">
                        <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={160} height={48} />
                    </Link>
                    <p className="text-sm leading-relaxed text-[#5c6c86]">
                        At MSPerformance, we specialize in car performance boosting services, ranging from ECU
                        remapping to custom exhausts. With our wealth of experience, we also offer comprehensive
                        basic servicing to ensure the overall maintenance and reliability of your vehicle.
                    </p>
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                        <span className="text-xs font-semibold text-[#9aa6bd]">Payment Methods:</span>
                        <div className="flex flex-wrap items-center gap-3">
                            {/* Stripe Logo */}
                            <div className="flex items-center gap-1 bg-gray-50 rounded px-2 py-1">
                                <Image
                                    src="/images/payment/stripe.png"
                                    alt="Stripe"
                                    width={50}
                                    height={20}
                                    className="object-contain"
                                />
                            </div>
                            {/* Visa Icon */}
                            <div className="flex items-center bg-gray-50 rounded px-2 py-1">
                                <Image
                                    src="/images/payment/visa.jpg"
                                    alt="Visa"
                                    width={38}
                                    height={24}
                                    className="object-contain"
                                />
                            </div>
                            {/* Mastercard Icon */}
                            <div className="flex items-center bg-gray-50 rounded px-2 py-1">
                                <Image
                                    src="/images/payment/mastercard.png"
                                    alt="Mastercard"
                                    width={38}
                                    height={24}
                                    className="object-contain"
                                />
                            </div>
                            {/* Cash on Delivery Icon */}
                            <div className="flex items-center gap-1 bg-green-50 border border-green-200 rounded px-2 py-1">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-green-600">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z" fill="currentColor" />
                                </svg>
                                <span className="text-xs font-medium text-green-700">COD</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-[#0c1b33]">Our headquarters address is:</h3>
                    <p className="text-sm text-[#5c6c86]">Unit 16, Bakers Ln, Chelmsford CM2 8LD</p>
                </div>

                <div className="space-y-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-[#0c1b33]">
                        <span className="h-4 w-px bg-[#1d70ff]" />
                        Mailing Subscription
                    </h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full rounded-[8px] border border-[#dfe6f2] px-4 py-3 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full rounded-[8px] border border-[#dfe6f2] px-4 py-3 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none"
                        />
                        <button className="w-full rounded-[8px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white">
                            Subscribe
                        </button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-[#5c6c86]">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                                <path
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                    fill="currentColor"
                                />
                            </svg>
                            <span>07751798603 / 01297715060</span>
                        </div>
                        <p className="text-xs text-[#9aa6bd]">Mon till Sat: 9:30 till 18:00</p>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-[#5c6c86]">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                                <path
                                    d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.51l8 5.33 8-5.33V6H4zm0 12h16V9.49l-8 5.33-8-5.33V18z"
                                    fill="currentColor"
                                />
                            </svg>
                            <span>info@msperformance.co.uk</span>
                        </div>
                        <p className="text-xs text-[#9aa6bd]">We reply within 1 day</p>
                        <p className="text-xs text-[#5c6c86]">For overseas customers: +44 (0)1687 675-209</p>
                    </div>
                    <div className="pt-4">
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0c1b33]">
                            <span className="h-4 w-px bg-[#1d70ff]" />
                            Follow us
                        </h3>
                        <div className="space-y-2">
                            {["Facebook", "YouTube", "Twitter", "Instagram"].map((social) => (
                                <a
                                    key={social}
                                    href="#"
                                    className="flex items-center gap-2 text-sm text-[#5c6c86] transition hover:text-[#1d70ff]"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    <span>{social}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#dfe6f2] pt-6">
                <p className="text-sm text-[#5c6c86]">© Copyright 2025 MSPerformance</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#5c6c86]">
                    <Link href="/privacy-policy" className="hover:text-[#1d70ff]">
                        Privacy Policy
                    </Link>
                    <span className="text-[#dfe6f2]">|</span>
                    <Link href="/delivery-returns" className="hover:text-[#1d70ff]">
                        Delivery & Returns
                    </Link>
                    <span className="text-[#dfe6f2]">|</span>
                    <Link href="/legal-information" className="hover:text-[#1d70ff]">
                        Legal Information
                    </Link>
                    <span className="text-[#dfe6f2]">|</span>
                    <Link href="/terms-conditions" className="hover:text-[#1d70ff]">
                        Terms & Conditions
                    </Link>
                </div>
            </div>
        </footer>
    );
}
