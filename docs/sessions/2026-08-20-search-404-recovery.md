# 2026-08-20 — /search and /404 as recovery screens

## Who

Robin (product owner), Codex (commander / final QA), Claude (build).
Branch `improvement/search-404-recovery`, off `main` @ `21f622b`. **Not merged.**

## What changed

- `src/components/SearchPanel.tsx` — new. Owns `/search`: a labelled form, live
  results grouped by kind with counts, six suggested queries before anything is
  typed, and an empty state carrying the recovery links.
- `src/pages/SimplePages.tsx` — `SearchPage` renders the panel; `NotFoundPage`
  rebuilt around a real search form plus the six recovery links.
- `src/lib/search.ts` — `SEARCH_KINDS` / `SEARCH_KIND_LABELS`, a **`Hotline`**
  kind (hotlines were filed as `Page`), `QUICK_SEARCHES`, and `searchSite()`.
- `src/lib/seo.ts` — `RECOVERY_LINKS`, the one list both screens read.
- `src/lib/routes.ts` — re-exports it so the contract test can reach it through
  the SSR bundle.
- `src/components/SiteSearch.tsx` — now calls `searchSite()` instead of its own
  copy of the scoring; dropped the `inline` and `limit` props, which nothing
  used once the page stopped rendering it; fixed a duplicate React key (officials
  and hotlines share a path, so `key={entry.path}` collided).
- `src/styles.css` — `.finder*` and `.recover*` blocks, collapses at 860 and 560,
  and the dead `.search--inline .search__results` override removed.
- `tests/site-contracts.test.mjs` — one new test, the CSP `form-action`
  assertion, `SearchPanel.tsx` added to the className↔stylesheet cross-check.
- `src/App.test.tsx` — 4 tests updated for the new copy and markup, 6 added.

## Decisions made (and why)

- **A separate `SearchPanel`, not a `variant` prop on `SiteSearch`.** The
  masthead dropdown and the search page have different jobs — an overlay versus
  a page that owns a URL. They share `searchSite()`, so there is one search
  implementation rendered two ways, which is the part that matters.
- **`Hotline` is its own result kind.** Filing hotlines under `Page` meant a
  search for "police" ranked the page that lists numbers next to the number
  itself, with no way to tell them apart.
- **`RECOVERY_LINKS` is exported from `seo.ts`, not the component.** Both screens
  read it, so they cannot drift; and a component file exporting a constant trips
  `react-refresh/only-export-components`.
- **`?q=` is read only after hydration.** Every route is prerendered without a
  query string, so reading it on the first client render would guarantee a
  hydration mismatch. Gated behind `useHydrated()` (`useSyncExternalStore`,
  server snapshot `false`) — the same trick the clock uses.
- **Suggested queries are real `/search?q=…` links**, not buttons: crawlable,
  shareable, and they work from a cold page. A unit test asserts each one
  actually returns a result, because a suggestion that leads nowhere is worse
  than no suggestion.
- **Both forms intercept submit.** See the open CSP item below.
- **`.finder` is capped at 760px and `.recover` at 940px.** A results list run
  across 1440px puts the summary a screen away from the title it belongs to.

## Verified

- `npm test` — **34 contract + 37 unit, all pass**. `npm run typecheck`,
  `npm run lint` clean. `npm run build` → `SEO_OK … 32 sitemap URLs`,
  `PRERENDER_OK 33 pages`.
- Measured in a browser against the built `dist`, not asserted from source:
  - `/search?q=poblacion` → field preloaded `"poblacion"`, group **Barangays (1)**,
    first result `/government/barangays/poblacion`.
  - `/search?q=mdrrmo` → **Emergency hotlines (1)** and **Pages (1)**, so the new
    kind separates the number from the page listing it.
  - `/search?q=zzzzz` → “Nothing matches “zzzzz”” plus all five recovery links.
  - `/search` with no query → six suggested query URLs, five browse links.
  - `/404` → form `action="/search"`, `method="get"`, `input[name=q]`, five links.
  - One `h1` and one `main` on both pages at every width tested.
  - `scrollWidth === clientWidth` at **320 / 360 / 390 / 414** on both pages.
- Screenshots at **1440 and 390** for both pages, plus the results and empty
  states — looked at, and they are how both defects below were found.
- Anti-slop audit on both built pages: the only repeated lines are the hotline
  marquee's `aria-hidden` second track. No unused `.finder*`, `.recover*` or
  `.search*` class.
- **Not verified:** a Cloudflare preview. The sandbox has no egress, so the
  `ERR_CONNECTION_RESET` console entries during capture are the Open-Meteo
  weather fetch failing locally, not a site defect.

## Open threads

- **CSP `form-action 'none'` — needs a ruling.** It blocks a real form
  submission, so both forms navigate in JavaScript instead and the boxes do
  nothing with scripting off. Every recovery route on those pages is a plain
  anchor for that reason, so nobody is stranded. `form-action 'self'` would fix
  it and still block cross-origin submission. One word in `public/_headers`, one
  line in `tests/site-contracts.test.mjs`, and the documented policy in
  `docs/skills/security-review/SKILL.md`.
- The 404 breadcrumb links Home and so does the recovery list — the same link
  twice on one page. The six links were specified explicitly, so it stands.
- Not built, by instruction: command-palette search, homepage changes.
- Unchanged: the no-JavaScript fallback styling question, BetterLGU PR #208.

## Handoff notes

- `git checkout improvement/search-404-recovery`, then `npm ci && npm test &&
  npm run build`, and serve `dist` with a server that honours directory
  `index.html`. `vite preview` rewrites nested routes to the SPA shell.
- QA `useHydrated()` in `SearchPanel.tsx` first: if it is wrong, `/search?q=`
  either stops preloading or starts logging hydration errors, and neither shows
  up in the test suite.
