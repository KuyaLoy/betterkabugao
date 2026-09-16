# Public Works Watch — transparency upgrade design

**Status:** approved design handoff; documentation only
**Owner:** Development for implementation; Civic Research & Data for any new rows or map-rights decision
**Existing surface:** `/projects` and its homepage preview
**Purpose:** make published project evidence easier to inspect without implying a live audit, completion verification, or allegation of wrongdoing.

## Product decision

Treat the page as an **evidence ledger**, not a dashboard. A resident should be
able to answer, at a glance: what source describes this item, what amount did
that source publish and what kind of amount is it, who is named as contractor,
and what status did the source report on a stated date. The source link remains
the action with the most visual importance after the project title.

The current 13-record register remains a curated starter, not an exhaustive
inventory. Its visible copy must say that status is source-dated, not a live
check. No corruption, quality, delay, or procurement-compliance conclusion is
calculated or suggested.

## First release scope

1. Reframe the existing 13 records in two clearly labelled sections, each
   newest-to-oldest by the date semantics below:
   - **Project register** — contract/CPES and source-linked delivery records.
   - **Historical appropriations** — a separate section only after each row is
     manually rechecked against its named primary PDF and direct source URL.
     Until that release gate passes, the eight FY2015/FY2017 entries in the
     historical coverage audit remain research candidates, not public rows.
2. Add a native **Status** filter: All statuses, Completed, Ongoing, Planned,
   Cancelled, and Not stated. It composes conjunctively with current text,
   category, year, and location controls.
3. Redesign each record around an evidence strip: status, typed amount, and
   contractor are directly below the title; exact source/review dates and the
   official source action remain adjacent, not buried in body copy.
4. Preserve local typed data, static CSV/JSON downloads, SSR output, and the
   current source disclaimer. Do not add a runtime API, aggregate peso total,
   complaint feature, or map in this release.

## Data contract and sorting

The existing `PublicWorksProject` model needs a presentation-safe extension;
this does not change what a source can prove.

```ts
type ProjectSection = "register" | "historical-appropriation";
type StatusValue = "planned" | "ongoing" | "completed" | "cancelled" | "not stated";

type EvidenceDate = {
  value: string; // ISO YYYY-MM-DD only when the cited source supplies it
  label: "status as of" | "appropriation year" | "source publication date";
};

type CoordinateEvidence =
  | { kind: "none" }
  | {
      kind: "official-wgs84";
      longitude: number;
      latitude: number;
      sourceUrl: string;
      rights: "cleared";
      reviewedOn: string;
    };

type TransparencyProject = PublicWorksProject & {
  section: ProjectSection;
  evidenceDate: EvidenceDate;
  coordinateEvidence: CoordinateEvidence;
};
```

`evidenceDate.value` controls order **within its own section**, descending.
For a contract/CPES record it is the source-reported status date; for an
appropriation it is 1 January of its funding year solely to support a stable
year order, while the UI says `FY 2015 appropriation` rather than inventing an
exact day. Equal dates break by official reference, then exact title. Sections
never interleave: an appropriation is not silently made comparable to a
contract or a CPES evaluation.

Money remains an array of exact typed values. A large figure always carries its
type—e.g. `₱47,772,728.44` followed by `Awarded contract amount`—and separate
ABC, contract amount, FY appropriation, and CW component appropriation values
remain separate. The page must never sum, rank, or call them all “cost.”

## Status and missing-evidence rules

