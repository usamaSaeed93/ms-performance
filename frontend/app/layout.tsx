import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/lib/contexts/theme-context";
import { Toaster } from "@/components/ui/sonner";
import StoreProvider from "@/lib/store/StoreProvider";
import { LayoutWrapper } from "@/components/LayoutWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  title: "MS Performance | ECU Blueprinting & Dyno Lab",
  description:
    "Motorsport-grade ECU blueprinting, dyno tuning, and telemetry support for modern performance platforms.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light">
      <head></head>
      <body
        className={`${montserrat.variable} ${geistSans.variable} ${geistMono.variable} antialiased font-[family-name:var(--font-montserrat)] bg-gray-100`}
      >
        <StoreProvider>
          <ThemeProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
