# 2026-08-23 — Claude account migration handoff

> **STATUS: APPROVED.** Codex approved this account-migration handoff on
> **2026-08-23**, having reviewed the corrected documentation at the approved
> handoff content commit `7b121df2cb79f879fdf2722202127fbe9509cff5`. The
> migration is complete. A new Claude account starts at the **first-day
> checklist** at the end of this document. Checkpoint 1 remains approved at
> implementation baseline `e5dc158`; Checkpoint 2 remains not started and not
> approved; `main` remains untouched; the current remote HEAD must still be
> fetched and verified before any work.

## Why this document exists

The Claude account that built Checkpoint 1 of the "Kabugao in View" rebuild is
being deleted. **A completely new Claude account must be able to continue
BetterKabugao from this repository alone, with no access to the old
conversations.** This file is the master handoff: it records the state of the
world, how work happens here, what Checkpoint 1 built and proved, every lesson
paid for, and what needs Robin's or Codex's approval before anything moves.

Read it with the standing docs — they carry the depth this file points at:

| File | What it carries |
|---|---|
| `docs/START-HERE.md` | entry point: state, plan, traps |
| `CLAUDE.md` | the hard rules |
| `docs/CONTEXT.md` | living snapshot + dated decision log |
| `docs/command-center/active-task.md` | current task status + pinned approved decisions |
| `docs/command-center/release-tracker.md` | branch/commit/deployment ledger |
| `docs/command-center/source-registry.md` | media provenance + civic-data source registry |
| `docs/superpowers/specs/2026-08-21-full-site-visual-rebuild-v2-kabugao-in-view.md` | the Checkpoint 1 design spec |
| `docs/sessions/2026-08-21-full-site-visual-rebuild-v2.md` | Checkpoint 1 session narrative (rounds 1–3) |

## Who is who

- **Robin Tapiru** — product owner and civic source owner. Credited in the
  footer as developer/initiator. Operates the **authorized PC** (Windows,
  Git Bash, `C:\laragon\www\betterkabugao`) — the only place commits are pushed
  from. Relays messages between Claude and Codex by hand.
- **Codex** — commander and final QA. **Approves every checkpoint before work
  continues.** Reviews the Cloudflare staging URL and the code. Nothing merges
  or advances without Codex's written approval, relayed by Robin.
- **Claude (new account)** — the website builder. Prepares changes, runs gates,
  writes docs, hands Robin exact commands. The build sandbox has no push
  credentials; treat every push as Robin's action on the authorized PC.
- **KuyaLoy** — the GitHub account that owns `github.com/KuyaLoy/betterkabugao`
  and the Cloudflare Pages project.

## The project in five sentences

BetterKabugao (betterkabugao.org) is an independent, volunteer-run civic
portal for **Kabugao, a municipality of Apayao, Philippines** — 21 barangays,
16,425 residents (2024 POPCEN), 935.12 km², 1st-class income, PSGC 1408104000.
It is part of the **BetterGov.ph volunteer network** and is registered in the
**BetterLGU Directory** (`https://lgu.bettergov.ph/`; row updated via PR #208 to
`jmacj/better-lgu-directory` — re-check its status). Every page carries the
disclaimer, verbatim in `src/app/site-content.ts`: *"BetterKabugao is an
independent, volunteer-run civic project. It is not the official website of the
Municipality of Kabugao."* Nothing is published unless it is traceable to an
official source, with the source and its date shown next to it. It is built at
₱0 cost to the people (₱670 domain paid personally by the developer — the only
two peso figures allowed anywhere, shown on `/about` only).

## State of the world (verified 2026-08-22/23)

