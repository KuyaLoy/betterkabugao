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

**A. Source margin register — first proposal.** Give every page one primary assertion and a slim source margin. Statistics opens with **16,425 people · 2024 POPCEN**; the four supporting measures become a definition row, followed by a readable chart and the unchanged nine-row source table. Projects opens with a concise status caveat, one search control, a compact filter disclosure, and the first record. Each record puts reference/place/title, source-dated status, typed amount, and its official link in one reading path. Contractor, office, and review detail stay in the existing explicit disclosure. On mobile the source margin folds directly below the primary claim. The homepage Statistics item becomes a more legible source-dated entry within the existing task area; Public Works retains three records with a single-column heading at 390px. This is a single cross-feature visual grammar grounded in source records.

**B. Observation line and focused works index — revised recommendation.** The real nine-point population series becomes the main Statistics visual. One selected point reveals its year, value, and linked official source while the complete line and data table remain readable. Public Works becomes a compact reference/place index beside one focused record on desktop; on mobile, each index row keeps its source-dated status, typed amount, and official link in view, while its exact full official title opens through an explicit one-tap control. The homepage becomes two concise doorways: a census invitation and a Public Works register invitation, each with a checkable source example. The tradeoff is a small amount of selection state on both pages and less record detail on the homepage. It keeps scanning fast and avoids hiding primary evidence.

Direction A uses an **evidence margin**: a narrow gold rule beside publisher/date/link, positioned like a document citation. Direction B makes a bolder, more useful signature from the actual observation sequence and reference numbers. Neither rule nor line represents geography, construction progress, or an uncited source.

## Compact visual system

The shared palette and accessibility rules apply to both directions. The source-margin layout, full-title record layout, and chart reveal below describe A; B's focused index and point-selection behavior are specified in its section at the end.

- **Palette:** existing navy #00142f for titles and structural rules; deep link blue #003d8d; gold #ffb900 only at a source margin or key observation; sand #f3efe8 for homepage feature fields; white #ffffff for reading surfaces; gray #495057 for secondary text. Alert red remains only in the global emergency control. Status always includes words and date, never color alone.
- **Type:** retain local Inter for network continuity. Desktop page title 38/41px, mobile 28/32px; lead number 76px desktop and 56px mobile; section title 18–20px; body 15/23px; labels and evidence notes 11–12px. Use tabular numerals for counts, dates, and currency. Long official project titles wrap in full; never silently shorten them.
- **Rhythm:** page padding 36px desktop/18px mobile; 28–32px between meaningfully different sections; 12–20px within a record. One hairline between records. No stacked card shadows or pill systems. Inputs retain the network's small-radius convention.
- **Components:** one lead statistic, supporting definition list, chart with caption and full table; one search line, filter disclosure with active count, and ruled project record. Official source links remain directly visible beside each primary claim/record. Downloads and copy citation are secondary text actions.
- **Motion (A only):** keep at most one chart reveal, shortened to approximately 450–600ms, with the full data and labels available from first paint; no animated counters. Details/filter open-close may use a 120–160ms state transition without moving surrounding text unpredictably. Reduced-motion users see all static content immediately. B has no chart reveal; only point-selection feedback.
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

Using the anti-slop rubric, **current Statistics: 5/10 slop, 5/10 distinctiveness; current Projects: 5/10 slop, 5/10 distinctiveness.** Proposal A targets **2/10 slop and 7/10 distinctiveness** after visual review; proposal B targets **2/10 slop and 8/10 distinctiveness**. These are design judgments; implementation requires screenshot signoff. B's implementation readiness is **8/10** because the rules and content are specific, while final interaction sizing and behavior need production validation.

## Design QA acceptance before any release

