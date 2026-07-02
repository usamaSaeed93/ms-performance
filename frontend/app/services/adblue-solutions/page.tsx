"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
  {
    question: "What is AdBlue and why does my car need it?",
    answer:
      "AdBlue is a non-toxic aqueous urea solution injected into the exhaust stream of diesel vehicles equipped with Selective Catalytic Reduction (SCR) systems. It converts harmful nitrogen oxides (NOx) into harmless nitrogen and water, allowing modern diesels to comply with strict Euro 5 and Euro 6 emissions standards.",
  },
  {
    question: "What happens if I run out of AdBlue?",
    answer:
      "Most vehicles will issue a series of dashboard warnings well before the tank empties. Once fully depleted, Euro 6 vehicles are legally required to prevent engine restart until the tank is refilled. This makes prompt top-up essential — don't wait for the final warning.",
  },
  {
    question: "Can the AdBlue system be deleted?",
    answer:
      "We provide delete solutions strictly for off-road, closed-circuit motorsport, or export destinations where local regulations permit. Driving a vehicle with the AdBlue system disabled on UK public roads is illegal and will result in an MOT failure. We always discuss legal obligations fully with customers before undertaking any such work.",
  },
  {
    question: "How long does an AdBlue refill take?",
    answer:
      "A standard refill with system reset takes around 15–20 minutes. Fault diagnosis or component replacement (injector, pump, NOx sensor) will take longer — we'll advise on timing when you call or book online.",
  },
];

const checkIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function AdblueSolutionsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { heroImage, content1Image, content2Image, content3Image, content4Image } =
    useServicePageImages("adblue-solutions");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="overflow-hidden">
        <Navbar ctaText="Book a Checkup" />

        <main>
          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden bg-[#030814] text-white min-h-[520px] flex items-center">
            {heroImage && (
              <Image src={heroImage} alt="Adblue Solutions" fill className="object-cover opacity-50" priority />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
            <div className="relative w-full px-4 py-20 sm:px-6 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl space-y-5">
                  <p className="flex items-center gap-3 text-xs font-semibold tracking-widest text-[#7ab6ff] uppercase">
                    <span className="h-px w-12 bg-[#7ab6ff]" />
                    SCR &amp; AdBlue Specialists
                  </p>
                  <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                    AdBlue Solutions
                  </h1>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                    Refills, fault diagnosis, injector replacement, and system resets for all diesel vehicles with
                    Selective Catalytic Reduction technology — fast and competitively priced.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      AdBlue Refill
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      SCR Diagnosis
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      Component Repair
                    </span>
                  </div>
                  <div className="pt-2">
                    <a
                      href="/book-appointment"
                      className="inline-block rounded-xl bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_10px_25px_rgba(29,112,255,0.35)] hover:bg-[#1565e0] transition-colors"
                    >
                      Book a Checkup
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
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">What We Do</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl leading-tight">
                  Diagnose, Fix<br />&amp; Reset
                </h2>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  AdBlue and SCR faults are among the most common warning lights on modern Euro 5 and Euro 6 diesel
                  vehicles. Left unresolved, they can leave you stranded — many cars will refuse to restart once
                  the tank empties or a sensor fault is detected.
                </p>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  Our technicians carry specialist diagnostic tools to identify the exact cause, refill the fluid
                  correctly to manufacturer spec, replace any faulty components, and clear all fault codes — getting
                  you back on the road without delay and without dealership prices.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "AdBlue tank refill to manufacturer specification",
                    "Full SCR & NOx sensor diagnostic scan",
                    "AdBlue injector inspection, cleaning & replacement",
                    "SCR pump & module testing and replacement",
                    "All fault codes cleared & system reset",
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
                  <Image src={content1Image} alt="AdBlue System" fill className="object-cover" />
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
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">Our Process</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">Dealer-Level Diagnostics</h2>
                <p className="text-[#5c6c86] max-w-2xl mx-auto text-base leading-relaxed">
                  We use the same OBD and manufacturer-specific tools as main dealers to get the full picture —
                  from tank level sensors to NOx catalytic efficiency — before recommending any repair.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { img: content2Image, label: "SCR Diagnostics" },
                  { img: content3Image, label: "Injector Testing" },
                  { img: content4Image, label: "System Reset" },
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
              <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">Fast, Accurate, Affordable</h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                Main dealers charge premium rates for AdBlue work. We use the same diagnostic equipment and
                quality replacement parts at a fraction of the price — typically fixing AdBlue issues the same
                day. Whether it&apos;s a simple refill or a complete injector replacement, we handle it with speed
                and precision.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 border-t border-white/10">
                {[
                  { value: "15min", label: "Refill Turnaround" },
                  { value: "Same", label: "Day Diagnosis" },
                  { value: "All", label: "Euro 5 & 6 Diesels" },
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

          {/* ── Section 4: Services ───────────────────────────────────────────── */}
          <section className="bg-white px-4 py-16 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto">
              <div className="bg-gray-50 rounded-3xl p-8 lg:p-12">
                <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
                  <div className="space-y-6">
                    <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">What We Offer</span>
                    <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">
                      Our AdBlue &amp; SCR Services
                    </h2>
                    <p className="text-base text-[#5c6c86] leading-relaxed">
                      From a routine top-up to a full SCR system overhaul, we cover every aspect of AdBlue and
                      emission system maintenance. All work is carried out by trained technicians using specialist
                      diagnostic equipment.
                    </p>
                    <div className="space-y-6">
                      {[
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 22C12 22 3 17 3 10V5l9-3 9 3v5c0 7-9 12-9 12z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "AdBlue Refill",
                          desc: "Correct-grade aqueous urea solution filled to the manufacturer specification, followed by a full system reset and confirmation that the warning light has cleared.",
                        },
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <circle cx="11" cy="11" r="8" stroke="white" strokeWidth="2" />
                              <path d="M21 21l-4.35-4.35" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          ),
                          title: "Full SCR Fault Diagnosis",
                          desc: "Complete OBD and manufacturer-specific scan covering AdBlue level sensors, NOx sensors, SCR catalyst efficiency, injector health, and pump operation.",
                        },
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Component Repair & Replacement",
                          desc: "Injector, pump, NOx sensor, and SCR module replacement using quality parts. All work is carried out to manufacturer specifications and verified post-repair.",
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
                    <h3 className="text-xl font-black text-[#0c1b33]">What&apos;s Included in Every Visit</h3>
                    <ul className="space-y-4">
                      {[
                        "AdBlue system fault code scan",
                        "NOx sensor & SCR catalyst test",
                        "AdBlue tank level sensor check",
                        "Injector spray pattern inspection",
                        "Pump pressure & flow rate verification",
                        "Correct-grade AdBlue refill if required",
                        "All fault codes cleared & confirmed",
                        "Post-repair verification drive",
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
