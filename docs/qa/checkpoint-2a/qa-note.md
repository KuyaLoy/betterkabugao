# BetterKabugao — Checkpoint 2A QA note (Government hub + Elected officials)

Date: 2026-08-24
Branch: experiment/full-site-visual-rebuild-v2
Parent SHA: 69a74d1436509aeb0f97ce22b0c81a7cf1604005
Pushed at: cf1ee7cc4a29114d5819557f81b762e3bcd1404f (2026-08-24)
Cloudflare preview: https://69d4e1d9.betterkabugao.pages.dev/
Status: Codex approved the code and visual direction (2026-08-24); a small
docs/CSS cleanup pass followed on the same branch.
Scope: /government and /government/officials only. No other route touched.

## Gates (clean clone, parent 69a74d1)
- npm test        -> 39 contract + 50 unit — PASS
- npm run typecheck -> clean
- npm run lint      -> clean
- npm run build     -> PRERENDER_OK 33 pages
- npm run qa        -> ALL PASS — 175/175 checks, exit 0

## New Checkpoint 2A QA checks (all PASS)
- /government and /government/officials: zero horizontal overflow, one <h1>,
  one <main> at 305 / 320 / 360 / 390 / 768 / 1280 / 1440.
- Hub: three real crawlable destination links (/government/officials,
  /government/barangays, /transparency); kv interior header (no card grid);
  visible keyboard focus ring; reduced-motion disables the entry animation.
- Officials: one <h1>; executive names present (Bensmar B. Ligwang,
  Frederick C. Amid); eight "Sangguniang Bayan Member"; eLGU source link
  present; kv interior header + roster (no cards).

## Evidence in this folder (docs/qa/checkpoint-2a/)
- government-1440.png (Government hub — desktop)
- government-390.png  (Government hub — mobile)
- officials-1440.png  (Officials — desktop)
- officials-390.png   (Officials — mobile)
- government-768.png, government-305.png, officials-768.png, officials-305.png
  (the remaining widths; all regenerate here on `npm run qa`)

## Machine-readable QA report
- docs/qa/checkpoint-2a/qa-report.json — the committed harness report for
  Checkpoint 2A (totalChecks 175, passed 175, failed 0). The Checkpoint 1
  report at docs/qa/checkpoint-1/qa-report.json is left unchanged.

## Notes
- Maps are not present on these two routes, so the sandbox blank-tile
  limitation is irrelevant here.
- QA numbers come only from the committed harness (`npm run qa`).
