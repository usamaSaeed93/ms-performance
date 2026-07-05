import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "DPF Cleaning & Diagnostics | DPF Specialist | MS Performance",
  description:
    "Professional DPF cleaning service, DPF diagnostics, and DPF regeneration for diesel vehicles. Fix blocked DPF, limp mode & DPF warning lights. MS Performance — your local DPF specialist.",
  keywords: [
    "DPF Cleaning",
    "DPF Cleaning Service",
    "DPF Specialist",
    "Blocked DPF",
    "DPF Regeneration",
    "DPF Diagnostics",
    "DPF Repair",
    "Diesel Particulate Filter Cleaning",
    "Limp Mode",
    "DPF Warning Light",
    "Improve Fuel Economy",
    "Restore Engine Performance",
    "DPF Replacement",
    "Car DPF Cleaning",
    "Diesel Vehicle DPF Service",
  ],
  openGraph: {
    title: "DPF Cleaning & Diagnostics | DPF Specialist | MS Performance",
    description:
      "Blocked DPF? We restore your diesel vehicle's performance with professional DPF cleaning, diagnostics and regeneration. Avoid costly DPF replacement.",
    type: "website",
  },
};

export default function DpfEgrLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
