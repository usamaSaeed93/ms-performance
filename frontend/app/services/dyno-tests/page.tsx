"use client";

import Image from "next/image";
import { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { useServicePageImages } from "@/hooks/useServicePageImage";
import { useServicePageContent } from "@/hooks/useServicePageContent";

const checkIcon = (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const featureIcons = [
  (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" />
      <polyline points="12 6 12 12 16 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
];

export default function DynoTestsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const { heroImage, content1Image, content2Image, content3Image, content4Image } =
    useServicePageImages("dyno-tests");
  const { content } = useServicePageContent("dyno-tests");

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
                    {content.hero.eyebrow}
                  </p>
                  <h1 className="text-4xl font-black leading-tight sm:text-5xl md:text-6xl">
                    {content.hero.title}
                  </h1>
                  <p className="text-gray-300 text-base md:text-lg leading-relaxed max-w-xl">
                    {content.hero.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    {content.hero.badges.map((badge) => (
                      <span
                        key={badge}
                        className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/40 px-4 py-1.5 text-sm font-medium text-[#7ab6ff]"
                      >
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ── Section 1: Intro ─────────────────────────────────────────────── */}
          <section className="bg-white px-4 py-16 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-7xl mx-auto grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16 items-center">
              <div className="space-y-6">
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">{content.intro.eyebrow}</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl leading-tight">
                  {content.intro.title.split("\n").map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </h2>
                {content.intro.paragraphs.map((paragraph, i) => (
                  <p key={i} className="text-base text-[#5c6c86] leading-relaxed">
                    {paragraph}
                  </p>
                ))}
                <ul className="space-y-3 pt-2">
                  {content.intro.bullets.map((item) => (
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
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">{content.gallery.eyebrow}</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">{content.gallery.title}</h2>
                <p className="text-[#5c6c86] max-w-2xl mx-auto text-base leading-relaxed">
                  {content.gallery.subtitle}
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { img: content2Image, label: content.gallery.labels[0] },
                  { img: content3Image, label: content.gallery.labels[1] },
                  { img: content4Image, label: content.gallery.labels[2] },
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
              <span className="text-xs font-bold tracking-widest text-[#7ab6ff] uppercase">{content.why.eyebrow}</span>
              <h2 className="text-3xl font-black sm:text-4xl md:text-5xl">{content.why.title}</h2>
              <p className="text-gray-300 text-base md:text-lg leading-relaxed">
                {content.why.paragraph}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-4 border-t border-white/10">
                {content.why.stats.map((stat) => (
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
                    <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">{content.benefits.eyebrow}</span>
                    <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">
                      {content.benefits.title}
                    </h2>
                    <p className="text-base text-[#5c6c86] leading-relaxed">
                      {content.benefits.paragraph}
                    </p>
                    {content.benefits.bullets.length > 0 && (
                      <ul className="space-y-3 pt-2 pb-4">
                        {content.benefits.bullets.map((item) => (
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
                    )}
                    <div className="space-y-6">
                      {content.benefits.features.map((item, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="flex-shrink-0 h-11 w-11 rounded-full bg-[#1d70ff] flex items-center justify-center">
                            {featureIcons[i] || featureIcons[0]}
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
                    <h3 className="text-xl font-black text-[#0c1b33]">{content.benefits.includedTitle}</h3>
                    <ul className="space-y-4">
                      {content.benefits.included.map((item) => (
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
                <span className="text-xs font-bold tracking-widest text-[#1d70ff] uppercase">{content.faq.eyebrow}</span>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl">
                  {content.faq.title}
                </h2>
              </div>
              <div className="space-y-3">
                {content.faq.items.map((faq, index) => (
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
