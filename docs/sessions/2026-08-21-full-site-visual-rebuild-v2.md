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

## What is left

Robin pushes `experiment/full-site-visual-rebuild-v2` (correction commit);
Cloudflare builds a branch preview; Codex does final QA on the staging URL.
**No further pages / no Checkpoint 2** until that final QA. The legacy
SEO/`<noscript>` copy (capital claim, public-works words, ₱0/₱670) remains a
recorded production blocker for a separate, approved follow-up — untouched here.
