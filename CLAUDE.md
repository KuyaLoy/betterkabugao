# BetterKabugao — Project Conventions

Read this before changing anything. These are hard rules, not suggestions.
AI assistants (Claude Code, Codex, Copilot) must follow them literally.

## What this project is

An independent, community-maintained civic transparency portal for Kabugao,
the capital municipality of Apayao (21 barangays, 16,215 residents per the
2020 PSA census). Part of the BetterGov.ph volunteer network — registered in
the BetterLGU Directory (https://lgu.bettergov.ph/). Built at ₱0 cost to the
people. It is NOT the official website of the Municipality of Kabugao, and
every page must keep that disclaimer.

Current release: the coming-soon launch page. The full portal (service
guides, transparency data, search, FIL/Isneg language support) comes later.

## Stack — do not swap or add without maintainer approval

- React 19 + TypeScript (strict) + Vite 8, Node 22.14.0 (pinned in `.node-version`)
- Tailwind CSS v4 via `@tailwindcss/vite`; design lives in plain CSS classes
  in `src/styles.css` on top of `@theme` tokens
- Deploy: Cloudflare Pages — branch `main`, build `npm run build`, output `dist`
- No router, no backend, no database, no analytics, no CSS-in-JS, no jQuery
- One third-party runtime request only: Open-Meteo, for live Kabugao weather
- New dependencies require an explicit maintainer OK in the PR description

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
- Layout: 1200px container · 76px masthead · left-aligned headings ·
  6px buttons (never pills) · 12px cards · solid navy hero (no gradients)

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
- Never publish an unverified emergency phone number.
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
  done, and confirm `scrollWidth === clientWidth` at 320/360/390/414 — no
  horizontal scroll on any phone

## Security rules

- `public/_headers` ships HSTS, nosniff, X-Frame-Options DENY, strict CSP
  (`default-src 'self'`, no inline script/style), Referrer-Policy, and
  Permissions-Policy. Loosening any directive needs maintainer approval and a
  written reason in the PR.
- Exactly ONE third-party runtime request is permitted: `api.open-meteo.com`
  for live Kabugao weather (no API key, no cookies, no tracking), declared in
  the CSP `connect-src`. Everything else — fonts, scripts, styles, images —
  is self-hosted. Adding a second host needs maintainer approval, a written
  reason, and a matching update to `public/_headers` and its contract test.
- Never commit secrets, tokens, or `.env` files. There are none today; keep
  it that way.
- Any future form/intake needs bot protection (Cloudflare Turnstile) and
  rate-limiting BEFORE launch — this is also a BetterGov.ph community
  requirement for Discord webhook access.

## Quality gates — all must pass before commit

```bash
npm test          # contract tests (tests/*.mjs) + unit tests (vitest)
npm run typecheck
npm run lint
npm run build
```

The contract tests intentionally pin these conventions (palette, headers,
facts, scripts). If you change a convention on purpose, update the matching
contract test in the same commit — never delete a contract to make it pass.

## Workflow

- Work in checkpoints: implement one phase, show the result (screenshots for
  UI), get a go-ahead, continue. No unreviewed mega-changes.
- Session memory: before starting, read `docs/CONTEXT.md`. Before ending,
  update it and add a recap in `docs/sessions/` (see
  `docs/skills/session-memory/SKILL.md`). This is how the team avoids
  re-explaining the project every session.
- Skills for AI-assisted contributors are committed in `docs/skills/` — read
  them before UI, security or session work. `docs/skills/README.md` also lists
  the recommended external skill sets.
- Commits: conventional style (`feat:`, `fix:`, `docs:`, `chore:`), present
  tense, one logical change per commit.
- Design, layout, or visual changes need maintainer approval before merging.
