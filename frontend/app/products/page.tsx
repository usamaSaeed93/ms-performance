"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { navLinks } from "@/lib/constants";
import { useGetProductsQuery, useGetCategoriesQuery } from "@/lib/store/api/productsApi";
import { ProductCard } from "@/components/products/ProductCard";
import { Navbar } from "@/components/Navbar";
import { Pagination as ProductsPagination } from "@/components/products/Pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const productBrandLogos = [
  "/images/logos/Plogo1.png",
  "/images/logos/Plogo2.png",
  "/images/logos/Plogo3.png",
  "/images/logos/Plogo4.png",
  "/images/logos/Plogo5.png",
  "/images/logos/Plogo6.png",
];

export default function ProductsPage() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const productsPerPage = 10;

  // Fetch categories
  const { data: categoriesData } = useGetCategoriesQuery({ per_page: 100 });
  const allCategories = categoriesData?.categories || [];

  // Map category name to ID for filtering
  const categoryIdMap = useMemo(() => {
    const map = new Map<string, number>();
    allCategories.forEach((cat) => {
      map.set(cat.category_name, cat.id);
    });
    return map;
  }, [allCategories]);

  // Get category IDs for filtering
  const categoryIds = useMemo(() => {
    if (selectedCategoryId === null) return undefined;
    return [selectedCategoryId];
  }, [selectedCategoryId]);

  // Fetch search suggestions for autocomplete (only when typing)
  const { data: searchSuggestionsData } = useGetProductsQuery(
    {
      page: 1,
      per_page: 10,
      search: searchInput.trim() || undefined,
      order_by: "id",
      order: "desc",
    },
    {
      skip: !searchInput.trim() || searchInput.trim().length < 2,
    }
  );

  // Fetch categories matching search
  const { data: searchCategoriesData } = useGetCategoriesQuery(
    {
      page: 1,
      per_page: 10,
      search: searchInput.trim() || undefined,
    },
    {
      skip: !searchInput.trim() || searchInput.trim().length < 2,
    }
  );

  const searchProducts = searchSuggestionsData?.products || [];
  const searchCategories = searchCategoriesData?.categories || [];

  // Fetch products with server-side filtering and search
  const { data, isLoading, error } = useGetProductsQuery({
    page: currentPage,
    per_page: productsPerPage,
    order_by: sortBy,
    order: sortOrder,
    category_ids: categoryIds,
    search: searchQuery.trim() || undefined,
  });

  const products = data?.products || [];
  const totalProducts = data?.total || 0;
  const totalPages = data?.data?.total_pages || (totalProducts > 0 ? Math.ceil(totalProducts / productsPerPage) : 0);

  const displayTotal = totalProducts;

  // Build categories list with counts from fetched products
  const categories = useMemo(() => {
    const categoryMap = new Map<number, number>();
    products.forEach((product) => {
      if (product.category_id) {
        categoryMap.set(
          product.category_id,
          (categoryMap.get(product.category_id) || 0) + 1
        );
      }
    });

    const categoryList = allCategories
      .filter((cat) => categoryMap.has(cat.id))
      .map((cat) => ({
        id: cat.id,
        label: cat.category_name,
        count: categoryMap.get(cat.id) || 0,
      }));

    return [{ id: null, label: "All", count: null }, ...categoryList];
  }, [products, allCategories]);

  const handleSortChange = (value: string) => {
    const [field, order] = value.split("_");
    setSortBy(field);
    setSortOrder(order as "asc" | "desc");
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setSelectedCategoryId(categoryId);
    setCurrentPage(1);
  };

  const handleSearchInputChange = (value: string) => {
    setSearchInput(value);
    if (value.trim().length >= 2) {
      setIsSearchOpen(true);
    } else {
      setIsSearchOpen(false);
    }
    // Keep focus on input
    if (searchInputRef.current && document.activeElement !== searchInputRef.current) {
      searchInputRef.current.focus();
    }
  };

  const handleSearchInputFocus = () => {
    if (searchInput.trim().length >= 2) {
      setIsSearchOpen(true);
    }
    // Clear any pending close timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  };

  const handleSearchInputBlur = () => {
    // Delay closing to allow clicks on popover content
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearchOpen(false);
    }, 200);
  };

  const handleSearchSubmit = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
    setIsSearchOpen(false);
  };

  const handleSelectSuggestion = (product: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    // Clear timeout to prevent popover from closing
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    setSearchInput(product.product_name);
    setSearchQuery(product.product_name);
    setCurrentPage(1);
    setIsSearchOpen(false);
  };

  const handleSelectCategory = (category: any, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    // Clear timeout to prevent popover from closing
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    setSearchInput("");
    setSearchQuery("");
    setSelectedCategoryId(category.id);
    setCurrentPage(1);
    setIsSearchOpen(false);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setCurrentPage(1);
    setIsSearchOpen(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const startIndex = totalProducts > 0 
    ? (currentPage - 1) * productsPerPage + 1 
    : 0;
  const endIndex = totalProducts > 0
    ? Math.min(currentPage * productsPerPage, totalProducts)
    : 0;

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-8">
        <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
          <Navbar ctaText="Become A Dealer" />

          <main className="space-y-12">
            <section className="relative overflow-hidden bg-[#030814] text-white h-[250px] sm:h-[300px] md:h-[350px]">
              <Image
                src="/images/products/ProductsHero.png"
                alt="All Products"
                width={1600}
                height={300}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-12">
                <h1 className="text-3xl font-black sm:text-4xl md:text-5xl lg:text-6xl animate-heading">All Products</h1>
              </div>
            </section>

            <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
              <div className="flex flex-col gap-4 mb-4 sm:mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl">Products</h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
                    <Popover open={isSearchOpen && searchInput.trim().length >= 2} onOpenChange={(open) => {
                      if (!open && searchInput.trim().length < 2) {
                        setIsSearchOpen(false);
                      }
                    }}>
                      <div className="relative w-full sm:w-auto sm:min-w-[250px]">
                        <PopoverTrigger asChild>
                          <div className="relative">
                            <input
                              ref={searchInputRef}
                              type="text"
                              placeholder="Search products..."
                              value={searchInput}
                              onChange={(e) => handleSearchInputChange(e.target.value)}
                              onFocus={handleSearchInputFocus}
                              onBlur={handleSearchInputBlur}
                              onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                  handleSearchSubmit();
                                } else if (e.key === "Escape") {
                                  setIsSearchOpen(false);
                                  searchInputRef.current?.blur();
                                }
                              }}
                              className="w-full rounded-[6px] sm:rounded-[8px] border border-gray-300 bg-white px-3 py-2 pl-9 pr-9 sm:px-4 sm:py-2 sm:pl-10 sm:pr-10 text-xs sm:text-sm text-[#0c1b33] placeholder:text-gray-400 focus:border-[#1d70ff] focus:outline-none"
                            />
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              className="absolute left-2.5 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            >
                              <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
                              <path d="m21 21-4.35-4.35" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            {searchInput && (
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleClearSearch();
                                }}
                                className="absolute right-2.5 sm:right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                  <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" />
                                </svg>
                              </button>
                            )}
                          </div>
                        </PopoverTrigger>
                      <PopoverContent 
                        className="w-[var(--radix-popover-trigger-width)] p-0" 
                        align="start"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                        onInteractOutside={(e) => {
                          // Prevent closing when clicking on the input
                          if (searchInputRef.current && searchInputRef.current.contains(e.target as Node)) {
                            e.preventDefault();
                          }
                        }}
                      >
                        {(searchCategories.length > 0 || searchProducts.length > 0) ? (
                          <div className="max-h-[400px] overflow-y-auto">
                            {searchCategories.length > 0 && (
                              <>
                                <div className="px-3 py-2 bg-gray-50 border-b">
                                  <p className="text-xs font-semibold text-[#5c6c86] uppercase tracking-wide">Categories</p>
                                </div>
                                {searchCategories.map((category) => (
                                  <button
                                    key={`category-${category.id}`}
                                    type="button"
                                    onClick={(e) => handleSelectCategory(category, e)}
                                    onMouseDown={(e) => {
                                      // Prevent input blur when clicking category
                                      e.preventDefault();
                                      if (searchTimeoutRef.current) {
                                        clearTimeout(searchTimeoutRef.current);
                                        searchTimeoutRef.current = null;
                                      }
                                    }}
                                    className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0 text-left"
                                  >
                                    <div className="relative w-10 h-10 flex-shrink-0 rounded-full bg-[#1d70ff]/10 flex items-center justify-center">
                                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                                        <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                      </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-[#0c1b33] truncate">
                                        {category.category_name}
                                      </p>
                                      <p className="text-xs text-[#5c6c86] truncate">
                                        View all products in this category
                                      </p>
                                    </div>
                                  </button>
                                ))}
                              </>
                            )}
                            {searchProducts.length > 0 && (
                              <>
                                {searchCategories.length > 0 && (
                                  <div className="px-3 py-2 bg-gray-50 border-b">
                                    <p className="text-xs font-semibold text-[#5c6c86] uppercase tracking-wide">Products</p>
                                  </div>
                                )}
                                {searchProducts.map((product) => (
                                  <Link
                                    key={`product-${product.id}`}
                                    href={`/products/${product.id}`}
                                    onClick={(e) => handleSelectSuggestion(product, e)}
                                    onMouseDown={(e) => {
                                      // Prevent input blur when clicking suggestion
                                      e.preventDefault();
                                      if (searchTimeoutRef.current) {
                                        clearTimeout(searchTimeoutRef.current);
                                        searchTimeoutRef.current = null;
                                      }
                                    }}
                                    className="flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors border-b last:border-b-0"
                                  >
                                    <div className="relative w-12 h-12 flex-shrink-0 rounded overflow-hidden bg-gray-100">
                                      <Image
                                        src={product.image_url || "/images/products/product1.png"}
                                        alt={product.product_name}
                                        width={48}
                                        height={48}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-[#0c1b33] truncate">
                                        {product.product_name}
                                      </p>
                                      <p className="text-xs text-[#5c6c86] truncate">
                                        {product.category_name}
                                      </p>
                                    </div>
                                  </Link>
                                ))}
                              </>
                            )}
                          </div>
                        ) : searchInput.trim().length >= 2 ? (
                          <div className="p-4 text-center text-sm text-gray-500">
                            No products or categories found
                          </div>
                        ) : null}
                      </PopoverContent>
                    </div>
                  </Popover>
                    <select
                      value={`${sortBy}_${sortOrder}`}
                      onChange={(e) => handleSortChange(e.target.value)}
                      className="w-full sm:w-auto rounded-[6px] sm:rounded-[8px] border border-gray-300 bg-white px-3 py-2 sm:px-4 sm:py-2 text-xs sm:text-sm text-[#0c1b33] focus:border-[#1d70ff] focus:outline-none"
                    >
                      <option value="id_desc">Sort By: Most Popular</option>
                      <option value="price_asc">Sort By: Price Low to High</option>
                      <option value="price_desc">Sort By: Price High to Low</option>
                      <option value="created_at_desc">Sort By: Newest</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-2 sm:gap-3">
                  <span className="text-xs sm:text-sm text-[#5c6c86] whitespace-nowrap">
                    Showing {startIndex}-{endIndex} of {displayTotal}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
                {categories.map((category) => (
                  <button
                    key={category.id === null ? "all" : category.id}
                    onClick={() => handleCategoryChange(category.id)}
                    className={`rounded-[6px] sm:rounded-[8px] px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm font-semibold transition whitespace-nowrap ${
                      (selectedCategoryId === null && category.id === null) ||
                      selectedCategoryId === category.id
                        ? "bg-[#1d70ff] text-white"
                        : "bg-gray-100 text-[#0c1b33] hover:bg-gray-200"
                    }`}
                  >
                    {category.label} {category.count !== null && `(${category.count})`}
                  </button>
                ))}
              </div>

              {isLoading ? (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                  {Array.from({ length: productsPerPage }).map((_, idx) => (
                    <div
                      key={idx}
                      className="relative flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0_10px_40px_rgba(16,53,106,0.05)] animate-pulse"
                    >
                      <div className="aspect-square rounded-2xl bg-gray-200" />
                      <div className="space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                        <div className="h-6 bg-gray-200 rounded w-full" />
                        <div className="h-8 bg-gray-200 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600 mb-4">Failed to load products. Please try again later.</p>
                  <button
                    onClick={() => window.location.reload()}
                    className="rounded-[8px] bg-[#1d70ff] px-6 py-2 text-sm font-semibold text-white"
                  >
                    Retry
                  </button>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[#5c6c86] text-lg">No products found.</p>
                </div>
              ) : (
                <>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                    {products.map((product, index) => (
                      <ProductCard key={product.id} product={product} index={index} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-8">
                      <ProductsPagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => {
                          setCurrentPage(page);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      />
                    </div>
                  )}
                </>
              )}
            </section>

            <section className="px-8 py-10 lg:px-12 overflow-hidden">
              <div className="relative w-full overflow-hidden">
                <div className="flex items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 animate-scroll-logos">
                  {productBrandLogos.map((logo, index) => (
                    <div key={`logo-1-${index}`} className="flex-shrink-0">
                      <Image
                        src={logo}
                        alt={`Brand logo ${index + 1}`}
                        width={180}
                        height={34}
                        className="h-10 lg:h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                  {productBrandLogos.map((logo, index) => (
                    <div key={`logo-2-${index}`} className="flex-shrink-0">
                      <Image
                        src={logo}
                        alt={`Brand logo ${index + 1}`}
                        width={180}
                        height={34}
                        className="h-10 lg:h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </section>

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
                    <button className="w-full rounded-[8px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white animate-button">
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
                      {["Facebook", "Instagram", "YouTube", "Twitter"].map((social) => (
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
