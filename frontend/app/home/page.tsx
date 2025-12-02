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
  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-[1503px] left-[-236px] px-4 pb-20 pt-8 lg:px-0">
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

              <button className="rounded-[12px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(29,112,255,0.3)]">
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
            <div className="relative grid gap-10 px-8 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:px-12">
              <div className="space-y-6">
                <p className="flex items-center gap-3 text-sm font-semibold text-[#7ab6ff]">
                  <span className="h-px w-12 bg-[#7ab6ff]" />
                  Feel the Need for Speed: Dyno Car Tests
                </p>
                <h1 className="text-4xl font-black leading-tight lg:text-[48px]">
                  Maximize Power And Fuel Efficiency With Our ECU Remapping Services
                </h1>
              </div>
              <div className="flex justify-end">
                <div className="w-[400px] h-[400px] rounded-[15px] border border-white/15 bg-[rgba(3, 8, 20, 0)] p-8 text-white shadow-[0_30px_70px_rgba(2,6,14,0.7)] backdrop-blur">
                  <p className="text-lg font-semibold">Select Your Vehicle</p>
                  <div className="mt-6 space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">
                      Vehicle Registration
                    </p>
                    <div className="flex gap-3">
                      <div className="flex flex-1 items-center gap-3 rounded-[14px] border border-white/10 bg-white/5 px-4 py-3">
                        <span className="rounded bg-[#ffd200] px-2 py-1 text-xs font-semibold text-black">
                          GB
                        </span>
                        <input
                          type="text"
                          placeholder="Your vehicle registration"
                          className="w-full bg-transparent text-sm text-white placeholder:text-white/60 focus:outline-none"
                        />
                      </div>
                      <button className="rounded-[12px] bg-[#ffd200] px-4 py-3 text-sm font-semibold text-black">
                        Show
                      </button>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-white/70">or find your vehicle below</p>
                  <div className="mt-4 space-y-4">
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
          <section id="services" className="space-y-8 px-8 py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-4xl font-black text-[#0c1b33]">Our Services</h2>
              <div className="flex gap-3">
                <button className="rounded-2xl border border-[#dfe6f2] p-3 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <button className="rounded-2xl border border-[#dfe6f2] p-3 text-[#0c1b33] transition hover:border-[#1d70ff] hover:text-[#1d70ff]">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {services.map((service, index) => (
                <div
                  key={service.title}
                  className="flex h-full flex-col gap-4 rounded-[28px] border border-[#eef2fb] bg-white p-5 shadow-[0_15px_40px_rgba(12,30,59,0.08)]"
                >
                  <div className="overflow-hidden rounded-[22px]">
                    <Image
                      src={service.image}
                      alt={service.title}
                      width={320}
                      height={220}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-black text-[#0c1b33]">{service.title}</h3>
                    <p className="text-sm text-[#5c6c86]">{service.description}</p>
                  </div>
                  <div className="mt-auto">
                    <button
                      className={`flex w-full items-center justify-center gap-2 rounded-[14px] px-6 py-3 text-sm font-semibold transition ${
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
          </section>

          <section className="px-8 py-8">
            <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
              {brandLogos.map((logo, index) => (
                <Image
                  key={logo}
                  src={logo}
                  alt={`Brand logo ${index + 1}`}
                  width={140}
                  height={60}
                  className="h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
                />
              ))}
            </div>
          </section>

          <section className="space-y-12 px-8 py-10">
            <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr]">
              <div className="space-y-6">
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1d70ff]">
                  Customized Performance Solutions
                </p>
                <h2 className="text-3xl font-black text-[#0c1b33]">
                  We&apos;re Chelmsford&apos;s Finest Car Tuning & Exhaust Destination
                </h2>
                <p className="text-[#5c6c86]">
                  With over a decade of experience in car tuning and custom exhaust installation, our
                  team brings advanced programming capabilities to unlock unique features for your
                  vehicle. From exhilarating pops and bangs to mesmerizing flames, we elevate your
                  car&apos;s performance and sound to new heights.
                </p>
              </div>
              <div className="relative overflow-hidden">
                <Image
                  src="/images/hero/mechanic-working.png"
                  alt="Mechanic working"
                  width={600}
                  height={500}
                  className="h-full w-full rounded-[20px] object-cover"
                />
              </div>
            </div>

            <div className="grid gap-8 px-8 pb-10 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.value} className="space-y-2">
                  <p className="text-4xl font-black text-[#0c1b33]">{stat.value}</p>
                  <div className="h-px w-12 bg-[#1d70ff]" />
                  <p className="text-sm text-[#5c6c86]">{stat.label}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="products" className="space-y-10 px-8 py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-4xl font-black text-[#0c1b33]">Our Products</h2>
              <button className="rounded-[12px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white">
                View All
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {products.map((product, index) => (
                <div
                  key={index}
                  className="relative flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0_10px_40px_rgba(16,53,106,0.05)]"
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
                      className="h-48 w-full object-cover"
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
          </section>

          <section id="testimonials" className="space-y-8 rounded-[32px] bg-white px-8 py-10 mx-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#1d70ff]">
                What people say
                </p>
                <h2 className="mt-2 text-3xl font-black text-[#0c1b33]">Our testimonials</h2>
              </div>
              <div className="flex gap-3">
                <button className="rounded-full border border-[#d9e0ef] px-4 py-2 text-sm text-[#5c6c86]">
                  Prev
                </button>
                <button className="rounded-full border border-[#d9e0ef] px-4 py-2 text-sm text-[#5c6c86]">
                  Next
                </button>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.name}
                  className="flex flex-col gap-4 rounded-2xl border border-[#eef2fb] p-6"
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
                  <p className="text-sm text-[#5c6c86]">“{testimonial.quote}”</p>
                </div>
              ))}
            </div>
          </section>

          <section id="blog" className="space-y-8 px-8 py-10">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <h2 className="text-4xl font-black text-[#0c1b33]">Latest Blogs</h2>
              <button className="rounded-[12px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white">
                View All
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {blogPosts.map((post, index) => (
                <article
                  key={index}
                  className="flex flex-col gap-4 rounded-[28px] bg-white p-6 shadow-[0_10px_40px_rgba(16,53,106,0.05)]"
                >
                  <div className="overflow-hidden rounded-2xl">
                    <Image
                      src={post.image}
                      alt={post.title}
                      width={360}
                      height={220}
                      className="h-48 w-full object-cover"
                    />
                  </div>
                  <div className="space-y-3">
                    <h3 className="text-lg font-bold text-[#0c1b33]">{post.title}</h3>
                    <p className="text-sm text-[#5c6c86]">{post.summary}</p>
                    <div className="mt-auto">
                      <button
                        className={`flex h-12 w-12 items-center justify-center rounded-[12px] transition ${
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
                    <span className="text-xs text-[#5c6c86]">WorldPay</span>
                    <span className="text-xs text-[#5c6c86]">Mastercard</span>
                    <span className="text-xs text-[#5c6c86]">Maestro</span>
                    <span className="text-xs text-[#5c6c86]">Switch</span>
                    <span className="text-xs text-[#5c6c86]">Visa</span>
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