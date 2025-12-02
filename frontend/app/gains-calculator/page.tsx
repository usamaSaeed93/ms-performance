"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { navLinks, vehicleMakes, vehicleModels } from "@/lib/constants";

export default function GainsCalculatorPage() {
  const [selectedMake, setSelectedMake] = useState("Abarth");
  const [selectedModel, setSelectedModel] = useState("124 Spider 2016+");
  const [selectedYear, setSelectedYear] = useState("2016-2020");
  const [selectedEngine, setSelectedEngine] = useState("1.4 Turbo MultiAir 167 Bhp");
  const [carImage, setCarImage] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setCarImage(imageUrl);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="mx-auto max-w-[1503px] px-4  pt-8 lg:px-0">
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
                        link.href === "/gains-calculator" ? "text-[#1d70ff]" : "text-white/80"
                      }`}
                    >
                      {link.label}
                      {link.href === "/gains-calculator" && (
                        <span className="absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-6 rounded-full bg-gradient-to-r from-transparent via-[#1d70ff] to-transparent" />
                      )}
                    </Link>
                  ))}
                </nav>

                <button className="rounded-[12px] bg-[#1d70ff] px-6 py-3 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(29,112,255,0.3)]">
                  Book a Dyno
                </button>
              </div>
            </div>
          </header>

          <main className="space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#030814] text-white" style={{ width: '1600px', height: '530px' }}>
              <Image
                src="/images/hero/gainsHero.png"
                alt="Vehicle Gains"
                width={1600}
                height={530}
                className="absolute inset-0 h-full w-full object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/60" />
              <div className="relative px-8 py-20 lg:px-12">
              <div className="space-y-6 max-w-3xl">
                <p className="flex items-center gap-3 text-sm font-semibold text-[#7ab6ff] animate-subtitle">
                  <span className="h-px w-12 bg-[#7ab6ff]" />
                  Feel the Need for Speed: Dyno Car Tests
                </p>
                <h1 className="text-5xl font-black leading-tight lg:text-6xl animate-heading">
                  Vehicle Gains
                </h1>
              </div>
            </div>
            </section>

            {/* Vehicle Selection Section */}
            <section className="px-8 py-10 lg:px-12">
              <div className="grid gap-8 lg:grid-cols-[350px_1fr_350px]">
                {/* Vehicle Application Form */}
                <div className="bg-gray-100 rounded-[16px] p-6 space-y-4 animate-card animate-slide-left">
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-[#0c1b33] mb-2">Your vehicle registration</label>
                    <div className="flex gap-2">
                      <div className="flex items-center gap-2 rounded-[8px] border border-gray-300 bg-white px-3 py-2">
                        <span className="text-xs font-semibold bg-[#ffd200] px-2 py-1 rounded text-black">GB</span>
                        <input
                          type="text"
                          placeholder="Your vehicle registration"
                          className="flex-1 bg-transparent text-sm text-[#0c1b33] placeholder:text-gray-400 focus:outline-none"
                        />
                      </div>
                      <button className="rounded-[8px] bg-gray-700 px-4 py-2 text-sm font-semibold text-white animate-button">
                        Show
                      </button>
                    </div>
                    <p className="text-sm text-red-600">or find your vehicle below</p>
                  </div>
                  <div className="space-y-4 pt-2">
                    <div>
                      <select
                        value={selectedMake}
                        onChange={(e) => setSelectedMake(e.target.value)}
                        className="w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-sm text-[#0c1b33] focus:border-[#1d70ff] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right pr-10"
                        style={{ backgroundPosition: 'right 0.75rem center' }}
                      >
                        <option>Abarth</option>
                        {vehicleMakes.map((make) => (
                          <option key={make}>{make}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-sm text-[#0c1b33] focus:border-[#1d70ff] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right pr-10"
                        style={{ backgroundPosition: 'right 0.75rem center' }}
                      >
                        <option>124 Spider 2008&gt;</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-sm text-[#0c1b33] focus:border-[#1d70ff] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right pr-10"
                        style={{ backgroundPosition: 'right 0.75rem center' }}
                      >
                        <option>Petrol</option>
                      </select>
                    </div>
                    <div>
                      <select
                        value={selectedEngine}
                        onChange={(e) => setSelectedEngine(e.target.value)}
                        className="w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-sm text-[#0c1b33] focus:border-[#1d70ff] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right pr-10"
                        style={{ backgroundPosition: 'right 0.75rem center' }}
                      >
                        <option>1.4 Turbo MultiAir 167 bhp (2016&gt;)</option>
                      </select>
                    </div>
                    <button className="w-full rounded-[8px] bg-[#ffd200] px-6 py-3 text-sm font-semibold text-black animate-button">
                      Show
                    </button>
                  </div>
                </div>
{/* Car Image and Specifications Card */}
<div 
  className="w-[869px] h-[229px] bg-white border border-gray-100 rounded-[10px] p-5 flex items-center gap-[35px] animate-card-delay-1 animate-slide-right"
>
  {/* Car Image */}
  <div className="relative flex-shrink-0 w-[400px] h-[189px]">
    {carImage ? (
      <div className="w-full h-full rounded-[8px] overflow-hidden relative">
        <img
          src={carImage}
          alt="Uploaded car"
          className="w-full h-full object-cover"
        />
        <button
          onClick={() => setCarImage(null)}
          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
          title="Remove image"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18M6 6l12 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    ) : (
      <label className="w-full h-full bg-gray-200 rounded-[8px] overflow-hidden flex flex-col items-center justify-center cursor-pointer hover:bg-gray-300 transition border-2 border-dashed border-gray-400">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          className="text-gray-400 mb-2"
        >
          <path
            d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M17 8l-5-5-5 5m5-5v12"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className="text-sm text-gray-500 font-medium">Upload Car Image</span>
        <span className="text-xs text-gray-400 mt-1">Click to browse</span>
      </label>
    )}
  </div>

  {/* Vehicle Specifications */}
  <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
    {/* Left Column */}
    <div className="space-y-4">
      <div>
        <div className="font-bold text-[#0c1b33]">Model:</div>
        <div className="text-[#5c6c86] mt-1">Abarth 124 Spider</div>
      </div>
      <div>
        <div className="font-bold text-[#0c1b33]">Fuel:</div>
        <div className="text-[#5c6c86] mt-1">Petrol</div>
      </div>
      <div>
        <div className="font-bold text-[#0c1b33]">Engine Size:</div>
        <div className="text-[#5c6c86] mt-1">1368 Ccm</div>
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      <div>
        <div className="font-bold text-[#0c1b33]">Variant:</div>
        <div className="text-[#5c6c86] mt-1">1.4 Turbo MultiAir 167 Bhp</div>
      </div>
      <div>
        <div className="font-bold text-[#0c1b33]">Years:</div>
        <div className="text-[#5c6c86] mt-1">2016-Now</div>
      </div>
      <div>
        <div className="font-bold text-[#0c1b33]">ECU Type:</div>
        <div className="text-[#5c6c86] mt-1">Marelli 8GM</div>
      </div>
    </div>
  </div>
</div>
              </div>

              {/* Vehicle Title and Description */}
              <div className="mt-8 space-y-4">
                <h2 className="text-3xl font-black text-[#1d70ff]">
                  Abarth 124 Spider 1.4 Turbo MultiAir 167 Bhp
                </h2>
                <p className="text-base leading-relaxed text-[#5c6c86] max-w-4xl">
                  Our ECU Software remapping service for the Abarth 124 Spider includes Dyno Development to ensure
                  optimal performance. We enhance Power & Torque while maintaining Fuel Economy and Reliability. Our
                  professional tuning delivers safe, tested improvements to your vehicle's performance.
                </p>
              </div>
            {/* Performance Graph Section */}
             <div className="px-8 py-10 lg:px-12">
              <div className="bg-white rounded-[16px] p-8">
                <h3 className="text-2xl font-bold text-[#0c1b33] mb-6">
                  Vehicle Performance Chart - Abarth 124 Spider 1.4 Turbo MultiAir 167 Bhp
                </h3>
                <div className="h-[400px] bg-gray-50 rounded-[12px] flex items-center justify-center border border-gray-200">
                  <div className="text-center space-y-2">
                    <p className="text-gray-400">Performance Graph</p>
                    <p className="text-sm text-gray-500">Original (Red) vs Modified (Green)</p>
                  </div>
                </div>
              </div>
              </div>
            </section>

            {/* Engine Specifications and Results */}
            <section className="px-8 py-10 lg:px-12">
              <div className="bg-gray-100 rounded-[16px] p-8">
                <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
                  {/* Engine Specifications */}
                  <div className="space-y-6">
                    <h3 className="text-3xl font-black text-[#0c1b33] mb-8">Engine Specifications</h3>
                    <div className="space-y-4 text-base">
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0c1b33] mb-1">Cylinder Capacity:</span>
                        <span className="text-[#5c6c86] text-lg">5998CC</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0c1b33] mb-1">Compression:</span>
                        <span className="text-[#5c6c86] text-lg">9,1:1</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0c1b33] mb-1">Type Ecu:</span>
                        <span className="text-[#5c6c86] text-lg">Bosch ME17.1.6 & Bosch ME7.1.1 & Bosch MG1CS163</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0c1b33] mb-1">Bore X Stroke:</span>
                        <span className="text-[#5c6c86] text-lg">84,0 X 90,2 Mm</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0c1b33] mb-1">Engine Code:</span>
                        <span className="text-[#5c6c86] text-lg">DBD</span>
                      </div>
                    </div>
                    <button className="mt-8 w-full rounded-[12px] bg-[#12a7ff] px-6 py-4 text-base font-semibold text-white shadow-[0_4px_12px_rgba(18,167,255,0.3)] hover:bg-[#0f95e6] transition-colors animate-button">
                      Request Quote
                    </button>
                  </div>

                  {/* Performance Results */}
                  <div>
                  <div className="space-y-8">
                    {/* Power Row */}
                    <div>
                      <h4 className="text-lg font-bold text-[#0c1b33] mb-4">Power (Hp)</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {/* Original */}
                        <div className="bg-white rounded-[12px] p-4 flex flex-col items-center">
                          <span className="text-sm text-[#5c6c86] mb-3">Original</span>
                          <div className="relative w-24 h-24 mb-2">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="#1d70ff"
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 40 * 0.6} ${2 * Math.PI * 40}`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-bold text-[#0c1b33]">184</span>
                              <span className="text-xs text-[#5c6c86]">Hp</span>
                            </div>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                              <div
                                key={i}
                                className="w-2 bg-[#1d70ff] rounded-sm"
                                style={{ height: `${10 + i * 3}px` }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Modified */}
                        <div className="bg-white rounded-[12px] p-4 flex flex-col items-center">
                          <span className="text-sm text-[#5c6c86] mb-3">Modified</span>
                          <div className="relative w-24 h-24 mb-2">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="#1d70ff"
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 40 * 0.85} ${2 * Math.PI * 40}`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-bold text-[#0c1b33]">231</span>
                              <span className="text-xs text-[#5c6c86]">Hp</span>
                            </div>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                              <div
                                key={i}
                                className="w-2 bg-[#1d70ff] rounded-sm"
                                style={{ height: `${15 + i * 4}px` }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Difference */}
                        <div className="bg-white rounded-[12px] p-4 flex flex-col items-center">
                          <span className="text-sm text-[#5c6c86] mb-3">Difference</span>
                          <div className="relative w-24 h-24 mb-2">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="#1d70ff"
                                strokeWidth="8"
                                strokeDasharray="8 8"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-bold text-[#0c1b33]">+47</span>
                              <span className="text-xs text-[#5c6c86]">Hp</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Torque Row */}
                    <div>
                      <h4 className="text-lg font-bold text-[#0c1b33] mb-4">Torque (Nm)</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {/* Original */}
                        <div className="bg-white rounded-[12px] p-4 flex flex-col items-center">
                          <span className="text-sm text-[#5c6c86] mb-3">Original</span>
                          <div className="relative w-24 h-24 mb-2">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="#1d70ff"
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 40 * 0.6} ${2 * Math.PI * 40}`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-bold text-[#0c1b33]">184</span>
                              <span className="text-xs text-[#5c6c86]">Nm</span>
                            </div>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                              <div
                                key={i}
                                className="w-2 bg-[#1d70ff] rounded-sm"
                                style={{ height: `${10 + i * 3}px` }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Modified */}
                        <div className="bg-white rounded-[12px] p-4 flex flex-col items-center">
                          <span className="text-sm text-[#5c6c86] mb-3">Modified</span>
                          <div className="relative w-24 h-24 mb-2">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                              />
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="#1d70ff"
                                strokeWidth="8"
                                strokeDasharray={`${2 * Math.PI * 40 * 0.85} ${2 * Math.PI * 40}`}
                                strokeLinecap="round"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-bold text-[#0c1b33]">231</span>
                              <span className="text-xs text-[#5c6c86]">Nm</span>
                            </div>
                          </div>
                          <div className="flex gap-1 mt-2">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                              <div
                                key={i}
                                className="w-2 bg-[#1d70ff] rounded-sm"
                                style={{ height: `${15 + i * 4}px` }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Difference */}
                        <div className="bg-white rounded-[12px] p-4 flex flex-col items-center">
                          <span className="text-sm text-[#5c6c86] mb-3">Difference</span>
                          <div className="relative w-24 h-24 mb-2">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="48"
                                cy="48"
                                r="40"
                                fill="none"
                                stroke="#1d70ff"
                                strokeWidth="8"
                                strokeDasharray="8 8"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-2xl font-bold text-[#0c1b33]">+47</span>
                              <span className="text-xs text-[#5c6c86]">Nm</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

            {/* Detailed Results Graph */}
            <section className="px-8 py-10 lg:px-12">
              <div className="bg-white rounded-[16px] border border-gray-200 p-8">
                <h3 className="text-2xl font-bold text-[#0c1b33] mb-4">
                  RESULTS
                </h3>
                <p className="text-lg text-[#5c6c86] mb-6">
                  Abarth 124 Spider 1.4 Turbo MultiAir 1368 cc Power(HP) & Torque(lb-ft) VS Engine Speed(RPM)
                </p>
                
                {/* Dyno Chart */}
                <div className="relative h-[500px] bg-white rounded-[12px] border border-gray-200 mb-6 p-4">
                  <div className="relative w-full h-full">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <span className="text-6xl font-bold text-gray-400">DYNOJET</span>
                    </div>
                    
                    {/* Chart Area */}
                    <div className="relative w-full h-full">
                      {/* Y-axis label - Left (Power HP) */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-semibold text-[#0c1b33]">
                        Power(HP)
                      </div>
                      
                      {/* Y-axis labels - Left (Power HP) */}
                      <div className="absolute left-8 top-0 bottom-12 flex flex-col justify-between text-xs text-[#5c6c86]">
                        <span>250</span>
                        <span>200</span>
                        <span>150</span>
                        <span>100</span>
                        <span>50</span>
                        <span>0</span>
                      </div>
                      
                      {/* Y-axis label - Right (Torque lb-ft) */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-xs font-semibold text-[#0c1b33]">
                        Torque(lb-ft)
                      </div>
                      
                      {/* Y-axis labels - Right (Torque lb-ft) */}
                      <div className="absolute right-8 top-0 bottom-12 flex flex-col justify-between text-xs text-[#5c6c86]">
                        <span>250</span>
                        <span>200</span>
                        <span>150</span>
                        <span>100</span>
                        <span>50</span>
                        <span>0</span>
                      </div>
                      
                      {/* X-axis label */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-6 text-xs font-semibold text-[#0c1b33]">
                        Engine Speed(RPM)
                      </div>
                      
                      {/* X-axis labels */}
                      <div className="absolute bottom-6 left-12 right-12 flex justify-between text-xs text-[#5c6c86]">
                        <span>0</span>
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>7</span>
                      </div>
                      
                      {/* Chart Lines Placeholder - Would need a charting library for actual curves */}
                      <div className="absolute inset-0 top-8 bottom-12 left-12 right-12 flex items-center justify-center">
                        <div className="text-center space-y-2">
                          <p className="text-gray-400">Dyno Chart</p>
                          <p className="text-sm text-gray-500">ORI (Black) vs MOD V9 (Red)</p>
                        </div>
                      </div>
                      
                      {/* Legend */}
                      <div className="absolute top-4 right-4 space-y-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-0.5 bg-black"></div>
                          <span className="text-[#0c1b33]">ORI Power</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-0.5 bg-black border-dashed border-t-2"></div>
                          <span className="text-[#0c1b33]">ORI Torque</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-0.5 bg-red-600"></div>
                          <span className="text-[#0c1b33]">MOD V9 Power</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-0.5 bg-red-600 border-dashed border-t-2"></div>
                          <span className="text-[#0c1b33]">MOD V9 Torque</span>
                        </div>
                      </div>
                      
                      {/* Annotation */}
                      <div className="absolute bottom-2 left-4 text-xs text-[#5c6c86]">
                        @ Engine SAE J1349
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Results Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border border-gray-200">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Color</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Title</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Date</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Max HP</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Eng HP</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Avg HP</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Gain</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Max Torque</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Eng Torque</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Avg Torque</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Type</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Temp</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Pressure</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">Humidity</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33] border-r border-gray-200">CF</th>
                        <th className="text-left py-2 px-3 font-semibold text-[#0c1b33]">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {/* Run 3 - ORI */}
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 border-r border-gray-200">
                          <div className="w-4 h-4 bg-black"></div>
                        </td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">ORI</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">6/4/21</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">175.8</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">175.8</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">123.3</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">0.0%</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">191.1</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">191.1</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">158.2</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">RO</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">70.7 °F</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">29.69</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">19</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">0.98</td>
                        <td className="py-2 px-3 text-[#5c6c86]"></td>
                      </tr>
                      {/* Run 21 - MOD V9 */}
                      <tr className="border-b border-gray-200">
                        <td className="py-2 px-3 border-r border-gray-200">
                          <div className="w-4 h-4 bg-blue-600"></div>
                        </td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">MOD V9</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">6/4/21</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">208.8</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">208.8</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">141.5</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">0.0%</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">231.6</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">231.6</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">177.6</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">RO</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">70.1 °F</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">29.69</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">19</td>
                        <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">0.98</td>
                        <td className="py-2 px-3 text-[#5c6c86]"></td>
                      </tr>
                    </tbody>
                  </table>
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
                  <div className="pt-4">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[#0c1b33]">
                      <span className="h-4 w-px bg-[#1d70ff]" />
                      Follow us
                    </h3>
                    <div className="space-y-2">
                      {["Facebook", "Instagram", "YouTube", "TikTok", "Twitter"].map((social) => (
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
                    Terms & Conditions
                  </a>
                  <span className="text-[#dfe6f2]">|</span>
                  <a href="#" className="hover:text-[#1d70ff]">
                    Legal Information
                  </a>
                  <span className="text-[#dfe6f2]">|</span>
                  <a href="#" className="hover:text-[#1d70ff]">
                    Cookie Consent
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

