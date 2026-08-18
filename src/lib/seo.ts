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
};

const STATIC_META: Record<string, { title: string; description: string }> = {
  "/": {
    title: "Kabugao, Apayao — public information, barangays and officials",
    description:
      "Public information about Kabugao, the capital of Apayao: all 21 barangays with population and directions, elected municipal officials, and sourced local data. Independent and volunteer-run.",
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
    title: "Transparency — public money and public projects",
    description:
      "What BetterKabugao is building on public spending and public projects in Kabugao: budgets, procurement, contractors and flood-control works, every figure sourced.",
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
  "/404",
];
