"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  navLinks,
  footerLinks,
} from "@/lib/constants";

const faqs = [
  {
    question: "What is ECU Remapping and how does it work?",
    answer:
      "ECU remapping involves modifying the software in your car's Engine Control Unit (ECU) to optimize performance. We adjust parameters like fuel injection timing, turbo boost pressure, and ignition timing to unlock your vehicle's true potential. This process is done using specialized equipment that reads your current ECU map, modifies it, and writes the optimized version back to your vehicle.",
  },
  {
    question: "Will ECU remapping void my warranty?",
    answer:
      "ECU remapping can potentially affect your manufacturer's warranty, as it modifies the original factory settings. However, we offer warranty protection on our work. We recommend discussing this with your dealer or warranty provider before proceeding. Many customers choose to remap after their warranty period has expired.",
  },
  {
    question: "How long does the ECU remapping process take?",
    answer:
      "The ECU remapping process typically takes between 2-4 hours, depending on your vehicle's make and model. This includes reading the original map, creating the optimized version, testing, and verification. We ensure thorough testing to guarantee optimal performance and reliability.",
  },
  {
    question: "Is ECU remapping safe for my vehicle?",
    answer:
      "Yes, when performed by experienced professionals like our team at MSPerformance, ECU remapping is safe. We use proven calibration techniques and test all modifications on our dyno to ensure your vehicle operates within safe parameters. We never push your engine beyond its safe operating limits.",
  },
  {
    question: "What improvements can I expect after ECU remapping?",
    answer:
      "After ECU remapping, you can typically expect a 15-30% increase in power and torque, improved fuel efficiency (especially in diesel vehicles), smoother acceleration, and better throttle response. The exact improvements vary depending on your vehicle's make, model, and current configuration.",
  },
  {
    question: "Do you offer mobile ECU remapping services?",
    answer:
      "Yes, we offer mobile ECU remapping services for your convenience. Our qualified technicians can come to your location with all necessary equipment. This service is particularly popular for fleet vehicles and customers who prefer not to visit our workshop.",
  },
];

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-[1503px] px-4 pb-20 pt-8 lg:px-0">
        <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Header */}
          <header className="text-white">
          <div className="space-y-3 bg-black px-6 py-4 shadow-[0_20px_60px_rgba(1,4,13,0.65)]">
            <div className="flex flex-wrap items-center justify-between border-b-2 border-gray-700 pb-2 text-xs text-white/70">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                    <path
                      d="M12 2C7.03 2 3 5.58 3 10.01c0 5.39 6.39 11.42 8.76 13.37.13.12.31.19.49.19s.36-.07.49-.19c2.37-1.95 8.76-7.98 8.76-13.37C21 5.58 16.97 2 12 2Zm0 18.21C9.18 18.05 5 13.38 5 10.01 5 6.69 8.13 4 12 4s7 2.69 7 6.01c0 3.37-4.18 8.04-7 10.2Z"
                      fill="currentColor"
                    />
                    <circle cx="12" cy="10" r="3" fill="currentColor" />
                  </svg>
                  <span>Unit 16, Bakers Ln, Chelmsford CM2 8LD</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm0 2v.51l8 5.33 8-5.33V6H4Zm0 12h16V9.49l-8 5.33-8-5.33V18Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span>info@msperformance.co.uk</span>
                </div>
              </div>
              <Link href="/cart" className="flex items-center gap-2 text-white">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 6h-2l-1 2v1h2l3.6 7.59c.18.34.52.56.9.56H19v-2h-7.42l-.1-.2L12.55 13H17c.38 0 .72-.21.89-.55L21 6H7Z"
                    fill="currentColor"
                  />
                  <circle cx="9" cy="21" r="1" fill="currentColor" />
                  <circle cx="17" cy="21" r="1" fill="currentColor" />
                </svg>
                <span>Shop</span>
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <Link href="/">
                <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={160} height={48} priority />
              </Link>

              <nav className="flex flex-1 flex-wrap items-center justify-end gap-6 text-sm font-semibold">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`relative pb-1 transition hover:text-[#1d70ff] ${
                      link.href === "/services" ? "text-[#1d70ff]" : "text-white/80"
                    }`}
                  >
                    {link.label}
                    {link.href === "/services" && (
                      <span className="absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-6 rounded-full bg-gradient-to-r from-transparent via-[#1d70ff] to-transparent" />
                    )}
                  </Link>
                ))}
              </nav>

              <button className="rounded-[12px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(29,112,255,0.3)]">
                Book a Dyno
              </button>
            </div>
          </div>
        </header>

        <main className="space-y-20">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-[#030814] text-white">
            <Image
              src="/images/services/Services.png"
              alt="ECU Remapping"
              width={1600}
              height={700}
              className="absolute inset-0 h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative px-8 py-20 lg:px-12">
              <div className="space-y-6 max-w-3xl">
                <p className="flex items-center gap-3 text-sm font-semibold text-[#7ab6ff]">
                  <span className="h-px w-12 bg-[#7ab6ff]" />
                  Feel the Need for Speed: Dyno Car Tests
                </p>
                <h1 className="text-5xl font-black leading-tight lg:text-6xl">
                  ECU Remapping
                </h1>
              </div>
            </div>
          </section>

          {/* Section 1: Car ECU Remapping: Unleashing Power */}
          <section className="px-8 py-10 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12" style={{ gridAutoRows: '1fr' }}>
              <div className="space-y-6 flex flex-col">
                <div className="space-y-6">
                  <h2 className="text-4xl font-black text-[#0c1b33] lg:text-5xl">
                    Car ECU Remapping: Unleashing Power
                  </h2>
                  <p className="text-base leading-relaxed text-[#5c6c86] lg:text-lg">
                    Car ECU Remapping Optimizes Engine Performance By Adjusting Parameters Like Fuel Injection, Ignition Timing, And Turbo Boost. With MSPerformance's Expertise And State-Of-The-Art Tools, Unleash Your Vehicle's Hidden Potential. Experience Increased Power, Improved Fuel Efficiency, And A Customized Driving Experience.
                  </p>
                </div>
                <div className="relative overflow-hidden rounded-[20px] flex-shrink-0">
                  <Image
                    src="/images/services/ecu-remapping.png"
                    alt="ECU Remapping Process"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
              <div className="relative overflow-hidden h-[650px] rounded-[20px] border-2 border-[#1d70ff] flex">
                <Image
                  src="/images/services/services1.png"
                  alt="Car Engine"
                  width={600}
                  height={400}
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </section>

          {/* Section 2: Choose MSPerformance */}
          <section className="px-8 py-10 lg:px-12">
            <div className="mx-auto max-w-4xl text-center space-y-6">
              <h2 className="text-4xl font-black text-[#0c1b33] lg:text-5xl">
                Choose MSPerformance
              </h2>
              <p className="text-base leading-relaxed text-[#0c1b33] lg:text-lg">
                Trust MSPerformance For Car ECU Remapping. With Years Of Experience, Our Professionals Deliver Safe And Effective Tuning. We Prioritize Your Satisfaction, Offering Customized Solutions To Enhance Your Vehicle's Performance. Experience Increased Power, Improved Fuel Efficiency, And Personalized Driving Pleasure. Choose Us For Reliable ECU Remapping Services.
              </p>
            </div>
          </section>

          {/* Section 3: Key Benefits Of The Service */}
          <section className="px-8 py-10 lg:px-12">
            <div className="bg-white rounded-[20px] p-8 lg:p-12">
              <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
                <div className="space-y-6">
                  <h2 className="text-4xl font-black text-[#0c1b33] lg:text-5xl">
                    Key Benefits Of The Service
                  </h2>
                  <p className="text-base leading-relaxed text-[#0c1b33] lg:text-lg">
                    Car ECU Remapping Optimizes Engine Performance By Adjusting Parameters Like Fuel Injection, Ignition Timing, And Turbo Boost. With MSPerformance's Expertise And State-Of-The-Art Tools, Unleash Your Vehicle's Hidden Potential. Experience Increased Power, Improved Fuel Efficiency, And A Customized Driving Experience.
                  </p>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-base text-[#0c1b33]">
                        Precise Workmanship, Exceeding Customer Expectations
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-base text-[#0c1b33]">
                        100% Committed To Excellence In Every Project
                      </span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="mt-1 h-6 w-6 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-white">
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-base text-[#0c1b33]">
                        Extensive Selection Of Premium Performance Upgrades
                      </span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d70ff]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                        <path
                          d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M9 12l2 2 4-4"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0c1b33]">Increase Safety</h3>
                      <p className="mt-2 text-base text-[#0c1b33]">
                        Dedicated To Auto Repair Done Right The First Time
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d70ff]">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                        <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[#0c1b33]">Time-Saving</h3>
                      <p className="mt-2 text-base text-[#0c1b33]">
                        Our Remappers Install The Perfect Remap For Your Car In Minutes
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Frequently Asked Questions */}
          <section className="px-8 py-10 lg:px-12">
            <div className="mx-auto max-w-4xl space-y-8">
              <h2 className="text-center text-4xl font-black text-[#0c1b33] lg:text-5xl">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="rounded-[16px] border border-[#dfe6f2] bg-white shadow-sm"
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="flex w-full items-center justify-between p-6 text-left"
                    >
                      <span className="text-lg font-semibold text-[#0c1b33]">
                        {faq.question}
                      </span>
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        className={`transition-transform ${openFaq === index ? "rotate-45" : ""} text-[#1d70ff]`}
                      >
                        <path
                          d="M12 5v14m-7-7h14"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                    {openFaq === index && (
                      <div className="border-t border-[#dfe6f2] p-6">
                        <p className="text-base leading-relaxed text-[#5c6c86]">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-[#1d70ff]/100 px-8 py-12">
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
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs text-[#5c6c86]">WorldPay</span>
                    <span className="text-xs text-[#5c6c86]">Mastercard</span>
                    <span className="text-xs text-[#5c6c86]">Maestro</span>
                    <span className="text-xs text-[#5c6c86]">Switch</span>
                    <span className="text-xs text-[#5c6c86]">Visa</span>
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
                    <span>0775 1798827 / 01277 715069</span>
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
                </div>
                <div className="pt-2">
                  <p className="mb-2 text-sm font-bold text-[#0c1b33]">For overseas customers:</p>
                  <div className="flex items-center gap-2 text-sm text-[#5c6c86]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>+44 (0)1637 875 209</span>
                  </div>
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
                <a href="#" className="hover:text-[#1d70ff]">
                  Privacy Policy
                </a>
                <span className="text-[#dfe6f2]">|</span>
                <a href="#" className="hover:text-[#1d70ff]">
                  Delivery & Returns
                </a>
                <span className="text-[#dfe6f2]">|</span>
                <a href="#" className="hover:text-[#1d70ff]">
                  Legal information
                </a>
                <span className="text-[#dfe6f2]">|</span>
                <a href="#" className="hover:text-[#1d70ff]">
                  Terms & Conditions
                </a>
              </div>
            </div>
          </footer>
        </main>
        </div>
      </div>
    </div>
  );
}

