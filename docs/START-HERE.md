# START HERE — BetterKabugao handoff

**If you are a new developer or an AI assistant opening this repository, read
this file completely before you touch anything else.** It tells you what the
project is, what is already built, what comes next and in what order, and which
mistakes have already cost us time.

Last updated: **18 August 2026**. Update it at the end of every session — see
[§11](#11-before-you-finish-a-session).

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

An independent, volunteer-run civic transparency portal for **Kabugao, the
capital municipality of Apayao, Philippines** (21 barangays, 16,425 residents
per the 2024 POPCEN, 935.12 km², 1st-class income, PSGC 1408104000). Part of
the **BetterGov.ph / BetterLGU** volunteer network.

- Live domain: **betterkabugao.org** (Cloudflare Pages, deploys `main`)
- Repository: `github.com/KuyaLoy/betterkabugao`
- Maintainer / repo owner: **KuyaLoy (Safdar)**
- Developer and initiator: **Robin Tapiru** — credited in the footer
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
| **Live on `betterkabugao.org`** | the coming-soon page (`main` @ `9608dd6`) — **unchanged** |
| **Pushed and deployed for review** | `feat/multipage-v1` — the real multi-page portal, 32 prerendered routes, interactive maps, emergency hotlines |
| **Preview URL** | https://5ea22c06.betterkabugao.pages.dev (Cloudflare branch deploy, verified in a real browser) |
| **Awaiting** | the maintainer's review, then a merge to `main` |
| **Quality gate** | 32 contract tests + 27 unit tests green; lint, typecheck, build clean |

`c69101e` is 85 files changed / +6,128 / −509 against `main`, authored by
KuyaLoy on 17 Aug 2026. The pushed tree was compared file by file against the
locally verified build: **117 tracked files, zero mismatches.**

### Verified on the deployed preview, not just locally

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

### Routes — all 32 prerendered to static HTML

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
| Search | `/search` | zero-dependency scored index |
| 404 | `*` → `dist/404.html` | a real 404; no catch-all swallows typos |

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

1. **HTML `/sitemap` page** — 8 of the 15 network sites have one; we do not.
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
| **Robin** | his **Facebook, Instagram and Threads URLs** | required to update the BetterLGU Directory entry in their main repo: add the domain + socials, flip status 🔵 Planned → 🟢 Active. Asked several times; still outstanding. |
| **Robin** | review the preview, then merge `feat/multipage-v1` → `main` | the branch is pushed and deployed; only the merge is left |
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

npm test               # 28 contract tests + 24 unit tests — must be green
npm run typecheck
npm run lint
npm run build          # ends with "PRERENDER_OK 31 pages"
```

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
  required) and an audit script that runs over all 32 built pages.
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
                              OfficialsPage, SimplePages
scripts/
  build-seo.mjs               structured-data.json, sitemap.xml, robots.txt
  prerender.mjs               one HTML file per route
  build-brand.mjs             regenerates brand SVGs from geometry.json
  render-social-card.mjs      1200×630 share image
tests/
  site-contracts.test.mjs     28 convention/security/data contracts
  brand-assets.test.mjs       brand geometry + output pinning
public/
  _headers                    HSTS, CSP, nosniff, frame options
  fonts/                      Inter, vendored under the OFL
docs/
  START-HERE.md               this file
  CONTEXT.md                  living snapshot + decision log
  sessions/                   dated session recaps
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
