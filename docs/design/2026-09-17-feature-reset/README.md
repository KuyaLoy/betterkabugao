# Statistics and Public Works: design reset for review

17 September 2026 · UX/Brand proposal · design only. Reviewed the live Statistics, Projects, and homepage routes at 1440px and 390px. The live footer showed v3.0.0. Four paired desktop/mobile static compositions are in [mockups.html](./mockups.html), with PNG exports below. They are proposals, not deployed screenshots or interaction prototypes. Their header is schematic; the production logo and global navigation remain governed by the existing brand system. No applicable AGENTS.md was found; the Command Center rules and feature handovers were read.

## Direct diagnosis

The features pass functional checks but their reading order feels assembled. Both ask people to process qualifications, labels, and controls before the core record.

| Surface | Observed in the live render | Result |
| --- | --- | --- |
| Statistics, 1440 | Navy page header, then another “selected record” title and a third “2024 snapshot” title before five equal metric cells. A wide provenance grid squeezes four source links and two export actions into small text. | The verified 16,425 population has no decisive first impression; one record is introduced three times. |
| Statistics, 390 | The first value begins below the initial ~1000px screen after two introductions and the snapshot explanation. | The user scrolls through caveats before seeing what the page measures. |
| Chart | The one-time line draw was visible mid-reveal in a live desktop capture: grid and first point, with most of the plot temporarily blank. The source table remains below. | Motion briefly makes the graphic harder to read. Axes and source key need stronger visual priority than the animation. |
| Projects, 1440 | Caution box and two export buttons come before a six-control filter area. Search sits low at the left while five selectors and Clear form a separate grid; the evidence-date note crowds the controls. | The primary activity, reading a record, is delayed; controls feel like an administrative form. |
| Projects, 390 | Description, caution, exports, search, filter disclosure, and count fill most of the first screen. The first record title appears near the bottom. | Repetition and vertical delay make the page feel heavier than 13 selected rows require. |
| Homepage | Statistics is one small item in the four-link task strip. Public Works is a three-row ledger; at 390px its heading and “View all” link share a two-column grid with no narrow-screen reset, visibly squeezing the heading into a sliver. | The entry points feel unrelated, and the Public Works heading breaks the mobile hierarchy. |

Source dates, typed money, absent values, review dates, official links, and the distinction between delivery records and historical appropriations already work. Keep those semantics. The existing Inter/navy/gold identity is legitimate BetterLGU network language; the concern is typographic use and information structure, not the font family itself.

The likely design cause is additive delivery: a chart, snapshot, provenance panel, filter toolbar, and new record fields were each made clear in isolation, but no final pass resolved the whole-page order at phone width. The mobile Public Works heading is also a concrete responsive grid defect.

## Two directions

**A. Source margin register — recommended.** Give every page one primary assertion and a slim source margin. Statistics opens with **16,425 people · 2024 POPCEN**; the four supporting measures become a definition row, followed by a readable chart and the unchanged nine-row source table. Projects opens with a concise status caveat, one search control, a compact filter disclosure, and the first record. Each record puts reference/place/title, source-dated status, typed amount, and its official link in one reading path. Contractor, office, and review detail stay in the existing explicit disclosure. On mobile the source margin folds directly below the primary claim. The homepage Statistics item becomes a more legible source-dated entry within the existing task area; Public Works retains three records with a single-column heading at 390px. This is a single cross-feature visual grammar grounded in source records.

**B. Guided civic story.** Statistics presents one observation at a time in a chronological sequence; Projects presents one dossier at a time with large next/previous controls. It offers more room for a friendly interaction and strong individual focus. The tradeoff is slower comparison, more page state, and a risk of hiding citations or dates. It is a poor fit for residents who need to scan several records or verify a source quickly.

Direction A earns the aesthetic risk through an **evidence margin**: a narrow gold rule beside publisher/date/link, positioned like a document citation. The rule conveys provenance, not location or progress. It replaces decorative gold edges and repeated cards.

## Compact visual system

