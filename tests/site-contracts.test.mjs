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
  // The portal is live, so the shell must not claim otherwise. This block is
  // copied into all 32 prerendered pages, where the old "coming soon" line sat
  // under a fully rendered page and contradicted it.
  assert.doesNotMatch(html, /coming soon/i);
  // Every route is prerendered, so this block is served *alongside* a complete
  // page, not instead of one. With JavaScript disabled it therefore must not
  // add a second `main` landmark or a second `h1` — measured: it did both, on
  // all 32 pages, until 2026-08-19.
  const noscript = html.match(/<noscript>[\s\S]*?<\/noscript>/)[0];
  assert.doesNotMatch(noscript, /<main\b/);
  assert.doesNotMatch(noscript, /<h1\b/);
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

  // `form-action 'self'`, relaxed from 'none' on 2026-08-20 with Codex's
  // written approval. /search, /404 and the search overlay each render a real
  // <form method="get" action="/search">; under 'none' the browser refused the
  // submission outright, so the boxes did nothing with scripting off. 'self'
  // permits exactly that same-origin GET and still blocks the case the
  // directive exists for: a submission — and any data in it — being sent to
  // another origin. There is no POST anywhere on this site and no endpoint to
  // post to. Widening it further, to a host or to '*', is not approved.
  assert.match(policy, /form-action 'self'/);
  assert.doesNotMatch(policy, /form-action [^;]*(\*|https?:)/);
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

test("prerendered pages carry a real OpenStreetMap attribution link (JS-off)", () => {
  // `npm test` builds first (pretest), so dist/ normally exists here; skip when
  // it does not, exactly like the prerender test, so `test:contracts` alone is
  // safe. The build itself fails loudly if prerendering breaks.
  if (!existsSync(new URL("dist/index.html", root))) return;
  // With JavaScript disabled — before Leaflet's own attribution control exists —
  // the ODbL-required attribution must still be a real link in the server-
  // rendered body of every prerendered page that shows a map. Measured against
  // the built output, not the source, and scoped to the #root render (before the
  // shared <noscript> block).
  const linked = /<a href="https:\/\/www\.openstreetmap\.org\/copyright"[^>]*>\s*OpenStreetMap\s*<\/a>/;
  for (const route of [
    "dist/index.html",
    "dist/government/barangays/index.html",
    "dist/government/barangays/poblacion/index.html",
  ]) {
    const html = load(route);
    const noscriptAt = html.indexOf("<noscript>");
    const body = html.slice(0, noscriptAt === -1 ? html.length : noscriptAt);
    assert.match(body, linked, `${route}: server-rendered OSM attribution must be a real link`);
  }
});

test("no capital-claim or unpublished-spending wording ships on any route", async () => {
  // The site must only claim what it actually publishes. The unqualified capital
  // claim and public-works/procurement/contractor/flood-control wording must be
  // absent from every prerendered page, and the shared <noscript> fallback must
  // carry no peso figures (those live on /about's own body only). Measured
  // against the built output on every route.
  if (!existsSync(new URL("dist/index.html", root))) return;
  const { ALL_PATHS } = await import(new URL("dist-ssr/routes.js", root).href);
  const banned = [/capital of Apayao/i, /flood[- ]control/i, /procurement/i, /\bcontractor\b/i, /public works/i];
  for (const path of ALL_PATHS) {
    const file = path === "/" ? new URL("dist/index.html", root) : new URL(`dist${path}/index.html`, root);
    if (!existsSync(file)) continue;
    const html = readFileSync(file, "utf8");
    for (const re of banned) {
      assert.doesNotMatch(html, re, `${path}: built HTML must not contain ${re}`);
    }
    const noscript = (html.match(/<noscript>[\s\S]*?<\/noscript>/) || [""])[0];
    assert.doesNotMatch(noscript, /₱/, `${path}: the global <noscript> must not carry peso figures`);
  }
});

