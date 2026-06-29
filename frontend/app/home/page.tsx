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
  stats,
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

  // Testimonials carousel state
  const [currentTestimonialIndex, setCurrentTestimonialIndex] = useState(0);
  const testimonialsPerPage = 3;

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

  const allTestimonials = [...testimonials];

  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);

  // Stats animation state
  const [animatedStats, setAnimatedStats] = useState<{ [key: string]: number }>({});
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
            const initialStats: { [key: string]: number } = {};
            stats.forEach((stat) => {
              initialStats[stat.value] = 0;
            });
            setAnimatedStats(initialStats);

            // Animate each stat
            stats.forEach((stat) => {
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
                  [stat.value]: Math.floor(currentValue),
                }));

                if (currentStep >= steps) {
                  clearInterval(timer);
                  // Ensure final value is exact
                  setAnimatedStats((prev) => ({
                    ...prev,
                    [stat.value]: targetValue,
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
  }, [hasAnimated]);

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
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            <div className="relative z-10 grid gap-6 px-4 py-8 sm:gap-8 sm:px-6 sm:py-10 md:gap-10 md:px-8 md:py-12 lg:grid-cols-[1.1fr_0.9fr] lg:px-12 lg:py-14">
              <div className="space-y-4 animate-slide-left sm:space-y-5 md:space-y-6">
                <p className="flex items-center gap-2 text-xs font-semibold text-white sm:gap-3 sm:text-sm animate-subtitle">
                  <span className="h-px w-8 bg-white sm:w-12" />
                  Feel the Need for Speed: Dyno Car Tests
                </p>
                <h1 className="text-2xl font-black leading-tight sm:text-3xl md:text-4xl lg:text-[48px] animate-heading">
                  Maximize Power And Fuel Efficiency With Our ECU Remapping Services
                </h1>
              </div>
              {/* <div className="flex justify-center sm:justify-end animate-slide-right">
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

                  <p className="mt-3 text-[10px] text-red-400 sm:mt-4 sm:text-xs">or find your vehicle below</p>
                  <div className="mt-3 space-y-3 sm:mt-4 sm:space-y-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 mb-2">
                        Make
                      </p>
                      <VehicleCombobox
                        options={brandOptions}
                        value={selectedBrandId}
                        onValueChange={(value) => {
                          setSelectedBrandId(value);
                          setSelectedModelId("");
                          setSelectedGenerationId("");
                          setSelectedEnginePublicId("");
                        }}
                        placeholder="- Please Select Make -"
                        searchPlaceholder="Search make..."
                        disabled={brandsLoading}
                        emptyMessage="No make found."
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 mb-2">
                        Model
                      </p>
                      <VehicleCombobox
                        options={modelOptions}
                        value={selectedModelId}
                        onValueChange={(value) => {
                          setSelectedModelId(value);
                          setSelectedGenerationId("");
                          setSelectedEnginePublicId("");
                        }}
                        placeholder="- Please Select Model -"
                        searchPlaceholder="Search model..."
                        disabled={!selectedBrandId || modelsLoading}
                        emptyMessage="No model found."
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 mb-2">
                        Fuel
                      </p>
                      <VehicleCombobox
                        options={generationOptions}
                        value={selectedGenerationId}
                        onValueChange={(value) => {
                          setSelectedGenerationId(value);
                          setSelectedEnginePublicId("");
                        }}
                        placeholder="- Please Select Generation -"
                        searchPlaceholder="Search generation..."
                        disabled={!selectedModelId || generationsLoading}
                        emptyMessage="No generation found."
                      />
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60 mb-2">
                        Engine
                      </p>
                      <VehicleCombobox
                        options={engineOptions}
                        value={selectedEnginePublicId}
                        onValueChange={setSelectedEnginePublicId}
                        placeholder="- Please Select Engine -"
                        searchPlaceholder="Search engine..."
                        disabled={!selectedGenerationId || enginesLoading}
                        emptyMessage="No engine found."
                      />
                    </div>
                  </div>
                  <button
                    onClick={handleViewGains}
                    className="mt-6 w-full rounded-[14px] bg-[#ffd200] px-6 py-3 text-sm font-semibold text-black shadow-[0_15px_35px_rgba(255,210,0,0.35)] hover:bg-[#e6c000] transition-colors animate-button"
                  >
                    View Gains
                  </button>
                </div>
              </div> */}
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

            {/* Carousel Indicators */}
            <div className="flex justify-center gap-2 mt-6">
              {Array.from({ length: totalServicePages }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentServiceIndex(index)}
                  className={`h-2 rounded-full transition-all ${index === currentServiceIndex
                    ? 'w-8 bg-[#1d70ff]'
                    : 'w-2 bg-[#dfe6f2] hover:bg-[#1d70ff]/50'
                    }`}
                  aria-label={`Go to page ${index + 1}`}
                />
              ))}
            </div>
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
                      width={180}
                      height={80}
                      className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity sm:h-14 md:h-16"
                    />
                  </div>
                ))}
                {/* Duplicate set for seamless loop */}
                {brandLogos.map((logo, index) => (
                  <div key={`logo-2-${index}`} className="flex-shrink-0">
                    <Image
                      src={logo}
                      alt={`Brand logo ${index + 1}`}
                      width={180}
                      height={80}
                      className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity sm:h-14 md:h-16"
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
                  Customized Performance Solutions
                </p>
                <h2 className="text-3xl font-black text-[#0c1b33] sm:text-4xl md:text-5xl">
                  Chelmsford&apos;s Premier Car Tuning &amp; Exhaust Specialists
                </h2>
                <p className="text-base text-[#5c6c86] sm:text-lg md:text-xl leading-relaxed">
                  Over a decade of expertise in ECU remapping, custom exhausts, and performance upgrades. We unlock your vehicle&apos;s true potential with dyno-proven results.
                </p>
                <p className="text-base text-[#5c6c86] sm:text-lg md:text-xl leading-relaxed">
                  Stage 1, 2 &amp; 3 upgrades. DPF &amp; EGR solutions. Pops, bangs &amp; flames. All backed by real data from our in-house rolling road.
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

            <div ref={statsRef} className="grid gap-6 px-4 pb-6 sm:gap-8 sm:px-6 sm:pb-8 md:grid-cols-2 md:px-8 md:pb-10 lg:grid-cols-4">
              {stats.map((stat) => {
                const numericValue = hasAnimated
                  ? (animatedStats[stat.value] ?? getNumericValue(stat.value))
                  : 0;
                const suffix = getSuffix(stat.value);
                const displayValue = `${Math.floor(numericValue)}${suffix}`;

                return (
                  <div key={stat.value} className="space-y-2">
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

          <section id="testimonials" className="relative space-y-6 bg-[#f5f7fa] px-4 py-6 sm:space-y-8 sm:px-6 sm:py-8 md:px-8 md:py-10">
            {/* Left border line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#1d70ff]" />

            <div className="flex flex-row items-center justify-between gap-2 sm:gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#1d70ff] sm:text-xs">
                  What People Say
                </p>
                <h2 className="mt-1 text-lg font-black text-[#0c1b33] sm:mt-2 sm:text-xl md:text-2xl lg:text-3xl truncate">Our Testimonials</h2>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={prevTestimonials}
                  className="rounded-lg border border-[#d9e0ef] bg-white p-2.5 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff] sm:rounded-xl sm:p-3 animate-button flex-shrink-0"
                  aria-label="Previous testimonials"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button
                  onClick={nextTestimonials}
                  className="rounded-lg border border-[#d9e0ef] bg-white p-2.5 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff] sm:rounded-xl sm:p-3 animate-button flex-shrink-0"
                  aria-label="Next testimonials"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="relative overflow-hidden">
              <div
                ref={testimonialsCarouselRef}
                className="flex gap-4 sm:gap-5 md:gap-6 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
              >
                {getVisibleTestimonials().map((testimonial, index) => (
                  <div
                    key={`${testimonial.name}-${index}`}
                    className="flex flex-shrink-0 w-[320px] sm:w-[340px] md:w-[360px] flex-col gap-4 rounded-2xl bg-white p-5 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] card-hover"
                  >
                    {/* Header with profile and Google logo */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={50}
                          height={50}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-bold text-[#0c1b33]">{testimonial.name}</p>
                          <p className="text-xs text-[#5c6c86]">{testimonial.date}</p>
                        </div>
                      </div>
                      {testimonial.source === "google" && (
                        <div className="flex-shrink-0">
                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Rating stars */}
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <svg
                          key={idx}
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill={idx < (testimonial.rating || 5) ? "#FFB200" : "none"}
                          stroke={idx < (testimonial.rating || 5) ? "#FFB200" : "#E0E0E0"}
                          strokeWidth="1"
                          className="flex-shrink-0"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-sm leading-relaxed text-[#5c6c86]">"{testimonial.quote}"</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials Carousel Indicators */}
            {allTestimonials.length > testimonialsPerPage && (
              <div className="flex justify-center gap-2 mt-6">
                {Array.from({ length: totalTestimonialPages }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setCurrentTestimonialIndex(index);
                      if (testimonialsCarouselRef.current) {
                        const cardWidth = 340; // Approximate card width + gap
                        const scrollAmount = cardWidth * testimonialsPerPage * index;
                        testimonialsCarouselRef.current.scrollTo({
                          left: scrollAmount,
                          behavior: 'smooth'
                        });
                      }
                    }}
                    className={`h-2 rounded-full transition-all ${index === currentTestimonialIndex
                      ? 'w-8 bg-[#1d70ff]'
                      : 'w-2 bg-[#dfe6f2] hover:bg-[#1d70ff]/50'
                      }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </section>

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
                            width={128}
                            height={128}
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
                    question="How often should I change my car's oil?"
                    answer="For most modern vehicles, we recommend changing your oil every 5,000-7,500 miles or every 6 months, whichever comes first. However, if you drive in severe conditions (frequent short trips, dusty environments, or towing), you may need to change it more frequently."
                  />
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
