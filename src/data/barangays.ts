/**
 * The 21 barangays of Kabugao, Apayao.
 *
 * Population: 2024 POPCEN (PSA). The 21 barangay figures sum to exactly
 * 16,425, which is the municipal total on PSA's PSGC page — verified.
 *
 * PSGC codes: verified against psgc.cloud (PSA-derived). Note that code
 * 1408104003 does not exist; Bulu is 1408104004. OpenStreetMap currently
 * tags Bulu as 1408104003, which is an upstream error.
 *
 * Coordinates: OpenStreetMap place nodes (ODbL), surveyed 2026-04-07. Every
 * node's population matched the PSA figure independently, which is a strong
 * cross-check on both datasets.
 *
 * Schools: OpenStreetMap, filtered to features named for the barangay.
 * OSM has NO health stations, day care centres or barangay halls mapped for
 * Kabugao — a genuine gap, not an omission here.
 *
 * Barangay officials are deliberately absent. No government source publishes
 * them: the municipality's own eLGU platform carries a barangay list with no
 * officials, COMELEC published no per-barangay results for the 2023 election,
 * and DILG's directory is unreachable. See docs/research/DATA-SOURCES.md.
 */

export type Barangay = {
  name: string;
  /** URL segment: /barangays/<slug> */
  slug: string;
  psgc: string;
  population: number;
  lat: number;
  lon: number;
  /** OSM place classification — quarter / village / hamlet. */
  place: "quarter" | "village" | "hamlet";
  oldName?: string;
  schools: string[];
};

export const BARANGAY_POPULATION_TOTAL = 16425;
export const BARANGAY_CENSUS = "2024 POPCEN";

export const BARANGAYS: readonly Barangay[] = [
  { name: "Poblacion", slug: "poblacion", psgc: "1408104020", population: 2724, lat: 18.024501, lon: 121.184501, place: "quarter",
    schools: ["Kabugao Central School", "Kabugao National High School"] },
  { name: "Lenneng", slug: "lenneng", psgc: "1408104011", population: 2709, lat: 17.921689, lon: 121.215338, place: "village",
    oldName: "Liyyeng", schools: ["Lenneng Elementary School"] },
  { name: "Badduat", slug: "badduat", psgc: "1408104001", population: 1087, lat: 17.976247, lon: 121.203720, place: "village",
    schools: ["Badduat Elementary School"] },
  { name: "Luttuacan", slug: "luttuacan", psgc: "1408104013", population: 1070, lat: 17.990769, lon: 121.205133, place: "village",
    schools: [] },
  { name: "Madatag", slug: "madatag", psgc: "1408104014", population: 916, lat: 18.047318, lon: 121.116646, place: "village",
    schools: ["Madatag Elementary School"] },
  { name: "Musimut", slug: "musimut", psgc: "1408104018", population: 846, lat: 18.031350, lon: 121.112363, place: "village",
    schools: ["Musimut Elementary School", "Musimut National High School"] },
  { name: "Dibagat", slug: "dibagat", psgc: "1408104006", population: 701, lat: 18.081976, lon: 121.093993, place: "village",
    schools: ["Dibagat Elementary School"] },
  { name: "Lucab", slug: "lucab", psgc: "1408104012", population: 652, lat: 18.030193, lon: 121.132322, place: "village",
    schools: [] },
  { name: "Cabetayan", slug: "cabetayan", psgc: "1408104007", population: 622, lat: 17.999545, lon: 121.174122, place: "village",
    schools: ["Cabetayan Elementary School"] },
  { name: "Karagawan", slug: "karagawan", psgc: "1408104008", population: 612, lat: 17.917617, lon: 121.159540, place: "village",
    schools: ["Karagawan Elementary School"] },
  { name: "Madduang", slug: "madduang", psgc: "1408104015", population: 603, lat: 18.013960, lon: 121.130119, place: "village",
    schools: ["Madduang Elementary School"] },
  { name: "Bulu", slug: "bulu", psgc: "1408104004", population: 573, lat: 18.043478, lon: 121.220774, place: "village",
    schools: ["Bulu Elementary School"] },
  { name: "Dagara", slug: "dagara", psgc: "1408104005", population: 528, lat: 17.925754, lon: 121.089301, place: "village",
    schools: ["Dagara Integrated School"] },
  { name: "Kumao", slug: "kumao", psgc: "1408104009", population: 513, lat: 18.085355, lon: 121.162520, place: "village",
    schools: ["Kumao Elementary School"] },
  { name: "Laco", slug: "laco", psgc: "1408104010", population: 487, lat: 18.039553, lon: 121.174245, place: "village",
    schools: ["Laco Elementary School"] },
  { name: "Baliwanan", slug: "baliwanan", psgc: "1408104002", population: 439, lat: 18.130155, lon: 121.139565, place: "village",
    schools: ["Baliwanan Elementary School"] },
  { name: "Maragat", slug: "maragat", psgc: "1408104017", population: 418, lat: 17.911715, lon: 121.066221, place: "village",
    schools: ["Maragat Primary School"] },
  { name: "Nagbabalayan", slug: "nagbabalayan", psgc: "1408104019", population: 374, lat: 18.024718, lon: 121.154709, place: "village",
    schools: ["Nagbabalayan Elementary School"] },
  { name: "Tuyangan", slug: "tuyangan", psgc: "1408104021", population: 205, lat: 18.106803, lon: 121.116589, place: "hamlet",
    schools: ["Tuyangan Elementary School"] },
  { name: "Magabta", slug: "magabta", psgc: "1408104016", population: 187, lat: 18.027518, lon: 121.198783, place: "village",
    schools: ["Magabta Elementary School"] },
  { name: "Waga", slug: "waga", psgc: "1408104022", population: 159, lat: 18.065781, lon: 121.231660, place: "hamlet",
    schools: ["Waga Elementary School"] },
];

/** Google Maps pin — no API key, no tracking script, opens in the user's app. */
export function mapLink(b: Barangay): string {
  return `https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lon}`;
}

/** Google Maps directions from wherever the visitor is. */
export function directionsLink(b: Barangay): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${b.lat},${b.lon}&travelmode=driving`;
}

export function populationShare(b: Barangay): string {
  return `${((b.population / BARANGAY_POPULATION_TOTAL) * 100).toFixed(1)}%`;
}

export function formatCoordinates(b: Barangay): string {
  return `${b.lat.toFixed(4)}° N, ${b.lon.toFixed(4)}° E`;
}

export function findBarangay(slug: string | undefined): Barangay | undefined {
  return BARANGAYS.find((b) => b.slug === slug);
}

/** Barangays ordered by population, for "ranked Nth of 21" context. */
export const BY_POPULATION: readonly Barangay[] = [...BARANGAYS].sort(
  (a, b) => b.population - a.population,
);

export function populationRank(b: Barangay): number {
  return BY_POPULATION.findIndex((x) => x.slug === b.slug) + 1;
}

/** The three nearest barangays, by great-circle distance. */
export function nearest(b: Barangay, count = 3): Array<{ barangay: Barangay; km: number }> {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  return BARANGAYS.filter((other) => other.slug !== b.slug)
    .map((other) => {
      const dLat = toRad(other.lat - b.lat);
      const dLon = toRad(other.lon - b.lon);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(b.lat)) * Math.cos(toRad(other.lat)) * Math.sin(dLon / 2) ** 2;
      return { barangay: other, km: 6371 * 2 * Math.asin(Math.sqrt(a)) };
    })
    .sort((x, y) => x.km - y.km)
    .slice(0, count);
}
