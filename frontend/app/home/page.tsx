"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  navLinks,
  vehicleMakes,
  vehicleModels,
  services,
  brandLogos,
  stats,
  products,
  testimonials,
  blogPosts,
  footerLinks,
} from "@/lib/constants";

export default function HomePage() {
  // Services carousel state
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const itemsPerPage = 4;

  // Products carousel state
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const productsPerPage = 4;

  // Testimonials carousel state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const testimonialsPerPage = 3;

  // Blog carousel state
  const [currentBlogIndex, setCurrentBlogIndex] = useState(0);
  const blogsPerPage = 2;

  // Add dummy services to extend the carousel
  const dummyServices = [
    {
      title: "Turbo Upgrades",
      description: "Enhanced turbo systems for maximum power and reliability.",
      image: "/images/services/ecu-remapping.png",
    },
    {
      title: "Performance Tuning",
      description: "Professional engine tuning for optimal performance gains.",
      image: "/images/services/dyno-tests.png",
    },
    {
      title: "ECU Diagnostics",
      description: "Comprehensive ECU diagnostics and fault code reading.",
      image: "/images/services/dpf-egr.png",
    },
    {
      title: "Stage Upgrades",
      description: "Complete stage upgrade packages for your vehicle.",
      image: "/images/services/custom-exhausts.png",
    },
  ];

  // Add dummy products
  const dummyProducts = [
    {
      id: 5,
      title: "Performance Air Filter",
      price: "£45.00",
      oldPrice: null,
      rating: 4.0,
      discount: null,
      image: "/images/products/product1.png",
      sold: 523,
    },
    {
      id: 6,
      title: "Sport Exhaust System",
      price: "£320.00",
      oldPrice: "£380.00",
      rating: 4.8,
      discount: "-15%",
      image: "/images/products/product2.png",
      sold: 789,
    },
    {
      id: 7,
      title: "ECU Tuning Module",
      price: "£250.00",
      oldPrice: null,
      rating: 4.5,
      discount: null,
      image: "/images/products/product3.png",
      sold: 456,
    },
    {
      id: 8,
      title: "Performance Brake Pads",
      price: "£89.00",
      oldPrice: null,
      rating: 4.2,
      discount: null,
      image: "/images/products/product4.png",
      sold: 634,
    },
  ];

  // Add dummy testimonials
  const dummyTestimonials = [
    {
      quote: "Outstanding service and results. My car runs better than ever!",
      name: "James Wilson",
      role: "Car Enthusiast",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      quote: "Professional team with excellent attention to detail.",
      name: "Sarah Thompson",
      role: "Performance Car Owner",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    },
  ];

  // Add dummy blog posts
  const dummyBlogPosts = [
    {
      title: "Understanding ECU Remapping: A Complete Guide",
      summary: "Learn everything you need to know about ECU remapping and performance tuning.",
      image: "/images/blog/latest1.png",
    },
    {
      title: "Top 5 Performance Modifications for Your Vehicle",
      summary: "Discover the best modifications to enhance your car's performance.",
      image: "/images/blog/latest2.png",
    },
  ];

  // Combine real and dummy data
  const allServices = [...services, ...dummyServices];
  const allProducts = [...products, ...dummyProducts];
  const allTestimonials = [...testimonials, ...dummyTestimonials];
  const allBlogPosts = [...blogPosts, ...dummyBlogPosts];

  // Services carousel functions
  const totalServicePages = Math.ceil(allServices.length / itemsPerPage);
  const nextServices = () => {
    setCurrentServiceIndex((prev) => (prev + 1) % totalServicePages);
  };
  const prevServices = () => {
    setCurrentServiceIndex((prev) => (prev - 1 + totalServicePages) % totalServicePages);
  };
  const getVisibleServices = () => {
    const start = currentServiceIndex * itemsPerPage;
    return allServices.slice(start, start + itemsPerPage);
  };

  // Products carousel functions
  const totalProductPages = Math.ceil(allProducts.length / productsPerPage);
  const nextProducts = () => {
    setCurrentProductIndex((prev) => (prev + 1) % totalProductPages);
  };
  const prevProducts = () => {
    setCurrentProductIndex((prev) => (prev - 1 + totalProductPages) % totalProductPages);
  };
  const getVisibleProducts = () => {
    const start = currentProductIndex * productsPerPage;
    return allProducts.slice(start, start + productsPerPage);
  };

  // Testimonials carousel functions
  const totalTestimonialPages = Math.ceil(allTestimonials.length / testimonialsPerPage);
  const nextTestimonials = () => {
    setCurrentTestimonialIndex((prev) => (prev + 1) % totalTestimonialPages);
  };
  const prevTestimonials = () => {
    setCurrentTestimonialIndex((prev) => (prev - 1 + totalTestimonialPages) % totalTestimonialPages);
  };
  const getVisibleTestimonials = () => {
    const start = currentTestimonialIndex * testimonialsPerPage;
    return allTestimonials.slice(start, start + testimonialsPerPage);
  };

  // Blog carousel functions
  const totalBlogPages = Math.ceil(allBlogPosts.length / blogsPerPage);
  const nextBlogs = () => {
    setCurrentBlogIndex((prev) => (prev + 1) % totalBlogPages);
  };
  const prevBlogs = () => {
    setCurrentBlogIndex((prev) => (prev - 1 + totalBlogPages) % totalBlogPages);
  };
  const getVisibleBlogs = () => {
    const start = currentBlogIndex * blogsPerPage;
    return allBlogPosts.slice(start, start + blogsPerPage);
  };
  return (
    <div className="min-h-screen bg-black">
      <div className="pt-8">
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
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm0 2v.51l8 5.33 8-5.33V6H4Zm0 12h16V9.49l-8 5.33-8-5.33V18Z"
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
                      link.href === "/home" ? "text-[#1d70ff]" : "text-white/80"
                    }`}
                  >
                    {link.label}
                    {link.href === "/home" && (
                      <span className="absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-6 rounded-full bg-gradient-to-r from-transparent via-[#1d70ff] to-transparent" />
                    )}
                  </Link>
                ))}
              </nav>

              <button className="rounded-[12px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(29,112,255,0.3)] animate-button">
                Become A Dealer
              </button>
            </div>
          </div>
        </header>

        <main className="mt-10 space-y-20">
          <div className="bg-white">
          <section className="relative overflow-hidden bg-[#030814] text-white">
            <Image
              src="/images/hero/slider1.jpg"
              alt="MS Performance hero"
              width={1600}
              height={700}
              className="absolute inset-0 h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-0 " />
            <div className="relative grid gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 md:gap-10 md:px-8 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
              <div className="space-y-4 animate-slide-left sm:space-y-5 md:space-y-6">
                <p className="flex items-center gap-2 text-xs font-semibold text-white sm:gap-3 sm:text-sm animate-subtitle">
                  <span className="h-px w-8 bg-white sm:w-12" />
                  Feel the Need for Speed: Dyno Car Tests
                </p>
                <h1 className="text-2xl font-black leading-tight sm:text-3xl md:text-4xl lg:text-[48px] animate-heading">
                  Maximize Power And Fuel Efficiency With Our ECU Remapping Services
                </h1>
              </div>
              <div className="flex justify-center sm:justify-end animate-slide-right">
                <div className="w-full max-w-[400px] rounded-xl backdrop-blur-[12px] p-4 text-white shadow-[0_30px_70px_rgba(2,6,14,0.7)] sm:rounded-2xl sm:p-6 md:rounded-[15px] md:p-8 animate-card" style={{ background: '#01010166' }}>
                  <p className="text-base font-semibold sm:text-lg">Select Your Vehicle</p>
                  <div className="mt-4 space-y-2 sm:mt-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-white/60 sm:text-xs">
                      Vehicle Registration
                    </p>
                    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
                      <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 sm:gap-3 sm:rounded-2xl sm:px-4 sm:py-3">
                        <span className="rounded bg-[#ffd200] px-1.5 py-0.5 text-[10px] font-semibold text-black sm:px-2 sm:py-1 sm:text-xs">
                          GB
                        </span>
                        <input
                          type="text"
                          placeholder="Your vehicle registration"
                          className="w-full bg-transparent text-xs text-white placeholder:text-white/60 focus:outline-none sm:text-sm"
                        />
                      </div>
                      <button className="w-full rounded-xl bg-[#ffd200] px-4 py-2.5 text-xs font-semibold text-black sm:w-auto sm:rounded-[12px] sm:px-4 sm:py-3 sm:text-sm animate-button">
                        Show
                      </button>
                    </div>
                  </div>
                  <p className="mt-3 text-[10px] text-white/70 sm:mt-4 sm:text-xs">or find your vehicle below</p>
                  <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                        Make
                      </p>
                      <select className="mt-2 w-full rounded-[14px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-[#7ab6ff] focus:outline-none">
                        <option className="bg-[#030814] text-white">- Please Select Make -</option>
                        {vehicleMakes.map((make) => (
                          <option key={make} className="bg-[#030814] text-white">
                            {make}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">
                        Model / Engine
                      </p>
                      <select className="mt-2 w-full rounded-[14px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-white focus:border-[#7ab6ff] focus:outline-none">
                        <option className="bg-[#030814] text-white">- Please Select Model -</option>
                        {vehicleModels.map((model) => (
                          <option key={model} className="bg-[#030814] text-white">
                            {model}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button className="mt-6 w-full rounded-[14px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_35px_rgba(29,112,255,0.35)]">
                    View Gains
                  </button>
                </div>
              </div>
            </div>
          </section>
          <section id="services" className="space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 md:px-8 md:py-10">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl">Our Services</h2>
              <div className="flex gap-2 sm:gap-3">
                <button 
                  onClick={prevServices}
                  className="rounded-xl border border-[#dfe6f2] p-2 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff] sm:rounded-2xl sm:p-3 animate-button"
                  aria-label="Previous services"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button 
                  onClick={nextServices}
                  className="rounded-xl border border-[#dfe6f2] p-2 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff] sm:rounded-2xl sm:p-3 animate-button"
                  aria-label="Next services"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {getVisibleServices().map((service, index) => (
                <div
                  key={service.title}
                  className={`flex h-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_15px_40px_rgba(12,30,59,0.08)] sm:gap-4 sm:rounded-[24px] sm:p-4.5 md:rounded-[28px] md:p-5 card-hover ${
                    index === 0 ? 'animate-card' : index === 1 ? 'animate-card-delay-1' : index === 2 ? 'animate-card-delay-2' : 'animate-card-delay-3'
                  }`}
                >
                  <div className="overflow-hidden rounded-[22px]">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={320}
                      height={220}
                      className="h-48 w-full object-cover animate-image-hover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-[#0c1b33]">{service.title}</h3>
                    <p className="text-sm text-[#5c6c86]">{service.description}</p>
                  </div>
                  <div className="mt-auto">
                    <button
                      className={`flex w-full items-center justify-center gap-2 rounded-[14px] px-6 py-3 text-sm font-semibold transition animate-button ${
                        index === 0
                          ? "bg-[#1d70ff] text-white shadow-[0_10px_25px_rgba(29,112,255,0.25)]"
                          : "border border-[#1d70ff] text-[#1d70ff]"
                      }`}
                    >
                      View
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path
                          d="M7 17l7-7-7-7"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path d="M13 3h4v4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              </div>
            </div>
            
            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalServicePages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentServiceIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentServiceIndex
                      ? 'w-8 bg-[#1d70ff]'
                      : 'w-2 bg-[#dfe6f2] hover:bg-[#1d70ff]/50'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </section>

          <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 overflow-hidden">
            <div className="relative w-full overflow-hidden">
              <div className="flex items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 animate-scroll-logos">
                {/* First set of logos */}
                {brandLogos.map((logo, index) => (
                  <div key={`logo-1-${index}`} className="flex-shrink-0">
                    <Image
                      src={logo}
                      alt={`Brand logo ${index + 1}`}
                      width={140}
                      height={60}
                      className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity sm:h-10 md:h-12"
                    />
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {brandLogos.map((logo, index) => (
                  <div key={`logo-2-${index}`} className="flex-shrink-0">
                    <Image
                      src={logo}
                      alt={`Brand logo ${index + 1}`}
                      width={140}
                      height={60}
                      className="h-8 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity sm:h-10 md:h-12"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-8 px-4 py-6 sm:space-y-10 sm:px-6 sm:py-8 md:space-y-12 md:px-8 md:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#1d70ff] sm:text-xs">
                  Customized Performance Solutions
                </p>
                <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl">
                  We&apos;re Chelmsford&apos;s Finest Car Tuning & Exhaust Destination
                </h2>
                <p className="text-sm text-[#5c6c86] sm:text-base">
                  With over a decade of experience in car tuning and custom exhaust installation, our
                  team brings advanced programming capabilities to unlock unique features for your
                  vehicle. From exhilarating pops and bangs to mesmerizing flames, we elevate your
                  car&apos;s performance and sound to new heights.
                </p>
              </div>
              <div className="relative h-[250px] w-full overflow-hidden sm:h-[300px] md:h-[400px] lg:h-full">
                <Image
                  src="/images/hero/mechanic-working.png"
                  alt="Mechanic working"
                  width={600}
                  height={500}
                  className="h-full w-full rounded-xl object-cover sm:rounded-2xl md:rounded-[20px]"
                />
              </div>
            </div>

            <div className="grid gap-6 px-4 pb-6 sm:gap-8 sm:px-6 sm:pb-8 md:grid-cols-2 md:px-8 md:pb-10 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.value} className="space-y-2">
                  <p className="text-3xl font-black text-[#0c1b33] sm:text-4xl">{stat.value}</p>
                  <div className="h-px w-10 bg-[#1d70ff] sm:w-12" />
                  <p className="text-xs text-[#5c6c86] sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="products" className="space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 md:space-y-10 md:px-8 md:py-10">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl">Our Products</h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={prevProducts}
                  className="rounded-xl border border-[#dfe6f2] p-2 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff] sm:rounded-2xl sm:p-3 animate-button"
                  aria-label="Previous products"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button 
                  onClick={nextProducts}
                  className="rounded-xl border border-[#dfe6f2] p-2 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff] sm:rounded-2xl sm:p-3 animate-button"
                  aria-label="Next products"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="w-full rounded-xl bg-[#1d70ff] px-4 py-2.5 text-xs font-semibold text-white sm:w-auto sm:rounded-[12px] sm:px-6 sm:py-3 sm:text-sm animate-button">
                  View All
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {getVisibleProducts().map((product, index) => (
                <div
                  key={index}
                  className={`relative flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_10px_40px_rgba(16,53,106,0.05)] sm:gap-4 sm:rounded-[24px] sm:p-5 md:rounded-[28px] md:p-6 card-hover ${
                    index === 0 ? 'animate-card' : index === 1 ? 'animate-card-delay-1' : index === 2 ? 'animate-card-delay-2' : 'animate-card-delay-3'
                  }`}
                >
                  {product.discount && (
                    <div className="absolute right-4 top-4 z-10 rounded-full bg-[#ffe5e5] px-3 py-1 text-xs font-semibold text-red-600">
                      {product.discount}
                    </div>
                  )}
                  <div className="relative overflow-hidden rounded-2xl">
                    <Image
                      src={product.image}
                      alt={product.title}
                      width={320}
                      height={220}
                      className="h-48 w-full object-cover animate-image-hover"
                    />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-base font-semibold leading-tight text-[#0c1b33]">
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => {
                        const starValue = idx + 1;
                        const fullStars = Math.floor(product.rating);
                        const hasHalfStar = product.rating % 1 >= 0.5;
                        const isFullStar = starValue <= fullStars;
                        const isHalfStar = hasHalfStar && starValue === fullStars + 1;
                        
                        if (isFullStar) {
                          return <span key={idx} className="text-lg text-yellow-400">★</span>;
                        } else if (isHalfStar) {
                          return <span key={idx} className="text-lg text-yellow-400">★</span>;
                        } else {
                          return <span key={idx} className="text-lg text-gray-300">★</span>;
                        }
                      })}
                      <span className="ml-1 text-sm text-[#5c6c86]">{product.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-[#0c1b33]">{product.price}</span>
                      {product.oldPrice && (
                        <span className="text-sm text-[#9aa6bd] line-through">{product.oldPrice}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
            
            {/* Products Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalProductPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentProductIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentProductIndex
                      ? 'w-8 bg-[#1d70ff]'
                      : 'w-2 bg-[#dfe6f2] hover:bg-[#1d70ff]/50'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </section>

          <section id="testimonials" className="space-y-6 rounded-xl bg-white px-4 py-6 sm:space-y-8 sm:rounded-2xl sm:px-6 sm:py-8 md:rounded-[32px] md:px-8 md:py-10 md:mx-4 lg:mx-8">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#1d70ff] sm:text-xs">
                What people say
                </p>
                <h2 className="mt-1 text-xl font-black text-[#0c1b33] sm:mt-2 sm:text-2xl md:text-3xl">Our testimonials</h2>
              </div>
              <div className="flex gap-2 sm:gap-3">
                <button 
                  onClick={prevTestimonials}
                  className="rounded-lg border border-[#d9e0ef] px-3 py-1.5 text-xs text-[#5c6c86] sm:rounded-full sm:px-4 sm:py-2 sm:text-sm animate-button"
                  aria-label="Previous testimonials"
                >
                  Prev
                </button>
                <button 
                  onClick={nextTestimonials}
                  className="rounded-lg border border-[#d9e0ef] px-3 py-1.5 text-xs text-[#5c6c86] sm:rounded-full sm:px-4 sm:py-2 sm:text-sm animate-button"
                  aria-label="Next testimonials"
                >
                  Next
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {getVisibleTestimonials().map((testimonial, index) => (
                <div
                  key={testimonial.name}
                  className={`flex w-full flex-col gap-3 rounded-xl bg-white p-4 shadow-[0_10px_30px_rgba(0,0,0,0.05)] sm:gap-4 sm:rounded-2xl sm:p-5 md:p-6 card-hover ${
                    index === 0 ? 'animate-card' : index === 1 ? 'animate-card-delay-1' : 'animate-card-delay-2'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      width={50}
                      height={50}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-[#0c1b33]">{testimonial.name}</p>
                      <p className="text-xs text-[#5c6c86]">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 text-[#ffb200]">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span key={idx}>★</span>
                    ))}
                  </div>
                  <p className="text-sm text-[#5c6c86]">"{testimonial.quote}"</p>
                </div>
              ))}
              </div>
            </div>
            
            {/* Testimonials Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalTestimonialPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonialIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentTestimonialIndex
                      ? 'w-8 bg-[#1d70ff]'
                      : 'w-2 bg-[#dfe6f2] hover:bg-[#1d70ff]/50'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </section>

          <section id="blog" className="space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 md:px-8 md:py-10">
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl">Latest Blogs</h2>
              <div className="flex items-center gap-3">
                <button 
                  onClick={prevBlogs}
                  className="rounded-xl border border-[#dfe6f2] p-2 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff] sm:rounded-2xl sm:p-3 animate-button"
                  aria-label="Previous blogs"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button 
                  onClick={nextBlogs}
                  className="rounded-xl border border-[#dfe6f2] p-2 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff] sm:rounded-2xl sm:p-3 animate-button"
                  aria-label="Next blogs"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="w-full rounded-xl bg-[#1d70ff] px-4 py-2.5 text-xs font-semibold text-white sm:w-auto sm:rounded-[12px] sm:px-6 sm:py-3 sm:text-sm animate-button">
                  View All
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
                {getVisibleBlogs().map((post, index) => (
                <article
                  key={index}
                  className={`flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_10px_40px_rgba(16,53,106,0.05)] sm:gap-4 sm:rounded-[24px] sm:p-5 md:rounded-[28px] md:p-6 card-hover ${
                    index === 0 ? 'animate-card' : 'animate-card-delay-1'
                  }`}
                >
                  <div className="overflow-hidden rounded-xl sm:rounded-2xl">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={360}
                      height={220}
                      className="h-40 w-full object-cover sm:h-44 md:h-48 animate-image-hover"
                    />
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-base font-bold text-[#0c1b33] sm:text-lg">{post.title}</h3>
                    <p className="text-xs text-[#5c6c86] sm:text-sm">{post.summary}</p>
                    <div className="mt-auto">
                      <button
                        className={`flex h-10 w-10 items-center justify-center rounded-lg transition animate-button sm:h-12 sm:w-12 sm:rounded-[12px] ${
                          index === 0
                            ? "bg-[#1d70ff] text-white"
                            : "border border-[#1d70ff] text-[#1d70ff]"
                        }`}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path
                            d="M7 17L17 7M17 7H7M17 7V17"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </article>
              ))}
              </div>
            </div>
            
            {/* Blog Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalBlogPages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentBlogIndex(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentBlogIndex
                      ? 'w-8 bg-[#1d70ff]'
                      : 'w-2 bg-[#dfe6f2] hover:bg-[#1d70ff]/50'
                  }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
          </section>

          <footer className="border-t border-[#1d70ff]/100 px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
            <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
              <div className="space-y-3 sm:space-y-4">
                <Link href="/">
                  <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={160} height={48} className="h-8 w-auto sm:h-10" />
                </Link>
                <p className="text-xs leading-relaxed text-[#5c6c86] sm:text-sm">
                  At MSPerformance, we specialize in car performance boosting services, ranging from ECU
                  remapping to custom exhausts. With our wealth of experience, we also offer comprehensive
                  basic servicing to ensure the overall maintenance and reliability of your vehicle.
                </p>
                <div className="flex flex-col items-start gap-2 pt-2 sm:flex-row sm:items-center sm:gap-3">
                  <span className="text-[10px] font-semibold text-[#9aa6bd] sm:text-xs">Payment Methods:</span>
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="text-[10px] text-[#5c6c86] sm:text-xs">WorldPay</span>
                    <span className="text-[10px] text-[#5c6c86] sm:text-xs">Mastercard</span>
                    <span className="text-[10px] text-[#5c6c86] sm:text-xs">Maestro</span>
                    <span className="text-[10px] text-[#5c6c86] sm:text-xs">Switch</span>
                    <span className="text-[10px] text-[#5c6c86] sm:text-xs">Visa</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="text-xs font-bold text-[#0c1b33] sm:text-sm">Our headquarters address is:</h3>
                <p className="text-xs text-[#5c6c86] sm:text-sm">Unit 16, Bakers Ln, Chelmsford CM2 8LD</p>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h3 className="flex items-center gap-2 text-xs font-bold text-[#0c1b33] sm:text-sm">
                  <span className="h-3 w-px bg-[#1d70ff] sm:h-4" />
                  Mailing Subscription
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    className="w-full rounded-lg border border-[#dfe6f2] px-3 py-2.5 text-xs text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none sm:rounded-[8px] sm:px-4 sm:py-3 sm:text-sm"
                  />
                  <input
                    type="email"
                    placeholder="Your Email"
                    className="w-full rounded-lg border border-[#dfe6f2] px-3 py-2.5 text-xs text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none sm:rounded-[8px] sm:px-4 sm:py-3 sm:text-sm"
                  />
                  <button className="w-full rounded-lg bg-[#1d70ff] px-4 py-2.5 text-xs font-semibold text-white sm:rounded-[8px] sm:px-6 sm:py-3 sm:text-sm animate-button">
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
                <div className="pt-2">
                  <p className="mb-2 text-sm font-bold text-[#0c1b33]">For overseas customers:</p>
                  <div className="flex items-center gap-2 text-sm text-[#5c6c86]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                      <path
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        fill="currentColor"
                      />
                    </svg>
                    <span>+44 (0)1637 875 209</span>
                  </div>
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
              <p className="text-sm text-[#5c6c86]">© Copyright 2025 MSPerformance</p>
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
                  Legal information
                </a>
                <span className="text-[#dfe6f2]">|</span>
                <a href="#" className="hover:text-[#1d70ff]">
                  Terms & Conditions
                </a>
              </div>
            </div>
          </footer>
          </div>
        </main>
      </div>
    </div>
  );
}