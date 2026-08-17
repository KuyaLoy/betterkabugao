import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = new URL("../", import.meta.url);

function load(relativePath) {
  const fileUrl = new URL(relativePath, root);
  assert.ok(existsSync(fileUrl), `Expected project file: ${relativePath}`);
  return readFileSync(fileUrl, "utf8");
}

test("project foundation exposes reproducible quality scripts", () => {
  const packageJson = JSON.parse(load("package.json"));

  assert.equal(packageJson.name, "betterkabugao");
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.type, "module");
  assert.equal(packageJson.engines.node, ">=22.12.0 <23");
  assert.equal(packageJson.scripts.lint, "eslint .");
  assert.equal(packageJson.scripts.typecheck, "tsc -b --pretty false");
  assert.equal(packageJson.scripts["test:unit"], "vitest run");
  assert.equal(packageJson.scripts["brand:build"], "node scripts/build-brand.mjs");
  assert.equal(packageJson.scripts["brand:social"], "node scripts/render-social-card.mjs");
  assert.equal(packageJson.scripts["seo:build"], "node scripts/build-seo.mjs");

  // The build must typecheck, bundle the client, bundle the SSR entries and
  // then prerender. Dropping the prerender step would silently ship a
  // client-only SPA again, which is the defect this site exists to avoid.
  assert.equal(
    packageJson.scripts.build,
    "npm run seo:build && tsc -b && npm run build:client && npm run build:ssr && npm run prerender",
  );
  assert.equal(packageJson.scripts["build:client"], "vite build");
  assert.match(packageJson.scripts["build:ssr"], /vite build --ssr src\/entry-server\.tsx/);
  assert.match(packageJson.scripts["build:ssr"], /vite build --ssr src\/lib\/routes\.ts/);
  assert.equal(packageJson.scripts.prerender, "node scripts/prerender.mjs");
});

test("Vite loads React and the Tailwind v4 plugin", () => {
  const config = load("vite.config.ts");
  assert.match(config, /react\(\)/);
  assert.match(config, /tailwindcss\(\)/);
  assert.match(config, /environment:\s*["']jsdom["']/);
});

test("the project pins the validated Node release", () => {
  assert.equal(load(".node-version").trim(), "22.14.0");
});

test("generated dependency and build output paths are ignored", () => {
  // Read .gitignore directly rather than shelling out to git: `git
  // check-ignore` needs an isolated global config to be deterministic, and
  // the usual /dev/null trick is not portable to Windows.
  const entries = load(".gitignore")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));

  for (const required of ["node_modules/", "dist/"]) {
    assert.ok(entries.includes(required), `Expected ${required} in .gitignore`);
  }
});

test("line endings are normalised for cross-platform contributors", () => {
  const attributes = load(".gitattributes");
  assert.match(attributes, /\*\s+text=auto eol=lf/);
  assert.match(attributes, /\*\.woff2 binary/);
});

