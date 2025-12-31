"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Hide footer and WhatsApp button on admin pages and root page (which redirects to /home)
    const isAdminPage = pathname?.startsWith("/admin");
    const isRootRedirect = pathname === "/";

    return (
        <>
            {children}
            {!isAdminPage && !isRootRedirect && <Footer />}
            {!isAdminPage && !isRootRedirect && <WhatsAppButton />}
        </>
    );
}
