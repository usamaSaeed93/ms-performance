"use client";

import Image from "next/image";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube, Phone, Mail } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-[#00b8ff] px-8 py-12 bg-white font-sans">
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr_1.5fr_1.5fr_1fr]">
                {/* Column 1: Logo, Text, Payment */}
                <div className="space-y-6">
                    <Link href="/">
                        <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={180} height={54} />
                    </Link>
                    <p className="text-sm leading-relaxed text-[#5c6c86] max-w-sm">
                        At MSPerformance, we specialize in car performance boosting services, ranging from ECU
                        remapping to custom exhausts. With our wealth of experience, we also offer comprehensive
                        basic servicing to ensure the overall maintenance and reliability of your vehicle.
                    </p>
                    <div className="flex items-center gap-2 pt-2">
                        {/* WorldPay Logo (Placeholder) + Card Logos */}
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold text-blue-900 border-r border-gray-300 pr-2 mr-1">
                                WorldPay
                            </span>
                            <Image
                                src="/images/payment/mastercard.png"
                                alt="Mastercard"
                                width={32}
                                height={20}
                                className="object-contain"
                            />
                            <Image
                                src="/images/payment/visa.jpg"
                                alt="Visa"
                                width={32}
                                height={20}
                                className="object-contain"
                            />
                            <Image
                                src="/images/payment/stripe.png"
                                alt="Stripe"
                                width={40}
                                height={20}
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>

                {/* Column 2: Address */}
                <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-bold text-[#0c1b33]">Our headquarters address is:</h3>
                    <p className="text-sm text-[#5c6c86] leading-relaxed">
                        Unit 16, Bakers Ln, Chelmsford CM2 8LD
                    </p>
                </div>

                {/* Column 3: Subscription */}
                <div className="space-y-4 pt-2">
                    <h3 className="flex items-center gap-2 text-base font-bold text-[#0c1b33]">
                        <span className="h-4 w-[3px] bg-[#00b8ff]" />
                        Mailing Subscription
                    </h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Your Name"
                            className="w-full rounded-full border border-[#dfe6f2] px-5 py-2.5 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#00b8ff] focus:outline-none"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            className="w-full rounded-full border border-[#dfe6f2] px-5 py-2.5 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#00b8ff] focus:outline-none"
                        />
                        <button className="w-full rounded-full bg-[#00b8ff] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#00b8ff]/90">
                            Subscribe
                        </button>
                    </div>
                </div>

                {/* Column 4: Contact Info */}
                <div className="space-y-5 pt-2">
                    <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-[#00b8ff] mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-[#5c6c86]">0775 1798827 / 01277 715069</p>
                            <p className="text-xs text-[#9aa6bd]">Mon till Sat: 9:30 till 18:00</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-[#00b8ff] mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-[#5c6c86]">info@msperformance.co.uk</p>
                            <p className="text-xs text-[#9aa6bd]">We reply within 1 day</p>
                        </div>
                    </div>
                    <div className="space-y-0.5">
                        <h4 className="text-sm font-bold text-[#0c1b33]">For overseas customers:</h4>
                        <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4 text-[#00b8ff]" />
                            <p className="text-sm text-[#5c6c86]">+44 (0)1637 875 209</p>
                        </div>
                    </div>
                </div>

                {/* Column 5: Follow Us */}
                <div className="space-y-4 pt-2">
                    <h3 className="flex items-center gap-2 text-base font-bold text-[#0c1b33]">
                        <span className="h-4 w-[3px] bg-[#00b8ff]" />
                        Follow us
                    </h3>
                    <div className="space-y-3">
                        <a href="#" className="flex items-center gap-3 text-sm text-[#5c6c86] transition hover:text-[#00b8ff] group">
                            <div className="rounded-full bg-[#00b8ff] p-1 text-white group-hover:bg-[#00b8ff]/80">
                                <Facebook className="h-3.5 w-3.5 fill-current" />
                            </div>
                            <span>Facebook</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 text-sm text-[#5c6c86] transition hover:text-[#00b8ff] group">
                            <div className="rounded-full bg-[#00b8ff] p-1 text-white group-hover:bg-[#00b8ff]/80">
                                <Youtube className="h-3.5 w-3.5 fill-current" />
                            </div>
                            <span>YouTube</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 text-sm text-[#5c6c86] transition hover:text-[#00b8ff] group">
                            <div className="rounded-full bg-[#00b8ff] p-1 text-white group-hover:bg-[#00b8ff]/80">
                                <Twitter className="h-3.5 w-3.5 fill-current" />
                            </div>
                            <span>Twitter</span>
                        </a>
                        <a href="#" className="flex items-center gap-3 text-sm text-[#5c6c86] transition hover:text-[#00b8ff] group">
                            <div className="rounded-full bg-[#00b8ff] p-1 text-white group-hover:bg-[#00b8ff]/80">
                                <Instagram className="h-3.5 w-3.5" />
                            </div>
                            <span>Instagram</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-[#dfe6f2] pt-8">
                <p className="text-sm text-[#5c6c86]">© Copyright 2025 MSPerformance</p>
                <div className="flex flex-wrap items-center gap-1 text-sm text-[#5c6c86]">
                    <Link href="/privacy-policy" className="hover:text-[#00b8ff]">
                        Privacy Policy
                    </Link>
                    <span className="px-2 text-[#dfe6f2]">|</span>
                    <Link href="/delivery-returns" className="hover:text-[#00b8ff]">
                        Delivery & Returns
                    </Link>
                    <span className="px-2 text-[#dfe6f2]">|</span>
                    <Link href="/legal-information" className="hover:text-[#00b8ff]">
                        Legal Information
                    </Link>
                    <span className="px-2 text-[#dfe6f2]">|</span>
                    <Link href="/terms-conditions" className="hover:text-[#00b8ff]">
                        Terms & Conditions
                    </Link>
                </div>
            </div>
        </footer>
    );
}
