export type HomeAboutContent = {
  eyebrow: string;
  title: string;
  paragraph: string;
  bullets: string[];
};

export const HOME_ABOUT_IMAGE_KEY = "home_about_image";
export const HOME_ABOUT_CONTENT_KEY = "home_about_content";
export const SERVICES_PAGE_HERO_IMAGE_KEY = "services_page_hero_image";
export const GAINS_CALCULATOR_HERO_IMAGE_KEY = "gains_calculator_hero_image";

export const DEFAULT_HOME_ABOUT_IMAGE = "/images/hero/mechanic-working.png";
export const DEFAULT_SERVICES_PAGE_HERO_IMAGE = "/images/services/IMG_4394.png";
export const DEFAULT_GAINS_CALCULATOR_HERO_IMAGE = "/images/hero/gainsHero.png";

export const DEFAULT_HOME_ABOUT_CONTENT: HomeAboutContent = {
  eyebrow: "Customized Performance Solutions",
  title: "We're Chelmsford's Finest Car Tuning & Exhaust Destination",
  paragraph:
    "With over a decade of experience in car tuning and custom exhaust installation, we are industry leaders. Our advanced programming capabilities unlock unique features for your vehicle. From exhilarating pops and bangs to mesmerizing flames, we can customize your exhaust system to deliver stunning effects. Trust us to elevate your car's performance and sound to new heights.",
  bullets: [
    "Precise Workmanship, Exceeding Customer Expectations",
    "100% Committed to Excellence in Every Project",
    "Extensive Selection of Premium Performance Upgrades",
  ],
};

export function parseHomeAboutContent(raw?: string | null): HomeAboutContent {
  if (!raw) return DEFAULT_HOME_ABOUT_CONTENT;
  try {
    const parsed = JSON.parse(raw);
    return {
      eyebrow: typeof parsed?.eyebrow === "string" ? parsed.eyebrow : DEFAULT_HOME_ABOUT_CONTENT.eyebrow,
      title: typeof parsed?.title === "string" ? parsed.title : DEFAULT_HOME_ABOUT_CONTENT.title,
      paragraph:
        typeof parsed?.paragraph === "string" ? parsed.paragraph : DEFAULT_HOME_ABOUT_CONTENT.paragraph,
      bullets: Array.isArray(parsed?.bullets)
        ? parsed.bullets.filter((b: unknown) => typeof b === "string")
        : DEFAULT_HOME_ABOUT_CONTENT.bullets,
    };
  } catch {
    return DEFAULT_HOME_ABOUT_CONTENT;
  }
}
