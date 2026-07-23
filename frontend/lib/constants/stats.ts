export type StatItem = { value: string; label: string };

// Settings key used to persist the homepage statistics.
export const HOME_STATS_KEY = "home_stats";

export const DEFAULT_STATS: StatItem[] = [
  { value: "12+", label: "Years Of Experience In Maintaining Or Servicing Of Cars" },
  { value: "945+", label: "Cars Remapped By The MS Performance" },
  { value: "1023+", label: "Exhausts Installed In Cars By The MS Performance" },
  { value: "99%", label: "Success Rate Of Providing Car Repairing Services" },
];

// Backwards-compatible alias — existing imports of `stats` keep working.
export const stats = DEFAULT_STATS;

/**
 * Parse the `home_stats` setting value (a JSON array of { value, label }).
 * Falls back to DEFAULT_STATS when the value is missing or malformed.
 */
export function parseStats(raw?: string | null): StatItem[] {
  if (!raw) return DEFAULT_STATS;
  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const cleaned = parsed
        .filter(
          (s) =>
            s &&
            typeof s.value === "string" &&
            typeof s.label === "string" &&
            (s.value.trim().length > 0 || s.label.trim().length > 0)
        )
        .map((s) => ({ value: s.value, label: s.label }));
      return cleaned.length > 0 ? cleaned : DEFAULT_STATS;
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_STATS;
}
