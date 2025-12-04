"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { navLinks, vehicleMakes, vehicleModels } from "@/lib/constants";
import { 
  resolveVRM, 
  getEngineDetails,
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
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  generateDynoData,
  detectEngineType,
  estimateEngineParams,
  type DynoDataPoint,
} from "@/lib/utils/dynoGenerator";

function GainsCalculatorContent() {
  const searchParams = useSearchParams();
  const regParam = searchParams?.get("reg");

  // Manual selection state
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
  
  // VRM state
  const [vrmInput, setVrmInput] = useState(regParam || "");
  const [vrmData, setVrmData] = useState<VRMResponse | null>(null);
  const [vrmLoading, setVrmLoading] = useState(false);
  const [vrmError, setVrmError] = useState<string | null>(null);
  const [animateProgress, setAnimateProgress] = useState(false);

  const handleVRMLookup = useCallback(async (reg?: string) => {
    const registration = reg || vrmInput.trim();
    if (!registration) {
      setVrmError("Please enter a vehicle registration number");
      return;
    }

    setVrmLoading(true);
    setVrmError(null);
    setVrmData(null);
    setAnimateProgress(false);

    try {
      const data = await resolveVRM(registration, "msperformance.co.uk");
      setVrmData(data);
      
      // Optionally update dropdown selections with API data if available
      if (data.engineDetails?.paths && brands.length > 0) {
        // Find and set the brand ID
        const brandName = data.engineDetails.paths?.brand?.name;
        if (brandName) {
          const matchingBrand = brands.find(b => b.name === brandName);
          if (matchingBrand) {
            setSelectedBrandId(matchingBrand.id);
          }
        }
      }
      
      // Trigger animation after a small delay to ensure DOM is ready
      setTimeout(() => {
        setAnimateProgress(true);
      }, 100);
    } catch (error) {
      setVrmError(error instanceof Error ? error.message : "Failed to resolve VRM. Please try again.");
    } finally {
      setVrmLoading(false);
    }
  }, [vrmInput]);

  // Load brands on component mount
  useEffect(() => {
    const fetchBrands = async () => {
      setBrandsLoading(true);
      try {
        const brandsData = await getBrands();
        setBrands(brandsData);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
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
      setGenerations([]);
      setEngines([]);
      return;
    }

    const fetchModels = async () => {
      setModelsLoading(true);
      setModels([]);
      setGenerations([]);
      setEngines([]);
      setSelectedModelId("");
      setSelectedGenerationId("");
      setSelectedEnginePublicId("");
      
      try {
        const modelsData = await getModels(selectedBrandId);
        setModels(modelsData);
      } catch (error) {
        console.error("Failed to fetch models:", error);
      } finally {
        setModelsLoading(false);
      }
    };

    fetchModels();
  }, [selectedBrandId]);

  // Load generations when model is selected
  useEffect(() => {
    if (!selectedModelId) {
      setGenerations([]);
      setEngines([]);
      return;
    }

    const fetchGenerations = async () => {
      setGenerationsLoading(true);
      setGenerations([]);
      setEngines([]);
      setSelectedGenerationId("");
      setSelectedEnginePublicId("");
      
      try {
        const generationsData = await getGenerations(selectedModelId);
        setGenerations(generationsData);
      } catch (error) {
        console.error("Failed to fetch generations:", error);
      } finally {
        setGenerationsLoading(false);
      }
    };

    fetchGenerations();
  }, [selectedModelId]);

  // Load engines when generation is selected
  useEffect(() => {
    if (!selectedGenerationId) {
      setEngines([]);
      return;
    }

    const fetchEngines = async () => {
      setEnginesLoading(true);
      setEngines([]);
      setSelectedEnginePublicId("");
      
      try {
        const enginesData = await getEngines(selectedGenerationId);
        setEngines(enginesData);
      } catch (error) {
        console.error("Failed to fetch engines:", error);
      } finally {
        setEnginesLoading(false);
      }
    };

    fetchEngines();
  }, [selectedGenerationId]);

  // Load VRM data if reg param exists
  useEffect(() => {
    if (regParam) {
      setVrmInput(regParam);
      handleVRMLookup(regParam);
    }
  }, [regParam, handleVRMLookup]);

  // Handler for manual vehicle selection
  const handleManualSelection = async () => {
    if (!selectedEnginePublicId) {
      setVrmError("Please select all vehicle details");
      return;
    }

    setVrmLoading(true);
    setVrmError(null);
    setVrmData(null);
    setAnimateProgress(false);

    try {
      const data = await getEngineDetails(selectedEnginePublicId);
      setVrmData(data);
      
      // Trigger animation after a small delay
      setTimeout(() => {
        setAnimateProgress(true);
      }, 100);
    } catch (error) {
      setVrmError(error instanceof Error ? error.message : "Failed to load vehicle data. Please try again.");
    } finally {
      setVrmLoading(false);
    }
  };

  // Generate performance chart data using mathematically accurate engine physics
  const chartData = useMemo(() => {
    if (!vrmData?.engineDetails) {
      return [];
    }

    const originalHP = vrmData.engineDetails.horsepower_original ?? 141;
    const tunedHP = vrmData.engineDetails.horsepower_white ?? 160;
    const originalTorqueNm = vrmData.engineDetails.torque_original ?? 300;
    const tunedTorqueNm = vrmData.engineDetails.torque_white ?? 390;

    // Detect engine type from fuel type
    const engineType = detectEngineType(
      vrmData.engineDetails.specz?.energy,
      vrmData.engineDetails.fullname
    );

    // Estimate engine parameters
    const engineParams = estimateEngineParams(
      originalTorqueNm,
      originalHP,
      engineType,
      5000 // max RPM for this chart
    );

    // Generate original curve
    const originalData = generateDynoData({
      peakTorque: originalTorqueNm,
      peakHP: originalHP,
      peakTorqueRPM: engineParams.peakTorqueRPM,
      peakHPRPM: engineParams.peakHPRPM,
      redline: 5000,
      engineType,
      minRPM: 500,
      rpmStep: 250,
    });

    // Generate tuned curve
    const tunedData = generateDynoData({
      peakTorque: tunedTorqueNm,
      peakHP: tunedHP,
      peakTorqueRPM: engineParams.peakTorqueRPM,
      peakHPRPM: engineParams.peakHPRPM,
      redline: 5000,
      engineType,
      minRPM: 500,
      rpmStep: 250,
    });

    // Combine into chart format
    return originalData.map((orig, idx) => {
      const tuned = tunedData[idx] || tunedData[tunedData.length - 1];
      return {
        rpm: orig.rpm,
        orgBHP: Math.round(orig.hp),
        tunedBHP: Math.round(tuned.hp),
        orgNm: Math.round(orig.torque),
        tunedNm: Math.round(tuned.torque),
      };
    });
  }, [vrmData]);

  // Generate dyno chart data (0-7000 RPM, torque in lb-ft) using mathematically accurate engine physics
  const dynoChartData = useMemo(() => {
    if (!vrmData?.engineDetails) {
      return [];
    }

    const originalHP = vrmData.engineDetails.horsepower_original ?? 141;
    const tunedHP = vrmData.engineDetails.horsepower_white ?? 160;
    const originalTorqueNm = vrmData.engineDetails.torque_original ?? 300;
    const tunedTorqueNm = vrmData.engineDetails.torque_white ?? 390;

    // Convert Nm to lb-ft (1 Nm = 0.737562 lb-ft)
    const nmToLbFt = 0.737562;
    const originalTorqueLbFt = originalTorqueNm * nmToLbFt;
    const tunedTorqueLbFt = tunedTorqueNm * nmToLbFt;

    // Detect engine type from fuel type
    const engineType = detectEngineType(
      vrmData.engineDetails.specz?.energy,
      vrmData.engineDetails.fullname
    );

    // Estimate engine parameters for full range
    const engineParams = estimateEngineParams(
      originalTorqueLbFt, // Use lb-ft for dyno chart
      originalHP,
      engineType,
      7000 // Full redline for dyno chart
    );

    // Generate original curve (in lb-ft)
    const originalData = generateDynoData({
      peakTorque: originalTorqueLbFt,
      peakHP: originalHP,
      peakTorqueRPM: engineParams.peakTorqueRPM,
      peakHPRPM: engineParams.peakHPRPM,
      redline: 7000,
      engineType,
      minRPM: 800,
      rpmStep: 100,
    });

    // Generate tuned curve (in lb-ft)
    const tunedData = generateDynoData({
      peakTorque: tunedTorqueLbFt,
      peakHP: tunedHP,
      peakTorqueRPM: engineParams.peakTorqueRPM,
      peakHPRPM: engineParams.peakHPRPM,
      redline: 7000,
      engineType,
      minRPM: 800,
      rpmStep: 100,
    });

    // Combine into dyno chart format (RPM scaled to 0-7 for display)
    return originalData.map((orig, idx) => {
      const tuned = tunedData[idx] || tunedData[tunedData.length - 1];
      return {
        rpm: orig.rpm / 1000, // Scale to 0-7 for display
        rpmRaw: orig.rpm,
        orgBHP: Math.round(orig.hp),
        tunedBHP: Math.round(tuned.hp),
        orgTorqueLbFt: Math.round(orig.torque),
        tunedTorqueLbFt: Math.round(tuned.torque),
      };
    });
  }, [vrmData]);

  // Calculate table metrics from dyno data
  const dynoMetrics = useMemo(() => {
    if (!dynoChartData.length || !vrmData?.engineDetails) {
      return null;
    }

    const originalHP = vrmData.engineDetails.horsepower_original ?? 0;
    const tunedHP = vrmData.engineDetails.horsepower_white ?? 0;
    const originalTorqueNm = vrmData.engineDetails.torque_original ?? 0;
    const tunedTorqueNm = vrmData.engineDetails.torque_white ?? 0;

    const originalTorqueLbFt = originalTorqueNm * 0.737562;
    const tunedTorqueLbFt = tunedTorqueNm * 0.737562;

    // Calculate average HP (simplified - average of all points)
    const avgOrgHP = Math.round(dynoChartData.reduce((sum, d) => sum + d.orgBHP, 0) / dynoChartData.length);
    const avgTunedHP = Math.round(dynoChartData.reduce((sum, d) => sum + d.tunedBHP, 0) / dynoChartData.length);

    // Calculate average Torque
    const avgOrgTorque = Math.round(dynoChartData.reduce((sum, d) => sum + d.orgTorqueLbFt, 0) / dynoChartData.length);
    const avgTunedTorque = Math.round(dynoChartData.reduce((sum, d) => sum + d.tunedTorqueLbFt, 0) / dynoChartData.length);

    return {
      original: {
        maxHP: Math.round(originalHP),
        engHP: Math.round(originalHP),
        avgHP: avgOrgHP,
        maxTorqueLbFt: Math.round(originalTorqueLbFt),
        engTorqueLbFt: Math.round(originalTorqueLbFt),
        avgTorqueLbFt: avgOrgTorque,
      },
      tuned: {
        maxHP: Math.round(tunedHP),
        engHP: Math.round(tunedHP),
        avgHP: avgTunedHP,
        maxTorqueLbFt: Math.round(tunedTorqueLbFt),
        engTorqueLbFt: Math.round(tunedTorqueLbFt),
        avgTorqueLbFt: avgTunedTorque,
      },
    };
  }, [dynoChartData, vrmData]);

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
                          value={vrmInput}
                          onChange={(e) => setVrmInput(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === "Enter" && handleVRMLookup()}
                          placeholder="Your vehicle registration"
                          className="flex-1 bg-transparent text-sm text-[#0c1b33] placeholder:text-gray-400 focus:outline-none"
                        />
                      </div>
                      <button 
                        onClick={() => handleVRMLookup()}
                        disabled={vrmLoading}
                        className="rounded-[8px] bg-gray-700 px-4 py-2 text-sm font-semibold text-white animate-button disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {vrmLoading ? "..." : "Show"}
                      </button>
                    </div>
                    {vrmError && (
                      <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                        <p className="text-sm text-red-700 font-medium">{vrmError}</p>
                        {vrmError.includes("calculator is not available") && (
                          <p className="text-xs text-red-600 mt-1">Please try selecting a different vehicle using the manual dropdowns below.</p>
                        )}
                      </div>
                    )}
                    {!vrmError && <p className="text-sm text-red-600">or find your vehicle below</p>}
                  </div>
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#0c1b33] mb-1.5">Make</label>
                      <select
                        value={selectedBrandId}
                        onChange={(e) => setSelectedBrandId(e.target.value)}
                        disabled={brandsLoading}
                        className="w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-sm text-[#0c1b33] focus:border-[#1d70ff] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundPosition: 'right 0.75rem center' }}
                      >
                        <option value="">- Please Select Make -</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.id}>{brand.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0c1b33] mb-1.5">Model</label>
                      <select
                        value={selectedModelId}
                        onChange={(e) => setSelectedModelId(e.target.value)}
                        disabled={!selectedBrandId || modelsLoading}
                        className="w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-sm text-[#0c1b33] focus:border-[#1d70ff] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundPosition: 'right 0.75rem center' }}
                      >
                        <option value="">- Please Select Model -</option>
                        {models.map((model) => (
                          <option key={model.id} value={model.id}>{model.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0c1b33] mb-1.5">Generation</label>
                      <select
                        value={selectedGenerationId}
                        onChange={(e) => setSelectedGenerationId(e.target.value)}
                        disabled={!selectedModelId || generationsLoading}
                        className="w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-sm text-[#0c1b33] focus:border-[#1d70ff] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundPosition: 'right 0.75rem center' }}
                      >
                        <option value="">- Please Select Generation -</option>
                        {generations.map((generation) => (
                          <option key={generation.id} value={generation.id}>{generation.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#0c1b33] mb-1.5">Engine</label>
                      <select
                        value={selectedEnginePublicId}
                        onChange={(e) => setSelectedEnginePublicId(e.target.value)}
                        disabled={!selectedGenerationId || enginesLoading}
                        className="w-full rounded-[8px] border border-gray-300 bg-white px-4 py-3 text-sm text-[#0c1b33] focus:border-[#1d70ff] focus:outline-none appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22currentColor%22 stroke-width=%222%22%3E%3Cpolyline points=%226 9 12 15 18 9%22%3E%3C/polyline%3E%3C/svg%3E')] bg-no-repeat bg-right pr-10 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ backgroundPosition: 'right 0.75rem center' }}
                      >
                        <option value="">- Please Select Engine -</option>
                        {engines.map((engine) => (
                          <option key={engine.publicid} value={engine.publicid}>
                            {engine.name} {engine.energy ? `(${engine.energy})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <button 
                      onClick={handleManualSelection}
                      disabled={!selectedEnginePublicId || vrmLoading}
                      className="w-full rounded-[8px] bg-[#ffd200] px-6 py-3 text-sm font-semibold text-black animate-button hover:bg-[#e6c000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {vrmLoading ? "Loading..." : "Show"}
                    </button>
                  </div>
                </div>
{/* Car Image and Specifications Card */}
<div 
  className="w-[869px] h-[229px] bg-white border border-gray-100 rounded-[10px] p-5 flex items-center gap-[35px] animate-card-delay-1 animate-slide-right"
>
  {/* Car/Brand Image */}
  <div className="relative flex-shrink-0 w-[400px] h-[189px]">
    {vrmData?.engineDetails?.brand_image ? (
      <div className="w-full h-full rounded-[8px] overflow-hidden relative bg-gray-50 flex items-center justify-center">
        <Image
          src={vrmData.engineDetails.brand_image}
          alt={vrmData.engineDetails.paths?.brand?.name || vrmData.name || "Vehicle"}
          width={400}
          height={189}
          className="w-full h-full object-contain p-4"
        />
      </div>
    ) : vrmData?.engineDetails?.brand_svg ? (
      <div className="w-full h-full rounded-[8px] overflow-hidden relative bg-gray-50 flex items-center justify-center">
        <Image
          src={vrmData.engineDetails.brand_svg}
          alt={vrmData.engineDetails.paths?.brand?.name || vrmData.name || "Vehicle"}
          width={400}
          height={189}
          className="w-full h-full object-contain p-4"
        />
      </div>
    ) : (
      <div className="w-full h-full bg-gray-100 rounded-[8px] overflow-hidden flex items-center justify-center">
        <div className="text-center text-gray-400">
          <svg
            width="64"
            height="64"
          viewBox="0 0 24 24"
          fill="none"
            className="mx-auto mb-2"
        >
          <path
              d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
          <p className="text-sm font-medium">Enter VRM to load vehicle image</p>
        </div>
      </div>
    )}
  </div>

  {/* Vehicle Specifications */}
  <div className="flex-1 grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
    {/* Left Column */}
    <div className="space-y-4">
      <div>
        <div className="font-bold text-[#0c1b33]">Model:</div>
        <div className="text-[#5c6c86] mt-1">
          {vrmData?.engineDetails?.paths?.model?.name || "-"}
        </div>
      </div>
      <div>
        <div className="font-bold text-[#0c1b33]">Fuel:</div>
        <div className="text-[#5c6c86] mt-1">
          {vrmData?.engineDetails?.specz?.energy || "Petrol"}
        </div>
      </div>
      <div>
        <div className="font-bold text-[#0c1b33]">Engine Size:</div>
        <div className="text-[#5c6c86] mt-1">
          {vrmData?.engineDetails?.specz?.["Cylinder content"] 
            ? `${vrmData.engineDetails.specz["Cylinder content"]} cc`
            : vrmData?.engine_size || "1329 cc"}
        </div>
      </div>
    </div>

    {/* Right Column */}
    <div className="space-y-4">
      <div>
        <div className="font-bold text-[#0c1b33]">Variant:</div>
        <div className="text-[#5c6c86] mt-1">
          {vrmData?.engineDetails?.paths?.engine?.name || "-"}
        </div>
      </div>
      <div>
        <div className="font-bold text-[#0c1b33]">Years:</div>
        <div className="text-[#5c6c86] mt-1">
          {vrmData?.engineDetails?.paths?.generation?.name || vrmData?.year || "-"}
        </div>
      </div>
      <div>
        <div className="font-bold text-[#0c1b33]">ECU Type:</div>
        <div className="text-[#5c6c86] mt-1">
          {vrmData?.engineDetails?.specz?.engine_ecu || "Marelli 8GM"}
        </div>
      </div>
    </div>
  </div>
</div>
              </div>

              {/* Vehicle Title and Description */}
              <div className="mt-8 space-y-4">
                <h2 className="text-3xl font-black text-[#1d70ff]">
                  {vrmData?.name || vrmData?.engineDetails?.fullname || "Abarth 124 Spider 1.4 Turbo MultiAir 167 Bhp"}
                </h2>
                <p className="text-base leading-relaxed text-[#5c6c86] max-w-4xl">
                  {vrmData?.engineDetails ? (
                    <>
                      Our ECU Software remapping service for the {vrmData.engineDetails.paths?.brand?.name} {vrmData.engineDetails.paths?.model?.name} includes Dyno Development to ensure
                      optimal performance. We enhance Power & Torque while maintaining Fuel Economy and Reliability. Our
                      professional tuning delivers safe, tested improvements to your vehicle's performance.
                    </>
                  ) : (
                    <>
                  Our ECU Software remapping service for the Abarth 124 Spider includes Dyno Development to ensure
                  optimal performance. We enhance Power & Torque while maintaining Fuel Economy and Reliability. Our
                  professional tuning delivers safe, tested improvements to your vehicle's performance.
                    </>
                  )}
                </p>
              </div>
            {/* Performance Graph Section */}
             <div className="px-8 py-10 lg:px-12">
              <div className="bg-white rounded-[16px] p-8">
                <h3 className="text-2xl font-bold text-[#0c1b33] mb-6">
                  Vehicle Performance Chart - {vrmData?.name || vrmData?.engineDetails?.fullname || "Abarth 124 Spider 1.4 Turbo MultiAir 167 Bhp"}
                </h3>
                <div className="h-[500px] rounded-[12px] border border-gray-200 p-4">
                  {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis 
                          dataKey="rpm" 
                          label={{ value: 'RPM', position: 'insideBottom', offset: -10, style: { textAnchor: 'middle', fill: '#0c1b33', fontWeight: 'bold', fontSize: 12 } }}
                          tick={{ fill: '#5c6c86', fontSize: 11 }}
                          domain={[500, 5000]}
                          type="number"
                          ticks={[500, 1000, 1500, 2000, 2500, 3000, 3500, 4000, 4500, 5000]}
                        />
                        <YAxis 
                          yAxisId="bhp"
                          orientation="left"
                          label={{ value: 'BHP', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#0c1b33', fontWeight: 'bold', fontSize: 12 } }}
                          tick={{ fill: '#5c6c86', fontSize: 11 }}
                          domain={[0, 400]}
                          ticks={[0, 50, 100, 150, 200, 250, 300, 350, 400]}
                        />
                        <YAxis 
                          yAxisId="nm"
                          orientation="right"
                          label={{ value: 'Nm', angle: 90, position: 'insideRight', style: { textAnchor: 'middle', fill: '#0c1b33', fontWeight: 'bold', fontSize: 12 } }}
                          tick={{ fill: '#5c6c86', fontSize: 11 }}
                          domain={[0, 400]}
                          ticks={[0, 50, 100, 150, 200, 250, 300, 350, 400]}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            padding: '12px'
                          }}
                          formatter={(value: number, name: string) => {
                            const labelMap: { [key: string]: string } = {
                              'orgBHP': 'Org BHP',
                              'tunedBHP': 'Tuned BHP',
                              'orgNm': 'Org Nm',
                              'tunedNm': 'Tuned Nm'
                            };
                            return [value, labelMap[name] || name];
                          }}
                          labelFormatter={(label) => `RPM: ${label}`}
                        />
                        <Legend 
                          wrapperStyle={{ paddingTop: '20px' }}
                          formatter={(value: string) => {
                            const labelMap: { [key: string]: string } = {
                              'orgBHP': 'Org BHP',
                              'tunedBHP': 'Tuned BHP',
                              'orgNm': 'Org Nm',
                              'tunedNm': 'Tuned Nm'
                            };
                            return labelMap[value] || value;
                          }}
                        />
                        <Line
                          yAxisId="bhp"
                          type="monotone"
                          dataKey="orgBHP"
                          stroke="#ff9999"
                          strokeWidth={2}
                          dot={false}
                          name="orgBHP"
                        />
                        <Line
                          yAxisId="bhp"
                          type="monotone"
                          dataKey="tunedBHP"
                          stroke="#cc0000"
                          strokeWidth={2}
                          dot={false}
                          name="tunedBHP"
                        />
                        <Line
                          yAxisId="nm"
                          type="monotone"
                          dataKey="orgNm"
                          stroke="#99ff99"
                          strokeWidth={2}
                          dot={false}
                          name="orgNm"
                        />
                        <Line
                          yAxisId="nm"
                          type="monotone"
                          dataKey="tunedNm"
                          stroke="#00cc00"
                          strokeWidth={2}
                          dot={false}
                          name="tunedNm"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center">
                  <div className="text-center space-y-2">
                    <p className="text-gray-400">Performance Graph</p>
                        <p className="text-sm text-gray-500">Enter VRM or select vehicle to view chart</p>
                  </div>
                    </div>
                  )}
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
                        <span className="text-[#5c6c86] text-lg">
                          {vrmData?.engineDetails?.specz?.["Cylinder content"] 
                            ? `${vrmData.engineDetails.specz["Cylinder content"]} CC`
                            : vrmData?.engine_size || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0c1b33] mb-1">Compression:</span>
                        <span className="text-[#5c6c86] text-lg">
                          {vrmData?.engineDetails?.specz?.compression_ratio || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0c1b33] mb-1">Type Ecu:</span>
                        <span className="text-[#5c6c86] text-lg">
                          {vrmData?.engineDetails?.specz?.engine_ecu || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0c1b33] mb-1">Bore X Stroke:</span>
                        <span className="text-[#5c6c86] text-lg">
                          {vrmData?.engineDetails?.specz?.bore_stroke_ratio || "-"}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-[#0c1b33] mb-1">Engine Number:</span>
                        <span className="text-[#5c6c86] text-lg">
                          {vrmData?.engineDetails?.specz?.engine_number || "-"}
                        </span>
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
                          <span className="text-sm text-[#5c6c86] mb-3">Standard</span>
                          <div className="relative w-24 h-24 mb-2">
                            {(() => {
                              const originalHP = vrmData?.engineDetails?.horsepower_original;
                              const tunedHP = vrmData?.engineDetails?.horsepower_white;
                              if (!originalHP || !tunedHP) {
                                return (
                                  <div className="flex items-center justify-center h-full">
                                    <span className="text-sm text-gray-400">-</span>
                                  </div>
                                );
                              }
                              const maxHP = Math.max(tunedHP * 1.2, tunedHP + 20);
                              const percentage = (originalHP / maxHP) * 100;
                              const circumference = 2 * Math.PI * 40;
                              const offset = circumference - (circumference * percentage / 100);
                              return (
                                <>
                            <svg className="w-full h-full transform -rotate-90" key={`hp-original-${originalHP}`}>
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
                                strokeDasharray={circumference}
                                strokeDashoffset={animateProgress ? offset : circumference}
                                strokeLinecap="round"
                                className="progress-ring"
                                style={{
                                  '--circumference': `${circumference}px`,
                                  '--offset': `${offset}px`,
                                  transition: 'stroke-dashoffset 1.5s ease-out'
                                } as React.CSSProperties}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-[#0c1b33]">{originalHP}</span>
                              <span className="text-xs text-[#5c6c86]">Hp</span>
                            </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Modified */}
                        <div className="bg-white rounded-[12px] p-4 flex flex-col items-center">
                          <span className="text-sm text-[#5c6c86] mb-3">Tuned</span>
                          <div className="relative w-24 h-24 mb-2">
                            {(() => {
                              const originalHP = vrmData?.engineDetails?.horsepower_original;
                              const tunedHP = vrmData?.engineDetails?.horsepower_white;
                              if (!originalHP || !tunedHP) {
                                return (
                                  <div className="flex items-center justify-center h-full">
                                    <span className="text-sm text-gray-400">-</span>
                                  </div>
                                );
                              }
                              const maxHP = Math.max(tunedHP * 1.2, tunedHP + 20);
                              const percentage = (tunedHP / maxHP) * 100;
                              const circumference = 2 * Math.PI * 40;
                              const offset = circumference - (circumference * percentage / 100);
                              return (
                                <>
                            <svg className="w-full h-full transform -rotate-90" key={`hp-tuned-${tunedHP}`}>
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
                                strokeDasharray={circumference}
                                strokeDashoffset={animateProgress ? offset : circumference}
                                strokeLinecap="round"
                                className="progress-ring"
                                style={{
                                  transition: 'stroke-dashoffset 1.5s ease-out'
                                } as React.CSSProperties}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-[#0c1b33]">{tunedHP}</span>
                              <span className="text-xs text-[#5c6c86]">Hp</span>
                            </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Difference */}
                        <div className="bg-white rounded-[12px] p-4 flex flex-col items-center">
                          <span className="text-sm text-[#5c6c86] mb-3">Difference</span>
                          <div className="relative w-24 h-24 mb-2">
                            {(() => {
                              const originalHP = vrmData?.engineDetails?.horsepower_original;
                              const tunedHP = vrmData?.engineDetails?.horsepower_white;
                              if (!originalHP || !tunedHP) {
                                return (
                                  <div className="flex items-center justify-center h-full">
                                    <span className="text-sm text-gray-400">-</span>
                                  </div>
                                );
                              }
                              const difference = tunedHP - originalHP;
                              return (
                                <>
                            <svg className="w-full h-full difference-ring" key={`hp-diff-${difference}`} style={{ transform: 'rotate(-90deg)' }}>
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
                                    <span className="text-2xl font-bold text-[#0c1b33]">+{difference}</span>
                              <span className="text-xs text-[#5c6c86]">Hp</span>
                            </div>
                                </>
                              );
                            })()}
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
                          <span className="text-sm text-[#5c6c86] mb-3">Standard</span>
                          <div className="relative w-24 h-24 mb-2">
                            {(() => {
                              const originalTorque = vrmData?.engineDetails?.torque_original;
                              const tunedTorque = vrmData?.engineDetails?.torque_white;
                              if (!originalTorque || !tunedTorque) {
                                return (
                                  <div className="flex items-center justify-center h-full">
                                    <span className="text-sm text-gray-400">-</span>
                                  </div>
                                );
                              }
                              const maxTorque = Math.max(tunedTorque * 1.2, tunedTorque + 20);
                              const percentage = (originalTorque / maxTorque) * 100;
                              const circumference = 2 * Math.PI * 40;
                              const offset = circumference - (circumference * percentage / 100);
                              return (
                                <>
                            <svg className="w-full h-full transform -rotate-90" key={`torque-original-${originalTorque}`}>
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
                                strokeDasharray={circumference}
                                strokeDashoffset={animateProgress ? offset : circumference}
                                strokeLinecap="round"
                                className="progress-ring"
                                style={{
                                  transition: 'stroke-dashoffset 1.5s ease-out'
                                } as React.CSSProperties}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-[#0c1b33]">{originalTorque}</span>
                              <span className="text-xs text-[#5c6c86]">Nm</span>
                            </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Modified */}
                        <div className="bg-white rounded-[12px] p-4 flex flex-col items-center">
                          <span className="text-sm text-[#5c6c86] mb-3">Tuned</span>
                          <div className="relative w-24 h-24 mb-2">
                            {(() => {
                              const originalTorque = vrmData?.engineDetails?.torque_original;
                              const tunedTorque = vrmData?.engineDetails?.torque_white;
                              if (!originalTorque || !tunedTorque) {
                                return (
                                  <div className="flex items-center justify-center h-full">
                                    <span className="text-sm text-gray-400">-</span>
                                  </div>
                                );
                              }
                              const maxTorque = Math.max(tunedTorque * 1.2, tunedTorque + 20);
                              const percentage = (tunedTorque / maxTorque) * 100;
                              const circumference = 2 * Math.PI * 40;
                              const offset = circumference - (circumference * percentage / 100);
                              return (
                                <>
                            <svg className="w-full h-full transform -rotate-90" key={`torque-tuned-${tunedTorque}`}>
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
                                strokeDasharray={circumference}
                                strokeDashoffset={animateProgress ? offset : circumference}
                                strokeLinecap="round"
                                className="progress-ring"
                                style={{
                                  transition: 'stroke-dashoffset 1.5s ease-out'
                                } as React.CSSProperties}
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-[#0c1b33]">{tunedTorque}</span>
                              <span className="text-xs text-[#5c6c86]">Nm</span>
                            </div>
                                </>
                              );
                            })()}
                          </div>
                        </div>

                        {/* Difference */}
                        <div className="bg-white rounded-[12px] p-4 flex flex-col items-center">
                          <span className="text-sm text-[#5c6c86] mb-3">Difference</span>
                          <div className="relative w-24 h-24 mb-2">
                            {(() => {
                              const originalTorque = vrmData?.engineDetails?.torque_original;
                              const tunedTorque = vrmData?.engineDetails?.torque_white;
                              if (!originalTorque || !tunedTorque) {
                                return (
                                  <div className="flex items-center justify-center h-full">
                                    <span className="text-sm text-gray-400">-</span>
                                  </div>
                                );
                              }
                              const difference = tunedTorque - originalTorque;
                              return (
                                <>
                            <svg className="w-full h-full difference-ring" key={`torque-diff-${difference}`} style={{ transform: 'rotate(-90deg)' }}>
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
                                    <span className="text-2xl font-bold text-[#0c1b33]">+{difference}</span>
                              <span className="text-xs text-[#5c6c86]">Nm</span>
                            </div>
                                </>
                              );
                            })()}
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
                  {vrmData?.engineDetails?.fullname || vrmData?.name || "Vehicle"} {vrmData?.engineDetails?.specz?.["Cylinder content"] ? `${vrmData.engineDetails.specz["Cylinder content"]} cc` : vrmData?.engine_size || ""} Power(HP) & Torque(lb-ft) VS Engine Speed(RPM)
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
                      
                      {/* Chart Lines - Using Recharts */}
                      {dynoChartData.length > 0 ? (
                        <div className="absolute inset-0 top-8 bottom-12 left-12 right-12">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={dynoChartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" opacity={0.3} />
                              <XAxis 
                                dataKey="rpm" 
                                type="number"
                                domain={[0, 7]}
                                ticks={[0, 1, 2, 3, 4, 5, 6, 7]}
                                tick={false}
                                axisLine={false}
                              />
                              <YAxis 
                                yAxisId="hp"
                                orientation="left"
                                domain={[0, 250]}
                                ticks={[0, 50, 100, 150, 200, 250]}
                                tick={false}
                                axisLine={false}
                              />
                              <YAxis 
                                yAxisId="torque"
                                orientation="right"
                                domain={[0, 250]}
                                ticks={[0, 50, 100, 150, 200, 250]}
                                tick={false}
                                axisLine={false}
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  padding: '8px'
                                }}
                                formatter={(value: number, name: string) => {
                                  const labelMap: { [key: string]: string } = {
                                    'orgBHP': 'ORI Power',
                                    'tunedBHP': 'MOD V9 Power',
                                    'orgTorqueLbFt': 'ORI Torque',
                                    'tunedTorqueLbFt': 'MOD V9 Torque'
                                  };
                                  return [value, labelMap[name] || name];
                                }}
                                labelFormatter={(label) => `RPM: ${(parseFloat(label) * 1000).toLocaleString()}`}
                              />
                              <Line
                                yAxisId="hp"
                                type="monotone"
                                dataKey="orgBHP"
                                stroke="#000000"
                                strokeWidth={2}
                                dot={false}
                                name="orgBHP"
                              />
                              <Line
                                yAxisId="hp"
                                type="monotone"
                                dataKey="tunedBHP"
                                stroke="#dc2626"
                                strokeWidth={2}
                                dot={false}
                                name="tunedBHP"
                              />
                              <Line
                                yAxisId="torque"
                                type="monotone"
                                dataKey="orgTorqueLbFt"
                                stroke="#000000"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                name="orgTorqueLbFt"
                              />
                              <Line
                                yAxisId="torque"
                                type="monotone"
                                dataKey="tunedTorqueLbFt"
                                stroke="#dc2626"
                                strokeWidth={2}
                                strokeDasharray="5 5"
                                dot={false}
                                name="tunedTorqueLbFt"
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      ) : (
                        <div className="absolute inset-0 top-8 bottom-12 left-12 right-12 flex items-center justify-center">
                          <div className="text-center space-y-2">
                            <p className="text-gray-400">Dyno Chart</p>
                            <p className="text-sm text-gray-500">Enter VRM or select vehicle to view chart</p>
                          </div>
                        </div>
                      )}
                      
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
                      {/* Run - ORI */}
                      {dynoMetrics ? (
                        <>
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-3 border-r border-gray-200">
                              <div className="w-4 h-4 bg-black"></div>
                            </td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">ORI</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">
                              {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })}
                            </td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">{dynoMetrics.original.maxHP.toFixed(1)} HP</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">{dynoMetrics.original.engHP.toFixed(1)} HP</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">{dynoMetrics.original.avgHP.toFixed(1)} HP</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">0.0%</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">{dynoMetrics.original.maxTorqueLbFt.toFixed(1)} lb-ft</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">{dynoMetrics.original.engTorqueLbFt.toFixed(1)} lb-ft</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">{dynoMetrics.original.avgTorqueLbFt.toFixed(1)} lb-ft</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">RO</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">70.7 °F</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">29.69</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">19</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">0.98</td>
                            <td className="py-2 px-3 text-[#5c6c86]"></td>
                          </tr>
                          {/* Run - MOD V9 */}
                          <tr className="border-b border-gray-200">
                            <td className="py-2 px-3 border-r border-gray-200">
                              <div className="w-4 h-4 bg-red-600"></div>
                            </td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">MOD V9</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">
                              {new Date().toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: '2-digit' })}
                            </td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">{dynoMetrics.tuned.maxHP.toFixed(1)} HP</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">{dynoMetrics.tuned.engHP.toFixed(1)} HP</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">{dynoMetrics.tuned.avgHP.toFixed(1)} HP</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">
                              {((dynoMetrics.tuned.maxHP - dynoMetrics.original.maxHP) / dynoMetrics.original.maxHP * 100).toFixed(1)}%
                            </td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">{dynoMetrics.tuned.maxTorqueLbFt.toFixed(1)} lb-ft</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">{dynoMetrics.tuned.engTorqueLbFt.toFixed(1)} lb-ft</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">{dynoMetrics.tuned.avgTorqueLbFt.toFixed(1)} lb-ft</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">RO</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">70.1 °F</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">29.69</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">19</td>
                            <td className="py-2 px-3 text-[#5c6c86] border-r border-gray-200">0.98</td>
                            <td className="py-2 px-3 text-[#5c6c86]"></td>
                          </tr>
                        </>
                      ) : (
                        <tr>
                          <td colSpan={15} className="py-4 px-3 text-center text-[#5c6c86]">
                            Enter VRM or select vehicle to view dyno data
                          </td>
                        </tr>
                      )}
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

export default function GainsCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <GainsCalculatorContent />
    </Suspense>
  );
}

