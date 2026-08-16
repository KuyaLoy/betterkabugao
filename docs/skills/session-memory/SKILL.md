---
name: session-memory
description: BetterKabugao session memory protocol — use at the START of every working session (to load context) and at the END of every session (to write the recap). Prevents knowledge loss between sessions, devs, and AI assistants.
---

# Session Memory Protocol

Multiple volunteers and AI assistants work on this repo across sessions.
Context dies when a session ends — unless it is written down. This protocol
is mandatory.

## At session START (before touching code)

1. Read `docs/CONTEXT.md` — current state, decisions log, next steps.
2. Read the most recent file in `docs/sessions/` — what happened last time,
   what was left unfinished.
3. Read `CLAUDE.md` — the hard rules.
4. `git log --oneline -15` — what actually landed recently.

Do NOT re-derive project decisions from scratch or re-ask the maintainer
things answered in these files.

## At session END (before handing off / stopping)

1. **Update `docs/CONTEXT.md`**: current state line, any new decisions in
   the log (with date), revised next steps. Keep it a snapshot, not a diary —
   overwrite stale facts instead of appending forever.
2. **Write `docs/sessions/YYYY-MM-DD-<topic>.md`** using the template below.
3. If conventions changed: update `CLAUDE.md` and the matching contract test
   in the same commit.

## Recap template

```markdown
# YYYY-MM-DD — <topic>

## Who
<who drove the session; which assistant/tooling>

## What changed
<bullet list of shipped changes, by file/area>

## Decisions made (and why)
<decision → reason. These graduate into docs/CONTEXT.md's log>

## Verified
<gates run and their results; screenshots taken; what was NOT verified>

## Open threads
<unfinished work, known issues, blocked items — with enough detail that a
stranger can pick each one up cold>

## Handoff notes
<exact next actions, commands, or links the next session needs>
```

## Rules of thumb

- A decision that isn't in `docs/CONTEXT.md` doesn't exist.
- Recaps state what was VERIFIED vs what was merely written — never claim
  untested work as done.
- Keep recaps under ~60 lines; link to commits/PRs instead of pasting diffs.
