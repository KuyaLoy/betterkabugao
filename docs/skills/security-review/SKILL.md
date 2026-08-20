---
name: security-review
description: BetterKabugao security checklist — use before every commit/PR, when touching public/_headers, adding dependencies, handling any user input or forms, or reviewing someone else's changes to this repo.
---

# BetterKabugao Security Review

Static civic site, strict posture. This site represents government
transparency to real citizens — it must never be the weak link.

## Headers (`public/_headers` — Cloudflare Pages)

Must always ship, verbatim spirit:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY` (+ CSP `frame-ancestors 'none'`)
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), camera=(), microphone=()`
- CSP: `default-src 'self'; script-src 'self'; style-src 'self';
  img-src 'self' data:; font-src 'self'; object-src 'none';
  base-uri 'self'; form-action 'self'; frame-ancestors 'none';
  upgrade-insecure-requests`

Loosening ANY directive requires maintainer approval + written reason in the
PR. The contract test `tests/site-contracts.test.mjs` pins these — never
weaken the test to make a change pass.

### `form-action 'self'` — the one directive that has been relaxed

Changed from `'none'` on **2026-08-20** with Codex's written approval. Three
places render a real `<form method="get" action="/search">`: the `/search` page,
the `/404` page and the search overlay. Under `'none'` the browser refused the
submission outright, so all three boxes did nothing with scripting off, which is
exactly the visitor this site is built for.

`'self'` permits that same-origin `GET` and still blocks what the directive is
for: a form — and any data in it — being submitted to another origin. There is
no `POST` anywhere on this site, no endpoint to post to, and no user data in the
query beyond what the visitor typed. Widening it further, to a named host or to
`*`, is **not** approved, and a contract test asserts that no host or wildcard
appears in the directive. If an intake form is ever added, revisit this together
with the Turnstile and rate-limiting requirements below.

## Checklist before every commit

1. **No secrets**: no tokens, API keys, `.env`, credentials — scan the diff.
2. **No new runtime requests**: zero third-party scripts, fonts, pixels,
   CDNs, analytics. Everything self-hosted. `grep -r "https://" src/` should
   only show `href` link targets (github.com, bettergov.ph, lgu.bettergov.ph).
3. **No inline script/style** in HTML or JSX (CSP blocks them silently in
   production — it will look fine in `npm run dev` and break live).
4. **Dependencies**: adding one needs maintainer approval. When approved:
   pin sane semver, check the package is actively maintained, run
   `npm audit`, and prefer vendoring small static assets over packages.
5. **External links**: `target="_blank"` ⇒ `rel="noreferrer"`.
6. **Content safety**: never render user-supplied strings with
   `dangerouslySetInnerHTML`. There is no user input today; keep it that way
   until the intake design below exists.

## Future forms / citizen report intake (not built yet)

BetterGov.ph community requirement before any live intake:

- Bot protection: Cloudflare Turnstile (or equivalent CAPTCHA)
- Edge rate-limiting (Cloudflare) or application-level throttling
- Only after both are demonstrable may the portal request a BetterGov.ph
  Discord webhook for report funneling
- Never collect more personal data than the report needs; no tracking

## Deploy hygiene

- `main` is production — everything on it goes live at betterkabugao.org
- Verify the Cloudflare Pages preview (`*.pages.dev`) before merging
  anything that touches headers, meta, or the build pipeline
- `dist/` stays untracked; builds are reproducible from source only
