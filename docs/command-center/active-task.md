# ACTIVE TASK — Checkpoint 2A built (Government hub + Officials), awaiting Codex review

> Any session resuming work reads this file first, then
> `docs/command-center/release-tracker.md`, then the latest file in
> `docs/sessions/`. Update this file after each milestone.

_Last updated: **2026-08-24** (Checkpoint 2A implemented on the experimental
branch; all gates green in a clean clone; awaiting Robin's push, the Cloudflare
preview, and Codex review)._

---

## 0. Where things stand (verified)

| | |
|---|---|
| Branch | `experiment/full-site-visual-rebuild-v2` |
| **Approved implementation baseline** | `e5dc158fe3b75b406f0a9663d5a70a55f08bf1bf` — the Codex-approved Checkpoint 1 code |
| Checkpoint 1 | **APPROVED by Codex, 2026-08-22** (at the baseline above) |
| **Approved preview** | `https://e19410fa.betterkabugao.pages.dev/` (deployment of the baseline) |
| **Handoff documentation commit** | `5f7375598fd42d5fd239374aece1fda38282c648` — docs only, on the baseline |
| **Approved handoff content commit** | `7b121df2cb79f879fdf2722202127fbe9509cff5` — the corrected handoff docs Codex reviewed. **Account-migration handoff APPROVED by Codex on 2026-08-23; migration complete.** |
| **Current remote HEAD** | never hardcoded here — `git fetch origin && git rev-parse origin/experiment/full-site-visual-rebuild-v2` is authoritative; later documentation-only corrections may follow `5f73755` |
| `main` | `745b8779dd711cc20d478dee82f01101c9ed2c74` — **untouched**; no merge approved |
| Gates at the approved CP1 baseline | 39 contract + 49 unit; typecheck + lint clean; build `PRERENDER_OK 33 pages`; `npm run qa` 123/123, exit 0 |
| **Checkpoint 2A** | **BUILT on `experiment/full-site-visual-rebuild-v2`; prepared on parent `69a74d1…604005`; gates green (39 contract + 50 unit; typecheck + lint clean; `PRERENDER_OK 33 pages`; `npm run qa` 175/175). Awaiting Robin's push, the Cloudflare preview, and Codex review.** Scope: `/government` + `/government/officials` only. |
| Later checkpoints (2B onward) | **not started** — scope needs Robin + Codex approval |

The full commit-by-commit history of Checkpoint 1 (six correction rounds,
previews, and the wrong-parent incident) lives in
`docs/command-center/release-tracker.md` and, in narrative form, in
`docs/sessions/2026-08-21-full-site-visual-rebuild-v2.md` and
`docs/sessions/2026-08-23-claude-account-migration-handoff.md`.

## 1. The active task

**Checkpoint 2A — Government hub + Elected officials** (Codex-approved for
implementation 2026-08-24). Bring `/government` and `/government/officials`
into the "Kabugao in View" direction; no other route touched.

Delivered on `experiment/full-site-visual-rebuild-v2`, prepared on parent
`69a74d1…604005`:
- One additive `PageHeader` interior variant (`variant="kv"`, solid navy +
  gold-rule eyebrow), used only by these two routes; existing variants and
  other pages unchanged; page-header markup not duplicated.
- `/government`: the three-card grid replaced by an editorial wayfinding list
  (Elected officials — Available; All 21 barangays — Available; Transparency —
  In preparation), each a real crawlable link; one restrained page-entry
  animation + hover/focus cue, off under reduced motion.
- `/government/officials`: the card grid replaced by a scannable roster —
  executive tier (gold rail, one coherent treatment, not floating cards) then
  the Sangguniang Bayan; exact names, positions, term, eLGU source + retrieval
  date, and both explanatory notices preserved.
- Same commit: `SimplePages.tsx` + `OfficialsPage.tsx` added to the
  className↔stylesheet cross-check; a Government-hub unit test; the committed
  QA harness extended to both routes.
- Weather/clock left unmounted; legacy components/CSS not pruned (deferred).
  The now-unused `.nav-card` / `.card-grid` / `.official*` rules are left in
  place on purpose — pruning is the separate approved cleanup task.

Gates (clean clone, parent `69a74d1`): 39 contract + 50 unit; typecheck + lint
clean; build `PRERENDER_OK 33 pages`; `npm run qa` **175/175, exit 0**.

