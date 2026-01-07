"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { navLinks, vehicleMakes, vehicleModels } from "@/lib/constants";
import { VehicleComboboxLight } from "@/components/VehicleComboboxLight";
import { Navbar } from "@/components/Navbar";
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
} from "@/lib/utils/dynoGenerator";

// Custom Gauge Component matching the design
// Custom Gauge Component matching the design
function Gauge({
  label,
  value,
  unit,
  color = "#00a9f4",  // Cyan-blue from image
  type = "solid",
  isDifference = false
}: {
  label: string;
  value: number;
  unit: string;
  color?: string;
  type?: "solid" | "dashed";
  isDifference?: boolean;
}) {
  const radius = 38;
  const strokeWidth = 5;
  const center = 50;
  const circumference = 2 * Math.PI * radius;
  // Open circle at bottom (approx 260 degrees visible)
  const visibleAngle = 250;
  const totalLength = (visibleAngle / 360) * circumference;
  const rotation = 90 + (360 - visibleAngle) / 2;

  const percent = isDifference ? 100 : 75;
  // Difference ring is full circle/dashed, others are solid arc
  const strokeDashoffset = isDifference
    ? 0
    : circumference - (totalLength * (percent / 100));

  // Bar chart bars (mock visual) - make them blue/cyan
  const bars = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <div className="flex flex-col items-center justify-center w-[145px] h-[182px] rounded-[10px]">
      <span className="text-sm font-bold text-black mb-3">{label}</span>
      <div className="relative w-[110px] h-[110px] flex items-center justify-center">
        {/* Gauge SVG */}
        <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0 z-10">
          {/* White Base Track (Background Ring) */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke="#c0c0c0"
            strokeWidth={strokeWidth}
            strokeDasharray={isDifference ? "6 6" : `${totalLength} ${circumference}`}
            transform={`rotate(${rotation} ${center} ${center})`}
            strokeLinecap="round"
            className="opacity-100"
          />

          {/* Progress/Value Arc */}
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={isDifference ? "6 6" : `${totalLength} ${circumference}`}
            strokeDashoffset={isDifference ? 0 : strokeDashoffset}
            transform={`rotate(${rotation} ${center} ${center})`}
            strokeLinecap="round"
            className={isDifference ? "" : ""}
          />
        </svg>

        {/* Center Content: Value, Unit, Bars */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pt-1 z-20">
          {/* Value */}
          <span className={`text-2xl font-black text-black leading-none tracking-tight`}>
            {isDifference ? "+" : ""}{Math.round(value)}
          </span>
          {/* Unit */}
          <span className="text-[10px] text-gray-500 font-medium mb-1">{unit}</span>

          {/* Bar Chart Visualization (Inside Gauge) */}
          <div className="flex items-end gap-[3px] h-[14px]">
            {!isDifference && bars.map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-sm"
                style={{
                  height: `${h * 1.5}px`,
                  backgroundColor: color,
                  opacity: i < 8 ? 1 : 0.4
                }}
              />
            ))}
            {/* Dashed placeholder for difference or just simpler look? User image has bars for diff too but greyish? 
                    Actually in image, difference has bars too. Let's add them. 
                  */}
            {isDifference && bars.map((h, i) => (
              <div
                key={i}
                className="w-[3px] rounded-sm bg-gray-400"
                style={{ height: `${h * 1.5}px` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GainsCalculatorContent() {
  const searchParams = useSearchParams();
  const regParam = searchParams?.get("reg");
  const engineParam = searchParams?.get("engine");

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
  }, [vrmInput, brands]);

  // Handler for loading engine details from engine ID
  const handleEngineDetailsLoad = useCallback(async (engineId: string) => {
    if (!engineId) {
      return;
    }

    setVrmLoading(true);
    setVrmError(null);
    setVrmData(null);
    setAnimateProgress(false);

    try {
      const data = await getEngineDetails(engineId);
      setVrmData(data);

      // Populate dropdown selections if paths are available
      if (data.engineDetails?.paths && brands.length > 0) {
        const paths = data.engineDetails.paths;

        // Find and set brand
        if (paths.brand?.name) {
          const matchingBrand = brands.find(b => b.name === paths.brand.name);
          if (matchingBrand) {
            setSelectedBrandId(matchingBrand.id);

            // Load models and populate model selection
            try {
              const modelsData = await getModels(matchingBrand.id);
              setModels(modelsData);

              // Find and set model
              if (paths.model?.name && modelsData.length > 0) {
                const matchingModel = modelsData.find(m => m.name === paths.model.name);
                if (matchingModel) {
                  setSelectedModelId(matchingModel.id);

                  // Load generations and populate generation selection
                  try {
                    const generationsData = await getGenerations(matchingModel.id);
                    setGenerations(generationsData);

                    // Find and set generation
                    if (paths.generation?.name && generationsData.length > 0) {
                      const matchingGeneration = generationsData.find(g => g.name === paths.generation.name);
                      if (matchingGeneration) {
                        setSelectedGenerationId(matchingGeneration.id);

                        // Load engines and set engine selection
                        try {
                          const enginesData = await getEngines(matchingGeneration.id);
                          setEngines(enginesData);

                          // Set the engine public ID after a small delay to ensure useEffects have finished
                          setTimeout(() => {
                            setSelectedEnginePublicId(engineId);
                          }, 100);
                        } catch (error) {
                          console.error("Failed to load engines:", error);
                        }
                      }
                    }
                  } catch (error) {
                    console.error("Failed to load generations:", error);
                  }
                }
              }
            } catch (error) {
              console.error("Failed to load models:", error);
            }
          }
        }
      }

      // Trigger animation after a small delay
      setTimeout(() => {
        setAnimateProgress(true);
      }, 100);
    } catch (error) {
      setVrmError(error instanceof Error ? error.message : "Failed to load vehicle data. Please try again.");
    } finally {
      setVrmLoading(false);
    }
  }, [brands]);

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

  // Load engine details if engine param exists
  useEffect(() => {
    if (engineParam && brands.length > 0) {
      handleEngineDetailsLoad(engineParam);
    }
  }, [engineParam, brands.length, handleEngineDetailsLoad]);

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
    <div className="min-h-screen bg-gray-100">
      <div className="w-full">
        <div className="bg-white shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden">
          <Navbar ctaText="Book a Dyno" />

          <main className="space-y-8 sm:space-y-10 md:space-y-12">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-[#030814] text-white h-[250px] sm:h-[350px] md:h-[450px] lg:h-[530px]">
              {/* Background Image with backdrop blur */}
              <Image
                src="/images/hero/gainsHero.png"
                alt="Vehicle Gains"
                width={1600}
                height={530}
                className="absolute inset-0 h-full w-full object-cover blur-sm"
                priority
              />
              {/* Dark overlay for text readability */}
              <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none z-10" />
              <div className="relative h-full flex items-center px-4 sm:px-6 md:px-8 lg:px-12 py-8 sm:py-12 md:py-16 lg:py-20 z-20">
                <div className="space-y-4 sm:space-y-5 md:space-y-6 max-w-3xl">
                  <p className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm font-semibold text-[#7ab6ff] animate-subtitle">
                    <span className="h-px w-8 sm:w-12 bg-[#7ab6ff]" />
                    Feel the Need for Speed: Dyno Car Tests
                  </p>
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight animate-heading">
                    Vehicle Gains
                  </h1>
                </div>
              </div>
            </section>

            {/* Vehicle Selection Section */}
            <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 md:py-10">
              <div className="grid gap-6 sm:gap-8 lg:grid-cols-[400px_1fr] xl:grid-cols-[450px_1fr] 2xl:grid-cols-[500px_1fr]">
                {/* Vehicle Application Form */}
                <div className="bg-gray-100 rounded-[12px] sm:rounded-[16px] p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 animate-card animate-slide-left">
                  <div className="space-y-2 sm:space-y-3">
                    <label className="block text-xs sm:text-sm font-semibold text-[#0c1b33] mb-1.5 sm:mb-2">Your vehicle registration</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <div className="flex items-center gap-2 rounded-[6px] sm:rounded-[8px] border border-gray-300 bg-white px-2.5 sm:px-3 py-1.5 sm:py-2 flex-1">
                        <span className="text-[10px] sm:text-xs font-semibold bg-[#ffd200] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-black whitespace-nowrap">GB</span>
                        <input
                          type="text"
                          value={vrmInput}
                          onChange={(e) => setVrmInput(e.target.value.toUpperCase())}
                          onKeyPress={(e) => e.key === "Enter" && handleVRMLookup()}
                          placeholder="Your vehicle registration"
                          className="flex-1 bg-transparent text-xs sm:text-sm text-[#0c1b33] placeholder:text-gray-400 focus:outline-none w-full"
                          readOnly={false}
                        />
                      </div>
                      <button
                        onClick={() => handleVRMLookup()}
                        disabled={vrmLoading}
                        className="rounded-[6px] sm:rounded-[8px] bg-gray-700 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white animate-button disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
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
                      <VehicleComboboxLight
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
                      <label className="block text-xs font-semibold text-[#0c1b33] mb-1.5">Model</label>
                      <VehicleComboboxLight
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
                      <label className="block text-xs font-semibold text-[#0c1b33] mb-1.5">Fuel</label>
                      <VehicleComboboxLight
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
                      <label className="block text-xs font-semibold text-[#0c1b33] mb-1.5">Engine</label>
                      <VehicleComboboxLight
                        options={engineOptions}
                        value={selectedEnginePublicId}
                        onValueChange={setSelectedEnginePublicId}
                        placeholder="- Please Select Engine -"
                        searchPlaceholder="Search engine..."
                        disabled={!selectedGenerationId || enginesLoading}
                        emptyMessage="No engine found."
                      />
                    </div>
                    <button
                      onClick={handleManualSelection}
                      disabled={!selectedEnginePublicId || vrmLoading}
                      className="w-full rounded-[6px] sm:rounded-[8px] bg-[#ffd200] px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-black animate-button hover:bg-[#e6c000] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {vrmLoading ? "Loading..." : "Show"}
                    </button>
                  </div>
                </div>
                {/* Car Image and Specifications Card */}
                <div
                  className="w-full bg-white border border-gray-100 rounded-[8px] sm:rounded-[10px] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-[35px] animate-card-delay-1 animate-slide-right"
                >
                  {/* Car/Brand Image */}
                  <div className="relative flex-shrink-0 w-full sm:w-[250px] md:w-[300px] lg:w-[350px] xl:w-[400px] h-[150px] sm:h-[170px] md:h-[189px]">
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
                  <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-x-4 sm:gap-x-6 md:gap-x-8 gap-y-3 sm:gap-y-4 text-xs sm:text-sm">
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
              <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#1d70ff]">
                  {vrmData?.name || vrmData?.engineDetails?.fullname || "Abarth 124 Spider 1.4 Turbo MultiAir 167 Bhp"}
                </h2>
                <p className="text-sm sm:text-base leading-relaxed text-[#5c6c86] max-w-4xl">
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
              <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 md:py-10">
                <div className="bg-white rounded-[12px] sm:rounded-[16px] p-4 sm:p-6 md:p-8">
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0c1b33] mb-4 sm:mb-6">
                    <span className="hidden sm:inline">Vehicle Performance Chart - </span>
                    {vrmData?.name || vrmData?.engineDetails?.fullname || "Abarth 124 Spider 1.4 Turbo MultiAir 167 Bhp"}
                  </h3>
                  <div className="h-[300px] sm:h-[400px] md:h-[500px] rounded-[8px] sm:rounded-[12px] border border-gray-200 p-2 sm:p-3 md:p-4">
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



            {/* Engine Specifications and Results Section */}
            <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 md:py-10">
              <div className="bg-[#E5E5E5] rounded-[10px] w-full max-w-[1291px] mx-auto h-auto lg:h-[507px] p-6 lg:px-12 lg:py-8 flex flex-col justify-center">
                <div className="grid gap-12 lg:grid-cols-[1fr_1.8fr] items-start">

                  {/* Engine Specifications - Left Side */}
                  <div className="space-y-8">
                    <h3 className="text-3xl font-black text-black tracking-tight">Engine Specifications</h3>

                    <div className="grid grid-cols-[140px_1fr] gap-y-6 text-sm">
                      <div className="text-gray-600 font-medium">Cylinder Capacity</div>
                      <div className="font-bold text-black">
                        {vrmData?.engineDetails?.specz?.["Cylinder content"]
                          ? `${vrmData.engineDetails.specz["Cylinder content"]}CC`
                          : vrmData?.engine_size ? `${vrmData.engine_size}CC` : "-"}
                      </div>

                      <div className="text-gray-600 font-medium">Compression</div>
                      <div className="font-bold text-black">
                        {vrmData?.engineDetails?.specz?.compression_ratio || "-"}
                      </div>

                      <div className="text-gray-600 font-medium">Type Ecu</div>
                      <div className="font-bold text-black leading-snug max-w-[200px]">
                        {vrmData?.engineDetails?.specz?.engine_ecu || "-"}
                      </div>

                      <div className="text-gray-600 font-medium">Bore X Stroke</div>
                      <div className="font-bold text-black">
                        {vrmData?.engineDetails?.specz?.bore_stroke_ratio || "-"}
                      </div>

                      <div className="text-gray-600 font-medium">Engine Code</div>
                      <div className="font-bold text-black">
                        {vrmData?.engineDetails?.specz?.engine_code || "-"}
                      </div>
                    </div>

                    <button className="w-[180px] rounded-[6px] bg-[#00a9f4] hover:bg-[#009de3] py-3 text-sm font-bold text-white transition-colors shadow-sm">
                      Request Quote
                    </button>
                  </div>

                  {/* Performance Results - Right Side */}
                  <div className="space-y-4">

                    {/* Power Row - Unified Card */}
                    <div className="flex w-full max-w-[721px] h-auto md:h-[221px] bg-[#6767671A] rounded-[10px] overflow-hidden">
                      {/* Label Section (Left) */}
                      <div className="w-[163px] h-full bg-[#3A3A3A17] flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-black text-black">Power</span>
                        <span className="text-gray-600 font-normal text-sm">(Hp)</span>
                      </div>

                      {/* Gauges Section (Right) */}
                      <div className="flex-1 flex flex-row items-center justify-around px-2 sm:px-8">
                        <Gauge
                          label="Original"
                          value={vrmData?.engineDetails?.horsepower_original || 0}
                          unit="hp"
                          color="#00a9f4"
                          type="solid"
                        />
                        <Gauge
                          label="Modified"
                          value={vrmData?.engineDetails?.horsepower_white || 0}
                          unit="hp"
                          color="#00a9f4"
                          type="solid"
                        />
                        <Gauge
                          label="Difference"
                          value={(vrmData?.engineDetails?.horsepower_white || 0) - (vrmData?.engineDetails?.horsepower_original || 0)}
                          unit="hp"
                          color="#00a9f4"
                          type="dashed"
                          isDifference
                        />
                      </div>
                    </div>

                    {/* Torque Row - Unified Card */}
                    <div className="flex w-full max-w-[721px] h-auto md:h-[221px] bg-[#6767671A] rounded-[10px] overflow-hidden">
                      {/* Label Section (Left) */}
                      <div className="w-[163px] h-full bg-[#3A3A3A17] flex flex-col items-center justify-center flex-shrink-0">
                        <span className="text-2xl font-black text-black">Torque</span>
                        <span className="text-gray-600 font-normal text-sm">(Nm)</span>
                      </div>

                      {/* Gauges Section (Right) */}
                      <div className="flex-1 flex flex-row items-center justify-around px-2 sm:px-8">
                        <Gauge
                          label="Original"
                          value={vrmData?.engineDetails?.torque_original || 0}
                          unit="nm"
                          color="#00a9f4"
                          type="solid"
                        />
                        <Gauge
                          label="Modified"
                          value={vrmData?.engineDetails?.torque_white || 0}
                          unit="nm"
                          color="#00a9f4"
                          type="solid"
                        />
                        <Gauge
                          label="Difference"
                          value={(vrmData?.engineDetails?.torque_white || 0) - (vrmData?.engineDetails?.torque_original || 0)}
                          unit="nm"
                          color="#00a9f4"
                          type="dashed"
                          isDifference
                        />
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>


            {/* Detailed Results Graph */}
            <section className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-6 sm:py-8 md:py-10">
              <div className="bg-white rounded-[12px] sm:rounded-[16px] border border-gray-200 p-4 sm:p-6 md:p-8">
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#0c1b33] mb-3 sm:mb-4">
                  RESULTS
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-[#5c6c86] mb-4 sm:mb-6">
                  {vrmData?.engineDetails?.fullname || vrmData?.name || "Vehicle"} {vrmData?.engineDetails?.specz?.["Cylinder content"] ? `${vrmData.engineDetails.specz["Cylinder content"]} cc` : vrmData?.engine_size || ""} Power(HP) & Torque(lb-ft) VS Engine Speed(RPM)
                </p>

                {/* Dyno Chart */}
                <div className="relative h-[300px] sm:h-[400px] md:h-[500px] bg-white rounded-[8px] sm:rounded-[12px] border border-gray-200 mb-4 sm:mb-6 p-2 sm:p-3 md:p-4">
                  <div className="relative w-full h-full">
                    {/* Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <span className="text-6xl font-bold text-gray-400">DYNOJET</span>
                    </div>

                    {/* Chart Area */}
                    <div className="relative w-full h-full">
                      {/* Y-axis label - Left (Power HP) */}
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] sm:text-xs font-semibold text-[#0c1b33] hidden sm:block">
                        Power(HP)
                      </div>

                      {/* Y-axis labels - Left (Power HP) */}
                      <div className="absolute left-2 sm:left-4 md:left-8 top-0 bottom-8 sm:bottom-12 flex flex-col justify-between text-[9px] sm:text-xs text-[#5c6c86]">
                        <span>250</span>
                        <span>200</span>
                        <span>150</span>
                        <span>100</span>
                        <span>50</span>
                        <span>0</span>
                      </div>

                      {/* Y-axis label - Right (Torque lb-ft) */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 rotate-90 text-[10px] sm:text-xs font-semibold text-[#0c1b33] hidden sm:block">
                        Torque(lb-ft)
                      </div>

                      {/* Y-axis labels - Right (Torque lb-ft) */}
                      <div className="absolute right-2 sm:right-4 md:right-8 top-0 bottom-8 sm:bottom-12 flex flex-col justify-between text-[9px] sm:text-xs text-[#5c6c86]">
                        <span>250</span>
                        <span>200</span>
                        <span>150</span>
                        <span>100</span>
                        <span>50</span>
                        <span>0</span>
                      </div>

                      {/* X-axis label */}
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 sm:translate-y-6 text-[10px] sm:text-xs font-semibold text-[#0c1b33]">
                        Engine Speed(RPM)
                      </div>

                      {/* X-axis labels */}
                      <div className="absolute bottom-4 sm:bottom-6 left-6 sm:left-8 md:left-12 right-6 sm:right-8 md:right-12 flex justify-between text-[9px] sm:text-xs text-[#5c6c86]">
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
                        <div className="absolute inset-0 top-4 sm:top-6 md:top-8 bottom-8 sm:bottom-10 md:bottom-12 left-6 sm:left-8 md:left-12 right-6 sm:right-8 md:right-12">
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
                      <div className="absolute top-2 sm:top-4 right-2 sm:right-4 space-y-1 sm:space-y-2 text-[9px] sm:text-xs">
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
                <div className="overflow-x-auto -mx-4 sm:mx-0">
                  <table className="w-full text-[9px] sm:text-xs border border-gray-200 min-w-[800px]">
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


          </main>
        </div>
      </div>
    </div>
  );
}

export default function GainsCalculatorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    }>
      <GainsCalculatorContent />
    </Suspense>
  );
}
