# V1 multi-page build — post-build visual check

Screenshots in `v2-screens/`. Captured from the **built and prerendered**
`dist/` served as static files (not the dev server), so what was measured is
what Cloudflare will serve.

- 26 captures: 5 pages × 4 widths (1440 / 1280 / 768 / 390) + 6 more pages at 1440
- Date: 17 August 2026

## 1. Automated invariants — all 26 captures

| Check | Result |
|---|---|
| Horizontal overflow (`scrollWidth > clientWidth`) | none at any width |
| `<h1>` count per page | exactly 1 |
| `<header>` landmarks | exactly 1 (the duplicate-banner bug is gone) |
| `<main>` landmarks | exactly 1 |
| Inline `style` attributes | 0 — CSP `style-src 'self'` holds |
| `target="_blank"` without `rel=noreferrer` | 0 |
| `<img>` without `alt` | 0 |

Measured *before* each screenshot: Playwright's full-page capture temporarily
writes inline styles onto `<html>`, which reads as a CSP violation if you
measure afterwards. An earlier pass reported 1–2 inline styles for exactly
this reason; there are none.

## 2. Measured against the network references

Reference figures from `_measurements.json` (six sites measured in the same
way). Ours measured from the served build at 1440.

| Property | Network range | BetterKabugao | Verdict |
|---|---|---|---|
| Container | 1152 / 1200 / 1232 / 1248 / 1280 / 1440 | 1392 (1440 token − 48 gutter) | in range, at the wide end — Robin's choice |
| Typeface | Inter (6/6) | Inter | match |
| Masthead height | 73–80px | 77px | match |
| `h1` size | 40–60px | 40px inner pages, 49.6px home | match |
| `h1` weight | 600–900 | 800 | match |
| `h1` alignment | `start` (6/6) | `start` | match |
| Button radius | 0px, 6px, 8px | 6px | match |
| Card radius | 8–20px | 10px / 12px | match |
| Pill (999px) buttons | none | none | match |

## 3. Defects found by looking at the screenshots, and fixed

Each of these was visible only in the captures — the tests were green
throughout.

1. **Mobile nav hid two of six sections.** `.masthead__nav` used
   `overflow-x: auto`, so at 390px "Services" and "About" sat off-screen with
   no scroll affordance. → `flex-wrap: wrap`; all six links now visible on two
   rows. *(worst of the six — two sections were effectively unreachable on a
   phone)*
2. **Home card grid landed 4 + 2** with a hole on the right. `auto-fill
   minmax(320px, 1fr)` computed 4 columns at 1392px for six cards. → explicit
   `repeat(3, …)` / 2 / 1 by breakpoint, so it reads 3 + 3.
3. **Sangguniang Bayan grid landed 5 + 3** for eight members. → explicit
   `repeat(4, …)`, so 4 + 4.
4. **Mayor and vice mayor were quarter-width cards** in that same 4-up grid,
   and their names wrapped mid-name on the homepage. → `.official-grid--exec`,
   two columns capped at 760px.
5. **The officials `h1` broke as "Elected municipal officials, 2025–" /
   "2028".** → the term moved to the eyebrow (`Government · 2025–2028 term`)
   and into the description; the `h1` is now one line and the `<title>` keeps
   the years for search.
6. **Mobile barangay rows showed unlabelled values** — "2,724", "16.6%",
   "1408104020" with no column headers, because the header row is
   `display: none` under 768px. → `data-label` + `::before content: attr()`
   inside the mobile query only. Desktop DOM unchanged, no inline styles.

Also removed: a `display: none` `<SiteSearch />` left on the barangays page —
dead markup that shipped a second `Search BetterKabugao` input into the HTML.

## 4. Structural checks against the network's own failure mode

| Check | Result |
|---|---|
| Routes prerendered to static HTML | 31 |
| Distinct `<title>` per page | verified — no two share one |
| Own `<link rel=canonical>` per page | verified |
| Server-rendered body per page | > 2000 chars, `<h1>` present in source |
| `BreadcrumbList` JSON-LD | on every page with ≥ 2 crumbs |
| Inline executable `<script>` in output | none (JSON-LD only, which is data) |
| `dist/404.html` for Cloudflare | present |
| `sitemap.xml` entries | 30, all real routes, no `#` anchors |

