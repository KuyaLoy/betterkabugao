# 2026-09-15 — Statistics chart no-replay fix

## Who

Robin authorized Release 1.1 through the BetterKabugao Command Center.
Development investigated, fixed and verified the release.

## What changed

- The chart marks itself complete when its line animation ends.
- The completed state forces the final static line and points, preventing a
  browser from re-creating the CSS animation when the chart re-enters view.
- Unit and focused browser QA now assert the permanent completed state and a
  completed → scroll away → return sequence with zero active animations.

## Root cause

The initial release relied on CSS `forwards` to retain the endpoint. That left
the visible final state tied to the CSS animation timeline. A durable
`is-complete` state now makes the endpoint ordinary static styling after the
one allowed run.

## Verified

- RED: the new unit expectation for `is-complete` failed before the fix.
- GREEN: focused unit regression passed after the fix.
- `npm test`: 40 contract tests and 53 unit tests passed.
- `npm run typecheck`, `npm run lint` and production build passed;
  `PRERENDER_OK 34 pages`.
- `npm run qa:statistics`: 10/10 passed, including no replay after scroll,
  390px and 1440px final state, reduced motion, print and JavaScript-off.

## Handoff notes

Release 1.1 changes only the statistics animation lifecycle, its tests and its
targeted evidence. Unrelated QA regeneration and Social-owned files remain
outside this release.
