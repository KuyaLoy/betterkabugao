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
  assert.equal(packageJson.scripts.build, "tsc -b && vite build");
  assert.equal(packageJson.scripts.lint, "eslint .");
  assert.equal(packageJson.scripts.typecheck, "tsc -b --pretty false");
  assert.equal(packageJson.scripts["test:unit"], "vitest run");
  assert.equal(packageJson.scripts["brand:build"], "node scripts/build-brand.mjs");
  assert.equal(packageJson.scripts["brand:social"], "node scripts/render-social-card.mjs");
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
  assert.match(css, /--container:\s*1200px/);
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

  assert.match(content, /18\.0229/);
  assert.match(content, /121\.1841/);
  assert.match(content, /135\.7 m/);
  assert.match(content, /935\.12 km²/);
  assert.match(content, /16,215/);
  assert.match(content, /2020/);
  assert.match(content, /PSA/);
  assert.match(content, /PhilAtlas/);
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
  assert.match(html, /<noscript>[\s\S]*21 barangays[\s\S]*16,215[\s\S]*<\/noscript>/);
  assert.match(html, /<noscript>[\s\S]*Robin Tapiru[\s\S]*<\/noscript>/);
  assert.match(html, /<noscript>[\s\S]*not the official website[\s\S]*<\/noscript>/i);
  assert.doesNotMatch(html, /<style\b/i);
  assert.doesNotMatch(html, /<script(?![^>]*\bsrc=)/i);
});

test("security headers stay strict, allowing only the weather endpoint", () => {
  const headers = load("public/_headers");

  assert.match(headers, /Strict-Transport-Security: max-age=31536000/);
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /X-Frame-Options: DENY/);
  assert.match(headers, /Referrer-Policy: strict-origin-when-cross-origin/);
  assert.match(headers, /Content-Security-Policy: default-src 'self'/);
  assert.match(headers, /script-src 'self'/);
  assert.match(headers, /style-src 'self'/);
  assert.match(headers, /connect-src 'self' https:\/\/api\.open-meteo\.com/);
  assert.match(headers, /object-src 'none'/);
  assert.match(headers, /frame-ancestors 'none'/);
});

test("the only third-party runtime request is the documented weather API", () => {
  const sources = ["src/lib/useKabugaoNow.ts", "src/App.tsx", "src/components/UtilityStrip.tsx"];
  const hosts = new Set();
  for (const file of sources) {
    for (const match of load(file).matchAll(/https:\/\/([\w.-]+)/g)) hosts.add(match[1]);
  }
  assert.deepEqual([...hosts], ["api.open-meteo.com"]);
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

test("README documents local and Cloudflare build settings", () => {
  const readme = load("README.md");
  assert.match(readme, /npm install/);
  assert.match(readme, /npm run dev/);
  assert.match(readme, /npm run build/);
  assert.match(readme, /Production branch:\s*`main`/);
  assert.match(readme, /Build output directory:\s*`dist`/);
  assert.match(readme, /independent/i);
});
