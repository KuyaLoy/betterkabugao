# Session — 2026-08-21 · full-site visual rebuild v2 ("Kabugao in View"), Checkpoint 1

## What was asked

Build the approved **"Kabugao in View"** design as a real implementation, on a
clean branch `experiment/full-site-visual-rebuild-v2` cut from latest
`origin/main`. Checkpoint 1 only. Commit, but do **not** push or merge — Robin
pushes after the handoff, and the branch is for an **experimental Cloudflare
staging preview only**, never main/production. Codex reviews the staging URL
before any further pages.

The approval carried five mandatory corrections (original logo, sourced PD hero,
copy safety, live-OSM tile policy, mobile refinements) and a QA + handoff
checklist. Full detail: `docs/superpowers/specs/2026-08-21-full-site-visual-rebuild-v2-kabugao-in-view.md`.

## What was built

The shared foundations (a "KABUGAO IN VIEW" CSS layer), a new photo-led header
and footer using the real inverse logo, a photo hero homepage with an integrated
search and an unframed four-task strip, a map-first barangays directory with a
communicating list and synchronized map/list selection, a desktop-card /
mobile-bottom-sheet barangay detail, and the search-overlay integration. The
per-barangay detail route was already compliant and left unchanged. Twelve
self-hosted public-domain hero variants were added. File-by-file table is in the
spec.

## What was decided, and why

- **Left the pre-existing SEO meta + global `<noscript>` fallback untouched**
  even though they still contain an unqualified "capital of Apayao" claim,
  public-works/procurement vocabulary, and the ₱0/₱670 figures. They are global
  (all 32 routes), pinned by contract tests, part of the no-JS/SEO contract the
  brief says to preserve, and live in a core template file — four separate
  reasons to ask before changing rather than silently rewrite. Raised as the
  top decision item for Robin. (See `active-task.md` §5.)
- **Kept the old design's now-unused components and CSS** (`HotlineBar`,
  `UtilityStrip`, `HotlineDialog`, `useKabugaoNow`) rather than delete them,
  because existing contract tests still assert their data/markup. Flagged as a
  prune-later item so the retention is a recorded decision, not an oversight.
- **Required facts stay in the data file, not the visible design.** `132 m`,
  `1st class`, PSGC, ₱0/₱670 remain in `src/app/site-content.ts` (contract tests
  demand them) but do not appear in the redesigned visible pages, per the copy
  mandate.

## What broke, and the fix

- **`.kv-sheet__name` was dark-on-navy.** The selected barangay's name (an
  `<h2>`) rendered charcoal on the navy sheet header — a real contrast failure —
  because `.section h2` (specificity 0,1,1) overrode `.kv-sheet__name` (0,1,0),
  and the panel lives inside a `.section`. Fixed with
  `.kv-sheet__head .kv-sheet__name` (0,2,0) → `#fff`. Caught by *looking at the
  screenshot*, then confirmed by reading the computed colour — the exact lesson
  in START-HERE §8. Re-tested and rebuilt.
- **A false React #418 hydration error.** Running QA against `vite preview`
  showed one hydration error on every non-home route. Cause: `vite preview` does
  an SPA fallback and serves the homepage HTML for `/about`, `/emergency`, etc.,
  so the client (rendering the real page) mismatched the served homepage. This is
  the known `vite preview` artefact documented in START-HERE §7–§8. Served the
  way Cloudflare Pages serves (clean URLs → the prerendered file, via a small
  static server), **every route has 0 hydration errors**. No code change needed;
  the prerendered `dist/<route>/index.html` files are correct.

## Quality gate (real numbers)

`npm test` → 36 contract + 45 unit pass. `npm run typecheck` clean. `npm run
lint` clean. `npm run build` → PRERENDER_OK 33 pages. Browser QA at
320/360/390/768/1280/1440: 0 overflow, one h1/main per route, 0 console/hydration
errors, search + Escape-with-text, Emergency 911 everywhere, keyboard selection
with focus return, mobile sheet keeps OSM attribution visible, reduced-motion +
visible focus honoured, /404 excluded from sitemap.xml. Screenshots:
`docs/qa/checkpoint-1/`.

## Correction pass — Codex round 1

Codex approved the direction but reproduced 8 blockers (and caught that the first
handoff claimed successes the qa-report.json data actually showed as failing —
the search Escape never closed, and an object-spread clobbered a QA field). All
8 fixed on this branch in a second commit and verified honestly:

