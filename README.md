# BetterKabugao

BetterKabugao is an independent, community-maintained civic portal for Kabugao, a municipality of Apayao. It is an independent civic initiative, not the official website of the Municipality of Kabugao, and is part of the [BetterGov.ph](https://bettergov.ph/) volunteer network — see the [BetterLGU Directory](https://lgu.bettergov.ph/).

Kabugao: 21 barangays · 16,425 residents (2024 POPCEN) · 935.12 km² · 1st-class income · PSGC 1408104000. Built at ₱0 cost to the people.

## New here?

Read **[`docs/START-HERE.md`](docs/START-HERE.md)** first. It carries the current state of the project, what is already built, the ordered feature plan, and the mistakes that have already cost us time. Then read [`CLAUDE.md`](CLAUDE.md) for the rules.

## What is published

Every route is prerendered to its own static HTML file, so crawlers and social scrapers get real content rather than a shared shell.

| Section | Route |
|---|---|
| Home | `/` |
| Government hub | `/government` |
| Elected municipal officials | `/government/officials` |
| Barangay directory (all 21, filterable) | `/government/barangays` |
| One page per barangay | `/government/barangays/:slug` |
| Transparency (field schema, no values yet) | `/transparency` |
| Explore · Services · About · Search | `/explore` · `/services` · `/about` · `/search` |

Each barangay page carries its population, share of the municipality, population rank, PSGC code, coordinates, classification, schools, the three nearest barangays with distances, an OpenStreetMap map, and Google Maps directions.

**Nothing is published without an official source cited beside it.** Where data is not verified yet, the page says so. Barangay officials are not listed because no government source publishes them — the barangay pages explain what was checked.

## Local development

Requirements: Node.js 22.14.0 and npm.

```bash
npm install
npm run dev
```

`npm run dev` serves the app client-side. Prerendering only happens in `npm run build`, so per-page titles and metadata are visible in `dist`, not in the dev server.

## Quality checks

```bash
npm test          # contract tests + unit tests
npm run typecheck
npm run lint
npm run build     # ends with "PRERENDER_OK 33 pages" (32 sitemap URLs; /404 excluded)
```

The production build is written to `dist`. The build is a pipeline — `seo:build → tsc -b → build:client → build:ssr → prerender` — and must not be reduced to `vite build`; that would ship a client-only SPA and every shared link would preview identically.

To inspect the built site locally, serve `dist` with a static server that honours directory `index.html` files. `vite preview` rewrites all paths to the SPA shell, so nested routes appear to show the homepage.

### Browser QA (Checkpoint 1)

```bash
npm run qa        # builds, serves dist/ like Cloudflare Pages, runs real-Chrome checks
```

`npm run qa` (`scripts/qa/`) launches Chromium through Playwright — a dev-only dependency, so `npm install` fetches the matching browser (or run `npx playwright install chromium`). It serves `dist/` with clean-URL routing (not `vite preview`'s SPA fallback) and asserts every header, mobile-menu, search-overlay, barangay-directory and map interaction at 320–1440 widths, including the layered-Escape and menu-plus-search sequences. It writes a pass/fail report to `docs/qa/checkpoint-2a/qa-report.json` (the current Checkpoint 2A report) and exits non-zero if any check fails.

## Cloudflare Pages

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root

`dist/404.html` is generated for unmatched paths. The generated `pages.dev` deployment must be verified before `betterkabugao.org` is attached through the Pages project’s Custom domains screen.

## Design system

The site follows the official BetterGov.ph design tokens (see `src/styles.css`): the BetterGov blue scale (`#0066EB` → `#00142F`) with gold accents (`#FFB900`, `#F58900`). Typography is **Inter**, the typeface used across the BetterLGU network, vendored in `public/fonts` under the SIL Open Font License so the site loads no fonts from a CDN.

Layout conventions — 1440px container, 76px masthead, left-aligned headings, 6px buttons, solid navy heroes — were measured from 11 live BetterLGU portals rather than chosen. See [`design-research/RESEARCH.md`](design-research/RESEARCH.md) for the measurements and [`design-research/ARCHITECTURE.md`](design-research/ARCHITECTURE.md) for how the route structure was derived from 15 cloned repositories.

The identity is the project's original mark — the Kabugao silhouette beneath a three-ray sunrise — recoloured to the BetterGov palette. `src/brand/geometry.json` is the single source of truth, is pinned by a contract test, and must never be redrawn; `npm run brand:build` regenerates every SVG from it.

## Privacy and security

- Strict Content-Security-Policy in `public/_headers`, plus HSTS, nosniff, `X-Frame-Options: DENY` and a restrictive Permissions-Policy
- No analytics, no cookies, no trackers, no third-party fonts or scripts
- Exactly two external hosts: `api.open-meteo.com` for the local weather reading and `tile.openstreetmap.org` for map tiles
- No iframes: `frame-src` is deliberately absent from the policy

## Brand assets

- `src/brand/geometry.json` — canonical mark geometry (edit here, then `npm run brand:build`)
- `public/brand/betterkabugao-mark.svg` — standalone mark for light backgrounds
- `public/brand/betterkabugao-mark-inverse.svg` — standalone mark for dark backgrounds
- `public/brand/betterkabugao-logo.svg` / `-inverse.svg` — horizontal lockups (wordmark pre-rendered as paths)
- `public/brand/betterkabugao-social.png` — 1200×630 social preview card (`npm run brand:social`)
- `public/favicon.svg` — browser icon

## Attribution

- Population and PSGC codes: Philippine Statistics Authority (CC BY 4.0)
- Coordinates, schools and map data: © OpenStreetMap contributors (ODbL)
- Municipal officials: Municipality of Kabugao eLGU platform (DICT)
- Weather: Open-Meteo

## Contributing

Read [`docs/START-HERE.md`](docs/START-HERE.md) and then [`CLAUDE.md`](CLAUDE.md) before opening a pull request. Content changes must keep the independence disclaimer and cite an official source, with its date, for every published figure. UI changes need screenshots at 1440 / 1280 / 768 / 390.

Contributors pairing with an AI assistant should also read [`docs/skills/`](docs/skills/README.md).

## Project status

The coming-soon page is live. The multi-page portal described above is built and awaiting review. Transparency data, service guides and language support are sequenced in the roadmap at the bottom of `docs/research/data-tracker.html` — open it in a browser.
