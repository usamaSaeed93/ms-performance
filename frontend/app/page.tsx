"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useGetPublishedBlogsQuery } from "@/lib/store/api/blogsApi";

const navLinks = [
  "Home",
  "Services",
  "Gains Calculator",
  "Blog",
  "Contact Us",
];

const calculatorFields = [
  "Vehicle Make",
  "Vehicle Model",
  "Vehicle Year",
  "Engine Type",
];

const serviceCards = [
  {
    title: "ECU Remapping",
    description: "Achieve unmatched performance with bespoke ECU calibrations.",
    icon: "ECU",
  },
  {
    title: "Dyno Tests",
    description: "Accurate performance assessment on our AWD dyno cells.",
    icon: "DYNO",
  },
  {
    title: "Custom Exhausts",
    description: "Personalize tone and flow with hand-built exhaust systems.",
    icon: "EXH",
  },
  {
    title: "DPF & EGR Services",
    description: "Increase efficiency with precise DPF/EGR maintenance.",
    icon: "DPF",
  },
];

const stats = [
  { value: "12+", label: "Years Of Experience In Maintaining Or Servicing Of Cars" },
  { value: "945+", label: "Cars Remapped By The MS Performance" },
  { value: "1023+", label: "Exhausts Installed In Cars By The MS Performance" },
  { value: "99%", label: "Success Rate Of Providing Car Repairing Services" },
];

const serviceSteps = [
  { title: "MAKE AN APPOINTMENT", copy: "Promotors has made it easy to schedule an appointment online at a location near you in a few simple steps, easy schedule for customers." },
  { title: "SELECT SERVICE", copy: "Promotors has made it easy to schedule an appointment online at a location near you." },
  { title: "CONFIRM REQUEST", copy: "Promotors has made it easy to schedule an appointment." },
  { title: "GET YOUR CAR", copy: "Promotors has made it easy to schedule an appointment online at a location near you in a" },
];

const advantages = [
  {
    title: "Unmatched Quality",
    copy: "Craft, Prime Materials, Exceptional Results",
    icon: "✓",
  },
  {
    title: "Trained Technicians",
    copy: "Certified Mechanics For Reliable Service.",
    icon: "⚙",
  },
  {
    title: "Free Consultation",
    copy: "Free Professional Expert Consultation Available",
    icon: "📞",
  },
  {
    title: "Cutting-Edge Tech",
    copy: "We Update Our Softwares On A Weekly Basis",
    icon: "🔧",
  },
  {
    title: "Customer Satisfaction",
    copy: "Exceeding Expectations, Ensuring Satisfaction",
    icon: "⭐",
  },
  {
    title: "Quick Service Times",
    copy: "We're Opened From Early Morning Till Late Evening",
    icon: "⏱",
  },
];

const testimonials = [
  {
    name: "Stephen Brekke",
    role: "Legacy Integration Producer",
    quote:
      "If you want real tuning that works and tight implementation - MS Performance has you covered.",
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Stephen Brekke",
    role: "Legacy Integration Producer",
    quote:
      "Their crew communicates every milestone and the dyno sheets speak for themselves.",
    image:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=200&q=80",
  },
  {
    name: "Stephen Brekke",
    role: "Legacy Integration Producer",
    quote:
      "Top-notch attention to detail. I recommend MS Performance to all motorsport clients.",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80",
  },
];

