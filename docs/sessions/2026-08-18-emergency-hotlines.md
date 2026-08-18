# 2026-08-18 — emergency hotlines

## Who

Robin Tapiru, with Claude (Cowork). Added onto the `feat/multipage-v1` branch,
which was already pushed and deployed for review.

## What Robin asked for

> "for this checkout can we add emergency numbers to add in the website i saw
> the kabugao facebook page i saw this on there post … check other lgu how they
> add emergency number ok for me i wanna make sure add country code of +63 so
> familky abroad can call too for there family if need emergency"

And, mid-work: **"once we add this to current checkout we will push it to live."**
That raised the bar — these numbers go public and people may rely on them in an
emergency.

## The source, and how far it was verified

The numbers come from a poster published by the Municipality of Kabugao on its
**Discover Kabugao** Facebook page, **15 April 2026**, captioned "Here are the
updated Emergency Hotlines of the Municipality of Kabugao."

What was checked:

- Opened the post itself. Page has 22K followers, carries the municipal seal,
  and the poster carries the LGU's own addresses (`lgukabugao@gmail.com`,
  `lgukabugao@yahoo.com`). The caption speaks as the municipality.
- Transcribed all nine numbers twice, from the post and from the image Robin
  sent. They agree.
- Every number is a valid 11-digit PH mobile number with a real network prefix
  (0905, 0915, 0927, 0929, 0952, 0967, 0975, 0997). No duplicates.
- Abbreviations expanded from evidence, not guessed: **RMFB 15** is the PNP
  Regional Mobile Force Battalion 15, whose 1505th Maneuver Company has
  responded in Kabugao; **APH** is the Apayao Provincial Hospital, which is
  located in Kabugao. The rest are standard PH LGU office names.

What could **not** be done:

- **No independent corroboration of any individual number.** The municipality's
  own eLGU platform publishes officials but not hotlines; no other government
  source lists them. This is the best source that exists.
- **Nobody has test-dialled them.** Logged as an open item.

So the rule changed rather than being bent: the site now publishes numbers the
municipality itself published, **always beside the source and its date**, with
911 first as the always-valid fallback and an explicit note that mobile numbers
change. `CLAUDE.md` was updated to say exactly that, replacing "never publish an
unverified emergency phone number".

## How the network does it (checked, not assumed)

Grepped all 15 cloned LGU repos:

- **5 of 15 use `+63` somewhere**, so Robin's request matches the ecosystem.
- **BetterCabanatuan already does exactly what he wanted**: displays the local
  form (`0920-611-2000`) while `formatPhoneForTel` normalises the `tel:` href to
  `+63`. BetterAlaminos has the same idea in `lib/phone.ts`.
- Aklan, Los Baños and Meycauayan use a `CriticalHotlinesWidget` fed by a
  national hotline JSON, linking out to `hotlines.bettergov.ph` for the rest.
- Cabanatuan and Alaminos both put featured numbers in a red top bar — which we
  already had.

We adopted Cabanatuan's shape and went one step further: **both** formats are
displayed, because the whole point is that a relative abroad recognises the
`+63` form.

## What was built

- `src/data/hotlines.ts` — the eight offices, 911, the source record, and three
  formatters (`telHref` → always `+63`, `formatLocal`, `formatInternational`).
  The file opens with the provenance and the instruction to cite a new source
  before changing any number.
- `src/pages/EmergencyPage.tsx` at **`/emergency`** — 911 as a single large tap
  target first, then each office with its purpose and one tap target per number
  showing both formats. Then a "calling from outside the Philippines"
  explanation, the change caveat, and the cited source.
- `HotlineBar.tsx` rewritten — 911 plus **all eight offices** on every page as
  one **swipeable** row, with a fade on the right edge so it visibly continues,
  and an "All numbers" button. Below 720px the row takes its own full-width
  line: squeezed beside the label, 911 and the button it collapsed to ~100px,
  which is a keyhole, not a control.
- Search index gains an entry per office, so "police", "fire" or "sunog" finds
  the number, not just the page.
- Footer link; hotline styles in `src/styles.css`.

## Verified

```
npm run typecheck → clean
npm run lint      → clean
npm run build     → PRERENDER_OK 32 pages
npm test          → 30 contract pass / 0 fail; 27 unit pass
```

Browser checks on the built output at 1440 / 768 / 390, served with the real CSP:

| Check | Result |
|---|---|
| `tel:` links | 15 on the page, **every one** `tel:+63##########` or `tel:911` |
| Smallest call tap target | 69 px (WCAG wants ≥ 44) |
| Horizontal overflow | none at any width |
| Inline styles / CSP violations | 0 / 0 |
| Full-site regression | 26 captures across every page still clean |

New contract tests pin: the source is named, linked and dated; every number is
11 digits with a leading 0; no duplicates; `tel:` is always `+63` and never
`tel:0`; **no phone number may be hardcoded in a component**; every office is
named in full; and the page must keep the "numbers can change" and "not the
municipal government" wording.

## Decisions made (and why)

- **Dedicated `/emergency` page, not a section of `/services`.** Someone in an
  emergency needs one tap, and `/services` is still a placeholder.
- **Not added to the masthead nav.** It already has six links and wraps to two
  rows on a phone; the red bar is far more prominent than a seventh nav item.
- **Both dialling formats shown.** The local form is how the numbers are read
  out in Kabugao; the `+63` form is what family overseas needs. The link is
  always `+63`, which works for both.
