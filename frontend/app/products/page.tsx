"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navLinks, products } from "@/lib/constants";
import { generateAllProducts } from "@/lib/utils/products";

const productBrandLogos = [
  "/images/logos/Plogo1.png",
  "/images/logos/Plogo2.png",
  "/images/logos/Plogo3.png",
  "/images/logos/Plogo4.png",
  "/images/logos/Plogo5.png",
  "/images/logos/Plogo6.png",
];

const categories = [
  { label: "All", count: null },
  { label: "Brand", count: 2 },
  { label: "MS", count: 4 },
  { label: "Exhaust", count: 2 },
  { label: "Engine Oil", count: 2 },
];

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  
  // Products carousel state
  const [currentProductCarouselIndex, setCurrentProductCarouselIndex] = useState(0);
  const productsCarouselPerPage = 8;
  const totalProducts = 100;

  // Generate more products for the grid (12 products)
  const allProducts = generateAllProducts();
  
  // Add more dummy products for carousel
  const dummyProducts = Array.from({ length: 8 }).map((_, i) => ({
    id: 100 + i,
    title: `Premium Performance Product ${i + 1}`,
    price: `£${(Math.random() * 500 + 100).toFixed(2)}`,
    oldPrice: Math.random() > 0.5 ? `£${(Math.random() * 600 + 200).toFixed(2)}` : null,
    rating: Math.random() * 2 + 3,
    discount: Math.random() > 0.7 ? `-${Math.floor(Math.random() * 30 + 10)}%` : null,
    image: allProducts[i % allProducts.length]?.image || "/images/products/product1.png",
    brand: "MS",
  }));
  
  const allProductsWithDummy = [...allProducts, ...dummyProducts];
  const totalProductCarouselPages = Math.ceil(allProductsWithDummy.length / productsCarouselPerPage);
  
  const nextProducts = () => {
    setCurrentProductCarouselIndex((prev) => (prev + 1) % totalProductCarouselPages);
  };
  
  const prevProducts = () => {
    setCurrentProductCarouselIndex((prev) => (prev - 1 + totalProductCarouselPages) % totalProductCarouselPages);
  };
  
  const getVisibleProducts = () => {
    const start = currentProductCarouselIndex * productsCarouselPerPage;
    return allProductsWithDummy.slice(start, start + productsCarouselPerPage);
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="pt-8">
        <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
          {/* Header */}
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
                        link.href === "/products" ? "text-[#1d70ff]" : "text-white/80"
                      }`}
                    >
                      {link.label}
                      {link.href === "/products" && (
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

          <main className="space-y-12">
            {/* Banner Section */}
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

            {/* Products Section */}
            <section className="px-4 py-6 sm:px-6 sm:py-8 md:px-8 md:py-10 lg:px-12">
              <div className="flex flex-col items-start justify-between gap-4 mb-4 sm:mb-6 sm:flex-row sm:items-center">
                <h2 className="text-2xl font-black text-[#0c1b33] sm:text-3xl md:text-4xl">Products</h2>
                <div className="flex flex-wrap items-center gap-4">
                  <span className="text-sm text-[#5c6c86]">
                    Showing {((currentPage - 1) * productsPerPage) + 1}-{Math.min(currentPage * productsPerPage, totalProducts)} of {totalProducts} Products
                  </span>
                  <select className="rounded-[8px] border border-gray-300 bg-white px-4 py-2 text-sm text-[#0c1b33] focus:border-[#1d70ff] focus:outline-none">
                    <option>Sort By: Most Popular</option>
                    <option>Sort By: Price Low to High</option>
                    <option>Sort By: Price High to Low</option>
                    <option>Sort By: Newest</option>
                  </select>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search products..."
                      className="rounded-[8px] border border-gray-300 bg-white px-4 py-2 pl-10 pr-4 text-sm text-[#0c1b33] placeholder:text-gray-400 focus:border-[#1d70ff] focus:outline-none"
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
                </div>
              </div>

              {/* Category Filters */}
              <div className="flex flex-wrap items-center gap-3 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.label}
                    onClick={() => setSelectedCategory(category.label)}
                    className={`rounded-[8px] px-4 py-2 text-sm font-semibold transition ${
                      selectedCategory === category.label
                        ? "bg-[#1d70ff] text-white"
                        : "bg-gray-100 text-[#0c1b33] hover:bg-gray-200"
                    }`}
                  >
                    {category.label} {category.count && `(${category.count})`}
                  </button>
                ))}
              </div>

              {/* Products Grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-8">
                {getVisibleProducts().map((product, index) => (
                  <Link
                    key={index}
                    href="/products/detail"
                    className={`relative flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0_10px_40px_rgba(16,53,106,0.05)] hover:shadow-[0_15px_50px_rgba(16,53,106,0.1)] transition-shadow cursor-pointer card-hover ${
                      index === 0 ? 'animate-card' : index === 1 ? 'animate-card-delay-1' : index === 2 ? 'animate-card-delay-2' : 'animate-card-delay-3'
                    }`}
                  >
                    {product.discount && (
                      <div className="absolute right-4 top-4 z-10 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white">
                        {product.discount}
                      </div>
                    )}
                    <div className="relative overflow-hidden rounded-2xl bg-gray-100 aspect-square">
                      <Image
                        src={product.image}
                        alt={product.title}
                        width={320}
                        height={320}
                        className="h-full w-full object-cover animate-image-hover"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          {product.brand || "MS"}
                        </span>
                      </div>
                      <h3 className="text-base font-semibold leading-tight text-[#0c1b33] line-clamp-2">
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
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-[#0c1b33]">{product.price}</span>
                        {product.oldPrice && (
                          <span className="text-sm text-[#9aa6bd] line-through">{product.oldPrice}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={prevProducts}
                  disabled={currentProductCarouselIndex === 0}
                  className="rounded-[8px] border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-[#0c1b33] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 animate-button"
                >
                  ← Previous
                </button>
                {Array.from({ length: Math.min(totalProductCarouselPages, 3) }).map((_, idx) => {
                  const page = idx + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentProductCarouselIndex(idx)}
                      className={`rounded-[8px] px-4 py-2 text-sm font-semibold ${
                        currentProductCarouselIndex === idx
                          ? "bg-[#1d70ff] text-white"
                          : "bg-white border border-gray-300 text-[#0c1b33] hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                {totalProductCarouselPages > 3 && (
                  <>
                    <span className="px-2 text-sm text-[#5c6c86]">...</span>
                    <button
                      onClick={() => setCurrentProductCarouselIndex(totalProductCarouselPages - 1)}
                      className={`rounded-[8px] px-4 py-2 text-sm font-semibold ${
                        currentProductCarouselIndex === totalProductCarouselPages - 1
                          ? "bg-[#1d70ff] text-white"
                          : "bg-white border border-gray-300 text-[#0c1b33] hover:bg-gray-50"
                      }`}
                    >
                      {totalProductCarouselPages}
                    </button>
                  </>
                )}
                <button
                  onClick={nextProducts}
                  disabled={currentProductCarouselIndex >= totalProductCarouselPages - 1}
                  className="rounded-[8px] border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-[#0c1b33] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            </section>

            {/* Brand Logos Section */}
            <section className="px-8 py-10 lg:px-12 overflow-hidden">
              <div className="relative w-full overflow-hidden">
                <div className="flex items-center gap-8 sm:gap-12 md:gap-16 lg:gap-20 animate-scroll-logos">
                  {/* First set of logos */}
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
                  {/* Duplicate set for seamless loop */}
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

