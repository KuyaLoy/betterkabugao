# 2026-08-16 — Coming-soon redesign, brand system, team standards

## Who
Robin (driving, overnight) with Claude (Cowork) as lead builder, plus a
UI/UX design-review agent and a QA-review agent before ship.

## What changed
- **Design**: full rebuild of the launch page — "dawn over the Cordillera"
  night scene (hand-drawn layered SVG: stars, glowing horizon, back ridges,
  aspect-locked sun, front ridge with rim-light and Apayao River glint),
  centered hero, glass stat band with sourced facts, restyled pillars
  section on mist, new mission/community strip, full footer
- **Tokens**: official BetterGov design system adopted (Figtree + navy/gold
  scales) replacing Aptos + #0032A0; Figtree vendored in `public/fonts` (OFL)
- **Brand**: new identity — Apayao province silhouette with Kabugao
  highlighted in gold + sunrise rays. `src/brand/geometry.json` is the
  single source; `scripts/build-brand.mjs` generates mark/lockups/favicon;
  social card renderer rebuilt to match the scene
- **Content**: real facts added (capital of Apayao · 21 barangays · 16,215
  residents 2020 PSA census · 935.12 km² · ₱0), BetterLGU Directory +
  BetterGov.ph links, mission copy; disclaimer kept everywhere
- **Security**: `_headers` extended with HSTS + strict CSP; CSP-safe
  markup verified (no inline styles/scripts)
- **Hygiene**: `.gitattributes` (LF normalization), removed unused
  @fontsource packages, package.json cleanup, `vite.config` passWithNoTests
  removed
- **Team docs**: `CLAUDE.md`, `docs/CONTEXT.md`, three repo skills
  (frontend-standards, security-review, session-memory)

## Decisions made (and why)
- Stack unchanged (React+TS+Vite+Tailwind4): BetterGov community standard;
  MERN/Next rejected — static site needs no server
- Text-behind-peak overlay from the reference was tested and rejected for
  headline legibility; depth is carried by CTAs/stat band grounded in the
  range and the sun occluded by the front ridge
- Gold #FFB900 chosen over orange #F58900 for the Kabugao highlight (flag
  gold, better on navy); accent-700 #935200 for small orange text on light
  (AA contrast)
- License left ISC — flagged for maintainer decision (templates use MIT)

## Verified
- `npm test` 18 contract + 9 unit tests green; typecheck, lint, build green
- Playwright screenshots at 1440×900 / 768×1024 / 390×844 against the
  production build served WITH the real security headers — zero console
  errors; design-review and QA-review findings applied (tablet dead zone,
  wrapping header CTA, stat alignment, contrast fixes, duplicate SVG ids,
  sun distortion, reduced-motion delay)
- NOT verified: live Cloudflare deploy (needs push), real-device rendering

## Open threads
- Push to `main` + verify pages.dev and betterkabugao.org after deploy
- Social media showcase post (assets prepared in session)
- License decision (ISC vs MIT) for the maintainer
- BetterLGU Directory status update when the maintainer considers it live

## Handoff notes
- Working tree on the maintainer's machine mirrors this commit's content;
  `git add -A && git commit && git push` publishes it (`.gitattributes`
  auto-normalizes the pre-existing CRLF churn at add time)
- Regenerate brand after any geometry edit: `npm run brand:build && npm run brand:social`
