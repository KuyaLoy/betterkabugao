# Skills for contributors using AI assistants

Volunteers working on BetterKabugao often pair with an AI assistant
(Claude Code, Codex, Cursor, Copilot). This folder holds the project's own
skills, and points at the external skill sets we recommend installing.

## Project skills (in this folder — read these first)

| Skill | Use it when |
|---|---|
| `frontend-standards/SKILL.md` | Writing or reviewing any UI, styles, component or visual change |
| `security-review/SKILL.md` | Before every commit; touching `public/_headers`; adding a dependency; handling user input |
| `session-memory/SKILL.md` | At the start and end of every working session |

These encode decisions specific to this repo — the BetterGov design tokens,
the BetterLGU layout conventions measured in `design-research/RESEARCH.md`,
the strict CSP, and the "never invent government data" rule.

These skills are committed in `docs/skills/` so every contributor gets them
on clone. `CLAUDE.md` — which Claude Code reads automatically — points here,
so an assistant working in this repo will find them.

To have Claude Code load them as first-class skills, copy the folder locally:

```bash
mkdir -p .claude && cp -r docs/skills .claude/skills
```

That copy is optional. Some sandboxed environments block writes to `.claude/`;
if the command fails, ignore it — the skills still work as documentation.

## Recommended external skill sets

These are **not vendored** into this repository on purpose — see "Why not
vendored" below. Install them into your own environment.

### Superpowers — disciplined engineering workflow

Brainstorming before building, writing and executing plans, TDD, systematic
debugging, code review, and verification-before-completion. This is the
workflow this project was rebuilt with.

- Source: <https://github.com/obra/superpowers>
- Install (Claude Code):
  ```
  /plugin marketplace add obra/superpowers-marketplace
  /plugin install superpowers@superpowers-marketplace
  ```

### Taste Skill — anti-slop frontend design

Frontend skills aimed squarely at stopping AI-generated pages from looking
generic — the exact failure mode this project's first launch page fell into.
Useful when building the full portal's UI.

- Source: <https://github.com/Leonxlnx/taste-skill>

### OpenViking — context database for AI agents

Persistent context/memory for agents across sessions. Complements our
`session-memory` skill if the team outgrows plain markdown recaps.

- Source: <https://github.com/volcengine/OpenViking>

## Why not vendored

BetterKabugao is a small static civic site that volunteers clone on modest
connections. Copying these repositories in would add roughly **160 MB and
4,000+ files** (OpenViking alone is ~154 MB of Rust source), none of which
ships to a visitor. It would also freeze the skills at today's version and
put us in the position of maintaining someone else's code.

Linking keeps the repository light and the skills current. If the team later
wants one pinned in-tree, vendor only the specific `SKILL.md` files needed,
with attribution and the upstream licence.
