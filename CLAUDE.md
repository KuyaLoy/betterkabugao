# BetterKabugao — Project Conventions

Read this before changing anything. These are hard rules, not suggestions.
AI assistants (Claude Code, Codex, Copilot) must follow them literally.

> **First read `docs/START-HERE.md`** — it carries the current state, the
> feature plan, what is already built, and the traps that have already cost
> this project time. This file is the rulebook; that one is the map.

## What this project is

An independent, community-maintained civic transparency portal for the
municipality of Kabugao, Apayao (21 barangays, **16,425 residents per the
2024 POPCEN**, 935.12 km², 1st-class income, PSGC 1408104000). Note: published
site copy must never make an **unqualified "capital of Apayao"** claim — a
contract test bans that wording (and public-works/procurement vocabulary) on
every built route. Part of the BetterGov.ph volunteer network — registered in
the BetterLGU Directory (https://lgu.bettergov.ph/). Built at ₱0 cost to the
people. It is NOT the official website of the Municipality of Kabugao, and
every page must keep that disclaimer.

Releases: the **multi-page portal is live on `main`** — 33 prerendered routes,
a page per barangay, officials, search (site-wide overlay + `/search`), maps
and emergency hotlines. The approved **"Kabugao in View"** visual rebuild is on
`experiment/full-site-visual-rebuild-v2` (Checkpoint 1 approved by Codex; not
merged) — see `docs/command-center/` for status, and
`docs/sessions/2026-08-23-claude-account-migration-handoff.md` for the full
handoff. Transparency data, service guides and FIL/Isneg language support come
later — see `docs/research/data-tracker.html` for the ordered roadmap.

`index.html` is the shell for **every** prerendered route, `<noscript>` included.
A line written there is served on all 33 pages, and the `<noscript>` block is
*additive* — with JavaScript off a visitor sees the full prerendered page **and**
that block, so it must not contain a `<main>` or an `<h1>` (or any peso figure —
contract-tested).

## Stack — do not swap or add without maintainer approval

- React 19 + TypeScript (strict) + Vite 8, Node 22.14.0 (pinned in `.node-version`)
- Tailwind CSS v4 via `@tailwindcss/vite`; design lives in plain CSS classes
  in `src/styles.css` on top of `@theme` tokens
- `react-router-dom` v7 for routes; **every route is prerendered to static HTML**
  by `scripts/prerender.mjs`. Import `StaticRouter` from the package root —
  `react-router-dom/server` does not exist in v7.
- Leaflet 1.9.4 for maps, dynamically imported so it is code-split
- Deploy: Cloudflare Pages — branch `main`, build `npm run build`, output `dist`
- No backend, no database, no analytics, no CSS-in-JS, no jQuery, no UI kit
- Exactly two third-party runtime hosts (see Security rules)
- New dependencies require an explicit maintainer OK in the PR description

### Never simplify the build

`npm run build` is `seo:build → tsc -b → build:client → build:ssr → prerender`.
Reducing it to `vite build` silently ships a client-only SPA, which is the exact
defect this site exists to avoid: 10 of the 16 portals in the network serve one
HTML shell for every URL, so every link shared on Facebook previews as their
homepage. A contract test pins the script string.

## Design system — BetterGov tokens, BetterLGU layout

Tokens in `src/styles.css` `@theme` follow the official BetterGov.ph design
system (bettergovph/bettergov). Layout conventions were measured from 11 live
BetterLGU portals — see `design-research/RESEARCH.md`. Use them; never invent
hex values inline, and never re-derive the layout from taste.

- Navy ladder: `#000B1D` (night) · `#00142F` (900) · `#00295E` (800) · `#003D8D` (700)
- Blue: `#0066EB` (500) · `#66A3F3` (300) · `#CCE0FB` (100) · mist `#F1F6FE`
- Gold: `#FFB900` (sun/CTA) · accent `#F58900` · dark accents `#C46E00`/`#935200`
  (use `--color-accent-700: #935200` for small orange text on light backgrounds — AA)
- Grays: `#F8F9FA` → `#212529`
- Type: **Inter** only, vendored in `public/fonts` (OFL licence) — the
  typeface every BetterLGU portal uses. Never load fonts from a CDN.
- Layout: **1440px container** (`--container`, measured range across the network
  is 1152–1440) · 68ch measure for prose · 76px masthead · left-aligned
  headings · 6px buttons (never pills) · 10–12px cards · solid navy hero
  (no gradients)
- Grids get explicit column counts, not `auto-fill`: six cards must read 3 + 3,
  not 4 + 2 with a hole in it

Brand identity: the project's ORIGINAL mark — the Kabugao silhouette beneath
a three-ray sunrise — recoloured to BetterGov navy and gold. The geometry in
`src/brand/geometry.json` is pinned by contract test and **must never be
redrawn**; only colour, spacing and lockup may change. Run `npm run
brand:build` (SVGs) and `npm run brand:social` (share card) after any change.
Never hand-edit files in `public/brand/`.

## Frontend standards (the "not AI-generic" rules)

- Pixel restraint: no stock photos, no neon glows, no purple gradients, no
  emoji in UI copy, no marketing buzzwords ("empower", "seamless", "unlock")
- Real data only: every published figure needs an official source (PSA, COA,
  DBM, PhilGEPS, LGU records) cited next to it. No fake or placeholder
  metrics, ever. Never publish a budget, contractor, project name, percentage
  or official's name that has not been verified — say "being prepared"
  instead. Only two peso figures are permitted on the site: ₱0 (cost to the
  people) and ₱670 (the developer's own domain cost); a contract test enforces
  this.
- **Emergency numbers**: publish only numbers the municipality itself has
  published, and always show the source and its date beside them (currently the
  LGU's Discover Kabugao Facebook post of 15 April 2026). Keep **911** as the
  first and always-valid option, and say plainly that mobile numbers can change
  and that 911 should be used if one does not connect. Numbers live in exactly
  one file, `src/data/hotlines.ts`, never inline in a component — a contract
  test enforces this, along with the 11-digit format and the `tel:+63` form.
  Never invent, guess or carry over an emergency number without a fresh source.
- Semantic HTML first: one `h1` per page, proper landmarks
  (header/main/footer), skip link to `#main-content`
- Accessibility is a gate, not a nice-to-have: WCAG AA contrast, visible
  `:focus-visible`, `prefers-reduced-motion` support (zero both duration AND
  delay), decorative SVGs `aria-hidden="true" focusable="false"`.
  On light surfaces the lightest usable text colour is `--color-gray-700`;
  `gray-500` and `gray-600` fail AA and must not be used for text.
- No inline `style` attributes anywhere — the CSP (`style-src 'self'`) blocks
  them. Dynamic values go through `element.style.setProperty` (CSSOM), never
  through a `style={{...}}` prop.
- External links: `target="_blank"` always pairs with `rel="noreferrer"`
- Mobile-first: verify 390px, 768px, 1280px and 1440px before calling UI work
  done, and confirm `scrollWidth === clientWidth` at 305/320/360/390/414 — no
  horizontal scroll on any phone. **305px matters**: a 320px Windows window
  minus a classic (~15px) scrollbar leaves a 305px content area, which headless
  overlay-scrollbar QA never reproduces. No element may pin `min-width: 320px`
  (contract-tested). The committed harness (`npm run qa`) covers
  305/320/360/390/768/1280/1440.

## Security rules

- `public/_headers` ships HSTS, nosniff, X-Frame-Options DENY, strict CSP
  (`default-src 'self'`, no inline script/style), Referrer-Policy, and
  Permissions-Policy. Loosening any directive needs maintainer approval and a
  written reason in the PR.
- **Exactly TWO third-party runtime hosts are permitted**, and a contract test
  asserts the list:
  - `api.open-meteo.com` — live Kabugao weather (`connect-src`); no key, no
    cookies, no tracking
  - `tile.openstreetmap.org` — map tiles (`img-src`); ODbL, attribution shown

  Everything else — fonts, scripts, styles, other images — is self-hosted.
  A third host needs maintainer approval, a written reason, and matching
  updates to `public/_headers` **and** its contract test.
- **`frame-src` is deliberately absent**, so it falls back to `default-src
  'self'` and no iframe embed can load. A Google Maps embed was considered and
  rejected for this reason (plus the tracker it puts on every page). Do not add
  `frame-src` without approval.
- Leaflet is CSP-compatible because it sets styles through CSSOM properties
  (`el.style.transform = …`), never `setAttribute("style", …)` — which
  `style-src 'self'` blocks. A contract test asserts this against the installed
  package; re-audit on upgrade.
- `leaflet.css` is imported from `src/styles.css`, never dynamically from a
  component: a runtime CSS import makes Vite inject a `<style>` element, which
  the policy blocks.
- `<script type="application/ld+json">` is data, not code — it does not violate
  `script-src 'self'`. Executable inline script still does.
- Never commit secrets, tokens, or `.env` files. There are none today; keep
  it that way.
- Any future form/intake needs bot protection (Cloudflare Turnstile) and
  rate-limiting BEFORE launch — this is also a BetterGov.ph community
  requirement for Discord webhook access.

## Quality gates — all must pass before commit

```bash
npm test          # pretest builds first, then contract tests (tests/*.mjs) + unit tests (vitest)
npm run typecheck
npm run lint
npm run build     # must end "PRERENDER_OK 33 pages"
npm run qa        # committed Playwright harness; builds only if dist/ is missing
```

QA numbers reported to anyone come **only** from the committed harness
(`scripts/qa/`), never from an ad-hoc script. And a green suite does not
replace looking at the render in a real browser on the real Cloudflare
preview — that is where the scrollbar overflow, the wrapping hero text and the
dark-on-navy heading were actually caught.

The contract tests intentionally pin these conventions (palette, headers,
facts, scripts). If you change a convention on purpose, update the matching
contract test in the same commit — never delete a contract to make it pass.

## Workflow

### Communication and memory rules

- Robin may use Tagalog to express feelings, intent or emphasis. Codex replies
  in **English by default** unless Robin explicitly asks for another language.
  Tagalog messages still carry full requirements and must be recorded accurately
  in the session recap.
- Session memory is a **strict rule for every session**, including sessions that
  resume old branches, old tasks or older AI handoffs. Before work, read the
  handoff files and recent Git history. Before stopping, update the current
  status, decisions, verification results, blockers and next actions in the
  required logs. Historical entries stay intact; add a dated correction or
  current-status override when older text is no longer current.
- No important decision, source, test result, deployment result or blocker may
  exist only in chat. If it is not written to the repository, a future AI must
  treat it as unknown.

Roles: **Robin Tapiru** — product owner and civic source owner; pushes from the
authorized PC (the sandbox has no push credentials). **Codex** — commander and
final QA; **approves every checkpoint before work continues**, and approves any
merge. **Claude** — the website builder. `docs/command-center/` carries the
live status (active task, release tracker, source registry).

- Work in checkpoints: implement one phase, show the result (screenshots for
  UI), get a go-ahead, continue. No unreviewed mega-changes.
- **Never push to `main`.** All work goes to a review/experiment branch and
  waits for Codex. Merging is a separate, explicitly approved act.
- Prepare commits against the **fetched, verified origin tip**: pin the exact
  SHA and have the push instructions verify `git rev-parse HEAD` prints it.
  Never `git reset --hard` to an unverified ref — that is how a fix was once
  silently dropped (see the release tracker's `3352ee3` incident).
- Session memory: before starting, read `docs/START-HERE.md` then
  `docs/CONTEXT.md`. Before ending, update **both** and add a recap in
  `docs/sessions/` (see `docs/skills/session-memory/SKILL.md`). This is how the
  team avoids re-explaining the project every session.
- **Look at the render.** Three separate map defects passed a fully green test
  suite and were visible only in a screenshot. Capture UI at 1440 / 1280 / 768 /
  390 and compare against `design-research/v2-screens/` before calling UI work
  done. `docs/START-HERE.md` §8 lists the traps in full.
- Do not run `prettier` — there is no config, and it reformats whole files to 80
  columns. Match the surrounding style by hand.
- **Read the relevant skill in `docs/skills/` BEFORE you write or edit, not after.**
  The maintainer asked for this explicitly. At minimum:
  `anti-slop/SKILL.md` before any page, component or copy change;
  `frontend-standards/SKILL.md` before any UI or style change;
  `security-review/SKILL.md` before touching `public/_headers`, adding a
  dependency, or handling input; `session-memory/SKILL.md` at the start and end
  of every session. `docs/skills/README.md` lists the external sets too.
- Commits: conventional style (`feat:`, `fix:`, `docs:`, `chore:`), present
  tense, one logical change per commit.
- **Anything addressed to Codex — a handoff, a question, a clarification, a
  status report — must be delivered as a single copy-pasteable block**, with no
  commentary above or below it that could be copied by mistake. Robin relays
  these by hand; a report split across prose is a report that arrives broken.
  This is mandatory, not a preference.
- Work reviewed by Codex goes to a review branch and waits. Never push a
  reviewed task straight to `main`.
- Design, layout, or visual changes need maintainer approval before merging.
- Leave a session handoff after **every** task: update `docs/START-HERE.md` and
  `docs/CONTEXT.md`, add a `docs/sessions/` recap, and refresh
  `docs/command-center/active-task.md` — see
  `docs/skills/session-memory/SKILL.md`.
