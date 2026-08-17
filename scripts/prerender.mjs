/**
 * Prerenders every route to static HTML.
 *
 * Most of the Better LGU network ships a client-only SPA behind a catch-all
 * rewrite: every URL in their sitemap returns the same shell with the same
 * title. Facebook, Messenger and Viber never execute JavaScript, so a shared
 * barangay link previews as the generic homepage. This script fixes that by
 * writing a real HTML file per route with its own title, description,
 * canonical URL, Open Graph tags and BreadcrumbList JSON-LD.
 *
 * On the CSP: `<script type="application/ld+json">` holds data, not code —
 * browsers never evaluate it, so it does not violate `script-src 'self'`.
 * Executable inline script remains forbidden.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = new URL("../", import.meta.url);
const distDir = fileURLToPath(new URL("dist/", root));
const ssrDir = fileURLToPath(new URL("dist-ssr/", root));
const SITE_URL = "https://betterkabugao.org";

function escapeAttr(value) {
  return String(value).replace(/[&<>"']/g, (m) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[m],
  );
}

/** JSON-LD must not contain a closing script tag. */
function safeJsonLd(value) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function breadcrumbJsonLd(meta) {
  if (meta.breadcrumbs.length < 2) return "";
  const itemListElement = meta.breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.label,
    ...(crumb.href ? { item: `${SITE_URL}${crumb.href}` } : {}),
  }));
  const payload = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement };
  return `\n    <script type="application/ld+json">${safeJsonLd(payload)}</script>`;
}

function replaceTag(html, pattern, replacement) {
  if (!pattern.test(html)) throw new Error(`Prerender could not find ${pattern} in the built shell`);
  return html.replace(pattern, replacement);
}

/** Rewrites the <head> of the built shell for one route. */
function buildDocument(template, meta, body) {
  const fullTitle = `${meta.title} | BetterKabugao.org`;
  const title = escapeAttr(fullTitle);
  const description = escapeAttr(meta.description);
  const canonical = escapeAttr(meta.canonical);

  let html = template;
  html = replaceTag(html, /<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = replaceTag(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`);
  html = replaceTag(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${canonical}" />`);
  html = replaceTag(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`);
  html = replaceTag(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`);
  html = replaceTag(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${canonical}" />`);
  html = replaceTag(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`);
  html = replaceTag(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`);
  html = html.replace("</head>", `${breadcrumbJsonLd(meta)}\n  </head>`);

  return replaceTag(html, /<div id="root"><\/div>/, `<div id="root">${body}</div>`);
}

export async function prerender() {
  const template = await readFile(join(distDir, "index.html"), "utf8");
  const { render } = await import(pathToFileURL(join(ssrDir, "entry-server.js")).href);
  const { ALL_PATHS } = await import(pathToFileURL(join(ssrDir, "routes.js")).href);

  const written = [];
  for (const path of ALL_PATHS) {
    const { html, meta } = render(path);
    const document = buildDocument(template, meta, html);

    const outPath = path === "/" ? join(distDir, "index.html") : join(distDir, path.slice(1), "index.html");
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, document);
    written.push(path);
  }

  // Cloudflare Pages serves /404.html for paths that match no file.
  await writeFile(join(distDir, "404.html"), await readFile(join(distDir, "404", "index.html"), "utf8"));

  return written;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  const written = await prerender();
  console.log(`PRERENDER_OK ${written.length} pages`);
}
