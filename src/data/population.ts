/**
 * Selected, directly verified population observations for Kabugao.
 *
 * These are published census/POPCEN counts, not annual estimates. Years with
 * values that have not been verified against the source documents are omitted
 * deliberately rather than filled by interpolation or a secondary database.
 */

export const POPULATION_RETRIEVED = "13 September 2026";

export const POPULATION_SOURCES = {
  cph2010: {
    label: "NSO, 2010 Census of Population and Housing: Apayao",
    detail: "Table 1, printed page 3 — 1960 to 2010 observations",
    href: "https://psa.gov.ph/system/files/main-publication/APAYAO_FINAL%20PDF.pdf",
  },
  cph2015: {
    label: "PSA, 2015 Census of Population Report No. 3",
    detail: "Table 1, document page 2 — 2015 observation",
    href: "https://psa.gov.ph/system/files/main-publication/_POPCEN%2520Report%2520No.%25203.pdf",
  },
  density2020: {
    label: "PSA, Population Density Table A",
    detail: "Document page 2 — 2020 observation",
    href: "https://psa.gov.ph/system/files/phcd/2022-12/2010-2015-2020%2520Population%2520Density_Table%2520A_Using%25202013%2520Land%2520Areas_12%2520July%25202021.pdf?vcode=41",
  },
  psgc2024: {
    label: "PSA, Kabugao PSGC record",
    detail: "2024 POPCEN observation",
    href: "https://psa.gov.ph/classification/psgc/barangays/1408104000",
  },
} as const;

export type PopulationSourceId = keyof typeof POPULATION_SOURCES;

export type PopulationObservation = {
  year: number;
  population: number;
  source: PopulationSourceId;
};

export const POPULATION_OBSERVATIONS: readonly PopulationObservation[] = [
  { year: 1960, population: 5961, source: "cph2010" },
  { year: 1970, population: 7358, source: "cph2010" },
  { year: 1980, population: 9600, source: "cph2010" },
  { year: 1990, population: 11198, source: "cph2010" },
  { year: 2000, population: 13985, source: "cph2010" },
  { year: 2010, population: 16170, source: "cph2010" },
  { year: 2015, population: 15537, source: "cph2015" },
  { year: 2020, population: 16215, source: "density2020" },
  { year: 2024, population: 16425, source: "psgc2024" },
] as const;

export const KABUGAO_2024_SNAPSHOT = [
  { label: "Total population", value: "16,425", exactValue: undefined, detail: "2024 POPCEN" },
  { label: "Household population", value: "16,411", exactValue: undefined, detail: "2024 POPCEN" },
  { label: "Number of households", value: "3,662", exactValue: undefined, detail: "2024 POPCEN" },
  { label: "Land area", value: "929.88 km²", exactValue: undefined, detail: "square kilometres" },
  {
    label: "Population density",
    value: "17.7 people/km²",
    exactValue: "17.6636 persons per square kilometre",
    detail: "rounded for reading",
  },
] as const;

export const KABUGAO_2024_SNAPSHOT_SOURCES = [
  {
    label: "Population and households",
    betterGov: "https://statistics.bettergov.ph/datasets/b1b47f8cb7ceb5c50a97",
    openStat: "https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0151A6DTHP4.px",
  },
  {
    label: "Land area and density",
    betterGov: "https://statistics.bettergov.ph/datasets/05c931eaecec498f9756",
    openStat: "https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0221A6DLPD0.px",
  },
] as const;

export const KABUGAO_2024_CITATION = [
  "Philippine Statistics Authority (PSA) OpenSTAT, 2024 POPCEN datasets for Kabugao, Apayao:",
  "total population 16,425; household population 16,411; households 3,662; land area 929.88 km²;",
  "population density 17.6636 persons/km².",
  "Canonical PSA OpenSTAT sources:",
  ...KABUGAO_2024_SNAPSHOT_SOURCES.map((source) => source.openStat),
  "Discovery and selection layer: Philippine Data Explorer / BetterGov.ph:",
  ...KABUGAO_2024_SNAPSHOT_SOURCES.map((source) => source.betterGov),
  "Source updated 12 August 2026; snapshot retrieved 9 September 2026; coverage checked 11 September 2026.",
].join(" ");
