"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
  {
    question: "Are your number plates road-legal?",
    answer:
      "Yes. All standard number plates we produce meet current UK DVLA regulations — correct font (Charles Wright), reflective background, and BS AU 145e compliance. Show plates are marked accordingly and supplied for display purposes only.",
  },
  {
    question: "Can I get a custom shaped or 4D plate?",
    answer:
      "Absolutely. We offer gel (3D) and acrylic (4D) raised-letter plates in a variety of styles. These remain road-legal as long as the characters and spacing conform to DVLA standards.",
  },
  {
    question: "What do I need to bring to order road-legal plates?",
    answer:
      "UK law requires proof of entitlement (V5C logbook, new keeper slip, or insurance certificate) and valid photographic ID (driving licence or passport). Without these we can only produce show plates.",
  },
  {
    question: "How quickly can I get my plates?",
    answer:
      "Standard plates are usually ready the same day or next working day. Custom 3D/4D plates typically take 2–3 working days. We'll confirm the turnaround time when you place your order.",
  },
];

const checkIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function NumberPlatesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { heroImage, content1Image, content2Image, content3Image, content4Image } =
    useServicePageImages("number-plates");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="overflow-hidden">
        <Navbar ctaText="Order Plates" />

        <main>
          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden bg-[#030814] text-white min-h-[520px] flex items-center">
            {heroImage && (
              <Image src={heroImage} alt="Number Plates" fill className="object-cover opacity-50" priority />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
            <div className="relative w-full px-4 py-20 sm:px-6 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl space-y-5">
                  <p className="flex items-center gap-3 text-xs font-semibold tracking-widest text-[#7ab6ff] uppercase">
                    <span className="h-px w-12 bg-[#7ab6ff]" />
                    Road-Legal &amp; Show Plates
                  </p>
                  <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                    Number Plates
                  </h1>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                    Standard, 3D gel, and 4D acrylic number plates made to order. Road-legal and show styles
                    available — all produced to current DVLA regulations.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      Standard Plates
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      3D Gel Plates
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      4D Acrylic Plates
                    </span>
                  </div>
                  <div className="pt-2">
                    <a
                      href="/contact-us"
                      className="inline-block rounded-xl bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(29,112,255,0.35)] hover:bg-[#1565e0] transition-colors"
                    >
                      Get a Quote
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 1: Intro ─────────────────────────────────────────────── */}
          <section className="bg-white px-4 py-16 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">Our Products</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl leading-tight">
                  Plates That Make<br />an Impression
                </h2>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  Whether you need a straightforward replacement set or want to make a statement with premium 3D gel
                  or 4D acrylic lettering, we have you covered. All road-legal plates are produced in accordance
                  with current DVLA standards using the correct BS AU 145e compliant materials.
                </p>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  Show plates are clearly marked for display use only. All road-legal plates are produced with proof
                  of entitlement verification to ensure full legal compliance — protecting both you and us.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "Standard flat road-legal plates (same day)",
                    "3D gel raised characters — striking look, road-legal",
                    "4D acrylic laser-cut characters for maximum impact",
                    "Custom show plates in any background colour",
                    "Motorcycle, trailer & front-only plates available",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3">
                      <div className="mt-0.5 h-5 w-5 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                        {checkIcon}
                      </div>
                      <span className="text-sm text-[#0c1b33]">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative overflow-hidden rounded-2xl h-[380px] sm:h-[440px] shadow-lg">
                {content1Image ? (
                  <Image src={content1Image} alt="Number Plate Example" fill className="object-cover" />
                ) : (
                  <div className="h-full bg-gray-200 animate-pulse" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          </section>

          {/* ── Section 2: 3-Image Gallery Strip ─────────────────────────────── */}
          <section className="bg-gray-50 px-4 py-16 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto space-y-10">
              <div className="text-center space-y-3">
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">Every Style, Every Finish</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">Our Plate Range</h2>
                <p className="text-[#5c6c86] max-w-2xl mx-auto text-base leading-relaxed">
                  From the classic flat plate to eye-catching 4D raised characters, we produce plates that
                  complement your vehicle and reflect your style — without compromising on legality.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { img: content2Image, label: "Standard Plates" },
                  { img: content3Image, label: "3D Gel Plates" },
                  { img: content4Image, label: "4D Acrylic Plates" },
                ].map(({ img, label }, i) => (
                  <div key={i} className="relative overflow-hidden rounded-2xl h-[260px] group shadow-sm">
                    {img ? (
                      <Image
                        src={img}
                        alt={label}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full bg-gray-200 animate-pulse" />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                    <span className="absolute bottom-4 left-4 text-sm font-semibold text-white">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Section 3: Why Choose Us (dark) ──────────────────────────────── */}
          <section className="bg-[#0c1b33] text-white px-4 py-16 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <span className="text-xs font-bold tracking-widest text-[#7ab6ff] uppercase">Why MSPerformance</span>
              <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">Quality You Can Trust</h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                We produce every plate in-house using premium materials from approved DVLA-registered suppliers.
                Whether it&apos;s a simple pair of replacement plates or a bespoke 4D show set, the same attention to
                detail applies. All road-legal plates are verified against the DVLA database — giving you
                complete peace of mind.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 border-t border-white/10">
                {[
                  { value: "3", label: "Plate Styles" },
                  { value: "Same", label: "Day Standard Plates" },
                  { value: "DVLA", label: "Registered Supplier" },
                  { value: "5★", label: "Customer Rating" },
                ].map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-4xl font-black text-[#1d70ff]">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── Section 4: Plate Options ──────────────────────────────────────── */}
          <section className="bg-white px-4 py-16 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                  <div className="space-y-6">
                    <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">The Options</span>
                    <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">
                      Which Plate is Right for You?
                    </h2>
                    <p className="text-base text-[#5c6c86] leading-relaxed">
                      Not sure which style suits your car? Here&apos;s a quick guide to our three main plate types —
                      all available in road-legal or show plate variants.
                    </p>
                    <div className="space-y-6">
                      {[
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <rect x="3" y="6" width="18" height="12" rx="2" stroke="white" strokeWidth="2" />
                              <path d="M8 12h8m-4-3v6" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          ),
                          title: "Standard Flat Plates",
                          desc: "Classic reflective plates with the correct DVLA-approved Charles Wright font, ready on the same day. The clean, no-fuss choice for any vehicle.",
                        },
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
                              <path d="M12 8v4l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          ),
                          title: "3D Gel Raised Plates",
                          desc: "UV-stable gel domes give each character a striking raised, glossy finish. Road-legal and available in any standard registration. Adds real visual presence.",
                        },
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "4D Acrylic Plates",
                          desc: "Laser-cut solid acrylic characters bonded for maximum depth and shadow effect. The premium choice for show cars and enthusiasts who want to stand out.",
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="flex-shrink-0 h-11 w-11 rounded-full bg-[#1d70ff] flex items-center justify-center">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-[#0c1b33] text-lg">{item.title}</h3>
                            <p className="mt-1 text-sm text-[#5c6c86] leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6 self-start">
                    <h3 className="text-xl font-black text-[#0c1b33]">What to Bring for Road-Legal Plates</h3>
                    <p className="text-sm text-[#5c6c86]">UK law requires the following to produce road-legal plates. Show plates can be produced without documentation.</p>
                    <ul className="space-y-4">
                      {[
                        "V5C logbook, new keeper slip, or insurance certificate",
                        "Valid photographic ID (driving licence or passport)",
                        "Your registration number (obviously!)",
                        "Choice of plate style (standard, 3D, or 4D)",
                        "Optional: border, badge, or flag preference",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <div className="mt-0.5 h-5 w-5 rounded bg-[#1d70ff] flex items-center justify-center flex-shrink-0">
                            {checkIcon}
                          </div>
                          <span className="text-sm text-[#0c1b33]">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-2">
                      <a
                        href="/contact-us"
                        className="inline-block w-full text-center rounded-xl bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(29,112,255,0.35)] hover:bg-[#1565e0] transition-colors"
                      >
                        Order Your Plates
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 5: FAQ ────────────────────────────────────────────────── */}
          <section className="bg-gray-50 px-4 py-16 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="text-center space-y-3">
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">FAQs</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">
                  Frequently Asked Questions
                </h2>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                    <button
                      onClick={() => setOpenFaq(openFaq === index ? null : index)}
                      className="flex w-full items-center justify-between px-6 py-5 text-left"
                    >
                      <span className="text-base font-semibold text-[#0c1b33] pr-4">{faq.question}</span>
                      <div className={`flex-shrink-0 h-8 w-8 rounded-full border-2 border-[#1d70ff] flex items-center justify-center transition-transform ${openFaq === index ? "rotate-45 bg-[#1d70ff]" : ""}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className={openFaq === index ? "text-white" : "text-[#1d70ff]"}>
                          <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>
                    {openFaq === index && (
                      <div className="border-t border-gray-100 px-6 py-5">
                        <p className="text-sm leading-relaxed text-[#5c6c86]">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
