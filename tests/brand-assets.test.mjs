import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const kabugaoPath =
  "M88.8 23.5 97.7 24.1 102.4 54.8 144 97.4 133.6 122.9 112.3 111.5 106.5 112 75.8 120.8 58.7 136.5 51.9 132.8 37.9 135.4 34.2 129.7 32.1 108.9 16 95.9 36.3 95.3 49.8 79.7 80 24.6Z";
const sunrisePaths = [
  "M69 29 58 15 65 10 77 28Z",
  "M85 24V4h9v20Z",
  "m101 28 13-18 7 6-12 16Z",
];

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

function normalizePathData(pathData) {
  return pathData.replace(/\s+/g, " ").trim();
}

function groupContent(svg, groupId) {
  const groupPattern = new RegExp(
    `<g\\b(?=[^>]*\\bid=["']${groupId}["'])[^>]*>([\\s\\S]*?)<\\/g>`,
  );
  const match = svg.match(groupPattern);
  assert.ok(match, `Expected group content for: ${groupId}`);
  return match[1];
}

function pathData(groupMarkup) {
  return [...groupMarkup.matchAll(/<path\\b[^>]*\\bd\\s*=\\s*["']([^"']+)["'][^>]*>/gi)].map(
    ([, value]) => normalizePathData(value),
  );
}

function assertCommonContract(svg, definition) {
  assert.match(svg, /<svg\b/);
  assert.match(svg, new RegExp(`viewBox=["']${definition.viewBox}["']`));
  assert.match(svg, /#0032A0/);
  assert.match(svg, /#F2C81D/);
  assert.doesNotMatch(
    svg,
    /<(?:image|foreignObject|filter|linearGradient|radialGradient|clipPath|mask|pattern)\b/i,
  );
  assert.doesNotMatch(svg, /\bfilter\s*=\s*["'][^"']*["']/i);
  assert.doesNotMatch(svg, /\b(?:fill|stroke)\s*=\s*["'][^"']*url\(/i);
  assert.doesNotMatch(svg, /\b(?:fill|stroke)\s*:\s*url\(/i);
  assert.doesNotMatch(svg, /\b(?:filter|clip-path|mask)\s*:\s*[^;}]+/i);
  assert.doesNotMatch(svg, /(?:href|src)\s*=\s*["'](?:https?:|data:)/i);
  assert.doesNotMatch(svg, /@font-face\b/i);
  assert.doesNotMatch(svg, /@import\s+(?:url\(\s*)?["']?(?:https?:|data:|\/\/)/i);
  assert.doesNotMatch(svg, /url\(\s*["']?(?:https?:|data:|\/\/)/i);

  for (const group of definition.groups) {
    assert.match(svg, new RegExp(`id=["']${group}["']`));
  }

  const silhouettePaths = pathData(groupContent(svg, "kabugao-silhouette"));
  assert.deepEqual(silhouettePaths, [kabugaoPath]);

  const rays = pathData(groupContent(svg, "sunrise"));
  assert.deepEqual(rays, sunrisePaths);
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
  assert.match(
    groupContent(svg, "wordmark"),
    /<text\b[^>]*>BetterKabugao<\/text>/,
  );
});

test("favicon follows the compact vector contract", () => {
  const svg = loadSvg(definitions.favicon.path);
  assertCommonContract(svg, definitions.favicon);
  assert.doesNotMatch(svg, /<text\b/i);
});
