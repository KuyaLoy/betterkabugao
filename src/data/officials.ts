/**
 * Elected municipal officials of Kabugao, term 2025–2028.
 *
 * Source: the municipality's own DICT eLGU platform
 * (elgu-kabugao-apayao-news.e.gov.ph/officials), retrieved 17 August 2026 —
 * an official government publication, not a third-party aggregator.
 * Cross-checked against COMELEC 2025 results reporting: mayor and vice-mayor
 * both match.
 *
 * Note: the eLGU list carries the 8 ELECTED Sangguniang Bayan members only.
 * The ex-officio members — the Liga ng mga Barangay (ABC) president and the
 * SK federation president — are not published there, so they are not listed.
 *
 * BetterGov.ph's LGU directory still lists the previous vice-mayor
 * (Tucjang, 2022–2025). An upstream correction is worth submitting.
 */

export type Official = { name: string; position: string };

export const OFFICIALS_TERM = "2025–2028";
export const OFFICIALS_SOURCE_URL = "https://elgu-kabugao-apayao-news.e.gov.ph/officials";
export const OFFICIALS_RETRIEVED = "17 August 2026";

export const EXECUTIVE: readonly Official[] = [
  { name: "Bensmar B. Ligwang", position: "Municipal Mayor" },
  { name: "Frederick C. Amid", position: "Municipal Vice Mayor" },
];

export const SANGGUNIAN: readonly Official[] = [
  { name: "Arne Paul F. Ligwang", position: "Sangguniang Bayan Member" },
  { name: "Benjie Ace L. Talimbatog", position: "Sangguniang Bayan Member" },
  { name: "Carl Lewis M. Amid", position: "Sangguniang Bayan Member" },
  { name: "Jayson Enciso", position: "Sangguniang Bayan Member" },
  { name: "Jayvan Ree Mamba", position: "Sangguniang Bayan Member" },
  { name: "Venancio Culdong", position: "Sangguniang Bayan Member" },
  { name: "Pedro Dandan", position: "Sangguniang Bayan Member" },
  { name: "Van Aldwin Culdong", position: "Sangguniang Bayan Member" },
];

/**
 * Why no barangay officials appear on this site.
 *
 * Verified 17 August 2026 across: the municipality's eLGU platform (carries a
 * barangay list, but no officials dataset — the full template inventory was
 * enumerated), COMELEC (no per-barangay 2023 results published for Apayao),
 * DILG's barangay officials directory (unreachable), DILG-CAR (no masterlist),
 * and apayao.gov.ph (no barangay directory).
 *
 * One third-party SEO directory publishes a complete 231-person roster, but it
 * is unaffiliated with any government body, cites no document, and is provably
 * stale — it lists Frederick Amid as Badduat's punong barangay, while he is now
 * Municipal Vice Mayor. Publishing it would risk naming the wrong people.
 */
export const BARANGAY_OFFICIALS_NOTE = {
  heading: "Barangay officials are not published by any government source",
  body:
    "We checked the municipality's own eLGU platform, COMELEC, DILG and the provincial government. None publishes the punong barangay or kagawad of Kabugao's 21 barangays. Rather than repeat an unverified list, we are requesting the official roster from the municipality.",
  election:
    "Barangay and SK elections were moved to 2 November 2026 by Republic Act 12232, so the current officials hold over until then.",
} as const;
