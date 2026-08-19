# 2026-08-19 — noscript fallback fix + BetterLGU Directory PR #208

## Who

Robin, with Claude (Cowork). Continuation of the 2026-08-18 hotline session.

## What changed

- `index.html` — the `<noscript>` block. Removed the false "Coming soon — a
  volunteer-run civic portal for Kabugao" line, which had been serving on all 32
  live pages since v2. Replaced with what JavaScript actually adds: the
  interactive map, the live weather reading, the search and filter boxes.
  "Kabugao is the capital of Apayao" folded into the facts line so the fact
  survives.
- `index.html` — that block is now `<aside aria-label="…">` + `<h2>` instead of
  `<main>` + `<h1>`.
- `src/app/site-content.ts` — deleted `status: "Coming soon"`. Nothing imported
  it; `App.test.tsx` already asserted "Coming soon" must not render.
- `tests/site-contracts.test.mjs` — three new assertions (no new test cases):
  no "coming soon" in the shell, none in any prerendered page, and no
  `<main>`/`<h1>` inside `<noscript>`.
- `docs/START-HERE.md`, `docs/CONTEXT.md` — state tables were still describing
  the pre-merge world (live = coming-soon page, branch awaiting review). New
  trap recorded in §8.
- **Not in this repo:** BetterLGU Directory
  [PR #208](https://github.com/jmacj/better-lgu-directory/pull/208) — body filled
  from their template, four checklist boxes ticked, verification comment posted.
  Done through Robin's browser; nothing to commit here.

## Decisions made (and why)

- **Fix the landmarks, not just the copy.** Measured, not assumed: with
  JavaScript disabled every page had two `main` landmarks and two `h1`s, because
  the prerendered page and the fallback are both parsed. `frontend-standards`
  calls one `h1`/one `main` non-negotiable, so this was a live WCAG defect.
- **Keep the four pinned facts in the fallback.** The contract tests pin
  21 barangays / 16,425 / Robin Tapiru / "not the official website" because the
  shell must carry the project's identity even if a render fails. Left intact.
- **Delete rather than leave unused.** `siteContent.status` was dead *and* false.

## Verified

- 32 contract tests + 27 unit tests green; typecheck, lint clean; build =
  `PRERENDER_OK 32 pages`.
- `grep -ril "coming soon" dist/` → **0 files**.
- Playwright, `javaScriptEnabled` both `false` and `true`, on `/`,
  `/government/barangays/lucab/`, `/emergency/`, `/search/`: exactly one `h1`,
  one `main`, one `header`, one `footer` in every combination; new line present
  with JS off; no horizontal scroll at 1440 or 390.
- Looked at the render, JS off, 1440 and 390 — the finding below came from the
  screenshot, not the code.
- **Not verified:** the eight hotline numbers have still never been test-dialled.

## Open threads

- **Design call for Robin.** With JavaScript off, the fallback renders unstyled
  below the footer and restates the footer's cost chips, disclaimer and `Built
  by` credit. Either trim it to the JavaScript explanation alone or give it
  styles. The facts inside are contract-pinned, so changing them is deliberate.
- PR #208 awaits `jmacj`. The bot's Facebook/Instagram 200s are redirects to
  login pages — normal for a logged-out crawler, and why only a signed-in human
  can clear `needs-verification`.
- Unchanged from 2026-08-18: HTML `/sitemap` page, `public/_routes.json`,
  the ISC-vs-MIT licence mismatch, hotline confirmation from the LGU.

## Handoff notes

- Branch `fix/noscript-copy`. Verify with
  `npm run build && npx playwright` at `javaScriptEnabled: false` — reading the
  source will not show you the duplicate-landmark class of bug.
- `index.html` is the shell for **all 32** prerendered pages. Anything written in
  it, `<noscript>` included, ships on every page.
