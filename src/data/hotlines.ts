/**
 * Kabugao emergency hotlines.
 *
 * SOURCE — read before changing anything here.
 *
 * These numbers were published by the Municipality of Kabugao on its official
 * "Discover Kabugao" Facebook page on 15 April 2026, in a post captioned "Here
 * are the updated Emergency Hotlines of the Municipality of Kabugao." The
 * poster carries the municipal seal and the LGU's own addresses
 * (lgukabugao@gmail.com, lgukabugao@yahoo.com).
 *
 * They were transcribed from that poster and checked digit by digit against it
 * twice. Every number is a valid 11-digit Philippine mobile number with a real
 * network prefix. No individual number could be corroborated by a second
 * independent source — the municipality's eLGU platform publishes officials but
 * not hotlines — so the site shows the source and its date beside the list, and
 * keeps 911 as the always-valid fallback.
 *
 * The office abbreviations are expanded from verified facts, not guessed:
 * "RMFB 15" is the PNP Regional Mobile Force Battalion 15, whose 1505th
 * Maneuver Company operates in Kabugao; "APH" is the Apayao Provincial
 * Hospital, which is located in Kabugao. MDRRMO, RHU, MSWDO, BFP and the ICT
 * Office are the standard Philippine LGU office names.
 *
 * IF YOU CHANGE A NUMBER: cite the newer source and its date here, and update
 * HOTLINE_SOURCE below. Never add a number without one.
 */

export type Hotline = {
  /** Stable id, used for React keys and tests. */
  id: string;
  /** How the municipality labels it on the poster. */
  abbreviation: string;
  /** Expanded office name. */
  name: string;
  /** What this office is for, in plain language. */
  purpose: string;
  /** As published: 11-digit local mobile numbers, digits only. */
  numbers: readonly string[];
};

/** Nationwide emergency number. Always valid, never sourced from an LGU post. */
export const NATIONAL_EMERGENCY = "911";

export const HOTLINE_SOURCE = {
  label: "Municipality of Kabugao — Discover Kabugao (official Facebook page)",
  url: "https://www.facebook.com/discoverkabugao/posts/pfbid0uYTQokaZUS83ktzFzEXxNkHY3X3gs1cRE2N9ap8NQk133N4fDFwNwV9oahmpczSBl",
  published: "15 April 2026",
} as const;

export const HOTLINES: readonly Hotline[] = [
  {
    id: "mdrrmo",
    abbreviation: "MDRRMO",
    name: "Municipal Disaster Risk Reduction and Management Office",
    purpose: "Rescue, flooding, landslides, typhoons and evacuation.",
    numbers: ["09275919022"],
  },
  {
    id: "kmps",
    abbreviation: "KMPS",
    name: "Kabugao Municipal Police Station",
    purpose: "Crime, peace and order, road incidents.",
    numbers: ["09670387227"],
  },
  {
    id: "bfp",
    abbreviation: "BFP",
    name: "Bureau of Fire Protection — Kabugao",
    purpose: "Fire and fire-related rescue.",
    numbers: ["09156076569"],
  },
  {
    id: "aph",
    abbreviation: "APH",
    name: "Apayao Provincial Hospital",
    purpose: "The provincial hospital, located in Kabugao.",
    numbers: ["09977706611"],
  },
  {
    id: "rhu",
    abbreviation: "RHU",
    name: "Rural Health Unit",
    purpose: "Municipal health services and medical assistance.",
    numbers: ["09050417278"],
  },
  {
    id: "mswdo",
    abbreviation: "MSWDO",
    name: "Municipal Social Welfare and Development Office",
    purpose: "Social welfare assistance, and support for families in crisis.",
    numbers: ["09756556026"],
  },
  {
    id: "rmfb-15",
    abbreviation: "RMFB 15",
    name: "PNP Regional Mobile Force Battalion 15",
    purpose: "Police mobile force supporting Kabugao operations.",
    numbers: ["09293593704", "09052060446"],
  },
  {
    id: "ict",
    abbreviation: "ICT Office",
    name: "Information and Communications Technology Office",
    purpose: "Municipal communications and public information.",
    numbers: ["09159425676"],
  },
];

/**
 * `tel:` target in international form.
 *
 * Always +63, never the local 0-prefix: a +63 link works for someone dialling
 * inside the Philippines AND for a relative calling from abroad, which a
 * leading 0 does not. This is the shape BetterCabanatuan uses too.
 */
export function telHref(number: string): string {
  const digits = number.replace(/\D/g, "");
  if (digits.startsWith("0")) return `tel:+63${digits.slice(1)}`;
  if (digits.startsWith("63")) return `tel:+${digits}`;
  if (digits.startsWith("+")) return `tel:${digits}`;
  return `tel:${digits}`;
}

/**
 * 09275919022 → "+63 927 591 9022".
 *
 * The only display format on the site. Printing the local `0927 591 9022` beside
 * it repeated the same digits twice on one button, which is noise; the `+63`
 * form contains the local number and works from anywhere, so one line does both
 * jobs. Each surface explains the leading-0 equivalence once, in prose.
 */
export function formatInternational(number: string): string {
  const d = number.replace(/\D/g, "");
  if (d.length !== 11 || !d.startsWith("0")) return number;
  return `+63 ${d.slice(1, 4)} ${d.slice(4, 7)} ${d.slice(7)}`;
}

/**
 * The bar shows every office, in the order above — most-needed first — as one
 * swipeable row. Nothing auto-scrolls: a number you cannot tap the moment you
 * see it is no use in an emergency, and moving content would need a WCAG 2.2
 * pause mechanism and would be killed by prefers-reduced-motion anyway.
 */
export const BAR_HOTLINES: readonly Hotline[] = HOTLINES;
