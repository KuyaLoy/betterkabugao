# Statistics snapshot and provenance — 16 September 2026

## Release intent

Publish a small, checked 2024 Kabugao statistics record without turning the page into a dashboard or implying a complete annual time series. The existing population chart and its one-time motion remain intact.

## Published record

| Measure | Display value | Exact/source value |
| --- | --- | --- |
| Total population | 16,425 | 16,425 persons |
| Household population | 16,411 | 16,411 persons |
| Number of households | 3,662 | 3,662 households |
| Land area | 929.88 km² | 929.88 square kilometres |
| Population density | 17.7 people/km² | 17.6636 persons per square kilometre |

The density is rounded only for visual reading. The exact value is carried in the accessible page markup, the downloadable CSV, and the copyable citation.

## Provenance model

- **Canonical source:** Philippine Statistics Authority (PSA) OpenSTAT.
  - Population and households: <https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0151A6DTHP4.px>
  - Land area and density: <https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0221A6DLPD0.px>
- **Discovery and selection layer:** Philippine Data Explorer / BetterGov.ph.
  - Population and households: <https://statistics.bettergov.ph/datasets/b1b47f8cb7ceb5c50a97>
  - Land area and density: <https://statistics.bettergov.ph/datasets/05c931eaecec498f9756>
- Source updated: **12 August 2026**. Snapshot retrieved: **9 September 2026**. Coverage checked: **11 September 2026**.

No BetterGov runtime API is used. The page ships a local, static CSV at `/data/kabugao-2024-snapshot.csv`; it is both dependable for visitors and clear about the values being published.

## Design decision

The new block is an **evidence ledger**, not a generic metric-card dashboard: one pale panel, a gold source rule, compact record cells, and a visible provenance strip. It follows BetterGov’s civic clarity while retaining BetterKabugao typography, colors, and responsive layout. The chart remains the page’s only purposeful motion.

## Changed files

- `src/data/population.ts` — snapshot values, source pairs, and copyable citation.
- `src/pages/StatisticsPage.tsx` — accessible snapshot, source links, copy-citation control, and local CSV link.
- `public/data/kabugao-2024-snapshot.csv` — static downloadable extract.
- `src/pages/HomePage.tsx` — concise 2024 snapshot entry.
- `src/styles.css` — responsive evidence-ledger presentation.
- `src/App.test.tsx` and `scripts/qa/statistics-animation.mjs` — automated coverage.

## Verification evidence

- TDD: the new snapshot test first failed because the labelled snapshot region did not exist, then passed after implementation.
- Type check: passed.
- Lint: passed.
- Contracts: **40/40** passed.
- Unit tests: **55/55** passed.
- Production build/prerender: passed; **34** pages prerendered.
- Focused browser QA: **15/15** passed at 390px and 1440px, including source links, local CSV content, copy citation, homepage entry, reduced motion, print, JavaScript-off output, and no chart replay.

## Known platform note

Keep Cloudflare DDoS protection and the strict CSP unchanged. A CSP-blocked inline Cloudflare challenge console warning may appear in production; it is a known platform-side exception, not an application error and not a reason to weaken either protection.
