"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks } from "@/lib/constants/navigation";
import { FILES_PORTAL_URL } from "@/lib/constants/contact";
import { useGetSettingsQuery } from "@/lib/store/api/settingsApi";
import { ContactModal } from "@/components/ContactModal";
import { FolderOpen } from "lucide-react";

interface NavbarProps {
  ctaText?: string;
  ctaAction?: () => void;
  showTopBar?: boolean;
}

export function Navbar({ showTopBar = true }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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

  const { data: settings } = useGetSettingsQuery();
  const ecommerceEnabled = settings?.find((s) => s.key === "ecommerce_enabled")?.value === "true";

  const visibleNavLinks = navLinks.filter((link) => {
    if (link.label === "Products" && !ecommerceEnabled) return false;
    if (link.label === "Contact Us") return false;
    return true;
  });

  const activeLink = visibleNavLinks.find((link) => link.href === pathname)?.href || "";
  const getActiveLink = () => activeLink;

  const filesPortalButton = (
    <a
      href={FILES_PORTAL_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-1.5 rounded-[12px] border border-white/20 px-3 py-2 text-xs font-semibold text-white transition hover:border-[#1d70ff] hover:bg-[#1d70ff]/10 sm:gap-2 sm:px-4 sm:py-2.5 sm:text-sm"
    >
      <FolderOpen className="h-4 w-4 shrink-0" />
      <span className="hidden sm:inline">Files Portal</span>
      <span className="sm:hidden">Files</span>
    </a>
  );

  const contactButton = (
    <button
      type="button"
      onClick={() => setIsContactOpen(true)}
      className="inline-flex items-center rounded-[12px] border border-[#1d70ff] px-3 py-2 text-xs font-semibold text-[#1d70ff] transition hover:bg-[#1d70ff]/10 sm:px-4 sm:py-2.5 sm:text-sm"
    >
      Contact Us
    </button>
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-black text-white shadow-[0_20px_60px_rgba(1,4,13,0.65)] border-b border-[#1d70ff]">
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
                {ecommerceEnabled && (
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
                )}
              </div>
            </div>
          </div>
        )}

        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 sm:py-2.5 lg:px-8 lg:py-3">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            <Link href="/" className="flex-shrink-0">
              <Image
                src="/images/logos/ms-logo.png"
                alt="MS Performance"
                width={200}
                height={60}
                priority
                className="h-10 w-auto sm:h-12 md:h-14"
              />
            </Link>

            <nav className="hidden flex-1 items-center justify-center gap-3 text-sm font-semibold lg:flex xl:gap-5">
              {visibleNavLinks.map((link) => {
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

            <div className="hidden items-center gap-2 lg:flex xl:gap-3">
              {filesPortalButton}
              {contactButton}
              <Link
                href="/book-appointment"
                className="flex-shrink-0 rounded-[12px] bg-[#1d70ff] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_15px_45px_rgba(29,112,255,0.3)] transition hover:bg-[#1a5fe6] active:scale-95"
              >
                Book Appointment
              </Link>
            </div>

            <button
              onClick={toggleMobileMenu}
              className="flex items-center justify-center p-2 text-white transition hover:text-[#1d70ff] lg:hidden"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div
          className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
            isMobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
          onClick={toggleMobileMenu}
          aria-hidden="true"
        />

        <div
          className={`fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-black p-6 shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full pointer-events-none"
          }`}
        >
          <div className="flex h-full flex-col">
            <div className="mb-8 flex items-center justify-between">
              <Image
                src="/images/logos/ms-logo.png"
                alt="MS Performance"
                width={160}
                height={48}
                className="h-10 w-auto"
              />
              <button
                onClick={toggleMobileMenu}
                className="p-2 text-white transition hover:text-[#1d70ff]"
                aria-label="Close menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            <nav className="flex flex-1 flex-col gap-2 overflow-y-auto">
              {visibleNavLinks.map((link) => {
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

            <div className="mt-auto space-y-3 border-t border-gray-700 pt-6">
              <a
                href={FILES_PORTAL_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={toggleMobileMenu}
                className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-white/20 px-6 py-3.5 text-center text-base font-semibold text-white transition hover:border-[#1d70ff] hover:bg-[#1d70ff]/10"
              >
                <FolderOpen className="h-5 w-5" />
                Files Portal
              </a>
              <button
                type="button"
                onClick={() => {
                  toggleMobileMenu();
                  setIsContactOpen(true);
                }}
                className="block w-full rounded-[12px] border border-[#1d70ff] px-6 py-3.5 text-center text-base font-semibold text-[#1d70ff] transition hover:bg-[#1d70ff]/10"
              >
                Contact Us
              </button>
              <Link
                href="/book-appointment"
                onClick={toggleMobileMenu}
                className="block w-full rounded-[12px] bg-[#1d70ff] px-6 py-3.5 text-center text-base font-semibold text-white shadow-[0_15px_45px_rgba(29,112,255,0.3)] transition hover:bg-[#1a5fe6]"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </header>

      <ContactModal open={isContactOpen} onOpenChange={setIsContactOpen} />
    </>
  );
}
