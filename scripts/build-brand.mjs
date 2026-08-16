/**
 * BetterKabugao brand asset builder.
 *
 * The mark is the project's ORIGINAL logo — the Kabugao silhouette beneath a
 * three-ray sunrise. Its geometry lives in src/brand/geometry.json and must
 * not be redesigned. This script only recolours it to the BetterGov.ph
 * palette and composes the lockups, so every asset stays identical to the
 * mark rendered in the page.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as fontkit from "fontkit";

const root = new URL("../", import.meta.url);
const geometry = JSON.parse(await readFile(new URL("src/brand/geometry.json", root), "utf8"));

export const palette = {
  landOnLight: "#00295E",
  landOnDark: "#FFFFFF",
  gold: "#FFB900",
  wordOnLight: "#00295E",
  betterOnLight: "#495057",
  wordOnDark: "#FFFFFF",
  betterOnDark: "#99C2F7",
  navy: "#00142F",
};

const fonts = {
  800: fileURLToPath(new URL("public/fonts/inter-latin-800-normal.woff2", root)),
  600: fileURLToPath(new URL("public/fonts/inter-latin-600-normal.woff2", root)),
};

function glyphPaths(weight, text, x, baseline, size) {
  const font = fontkit.openSync(fonts[weight]);
  const run = font.layout(text);
  const scale = size / font.unitsPerEm;
  let cursor = x;
  const markup = run.glyphs
    .map((glyph, index) => {
      const position = run.positions[index];
      const gx = cursor + position.xOffset * scale;
      const gy = baseline - position.yOffset * scale;
      cursor += position.xAdvance * scale;
      return `<path d="${glyph.path.toSVG()}" transform="translate(${gx.toFixed(2)} ${gy.toFixed(2)}) scale(${scale.toFixed(5)} ${(-scale).toFixed(5)})" />`;
    })
    .join("");
  return { markup, width: cursor - x };
}

function markBody(land) {
  return `  <g id="sunrise" fill="${palette.gold}">
${geometry.rays.map((d) => `    <path d="${d}" />`).join("\n")}
  </g>
  <g id="kabugao-silhouette" fill="${land}">
    <path d="${geometry.kabugao}" />
  </g>`;
}

function markSvg(land, title) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${geometry.viewBox}" role="img" aria-labelledby="mark-title mark-desc">
  <title id="mark-title">${title}</title>
  <desc id="mark-desc">The Kabugao silhouette beneath a three-ray sunrise.</desc>
${markBody(land)}
</svg>
`;
}

/** Two-line "Better / Kabugao.org" lockup, matching the BetterLGU convention. */
function lockupSvg({ land, better, word, title }) {
  const betterLine = glyphPaths(600, "Better", 176, 62, 30);
  const placeLine = glyphPaths(800, "Kabugao", 176, 108, 50);
  const tld = glyphPaths(600, ".org", 176 + placeLine.width + 4, 108, 24);
  const total = Math.ceil(Math.max(176 + betterLine.width, 176 + placeLine.width + 4 + tld.width) + 20);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} 160" role="img" aria-labelledby="logo-title logo-desc">
  <title id="logo-title">${title}</title>
  <desc id="logo-desc">The Kabugao silhouette beneath a three-ray sunrise, beside the BetterKabugao.org wordmark.</desc>
${markBody(land)}
  <g id="wordmark">
    <g fill="${better}">${betterLine.markup}</g>
    <g fill="${word}">${placeLine.markup}</g>
    <g fill="${better}">${tld.markup}</g>
  </g>
</svg>
`;
}

function faviconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="12" fill="${palette.navy}" />
  <g transform="translate(6.4 4.8) scale(0.32)">
    <g id="sunrise" fill="${palette.gold}">
${geometry.rays.map((d) => `      <path d="${d}" />`).join("\n")}
    </g>
    <g id="kabugao-silhouette" fill="#FFFFFF">
      <path d="${geometry.kabugao}" />
    </g>
  </g>
</svg>
`;
}

export async function buildBrandAssets() {
  const files = {
    "public/brand/betterkabugao-mark.svg": markSvg(palette.landOnLight, "BetterKabugao mark"),
    "public/brand/betterkabugao-mark-inverse.svg": markSvg(palette.landOnDark, "BetterKabugao mark (inverse)"),
    "public/brand/betterkabugao-logo.svg": lockupSvg({
      land: palette.landOnLight,
      better: palette.betterOnLight,
      word: palette.wordOnLight,
      title: "BetterKabugao.org logo",
    }),
    "public/brand/betterkabugao-logo-inverse.svg": lockupSvg({
      land: palette.landOnDark,
      better: palette.betterOnDark,
      word: palette.wordOnDark,
      title: "BetterKabugao.org logo (inverse)",
    }),
    "public/favicon.svg": faviconSvg(),
  };

  for (const [path, contents] of Object.entries(files)) {
    await writeFile(new URL(path, root), contents);
  }
  return Object.keys(files);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const written = await buildBrandAssets();
  console.log(`BRAND_OK ${written.length} assets`);
}
