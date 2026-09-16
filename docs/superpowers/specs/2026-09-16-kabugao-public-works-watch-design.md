# Kabugao Public Works Watch — implementation specification

**Status:** approved design specification; implementation not started
**Owner:** Development
**MVP routes:** homepage module and `/projects`
**Data posture:** manually reviewed, local, source-linked records

## Product promise

Public Works Watch answers “What’s being built in Kabugao?” with a small register
of public works that a resident can check against an official source. It is a
reference tool, not a project-completion verdict, spending total, or accusation.
The homepage shows three source-linked project cards and a **View all projects**
link. `/projects` shows the approved 13-record starter register.

The page uses BetterKabugao’s existing identity and source-first visual language:
quiet civic typography, clear labels, restrained status color, and links that
remain useful with JavaScript disabled. Do not add a map in the MVP: none of the
13 starter records has verified WGS84 coordinates, so location is text only.

## Scope and navigation

### Homepage module

Add a section titled **What’s being built in Kabugao?** with exactly three
representative records from the approved starter register. Each card must show
the exact project title, published location, amount with its money type, and
“As reported on [source date]”. The card’s source link is visible; the card does
not imply that a project is current, complete, delayed, or problematic.

The module includes a crawlable **View all projects** link to `/projects` and a
short note that the register is a manually reviewed selection, not a complete
inventory.

### `/projects`

Render all 13 starter records in a readable list/table that works at 320px
without horizontal page overflow. Desktop may use a table; mobile may stack
each record while retaining the same fields and source actions. Provide:

- text search across title, official reference, published location/barangay,
  office, contractor, and category;
- category filter using only the controlled values below;
- funding-year filter;
- published-location/barangay filter;
- a reset action and a clear “no matching projects” state;
- a source link per record and a local CSV/JSON download link.

Filters are client-side over the local typed dataset. The URL need not encode
filters in the MVP, but all results must be deterministic and keyboard usable.

## Controlled vocabulary

`category` must be one of:

1. flood control/drainage
2. roads/bridges
3. public buildings
4. water/sanitation
5. schools
6. health
7. agriculture
8. electrification/communications
9. disaster resilience
10. other

Category is a derived editorial classification. It must never be presented as
an official source field; retain the source title and description so a reviewer
can audit the derivation.

## Data interface

The implementation owns one typed local array and generated static CSV/JSON
copies. There is no runtime API, scraping, browser-side token, remote image,
PDF, screenshot, or notice reproduction.

```ts
type ProjectCategory =
  | "flood control/drainage" | "roads/bridges" | "public buildings"
  | "water/sanitation" | "schools" | "health" | "agriculture"
  | "electrification/communications" | "disaster resilience" | "other";

type MoneyType =
  | "FY appropriation"
  | "CW component appropriation"
  | "ABC"
  | "awarded contract amount";

type PublishedStatus =
  | "planned" | "ongoing" | "completed" | "cancelled"
  | "not stated";

type PublicWorksProject = {
  officialRef: string;                 // source identifier, never invented
  exactTitle: string;                  // verbatim source title
  category: ProjectCategory;            // derived, reviewable classification
  publishedLocation: string;            // source-reported text/barangay
  implementingOffice: string;
  procuringOffice?: string;
  contractor?: string;                 // omitted only when unavailable
  contractorStatus: "verified" | "unavailable" | "not stated";
  amount?: { value: number; currency: "PHP"; type: MoneyType };
  fundingYear?: number;
  fundingSource?: string;
  status: PublishedStatus;
  statusAsOf: string;                   // ISO date from the cited source
  scheduledStart?: string;              // ISO date, only when verified
  scheduledCompletion?: string;         // ISO date, only when verified
  officialUrl: string;
  sourcePublisher: "DPWH" | "DBM" | "PhilGEPS" | "procuring entity";
  accessedOn: string;                   // ISO date maintained by reviewer
  reviewedOn: string;                   // ISO date maintained by reviewer
  sourceNote?: string;                  // concise terms/limitations note
};
```

### Invariants

- The starter dataset contains exactly 13 records, each with a unique
  `officialRef`; duplicate phases are represented deliberately, not silently
  merged.