| | |
|---|---|
| Production | `main` @ `745b8779dd711cc20d478dee82f01101c9ed2c74` — **untouched by the rebuild**; live at betterkabugao.org |
| Experimental branch | `experiment/full-site-visual-rebuild-v2`, cut clean from that same `origin/main` commit |
| **Approved implementation baseline** | `e5dc158fe3b75b406f0a9663d5a70a55f08bf1bf` — the Codex-approved Checkpoint 1 code |
| Checkpoint 1 | **APPROVED by Codex (2026-08-22)** at that baseline |
| **Approved preview** | `https://e19410fa.betterkabugao.pages.dev/` (Cloudflare Pages deployment of the baseline, status Success) |
| **Handoff documentation commit** | `5f7375598fd42d5fd239374aece1fda38282c648` — docs only, on top of the baseline |
| **Approved handoff content commit** | `7b121df2cb79f879fdf2722202127fbe9509cff5` — the corrected docs Codex reviewed; **handoff APPROVED 2026-08-23, migration complete** |
| **Current remote HEAD** | never hardcoded in docs: `git fetch origin && git rev-parse origin/experiment/full-site-visual-rebuild-v2` is authoritative — later documentation-only corrections may follow `5f73755`. Always fetch and verify before any work. |
| Checkpoint 2 | **not started** — scope needs Robin + Codex approval first |
| Merge to `main` | **not approved, not performed** — Codex decides after full-site parity |
| Gates at the approved baseline | 39 contract + 49 unit tests pass; typecheck clean; lint clean; build `PRERENDER_OK 33 pages`; `npm run qa` **123/123 checks, exit 0** (committed report `docs/qa/checkpoint-1/qa-report.json`) |

## How work happens here (non-negotiable workflow)

1. **Checkpoints.** Implement one approved phase, verify, report, stop. Codex
   reviews (code + the Cloudflare preview) and approves before the next phase.
2. **Review branches only.** Work lands on a review/experiment branch. **Never
   push directly to `main`.** Merging is a separate, explicitly approved act.
3. **Robin pushes.** The build sandbox has no credentials. Prepare the change,
   run every gate, then hand Robin a copy-pasteable command block for Git Bash
   on the authorized PC. Delivery pattern that has worked repeatedly: a guarded
   Node "writer" script (checks `git rev-parse HEAD` equals the intended base
   SHA before writing; idempotent; errors loudly), then explicit `git add`
   of named paths, `git commit`, `git push origin <branch>`.
4. **Build on the fetched origin tip, always.** Before preparing any commit for
   Robin, fetch and pin the exact origin SHA, and make the instructions verify
   it (`git rev-parse HEAD` must print it). **Never `git reset --hard` to a ref
   that has not just been fetched and verified** — resetting to a stale ref is
   exactly how commit `3352ee3` was built on the wrong parent and silently
   dropped a fix (see Lessons, §11).
5. **Session handoff after every task.** Update `docs/START-HERE.md`,
   `docs/CONTEXT.md`, and add `docs/sessions/YYYY-MM-DD-<topic>.md`
   (`docs/skills/session-memory/SKILL.md` has the template). A decision that
   is not written down does not exist.
6. **Messages to Codex are a single copy-pasteable block** — no prose above or
   below that could be copied by mistake. Robin relays them by hand.
7. **QA numbers come only from the committed harness** (`npm run qa`). Never
   report figures from an ad-hoc, uncommitted script.
8. **A green suite does not replace looking at the render** — in a real
   browser, on the real Cloudflare preview, at the required widths.

## Technology stack

React 19.2 + TypeScript 6 (strict) + Vite 8.2 + Tailwind CSS v4 via
`@tailwindcss/vite` (tokens in `@theme`; the design itself is plain CSS classes
in `src/styles.css`) + `react-router-dom` 7.18 (import `StaticRouter` from the
package root — `react-router-dom/server` does not exist in v7) + Leaflet 1.9.4
(dynamically imported, code-split). Node pinned **22.14.0** (`.node-version`;
`engines >=22.12 <23`). Robin's PC runs Node 24.19.0 and everything works —
leave both the pin and his machine alone. `playwright` (1.56) is a **dev-only**
dependency for the QA harness; `npx playwright install chromium` once per
machine. No backend, no database, no analytics, no CSS-in-JS, no jQuery, no UI
kit. New dependencies need maintainer approval, stated in the PR/commit.

### Commands and gates

```bash
npm ci                 # reproducible install from the committed package-lock.json
                       # (also fetches Playwright, a dev dependency)
npm run dev            # Vite dev server (no prerendering here)

npm test               # pretest runs the full build, then 39 contract + 49 unit
npm run typecheck
npm run lint
npm run build          # seo:build → tsc -b → build:client → build:ssr → prerender
                       # must end "PRERENDER_OK 33 pages" — NEVER simplify to `vite build`
npm run qa             # committed Playwright harness (see below)
```

