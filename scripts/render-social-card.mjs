import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath, pathToFileURL } from "node:url";
import * as fontkit from "fontkit";
import sharp from "sharp";

const root = new URL("../", import.meta.url);
const fontPath = fileURLToPath(
  new URL("../node_modules/@fontsource/inter/files/inter-latin-800-normal.woff2", import.meta.url),
);
const markPath = fileURLToPath(new URL("../public/brand/betterkabugao-mark.svg", import.meta.url));
const outputPath = fileURLToPath(new URL("../public/brand/betterkabugao-social.png", import.meta.url));

function textPaths(font, text, centerX, baselineY, size) {
  const run = font.layout(text);
  const scale = size / font.unitsPerEm;
  const width = run.positions.reduce((total, position) => total + position.xAdvance, 0) * scale;
  let cursor = centerX - width / 2;

  return run.glyphs.map((glyph, index) => {
    const position = run.positions[index];
    const x = cursor + position.xOffset * scale;
    const y = baselineY - position.yOffset * scale;
    cursor += position.xAdvance * scale;
    return `<path d="${glyph.path.toSVG()}" transform="translate(${x} ${y}) scale(${scale} ${-scale})" />`;
  }).join("");
}

async function markPaths() {
  const mark = await readFile(markPath, "utf8");
  const paths = [...mark.matchAll(/<path d="([^"]+)"\s*\/>/g)].map((match) => match[1]);
  if (paths.length !== 4) {
    throw new Error("Expected four paths in the standalone BetterKabugao mark");
  }

  return paths.map((path, index) => (
    `<path d="${path}" fill="${index < 3 ? "#F2C81D" : "#0032A0"}" />`
  )).join("");
}

export async function buildSocialCardSvg() {
  const [mark, font] = await Promise.all([
    markPaths(),
    Promise.resolve(fontkit.openSync(fontPath)),
  ]);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#F4F7FB" />
  <g transform="translate(155 205) scale(1.35)">${mark}</g>
  <g fill="#0032A0">${textPaths(font, "BetterKabugao", 760, 365, 88)}</g>
  <g fill="#0032A0">${textPaths(font, "COMING SOON · BETTERKABUGAO.ORG", 600, 530, 34)}</g>
</svg>`;
}

export async function renderSocialCard() {
  return sharp(Buffer.from(await buildSocialCardSvg())).png().toBuffer();
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  await writeFile(outputPath, await renderSocialCard());
  console.log("SOCIAL_CARD_OK 1200x630");
}