- `officialRef`, `exactTitle`, `publishedLocation`, `implementingOffice`,
  `officialUrl`, `sourcePublisher`, `status`, `statusAsOf`, `accessedOn`, and
  `reviewedOn` are required and non-empty.
- Every `officialUrl` is HTTPS and points to the cited primary publisher. A
  BetterGov URL may be retained as a discovery/cross-check link only; it is not
  the canonical source.
- `amount.type` is required whenever `amount` exists. Never sum or compare
  values across money types, and never display an aggregate total in the MVP.
- `status` is exactly what the cited source reported on `statusAsOf`. Never
  infer “ongoing”, “completed”, “delayed”, “abandoned”, value-for-money, or
  wrongdoing from dates, photos, absent updates, or a user’s comment.
- Missing contractor information is rendered explicitly as **Contractor
  unavailable in the reviewed source**; it is never guessed from another row.
- Scheduled dates are absent unless the primary source verifies them. Dates are
  not used to derive status.
- `publishedLocation` is text only. No coordinates, map pins, distance claims,
  or geocoding are permitted until official WGS84 evidence is reviewed.
- Currency is PHP and values are numeric in data files; display formatting may
  add `₱` and separators but must preserve the exact amount and money type.
- The local CSV/JSON download is generated from this same array and must not
  contain a different record count, value, status, or source URL.

## Approved starter evidence

The 13-record register is the approved research selection and must be
transcribed as reviewed data, not re-created from a broad search. Six verified
DPWH flood-control records currently documented in the research are:

| Reference | Year | Published title/location | Source-reported completion |
| --- | ---: | --- | --- |
| 22PB0018 | 2022 | Apayao River FC, Sta. 82+292–82+592, Brgy. Nagbabalayan | 2022-11-28 |
| 22PB0023 | 2022 | Sicapo River FC, Sta. 88+632–88+932 (L/S) | 2023-04-30 |
| 22PB0024 | 2022 | Madduang River FC, Sta. 84+680–84+835 (B/S) | 2023-03-28 |
| 23PB0002 | 2023 | Badduat River FC revetment, Sta. 83+292–83+532 | 2023-09-08 |
| 23PB0014 | 2023 | Badduat River FC revetment (upstream), Sta. 83+232–83+292 | 2023-12-07 |
| 23PB0017 | 2023 | Madduang River FC revetment, Sta. 88+535–88+680 / 89+133–89+633 | 2023-11-22 |

The remaining seven approved starter records are the non-flood-control entries
in the reviewed 13-record research register. Their exact source fields must be
copied from that register during implementation; do not fill gaps with a
search result, estimate, or fabricated placeholder. If a field is not present
in the source, use the explicit missing-value rule above.

Primary source entry points for implementation review:

- DPWH transparency data: <https://api.dpwh.bettergov.ph/projects?province=APAYAO>
- Citable DPWH snapshot: <https://huggingface.co/datasets/bettergovph/dpwh-transparency-data>
- DPWH ArcGIS project layers: <https://services1.arcgis.com/IwZZTMxZCmAmFYvF>
- DPWH bridge inventory (reference only; not MVP project coordinates): <https://services1.arcgis.com/IwZZTMxZCmAmFYvF/arcgis/rest/services/Detailed_Bridge_Inventory/FeatureServer/3>
- PhilGEPS notices: <https://notices.philgeps.gov.ph/>
- DBM official site: <https://www.dbm.gov.ph/>
- BetterGov discovery/cross-check: <https://statistics.bettergov.ph/> and <https://transparency.bettergov.ph/>

The six records and any additional entry must retain the exact primary-source
URL that supports its own fields. Do not cite a landing page when a record-level
URL exists.

## Duplicate and phase handling

Use `officialRef` as the primary identity key. A distinct phase, contract,
upstream/downstream segment, or procurement lot gets its own row when the
official source gives it a distinct reference. When a source lacks a stable
reference, use a reviewed composite key of publisher + source identifier +
funding year + exact title; document that decision in `sourceNote`.

At ingest, flag possible overlap when normalized title tokens, location,
funding year, and office match another record. Show a reviewer-facing warning;
do not merge records automatically. The public page may show “Possible related
phase — check the source” but must not claim duplication as fact.

