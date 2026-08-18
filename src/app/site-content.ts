/**
 * All copy and verified facts for the launch page.
 *
 * Every figure here is sourced. Nothing about budgets, contractors,
 * projects or officials is stated, because none of it is verified yet.
 */

export const KABUGAO = {
  latitude: 18.0246,
  longitude: 121.1845,
  coordinatesLabel: "18.0246° N, 121.1845° E",
  elevationLabel: "132 m",
  areaLabel: "935.12 km²",
  barangays: "21",
  population: "16,425",
  populationYear: "2024",
  psgc: "1408104000",
  incomeClass: "1st class",
  timeZone: "Asia/Manila",
} as const;

export const siteContent = {
  status: "Coming soon",
  eyebrow: "Kabugao, Apayao",
  headline: "BetterKabugao.org",
  summary:
    "A volunteer-run civic portal for Kabugao, the capital of Apayao — bringing public spending, public projects, local services and local knowledge into one place anyone can read.",

  links: {
    repository: "https://github.com/KuyaLoy/betterkabugao",
    directory: "https://lgu.bettergov.ph/",
    betterGov: "https://bettergov.ph/",
    openData: "https://data.gov.ph/",
    foi: "https://www.foi.gov.ph/",
    dilgFdp: "https://fdpp.dilg.gov.ph/",
    philGeps: "https://www.philgeps.gov.ph/",
    coa: "https://www.coa.gov.ph/",
    apayao: "https://apayao.gov.ph/",
  },

  hotline: {
    label: "Emergency",
    national: "911",
  },

  buildStatus: {
    title: "Build status",
    items: [
      { label: "Domain and hosting", state: "done" },
      { label: "Open-source repository", state: "done" },
      { label: "Barangay directory and maps", state: "done" },
      { label: "Elected municipal officials", state: "done" },
      { label: "Public project records", state: "progress" },
      { label: "Service guides and contacts", state: "planned" },
      { label: "Budget and procurement data", state: "planned" },
    ],
    footnote: "One feature ships at a time. Follow the build, or contribute, on GitHub.",
  },

  intro: {
    kicker: "What this will be",
    title: "Public information about Kabugao, in one readable place.",
    body:
      "Kabugao is the capital of Apayao — 21 barangays spread across 935.12 km² of the Cordillera, home to 16,425 people. Information about how it is governed exists, but it is scattered across national portals, PDFs and offices. BetterKabugao is being built to gather it, explain it in plain language, and keep it linked to its official source.",
    facts: [
      { value: "Capital", label: "of Apayao province" },
      { value: KABUGAO.barangays, label: "barangays" },
      { value: KABUGAO.population, label: `residents · ${KABUGAO.populationYear} POPCEN` },
      { value: KABUGAO.areaLabel, label: "land area" },
    ],
    factsSource:
      "Population: 2024 POPCEN (Philippine Statistics Authority) — the 21 barangay figures sum to this total. PSGC 1408104000. Income class: 1st class, per Department of Finance Order 074.2024. Elevation from Copernicus DEM; coordinates from OpenStreetMap.",
  },

  transparency: {
    number: "03",
    kicker: "Transparency and public money",
    title: "Where the money goes, and what gets built.",
    body:
      "The first thing being built is a public record of local projects — flood control, roads, bridges, drainage, water systems and government facilities — with the budget, the funding source and the contractor attached to each one.",
    schemaTitle: "Every project record will carry",
    schemaNote: "Public project records are being prepared. No figures are published until verified against official sources.",
    schema: [
      "Project",
      "Location",
      "Budget",
      "Funding source",
      "Contractor",
      "Implementing agency",
      "Timeline",
      "Status",
      "Public documents",
    ],
    sourcesTitle: "Sourced from",
    sources: [
      { label: "PhilGEPS — bids and awards", href: "https://www.philgeps.gov.ph/" },
      { label: "DILG Full Disclosure Policy Portal", href: "https://fdpp.dilg.gov.ph/" },
      { label: "Commission on Audit reports", href: "https://www.coa.gov.ph/" },
      { label: "Freedom of Information requests", href: "https://www.foi.gov.ph/" },
    ],
  },

  explore: {
    number: "04",
    kicker: "Explore Kabugao",
    title: "The place itself — and how to visit it responsibly.",
    body:
      "Kabugao sits at 132 metres above sea level where the Cordillera folds into the Apayao river system. The portal will document its barangays, rivers, mountains and heritage, with local history written with the community rather than about it.",
    topics: [
      "Destinations and landmarks",
      "Rivers, mountains and waterfalls",
      "Barangay profiles",
      "Heritage, history and culture",
      "Isneg language and traditions",
      "Responsible tourism guidance",
    ],
    geo: [
      { label: "Coordinates", value: KABUGAO.coordinatesLabel },
      { label: "Elevation", value: KABUGAO.elevationLabel },
      { label: "Land area", value: KABUGAO.areaLabel },
    ],
  },

  services: {
    number: "05",
    kicker: "Services and public information",
    title: "What you need, without the runaround.",
    body:
      "Plain-language guides to the things residents actually need — what document to bring, which office to visit, what it costs and how long it takes.",
    groups: [
      { title: "Certificates and records", items: ["Birth, marriage and death records", "Barangay clearance", "Certification requests"] },
      { title: "Business and property", items: ["Business permits", "Real property tax", "Building permits"] },
      { title: "Offices and contacts", items: ["Municipal offices and hours", "Barangay officials directory", "Emergency and health contacts"] },
    ],
    note: "Service guides are being drafted and checked with the offices concerned.",
  },

  mission: {
    kicker: "Why this exists",
    title: "Public information belongs to the public.",
    body:
      "BetterKabugao is an independent, volunteer-run civic project. It is not affiliated with, endorsed by, or speaking for the Municipality of Kabugao. Everything it publishes will name its source, so anyone can check it.",
    networkNote:
      "It is part of the BetterGov.ph volunteer network — independent Better LGU portals built for towns and cities across the Philippines, at no cost to the public.",
  },

  costs: {
    toPeople: { label: "Cost to the people of Kabugao", value: "₱0" },
    toBuild: {
      label: "Cost to build this site",
      value: "₱670",
      note: "Domain paid personally by the developer. No public funds. Hosting is on a free tier.",
    },
  },

  developer: { name: "Robin Tapiru", role: "Developer and initiator" },

  disclaimer:
    "BetterKabugao is an independent, volunteer-run civic project. It is not the official website of the Municipality of Kabugao.",
  sourceNote: "All public information will be sourced from official government portals.",
  license: "MIT · Content CC BY 4.0",
  version: "3.0.0",
} as const;
