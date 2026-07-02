"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
  {
    question: "Why should I dyno test my car?",
    answer:
      "Dyno testing provides accurate performance data, including horsepower and torque curves. It safely simulates road conditions to tune your engine for maximum efficiency and power without the risks of public roads. It's essential for verifying the results of any performance upgrades.",
  },
  {
    question: "Is dyno testing safe for my vehicle?",
    answer:
      "Yes, our AWD dyno cells are equipped with state-of-the-art cooling and safety systems. Our technicians are highly trained to monitor your vehicle's parameters throughout the test to ensure it remains within safe operating limits.",
  },
  {
    question: "What kind of vehicles can you test?",
    answer:
      "We can test Front-Wheel Drive (FWD), Rear-Wheel Drive (RWD), and All-Wheel Drive (AWD) vehicles. Our dyno can handle high-performance cars, 4x4s, and even specialised motorsport vehicles.",
  },
  {
    question: "How long does a dyno session take?",
    answer:
      "A standard power run typically takes about an hour, including setup and strapping. Full custom tuning sessions can take longer, ranging from 2–4 hours or more depending on the complexity of the work.",
  },
];

const checkIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function DynoTestsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { heroImage, content1Image, content2Image, content3Image, content4Image } =
    useServicePageImages("dyno-tests");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="overflow-hidden">
        <Navbar ctaText="Book a Dyno" />

        <main>
          {/* ── Hero ─────────────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden bg-[#030814] text-white min-h-[520px] flex items-center">
            {heroImage && (
              <Image
                src={heroImage}
                alt="Dyno Tests"
                fill
                className="object-cover opacity-50"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
            <div className="relative w-full px-4 py-20 sm:px-6 md:px-8 lg:px-12">
              <div className="max-w-7xl mx-auto">
                <div className="max-w-2xl space-y-5">
                  <p className="flex items-center gap-3 text-xs font-semibold tracking-widest text-[#7ab6ff] uppercase">
                    <span className="h-px w-12 bg-[#7ab6ff]" />
                    Precision Performance Measurement
                  </p>
                  <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                    Dyno Tests
                  </h1>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                    Stop guessing. Start measuring. Our AWD rolling road delivers hard power and torque data so every
                    tuning decision is backed by real evidence.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      AWD Capable
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      Live Data Logging
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      ~1 Hr Power Run
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
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">Accurate Power Analysis</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl leading-tight">
                  Accurate Power &amp;<br />Torque Analysis
                </h2>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  Our cutting-edge AWD Rolling Road provides the ultimate environment for tuning and power testing.
                  Whether you are validating a new modification or fine-tuning for the track, our dyno ensures you get
                  precise, repeatable data in a fully controlled setting.
                </p>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  We simulate real-world driving conditions — including full boost runs, load sweeps, and coast-down
                  testing — so every number we hand you is a true reflection of what your car is actually doing on the
                  road, not a theoretical estimate.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "Precise horsepower & torque readings at the wheels",
                    "Air-fuel ratio & boost pressure monitoring",
                    "Safe, controlled high-speed simulation",
                    "Before & after comparison graphs provided",
                    "Suitable for FWD, RWD & AWD vehicles",
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
                  <Image src={content1Image} alt="Dyno Graph" fill className="object-cover" />
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
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">Our Dyno Suite</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">Inside Our Test Cell</h2>
                <p className="text-[#5c6c86] max-w-2xl mx-auto text-base leading-relaxed">
                  Every run is monitored by our experts in real time — from strapping and safety checks to full boost
                  pulls and data analysis.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { img: content2Image, label: "Car on Dyno" },
                  { img: content3Image, label: "Data Logging" },
                  { img: content4Image, label: "Power Run" },
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

          {/* ── Section 3: The Dyno Advantage (dark) ─────────────────────────── */}
          <section className="bg-[#0c1b33] text-white px-4 py-16 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-4xl mx-auto text-center space-y-8">
              <span className="text-xs font-bold tracking-widest text-[#7ab6ff] uppercase">Why Dyno?</span>
              <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">The Dyno Advantage</h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                Stop guessing and start measuring. Our dyno testing reveals the true health and performance of your
                engine. It&apos;s the only way to accurately quantify gains from modifications and ensure that your
                air-fuel ratios, boost levels, and ignition timing are perfectly calibrated for both reliability and
                maximum power output.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 border-t border-white/10">
                {[
                  { value: "4WD", label: "Rolling Road" },
                  { value: "100+", label: "Data Channels" },
                  { value: "±1%", label: "Accuracy" },
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
                      Key Benefits of Dyno Testing
                    </h2>
                    <p className="text-base text-[#5c6c86] leading-relaxed">
                      Beyond just bragging rights for horsepower, dyno testing is a critical diagnostic tool. It allows
                      us to load the engine in a fully controlled environment to detect issues that might only appear
                      under stress, ensuring your car is performing its absolute best at all times.
                    </p>
                    <div className="space-y-6">
                      {[
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Verify Your Gains",
                          desc: "Prove the effectiveness of your modifications with hard, unambiguous data. Know exactly what each upgrade delivered — in numbers.",
                        },
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Engine Safety Monitoring",
                          desc: "We monitor air-fuel ratio, exhaust gas temps, knock, and boost in real time during every run — protecting your engine at every RPM.",
                        },
                        {
                          icon: (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                              <polyline points="12 6 12 12 16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Saves Time on the Road",
                          desc: "Controlled dyno tuning is faster and safer than road tuning. We can run dozens of calibration passes in the time it would take to do one road session.",
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
                    <h3 className="text-xl font-black text-[#0c1b33]">What&apos;s Included in a Dyno Session</h3>
                    <ul className="space-y-4">
                      {[
                        "Pre-session vehicle health check",
                        "Professional strapping & setup",
                        "Multiple power runs for repeatable data",
                        "Live air-fuel ratio & boost monitoring",
                        "Exhaust gas temperature tracking",
                        "Full power & torque graph printout",
                        "Expert debrief & tuning recommendations",
                        "Video recording of your power run",
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
