# Session — 17 Aug 2026: v1, the real multi-page site

Previous: `2026-08-16-v2-rebuild-from-research.md` (coming-soon v2, merged to
`main` as `9608dd6`).

## What Robin asked for

> "don add in the first page i ened this like in separate page nad like i need
> like site/barangaylist/barangay like they have each page … and like i nned
> proper home like other not coming soon anymore as we are now building the
> actual website"

> "every data has its own pages like kabugao officials mayor etch like that
> like oither pages like htehey banner with i think search go atleast 15 lgu
> websiute check how the website build"

Plus, from the message before: container 1440 or 1560, clean, design derived
from the network but improved, good SEO, fast, user-friendly, mobile.

## Research done first (15 repos)

`design-research/ARCHITECTURE.md` — route frequency across 15 cloned LGU
repos, reproducible script included. The findings that decided the build:

- `/government` and `/services` are the most common routes (11/15).
- **Only one site in the whole network has barangay pages**
  (`bettercabanatuan`: `/government/barangays` + `/government/barangays/:slug`).
  We adopted that shape rather than Robin's sketch `site/barangaylist/barangay`,
  because matching the single prior implementation keeps the network
  navigable. **Flag for Robin — this is a deviation from what he typed.**
- Officials pages have three competing conventions; we use
  `/government/officials` (reads as what it is, nests under the common hub).
- **6 of 15 declare a bare catch-all `/:documentSlug`** that swallows typos
  into an empty document page. We deliberately don't.
- **10 of 16 are client-only SPAs** whose own `sitemap.xml` advertises URLs
  that all return the same `<title>`. Facebook/Messenger/Viber never run JS,
  so every shared link previews as the homepage. This is the network's biggest
  defect.

## What was built

31 prerendered routes. `vite build --ssr` + `scripts/prerender.mjs` writes one
real HTML file per route with its own title, description, canonical, OG tags
and `BreadcrumbList` JSON-LD. `hydrateRoot` when prerendered HTML exists,
`createRoot` for `npm run dev`.

| Page | Route |
|---|---|
| Home (real homepage, not coming-soon) | `/` |
| Government hub | `/government` |
| Elected officials | `/government/officials` |
| All 21 barangays (banner + live filter) | `/government/barangays` |
| One page per barangay | `/government/barangays/:slug` × 21 |
| Transparency (schema preview, no data) | `/transparency` |
| Explore / Services / About / Search | `/explore` `/services` `/about` `/search` |
| 404 | `*` → `dist/404.html` |

- `src/lib/seo.ts` — `ALL_PATHS` (31) is the single source for the prerenderer
  *and* the sitemap. Add a route in one place.
- `src/components/PageHeader.tsx` — `variant="hero"` (solid navy, section
  landings) / `"compact"` (white, detail pages), breadcrumbs inside the band.
  It renders a `<div>`, not a `<header>`: a second `<header>` created a
  duplicate `banner` landmark.
- `src/lib/search.ts` + `SiteSearch` — zero-dependency scored search over a
  module-scope index. AND semantics; title-exact 120 → prefix 80 → substring
  50 → keywords 25 → summary 10.
- Barangay detail pages carry population, share, rank, PSGC, coordinates,
  classification, former name, schools, **nearest three barangays with
  haversine distances**, Google Maps view + driving directions.
- `useSyncExternalStore` for the clock (no `set-state-in-effect`, no hydration
  mismatch, server snapshot returns `null`).

## Verification

- 27 contract tests + 20 unit tests green; lint and typecheck clean.
- `design-research/V1-VISUAL-CHECK.md` — 26 captures at 1440/1280/768/390,
  measured against `_measurements.json`. Six real layout defects were found
  **only by looking at the screenshots** while the tests were green; all six
  fixed and listed in that file. The worst: mobile nav used `overflow-x: auto`
  so two of six sections were unreachable on a phone.
- New contract test pins the prerender guarantees — 30+ routes written,
  distinct titles, own canonical, >2000 chars of server-rendered body,
  BreadcrumbList JSON-LD, no inline executable script, `dist/404.html`.

## Maps (second checkpoint, same day)

> "can we show like home page one section like the kabugao map and in the
> barangrap like google map embeded too is taht possible?"

Presented four options with their real costs. Robin chose **Leaflet +
OpenStreetMap tiles**. A Google embed was possible but needed `frame-src` added
to the CSP, a Google tracker on 22 pages, and an API key with billing on file.

Two findings from the research phase worth keeping:

- **OSM has no boundary polygon for the municipality of Kabugao** — only a
  point node. The province of Apayao has one (relation 52296). A real municipal
  outline would have to come from the PSA/NAMRIA boundary set on HDX
  (CC BY-IGO), which ships as a 360 MB–1 GB download.
- `style-src 'self'` blocks `setAttribute("style", …)` but **not**
  `el.style.prop = …`. Measured in Chromium with the real header, not assumed.
  That is why Leaflet works here at all.

Built: `src/components/MapView.tsx` — lazy-loaded, SSR-safe, addressed by
barangay slug so its effect deps stay primitive, `divIcon` markers so no icon
image is ever requested, and a server-rendered fallback carrying the same
map/directions links for visitors without JavaScript.

See `design-research/V1-VISUAL-CHECK.md` §5 for the verification table and the
three defects the screenshots caught that the assertions had passed.

## Cleaned up

- Deleted 8 unused coming-soon components (`Hero`, `IntroSection`,
  `MissionSection`, `ServicesSection`, `TransparencySection`, `ExploreSection`,
  `BarangaySection`, `OfficialsSection`) — moved to
  `_to_delete/dead-coming-soon/` on Robin's machine because the bridge cannot
  delete files.
- Removed a `display: none` `<SiteSearch />` left on the barangays page.
- Rewrote `parseBarangays()` to read fields individually, so adding a field
  never silently breaks the SEO build again.

## Open items

- **Robin's Facebook / Instagram / Threads URLs** — still blocking the
  BetterLGU directory PR (row → `betterkabugao.org` + socials, 🔵 Planned → 🟢 Active).
- HTML `/sitemap` page (8 of 15 network sites have one).
- The 43 third-party reference screenshots in `design-research/` are **not
  committed** — they are screenshots of other people's sites and 16 MB. They
  live on Robin's machine only. `RESEARCH.md` names them.
- `_headers` / `_routes.json` review for the multi-page deploy.
- `package.json` licence says ISC, the footer says MIT · CC BY 4.0.
- Verified Kabugao hotline numbers (911 only until then).
- BLGF licence: email `lfdad@blgf.gov.ph` before publishing their data.
- Robin to delete `_to_delete/` and any `.git/index.lock`.

## Note to future sessions

**Do not run git commands on Robin's machine.** The bridge cannot remove
`.git/index.lock`, so every `git status` there leaves a lock file he has to
delete by hand. Sync files, then hand him the commands.
