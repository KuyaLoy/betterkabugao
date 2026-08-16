# BetterKabugao

BetterKabugao is an independent, community-maintained civic portal for Kabugao, the capital municipality of Apayao. It is an independent civic initiative, not the official website of the Municipality of Kabugao, and is part of the [BetterGov.ph](https://bettergov.ph/) volunteer network — see the [BetterLGU Directory](https://lgu.bettergov.ph/).

The current release is a responsive coming-soon page while sourced local content and public-information features are prepared.

## Local development

Requirements: Node.js 22.14.0 and npm.

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The production build is written to `dist`.

## Cloudflare Pages

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root

The generated `pages.dev` deployment must be verified before `betterkabugao.org` is attached through the Pages project’s Custom domains screen.

## Design system

The page follows the official BetterGov.ph design tokens (see `src/styles.css`): Figtree typography with the BetterGov blue scale (`#0066EB` → `#00142F`) and gold accents (`#FFB900`, `#F58900`). Figtree is vendored in `public/fonts` under the SIL Open Font License so the site makes no third-party requests.

The identity is the Apayao province silhouette with the Municipality of Kabugao highlighted in gold beneath a three-ray sunrise. `src/brand/geometry.json` is the single source of truth; `npm run brand:build` regenerates every SVG from it.

## Brand assets

- `src/brand/geometry.json` — canonical map geometry (edit here, then `npm run brand:build`)
- `public/brand/betterkabugao-mark.svg` — standalone mark for light backgrounds
- `public/brand/betterkabugao-mark-inverse.svg` — standalone mark for dark backgrounds
- `public/brand/betterkabugao-logo.svg` / `-inverse.svg` — horizontal lockups (wordmark pre-rendered as paths)
- `public/brand/betterkabugao-social.png` — social preview card (`npm run brand:social`)
- `public/favicon.svg` — browser icon

## Contributing

Read `CLAUDE.md` for the project conventions (design tokens, accessibility, security, and session-recap workflow) before opening a pull request. Content changes must keep the independence disclaimer and cite official sources for any published figure.

## Project status

The full civic portal — sourced local content, service guides, transparency data, search, and language support — is planned separately from this launch page.
