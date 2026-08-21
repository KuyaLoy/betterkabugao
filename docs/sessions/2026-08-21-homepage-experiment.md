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

## Open threads

- Codex verdict on the direction; the QA note lists the likely objections.
- #418 hydration report — still open, unrelated to this branch.
- `<noscript>` styling decision and BetterLGU PR #208 — unchanged.

## Handoff notes

Robin pushes with `git push origin experiment/modern-civic-homepage`; the
Cloudflare preview URL appears only after that push. Nothing here goes to
`main` — this branch exists to be looked at.
