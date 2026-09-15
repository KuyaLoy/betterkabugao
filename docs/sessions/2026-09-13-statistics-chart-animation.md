# 2026-09-13 — Statistics chart animation

## Who

Robin approved the release through the BetterKabugao Command Center;
Development implemented and verified it.

## What changed

- The population line draws once from 1960 to 2024 when roughly 20% of the
  chart enters the viewport.
- Nine points reveal in chronological order at 105ms intervals; 2024 is last.
- Reduced-motion, print and JavaScript-off visitors receive the full static
  chart immediately.
- Focused unit and Playwright coverage protects the trigger, timing, ordering,
  no-replay behavior and fallbacks.
- Targeted screenshots and a 9/9 report live in
  `docs/qa/checkpoint-statistics/`.

## Decisions made (and why)

- CSS owns the animation; React only adds one visibility class. This avoids
  per-frame state and keeps the server-rendered chart authoritative.
- The chart is the page's sole signature motion; no decorative movement or
  chart library was added.
- QA depth is proportional to change risk. Full automated gates remain
  mandatory; browser QA focused on `/statistics` and reused the green 196/196
  baseline for unchanged surfaces.
- Lowest-capable models remain the default to control credit use.

## Verified

- `npm test`: 40 contract tests and 53 unit tests passed; build completed with
  `PRERENDER_OK 34 pages`.
- `npm run typecheck` and `npm run lint`: passed.
- `npm run build`: passed; `SEO_OK ... 33 sitemap URLs` and `PRERENDER_OK 34
  pages`.
- `npm run qa:statistics`: 9/9 checks passed, including print output.
- 390px, 1440px and reduced-motion screenshots were visually inspected; no
  overflow, overlap or incomplete chart was found.

## Open threads

- Social assets and publishing remain owned by Social Media and were excluded.
- The separately proposed civic features remain unapproved.

## Handoff notes

This recap ships with the implementation. Use Git history for the exact release
SHA and Cloudflare deployment state; do not infer it from older historical rows.
