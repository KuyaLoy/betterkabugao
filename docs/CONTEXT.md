# Project Context — read me first

Living snapshot of BetterKabugao. Update at the end of every working session
(see `docs/skills/session-memory/SKILL.md`).

## Current state (2026-08-16)

- **Domain:** betterkabugao.org — Cloudflare Pages, deploys from `main`
  (build `npm run build`, output `dist`)
- **Release:** v2.0.0 coming-soon page, rebuilt from scratch on measured
  research into the BetterLGU network. Sections: hotline bar → live utility
  strip → masthead → split hero with build-status card → what this will be →
  transparency (project-record schema preview) → explore Kabugao → services →
  mission with cost panel → four-column footer.
- **Design source of truth:** `design-research/RESEARCH.md` plus 33
  screenshots of 11 live BetterLGU sites (fold, full page, mobile) and
  `_measurements.json` of their computed tokens.
- **Brand:** the maintainer's ORIGINAL mark (Kabugao silhouette + three-ray
  sunrise), recoloured to BetterGov navy/gold. Geometry is pinned by contract
  test — it must never be redrawn. `npm run brand:build` regenerates assets.
- **Live data:** Kabugao weather via Open-Meteo (no key, no tracking) plus a
  PHT clock. If the request fails the reading is omitted rather than faked.
- **Quality:** 22 contract tests + 10 unit tests green; typecheck, lint,
  build clean; no horizontal overflow at 320–1440; zero console errors.

## Key decisions log

- **2026-08-16** v1 launch page (centred hero, three cards, zigzag SVG
  mountains, glows, pill buttons) was rejected by the maintainer as generic.
  Root cause: it was designed from taste rather than from the ecosystem.
  Superseded entirely — old components moved out of the tree.
- **2026-08-16** Research method: the `.org` domains are unreachable from the
  build sandbox, so each Better LGU repo was cloned from GitHub, built, served
  locally and rendered in Chromium. This also yielded exact computed tokens.
- **2026-08-16** Adopted the network grammar: Inter (not Figtree — that is
  bettergov.ph's own font, the LGU portals all use Inter), 1200px container,
  76px masthead, left-aligned headings, 6px buttons, red hotline bar, navy
  utility strip, four-column footer with cost chips.
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
- **2026-08-16** Hotlines: only 911 shown, since local Kabugao numbers are
  unverified. Publishing an unverified emergency number is a safety risk.
- **2026-08-16** External skills (superpowers, taste-skill, OpenViking)
  documented in `docs/skills/README.md` rather than vendored — together they
  are ~160 MB / 4,000+ files that never ship to a visitor.

## Next steps (not started)

1. Push v2.0.0 and verify the Cloudflare deploy + live weather in production
2. Collect verified Kabugao emergency hotline numbers, then fill the hotline bar
3. Update the BetterLGU Directory entry (currently 🔵 Planned, no domain)
4. Social launch post
5. Begin the real portal: source project records from PhilGEPS / DILG FDP /
   COA / FOI before building any UI for them
6. Any future intake form needs Turnstile + rate limiting before launch
7. Licence decision: `package.json` still says ISC; the network standard is
   MIT + CC BY 4.0, and the footer already states MIT · CC BY 4.0 — align them

## People

- Maintainer / repo owner: KuyaLoy (Safdar)
- Developer and initiator: **Robin Tapiru** — credited in the footer
- Community: BetterGov.ph · directory at lgu.bettergov.ph
