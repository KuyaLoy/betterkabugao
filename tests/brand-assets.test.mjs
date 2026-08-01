import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const definitions = {
  mark: {
    path: "../public/brand/betterkabugao-mark.svg",
    viewBox: "0 0 160 160",
    groups: ["sunrise", "kabugao-silhouette"],
  },
  logo: {
    path: "../public/brand/betterkabugao-logo.svg",
    viewBox: "0 0 640 160",
    groups: ["sunrise", "kabugao-silhouette", "wordmark"],
  },
  favicon: {
    path: "../public/favicon.svg",
    viewBox: "0 0 64 64",
    groups: ["sunrise", "kabugao-silhouette"],
  },
};

function loadSvg(relativePath) {
  const assetUrl = new URL(relativePath, import.meta.url);
  assert.ok(existsSync(assetUrl), `Expected SVG asset to exist: ${relativePath}`);
  return readFileSync(assetUrl, "utf8");
}

function assertCommonContract(svg, definition) {
  assert.match(svg, /<svg\b/);
  assert.match(svg, new RegExp(`viewBox=["']${definition.viewBox}["']`));
  assert.match(svg, /#0032A0/);
  assert.match(svg, /#F2C81D/);
  assert.doesNotMatch(
    svg,
    /<(?:image|foreignObject|filter|linearGradient|radialGradient)\b/i,
  );
  assert.doesNotMatch(svg, /(?:href|src)\s*=\s*["'](?:https?:|data:)/i);

  for (const group of definition.groups) {
    assert.match(svg, new RegExp(`id=["']${group}["']`));
  }
}

test("standalone mark follows the vector contract", () => {
  const svg = loadSvg(definitions.mark.path);
  assertCommonContract(svg, definitions.mark);
  assert.doesNotMatch(svg, /<text\b/i);
});

test("horizontal logo includes accessible editable wordmark", () => {
  const svg = loadSvg(definitions.logo.path);
  assertCommonContract(svg, definitions.logo);
  assert.match(svg, /<title[^>]*>BetterKabugao logo<\/title>/);
  assert.match(svg, /<desc[^>]*>.*Kabugao.*<\/desc>/);
  assert.match(svg, /<text\b[^>]*>BetterKabugao<\/text>/);
});

test("favicon follows the compact vector contract", () => {
  const svg = loadSvg(definitions.favicon.path);
  assertCommonContract(svg, definitions.favicon);
  assert.doesNotMatch(svg, /<text\b/i);
});
