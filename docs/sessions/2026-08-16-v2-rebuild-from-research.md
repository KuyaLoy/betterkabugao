# 2026-08-16 — v2 rebuild from ecosystem research

## Who
Robin Tapiru (maintainer-side, driving) with Claude (Cowork), plus a
design-review subagent for the mandatory visual comparison.

## Why
The v1 launch page shipped earlier the same day was rejected as generic. The
maintainer's diagnosis was correct and specific: centred hero, three identical
cards, gradient CTA, zigzag SVG mountains, glows, pill buttons — the textbook
AI layout. Root cause: it was designed from taste, without ever looking at the
network it was supposed to belong to.

## What changed
- **Research first (mandatory).** 11 Better LGU portals rendered and studied:
  Solano, Tagaytay, AlaminosCity, Tanay, Aklan, Meycauayan, Cabanatuan,
  Calauan, LB, Indang, Olongapo. The `.org` domains are unreachable from the
  sandbox, so each repo was cloned from GitHub, installed, built, served
  locally and screenshotted in Chromium at 1440 and 390, with computed tokens
  extracted. Output: `design-research/` (33 screenshots, `_measurements.json`,
  `RESEARCH.md`).
- **Full frontend rebuild.** Every component replaced. New page order matches
  the network: hotline bar → live utility strip → 76px white masthead →
  left-aligned split hero with a build-status card → intro + facts → the
  project-record schema preview → explore Kabugao → services → mission with
  cost panel → four-column footer.
- **Typeface changed Figtree → Inter** (Figtree is bettergov.ph's own font;
  every LGU portal measured uses Inter). Vendored, licence included.
- **Logo restored.** The v1 Apayao-outline mark was discarded. The original
  Kabugao silhouette + three-ray sunrise is back, recoloured to BetterGov
  navy/gold, with the geometry now pinned by contract test.
- **Live data.** Kabugao weather via Open-Meteo (no key) + a PHT clock showing
  day, date and time. CSP `connect-src` widened by exactly one host.
- **Cost transparency + credit**, following BetterTanay: ₱0 to the people,
  ₱670 to build, paid personally by the developer, with
  "Built by Robin Tapiru" in the footer.
- **Skills documented** in `docs/skills/` (three project skills) and external
  sets linked rather than vendored.

## Decisions made (and why)
- Ecosystem grammar adopted wholesale, identity carried by content instead of
  decoration — the maintainer wanted "similar, not a 100% copy".
- The empty project-record schema (9 labelled fields, all "Awaiting verified
  data") is the differentiator: it states the flood-control transparency
  ambition while publishing zero unverified figures. No peer site has it.
- No imagery at all (maintainer's call). Kabugao identity comes from real
  coordinates, elevation and area set in type.
- Only 911 in the hotline bar — local numbers are unverified, and publishing
  a wrong emergency number is a safety risk, not a cosmetic gap.
- External skill repos linked, not vendored: ~160 MB / 4,000+ files that never
  reach a visitor, and vendoring would freeze them at today's version.

## Verified
- 22 contract + 10 unit tests green; typecheck, lint, build clean
- Rendered at 1440 / 1280 / 768 / 390 against the production build served with
  the real security headers — zero console errors
- `scrollWidth === clientWidth` confirmed at 320/360/375/390/414/768/1024/
  1280/1440 (a real mobile overflow was found and fixed)
- Design-review subagent compared the result against the reference
  screenshots; 8 defects raised, all 8 fixed (mobile breakout, two AA contrast
  failures, facts misalignment, stat wrap, orphaned divider, hidden nav,
  dangling schema rule, orphaned footer links)
- NOT verified: live Cloudflare deploy, and the weather widget against the
  real network (the sandbox cannot reach api.open-meteo.com, so it exercised
  only the graceful-failure path)

## Open threads
- Push and verify the deploy, including that weather renders in production
- Verified Kabugao emergency numbers still needed
- `package.json` licence still ISC while the footer states MIT · CC BY 4.0
- BetterLGU Directory entry still 🔵 Planned with no domain listed
- Old v1 components are in `_to_delete/v1-design/` on the maintainer's machine,
  awaiting his deletion

## Handoff notes
- Read `design-research/RESEARCH.md` before touching layout — the conventions
  there are measured, not opinions
- `npm run brand:build && npm run brand:social` after any brand change
- Project skills are committed in `docs/skills/`
