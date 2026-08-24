# 2026-08-24 — Footer cleanup: consolidate the repeated disclaimer

## Who
Robin (product owner; relays to Codex and pushes from the authorized PC) and
Claude (website builder). This shipped as a small standalone correction that
Robin requested after Checkpoint 2B's source gate failed — only the footer
cleanup was carved out; the 2B officials work stayed blocked.

## What changed
The global footer stated the independence disclaimer twice — once in the brand
column (`.footer__about`) and again in the bottom row (`.footer__disclaimer`).
Consolidated it to appear once. No layout change, no new CSS classes, no other
route touched.

- `src/components/SiteFooter.tsx` — `.footer__about` now renders
  `{siteContent.disclaimer}` (was a hardcoded paragraph); the bottom
  `.footer__disclaimer` now renders only `{siteContent.sourceNote}` (was
  `{siteContent.disclaimer} {siteContent.sourceNote}`). Doc comment updated.
- `src/app/site-content.ts` — `disclaimer` reworded to one consolidated
  sentence (Codex's approved copy edit): "BetterKabugao is an independent,
  volunteer-run civic project for Kabugao, Apayao, and part of the BetterGov.ph
  volunteer network. It is neither affiliated with nor endorsed by the
  Municipality of Kabugao, and it is not the municipality's official website."
  `sourceNote` → "Published public information is sourced from official
  government portals."
- `tests/site-contracts.test.mjs` — the pinned disclaimer assertion in "site
  content states only verified, sourced facts" updated to the new wording
  (still asserts the not-official disclaimer is present; never deleted).
- Docs: START-HERE, CONTEXT (state + dated log), active-task, release-tracker,
  this recap.

## Decisions made (and why)
- **Wire both footer strings from `site-content.ts`.** Anti-slop §3 requires the
  independence disclaimer in the footer of every page AND forbids dead content
  fields. `siteContent.disclaimer` is used only by the footer, so rendering it
  (rather than hardcoding new copy) keeps one source of truth and leaves no dead
  field. `.footer__about` therefore now reads from `disclaimer`.
- **Update the pinned contract, don't work around it.** Changing the disclaimer
  wording is a deliberate copy change, so per CLAUDE.md the matching assertion
  was updated in the same change. `index.html`'s `<noscript>` "not the official
  website" line (a separate contract) was left untouched — out of scope.
- **No "Barangay officials" footer link, no names.** No verified roster page
  exists, so nothing was linked; Checkpoint 2B stays blocked pending an official
  DILG roster (START-HERE §5). Author, licence, version, Find/Network links kept.

## Verified (clean clone, current origin tip `657fbb2`)
- `npm test` → 39 contract + 50 unit pass. `npm run typecheck` clean.
- `npm run lint` clean. `npm run build` → `PRERENDER_OK 33 pages`.
- `npm run qa` → **175/175, exit 0**.
- Anti-slop dedup audit over the built pages: the footer disclaimer duplication
  is gone; the remaining flagged lines are pre-existing/justified (§3 table:
  "Sangguniang Bayan Member" ×8, "Awaiting verified data" ×6, nav-label/heading
  coincidences).
- Looked at the render: built homepage footer at 1440 / 390 / 305. Disclaimer
  renders once, source line + "Built by Robin Tapiru · MIT · Content CC BY 4.0 ·
  v3.0.0" intact, `scrollWidth === clientWidth` at all three widths. Console
  errors were only `net::ERR_CONNECTION_RESET` (weather/tile hosts unreachable
  in the sandbox) — zero JS/page errors.

## Open threads
- **Codex approved the footer cleanup on 2026-08-24 with one copy edit** (the
  firmer disclaimer wording above), which is applied. Committed on the
  experimental branch. **Push pending** — the build session has no push
  credentials (403), so the origin SHA and Cloudflare preview come from Robin's
  push from the authorized PC.
- **Checkpoint 2B (barangay officials) BLOCKED** — the source gate failed (no
  citable government roster retrievable: DILG/DILG-CAR unreachable, only
  stale/unofficial lists). No dataset, page or names were added. Resumes only
  when Robin + Codex supply an official DILG roster.
- Minor: the footer now says "not affiliated with, endorsed by, or the official
  website…" while `index.html`'s `<noscript>` still says "not the official
  website…". Both disclaim official status; the noscript is JS-off only and
  contract-pinned, so any alignment is a separate, deliberate task.

## Handoff notes
- Prepared and committed on parent `657fbb2` (fetch-verified origin tip of
  `experiment/full-site-visual-rebuild-v2`). Push is Robin's from the authorized
  PC (the build session cannot push); the origin SHA + Cloudflare preview follow
  from that push. `main` remains untouched.
- Changed files: `src/components/SiteFooter.tsx`, `src/app/site-content.ts`,
  `tests/site-contracts.test.mjs`, and the five docs above (this recap included).
