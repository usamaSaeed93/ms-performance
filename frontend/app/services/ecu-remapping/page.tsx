"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";


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
  const { heroImage, content1Image, content2Image } = useServicePageImages("ecu-remapping");

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="overflow-hidden">
        <Navbar ctaText="Book a Dyno" />

        <main className="space-y-20">
          {/* Hero Section */}
          <section className="relative overflow-hidden bg-[#030814] text-white">
            {heroImage && (
              <Image
                src={heroImage}
                alt="ECU Remapping"
                width={1600}
                height={700}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-black/60" />
            <div className="relative px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-12">
              <div className="space-y-4 max-w-3xl sm:space-y-5 md:space-y-6">
                <p className="flex items-center gap-2 text-xs font-semibold text-[#7ab6ff] sm:gap-3 sm:text-sm animate-subtitle">
                  <span className="h-px w-8 bg-[#7ab6ff] sm:w-12" />
                  Feel the Need for Speed: Dyno Car Tests
                </p>
                <h1 className="text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl animate-heading">
                  ECU Remapping
                </h1>
              </div>
            </div>
          </section>

          {/* Section 1: Car ECU Remapping: Unleashing Power */}
          <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12" style={{ gridAutoRows: '1fr' }}>
              <div className="space-y-4 flex flex-col sm:space-y-5 md:space-y-6">
                <div className="space-y-4 sm:space-y-5 md:space-y-6">
                  <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl lg:text-5xl">
                    Car ECU Remapping: Unleashing Power
                  </h2>
                  <p className="text-sm leading-relaxed text-[#5c6c86] sm:text-base md:text-lg">
                    Car ECU Remapping Optimizes Engine Performance By Adjusting Parameters Like Fuel Injection, Ignition Timing, And Turbo Boost. With MSPerformance's Expertise And State-Of-The-Art Tools, Unleash Your Vehicle's Hidden Potential. Experience Increased Power, Improved Fuel Efficiency, And A Customized Driving Experience.
                  </p>
                </div>
                <div className="relative overflow-hidden rounded-[20px] flex-shrink-0 animate-slide-right">
                  {content1Image && (
                    <Image
                      src={content1Image}
                      alt="ECU Remapping Process"
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover animate-image-hover"
                    />
                  )}
                </div>
              </div>
              <div className="relative overflow-hidden h-[650px] rounded-[20px] border-2 border-[#1d70ff] flex animate-slide-right">
                {content2Image && (
                  <Image
                    src={content2Image}
                    alt="Car Engine"
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover animate-image-hover"
                  />
                )}
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
          <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
            <div className="bg-white rounded-xl p-4 sm:rounded-2xl sm:p-6 md:rounded-[20px] md:p-8 lg:p-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-12">
                <div className="space-y-4 animate-slide-left sm:space-y-5 md:space-y-6">
                  <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl lg:text-4xl animate-heading">
                    Key Benefits Of The Service
                  </h2>
                  <p className="text-sm leading-relaxed text-[#0c1b33] sm:text-base md:text-lg">
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
                    className="rounded-[16px] bg-white shadow-sm"
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
        </main>
      </div>
    </div>
  );
}

