# 2026-08-21 — modern civic homepage experiment (design test only)

## Who

Robin (product owner), Codex (commander / final QA), Claude (design + build).
Branch `experiment/modern-civic-homepage`, cut from `main` @ `745b877` after
PR #2 (search overlay) merged. **Experiment only — never to be merged without
Robin's and Codex's explicit approval.**

## What changed

- `src/pages/HomePage.tsx` — rebuilt around a "front desk" first viewport:
  same h1, tightened lede, full-size search trigger, four destination chips
  (barangays / emergency / officials / about) with factual subs, one-line
  disclaimer. Glance panel restyled as a registry record card with the census
  source in its header. Six-card wall replaced with two ledgers ("Ready now"
  incl. emergency, which the old grid omitted; "Being built" with status
  tags). Map section gains a top-5-by-population panel with real links.
  Executive and mission sections intentionally untouched.
- `src/styles.css` — `.home-desk*`, `.home-index*`, `.home-map`, `.home-bgy*`,
  `.home-hero__lead/__trust`, `.glance__source` + gold registry rule; deleted
  `.home-hero__quick` (markup and rules); responsive collapses at 1024/560.
- `docs/qa/modern-civic-homepage-experiment/` — 4 screenshots + `QA-NOTE.md`
  with measurements, self-scores and rejection risks.

## Decisions made (and why)

- **Rows, not cards.** The six-card grid was the generic layout the brief
  bans; two navy-ruled ledgers reuse the sitemap/service-group grammar.
- **Emergency joined the "Ready now" list and the desk chips** — it is live
  content and was invisible on the old homepage body.
- **Anti-slop on my own copy**: dropped a third ₱0 occurrence, dropped a
  duplicated census tag inside the record card, fixed a dead gap in the map
  panel. All three were caught by reviewing the rendered screenshot, not the
  code.

## Verified

36 contract + 45 unit tests, typecheck, lint, `PRERENDER_OK 33 pages`. Real
Chromium at 320/390/768/1280/1440: no horizontal scroll, one h1/main, search
opens from hero and masthead, red bar visible, all 13 internal links return
200, zero console errors. Screenshots reviewed, three defects fixed before
handoff. **Not verified:** Cloudflare preview (appears only after Robin
pushes) and the open #418 report from Codex's machine (unaffected either way).

## Revision 2 (same day) — Codex QA said REVISION NEEDED

Three blockers, all fixed on the same branch and re-verified:

1. **Mobile collision.** `height: 100%` on the map canvas pushed the OSM
   attribution past its parent onto the population panel header. `.map` is now a
   flex column. Measured +18px clearance at 320/390/768.
2. **Escape did not close the search overlay.** Chrome's `<input type="search">`
   consumes the first Escape to clear itself, so the native dialog cancel never
   fired. My earlier check pressed Escape on an **empty** field and passed —
   the blind spot that let it ship. Reproduced with a typed query, then fixed by
   handling Escape on the dialog explicitly. Verified on four paths: empty,
   partial, full query, and from a focused result.
3. **Sensitive copy.** "Public spending" is out of the hero lede; the ledger row
   is now "More source-linked records". A contract test fails the build if
   budget / procurement / public works / flood control / contractor / public
   spending reappears in `HomePage.tsx`.

Gates after the revision: **37 contract + 45 unit tests**, typecheck, lint,
`PRERENDER_OK 33 pages`. Screenshots regenerated at all four widths.

## Revision 3 (same day) — locked topics in the fallback, and motion

1. **`index.html` was the leak.** The `<noscript>` block is the shell for all 33
   prerendered pages, so "flood control … budget … contractor" was shipping on
   every one of them while the visible homepage copy was already clean.
   Neutralised; the contract test now covers the shell's fallback too. Built
   output swept: `dist/index.html` carries **zero** locked terms. They survive
   only on `/transparency` (by design) and on `/government`'s hub card, which is
   an inner page and was left alone — flagged to Codex, not changed.
2. **Motion added as a system**, three tokens and one easing. Overlay
   fade-and-rise on the native `<dialog>` via `allow-discrete` +
   `@starting-style`; gold edge markers on ledger, overlay-result and barangay
   rows; 1px lift on the front-desk chips; map markers scale on hover and
   fade-scale in once on mount. No section entrance animation — a civic page
   should not withhold content until scrolled.
3. **Reduced motion measured, not assumed.** `transition-delay` is now zeroed
   alongside duration, and Chromium at `prefers-reduced-motion: reduce` reports
   every duration and delay at 0 across all seven animated surfaces including
   the hotline marquee.

Gates: **38 contract + 45 unit tests**, typecheck, lint, `PRERENDER_OK 33
pages`. Overlay animation confirmed mid-flight (opacity 0.66 at 60ms). Escape
with text still closes and restores focus. Two interaction screenshots added.

## Open threads

- Codex verdict on the direction; the QA note lists the likely objections.
- #418 hydration report — still open, unrelated to this branch.
- `<noscript>` styling decision and BetterLGU PR #208 — unchanged.

## Handoff notes

Robin pushes with `git push origin experiment/modern-civic-homepage`; the
Cloudflare preview URL appears only after that push. Nothing here goes to
`main` — this branch exists to be looked at.
