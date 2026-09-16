# Public Works transparency upgrade — 16 September 2026

## Phase

Documentation-only design handoff. No production code, data rows, map, or QA
artefacts were changed.

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

## Limits and next approval

DPWH/DBM appropriation evidence does not prove award, start, or completion.
CPES statuses are historical at their evaluation date. No exact Kabugao-specific
pre-2000 project record was verified in the bounded research. DILG FDP, COA,
DPWH CAR, and Apayao 1st DEO remain manual/FOI leads.

Next phase requires an implementation brief from Command Center; map work or
historic-row publication additionally requires Civic Research & Data evidence
and the documented coordinate-rights gate.
