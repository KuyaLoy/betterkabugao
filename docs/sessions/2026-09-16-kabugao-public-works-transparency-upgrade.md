# Public Works transparency upgrade — 16 September 2026

## Phase

Implementation and release completed. No new data rows, map, coordinates, or
runtime data source were added.

## Deliverable

- Design specification: `docs/superpowers/specs/2026-09-16-kabugao-public-works-transparency-upgrade-design.md`
- Baseline feature release: `ffce82c` — 13-record `/projects` register, local
  downloads, homepage preview, contract checks 40/40, and browser QA 10/10.
- Research basis: `docs/research/kabugao-public-works-historical-coverage.md`
  (historical audit commit `c156c9ef`) and the existing Public Works source
  packet/implementation specification.
- Implementation plan: `docs/superpowers/plans/2026-09-16-kabugao-public-works-transparency-upgrade.md`.

## Decisions recorded

- Use an evidence-led ledger: source-dated status, typed money, and contractor
  availability are prominent; no total spend, live-status claim, or allegation.
- Add a five-value status filter and sort sections newest-to-oldest using each
  section's own evidence-date meaning.
- Keep delivery/project records separate from historical appropriations. The
  eight FY2015/FY2017 candidates remain unpublished until manual primary-source
  row review.
- Map is deferred: six flood geometries require documented reuse clearance;
  all other records lack verified coordinates. No estimated barangay pins.
- The proposed homepage interaction is a three-row, source-backed mini-ledger;
  any category switcher is optional, native-button accessible, and only appears
  when the three records span categories. No carousel, autoplay, or aggregate.
- The approved plan has five bounded TDD tasks: data/filter helpers, project
  ledger, homepage mini-ledger, visual/contracts, and focused release QA.
  FY2015/FY2017 rows remain out of code because the committed audit still calls
  them candidates requiring manual primary-row review.
- Delivered source-led sections for the existing 13 rows, newest-first evidence
  ordering, the five-value status filter, prominent typed amounts and contractor
  evidence, and an accessible three-row homepage mini-ledger. The homepage
  category buttons render only because its current three records span categories.
- Corrective UX release: replace repeated white cards and homepage category
  controls with a restrained ruled ledger. The homepage is now always three
  compact source-backed rows; `/projects` shows title, category/location,
  typed amount, and source-dated status first, then an official-source link and
  an expandable contractor/office/review record. On phones, Search stays
  visible while the secondary controls live under `Filter records (N active)`
  with Clear filters. The source-reported-not-live caveat remains visible.

## Release checks

- Focused red/green tests covered section/date helpers, status filtering,
  two-section rendering, contractor availability, homepage selection, and the
  map-free evidence hierarchy.
- Focused browser QA: `npm run qa:projects` passed 20/20 at 390px and 1440px;
  it covers filters, source dates, typed amounts, contractor availability,
  sections, downloads, no map, homepage interaction, and no overflow.
- Final gate: contracts 40/40, unit tests 65/65, typecheck, lint, and production
  build passed. QA evidence is in `docs/qa/checkpoint-projects/`.

## Changed implementation files

`src/data/projects.ts`, `src/pages/ProjectsPage.tsx`, `src/pages/HomePage.tsx`,
`src/styles.css`, `src/App.test.tsx`, `scripts/qa/projects.mjs`, and focused QA
evidence in `docs/qa/checkpoint-projects/`. The corrective UX release changes
only `src/pages/ProjectsPage.tsx`, `src/pages/HomePage.tsx`, `src/styles.css`,
`src/App.test.tsx`, and this continuity note.

## Limits and next approval

DPWH/DBM appropriation evidence does not prove award, start, or completion.
CPES statuses are historical at their evaluation date. No exact Kabugao-specific
pre-2000 project record was verified in the bounded research. DILG FDP, COA,
DPWH CAR, and Apayao 1st DEO remain manual/FOI leads.

Next phase requires an implementation brief from Command Center; map work or
historic-row publication additionally requires Civic Research & Data evidence
and the documented coordinate-rights gate.
