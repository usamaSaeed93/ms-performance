import { useMemo } from "react";
import { useGetSettingsQuery } from "@/lib/store/api/settingsApi";

export type ServiceImageType = "hero" | "content1" | "content2";

// Maps service page slugs to their settings keys and fallback images
const SERVICE_PAGE_CONFIG: Record<string, {
    label: string;
    hero: { settingsKey: string; fallbackImage: string };
    content1: { settingsKey: string; fallbackImage: string };
    content2: { settingsKey: string; fallbackImage: string };
}> = {
    "ecu-remapping": {
        label: "ECU Remapping",
        hero: { settingsKey: "service_page_hero_ecu_remapping", fallbackImage: "/images/services/IMG_4394.png" },
        content1: { settingsKey: "service_page_content1_ecu_remapping", fallbackImage: "/images/services/IMG_4395.png" },
        content2: { settingsKey: "service_page_content2_ecu_remapping", fallbackImage: "/images/services/IMG_4396.png" },
    },
    "dyno-tests": {
        label: "Dyno Tests",
        hero: { settingsKey: "service_page_hero_dyno_tests", fallbackImage: "/images/services/IMG_4481.png" },
        content1: { settingsKey: "service_page_content1_dyno_tests", fallbackImage: "/images/services/IMG_4399.png" },
        content2: { settingsKey: "service_page_content2_dyno_tests", fallbackImage: "/images/services/IMG_4400.png" },
    },
    "custom-exhausts": {
        label: "Custom Exhausts",
        hero: { settingsKey: "service_page_hero_custom_exhausts", fallbackImage: "/images/services/IMG_4401.png" },
        content1: { settingsKey: "service_page_content1_custom_exhausts", fallbackImage: "/images/services/IMG_4402.png" },
        content2: { settingsKey: "service_page_content2_custom_exhausts", fallbackImage: "/images/services/IMG_4403.png" },
    },
    "dpf-egr-services": {
        label: "DPF & EGR Services",
        hero: { settingsKey: "service_page_hero_dpf_egr", fallbackImage: "/images/services/IMG_4399.png" },
        content1: { settingsKey: "service_page_content1_dpf_egr", fallbackImage: "/images/services/IMG_4398.png" },
        content2: { settingsKey: "service_page_content2_dpf_egr", fallbackImage: "/images/services/IMG_4400.png" },
    },
    "servicing": {
        label: "Servicing",
        hero: { settingsKey: "service_page_hero_servicing", fallbackImage: "/images/services/IMG_4403.png" },
        content1: { settingsKey: "service_page_content1_servicing", fallbackImage: "/images/services/IMG_4395.png" },
        content2: { settingsKey: "service_page_content2_servicing", fallbackImage: "/images/services/IMG_4402.png" },
    },
    "performance-tuning": {
        label: "Performance Tuning",
        hero: { settingsKey: "service_page_hero_performance_tuning", fallbackImage: "/images/services/IMG_4396.png" },
        content1: { settingsKey: "service_page_content1_performance_tuning", fallbackImage: "/images/services/IMG_4394.png" },
        content2: { settingsKey: "service_page_content2_performance_tuning", fallbackImage: "/images/services/IMG_4400.png" },
    },
    "ecu-diagnostics": {
        label: "ECU Diagnostics",
        hero: { settingsKey: "service_page_hero_ecu_diagnostics", fallbackImage: "/images/services/IMG_4398.png" },
        content1: { settingsKey: "service_page_content1_ecu_diagnostics", fallbackImage: "/images/services/IMG_4396.png" },
        content2: { settingsKey: "service_page_content2_ecu_diagnostics", fallbackImage: "/images/services/IMG_4394.png" },
    },
    "stage-upgrades": {
        label: "Stage Upgrades",
        hero: { settingsKey: "service_page_hero_stage_upgrades", fallbackImage: "/images/services/IMG_4400.png" },
        content1: { settingsKey: "service_page_content1_stage_upgrades", fallbackImage: "/images/services/IMG_4401.png" },
        content2: { settingsKey: "service_page_content2_stage_upgrades", fallbackImage: "/images/services/IMG_4402.png" },
    },
};

export const SERVICE_PAGES = SERVICE_PAGE_CONFIG;

/**
 * Hook to get all 3 dynamic images for a service detail page.
 * Returns null for image URLs while the settings query is in-flight so pages
 * can avoid flashing the static fallback before the real uploaded image arrives.
 * @param slug - The service page slug (e.g., "ecu-remapping")
 * @returns Object with heroImage, content1Image, content2Image URLs (null when loading) and isLoading flag
 */
export function useServicePageImages(slug: string) {
    const { data: settings, isLoading: isSettingsLoading } = useGetSettingsQuery();
    const config = SERVICE_PAGE_CONFIG[slug];

    return useMemo(() => {
        if (!config) {
            return {
                heroImage: isSettingsLoading ? null : "/images/services/IMG_4394.png",
                content1Image: isSettingsLoading ? null : "/images/services/IMG_4395.png",
                content2Image: isSettingsLoading ? null : "/images/services/IMG_4396.png",
                isLoading: isSettingsLoading,
            };
        }

        const getImage = (type: ServiceImageType): string | null => {
            if (isSettingsLoading) return null;
            const imgConfig = config[type];
            const setting = settings?.find(s => s.key === imgConfig.settingsKey);
            return setting?.value || imgConfig.fallbackImage;
        };

        return {
            heroImage: getImage("hero"),
            content1Image: getImage("content1"),
            content2Image: getImage("content2"),
            isLoading: isSettingsLoading,
        };
    }, [settings, config, isSettingsLoading]);
}

// Backward compatible single-image hook
export function useServicePageImage(slug: string): string | null {
    const { heroImage } = useServicePageImages(slug);
    return heroImage;
}
