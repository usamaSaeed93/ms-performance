import { useMemo } from "react";
import { useGetServicesQuery } from "@/lib/store/api/servicesApi";
import {
  SERVICE_PAGE_CONTENT_DEFAULTS,
  SERVICE_SLUG_TO_TITLE,
} from "@/lib/constants/servicePageContentDefaults";
import {
  mergeServicePageContent,
  type ServicePageContent,
} from "@/lib/types/servicePageContent";

/**
 * Returns merged detail-page copy for a service slug.
 * Uses API page_content when present; falls back to hardcoded defaults.
 */
export function useServicePageContent(slug: string): {
  content: ServicePageContent;
  serviceId: number | null;
  isLoading: boolean;
} {
  const { data: services, isLoading } = useGetServicesQuery();

  return useMemo(() => {
    const defaults =
      SERVICE_PAGE_CONTENT_DEFAULTS[slug] ?? SERVICE_PAGE_CONTENT_DEFAULTS["ecu-remapping"];
    const title = SERVICE_SLUG_TO_TITLE[slug];
    const service =
      services?.find((s) => s.link?.includes(`/services/${slug}`)) ||
      services?.find((s) => s.title === title);

    return {
      content: mergeServicePageContent(defaults, service?.page_content ?? null),
      serviceId: service?.id ?? null,
      isLoading,
    };
  }, [slug, services, isLoading]);
}
