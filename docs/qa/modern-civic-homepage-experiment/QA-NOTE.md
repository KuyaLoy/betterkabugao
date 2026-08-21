# QA note — modern civic homepage experiment

Branch: `experiment/modern-civic-homepage` · **Experiment only. Not approved
for `main`.** The live site stays as-is unless Robin and Codex approve later.

## What this is

A homepage-only redesign test: "BetterGov Plus". Same brand, same tokens, same
BetterLGU top rhythm (red hotline bar → navy utility → masthead → navy hero),
same data, same routes. The change is hierarchy and presentation.

## Screenshots in this folder

| File | Width | What to look at |
|---|---|---|
| `desktop-1440.png` | 1440 | full page, the target layout |
| `tablet-768.png` | 768 | hero stacks, desk drops 4-across → 2×2, ledgers still 2-up |
| `mobile-390.png` | 390 | one action per row, record card stacked, map then top-5 |
| `mobile-320.png` | 320 | tightest case — checked, no squeeze |

## What changed visually

1. **First viewport is a command area.** Same h1, tightened lede, a full-size
   search trigger, then four "front desk" destinations (barangays, emergency,
   officials, about) as bordered chips on the hero navy — each with a one-line
   sub so the label answers "what will I find?". One-line disclaimer beneath.
2. **The glance panel became a record card**: gold registry rule on top, the
   census source (`2024 POPCEN · PSA`) in the card header, tabular rows.
3. **The six-card wall is gone.** Replaced by two ledgers under navy rules —
   "Ready now" (barangays, officials, emergency — emergency was missing from
   the old grid) and "Being built" (transparency, explore, services) with
   status tags. Rows scan; cards had to be read.
4. **The map got its data beside it**: the six largest barangays with
   share-of-municipality, each a real link, plus "All 21 →". The map is now a
   preview with a purpose, not a decoration at the end.
5. **Unchanged on purpose**: executive section, mission/cost band, footer,
   header, hotline bar, every inner page.

## Measured (built `dist`, real Chromium)

- 320 / 390 / 768 / 1280 / 1440: `scrollWidth === clientWidth` at every width.
- One `h1`, one `main` at every width.
- Search opens from the hero trigger **and** the masthead. Escape closes the
  overlay and returns focus to the trigger with the field **empty, partially
  typed, fully typed, and from a focused result** — all four paths, because the
  first revision only tested the empty one and that is exactly how the bug
  shipped past me.
- Red emergency bar visible at every width.
- All 14 unique internal links on the page return HTTP 200 from the
  prerendered output — no dead destinations.
- Zero console errors (the only filtered noise is the sandbox's blocked
  egress to Open-Meteo/OSM tiles).
- Gates: 36 contract + 45 unit tests green; typecheck, lint clean;
  `PRERENDER_OK 33 pages`, `SEO_OK 32 sitemap URLs`.

## Self-scores (per the brief's bar)

- **AI slop score: 3/10** (lower is better; bar is ≤4). No centered hero, no
  gradient, no glass, no bento, no icon cards, no emoji, tokens only. The 2×2
  chip row is the closest thing to a pattern cliché; it is text-only, navy,
  and each chip is a real route with a factual sub.
- **Distinctiveness: 8/10** (bar is ≥8). The gold-ruled registry card, the
  front-desk row, the two civic ledgers and the map-with-its-data panel do
  not appear on the peer portals measured in `design-research/`, but all four
  are built from the network's own grammar (navy rules, dense bordered rows,
  left alignment, 6-8px radii).

## Copy discipline (anti-slop pass on my own output)

- The trust line originally said "built at ₱0 cost to the public" — removed:
  ₱0 already appears in the mission panel and the footer chips, and a third
  occurrence violates the repetition rule.
- The record card header now carries the census source, so the population
  row's own "2024 POPCEN" sub was removed — same fact twice in one card.
- The map panel originally stretched past its five rows, leaving a dead gap
  inside the card — it now carries six rows and the map matches the panel's
  height instead of a fixed 460px.
- After Robin's review of the first render ("too much open space"): homepage
  sections moved to a denser rhythm (`.section--dense`), the hero tightened to
  close inside one 1440×900 viewport, and the desk went 4-across on desktop.
  Full page height dropped from 3,757px to 3,242px at 1440.

## Revision 2 — Codex QA blockers, all three fixed