- At **390px**, a source-dated 2024 population value is visible in the initial Statistics screen; at **1440px**, it is the clearest object on the page. Both retain the four supporting measures, chart, complete source table, PSA links, dates, and actions.
- At **390px**, the Public Works title and link do not squeeze each other, and the first record title begins in the first screen after search. At **1440px**, Search and Filters share one coherent line; the sort note never touches a selector.
- In every Works record, reference, category/place, source-dated status, typed amount or explicit unavailability, and official source link remain readable without opening details. A shows the full title at rest; B places the exact full title one explicit, keyboard-reachable action away on mobile.
- Long titles wrap without clipping at both widths. The 23PB0015 title is the deliberate stress case. No horizontal overflow or tiny labels.
- Statistics chart is understandable at rest, with reduced motion, and without JavaScript. For A, also check during its one reveal. B's full nine-point plot is visible on first paint, with selected-point information progressively enhanced. Nine exact values and their source links remain available as text.
- Both pages use visible focus, 44px touch targets, readable secondary contrast, accurate heading order, and status text that does not rely on color.
- Capture **one 390px and one 1440px screenshot** for each changed route and homepage feature area after implementation; compare hierarchy against the paired compositions here. Sign off only when the first primary fact/record, source access, caveat, and expected interaction are observable in both captures.

## Review artifacts

- [Statistics page composition](./statistics-page.png)
- [Public Works page composition](./projects-page.png)
- [Homepage Statistics entry composition](./statistics-teaser.png)
- [Homepage Public Works preview composition](./works-teaser.png)

These four A PNGs show the proposed desktop and mobile states side by side. The HTML is a static presentation source; links within it are illustrative. Production routes and behavior require a separate approved implementation brief.

## Focused second visual direction for Robin's review

Command Center's critique of A was sound: its chart stayed too small, long official titles still dominated mobile, and the homepage modules felt like condensed data pages. **B is the recommended direction to review now.** It is shown in three paired static compositions:

- [B · Statistics observation line](./b-statistics.png)
- [B · Public Works index and focused record](./b-projects.png)
- [B · homepage doorways](./b-home.png)
- [Editable static presentation source](./alternative-b.html)

The nine chart labels use the existing observations: 1960 5,961; 1970 7,358; 1980 9,600; 1990 11,198; 2000 13,985; 2010 16,170; 2015 15,537; 2020 16,215; 2024 16,425. The line is an abstract data plot, not a river or terrain map. It shows the dip at 2015. The 2024 chart row links to the existing PSA Kabugao PSGC record; the separate five-metric 2024 snapshot names PSA OpenSTAT as canonical. The mockup distinguishes those two source roles. The point labels and full table remain necessary because the chart alone is not a data substitute.

**B's point interaction:** all nine marks are visible at rest. Hover, tap, or keyboard focus selects a point and updates one pinned year/value/source panel. Each point has an accessible year-and-count name, a visible focus ring, and a keyboard path through all nine points; the full table immediately follows and remains the complete source reference. Selection changes only the dot emphasis and panel text with a 120–160ms state transition. With reduced motion, the update is instantaneous. No count-up, redraw, replay, or movement of the line.

**B's works interaction:** the desktop index keeps the reference, sourced place/category, dated status, typed amount, and direct official source on each row while selection changes the adjacent focused record. On mobile, the index becomes a vertical list; an explicit “Read full official title and details” control expands the exact unabridged title inline. It is a native button or summary with open/closed state and visible focus. Opening it must not hide the amount, status, or official source. All existing filter and evidence-date sort functions remain available; filters collapse at mobile width and the sort meaning remains explained. Historical appropriations retain their own section and their “not proof of award/start/completion” caveat.

**Why B improves on A:** the first viewport now gives Statistics a visual made from Kabugao's actual nine observations, while Projects shows more references with less repeated title mass. The homepage presents two purposeful routes with one checkable example each. This means fewer simultaneous paragraphs, yet the direct source actions stay in sight. The cost is the need to implement and test selection/focus behavior carefully; B should be approved only if that interaction can meet the acceptance criteria above.
