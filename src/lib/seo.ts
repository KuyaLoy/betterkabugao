/**
 * Per-page metadata, resolved from the route path.
 *
 * The network's dominant pattern injects meta client-side with react-helmet,
 * which means Facebook, Viber, Messenger, Slack and every other non-rendering
 * consumer sees the generic shell for every URL. We resolve meta at prerender
 * time instead, so each page ships real tags in its static HTML.
 */
import { BARANGAYS, findBarangay, populationShare } from "../data/barangays";

export const SITE_NAME = "BetterKabugao.org";
export const SITE_URL = "https://betterkabugao.org";
export const SOCIAL_IMAGE = `${SITE_URL}/brand/betterkabugao-social.png`;

export type PageMeta = {
  title: string;
  description: string;
  canonical: string;
  breadcrumbs: Array<{ label: string; href?: string }>;
};

/** Human labels for path segments — never title-case an id or slug blindly. */
const SEGMENT_LABELS: Record<string, string> = {
  "/government": "Government",
  "/government/barangays": "Barangays",
  "/government/officials": "Elected officials",
  "/emergency": "Emergency hotlines",
  "/transparency": "Transparency",
  "/explore": "Explore Kabugao",
  "/services": "Services",
  "/about": "About",
  "/search": "Search",
  "/sitemap": "Sitemap",
};

const STATIC_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Kabugao, Apayao — public information, barangays and officials",
    description:
      "Public information about the municipality of Kabugao, Apayao: all 21 barangays with population and directions, elected municipal officials, and sourced local data. Independent and volunteer-run.",
  },
  "/government": {
    title: "Government of Kabugao",
    description:
      "How Kabugao is governed: elected municipal officials, the Sangguniang Bayan, and all 21 barangays with population and location.",
  },
  "/government/barangays": {
    title: "All 21 barangays of Kabugao",
    description:
      "Every barangay in Kabugao, Apayao — population from the 2024 POPCEN, PSGC code, coordinates, schools, and directions on the map.",
  },
  "/government/officials": {
    title: "Elected municipal officials of Kabugao",
    description:
      "The mayor, vice mayor and Sangguniang Bayan of Kabugao, Apayao for the 2025–2028 term, sourced from the municipality's own government platform.",
  },
  "/emergency": {
    title: "Emergency hotlines for Kabugao",
    description:
      "Emergency numbers published by the Municipality of Kabugao — MDRRMO, police, fire, the Rural Health Unit, MSWDO and the Apayao Provincial Hospital — with +63 international dialling for family abroad.",
  },
  "/transparency": {
    title: "Public records for Kabugao — in preparation",
    description:
      "Public records for the municipality of Kabugao are in preparation. Nothing is published here until it is verified against an official source. Independent and volunteer-run.",
  },
  "/explore": {
    title: "Explore Kabugao — places, heritage and culture",
    description:
      "Kabugao in the Cordillera highlands: the Apayao river system, barangays, Isnag heritage and responsible tourism.",
  },
  "/services": {
    title: "Services and public information",
    description:
      "Plain-language guides to municipal services in Kabugao — certificates, permits, offices and contacts. In preparation.",
  },
  "/about": {
    title: "About BetterKabugao",
    description:
      "BetterKabugao is an independent, volunteer-run civic project for Kabugao, Apayao. Not the official website of the municipality. Part of the BetterGov.ph network.",
  },
  "/search": {
    title: "Search",
    description: "Search everything published on BetterKabugao.",
  },
  "/sitemap": {
    title: "Sitemap — every page on this site",
    description:
      "Every page published on BetterKabugao, grouped and listed as ordinary links: the 21 barangay pages, the elected officials, the emergency hotlines and the project pages.",
  },
  "/404": {
    title: "Page not found",
    description: "That page does not exist on BetterKabugao.",
  },
};

function breadcrumbsFor(path: string): Array<{ label: string; href?: string }> {
  if (path === "/") return [{ label: "Home" }];

  const segments = path.split("/").filter(Boolean);
  const trail: Array<{ label: string; href?: string }> = [{ label: "Home", href: "/" }];

  segments.forEach((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const isLast = index === segments.length - 1;
    const barangay = findBarangay(segment);
    const label = SEGMENT_LABELS[href] ?? barangay?.name ?? segment;
    trail.push(isLast ? { label } : { label, href });
  });

  return trail;
}

export function metaFor(path: string): PageMeta {
  const normalised = path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
  const canonical = `${SITE_URL}${normalised === "/" ? "/" : normalised}`;

  const barangaySlug = normalised.startsWith("/government/barangays/")
    ? normalised.slice("/government/barangays/".length)
    : undefined;
  const barangay = findBarangay(barangaySlug);

  if (barangay) {
    return {
      title: `Barangay ${barangay.name}, Kabugao`,
      description:
        `Barangay ${barangay.name} in Kabugao, Apayao: ${barangay.population.toLocaleString("en-PH")} residents ` +
        `(${populationShare(barangay)} of the municipality), PSGC ${barangay.psgc}, with map and driving directions.`,
      canonical,
      breadcrumbs: breadcrumbsFor(normalised),
    };
  }

  const base = STATIC_META[normalised] ?? STATIC_META["/404"];
  return { ...base, canonical, breadcrumbs: breadcrumbsFor(normalised) };
}

