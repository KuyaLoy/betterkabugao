# 2026-08-24 — Checkpoint 2A: Government hub + Elected officials

## Who
Robin (product owner; relays to Codex and pushes from the authorized PC) and
Claude (new account, website builder). Codex approved the understanding, then
the CP2A planning proposal, then this implementation, via relayed blocks.

## What changed
Brought `/government` and `/government/officials` into "Kabugao in View". No
other route touched. Prepared on parent `69a74d1…604005`.

- `src/components/PageHeader.tsx` — added one *additive* interior variant
  `variant="kv"` (solid navy, gold-rule eyebrow, kv type). Same markup; existing
  `hero`/`compact` variants and all other pages unchanged.
- `src/pages/SimplePages.tsx` (GovernmentPage) — three-card `nav-card` grid →
  an editorial wayfinding list (`.kv-guide`): Elected officials (Available),
  All 21 barangays (Available), Transparency (In preparation); each a real
  crawlable `<Link>`; short intro; status pills + arrow.
- `src/pages/OfficialsPage.tsx` — `official-grid` cards → a scannable roster
  (`.kv-roster`): executive tier with a gold rail (one coherent treatment, not
  floating cards) then a two-column Sangguniang Bayan list. Exact names,
  positions, term, eLGU source + retrieval date, COMELEC cross-check, and both
  notices preserved verbatim.
- `src/styles.css` — appended a CP2A block to the KABUGAO IN VIEW layer
  (interior `--kv` header, `.kv-guide`, `.kv-roster`). Tokens only;
  letter-spacing 0 on titles; one `kv-rise` page-entry animation + a hover/focus
  arrow cue, both under `prefers-reduced-motion: no-preference` (off on reduce).
- `tests/site-contracts.test.mjs` — added `SimplePages.tsx` + `OfficialsPage.tsx`
  to the className↔stylesheet cross-check.
- `src/App.test.tsx` — added a Government-hub unit test (three real destination
  links, one h1).
- `scripts/qa/checkpoint1.mjs` — extended: both routes in the layout matrix, a
  hub/officials/reduced-motion section, and screenshots at 1440/768/390/305.
- Docs: START-HERE, CONTEXT, active-task, release-tracker, this recap. Fixed two
  stale docs — `frontend-standards` "capital of Apayao" pinned-fact wording, and
  route-count wording → "33 prerendered pages / 32 sitemap URLs" (CONTEXT + README).

## Decisions made (and why)
- Interior pages get a compact navy `kv` header, **no photo** — the full-bleed
  photo hero stays a homepage device (Codex Q1).
- Hub is an editorial list, not cards; officials is a roster, not cards — the
  approved anti-card direction (Codex Q2/Q3). Executive is one coherent roster
  with a gold rail, never two floating cards (Codex correction).
- One additive PageHeader variant, shared markup, used only by these two routes
  (Codex Q4) — no duplicated page-header markup.
- Legacy `.nav-card`/`.card-grid`/`.official*` CSS is now unused but left in
  place; weather/clock stay unmounted — pruning is the separate approved task
  (Codex rulings #5/#6).

## Verified (clean clone, parent 69a74d1)
- `npm test` → 39 contract + 50 unit pass. `npm run typecheck` clean.
- `npm run lint` clean. `npm run build` → `PRERENDER_OK 33 pages`.
- `npm run qa` → **175/175, exit 0** (was 123; +42 layout matrix for the two
  routes at 7 widths, +10 dedicated CP2A checks). Report:
  `docs/qa/checkpoint-2a/qa-report.json`.
- Looked at the render: both routes at 1440/768/390/305 (screenshots in
  `docs/qa/checkpoint-2a/{government,officials}-{1440,768,390,305}.png`). Zero
  horizontal overflow, one h1/one main, calm/civic, visually of a piece with CP1.
- Live Cloudflare preview verified by Codex at
  https://69d4e1d9.betterkabugao.pages.dev/ (390px Government and Officials: no
  overflow, correct content and links, clean console).

## Open threads
- Pushed at `cf1ee7cc4a29114d5819557f81b762e3bcd1404f`; Codex approved the code
  and visual direction (2026-08-24). A small docs/CSS cleanup pass followed on
  the same branch.
- Everything from the migration handoff's open list still stands (README fuller
  refresh, licence ISC vs MIT·CC BY 4.0, legacy prune, weather/clock decision,
  `<noscript>` styling, hotline confirmation, BLGF licence, PR #208).

## Handoff notes
- Pushed by Robin at `cf1ee7cc4a29114d5819557f81b762e3bcd1404f` (parent
  `69a74d1436509aeb0f97ce22b0c81a7cf1604005`); Cloudflare preview
  https://69d4e1d9.betterkabugao.pages.dev/; Codex approved the code and visual
  direction (2026-08-24). A small docs/CSS cleanup pass followed on the same
  branch (notice reword; README report path → checkpoint-2a; CP2A CSS colour
  tokens + letter-spacing 0 on the new eyebrow/status/roster-post labels).
- QA evidence for Codex is repository-relative: screenshots in
  `docs/qa/checkpoint-2a/`, the machine-readable report at
  `docs/qa/checkpoint-2a/qa-report.json`, and this recap.
- No merge to `main`; no other route started.
