# START HERE — BetterKabugao handoff

**If you are a new developer or an AI assistant opening this repository, read
this file completely before you touch anything else.** It tells you what the
project is, what is already built, what comes next and in what order, and which
mistakes have already cost us time.

Last updated: **24 August 2026** (footer cleanup — the two repetitive footer
disclaimer paragraphs consolidated so the independence + BetterGov-network
disclaimer appears once; **Codex-approved with one copy edit**, committed on the
branch, push pending; recap in
`docs/sessions/2026-08-24-footer-disclaimer-cleanup.md`. Earlier the same day:
Checkpoint 2A — Government hub + Officials — pushed at `cf1ee7c`, Codex-approved;
its docs/CSS cleanup landed at `657fbb2`).
Update this file at the end of every session — see
[§11](#11-before-you-finish-a-session).

> **CURRENT STATUS OVERRIDE — 13 September 2026:** `main` is currently at
> `16532fe` (`Merge Kabugao in View rebuild...`), fetched from `origin/main`
> on this date. The Kabugao in View rebuild is now merged into `main`; older
> rows below that describe it as experimental are historical records. The
> current feature discussion and next decision are recorded in
> `docs/sessions/2026-09-13-feature-research-and-handoff.md`.

## Reading order

| # | File | Why |
|---|---|---|
| 1 | **this file** | state, plan, traps |
| 2 | `CLAUDE.md` | the hard rules, stated as rules |
| 3 | `docs/CONTEXT.md` | living snapshot + dated decision log |
| 4 | `docs/sessions/` (newest first) | what happened, in the maintainer's own words |
| 5 | `design-research/RESEARCH.md` + `design-research/ARCHITECTURE.md` | why the site looks and routes the way it does |
| 6 | `docs/research/data-tracker.html` | **the feature roadmap** — open it in a browser |
| 7 | `docs/skills/` | anti-slop, frontend, security and session-memory playbooks — **read the relevant one before editing, not after** |

Do not skip 5 and 6. The design and the roadmap are both *measured* and
*sourced*; re-deriving them from taste is how the first version got rejected.

---

## 1. What this project is

An independent, volunteer-run civic transparency portal for **Kabugao, a
municipality of Apayao, Philippines** (21 barangays, 16,425 residents
per the 2024 POPCEN, 935.12 km², 1st-class income, PSGC 1408104000). Part of
the **BetterGov.ph / BetterLGU** volunteer network.

- Live domain: **betterkabugao.org** (Cloudflare Pages, deploys `main`)
- Repository: `github.com/KuyaLoy/betterkabugao`
- GitHub repository account: **KuyaLoy**
- Product owner, civic source owner, developer and initiator: **Robin
  Tapiru** — credited in the footer. (The "maintainer" referred to throughout
  these docs is Robin.)
- Cost: **₱0 to the people**; ₱670 domain paid personally by the developer

### Two things that are never negotiable

1. **It is not the official website of the Municipality of Kabugao.** Every
   page carries that disclaimer. Do not remove it, soften it, or imply
   endorsement.
2. **Nothing is published unless it is traceable to an official source, with
   the source and its date shown next to it.** If data is not verified yet, the
   page says it is being prepared. Never invent, estimate, or place-hold a
   budget, contractor, project name, percentage, official's name or emergency
   number. A contract test enforces the money rule specifically.

---

## 2. Where it stands right now

| | |
|---|---|
| **Live on `betterkabugao.org`** | the full multi-page portal — **33 prerendered routes**, interactive maps, emergency hotlines, the public `/sitemap` page (PR #1) and the search/404 recovery screens + site-wide search overlay (PR #2). Merged and deployed. |
| **`main` HEAD** | `745b877` — PR #2 (`improvement/search-404-recovery`) merged 20 Aug 2026 after Codex QA. **Untouched by the visual rebuild.** |
| **Visual rebuild (experimental)** | `experiment/full-site-visual-rebuild-v2` — the approved **"Kabugao in View"** photo-led redesign. **Checkpoint 1 APPROVED by Codex (22 Aug 2026)** at the **approved implementation baseline** `e5dc158fe3b75b406f0a9663d5a70a55f08bf1bf`; **approved preview** `https://e19410fa.betterkabugao.pages.dev/`. The branch has since received the documentation-only handoff commit `5f7375598fd42d5fd239374aece1fda38282c648`; the **current remote HEAD** is whatever `git fetch origin && git rev-parse origin/experiment/full-site-visual-rebuild-v2` returns — always fetch and verify before work, never trust a SHA written in a doc. Still **not `main`/production**. **Checkpoint 2A (Government hub + Officials) is pushed and Codex-approved on this branch — see the next row.** Ledger: `docs/command-center/release-tracker.md`. Status: `docs/command-center/active-task.md`. Spec: `docs/superpowers/specs/2026-08-21-full-site-visual-rebuild-v2-kabugao-in-view.md`. |
| **Checkpoint 2A (pushed, approved)** | `/government` + `/government/officials` brought into "Kabugao in View" (additive `kv` PageHeader variant, editorial wayfinding list, scannable officials roster). **Pushed at `cf1ee7cc4a29114d5819557f81b762e3bcd1404f`; Cloudflare preview https://69d4e1d9.betterkabugao.pages.dev/ ; Codex APPROVED the code and visual direction (2026-08-24).** Gates: 39 contract + 50 unit; typecheck + lint clean; `PRERENDER_OK 33 pages`; `npm run qa` **175/175**. A small docs/CSS cleanup pass followed. No other route touched; weather/clock still unmounted; legacy CSS not pruned (deferred). Recap: `docs/sessions/2026-08-24-checkpoint-2a-government-officials.md`. |
| **Footer cleanup (standalone)** | The global footer's two repetitive disclaimer paragraphs consolidated into one. The brand column now carries the independence + BetterGov-network disclaimer once (`siteContent.disclaimer`); the bottom row states only where published information is sourced (`siteContent.sourceNote`). Author, licence, version and the Find/Network links are unchanged; **no "Barangay officials" link added** — no verified roster page exists (see §5). The pinned disclaimer contract in `tests/site-contracts.test.mjs` was updated to the new wording in the same change. Gates: 39 contract + 50 unit; typecheck + lint clean; `PRERENDER_OK 33 pages`; `npm run qa` **175/175**. **Codex-approved with one copy edit (2026-08-24)**; committed on the branch; push pending (the build session cannot push, so Robin pushes from the authorized PC). Recap: `docs/sessions/2026-08-24-footer-disclaimer-cleanup.md`. |
| **Account migration** | **COMPLETE — handoff APPROVED by Codex on 2026-08-23** at approved handoff content commit `7b121df2cb79f879fdf2722202127fbe9509cff5`. The transfer document a new Claude account reads is `docs/sessions/2026-08-23-claude-account-migration-handoff.md` — roles, workflow, must-not-regress list, lessons, open questions — and it must follow that document's first-day checklist before doing anything else. |
| **BetterLGU Directory** | PR [#208](https://github.com/jmacj/better-lgu-directory/pull/208) — Kabugao row updated to 🟢 Active, awaiting review by `jmacj`. Status not re-checked since 19 Aug 2026. |
| **Quality gate (at the approved implementation baseline `e5dc158`)** | 39 contract + 49 unit tests green; lint, typecheck, build clean (`PRERENDER_OK 33 pages`); `npm run qa` **123/123** at 305/320/360/390/768/1280/1440 |

`c69101e` is 85 files changed / +6,128 / −509 against `main`, authored by
KuyaLoy on 17 Aug 2026. The pushed tree was compared file by file against the
locally verified build: **117 tracked files, zero mismatches.**

### Verified on the deployed production site, not just locally (v3.0.0, 17 Aug 2026 — historical record)

| Check | Result |
|---|---|
| Security headers actually sent by Cloudflare | all seven, including the exact CSP with only `api.open-meteo.com` and `tile.openstreetmap.org` |
| Per-page HTML | `/government/barangays/waga/` returns its own `<title>`, its own canonical, `BreadcrumbList` JSON-LD and **9,901 characters** of real body HTML containing Waga's own figures |
| Directory-index routing | works — nested routes resolve, no SPA shell |
| OpenStreetMap tiles | render from a real browser on the real domain — the first test outside the sandbox, where headless Chromium has no egress |
| Live weather | working (`Kabugao 25°C · Overcast`) |
| Console | no errors, no CSP violations |

Two things worth knowing about previews:

- The canonical on a preview page points at **`betterkabugao.org`**, not the
  preview host. That is deliberate — it keeps preview deploys out of search
  results. Do not "fix" it.
- The Cloudflare dashboard was showing a banner that **GitHub push events to
  Cloudflare are degraded by a GitHub incident**. This deploy went through
  anyway, but if a future push does not trigger a build, check that banner
  before debugging the project settings.

### Stack

React 19.2 · TypeScript 6 (strict) · Vite 8.2 · Tailwind CSS v4 (`@tailwindcss/vite`)
· react-router-dom 7.18 · Leaflet 1.9.4 · Node ≥22.12 <23 (pinned 22.14.0)

No backend, no database, no analytics, no CSS-in-JS, no jQuery, no UI kit.
Adding any dependency needs the maintainer's explicit approval.

---

## 3. What is already done

### Routes — all 33 prerendered to static HTML

| Page | Route | State |
|---|---|---|
| Home | `/` | real homepage, not a holding page |
| Government hub | `/government` | real content, never a redirect |
| Elected officials | `/government/officials` | mayor, vice mayor, 8 Sangguniang Bayan |
| Barangay directory | `/government/barangays` | all 21, live filter, sortable table |
| **One page per barangay** | `/government/barangays/:slug` | × 21 |
| **Emergency hotlines** | `/emergency` | 8 municipal offices + 911, both dialling formats |
| Transparency | `/transparency` | field schema only, **all values empty on purpose** |
| Explore / Services | `/explore`, `/services` | placeholders marked "Planned" |
| About | `/about` | funding, who builds it, how to send corrections |
| Search | `/search` | zero-dependency scored index; `?q=` URLs; plus the site-wide overlay (`/`, Ctrl/Cmd+K) |
| Public sitemap | `/sitemap` | generated from `ALL_PATHS` + `BARANGAYS`, audited by test |
| 404 | `*` → `dist/404.html` | a real 404 recovery screen; no catch-all swallows typos |

On the experimental branch, the header/footer/homepage/barangays-directory
carry the approved "Kabugao in View" design, and — pending Codex review of
Checkpoint 2A — so do `/government` and `/government/officials`. The remaining
routes keep their v3 look until a later checkpoint is approved.

Each barangay page carries population, share of the municipality, rank, PSGC
code, coordinates, classification, former name where one exists, schools,
**the three nearest barangays with real distances**, a Leaflet map, and Google
Maps view/directions links.

### Under the hood

- **Prerendering.** `vite build --ssr` + `scripts/prerender.mjs` writes one HTML
  file per route with its own `<title>`, description, canonical, Open Graph tags
  and `BreadcrumbList` JSON-LD. This exists because **10 of the 16 portals in
  the network serve one shell for every URL**, so every shared link previews as
  their homepage. A contract test fails the build if two pages share a title.
- **`src/lib/seo.ts` is the single source of routes.** `ALL_PATHS` feeds both the
  prerenderer and the sitemap. Add a route in exactly one place.
- **Maps.** `src/components/MapView.tsx` — Leaflet + OpenStreetMap tiles,
  code-split (146 KB chunk, so the 9 pages without a map never load it),
  SSR-safe, with a server-rendered fallback carrying the same place links.
- **Search.** `src/lib/search.ts` — scored substring match over a module-scope
  index. No dependency. The network tried Meilisearch and abandoned it.
- **Data.** `src/data/barangays.ts` (21 records, sums to exactly 16,425) and
  `src/data/officials.ts` (from the DICT eLGU government API).
- **Brand.** The original mark, recoloured to BetterGov navy and gold. Geometry
  in `src/brand/geometry.json` is pinned by contract test and **must never be
  redrawn**.
- **Emergency hotlines.** `src/data/hotlines.ts` holds the eight offices the
  municipality published, plus 911. Every number is shown in both the local
  (`0927 591 9022`) and international (`+63 927 591 9022`) form, and every
  `tel:` link is `+63` so it dials from inside the Philippines *and* from
  abroad — which is why the page exists. The red bar on every page carries 911
  plus all eight offices in an auto-scrolling marquee (the maintainer's call,
  made against advice) that stops on hover, focus, touch, a visible Pause button
  and `prefers-reduced-motion` — all five pinned by tests. "All numbers" opens
  the full list as a native `<dialog>` popup, degrading to the `/emergency` page
  without JavaScript. One number format site-wide: `+63`.

### Delivered to the maintainer but **not in the repository**

These were produced in earlier sessions and sent to Robin as files. They are not
committed, so record them here rather than losing them:

| Item | Detail | Reproducible? |
|---|---|---|
| Transparent logo PNGs | for social profiles and print | ❌ no script — rendered ad hoc |
| Facebook / Instagram profile picture | square crop of the mark | ❌ |
| Full wordmark lockup PNG | "BetterKabugao.org" horizontal | ❌ |
| Facebook cover image | page banner | ❌ |
| Social launch poster + caption | for FB and IG, tagging BetterGov.ph, leading on ₱0 government cost and the transparency goal | ❌ text was delivered in chat only |
| Coming-soon page (v2) | the release now live on `main` | ✅ it is the repo's history |

`npm run brand:build` regenerates only the **SVGs** (`betterkabugao-mark`,
`-mark-inverse`, `-logo`, `-logo-inverse`, `favicon.svg`) and `npm run
brand:social` the 1200×630 share card. **A small, worthwhile task: add a script
that exports the PNG set from the same geometry**, so the social assets stop
being one-off renders. Until then, do not hand-edit them — regenerate from
`src/brand/geometry.json`.

### Research artefacts (do not delete — they are the justification)

- `design-research/RESEARCH.md` — visual tokens measured from 11 live portals
- `design-research/ARCHITECTURE.md` — route structure across **15 cloned repos**
- `design-research/V1-VISUAL-CHECK.md` — post-build proof at 4 widths, and the
  defects that only screenshots caught
- `design-research/v2-screens/` — our own 26 captures, for future visual diffs
- `docs/research/DATA-SOURCES.md` + `docs/research/data-tracker.html` — 43-source inventory

---

## 4. What comes next — the plan

**The authoritative feature roadmap is the 12-step list in
`docs/research/data-tracker.html`** (open it in a browser; the roadmap is at the
bottom). Its status against today:

| # | Step | Status |
|---|---|---|
| 1 | Correct the facts already published | ✅ **done** — 16,425 / PSGC / 1st class / vice mayor confirmed via eLGU |
| 2 | Flood control projects — "the flagship" | ⛔ **deferred by the maintainer** (see below) |
| 3 | Where the money comes from | ⛔ **deferred by the maintainer** |
| 4 | All public works, not just flood control | ⛔ deferred with 2 and 3 |
| 5 | The 21 barangays | ✅ **done** — list + 21 pages + the PSGC code gap stated honestly |
| 6 | Flood hazard map | ⏸ not started — needs a decision, see below |
| 7 | Disaster fund (LDRRMF) | ⏸ not started, blocked with 2–3 |
| 8 | Who builds our projects (contractors) | ⏸ not started |
| 9 | Audit findings (COA) | ⏸ not started — manual transcription |
| 10 | Long-run trends | ⏸ not started — Wikidata, CC0, easy |
| 11 | Elections | ⏸ not started |
| 12 | Services and offices | ⏸ not started — genuine hand-curation |

Also done but not on that list: the officials page, site search, prerendering,
maps, cost transparency, the About page.

### ⛔ Read this before you build anything about money or flood control

The tracker calls flood control "the flagship" and it is the strongest material
we have. **The maintainer has explicitly deferred it.** In his words:

> "i think we only for now maybe like each baranga section location population
> … safrty for bnow coz flood and budget is a bit controversial"

Do not start steps 2, 3, 4 or 7 without asking him first. The data is ready and
documented in the tracker; the decision to publish is his, not yours.

There is also a licence gate: **BLGF restricts redistribution — email
`lfdad@blgf.gov.ph` before publishing their fiscal data.**

### The nearest safe work

In rough order of value per hour, all of it uncontroversial:

1. ~~**HTML `/sitemap` page**~~ — **done**: merged to `main` as PR #1
   (20 Aug 2026). 8 of the 15 network sites have one; now we do too.
2. **Roadmap step 10, long-run trends** — Wikidata Q30053, CC0, no licence
   gate, no political sensitivity. Population 1918→2024, poverty, voters.
3. **Roadmap step 12, services and offices** — needs the offices' cooperation,
   so start the outreach early even though the build is later.
4. **`public/_headers` review**, and decide whether the multi-page deploy needs
   a `public/_routes.json` (there is none today).
5. **A PNG export script for the brand assets** — see the table above.
6. **Test-dial the emergency numbers** or get the LGU to confirm them — see §6.
7. **Barangay officials** — see §5; genuinely unavailable today.

### Smaller loose ends

- `package.json` says licence **ISC**; the footer says **MIT · CC BY 4.0**.
  Pick one and align them.
- The elevation figure (132 m) had a discrepancy between sources. It is
  published; confirm which source wins and cite it.
- `docs/skills/` lives there rather than `.claude/skills/` because the device
  bridge could not write to `.claude/`. A local contributor can copy it —
  `docs/skills/README.md` explains how.
- The 43 third-party reference screenshots in `design-research/` are **not
  committed** (16 MB, and they are captures of other people's sites). They exist
  on Robin's machine only; `design-research/RESEARCH.md` names each one.

### Open decision: the hazard map (step 6)

The tracker specifies NOAH flood-hazard PMTiles via MapLibre. We have since
standardised on **Leaflet**, which cannot read PMTiles without another
dependency. Options are: add `pmtiles` + a Leaflet raster/vector adapter; swap
Leaflet for MapLibre; or use a NOAH raster tile endpoint if one exists. Any of
those needs maintainer approval, and step 6 sits behind the flood deferral
anyway.

---

## 5. Blocked on someone else

| Blocked on | What is needed | Why it matters |
|---|---|---|
| **`jmacj`** | review and merge BetterLGU Directory PR [#208](https://github.com/jmacj/better-lgu-directory/pull/208) | ✅ nothing left on our side: the row, the PR body, the checklist and a comment answering the triage bot's four verification points are all in place. The `needs-verification` label needs a human to open the two socials while signed in — Facebook and Instagram answer 200 to a crawler and then redirect it to a login page. On merge, `sync-to-pages.yml` publishes to `main-pages` → lgu.bettergov.ph. |
| **Robin** | delete `_to_delete/` and any `.git/index.lock` by hand | the device bridge cannot delete files |
| **BLGF** | reply to `lfdad@blgf.gov.ph` | licence clearance before any fiscal data ships |
| **The municipality** | the barangay officials roster | **no government source publishes it** — not eLGU, COMELEC, DILG or the province. The only complete list online is a stale SEO site. RA 12232 moved the BSKE to 2 Nov 2026, so incumbents hold over. The site says all of this explicitly on the barangay pages. **Do not fill this gap with a guess.** |
| **Local offices** | a *confirmation* of the hotline numbers | ✅ the numbers are now published, sourced to the municipality's own post of 15 April 2026 (see below). Still worth having someone in Kabugao test-dial them, and worth asking the LGU to confirm — mobile numbers change. |

---

## 6. Rules an assistant will break by default

These are the ones that have actually gone wrong here. `CLAUDE.md` has the full
set; these are the traps.

1. **No inline `style` attributes.** The CSP is `style-src 'self'`, which blocks
   them. Never write `style={{…}}`. Dynamic values go through CSSOM
   (`el.style.setProperty`), which the policy permits.
2. **Exactly two external origins are allowed**, and a contract test asserts the
   list: `api.open-meteo.com` (weather, `connect-src`) and
   `tile.openstreetmap.org` (map tiles, `img-src`). `frame-src` is deliberately
   **absent**, so no iframe embed — including Google Maps — can be added without
   changing the policy on purpose. Loosening any directive needs maintainer
   approval and a written reason.
3. **Do not redesign anything you were not asked to redesign.** The layout is
   measured from the network, not chosen. The first version was rejected for
   exactly this. Design, layout or visual changes need approval before merging.
4. **Do not touch `src/brand/geometry.json`.** The mark is test-pinned. Only
   colour, spacing and lockup may change. Never hand-edit `public/brand/`.
5. **Never delete a contract test to make it pass.** If you change a convention
   deliberately, update the test in the same commit and say why.
6. **Read the relevant `docs/skills/` file before you edit.** The maintainer
   asked for this explicitly. `anti-slop/SKILL.md` applies to every page,
   component or copy change.
7. **Work in checkpoints.** Implement one phase, show the result with
   screenshots, wait for a go-ahead. No unreviewed mega-changes.
8. **Text colour floor on light surfaces is `--color-gray-700`.** `gray-500`
   and `gray-600` fail WCAG AA and must not be used for text.
9. **Verify before claiming.** Run the commands, read the output, look at the
   screenshots. §8 explains why that last part is not optional.

---

## 7. How to work here

```bash
npm install
npm run dev            # Vite dev server; prerendering is not active here

npm test               # pretest builds first; then 39 contract + 49 unit tests — must be green
npm run typecheck
npm run lint
npm run build          # ends with "PRERENDER_OK 33 pages"
npm run qa             # committed Playwright harness (scripts/qa/) — builds only if dist/ is missing,
                       # serves dist/ like Cloudflare Pages, checks 305–1440, exits non-zero on failure
```

If Playwright's browser is missing on a machine: `npx playwright install
chromium` once. QA numbers reported to anyone come **only** from `npm run qa`
and its committed report (`docs/qa/checkpoint-1/qa-report.json`).

`npm run build` is a four-stage pipeline: `seo:build` → `tsc -b` →
`build:client` → `build:ssr` → `prerender`. **Do not simplify it to
`vite build`** — dropping the prerender step silently ships a client-only SPA,
the exact defect this site exists to avoid. A contract test pins the script
string.

`npm run dev` uses `createRoot`; the built site uses `hydrateRoot` because
prerendered HTML is present. If you see a hydration warning in production but
not in dev, that is the difference.

Serving the built site locally needs a static server that honours directory
`index.html` files — `vite preview` rewrites everything to the SPA shell, so
`/government/barangays/poblacion/` will wrongly show the homepage's title.
Cloudflare Pages serves directory indexes correctly, so this is a local-only
artefact.

### Commits

Conventional style (`feat:`, `fix:`, `docs:`, `chore:`), present tense, one
logical change each. Never push to `main` without permission — branch first.

---

## 8. Traps that have already cost time

Every one of these was a real, hours-long detour. They are listed so nobody
pays for them twice.

**Screenshots catch what assertions do not.** Three separate map defects passed
a fully green test suite and were only visible in an image. Always look at the
render.

- **OSM served "Access blocked" tiles as valid PNGs.** Their tile policy rejects
  clients without a proper user agent, and returns a 403 notice *rendered as a
  200 image/png*. The map was a wall of warning text while every assertion
  passed. If you write a tile-fetching harness, fingerprint that tile and fail
  on it, and send a browser user agent and referer.
- **`.map-pin { position: relative }` broke every marker.** It overrode
  Leaflet's `.leaflet-marker-icon { position: absolute }`, dropping markers into
  normal flow so they stacked downward off the map. Never set `position` on a
  Leaflet icon class; a contract test now forbids it.
- **A fixed map zoom cropped a barangay** the same page listed as a nearest
  neighbour. Local maps fit their own bounds with a zoom ceiling instead.

**Slop and redundancy**

- **Read `docs/skills/anti-slop/SKILL.md` before writing copy or markup.** It
  carries the redundancy table (what repeat is a defect, what repeat is
  required) and an audit script that runs over all 33 built pages.
- **Editing `src/styles.css` by string-splice deleted a whole block** while the
  markup kept referencing it. Build green, tests green, buttons rendering as
  20px of bare text. A contract test now cross-checks every rendered
  `className` against the stylesheet — but prefer targeted edits over splices.
- **One number format on the site: `+63`.** Printing the local `0927 …` beside
  it put the same digits twice on one button.

**Data**

- **A published number is not a verified number.** The emergency hotlines come
  from the municipality's own Facebook post of 15 April 2026 — the best source
  that exists, since neither the eLGU platform nor DILG publishes them — but no
  individual number could be corroborated a second time, and none has been
  test-dialled. The page states the source and its date, keeps 911 first, and
  says numbers can change. Do not upgrade that wording to imply certainty we
  do not have.
- Adding a route means **four** edits, not one: `src/App.tsx`,
  `ALL_PATHS` + `STATIC_META` + `SEGMENT_LABELS` in `src/lib/seo.ts`, the
  `PAGES` list in `src/lib/search.ts`, and `STATIC_SECTIONS` in
  `scripts/build-seo.mjs`. Miss the last one and the page prerenders but never
  reaches `sitemap.xml` — which is exactly what happened with `/emergency`.
  Since 2026-08-20 a fifth place exists — `SITEMAP_LABELS` + `GROUP_ORDER` in
  `src/lib/seo.ts`, which drive the public `/sitemap` page — but that one cannot
  be forgotten silently: `auditSitemap()` reports any route the page fails to
  link, or links twice, and a unit test asserts both lists are empty.

**Environment**

- **The device bridge cannot delete files.** `rm` fails on the mounted folder.
  To remove something, `mv` it into `_to_delete/` and tell Robin.
- **`unzip -o` fails on the mount** because overwriting needs an unlink. Extract
  with Python, writing each file in place (`open(path, "wb")`).
- **Do not run git commands on Robin's machine.** Every `git status` through the
  bridge leaves a `.git/index.lock` the bridge cannot remove, and he has to
  delete it by hand. Sync the files, then hand him the commands. This has
  happened twice.
- **Do not run `prettier`.** The project has no prettier config; running it
  reformats to 80 columns and churns whole files. Match the surrounding style
  (~100 columns) by hand.
- **The build sandbox cannot reach `.org` domains, and headless Chromium there
  has no external egress at all** (even `example.com` times out). To review peer
  sites, clone their repos, build and serve them locally. To test anything that
  fetches, intercept the request and fulfil it.

**Code**

- `react-router-dom` v7 exports `StaticRouter` from the **package root**;
  `react-router-dom/server` no longer exists.
- The clock uses `useSyncExternalStore`, not `useState` + `useEffect` — that
  trips `react-hooks/set-state-in-effect` and causes a hydration mismatch. Its
  server snapshot returns `null` deliberately.
- `PageHeader` renders a `<div>`, not a `<header>`. A second `<header>` created
  a duplicate `banner` landmark.
- `<script type="application/ld+json">` is **data, not code** — it does not
  violate `script-src 'self'`. Executable inline script still does.
- `scripts/build-seo.mjs` reads `src/data/barangays.ts` field by field on
  purpose. A fixed-order regex broke silently when a field was added.
- **`.btn--primary` is white-on-navy — it is the hero button.** On a white
  section it renders as bare blue text with no button around it. For a light
  background the fill is `.btn--solid`. Every test was green; only the
  screenshot showed it.
- **`.search__results` is the masthead dropdown**: `position: absolute`,
  `z-index: 30`, drop shadow. Reusing it for a list in the page flow drew the
  results *on top of the footer*. The search page has its own `.finder__list`
  instead of a pile of overrides — the same lesson as `position` on `.map-pin`.
  There used to be a `.search--inline .search__results { position: static }`
  override doing that job; deleting a load-bearing override is how this
  resurfaces.
- **`/search?q=` cannot be read on the first client render.** Every route is
  prerendered with no query string, so reading `useSearchParams()` immediately
  makes the first client render disagree with the served HTML and React reports
  a hydration mismatch. `SearchPanel` gates it behind a `useHydrated()`
  `useSyncExternalStore` whose server snapshot is `false` — the same trick the
  clock uses.
- **A class nothing styles is invisible to every test but the cross-check.**
  Adding `src/pages/BarangaysPage.tsx` to the className↔stylesheet list on
  2026-08-20 immediately found `.search--inline`, rendered since the multipage
  build with no rule anywhere in `styles.css`. The same run caught
  `.search__empty` being deleted as "dead" while that page still rendered it.
  Touch a component, add it to that list in the same commit.
- **The search overlay's open state is module-scope, so it survives an unmount.**
  Correct for one document and one overlay, but a test that opens it leaks into
  the next: `src/App.test.tsx` calls `closeSearchOverlay()` in `afterEach`, and
  again inside any loop that re-renders.
- **A `/`-shortcut test must wait for hydration.** The key listener is attached
  on hydration, not on `DOMContentLoaded`. Pressing `/` immediately after
  `page.goto` does nothing and looks exactly like a broken shortcut.
- **`waitUntil: "networkidle"` never resolves in the build sandbox.** The
  Open-Meteo request cannot complete, so Playwright hangs for the full timeout.
  Use `domcontentloaded` plus a short explicit wait.
- **`index.html` is the shell for all 33 prerendered pages, `<noscript>` block
  included.** Anything written there is served on every page, so a line that was
  true of a single coming-soon page ("Coming soon — a volunteer-run civic
  portal") went live as a false claim under 32 fully rendered pages. The block
  is also *additive*, not a replacement: with JavaScript off a visitor sees the
  complete prerendered page **and** this block, which is why it now uses
  `<aside>`/`<h2>` — as `<main>`/`<h1>` it gave every page two `main` landmarks
  and two `h1`s. Contract tests now pin both. Verify with Playwright's
  `javaScriptEnabled: false`, not by reading the source.

**From the "Kabugao in View" Checkpoint 1 rounds (21–22 Aug 2026)** — each of
these survived a fully green suite and was caught by Codex's eyes on a real
render; the long-form write-up is in
`docs/sessions/2026-08-23-claude-account-migration-handoff.md`:

- **Classic scrollbars shrink a 320px window to ~305px of content.** `body {
  min-width: 320px }` therefore forced a horizontal scrollbar in real Windows
  Chrome while headless (overlay-scrollbar) QA stayed green. No element may pin
  a 320px min-width (contract-tested), and the harness tests 305x568.
- **`<input type="search">` eats Escape to clear itself**, and stacked layers
  (sheet + overlay) each listen for Escape. The overlay intercepts in the
  capture phase and `stopPropagation()`s: one Escape, one layer, topmost first,
  focus back to the exact trigger.
- **Keyboard search paths bypass per-trigger cleanup.** `/` and Ctrl/Cmd+K
  opened search while the mobile menu stayed open behind it — the menu now
  collapses by subscribing to the overlay store, not per-trigger `onClick`.
- **Leaflet's attribution only exists after hydration.** The ODbL needs it
  always, so the server-rendered fallback carries a real
  `openstreetmap.org/copyright` link — contract-tested against built output.
- **Text over a photo needs a surface.** The transparent over-hero header made
  white controls unreadable on mobile; ≤900px it now has a solid navy surface.
  Same family: the sheet heading went dark-on-navy via `.section h2`
  specificity, and the hero search text wrapped out of its fixed-height control
  at 305px (fixed with nowrap + ellipsis).
- **Never `git reset --hard` to an unverified ref.** A push block reset to
  `origin/<branch>` while origin was stale, so the next commit was built on the
  wrong parent and silently dropped a fix (`3352ee3`; restored in `e5dc158`).
  Pin the fetched SHA, verify `git rev-parse HEAD`, and check the new commit's
  parent before pushing.
- **QA numbers come from the committed harness only** (`npm run qa`) — an
  ad-hoc script once shipped a misleading report (an object spread clobbered a
  failing key).

---

## 9. File map

```
src/
  App.tsx                     routes; explicitly no bare catch-all
  entry-server.tsx            SSR render() for the prerenderer
  main.tsx                    hydrateRoot when prerendered, else createRoot
  styles.css                  ALL styling: @theme tokens + plain classes
  app/site-content.ts         published copy and facts (contract-tested)
  brand/                      mark geometry (pinned) + lockup components
  components/
    MapView.tsx               Leaflet map, lazy, SSR-safe, CSP-safe
    PageHeader.tsx            page banner + breadcrumbs, hero|compact
    SiteSearch.tsx            search box + results
    SiteHeader/SiteFooter/UtilityStrip/HotlineBar.tsx
  data/
    barangays.ts              21 records — the join key for everything
    officials.ts              eLGU-sourced officials + the withheld-note
  lib/
    seo.ts                    per-route metadata + ALL_PATHS (single source)
    search.ts                 search index + scoring
    routes.ts                 ALL_PATHS re-export for the SSR bundle
    useKabugaoNow.ts          clock + weather
  pages/                      HomePage, BarangaysPage, BarangayDetailPage,
                              OfficialsPage, SitemapPage, SimplePages
  components/SearchOverlay    site-wide palette on a native <dialog>
  lib/search-overlay.ts       its open state, kept outside React
                              (SearchPage and NotFoundPage live in SimplePages)
scripts/
  build-seo.mjs               structured-data.json, sitemap.xml, robots.txt
  prerender.mjs               one HTML file per route
  build-brand.mjs             regenerates brand SVGs from geometry.json
  render-social-card.mjs      1200×630 share image
  qa/serve.mjs                static server: clean URLs → prerendered files
  qa/checkpoint1.mjs          committed Playwright QA harness (npm run qa)
tests/
  site-contracts.test.mjs     39 convention/security/data contracts
  brand-assets.test.mjs       brand geometry + output pinning
public/
  _headers                    HSTS, CSP, nosniff, frame options
  fonts/                      Inter, vendored under the OFL
  brand/                      generated logo/mark/social assets (never hand-edit)
  hero/                       self-hosted PD hero variants (see source registry)
docs/
  START-HERE.md               this file
  CONTEXT.md                  living snapshot + decision log
  command-center/             active task · release tracker · source registry
  sessions/                   dated session recaps (2026-08-23 = the migration handoff)
  qa/checkpoint-1/            committed QA report + screenshots
  research/                   data source inventory + tracker
  skills/                     frontend / security / session-memory playbooks
design-research/              measured evidence + screenshots
```

---

## 10. Where the data comes from

| Subject | Source | Licence / note |
|---|---|---|
| Population, PSGC | PSA (2024 POPCEN), `psgc.gitlab.io` | CC BY 4.0. Code `1408104003` is **not in use** — say so, do not hide it |
| Coordinates, schools | OpenStreetMap place nodes | ODbL, attribution required. **OSM tags Bulu wrongly** |
| Map tiles | `tile.openstreetmap.org` | ODbL. Volunteer-run; heavy use discouraged. Switching providers is one line in `src/components/MapView.tsx` + one CSP host |
| Municipal officials | DICT eLGU, `elgu-kabugao-apayao-news.e.gov.ph/officials` | the municipality's own platform; retrieved 17 Aug 2026 |
| Barangay officials | **none exists** | see §5 |
| Weather | Open-Meteo | no key, no cookies; omitted rather than faked on failure |
| Fiscal data | BLGF SRE / LDRRMF | **restricted — email `lfdad@blgf.gov.ph` first** |
| Public works | DPWH ArcGIS, `api.dpwh.bettergov.ph` | see the tracker's traps column |
| Municipal boundary | **not in OSM** | only a point node. A real outline needs the PSA/NAMRIA set on HDX (CC BY-IGO, 360 MB–1 GB) |

---

## 11. Before you finish a session

1. Update **this file** — move anything you completed out of §4, and add any new
   trap to §8.
2. Update `docs/CONTEXT.md` — the state block and a dated line in the decision
   log, with the reasoning, not just the outcome.
3. Add a recap to `docs/sessions/YYYY-MM-DD-topic.md` covering what was asked,
   what was built, what was decided and why, what broke, and what is left. See
   `docs/skills/session-memory/SKILL.md`.
4. Run the full gate and paste the real numbers: `npm test`, `npm run
   typecheck`, `npm run lint`, `npm run build`.
5. Screenshot any UI change at **1440 / 1280 / 768 / 390** and compare against
   `design-research/v2-screens/`. Look at the images; do not trust the tests
   alone.

The point of all this writing is that nobody — human or model — should ever
have to reconstruct this project's reasoning from the diff.
