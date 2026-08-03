# BetterKabugao v1 Design

**Status:** Approved  
**Owner:** [KuyaLoy](https://github.com/KuyaLoy)  
**Repository:** [KuyaLoy/betterkabugao](https://github.com/KuyaLoy/betterkabugao)  
**Production domain:** [betterkabugao.org](https://betterkabugao.org)

## Purpose

BetterKabugao will be an independent, community-maintained portal for Kabugao, Apayao. It will combine the civic-transparency goals of BetterGov.ph with useful cultural and tourism information. Its primary audience is Kabugao residents, followed by visitors, researchers, volunteers, and local public servants.

The first release must make verified local information easy to find on mobile devices, clearly identify every factual source, remain inexpensive to operate, and be maintainable by non-specialists.

## Product Scope

The v1 information architecture will provide:

- **Home:** Local identity, important shortcuts, current highlights, and the independent-portal disclaimer.
- **Services:** Plain-language guides to municipal services, requirements, office contacts, fees, and processing steps.
- **Government:** Elected officials, offices, barangays, contact details, and office hours.
- **Transparency:** Budgets, projects, procurement links, ordinances, resolutions, and downloadable public records when available.
- **Discover Kabugao:** History, culture, communities, landmarks, nature, festivals, and responsible visitor information.
- **Emergency and contacts:** Verified emergency numbers and important local offices.
- **Data sources:** A public index of source organizations, URLs, and verification dates.
- **Verified local assistant:** A site-wide assistant that answers only from published BetterKabugao content and returns supporting links.

English and Filipino will be supported initially. The content and locale structure will allow Ilocano and Isnag translations later without redesigning routes or content types.

## Architecture

### Web application

Start from the community [Better Local Gov](https://github.com/iyanski/betterlocalgov) starter and adapt it inside the existing repository. Retain React, TypeScript, Vite, Tailwind CSS, and the BetterGov Kapwa design system. Preserve the starter's accessibility and multilingual patterns while removing placeholder LGU content and optional integrations that are not needed for v1.

The application will be deployed from the `main` branch through Cloudflare Pages. Pull requests and non-production branches will use Cloudflare preview deployments. The production build command will be `npm run build`, with `dist` as the output directory.

### Content layer

Public information will live in version-controlled Markdown, YAML, or JSON files. No database or external CMS will be required for v1. A normalized content record will contain:

- `id` and `slug`
- `title`, `summary`, and body content
- `category` and locale
- `sourceTitle` and `sourceUrl`
- `verifiedAt` in ISO date format
- optional office, address, phone, fee, and processing-time fields when relevant

Build-time validation will reject required fields that are missing, malformed source URLs, invalid dates, duplicate IDs or slugs, and unsupported locales.

Acceptable factual sources include official Kabugao or Apayao government channels, COA, DBM, PSA, BLGF, PhilGEPS, the Official Gazette, other Philippine government agencies, and clearly identified primary cultural or historical references. Community knowledge may be published only when labeled as community-supplied and reviewed before release.

### AI assistant

The AI assistant will run through a Cloudflare Pages Function or Worker using a Workers AI binding. Model credentials and bindings will never be exposed in browser code.

The browser will call:

```text
POST /api/assistant
{ "question": string, "locale": "en" | "fil" }
```

The endpoint will return:

```text
{
  "status": "answered" | "not_found" | "unavailable",
  "answer": string,
  "citations": [{ "title": string, "url": string }]
}
```

A build-generated content index will select a small set of relevant verified excerpts before the model is called. The model prompt will require answers to stay within those excerpts and attach only citations supplied by the server. If the index finds no sufficiently relevant content, the endpoint will return `not_found` without calling the model. If Workers AI is unavailable or the free allocation is exhausted, it will return `unavailable` and the interface will display ordinary site-search results and source links.

The assistant will not provide legal, medical, emergency-response, or eligibility decisions. It will not claim to represent the Municipality of Kabugao. Questions and answers will not be stored in an application database in v1. Request size limits, basic abuse controls, and a visible AI disclaimer will be included.

## Accuracy, Safety, and Accessibility

- Every factual page shows its source and last verification date.
- Unverified or missing information is labeled instead of inferred.
- The footer and About page state that BetterKabugao is an independent civic initiative and link to official government channels.
- Emergency information remains directly visible and never depends on AI output.
- Navigation, forms, dialogs, and assistant controls must be keyboard accessible, screen-reader labeled, and usable at mobile widths.
- Images require descriptive alternative text; decorative images use empty alt text.
- The site will avoid collecting personal information in v1.

## GitHub, BetterGov, and Deployment Flow

1. Import and customize the Better Local Gov starter while preserving its license and attribution.
2. Commit and push the initial working scaffold to `KuyaLoy/betterkabugao`.
3. Register Kabugao in [jmacj/better-lgu-directory](https://github.com/jmacj/better-lgu-directory) with this entry and a `🟡 Work in Progress` status:

   ```markdown
   | Kabugao, Apayao | [betterkabugao.org](https://betterkabugao.org) | [GitHub](https://github.com/KuyaLoy/betterkabugao) | - | 🟡 Work in Progress | [@KuyaLoy](https://github.com/KuyaLoy) |
   ```

4. Connect the GitHub repository to Cloudflare Pages, deploy from `main`, and validate the generated `pages.dev` preview.
5. Attach the apex domain `betterkabugao.org` in the Cloudflare Pages dashboard and enable HTTPS.
6. Configure the Workers AI binding and deploy the assistant only after the sourced content index and non-AI search fallback work.
7. Change the BetterLGU directory status to `🟢 Active` only after the public site is stable and has an active maintenance process.

## Verification and Acceptance

Automated checks will include TypeScript compilation, production build, ESLint, content-schema validation, unit tests for search and AI grounding, and browser tests for core routes. AI tests must cover a sourced answer, an unsupported question, an unavailable-model fallback, invalid input, missing citations, and attempts to override the grounding rules.

Browser acceptance testing will cover mobile and desktop navigation, keyboard use, language switching, source links, assistant states, broken routes, and an automated accessibility scan. Deployment verification will check the Pages preview, custom domain, HTTPS, canonical metadata, sitemap, robots file, and the production assistant endpoint.

V1 is complete when:

- the public GitHub repository contains a reproducible build and clear contribution instructions;
- all core sections render with Kabugao-specific structure and no starter-place placeholders;
- an initial set of verified Kabugao content includes visible source links and verification dates;
- the AI assistant answers grounded questions with citations and safely falls back for unsupported or unavailable cases;
- `betterkabugao.org` serves the production build over HTTPS; and
- the BetterLGU directory pull request has been submitted with an accurate status.

## Deferred Work

User accounts, citizen report forms, Discord webhooks, automated scraping, database-backed content management, push notifications, online transactions, personalized recommendations, and automatic AI translation are outside v1. They may be proposed separately after the static portal and verified assistant are stable.