- **Removed `siteContent.hotline.note`** — it became dead data once the bar
  carried real numbers; provenance now lives on `/emergency`.

## Marquee: argued against, then built when the maintainer chose it

Robin asked whether the bar should be a marquee that stops on hover or touch.
BetterAlaminos does exactly that (`SCROLL_SPEED_PX_PER_FRAME = 0.5`), so there
is precedent. The case against was put to him:

- **You cannot tap a moving target.** In an emergency someone must wait for
  their number to come around and then chase it. That defeats the bar's only job.
- **WCAG 2.2 SC 2.2.2** requires a pause mechanism for content that moves for
  more than 5 seconds, and hover does not serve keyboard users — it would need a
  visible pause button.
- The repo's global `prefers-reduced-motion` rule zeroes animation, so the
  design has to work stopped regardless.
- The frontend standards in this repo ban decorative motion.

He heard it and chose the marquee anyway. **It is his project and his community,
so it was built** — but built so the objections are answered rather than ignored.
It stops on all five paths, and each is pinned by a contract test:

| Stop path | How |
|---|---|
| Pointer over it | `@media (hover: hover)` → `animation-play-state: paused` |
| Focus inside it | `:focus-within` — keyboard users tabbing the links |
| Finger on it | `:active`, which is what a touch gives CSS |
| Deliberate | a visible **Pause / Play** button with `aria-pressed`, which is what WCAG 2.2 SC 2.2.2 actually asks for; hover does not serve a keyboard or switch user |
| Reduced motion | `prefers-reduced-motion` → no animation at all, the pause button is hidden as pointless, and the row becomes swipeable |

The motion is pure CSS (duplicated track, `translateX(-100%)`, `aria-hidden` on
the second copy) so the browser can pause it. No `setInterval`, no
`requestAnimationFrame` — a contract test forbids both.

Verified in Chromium: it moves; it stops on hover; the button stops it and the
label flips to "Play"; under `reducedMotion: reduce` it never moves, the button
is gone and the row scrolls. Eight links announced, not sixteen.

One honest note, recorded in `docs/skills/anti-slop/SKILL.md`: taste-skill's
anti-default list includes "infinite-loop micro-animations everywhere". This is
one element, not everywhere, and every pause path exists — so the defence holds.
A *second* piece of auto-motion would break it.

## The popup

Robin then asked for the full list as a popup rather than a page jump, with the
button label being the number itself.

Built on the native `<dialog>`: focus trap, Escape and focus restoration come
from the browser. The trigger stays a real `<a href="/emergency">` and only
cancels the navigation when `showModal` exists, so without JavaScript the reader
still reaches the full page. `/emergency` remains the canonical, prerendered,
shareable version.

jsdom 29 has no `showModal`, so `src/test/setup.ts` now shims `showModal`/`close`
enough to unit-test the contents. The real modal behaviour is verified in
Chromium.

## Redundancy pass

Robin: *"popup simple button 2 redundunt numbers … check all pages make sure less
redundunt unless its needed."* He was right — each button printed the same digits
twice, once as `0927 591 9022` and once as `+63 927 591 9022`.

An audit script over all 32 built pages (now in
`docs/skills/anti-slop/SKILL.md` §4) found:

| Finding | Action |
|---|---|
| Every number printed twice per button | **Fixed** — one `+63` format everywhere; the leading-0 equivalence is explained once in prose |
| `formatLocal()` now unused | **Deleted**, with its two CSS classes |
| `15 April 2026` three times on `/emergency` | **Fixed** — badge + citation only |
| `OpenStreetMap` credited three times per barangay page | **Fixed** — one credit under the map |
| "One of the 21 barangays of Kabugao" as a page description | **Fixed** — now states place type and population |
| `21 barangays` 4× and `935.12` 2× on the homepage | **Fixed** — map section no longer restates them |
| `Sangguniang Bayan Member` on 8 cards | **Kept** — eight different people hold it |
| `Awaiting verified data` in 9 schema fields | **Kept** — that *is* the page's message |
| Footer disclaimer on every page | **Kept** — legal footing |
| Numbers duplicated in the marquee's second track | **Kept** — needed for the seamless loop, `aria-hidden` |

**A real bug came out of this.** Editing the stylesheet by string-splice deleted
the entire emergency-page style block while the markup kept referencing it: the
build passed, every test passed, and the call buttons rendered as 20px of bare
text. A new contract test now cross-checks every `className` a component renders
against the rules defined in `src/styles.css`, in both directions — no unstyled
markup, no dead modifier classes. It immediately found `hotline-card--national`,
which styled nothing, and that was removed.

## Open threads

- **Test-dial the numbers**, or ask the LGU to confirm them, before or soon
  after this goes live. This is the one thing that would remove the residual
  doubt, and it costs one phone call.
- Ask the municipality whether they will publish hotlines somewhere more
  durable than a Facebook post — a page we can re-check automatically.
- Barangay-level contacts are still unpublished anywhere.

## Handoff notes

Adding a route touches **four** places, not one: `src/App.tsx`, three lists in
`src/lib/seo.ts`, `PAGES` in `src/lib/search.ts`, and `STATIC_SECTIONS` in
`scripts/build-seo.mjs`. Missing the last one prerenders the page but leaves it
out of `sitemap.xml` — that happened here and was caught by the sitemap count.
