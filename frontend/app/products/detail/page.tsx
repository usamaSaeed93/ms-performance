"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navLinks, products } from "@/lib/constants";

// Use first product as dummy data
const dummyProduct = products[0];

export default function ProductDetailPage() {
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState("Description");

  // Generate thumbnail images (using the same image for now, but can be different)
  const productImages = [
    dummyProduct.image,
    dummyProduct.image,
    dummyProduct.image,
    dummyProduct.image,
    dummyProduct.image,
  ];

  const fullStars = Math.floor(dummyProduct.rating);
  const hasHalfStar = dummyProduct.rating % 1 >= 0.5;

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-[1503px] px-4 pb-20 pt-8 lg:px-0">
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
                    <span>Unit 3, Bakers Ln, Chelmsford CM2 8LD</span>
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

                <button className="rounded-[12px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(29,112,255,0.3)]">
                  Become A Dealer
                </button>
              </div>
            </div>
          </header>

          <main className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#030814] text-white h-[360px]">
              <Image
                src="/images/hero/slider1.jpg"
                alt="Product Detail"
                width={1600}
                height={360}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative h-full flex items-center px-8 lg:px-12">
                <h1 className="text-5xl font-black lg:text-6xl">Product Detail</h1>
              </div>
            </section>

            {/* Product Information Section */}
            <section className="px-8 py-10 lg:px-12">
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
                {/* Left Column - Product Image Gallery */}
                <div className="space-y-4">
                  {/* Share Icon */}
                  <div className="flex justify-end">
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                        <path
                          d="M12 4v16m0-16L6 10m6-6l6 6"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Main Product Image */}
                  <div className="relative bg-white rounded-[12px] overflow-hidden border border-gray-200">
                    <div className="relative aspect-square">
                      <Image
                        src={productImages[selectedImage]}
                        alt={dummyProduct.title}
                        width={600}
                        height={600}
                        className="w-full h-full object-contain p-4"
                      />
                    </div>
                    {/* Navigation Arrows */}
                    <button
                      onClick={() => setSelectedImage((prev) => (prev > 0 ? prev - 1 : productImages.length - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                        <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSelectedImage((prev) => (prev < productImages.length - 1 ? prev + 1 : 0))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow-lg hover:bg-white transition"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </div>

                  {/* Thumbnail Images */}
                  <div className="flex gap-3">
                    {productImages.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative flex-1 aspect-square rounded-[8px] overflow-hidden border-2 transition ${
                          selectedImage === index ? "border-[#1d70ff]" : "border-gray-200"
                        }`}
                      >
                        <Image
                          src={img}
                          alt={`Thumbnail ${index + 1}`}
                          width={100}
                          height={100}
                          className="w-full h-full object-contain p-2"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right Column - Product Details */}
                <div className="space-y-6">
                  {/* Product Title */}
                  <h1 className="text-3xl font-black text-[#0c1b33] lg:text-4xl">{dummyProduct.title}</h1>

                  {/* Pricing */}
                  <div className="flex items-baseline gap-3">
                    {dummyProduct.oldPrice && (
                      <span className="text-xl text-[#9aa6bd] line-through">{dummyProduct.oldPrice}</span>
                    )}
                    <span className="text-4xl font-black text-[#0c1b33]">{dummyProduct.price}</span>
                  </div>

                  {/* Sales & Rating */}
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-[#5c6c86]">{dummyProduct.sold || 1238} Sold</span>
                    <div className="flex items-center gap-1">
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, idx) => {
                          const starValue = idx + 1;
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
                      <span className="text-sm text-[#5c6c86] ml-1">{dummyProduct.rating}</span>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-[#0c1b33]">Short Description</h3>
                    <p className="text-sm leading-relaxed text-[#5c6c86]">
                      {dummyProduct.description} See More...
                    </p>
                  </div>

                  {/* Safe Payments */}
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[#0c1b33]">Safe Payments</h3>
                    <div className="grid grid-cols-4 gap-3">
                      {[
                        { name: "PayPal", logo: "/images/payments/paypal.png" },
                        { name: "Visa", logo: "/images/payments/visa.png" },
                        { name: "Mastercard", logo: "/images/payments/mastercard.png" },
                        { name: "Maestro", logo: "/images/payments/maestro.png" },
                        { name: "Apple Pay", logo: "/images/payments/apple-pay.png" },
                        { name: "Amazon Pay", logo: "/images/payments/amazon-pay.png" },
                        { name: "Google Pay", logo: "/images/payments/google-pay.png" },
                        { name: "Stripe", logo: "/images/payments/stripe.png" },
                      ].map((payment) => (
                        <div
                          key={payment.name}
                          className="flex h-16 items-center justify-center rounded-[8px] border border-gray-200 bg-white p-2 hover:border-[#1d70ff] transition"
                        >
                          <Image
                            src={payment.logo}
                            alt={payment.name}
                            width={80}
                            height={40}
                            className="h-auto w-full object-contain"
                            onError={(e) => {
                              // Fallback to text if image doesn't exist
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const parent = target.parentElement;
                              if (parent) {
                                parent.innerHTML = `<span class="text-xs font-semibold text-[#5c6c86]">${payment.name}</span>`;
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-3">
                    <Link
                      href="/cart"
                      className="block rounded-[12px] bg-[#1d70ff] px-6 py-4 text-center text-base font-semibold text-white hover:bg-[#1a5fdd] transition"
                    >
                      Add To Cart
                    </Link>
                    <button className="rounded-[12px] border-2 border-[#1d70ff] bg-white px-6 py-4 text-base font-semibold text-[#1d70ff] hover:bg-[#1d70ff]/5 transition">
                      Checkout Now
                    </button>
                    <Link href="#" className="text-sm text-[#1d70ff] hover:underline text-center">
                      Delivery T&C
                    </Link>
                  </div>
                </div>
              </div>
            </section>

            {/* Tabs Section */}
            <section className="px-8 py-10 lg:px-12">
              <div className="border-b border-gray-200">
                <div className="flex gap-8">
                  {["Description", "Specification", "Reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`pb-4 text-base font-semibold transition ${
                        activeTab === tab
                          ? "border-b-2 border-[#1d70ff] text-[#1d70ff]"
                          : "text-[#5c6c86] hover:text-[#0c1b33]"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content */}
              <div className="mt-8">
                {activeTab === "Description" && (
                  <div className="space-y-4 text-sm leading-relaxed text-[#5c6c86]">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                    <p>
                      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </p>
                  </div>
                )}

                {activeTab === "Specification" && (
                  <div className="space-y-4 text-sm leading-relaxed text-[#5c6c86]">
                    <p>{dummyProduct.specification}</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <span className="font-semibold text-[#0c1b33]">Brand:</span>
                        <span className="ml-2">MS Performance</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#0c1b33]">Model:</span>
                        <span className="ml-2">BMW E90 | E92 | E93 M3</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#0c1b33]">Type:</span>
                        <span className="ml-2">Throttle Actuators</span>
                      </div>
                      <div>
                        <span className="font-semibold text-[#0c1b33]">Quantity:</span>
                        <span className="ml-2">Pair</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "Reviews" && (
                  <div className="space-y-6">
                    <p className="text-sm text-[#5c6c86]">No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
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
                  <p className="text-sm text-[#5c6c86]">Unit 3, Bakers Ln, Chelmsford CM2 8LD</p>
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
                      <span>(075) 7990827 / (01277) 750009</span>
                    </div>
                    <p className="text-xs text-[#9aa6bd]">Mon-Fri 9am-5pm (GMT)</p>
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
                    <p className="text-xs text-[#5c6c86]">For overseas customers: +44 (0)2087 876 209</p>
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
                <p className="text-sm text-[#5c6c86]">Copyright. 2023 MSPerformance</p>
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