test("stylesheet follows the BetterLGU measurements recorded in the research", () => {
  const css = load("src/styles.css");

  assert.match(css, /@import\s+["']tailwindcss["']/);
  // BetterGov.ph design-system colours
  for (const token of ["#0066eb", "#003d8d", "#00295e", "#00142f", "#ffb900", "#f8f9fa"]) {
    assert.ok(css.toLowerCase().includes(token), `Expected BetterGov token ${token}`);
  }
  // Network conventions: Inter, 1200px container, 76px header, sharp buttons
  assert.match(css, /font-family:\s*"Inter"/);
  assert.match(css, /--container:\s*1440px/);
  assert.match(css, /--measure:\s*68ch/);
  assert.match(css, /min-height:\s*76px/);
  assert.match(css, /\.btn\s*\{[^}]*border-radius:\s*6px/s);
  assert.doesNotMatch(css, /border-radius:\s*999px/, "the network uses no pill buttons");
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /animation-delay:\s*0s\s*!important/);
});

test("Inter is vendored with its licence and Figtree is gone", () => {
  for (const weight of [400, 500, 600, 700, 800]) {
    assert.ok(
      existsSync(new URL(`public/fonts/inter-latin-${weight}-normal.woff2`, root)),
      `Expected vendored Inter ${weight}`,
    );
  }
  assert.ok(existsSync(new URL("public/fonts/OFL.txt", root)), "Expected the OFL licence beside the fonts");
  assert.ok(!existsSync(new URL("public/fonts/figtree-latin-400-normal.woff2", root)));
});

test("site content states only verified, sourced facts", () => {
  const content = load("src/app/site-content.ts");

  assert.match(content, /18\.0246/);
  assert.match(content, /121\.1845/);
  assert.match(content, /1408104000/);
  assert.match(content, /132 m/);
  assert.match(content, /935\.12 km²/);
  assert.match(content, /16,425/);
  assert.match(content, /2024/);
  assert.match(content, /1st class/);
  assert.match(content, /Philippine Statistics Authority/);
  assert.match(content, /Robin Tapiru/);
  assert.match(content, /₱670/);
  assert.match(content, /No public funds/);
  assert.match(content, /not the official website of the Municipality of Kabugao/);
  // the tracker schema must ship without any values
  assert.match(content, /Public project records are being prepared/);
});

test("no fabricated government data appears anywhere in the source", () => {
  const content = load("src/app/site-content.ts");
  // Only two peso figures are legitimate: ₱0 to the public, ₱670 build cost.
  const pesoFigures = [...content.matchAll(/₱[\d,]+/g)].map((m) => m[0]);
  assert.deepEqual([...new Set(pesoFigures)].sort(), ["₱0", "₱670"]);
  // No percentages, no contractor or official names presented as data.
  assert.doesNotMatch(content, /\d+(\.\d+)?%/);
});

test("document metadata matches the launch identity", () => {
  const html = load("index.html");

  assert.match(html, /<meta name="theme-color" content="#003D8D"/);
  assert.match(html, /rel="canonical" href="https:\/\/betterkabugao\.org\/"/);
  assert.match(html, /og:image" content="https:\/\/betterkabugao\.org\/brand\/betterkabugao-social\.png"/);
  assert.match(html, /<noscript>[\s\S]*21 barangays[\s\S]*16,425[\s\S]*<\/noscript>/);
  assert.match(html, /<noscript>[\s\S]*Robin Tapiru[\s\S]*<\/noscript>/);
  assert.match(html, /<noscript>[\s\S]*not the official website[\s\S]*<\/noscript>/i);
  assert.doesNotMatch(html, /<style\b/i);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)/i);
});

test("security headers stay strict, allowing only the two documented hosts", () => {
  const headers = load("public/_headers");

  assert.match(headers, /Strict-Transport-Security: max-age=31536000/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /X-Frame-Options: DENY/);
  assert.match(headers, /Referrer-Policy: strict-origin-when-cross-origin/);
  assert.match(headers, /Content-Security-Policy: default-src 'self'/);
  assert.match(headers, /script-src 'self'/);
  assert.match(headers, /style-src 'self'/);
  assert.match(headers, /img-src 'self' data: https:\/\/tile\.openstreetmap\.org/);
  assert.match(headers, /connect-src 'self' https:\/\/api\.open-meteo\.com/);
  assert.match(headers, /object-src 'none'/);
  assert.match(headers, /frame-ancestors 'none'/);

  // Exactly two external origins may appear anywhere in the policy: the weather
  // API and the tile server. Adding a third — an embed, a font CDN, an
  // analytics host — has to be a deliberate change to this list.
  const policy = headers.match(/Content-Security-Policy: (.+)/)[1];
  const origins = [...new Set([...policy.matchAll(/https:\/\/([\w.-]+)/g)].map((m) => m[1]))].sort();
  assert.deepEqual(origins, ["api.open-meteo.com", "tile.openstreetmap.org"]);

  // No iframe embedding: `frame-src` is absent, so it falls back to
  // `default-src 'self'` and a Google Maps embed cannot be slipped in without
  // changing this policy.
  assert.doesNotMatch(policy, /frame-src/);
  assert.doesNotMatch(policy, /unsafe-inline|unsafe-eval/);
});

test("only two modules reach the network, and only to the documented hosts", () => {
  // These are the only modules that cause the browser to talk to a third party.
  // Every external origin they mention is listed here on purpose:
  //   api.open-meteo.com     — the weather reading (fetch)
  //   tile.openstreetmap.org — map tiles (img)
  //   www.openstreetmap.org  — the attribution link the ODbL licence requires
  const allowed = ["api.open-meteo.com", "tile.openstreetmap.org", "www.openstreetmap.org"];
  const hosts = new Set();
  for (const file of ["src/lib/useKabugaoNow.ts", "src/components/MapView.tsx"]) {
    for (const m of load(file).matchAll(/https:\/\/([\w.-]+)/g)) hosts.add(m[1]);
  }
  assert.deepEqual([...hosts].sort(), allowed);

  // And no other component may introduce one. Google Maps links are hyperlinks
  // a visitor chooses to follow, so they are listed as such, not as requests.
  const mapLinks = load("src/data/barangays.ts");
  assert.match(mapLinks, /google\.com\/maps\/search/);
  assert.match(mapLinks, /google\.com\/maps\/dir/);
});

