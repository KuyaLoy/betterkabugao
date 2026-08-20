# 2026-08-20 — site-wide search overlay + the CSP form-action fix

## Who

Robin (product owner), Codex (commander / final QA), Claude (build).
Additive revision on top of `4acb8be`, on the same branch
`improvement/search-404-recovery`. Not merged.

## What changed

- `src/components/SearchOverlay.tsx` — new. `SearchTrigger` and `SearchOverlay`,
  on a native `<dialog>`. Live results, arrow-key focus, Enter to
  `/search?q=`, click to navigate and close.
- `src/lib/search-overlay.ts` — new. The open state, the `/` guard and the
  focus-target fallback, in a component-free module.
- `src/components/SiteHeader.tsx` — the masthead Search stops being a
  `<Link to="/search">` that navigates away. Still an anchor to `/search`.
- `src/pages/HomePage.tsx` — the hero field became a trigger. Same box, same
  place, same styles.
- `src/components/SiteSearch.tsx` — **deleted.** Replaced by the overlay.
- `src/App.tsx` — one `<SearchOverlay />`, mounted once.
- `public/_headers` — `form-action 'none'` → `'self'`.
- `src/styles.css` — `.palette*` block, `.search__trigger` / `__placeholder` /
  `__key`; deleted `.search__results`.
- `src/pages/BarangaysPage.tsx` — dropped `.search--inline` (see below).
- `tests/site-contracts.test.mjs`, `src/App.test.tsx` — 2 new contract tests,
  9 new unit tests, the pinned CSP assertion rewritten.
- `docs/skills/security-review/SKILL.md`, `CLAUDE.md`, `docs/START-HERE.md`,
  `docs/CONTEXT.md`.

## Decisions made (and why)

- **Native `<dialog>`, not a hand-rolled palette.** The browser owns the focus
  trap, Escape, the backdrop and the top layer. `HotlineDialog` already made this
  choice for the same reason.
- **`/` is the preferred shortcut**, Ctrl/Cmd+K the second binding. Both are
  named in the overlay's own hint line at Robin's request, because Ctrl+K is what
  Windows users reach for. They are named in one static string rather than
  branching on platform: a label that differs between the server render and the
  client render is a hydration mismatch, and "Ctrl K" is accurate everywhere
  since the handler accepts `ctrlKey || metaKey`. The hero field still shows only
  `/` — one hint per surface.
- **Escape returns focus to the Search button explicitly.** `<dialog>` restores
  focus to whatever was focused before `showModal()` — which is `body` when the
  overlay is opened by `/`. Without the fallback the requirement silently fails.
- **The dropdown was deleted, not kept.** Two live search surfaces is two
  behaviours. Codex approved the homepage exception; the hero box is unmoved and
  unchanged, and is now a real link to `/search`.
- **State outside React**, in a component-free module: any trigger and the
  document key handler reach one overlay without a context provider, and a mixed
  export would break fast refresh.
- **`form-action 'self'`** with written approval. Recorded in the security skill,
  with a new assertion that no host or wildcard may appear in the directive.

## Verified

- `npm test` — **36 contract + 45 unit, 0 fail**. `npm run typecheck`,
  `npm run lint` clean. `npm run build` → `PRERENDER_OK 33 pages`,
  `SEO_OK 32 sitemap URLs`.
- Real browser against built `dist`, at **320 / 390 / 768 / 1280 / 1440**:
  header trigger opens the overlay on `/`, `/emergency`, `/government/officials`
  and `/sitemap`, focusing the input each time; `/` opens it and Escape closes it
  with focus landing on `#site-search-trigger`; Ctrl+K opens it; typing `pob/`
  into the barangay filter leaves the overlay shut and the slash in the field;
  `poblacion` returns `/government/barangays/poblacion` and clicking it navigates
  and closes; Enter on `mdrrmo` lands on `/search?q=mdrrmo` with the overlay
  closed; ArrowDown walks the results and ArrowUp returns to the input.
- `scrollWidth === clientWidth` at every width, overlay open and closed. One `h1`
  and one `main` on every page with the overlay mounted.
- **No hydration mismatch:** four routes loaded with every console message
  captured unfiltered — **zero messages**, hydration-related or otherwise.
- **JavaScript disabled:** header and hero triggers both still `href="/search"`,
  dialog closed.
- Screenshots at 1440 and 390, open and closed, and looked at.

## Open threads

- **Not verified on a Cloudflare preview.** The sandbox has no egress. The one
  thing worth checking there is the CSP change actually shipping in the response
  headers, since only the deploy proves that.
- The `<noscript>` fallback styling question, still undecided.
- BetterLGU PR #208, still awaiting `jmacj`.

## Handoff notes

- Two pre-existing defects surfaced by adding `BarangaysPage.tsx` to the
  className↔stylesheet cross-check: `.search--inline` had **never** had a rule,
  and `.search__empty` was briefly deleted as dead while that page still rendered
  it. Add a component to that list whenever you touch it.
- `closeSearchOverlay()` must be called in `afterEach`, and inside any test loop
  that re-renders: the store is module-scope and survives unmount.
- A `/`-shortcut check has to wait for hydration, and `waitUntil: "networkidle"`
  never resolves in the sandbox — use `domcontentloaded` plus a short wait.
