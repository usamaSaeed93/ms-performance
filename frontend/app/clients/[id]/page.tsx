"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
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
import { Navbar } from "@/components/Navbar";
import { navLinks } from "@/lib/constants";
import { useGetClientByIdQuery } from "@/lib/store/api/clientsApi";
import { resolveVRM, type VRMResponse } from "@/lib/api/vrm";
import {
  generateDynoData,
  detectEngineType,
  estimateEngineParams,
} from "@/lib/utils/dynoGenerator";
import { ArrowLeft, Zap, Gauge, TrendingUp, Info, Car } from "lucide-react";

// ─── Helper ────────────────────────────────────────────────────────────────────

function StatBadge({
  label,
  before,
  after,
  unit,
  color,
}: {
  label: string;
  before: number;
  after: number;
  unit: string;
  color: "blue" | "red" | "green";
}) {
  const gain = after - before;
  const colorMap = {
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    red: "bg-red-50 border-red-200 text-red-600",
    green: "bg-green-50 border-green-200 text-green-700",
  };
  return (
    <div className={`rounded-2xl border p-5 ${colorMap[color]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-70">{label}</p>
      <div className="mt-2 flex items-end gap-3">
        <div>
          <p className="text-[10px] opacity-60">Before</p>
          <p className="text-xl font-black">
            {before}
            <span className="text-sm font-medium ml-1">{unit}</span>
          </p>
        </div>
        <div className="text-gray-300 text-lg">→</div>
        <div>
          <p className="text-[10px] opacity-60">After</p>
          <p className="text-xl font-black">
            {after}
            <span className="text-sm font-medium ml-1">{unit}</span>
          </p>
        </div>
      </div>
      <p className="mt-2 text-xs font-bold">
        +{gain} {unit} gain
      </p>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function ClientDetailPage() {
  const params = useParams();
  const clientId = Number(params?.id);

  const { data: client, isLoading: clientLoading } = useGetClientByIdQuery(clientId, {
    skip: !clientId,
  });

  const [vrmData, setVrmData] = useState<VRMResponse | null>(null);
  const [vrmLoading, setVrmLoading] = useState(false);
  const [vrmError, setVrmError] = useState<string | null>(null);

  // Fetch VRM data once client is loaded
  useEffect(() => {
    if (!client?.registration) return;

    const fetchVrm = async () => {
      setVrmLoading(true);
      setVrmError(null);
      try {
        const data = await resolveVRM(
          client.registration!.toUpperCase().replace(/\s/g, ""),
          "msperformance.co.uk"
        );
        setVrmData(data);
      } catch (err) {
        setVrmError(err instanceof Error ? err.message : "Could not load vehicle data.");
      } finally {
        setVrmLoading(false);
      }
    };

    fetchVrm();
  }, [client?.registration]);

  // ── Dyno chart data (BHP vs RPM) ─────────────────────────────────────────────
  const chartData = useMemo(() => {
    if (!vrmData?.engineDetails) return [];

    const origHP = vrmData.engineDetails.horsepower_original ?? 141;
    const tunedHP = vrmData.engineDetails.horsepower_white ?? 160;
    const origTorqueNm = vrmData.engineDetails.torque_original ?? 300;
    const tunedTorqueNm = vrmData.engineDetails.torque_white ?? 390;
    const nmToLbFt = 0.737562;

    const engineType = detectEngineType(
      vrmData.engineDetails.specz?.energy,
      vrmData.engineDetails.fullname
    );
    const engineParams = estimateEngineParams(origTorqueNm * nmToLbFt, origHP, engineType, 7000);

    const origData = generateDynoData({
      peakTorque: origTorqueNm * nmToLbFt,
      peakHP: origHP,
      peakTorqueRPM: engineParams.peakTorqueRPM,
      peakHPRPM: engineParams.peakHPRPM,
      redline: 7000,
      engineType,
      minRPM: 800,
      rpmStep: 100,
    });

    const tunedData = generateDynoData({
      peakTorque: tunedTorqueNm * nmToLbFt,
      peakHP: tunedHP,
      peakTorqueRPM: engineParams.peakTorqueRPM,
      peakHPRPM: engineParams.peakHPRPM,
      redline: 7000,
      engineType,
      minRPM: 800,
      rpmStep: 100,
    });

    return origData.map((orig, idx) => {
      const tuned = tunedData[idx] ?? tunedData[tunedData.length - 1];
      return {
        rpm: (orig.rpm / 1000).toFixed(1),
        "Before (BHP)": Math.round(orig.hp),
        "After (BHP)": Math.round(tuned.hp),
        "Before (Nm)": Math.round(orig.torque / nmToLbFt),
        "After (Nm)": Math.round(tuned.torque / nmToLbFt),
      };
    });
  }, [vrmData]);

  // ─────────────────────────────────────────────────────────────────────────────

  const ed = vrmData?.engineDetails;
  const origHP = ed?.horsepower_original ?? 0;
  const tunedHP = ed?.horsepower_white ?? 0;
  const origTorque = ed?.torque_original ?? 0;
  const tunedTorque = ed?.torque_white ?? 0;

  if (clientLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0c1b33]">
        <div className="animate-spin h-10 w-10 rounded-full border-4 border-white border-t-transparent" />
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0c1b33] text-white">
        <p className="text-lg font-semibold">Client not found.</p>
        <Link href="/" className="text-[#1d70ff] underline">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar navLinks={navLinks} />

      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden bg-[#0c1b33] pb-16 pt-28">
        {client.image_url && (
          <div className="pointer-events-none absolute inset-0 opacity-20">
            <Image src={client.image_url} alt={client.name} fill className="object-cover" />
          </div>
        )}
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/#clients"
            className="mb-6 inline-flex items-center gap-2 text-sm text-gray-300 hover:text-white transition"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Our Clients
          </Link>

          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            {/* Photo */}
            {client.image_url && (
              <div className="relative h-52 w-52 flex-shrink-0 overflow-hidden rounded-2xl shadow-2xl border-4 border-white/10">
                <Image
                  src={client.image_url}
                  alt={client.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Title block */}
            <div className="text-white">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#1d70ff] mb-2">
                MS Performance — Client Showcase
              </p>
              <h1 className="text-3xl font-black sm:text-4xl md:text-5xl leading-tight">
                {client.name}
              </h1>
              {client.details && (
                <p className="mt-3 text-lg text-gray-300">{client.details}</p>
              )}
              {vrmData && ed && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {ed.paths?.brand?.name && (
                    <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-medium">
                      {ed.paths.brand.name}
                    </span>
                  )}
                  {ed.paths?.model?.name && (
                    <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-medium">
                      {ed.paths.model.name}
                    </span>
                  )}
                  {ed.paths?.generation?.name && (
                    <span className="rounded-full bg-white/10 px-4 py-1 text-sm font-medium">
                      {ed.paths.generation.name}
                    </span>
                  )}
                  {ed.specz?.energy && (
                    <span className="rounded-full bg-[#1d70ff]/20 border border-[#1d70ff]/50 px-4 py-1 text-sm font-medium text-[#7db3ff]">
                      {ed.specz.energy}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">

        {/* VRM loading / error */}
        {client.registration && vrmLoading && (
          <div className="flex items-center gap-3 rounded-xl bg-blue-50 border border-blue-200 p-5">
            <div className="animate-spin h-5 w-5 rounded-full border-2 border-[#1d70ff] border-t-transparent flex-shrink-0" />
            <p className="text-sm text-blue-700">
              Loading performance data for{" "}
              <span className="font-bold font-mono">{client.registration}</span>…
            </p>
          </div>
        )}
        {vrmError && (
          <div className="flex items-start gap-3 rounded-xl bg-amber-50 border border-amber-200 p-5">
            <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-amber-700">Performance data unavailable</p>
              <p className="text-xs text-amber-600 mt-0.5">{vrmError}</p>
            </div>
          </div>
        )}

        {/* ── Performance stats ── */}
        {ed && origHP > 0 && (
          <>
            <div>
              <h2 className="text-2xl font-black text-[#0c1b33] mb-6 flex items-center gap-2">
                <Zap className="h-6 w-6 text-[#1d70ff]" />
                Performance Results
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <StatBadge
                  label="Power"
                  before={origHP}
                  after={tunedHP}
                  unit="BHP"
                  color="blue"
                />
                <StatBadge
                  label="Torque"
                  before={origTorque}
                  after={tunedTorque}
                  unit="Nm"
                  color="red"
                />
                <div className="rounded-2xl border border-green-200 bg-green-50 p-5 text-green-700">
                  <p className="text-xs font-semibold uppercase tracking-wide opacity-70">
                    Total Gains
                  </p>
                  <div className="mt-3 space-y-2">
                    <p className="text-2xl font-black">
                      +{tunedHP - origHP}
                      <span className="text-sm font-medium ml-1">BHP</span>
                    </p>
                    <p className="text-xl font-black">
                      +{tunedTorque - origTorque}
                      <span className="text-sm font-medium ml-1">Nm</span>
                    </p>
                  </div>
                  <p className="mt-2 text-xs font-bold">
                    {Math.round(((tunedHP - origHP) / origHP) * 100)}% power increase
                  </p>
                </div>
              </div>
            </div>

            {/* ── Power chart ─────────────────────────────────────────────── */}
            {chartData.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-[#0c1b33] mb-1 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-[#1d70ff]" />
                  Power Curve — Before vs After
                </h3>
                <p className="text-xs text-gray-400 mb-6">BHP vs RPM (×1000)</p>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="rpm"
                      label={{ value: "RPM (×1000)", position: "insideBottom", offset: -2, fontSize: 11 }}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      label={{ value: "BHP", angle: -90, position: "insideLeft", fontSize: 11 }}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      formatter={(value: number, name: string) => [`${value} BHP`, name]}
                      labelFormatter={(l) => `RPM: ${Number(l) * 1000}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="Before (BHP)"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="5 3"
                    />
                    <Line
                      type="monotone"
                      dataKey="After (BHP)"
                      stroke="#1d70ff"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── Torque chart ─────────────────────────────────────────────── */}
            {chartData.length > 0 && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-[#0c1b33] mb-1 flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-[#cc0000]" />
                  Torque Curve — Before vs After
                </h3>
                <p className="text-xs text-gray-400 mb-6">Nm vs RPM (×1000)</p>
                <ResponsiveContainer width="100%" height={320}>
                  <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="rpm"
                      label={{ value: "RPM (×1000)", position: "insideBottom", offset: -2, fontSize: 11 }}
                      tick={{ fontSize: 11 }}
                    />
                    <YAxis
                      label={{ value: "Nm", angle: -90, position: "insideLeft", fontSize: 11 }}
                      tick={{ fontSize: 11 }}
                    />
                    <Tooltip
                      contentStyle={{ fontSize: 12, borderRadius: 8 }}
                      formatter={(value: number, name: string) => [`${value} Nm`, name]}
                      labelFormatter={(l) => `RPM: ${Number(l) * 1000}`}
                    />
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                    <Line
                      type="monotone"
                      dataKey="Before (Nm)"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      dot={false}
                      strokeDasharray="5 3"
                    />
                    <Line
                      type="monotone"
                      dataKey="After (Nm)"
                      stroke="#cc0000"
                      strokeWidth={2.5}
                      dot={false}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* ── Engine Specs ────────────────────────────────────────────── */}
            {(ed.specz || ed.paths?.engine?.name) && (
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-black text-[#0c1b33] mb-5 flex items-center gap-2">
                  <Car className="h-5 w-5 text-[#0c1b33]" />
                  Engine Specifications
                </h3>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    { label: "Engine", value: ed.paths?.engine?.name },
                    { label: "Fuel Type", value: ed.specz?.energy },
                    { label: "Displacement", value: ed.specz?.["Cylinder content"] ? `${ed.specz["Cylinder content"]} cc` : undefined },
                    { label: "ECU", value: ed.specz?.engine_ecu },
                    { label: "Engine Code", value: ed.specz?.engine_code },
                    { label: "Compression", value: ed.specz?.compression_ratio },
                  ]
                    .filter((s) => s.value)
                    .map((spec) => (
                      <div key={spec.label} className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                          {spec.label}
                        </p>
                        <p className="mt-1 text-sm font-bold text-[#0c1b33]">{spec.value}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ── Description ────────────────────────────────────────────────── */}
        {client.description && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-black text-[#0c1b33] mb-4">About This Build</h3>
            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed whitespace-pre-line">
              {client.description}
            </div>
          </div>
        )}

        {/* ── No VRM registered ─────────────────────────────────────────── */}
        {!client.registration && !client.description && (
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-gray-200 p-12 text-center">
            <TrendingUp className="h-10 w-10 text-gray-300" />
            <p className="text-gray-400 text-sm">
              No performance data has been configured for this entry yet.
            </p>
          </div>
        )}

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <div className="rounded-2xl bg-[#0c1b33] p-8 text-center text-white">
          <h3 className="text-xl font-black mb-2">Want results like this?</h3>
          <p className="text-gray-300 text-sm mb-6">
            Get in touch with our team and let us unlock your vehicle&apos;s true potential.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/gains-calculator"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#1d70ff] px-6 py-3 text-sm font-semibold hover:bg-[#1558cc] transition"
            >
              <Zap className="h-4 w-4" />
              Calculate Your Gains
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
