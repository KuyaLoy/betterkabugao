# ACTIVE TASK — Full-site visual rebuild v2 ("Kabugao in View")

> Context-safety checkpoint. Compaction has happened at least once this
> session. **Any session resuming this work reads this file first, then
> continues from the current working state — do not ask Robin to repeat the
> brief, do not restart the implementation.** Update this file after each major
> milestone.

_Last updated: 2026-08-21 (checkpoint written after compaction, before
finishing `src/App.test.tsx`)._

---

## 0. Git state (verified)

| | |
|---|---|
| Branch | `experiment/full-site-visual-rebuild-v2` |
| Base (origin/main) SHA | `745b8779dd711cc20d478dee82f01101c9ed2c74` |
| HEAD | Checkpoint 1 is **committed** on this branch (`git log -1` for the SHA); **not pushed, not merged** |
| Working tree | clean (all committed) |
| Push command (Robin) | `git push -u origin experiment/full-site-visual-rebuild-v2` |

Branch was cut clean from `origin/main`, **not** from the rejected
"Living Civic Atlas / Index" experiment. The rejected design was stashed
(`git stash push -u`) and never reused.

---

## 1. Files already changed

**Modified (tracked):**

- `src/App.tsx` — removed `HotlineBar` + `UtilityStrip` mounts; shell is now
  skip-link → `SiteHeader` → `main`(Routes) → `SiteFooter` → `SearchOverlay`.
- `src/components/MapView.tsx` — added `selectedSlug` / `onSelectSlug` props;
  `mapRef` + `markersRef` + `onSelectRef`; marker click → `onSelectSlug`;
  selection effect highlights pin (`.map-pin--selected`), opens popup, recentres.
  CSP-safe (no inline style, `L.divIcon`, `await import("leaflet")`).
- `src/components/SiteHeader.tsx` — rewritten. Official inverse logo (no HTML
  wordmark), `--over`/`--solid` states, Primary nav, `SearchTrigger`, one
  Emergency 911 link → `/emergency`, burger + mobile menu, Escape closes menu.
- `src/components/SiteFooter.tsx` — rewritten. Inverse logo, Find + Network
  columns, disclaimer, "Built by Robin Tapiru · MIT · v…". No cost figures.
- `src/pages/HomePage.tsx` — rewritten. Photo hero (`<picture>` avif/webp/jpg),
  approved headline + copy, integrated `SearchTrigger`, unframed 4-task strip,
  place band ("Explore Kabugao's 21 barangays.") + live map + photo credit.
- `src/pages/BarangaysPage.tsx` — rewritten. Large live map + filtered directory,
  map/list selection sync, desktop card / mobile bottom sheet (`kv-sheet`),
  accessible no-JS row links, OSM attribution always visible, officials-withheld
  notice. Mandated map explanation in `kv-atlas__legend`.
- `src/styles.css` — appended ~230-line "KABUGAO IN VIEW" layer (mast, hero,
  desk strip, place band, atlas, dir, sheet, footer overrides, responsive at
  1024/900/640/520, reduced-motion). Final rule `.kv-place__text { min-width: 0; }`.

**New (untracked): `public/hero/` — 12 self-hosted PD hero variants**

| width | avif | webp | jpg |
|---|---|---|---|
| 480 | 29,084 | 45,078 | 46,083 |
| 640 | 52,153 | 80,810 | 82,009 |
| 960 | 113,784 | 179,720 | 184,511 |
| 1280 | 197,762 | 313,358 | 332,343 |

(bytes; from a verified 1280×950 public-domain master — no upscaling.)

**KEPT unchanged (already compliant):** `src/pages/BarangayDetailPage.tsx`.

**KEPT but unmounted (only to satisfy existing contract tests — see Risks):**
`src/components/HotlineBar.tsx`, `UtilityStrip.tsx`, `HotlineDialog.tsx`,
`src/lib/useKabugaoNow.ts`, and their CSS.

---

## 2. Tests already run — ALL GREEN

- `npm test` — **36 contract + 45 unit = 81 pass** (App.test.tsx updated to the
  new shell + one hero-cue `<svg aria-hidden>` fix).
- `npm run typecheck` — **clean**.
- `npm run lint` — **clean**.
- `npm run build` — **PRERENDER_OK 33 pages** (client + SSR + prerender).
- Visible SSR body scan on `/`, `/government/barangays`,
  `/government/barangays/poblacion` — **clean** of every flagged token
  ("capital of Apayao", flood control, contractor, funding source, procurement,
  132 m, Elevation, 1st class, ₱). The visible "Kabugao in View" design is
  fully compliant.

