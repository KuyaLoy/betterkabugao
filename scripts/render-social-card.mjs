/**
 * Renders the BetterKabugao social preview card (1200x630 PNG).
 *
 * Font-free output: text is converted to SVG paths with fontkit (vendored
 * Inter), so rendering is byte-stable on any machine. The card mirrors the
 * launch page — BetterGov navy, the original Kabugao mark, and only facts
 * that are verified.
 */
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as fontkit from "fontkit";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const geometry = JSON.parse(await readFile(new URL("src/brand/geometry.json", root), "utf8"));
const outputPath = fileURLToPath(new URL("public/brand/betterkabugao-social.png", root));

const fonts = {
  800: fontkit.openSync(fileURLToPath(new URL("public/fonts/inter-latin-800-normal.woff2", root))),
  600: fontkit.openSync(fileURLToPath(new URL("public/fonts/inter-latin-600-normal.woff2", root))),
  500: fontkit.openSync(fileURLToPath(new URL("public/fonts/inter-latin-500-normal.woff2", root))),
};

function textPaths(weight, text, x, baselineY, size, tracking = 0) {
  const font = fonts[weight];
  const run = font.layout(text);
  const scale = size / font.unitsPerEm;
  let cursor = x;

  return run.glyphs
    .map((glyph, index) => {
      const position = run.positions[index];
      const gx = cursor + position.xOffset * scale;
      const gy = baselineY - position.yOffset * scale;
      cursor += position.xAdvance * scale + tracking;
      return `<path d="${glyph.path.toSVG()}" transform="translate(${gx.toFixed(2)} ${gy.toFixed(2)}) scale(${scale.toFixed(6)} ${(-scale).toFixed(6)})" />`;
    })
    .join("");
}

function mark(x, y, size) {
  const s = (size / 160).toFixed(4);
  return `<g transform="translate(${x} ${y}) scale(${s})">
    <g fill="#FFB900">${geometry.rays.map((d) => `<path d="${d}" />`).join("")}</g>
    <path d="${geometry.kabugao}" fill="#FFFFFF" />
  </g>`;
}

export async function buildSocialCardSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#003D8D" />
  <rect x="0" y="0" width="1200" height="8" fill="#FFB900" />
  ${mark(80, 74, 150)}
  <g fill="#99C2F7">${textPaths(600, "KABUGAO, APAYAO", 80, 292, 24, 3)}</g>
  <g fill="#FFFFFF">${textPaths(800, "BetterKabugao.org", 80, 380, 76)}</g>
  <g fill="#CCE0FB">${textPaths(500, "Public spending, public projects, services and local", 80, 442, 28)}</g>
  <g fill="#CCE0FB">${textPaths(500, "knowledge — in one readable place.", 80, 482, 28)}</g>
  <rect x="80" y="524" width="1040" height="1" fill="#FFFFFF" opacity="0.25" />
  <g fill="#FFB900">${textPaths(600, "COMING SOON", 80, 578, 26, 2)}</g>
  <g fill="#99C2F7">${textPaths(500, "Volunteer-run · Not an official government website", 468, 578, 24)}</g>
</svg>`;
}

export async function renderSocialCard() {
  return sharp(Buffer.from(await buildSocialCardSvg())).png().toBuffer();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await writeFile(outputPath, await renderSocialCard());
  console.log("SOCIAL_CARD_OK 1200x630");
}
