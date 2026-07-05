"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";

const faqs = [
  {
    question: "What is remapping?",
    answer:
      "Car remapping involves modifying a vehicle to enhance its performance, including boosting speed, improving functionality, and enhancing the overall driving experience. This process exclusively applies to existing car models and demands the expertise of professionals to ensure error-free execution.",
  },
  {
    question: "Is remapping safe for the vehicles?",
    answer:
      "Car remapping, performed by MSPerformance, involves enhancing and optimizing the engine power of a vehicle while adhering to safe limits. Our remapping service takes into account the high tolerance level of your vehicle and considers any applicable warranty claims. A thorough remapping procedure ensures that the engine control unit (ECU) does not approach component failure, making it completely safe for your car. It is crucial to choose a reputable company with skilled remapping experts who can flawlessly execute the job. We commence our car remapping process by thoroughly understanding your vehicle, ensuring improvements are made without any mechanical or component failures.",
  },
  {
    question: "Do you provide a warranty?",
    answer:
      "While undergoing vehicle remapping with MSPerformance, you can rest assured that your car will not encounter any mechanical or engine-related problems when properly maintained. However, we understand the importance of customer satisfaction, which is why we provide a 30-day money-back guarantee if the remapping results do not meet your desired outcomes or expectations.",
  },
  {
    question: "What about insurance?",
    answer:
      "Prior to making any modifications to your vehicle, we strongly recommend that clients inform their insurance company to avoid potential complications when filing insurance claims. Many insurance providers do not penalize customers for modifying their cars and transforming them into more fuel-efficient models. Additionally, we offer a conformity certificate if requested by the vehicle owner, ensuring compliance with any applicable regulations or requirements.",
  },
  {
    question: "Do you keep a copy of the original files?",
    answer:
      "At MSPerformance, we prioritize the security of our customers' original car files. We ensure their preservation by storing them in a secure archive, allowing you the option to restore your vehicle to its original configuration if the need arises in the future. This service provides you with peace of mind, knowing that your car's original settings can be reinstated whenever required, guaranteeing flexibility and preserving the integrity of your vehicle.",
  },
];

const checkIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ServicesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { heroImage, content1Image, content2Image, content3Image, content4Image } =
    useServicePageImages("ecu-remapping");

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
                alt="ECU Remapping"
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
                    Feel the Need for Speed
                  </p>
                  <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                    ECU Remapping
                  </h1>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                    Unlock your vehicle&apos;s hidden potential with bespoke ECU calibration — more power, better
                    response, and improved fuel economy, all verified on our state-of-the-art dyno.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      +15–30% Power
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      Dyno Verified
                    </span>
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]">
                      2–4 Hour Turnaround
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 1: Intro ─────────────────────────────────────────────── */}
          <section className="bg-white px-4 py-16 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Text */}
              <div className="space-y-6">
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">What We Do</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl leading-tight">
                  Car ECU Remapping:<br />Unleashing True Power
                </h2>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  Your car&apos;s ECU leaves the factory programmed for a compromise — balancing performance,
                  emissions, and fuel economy across dozens of markets. At MSPerformance, we go further. We read your
                  original ECU map, analyse every parameter, and write a completely bespoke calibration tailored
                  specifically to your engine and your goals.
                </p>
                <p className="text-base text-[#5c6c86] leading-relaxed">
                  Whether you want more outright power, sharper throttle response, or greater efficiency on longer
                  drives, our custom remaps deliver measurable, repeatable results — all validated live on our AWD
                  rolling road before you leave the workshop.
                </p>
                <ul className="space-y-3 pt-2">
                  {[
                    "15–30% increase in power & torque",
                    "Sharper throttle response & improved driveability",
                    "Better fuel efficiency, especially on diesel engines",
                    "Smoother, more progressive power delivery",
                    "Bespoke calibration — no generic off-the-shelf maps",
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
              {/* Image 1 */}
              <div className="relative overflow-hidden rounded-2xl h-[380px] sm:h-[440px] shadow-lg">
                {content1Image ? (
                  <Image src={content1Image} alt="ECU Remapping Process" fill className="object-cover" />
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
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">Our Workshop</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">See Us in Action</h2>
                <p className="text-[#5c6c86] max-w-2xl mx-auto text-base leading-relaxed">
                  From deep-dive diagnostics to live dyno runs, every remap at MSPerformance is backed by real data
                  and decades of hands-on expertise.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { img: content2Image, label: "Live Dyno Testing" },
                  { img: content3Image, label: "ECU Diagnostics" },
                  { img: content4Image, label: "Engine Bay Inspection" },
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
              <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">
                Choose MSPerformance
              </h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                With years of hands-on experience and thousands of successful remaps under our belt, MSPerformance
                has become the trusted name for ECU tuning in the region. We never use generic maps. Every remap is
                custom-crafted for your specific vehicle, tested live on our dyno, and backed by our satisfaction
                guarantee — giving you complete confidence in every single gain.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 border-t border-white/10">
                {[
                  { value: "30%", label: "Avg. Power Gain" },
                  { value: "1,000+", label: "Remaps Completed" },
                  { value: "20+", label: "Years Experience" },
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
                      Key Benefits of the Service
                    </h2>
                    <p className="text-base text-[#5c6c86] leading-relaxed">
                      Unlock the potential of your car with our service's key benefits, including enhanced
                      horsepower and performance through software customization.
                    </p>
                    <ul className="space-y-3 pt-2 pb-4">
                      {[
                        "Precise Workmanship, Exceeding Customer Expectations",
                        "100% Committed to Excellence in Every Project",
                        "Extensive Selection of Premium Performance Upgrades",
                      ].map((item) => (
                        <li key={item} className="flex items-start gap-3">
                          <div className="mt-0.5 h-5 w-5 rounded-full bg-[#22c55e] flex items-center justify-center flex-shrink-0">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                              <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <span className="text-sm font-semibold text-[#5c6c86]">{item}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="space-y-6">
                      {[
                        {
                          icon: (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Increase Safety",
                          desc: "Dedicated to auto repair done right the first time",
                        },
                        {
                          icon: (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
                              <polyline points="12 6 12 12 16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          ),
                          title: "Time-Saving",
                          desc: "Our remappers install the perfect remap for your car in minutes",
                        },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                          <div className="flex-shrink-0 h-16 w-16 bg-[#1d70ff] flex items-center justify-center">
                            {item.icon}
                          </div>
                          <div>
                            <h3 className="font-bold text-[#0c1b33] text-xl">{item.title}</h3>
                            <p className="mt-2 text-sm text-[#5c6c86] leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  {/* Right: checklist card */}
                  <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 space-y-6 self-start">
                    <h3 className="text-xl font-black text-[#0c1b33]">What&apos;s Included in Every Remap</h3>
                    <ul className="space-y-4">
                      {[
                        "Pre-remap health check & fault code scan",
                        "Custom ECU map written for your specific car",
                        "Live dyno run — before & after data",
                        "Fuel, boost & ignition calibration",
                        "Throttle response & rev limiter optimisation",
                        "Post-remap road test & verification",
                        "Certificate of calibration provided",
                        "Aftercare support & follow-up included",
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
