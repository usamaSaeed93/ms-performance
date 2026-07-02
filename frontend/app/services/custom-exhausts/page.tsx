"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
  {
    question: "Is professional installation necessary for a custom exhaust system?",
    answer:
      "Yes, professional installation is highly recommended. A properly fitted exhaust system requires precise welding, correct alignment, and secure mounting to prevent rattles, leaks, and potential damage. Our technicians ensure perfect fitment and optimal performance from your new exhaust system.",
  },
  {
    question: "Are valved (catalytic controlled) exhaust systems worth it?",
    answer:
      "Absolutely. Valved systems let you switch between an aggressive performance sound and a quieter everyday mode — perfect for vehicles that double as daily drivers and weekend track cars. We can design and fit a bespoke valved system to suit your exact requirements.",
  },
  {
    question: "What are the benefits of installing a custom exhaust system?",
    answer:
      "Custom exhausts offer improved gas flow for better engine performance and efficiency, a more aggressive or refined sound profile, reduced weight compared to stock systems, and enhanced aesthetics with polished or ceramic-coated tips.",
  },
  {
    question: "What materials do you use for custom exhausts?",
    answer:
      "We work with stainless steel (304 & 316 grade), mild steel, and titanium depending on your budget and goals. Stainless is our most popular choice for its balance of durability, heat resistance, and appearance. Titanium is reserved for motorsport builds where weight saving is paramount.",
  },
  {
    question: "Do you keep a copy of the original ECU files?",
    answer:
      "Yes, we always back up your vehicle's original ECU data before any remapping work. This ensures we can restore factory settings at any time, providing complete peace of mind.",
  },
  {
    question: "Will a custom exhaust affect my insurance?",
    answer:
      "We recommend informing your insurer about any exhaust modifications. Many specialist insurers cater specifically to modified vehicles and offer competitive premiums. We can provide full documentation of any work carried out.",
  },
  {
    question: "Can you work with my existing downpipe or manifold?",
    answer:
      "In most cases, yes. We assess the existing components first and advise whether they can be retained or whether a replacement would yield better results. Sometimes pairing a new cat-back system with an upgraded downpipe offers significantly better gains.",
  },
  {
    question: "How long does a custom exhaust build take?",
    answer:
      "A typical cat-back system takes one day. More complex manifold-back or full custom builds may require 2–3 days, especially if bespoke fabrication is involved. We will always give you a clear timeline before work begins.",
  },
];

const checkIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CustomExhaustsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { heroImage, content1Image, content2Image, content3Image, content4Image } =
    useServicePageImages("custom-exhausts");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="overflow-hidden">
        <Navbar ctaText="Get a Quote" />

        <main>
          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden bg-[#030814] text-white min-h-[520px] flex items-center">
            {heroImage && (
              <Image src={heroImage} alt="Custom Exhausts" fill className="object-cover opacity-50" priority />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
            <div className="relative w-full px-4 py-20 sm:px-6 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl space-y-5">
                  <p className="flex items-center gap-3 text-xs font-semibold tracking-widest text-[#7ab6ff] uppercase">
                    <span className="h-px w-12 bg-[#7ab6ff]" />
                    Sound &amp; Performance Redefined
                  </p>
                  <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                    Custom Exhausts
                  </h1>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                    Hand-crafted exhaust systems built to your exact specifications — from cat-back to full manifold
                    systems — delivering the sound, power, and aesthetics your car deserves.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      Bespoke Fabrication
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      TIG Welded
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      Lifetime Warranty on Piping
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 1: Intro ─────────────────────────────────────────────── */}
          <section className="bg-white px-4 py-16 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">What We Build</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl leading-tight">
                  Tailored Tones &amp;<br />Optimised Flow
                </h2>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  A custom exhaust is one of the most rewarding upgrades for any car enthusiast. At MSPerformance,
                  our TIG welding specialists hand-craft every system from scratch, using mandrel bends to maintain
                  constant internal diameter — eliminating restriction and squeezing every last bit of flow from your
                  engine.
                </p>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  Whether you want a whisper-quiet daily driver setup or a race-inspired bark that turns heads, we
                  design and fabricate the perfect exhaust for your car, your driving style, and your budget.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "Cat-back, downpipe-back & manifold-back systems",
                    "Valved exhaust systems for sound control",
                    "304 & 316 stainless, mild steel, or titanium",
                    "Mandrel bent pipes for unrestricted flow",
                    "Polished or ceramic-coated tip finishes",
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
                  <Image src={content1Image} alt="Welding Exhaust" fill className="object-cover" />
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
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">Craftsmanship</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">Master Craftsmanship</h2>
                <p className="text-[#5c6c86] max-w-2xl mx-auto text-base leading-relaxed">
                  We believe an exhaust is a piece of art. See how our fabricators turn raw materials into precision
                  performance hardware.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { img: content2Image, label: "Fabrication & Welding" },
                  { img: content3Image, label: "System Fitment" },
                  { img: content4Image, label: "Finished Result" },
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
              <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">Built for Drivers Who Care</h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                Every exhaust that leaves our workshop is a product of genuine passion and technical precision. We
                don&apos;t bolt on off-the-shelf parts. We build custom systems designed around your car&apos;s specific
                geometry, engine output, and performance targets — then test the result to ensure it meets our
                exacting standards before handing back the keys.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 border-t border-white/10">
                {[
                  { value: "100%", label: "Bespoke Builds" },
                  { value: "500+", label: "Systems Built" },
                  { value: "TIG", label: "Precision Welding" },
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

          {/* ── Section 4: Key Benefits ───────────────────────────────────────── */}
          <section className="bg-white px-4 py-16 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                  <div className="space-y-6">
                    <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">The Benefits</span>
                    <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">
                      Key Advantages of a Custom System
                    </h2>
                    <p className="text-base text-[#5c6c86] leading-relaxed">
                      Unlike universal aftermarket exhausts that need adapters and compromises, a custom-built system
                      fits perfectly, flows optimally, and looks exactly as intended. The improvements go beyond
                      sound alone.
                    </p>
                    <div className="space-y-6">
                      {[
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Power Gains You Can Feel",
                          desc: "Reduced back pressure means your engine breathes more freely, translating into measurable horsepower and torque gains across the rev range.",
                        },
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Stunning Aesthetic Appeal",
                          desc: "Precision TIG welds, polished tips, and clean routing make your exhaust a visual highlight of the car — not just a functional component.",
                        },
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                              <path d="M9 12l2 2 4-4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Lifetime Warranty on Piping",
                          desc: "We stand behind our work. Every custom exhaust system comes with a lifetime warranty on the pipework and welds — built to last.",
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
                    <h3 className="text-xl font-black text-[#0c1b33]">What&apos;s Included in Every Build</h3>
                    <ul className="space-y-4">
                      {[
                        "Free consultation & design quote",
                        "Custom fabrication to your specifications",
                        "Mandrel-bent pipework for optimal flow",
                        "Professional TIG welding throughout",
                        "Professional fitting & alignment",
                        "Sound testing & tuning",
                        "Polished or ceramic-coated tips",
                        "Lifetime warranty on all piping",
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
