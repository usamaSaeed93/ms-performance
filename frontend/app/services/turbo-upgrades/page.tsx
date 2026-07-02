"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
  {
    question: "What is a hybrid turbo?",
    answer:
      "A hybrid turbo uses the original housing but with upgraded internals — a larger compressor wheel, improved turbine, ceramic ball bearings, and better seals — to flow significantly more air without requiring custom fabrication to fit. It's the ideal first upgrade for most road cars.",
  },
  {
    question: "Do I need other modifications alongside a turbo upgrade?",
    answer:
      "Yes. Installing a larger turbo typically requires supporting modifications including a larger front-mounted intercooler, a high-flow exhaust system, upgraded fuel injectors, a higher-capacity fuel pump, and — most critically — a custom ECU remap to safely manage the increased airflow and boost pressure.",
  },
  {
    question: "Will I experience more turbo lag?",
    answer:
      "Larger turbos can induce additional spool lag, but modern turbo technology and skilled calibration significantly minimise this. We balance peak power delivery with everyday drivability, ensuring responsive power from low RPM rather than just a top-end surge.",
  },
  {
    question: "How much power can I realistically expect?",
    answer:
      "This varies significantly by vehicle platform and turbo choice. A hybrid upgrade might yield 50–150 bhp, while a full frame turbo conversion with supporting modifications could double your engine output. During consultation, we'll advise on the realistic ceiling for your specific vehicle.",
  },
];

const checkIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function TurboUpgradesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { heroImage, content1Image, content2Image, content3Image, content4Image } =
    useServicePageImages("turbo-upgrades");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="overflow-hidden">
        <Navbar ctaText="Boost Now" />

        <main>
          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden bg-[#030814] text-white min-h-[520px] flex items-center">
            {heroImage && (
              <Image src={heroImage} alt="Turbo Upgrades" fill className="object-cover opacity-50" priority />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
            <div className="relative w-full px-4 py-20 sm:px-6 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl space-y-5">
                  <p className="flex items-center gap-3 text-xs font-semibold tracking-widest text-[#7ab6ff] uppercase">
                    <span className="h-px w-12 bg-[#7ab6ff]" />
                    Maximum Forced Induction
                  </p>
                  <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                    Turbo Upgrades
                  </h1>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                    From hybrid turbos for spirited road driving to full frame turbo conversions for track day
                    domination — we supply, fit, and custom-tune the complete forced induction package.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      Hybrid Turbos
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      Full Frame Kits
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      Dyno Calibrated
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
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">What We Offer</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl leading-tight">
                  Unleash Massive,<br />Reliable Power
                </h2>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  The turbocharger is the most impactful single component upgrade you can make to a forced-induction
                  engine. At MSPerformance, we treat every turbo upgrade as a complete system project — not just
                  bolting on a bigger unit and hoping for the best.
                </p>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  We evaluate your engine&apos;s existing limitations, design a supporting modification package, source
                  the ideal turbo for your goals, carry out the full installation, and verify every gain on our AWD
                  rolling road with a bespoke ECU calibration.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "Hybrid turbos for street & road use",
                    "Full frame turbo conversions for maximum power",
                    "Intercooler, fueling & exhaust upgrades included",
                    "Custom ECU remap tailored to new turbo specs",
                    "Dyno-verified before, during & after",
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
                  <Image src={content1Image} alt="Turbocharger" fill className="object-cover" />
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
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">Integrated Solutions</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">A Complete System Overhaul</h2>
                <p className="text-[#5c6c86] max-w-2xl mx-auto text-base leading-relaxed">
                  A turbo upgrade isn&apos;t just one part — it&apos;s an ecosystem. We consider every component in the
                  chain to ensure maximum power with total reliability.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { img: content2Image, label: "Turbo Installation" },
                  { img: content3Image, label: "Intercooler & Pipework" },
                  { img: content4Image, label: "Dyno Calibration" },
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
              <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">Integrated Solutions, Maximum Results</h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                A turbo upgrade done half-heartedly is a recipe for blown seals, cracked pistons, and expensive
                repair bills. We take a systematic approach — evaluating cooling, fueling, exhaust flow, and
                software before recommending a single component. Our in-house dyno ensures the final calibration
                is precisely dialled for your engine&apos;s new capabilities.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 border-t border-white/10">
                {[
                  { value: "50+", label: "Bhp Min. Gain" },
                  { value: "2×", label: "Power Possible" },
                  { value: "100%", label: "Dyno Verified" },
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
                      Experience the Difference
                    </h2>
                    <p className="text-base text-[#5c6c86] leading-relaxed">
                      The transformation a quality turbo upgrade brings is unlike any other modification. Done
                      correctly, it reshapes the entire power character of your car — broader torque, stronger
                      mid-range pull, and a top-end that keeps building long after stock power fades.
                    </p>
                    <div className="space-y-6">
                      {[
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M13 10V3L4 14h7v7l9-11h-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Power on Demand",
                          desc: "Stronger torque across the RPM range transforms overtaking and everyday driving. Enjoy effortless pull from low revs up to the redline.",
                        },
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Reliability First",
                          desc: "Every supporting modification is calculated to protect your engine. We don&apos;t build power at the expense of longevity — both can coexist.",
                        },
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Expert Fitting & Calibration",
                          desc: "Supply-and-fit plus a bespoke ECU remap dialled on our dyno. Every turbo upgrade is a complete, finished package — not just a parts drop.",
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
                    <h3 className="text-xl font-black text-[#0c1b33]">What&apos;s Included in a Turbo Package</h3>
                    <ul className="space-y-4">
                      {[
                        "Initial consultation & power target assessment",
                        "Turbo selection & sourcing",
                        "Professional turbo installation",
                        "Intercooler upgrade & pipework",
                        "Fuel system evaluation & upgrade if required",
                        "High-flow exhaust & downpipe recommendation",
                        "Bespoke ECU remap for new setup",
                        "Full dyno session — before & after",
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
