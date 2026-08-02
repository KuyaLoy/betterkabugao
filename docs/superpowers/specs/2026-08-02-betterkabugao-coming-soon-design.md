# BetterKabugao Coming-Soon Launch Design

- **Status:** Approved
- **Production domain:** [betterkabugao.org](https://betterkabugao.org)
- **Repository:** [KuyaLoy/betterkabugao](https://github.com/KuyaLoy/betterkabugao)

## Goal

Launch a polished public placeholder for BetterKabugao while the full civic portal is being built. The page should establish the project’s identity, explain what is coming, and make the domain useful enough for BetterLGU verification without pretending that unfinished services are available.

This launch is intentionally smaller than the full BetterKabugao v1 portal. It includes one production-ready page and its deployment path. Service guides, public records, local content, search, multilingual pages, and the AI assistant remain separate follow-up work.

## Page Content

The page will use a single clear reading path:

1. A compact header with the standalone BetterKabugao mark and real HTML text for the project name.
2. A hero with the status label **Coming soon**, the headline **Kabugao information, made clearer**, and a short description of the independent community portal.
3. A small “What we’re building” section covering:
   - services and important contacts;
   - public information and transparency; and
   - local culture, communities, and places.
4. A project link to the public GitHub repository.
5. A footer stating that BetterKabugao is an independent civic initiative and is not the official website of the Municipality of Kabugao.

The page will not show a countdown or launch date until a real schedule exists. It will not collect email addresses or other personal information.

## Visual Direction

The design will use the approved BetterKabugao blue, yellow, ink, and white palette. It will borrow BetterGov’s clear civic tone without copying another portal’s composition or logo.

The desktop layout will pair the main message with an oversized Kabugao mark and restrained map-inspired linework. The supporting section will use three simple content cards rather than a large dashboard. On mobile, the page becomes a single column with the mark above the headline and comfortably sized touch targets.

The page should feel locally made and editorial, not like a generic AI landing-page template. It will avoid neon glows, fake metrics, stock photography, excessive gradients, and crowded decorative elements.

## Motion and Interaction

Animation will support the identity rather than distract from the message:

- the Kabugao mark and sunrise rays enter in a short staged reveal;
- background linework moves very slowly;
- the mark responds with a small pointer-based parallax effect on devices that support precise pointing; and
- content cards use subtle hover and focus transitions.

Motion will use opacity and transforms to stay smooth. `prefers-reduced-motion` will remove parallax and replace staged movement with an immediate or simple fade presentation. A concise `noscript` fallback will retain the project name, coming-soon status, description, GitHub link, and independent-initiative disclaimer when JavaScript is unavailable.

## Technical Architecture

The launch will use React, TypeScript, Vite, and Tailwind CSS. Vite will produce a static `dist` directory through `npm run build`. No router, database, API, or AI dependency is needed for the coming-soon release.

The project will keep responsibilities small:

- `App` owns the page structure;
- focused components own the header, hero, project themes, and footer;
- one motion utility owns pointer and reduced-motion behavior; and
- SEO and deployment files remain ordinary static assets or document metadata.

The approved SVG files remain the source of truth. The page header will use the standalone mark beside real HTML text, while the horizontal lockup remains available for social and documentation use.

## SEO and Accessibility

The launch will include:

- a descriptive page title and meta description;
- canonical URL `https://betterkabugao.org/`;
- Open Graph and social preview metadata;
- the approved favicon;
- `robots.txt` and `sitemap.xml`;
- semantic headings and landmarks;
- visible keyboard focus styles;
- sufficient color contrast; and
- a skip link for keyboard users.

Important copy will be real HTML rather than text embedded in an image or canvas. Decorative artwork will be hidden from assistive technology. The page will be checked at common mobile and desktop widths and with reduced motion enabled.

## Cloudflare Pages Deployment

Cloudflare Pages will connect to the personal GitHub repository `KuyaLoy/betterkabugao` using Git integration with access limited to that repository.

- **Production branch:** `main`
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Preview deployments:** enabled for non-production branches and pull requests

The first successful deployment will be verified on the generated `*.pages.dev` address. Only after that check will `betterkabugao.org` be added through the Pages project’s **Custom domains** screen. The apex domain is already managed by Cloudflare, so Pages can create the required DNS association. A manual CNAME will not be created before the custom-domain association because that can produce a `522` response.

HTTPS and the production canonical metadata will be verified after the custom domain becomes active. A `www` redirect may be added after the apex domain works; it is not allowed to delay the initial launch.

References:

- [Cloudflare Pages Git integration](https://developers.cloudflare.com/pages/get-started/git-integration/)
- [Cloudflare Pages custom domains](https://developers.cloudflare.com/pages/configuration/custom-domains/)
- [Vite static deployment](https://vite.dev/guide/static-deploy.html)

## Verification

The release must pass:

- TypeScript compilation and the production build;
- linting and focused component tests;
- checks for required page copy and SEO metadata;
- keyboard, reduced-motion, mobile, and desktop browser checks;
- inspection for layout overflow and cropped logo artwork;
- the generated `pages.dev` deployment check; and
- final HTTPS, canonical URL, robots, sitemap, and custom-domain checks.

## Success Criteria

The coming-soon launch is complete when:

- the page is responsive, accessible, and visually approved;
- `main` builds reproducibly to `dist`;
- GitHub pushes trigger Cloudflare Pages deployments;
- `betterkabugao.org` serves the page over HTTPS;
- the page clearly describes the portal without implying it is an official LGU website; and
- BetterLGU can verify that the domain serves the BetterKabugao project.

## Deferred Work

The full information architecture, sourced civic content, site search, language switching, Cloudflare Workers AI assistant, analytics, forms, and any database remain outside this launch. They will be implemented only after the public placeholder and deployment pipeline are stable.