export default function Home() {
  const router = useRouter();
  
  // Redirect to /home page
  useEffect(() => {
    router.replace("/home");
  }, [router]);

  // Return null to prevent rendering while redirecting
  return null;

  // Fetch published blogs
  const { data: blogsData, isLoading: blogsLoading } = useGetPublishedBlogsQuery({
    page: 1,
    per_page: 10,
    order_by: 'published_at',
    order: 'desc',
  });
  // Service cards carousel state
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const serviceItemsPerPage = 4;

  // Advantages carousel state
  const [currentAdvantageIndex, setCurrentAdvantageIndex] = useState(0);
  const advantageItemsPerPage = 3;

  // Testimonials carousel state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const testimonialItemsPerPage = 3;

  // News carousel state
  const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
  const newsItemsPerPage = 2;

  // Add dummy service cards
  const dummyServiceCards = [
    {
      title: "Turbo Upgrades",
      description: "Enhanced turbo systems for maximum power.",
      icon: "TURBO",
    },
    {
      title: "Performance Tuning",
      description: "Professional engine tuning services.",
      icon: "TUNE",
    },
    {
      title: "ECU Diagnostics",
      description: "Comprehensive ECU diagnostics.",
      icon: "DIAG",
    },
    {
      title: "Stage Upgrades",
      description: "Complete stage upgrade packages.",
      icon: "STAGE",
    },
  ];

  // Add dummy advantages
  const dummyAdvantages = [
    {
      title: "Expert Team",
      copy: "Certified professionals with years of experience",
      icon: "👨‍🔧",
    },
    {
      title: "Quality Assurance",
      copy: "100% satisfaction guarantee on all services",
      icon: "✅",
    },
  ];

  // Add dummy testimonials
  const dummyTestimonials = [
    {
      name: "James Wilson",
      role: "Car Enthusiast",
      quote: "Outstanding service and results. Highly recommended!",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    {
      name: "Sarah Thompson",
      role: "Performance Car Owner",
      quote: "Professional team with excellent attention to detail.",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    },
  ];

  // Transform blogs for display
  const allNewsCards = useMemo(() => {
    if (!blogsData?.blogs || blogsData.blogs.length === 0) {
      // Fallback to dummy news if no blogs available
      return [
        {
          id: null,
          title: "Understanding ECU Remapping: A Complete Guide",
          copy: "Learn everything you need to know about ECU remapping.",
          image: "/latest1.png",
          slug: null,
        },
        {
          id: null,
          title: "Top 5 Performance Modifications",
          copy: "Discover the best modifications for your vehicle.",
          image: "/latest2.png",
          slug: null,
        },
      ];
    }
    
    return blogsData.blogs.map((blog) => ({
      id: blog.id,
      title: blog.title,
      copy: blog.excerpt || "Read more about this topic...",
      image: blog.featured_image || "/latest1.png",
      slug: blog.slug,
    }));
  }, [blogsData]);

  // Combine real and dummy data
  const allServiceCards = [...serviceCards, ...dummyServiceCards];
  const allAdvantages = [...advantages, ...dummyAdvantages];
  const allTestimonials = [...testimonials, ...dummyTestimonials];

  // Service cards carousel functions
  const totalServicePages = Math.ceil(allServiceCards.length / serviceItemsPerPage);
  const nextServices = () => setCurrentServiceIndex((prev) => (prev + 1) % totalServicePages);
  const prevServices = () => setCurrentServiceIndex((prev) => (prev - 1 + totalServicePages) % totalServicePages);
  const getVisibleServices = () => {
    const start = currentServiceIndex * serviceItemsPerPage;
    return allServiceCards.slice(start, start + serviceItemsPerPage);
  };

  // Advantages carousel functions
  const totalAdvantagePages = Math.ceil(allAdvantages.length / advantageItemsPerPage);
  const nextAdvantages = () => setCurrentAdvantageIndex((prev) => (prev + 1) % totalAdvantagePages);
  const prevAdvantages = () => setCurrentAdvantageIndex((prev) => (prev - 1 + totalAdvantagePages) % totalAdvantagePages);
  const getVisibleAdvantages = () => {
    const start = currentAdvantageIndex * advantageItemsPerPage;
    return allAdvantages.slice(start, start + advantageItemsPerPage);
  };

  // Testimonials carousel functions
  const totalTestimonialPages = Math.ceil(allTestimonials.length / testimonialItemsPerPage);
  const nextTestimonials = () => setCurrentTestimonialIndex((prev) => (prev + 1) % totalTestimonialPages);
  const prevTestimonials = () => setCurrentTestimonialIndex((prev) => (prev - 1 + totalTestimonialPages) % totalTestimonialPages);
  const getVisibleTestimonials = () => {
    const start = currentTestimonialIndex * testimonialItemsPerPage;
    return allTestimonials.slice(start, start + testimonialItemsPerPage);
  };

  // News carousel functions
  const totalNewsPages = Math.ceil(allNewsCards.length / newsItemsPerPage);
  const nextNews = () => setCurrentNewsIndex((prev) => (prev + 1) % totalNewsPages);
  const prevNews = () => setCurrentNewsIndex((prev) => (prev - 1 + totalNewsPages) % totalNewsPages);
  const getVisibleNews = () => {
    const start = currentNewsIndex * newsItemsPerPage;
    return allNewsCards.slice(start, start + newsItemsPerPage);
  };

  return (
    <div className="min-h-screen bg-[#010101] text-white">
      <div className="flex flex-col gap-16 pt-8">
        <header className="flex h-auto min-h-[85px] w-full flex-col items-center gap-4 border-b border-[#1cadee] bg-[#010101] px-4 py-4 md:flex-row md:justify-between lg:gap-6 lg:px-6">
          <div className="flex w-full items-center justify-between md:w-auto">
            <Image
              src="/images/logos/ms-logo.png"
              alt="MS Performance"
              width={160}
              height={48}
              className="h-8 w-auto md:h-10"
              priority
            />
            <button className="md:hidden" aria-label="Menu">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            </button>
          </div>
          <nav className="hidden flex-1 items-center justify-center gap-4 text-sm font-normal leading-none text-white/80 md:flex md:gap-6 lg:text-[15px] [font-family:var(--font-montserrat)]">
            <span
              aria-hidden
              className="hidden h-5 w-[2px] rounded-full bg-[#1cadee] lg:block"
            />
            {navLinks.map((link) =>
              link === "Home" ? (
                <Link key={link} href="/home" className="hover:text-[#12a7ff]">
                  {link}
                </Link>
              ) : (
                <span key={link} className="hover:text-[#12a7ff]">
                  {link}
                </span>
              ),
            )}
          </nav>
          <button className="hidden h-[42px] w-[148px] items-center justify-center gap-[10px] rounded-[10px] bg-[#12a7ff] px-[30px] py-[12px] text-sm font-semibold text-black shadow-[0_10px_25px_rgba(18,167,255,0.35)] md:flex animate-button">
            Call us Now
          </button>
        </header>

        <section className="relative px-4 md:px-6 lg:px-8">
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg bg-black sm:h-[500px] md:h-[600px] lg:h-[700px]">
            <Image
              src="/images/hero/hero-card.png"
              alt="Hero car"
              width={2000}
              height={900}
              className="absolute inset-0 h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="relative z-10 flex h-full w-full flex-col justify-center gap-4 px-4 py-8 text-left sm:gap-6 sm:px-6 sm:py-10 md:w-2/3 md:px-10 md:py-12 lg:px-12">
              <p className="flex max-w-[300px] items-center gap-2 text-xs font-normal leading-[100%] tracking-[0] text-white sm:gap-3 sm:text-sm md:text-[15px] [font-family:var(--font-montserrat)] animate-subtitle">
                <span className="h-4 w-[2px] rounded-full bg-[#1cadee] sm:h-5" />  
                Feel the Need for Speed: Dyno Car Tests
              </p>
              <h1 className="text-2xl font-black leading-tight sm:text-3xl md:text-4xl lg:text-5xl animate-heading">
                Maximize Power And Fuel Efficiency With Our ECU Remapping Services
              </h1>
              <div>
                <button className="inline-flex h-[44px] w-full items-center justify-center gap-[10px] rounded-[10px] bg-[#12a7ff] px-6 py-3 text-sm font-semibold text-black shadow-[0_10px_25px_rgba(18,167,255,0.35)] sm:w-[168px] sm:px-[40px] sm:py-[16px] animate-button">
                  Call us Now
                </button>
              </div>
            </div>
          </div>
          <div className="relative z-10 mx-auto -mt-8 flex w-full max-w-full flex-wrap items-center gap-3 rounded-2xl border border-white/5 bg-[#050505]/95 px-4 py-4 shadow-[0_25px_70px_rgba(0,0,0,0.65)] backdrop-blur sm:-mt-10 sm:gap-4 sm:rounded-[24px] sm:px-6 sm:py-5 md:-mt-12 md:w-[94%] md:gap-5 md:rounded-[32px] md:px-8 md:py-6">
            {calculatorFields.map((field) => (
              <button
                key={field}
                className="flex w-full flex-1 items-center justify-between rounded-xl border border-white/5 bg-[#0b0b0b] px-4 py-3 text-left text-sm font-medium text-white/90 shadow-inner shadow-black/40 transition hover:bg-white/5 sm:rounded-[18px] sm:px-5 sm:py-3.5 md:rounded-[22px] md:px-7 md:py-4 md:text-base"
              >
                <span className="truncate">{field}</span>
                <svg
                  aria-hidden
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-white/70"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>
            ))}
            <button className="h-[50px] w-full rounded-xl bg-[#12a7ff] px-6 text-sm font-semibold text-black shadow-[0_20px_45px_rgba(18,167,255,0.45)] sm:h-[55px] sm:w-auto sm:rounded-[18px] sm:px-8 md:h-[60px] md:rounded-[22px] md:px-12 md:text-base">
              View Gains
            </button>
          </div>
        </section>
          <div className="flex flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:gap-6 md:px-6 lg:px-8">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#12a7ff] sm:text-sm">
                Repair and Maintenance
              </p>
              <h2 className="mt-2 text-2xl font-black text-white sm:mt-3 sm:text-3xl md:text-4xl [text-shadow:0_6px_25px_rgba(0,0,0,0.55)]">
                Our Services
              </h2>
            </div>
            <p className="max-w-xl text-sm text-white/70 sm:text-base">
              Our comprehensive repair service keeps your vehicle moving smoothly. From
              minor repairs to major overhauls, we offer ECU remapping, custom exhaust
              installation, dyno calibration, and more.
            </p>
          </div>
          <div className="mt-6 grid gap-6 px-4 sm:mt-8 sm:gap-8 md:px-6 lg:mt-10 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
            <div className="relative h-[300px] w-full overflow-hidden rounded-2xl sm:h-[400px] md:h-[480px] lg:h-[520px] lg:rounded-[28px] animate-slide-left">
              <Image
                src="/images/services/our-services.png"
                alt="Workshop"
                width={1100}
                height={900}
                className="h-full w-full object-cover animate-image-hover"
              />
            </div>
            <div className="relative overflow-hidden">
              <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
                {getVisibleServices().map((card, index) => (
                <div
                  key={card.title}
                  className={`group overflow-hidden rounded-2xl p-4 shadow-[0_20px_45px_rgba(0,0,0,0.45)] sm:rounded-[24px] sm:p-5 md:rounded-[28px] md:p-6 card-hover ${
                    index === 0 ? 'animate-card' : index === 1 ? 'animate-card-delay-1' : index === 2 ? 'animate-card-delay-2' : 'animate-card-delay-3'
                  } ${
                    card.title === "ECU Remapping"
                      ? "relative bg-[#050505]"
                      : "bg-gradient-to-br from-[#0b0b0b] via-[#050505] to-[#010101]"
                  }`}
                >
                  {card.title === "ECU Remapping" && (
                    <>
                      <Image
                        src="/images/services/ecu-remap-card.png"
                        alt="ECU Remapping background"
                        width={600}
                        height={360}
                        className="absolute inset-0 h-full w-full object-cover opacity-60 transition duration-500 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/70 to-transparent" />
                    </>
                  )}
                  <div className="relative z-10">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0a0a0a] text-lg text-[#12a7ff] sm:h-12 sm:w-12 sm:text-xl">
                      {card.icon}
                    </div>
                    <p className="mt-4 text-sm text-white/70 sm:mt-5 sm:text-base md:mt-6">{card.description}</p>
                  </div>
                </div>
                ))}
              </div>
            </div>
            
            {/* Service Cards Carousel Navigation */}
            <div className="flex justify-center gap-2 mt-6 px-4 sm:px-6 md:px-8">
              <button 
                onClick={prevServices}
                className="rounded-xl border border-white/10 p-2 text-white transition hover:border-[#12a7ff] hover:text-[#12a7ff] sm:rounded-2xl sm:p-3 animate-button"
                aria-label="Previous services"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalServicePages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentServiceIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentServiceIndex
                        ? 'w-8 bg-[#12a7ff]'
                        : 'w-2 bg-white/20 hover:bg-[#12a7ff]/50'
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextServices}
                className="rounded-xl border border-white/10 p-2 text-white transition hover:border-[#12a7ff] hover:text-[#12a7ff] sm:rounded-2xl sm:p-3 animate-button"
                aria-label="Next services"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>          <div className="flex flex-wrap items-start gap-10">
            <div className="w-full space-y-4 sm:space-y-5 md:space-y-6 md:w-auto">
              <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#12a7ff] sm:gap-3 sm:text-sm">
                <span className="h-4 w-[2px] rounded-full bg-[#12a7ff] sm:h-5" />
                Customized Performance Solutions
              </p>
              <h2 className="text-2xl font-black text-white sm:text-3xl md:text-4xl">
                We&apos;re Chelmsford&apos;s Finest Car Tuning & Exhaust Destination
              </h2>
              <p className="text-sm leading-relaxed text-white/80 sm:text-base">
                With over a decade of experience in car tuning and custom exhaust installation, our advanced programming capabilities allow us to create everything from exhilarating pops and bangs to mesmerizing flames. We elevate your car&apos;s performance and sound to new heights.
              </p>
            </div>
            <div className="relative h-[250px] w-full overflow-hidden rounded-lg sm:h-[300px] md:h-[350px] md:w-[500px] lg:h-[390px] lg:w-[586px] lg:rounded-[10px] animate-slide-right">
              <Image
                src="/mechanic-working.png"
                alt="Mechanic working"
                width={586}
                height={390}
                className="h-full w-full object-cover animate-image-hover"
              />
            </div>
          </div>
          <div className="border-t border-white/10 bg-black px-4 py-6 sm:px-6 sm:py-7 md:px-8 md:py-8 lg:px-10">
            <div className="mx-auto grid max-w-[1220px] grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-8 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.value} className="space-y-2">
                  <p className="text-3xl font-black text-white sm:text-4xl">{stat.value}</p>
                  <p className="text-xs leading-relaxed text-white/80 sm:text-sm">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

        <section className="w-full bg-[#050505] px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 lg:px-12">
          <div className="mx-auto flex max-w-7xl flex-col gap-6 sm:gap-8 md:flex-row md:gap-10 lg:gap-12">
            <div className="space-y-4 sm:space-y-5 md:space-y-6">
              <h2 className="text-3xl font-black uppercase leading-tight text-white sm:text-4xl md:text-5xl">
                HOW TO SERVICE<br className="hidden sm:block" />
                <span className="sm:hidden"> </span>YOUR CAR
              </h2>
              <p className="max-w-lg text-sm leading-relaxed text-white sm:text-base">
                Rather than letting your services go by, take these steps to keep your car in good shape until you can afford a full service.
              </p>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6">
              {serviceSteps.map((step, index) => (
                <div key={step.title} className="space-y-2 sm:space-y-3">
                  <p className="text-xl font-bold text-[#12a7ff] sm:text-2xl">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-base font-bold uppercase text-white sm:text-lg">{step.title}</h3>
                  <div className={`h-[1px] w-full ${index === 0 ? "bg-[#12a7ff]" : "bg-white/30"}`} />
                  <p className="text-xs leading-relaxed text-white/80 sm:text-sm">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-6 px-4 sm:gap-8 sm:px-6 md:gap-10 md:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
          {/* LEFT SIDE TEXT + CARDS */}
          <div>
            <p className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-[#12a7ff] sm:mb-3 sm:gap-3 sm:text-sm">
              <span className="h-4 w-[2px] rounded-full bg-[#12a7ff] sm:h-5" />
              Our Key Advantages
            </p>

            <h2 className="mb-6 text-2xl font-black text-white sm:mb-8 sm:text-3xl md:mb-10 md:text-4xl">Why Choose Us</h2>

            {/* CARDS GRID */}
            <div className="relative overflow-hidden">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:gap-6 lg:grid-cols-2 xl:grid-cols-3">
                {getVisibleAdvantages().map((adv, index) => (
                <div
                  key={adv.title}
                  className={`flex min-h-[200px] flex-col gap-5 rounded-[12px] bg-[#090909] p-6 card-hover ${
                    index === 0 ? 'animate-card' : index === 1 ? 'animate-card-delay-1' : index === 2 ? 'animate-card-delay-2' : index === 3 ? 'animate-card-delay-3' : index === 4 ? 'animate-card animate-stagger-4' : 'animate-card animate-stagger-5'
                  }`}
                >
                  <div className="text-4xl text-[#12a7ff]">{adv.icon}</div>

                  <div>
                    <p className="text-lg font-bold text-white">{adv.title}</p>
                    <p className="mt-2 text-sm text-white/70">{adv.copy}</p>
                  </div>
                </div>
                ))}
              </div>
            </div>
            
            {/* Advantages Carousel Navigation */}
            <div className="flex justify-center gap-2 mt-6">
              <button 
                onClick={prevAdvantages}
                className="rounded-xl border border-white/10 p-2 text-white transition hover:border-[#12a7ff] hover:text-[#12a7ff] sm:rounded-2xl sm:p-3 animate-button"
                aria-label="Previous advantages"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="flex items-center gap-2">
                {Array.from({ length: totalAdvantagePages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentAdvantageIndex(index)}
                    className={`h-2 rounded-full transition-all ${
                      index === currentAdvantageIndex
                        ? 'w-8 bg-[#12a7ff]'
                        : 'w-2 bg-white/20 hover:bg-[#12a7ff]/50'
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
              <button 
                onClick={nextAdvantages}
                className="rounded-xl border border-white/10 p-2 text-white transition hover:border-[#12a7ff] hover:text-[#12a7ff] sm:rounded-2xl sm:p-3 animate-button"
                aria-label="Next advantages"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>

          {/* RIGHT SIDE IMAGE */}
          <div className="relative h-[300px] w-full overflow-hidden rounded-xl sm:h-[400px] md:h-[500px] lg:h-[600px] lg:rounded-[20px] animate-slide-right">
            <Image
              src="/images/services/our-service.png"
              alt="Technician at laptop"
              width={900}
              height={900}
              className="h-full w-full object-cover animate-image-hover"
            />
          </div>
        </div>
          <div className="flex flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:gap-6 md:px-6 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#12a7ff] sm:text-sm">
                What People Say
              </p>
              <h2 className="mt-1 text-2xl font-black sm:text-3xl md:text-4xl">Our Testimonials</h2>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <button 
                onClick={prevTestimonials}
                className="rounded-lg border border-white/20 px-3 py-2 text-xs text-white/70 sm:rounded-xl sm:px-4 sm:text-sm animate-button"
                aria-label="Previous testimonials"
              >
                Prev
              </button>
              <button 
                onClick={nextTestimonials}
                className="rounded-lg border border-white/20 px-3 py-2 text-xs text-white/70 sm:rounded-xl sm:px-4 sm:text-sm animate-button"
                aria-label="Next testimonials"
              >
                Next
              </button>
            </div>
          </div>
          <div className="relative overflow-hidden">
            <div className="mt-6 grid gap-4 px-4 sm:mt-8 sm:gap-6 md:grid-cols-2 md:px-6 lg:grid-cols-3 lg:px-8">
              {getVisibleTestimonials().map((testimonial, index) => (
              <div
                key={testimonial.quote}
                className={`flex w-full flex-col gap-3 rounded-xl border border-white/10 bg-[#090909] p-4 sm:gap-4 sm:rounded-2xl sm:p-5 md:p-6 card-hover ${
                  index === 0 ? 'animate-card' : index === 1 ? 'animate-card-delay-1' : 'animate-card-delay-2'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Image
                    src={testimonial.image}
                    alt={testimonial.name}
                    width={48}
                    height={48}
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-xs text-white/70">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 text-[#12a7ff]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <span key={idx}>*</span>
                  ))}
                </div>
                <p className="text-sm text-white/80">"{testimonial.quote}"</p>
              </div>
              ))}
            </div>
          </div>
          
          {/* Testimonials Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-6 px-4 sm:px-6 md:px-8">
            {Array.from({ length: totalTestimonialPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonialIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentTestimonialIndex
                    ? 'w-8 bg-[#12a7ff]'
                    : 'w-2 bg-white/20 hover:bg-[#12a7ff]/50'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
          
          <div className="flex flex-col items-start justify-between gap-4 px-4 sm:flex-row sm:items-center sm:gap-6 md:px-6 lg:px-8">
            <h2 className="text-2xl font-black sm:text-3xl md:text-4xl">Latest News</h2>
            <div className="flex items-center gap-3">
              <button 
                onClick={prevNews}
                className="rounded-xl border border-white/10 p-2 text-white transition hover:border-[#12a7ff] hover:text-[#12a7ff] sm:rounded-2xl sm:p-3 animate-button"
                aria-label="Previous news"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button 
                onClick={nextNews}
                className="rounded-xl border border-white/10 p-2 text-white transition hover:border-[#12a7ff] hover:text-[#12a7ff] sm:rounded-2xl sm:p-3 animate-button"
                aria-label="Next news"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <Link 
                href="/blog"
                className="w-full rounded-full bg-[#12a7ff] px-4 py-2 text-xs font-semibold text-black sm:w-auto sm:px-6 sm:text-sm animate-button text-center"
              >
                View All
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden">
            {blogsLoading ? (
              <div className="mt-6 grid gap-4 px-4 sm:mt-8 sm:gap-6 md:grid-cols-2 md:px-6 lg:px-8">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex w-full flex-col gap-3 rounded-xl bg-[#090909] p-4 sm:gap-4 sm:rounded-2xl sm:p-5 md:flex-row animate-pulse"
                  >
                    <div className="h-40 w-full rounded-xl bg-white/10 sm:h-44 md:h-32 md:w-40" />
                    <div className="flex flex-1 flex-col gap-2">
                      <div className="h-4 w-3/4 rounded bg-white/10" />
                      <div className="h-3 w-full rounded bg-white/10" />
                      <div className="h-3 w-2/3 rounded bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-6 grid gap-4 px-4 sm:mt-8 sm:gap-6 md:grid-cols-2 md:px-6 lg:px-8">
                {getVisibleNews().map((news, index) => {
                  const blogUrl = news.slug ? `/blog/${news.slug}` : news.id ? `/blog/${news.id}` : '#';
                  return (
                    <div
                      key={news.id || news.title + news.image}
                      className={`flex w-full flex-col gap-3 rounded-xl bg-[#090909] p-4 sm:gap-4 sm:rounded-2xl sm:p-5 md:flex-row card-hover ${
                        index === 0 ? 'animate-card' : 'animate-card-delay-1'
                      }`}
                    >
                      <div className="h-40 w-full overflow-hidden rounded-xl sm:h-44 md:h-32 md:w-40">
                        <Image
                          src={news.image}
                          alt={news.title}
                          width={320}
                          height={200}
                          className="h-full w-full object-cover animate-image-hover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <h3 className="text-base font-semibold sm:text-lg">{news.title}</h3>
                        <p className="mt-2 flex-1 text-xs text-white/70 sm:text-sm line-clamp-3">{news.copy}</p>
                        <Link
                          href={blogUrl}
                          className="mt-3 self-start rounded-lg border border-[#12a7ff] px-2.5 py-1 text-xs text-[#12a7ff] transition hover:bg-[#12a7ff] hover:text-black sm:mt-4 sm:rounded-xl sm:px-3 sm:text-sm animate-button"
                        >
                          View
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {/* News Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-6 px-4 sm:px-6 md:px-8">
            {Array.from({ length: totalNewsPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentNewsIndex(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentNewsIndex
                    ? 'w-8 bg-[#12a7ff]'
                    : 'w-2 bg-white/20 hover:bg-[#12a7ff]/50'
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>
        <footer className="w-full rounded-xl bg-[#050505] p-6 sm:rounded-2xl sm:p-8 md:rounded-[15px] md:p-10">
          <div className="mx-auto grid max-w-7xl gap-6 sm:gap-8 md:grid-cols-[1.1fr_0.9fr_0.9fr]">
            <div>
              <Image
                src="/images/logos/ms-logo.png"
                alt="MS Performance"
                width={150}
                height={45}
                className="h-10 w-auto"
              />
              <p className="mt-4 text-sm text-white/70">
                We specialize in boosting vehicle performance, from ECU remapping to
                bespoke exhausts and dyno verification, plus essential servicing.
              </p>
              <p className="mt-6 text-sm text-white/50">
                 Copyright 2025 MSPerformance
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#12a7ff]">
                Services
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>Dyno Tests</li>
                <li>Custom Exhausts</li>
                <li>ECU Remapping</li>
                <li>AdBlue Solutions</li>
                <li>DPF & EGR Solutions</li>
              </ul>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#12a7ff]">
                Contact Details
              </p>
              <ul className="mt-4 space-y-2 text-sm text-white/70">
                <li>Unit 16, Bakers Ln, Chelmsford CM2 8LD</li>
                <li>0775 179 8827 / 01277 715069</li>
                <li>Mon - Sat  9:30 - 18:00</li>
                <li>info@msperformance.co.uk</li>
              </ul>
            </div>
          </div>
        </footer>
        </div>
    </div>
  );
}
