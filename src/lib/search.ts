/**
 * Site search index, derived from the same data the pages render.
 *
 * Built at module scope rather than fetched, because the whole corpus is a few
 * dozen short entries — smaller than the HTTP request that would fetch it.
 */
import { BARANGAYS, populationShare } from "../data/barangays";
import { HOTLINES, formatInternational } from "../data/hotlines";
import { EXECUTIVE, SANGGUNIAN } from "../data/officials";

/**
 * Result kinds, in the order the search page groups them: a concrete record
 * answers a question, an index page only points at one.
 */
export const SEARCH_KINDS = ["Barangay", "Official", "Hotline", "Page"] as const;

export type SearchKind = (typeof SEARCH_KINDS)[number];

/** Plural headings for the grouped results. */
export const SEARCH_KIND_LABELS: Record<SearchKind, string> = {
  Barangay: "Barangays",
  Official: "Elected officials",
  Hotline: "Emergency hotlines",
  Page: "Pages",
};

export type SearchEntry = {
  path: string;
  kind: SearchKind;
  title: string;
  summary: string;
  /** Extra terms that should match but need not be displayed. */
  keywords: string[];
};

const PAGES: SearchEntry[] = [
  { path: "/", kind: "Page", title: "Home", summary: "Public information about Kabugao, Apayao.", keywords: ["kabugao", "apayao", "home"] },
  { path: "/government", kind: "Page", title: "Government", summary: "Officials, the Sangguniang Bayan and the 21 barangays.", keywords: ["lgu", "municipal"] },
  { path: "/government/barangays", kind: "Page", title: "All 21 barangays", summary: "Population, PSGC codes, coordinates and directions.", keywords: ["barangay", "list", "population", "psgc"] },
  { path: "/government/officials", kind: "Page", title: "Elected officials", summary: "Mayor, vice mayor and Sangguniang Bayan, 2025–2028.", keywords: ["mayor", "vice mayor", "sangguniang bayan", "councilor", "kagawad"] },
  { path: "/emergency", kind: "Page", title: "Emergency hotlines", summary: "Every published Kabugao emergency number, with +63 dialling from abroad.", keywords: ["emergency", "hotline", "911", "rescue", "police", "fire", "ambulance", "mdrrmo", "bfp", "rhu", "hospital", "tulong", "sunog", "pulis"] },
  { path: "/transparency", kind: "Page", title: "Transparency", summary: "Public records for Kabugao — in preparation.", keywords: ["transparency", "records", "public information", "sources", "in preparation"] },
  { path: "/explore", kind: "Page", title: "Explore Kabugao", summary: "Places, rivers, heritage and Isnag culture.", keywords: ["tourism", "isnag", "isneg", "river", "falls", "heritage"] },
  { path: "/services", kind: "Page", title: "Services", summary: "Certificates, permits, offices and contacts — in preparation.", keywords: ["permit", "certificate", "clearance", "office", "tax"] },
  { path: "/about", kind: "Page", title: "About", summary: "Who runs BetterKabugao, and how it is funded.", keywords: ["volunteer", "independent", "bettergov", "cost", "contact"] },
  { path: "/sitemap", kind: "Page", title: "Sitemap", summary: "Every page on the site, grouped, as ordinary links.", keywords: ["sitemap", "site map", "index", "all pages", "directory"] },
];

const BARANGAY_ENTRIES: SearchEntry[] = BARANGAYS.map((b) => ({
  path: `/government/barangays/${b.slug}`,
  kind: "Barangay",
  title: `Barangay ${b.name}`,
  summary: `${b.population.toLocaleString("en-PH")} residents · ${populationShare(b)} of Kabugao · PSGC ${b.psgc}`,
  keywords: [b.name, b.slug, b.psgc, b.place, ...(b.oldName ? [b.oldName] : []), ...b.schools],
}));

const OFFICIAL_ENTRIES: SearchEntry[] = [...EXECUTIVE, ...SANGGUNIAN].map((o) => ({
  path: "/government/officials",
  kind: "Official",
  title: o.name,
  summary: o.position,
  keywords: [o.position, "official", "elected"],
}));

/**
 * One entry per hotline office, so a search for "police" or "sunog" surfaces the
 * number itself rather than only the page that lists it.
 */
const HOTLINE_ENTRIES: SearchEntry[] = HOTLINES.map((h) => ({
  path: "/emergency",
  kind: "Hotline",
  title: `${h.abbreviation} — ${h.name}`,
  summary: `${h.purpose} ${h.numbers.map(formatInternational).join(", ")}`,
  keywords: [h.abbreviation, "emergency", "hotline", "number", ...h.numbers],
}));

export const SEARCH_INDEX: readonly SearchEntry[] = [
  ...PAGES,
  ...BARANGAY_ENTRIES,
  ...OFFICIAL_ENTRIES,
  ...HOTLINE_ENTRIES,
];

/**
 * Scores an entry against a query. Every whitespace-separated term must match
 * somewhere (AND semantics), and matches score higher the closer they are to
 * the start of the title.
 */
export function scoreEntry(entry: SearchEntry, query: string): number {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) return 0;

  const title = entry.title.toLowerCase();
  const summary = entry.summary.toLowerCase();
  const keywords = entry.keywords.join(" ").toLowerCase();
  const haystack = `${title} ${summary} ${keywords}`;

  let score = 0;
  for (const term of terms) {
    if (!haystack.includes(term)) return 0;
    if (title === term) score += 120;
    else if (title.startsWith(term)) score += 80;
    else if (title.includes(term)) score += 50;
    if (keywords.includes(term)) score += 25;
    if (summary.includes(term)) score += 10;
  }
  // Prefer concrete records over index pages when scores tie.
  if (entry.kind !== "Page") score += 5;
  return score;
}

/**
 * Suggested queries for the search page before anything is typed.
 *
 * Every one of these must return at least one result — a suggestion that leads
 * nowhere is worse than no suggestion — so a unit test runs each through
 * `scoreEntry`. They are drawn from terms already in the index: a barangay, a
 * position, a hotline office, a PSGC lookup, and a cultural term.
 */
export const QUICK_SEARCHES: readonly string[] = [
  "Poblacion",
  "mayor",
  "MDRRMO",
  "Sangguniang Bayan",
  "PSGC",
  "Isnag",
];

/** Scored, sorted matches for a query. Fewer than two characters matches nothing. */
export function searchSite(query: string, limit = 40): SearchEntry[] {
  const trimmed = query.trim();
  if (trimmed.length < 2) return [];

  return SEARCH_INDEX.map((entry) => ({ entry, score: scoreEntry(entry, trimmed) }))
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((row) => row.entry);
}
