# 2026-08-17 — handoff documentation

## Who

Robin Tapiru, with Claude (Cowork). Third checkpoint of the day, after the v1
multi-page build and the Leaflet maps.

## What Robin asked for

> "create a detailes session ok a memory for the next developer or other can
> understand what will do — make sure ai will read our plan whats aleaready
> done again md is very important"

> "and everything you made is you will add in memory"

So: one document a stranger — human or model — can open cold and understand the
project, what exists, and what to do next. Plus an inventory of everything
produced so far, including things that never reached the repository.

## What changed

- **New `docs/START-HERE.md`** — the single entry point. Eleven sections:
  reading order · what the project is · current state · everything already built
  (routes, internals, research artefacts, and **deliverables that live only in
  chat**) · the ordered plan with per-step status · who each item is blocked on ·
  the rules an assistant breaks by default · how to work here · the traps that
  have already cost time · a file map · where each dataset comes from · what to
  do before finishing a session.
- **`CLAUDE.md` corrected.** It claimed *no router*, *one third-party runtime
  host*, a *1200px container*, a *coming-soon-only release* and *16,215
  residents (2020 census)* — all wrong now. Added the two-host rule with
  `frame-src` deliberately absent, the Leaflet CSP reasoning, the
  never-simplify-the-build warning, and a pointer to START-HERE.
- **`README.md` rewritten.** It still advertised **Figtree** (removed weeks ago
  in favour of Inter) and the **Apayao-silhouette logo** (discarded when Robin
  asked to keep the original mark). Now documents the real route table,
  prerendering, the privacy/security posture, and the data attributions.
- **`docs/skills/frontend-standards/SKILL.md`** — container 1200 → 1440 plus
  `--measure: 68ch`; the fact block corrected to 16,425 (2024 POPCEN), 132 m,
  18.0246/121.1845, 1st class, PSGC. Notes that 16,215 remains correct *for
  2020* so older logs are not misread.
- **`docs/skills/session-memory/SKILL.md`** — START-HERE added to both the
  start-of-session and end-of-session checklists, plus two new obligations:
  check `README.md` for staleness, and record deliverables sent to the
  maintainer that were never committed.
- **`docs/CONTEXT.md`** — points at START-HERE, records the container change
  with its date, and logs this documentation pass.

## Decisions made (and why)

- **One entry point, not five.** Context was spread across `CLAUDE.md`,
  `CONTEXT.md`, two session logs and three research files, and two of those had
  gone stale without anyone noticing. A stale rulebook is worse than none,
  because it is followed.
- **Record uncommitted deliverables in the repo.** The transparent logo PNGs,
  the FB/IG profile picture, the wordmark lockup, the Facebook cover and the
  social launch poster and caption were all delivered in chat and appear nowhere
  in git. They are now inventoried in START-HERE §3, with a note that only the
  SVGs are reproducible (`npm run brand:build`) and that a PNG export script is
  a worthwhile small task.
- **The flood-control deferral is stated in the plan itself**, quoting Robin,
  next to the roadmap step that calls it "the flagship". The data is ready and
  the tracker is persuasive; without the quote the next session would build it.

## Verified

```
npm test          → 28 contract tests pass, 0 fail; 24 unit tests pass
npm run typecheck → clean
npm run lint      → clean
npm run build     → PRERENDER_OK 31 pages
```

Every figure in the new docs was read back out of the code rather than recalled:
dependency versions from `package.json`, `ALL_PATHS` from `src/lib/seo.ts`, the
sitemap count from `public/sitemap.xml`, the CSP from `public/_headers`, the
published facts from `src/app/site-content.ts`, and the roadmap from the
`ROADMAP` array in `docs/research/data-tracker.html`.

No code changed in this session, so no new screenshots were needed.

## Open threads

Unchanged by this session, and all listed in START-HERE §4–5:

- Robin's **Facebook / Instagram / Threads URLs** — still blocking the BetterLGU
  Directory PR.
- The v1 multi-page portal and the maps are **still unpushed**; branch
  `feat/multipage-v1`.
- Flood control, fiscal data and public works (roadmap steps 2–4, 7) are
  **deferred by the maintainer**, not merely unstarted.
- BLGF licence email to `lfdad@blgf.gov.ph` before any fiscal data ships.
- `package.json` licence (ISC) still disagrees with the footer (MIT · CC BY 4.0).
- No PNG export script for the social/brand assets.
- Hazard map (step 6) needs a Leaflet-vs-MapLibre decision for PMTiles.

## Handoff notes

Next session: open `docs/START-HERE.md`, then `docs/CONTEXT.md`, then the
newest file in `docs/sessions/`. Do not start anything in §4 marked ⛔ without
asking Robin first.
