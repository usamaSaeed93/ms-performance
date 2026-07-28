"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  navLinks,
  vehicleMakes,
  vehicleModels,
  services,
  brandLogos,
  products,
  testimonials,
  footerLinks,
} from "@/lib/constants";
import {
  resolveVRM,
  getBrands,
  getModels,
  getGenerations,
  getEngines,
  type VRMResponse,
  type Brand,
  type Model,
  type Generation,
  type Engine
} from "@/lib/api/vrm";
import { useHomePageProducts } from "@/lib/hooks/useHomePageProducts";
import { ProductCard } from "@/components/products/ProductCard";
import { useGetPublishedBlogsQuery } from "@/lib/store/api/blogsApi";
import { useRouter } from "next/navigation";
import { VehicleCombobox } from "@/components/VehicleCombobox";
import { Navbar } from "@/components/Navbar";
import { useEcommerceEnabled } from "@/hooks/useEcommerceEnabled";
import { useGetServicesQuery } from "@/lib/store/api/servicesApi";
import { useGetSettingsQuery } from "@/lib/store/api/settingsApi";
import { useGetClientsQuery } from "@/lib/store/api/clientsApi";
import { useGetGoogleReviewsQuery } from "@/lib/store/api/googleReviewsApi";
import {
  DEFAULT_HOME_ABOUT_IMAGE,
  HOME_ABOUT_CONTENT_KEY,
  HOME_ABOUT_IMAGE_KEY,
  parseHomeAboutContent,
} from "@/lib/constants/homeAboutContent";
import { parseStats, HOME_STATS_KEY } from "@/lib/constants/stats";

const DEFAULT_HERO_IMAGE = "/images/services/hero-dyno-v2-ue.png";

// Hero image component with error fallback
function HeroImage({ src, priority }: { src: string; priority?: boolean }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);
  const isExternal = src.startsWith("http");

  // Reset when src changes (e.g. new carousel images loaded from API)
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  return (
    <Image
      src={hasError ? DEFAULT_HERO_IMAGE : imgSrc}
      alt="MS Performance hero"
      width={1600}
      height={500}
      className="absolute inset-0 h-full w-full object-cover object-center"
      priority={priority}
      unoptimized={isExternal && !hasError}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(DEFAULT_HERO_IMAGE);
        }
      }}
    />
  );
}

