# Release tracker

The ledger of what is where: production, the experimental branch, every
deployment that matters, and the rules that govern movement between them.
Update this file whenever a commit is pushed, a preview is reviewed, or a
release decision is made.

_Last updated: **24 August 2026** (footer cleanup — the two repetitive footer
disclaimer paragraphs consolidated so the disclaimer appears once; prepared on
the current branch tip, not yet pushed. Checkpoint 2A — Government hub +
Officials — was pushed at `cf1ee7c` and Codex-approved; its docs/CSS cleanup
landed at `657fbb2`)._

> **CURRENT RELEASE OVERRIDE — 2026-09-13:** `main` and `origin/main` were
> fetch-verified at `16532fe`, which merges the Kabugao in View rebuild into
> production history. Feature discovery is now the active work; no new feature
> has been implemented or approved yet. See
> `docs/sessions/2026-09-13-feature-research-and-handoff.md`.

## Release rules (standing)

1. **Never push directly to `main`.** All work lands on a review/experiment
   branch and waits for review.
2. **Codex approves every checkpoint** before work continues, and approves any
   merge to `main`. Approval arrives through Robin as a written message.
3. **Robin pushes** from the authorized PC. The build sandbox has no
   credentials; it prepares commits and hands over verified command blocks.
4. Cloudflare Pages **auto-builds every pushed branch**; the preview URL is in
   the dashboard (Workers & Pages → betterkabugao → Deployments, beside the
   commit). Production only ever builds from `main`.
5. Preview canonicals point at `betterkabugao.org` **on purpose** (keeps
   previews out of search). Do not "fix" this.
6. Before preparing any commit, fetch and pin the **exact origin tip SHA** and
   verify `git rev-parse HEAD` matches it. Never `git reset --hard` to an
   unverified ref (see the `3352ee3` wrong-parent incident in the release
   history below).

## Production