Only the five controlled statuses may render or filter. A non-empty status has
the form `Completed — as reported 28 Nov 2022`; it is never styled or worded as
current. CPES's historical `on-going` maps only to `Ongoing — as reported
[CPES date]`; it must not be treated as an active-site statement. Appropriation
records use **Not stated** unless a primary source proves another status.

Contractor renders in a labelled, high-contrast field:

- `Contractor` + source-published name when verified.
- `Contractor unavailable in the reviewed source` when absent.
- No contractor is inferred from a similarly titled row, a notice, or a
  secondary index.

Amounts absent from a reviewed source render `Amount type unavailable in the
reviewed source`; absence is visible rather than represented as zero. Each
record continues to show source publisher, official reference or the existing
internal review-key explanation, accessed/reviewed dates, and a direct official
source link.

## Visual direction

**Task class:** civic evidence-led control panel, not a marketing page.

Use the existing BetterKabugao navy, blue, gold, off-white, and gray token
system with the existing Inter family. The design signature is a compact,
left-ruled **evidence strip** rather than a fleet of rounded cards:

```text
SECTION LABEL / source scope                         [filters]
Project title and official reference
STATUS | TYPED AMOUNT | CONTRACTOR
location · office · funding year
source-dated evidence note                  [Open official source →]
```

- Gold is reserved for the section rule and the amount label; it is not a
  success colour. Navy carries headings and source actions.
- Status uses text plus a small square key, never colour alone. Completed uses
  restrained green; ongoing uses blue; planned uses gold; cancelled uses muted
  red; not stated uses gray. Every key has an exact text label and source date.
- Amounts receive the largest data type scale and tabular numerals, but remain
  visually secondary to the title and source link. The amount type sits directly
  under the value in utility text.
- Contractor gets its own labelled column on desktop and first metadata row on
  mobile; an unavailable value uses the same space and muted rule, avoiding a
  deceptive blank.
- Desktop uses a dense single-column ledger with aligned evidence fields, not
  a bento grid. Mobile stacks the evidence strip in the same title → status →
  amount → contractor order with no horizontal page overflow.
- No gradients, glass effects, circular progress charts, celebratory animation,
  emoji, or generic statistic tiles. Motion is limited to focus/hover feedback
  and disabled or reduced under the existing reduced-motion rule.

Accessibility: native labelled selects; result count in a live status region;
keyboard-visible focus; at least 44px control targets; status never conveyed by
colour alone; text remains legible at 320px; source links use descriptive names.

**Anti-generic self-check:** AI-slop score 1/10 (no generic hero, gradients,
glass, bento, or decorative motion). Distinctiveness score 8/10: the
source-dated ledger and explicit missing-evidence fields are specific to civic
record scrutiny rather than a generic dashboard.

## Homepage mini-ledger

The homepage preview becomes a compact **Latest source-backed records** ledger,
not a second copy of the full register. It shows three deterministic,
source-backed register records selected by the project-register evidence-date
order. Each row exposes title/reference, status with its source date, one
typed amount or the explicit unavailable phrase, contractor availability, and
an `Open official source` action. `View all Public Works Watch records` is the
single prominent route action and reaches `/projects`.

On desktop, the three rows remain visible together. On mobile, add a native
segmented category control only when the preview contains more than one
category and the control materially reduces vertical scanning. It uses buttons
with visible selected state, keyboard operation, and an `All shown` reset; it
filters only the three preview rows and never hides the route action. If the
three selected rows share one category, omit the control rather than inventing
interactivity. There is no carousel, autoplay, timer, animation, map pin,
aggregate number, or duplicate filter form on the homepage.

The section introduces itself as a manually reviewed selection and repeats the
short status caveat: source-reported status is not a live completion check.

## Map gate and fallback

No public map ships in the first release. Six flood-control entries have
official geometry in the DPWH ArcGIS layer, but the historical audit found no
stated reuse licence. A future map requires, per pin or geometry:

1. official WGS84 coordinate/geometry tied to that exact record;
2. record-level primary source URL and reviewed date;
3. documented reuse permission or licence decision; and
4. a map accessibility fallback: location text, source action, and an explicit
   notice that unpinned records have no cleared coordinate evidence.

Never derive a pin from a barangay centre, road name, stationing, geocoding, or
engineering grid. Until the gate clears, every location remains source text and
the page makes no spatial claim.

## Research and expansion boundary

The FY2015 DPWH and FY2017 DBM candidates are primary-source appropriation
leads, not delivered-work claims. Civic Research & Data must manually verify
each original row and direct primary URL before any is promoted to the
historical-appropriation section. A later matching award, CPES, completion
report, or official response may be linked as a separate evidence event; it
does not overwrite the appropriation meaning.

The pre-2000 gap remains a discovery limitation. DILG FDP, COA, DPWH CAR, and
Apayao 1st DEO are manual/FOI leads, not available public data. The future map
and any FOI request are backlog items requiring a separate approval.

## Acceptance criteria for an implementation brief

- The existing 13 records remain source-linked and are labelled as a curated
  starter; no unverified historic candidate silently appears.
- Both sections have explicit scope copy and deterministic newest-to-oldest
  order using their own stated date semantics.
- Status filter offers exactly the five approved values and combines with every
  existing filter; Not stated is discoverable and not hidden.
- Each record visibly exposes source-dated status, typed amount or its explicit
  absence, and verified contractor or its explicit absence, without aggregate
  spend or claim of live progress.
- The homepage mini-ledger shows exactly three source-backed rows and a
  crawlable `View all Public Works Watch records` action. Its optional mobile
  category control is keyboard-accessible, deterministic, and omitted when it
  does not reduce scanning.
- CSV/JSON, prerendered HTML, and the UI agree on section, status, date label,
  amount type, source URL, and contractor availability.
- No map, coordinate, guessed pin, live API, complaint path, or corruption
  allegation ships without the described research/rights approval.

## Deferred backlog

1. Rights-cleared exact-coordinate map for eligible records.
2. Record-level change history and quarterly review dashboard.
3. Manual DPWH/DILG/COA/FOI research pipeline for older Kabugao evidence.
4. Additional historic appropriation releases, one manually verified batch at a
   time.
