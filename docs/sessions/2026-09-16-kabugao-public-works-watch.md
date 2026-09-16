# Public Works Watch — 16 September 2026

## Scope

The MVP publishes a local, manually reviewed 13-record register at `/projects` and a three-record homepage preview. It uses no runtime project API, map, coordinate, PDF reproduction, or aggregate peso total.

## Provenance decisions

- DPWH and DBM linked records are authoritative; BetterGov remains discovery/cross-check only.
- DPWH CPES “contract amount” is retained verbatim rather than recast as an award or ABC.
- Rows with no source-published reference use an internal review key only and visibly say that the official reference was not published in the reviewed source.
- Appropriation rows have no source-reported project status and visibly say so. Historical CPES status is labelled with its evaluation date and never treated as current.
- Records without a verified amount type keep that absence explicit. No money total is shown.
- No row has verified WGS84 coordinates; locations are source text only.

## Review cadence

Whole-register review: quarterly. A row whose official source explicitly says ongoing is reviewed monthly. Current source review: 16 September 2026.

## Verification

Focused data/route/homepage tests and one mobile/desktop `/projects` browser pass are recorded with the release commit. The final automated gate covers contracts, unit tests, typecheck, lint, and production build.

### Release evidence

- Focused tests: 4 Public Works Watch assertions passed (data integrity, deterministic filters, route content, homepage preview).
- Production build, typecheck, and lint passed before final release review.
- Contracts: `npm run test:contracts` passed 40/40 on 16 September 2026.
- Browser QA: `npm run qa:projects` passed 10/10 at 390px and 1440px, covering the 13 records, combined filters, empty state, local CSV/JSON downloads, and horizontal-overflow checks. Screenshots and the machine-readable result live in `docs/qa/checkpoint-projects/`.

## Source limitations carried into the release

- Five historical DPWH flood-control rows publish a contractor and CPES evaluation data but not a safe, typed monetary field in the reviewed extract; their amount list is intentionally blank.
- Two FY 2026 GAA rows have no source-published office, contractor, status, or official reference in the reviewed source. They retain their internal review keys and label every unavailable field.
- The CPES source calls one monetary field “contract amount”; the site preserves that label instead of guessing that it is an ABC or award.
