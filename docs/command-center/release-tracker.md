# Release tracker

The ledger of what is where: production, the experimental branch, every
deployment that matters, and the rules that govern movement between them.
Update this file whenever a commit is pushed, a preview is reviewed, or a
release decision is made.

_Last updated: **23 August 2026** (account-migration handoff)._

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

**Branch tip of record: `e5dc158fe3b75b406f0a9663d5a70a55f08bf1bf`.
Approved preview of record: `https://e19410fa.betterkabugao.pages.dev/`.**

Gates at the tip: 39 contract + 49 unit tests; typecheck + lint clean; build
`PRERENDER_OK 33 pages`; `npm run qa` 123/123 (report committed at
`docs/qa/checkpoint-1/qa-report.json`).

## Approval log

| Date | What | Who | Record |
|---|---|---|---|
| 2026-08-21 | "Kabugao in View" direction approved (AI-slop 2/10, distinctiveness 8/10, identity 9/10, appeal 8/10) | Codex | spec §1 |
| 2026-08-21 | Implementation re-scored at round 2 (AI-slop 1/10, distinctiveness 8/10) | Codex | active-task §2d |
| 2026-08-20 | CSP `form-action` relaxed `'none'` → `'self'` | Codex (written) | CONTEXT.md decision log; contract test |
| 2026-08-22 | **Checkpoint 1 approved** at `e5dc158` / preview `e19410fa` | Codex | this tracker; active-task |
| pending | Account-migration handoff documentation review | Codex | this commit |
| pending | Checkpoint 2 scope | Robin + Codex | proposal in `docs/sessions/2026-08-23-claude-account-migration-handoff.md` |
| not approved | Merge of the rebuild to `main` | Codex | — |

## Next movements (in order)

1. Codex reviews this handoff commit (docs only, on the experimental branch).
2. Robin + Codex approve a Checkpoint 2 scope.
3. Checkpoint 2 is built in review commits on an approved branch, previewed,
   and approved round by round.
4. Merge to `main` is proposed only at full-site parity — Codex's call.
