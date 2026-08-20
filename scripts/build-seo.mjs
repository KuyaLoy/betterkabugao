/**
 * Generates SEO artefacts from the same data the site renders, so they can
 * never drift: JSON-LD structured data, sitemap.xml and robots.txt.
 *
 * JSON-LD is emitted as a static file and linked from index.html rather than
 * inlined, because the Content-Security-Policy forbids inline scripts.
 */
import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const SITE = "https://betterkabugao.org";
const STATIC_SECTIONS = [
  "/", "/government", "/government/officials", "/government/barangays",
  "/emergency", "/transparency", "/explore", "/services", "/about", "/search",
  "/sitemap",
];

/**
 * Read the barangay table straight out of the TypeScript source, so the SEO
 * artefacts can never disagree with what the pages render. Fields are pulled
 * individually rather than by a fixed-order pattern, so adding a field to the
 * record does not silently break the parse.
 */
export function parseBarangays(source) {
  const blocks = source
    .slice(source.indexOf("export const BARANGAYS"), source.indexOf("/** Google Maps pin"))
    .split(/\{\s*name:/)
    .slice(1);

  const rows = blocks.map((block) => {
    const field = (name, pattern) => {
      const match = block.match(pattern);
      if (!match) throw new Error(`Barangay record missing ${name}: ${block.slice(0, 60)}`);
      return match[1];
    };
    return {
      name: field("name", /^\s*"([^"]+)"/),
      slug: field("slug", /slug:\s*"([^"]+)"/),
      psgc: field("psgc", /psgc:\s*"(\d+)"/),
      population: Number(field("population", /population:\s*(\d+)/)),
      lat: Number(field("lat", /lat:\s*([\d.]+)/)),
      lon: Number(field("lon", /lon:\s*([\d.]+)/)),
    };
  });

  if (rows.length !== 21) throw new Error(`Expected 21 barangays, parsed ${rows.length}`);
  return rows;
}

async function readBarangays() {
  return parseBarangays(await readFile(new URL("src/data/barangays.ts", root), "utf8"));
}

async function readOfficials() {
  const source = await readFile(new URL("src/data/officials.ts", root), "utf8");
  const block = source.slice(source.indexOf("export const EXECUTIVE"), source.indexOf("export const SANGGUNIAN"));
  return [...block.matchAll(/\{\s*name:\s*"([^"]+)",\s*position:\s*"([^"]+)"/g)]
    .map(([, name, position]) => ({ name, position }));
}

function structuredData(barangays, officials) {
  const total = barangays.reduce((sum, b) => sum + b.population, 0);

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE}/#website`,
        url: SITE,
        name: "BetterKabugao.org",
        description:
          "A volunteer-run civic portal for Kabugao, the capital of Apayao — public spending, public projects, local services and local knowledge in one readable place.",
        inLanguage: "en-PH",
        publisher: { "@id": `${SITE}/#publisher` },
      },
      {
        "@type": "Organization",
        "@id": `${SITE}/#publisher`,
        name: "BetterKabugao",
        url: SITE,
        logo: `${SITE}/brand/betterkabugao-mark.svg`,
        description:
          "An independent, volunteer-run civic project. Not the official website of the Municipality of Kabugao. Part of the BetterGov.ph volunteer network.",
        founder: { "@type": "Person", name: "Robin Tapiru" },
        areaServed: { "@id": `${SITE}/#place` },
        isPartOf: { "@type": "Organization", name: "BetterGov.ph", url: "https://bettergov.ph/" },
      },
      {
        "@type": ["City", "AdministrativeArea"],
        "@id": `${SITE}/#place`,
        name: "Kabugao",
        alternateName: "Municipality of Kabugao",
        description:
          "Capital municipality of Apayao province, Cordillera Administrative Region, Philippines. 21 barangays across 935.12 km².",
        identifier: [{ "@type": "PropertyValue", propertyID: "PSGC", value: "1408104000" }],
        geo: { "@type": "GeoCoordinates", latitude: 18.0246, longitude: 121.1845, elevation: "132 m" },
        containedInPlace: {
          "@type": "AdministrativeArea",
          name: "Apayao",
          containedInPlace: { "@type": "Country", name: "Philippines" },
        },
        additionalProperty: [
          { "@type": "PropertyValue", name: "Population (2024 POPCEN)", value: total },
          { "@type": "PropertyValue", name: "Barangays", value: barangays.length },
          { "@type": "PropertyValue", name: "Land area", value: "935.12 km²" },
          { "@type": "PropertyValue", name: "Income classification", value: "1st class" },
        ],
        containsPlace: barangays.map((b) => ({
          "@type": "AdministrativeArea",
          name: b.name,
          identifier: [{ "@type": "PropertyValue", propertyID: "PSGC", value: b.psgc }],
          geo: { "@type": "GeoCoordinates", latitude: b.lat, longitude: b.lon },
          additionalProperty: [
            { "@type": "PropertyValue", name: "Population (2024 POPCEN)", value: b.population },
          ],
        })),
      },
      {
        "@type": "GovernmentOrganization",
        name: "Municipality of Kabugao",
        description:
          "Referenced for public information only. BetterKabugao is not affiliated with the municipal government.",
        location: { "@id": `${SITE}/#place` },
        employee: officials.map((o) => ({ "@type": "Person", name: o.name, jobTitle: o.position })),
      },
      {
        "@type": "Dataset",
        "@id": `${SITE}/#barangay-dataset`,
        name: "Barangays of Kabugao, Apayao",
        description:
          "The 21 barangays of Kabugao with PSGC codes, 2024 POPCEN population and coordinates.",
        creator: { "@id": `${SITE}/#publisher` },
        spatialCoverage: { "@id": `${SITE}/#place` },
        license: "https://creativecommons.org/licenses/by/4.0/",
        isBasedOn: [
          "https://psa.gov.ph/classification/psgc/barangays/1408104000",
          "https://www.openstreetmap.org/relation/20429167",
        ],
      },
    ],
  };
}

function sitemapXml(stamp, barangays) {
  const paths = [
    ...STATIC_SECTIONS,
    ...barangays.map((b) => `/government/barangays/${b.slug}`),
  ];
  const urls = paths.map((path) => {
    const priority = path === "/" ? "1.0" : path.split("/").length > 3 ? "0.6" : "0.8";
    return [
      "  <url>",
      `    <loc>${SITE}${path}</loc>`,
      `    <lastmod>${stamp}</lastmod>`,
      "    <changefreq>weekly</changefreq>",
      `    <priority>${priority}</priority>`,
      "  </url>",
    ].join("\n");
  }).join("\n");

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    urls,
    "</urlset>",
    "",
  ].join("\n");
}

export async function buildSeo(stamp) {
  const [barangays, officials] = await Promise.all([readBarangays(), readOfficials()]);

  await writeFile(
    new URL("public/structured-data.json", root),
    `${JSON.stringify(structuredData(barangays, officials), null, 2)}\n`,
  );
  await writeFile(new URL("public/sitemap.xml", root), sitemapXml(stamp, barangays));
  await writeFile(
    new URL("public/robots.txt", root),
    `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`,
  );

  return { barangays: barangays.length, officials: officials.length, urls: STATIC_SECTIONS.length + barangays.length };
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const stamp = process.env.SEO_DATE ?? "2026-08-17";
  const result = await buildSeo(stamp);
  console.log(`SEO_OK ${result.barangays} barangays, ${result.officials} officials, ${result.urls} sitemap URLs`);
}
