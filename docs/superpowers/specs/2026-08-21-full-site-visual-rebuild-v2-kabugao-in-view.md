# Spec — full-site visual rebuild v2: "Kabugao in View" (Checkpoint 1)

Status: **built, tested, committed on `experiment/full-site-visual-rebuild-v2`;
not pushed, not merged.** Approved for an experimental Cloudflare staging preview
only — never main/production — pending Codex review of the staging URL.

Base: `origin/main` @ `745b8779dd711cc20d478dee82f01101c9ed2c74`.

---

## 1. Why a rebuild, and why this direction

The production site's visual design was reworked from a blank canvas after an
earlier experiment ("Living Civic Atlas / Index") and a first redesign
("Wayfinder") were both rejected. Codex scored the approved direction — **"Kabugao
in View"** — AI-slop 2/10, Distinctiveness 8/10, Kabugao identity 9/10, Visual
appeal 8/10.

The design is **photo-led**: the real place carries the page, not cards, bento
grids, gradient headings, glass, or a data dashboard. What survived every ruling:
a full-bleed sourced Kabugao photograph as the homepage hero; lightweight
navigation over the photo; one Emergency 911 action; search integrated (not in a
card); an unframed four-task strip; a map-first barangay directory with a
communicating list; synchronized map/list selection; a mobile detail sheet; an
accessible list fallback; Inter-only typography; and a restrained
navy/blue/gold/white palette.

## 2. Scope — Checkpoint 1 only

Shared visual tokens/foundations · responsive header (original logo) · responsive
footer · homepage · barangays directory · Poblacion (barangay) detail route ·
search-overlay integration · map/list selection · mobile selected-barangay sheet
· tests + docs.

Explicitly **out of scope**: redesigning the remaining routes (officials,
emergency, about, transparency, explore, services, search, sitemap, 404). Those
keep working and keep their current look. No existing SEO, sitemap, prerender,
CSP, search, or no-JS contract was removed.

## 3. Mandatory corrections honoured (from the approval)

1. **Original logo, not an HTML wordmark.** Header and footer use the real
   repository asset `public/brand/betterkabugao-logo-inverse.svg` (both surfaces
   are dark). No "Kabugao, Apayao" lockup under the mark; "Kabugao" never appears
   twice; aspect ratio preserved (`width="469" height="160"`, CSS height only).
2. **Hero photograph** — Wikimedia Commons File:Dibagat river.JPG, Andrew
   Garnett, Public Domain; self-hosted responsive AVIF/WebP/JPEG; provenance in
   `docs/command-center/source-registry.md`; credit in the place band; no credit
   line over the hero itself. See the source registry for sizes.
3. **Copy safety.** Headline "Know your Kabugao."; sub "Public information for
   Kabugao, Apayao — its 21 barangays, elected officials, and emergency numbers,
   each traced to its source."; place band "Explore Kabugao's 21 barangays." +
   "Find population, location, directions, and source details for every
   barangay." No unqualified "capital of Apayao" in the hero; no "one river
   valley"; no new facts, elevation, or geographic claims in the visible design.
4. **Map/tile policy.** Live OSM tiles only (no self-hosting/prefetch/proxy);
   attribution always visible, including when the mobile sheet is open; explanation
   reads "Pins show the 21 published barangay locations. A municipal boundary is
   not shown in this version." — it does **not** claim no official boundary source
   exists.
5. **Mobile refinements.** Inverse logo fits without competing with 911; 911 +
   menu controls ≥44px; hero search opens the real overlay (no fake input); Enter
   with a query → `/search?q=`; no label collision at 320px; the bottom sheet
   never covers OSM attribution; Escape closes the sheet and restores focus to the
   selected row; the full list works with no JavaScript.

## 4. What changed, file by file

