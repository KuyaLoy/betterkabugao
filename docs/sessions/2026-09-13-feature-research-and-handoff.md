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

## Protocol update

- Robin clarified that Tagalog may be used to express feelings, emphasis or
  intent, while Codex should reply in English by default.
- This language preference and the strict retroactive handoff requirement were
  added to `CLAUDE.md` and `docs/skills/session-memory/SKILL.md`.
- Existing sessions are covered: every resumed task must read the current
  handoff files, verify Git state, and leave a dated recap before stopping.

## Team operating model decision — 2026-09-13

To reduce overwhelm and prevent conflicting work in the shared folder, the
Project Manager task is now the **BetterKabugao Command Center**, the single
user-facing owner. Robin normally communicates only with that task. It
delegates the minimum necessary request to specialists, reconciles their
findings, obtains approval, and sends Development one consolidated brief.
Development is the sole task permitted to edit code or Git. All specialists
remain read-only and provide research, design, content, review findings or
safe command proposals. After implementation, the Command Center routes the
appropriate QA and Platform/Security checks before reporting release
readiness. English is the default response language; Tagalog intent remains
preserved in requirements and handoffs.

### Specialist task directory

| Department | Task ID |
|---|---|
| Development | `019fbf4d-1754-7ec2-8543-0e337ac3c68c` |
| Social Media | `01a097ba-2598-7071-a5b9-ca314b235ec9` |
| QA & Accessibility | `01a097bd-e241-7b90-8036-b80e30287c80` |
| Civic Research & Data | `01a097bd-eff0-72c3-a198-317fdf795060` |
| UX & Brand | `01a097be-039b-7be3-aa38-12ef76d3fa68` |
| SEO & Growth | `01a097be-13bb-7f22-a1c6-7c2cab864c70` |
| Platform & Security | `01a097be-20b2-71f2-8ed5-5ad7b8e18d13` |
| Community & Editorial | `01a097be-2fa2-7e60-89f5-1230eaf0ae23` |

The Command Center task is `01a097b8-3176-7dd1-8759-ec9f47f47b57`.

### Adaptive model-routing policy

The Command Center chooses model and reasoning separately for every delegated
turn according to complexity, consequence and uncertainty. Luna low/medium
covers routine status checks, summaries, formatting, documentation and simple
social/editorial drafts. Terra medium/high covers normal implementation,
UI/SEO work, structured research, test writing and ordinary debugging. Sol
high/xhigh covers difficult bugs, complex refactors, cross-system reasoning,
sensitive civic-data synthesis, security and release review. Astra high or
above is reserved for exceptional architecture decisions, unresolved high-risk
failures or the hardest end-to-end work. Start at the lowest reliable tier and
escalate only when evidence shows it is needed; this protects Robin's $20 Plus
allowance. Model overrides apply per delegated turn and must be specified each
time.