`tests/site-contracts.test.mjs` pins all of the above, so a regression to a
client-only shell fails the build rather than shipping quietly.

## 5. Maps (added after the first review)

Interactive OpenStreetMap maps via Leaflet 1.9.4 — Robin's choice from four
options. A section on the homepage plots all 21 barangays; each barangay page
gets a local map of itself plus its three nearest neighbours.

### Verified under the production CSP

`dist/` was served with the real `Content-Security-Policy` parsed straight out
of `public/_headers`, so the test cannot drift from what ships.

| Check | Result |
|---|---|
| CSP violations with the map running | **0** |
| Console errors | 0 |
| Tile URLs requested | all match `https://tile.openstreetmap.org/{z}/{x}/{y}.png` |
| Tiles that were OSM's "Access blocked" notice | 0 |
| Markers plotted | 21 (home) / 4 (barangay) |
| Markers falling outside the visible map | 0 at 1440, 1280, 768 and 390 |
| OpenStreetMap attribution present | yes, plus an ODbL credit line under every map |
| No-JS fallback server-rendered | yes — the same map and directions links |
| Inline `style` attributes outside the map | 0 |

Leaflet is code-split into its own 146 KB chunk, so the 9 pages without a map
never download it.

### Why it works under a policy this strict

`style-src 'self'` forbids inline styles, which sounds fatal for a map that
positions layers by writing styles. It is not, and the difference was measured
rather than assumed:

| How a style is set | Under `style-src 'self'` |
|---|---|
| `el.style.transform = …` (CSSOM property) | **allowed** |
| `el.style.cssText = …` | **allowed** |
| `el.setAttribute("style", …)` | **blocked** |

Leaflet 1.9.4 only ever does the first. It contains no `setAttribute("style")`,
no `eval` and no `new Function` — a contract test now asserts all three against
the installed package, so an upgrade that changes this fails the build.
`leaflet.css` is imported from `src/styles.css` rather than dynamically from
the component: a dynamic CSS import would make Vite inject a `<style>` element
at runtime, which the policy *would* block.

### Three defects the screenshots caught that the assertions missed

1. **OSM served "Access blocked" tiles and the harness called it a pass.** The
   first verification fetched tiles with curl's default user agent; OSM's tile
   policy rejects that and returns a 403 *rendered as a valid 200 PNG* reading
   "App is not following the tile usage policy". Every assertion passed while
   the map was a wall of warning notices. The harness now fingerprints that
   tile and fails on it, and sends a browser user agent and referer.
2. **Two pins sat below the bottom edge of the homepage map.** Cause was mine:
   `.map-pin { position: relative }` overrode Leaflet's
   `.leaflet-marker-icon { position: absolute }`, dropping every marker back
   into normal flow so they stacked downward and drifted. Found by deriving the
   map's visible latitude range from the tile geometry, proving the viewport
   *did* cover all 21 barangays and the pins therefore had to be misplaced. A
   contract test now forbids any `position` on `.map-pin`.
3. **A fixed zoom cropped the farthest neighbour.** Cabetayan, 3.0 km from
   Poblacion and listed on the page as a nearest neighbour, fell outside the
   zoom-13 view. Local maps now fit their own bounds with a zoom ceiling.

Also fixed: a pin label clipped by the map frame at 390 px — labels are hidden
below 560 px, where the popup carries the name.

### One risk worth knowing about

OpenStreetMap's tile servers are volunteer-run, and their usage policy is
explicit that they are not for heavy use; they block clients that ignore it.
Real browsers on betterkabugao.org get real tiles today (verified above), and a
site this size is well within normal use. But if OSM ever blocks the domain the
maps would degrade to their fallback. The switch would be one line — `TILE_URL`
in `MapView.tsx` — pointed at a free-tier provider (MapTiler, Stadia, Carto),
plus that host in `img-src`. No other code changes.

## 6. Not done yet

- HTML `/sitemap` page (8 of 15 network sites have one).
- `_routes.json` review for the multi-page deploy.
- Visual diff against `v2-screens/` on future changes — the captures are
  committed so the next change can be compared, not re-judged from scratch.