## 2b. Browser QA — COMPLETE (Playwright, served like Cloudflare Pages)

QA must be run against a static server that resolves clean URLs to the
prerendered files (`/about` → `dist/about/index.html`). `vite preview` does an
SPA fallback and serves the homepage for every non-root URL — that produced a
**false** React #418 hydration error on all non-home routes. Served correctly
(the way Cloudflare Pages serves), **all routes have 0 hydration errors**.
Harnesses: `/tmp/static.cjs` (server, port 4180), `/tmp/qa-run2.cjs`,
`/tmp/a11y.cjs`. Report: `docs/qa/checkpoint-1/qa-report.json`.

Verified at 320 / 360 / 390 / 768 / 1280 / 1440:
- Horizontal overflow: **0** routes at every breakpoint.
- Exactly one `<h1>` and one `<main>` on every route.
- Console/page errors (non-tile): **0**.
- Search opens from the header trigger AND the hero search; **Escape closes it
  with text entered**; hero search opens the real overlay (not a fake input).
- Emergency 911 present in the header on every route → `/emergency`.
- Keyboard selection: Enter on a row selects (aria-current), Escape closes the
  sheet and returns focus to the row.
- Mobile bottom sheet (320/360/390): OSM attribution visible AND topmost — four
  sources above/within the sheet (Leaflet control, `.map__note`,
  `.kv-atlas__legend`, `.kv-sheet__attr`).
- Reduced-motion: hero animations disabled (`animationName: none`).
- Visible focus: 3px `#0066eb` outline (skip-link first).
- `/404` excluded from `sitemap.xml`; no-JS list rows are real anchors.

**One real bug found and fixed during QA:** `.kv-sheet__name` (an `<h2>`) was
dark-on-navy because `.section h2` (0,1,1) overrode `.kv-sheet__name` (0,1,0).
Fixed with `.kv-sheet__head .kv-sheet__name` (0,2,0) → now `#fff`. Re-tested +
rebuilt; screenshots re-captured.

Screenshots in `docs/qa/checkpoint-1/`: home-{desktop,mobile}, barangays-
{desktop,mobile}, poblacion-{desktop,mobile}, search-open-{desktop,mobile},
barangays-sheet-{desktop,mobile}, focus-visible-desktop, qa-report.json.

---

## 3. Implementation progress (Checkpoint 1)

| # | Item | Status |
|---|---|---|
| 1 | Shared visual tokens / foundations (`styles.css`) | done |
| 2 | Responsive header w/ original inverse logo | done |
| 3 | Responsive footer w/ inverse logo | done |
| 4 | Homepage (photo hero, search, task strip, place band + map) | done |
| 5 | Barangays directory (map + list) | done |
| 6 | Poblacion / barangay detail route | kept (compliant) |
| 7 | Search overlay integration (header + hero triggers) | done |
| 8 | Map/list selection sync | done |
| 9 | Mobile selected-barangay sheet | done |
| 10 | Tests + docs | in progress |

---

## 4. Remaining checkpoint work

1. **Finish `src/App.test.tsx`** — 4 targeted edits (site-shell emergency
   assertion; home h1 → "Know your Kabugao"; home figures → 16,425 + 935.12 km²
   only; section hrefs → /emergency not /transparency) + rewrite the
   "emergency hotlines … on every page" test to check the header Emergency 911
   action instead of the removed HotlineBar. Then run `npm run test:unit`.
2. **Docs:** `docs/command-center/source-registry.md` (hero image provenance),
   design spec under `docs/superpowers/specs/`, session log under
   `docs/sessions/`, update `docs/START-HERE.md` + `docs/CONTEXT.md`.
3. **Full gates:** `npm test && npm run typecheck && npm run lint && npm run build`.
4. **QA** at 320 / 360 / 390 / 768 / 1280 / 1440: no horizontal overflow; one h1
   + one main per route; no serious console/hydration errors; search open/close +
   Escape-with-text; Emergency 911 present; keyboard map/list selection; visible
   focus; reduced-motion; OSM attribution always visible (incl. when mobile sheet
   open); `/404` excluded from sitemap.xml.
5. **Screenshots:** homepage / barangays / Poblacion / search-open (desktop +
   mobile) + mobile selected-barangay sheet.
6. **Commit** on `experiment/full-site-visual-rebuild-v2` — **do NOT push or merge.**
7. **Handoff block for Robin** (via Codex): base SHA, final commit SHA, exact
   changed files, test/build results, screenshot paths, image asset paths+sizes,
   known risks, exact push command
   `git push -u origin experiment/full-site-visual-rebuild-v2`.
