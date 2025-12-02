import Image from "next/image";
import Link from "next/link";

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

const newsCards = [
  {
    title: "Mobile ECU Remapping & Performance Tuning in Essex",
    copy: "Purus dui sollicitudin dignissim habitant egestas nullam cras sed.",
    image: "/latest1.png",
  },
  {
    title: "Mobile ECU Remapping & Performance Tuning in Essex",
    copy: "Amet cursus sit amet dictum sit amet justo donec pretium vulputate.",
    image: "/latest2.png",
  },
  {
    title: "Mobile ECU Remapping & Performance Tuning in Essex",
    copy: "Elementum sagittis vitae et leo duis ut diam quam nulla porttitor.",
    image: "/latest3.png",
  },
  {
    title: "Mobile ECU Remapping & Performance Tuning in Essex",
    copy: "Olestie at elementum eu facilisis sed odio morbi quis commodo odio.",
    image: "/latest4.png",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#010101] text-white">
      <div className="mx-auto flex max-w-[1220px] flex-col gap-16 px-4 pb-20 pt-8 lg:px-0">
        <header className="flex h-[85px] w-full items-center gap-6 border-b border-[#1cadee] bg-[#010101] px-4">
          <Image
            src="/images/logos/ms-logo.png"
            alt="MS Performance"
            width={160}
            height={48}
            className="h-10 w-auto"
            priority
          />
          <nav className="flex flex-1 items-center justify-center gap-8 text-[15px] font-normal leading-none text-white/80 [font-family:var(--font-montserrat)]">
            <span
              aria-hidden
              className="h-5 w-[2px] rounded-full bg-[#1cadee]"
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
          <button className="flex h-[42px] w-[148px] items-center justify-center gap-[10px] rounded-[10px] bg-[#12a7ff] px-[30px] py-[12px] text-sm font-semibold text-black shadow-[0_10px_25px_rgba(18,167,255,0.35)]">
            Call us Now
          </button>
        </header>

        <section className="relative">
          <div className="relative h-[600px] w-[1366px] overflow-hidden  bg-black">
            <Image
              src="/images/hero/hero-card.png"
              alt="Hero car"
              width={2000}
              height={900}
              className="absolute inset-0 h-full w-full object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
            <div className="relative z-10 flex h-full w-full flex-col justify-center gap-6 px-10 py-12 text-left md:w-2/3">
              <p className="flex max-w-[300px] items-center gap-3 text-[15px] font-normal leading-[100%] tracking-[0] text-white [font-family:var(--font-montserrat)]">
                <span className="h-5 w-[2px] rounded-full bg-[#1cadee]" />  
                Feel the Need for Speed: Dyno Car Tests
              </p>
              <h1 className="text-4xl font-black leading-tight md:text-5xl">
                Maximize Power And Fuel Efficiency With Our ECU Remapping Services
              </h1>
              <div>
                <button className="inline-flex h-[50px] w-[168px] items-center justify-center gap-[10px] rounded-[10px] bg-[#12a7ff] px-[40px] py-[16px] text-sm font-semibold text-black shadow-[0_10px_25px_rgba(18,167,255,0.35)]">
                  Call us Now
                </button>
              </div>
            </div>
          </div>
          <div className="relative z-10 mx-auto -mt-12 flex w-[94%] flex-wrap items-center gap-5 rounded-[32px] border border-white/5 bg-[#050505]/95 px-8 py-6 shadow-[0_25px_70px_rgba(0,0,0,0.65)] backdrop-blur">
            {calculatorFields.map((field) => (
              <button
                key={field}
                className="flex flex-1 items-center justify-between rounded-[22px] border border-white/5 bg-[#0b0b0b] px-7 py-4 text-left text-base font-medium text-white/90 shadow-inner shadow-black/40 transition hover:bg-white/5"
              >
                <span>{field}</span>
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
            <button className="h-[60px] rounded-[22px] bg-[#12a7ff] px-12 text-base font-semibold text-black shadow-[0_20px_45px_rgba(18,167,255,0.45)]">
              View Gains
            </button>
          </div>
        </section>
          <div className="flex flex-wrap items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#12a7ff]">
                Repair and Maintenance
              </p>
              <h2 className="mt-3 text-4xl font-black text-white [text-shadow:0_6px_25px_rgba(0,0,0,0.55)]">
                Our Services
              </h2>
            </div>
            <p className="max-w-xl text-base text-white/70">
              Our comprehensive repair service keeps your vehicle moving smoothly. From
              minor repairs to major overhauls, we offer ECU remapping, custom exhaust
              installation, dyno calibration, and more.
            </p>
          </div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative h-[520px] overflow-hidden rounded-[28px] border border-white/5">
              <Image
                src="/images/services/our-services.png"
                alt="Workshop"
                width={1100}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {serviceCards.map((card) => (
                <div
                  key={card.title}
                  className={`group overflow-hidden rounded-[28px] border border-white/5 p-6 shadow-[0_20px_45px_rgba(0,0,0,0.45)] ${
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
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#0a0a0a] text-xl text-[#12a7ff]">
                      {card.icon}
                    </div>
                    <p className="mt-6 text-base text-white/70">{card.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>          <div className="flex flex-wrap items-start gap-10">
            <div className="h-[339px] w-[575px] space-y-6">
              <p className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#12a7ff]">
                <span className="h-5 w-[2px] rounded-full bg-[#12a7ff]" />
                Customized Performance Solutions
              </p>
              <h2 className="text-4xl font-black text-white">
                We&apos;re Chelmsford&apos;s Finest Car Tuning & Exhaust Destination
              </h2>
              <p className="text-base leading-relaxed text-white/80">
                With over a decade of experience in car tuning and custom exhaust installation, our advanced programming capabilities allow us to create everything from exhilarating pops and bangs to mesmerizing flames. We elevate your car&apos;s performance and sound to new heights.
              </p>
            </div>
            <div className="relative h-[390px] w-[586px] overflow-hidden rounded-[10px]">
              <Image
                src="/mechanic-working.png"
                alt="Mechanic working"
                width={586}
                height={390}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="border-t border-white/10 bg-black px-10 py-8">
            <div className="mx-auto grid max-w-[1220px] grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div key={stat.value} className="space-y-2">
                  <p className="text-4xl font-black text-white">{stat.value}</p>
                  <p className="text-sm leading-relaxed text-white/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

        <section className="h-[435px] w-[1366px] -ml-[70px] bg-[#050505] pl-8 pr-8 py-8">
          <div className="flex h-full flex-wrap items-start gap-10">
            <div className="space-y-6">
              <h2 className="text-5xl font-black uppercase leading-tight text-white">
                HOW TO SERVICE<br />
                YOUR CAR
              </h2>
              <p className="max-w-lg text-base leading-relaxed text-white">
                Rather than letting your services go by, take these steps to keep your car in good shape until you can afford a full service.
              </p>
            </div>
            <div className="grid flex-1 grid-cols-2 gap-6">
              {serviceSteps.map((step, index) => (
                <div key={step.title} className="space-y-3">
                  <p className="text-2xl font-bold text-[#12a7ff]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-lg font-bold uppercase text-white">{step.title}</h3>
                  <div className={`h-[1px] w-full ${index === 0 ? "bg-[#12a7ff]" : "bg-white/30"}`} />
                  <p className="text-sm leading-relaxed text-white/80">{step.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          {/* LEFT SIDE TEXT + CARDS */}
          <div>
            <p className="mb-3 flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#12a7ff]">
              <span className="h-5 w-[2px] rounded-full bg-[#12a7ff]" />
              Our Key Advantages
            </p>

            <h2 className="mb-10 text-4xl font-black text-white">Why Choose Us</h2>

            {/* CARDS GRID */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {advantages.map((adv) => (
                <div
                  key={adv.title}
                  className="flex min-h-[200px] flex-col gap-5 rounded-[12px] border border-white/10 bg-[#090909] p-6"
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

          {/* RIGHT SIDE IMAGE */}
          <div className="relative h-[600px] overflow-hidden rounded-[20px]">
            <Image
              src="/images/services/our-service.png"
              alt="Technician at laptop"
              width={900}
              height={900}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#12a7ff]">
                What People Say
              </p>
              <h2 className="text-4xl font-black">Our Testimonials</h2>
            </div>
            <div className="flex gap-3">
              <button className="rounded-xl border border-white/20 px-4 py-2 text-white/70">
                Prev
              </button>
              <button className="rounded-xl border border-white/20 px-4 py-2 text-white/70">
                Next
              </button>
            </div>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.quote}
                className="flex flex-col gap-4 rounded-2xl h-[260px] w-[380px] radius-[10px] border border-white/10 bg-[#090909] p-6"
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
                <p className="text-sm text-white/80">“{testimonial.quote}”</p>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-4xl font-black">Latest News</h2>
            <button className="rounded-full bg-[#12a7ff] px-6 py-2 text-sm font-semibold text-black">
              View All
            </button>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {newsCards.map((news) => (
              <div
                key={news.title + news.image}
                className="flex flex-col gap-4 rounded-2xl h-[276px] w-[598.74px] radius-[10px]  bg-[#090909] p-5 md:flex-row"
              >
                <div className="h-32 w-full overflow-hidden rounded-2xl md:w-40">
                  <Image
                    src={news.image}
                    alt={news.title}
                    width={320}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <h3 className="text-lg font-semibold">{news.title}</h3>
                  <p className="mt-2 flex-1 text-sm text-white/70">{news.copy}</p>
                  <button className="mt-4 self-start rounded-xl border border-[#12a7ff] px-3 py-1 text-sm text-[#12a7ff]">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        <footer className="rounded-[15px] h-[359px] w-[1226px] radius-[10px]  bg-[#050505] p-10">
          <div className="grid gap-8 md:grid-cols-[1.1fr_0.9fr_0.9fr]">
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
