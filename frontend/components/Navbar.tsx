"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants/navigation";

interface NavbarProps {
  ctaText?: string;
  ctaAction?: () => void;
  showTopBar?: boolean;
}

export function Navbar({ ctaText = "Call us Now", ctaAction, showTopBar = true }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const getActiveLink = () => {
    return navLinks.find((link) => link.href === pathname)?.href || "";
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-black text-white shadow-[0_20px_60px_rgba(1,4,13,0.65)] border-b border-[#1d70ff]">
      {/* Top Bar - Location, Email, Cart */}
      {showTopBar && (
        <div className="border-b border-gray-700 bg-black">
          <div className="mx-auto max-w-7xl px-4 py-1.5 sm:px-6 sm:py-2 lg:px-8">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
                <div className="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="flex-shrink-0 text-[#1d70ff]"
                  >
                    <path
                      d="M12 2C7.03 2 3 5.58 3 10.01c0 5.39 6.39 11.42 8.76 13.37.13.12.31.19.49.19s.36-.07.49-.19c2.37-1.95 8.76-7.98 8.76-13.37C21 5.58 16.97 2 12 2Zm0 18.21C9.18 18.05 5 13.38 5 10.01 5 6.69 8.13 4 12 4s7 2.69 7 6.01c0 3.37-4.18 8.04-7 10.2Z"
                      fill="currentColor"
                    />
                    <circle cx="12" cy="10" r="3" fill="currentColor" />
                  </svg>
                  <span className="text-[10px] sm:text-xs text-white/70">
                    Unit 16, Bakers Ln, Chelmsford CM2 8LD
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="flex-shrink-0 text-[#1d70ff]"
                  >
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Zm0 2v.51l8 5.33 8-5.33V6H4Zm0 12h16V9.49l-8 5.33-8-5.33V18Z"
                      fill="currentColor"
                    />
                  </svg>
                  <span className="text-[10px] sm:text-xs text-white/70">
                    info@msperformance.co.uk
                  </span>
                </div>
              </div>
              <Link
                href="/cart"
                className="flex items-center gap-2 text-white transition hover:text-[#1d70ff]"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
                  <path
                    d="M7 6h-2l-1 2v1h2l3.6 7.59c.18.34.52.56.9.56H19v-2h-7.42l-.1-.2L12.55 13H17c.38 0 .72-.21.89-.55L21 6H7Z"
                    fill="currentColor"
                  />
                  <circle cx="9" cy="21" r="1" fill="currentColor" />
                  <circle cx="17" cy="21" r="1" fill="currentColor" />
                </svg>
                <span className="text-[10px] sm:text-xs font-medium">Shop</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logos/ms-logo.png"
              alt="MS Performance"
              width={160}
              height={48}
              priority
              className="h-7 w-auto sm:h-9 md:h-10"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden flex-1 items-center justify-center gap-4 text-sm font-semibold lg:flex lg:gap-6">
            {navLinks.map((link) => {
              const isActive = link.href === getActiveLink();
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`relative pb-1 transition hover:text-[#1d70ff] ${
                    isActive ? "text-[#1d70ff]" : "text-white/80"
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute -bottom-2 left-0 right-0 mx-auto h-[2px] w-6 rounded-full bg-gradient-to-r from-transparent via-[#1d70ff] to-transparent" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Desktop CTA Button */}
          <div className="hidden items-center gap-4 lg:flex">
            <button
              onClick={ctaAction}
              className="flex-shrink-0 rounded-[12px] bg-[#1d70ff] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(29,112,255,0.3)] transition hover:bg-[#1a5fe6] active:scale-95"
            >
              {ctaText}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="flex items-center justify-center p-2 text-white transition hover:text-[#1d70ff] lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <>
        {/* Backdrop */}
        <div
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
            isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />

        {/* Mobile Menu */}
        <div className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-black p-6 shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
        }`}>
            <div className="flex h-full flex-col">
              {/* Mobile Menu Header */}
              <div className="mb-8 flex items-center justify-between">
                <Image
                  src="/images/logos/ms-logo.png"
                  alt="MS Performance"
                  width={120}
                  height={36}
                  className="h-8 w-auto"
                />
                <button
                  onClick={toggleMobileMenu}
                  className="p-2 text-white transition hover:text-[#1d70ff]"
                  aria-label="Close menu"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Mobile Navigation Links */}
              <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
                {navLinks.map((link) => {
                  const isActive = link.href === getActiveLink();
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={toggleMobileMenu}
                      className={`rounded-lg px-4 py-3.5 text-base font-semibold transition-all duration-200 ${
                        isActive
                          ? "bg-[#1d70ff]/20 text-[#1d70ff]"
                          : "text-white active:bg-white/10 hover:bg-white/5 hover:text-[#1d70ff]"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* Mobile CTA Button */}
              <div className="mt-auto border-t border-gray-700 pt-6">
                <button
                  onClick={() => {
                    if (ctaAction) {
                      ctaAction();
                    }
                    toggleMobileMenu();
                  }}
                  className="w-full rounded-[12px] bg-[#1d70ff] px-6 py-3.5 text-base font-semibold text-white shadow-[0_15px_45px_rgba(29,112,255,0.3)] transition-all duration-200 hover:bg-[#1a5fe6] active:scale-[0.98]"
                >
                  {ctaText}
                </button>
              </div>
            </div>
          </div>
      </>
    </header>
  );
}

