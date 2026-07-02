"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
  {
    question: "What are DPF and EGR?",
    answer:
      "DPF (Diesel Particulate Filter) captures soot from diesel exhaust to reduce particulate emissions, while EGR (Exhaust Gas Recirculation) recirculates exhaust gases back into the intake to lower NOx output. Both are critical for modern diesel emissions compliance but can clog or fail over time, severely impacting performance.",
  },
  {
    question: "How do I know if my DPF is blocked?",
    answer:
      "Common symptoms include a warning light on the dashboard, noticeable power loss or limp mode, increased fuel consumption, more frequent regeneration cycles, and excessive smoke from the exhaust. If any of these appear, get the car checked immediately — ignoring a blocked DPF can lead to expensive engine damage.",
  },
  {
    question: "What is DPF cleaning?",
    answer:
      "DPF cleaning involves removing the accumulated ash and soot from the filter to restore it to near-new efficiency. Using forced regeneration or chemical cleaning, this is a cost-effective alternative to full DPF replacement, which can cost several thousand pounds.",
  },
  {
    question: "Is it legal to remove the DPF?",
    answer:
      "In the UK, driving a vehicle that has had its DPF removed is illegal and will result in an MOT failure. We only offer cleaning, maintenance, and fault rectification solutions to keep your vehicle road-legal. DPF removal is strictly for closed-circuit motorsport or off-road use.",
  },
];

const checkIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function DpfEgrPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { heroImage, content1Image, content2Image, content3Image, content4Image } =
    useServicePageImages("dpf-egr-services");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="overflow-hidden">
        <Navbar ctaText="Book a Checkup" />

        <main>
          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden bg-[#030814] text-white min-h-[520px] flex items-center">
            {heroImage && (
              <Image src={heroImage} alt="DPF & EGR Services" fill className="object-cover opacity-50" priority />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
            <div className="relative w-full px-4 py-20 sm:px-6 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl space-y-5">
                  <p className="flex items-center gap-3 text-xs font-semibold tracking-widest text-[#7ab6ff] uppercase">
                    <span className="h-px w-12 bg-[#7ab6ff]" />
                    Restore Efficiency &amp; Reliability
                  </p>
                  <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                    DPF &amp; EGR Solutions
                  </h1>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                    Expert diagnosis, professional cleaning, and targeted software fixes to get your diesel emissions
                    system back to full health — without the cost of a full replacement.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      Dealer-Level Diagnostics
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      DPF Cleaning
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      EGR Fault Repair
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
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">Root Cause Diagnosis</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl leading-tight">
                  Keep It Clean,<br />Keep It Running
                </h2>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  Modern diesel engines depend on complex emissions systems to meet legal standards. When the DPF
                  blocks or the EGR valve sticks, performance plummets, fuel economy tanks, and your dashboard lights
                  up. Most garages simply replace parts. We find the root cause.
                </p>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  Using dealer-level diagnostic equipment, we pinpoint whether the issue is a faulty sensor, a
                  software glitch, a driving pattern issue, or genuine mechanical failure — and then apply the most
                  cost-effective, reliable fix available.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "Full dealer-level fault code diagnosis",
                    "Forced & chemical DPF regeneration",
                    "EGR valve cleaning, repair & replacement",
                    "Software reset & recalibration",
                    "Root-cause analysis to prevent recurrence",
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
                  <Image src={content1Image} alt="DPF Cleaning" fill className="object-cover" />
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
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">Expert Diagnosis in Action</h2>
                <p className="text-[#5c6c86] max-w-2xl mx-auto text-base leading-relaxed">
                  Don&apos;t just replace parts. Understand the problem. Our technicians use precise diagnostics to
                  identify exactly what&apos;s wrong and apply a targeted, lasting fix.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { img: content2Image, label: "Diagnostics Scan" },
                  { img: content3Image, label: "DPF Inspection" },
                  { img: content4Image, label: "System Restoration" },
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
              <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">Fix It Right, First Time</h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                A blocked DPF is often a symptom, not the root cause. We go beyond clearing fault codes — we
                investigate why the issue occurred, whether it&apos;s a faulty temperature sensor, a failing injector,
                a turbo boost leak, or simply the wrong driving cycle. Treating the cause means the problem
                doesn&apos;t come back two months later.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 border-t border-white/10">
                {[
                  { value: "90%", label: "DPFs Saved from Replacement" },
                  { value: "£100s", label: "Avg. Customer Saving" },
                  { value: "1-Day", label: "Typical Turnaround" },
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
                      Benefits of Our DPF &amp; EGR Service
                    </h2>
                    <p className="text-base text-[#5c6c86] leading-relaxed">
                      Restoring your emissions system isn&apos;t just about turning off a warning light. Done properly,
                      it brings back lost power, improves fuel efficiency, and protects the engine from further damage
                      caused by running in a compromised state.
                    </p>
                    <div className="space-y-6">
                      {[
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          ),
                          title: "Restored Power & Efficiency",
                          desc: "A clean DPF and properly functioning EGR valve means your engine breathes freely again — power returns and fuel economy improves noticeably.",
                        },
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Turbo & Engine Protection",
                          desc: "A restricted DPF forces the turbo to work harder under back pressure. Cleaning protects your turbo from premature failure — a very expensive repair.",
                        },
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                              <path d="M12 8v4l3 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          ),
                          title: "Significant Cost Saving",
                          desc: "DPF cleaning is a fraction of the cost of replacement, which can run to £1,000–£3,000+. We save the vast majority of DPFs we see.",
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
                    <h3 className="text-xl font-black text-[#0c1b33]">What&apos;s Included in Our Service</h3>
                    <ul className="space-y-4">
                      {[
                        "Full dealer-level diagnostic scan",
                        "DPF differential pressure test",
                        "Forced or chemical DPF regeneration",
                        "EGR valve inspection & clean/replace",
                        "Root-cause fault investigation",
                        "Software reset & recalibration",
                        "Test drive to verify regeneration cycle",
                        "Clear report of findings & actions taken",
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
