# Project Context

**Read `docs/START-HERE.md` first** — it is the entry point for a new developer
or AI assistant: current state, everything already built, the ordered plan, and
the traps. This file is the dated decision log behind it.

Living snapshot of BetterKabugao. Update both at the end of every working
session (see `docs/skills/session-memory/SKILL.md`).

## Current state (2026-08-24)

- **Domain:** betterkabugao.org — Cloudflare Pages, deploys from `main`
  (build `npm run build`, output `dist`)
- **`main` HEAD:** `745b877` — the v3.0.0 multi-page portal plus the `/sitemap`
  page (PR #1) plus the search/404 recovery screens and the site-wide search
  overlay (**PR #2, merged 2026-08-20** after Codex QA — the old "in flight"
  entry is resolved). 33 prerendered routes, live and verified in production.
- **Visual rebuild (experimental):** `experiment/full-site-visual-rebuild-v2` —
  the approved **"Kabugao in View"** photo-led redesign. **Checkpoint 1 is
  APPROVED by Codex (2026-08-22)** at the **approved implementation baseline**
  `e5dc158fe3b75b406f0a9663d5a70a55f08bf1bf`; **approved preview**
  `https://e19410fa.betterkabugao.pages.dev/`. The branch has since received
  the documentation-only handoff commit
  `5f7375598fd42d5fd239374aece1fda38282c648`; the **current remote HEAD** is
  read with `git fetch origin && git rev-parse
  origin/experiment/full-site-visual-rebuild-v2` — never from a SHA written in
  these docs. Still experimental — **not merged to `main`**, and Checkpoint 2
  has not started (scope needs Robin + Codex approval). Six correction rounds are ledgered in
  `docs/command-center/release-tracker.md`; the narrative is in
  `docs/sessions/2026-08-21-full-site-visual-rebuild-v2.md` and the
  account-migration handoff
  `docs/sessions/2026-08-23-claude-account-migration-handoff.md`. Spec:
  `docs/superpowers/specs/2026-08-21-full-site-visual-rebuild-v2-kabugao-in-view.md`.
- **Account migration: COMPLETE.** Handoff documentation commit `5f73755`
  plus one Codex-requested correction pass were reviewed at the approved
  handoff content commit `7b121df2cb79f879fdf2722202127fbe9509cff5`, and the
  **handoff was APPROVED by Codex on 2026-08-23**. The new Claude account
  must follow the first-day checklist at the end of
  `docs/sessions/2026-08-23-claude-account-migration-handoff.md`. Checkpoint 1
  remains approved at baseline `e5dc158`; `main` remains untouched; the current
  remote HEAD is still fetched and verified before any work.
- **Checkpoint 2A (Government hub + Officials): PUSHED and APPROVED.**
  `/government` and `/government/officials` were brought into "Kabugao in View"
  (an additive `kv` PageHeader variant, an editorial wayfinding list, and a
  scannable officials roster). Pushed at **`cf1ee7cc4a29114d5819557f81b762e3bcd1404f`**;
  Cloudflare preview **https://69d4e1d9.betterkabugao.pages.dev/**; **Codex
  approved the code and visual direction (2026-08-24)** (39 contract + 50 unit;
  typecheck + lint clean; `PRERENDER_OK 33 pages`; `npm run qa` 175/175). A small
  docs/CSS cleanup pass followed (record push/preview/approval; README report
  path; CP2A CSS tokens + letter-spacing). No other route was touched;
  weather/clock stay unmounted; the now-unused legacy CSS was left in place
  (pruning is a separate approved task).
- **BetterLGU Directory:** PR #208 open against `jmacj/better-lgu-directory` —
  Kabugao row updated to 🟢 Active with the domain and the three socials, PR body
  and checklist completed, and a comment answering the triage bot's four
  verification points. Nothing left on our side; awaiting `jmacj`.
- **Merged:** the public `/sitemap` page (PR #1, `21f622b`). 33 prerendered
  routes, 32 sitemap.xml URLs.
- **What is live:** v3.0.0 — the real multi-page portal.
  **33 prerendered pages (32 sitemap URLs; /404 excluded)**, each with its own title,
  description, canonical, OG tags and `BreadcrumbList` JSON-LD. Real homepage
  (no longer coming-soon), `/government` hub, `/government/officials`,
  `/government/barangays` with a live filter, and **one page per barangay** at
  `/government/barangays/:slug` (× 21) carrying population, share, rank, PSGC,
  coordinates, schools, nearest three barangays by distance, and Google Maps
  view + driving directions. Plus `/transparency`, `/explore`, `/services`,
  `/about`, `/search`, `/emergency`, real 404. See
  `docs/sessions/2026-08-17-multipage-v1.md` and
  `docs/sessions/2026-08-18-emergency-hotlines.md`.
- **Design source of truth:** `design-research/RESEARCH.md` (visual tokens,
  33 screenshots of 11 live sites, `_measurements.json`) and
  `design-research/ARCHITECTURE.md` (route structure across 15 cloned repos).
  Post-build proof in `design-research/V1-VISUAL-CHECK.md` + `v2-screens/`.
- **Brand:** the maintainer's ORIGINAL mark (Kabugao silhouette + three-ray
  sunrise), recoloured to BetterGov navy/gold. Geometry is pinned by contract
  test — it must never be redrawn. `npm run brand:build` regenerates assets.
- **Maps:** Leaflet 1.9.4 + OpenStreetMap tiles — all 21 barangays on the
  homepage, a local map on each barangay page. Code-split, lazy, with a
  server-rendered fallback for visitors without JavaScript.
- **Live data:** Kabugao weather via Open-Meteo (no key, no tracking) plus a
  PHT clock. If the request fails the reading is omitted rather than faked.
- **Third-party hosts:** exactly two — `api.open-meteo.com` (`connect-src`) and
  `tile.openstreetmap.org` (`img-src`). `frame-src` is deliberately absent, so
  no iframe can load. A contract test asserts the whole list.
- **Emergency hotlines:** `/emergency` publishes the eight offices the
  municipality listed on 15 April 2026 (MDRRMO, KMPS, BFP, APH, RHU, MSWDO,
  RMFB 15, ICT), each in local and `+63` form, with `tel:+63` links so overseas
  family can dial. 911 leads. The red bar on every page carries 911 plus the
  all eight offices in a marquee, and a popup with the full list.
- **Quality (at the approved implementation baseline `e5dc158`):** 39 contract tests + 49 unit
  tests green; typecheck, lint, build clean (`PRERENDER_OK 33 pages`);
  `npm run qa` (committed Playwright harness) **123/123** at
  305/320/360/390/768/1280/1440 — zero horizontal overflow from 305px up, one
  `h1`, one `header`, one `main` and zero inline styles (outside the Leaflet
  canvas) on every page at every width.

## Key decisions log

- **2026-08-24** **Checkpoint 2A — Government hub + Officials** built on
  `experiment/full-site-visual-rebuild-v2` (parent `69a74d1…604005`), after
  Codex approved the scope and rulings. Brought `/government` and
  `/government/officials` into "Kabugao in View": one *additive* `PageHeader`
  variant (`variant="kv"` — solid navy, gold-rule eyebrow) used only by these
  two routes (existing variants and other pages unchanged; page-header markup
  not duplicated); the hub's three-card grid replaced by an editorial
  wayfinding list (real crawlable links; status labels Available / Available /
  In preparation; one page-entry animation + hover/focus cue, off under reduced
  motion); the officials card grid replaced by a scannable roster (executive
  tier with a gold rail — one coherent treatment, not floating cards — then the
  Sangguniang Bayan), preserving exact names, positions, term, the eLGU source
  + retrieval date, and both notices. The same commit added `SimplePages.tsx` +
  `OfficialsPage.tsx` to the className↔stylesheet cross-check, added a hub unit
  test, and extended the committed QA harness to both routes (175/175); and
  corrected two stale docs (the `frontend-standards` "capital of Apayao"
  pinned-fact wording; route-count wording → "33 prerendered pages / 32 sitemap
  URLs"). Weather/clock left unmounted; the now-unused legacy CSS
  (`.nav-card` / `.card-grid` / `.official*`) left in place (pruning is the
  separate approved cleanup task). Gates green; **pushed at `cf1ee7c`**;
  Cloudflare preview **https://69d4e1d9.betterkabugao.pages.dev/**; **Codex
  approved the code and visual direction (2026-08-24)**; a small docs/CSS
  cleanup pass followed. Full recap:
  `docs/sessions/2026-08-24-checkpoint-2a-government-officials.md`.
- **2026-08-23** Account-migration handoff written (docs-only): new
  `docs/command-center/release-tracker.md` and
  `docs/sessions/2026-08-23-claude-account-migration-handoff.md`; START-HERE /
  CLAUDE.md / CONTEXT / active-task / source-registry refreshed. Reason: the
  building Claude account is being deleted; the repository must carry the
  project's full working memory. Landed as documentation commit `5f73755`.
  Codex's review returned one documentation-state correction pass — label the
  approved implementation baseline (`e5dc158`) distinctly from the current
  remote HEAD (fetch is authoritative), remove an unexplained identity, use
  `npm ci` in first-day instructions — applied in the commit after `5f73755`.
  **Codex approved the handoff on 2026-08-23** at content commit `7b121df`;
  the migration is complete.
- **2026-08-22** **Checkpoint 1 approved by Codex** at `e5dc158` (preview
  `e19410fa`). Merge to `main` remains unapproved; Checkpoint 2 needs a scope
  approval first.
- **2026-08-21 (rounds 4–6)** Live Windows-Chrome QA caught what headless QA
  could not: `body { min-width: 320px }` forced horizontal overflow under
  classic (~15px) scrollbars — a 320px window has a ~305px content area.
  Removed the floor (fluid layout needs none), added a contract test forbidding
  `min-width: 320px`, added a **305x568** viewport to the committed harness,
  and gave `.kv-hero__search-text` single-line truncation (nowrap + ellipsis)
  so the hero search control holds one line at 305px. A process rule came out
  of round 5: commit `3352ee3` was accidentally built on `ae8ef20` (a
  `git reset --hard` to a stale ref), silently dropping the round-4 fix —
  restored on the correct parent in `e5dc158`. Standing rule: prepare commits
  only on the fetched, SHA-verified origin tip; never reset to an unverified
  ref; check the new commit's parent before pushing.
- **2026-08-21 (round 3)** Cleared the final production **copy blocker** and two
  QA/UX fixes on `experiment/full-site-visual-rebuild-v2`. Neutralised the
  unqualified "capital of Apayao" everywhere (→ "the municipality of Kabugao,
  Apayao"); removed public-works / procurement / contractor / flood-control /
  spending promises from the global `<noscript>`, the homepage / `/transparency`
  / `/government` copy, the SEO metadata and the structured data; dropped ₱0/₱670
  from the global `<noscript>` (they stay on `/about`'s own body). Kept the
  independence disclaimer and the contract-required strings. Also: the mobile
  homepage header now has a solid compact **navy** surface (white logo/Search/
  Menu were unreadable over the photo; desktop overlay unchanged); and
  `npm ci && npm test` now builds first via a `pretest` hook so the prerendered
  OSM-attribution contract test runs for real, while `npm run qa` builds only if
  `dist/` is missing (verification sequence builds once). A new contract test
  guards the prohibited wording across every built route. `npm run qa` → 113/113.
- **2026-08-21** Built the approved **"Kabugao in View"** photo-led redesign as
  Checkpoint 1 on `experiment/full-site-visual-rebuild-v2` (clean-cut from
  `origin/main` `745b877`; the rejected "Living Civic Atlas" experiment was
  stashed, never reused). Photo hero (self-hosted PD Dibagat River image, Andrew
  Garnett / Wikimedia Commons), real inverse logo (no HTML wordmark), one
  Emergency 911 header action, integrated search, unframed four-task strip, and a
  map-first barangays directory with synchronized map/list selection + a mobile
  bottom sheet. Kept the per-barangay detail route as-is (already compliant), and
  did **not** redesign the other routes. **Committed, not pushed** — for an
  experimental Cloudflare staging preview only. Two decisions worth recording:
  (a) left the pre-existing global SEO meta + `<noscript>` fallback untouched
  even though they still carry an unqualified "capital of Apayao" claim,
  public-works vocabulary and ₱0/₱670 — they are contract-pinned, all-routes, and
  a core-template no-JS/SEO contract, so scrubbing them is a separate approved
  follow-up, not this checkpoint; (b) kept the now-unmounted `HotlineBar` /
  `UtilityStrip` / `HotlineDialog` / `useKabugaoNow` and their CSS so existing
  contract tests stay green — prune later. One real bug found and fixed in QA:
  `.section h2` was overriding the sheet name to dark-on-navy; fixed by raising
  specificity to `.kv-sheet__head .kv-sheet__name`. Full record:
  `docs/command-center/active-task.md`, spec, and
  `docs/sessions/2026-08-21-full-site-visual-rebuild-v2.md`.
- **2026-08-16** v1 launch page (centred hero, three cards, zigzag SVG
  mountains, glows, pill buttons) was rejected by the maintainer as generic.
  Root cause: it was designed from taste rather than from the ecosystem.
  Superseded entirely — old components moved out of the tree.
- **2026-08-16** Research method: the `.org` domains are unreachable from the
  build sandbox, so each Better LGU repo was cloned from GitHub, built, served
  locally and rendered in Chromium. This also yielded exact computed tokens.
- **2026-08-16** Adopted the network grammar: Inter (not Figtree — that is
  bettergov.ph's own font, the LGU portals all use Inter), 76px masthead,
  left-aligned headings, 6px buttons, red hotline bar, navy utility strip,
  four-column footer with cost chips. Container was 1200px here; **widened to
  1440px on 2026-08-17** at the maintainer's request (the network range is
  1152–1440), with `--measure: 68ch` added to keep prose readable.
- **2026-08-16** Differentiator chosen: the project-record schema preview
  (9 labelled fields, all empty). Serves the flood-control transparency goal
  without publishing a single unverified figure. No peer site has this.
- **2026-08-16** Logo: maintainer chose "original shape, BetterGov colours".
  The v1 Apayao-outline mark was discarded. Shape is now test-pinned.
- **2026-08-16** Imagery: none. Maintainer's call — clean and standard, in
  line with the network. Identity comes from geography set in type.
- **2026-08-16** Cost transparency follows BetterTanay's model: ₱0 to the
  people, ₱670 to build, paid personally by the developer.
  Developer credited by name: Robin Tapiru.
- **2026-08-16** Hotlines: only 911 shown, since local Kabugao numbers were
  unverified at the time. Publishing an unverified emergency number is a safety
  risk. **Superseded 2026-08-18** — see below.
- **2026-08-16** External skills (superpowers, taste-skill, OpenViking)
  documented in `docs/skills/README.md` rather than vendored — together they
  are ~160 MB / 4,000+ files that never ship to a visitor.
- **2026-08-17** Barangay routes follow `bettercabanatuan` —
  `/government/barangays/:slug` — not Robin's sketched
  `site/barangaylist/barangay`. It is the only prior implementation in the
  network, so matching it keeps the portals navigable. **Needs Robin's sign-off.**
- **2026-08-17** Prerendering, not SPA. 10 of 16 network repos serve one HTML
  shell for every URL, so social scrapers preview every shared link as the
  homepage. A contract test now fails the build if two pages share a title.
- **2026-08-17** No bare catch-all route. 6 of 15 peers have `/:documentSlug`,
  which turns a typo into an empty page instead of a 404.
- **2026-08-17** Search stays dependency-free (scored substring match over a
  module-scope index). The network tried Meilisearch and abandoned it; their
  fallback is Fuse.js. Our corpus is ~35 entries.
- **2026-08-17** Barangay officials remain unpublished — no government source
  has them. The list page and every detail page say so explicitly and cite
  RA 12232 moving the BSKE to 2 Nov 2026.
- **2026-08-17** The 43 third-party reference screenshots stay out of git
  (16 MB, and they are captures of other people's sites). Only our own 26
  verification captures are committed.
- **2026-08-17** Maps: **Leaflet + OpenStreetMap tiles**, Robin's choice over a
  Google Maps embed. A Google embed would have required adding `frame-src` to
  the CSP, a Google tracker on 22 pages and an API key with billing on file.
  Leaflet costs one 146 KB code-split dependency and one host in `img-src`
  (`tile.openstreetmap.org`). **The CSP now permits exactly two external
  origins; `frame-src` is deliberately absent and a contract test enforces
  both.** Leaflet is CSP-safe because it sets styles through CSSOM properties,
  never `setAttribute("style")` — pinned by test against the installed package.
  Risk logged: OSM tiles are volunteer-run and their policy discourages heavy
  use; switching providers is one line plus one CSP host.
- **2026-08-17** Documentation restructured around a single entry point,
  `docs/START-HERE.md`, because `CLAUDE.md` and `README.md` had both gone stale
  (they still claimed no router, one third-party host, a 1200px container, the
  Figtree typeface, the discarded Apayao-silhouette logo and a coming-soon-only
  release). Corrected all three, plus the stale 2020 population figure in
  `docs/skills/frontend-standards/SKILL.md`. Session-memory protocol now
  requires updating START-HERE and recording deliverables that were sent to the
  maintainer without being committed.

- **2026-08-18** Emergency numbers published, reversing the earlier
  "911 only" position. Source: the municipality's own Discover Kabugao Facebook
  post of 15 April 2026 — the LGU's eLGU platform publishes officials but not
  hotlines, and no other government source lists them, so this is the best
  available. Independent corroboration was not possible for any single number,
  so the page shows the source and its date, keeps 911 first as the
  always-valid option, and states that mobile numbers change. `+63` links
  follow BetterCabanatuan, which displays the local form and dials the
  international one; 5 of 15 network repos use `+63` somewhere. Numbers live
  only in `src/data/hotlines.ts` and a contract test forbids hardcoding one in
  a component. **Open:** have someone in Kabugao test-dial the numbers, and ask
  the LGU to confirm them.
- **2026-08-18** The bar **is** an auto-scrolling marquee. The case against was
  put to Robin — you cannot tap a moving target, WCAG 2.2 SC 2.2.2 needs a pause
  control, `prefers-reduced-motion` stops it anyway, and taste-skill lists
  infinite-loop animation as an anti-default — and he chose it regardless. Built
  with all five stop paths (hover, focus-within, active/touch, a visible Pause
  button with `aria-pressed`, and reduced-motion which disables it entirely and
  makes the row swipeable), pure CSS so the browser can pause it, and each path
  pinned by a contract test. Defensible as *one* element; a second piece of
  auto-motion would break that defence.
- **2026-08-18** Full hotline list also opens as a popup on the native
  `<dialog>`, so the browser supplies the focus trap, Escape and focus
  restoration. The trigger stays a real link to `/emergency` and only cancels
  navigation when `showModal` exists — no JavaScript, no lost emergency number.
- **2026-08-18** One phone-number format on the site: **`+63`**, everywhere.
  Printing the local `0927 …` beside it repeated the same digits on one button.
  `formatLocal()` was deleted rather than left unused.
- **2026-08-18** Added `docs/skills/anti-slop/SKILL.md` — the maintainer asked
  for an anti-slop skill. `Leonxlnx/taste-skill`, already on this project's
  external list, is exactly that (MIT), but it scopes itself to "landing pages,
  portfolios, redesigns — not dashboards, not data tables", which is most of
  this site. So the repo skill credits and imports the parts that apply and
  records the two rules we reject (zero em-dashes; "avoid Inter" — Inter here is
  measured from the network, not a default). It also carries the redundancy
  table and the audit script.
- **2026-08-18** Standing instruction from the maintainer: **read the relevant
  `docs/skills/` file before editing, not after.** Recorded in `CLAUDE.md` and
  `docs/START-HERE.md`.
- **2026-08-18** New contract test cross-checks every rendered `className`
  against `src/styles.css`. A string-splice edit had deleted a whole style block
  while the markup still referenced it — build green, tests green, buttons
  rendering as 20px of bare text.

- **2026-08-19** The `<noscript>` fallback in `index.html` was rewritten. It had
  been carrying "Coming soon — a volunteer-run civic portal for Kabugao" since
  v2, and because that file is the shell for every prerendered route the line was
  being served on all 32 live pages, underneath fully rendered content. It now
  states what JavaScript actually adds (the map, the live weather reading, the
  search and filter boxes) and keeps the four facts the contract tests pin.
  `siteContent.status = "Coming soon"` was deleted in the same commit: nothing
  read it, and dead content that states something false is worse than dead code.
- **2026-08-19** That block is now `<aside>` + `<h2>`, not `<main>` + `<h1>`.
  Measured with Playwright at `javaScriptEnabled: false`: every page had **two**
  `main` landmarks and **two** `h1`s, because the prerendered page and the
  fallback were both being parsed. `frontend-standards` calls one `h1` and one
  `main` non-negotiable, so this was a live WCAG defect, not a style preference.
  Three contract tests now pin it: no "coming soon" in the shell, no "coming
  soon" in any prerendered page, and no `<main>`/`<h1>` inside `<noscript>`.
  **Open:** with JavaScript off the block still renders unstyled below the footer
  and restates the footer's cost chips, disclaimer and credit — a design call for
  Robin.
- **2026-08-20** `/search` and `/404` rebuilt as recovery screens. `/search`
  gained shareable `?q=` URLs, results grouped by kind with counts, six suggested
  queries before anything is typed, and an empty state that offers a way out
  instead of a dead end; `/404` gained a real search form and six recovery links.
  A hotline is now its own result kind rather than a "Page", so searching
  "police" surfaces the number rather than the page that lists it. Both screens
  read their recovery links from one exported `RECOVERY_LINKS` list, so the two
  cannot drift apart, and a test asserts every destination is a route that
  actually prerenders. The scoring logic is now one `searchSite()` used by both
  the masthead dropdown and the page — it had been duplicated.
- **2026-08-20** **Resolved:** CSP `form-action` relaxed from `'none'` to
  `'self'` with Codex's written approval. Under `'none'` the browser refused the
  submission outright, so all three search forms — `/search`, `/404` and the
  overlay — did nothing with scripting off. `'self'` permits that same-origin
  `GET` and still blocks a submission reaching another origin, which is the case
  the directive exists for; there is no `POST` anywhere on the site. A contract
  test now also asserts no host and no wildcard ever appears in the directive.
  Rationale recorded in `docs/skills/security-review/SKILL.md`.
- **2026-08-20** Search became site-wide, on the native `<dialog>` element —
  the same choice as the hotline popup, for the same reason: the browser owns the
  focus trap, Escape, the backdrop and the top layer, and a hand-rolled palette
  reimplements all four. `/` is the shortcut (GitHub, GitLab and Wikipedia use
  it, and it collides with nothing); Ctrl/Cmd+K is the second binding, and both
  are named in the overlay's hint line because Ctrl+K is what Windows users
  reach for. One static string, not a platform branch — a label that differs
  between the server and client render is a hydration mismatch, and "Ctrl K" is
  accurate on a Mac too since the handler accepts `ctrlKey || metaKey`.
  Escape hands focus back to the masthead Search button even when the overlay was
  opened by the shortcut, which needs an explicit fallback because the platform
  restores focus to `body` in that case. The open state lives in
  `src/lib/search-overlay.ts` rather than React, so any trigger and the
  document-level key handler reach one mounted overlay without a context
  provider — and it is a component-free module because a mixed-export file breaks
  fast refresh, the same reason `src/lib/routes.ts` exists.
- **2026-08-20** The masthead `SiteSearch` dropdown was deleted, not kept
  alongside the overlay. Two live search surfaces is two search behaviours. The
  homepage hero keeps its field in place, unmoved and visually unchanged, but it
  is now a trigger: a real `<a href="/search">` styled with the same
  `.search__field`, so with scripting off it is still a link to the fallback
  page. Codex approved this specific exception to "do not change the homepage".
- **2026-08-20** Two defects that a fully green suite did not catch, both found
  in a screenshot: `.btn--primary` is the white-on-navy hero button and rendered
  as bare text on a white section (`.btn--solid` is the light-background fill),
  and reusing `.search__results` — the absolutely-positioned masthead dropdown —
  for an in-flow list drew the results on top of the footer. Recorded in
  START-HERE §8.
- **2026-08-20** Public `/sitemap` page added — 8 of the 15 network portals have
  one and we did not. It is generated from `ALL_PATHS` + `BARANGAYS`, never typed
  out, so it cannot fall behind the routes; `auditSitemap()` reports anything
  unlinked or linked twice and a unit test asserts both are empty. Groups were
  set by Codex: Core, Government, Barangays, Safety, Explore and services,
  Project and meta. `/transparency` sits under Government because the
  `/government` hub is the page that links to it. `/404` is excluded from both
  the page and `sitemap.xml` — advertising a not-found page invites a crawler to
  index it. `lastmod` was deliberately **not** touched: it is still one build-wide
  stamp for all 32 URLs, which is a separate decision for a separate task.
  **Known visual trade-off:** the wide barangay group is third, so the first row
  holds two of three columns and the third is empty. Fixing it means moving
  Barangays first or last, which changes the group order Codex specified — his
  call, not ours.
- **2026-08-19** BetterLGU Directory PR #208 completed on the contributor side:
  PR body filled from their template, all four checklist boxes ticked, and a
  comment answering the triage bot's four verification points. Recorded because
  the bot's Facebook/Instagram HTTP 200s are **redirects to login pages** — that
  is normal platform behaviour for a logged-out crawler and does not mean the
  URLs are wrong, but it is why only a signed-in human can clear
  `needs-verification`.

## Next steps

1. ~~Codex reviews the account-migration handoff~~ — **done: APPROVED
   2026-08-23** at content commit `7b121df`. The new Claude account onboards
   via the handoff document's first-day checklist.
2. **Checkpoint 2A (Government hub + Officials): pushed and approved.** Pushed at
   `cf1ee7c`; Cloudflare preview https://69d4e1d9.betterkabugao.pages.dev/; Codex
   approved the code and visual direction (2026-08-24); a small docs/CSS cleanup
   pass followed. Next, Robin + Codex agree the scope for 2B. No merge to `main`
   until full-site parity and Codex approval.
3. ~~React hydration error #418~~ — **explained during rebuild QA**: `vite
   preview`'s SPA fallback serves the homepage HTML for every non-root URL, so
   hydration mismatches on every other route. Served the way Cloudflare Pages
   serves (clean URLs → the prerendered file, e.g. `scripts/qa/serve.mjs`),
   every route has zero hydration errors. Reopen only if it reproduces on a
   Cloudflare-served page.
4. ~~Codex QA on `improvement/search-404-recovery`~~ — **done; merged to
   `main` as PR #2 (2026-08-20)**.
5. **Awaiting `jmacj`:** BetterLGU Directory PR #208 — status not checked since
   2026-08-19; re-check.
6. **Open design decision:** with JavaScript off, the `<noscript>` block renders
   below a complete page and unstyled, restating the footer's cost chips,
   disclaimer and `Built by` credit. Either trim it to the JavaScript
   explanation alone or give it styles — the facts inside are pinned by contract
   tests, so changing them is a deliberate act. Needs Robin's call.
7. `_headers` / `_routes.json` review now that the deploy is multi-page.
8. Collect verified Kabugao emergency hotline numbers — someone in Kabugao
   test-dialling them, or the LGU confirming them.
9. Source project records from PhilGEPS / DILG FDP / COA / FOI before building
   any UI for them — and email `lfdad@blgf.gov.ph` about the BLGF licence first.
10. Any future intake form needs Turnstile + rate limiting before launch.
11. Licence decision: `package.json` still says ISC; the network standard is
    MIT + CC BY 4.0. The pre-rebuild footer on `main` states MIT · CC BY 4.0;
    the rebuilt footer's licence text should be settled in the same decision —
    align all of them.
12. Robin to delete `_to_delete/`, and `src/components/SiteSearch.tsx` if a
    `git rm` ever leaves it behind (the device bridge cannot remove files).
13. **README.md refresh** — the stale `PRERENDER_OK` count was corrected to
    "33 pages" in Checkpoint 2A; the route table and the pre-portal "Project
    status" section are still stale and want a fuller refresh (safe — only
    build settings are contract-pinned).

## People

- GitHub repository account: KuyaLoy
- Product owner, civic source owner, developer and initiator: **Robin
  Tapiru** — credited in the footer. (The "maintainer" in these docs is Robin.)
- Commander / final QA: Codex — approves every checkpoint and any merge
- Community: BetterGov.ph · directory at lgu.bettergov.ph
