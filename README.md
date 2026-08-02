# BetterKabugao

BetterKabugao is an independent, community-maintained civic portal for Kabugao, Apayao. It is an independent civic initiative, not the official website of the Municipality of Kabugao.

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

## Brand assets

- `public/brand/betterkabugao-mark.svg` — page header and compact identity
- `public/brand/betterkabugao-logo.svg` — horizontal lockup
- `public/brand/betterkabugao-social.png` — social preview card
- `public/favicon.svg` — browser icon

## Project status

The full civic portal, sourced local content, search, language support, and the grounded AI assistant are planned separately from this launch page.