test("emergency hotlines are sourced, well-formed and never hardcoded", () => {
  const data = load("src/data/hotlines.ts");

  // The source must be named, linked and dated in the file itself. A number
  // without a traceable origin must never appear on this site.
  assert.match(data, /Discover Kabugao/);
  assert.match(data, /facebook\.com\/discoverkabugao\/posts\//);
  assert.match(data, /published: "15 April 2026"/);
  assert.match(data, /Municipality of Kabugao/);

  // Every published number: exactly 11 digits, leading 0, real PH mobile prefix.
  const numbers = [...data.matchAll(/"(\d{9,13})"/g)].map((m) => m[1]);
  assert.ok(numbers.length >= 9, `Expected at least 9 hotline numbers, found ${numbers.length}`);
  const PH_MOBILE = /^09\d{9}$/;
  for (const number of numbers) {
    assert.match(number, PH_MOBILE, `${number} is not a valid 11-digit PH mobile number`);
  }
  assert.equal(new Set(numbers).size, numbers.length, "the same number must not be listed twice");

  // 911 is the fallback and is never sourced from an LGU post.
  assert.match(data, /NATIONAL_EMERGENCY = "911"/);

  // tel: links must be international. A leading 0 cannot be dialled from abroad,
  // which is the entire reason this page exists.
  assert.match(data, /tel:\+63\$\{digits\.slice\(1\)\}/);
  assert.doesNotMatch(data, /tel:0/);

  // Numbers live in exactly one file. A number pasted into a component would
  // escape the contract above and could never be corrected in one place.
  const sources = ["src/components/HotlineBar.tsx", "src/pages/EmergencyPage.tsx"];
  for (const file of sources) {
    const body = load(file).replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
    assert.doesNotMatch(body, /\b09\d{9}\b/, `${file} must not hardcode a phone number`);
    assert.doesNotMatch(body, /\+63\d/, `${file} must not hardcode a dialling code`);
  }

  // The bar DOES auto-scroll — the maintainer chose a marquee after being shown
  // the trade-off. That makes the pause paths mandatory, not optional, so they
  // are pinned here: WCAG 2.2 SC 2.2.2 needs a real control, hover does not
  // serve keyboard users, and reduced-motion must stop it dead.
  const bar = load("src/components/HotlineBar.tsx");
  const css = load("src/styles.css");

  assert.match(css, /@keyframes hotline-marquee/, "the marquee animation must exist");
  assert.match(css, /\.hotline__list[^}]*animation: hotline-marquee/s);
  // Duplicated track, second copy hidden from assistive tech.
  assert.match(bar, /aria-hidden="true"/);
  // Four ways to stop it.
  assert.match(css, /@media \(hover: hover\)[\s\S]{0,160}animation-play-state: paused/);
  assert.match(css, /:focus-within[\s\S]{0,140}animation-play-state: paused/);
  assert.match(css, /:active[\s\S]{0,140}animation-play-state: paused/);
  assert.match(css, /\.is-paused[\s\S]{0,140}animation-play-state: paused/);
  // A visible control, with state exposed.
  assert.match(bar, /className="hotline__pause"/);
  assert.match(bar, /aria-pressed=\{paused\}/);
  // Reduced motion: no animation, no pause button needed, row still swipeable.
  const reduced = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)", css.indexOf(".hotline__marquee")));
  assert.match(reduced.slice(0, 600), /\.hotline__list \{ animation: none/);
  assert.match(reduced.slice(0, 600), /\.hotline__marquee \{ overflow-x: auto/);
  assert.match(reduced.slice(0, 600), /\.hotline__pause \{ display: none/);
  // No JavaScript animation loop — the motion is CSS, so the browser can pause it.
  const barCode = bar.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\/.*$/gm, "");
  assert.doesNotMatch(barCode, /setInterval|requestAnimationFrame/);

  // Every office is named in full, not left as an abbreviation only.
  for (const abbr of ["MDRRMO", "KMPS", "BFP", "APH", "RHU", "MSWDO", "RMFB 15", "ICT Office"]) {
    assert.ok(data.includes(`abbreviation: "${abbr}"`), `Expected hotline entry ${abbr}`);
  }
  assert.match(data, /Municipal Disaster Risk Reduction and Management Office/);
  assert.match(data, /Apayao Provincial Hospital/);
  assert.match(data, /Regional Mobile Force Battalion 15/);
});

test("the hotline popup degrades to a real page and uses the native dialog", () => {
  const dialog = load("src/components/HotlineDialog.tsx");

  // Native <dialog>: focus trap, Escape and focus restoration come from the
  // browser rather than from hand-rolled code that usually gets them wrong.
  assert.match(dialog, /<dialog/);
  assert.match(dialog, /showModal\(\)/);
  assert.doesNotMatch(dialog, /focus-trap|trapFocus|tabindex="-1"/i);

  // Progressive enhancement: the trigger is a real link to the full page, and
  // the click is only cancelled when showModal genuinely exists. Nobody loses an
  // emergency number because a script failed.
  assert.match(dialog, /href="\/emergency"/);
  assert.match(dialog, /typeof node\.showModal !== "function"/);
  assert.match(dialog, /event\.preventDefault\(\)/);

  // The dial button's label is the number itself, in ONE format. Printing the
  // local 0-prefixed variant beside the +63 one repeated the same digits twice
  // on a single button — the redundancy the maintainer called out.
  assert.match(dialog, /className="hd__call"/);
  assert.match(dialog, /formatInternational\(number\)/);
  assert.match(dialog, /telHref\(number\)/);
  assert.doesNotMatch(dialog, /formatLocal/);
  // And it repeats the caveat rather than presenting the list as authoritative.
  assert.match(dialog, /mobile numbers can change/i);

  // Backdrop styling and centring live in the stylesheet, never inline.
  const css = load("src/styles.css");
  assert.match(css, /\.hd::backdrop/);
  assert.match(css, /\.hd \{[\s\S]*?margin: auto;/, "Tailwind's reset removes the UA margin: auto");
  assert.doesNotMatch(dialog, /style=\{\{/);
});

test("the emergency page shows its source, one dialling format and the 911 fallback", () => {
  const page = load("src/pages/EmergencyPage.tsx");

  assert.match(page, /HOTLINE_SOURCE\.published/);
  assert.match(page, /HOTLINE_SOURCE\.url/);
  assert.match(page, /formatInternational/);
  assert.match(page, /NATIONAL_EMERGENCY/);

  // One format only, and the source date stated at most twice on the page.
  assert.doesNotMatch(page, /formatLocal/);
  const dateMentions = [...page.matchAll(/HOTLINE_SOURCE\.published/g)].length;
  assert.ok(dateMentions <= 2, `source date printed ${dateMentions} times; 2 is the ceiling`);

  // formatLocal was deleted outright rather than left unused.
  assert.doesNotMatch(load("src/data/hotlines.ts"), /export function formatLocal/);
  // It must say plainly that numbers can change and what to do then.
  assert.match(page, /Mobile numbers can change/);
  assert.match(page, /not the municipal government/);
  // And it must not imply the site operates the hotlines.
  assert.doesNotMatch(page, /our hotline|we operate|our rescue/i);
});

test("every class a component renders has a rule in the stylesheet", () => {
  // An edit to src/styles.css once deleted a whole block of emergency-page rules
  // while the markup kept referencing them: the page still built, still passed
  // every other test, and rendered 20px-tall bare-text "buttons". This closes
  // that gap in both directions — no unstyled markup, no dead modifier classes.
  const css = load("src/styles.css");
  const defined = new Set([...css.matchAll(/\.([a-z][a-z0-9_-]*)/g)].map((m) => m[1]));

  // Utility and layout classes defined once and reused everywhere.
  const shared = new Set([
    "sr-only", "stack-top", "notice", "notice__sub", "section", "section__note",
    "section__body", "section__head", "shell", "pill", "btn", "kicker", "split",
    "mono", "narrow", "sub-head", "plain-list",
  ]);

  const components = [
    "src/pages/EmergencyPage.tsx",
    "src/components/HotlineBar.tsx",
    "src/components/HotlineDialog.tsx",
    "src/components/MapView.tsx",
    "src/components/PageHeader.tsx",
    "src/components/SearchOverlay.tsx",
    "src/pages/BarangaysPage.tsx",
    "src/pages/HomePage.tsx",
    "src/pages/SitemapPage.tsx",
    "src/pages/SimplePages.tsx",
    "src/pages/OfficialsPage.tsx",
    "src/components/SearchPanel.tsx",
  ];

  const unstyled = [];
  for (const file of components) {
    const source = load(file);
    const names = new Set();
    for (const m of source.matchAll(/className="([^"{]+)"/g)) {
      m[1].split(/\s+/).forEach((c) => c && names.add(c));
    }
    for (const m of source.matchAll(/className=\{`([^`]+)`\}/g)) {
      m[1].replace(/\$\{[^}]*\}/g, " ").split(/\s+/).forEach((c) => c && names.add(c));
    }
    for (const name of names) {
      if (shared.has(name) || name.startsWith("leaflet")) continue;
      // A trailing "-" is the stub of an interpolated modifier such as
      // `map--${height}`; require that some variant of it is styled.
      if (name.endsWith("-")) {
        const hasVariant = [...defined].some((c) => c.startsWith(name) && c.length > name.length);
        if (!hasVariant) unstyled.push(`${file} renders .${name}<variant> but no variant is styled`);
        continue;
      }
      if (!defined.has(name)) unstyled.push(`${file} renders .${name} but nothing styles it`);
    }
  }
  assert.deepEqual(unstyled, []);
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
  // The HTML sitemap is itself a page, so it belongs in the XML one.
  assert.ok(
    locs.includes("https://betterkabugao.org/sitemap"),
    "sitemap.xml must list the public /sitemap page",
  );
  // /404 exists only for URLs that do not. Advertising it invites a crawler to
  // index a not-found page, so it stays out of the XML and out of the HTML list.
  assert.ok(
    !locs.some((loc) => loc.endsWith("/404")),
    "sitemap.xml must not advertise the 404 page",
  );
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
  for (const path of ["/", "/government/barangays", "/government/barangays/poblacion", "/government/officials", "/about", "/sitemap", "/404"]) {
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
    assert.doesNotMatch(html, /coming soon/i, `${path} still claims the site is coming soon`);

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

test("the HTML sitemap links every public page as a real anchor", async () => {
  const distIndex = new URL("dist/index.html", root);
  if (!existsSync(distIndex)) return;

  const file = new URL("dist/sitemap/index.html", root);
  assert.ok(existsSync(file), "Expected dist/sitemap/index.html — run npm run build");
  const html = readFileSync(file, "utf8");

  // Only the server-rendered body counts. A link that exists solely in the
  // noscript block, or in a script payload, is not a link a crawler follows.
  const start = html.indexOf('<div id="root">');
  const body = html.slice(start, html.indexOf("<noscript>", start));

  const { ALL_PATHS } = await import(new URL("dist-ssr/routes.js", root).href);
  const hrefs = new Set([...body.matchAll(/<a[^>]+href="([^"]+)"/g)].map((m) => m[1]));

  for (const path of ALL_PATHS) {
    if (path === "/404") continue;
    assert.ok(hrefs.has(path), `HTML sitemap is missing a crawlable link to ${path}`);
  }

  // Nothing may point at the 404 page, and it must not be named either — the
  // page is for URLs that do not exist, so listing it is a contradiction.
  assert.ok(!hrefs.has("/404"), "HTML sitemap must not link /404");
  assert.doesNotMatch(body, /\/404/, "HTML sitemap must not mention /404");

  // The machine-readable counterpart, as a real link rather than plain text.
  assert.ok(hrefs.has("/sitemap.xml"), "HTML sitemap should link sitemap.xml");

  // One h1 and one main, on a page built from six h2 groups.
  assert.equal([...html.matchAll(/<h1[^>]*>/g)].length, 1, "/sitemap must have exactly one h1");
  assert.equal([...html.matchAll(/<main[^>]*>/g)].length, 1, "/sitemap must have exactly one main");
  assert.ok(
    [...body.matchAll(/<h2[^>]*>/g)].length >= 6,
    "/sitemap should group its links under headings",
  );
});

test("search and 404 are recovery screens, not dead ends", async () => {
  const distIndex = new URL("dist/index.html", root);
  if (!existsSync(distIndex)) return;

  const bodyOf = (path) => {
    const file = new URL(`dist${path}/index.html`, root);
    assert.ok(existsSync(file), `Expected prerendered HTML for ${path}`);
    const html = readFileSync(file, "utf8");
    const start = html.indexOf('<div id="root">');
    return { html, body: html.slice(start, html.indexOf("<noscript>", start)) };
  };

  const { ALL_PATHS, RECOVERY_LINKS } = await import(new URL("dist-ssr/routes.js", root).href);

  for (const path of ["/search", "/404"]) {
    const { html, body } = bodyOf(path);

    assert.equal([...html.matchAll(/<h1[^>]*>/g)].length, 1, `${path} must have exactly one h1`);
    assert.equal([...html.matchAll(/<main[^>]*>/g)].length, 1, `${path} must have exactly one main`);

    // Recovery has to work before any script runs, so every route offered is a
    // plain anchor in the served HTML.
    const hrefs = new Set([...body.matchAll(/<a[^>]+href="([^"]+)"/g)].map((m) => m[1]));
    for (const link of RECOVERY_LINKS) {
      if (link.to === path) continue;
      assert.ok(hrefs.has(link.to), `${path} must offer a real link to ${link.to}`);
    }

    // A real form field named q, so the address bar and the box agree.
    assert.match(body, /<form[^>]+action="\/search"/, `${path} needs a real search form`);
    assert.match(body, /<input[^>]+name="q"/, `${path} search field must be named q`);
  }

  // Every recovery destination is a route that actually exists.
  for (const link of RECOVERY_LINKS) {
    assert.ok(ALL_PATHS.includes(link.to), `Recovery link ${link.to} is not a route`);
  }

  // Before anything is typed, /search is not a blank page: the suggested
  // queries are real, shareable URLs.
  const { body: searchBody } = bodyOf("/search");
  assert.match(searchBody, /href="\/search\?q=/, "/search must suggest real query URLs");
  assert.match(searchBody, /href="\/sitemap"/, "/search must offer the sitemap as a way to browse");
});

test("the search overlay degrades to the /search page and never eats a slash", () => {
  const overlay = load("src/components/SearchOverlay.tsx");
  const store = load("src/lib/search-overlay.ts");

  // Progressive enhancement, same rule as the hotline popup: the trigger is a
  // real anchor and the click is only cancelled when <dialog> support exists.
  assert.match(overlay, /href="\/search"/);
  assert.match(overlay, /showModal !== "function"/);
  assert.match(overlay, /event\.preventDefault\(\)/);

  // "/" must stay a literal slash while someone is typing. Losing this guard
  // makes the barangay filter and both search boxes unusable.
  assert.match(store, /isTypingTarget/);
  assert.match(store, /isContentEditable/);
  assert.match(store, /\["INPUT", "TEXTAREA", "SELECT"\]/);
  // Ctrl+K is a second binding, never the only one.
  assert.match(store, /event\.key === "\/"/);
  assert.match(store, /metaKey \|\| event\.ctrlKey/);
  // Both keys must be named in the UI — an undocumented shortcut is unused.
  assert.match(overlay, /Ctrl<\/kbd>/);
  assert.match(overlay, /palette__kbd">\/</);

  // Escape is the browser's; the close handler is what returns focus, and the
  // shortcut path has no trigger element so it falls back to the masthead.
  assert.match(overlay, /addEventListener\("close"/);
  assert.match(overlay, /target\?\.focus\(\)/);
  assert.match(store, /getElementById\(SEARCH_TRIGGER_ID\)/);

  // Hydration: the server snapshot and the initial client state must be the
  // same object, or every prerendered page reports a mismatch.
  assert.match(store, /Object\.freeze/);

  // One overlay, mounted once, or two dialogs would share an input id.
  const app = load("src/App.tsx");
  assert.equal([...app.matchAll(/<SearchOverlay \/>/g)].length, 1);

  // The dropdown it replaced must be gone, not left behind unused.
  assert.ok(
    !existsSync(new URL("src/components/SiteSearch.tsx", root)),
    "SiteSearch was replaced by SearchOverlay and should not still exist",
  );

  // Comments must go first: a note in styles.css explains that .finder__list is
  // deliberately NOT .search__results, and the raw text would match it. This
  // suite has been fooled by its own documentation twice.
  const css = load("src/styles.css").replace(/\/\*[\s\S]*?\*\//g, " ");
  assert.ok(
    !css.includes(".search__results"),
    ".search__results was the SiteSearch dropdown and should have been deleted with it",
  );
  // .search__empty is NOT dead — the barangay filter still renders it.
  assert.ok(css.includes(".search__empty"), ".search__empty is still used by the barangay filter");
});

test("every prerendered page offers a crawlable route to search", async () => {
  const distIndex = new URL("dist/index.html", root);
  if (!existsSync(distIndex)) return;

  for (const path of ["/", "/emergency", "/government/officials", "/sitemap"]) {
    const file = path === "/" ? distIndex : new URL(`dist${path}/index.html`, root);
    const html = readFileSync(file, "utf8");
    const start = html.indexOf('<div id="root">');
    const body = html.slice(start, html.indexOf("<noscript>", start));

    // The overlay is client-only; the served HTML must still link to /search,
    // or a visitor without JavaScript has no way in.
    assert.match(body, /href="\/search"/, `${path} has no crawlable link to /search`);
    // A closed <dialog> is inert, so it must not contribute a second landmark.
    assert.equal([...body.matchAll(/<h1[^>]*>/g)].length, 1, `${path} must have exactly one h1`);
  }
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

test("no element forces a 320px min-width (classic scrollbars overflow at 320)", () => {
  assert.doesNotMatch(
    load("src/styles.css"),
    /min-width\s*:\s*320px/,
    "min-width: 320px causes horizontal overflow under classic scrollbars",
  );
});
