# 2026-09-13 — Feature research and handoff

## Who

Robin Tapiru and Codex. Repository checked from `C:\Users\Robin Tapiru\Documents\betterkabugao`.

## What changed

- Fetched `origin/main` and fast-forwarded local `main` to `16532fe`.
- Confirmed local `main` and `origin/main` are synchronized with no working-tree changes.
- Added current-status overrides to the handoff and command-center files so
  older experimental-branch notes are not mistaken for the current state.
- Recorded this feature discussion and the next approval gate in this recap.

## Research and decisions

- The official BetterLGU guide defines a portal around budgets, projects,
  officials, ordinances, and contact information, sourced from public records:
  <https://lgu.bettergov.ph/GUIDE>.
- The BetterLGU directory shows active portals commonly exposing services,
  hotlines, statistics, maps, officials, and updates:
  <https://lgu.bettergov.ph/>.
- BetterKabugao already has the multipage foundation: government pages,
  officials, 21 barangays and detail pages, maps, emergency hotlines, search,
  sitemap, and transparency/explore/services routes.
- The strongest next feature recommendation is **Public Projects & Flood
  Watch**: a sourced `/projects` page beginning with the six Kabugao flood-control
  records already identified in `docs/research/data-tracker.html`, with budget,
  contractor, dates, coordinates, filters, and source/retrieval dates. Later it
  can overlay bridges and flood-hazard areas.
- Alternatives presented to Robin: **Services Navigator** and **Budget &
  Disaster Fund Explorer**. No implementation has started and no option has
  been approved yet.

## Verified

- `git pull --ff-only origin main` completed successfully.
- `git status --short --branch` showed `main...origin/main` with no changes.
- `git rev-list --left-right --count HEAD...origin/main` returned `0 0`.
- No feature code, data, dependency, deployment, or external service changed.

## Open threads

- Robin must choose the first feature direction: Projects & Flood Watch,
  Services Navigator, or Budget & Disaster Fund Explorer.
- After selection, write and approve a focused design before implementation.
- Any new published fact must have an official source and retrieval date beside it.

## Handoff notes

1. Read `docs/START-HERE.md`, `docs/CONTEXT.md`, this recap, and `CLAUDE.md`.
2. Do not treat older “experimental rebuild” rows as current; the override at
   the top of each command-center file points to `main` `16532fe`.
3. Do not code until Robin approves the selected feature design.
