"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navLinks } from "@/lib/constants";

// Dummy blog data
const featuredArticle = {
  title: "Tesla's Fight Against Louisiana Auto Sales Law Revived By Appeals Court",
  author: "Kevin Mogill",
  date: "25 August 2024",
  readTime: "18 mins read",
  image: "/images/hero/slider1.jpg",
  category: "Blog",
};

const blogArticles = [
  {
    id: 1,
    title: "Mobile ECU Remapping & Performance Tuning in Essex - Chelmsford Service",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas nulla quis, the venenatis euismod nu",
    image: "/images/blog/latest1.png",
  },
  {
    id: 2,
    title: "Mobile ECU Remapping & Performance Tuning in Essex - Chelmsford Service",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas nulla quis, the venenatis euismod nu",
    image: "/images/blog/latest2.png",
  },
  {
    id: 3,
    title: "Mobile ECU Remapping & Performance Tuning in Essex - Chelmsford Service",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas nulla quis, the venenatis euismod nu",
    image: "/images/blog/latest3.png",
  },
  {
    id: 4,
    title: "Mobile ECU Remapping & Performance Tuning in Essex - Chelmsford Service",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas nulla quis, the venenatis euismod nu",
    image: "/images/blog/latest4.png",
  },
  {
    id: 5,
    title: "Mobile ECU Remapping & Performance Tuning in Essex - Chelmsford Service",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas nulla quis, the venenatis euismod nu",
    image: "/images/blog/latest2.png",
  },
  {
    id: 6,
    title: "Mobile ECU Remapping & Performance Tuning in Essex - Chelmsford Service",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Egestas nulla quis, the venenatis euismod nu",
    image: "/images/blog/latest3.png",
  },
];

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Category");

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-[1503px] px-4 pb-20 pt-8 lg:px-0">
        <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
        <header className="text-white">
            <div className="space-y-3 bg-black px-6 py-4 shadow-[0_20px_60px_rgba(1,4,13,0.65)]">
              <div className="flex flex-wrap items-center justify-between border-b-2 border-gray-700 pb-2 text-xs text-white/70">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                      <path
                        d="M12 2C7.03 2 3 5.58 3 10.01c0 5.39 6.39 11.42 8.76 13.37.13.12.31.19.49.19s.36-.07.49-.19c2.37-1.95 8.76-7.98 8.76-13.37C21 5.58 16.97 2 12 2Zm0 18.21C9.18 18.05 5 13.38 5 10.01 5 6.69 8.13 4 12 4s7 2.69 7 6.01c0 3.37-4.18 8.04-7 10.2Z"
                        fill="currentColor"
                      />
                      <circle cx="12" cy="10" r="3" fill="currentColor" />
                    </svg>
                    <span>Unit 16, Bakers Ln, Chelmsford CM2 8LD</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                      <path
                        d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm0 2v.51l8 5.33 8-5.33V6H4zm0 12h16V9.49l-8 5.33-8-5.33V18Z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>info@msperformance.co.uk</span>
                  </div>
                </div>
                <Link href="/cart" className="flex items-center gap-2 text-white">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M7 6h-2l-1 2v1h2l3.6 7.59c.18.34.52.56.9.56H19v-2h-7.42l-.1-.2L12.55 13H17c.38 0 .72-.21.89-.55L21 6H7Z"
                      fill="currentColor"
                    />
                    <circle cx="9" cy="21" r="1" fill="currentColor" />
                    <circle cx="17" cy="21" r="1" fill="currentColor" />
                  </svg>
                  <span>Shop</span>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <Link href="/">
                  <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={160} height={48} priority />
                </Link>

                <nav className="flex flex-1 flex-wrap items-center justify-end gap-6 text-sm font-semibold">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`relative pb-1 transition hover:text-[#1d70ff] ${
                        link.href === "/blog" ? "text-[#1d70ff]" : "text-white/80"
                      }`}
                    >
                      {link.label}
                      {link.href === "/blog" && (
                        <span className="absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-6 rounded-full bg-gradient-to-r from-transparent via-[#1d70ff] to-transparent" />
                      )}
                    </Link>
                  ))}
                </nav>

                <button className="rounded-[12px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(29,112,255,0.3)]">
                  Book a Dyno
                </button>
              </div>
            </div>
          </header>
          <main className="space-y-12">
            {/* Hero Section / Featured Article */}
            <section className="relative overflow-hidden bg-[#030814] text-white h-[700px]">
              <Image
                src="/images/blog/blogHero.png"
                alt={featuredArticle.title}
                width={1600}
                height={500}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative h-full flex items-end px-8 pb-12 lg:px-12">
                <div className="grid gap-8 lg:grid-cols-[2fr_1fr] w-full items-end">
                  {/* Left Side - Article Info */}
                  <div className="space-y-4">
                    <span className="inline-block rounded-[8px] bg-white/20 px-3 py-1 text-xs font-semibold text-white">
                      {featuredArticle.category}
                    </span>
                    <h1 className="text-4xl font-black leading-tight lg:text-5xl">
                      {featuredArticle.title}
                    </h1>
                    {/* Carousel Dots */}
                    <div className="flex gap-2">
                      {[1, 2, 3].map((dot) => (
                        <div
                          key={dot}
                          className={`h-2 w-2 rounded-full ${
                            dot === 1 ? "bg-white" : "bg-white/40"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Right Side - Author Info */}
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 flex-shrink-0 rounded-full overflow-hidden bg-gray-600">
                      <Image
                        src="/images/hero/slider1.jpg"
                        alt={featuredArticle.author}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-sm">
                      <p className="font-semibold text-white">By {featuredArticle.author}</p>
                      <p className="text-white/70">
                        {featuredArticle.date} • {featuredArticle.readTime}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Highlighted Articles Section */}
            <section className="px-8 py-10 lg:px-12">
              <h2 className="justify-center text-center text-3xl font-black text-[#0c1b33] mb-6">
                Highlighted Articles Or News At The Top Of The Page
              </h2>

              {/* Search and Filter Bar */}
              <div className="flex flex-wrap items-center gap-4 mb-8">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    placeholder="Find your latest news here"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 pl-10 pr-4 text-sm text-[#0c1b33] placeholder:text-gray-400 focus:border-[#1d70ff] focus:outline-none"
                  />
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-sm text-[#0c1b33] focus:border-[#1d70ff] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right pr-10"
                  style={{ backgroundPosition: 'right 0.75rem center' }}
                >
                  <option>Category</option>
                  <option>ECU Remapping</option>
                  <option>Dyno Tests</option>
                  <option>Custom Exhausts</option>
                  <option>News</option>
                </select>
                <button className="flex h-12 w-12 items-center justify-center rounded-[8px] bg-[#1d70ff] text-white hover:bg-[#1a5fdd] transition">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                    <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </div>

              {/* Top Article Grid - 3 Cards */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-12">
                {blogArticles.slice(0, 3).map((article) => (
                  <Link
                    key={article.id}
                    href="/blog/detail"
                    className="bg-white rounded-[16px] border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold text-[#0c1b33] line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-[#5c6c86] line-clamp-2">
                        {article.description}
                      </p>
                      <button className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#1d70ff] text-white hover:bg-[#1a5fdd] transition">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12h14M12 5l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Recent Blogs Section */}
              <h2 className="text-3xl font-black text-[#0c1b33] mb-6">Recent Blogs</h2>

              {/* Bottom Article Grid - 6 Cards (3x2) */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {blogArticles.map((article) => (
                  <Link
                    key={article.id}
                    href="/blog/detail"
                    className="bg-white rounded-[16px] border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={article.image}
                        alt={article.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <h3 className="text-lg font-bold text-[#0c1b33] line-clamp-2">
                        {article.title}
                      </h3>
                      <p className="text-sm text-[#5c6c86] line-clamp-2">
                        {article.description}
                      </p>
                      <button className="flex h-10 w-10 items-center justify-center rounded-[8px] bg-[#1d70ff] text-white hover:bg-[#1a5fdd] transition">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M5 12h14M12 5l7 7-7 7"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#1d70ff]/100 px-8 py-12">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
                <div className="space-y-4">
                  <Link href="/">
                    <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={160} height={48} />
                  </Link>
                  <p className="text-sm leading-relaxed text-[#5c6c86]">
                    At MSPerformance, we specialize in car performance boosting services, ranging from ECU
                    remapping to custom exhausts. With our wealth of experience, we also offer comprehensive
                    basic servicing to ensure the overall maintenance and reliability of your vehicle.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <span className="text-xs font-semibold text-[#9aa6bd]">Payment Methods:</span>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs text-[#5c6c86]">Visa</span>
                      <span className="text-xs text-[#5c6c86]">Mastercard</span>
                      <span className="text-xs text-[#5c6c86]">Maestro</span>
                      <span className="text-xs text-[#5c6c86]">American Express</span>
                      <span className="text-xs text-[#5c6c86]">PayPal</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-bold text-[#0c1b33]">Our headquarters address is:</h3>
                  <p className="text-sm text-[#5c6c86]">Unit 16, Bakers Ln, Chelmsford CM2 8LD</p>
                </div>

                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-[#0c1b33]">
                    <span className="h-4 w-px bg-[#1d70ff]" />
                    Mailing Subscription
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Your Name"
                      className="w-full rounded-[8px] border border-[#dfe6f2] px-4 py-3 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none"
                    />
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full rounded-[8px] border border-[#dfe6f2] px-4 py-3 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none"
                    />
                    <button className="w-full rounded-[8px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white">
                      Subscribe
                    </button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-[#5c6c86]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                        <path
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>0775 1798827 / 01277 715069</span>
                    </div>
                    <p className="text-xs text-[#9aa6bd]">Mon till Sat: 9:30 till 18:00</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-[#5c6c86]">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                        <path
                          d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.51l8 5.33 8-5.33V6H4zm0 12h16V9.49l-8 5.33-8-5.33V18z"
                          fill="currentColor"
                        />
                      </svg>
                      <span>info@msperformance.co.uk</span>
                    </div>
                    <p className="text-xs text-[#9aa6bd]">We reply within 1 day</p>
                  </div>
                  <div className="pt-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0c1b33]">
                      <span className="h-4 w-px bg-[#1d70ff]" />
                      Follow us
                    </h3>
                    <div className="space-y-2">
                      {["Facebook", "YouTube", "Twitter", "Instagram"].map((social) => (
                        <a
                          key={social}
                          href="#"
                          className="flex items-center gap-2 text-sm text-[#5c6c86] transition hover:text-[#1d70ff]"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                            <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="2" />
                          </svg>
                          <span>{social}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-[#dfe6f2] pt-6">
                <p className="text-sm text-[#5c6c86]">Copyright © 2023 MSPerformance</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-[#5c6c86]">
                  <a href="#" className="hover:text-[#1d70ff]">
                    Privacy Policy
                  </a>
                  <span className="text-[#dfe6f2]">|</span>
                  <a href="#" className="hover:text-[#1d70ff]">
                    Delivery & Returns
                  </a>
                  <span className="text-[#dfe6f2]">|</span>
                  <a href="#" className="hover:text-[#1d70ff]">
                    Legal Information
                  </a>
                  <span className="text-[#dfe6f2]">|</span>
                  <a href="#" className="hover:text-[#1d70ff]">
                    Terms & Conditions
                  </a>
                </div>
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

