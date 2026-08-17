---
name: frontend-standards
description: BetterKabugao frontend standards — use before writing or reviewing any UI code, styles, components, or visual changes in this repo. Covers the BetterLGU layout grammar, BetterGov design tokens, the anti-generic-AI rules, accessibility gates, CSP-safe patterns, and the screenshot verification loop.
---

# BetterKabugao Frontend Standards

You are building civic infrastructure for a real Filipino municipality. It
must look like it belongs to the BetterGov ecosystem, and it must not look
AI-generated.

## Before you write any UI code

1. Read `docs/START-HERE.md` (state, plan, traps), then `CLAUDE.md` (hard rules)
   and `docs/CONTEXT.md` (decision log).
2. Read `design-research/RESEARCH.md` — 11 BetterLGU sites were rendered and
   measured to derive the conventions below. Do not re-litigate them from
   taste; the screenshots are in that folder.
3. Use only the `@theme` tokens in `src/styles.css`.

## The BetterLGU grammar (measured, not guessed)

| Property | Value | Why |
|---|---|---|
| Typeface | Inter, vendored in `public/fonts` | Every LGU portal uses it |
| Container | `--container: 1440px` | Network range is 1152–1440; the maintainer chose the wide end |
| Prose measure | `--measure: 68ch` | Keeps body text readable inside a 1440 shell |
| Masthead | 76px, white, sticky, border-bottom | Network range is 73–80 |
| H1 | 40–60px, weight 800, **left-aligned** | Not one peer centres its hero |
| H2 | ~36px, weight 700, left-aligned | Same |
| Buttons | radius **6px**, height 48px | Network uses 0–8px. **Never pills** |
| Cards | radius 12px | Network uses 10–16px |
| Hero | solid navy `--color-primary-700` | No gradients, no glows anywhere |
| Page order | hotline bar → utility strip → masthead → hero | Near-universal |
| Footer | dark, 4 columns, cost chips, disclaimer, `Built by` | Network signature |

## The anti-generic checklist

A change fails review if it introduces any of these:

- Centred hero, or a section grid of three identical cards, or a gradient CTA
  band — this is the generic AI layout and no peer site does it
- Pill buttons, glows, glassmorphism, decorative gradients, blobs
- Cartoon or zigzag SVG scenery (the rejected v1 had this)
- Stock photography or AI imagery
- Emoji in UI copy; buzzwords ("empower", "seamless", "revolutionize")
- Lucide-style icon cards used as filler
- **Invented government data.** No budget, contractor, project name,
  percentage, official or statistic may appear unless it is verified and
  cited. Where data isn't ready, say so plainly ("Public project records are
  being prepared") — peers show `--°C` rather than a fake number.

## Facts and sourcing

Verified Kabugao facts live in `src/app/site-content.ts` and are pinned by
contract tests: 18.0246° N, 121.1845° E · 132 m · 935.12 km² · 21 barangays ·
**16,425 residents (2024 POPCEN)** · 1st-class income · PSGC 1408104000 ·
capital of Apayao. Per-barangay figures live in `src/data/barangays.ts` and sum
to exactly 16,425. Any new figure needs a named official source, with its date,
displayed next to it.

(16,215 was the 2020 census count and appears in older session logs. It is
correct *for 2020* and must not be used as the current population.)

Only two peso figures are permitted anywhere: `₱0` (cost to the people) and
`₱670` (the developer's own domain cost). A contract test enforces this.

## Accessibility gates (WCAG AA — non-negotiable)

- Exactly one `h1`; landmarks banner/main/contentinfo; skip link first
- Body text ≥ 4.5:1. On white/`gray-50`, the lightest usable grey is
  `--color-gray-700` `#495057` (8.18:1). **`gray-500` (2.07:1) and
  `gray-600` (3.32:1) fail — never use them for text.**
- `prefers-reduced-motion`: zero `animation-duration` AND `animation-delay`
- Decorative SVG: `aria-hidden="true" focusable="false"`
- `target="_blank"` ⇒ `rel="noreferrer"`

## CSP-safe patterns

`style-src 'self'; script-src 'self'` — no inline `style` attributes, no
inline `<script>`/`<style>`. Dynamic values go through
`element.style.setProperty` (CSSOM). The only permitted third-party request
is `https://api.open-meteo.com` for live Kabugao weather, already in
`connect-src`. Adding another host needs maintainer approval.

## Layout traps found the hard way

- Grid children can stretch their track: use `grid-template-columns:
  minmax(0, 1fr)` in responsive collapses, never bare `1fr`
- Long unbreakable tokens (`BetterKabugao.org`) need a low `clamp()` floor
  plus `overflow-wrap: anywhere`, or they cause horizontal scroll on phones
- `display: flex; gap` on a strip splits text nodes — wrap sibling text in a
  single child or the gap lands mid-sentence ("Sunday , August")
- First cell of a bordered row set needs `padding-left: 0` to align with the
  section heading above it

## Verification loop (required before "done")

1. `npm test && npm run typecheck && npm run lint && npm run build`
2. Serve `dist` and screenshot **1440 / 1280 / 768 / 390** (Playwright;
   zero console errors tolerated)
3. Check `document.scrollWidth === clientWidth` at 320/360/390/414 — no
   horizontal scroll at any phone width
4. LOOK at the screenshots and compare them against
   `design-research/*-desktop-fold.png`. Ask "does this hold up next to the
   references?", not "does the code run?"
5. If a convention changed on purpose, update the matching contract test in
   `tests/` in the same commit