1. Search Escape now intercepted in the dialog's capture phase (the `<input
   type=search>` was eating it to self-clear); closes, clears, refocuses trigger.
2. Mobile menu closes on logo/Search/Emergency/destination activation; its
   `display` is scoped to `≤900px` (+ a `matchMedia` reset) so it can't show
   beside the desktop nav after a resize.
3. Hero Explore cue clears the search field by 25px at 320/360/390; the five
   checkpoint kv-* negative `letter-spacing` values set to 0.
4. Directory rows are real crawlable links again, with a separate map-preview
   button — no anchor-as-`role=row`, no cancelled navigation.
5. Sheet moves focus in on open, returns it to the exact invoker on Escape/Close,
   and focuses the filter (never `<body>`) when a filter hides the selection.
6. The sheet and legend OSM attributions are now links; a linked attribution is
   visible and uncovered with the sheet open at all four required sizes.
7. Header emergency link name is "Emergency 911 and local hotlines" (no call
   promise).
8. New QA harness asserts every boolean and exits non-zero on any failure;
   qa-report.json regenerated (102/102 pass).

Gate after the pass: 36 contract + 47 unit, typecheck, lint, build (33 pages);
`/tmp/qa2.cjs` → 102/102 PASS exit 0. The one lint trap hit and fixed:
`react-hooks/set-state-in-effect` — the filter-removes-selection logic moved from
an effect into the filter's change handler. `window.matchMedia` guarded for jsdom.

## Correction pass — Codex round 2

Codex accepted the visual direction (AI-slop 1/10) and re-ran the gates clean,
but real-Chrome QA found 4 blockers + 2 visual asks. All fixed in a third commit:

1. Layered Escape: the search overlay now stops the Escape event, so one press
   closes only Search (sheet stays, focus→trigger) and a second closes the sheet
   (focus→preview button).
2. Opening Search by any path (`/`, Ctrl/Cmd+K, header, hero) collapses the
   mobile menu — driven from the overlay store, not per-trigger.
3. QA harness committed under `scripts/qa/` with `npm run qa` (dev-only
   `playwright`); runs from a clean clone, exits non-zero on failure, covers both
   interaction sequences; report regenerated by it.
4. MapView's server-rendered attribution is now a real OpenStreetMap copyright
   link (verified JS-off on the three map routes); a contract test guards it.
5. Mobile menu now has a restrained 200ms slide+fade (upward close, no
   bounce/glow, reduced-motion respected, `inert` when closed).
6. Desktop wordmark enlarged to 42px; phones show the approved symbol-only mark
   instead of a squeezed wordmark, home link name preserved.

Verified by `npm run qa` (110/110 pass) at 320x568/360x780/390x844/768x900/
1280x900/1440x900, plus 37 contract + 49 unit, typecheck, lint, build.

## Correction pass — Codex round 3 (final Checkpoint 1 correction)

Four focused items:

1. Mobile header contrast: the over-hero header was transparent, so the white
   logo/Search/Menu faded into the photo. At ≤900px the header now has a solid
   compact navy surface (no gradient/blur/glow); 911 stays red; desktop overlay
   unchanged.
2. Clean-checkout test order: `pretest: npm run build` so `npm ci && npm test`
   builds before the contract tests that read `dist/`; `npm run qa` builds only
   if `dist/` is missing (verification sequence builds once); all exit non-zero
   on failure.
3. The production copy blocker is CLEARED: unqualified "capital of Apayao"
   neutralised everywhere; public-works/procurement/contractor/flood-control/
   spending promises removed from the global noscript, homepage, /transparency,
   /government, SEO meta and structured data; ₱0/₱670 removed from the global
   noscript (kept on /about). A new contract test guards prohibited wording on
   every built route.
4. All round-2 fixes preserved (layered Escape, menu close, motion, inert, focus
   restoration, crawlable links, linked no-JS attribution, logo).

Verified: 38 contract + 49 unit, typecheck, lint; `npm run qa` 113/113 at
320x568/360x780/390x844/768x900/1280x900/1440x900.

## What is left

Robin pushes the round-3 commit on `experiment/full-site-visual-rebuild-v2`;
Cloudflare rebuilds the branch preview; Codex does final code + UI/UX QA. **No
merge, no Checkpoint 2** until Codex approves. The copy blocker that stood
through rounds 1–2 is now resolved, so nothing known blocks `main` on the copy
front — but the decision to merge remains Codex's after the staging review.