test("the map is CSP-safe by construction", async () => {
  const component = load("src/components/MapView.tsx");
  // The component documents the patterns it avoids, so "must not contain"
  // checks have to read the code, not the prose explaining it.
  const code = component.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");

  // The tile host in the component must be the one the policy allows.
  assert.match(component, /https:\/\/tile\.openstreetmap\.org\/\{z\}\/\{x\}\/\{y\}\.png/);
  // OpenStreetMap's licence requires visible attribution.
  assert.match(component, /openstreetmap\.org\/copyright/);
  assert.match(component, /OpenStreetMap<\/a> contributors/);
  // Leaflet must be code-split, not pulled into the initial bundle.
  assert.match(component, /await import\("leaflet"\)/);
  // Its stylesheet must be bundled, never imported at runtime: a dynamic CSS
  // import makes Vite inject a <style> element, which style-src 'self' blocks.
  assert.doesNotMatch(code, /import\(["']leaflet\/dist\/leaflet\.css["']\)/);
  assert.match(load("src/styles.css"), /@import "leaflet\/dist\/leaflet\.css"/);
  // Markers must not reintroduce Leaflet's bundled image icons.
  assert.match(component, /L\.divIcon\(/);
  assert.doesNotMatch(code, /Icon\.Default|marker-icon\.png/);
  // No authored inline styles anywhere in the component.
  assert.doesNotMatch(code, /style=\{\{/);

  // Overriding Leaflet's absolute positioning on a marker puts every marker
  // back into normal flow, so they stack downwards and drift off the map.
  // This cost two verification rounds to find; it must not come back.
  const css = load("src/styles.css");
  assert.doesNotMatch(css, /\.map-pin\s*\{[^}]*position\s*:/s);

  // Leaflet itself must stay compatible with the policy. Re-check on upgrade.
  const leafletDir = new URL("node_modules/leaflet/dist/leaflet-src.js", root);
  if (existsSync(leafletDir)) {
    const leaflet = readFileSync(leafletDir, "utf8");
    assert.doesNotMatch(leaflet, /setAttribute\(\s*["']style["']/, "setAttribute('style') is blocked by style-src");
    assert.doesNotMatch(leaflet, /\bnew Function\b/);
    const version = JSON.parse(readFileSync(new URL("node_modules/leaflet/package.json", root), "utf8")).version;
    assert.match(version, /^1\.9\./, `Leaflet ${version}: re-audit the CSP notes in MapView.tsx before widening this`);
  }
});

test("social preview is a 1200 by 630 PNG", async () => {
  const socialCard = new URL("public/brand/betterkabugao-social.png", root);
  assert.ok(existsSync(socialCard), "Expected generated social preview PNG");
  const { default: sharp } = await import("sharp");
  const metadata = await sharp(readFileSync(socialCard)).metadata();
  assert.equal(metadata.format, "png");
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
});

test("social-card renderer is font-free and byte-stable", async () => {
  const { buildSocialCardSvg, renderSocialCard } = await import("../scripts/render-social-card.mjs");
  const svg = await buildSocialCardSvg();

  assert.doesNotMatch(svg, /<text\b/i);
  assert.doesNotMatch(svg, /font-family/i);
  assert.doesNotMatch(svg, /undefined/, "every referenced geometry path must exist");

  const first = await renderSocialCard();
  const second = await renderSocialCard();
  assert.equal(
    createHash("sha256").update(first).digest("hex"),
    createHash("sha256").update(second).digest("hex"),
  );

  const output = execFileSync(process.execPath, ["scripts/render-social-card.mjs"], {
    cwd: fileURLToPath(root),
    encoding: "utf8",
  });
  assert.match(output, /SOCIAL_CARD_OK 1200x630/);
});

test("the design research is committed alongside the design it produced", () => {
  const research = load("design-research/RESEARCH.md");
  assert.match(research, /Sites reviewed/i);
  assert.match(research, /BetterSolano/);
  assert.match(research, /BetterTanay/);
  assert.match(research, /Patterns to avoid/i);
  // at least ten sites must be listed
  const listed = [...research.matchAll(/^\d+\.\s+Better/gm)];
  assert.ok(listed.length >= 10, `Expected 10+ sites reviewed, found ${listed.length}`);
});

test("the 21 barangays are complete, sum to the census total, and have real coordinates", async () => {
  const source = load("src/data/barangays.ts");
  // Reuse the SEO parser rather than a second regex: one parser means the
  // sitemap, the structured data and this contract can never disagree.
  const { parseBarangays } = await import("../scripts/build-seo.mjs");
  const rows = parseBarangays(source);
  assert.equal(rows.length, 21, "Kabugao has exactly 21 barangays");

  assert.equal(new Set(rows.map((r) => r.name)).size, 21, "barangay names must be unique");

  const codes = rows.map((r) => r.psgc);
  assert.equal(new Set(codes).size, 21, "PSGC codes must be unique");
  assert.ok(!codes.includes("1408104003"), "1408104003 is not an assigned code");
  for (const code of codes) assert.match(code, /^14081040(0[124-9]|1\d|2[0-2])$/);

  // Slugs are the route key for /government/barangays/<slug>; they must be
  // unique, URL-safe and derived from the name.
  const slugs = rows.map((r) => r.slug);
  assert.equal(new Set(slugs).size, 21, "barangay slugs must be unique");
  for (const row of rows) {
    assert.match(row.slug, /^[a-z0-9-]+$/, `${row.name} slug must be URL-safe`);
    assert.equal(row.slug, row.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
  }

  const total = rows.reduce((sum, r) => sum + r.population, 0);
  assert.equal(total, 16425, "barangay populations must sum to the 2024 POPCEN municipal total");

  // every coordinate must sit inside Kabugao's real bounding box
  for (const { name, lat, lon } of rows) {
    assert.ok(lat > 17.85 && lat < 18.2, `${name} latitude out of range`);
    assert.ok(lon > 121.0 && lon < 121.3, `${name} longitude out of range`);
  }
  assert.match(source, /google\.com\/maps\/search/);
  assert.match(source, /google\.com\/maps\/dir/);
});

test("officials come from the government source and barangay officials are withheld", () => {
  const source = load("src/data/officials.ts");
  assert.match(source, /Bensmar B\. Ligwang/);
  assert.match(source, /Frederick C\. Amid/);
  assert.match(source, /elgu-kabugao-apayao-news\.e\.gov\.ph/);
  assert.match(source, /2025–2028/);
  // the stale third-party roster must never be pasted in
  assert.doesNotMatch(source, /barangaydirectory/i);
  assert.match(source, /BARANGAY_OFFICIALS_NOTE/);
  assert.match(source, /Republic Act 12232/);
});

test("SEO artefacts are generated from the site's own data", async () => {
  const output = execFileSync(process.execPath, ["scripts/build-seo.mjs"], {
    cwd: fileURLToPath(root), encoding: "utf8",
  });
  assert.match(output, /SEO_OK 21 barangays/);

  const ld = JSON.parse(load("public/structured-data.json"));
  const place = ld["@graph"].find((n) => String(n["@type"]).includes("City"));
  assert.equal(place.containsPlace.length, 21);
  assert.equal(place.identifier[0].value, "1408104000");
  const gov = ld["@graph"].find((n) => n["@type"] === "GovernmentOrganization");
  assert.equal(gov.employee.length, 2);

  const sitemap = load("public/sitemap.xml");
  assert.match(sitemap, /sitemaps\.org\/schemas\/sitemap\/0\.9/);
  // Real routes, not in-page anchors: every entry must be a URL a crawler can
  // fetch on its own and get distinct HTML back.
  assert.doesNotMatch(sitemap, /<loc>[^<]*#/, "sitemap entries must be routes, not hash anchors");
  const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert.equal(new Set(locs).size, locs.length, "sitemap URLs must be unique");
  for (const path of ["/", "/government", "/government/officials", "/government/barangays", "/transparency", "/about", "/search"]) {
    assert.ok(locs.includes(`https://betterkabugao.org${path}`), `sitemap missing ${path}`);
  }
  const { parseBarangays } = await import("../scripts/build-seo.mjs");
  for (const { slug } of parseBarangays(load("src/data/barangays.ts"))) {
    assert.ok(
      locs.includes(`https://betterkabugao.org/government/barangays/${slug}`),
      `sitemap missing barangay page for ${slug}`,
    );
  }
  assert.match(load("public/robots.txt"), /Sitemap: https:\/\/betterkabugao\.org\/sitemap\.xml/);
});

test("every route is prerendered to its own static HTML, not a shared SPA shell", async () => {
  const distIndex = new URL("dist/index.html", root);
  if (!existsSync(distIndex)) {
    // `npm test` can run before `npm run build`; the build script itself fails
    // loudly if prerendering breaks, so skip rather than fail here.
    return;
  }

  // ALL_PATHS lives in TypeScript, so read the list from the SSR bundle the
  // prerenderer itself consumes — the same source of truth, not a copy.
  const { ALL_PATHS } = await import(new URL("dist-ssr/routes.js", root).href);
  assert.ok(ALL_PATHS.length >= 30, `Expected 30+ routes, got ${ALL_PATHS.length}`);
  assert.equal(new Set(ALL_PATHS).size, ALL_PATHS.length, "route list must not repeat a path");
  for (const path of ALL_PATHS) {
    const file = path === "/" ? distIndex : new URL(`dist${path}/index.html`, root);
    assert.ok(existsSync(file), `Route ${path} was not prerendered`);
  }

  const titles = new Map();
  for (const path of ["/", "/government/barangays", "/government/barangays/poblacion", "/government/officials", "/about", "/404"]) {
    const file = path === "/" ? distIndex : new URL(`dist${path}/index.html`, root);
    assert.ok(existsSync(file), `Expected prerendered HTML for ${path}`);
    const html = readFileSync(file, "utf8");

    const title = html.match(/<title>([\s\S]*?)<\/title>/)?.[1];
    assert.ok(title, `${path} has no title`);
    titles.set(path, title);

    const canonical = html.match(/rel="canonical" href="([^"]*)"/)?.[1];
    assert.equal(canonical, `https://betterkabugao.org${path === "/" ? "/" : path}`, `${path} canonical is wrong`);

    // Real server-rendered body, not an empty root div.
    const start = html.indexOf('<div id="root">');
    assert.notEqual(start, -1, `${path} has no root element`);
    const body = html.slice(start, html.indexOf("<noscript>", start));
    assert.ok(body.length > 2000, `${path} rendered only ${body.length} chars of HTML`);
    assert.match(body, /<h1[^>]*>/, `${path} has no server-rendered h1`);

    // No inline executable script — JSON-LD is data and is allowed.
    for (const [, attrs] of html.matchAll(/<script([^>]*)>/g)) {
      assert.ok(
        /\bsrc=/.test(attrs) || /type="application\/ld\+json"/.test(attrs),
        `${path} contains inline executable script: <script${attrs}>`,
      );
    }
  }

  // The map is client-only, so the prerendered HTML must still carry the place
  // links a visitor without JavaScript — or a social scraper — can use.
  for (const path of ["/", "/government/barangays/poblacion"]) {
    const file = path === "/" ? distIndex : new URL(`dist${path}/index.html`, root);
    const html = readFileSync(file, "utf8");
    assert.match(html, /class="map__fallback"/, `${path} must server-render the map fallback`);
    assert.match(html, /google\.com\/maps\/dir/, `${path} fallback must offer directions`);
    assert.doesNotMatch(html, /leaflet-container/, `${path} must not pretend a map rendered on the server`);
  }

  // The whole point: no two pages share a title.
  assert.equal(new Set(titles.values()).size, titles.size, "prerendered pages must have distinct titles");
  assert.match(titles.get("/government/barangays/poblacion"), /Poblacion/);

  const detail = readFileSync(new URL("dist/government/barangays/poblacion/index.html", root), "utf8");
  assert.match(detail, /"@type":\s*"BreadcrumbList"/, "detail pages need BreadcrumbList JSON-LD");
  assert.match(detail, /2,724/, "detail pages must carry their own verified figures");
  assert.match(detail, /1408104020/);

  // Cloudflare Pages serves this for unmatched paths.
  assert.ok(existsSync(new URL("dist/404.html", root)), "Expected dist/404.html for Cloudflare Pages");
});

test("document metadata carries geo and structured-data hints", () => {
  const html = load("index.html");
  assert.match(html, /geo\.position" content="18\.0246;121\.1845"/);
  assert.match(html, /application\/ld\+json" href="\/structured-data\.json"/);
  assert.match(html, /rel="preload" href="\/fonts\/inter-latin-800-normal\.woff2"/);
});

test("README documents local and Cloudflare build settings", () => {
  const readme = load("README.md");
  assert.match(readme, /npm install/);
  assert.match(readme, /npm run dev/);
  assert.match(readme, /npm run build/);
  assert.match(readme, /Production branch:\s*`main`/);
  assert.match(readme, /Build output directory:\s*`dist`/);
  assert.match(readme, /independent/i);
});
