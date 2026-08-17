# Project Context

**Read `docs/START-HERE.md` first** — it is the entry point for a new developer
or AI assistant: current state, everything already built, the ordered plan, and
the traps. This file is the dated decision log behind it.

Living snapshot of BetterKabugao. Update both at the end of every working
session (see `docs/skills/session-memory/SKILL.md`).

## Current state (2026-08-17)

- **Domain:** betterkabugao.org — Cloudflare Pages, deploys from `main`
  (build `npm run build`, output `dist`)
- **Released to `main`:** v2.0.0 coming-soon page (`9608dd6`).
- **Built, awaiting Robin's checkpoint:** v3.0.0 — the real multi-page portal.
  **31 routes prerendered to static HTML**, each with its own title,
  description, canonical, OG tags and `BreadcrumbList` JSON-LD. Real homepage
  (no longer coming-soon), `/government` hub, `/government/officials`,
  `/government/barangays` with a live filter, and **one page per barangay** at
  `/government/barangays/:slug` (× 21) carrying population, share, rank, PSGC,
  coordinates, schools, nearest three barangays by distance, and Google Maps
  view + driving directions. Plus `/transparency`, `/explore`, `/services`,
  `/about`, `/search`, real 404. See
  `docs/sessions/2026-08-17-multipage-v1.md`.
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
- **Quality:** 28 contract tests + 24 unit tests green; typecheck, lint,
  build clean; no horizontal overflow at 320–1560; one `h1`, one `header`, one
  `main` and zero inline styles (outside the Leaflet canvas) on every page at
  every width.

## Key decisions log

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
- **2026-08-16** Hotlines: only 911 shown, since local Kabugao numbers are
  unverified. Publishing an unverified emergency number is a safety risk.
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

## Next steps

1. **Robin's checkpoint on v3.0.0** — review `design-research/V1-VISUAL-CHECK.md`,
   then push the branch (commands were supplied in chat) and check the preview URL
2. **Blocked on Robin:** his Facebook / Instagram / Threads URLs, needed for the
   BetterLGU Directory PR (🔵 Planned → 🟢 Active, add the domain)
3. HTML `/sitemap` page — 8 of 15 network sites have one
4. `_headers` / `_routes.json` review now that the deploy is multi-page
5. Collect verified Kabugao emergency hotline numbers, then fill the hotline bar
6. Source project records from PhilGEPS / DILG FDP / COA / FOI before building
   any UI for them — and email `lfdad@blgf.gov.ph` about the BLGF licence first
7. Any future intake form needs Turnstile + rate limiting before launch
8. Licence decision: `package.json` still says ISC; the network standard is
   MIT + CC BY 4.0, and the footer already states MIT · CC BY 4.0 — align them
9. Robin to delete `_to_delete/` and `.git/index.lock` by hand (the bridge
   cannot remove files)

## People

- Maintainer / repo owner: KuyaLoy (Safdar)
- Developer and initiator: **Robin Tapiru** — credited in the footer
- Community: BetterGov.ph · directory at lgu.bettergov.ph
