---
name: session-memory
description: BetterKabugao session memory protocol — use at the START of every working session (to load context) and at the END of every session (to write the recap). Prevents knowledge loss between sessions, devs, and AI assistants.
---

# Session Memory Protocol

Multiple volunteers and AI assistants work on this repo across sessions.
Context dies when a session ends — unless it is written down. This protocol
is mandatory.

It applies equally to new work and to sessions that resume an older branch,
task or AI handoff. Older records are historical evidence, not permission to
skip the current recap. When an older status is stale, add a dated override or
correction and keep the original entry for traceability.

The maintainer may use Tagalog for feelings, emphasis or requirements. The
default assistant response language is English unless the maintainer requests
another language; the recap must preserve the full meaning of every decision.

## At session START (before touching code)

1. Read **`docs/START-HERE.md`** — the single entry point: current state, what
   is already built, the ordered plan, and the traps that have already cost
   this project time.
2. Read `docs/CONTEXT.md` — the snapshot and the dated decision log.
3. Read the most recent file in `docs/sessions/` — what happened last time and
   what was left unfinished.
4. Read `CLAUDE.md` — the hard rules.
5. `git log --oneline -15` — what actually landed recently. Note that the
   working tree may hold reviewed-but-unpushed work; check `git status` too.

Do NOT re-derive project decisions from scratch or re-ask the maintainer
things answered in these files.

## At session END (before handing off / stopping)

1. **Update `docs/START-HERE.md`**: move finished items out of the plan, record
   any new trap, refresh the state table and the test counts. This file is what
   the next developer or model reads first — if it is stale, everything
   downstream is wrong.
2. **Update `docs/CONTEXT.md`**: current state line, any new decisions in
   the log (with date), revised next steps. Keep it a snapshot, not a diary —
   overwrite stale facts instead of appending forever.
3. **Write `docs/sessions/YYYY-MM-DD-<topic>.md`** using the template below.
4. If conventions changed: update `CLAUDE.md` and the matching contract test
   in the same commit. Check `README.md` too — it is public-facing and goes
   stale silently.
5. Record deliverables that were sent to the maintainer but **not committed**
   (exported images, captions, one-off reports). Anything that exists only in a
   chat window is lost the moment the session ends.

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
