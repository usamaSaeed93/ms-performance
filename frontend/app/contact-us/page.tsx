"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { navLinks, brandLogos, footerLinks } from "@/lib/constants";
import { Navbar } from "@/components/Navbar";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function ContactUsPage() {
  const pathname = usePathname();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus("idle");

    try {
      const response = await fetch(`${API_BASE_URL}/ecommerce/v1/contact-messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setStatus("success");
      setFormData({ name: "", email: "", phone: "", address: "", message: "" });
    } catch (error) {
      console.error(error);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full">
        <div className="overflow-hidden">
          <Navbar ctaText="Become A Dealer" />

          <main>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#030814] text-white h-[360px]">
              <Image
                src="/images/hero/slider1.jpg"
                alt="Contact Us"
                width={1600}
                height={400}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative flex items-center h-full px-4 sm:px-6 md:px-8 lg:px-12">
                <h1 className="text-3xl font-bold sm:text-4xl md:text-5xl lg:text-6xl animate-heading">Contact Us</h1>
              </div>
            </section>

            {/* Main Content Section */}
            <section className="px-4 py-8 sm:px-6 sm:py-12 md:px-8 md:py-16 lg:px-12">
              <div className="mx-auto max-w-7xl">
                <h2 className="text-2xl font-bold text-[#0c1b33] mb-6 sm:text-3xl sm:mb-8 md:text-4xl md:mb-10 lg:text-5xl lg:mb-12">Let Your Wanderlust <br className="hidden sm:block" /> Guide You</h2>

                <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
                  {/* Left Column - Contact Form */}
                  <div className="animate-slide-left">
                    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5 md:space-y-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-[#0c1b33] sm:text-sm">Your Email</label>
                          <div className="relative">
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="Your Email"
                              className="w-full rounded-lg border border-[#dfe6f2] bg-gray-50 px-3 py-3 pr-10 text-xs text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none sm:rounded-[8px] sm:px-4 sm:py-4 sm:pr-12 sm:text-sm"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                                <path
                                  d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                                  fill="currentColor"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs font-semibold text-[#0c1b33] sm:text-sm">Your Phone</label>
                          <div className="relative">
                            <input
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="Your Phone"
                              className="w-full rounded-lg border border-[#dfe6f2] bg-gray-50 px-3 py-3 pr-10 text-xs text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none sm:rounded-[8px] sm:px-4 sm:py-4 sm:pr-12 sm:text-sm"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                                <path
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  fill="currentColor"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#0c1b33] sm:text-sm">Your Name</label>
                        <div className="relative">
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Your Name"
                            className="w-full rounded-lg border border-[#dfe6f2] bg-gray-50 px-3 py-3 pr-10 text-xs text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none sm:rounded-[8px] sm:px-4 sm:py-4 sm:pr-12 sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#0c1b33] sm:text-sm">Your Address</label>
                        <div className="relative">
                          <input
                            type="text"
                            value={formData.address}
                            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                            placeholder="Your Address"
                            className="w-full rounded-lg border border-[#dfe6f2] bg-gray-50 px-3 py-3 pr-10 text-xs text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none sm:rounded-[8px] sm:px-4 sm:py-4 sm:pr-12 sm:text-sm"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                              <path
                                d="M12 2C7.03 2 3 5.58 3 10.01c0 5.39 6.39 11.42 8.76 13.37.13.12.31.19.49.19s.36-.07.49-.19c2.37-1.95 8.76-7.98 8.76-13.37C21 5.58 16.97 2 12 2Zm0 18.21C9.18 18.05 5 13.38 5 10.01 5 6.69 8.13 4 12 4s7 2.69 7 6.01c0 3.37-4.18 8.04-7 10.2Z"
                                fill="currentColor"
                              />
                              <circle cx="12" cy="10" r="3" fill="currentColor" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-semibold text-[#0c1b33] sm:text-sm">Message</label>
                        <div className="relative">
                          <textarea
                            required
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            placeholder="Write Message.."
                            rows={5}
                            className="w-full rounded-lg border border-[#dfe6f2] bg-gray-50 px-3 py-3 pr-10 text-xs text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none resize-none sm:rounded-[8px] sm:px-4 sm:py-4 sm:pr-12 sm:text-sm sm:rows-6"
                          />
                          <div className="absolute right-4 top-4">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                              <path
                                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm0 2v.51l8 5.33 8-5.33V6H4Zm0 12h16V9.49l-8 5.33-8-5.33V18Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-[8px] bg-[#1d70ff] px-6 py-4 text-sm font-semibold text-white hover:bg-[#1a5fdd] transition animate-button disabled:opacity-50"
                      >
                        {loading ? "Sending..." : "Send Message"}
                      </button>

                      {status === "success" && (
                        <p className="text-green-600 text-sm mt-2">Message sent successfully!</p>
                      )}
                      {status === "error" && (
                        <p className="text-red-600 text-sm mt-2">Failed to send message. Please try again.</p>
                      )}

                    </form>
                  </div>

                  {/* Right Column - Image and Contact Details */}
                  <div className="space-y-6 animate-slide-right">
                    <div className="relative h-[300px] rounded-[16px] overflow-hidden">
                      <Image
                        src="/images/contact/contact-us.png"
                        alt="Mechanic working on car"
                        width={600}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                      {/* Location Card Overlay */}
                      <div
                        className="absolute bg-white border border-[#dfe6f2] shadow-lg opacity-100 left-1/2 -translate-x-1/2 bottom-5 rounded-lg p-3 sm:p-4 w-[calc(100%-2rem)] max-w-[563px]"
                      >
                        <div className="flex items-start gap-2.5">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d70ff]/10 flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                              <path
                                d="M12 2C7.03 2 3 5.58 3 10.01c0 5.39 6.39 11.42 8.76 13.37.13.12.31.19.49.19s.36-.07.49-.19c2.37-1.95 8.76-7.98 8.76-13.37C21 5.58 16.97 2 12 2Zm0 18.21C9.18 18.05 5 13.38 5 10.01 5 6.69 8.13 4 12 4s7 2.69 7 6.01c0 3.37-4.18 8.04-7 10.2Z"
                                fill="currentColor"
                              />
                              <circle cx="12" cy="10" r="3" fill="currentColor" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm text-[#5c6c86]">Location</h3>
                            <p className="text-sm sm:text-base font-bold text-[#0c1b33]">Unit 16, MS Performance, Five Tree Works Industrial Estate, Bakers Ln, West Hanningfield, Chelmsford CM2 8LD</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="mt-6 bg-white rounded-[16px] p-6 border border-[#dfe6f2] shadow-sm">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d70ff]/10 flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                              <path
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#0c1b33]">Requesting A Call:</p>
                            <p className="text-sm text-[#5c6c86]">0775 1798827 / 01277 715069</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d70ff]/10 flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                              <path
                                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.51l8 5.33 8-5.33V6H4zm0 12h16V9.49l-8 5.33-8-5.33V18z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#0c1b33]">E-mail:</p>
                            <p className="text-sm text-[#5c6c86]">info@msperformance.co.uk</p>
                          </div>
                        </div>
                      </div>

                      {/* Social Links */}
                      <div className="mt-4 pt-4 border-t border-[#dfe6f2]">
                        <p className="text-sm font-semibold text-[#0c1b33] mb-3">Follow Us</p>
                        <div className="flex items-center gap-3">
                          <a
                            href="https://www.facebook.com/msperformanceltd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d70ff]/10 text-[#1d70ff] hover:bg-[#1d70ff] hover:text-white transition-colors"
                          >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                          </a>
                          <a
                            href="https://www.tiktok.com/@msperformanceltd"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d70ff]/10 text-[#1d70ff] hover:bg-[#1d70ff] hover:text-white transition-colors"
                          >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 0010.86 4.46V13.2a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-.81.07 4.84 4.84 0 01-2.38-.63v-.07h4V6.69z" />
                            </svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>


          </main>
        </div>
      </div>
    </div>
  );
}

