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