- **Palette:** existing navy #00142f for titles and structural rules; deep link blue #003d8d; gold #ffb900 only at a source margin or key observation; sand #f3efe8 for homepage feature fields; white #ffffff for reading surfaces; gray #495057 for secondary text. Alert red remains only in the global emergency control. Status always includes words and date, never color alone.
- **Type:** retain local Inter for network continuity. Desktop page title 38/41px, mobile 28/32px; lead number 76px desktop and 56px mobile; section title 18–20px; body 15/23px; labels and evidence notes 11–12px. Use tabular numerals for counts, dates, and currency. Long official project titles wrap in full; never silently shorten them.
- **Rhythm:** page padding 36px desktop/18px mobile; 28–32px between meaningfully different sections; 12–20px within a record. One hairline between records. No stacked card shadows or pill systems. Inputs retain the network's small-radius convention.
- **Components:** one lead statistic, supporting definition list, chart with caption and full table; one search line, filter disclosure with active count, and ruled project record. Official source links remain directly visible beside each primary claim/record. Downloads and copy citation are secondary text actions.
- **Motion:** keep at most one chart reveal, shortened to approximately 450–600ms, with the full data and labels available from first paint; no animated counters. Details/filter open-close may use a 120–160ms state transition without moving surrounding text unpredictably. Reduced-motion users see all static content immediately.
- **Responsive:** source margin becomes a two-line source block immediately below the main figure or each project record; the homepage Works heading and View all link become one column. No horizontal scrolling at 390px; touch targets at least 44px.

## Source and data guardrails

Statistics mockups use the published **2024 POPCEN** values: total 16,425, household population 16,411, households 3,662, land area 929.88 km², density 17.7 people/km² rounded from 17.6636. PSA OpenSTAT remains canonical; the updated/retrieved/checked dates remain 12 August, 9 September, and 11 September 2026. The chart is a schematic using the nine published observations; implementation must preserve their exact values, the full table, and the source links.

Projects mockups use existing 23PB0014, 23PB0015, and 23PB0017 only. 23PB0014 has **no published amount type in the reviewed source**. 23PB0015 shows **₱67,550,000 contract amount** and status completed as reported **23 November 2023**. 23PB0017 shows **₱49,000,000 ABC**, not a total spend or interchangeable award amount, and status completed as reported **22 November 2023**. The full page must retain all 13 rows, both existing sections, exact source notes, all typed money values, the 16 September 2026 review date, filters/sort, CSV/JSON, and every official URL. There is no map or new historical row.

BetterCainta inspired the pattern of a readable headline before a chart and a single purposeful disclosure. Its animated counters, multiple dashboard cards, live ticker, and many simultaneous widgets would work against BetterKabugao's source-first purpose. No external assets, code, or layout were copied.

## Priority and scoring

1. Fix the 390px Public Works heading grid and move the first primary fact/record into the first screen.
2. Consolidate repeated introductions and move exports behind the primary reading path.
3. Recompose statistics source links and chart/table as one evidence sequence; keep direct source access visible.
4. Tune interaction only after the static view reads correctly.

Using the anti-slop rubric, **current Statistics: 5/10 slop, 5/10 distinctiveness; current Projects: 5/10 slop, 5/10 distinctiveness.** The proposed compositions target **2/10 slop and 8/10 distinctiveness**. These proposed scores are design judgments; implementation requires screenshot signoff. The proposal's implementation readiness is **8/10** because the rules and content are specific, while final CSS sizing and interaction behavior still need production validation.

## Design QA acceptance before any release

- At **390px**, a source-dated 2024 population value is visible in the initial Statistics screen; at **1440px**, it is the clearest object on the page. Both retain the four supporting measures, chart, complete source table, PSA links, dates, and actions.
- At **390px**, the Public Works title and link do not squeeze each other, and the first record title begins in the first screen after search. At **1440px**, Search and Filters share one coherent line; the sort note never touches a selector.
- In every Works record, title/reference, category/place, source-dated status, typed amount or explicit unavailability, and official source link remain readable without opening details. The details control names its contents and stays keyboard reachable.
- Long titles wrap without clipping at both widths. The 23PB0015 title is the deliberate stress case. No horizontal overflow or tiny labels.
- Statistics chart is understandable at rest, during its one reveal, with reduced motion, and without JavaScript. Nine exact values and their source links remain available as text.
- Both pages use visible focus, 44px touch targets, readable secondary contrast, accurate heading order, and status text that does not rely on color.
- Capture **one 390px and one 1440px screenshot** for each changed route and homepage feature area after implementation; compare hierarchy against the paired compositions here. Sign off only when the first primary fact/record, source access, caveat, and expected interaction are observable in both captures.

## Review artifacts

- [Statistics page composition](./statistics-page.png)
- [Public Works page composition](./projects-page.png)
- [Homepage Statistics entry composition](./statistics-teaser.png)
- [Homepage Public Works preview composition](./works-teaser.png)

All four PNGs show the proposed desktop and mobile states side by side. The HTML is a static presentation source; links within it are illustrative. Production routes and behavior require a separate approved implementation brief.