All of these must pass before any commit is handed to Robin. Contract tests pin
conventions (palette, headers, facts, scripts, brand geometry); if a convention
changes on purpose, update the matching test in the same commit — never delete
a contract to make it pass.

### The committed browser QA harness

`scripts/qa/serve.mjs` (ephemeral static server that resolves clean URLs to the
prerendered files — the way Cloudflare Pages serves) + `scripts/qa/checkpoint1.mjs`
(Playwright checks). `npm run qa` builds only if `dist/` is missing, runs every
check, writes `docs/qa/checkpoint-1/qa-report.json`, and **exits non-zero on any
failure**. Current matrix: **305x568, 320x568, 360x780, 390x844, 768x900,
1280x900, 1440x900** (plus 320x640 in the sheet-attribution check). 305px exists
because a 320px Windows window minus a ~15px classic scrollbar leaves a 305px
content area — headless Chromium's overlay scrollbars never reproduce that.
**Never QA the built site with `vite preview`** — its SPA fallback serves the
homepage for every URL and manufactures false React #418 hydration errors.

## What Checkpoint 1 built

Scope (all of it approved, none of it to be relitigated — the pinned decisions
in `docs/command-center/active-task.md` are binding):

- **Foundations:** a ~230-line "KABUGAO IN VIEW" layer appended to
  `src/styles.css` (masthead over/solid states, photo hero, task strip, place
  band, atlas/directory, selection sheet, footer overrides; responsive at
  1024/900/640/520; reduced-motion).
- **Header** (`SiteHeader.tsx`, rewritten): real inverse logo asset (no HTML
  wordmark), `--over` (transparent over the homepage hero) vs `--solid` (sticky
  navy elsewhere); at ≤900px the over-hero header gets a solid navy surface
  (`rgb(0,20,47)`); primary nav; SearchTrigger; one red **Emergency 911** action
  (accessible name "Emergency 911 and local hotlines") → `/emergency`; burger +
  mobile menu (200ms ease-out slide+fade, upward close, `inert` when closed,
  reduced-motion honoured); desktop wordmark 42px; phones ≤640px show the
  symbol-only `betterkabugao-mark-inverse.svg`; home link name
  "BetterKabugao.org home".
- **Footer** (rewritten): inverse logo, Find + Network columns, independence
  disclaimer, build credit. **No cost figures** (₱0/₱670 live on `/about` only).
- **Homepage** (rewritten): full-bleed `<picture>` photo hero (self-hosted PD
  Dibagat River image — see source registry), headline **"Know your Kabugao."**,
  approved sub-copy, integrated search control (a real trigger for the overlay,
  62px, one-line text with ellipsis), "Explore" cue, unframed four-task strip,
  place band ("Explore Kabugao's 21 barangays.") + live 21-pin map + credit line.