**1. Mobile map / attribution / panel collision.** Confirmed and fixed. Cause
was mine: `height: 100%` on `.map__canvas` measured the whole `.map` box, so the
OpenStreetMap attribution line below the canvas overflowed past its parent and
landed on the "Largest by population" header. `.map` is now a flex column, so
the attribution keeps its own space and the canvas takes what is left.
Measured — attribution bottom to panel top: **+18px at 320, 390 and 768**;
side-by-side above 1024 as designed.

**2. Search Escape did not close.** Codex was right and my earlier verification
was inadequate. Root cause: Chrome's `<input type="search">` consumes the first
Escape to clear its own value, so the native `<dialog>` cancel never fires. My
sandbox check pressed Escape on an **empty** field, where there is nothing to
clear, so the event reached the dialog and the test passed. Reproduced exactly
before fixing: with `poblacion` typed, the first Escape emptied the field and
left `open: true`; a second Escape closed it. Fixed by taking Escape over
explicitly on the dialog element, which covers the input, the results, the
chips and the close button. Now passes on all four paths, and a contract test
pins the handler.

**3. Sensitive homepage copy.** Removed. The hero lede no longer mentions public
spending; the ledger row is now "More source-linked records" with the body "The
record format future entries will use, and the official sources they must come
from." A new contract test fails the build if *budget*, *procurement*, *public
works*, *flood control*, *contractor* or *public spending* reappears in
`HomePage.tsx`. Verified against the rendered `<main>` text, not just the
source: **zero** forbidden terms.

Kept exactly as Codex asked: search-first hero, four front-desk actions,
at-a-glance registry card, Ready now / Being built ledgers, desktop map with
data beside it, navy-blue-gold identity.

## Risks / reasons Codex might reject

- The hero says "21" three times in one viewport (lede prose, chip label,
  record card row). Each does a different job (reading / navigation /
  scanning), which the anti-slop table allows, but it is a judgement call.
- The desk chips use `rgba` surfaces on navy (same treatment as the record
  card) — if Codex wants flat tokens only, swap to `--color-primary-800`.
- `React error #418` (open, pre-existing) is unaffected here but still
  unresolved on Codex's machine — this branch neither fixes nor worsens it.

## SEO / AEO / GEO review (content pass)

**Already strong, and untouched** — this is why the site outranks its size:
33 prerendered pages with their own title, description, canonical and
`BreadcrumbList`; a machine-readable `structured-data.json` carrying `Place`,
`GovernmentOrganization`, a CC-BY `Dataset` and all 21 barangays as
`AdministrativeArea` with coordinates; `sitemap.xml` + a crawlable HTML
`/sitemap`; robots.txt; self-hosted fonts and one `h1` per page.

**What this experiment adds, measurably:**

- Internal linking from the homepage went from a card grid to **14 unique
  descriptive anchor destinations** — "All 21 barangays", "Emergency hotlines", six named
  barangay links with populations. Descriptive anchors are on-page SEO that
  no meta tag substitutes for, and they are also what answer engines quote.
- The `/` title and description now say **"emergency hotlines"** — the
  highest-intent query this site can serve ("kabugao emergency hotline
  number") never appeared in the homepage metadata before. Nothing invented:
  the page has carried the hotline bar since v3.
- **GEO/AEO:** generative engines quote short, factual, source-named
  sentences. The lede, the record card ("2024 POPCEN · PSA") and the trust
  line are written to be liftable verbatim without losing their sourcing.

**Off-page, for Robin (no code involved):**

1. The **BetterLGU Directory row (PR #208)** is the single most valuable
   backlink available — same-niche, authoritative, already in flight.
2. Ask **BetterGov.ph** whether network portals cross-link members; a footer
   link from bettergov.ph is a domain-level endorsement.
3. When sharing on Facebook, link **deep pages** (a barangay page, the
   emergency page), not only the homepage — the prerendered previews are the
   advantage the network's SPA portals do not have.
4. The barangay pages are the long-tail: "barangay waga kabugao population"
   has zero competition. They already exist; sharing them builds the graph.
5. Do **not** buy links, exchange links, or add third-party widgets — the
   CSP and the project's credibility are worth more than any backlink.

## Not done, deliberately

No new dependency, no new host, no CSP change, no route change, no data
change, no inner-page redesign, no new civic claims. `sitemap.xml` untouched.