| | |
|---|---|
| Branch | `main` |
| HEAD | `745b8779dd711cc20d478dee82f01101c9ed2c74` — "Merge pull request #2 from KuyaLoy/improvement/search-404-recovery" (2026-08-20) |
| Live at | https://betterkabugao.org (+ betterkabugao.pages.dev) |
| Production deployment | `https://f5c8c775.betterkabugao.pages.dev` (Cloudflare, Success) |
| Contents | v3.0.0 multi-page portal + `/sitemap` page (PR #1) + search/404 recovery screens and the site-wide search overlay (PR #2) — 33 prerendered routes |
| Status | **Untouched by the visual rebuild.** No merge is approved. |

## Experimental — `experiment/full-site-visual-rebuild-v2` ("Kabugao in View", Checkpoint 1)

Cut clean from `origin/main` @ `745b877`. For an **experimental Cloudflare
staging preview only** — never main/production — until Codex approves a merge.

| Commit (2026-08-21 UTC) | Round | Preview | Outcome |
|---|---|---|---|
| `ab1f15d` 10:29 | build | — (pushed with round 1) | Checkpoint 1 built |
| `0dde1b7` 11:59 | 1 | `https://fdabf678.betterkabugao.pages.dev` | 8 blockers fixed; Codex re-review |
| `7d7937d` 13:07 | 2 | `https://efa2b4a9.betterkabugao.pages.dev` | 4 blockers + 2 visual asks fixed; committed QA harness |
| `ae8ef20` 14:04 | 3 | `https://2425eba4.betterkabugao.pages.dev` | copy blocker cleared; mobile header; pretest ordering |
| `3352ee3` 20:05 | 5 | `https://42466ff9.betterkabugao.pages.dev` | hero-search one-line fix — **wrong parent** (`ae8ef20`); dropped round 4 |
| `e5dc158` 21:00 | 6 | `https://e19410fa.betterkabugao.pages.dev` | round 4 restored on the correct parent. **✅ Checkpoint 1 APPROVED by Codex, 2026-08-22.** |

Round 4 (`b50138e`, body `min-width:320px` removal) was created in the old
build sandbox and never reached origin; `e5dc158` re-applied its three changes
(CSS removal, contract test, 305x568 QA size). `b50138e` is **not** an ancestor
of the origin branch — never resurrect or reset to it.

### Labels of record

| | |
|---|---|
| **Approved implementation baseline** | `e5dc158fe3b75b406f0a9663d5a70a55f08bf1bf` — the Codex-approved Checkpoint 1 code |
| **Approved preview** | `https://e19410fa.betterkabugao.pages.dev/` (deployment of the baseline) |
| **Handoff documentation commit** | `5f7375598fd42d5fd239374aece1fda38282c648` (docs only, 2026-08-23) |
| **Approved handoff content commit** | `7b121df2cb79f879fdf2722202127fbe9509cff5` — the corrected handoff docs Codex reviewed and **APPROVED on 2026-08-23**; migration complete |
| **Current remote HEAD** | never hardcoded in docs — `git fetch origin && git rev-parse origin/experiment/full-site-visual-rebuild-v2` is authoritative. Later documentation-only corrections may follow `5f73755`. |

### Documentation-only commits on the branch (no site-output change)

| Commit | Date (UTC) | What |
|---|---|---|
| `5f73755` | 2026-08-23 02:21 | account-migration handoff (7 doc files); auto-built preview is not a review artifact |
| `7b121df` | 2026-08-23 | Codex-requested correction pass (5 doc files): baseline vs HEAD labels, identity line, `npm ci`. **Approved handoff content commit.** |
| _(follows `7b121df`)_ | 2026-08-23 | status-stamp commit recording Codex's approval (5 doc files; its own SHA is deliberately not written here — fetch is authoritative) |

Gates at the approved baseline: 39 contract + 49 unit tests; typecheck + lint
clean; build `PRERENDER_OK 33 pages`; `npm run qa` 123/123 (report committed
at `docs/qa/checkpoint-1/qa-report.json`).

## Experimental — Checkpoint 2A ("Kabugao in View": Government hub + Officials)

One focused commit brings `/government` and `/government/officials` into the CP1
direction; no other route is touched. **PUSHED at `cf1ee7c`; Cloudflare preview
live; Codex APPROVED the code and visual direction (2026-08-24).** A small
docs/CSS cleanup pass followed on the same branch.

| | |
|---|---|
| Scope | `/government` (editorial wayfinding list) + `/government/officials` (scannable roster) |
| Parent SHA | `69a74d1436509aeb0f97ce22b0c81a7cf1604005` (the parent of the CP2A commit) |
| Changed — code | `src/components/PageHeader.tsx` (additive `kv` variant), `src/pages/SimplePages.tsx` (GovernmentPage), `src/pages/OfficialsPage.tsx`, `src/styles.css` (CP2A layer) |
| Changed — tests/QA | `tests/site-contracts.test.mjs` (cross-check + 2 files), `src/App.test.tsx` (hub test), `scripts/qa/checkpoint1.mjs` (+ both routes; report now written to `docs/qa/checkpoint-2a/`), `docs/qa/checkpoint-2a/` (qa-report.json + screenshots + qa-note.md). The CP1 report `docs/qa/checkpoint-1/qa-report.json` is left unchanged. |
| Changed — docs | this file, `active-task.md`, `START-HERE.md`, `CONTEXT.md`, `docs/skills/frontend-standards/SKILL.md`, `README.md`, `docs/sessions/2026-08-24-checkpoint-2a-government-officials.md` |
| Gates | 39 contract + 50 unit; typecheck + lint clean; `PRERENDER_OK 33 pages`; `npm run qa` **175/175, exit 0** |
| Pushed commit | `cf1ee7cc4a29114d5819557f81b762e3bcd1404f` (pushed 2026-08-24; a small docs/CSS cleanup commit follows on the same branch) |
| Preview | https://69d4e1d9.betterkabugao.pages.dev/ (Cloudflare deploy succeeded) |

## Experimental — Footer cleanup (standalone correction)

A small standalone correction on the same experimental branch: the global
footer stated the independence disclaimer twice (the brand column's
`.footer__about` paragraph and the bottom `.footer__disclaimer` row).
Consolidated so it appears once — the brand column carries the independence +
BetterGov-network disclaimer (`siteContent.disclaimer`, Codex's approved
consolidated wording) and the bottom row carries only the source line
(`siteContent.sourceNote`). **Codex approved with one copy edit (2026-08-24);
committed on the branch. Push pending** — the build session cannot push, so the
origin SHA and preview come from Robin's push.

| | |
|---|---|
| Scope | footer copy consolidation only — no layout change, no new classes, no other route |
| Changed — code | `src/components/SiteFooter.tsx`, `src/app/site-content.ts` (`disclaimer` + `sourceNote` wording) |
| Changed — tests | `tests/site-contracts.test.mjs` — the pinned disclaimer assertion updated to the new wording in the same change (never deleted) |
| Changed — docs | this file, `active-task.md`, `START-HERE.md`, `CONTEXT.md`, `docs/sessions/2026-08-24-footer-disclaimer-cleanup.md` |
| Not changed | author, licence, version, Find/Network links; **no "Barangay officials" link added**; no barangay names; `index.html` `<noscript>` untouched |
| Gates | 39 contract + 50 unit; typecheck + lint clean; `PRERENDER_OK 33 pages`; `npm run qa` **175/175, exit 0** |
| Prepared on parent | current origin tip `657fbb2` (fetch-verified) |
| Preview | pending push |

Checkpoint 2B (barangay officials) remains **blocked** pending an official DILG
roster — no names added or guessed.

## Approval log

| Date | What | Who | Record |
|---|---|---|---|
| 2026-08-21 | "Kabugao in View" direction approved (AI-slop 2/10, distinctiveness 8/10, identity 9/10, appeal 8/10) | Codex | spec §1 |
| 2026-08-21 | Implementation re-scored at round 2 (AI-slop 1/10, distinctiveness 8/10) | Codex | active-task §2d |
| 2026-08-20 | CSP `form-action` relaxed `'none'` → `'self'` | Codex (written) | CONTEXT.md decision log; contract test |
| 2026-08-22 | **Checkpoint 1 approved** at `e5dc158` / preview `e19410fa` | Codex | this tracker; active-task |
| 2026-08-23 | **Account-migration handoff APPROVED** at content commit `7b121df` — migration complete; the new Claude account follows the first-day checklist | Codex | active-task; this tracker |
| 2026-08-24 | **Checkpoint 2A scope APPROVED for implementation** (`/government` + `/government/officials`) with rulings | Codex | active-task; `docs/sessions/2026-08-24-checkpoint-2a-government-officials.md` |
| 2026-08-24 | **Checkpoint 2A APPROVED** (code + visual direction) at `cf1ee7c` / preview `69d4e1d9` | Codex | this tracker; active-task |
| 2026-08-24 | **Footer cleanup APPROVED with one copy edit** (consolidated disclaimer wording) on `experiment/full-site-visual-rebuild-v2` | Codex | this tracker; `docs/sessions/2026-08-24-footer-disclaimer-cleanup.md` |
| pending | Later checkpoint scopes (2B onward) | Robin + Codex | — |
| not approved | Merge of the rebuild to `main` | Codex | — |

## Next movements (in order)

1. ~~Codex approves a Checkpoint 2A scope~~ — **done, 2026-08-24.**
2. ~~Build Checkpoint 2A~~ — **done; gates green.**
3. ~~Robin pushes the CP2A commit~~ — **done: `cf1ee7c` (2026-08-24).**
4. ~~Cloudflare preview + Codex review~~ — **done: preview https://69d4e1d9.betterkabugao.pages.dev/ ; Codex APPROVED the code and visual direction.**
5. ~~Final docs/CSS cleanup pass lands on the same branch~~ — **done: `657fbb2` (2026-08-24).**
6. Footer cleanup (standalone) prepared on the branch tip — **Robin pushes; Cloudflare auto-builds the preview; Codex reviews.**
7. Checkpoint 2B (barangay officials) is **blocked** pending an official DILG roster; the scope resumes once Robin + Codex supply one.
8. Merge to `main` is proposed only at full-site parity — Codex's call.