| File | Change |
|---|---|
| `src/styles.css` | +"KABUGAO IN VIEW" layer (~230 lines): masthead over/solid states, photo hero, task strip, place band, barangays atlas, directory, selection sheet (desktop card / mobile fixed bottom sheet), footer overrides, responsive 1024/900/640/520, reduced-motion. |
| `src/components/SiteHeader.tsx` | Rewritten. Inverse logo; `--over` (transparent, over the hero on `/`) vs `--solid` (sticky navy elsewhere); Primary nav; SearchTrigger; one Emergency 911 → `/emergency`; burger + mobile disclosure; Escape closes menu and refocuses the button. |
| `src/components/SiteFooter.tsx` | Rewritten. Inverse logo; Find + Network columns; independence disclaimer; build credit. **No cost figures** (₱0/₱670 stay on `/about`). |
| `src/pages/HomePage.tsx` | Rewritten. `<picture>` photo hero + scrim + headline/sub + integrated SearchTrigger + "Explore" cue; unframed four-task strip; place band (title/lede/figures/CTA/credit) paired with the live 21-pin map. |
| `src/pages/BarangaysPage.tsx` | Rewritten. Map-first atlas: sticky live map + mandated legend + attribution, beside a filtered directory whose rows are real links. Selecting a row (or a pin) highlights the pin, recentres, and opens a detail sheet (card on desktop, fixed bottom sheet ≤900px). Officials-withheld notice kept. |
| `src/components/MapView.tsx` | Extended with `selectedSlug` / `onSelectSlug`; refs for the map + markers; marker-click → `onSelectSlug`; a selection effect highlights the pin (`.map-pin--selected`), opens its popup, recentres. CSP-safe (no inline style; `L.divIcon`; `await import("leaflet")`). |
| `src/App.tsx` | Removed the old `HotlineBar` + `UtilityStrip` mounts. Shell: skip-link → SiteHeader → main(Routes) → SiteFooter → SearchOverlay. |
| `src/App.test.tsx` | Updated to the new shell: header Emergency action (not the removed hotline bar), h1 "Know your Kabugao", figures 16,425 + 935.12 km², section links → `/emergency`. |
| `public/hero/*` | 12 self-hosted PD hero variants (see source registry). |

`src/pages/BarangayDetailPage.tsx` was left unchanged — it already complied
(fact card without elevation, map/directions links, nearest three, officials
note).

## 5. Verification

`npm test` → 36 contract + 45 unit pass. `npm run typecheck`, `npm run lint`,
`npm run build` (PRERENDER_OK 33 pages) all clean. Browser QA (Playwright, served
like Cloudflare Pages) at 320/360/390/768/1280/1440: zero horizontal overflow,
one h1/main per route, zero console/hydration errors, search open/close +
Escape-with-text, Emergency 911 in every header, keyboard map/list selection with
focus return, mobile sheet keeps OSM attribution visible, reduced-motion honoured,
visible focus ring, `/404` excluded from sitemap.xml. Screenshots in
`docs/qa/checkpoint-1/`. Full QA notes in `docs/command-center/active-task.md`.

## 6. Known risks / follow-ups (for Robin & Codex)

- **Pre-existing SEO + `<noscript>` layer still carries flagged copy** (unqualified
  "capital of Apayao"; public-works/procurement words; ₱0/₱670) — global,
  contract-pinned, and outside the visible redesign. Left unchanged deliberately
  (core template + preserved no-JS/SEO contract + all-routes content). Decision
  for Robin: scrub it in a focused follow-up, or leave it. Detail in
  `active-task.md` §5.
- **Dead CSS + unmounted components retained on purpose** (`HotlineBar`,
  `UtilityStrip`, `HotlineDialog`, `useKabugaoNow`, old-design CSS) so existing
  contract tests stay green. Not mounted anywhere. Prune later if desired.
- **Map tiles are blank in the build sandbox** (no external egress); pins +
  attribution render, and tiles are confirmed live on Cloudflare. The
  screenshots therefore show grey map backgrounds — expected, not a defect.
