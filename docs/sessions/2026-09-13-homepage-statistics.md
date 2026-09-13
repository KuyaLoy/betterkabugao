# 2026-09-13 — Homepage index and Kabugao statistics

## Scope and owner

Robin approved a narrow Development checkpoint through the BetterKabugao
Command Center: add an editorial feature index to the homepage and a new
`/statistics` page. Robin explicitly authorized a direct push to `main` on
2026-09-13; deployment and live verification remain pending until that occurs.

## Delivered implementation

- Homepage index links to Barangays, Officials, Emergency Hotlines and Kabugao
  Statistics while preserving the existing header, hero, map and footer.
- `/statistics` presents a restrained SVG line chart and an equivalent semantic
  HTML table, source links, retrieval date, methods note and barangay-directory
  link.
- Routing, prerender paths, metadata, sitemap and search index include the
  route. No dependency, analytics, form, AI feature or runtime data service was
  added.

## Data decision

Only these selected official census/POPCEN observations are published:

| Year | Population |
|---|---:|
| 1960 | 5,961 |
| 1970 | 7,358 |
| 1980 | 9,600 |
| 1990 | 11,198 |
| 2000 | 13,985 |
| 2010 | 16,170 |
| 2015 | 15,537 |
| 2020 | 16,215 |
| 2024 | 16,425 |

The primary PSA/NSO links and publication locations are recorded in
`docs/command-center/source-registry.md`. Retrieved 13 September 2026.
Candidate years 1918, 1939, 1948, 1975, 1995 and 2007 are deliberately
withheld. No interpolation, trend/growth claim, percentage or projection ships.

## Verification and handoff

- RED: the initial `/statistics` contract failed before the route existed.
- GREEN: `npm test` passed (39 contracts + 51 unit tests), `npm run typecheck`
  and `npm run lint` passed, and the fresh build reported `PRERENDER_OK 34
  pages` and `SEO_OK ... 33 sitemap URLs`.
- The committed responsive QA harness now covers `/statistics` at 305, 320, 360,
  390, 768, 1280 and 1440 px. Its final pass was **196/196**. Full-page
  screenshots at 1440/768/390/305 are in `docs/qa/checkpoint-statistics/`;
  desktop and 390px images were visually inspected. A source-panel button text
  contrast issue found in that inspection was corrected and all gates rerun.
- Git branch creation is blocked in this environment because the shared Git
  common directory rejects ref-lock creation. Work remains on the existing
  non-main development branch while release preparation is verified.

## Next owner

Development completes the remaining gates and reports the final evidence to
Command Center. Command Center then routes the review to QA/Accessibility,
SEO and Social as appropriate.
