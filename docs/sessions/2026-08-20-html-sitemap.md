# 2026-08-20 — public /sitemap page + sitemap.xml hygiene

## Who

Robin (product owner), Codex (commander / final QA), Claude (build).
Scope was fixed by Codex to this one task. Branch:
`feature/html-sitemap-seo-pass` — **not** merged to `main`.

## What changed

- `src/pages/SitemapPage.tsx` — new. Six groups of ordinary anchors, a
  `{n} pages` badge, and a closing line pointing at `sitemap.xml`/`robots.txt`.
- `src/lib/seo.ts` — `/sitemap` added to `SEGMENT_LABELS`, `STATIC_META` and
  `ALL_PATHS` (32 → 33 routes), plus the sitemap model: `SITEMAP_EXCLUDED`,
  `SITEMAP_GROUPS`, `SITEMAP_PATHS` and `auditSitemap()`.
- `src/App.tsx` — `/sitemap` route, before the catch-all.
- `src/lib/search.ts` — one `PAGES` entry so the page is findable in search.
- `scripts/build-seo.mjs` — `/sitemap` in `STATIC_SECTIONS`, so sitemap.xml
  carries it. 31 → 32 URLs.
- `src/components/SiteFooter.tsx` — `Sitemap` link in the Project column.
- `src/styles.css` — one `.sitemap*` block plus collapses at 1024 and 560.
- `tests/site-contracts.test.mjs` — one new test, three assertions added to
  existing ones, `/sitemap` added to the prerender sample and `SitemapPage.tsx`
  to the className↔stylesheet cross-check.
- `src/App.test.tsx` — four unit tests.

## Decisions made (and why)

- **Generated, not typed.** The list comes from `ALL_PATHS` + `BARANGAYS`.
  A hand-written sitemap is a second source of truth that silently rots; this
  one cannot, because `auditSitemap()` fails the suite if a route is unlinked or
  linked twice.
- **`/transparency` under Government.** Codex named the six groups but not the
  placement of every path. The `/government` hub links to officials, barangays
  and transparency, so the sitemap mirrors the site's own structure.
- **`/404` excluded from both lists**, and the built HTML is asserted not even to
  mention `/404`. A page that exists only for URLs that do not should never be
  advertised to a crawler.
- **`lastmod` untouched** — still one build-wide stamp for all 32 URLs. Codex
  ruled it out of scope; it is a real finding, not a fixed one.
- **Dense bordered lists, not cards.** `.sitemap__group` follows the existing
  `.service-group` grammar: 2px navy top rule, `h2`, bordered rows. 32 links as
  cards would be a wall of boxes and no portal in the network does that.
- **The path is shown next to each label** in small grey type — it is the one
  piece of information a sitemap uniquely offers, and it is wrapped in a span
  because a bare text node in a flex row gets split per word by `gap`.

## Verified

- `npm test` — **33 contract + 31 unit, all pass**. `npm run typecheck`,
  `npm run lint` clean. `npm run build` → `SEO_OK … 32 sitemap URLs` and
  `PRERENDER_OK 33 pages`.
- Built artefacts read directly, not just via the suite: `dist/sitemap/index.html`
  exists (20,353 bytes); 16,071 chars of server-rendered body; one `h1`; one
  `main`; `BreadcrumbList` JSON-LD present; canonical
  `https://betterkabugao.org/sitemap`; zero inline `style` attributes; the
  string `/404` appears nowhere in the body.
- `public/sitemap.xml` — 32 `<loc>`, includes `https://betterkabugao.org/sitemap`,
  no `/404`.
- Playwright at **320 / 360 / 390 / 414**: `scrollWidth === clientWidth` at every
  width, 32 group links, every `href` a real path, one `h1`, one `main`.
- **JavaScript disabled**: all 32 links still present. That is the point of the
  page and it is now measured, not assumed.
- Screenshots at **1440 / 1280 / 768 / 390**, looked at rather than just saved.
- Anti-slop audit on the built page: the only repeated lines are the hotline
  marquee's `aria-hidden` second track, which §3 of the skill allows. No unused
  `.sitemap*` class, no unused export.
- **Not verified:** anything on a real Cloudflare preview — the sandbox has no
  egress, so the four `ERR_CONNECTION_RESET` console errors during capture are
  the Open-Meteo weather fetch failing locally, not a site defect. Needs one
  look at the branch preview URL.

## Open threads

- **Visual trade-off for Codex.** The wide barangay group is third, so row one
  holds Core and Government and leaves the third column empty. The only
  structural fixes move Barangays first or last, which changes the group order
  Codex specified. Left as specified.
- Barangay order inside the group is by population (Poblacion first), matching
  `/government/barangays`. Alphabetical may read better in a 3-column list.
- `lastmod` is one shared stamp for all 32 URLs — out of scope here.
- Unchanged: the no-JavaScript fallback styling question, BetterLGU PR #208.

## Handoff notes

- `git checkout feature/html-sitemap-seo-pass`, then `npm ci && npm test &&
  npm run build`, then serve `dist` with a server that honours directory
  `index.html` — `vite preview` rewrites nested routes to the SPA shell and will
  make `/sitemap/` look broken when it is not.
- The one thing to QA first is `auditSitemap()`: if a future route is added and
  the sitemap page is not updated, that function is what fails.
