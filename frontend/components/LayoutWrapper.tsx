"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Hide footer and WhatsApp button on admin pages
    const isAdminPage = pathname?.startsWith("/admin");

    return (
        <>
            {children}
            {!isAdminPage && <Footer />}
            {!isAdminPage && <WhatsAppButton />}
        </>
    );
}