/** Every path the site prerenders — also the source for sitemap.xml. */
export const ALL_PATHS: readonly string[] = [
  "/",
  "/government",
  "/government/officials",
  "/government/barangays",
  ...BARANGAYS.map((b) => `/government/barangays/${b.slug}`),
  "/emergency",
  "/transparency",
  "/explore",
  "/services",
  "/about",
  "/search",
  "/sitemap",
  "/404",
];

/**
 * The public sitemap page, grouped for a reader rather than a crawler.
 *
 * Built from ALL_PATHS and BARANGAYS so a route cannot be added to the site and
 * forgotten here — `auditSitemap()` reports anything unlinked or linked twice,
 * and a unit test asserts both lists are empty. `/404` is excluded on purpose:
 * a page that exists only for URLs that do not should never be advertised, in
 * this list or in sitemap.xml.
 */
export const SITEMAP_EXCLUDED: readonly string[] = ["/404"];

export type SitemapLink = { path: string; label: string };

export type SitemapGroup = {
  id: string;
  title: string;
  /** The barangay group spans the row and reads in columns; the rest do not. */
  wide?: boolean;
  links: readonly SitemapLink[];
};

/**
 * Labels for the sitemap list, which are not the breadcrumb labels: a crumb
 * reading "Barangays" is unambiguous under Government, but in a flat list next
 * to a group of the same name it is not.
 */
const SITEMAP_LABELS: Record<string, string> = {
  "/": "Home",
  "/government": "Government of Kabugao",
  "/government/officials": "Elected officials",
  "/government/barangays": `All ${BARANGAYS.length} barangays`,
  "/transparency": "Transparency",
  "/emergency": "Emergency hotlines",
  "/explore": "Explore Kabugao",
  "/services": "Services",
  "/about": "About this project",
  "/search": "Search",
  "/sitemap": "Sitemap",
};

const GROUP_ORDER: ReadonlyArray<{
  id: string;
  title: string;
  paths?: readonly string[];
  barangays?: true;
}> = [
  { id: "core", title: "Core", paths: ["/", "/search"] },
  {
    id: "government",
    title: "Government",
    // /transparency sits here because the /government hub is the page that
    // links to it, alongside officials and barangays.
    paths: ["/government", "/government/officials", "/government/barangays", "/transparency"],
  },
  { id: "barangays", title: "Barangays", barangays: true },
  { id: "safety", title: "Safety", paths: ["/emergency"] },
  { id: "explore", title: "Explore and services", paths: ["/explore", "/services"] },
  { id: "project", title: "Project and meta", paths: ["/about", "/sitemap"] },
];

export const SITEMAP_GROUPS: readonly SitemapGroup[] = GROUP_ORDER.map((group) =>
  group.barangays
    ? {
        id: group.id,
        title: group.title,
        wide: true,
        links: BARANGAYS.map((b) => ({
          path: `/government/barangays/${b.slug}`,
          label: b.name,
        })),
      }
    : {
        id: group.id,
        title: group.title,
        links: (group.paths ?? []).map((path) => ({
          path,
          label: SITEMAP_LABELS[path] ?? path,
        })),
      },
);

/** Every path the sitemap page links, in page order. */
export const SITEMAP_PATHS: readonly string[] = SITEMAP_GROUPS.flatMap((group) =>
  group.links.map((link) => link.path),
);

/**
 * Where to send someone who is lost — the 404 page and the search page's empty
 * state both use this list, so the two screens can never drift apart. Every
 * entry must be a path the site actually prerenders; a unit test checks that.
 */
export const RECOVERY_LINKS: ReadonlyArray<{ to: string; label: string }> = [
  { to: "/", label: "Home" },
  { to: "/search", label: "Search" },
  { to: "/government/barangays", label: `All ${BARANGAYS.length} barangays` },
  { to: "/emergency", label: "Emergency hotlines" },
  { to: "/government/officials", label: "Elected officials" },
  { to: "/sitemap", label: "Sitemap" },
];

export function auditSitemap(): { missing: string[]; duplicates: string[] } {
  const counts = new Map<string, number>();
  for (const path of SITEMAP_PATHS) counts.set(path, (counts.get(path) ?? 0) + 1);

  return {
    missing: ALL_PATHS.filter((path) => !SITEMAP_EXCLUDED.includes(path) && !counts.has(path)),
    duplicates: [...counts].filter(([, times]) => times > 1).map(([path]) => path),
  };
}
