"use client";

import { useGetSettingsQuery } from "@/lib/store/api/settingsApi";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/**
 * Hook to check if e-commerce functionality is enabled.
 * Returns { isEnabled, isLoading }
 */
export function useEcommerceEnabled() {
    const { data: settings, isLoading } = useGetSettingsQuery();

    const isEnabled = settings?.find(s => s.key === "ecommerce_enabled")?.value === "true";

    return { isEnabled, isLoading };
}

/**
 * Hook that redirects to the dashboard/home if e-commerce is disabled.
 * Use this in e-commerce pages (cart, products, checkout, etc.)
 * @param redirectTo - The path to redirect to when e-commerce is disabled (default: "/home")
 */
export function useEcommerceGuard(redirectTo: string = "/home") {
    const router = useRouter();
    const { isEnabled, isLoading } = useEcommerceEnabled();

    useEffect(() => {
        // Only redirect after loading is complete and if disabled
        if (!isLoading && !isEnabled) {
            toast.error("E-commerce is currently unavailable");
            router.push(redirectTo);
        }
    }, [isEnabled, isLoading, router, redirectTo]);

    return { isEnabled, isLoading };
}
