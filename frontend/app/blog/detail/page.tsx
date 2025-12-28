"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navLinks } from "@/lib/constants";
import { Navbar } from "@/components/Navbar";

const blogSections = [
  { id: "performance", title: "Unleashing Performance Potential" },
  { id: "handling", title: "Enhanced Handling And Safety" },
  { id: "customization", title: "Customization And Personalization" },
  { id: "resale", title: "Improved Resale Value" },
  { id: "conclusion", title: "In Conclusion" },
];

export default function BlogDetailPage() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar ctaText="Book a Dyno" />
      <div className="w-full">
        <div className="bg-white">

          <main className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#030814] text-white h-[500px]">
              <Image
                src="/images/blog/blogHero.png"
                alt="Blog Detail"
                width={1600}
                height={500}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative h-full flex items-end px-4 pb-8 sm:px-6 sm:pb-10 md:px-8 md:pb-12 lg:px-12">
                <div className="space-y-3 sm:space-y-4">
                  <h1 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl animate-heading">Blog Detail</h1>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="relative h-10 w-10 flex-shrink-0 rounded-full overflow-hidden bg-gray-600 sm:h-12 sm:w-12">
                      <Image
                        src="/images/hero/slider1.jpg"
                        alt="Kevin McGill"
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-xs sm:text-sm">
                      <p className="font-semibold text-white">By Kevin McGill</p>
                      <p className="text-white/70">23 August 2024 • 10 mins read</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Blog Content */}
            <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
              <div className="grid gap-6 lg:grid-cols-[250px_1fr] lg:gap-8">
                {/* Left Sidebar */}
                <aside className="lg:sticky lg:top-8 h-fit">
                  <div className="bg-gray-50 rounded-xl p-4 space-y-6 sm:rounded-2xl sm:p-5 sm:space-y-7 md:rounded-[16px] md:p-6 md:space-y-8">
                    {/* Jump To Section */}
                    <div>
                      <h3 className="text-lg font-bold text-[#0c1b33] mb-4">Jump To Section</h3>
                      <ul className="space-y-2">
                        {blogSections.map((section) => (
                          <li key={section.id}>
                            <button
                              onClick={() => scrollToSection(section.id)}
                              className="text-sm text-[#5c6c86] hover:text-[#1d70ff] transition text-left w-full"
                            >
                              {section.title}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Share Section */}
                    <div>
                      <h3 className="text-lg font-bold text-[#0c1b33] mb-4">Share</h3>
                      <div className="flex flex-row gap-3">
                        {/* Facebook */}
                        <button
                          className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#1d70ff] text-white hover:bg-[#1a5fdd] transition animate-button"
                          title="Facebook"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                          </svg>
                        </button>
                        {/* Twitter */}
                        <button
                          className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#1d70ff] text-white hover:bg-[#1a5fdd] transition animate-button"
                          title="Twitter"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                          </svg>
                        </button>
                        {/* Instagram */}
                        <button
                          className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#1d70ff] text-white hover:bg-[#1a5fdd] transition animate-button"
                          title="Instagram"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                          </svg>
                        </button>
                        {/* Email */}
                        <button
                          className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#1d70ff] text-white hover:bg-[#1a5fdd] transition animate-button"
                          title="Email"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </aside>

                {/* Main Content */}
                <article className="space-y-6 sm:space-y-7 md:space-y-8">
                  {/* Introductory Paragraph */}
                  <div className="bg-[#C9EEFF] rounded-lg p-4 text-black sm:rounded-xl sm:p-5 md:rounded-[12px] md:p-6">
                    <p className="text-sm leading-relaxed sm:text-base">
                      Car tuning has become a major trend among automotive enthusiasts who seek to improve their driving experience by making modifications and adjustments to various components of a vehicle. From tuning aims to enhance performance, handling, and personalization. In this blog post, we will explore the benefits of car tuning and why it can be good for your car.
                    </p>
                  </div>

                  {/* Section 1: Unleashing Performance Potential */}
                  <section id="performance" className="space-y-3 scroll-mt-8 sm:space-y-4">
                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl">Unleashing Performance Potential</h2>
                    <p className="text-sm leading-relaxed text-[#5c6c86] sm:text-base">
                      Car tuning can significantly improve your vehicle's engine performance, allowing you to unlock hidden horsepower and torque. By optimizing fuel injection, ignition timing, and turbo boost pressure, professional tuners can extract more power from your engine while maintaining reliability. This enhanced performance translates to better acceleration, higher top speeds, and a more exhilarating driving experience. Whether you're on the track or the open road, a well-tuned car delivers the power and responsiveness you crave.
                    </p>
                  </section>

                  {/* Section 2: Enhanced Handling And Safety */}
                  <section id="handling" className="space-y-3 scroll-mt-8 sm:space-y-4">
                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl">Enhanced Handling And Safety</h2>
                    <p className="text-sm leading-relaxed text-[#5c6c86] sm:text-base">
                      Beyond raw power, car tuning can dramatically improve your vehicle's handling characteristics and safety. Upgrading suspension components, brake systems, and chassis modifications can enhance cornering ability, reduce body roll, and improve overall stability. These improvements not only make your car more fun to drive but also contribute to safer driving conditions, especially in emergency situations where precise handling can make all the difference.
                    </p>
                  </section>

                  {/* Image Section */}
                  <div className="relative h-[250px] w-full rounded-lg overflow-hidden sm:h-[300px] sm:rounded-xl md:h-[350px] md:rounded-2xl lg:h-[400px] lg:rounded-[16px]">
                    <Image
                      src="/images/blog/BlogsDetail.png"
                      alt="Mechanic working on car"
                      width={800}
                      height={400}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Section 3: Customization And Personalization */}
                  <section id="customization" className="space-y-3 scroll-mt-8 sm:space-y-4">
                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl">Customization And Personalization</h2>
                    <p className="text-sm leading-relaxed text-[#5c6c86] sm:text-base">
                      One of the most appealing aspects of car tuning is the ability to personalize your vehicle to match your unique style and preferences. From exterior modifications like custom body kits and paint jobs to interior upgrades such as premium upholstery and advanced infotainment systems, tuning allows you to create a one-of-a-kind vehicle that reflects your personality. This level of customization ensures that your car stands out from the crowd and becomes a true extension of your identity.
                    </p>
                  </section>

                  {/* Section 4: Improved Resale Value */}
                  <section id="resale" className="space-y-3 scroll-mt-8 sm:space-y-4">
                    <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl">Improved Resale Value</h2>
                    <p className="text-sm leading-relaxed text-[#5c6c86] sm:text-base">
                      Contrary to popular belief, professional car tuning can actually increase your vehicle's resale value when done correctly. High-quality modifications, especially performance upgrades and well-maintained tuning work, can make your car more attractive to potential buyers. Enthusiasts and collectors often value professionally tuned vehicles, recognizing the investment and care that went into the modifications. This can result in a higher resale price compared to a stock vehicle.
                    </p>
                  </section>

                  {/* Section 5: In Conclusion */}
                  <section id="conclusion" className="space-y-4 scroll-mt-8">
                    <h2 className="text-3xl font-black text-[#0c1b33]">In Conclusion</h2>
                    <p className="text-base leading-relaxed text-[#5c6c86]">
                      Car tuning offers numerous benefits that can enhance your driving experience, improve performance, and add personal value to your vehicle. Whether you're looking to boost horsepower, improve handling, or create a unique ride, professional tuning services can help you achieve your automotive goals. Remember to work with experienced tuners who understand your vehicle's capabilities and can provide safe, reliable modifications that will serve you well for years to come.
                    </p>
                  </section>
                </article>
              </div>
            </section>


          </main>
        </div>
      </div>
    </div>
  );
}

