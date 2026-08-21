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

## 2c. Correction pass — Codex round 1 (all 8 blockers fixed + verified)

Codex approved the direction but reproduced 8 blockers. All fixed on this branch
(second commit) and verified — `npm test` 36 contract + **47** unit, typecheck,
lint, build PRERENDER_OK 33; the honest harness `/tmp/qa2.cjs` reports
**102/102 checks PASS, exit 0** (report regenerated at
`docs/qa/checkpoint-1/qa-report.json`).

1. **Search Escape** — added a capture-phase `onKeyDownCapture` on the `<dialog>`
   in `SearchOverlay.tsx`: `<input type="search">` was consuming Escape to clear
   itself (Chromium), swallowing the dialog close. Now Escape (with a query
   typed) closes, clears, and returns focus to the exact trigger. Regression
   unit test added; verified desktop + mobile.
2. **Mobile nav** — logo/Search/Emergency now close the menu (`onClick` +
   `onActivate` prop on `SearchTrigger`); `.mast__menu`/`--open` `display` moved
   inside `@media (max-width:900px)` so it can't render beside desktop nav; a
   guarded `matchMedia` listener drops the open state on resize to desktop.
3. **Homepage mobile spacing** — hero `padding-block` bottom 52→84px; Explore
   cue now clears the search field by **25px** at 320/360/390. Negative
   `letter-spacing` on the 5 checkpoint kv-* rules set to `0`.
4. **Directory semantics** — rows are now `<li>` with a real crawlable
   `<a class="kv-dir__link">` (normal nav, Ctrl/Cmd-click, open-in-new-tab) plus
   a **separate** `<button class="kv-dir__preview">` map-preview control. No more
   anchor-as-`role=row` with cancelled navigation.
5. **Sheet focus** — opening moves focus into the sheet (close button); Escape
   and Close return focus to the exact invoker (preview button, or map region
   for pin-initiated); filtering out the selection closes the sheet and focuses
   the filter (never `<body>`). Filter-out handled in the change event, not an
   effect (`react-hooks/set-state-in-effect`).
6. **OSM attribution** — the sheet's own attribution and the atlas legend are
   now **links** to `openstreetmap.org/copyright`; a linked attribution is
   visible & uncovered with the sheet open at 320x568, 320x640, 390x844, 768x900.
7. **Emergency label** — header link accessible name is now "Emergency 911 and
   local hotlines" (no longer promises to place a call), href `/emergency`.
8. **QA honesty** — new harness asserts every required boolean and **exits
   non-zero on any failure**; no object-spread key clobbering. The old report's
   misleading `closedByEscapeWithText:false` / clobbered `kbd-select` are gone.

Harnesses (round 1, uncommitted): `/tmp/static.cjs`, `/tmp/qa2.cjs`,
`/tmp/shots.cjs` — superseded in round 2 by the committed `scripts/qa/`.

## 2d. Correction pass — Codex round 2 (4 blockers + 2 visual corrections)

Codex accepted the direction (AI-slop 1/10, distinctiveness 8/10) and re-ran the
gates clean, but real-Chrome testing found 4 blockers + 2 visual asks. All fixed
in a third commit and verified by the **committed** harness: `npm run qa` →
**110/110 checks PASS, exit 0** (report at `docs/qa/checkpoint-1/qa-report.json`).
Gates: 37 contract + 49 unit pass; typecheck + lint clean; build PRERENDER_OK 33.

1. **Layered Escape (P1)** — the search overlay's capture-phase Escape handler now
   `stopPropagation()`s, so one Escape no longer reaches BarangaysPage's document
   sheet-listener. 1st Escape closes only Search (focus→trigger, sheet stays);
   2nd Escape closes the sheet (focus→preview button). Regression test added.
2. **Keyboard search left the menu open (P1)** — `SiteHeader` now subscribes to
   the overlay store and collapses the menu whenever the overlay opens, covering
   `/`, Ctrl/Cmd+K, header and hero. aria-expanded is false after open and after
   navigation. Regression test added (menu → `/` → result nav).
3. **QA not reproducible (P2)** — harness committed under `scripts/qa/`
   (`serve.mjs` + `checkpoint1.mjs`), `npm run qa` added, `playwright` added as a
   dev-only dependency. Runs from a clean clone, exits non-zero on failure, covers
   both interaction sequences. Report regenerated by the committed harness.
4. **Prerendered OSM attribution not linked (P2)** — MapView's server-rendered
   `.map__note` is now a real `<a href=".../copyright">OpenStreetMap</a>`. Verified
   JS-off on `/`, `/government/barangays`, `/government/barangays/poblacion`.
   Contract test added against built output (site-contracts).
5. **Mobile menu motion** — restrained 200ms ease-out slide (`translateY`) + fade;
   closes upward; no bounce/glow/blur; `prefers-reduced-motion` → no transition;
   `inert` when closed so hidden links aren't focusable; position:absolute so
   header controls don't shift.
6. **Logo** — desktop full wordmark enlarged 34→42px (balanced header); phones
   (≤640px) show the approved symbol-only mark (`betterkabugao-mark-inverse.svg`,
   36–40px), never the squeezed wordmark; home link keeps name
   "BetterKabugao.org home".

Verified header/menu at 320x568, 360x780, 390x844, 768x900, 1280x900, 1440x900.
Committed harness: `scripts/qa/serve.mjs`, `scripts/qa/checkpoint1.mjs`
(`npm run qa`).

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
