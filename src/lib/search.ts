/**
 * Site search index, derived from the same data the pages render.
 *
 * Built at module scope rather than fetched, because the whole corpus is a few
 * dozen short entries — smaller than the HTTP request that would fetch it.
 */
import { BARANGAYS, populationShare } from "../data/barangays";
import { EXECUTIVE, SANGGUNIAN } from "../data/officials";

export type SearchEntry = {
  path: string;
  kind: "Barangay" | "Official" | "Page";
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
  { path: "/transparency", kind: "Page", title: "Transparency", summary: "Public money and public projects — in preparation.", keywords: ["budget", "procurement", "flood control", "contractor", "spending"] },
  { path: "/explore", kind: "Page", title: "Explore Kabugao", summary: "Places, rivers, heritage and Isnag culture.", keywords: ["tourism", "isnag", "isneg", "river", "falls", "heritage"] },
  { path: "/services", kind: "Page", title: "Services", summary: "Certificates, permits, offices and contacts — in preparation.", keywords: ["permit", "certificate", "clearance", "office", "tax"] },
  { path: "/about", kind: "Page", title: "About", summary: "Who runs BetterKabugao, and how it is funded.", keywords: ["volunteer", "independent", "bettergov", "cost", "contact"] },
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

export const SEARCH_INDEX: readonly SearchEntry[] = [...PAGES, ...BARANGAY_ENTRIES, ...OFFICIAL_ENTRIES];

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