- **Barangays directory** (rewritten): map-first atlas — sticky live map +
  mandated legend ("Pins show the 21 published barangay locations. A municipal
  boundary is not shown in this version.") + linked OSM attribution, beside a
  filtered directory whose rows are real crawlable `<a>` links plus a separate
  map-preview button; map/list selection sync; desktop card / mobile bottom
  sheet with full focus management; officials-withheld notice kept.
- **Search overlay integration:** header + hero triggers; `/` and Ctrl/Cmd+K;
  layered Escape (topmost layer only); opening search closes the mobile menu.
- **Barangay detail route:** left as-is (already compliant).
- **NOT redesigned (Checkpoint 2 material):** `/government`,
  `/government/officials`, `/emergency`, `/about`, `/transparency`, `/explore`,
  `/services`, `/search`, `/sitemap`, `/404` — they keep working with their
  current look.
- **Kept in the tree but unmounted** (only so existing contract tests stay
  green): `HotlineBar`, `UtilityStrip`, `HotlineDialog`, `useKabugaoNow` and
  their CSS. Pruning them is a decision for Robin/Codex, with contract-test
  updates in the same commit.

All 33 routes prerender: `/`, `/about`, `/emergency`, `/explore`, `/government`,
`/government/officials`, `/government/barangays`, 21 × `/government/barangays/:slug`,
`/search`, `/services`, `/sitemap`, `/transparency`, `/404`.

## Behavior that must not regress

Codex verified all of this on the live preview; the committed harness and the
contract tests pin most of it. Breaking any item is a blocker, not a nit.

**Search.** Opens from header trigger, hero control, `/`, Ctrl/Cmd+K. `/` stays
a literal slash while typing in any input. Escape — even with text entered —
closes the overlay, clears it, and returns focus to the exact trigger
(capture-phase handler; `<input type="search">` otherwise eats Escape to
self-clear). Only the topmost layer handles Escape (`stopPropagation`): with the
barangay sheet and the overlay both open, the first Escape closes only Search,
the second closes the sheet. Opening search by ANY path collapses the mobile
menu (driven from the overlay store, not per-trigger). Enter with a query →
shareable `/search?q=`. The trigger is a real `<a href="/search">`, so no-JS
visitors still get search.

**Mobile menu.** ≤900px only; solid navy surface over the hero; 200ms ease-out
slide+fade, closes upward, no bounce/glow/blur; `prefers-reduced-motion` →
no transition; `inert` when closed (hidden links unfocusable); closes on
logo/search/emergency/destination activation and on resize to desktop;
`aria-expanded` always truthful.

**Map.** Live OSM tiles only (`https://tile.openstreetmap.org/{z}/{x}/{y}.png`)
— never self-host/prefetch/proxy tiles, never fabricate a municipal boundary.
Linked "© OpenStreetMap contributors" attribution visible at all times,
including with the mobile sheet open; the server-rendered `.map__note`
attribution is a real link (verified JS-off; contract-tested). Marker click ↔
list selection stays in sync. No `position` on `.map-pin` (contract-tested).

**Mobile sheet.** Opening moves focus in; Escape/Close returns focus to the
exact invoker; filtering out the selection closes the sheet and focuses the
filter (never `<body>`); sheet name is white on navy
(`.kv-sheet__head .kv-sheet__name`); the sheet never covers OSM attribution.

**Emergency.** Red 911 action in the header on every route → `/emergency`; the
accessible name never promises to place a call. Hotline numbers live only in
`src/data/hotlines.ts`, sourced and dated (Discover Kabugao FB post, 15 April
2026), `+63` format only, 911 always first.

**SEO / prerender / no-JS.** 33 pages, each with own title/description/
canonical/OG/BreadcrumbList; no two pages share a title; sitemap.xml + HTML
`/sitemap` complete and excluding `/404`; canonical always points at
`betterkabugao.org` (deliberate, also on previews); global `<noscript>` is
additive (`<aside>`/`<h2>`, never `<main>`/`<h1>`), carries no peso figures; one
`h1`/`main` per page; adding a route means five coordinated edits (App.tsx,
`seo.ts` ×3 lists + `SITEMAP_LABELS`/`GROUP_ORDER`, `search.ts`,
`build-seo.mjs`) — `auditSitemap()` + tests catch misses.

**Copy safety (contract-tested on every built route).** No unqualified
"capital of Apayao"; no flood-control / procurement / contractor / public-works
wording; only ₱0 and ₱670 anywhere, on `/about` only; officials only from the
eLGU source; never the stale third-party barangay roster.

**Accessibility.** Visible 3px `#0066eb` focus ring (skip-link first); WCAG AA
contrast (text floor on light surfaces is `--color-gray-700`); reduced-motion
zeroes duration AND delay; decorative SVGs `aria-hidden`; landmarks correct.

**Security.** Strict CSP in `public/_headers` — `default-src 'self'`, no
inline script/style (no `style={{…}}` anywhere; CSSOM only), exactly TWO
external origins (`api.open-meteo.com`, `tile.openstreetmap.org`), `frame-src`
deliberately absent, `form-action 'self'` (Codex-approved 2026-08-20), plus
HSTS/nosniff/XFO DENY/Referrer-Policy/Permissions-Policy. No secrets in the
repo, ever.

**Layout.** Fluid — **no element may pin `min-width: 320px`**
(contract-tested); zero horizontal overflow from 305px up.

## Visual direction (approved — do not relitigate)

**"Kabugao in View"**: photo-led, the real place carries the page — no cards,
bento grids, gradient headings, glass, or dashboard styling. Codex scored the
direction AI-slop 2/10, distinctiveness 8/10, Kabugao identity 9/10, visual
appeal 8/10 (and the built implementation AI-slop 1/10 at round 2). Restrained
navy/blue/gold/white palette; Inter only (vendored, OFL). Design tokens live in
`src/styles.css` `@theme` — BetterGov.ph design-system colours (primary ladder
`#e6f0fd → #00142f` with `#0066eb` as blue-500, gold `#ffb900`, accents
`#f58900`/`#935200`, alert `#b42525`, grays `#f8f9fa → #212529`), `--container:
1440px`, `--measure: 68ch`, 76px masthead, 6px button radius (no pills), solid
navy heroes. Never invent hex values inline. Brand: the original mark (Kabugao
silhouette + three-ray sunrise) — geometry in `src/brand/geometry.json` is
contract-pinned and must never be redrawn; use `public/brand/
betterkabugao-logo-inverse.svg` on dark, `-logo.svg` on light, mark-only
variants on phones; never recreate the wordmark in HTML; never put
"Kabugao, Apayao" under the logo; "Kabugao" appears once per lockup;
`npm run brand:build` / `brand:social` regenerate assets — never hand-edit
`public/brand/`.

## Data and sources

**Hierarchy** (strongest first) for any new civic claim: (1) the LGU itself /
its eLGU platform; (2) PSA (POPCEN, PSGC); (3) BetterGov.ph network data and
tooling; (4) other official government sources (COMELEC, DILG, COA, DBM,
PhilGEPS, NAMRIA); (5) reliable public APIs (OpenStreetMap/ODbL, Open-Meteo,
Wikidata). Every published figure needs the source AND its date beside it. If
it cannot be sourced, the page says it is being prepared — never estimate,
never placeholder. The full 43-source inventory with per-source traps is
`docs/research/DATA-SOURCES.md`; the roadmap is `docs/research/data-tracker.html`.
The command-center summary is `docs/command-center/source-registry.md`.

Key verified facts in use: 21 barangays summing to exactly 16,425 (2024
POPCEN); PSGC 1408104000 (municipality; code 1408104003 is **not in use** — the
site says so honestly); 935.12 km²; 1st-class income; coordinates
18.0246/121.1845; elevation 132 m (a known source discrepancy — published, but
confirm which source wins before repeating it anywhere new); Mayor **Bensmar B.
Ligwang**, Vice Mayor **Frederick C. Amid**, term 2025–2028, from the
municipality's eLGU platform (retrieved 17 Aug 2026); **barangay officials are
withheld** because no government source publishes them (RA 12232 moved the BSKE
to 2 Nov 2026; incumbents hold over) — do not fill this gap with a guess;
8 municipal hotline offices + 911 from the LGU's own post of 15 April 2026.
Flood-control / budget / procurement data is **deferred by the maintainer** —
do not build it without asking Robin first; BLGF fiscal data additionally needs
licence clearance (`lfdad@blgf.gov.ph`).

## Infrastructure

- **GitHub:** `github.com/KuyaLoy/betterkabugao` (public). Robin's PC is the
  push path. The sandbox can `git fetch` the public repo read-only.
- **Cloudflare Pages:** project **betterkabugao** (dashboard → Workers & Pages).
  Production branch `main` → betterkabugao.org + betterkabugao.pages.dev.
  Build command `npm run build`, output `dist`, repo root. **Every push to any
  branch auto-builds a preview** at `https://<hash>.betterkabugao.pages.dev` —
  find the URL in the project's Deployments list next to the commit. Preview
  canonicals point at production on purpose (keeps previews out of search) — do
  not "fix". If a push does not trigger a build, check the dashboard banner for
  a GitHub-events incident before debugging project settings.

## Checkpoint 1 — the six correction rounds (all on 2026-08-21 UTC)

| Commit | Round | What it did |
|---|---|---|
| `ab1f15d` | build | "Kabugao in View" Checkpoint 1 built on the clean branch |
| `0dde1b7` | 1 | 8 Codex blockers: search Escape (capture phase), menu closes on activation, hero spacing/letter-spacing, real directory links + separate preview button, sheet focus management, linked sheet/legend attributions, emergency label, honest QA harness |
| `7d7937d` | 2 | layered Escape (stopPropagation), menu closes on any search path (overlay store), **committed** QA harness + `npm run qa` + dev-only Playwright, server-rendered OSM attribution as a real link + contract test, menu motion + inert + reduced-motion, logo 42px / mark-only phones |
| `ae8ef20` | 3 | mobile header solid navy at ≤900px; `pretest` builds so clean-clone `npm ci && npm test` works; **production copy blocker cleared** (capital claim, public-works vocabulary, ₱ figures out of the global noscript/SEO) + prohibited-wording contract test |
| `3352ee3` | 5 | hero search text one line (`nowrap`/`ellipsis`/`min-width:0`) — **built on the wrong parent** (`ae8ef20`), silently dropping round 4 |
| `e5dc158` | 6 | restored round 4 on the correct parent: body `min-width:320px` removed, contract test forbidding it, 305x568 QA size. **Approved by Codex 2026-08-22.** |

(Round 4, `b50138e`, existed only in the old sandbox and was superseded by
`e5dc158`. It is not an ancestor of the origin branch — never resurrect it.)

## Lessons paid for (do not pay twice)

1. **Layered Escape.** `<input type="search">` consumes Escape to self-clear,
   and multiple layers (sheet + overlay) each listen for it. Rule: the overlay
   intercepts in the capture phase and `stopPropagation()`s — one Escape, one
   layer, topmost first, focus returned to the exact trigger. Regression-tested.
2. **Mobile menu stayed open behind the search overlay.** Per-trigger `onClick`
   close was not enough (`/`, Ctrl/Cmd+K bypass it). Rule: subscribe to the
   overlay store and collapse the menu on ANY open path.
3. **Prerendered OSM attribution must be a real link with JS off.** Leaflet's
   attribution control only exists after hydration; the ODbL requires it
   always. The server-rendered fallback now carries
   `<a href="https://www.openstreetmap.org/copyright">` — contract-tested
   against built output.
4. **Sheet focus restoration.** Opening moves focus in; closing returns it to
   the exact invoker; filtering away the selection focuses the filter, never
   `<body>`. And do state changes in event handlers, not effects
   (`react-hooks/set-state-in-effect`).
5. **The 320px/classic-scrollbar overflow.** `body { min-width: 320px }` forced
   a horizontal scrollbar on Windows Chrome because classic scrollbars eat
   ~15px of a 320px window. Headless (overlay-scrollbar) QA could not see it.
   Rules: fluid layout with no 320px floor (contract-tested), and the harness
   tests 305px to simulate the reduction.
6. **Hero search text wrapping.** At 305px the placeholder wrapped to three
   lines and escaped its fixed-height control. Rule: single-line truncation
   (`flex:1; min-width:0; white-space:nowrap; overflow:hidden;
   text-overflow:ellipsis`) — icon and `/` hint stay visible.
7. **Mobile header visibility.** White logo/controls over a photo were
   unreadable. Rule: ≤900px the over-hero header has a solid navy surface — no
   gradient/blur/glass.
8. **Logo sizing.** The full wordmark squeezed on phones; desktop was too
   small. Rule: 42px wordmark on desktop, symbol-only mark ≤640px, accessible
   home-link name unchanged.
9. **Commit-parent / branch-ancestry mistakes.** A push-instruction block used
   `git reset --hard origin/<branch>` while origin was stale relative to the
   intended base, so the next commit was built on the wrong parent and silently
   dropped a fix. Rules: fetch first; pin the exact SHA; make the instructions
   verify `git rev-parse HEAD` prints it; never reset to anything you have not
   just verified; after committing, check the new commit's parent before push.
10. **QA reports come from a committed, reproducible harness.** Ad-hoc `/tmp`
    scripts produced one misleading report (a spread clobbered a failing key).
    `npm run qa` is committed, covers every required boolean, and exits
    non-zero on failure. Report only its numbers.
11. **A green automated suite does not replace visual QA in a real browser.**
    The dark-on-navy sheet heading, the bare-text `.btn--primary`, the
    scrollbar overflow and the wrapping hero text all passed green suites and
    were caught by eyes on a real render — Codex's live Windows Chrome twice.
    Always look at the Cloudflare preview at the QA widths before reporting.

## Known risks, deferred cleanup, technical debt

- **Unmounted legacy components kept for contract tests**: `HotlineBar`,
  `UtilityStrip`, `HotlineDialog`, `useKabugaoNow` + their CSS. Pruning needs
  Robin/Codex approval and contract-test updates in the same commit.
- **Weather/clock currently render nowhere** (their host `api.open-meteo.com`
  is still CSP-pinned by test). Decide in Checkpoint 2: reintroduce or remove
  — removing means updating the two-host contract test deliberately.
- **Licence mismatch**: `package.json` says ISC; earlier footer/network
  standard is MIT · CC BY 4.0. Open decision for Robin.
- **README.md is stale** (route table lacks `/emergency` + `/sitemap`;
  "PRERENDER_OK 31 pages"; "Project status" still describes the pre-portal
  era). It is contract-tested only for build settings, so updating it is safe —
  but it was out of scope for this docs-only handoff commit. First easy task.
- **Elevation 132 m** source discrepancy — published but unconfirmed between
  sources.
- **Hotline numbers unconfirmed by a second source** — worth a test-dial or an
  LGU confirmation; wording on `/emergency` already states the uncertainty.
- **Optional QA gap**: the committed harness checks overflow at 305/320 but has
  no explicit "hero search text is one line" assertion (that check ran only in
  the old sandbox). Adding one to `scripts/qa/checkpoint1.mjs` (9c-style:
  computed `whiteSpace === "nowrap"`, `textOverflow === "ellipsis"`, one-line
  height, icon + `/` key in view) would pin lesson 6 permanently.
- **The `<noscript>` block renders unstyled below the footer with JS off** —
  a standing design call for Robin (facts inside are contract-pinned).
- **BetterLGU Directory PR #208** — status unknown since 2026-08-19; re-check.

## Proposed Checkpoint 2 scope (recommendation — needs Robin + Codex approval)

Extend "Kabugao in View" to the routes Checkpoint 1 deliberately left alone,
in this order: (1) `/government` hub + `/government/officials`;
(2) `/emergency`; (3) `/about` + `/transparency`; (4) `/search`, `/404`,
`/sitemap`; (5) `/explore` + `/services` placeholders. Then, as a separate
approved step: prune the unmounted legacy components with their contract-test
updates, and settle the weather/clock question. Same experimental branch (or a
fresh review branch — Codex's call), same gates, harness extended per page,
screenshots at the full width matrix, Codex approval per checkpoint. Merge to
`main` only after full-site parity and Codex's explicit approval.

## Decisions that still require Robin and/or Codex

Merging to `main` (criteria and timing) · Checkpoint 2 scope/order · pruning
legacy components · weather/clock reintroduction vs removal · licence
alignment (ISC vs MIT · CC BY 4.0) · README refresh · flood-control/budget
publication (maintainer-deferred; BLGF licence email) · barangay-officials
roster (waiting on the municipality) · hotline confirmation · the `<noscript>`
styling call · the hazard-map stack question (PMTiles vs Leaflet, START-HERE §4).

## What the new account cannot reconstruct (ask, don't guess)

- The status of Robin's off-repo threads: the municipality roster request, the
  BLGF licence email, BetterLGU PR #208, hotline test-dials.
- Chat-only deliverables inventoried in START-HERE §3 (logo PNGs, social
  images, launch poster/caption) — not reproducible from the repo.
- The rejected experiments ("Living Civic Atlas", "Wayfinder") — stashed on the
  old machine, never committed; only the rulings about them survive here.
- Codex's full review rubrics beyond the recorded scores/quotes.
- Cloudflare/GitHub account credentials and settings — deliberately not in the
  repo; Robin holds access.
- The old sandbox's extra QA check (described above) and round-4 commit
  `b50138e` — both superseded; re-create from the descriptions if wanted.

## First-day checklist for the new account

1. Read `docs/START-HERE.md`, `CLAUDE.md`, `docs/CONTEXT.md`, this file, and
   `docs/command-center/` (active task, release tracker, source registry).
2. `git fetch origin` and read the current remote HEAD from
   `git rev-parse origin/experiment/full-site-visual-rebuild-v2` — that output
   is authoritative, not any SHA written in these docs. Cross-check the
   labeled commits (approved baseline, handoff commit) against the release
   tracker.
3. `npm ci && npm test && npm run typecheck && npm run lint && npm run qa`
   — confirm 39 + 49, clean, clean, 123/123 before changing anything
   (one-time per machine: `npx playwright install chromium`).
4. Open the approved preview and the production site; look at both at 305/320/
   390/768/1440.
5. Ask Robin the open questions above. Propose the Checkpoint 2 scope to Codex
   as a single copy-pasteable block. **Do not start building until Codex
   approves.**