## Status, money, and source language

Display money as `₱ amount · ABC`, `₱ amount · awarded contract amount`, or the
other exact `MoneyType`; never collapse the label to “project cost”. A row can
show several amounts only as separate typed fields. No “total projects” peso
figure is allowed because FY appropriation, CW component appropriation, ABC,
and awarded contract amount answer different questions.

Render status as `Status: [value] (as reported [date])`. “Not stated” is a valid
outcome. The interface must include a small note: “A source-reported status is
not a live completion check.”

Each record uses a short source/terms note. Reproduce no PDF, screenshot, logo,
full notice, or long copyrighted text; link to the official page instead.

## Disclaimer and trust copy

Retain the site-wide disclaimer exactly:

> BetterKabugao is an independent, volunteer-run civic project for Kabugao,
> Apayao, and part of the BetterGov.ph volunteer network. It is neither
> affiliated with nor endorsed by the Municipality of Kabugao, and it is not
> the municipality's official website.

Add the route-specific clarification: “Public Works Watch is a manually
reviewed reference to published records. It does not certify completion,
quality, legality, procurement compliance, or current status.”

## Empty, missing-source, and error behavior

- Empty search/filter results: “No projects match those filters.” Provide
  **Clear filters** and preserve the full-register count nearby.
- Missing optional field: show “Not stated in the reviewed source” or the
  contractor-specific unavailable wording; do not hide the absence.
- Broken or unreachable source link: retain the record, mark “Source link needs
  review”, show the accessed/reviewed dates, and never silently substitute a
  secondary URL.
- Malformed local data: fail the build/validation gate with the record reference
  and field; do not render a partial register as complete.
- JavaScript disabled: show all 13 records, source links, disclaimer, and a
  working download link using the prerendered/static HTML fallback.

## Review cadence

Review the whole dataset quarterly. Review monthly only for records whose
source explicitly labels them **ongoing**. A review updates `accessedOn` and
`reviewedOn` and may change a displayed status only when the primary source
reports a new status with a new `statusAsOf`; it must not infer a change from
silence.

## Acceptance criteria

### Homepage

- “What’s being built in Kabugao?” appears once, with exactly three cards.
- Every card has a source link, typed amount (when available), location, and
  source-reported status date; **View all projects** reaches `/projects`.
- No card implies a current/completed/problem status beyond its source wording.

### `/projects` and data

- Exactly 13 records render from one typed local source; CSV and JSON downloads
  match it byte-for-byte in values and record count.
- All controlled categories, exact money types, source dates, contractor
  unavailability, duplicate warnings, and no-coordinate rule are enforced.
- No aggregate money total, map, coordinate, live API, scraper, or reproduced
  notice ships in the MVP.

### Findability and accessibility

- Search and all three filters work together, have labels, reset cleanly, and
  announce result count/no-result state to assistive technology.
- Source links have descriptive names, visible focus, HTTPS targets, and open
  safely; download controls are keyboard and screen-reader usable.
- Layout is usable at 320px, 390px, tablet, and desktop with no horizontal
  page overflow; contrast and reduced-motion behavior follow site standards.
- Static/JavaScript-off output preserves the register and source links.

### Verification and operations

- Development writes focused unit/data-validation tests, then one final
  automated gate covering tests, typecheck, lint, and production build.
- Perform one focused browser pass over `/projects` at mobile and desktop,
  including search/filter, source links, download, keyboard focus, and empty
  state. Independent QA is not routine; involve it only for the mandatory
  high-risk/accessibility conditions in Command Center rules.
- Add the dataset review date and a handover session log. Stop when the approved
  MVP is committed and pushed; backlog work is a separate approval.

## Out of scope and backlog

- No live DPWH/PhilGEPS/BetterGov API, scraping job, server proxy, user comments,
  complaints workflow, alerts, or AI-generated project summaries.
- No map or coordinates until an official source supplies reviewed WGS84
  evidence for the relevant records.
- No contractor score, corruption/quality allegation, “on time” calculation,
  completion verification, or cross-project peso total.
- Later, only with a new approval: verified-coordinate map, source refresh
  tooling, record-level change history, procurement-document viewer, and
  quarterly review dashboard.