// FAQ Item Component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl bg-white shadow-sm border border-gray-100">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="text-sm font-semibold text-[#0c1b33] pr-4">{question}</span>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          className={`flex-shrink-0 transition-transform ${isOpen ? "rotate-45" : ""} text-[#1d70ff]`}
        >
          <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      {isOpen && (
        <div className="border-t border-gray-100 px-4 pb-4">
          <p className="text-sm leading-relaxed text-[#5c6c86] pt-3">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function HomePage() {
  const router = useRouter();
  const { isEnabled: ecommerceEnabled } = useEcommerceEnabled();

  // Services carousel state
  const [currentServiceIndex, setCurrentServiceIndex] = useState(0);
  const itemsPerPage = 4;

  // VRM state
  const [vrmInput, setVrmInput] = useState("");
  const [vrmData, setVrmData] = useState<VRMResponse | null>(null);
  const [vrmLoading, setVrmLoading] = useState(false);
  const [vrmError, setVrmError] = useState<string | null>(null);

  // Vehicle selection state
  const [selectedBrandId, setSelectedBrandId] = useState<string>("");
  const [selectedModelId, setSelectedModelId] = useState<string>("");
  const [selectedGenerationId, setSelectedGenerationId] = useState<string>("");
  const [selectedEnginePublicId, setSelectedEnginePublicId] = useState<string>("");

  // Dropdown data state
  const [brands, setBrands] = useState<Brand[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [engines, setEngines] = useState<Engine[]>([]);


  // Loading states
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [modelsLoading, setModelsLoading] = useState(false);
  const [generationsLoading, setGenerationsLoading] = useState(false);
  const [enginesLoading, setEnginesLoading] = useState(false);

  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const productsPerPage = 4;

  const productStrategy = (process.env.NEXT_PUBLIC_HOME_PRODUCTS_STRATEGY || 'mixed') as 'featured' | 'newest' | 'mixed' | 'onsale';
  const { products: homeProducts, isLoading: productsLoading } = useHomePageProducts({
    strategy: productStrategy,
    limit: 8,
  });

  // Fetch published blogs
  const { data: blogsData, isLoading: blogsLoading } = useGetPublishedBlogsQuery({
    page: 1,
    per_page: 10,
    order_by: 'published_at',
    order: 'desc',
  });

  // Testimonials carousel state (kept but section is replaced by Our Clients)
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const testimonialsPerPage = 3;

  // Our Clients carousel — fetched from API
  const { data: apiClients } = useGetClientsQuery();

  // Google Reviews
  const { data: googleReviews = [] } = useGetGoogleReviewsQuery();
  const clients = useMemo(() => {
    if (!apiClients?.length) return [];
    return apiClients.map((c) => ({
      id: c.id,
      name: c.name,
      details: c.details ?? "",
      image: c.image_url ?? "/images/services/hero-dyno-v2-ue.png",
    }));
  }, [apiClients]);
  const [clientIndex, setClientIndex] = useState(0);
  const prevClient = () => setClientIndex((prev) => (prev - 1 + clients.length) % clients.length);
  const nextClient = () => setClientIndex((prev) => (prev + 1) % clients.length);

  // Blog display - no carousel, just show 4 blogs

  // Add dummy services to extend the carousel
  const dummyServices = [
    {
      title: "Servicing",
      description: "Enhanced turbo systems for maximum power and reliability.",
      image: "/images/services/IMG_4403.png",
    },
  ];


  // No need for dummy testimonials, we have enough in constants

  // Transform blogs for display - fully dynamic from API
  const allBlogPosts = useMemo(() => {
    return blogsData?.blogs?.map((blog) => ({
      id: blog.id,
      title: blog.title,
      summary: blog.excerpt || "Read more about this topic...",
      image: blog.featured_image || "/images/blog/latest1.png",
      slug: blog.slug,
    })) || [];
  }, [blogsData]);

  // Fetch services from API with fallback to static
  const { data: servicesData, isLoading: isServicesLoading } = useGetServicesQuery();

  // Transform API services to include image field for compatibility
  const allServices = useMemo(() => {
    // Return empty while loading to prevent flash of default images
    if (isServicesLoading) return [];
    const excludedTitles = new Set([
      "ECU Diagnostics",
      "Stage Upgrades",
      "Performance Tuning",
    ]);
    if (servicesData && servicesData.length > 0) {
      // Use API data - map image_url to image for compatibility
      return servicesData
        .filter((service) => !excludedTitles.has(service.title))
        .map(s => ({
          ...s,
          image: s.image_url || `/images/services/IMG_4403.png` // fallback image
        }));
    }
    // Fallback to static data if API fails or returns empty
    return [...services, ...dummyServices].filter((service) => !excludedTitles.has(service.title));
  }, [servicesData, isServicesLoading]);

  // Fetch hero images from settings
  const { data: settingsData, isLoading: isSettingsLoading } = useGetSettingsQuery();
  const heroImageUrl = useMemo(() => {
    const heroSetting = settingsData?.find(s => s.key === "hero_image_url");
    return heroSetting?.value || "";
  }, [settingsData]);
  const heroImages = useMemo(() => {
    // While the settings are still loading, return an empty array so we don't
    // prematurely flash the default image before the real uploaded banner arrives.
    if (isSettingsLoading) return [];
    const heroImagesSetting = settingsData?.find(s => s.key === "hero_image_urls")?.value;
    let urls: string[] = [];
    if (heroImagesSetting) {
      try {
        const parsed = JSON.parse(heroImagesSetting);
        if (Array.isArray(parsed)) {
          urls = parsed.filter((url) => typeof url === "string" && url.trim().length > 0);
        }
      } catch {
        urls = heroImagesSetting.split(",").map((url) => url.trim()).filter(Boolean);
      }
    }
    if (urls.length === 0 && heroImageUrl) {
      urls = [heroImageUrl];
    }
    if (urls.length === 0) {
      urls = [DEFAULT_HERO_IMAGE];
    }
    return urls;
  }, [settingsData, heroImageUrl, isSettingsLoading]);

  // Per-slide hero texts fetched from settings
  const heroTexts = useMemo(() => {
    const raw = settingsData?.find(s => s.key === "hero_texts")?.value;
    if (!raw) return [];
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as { subtitle: string; heading: string }[];
    } catch {}
    return [];
  }, [settingsData]);

  const homeAboutContent = useMemo(() => {
    const raw = settingsData?.find((s) => s.key === HOME_ABOUT_CONTENT_KEY)?.value;
    return parseHomeAboutContent(raw);
  }, [settingsData]);

  const homeAboutImage = useMemo(() => {
    if (isSettingsLoading) return null;
    return (
      settingsData?.find((s) => s.key === HOME_ABOUT_IMAGE_KEY)?.value ||
      DEFAULT_HOME_ABOUT_IMAGE
    );
  }, [settingsData, isSettingsLoading]);

  const allTestimonials = [...testimonials];

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  const DEFAULT_HERO_SUBTITLE = "Feel the Need for Speed: Dyno Car Tests";
  const DEFAULT_HERO_HEADING = "Maximize Power And Fuel Efficiency With Our ECU Remapping Services";

  const currentHeroSubtitle = heroTexts[currentHeroIndex]?.subtitle || DEFAULT_HERO_SUBTITLE;
  const currentHeroHeading  = heroTexts[currentHeroIndex]?.heading  || DEFAULT_HERO_HEADING;

  // Homepage statistics — editable from the admin Settings page, defaults otherwise.
  const homeStats = useMemo(
    () => parseStats(settingsData?.find((s) => s.key === HOME_STATS_KEY)?.value),
    [settingsData]
  );

  // Stats animation state (keyed by index so duplicate values never collide)
  const [animatedStats, setAnimatedStats] = useState<{ [key: number]: number }>({});
  const [hasAnimated, setHasAnimated] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const productsCarouselRef = useRef<HTMLDivElement>(null);
  const testimonialsCarouselRef = useRef<HTMLDivElement>(null);

  // Extract numeric values from stats
  const getNumericValue = (value: string): number => {
    const num = parseFloat(value.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? 0 : num;
  };

  // Get suffix from stat value (+, %, etc.)
  const getSuffix = (value: string): string => {
    const match = value.match(/[^0-9.]+$/);
    return match ? match[0] : '';
  };


  // Animate stats when they come into view
  useEffect(() => {
    if (hasAnimated || !statsRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);

            // Initialize all stats to 0
            const initialStats: { [key: number]: number } = {};
            homeStats.forEach((_, index) => {
              initialStats[index] = 0;
            });
            setAnimatedStats(initialStats);

            // Animate each stat
            homeStats.forEach((stat, index) => {
              const targetValue = getNumericValue(stat.value);
              const duration = 2000; // 2 seconds
              const steps = 60;
              const increment = targetValue / steps;
              const stepDuration = duration / steps;

              let currentStep = 0;
              const timer = setInterval(() => {
                currentStep++;
                const currentValue = Math.min(increment * currentStep, targetValue);

                setAnimatedStats((prev) => ({
                  ...prev,
                  [index]: Math.floor(currentValue),
                }));

                if (currentStep >= steps) {
                  clearInterval(timer);
                  // Ensure final value is exact
                  setAnimatedStats((prev) => ({
                    ...prev,
                    [index]: targetValue,
                  }));
                }
              }, stepDuration);
            });
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(statsRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, homeStats]);

  useEffect(() => {
    setCurrentHeroIndex(0);
  }, [heroImages.length]);

  useEffect(() => {
    if (heroImages.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

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

  const totalProductPages = Math.max(1, Math.ceil(homeProducts.length / productsPerPage));
  const nextProducts = () => {
    if (productsCarouselRef.current) {
      const cardWidth = 300; // Approximate card width + gap
      const scrollAmount = cardWidth * productsPerPage;
      productsCarouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
    setCurrentProductIndex((prev) => (prev + 1) % totalProductPages);
  };
  const prevProducts = () => {
    if (productsCarouselRef.current) {
      const cardWidth = 300; // Approximate card width + gap
      const scrollAmount = cardWidth * productsPerPage;
      productsCarouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
    setCurrentProductIndex((prev) => (prev - 1 + totalProductPages) % totalProductPages);
  };
  const getVisibleProducts = () => {
    return homeProducts;
  };

  // Testimonials carousel functions with smooth scrolling
  const totalTestimonialPages = Math.max(1, Math.ceil(allTestimonials.length / testimonialsPerPage));
  const nextTestimonials = () => {
    if (testimonialsCarouselRef.current) {
      const cardWidth = 340; // Approximate card width + gap
      const scrollAmount = cardWidth * testimonialsPerPage;
      testimonialsCarouselRef.current.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
      });
    }
    setCurrentTestimonialIndex((prev) => (prev + 1) % totalTestimonialPages);
  };
  const prevTestimonials = () => {
    if (testimonialsCarouselRef.current) {
      const cardWidth = 340; // Approximate card width + gap
      const scrollAmount = cardWidth * testimonialsPerPage;
      testimonialsCarouselRef.current.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
      });
    }
    setCurrentTestimonialIndex((prev) => (prev - 1 + totalTestimonialPages) % totalTestimonialPages);
  };
  const getVisibleTestimonials = () => {
    return allTestimonials;
  };

  // Auto-scroll testimonials carousel
  useEffect(() => {
    if (allTestimonials.length <= testimonialsPerPage) return;

    const interval = setInterval(() => {
      setCurrentTestimonialIndex((prev) => {
        const nextIndex = (prev + 1) % totalTestimonialPages;
        if (testimonialsCarouselRef.current) {
          const cardWidth = 340;
          const scrollAmount = cardWidth * testimonialsPerPage * nextIndex;
          testimonialsCarouselRef.current.scrollTo({
            left: scrollAmount,
            behavior: 'smooth'
          });
        }
        return nextIndex;
      });
    }, 5000); // Auto-scroll every 5 seconds

    return () => clearInterval(interval);
  }, [allTestimonials.length, testimonialsPerPage, totalTestimonialPages]);

  // Get first 4 blogs for display
  const displayedBlogs = allBlogPosts.slice(0, 4);

  // Load brands on mount
  useEffect(() => {
    const fetchBrands = async () => {
      setBrandsLoading(true);
      try {
        const data = await getBrands();
        setBrands(data);
      } catch (error) {
        console.error("Failed to load brands:", error);
      } finally {
        setBrandsLoading(false);
      }
    };
    fetchBrands();
  }, []);

  // Load models when brand is selected
  useEffect(() => {
    if (!selectedBrandId) {
      setModels([]);
      setSelectedModelId("");
      return;
    }
    const fetchModels = async () => {
      setModelsLoading(true);
      try {
        const data = await getModels(selectedBrandId);
        setModels(data);
      } catch (error) {
        console.error("Failed to load models:", error);
      } finally {
        setModelsLoading(false);
      }
    };
    fetchModels();
    // Reset dependent selections
    setSelectedModelId("");
    setSelectedGenerationId("");
    setSelectedEnginePublicId("");
    setGenerations([]);
    setEngines([]);
  }, [selectedBrandId]);

  // Load generations when model is selected
  useEffect(() => {
    if (!selectedModelId) {
      setGenerations([]);
      setSelectedGenerationId("");
      return;
    }
    const fetchGenerations = async () => {
      setGenerationsLoading(true);
      try {
        const data = await getGenerations(selectedModelId);
        setGenerations(data);
      } catch (error) {
        console.error("Failed to load generations:", error);
      } finally {
        setGenerationsLoading(false);
      }
    };
    fetchGenerations();
    // Reset dependent selections
    setSelectedGenerationId("");
    setSelectedEnginePublicId("");
    setEngines([]);
  }, [selectedModelId]);

  // Load engines when generation is selected
  useEffect(() => {
    if (!selectedGenerationId) {
      setEngines([]);
      setSelectedEnginePublicId("");
      return;
    }
    const fetchEngines = async () => {
      setEnginesLoading(true);
      try {
        const data = await getEngines(selectedGenerationId);
        setEngines(data);
      } catch (error) {
        console.error("Failed to load engines:", error);
      } finally {
        setEnginesLoading(false);
      }
    };
    fetchEngines();
    setSelectedEnginePublicId("");
  }, [selectedGenerationId]);

  // Prepare options for comboboxes
  const brandOptions = useMemo(() =>
    brands.map(b => ({ value: b.id, label: b.name }))
    , [brands]);

  const modelOptions = useMemo(() =>
    models.map(m => ({ value: m.id, label: m.name }))
    , [models]);

  const generationOptions = useMemo(() =>
    generations.map(g => ({ value: g.id, label: g.name }))
    , [generations]);

  const engineOptions = useMemo(() =>
    engines.map(e => ({ value: e.publicid, label: `${e.name}${e.energy ? ` (${e.energy})` : ''}` }))
    , [engines]);

  // VRM handler
  const handleVRMLookup = async () => {
    if (!vrmInput.trim()) {
      setVrmError("Please enter a vehicle registration number");
      return;
    }

    setVrmLoading(true);
    setVrmError(null);
    setVrmData(null);

    try {
      const data = await resolveVRM(vrmInput.trim(), "msperformance.co.uk");
      setVrmData(data);
      // Navigate to gains calculator with registration
      router.push(`/gains-calculator?reg=${encodeURIComponent(vrmInput.trim())}`);
    } catch (error) {
      setVrmError(error instanceof Error ? error.message : "Failed to resolve VRM. Please try again.");
    } finally {
      setVrmLoading(false);
    }
  };

  const handleVRMKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleVRMLookup();
    }
  };

  // Handle View Gains button
  const handleViewGains = () => {
    if (vrmInput.trim()) {
      // If VRM is entered, navigate with registration
      router.push(`/gains-calculator?reg=${encodeURIComponent(vrmInput.trim())}`);
    } else if (selectedEnginePublicId) {
      // If manual selection is complete, navigate with engine ID
      router.push(`/gains-calculator?engine=${encodeURIComponent(selectedEnginePublicId)}`);
    } else {
      // Just navigate to gains calculator
      router.push("/gains-calculator");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar ctaText="Become A Dealer" />
      <main className=" space-y-20">
        <div>
          <section className="relative overflow-hidden bg-[#030814] text-white min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
            <div
              className="absolute inset-0 flex h-full w-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentHeroIndex * 100}%)` }}
            >
              {isSettingsLoading ? (
                <div className="relative h-full w-full flex-shrink-0 bg-[#030814]" />
              ) : (
                heroImages.map((url, index) => (
                  <div key={`${url}-${index}`} className="relative h-full w-full flex-shrink-0">
                    <HeroImage src={url} priority={index === 0} />
                  </div>
                ))
              )}
            </div>
            <div className="absolute inset-0 bg-black/50 pointer-events-none" />
            <div className="relative z-10 flex min-h-[300px] items-center sm:min-h-[400px] md:min-h-[500px]">
            <div className="grid w-full gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 md:gap-10 md:px-8 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
              <div className="space-y-4 animate-slide-left sm:space-y-5 md:space-y-6">
                <div className="rounded-2xl backdrop-blur-sm p-5 sm:p-7" style={{ background: 'rgba(0,0,0,0.35)' }}>
                  <p className="flex items-center gap-2 text-xs font-semibold text-white sm:gap-3 sm:text-sm animate-subtitle">
                    <span className="h-px w-8 bg-white sm:w-12" />
                    {currentHeroSubtitle}
                  </p>
                  <h1 className="mt-3 text-2xl font-black leading-tight sm:text-3xl md:text-4xl lg:text-[48px] animate-heading">
                    {currentHeroHeading}
                  </h1>
                </div>
              </div>
              <div className="flex justify-center sm:justify-end animate-slide-right">
                <div className="w-full max-w-[400px] rounded-xl backdrop-blur-[16px] p-4 text-white shadow-[0_30px_70px_rgba(2,6,14,0.7)] sm:rounded-2xl sm:p-6 md:rounded-[15px] md:p-8 animate-card" style={{ background: 'rgba(0, 0, 0, 0.4)' }}>
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
                          value={vrmInput}
                          onChange={(e) => setVrmInput(e.target.value.toUpperCase())}
                          onKeyPress={handleVRMKeyPress}
                          placeholder="Your vehicle registration"
                          className="w-full bg-transparent text-xs text-white placeholder:text-white/60 focus:outline-none sm:text-sm"
                        />
                      </div>
                      <button
                        onClick={handleVRMLookup}
                        disabled={vrmLoading}
                        className="w-full rounded-xl bg-[#ffd200] px-4 py-2.5 text-xs font-semibold text-black sm:w-auto sm:rounded-[12px] sm:px-4 sm:py-3 sm:text-sm animate-button disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {vrmLoading ? "Loading..." : "Show"}
                      </button>
                    </div>
                  </div>

                  {vrmError && (
                    <div className="mt-3 rounded-lg bg-red-500/20 border border-red-500/50 px-3 py-2">
                      <p className="text-xs text-red-300">{vrmError}</p>
                    </div>
                  )}

                  {vrmData && vrmData.engineDetails && (
                    <div className="mt-4 space-y-3 rounded-lg bg-white/10 p-4 backdrop-blur-sm">
                      {vrmData.engineDetails.brand_image && (
                        <div className="flex justify-center">
                          <Image
                            src={vrmData.engineDetails.brand_image}
                            alt={vrmData.engineDetails.paths?.brand?.name || "Vehicle"}
                            width={120}
                            height={80}
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="space-y-2 text-white">
                        <h3 className="text-sm font-bold">{vrmData.name}</h3>
                        {vrmData.engineDetails.paths && (
                          <div className="text-xs space-y-1">
                            <p><span className="font-semibold">Brand:</span> {vrmData.engineDetails.paths.brand.name}</p>
                            <p><span className="font-semibold">Model:</span> {vrmData.engineDetails.paths.model.name}</p>
                            <p><span className="font-semibold">Engine:</span> {vrmData.engineDetails.paths.engine.name}</p>
                          </div>
                        )}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/20">
                          <div>
                            <p className="text-xs text-white/70">Original HP</p>
                            <p className="text-sm font-bold">{vrmData.engineDetails.horsepower_original} HP</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/70">Tuned HP</p>
                            <p className="text-sm font-bold text-[#7ab6ff]">{vrmData.engineDetails.horsepower_white} HP</p>
                          </div>
                          <div>
                            <p className="text-xs text-white/70">Gain</p>
                            <p className="text-sm font-bold text-green-400">+{vrmData.engineDetails.horsepower_white - vrmData.engineDetails.horsepower_original} HP</p>
                          </div>
                        </div>
                      </div>
                      <Link
                        href={`/gains-calculator?reg=${encodeURIComponent(vrmInput)}`}
                        className="block w-full mt-4 rounded-[14px] bg-[#1d70ff] px-6 py-3 text-center text-sm font-semibold text-white shadow-[0_15px_35px_rgba(29,112,255,0.35)] hover:bg-[#1565e0] transition-colors"
                      >
                        View Full Details
                      </Link>
                    </div>
                  )}

                  {/* Make / Model / Fuel / Engine dropdowns hidden — use gains calculator page instead */}
                  {/* <p className="mt-3 text-[10px] text-red-400 sm:mt-4 sm:text-xs">or find your vehicle below</p>
                  <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 mb-2">Make</p>
                      <VehicleCombobox options={brandOptions} value={selectedBrandId} onValueChange={(value) => { setSelectedBrandId(value); setSelectedModelId(""); setSelectedGenerationId(""); setSelectedEnginePublicId(""); }} placeholder="- Please Select Make -" searchPlaceholder="Search make..." disabled={brandsLoading} emptyMessage="No make found." />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 mb-2">Model</p>
                      <VehicleCombobox options={modelOptions} value={selectedModelId} onValueChange={(value) => { setSelectedModelId(value); setSelectedGenerationId(""); setSelectedEnginePublicId(""); }} placeholder="- Please Select Model -" searchPlaceholder="Search model..." disabled={!selectedBrandId || modelsLoading} emptyMessage="No model found." />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 mb-2">Fuel</p>
                      <VehicleCombobox options={generationOptions} value={selectedGenerationId} onValueChange={(value) => { setSelectedGenerationId(value); setSelectedEnginePublicId(""); }} placeholder="- Please Select Generation -" searchPlaceholder="Search generation..." disabled={!selectedModelId || generationsLoading} emptyMessage="No generation found." />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 mb-2">Engine</p>
                      <VehicleCombobox options={engineOptions} value={selectedEnginePublicId} onValueChange={setSelectedEnginePublicId} placeholder="- Please Select Engine -" searchPlaceholder="Search engine..." disabled={!selectedGenerationId || enginesLoading} emptyMessage="No engine found." />
                    </div>
                  </div>
                  <button onClick={handleViewGains} className="mt-6 w-full rounded-[14px] bg-[#ffd200] px-6 py-3 text-sm font-semibold text-black shadow-[0_15px_35px_rgba(255,210,0,0.35)] hover:bg-[#e6c000] transition-colors animate-button">View Gains</button> */}
                </div>
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
              {isServicesLoading && (
                <div className="flex justify-center py-16">
                  <div className="animate-spin h-10 w-10 border-4 border-[#1d70ff] border-t-transparent rounded-full" />
                </div>
              )}
              <div className="grid gap-4 sm:gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {getVisibleServices().map((service, index) => {
                  const getServiceLink = (title: string) => {
                    switch (title) {
                      case "ECU Remapping": return "/services/ecu-remapping";
                      case "Dyno Tests": return "/services/dyno-tests";
                      case "Custom Exhausts": return "/services/custom-exhausts";
                      case "DPF & EGR Services": return "/services/dpf-egr-services";
                      case "Turbo Upgrades": return "/services/turbo-upgrades";
                      case "Servicing": return "/services/servicing";
                      case "Number Plates": return "/services/number-plates";
                      case "Adblue Solutions": return "/services/adblue-solutions";
                      default: return "/services";
                    }
                  };

                  return (
                    <Link
                      key={service.title}
                      href={getServiceLink(service.title)}
                      className={`flex h-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_15px_40px_rgba(12,30,59,0.08)] sm:gap-4 sm:rounded-[24px] sm:p-4.5 md:rounded-[28px] md:p-5 card-hover block ${index === 0 ? 'animate-card' : index === 1 ? 'animate-card-delay-1' : index === 2 ? 'animate-card-delay-2' : 'animate-card-delay-3'
                        }`}
                    >
                      <div className="overflow-hidden rounded-[22px]">
                        <Image
                          src={service.image}
                          alt={service.title}
                          width={640}
                          height={440}
                          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                          className="h-48 w-full object-cover animate-image-hover"
                        />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-xl font-black text-[#0c1b33]">{service.title}</h3>
                        <p className="text-sm text-[#5c6c86]">{service.description}</p>
                      </div>
                      <div className="mt-auto">
                        <div
                          className={`flex w-full items-center justify-center gap-2 rounded-[14px] px-6 py-3 text-sm font-semibold transition animate-button ${index === 0
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
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Carousel Indicators — hidden */}
          </section>

          <section className="px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12 overflow-hidden">
            <div className="relative w-full overflow-hidden">
              <div className="flex items-center gap-12 sm:gap-16 md:gap-20 lg:gap-28 animate-scroll-logos">
                {/* First set of logos */}
                {brandLogos.map((logo, index) => (
                  <div key={`logo-1-${index}`} className="flex-shrink-0">
                    <Image
                      src={logo}
                      alt={`Brand logo ${index + 1}`}
                      width={222}
                      height={222}
                      className="h-24 w-auto object-contain opacity-90 sm:h-28 md:h-32"
                    />
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {brandLogos.map((logo, index) => (
                  <div key={`logo-2-${index}`} className="flex-shrink-0">
                    <Image
                      src={logo}
                      alt={`Brand logo ${index + 1}`}
                      width={222}
                      height={222}
                      className="h-24 w-auto object-contain opacity-90 sm:h-28 md:h-32"
                    />
                  </div>
                ))}
              </div>
              {heroImages.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setCurrentHeroIndex((prev) =>
                        prev === 0 ? heroImages.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/30 bg-black/30 p-2 text-white backdrop-blur transition hover:bg-black/50 pointer-events-auto"
                    aria-label="Previous hero image"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentHeroIndex((prev) => (prev + 1) % heroImages.length)}
                    className="absolute right-4 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/30 bg-black/30 p-2 text-white backdrop-blur transition hover:bg-black/50 pointer-events-auto"
                    aria-label="Next hero image"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/30 px-3 py-2 backdrop-blur pointer-events-auto">
                    {heroImages.map((_, index) => (
                      <button
                        key={`hero-dot-${index}`}
                        onClick={() => setCurrentHeroIndex(index)}
                        className={`h-2 rounded-full transition-all ${index === currentHeroIndex ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white"}`}
                        aria-label={`Go to hero image ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          <section className="space-y-8 px-4 py-6 sm:space-y-10 sm:px-6 sm:py-8 md:space-y-12 md:px-8 md:py-10">
            <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
              <div className="space-y-4 sm:space-y-5 md:space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1d70ff] sm:text-sm">
                  {homeAboutContent.eyebrow}
                </p>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl md:text-5xl">
                  {homeAboutContent.title}
                </h2>
                <p className="text-sm text-[#5c6c86] sm:text-base md:text-lg leading-relaxed">
                  {homeAboutContent.paragraph}
                </p>
                <ul className="space-y-3 pt-1">
                  {homeAboutContent.bullets.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <div className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-[#1d70ff]">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold text-[#0c1b33] sm:text-base">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="relative h-[250px] w-full overflow-hidden sm:h-[300px] md:h-[400px] lg:h-full">
                {homeAboutImage && (
                  <Image
                    src={homeAboutImage}
                    alt="Mechanic working"
                    width={600}
                    height={500}
                    className="h-full w-full rounded-xl object-cover sm:rounded-2xl md:rounded-[20px]"
                  />
                )}
              </div>
            </div>

            <div ref={statsRef} className="grid gap-6 px-4 pb-6 sm:gap-8 sm:px-6 sm:pb-8 md:grid-cols-2 md:px-8 md:pb-10 lg:grid-cols-4">
              {homeStats.map((stat, index) => {
                const numericValue = hasAnimated
                  ? (animatedStats[index] ?? getNumericValue(stat.value))
                  : 0;
                const suffix = getSuffix(stat.value);
                const displayValue = `${Math.floor(numericValue)}${suffix}`;

                return (
                  <div key={`${stat.label}-${index}`} className="space-y-2">
                    <p className="text-3xl font-black text-[#0c1b33] sm:text-4xl">{displayValue}</p>
                    <div className="h-px w-10 bg-[#1d70ff] sm:w-12" />
                    <p className="text-xs text-[#5c6c86] sm:text-sm">{stat.label}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {ecommerceEnabled && (
            <section id="products" className="space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 md:space-y-10 md:px-8 md:py-10">
              <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
                <h2 className="text-xl font-black text-[#0c1b33] sm:text-2xl md:text-3xl lg:text-4xl truncate min-w-0 flex-1">Our Products</h2>
                <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
                  <button
                    onClick={prevProducts}
                    className="rounded-xl border border-[#dfe6f2] p-2 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff] sm:rounded-2xl sm:p-3 animate-button flex-shrink-0"
                    aria-label="Previous products"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={nextProducts}
                    className="rounded-xl border border-[#dfe6f2] p-2 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff] sm:rounded-2xl sm:p-3 animate-button flex-shrink-0"
                    aria-label="Next products"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <Link href="/products" className="rounded-xl bg-[#1d70ff] px-3 py-2 text-[10px] font-semibold text-white sm:rounded-[12px] sm:px-4 sm:py-2.5 sm:text-xs md:px-6 md:py-3 md:text-sm animate-button text-center whitespace-nowrap flex-shrink-0">
                    View All
                  </Link>
                </div>
              </div>

              <div className="relative overflow-hidden">
                {productsLoading ? (
                  <div className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-4 scrollbar-hide">
                    {Array.from({ length: 4 }).map((_, idx) => (
                      <div
                        key={idx}
                        className="relative flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0_10px_40px_rgba(16,53,106,0.05)] sm:gap-4 sm:rounded-[24px] sm:p-5 md:rounded-[28px] md:p-6 animate-pulse flex-shrink-0 w-[280px] sm:w-[300px]"
                      >
                        <div className="h-48 bg-gray-200 rounded-xl aspect-square" />
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-3/4" />
                          <div className="h-6 bg-gray-200 rounded w-1/2" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : homeProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-[#5c6c86]">No products available at the moment.</p>
                  </div>
                ) : (
                  <div
                    ref={productsCarouselRef}
                    className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
                  >
                    {getVisibleProducts().map((product, index) => (
                      <div key={product.id} className="flex-shrink-0 w-[280px] sm:w-[300px]">
                        <ProductCard product={product} index={index} />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Products Carousel Indicators */}
              {homeProducts.length > productsPerPage && (
                <div className="flex justify-center gap-2 mt-6">
                  {Array.from({ length: totalProductPages }).map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setCurrentProductIndex(index);
                        if (productsCarouselRef.current) {
                          const cardWidth = 300; // Approximate card width + gap
                          const scrollAmount = cardWidth * productsPerPage * index;
                          productsCarouselRef.current.scrollTo({
                            left: scrollAmount,
                            behavior: 'smooth'
                          });
                        }
                      }}
                      className={`h-2 rounded-full transition-all ${index === currentProductIndex
                        ? 'w-8 bg-[#1d70ff]'
                        : 'w-2 bg-[#dfe6f2] hover:bg-[#1d70ff]/50'
                        }`}
                      aria-label={`Go to page ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* ── Our Clients Carousel ─────────────────────────────────────────── */}
          {clients.length > 0 && (
          <section id="clients" className="relative overflow-hidden bg-white py-14 px-4 sm:px-6 md:px-8 lg:px-12">

            {/* Watermark background text */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none">
              <span className="text-[8rem] sm:text-[12rem] md:text-[16rem] font-black uppercase tracking-widest text-gray-100 leading-none">
                CLIENTS
              </span>
            </div>

            {/* Heading */}
            <div className="relative mb-10 text-center">
              <h2 className="text-4xl font-black sm:text-5xl">
                <span className="text-[#0c1b33]">OUR </span>
                <span className="text-[#cc0000]">CLIENTS</span>
              </h2>
            </div>

            {/* Carousel */}
            <div className="relative mx-auto max-w-5xl">

              {/* Left arrow */}
              <button
                onClick={prevClient}
                aria-label="Previous client"
                className="absolute left-0 top-1/2 z-10 -translate-y-1/2 sm:-translate-x-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#1d70ff] text-white shadow-lg transition hover:bg-[#1558cc]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Cards row */}
              <div className="flex items-center justify-center gap-4 px-12 sm:px-8">

                {/* Left side card */}
                <div
                  className="hidden sm:block w-[200px] shrink-0 cursor-pointer opacity-50 transition-opacity hover:opacity-70"
                  onClick={prevClient}
                >
                  <div className="relative h-[140px] overflow-hidden rounded-xl">
                    <Image
                      src={clients[(clientIndex - 1 + clients.length) % clients.length].image}
                      alt={clients[(clientIndex - 1 + clients.length) % clients.length].name}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <p className="mt-2 truncate text-xs font-bold uppercase text-[#0c1b33]">
                    {clients[(clientIndex - 1 + clients.length) % clients.length].name}
                  </p>
                  <p className="truncate text-[10px] text-[#cc0000]">
                    {clients[(clientIndex - 1 + clients.length) % clients.length].details}
                  </p>
                </div>

                {/* Center featured card */}
                <div className="w-full max-w-sm shrink-0 overflow-hidden rounded-2xl bg-white shadow-2xl">
                  <div className="relative h-[260px] sm:h-[300px]">
                    <Image
                      src={clients[clientIndex].image}
                      alt={clients[clientIndex].name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-5">
                    <p className="text-sm font-black uppercase text-[#0c1b33]">{clients[clientIndex].name}</p>
                    <p className="mt-1 text-xs text-[#cc0000]">{clients[clientIndex].details}</p>
                    {clients[clientIndex].id && (
                      <Link
                        href={`/clients/${clients[clientIndex].id}`}
                        className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-[#1d70ff] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1558cc] transition"
                      >
                        View Performance Stats
                        <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </Link>
                    )}
                  </div>
                </div>

                {/* Right side card */}
                <div
                  className="hidden sm:block w-[200px] shrink-0 cursor-pointer opacity-50 transition-opacity hover:opacity-70"
                  onClick={nextClient}
                >
                  <div className="relative h-[140px] overflow-hidden rounded-xl">
                    <Image
                      src={clients[(clientIndex + 1) % clients.length].image}
                      alt={clients[(clientIndex + 1) % clients.length].name}
                      fill
                      className="object-cover grayscale"
                    />
                  </div>
                  <p className="mt-2 truncate text-xs font-bold uppercase text-[#0c1b33]">
                    {clients[(clientIndex + 1) % clients.length].name}
                  </p>
                  <p className="truncate text-[10px] text-[#cc0000]">
                    {clients[(clientIndex + 1) % clients.length].details}
                  </p>
                </div>

              </div>

              {/* Right arrow */}
              <button
                onClick={nextClient}
                aria-label="Next client"
                className="absolute right-0 top-1/2 z-10 -translate-y-1/2 sm:translate-x-5 flex h-10 w-10 items-center justify-center rounded-full bg-[#1d70ff] text-white shadow-lg transition hover:bg-[#1558cc]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Dot indicators */}
              <div className="mt-8 flex justify-center gap-2">
                {clients.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setClientIndex(i)}
                    className={`h-2 rounded-full transition-all ${i === clientIndex ? "w-8 bg-[#1d70ff]" : "w-2 bg-gray-300 hover:bg-[#1d70ff]/50"}`}
                    aria-label={`Go to client ${i + 1}`}
                  />
                ))}
              </div>

            </div>
          </section>
          )}

          {/* ── Google Reviews ─────────────────────────────────────────── */}
          {googleReviews.length > 0 && (
            <section id="reviews" className="bg-gray-50 py-14 px-4 sm:px-6 md:px-8 lg:px-12">
              <div className="mx-auto max-w-6xl">
                {/* Header */}
                <div className="mb-10 text-center">
                  <p className="text-xs sm:text-sm text-[#9aa6bd] font-medium mb-1">What Our Customers Say</p>
                  <h2 className="text-xl font-black text-[#0c1b33] sm:text-2xl md:text-3xl lg:text-4xl">
                    Our Google Reviews
                  </h2>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <svg key={s} className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-[#0c1b33]">5.0 on Google</span>
                  </div>
                </div>

                {/* Review cards grid */}
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {googleReviews.map((review, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      {/* Stars */}
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg
                            key={s}
                            className={`h-4 w-4 ${s <= review.rating ? "text-yellow-400" : "text-gray-200"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      {/* Review text */}
                      <p className="flex-1 text-sm leading-relaxed text-gray-600 line-clamp-5">
                        {review.text || "Great service!"}
                      </p>

                      {/* Author */}
                      <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                        {review.profile_photo_url ? (
                          <img
                            src={review.profile_photo_url}
                            alt={review.author_name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1d70ff] text-sm font-bold text-white">
                            {review.author_name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-semibold text-[#0c1b33]">{review.author_name}</p>
                          {review.relative_time && (
                            <p className="text-xs text-gray-400">{review.relative_time}</p>
                          )}
                        </div>
                        {/* Google G logo */}
                        <div className="ml-auto flex-shrink-0">
                          <svg viewBox="0 0 48 48" className="h-6 w-6">
                            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                            <path fill="none" d="M0 0h48v48H0z"/>
                          </svg>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA to Google */}
                <div className="mt-10 text-center">
                  <a
                    href="https://www.google.com/maps/search/ms+performance+chelmsford"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1558cc] transition shadow-sm"
                  >
                    See All Reviews on Google
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </section>
          )}

          <section id="blog" className="space-y-6 px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 md:px-8 md:py-10">
            <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
              <div className="space-y-2 min-w-0 flex-1">
                <p className="text-xs sm:text-sm text-[#9aa6bd] font-medium">Company Insights</p>
                <h2 className="text-xl font-black text-[#0c1b33] sm:text-2xl md:text-3xl lg:text-4xl truncate">Latest Blogs</h2>
              </div>
              <Link
                href="/blog"
                className="rounded-xl bg-[#1d70ff] px-3 py-2 text-[10px] font-semibold text-white hover:bg-[#1a5fdd] transition shadow-sm sm:px-4 sm:py-2.5 sm:text-xs md:px-6 md:py-3 md:text-sm whitespace-nowrap flex-shrink-0"
              >
                View All
              </Link>
            </div>

            <div className="relative overflow-hidden">
              {blogsLoading && displayedBlogs.length === 0 ? (
                <div className="grid gap-6 md:grid-cols-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="flex w-full gap-4 rounded-2xl bg-white p-4 shadow-sm animate-pulse"
                    >
                      <div className="h-32 w-32 flex-shrink-0 rounded-xl bg-gray-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-3/4 rounded bg-gray-200" />
                        <div className="h-3 w-full rounded bg-gray-200" />
                        <div className="h-3 w-2/3 rounded bg-gray-200" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {displayedBlogs.map((post, index) => {
                    const blogUrl = post.slug
                      ? `/blog/${post.slug}`
                      : `/blog/${post.id}`;
                    return (
                      <Link
                        key={`blog-${post.id}`}
                        href={blogUrl}
                        className="flex w-full gap-4 rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl">
                          <Image
                            src={post.image}
                            alt={post.title}
                            width={512}
                            height={512}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-between space-y-2">
                          <div>
                            <h3 className="text-base font-bold text-[#0c1b33] leading-tight line-clamp-2 mb-2">{post.title}</h3>
                            <p className="text-xs text-[#5c6c86] line-clamp-2">{post.summary}</p>
                          </div>
                          <div className="mt-auto">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg transition ${index === 0
                                ? "bg-[#1d70ff] text-white hover:bg-[#1a5fdd]"
                                : "border border-[#1d70ff] text-[#1d70ff] hover:bg-[#1d70ff] hover:text-white"
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
                            </div>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* FAQ Section */}
          <section className="px-4 py-12 sm:px-6 sm:py-16 md:px-8 lg:px-12">
            <div className="mx-auto max-w-5xl">
              <div className="text-center mb-10">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#1d70ff] mb-3">
                  Got Questions?
                </p>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl md:text-5xl">
                  Frequently Asked Questions
                </h2>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Left Column */}
                <div className="space-y-4">
                  <FAQItem
                    question="Is professional installation necessary for a custom exhaust system?"
                    answer="Yes, professional installation is highly recommended. A properly fitted exhaust system requires precise welding, correct alignment, and secure mounting to prevent rattles, leaks, and potential damage."
                  />
                  <FAQItem
                    question="Are catalytic controlled exhaust systems worth considering?"
                    answer="Absolutely. These custom exhaust systems allow you to control exhaust flow via a valve at the back. They offer versatility, enabling you to switch between an aggressive performance sound and a more subtle, everyday mode."
                  />
                  <FAQItem
                    question="What are the benefits of installing a custom exhaust system?"
                    answer="Custom exhaust systems offer improved exhaust flow, resulting in better engine performance and fuel efficiency. They also provide a more aggressive or refined sound depending on your preference, reduced weight compared to stock systems, and enhanced aesthetics."
                  />
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <FAQItem
                    question="Do you keep a copy of the original files?"
                    answer="Yes, we always keep a backup of your vehicle's original ECU files before any remapping work. This ensures we can restore your vehicle to its factory settings at any time if needed."
                  />
                  <FAQItem
                    question="What about insurance?"
                    answer="We recommend informing your insurance company about any modifications to your vehicle, including ECU remapping and exhaust upgrades. Many insurers are understanding of performance modifications, and some specialist insurers cater specifically to modified vehicles."
                  />
                  <FAQItem
                    question="Is remapping safe for the vehicles?"
                    answer="When performed by experienced professionals like us, remapping is completely safe. We ensure all parameters remain within safe limits for your engine and transmission. Our tuning process takes into account the engine's design, cooling capacity, and overall mechanical condition."
                  />
                  <FAQItem
                    question="What is remapping?"
                    answer="Remapping (also known as ECU tuning) is the process of modifying the software in your vehicle's Engine Control Unit to optimize performance. This can unlock additional power and torque, improve throttle response, and even enhance fuel efficiency."
                  />
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
