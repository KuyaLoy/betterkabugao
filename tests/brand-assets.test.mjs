import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import test from "node:test";

const root = new URL("../", import.meta.url);
const geometry = JSON.parse(readFileSync(new URL("src/brand/geometry.json", root), "utf8"));

/**
 * The maintainer's ORIGINAL logo geometry. These literals are pinned on
 * purpose: the mark may be recoloured or re-spaced, but never redrawn.
 */
const ORIGINAL_SILHOUETTE =
  "M88.8 23.5 97.7 24.1 102.4 54.8 144 97.4 133.6 122.9 112.3 111.5 106.5 112 75.8 120.8 58.7 136.5 51.9 132.8 37.9 135.4 34.2 129.7 32.1 108.9 16 95.9 36.3 95.3 49.8 79.7 80 24.6Z";
const ORIGINAL_RAYS = ["M69 29 58 15 65 10 77 28Z", "M85 24V4h9v20Z", "m101 28 13-18 7 6-12 16Z"];

const assets = {
  mark: "public/brand/betterkabugao-mark.svg",
  markInverse: "public/brand/betterkabugao-mark-inverse.svg",
  logo: "public/brand/betterkabugao-logo.svg",
  logoInverse: "public/brand/betterkabugao-logo-inverse.svg",
  favicon: "public/favicon.svg",
};

function load(relativePath) {
  const url = new URL(relativePath, root);
  assert.ok(existsSync(url), `Expected asset to exist: ${relativePath}`);
  return readFileSync(url, "utf8");
}

test("the original logo geometry is preserved exactly", () => {
  assert.equal(geometry.viewBox, "0 0 160 160");
  assert.equal(geometry.kabugao, ORIGINAL_SILHOUETTE, "the Kabugao silhouette must not be redrawn");
  assert.deepEqual(geometry.rays, ORIGINAL_RAYS, "the sunrise rays must not be redrawn");
  assert.ok(!("apayao" in geometry), "the province outline was removed with the previous design");
});

test("every brand asset uses the original silhouette and sunrise", () => {
  for (const [name, path] of Object.entries(assets)) {
    const svg = load(path);
    assert.ok(svg.includes(ORIGINAL_SILHOUETTE), `${name}: expected the original silhouette path`);
    for (const ray of ORIGINAL_RAYS) {
      assert.ok(svg.includes(ray), `${name}: expected the original sunrise ray`);
    }
    assert.match(svg, /#FFB900/i, `${name}: sunrise should use the BetterGov gold`);
  }
});

test("assets are recoloured to the BetterGov palette, not the previous brand blue", () => {
  for (const path of Object.values(assets)) {
    const svg = load(path);
    assert.doesNotMatch(svg, /#0032A0/i, "the pre-BetterGov blue should be gone");
    assert.doesNotMatch(svg, /#F2C81D/i, "the pre-BetterGov yellow should be gone");
  }
  assert.match(load(assets.mark), /#00295E/i);
});

test("the in-page mark shares the geometry file with the generated assets", () => {
  const component = load("src/brand/BrandMark.tsx");
  assert.match(component, /from "\.\/geometry\.json"/);
  assert.match(component, /geometry\.rays/);
  assert.match(component, /geometry\.kabugao/);
  assert.doesNotMatch(component, /M\d+(\.\d+)? /, "paths must come from geometry.json, not be inlined");
});

test("lockups render the wordmark as paths, never as live text", () => {
  for (const path of [assets.logo, assets.logoInverse]) {
    const svg = load(path);
    assert.match(svg, /id="wordmark"/);
    assert.doesNotMatch(svg, /<text\b/i);
    assert.doesNotMatch(svg, /font-family/i);
  }
});

test("brand assets are exactly reproducible from the builder script", () => {
  const before = Object.fromEntries(Object.entries(assets).map(([k, p]) => [k, load(p)]));
  const output = execFileSync(process.execPath, ["scripts/build-brand.mjs"], {
    cwd: fileURLToPath(root),
    encoding: "utf8",
  });
  assert.match(output, /BRAND_OK/);
  for (const [k, p] of Object.entries(assets)) {
    assert.equal(load(p), before[k], `${p} must be deterministic`);
  }
});
