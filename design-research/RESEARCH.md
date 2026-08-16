# BetterGov / BetterLGU Visual Research

Method: every site below is open-source. Because the sandbox cannot reach the
`.org` domains directly, each repo was cloned from GitHub, installed, built,
served locally, and rendered in a real Chromium browser at 1440×900 and
390×844. Screenshots (fold, full page, mobile) are in this folder, and exact
computed values are in `_measurements.json`.

## Sites reviewed (11)

1. BetterSolano — Solano, Nueva Vizcaya
2. BetterTagaytay — Tagaytay City, Cavite
3. BetterAlaminosCity — Alaminos City, Pangasinan
4. BetterTanay — Tanay, Rizal
5. BetterAklan — Aklan Province
6. BetterMeycauayan — Meycauayan, Bulacan
7. BetterCabanatuan — Cabanatuan City, Nueva Ecija
8. BetterCalauan — Calauan, Laguna
9. BetterLB — Los Baños, Laguna
10. BetterIndang — Indang, Cavite
11. BetterOlongapo — Olongapo City, Zambales

Plus the BetterGov.ph design system source (`bettergovph/bettergov`) and the
BetterLGU Directory (`jmacj/better-lgu-directory`).

## Measured common characteristics

| Property | Finding |
|---|---|
| Typeface | **Inter** on every LGU portal (bettergov.ph itself uses Figtree) |
| Container | **1152–1280px** max width; 1152 and 1280 most frequent |
| Header height | **73–80px**, white background, sticky |
| H1 | **40–60px**, weight 700–900, **`text-align: start` — left, never centered** |
| H2 | **36px**, weight 700, left-aligned |
| Button radius | **0–8px** — sharp. No pill buttons anywhere |
| Button height | **42–56px** |
| Card radius | **10–16px** — modest, not "huge rounded" |
| Hero background | Solid royal/navy blue. **No gradient meshes, no glows** |
| Photography | Almost none on home screens. Flat SVG marks + Lucide icons only |

## Structural pattern (near-universal)

1. **Red emergency hotline bar** — full-width, top of page, real phone numbers
   as chips (Police / Fire / MDRRMO / Hospital). Present on Solano, Tagaytay,
   Alaminos, Meycauayan, Cabanatuan.
2. **Navy utility strip** — right-aligned live data: `1 USD = ₱—`, city weather
   `—°C`, and date/time in PHT. This is the "money exchange + weather" band.
3. **White header** — logo left (mark + two-line wordmark ending in `.org`),
   horizontal nav (Services / Government / Transparency / Statistics / Contact),
   language toggle right (EN / FIL / local language e.g. ILO).
4. **Split hero, asymmetric** — left: small caps eyebrow "WELCOME TO", large
   left-aligned H1, one-sentence subhead, two buttons (solid + outlined).
   Right: white "Find a Service" search card with popular-service chips.
   *Nobody centers the hero.*
5. **Light section** (#F8F9FA / white) — left-aligned section heading, then a
   restrained card grid.
6. **Dark footer, 4 columns** — brand + one-line description | Quick Links |
   Resources (Open Data PH, FOI, DILG FDP, PhilGEPS, official LGU site) |
   Get Involved.
7. **Cost transparency chips** — the ecosystem signature:
   - BetterTanay: green `Cost to the People of Tanay = ₱0` **and** amber
     `Cost to Build the Site = ₱422.81`
   - BetterAlaminos: `Cost to the People of Alaminos City: ₱0.00`
8. **Bottom legal bar** — `© 2026 <site> · MIT | CC BY 4.0`, "All public
   information sourced from official government portals", the
   not-an-official-website disclaimer, and **`Built by <developer name>`**
   (BetterTanay credits "Sabriel Adriel San Agustin"), plus a version number.

## Best patterns worth adopting

- **BetterTanay** — the two-chip cost transparency (₱0 to the people + real
  build cost) and named developer credit. Exactly the honesty model for us.
- **BetterSolano** — the utility strip (forex/weather/time) and the emergency
  hotline bar; hero split with search card.
- **BetterAlaminos** — cleanest four-column footer and the clearest
  volunteer-run disclaimer wording.
- **BetterTagaytay** — strongest type hierarchy: 12px caps eyebrow over a
  60px/900 headline; icon tiles inside the service card.
- **BetterGov.ph** — the token system itself (blue scale to #00142F, gold
  accents, gray ramp).

## Patterns to avoid

- Centered hero + three identical cards + gradient CTA (nobody in the ecosystem
  does this; it is the generic AI layout).
- Pill buttons, glows, glassmorphism, decorative gradients — absent everywhere.
- Cartoon/zigzag SVG scenery — absent everywhere.
- Fabricated statistics. Sites show `--°C` and `1 USD = ₱--` rather than fake
  numbers when live data is unavailable. Honest placeholders are the norm.
- Modal popups on load (Solano's volunteer modal blocks the page — annoying).

## BetterKabugao direction

Adopt the ecosystem grammar — 1200px container, Inter, 76px white header,
red hotline bar, navy utility strip, left-aligned split hero, sharp buttons,
four-column dark footer with cost chips and developer credit — so it is
unmistakably part of BetterGov.

Differentiate through content and restraint, not decoration:

- **Coming-soon state, not a fake portal.** Where peers put a live service
  search, we put the four things being built (Transparency & Public Money,
  Projects & Infrastructure, Explore Kabugao, Services) as a numbered
  editorial index with honest "being prepared" status — no invented data.
- **Kabugao identity through geography, not scenery.** The existing logo mark
  (kept, recolored to BetterGov tokens) plus real coordinates, elevation, and
  the Apayao River / Cordillera facts set in type — no illustrated mountains.
- **A project-record schema preview** — the actual fields the tracker will
  carry (Project · Location · Budget · Funding Source · Contractor ·
  Implementing Agency · Timeline · Status · Documents) shown as an empty
  labelled table. It communicates ambition and honesty simultaneously, and no
  peer site has it.
