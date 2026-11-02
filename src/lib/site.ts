/**
 * Small derived values the UI needs. Pure functions over data.ts: no React,
 * so they work in server components, client components and route handlers.
 */
import { experience, navigation, type Experience } from '@/lib/data';

/**
 * The absolute origin of the deployed site. Used as `metadataBase`, so that
 * relative URLs in metadata (Open Graph images, canonical links) become
 * absolute, and by the sitemap and robots.txt.
 */
export const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
);

/** Experience newest first: ongoing roles on top, then by start date. */
export function sortedExperience(entries: Experience[] = experience): Experience[] {
  return [...entries].sort((a, b) => {
    if (!a.end !== !b.end) return a.end ? 1 : -1;
    return b.start.localeCompare(a.start);
  });
}

/** The most recent ongoing role, used by the hero status line. */
export function currentRole(): Experience | undefined {
  return sortedExperience().find((e) => !e.end);
}

/** Roman numerals for journal entries (1 -> "I", 4 -> "IV"). */
export function roman(n: number): string {
  const table: [number, string][] = [
    [10, 'X'],
    [9, 'IX'],
    [5, 'V'],
    [4, 'IV'],
    [1, 'I'],
  ];
  let out = '';
  for (const [value, numeral] of table) {
    while (n >= value) {
      out += numeral;
      n -= value;
    }
  }
  return out;
}

/** "01" and "I" from a section's position in `navigation`. */
export function sectionMeta(id: string): { index: string; numeral: string; label: string } {
  const position = navigation.findIndex((n) => n.href === `#${id}`);
  const label = position >= 0 ? navigation[position].label : id;
  return {
    index: String(position + 1).padStart(2, '0'),
    numeral: roman(position + 1),
    label,
  };
}

/** Turn an in-page anchor into a link that also works from other pages. */
export const homeHref = (hash: string) => `/${hash}`;

/** "Dec 2024 – Present" -> ["Dec 2024", "Present"] for two-line date columns. */
export function splitPeriod(period: string): [string, string?] {
  const [start, end] = period.split(/\s+[–—-]\s+/);
  return [start, end];
}
