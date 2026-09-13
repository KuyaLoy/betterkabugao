# 2026-09-13 — Release prep: CTA, social card and team governance

## Scope

Development verified and completed three release-prep corrections on `main`:
the statistics source CTA alignment, the evergreen social preview, and the
permanent Command Center/department boundary.

## Changes

- Restored flex centering for the `/statistics` “All 21 barangays” CTA and
  added a CSS regression contract.
- Replaced the outdated “Coming soon” social card with deterministic 1200×630
  artwork using the approved “Know your Kabugao.” and source-led site copy.
- Added `docs/command-center/COMMAND-CENTER-RULES.md` and linked it from the
  primary handoff/context files.
- Excluded nested `.worktrees/` from Vitest discovery after the full test run
  exposed an old worktree's Node contract files as false Vitest suites; a
  contract test now protects that exclusion.

## Verification

- `npm test`: 40 contract tests and 51 unit tests passed; `PRERENDER_OK 34 pages`.
- `npm run typecheck`, `npm run lint`, and a separate `npm run build`: passed.
- `npm run brand:social`: `SOCIAL_CARD_OK 1200x630`; output visually inspected.
- `npm run qa`: 196/196 checks passed. The 390px statistics screenshot was
  visually inspected and confirms the CTA text is centered.
- Unrelated regenerated Checkpoint 1 and 2A QA files were restored to HEAD.

## Release state

Commit and push are deliberately on hold while UX prepares a restrained
population-chart animation for Robin's approval. Untracked UX and social-team
handoffs/assets were preserved and are not part of this Development scope.