8. **STOP** — do not continue to remaining pages until Codex reviews the
   Cloudflare staging URL.

---

## 5. Risks / unresolved decisions

- **DECISION NEEDED — pre-existing SEO + no-JS layer still carries flagged copy.**
  The visible redesign is clean, but two pre-existing, contract-protected,
  **global** (all-routes) surfaces still contain material the copy mandate flags:
  - The shared homepage SEO meta description (from `src/lib/seo.ts`, rendered
    into `<meta name/og/twitter:description>`) says "Kabugao, the capital of
    Apayao" — an unqualified capital claim.
  - The global `<noscript>` fallback in `index.html` says "Kabugao is the capital
    of Apayao … 1st-class municipality, PSGC 1408104000", lists public-works /
    procurement vocabulary ("flood control, roads, bridges, drainage, water
    systems … budget, funding source and contractor"), and prints "₱0 … ₱670".
  - **Not changed** because it touches a core template file (`index.html`) +
    `seo.ts`, a preserved no-JS/SEO contract, and global content across all 32
    routes — four separate stop-and-ask triggers. Also `1408104000`, `132 m`,
    `1st class`, `₱0`, `₱670` are **required** in `src/app/site-content.ts` by
    contract tests (site-contracts lines 109/110/114/117/128), and the noscript
    must keep "21 barangays / 16,425 / Robin Tapiru / not the official website"
    (lines 139–141). The flagged *sentences* in the noscript are NOT pinned, so
    they can be reworded on approval while keeping the required phrases; the
    ₱0/₱670 contract is on site-content.ts, not the noscript.
  - **Ask Robin:** scrub this pre-existing SEO+noscript layer to match the copy
    mandate (a focused, all-routes follow-up), or leave it for a later pass?
- **Dead CSS + unmounted components retained on purpose.** `HotlineBar`,
  `UtilityStrip`, `HotlineDialog`, `useKabugaoNow`, and old-design CSS are still
  in the tree only so the existing contract tests keep passing. They are not
  mounted anywhere. Flag in handoff; pruning is a later decision, not this
  checkpoint.
- **No commit yet.** Everything is uncommitted in the working tree. A crash
  loses it — commit is the last implementation step before handoff.
- **Build not re-run** against the rebuild since the page rewrites; prerender
  contract tests only truly exercise after `npm run build`.

---

## PINNED APPROVED DECISIONS (do not relitigate)

**Direction:** "Kabugao in View". **Status:** approved for the experimental
Cloudflare **staging** preview only — NOT main/production. Robin pushes after
handoff; Codex reviews the staging URL before any further pages.

**Scope (Checkpoint 1 only):** shared foundations, header, footer, homepage,
barangays directory, Poblacion detail, search integration, map/list interaction,
mobile detail sheet. Do **not** redesign remaining routes yet. Do **not** push or
merge.

**Brand:** use the original approved logo assets exactly —
`public/brand/betterkabugao-logo-inverse.svg` on dark/photo,
`public/brand/betterkabugao-logo.svg` on light. Do not recreate the wordmark in
HTML text. Do not add "Kabugao, Apayao" beneath the logo. "Kabugao" must not
appear twice in the lockup.

**Hero:** headline "Know your Kabugao."; copy "Public information for Kabugao,
Apayao — its 21 barangays, elected officials, and emergency numbers, each traced
to its source."; photo Wikimedia Commons **File:Dibagat river.JPG**, photographer
**Andrew Garnett**, license **Public domain**; self-hosted responsive variants;
record source + credit; no unqualified "capital of Apayao" language in the hero.

**Map:** verified barangay points + normal **live** OSM tiles
(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`). Never fabricate a municipal
boundary. Do **not** download / prefetch / proxy / bundle / self-host OSM raster
tiles. Keep OSM attribution visible at all times; the mobile bottom sheet must
never cover it. Map explanation: "Pins show the 21 published barangay locations.
A municipal boundary is not shown in this version." Do not claim no official
boundary source exists.

**Copy:** "Explore Kabugao's 21 barangays."; removed "one river valley";
approved facts only; no new elevation or geographic claims; ₱0 / ₱670 stays on
`/about` only (never in the footer); no locked budget / procurement / contractor /
flood-control / public-works vocabulary.

**Behavior to preserve:** existing routes; SEO + prerendering; CSP; search
overlay + keyboard shortcuts; Escape with text entered; `/search?q=` fallback;
emergency access; accessible no-JS links; sitemap contracts; `/404` exclusion.

**QA:** run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`;
test 320 / 360 / 390 / 768 / 1280 / 1440; capture homepage / barangay / Poblacion
/ search / mobile-sheet screenshots.