Status: **implemented; all gates green; NOT yet pushed.** Awaiting Robin's push
from the authorized PC, the Cloudflare preview, and Codex review.

## 2. What happens next (in order)

1. Robin pushes the single Checkpoint 2A commit to
   `experiment/full-site-visual-rebuild-v2` from the authorized PC (verify
   `git rev-parse HEAD` = `69a74d1…604005` before committing).
2. Cloudflare auto-builds a preview; Robin relays the `*.pages.dev` URL.
3. Codex reviews the code + the preview and approves or returns blockers.
4. On approval, the next checkpoint scope (2B) is agreed with Robin + Codex.
   **No merge to `main` until full-site parity and Codex's explicit approval.**

## 3. Standing constraints

- Do **not** redesign anything outside an approved checkpoint scope.
- Do **not** push to `main`, merge, or start Checkpoint 2 without approval.
- Robin pushes from the authorized PC; prepare commits against the **fetched,
  verified origin tip** (`git rev-parse HEAD` must print the pinned SHA before
  committing) — never `git reset --hard` to an unverified ref.
- All gates before any handoff: `npm test`, `npm run typecheck`,
  `npm run lint`, `npm run build`, `npm run qa` — and QA numbers only from the
  committed harness.
- Messages to Codex: one copy-pasteable block, nothing above or below it.

---

## PINNED APPROVED DECISIONS (do not relitigate)

**Direction:** "Kabugao in View". **Status:** Checkpoint 1 approved at the
implementation baseline `e5dc158` via its staging preview (`e19410fa`) — still
NOT main/production. Codex reviews every further checkpoint on the staging URL
before work continues.

**Scope (Checkpoint 1, delivered):** shared foundations, header, footer,
homepage, barangays directory, Poblacion detail, search integration, map/list
interaction, mobile detail sheet. The remaining routes keep their current look
until a Checkpoint 2 scope is approved.

**Brand:** use the original approved logo assets exactly —
`public/brand/betterkabugao-logo-inverse.svg` on dark/photo,
`public/brand/betterkabugao-logo.svg` on light, the mark-only variants on
phones. Do not recreate the wordmark in HTML text. Do not add "Kabugao, Apayao"
beneath the logo. "Kabugao" must not appear twice in the lockup.

**Hero:** headline "Know your Kabugao."; copy "Public information for Kabugao,
Apayao — its 21 barangays, elected officials, and emergency numbers, each traced
to its source."; photo Wikimedia Commons **File:Dibagat river.JPG**, photographer
**Andrew Garnett**, license **Public domain**; self-hosted responsive variants;
source + credit recorded; no unqualified "capital of Apayao" language anywhere
on the site.

**Map:** verified barangay points + normal **live** OSM tiles
(`https://tile.openstreetmap.org/{z}/{x}/{y}.png`). Never fabricate a municipal
boundary. Do **not** download / prefetch / proxy / bundle / self-host OSM raster
tiles. Keep OSM attribution visible at all times; the mobile bottom sheet must
never cover it. Map explanation: "Pins show the 21 published barangay locations.
A municipal boundary is not shown in this version." Do not claim no official
boundary source exists.

**Copy:** "Explore Kabugao's 21 barangays."; no "one river valley"; approved
facts only; no new elevation or geographic claims; ₱0 / ₱670 stays on `/about`
only (never in the footer or the global `<noscript>`); no locked budget /
procurement / contractor / flood-control / public-works vocabulary — a contract
test enforces this on every built route.

**Behavior to preserve:** existing routes; SEO + prerendering; CSP; search
overlay + keyboard shortcuts; Escape with text entered; layered Escape
(topmost layer only); menu closes on any search-open path; `/search?q=`
fallback; emergency access; accessible no-JS links; linked server-rendered OSM
attribution; sitemap contracts; `/404` exclusion; fluid layout with no 320px
min-width (zero horizontal overflow from 305px up).

**QA:** run `npm test`, `npm run typecheck`, `npm run lint`, `npm run build`,
`npm run qa`; the committed harness covers 305x568 / 320x568 / 360x780 /
390x844 / 768x900 / 1280x900 / 1440x900 (+320x640 for the sheet-attribution
check); capture and LOOK AT screenshots; verify the real Cloudflare preview in
a real browser before reporting.
