"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, brandLogos, footerLinks } from "@/lib/constants";

export default function ContactUsPage() {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-[1503px] px-4 pb-20 pt-8 lg:px-0">
        <div className="bg-white rounded-[20px] shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
          {/* Top Bar */}
          <header className="text-white">
            <div className="space-y-3 bg-black px-6 py-4 shadow-[0_20px_60px_rgba(1,4,13,0.65)] rounded-t-[20px]">
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
                <Link href="/home">
                  <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={160} height={48} priority />
                </Link>

                <nav className="flex flex-1 flex-wrap items-center justify-end gap-6 text-sm font-semibold">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      className={`relative pb-1 transition hover:text-[#1d70ff] ${
                        pathname === link.href ? "text-[#1d70ff]" : "text-white/80"
                      }`}
                    >
                      {link.label}
                      {pathname === link.href && (
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

          <main>
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#030814] text-white h-[360px]">
              <Image
                src="/images/hero/slider1.jpg"
                alt="Contact Us"
                width={1600}
                height={400}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/70" />
              <div className="relative flex items-center h-full px-8 lg:px-12">
                <h1 className="text-5xl lg:text-6xl font-bold">Contact Us</h1>
              </div>
            </section>

            {/* Main Content Section */}
            <section className="px-8 py-16 lg:px-12">
              <div className="mx-auto max-w-7xl">
                <h2 className="text-4xl lg:text-5xl font-bold text-[#0c1b33] mb-12">Let Your Wanderlust <br /> Guide You</h2>
                
                <div className="grid gap-12 lg:grid-cols-[1fr_1fr]">
                  {/* Left Column - Contact Form */}
                  <div>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[#0c1b33]">Your Email</label>
                          <div className="relative">
                            <input
                              type="email"
                              placeholder="Your Email"
                              className="w-full rounded-[8px] border border-[#dfe6f2] bg-gray-50 px-4 py-4 pr-12 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                                <path
                                  d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"
                                  fill="currentColor"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-semibold text-[#0c1b33]">Your Phone</label>
                          <div className="relative">
                            <input
                              type="tel"
                              placeholder="Your Phone"
                              className="w-full rounded-[8px] border border-[#dfe6f2] bg-gray-50 px-4 py-4 pr-12 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none"
                            />
                            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                                <path
                                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                  fill="currentColor"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#0c1b33]">Your Address</label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Your Address"
                            className="w-full rounded-[8px] border border-[#dfe6f2] bg-gray-50 px-4 py-4 pr-12 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none"
                          />
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                              <path
                                d="M12 2C7.03 2 3 5.58 3 10.01c0 5.39 6.39 11.42 8.76 13.37.13.12.31.19.49.19s.36-.07.49-.19c2.37-1.95 8.76-7.98 8.76-13.37C21 5.58 16.97 2 12 2Zm0 18.21C9.18 18.05 5 13.38 5 10.01 5 6.69 8.13 4 12 4s7 2.69 7 6.01c0 3.37-4.18 8.04-7 10.2Z"
                                fill="currentColor"
                              />
                              <circle cx="12" cy="10" r="3" fill="currentColor" />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-semibold text-[#0c1b33]">Message</label>
                        <div className="relative">
                          <textarea
                            placeholder="Write Message.."
                            rows={6}
                            className="w-full rounded-[8px] border border-[#dfe6f2] bg-gray-50 px-4 py-4 pr-12 text-sm text-[#0c1b33] placeholder:text-[#9aa6bd] focus:border-[#1d70ff] focus:outline-none resize-none"
                          />
                          <div className="absolute right-4 top-4">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-[#0c1b33]">
                              <path
                                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm0 2v.51l8 5.33 8-5.33V6H4Zm0 12h16V9.49l-8 5.33-8-5.33V18Z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>

                      <button className="w-full rounded-[8px] bg-[#1d70ff] px-6 py-4 text-sm font-semibold text-white hover:bg-[#1a5fdd] transition">
                        Send Message
                      </button>
                    </div>
                  </div>

                  {/* Right Column - Image and Contact Details */}
                  <div className="space-y-6">
                    <div className="relative h-[300px] rounded-[16px] overflow-hidden">
                      <Image
                        src="/images/contact/contact-us.png"
                        alt="Mechanic working on car"
                        width={600}
                        height={300}
                        className="w-full h-full object-cover"
                      />
                      {/* Location Card Overlay */}
                      <div 
                        className="absolute bg-white border border-[#dfe6f2] shadow-lg opacity-100"
                        style={{
                          width: '563px',
                          height: '93px',
                          bottom: '20px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          borderRadius: '8px',
                          paddingTop: '14px',
                          paddingRight: '15px',
                          paddingBottom: '14px',
                          paddingLeft: '15px',
                        }}
                      >
                        <div className="flex items-start" style={{ gap: '10px' }}>
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d70ff]/10 flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                              <path
                                d="M12 2C7.03 2 3 5.58 3 10.01c0 5.39 6.39 11.42 8.76 13.37.13.12.31.19.49.19s.36-.07.49-.19c2.37-1.95 8.76-7.98 8.76-13.37C21 5.58 16.97 2 12 2Zm0 18.21C9.18 18.05 5 13.38 5 10.01 5 6.69 8.13 4 12 4s7 2.69 7 6.01c0 3.37-4.18 8.04-7 10.2Z"
                                fill="currentColor"
                              />
                              <circle cx="12" cy="10" r="3" fill="currentColor" />
                            </svg>
                          </div>
                          <div>
                            <h3 className="text-sm text-[#5c6c86]">Location</h3>
                            <p className="text-lg font-bold text-[#0c1b33] mb-2">6391 Elgin St. Celina, Delaware 10299</p>

                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div
                      className="opacity-100"
                      style={{
                        width: '583px',
                        height: '65px',
                        top: '1058px',
                        left: '893px',
                        borderRadius: '8px',
                        position: 'absolute',
                      }}
                    >
                      <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d70ff]/10 flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                              <path
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#0c1b33]">Requesting A Call:</p>
                            <p className="text-sm text-[#5c6c86]">(629) 555-0129</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1d70ff]/10 flex-shrink-0">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#1d70ff]">
                              <path
                                d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2zm0 2v.51l8 5.33 8-5.33V6H4zm0 12h16V9.49l-8 5.33-8-5.33V18z"
                                fill="currentColor"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-[#0c1b33]">E-mail:</p>
                            <p className="text-sm text-[#5c6c86]">info@example.com</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-[#dfe6f2] bg-white px-8 py-12 lg:px-12 rounded-b-[20px]">
              <div className="mx-auto max-w-7xl">
                <div className="grid gap-8 lg:grid-cols-4">
                  {/* About MSPerformance */}
                  <div className="space-y-4">
                    <Image src="/images/logos/ms-logo.png" alt="MS Performance" width={160} height={48} />
                    <p className="text-sm text-[#5c6c86]">
                      We specialize in ECU remapping, custom exhausts, and basic servicing to enhance your vehicle's performance.
                    </p>
                    <div className="flex flex-wrap items-center gap-3">
                      {["HoldPay", "Visa", "Mastercard", "Maestro", "American Express", "Discover"].map((payment) => (
                        <div
                          key={payment}
                          className="flex h-8 items-center justify-center rounded-[4px] border border-gray-200 bg-white px-2 text-xs text-[#5c6c86]"
                        >
                          {payment}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Headquarters Address */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#0c1b33]">Headquarters Address</h3>
                    <p className="text-sm text-[#5c6c86]">
                      Our headquarters address is: Unit 16, Bakers Ln, Chelmsford CM2 8LD
                    </p>
                  </div>

                  {/* Mailing Subscription */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-[#0c1b33]">Mailing Subscription</h3>
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
                      <button className="w-full rounded-[8px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1a5fdd] transition">
                        Subscribe
                      </button>
                    </div>
                  </div>

                  {/* Contact & Follow Us */}
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
              </div>
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

