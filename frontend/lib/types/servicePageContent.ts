export type ServiceFaqItem = {
  question: string;
  answer: string;
};

export type ServiceStat = {
  value: string;
  label: string;
};

export type ServiceFeature = {
  title: string;
  desc: string;
};

export type ServicePageContent = {
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    badges: string[];
  };
  intro: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
    bullets: string[];
  };
  gallery: {
    eyebrow: string;
    title: string;
    subtitle: string;
    labels: string[];
  };
  why: {
    eyebrow: string;
    title: string;
    paragraph: string;
    stats: ServiceStat[];
  };
  benefits: {
    eyebrow: string;
    title: string;
    paragraph: string;
    bullets: string[];
    features: ServiceFeature[];
    includedTitle: string;
    included: string[];
    includedNote?: string;
  };
  faq: {
    eyebrow: string;
    title: string;
    items: ServiceFaqItem[];
  };
};

export type ServicePageContentPartial = {
  hero?: Partial<ServicePageContent["hero"]>;
  intro?: Partial<ServicePageContent["intro"]>;
  gallery?: Partial<ServicePageContent["gallery"]>;
  why?: Partial<ServicePageContent["why"]>;
  benefits?: Partial<ServicePageContent["benefits"]>;
  faq?: Partial<ServicePageContent["faq"]>;
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function mergeSection<T extends Record<string, unknown>>(defaults: T, override?: Partial<T> | null): T {
  if (!override || !isPlainObject(override)) return defaults;

  const result = { ...defaults };
  for (const key of Object.keys(defaults) as (keyof T)[]) {
    const next = override[key];
    if (next === undefined || next === null) continue;
    if (typeof next === "string") {
      // Allow empty string to clear optional labels; keep default for required empty overrides only if needed
      result[key] = next as T[keyof T];
      continue;
    }
    if (Array.isArray(next)) {
      result[key] = next as T[keyof T];
      continue;
    }
    if (isPlainObject(next) && isPlainObject(defaults[key])) {
      result[key] = mergeSection(
        defaults[key] as Record<string, unknown>,
        next as Record<string, unknown>
      ) as T[keyof T];
    }
  }
  return result;
}

/** Merge saved page_content over frontend defaults. Missing fields keep defaults. */
export function mergeServicePageContent(
  defaults: ServicePageContent,
  override?: ServicePageContentPartial | null
): ServicePageContent {
  if (!override) return defaults;
  return {
    hero: mergeSection(defaults.hero, override.hero),
    intro: mergeSection(defaults.intro, override.intro),
    gallery: mergeSection(defaults.gallery, override.gallery),
    why: mergeSection(defaults.why, override.why),
    benefits: mergeSection(defaults.benefits, override.benefits),
    faq: mergeSection(defaults.faq, override.faq),
  };
}
