"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Phone, Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCreateMailingSubscriptionMutation } from "@/lib/store/api/mailingApi";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, CONTACT_PHONE_2_DISPLAY, CONTACT_PHONE_2_TEL, CONTACT_EMAIL, CONTACT_EMAIL_MAILTO } from "@/lib/constants/contact";

export function Footer() {
    const [subscriberName, setSubscriberName] = useState("");
    const [subscriberEmail, setSubscriberEmail] = useState("");
    const [createSubscription, { isLoading }] = useCreateMailingSubscriptionMutation();

    const handleSubscribe = async () => {
        if (!subscriberName.trim() || !subscriberEmail.trim()) {
            toast.error("Please enter your name and email");
            return;
        }

        try {
            await createSubscription({
                name: subscriberName.trim(),
                email: subscriberEmail.trim(),
            }).unwrap();
            toast.success("You're subscribed to the mailing list!");
            setSubscriberName("");
            setSubscriberEmail("");
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to subscribe. Please try again.");
        }
    };

    return (
        <footer className="border-t border-[#00b8ff] px-8 py-12 bg-black text-white font-sans">
            <div className="grid gap-8 lg:grid-cols-[2fr_1fr_1.5fr_1.5fr_1fr]">
                {/* Column 1: Logo, Text, Payment */}
                <div className="space-y-6">
                    <Link href="/">
                        <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={220} height={66} />
                    </Link>
                    <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
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
                    <h3 className="text-sm font-bold text-white">Our headquarters address is:</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                        Unit 16, Bakers Ln, Chelmsford CM2 8LD
                    </p>
                </div>

                {/* Column 3: Subscription */}
                <div className="space-y-4 pt-2">
                    <h3 className="flex items-center gap-2 text-base font-bold text-white">
                        <span className="h-4 w-[3px] bg-[#00b8ff]" />
                        Mailing Subscription
                    </h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Your Name"
                            value={subscriberName}
                            onChange={(event) => setSubscriberName(event.target.value)}
                            className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-[#00b8ff] focus:outline-none"
                        />
                        <input
                            type="email"
                            placeholder="Your Email"
                            value={subscriberEmail}
                            onChange={(event) => setSubscriberEmail(event.target.value)}
                            className="w-full rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white placeholder:text-gray-500 focus:border-[#00b8ff] focus:outline-none"
                        />
                        <button
                            onClick={handleSubscribe}
                            disabled={isLoading}
                            className="w-full rounded-full bg-[#00b8ff] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#00b8ff]/90 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {isLoading ? "Subscribing..." : "Subscribe"}
                        </button>
                    </div>
                </div>

                {/* Column 4: Contact Info */}
                <div className="space-y-5 pt-2">
                    <div className="flex items-start gap-3">
                        <Phone className="h-5 w-5 text-[#00b8ff] mt-0.5 shrink-0" />
                        <div>
                            <a href={CONTACT_PHONE_TEL} className="block text-sm font-medium text-gray-300 hover:text-[#00b8ff]">
                                {CONTACT_PHONE_DISPLAY}
                            </a>
                            <a href={CONTACT_PHONE_2_TEL} className="block text-sm font-medium text-gray-300 hover:text-[#00b8ff]">
                                {CONTACT_PHONE_2_DISPLAY}
                            </a>
                            <p className="text-xs text-gray-500">Mon till Sat: 9:30 till 18:00</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-[#00b8ff] mt-0.5 shrink-0" />
                        <div>
                            <a href={CONTACT_EMAIL_MAILTO} className="text-sm font-medium text-gray-300 hover:text-[#00b8ff]">
                                {CONTACT_EMAIL}
                            </a>
                            <p className="text-xs text-gray-500">We reply within 1 day</p>
                        </div>
                    </div>
                </div>

                {/* Column 5: Follow Us */}
                <div className="space-y-4 pt-2">
                    <h3 className="flex items-center gap-2 text-base font-bold text-white">
                        <span className="h-4 w-[3px] bg-[#00b8ff]" />
                        Follow us
                    </h3>
                    <div className="space-y-3">
                        <a href="https://www.instagram.com/msperformanceltd?igsh=MW41MnUxZG1uNjczcQ==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-400 transition hover:text-[#00b8ff] group">
                            <div className="rounded-full bg-[#00b8ff] p-1 text-white group-hover:bg-[#00b8ff]/80">
                                <Instagram className="h-3.5 w-3.5" />
                            </div>
                            <span>Instagram</span>
                        </a>
                        <a href="https://www.facebook.com/msperformanceltd" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-400 transition hover:text-[#00b8ff] group">
                            <div className="rounded-full bg-[#00b8ff] p-1 text-white group-hover:bg-[#00b8ff]/80">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                </svg>
                            </div>
                            <span>Facebook</span>
                        </a>
                        <a href="https://www.tiktok.com/@msperformanceltd" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-400 transition hover:text-[#00b8ff] group">
                            <div className="rounded-full bg-[#00b8ff] p-1 text-white group-hover:bg-[#00b8ff]/80">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-.81.07 4.84 4.84 0 01-2.38-.63v-.07h4V6.69z" />
                                </svg>
                            </div>
                            <span>TikTok</span>
                        </a>
                    </div>
                </div>
            </div>

            <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-8">
                <p className="text-sm text-gray-400">© Copyright 2026 MSPerformance</p>
                <div className="flex flex-wrap items-center gap-1 text-sm text-gray-400">
                    <Link href="/privacy-policy" className="hover:text-[#00b8ff]">
                        Privacy Policy
                    </Link>
                    <span className="px-2 text-white/10">|</span>
                    <Link href="/delivery-returns" className="hover:text-[#00b8ff]">
                        Delivery & Returns
                    </Link>
                    <span className="px-2 text-white/10">|</span>
                    <Link href="/legal-notice" className="hover:text-[#00b8ff]">
                        Legal Notice
                    </Link>
                    <span className="px-2 text-white/10">|</span>
                    <Link href="/terms-conditions" className="hover:text-[#00b8ff]">
                        Terms & Conditions
                    </Link>
                </div>
                <p className="w-full text-center text-sm text-gray-400 sm:w-auto sm:text-right">
                    For emergency services call{" "}
                    <a href={CONTACT_PHONE_TEL} className="font-bold text-white hover:text-[#00b8ff]">
                        {CONTACT_PHONE_DISPLAY}
                    </a>
                </p>
            </div>
        </footer>
    );
}
