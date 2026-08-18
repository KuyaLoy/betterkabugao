---
name: anti-slop
description: BetterKabugao anti-slop and redundancy review — use BEFORE writing or editing any page, component or copy in this repo, and again before calling UI work done. Catches the same fact said three times, duplicate credits, dead code left behind, and the LLM default aesthetics this project has already rejected once.
---

# Anti-slop: say it once, and only if it earns its place

"Slop" here means output that *looks* finished but wastes the reader: the same
fact three times, two buttons for one job, a paragraph that restates the heading,
a helper function nothing calls any more.

This is a **civic data site** for a municipality of 16,425 people, many reading
on a phone on mobile data. Every duplicated sentence is bytes they pay for and a
line they have to read twice.

## Use this skill

1. **Before** writing or editing a page, component or any published copy.
2. **Again** before saying UI work is done — run §4, the audit.

## 1. Credit where it is due, and what does not apply

Parts of §2 are adapted from **[taste-skill](https://github.com/Leonxlnx/taste-skill)**
by Leonxlnx (MIT), "the anti-slop frontend framework for AI agents", which the
maintainer added to this project.

**Read its scope before reaching for it:** it says plainly it is for "landing
pages, portfolios, and redesigns — not dashboards, not data tables, not
multi-step product UI." Most of BetterKabugao *is* data tables and directories,
so most of that skill does not apply here. Two of its rules we explicitly do
**not** follow:

- **"Zero em-dashes"** — a house style rule for marketing pages. Em-dashes are
  standard typography in the plain civic register this site uses.
- **"Avoid Inter"** as an LLM default — here Inter is not a default. It was
  measured across 11 live BetterLGU portals and is the network's typeface. See
  `design-research/RESEARCH.md`.

What we take from it: the anti-default list, "read the room before you style",
the one-label-per-intent rule, and its point that public-sector constraints
override aesthetic preference.

## 2. Aesthetic defaults that are a fail here

This project's v1 was rejected for exactly these. Do not reintroduce them:

- Centred hero; a row of three identical feature cards; a gradient CTA band
- Purple or mesh gradients, glows, glassmorphism, blobs
- Cartoon or zigzag SVG scenery
- Stock or AI imagery
- Emoji in UI copy; buzzwords ("empower", "seamless", "unlock", "revolutionize")
- Icon cards used as filler where a sentence would do
- Pill buttons (the network uses 0–8px radii)

## 3. Redundancy rules

**One label per intent.** Two controls that do the same thing, worded
differently, is a fail. "All numbers" and "See every hotline" and "Full list"
are one intent — pick one wording and use it everywhere.

**A fact belongs in one place per page**, unless the second appearance does a
different job:

| Repeat | Verdict |
|---|---|
| A number printed in two formats on the same button | ❌ fail — same digits twice. Pick one format and explain the variant once, in prose. |
| The same source date in a badge, a paragraph and a footnote | ❌ fail — two is the ceiling, and only if one is scannable and one is the citation. |
| "OpenStreetMap" credited three times on one page | ❌ fail — the licence wants attribution once, not thrice. |
| A heading, then a sentence restating the heading | ❌ fail — cut the sentence or make it add something. |
| "One of the 21 barangays of Kabugao" as a page description | ❌ fail — the breadcrumb already said that. Say something the reader does not have. |
| The same figure in prose and in a fact card | ✅ allowed — the card is for scanning, the prose for reading. |
| "Sangguniang Bayan Member" on eight cards | ✅ allowed — eight different people hold that position. Removing it makes the list ambiguous. |
| "Awaiting verified data" in nine schema fields | ✅ allowed — that IS the page's message: nothing is faked. |
| The independence disclaimer in the footer of every page | ✅ required — it is the project's legal footing. |
| A number duplicated in the marquee's second track | ✅ allowed — needed for a seamless CSS loop, and `aria-hidden` so it is announced once. |

**Dead code is slop too.** If a change leaves a helper, CSS class or content
field unused, delete it in the same commit. Recent examples: `formatLocal()`
after the display format was unified; `.hotline-row__intl`;
`siteContent.hotline.note`; a `display: none` `<SiteSearch />`.

## 4. The audit — run it, do not eyeball it

```bash
npm run build
python3 - <<'PY'
import re, glob, os, collections
def text(html):
    for pat in (r'<script[\s\S]*?</script>', r'<style[\s\S]*?</style>',
                r'<noscript>[\s\S]*?</noscript>', r'<head>[\s\S]*?</head>'):
        html = re.sub(pat, ' ', html)
    html = re.sub(r'</(p|li|h1|h2|h3|div|span|a|b|dd|dt|em|strong)>', ' \n', html)
    return [re.sub(r'\s+', ' ', l).strip() for l in re.sub(r'<[^>]+>', ' ', html).split('\n')]
for f in sorted(glob.glob('dist/**/index.html', recursive=True)):
    route = '/' + os.path.relpath(os.path.dirname(f), 'dist')
    lines = [l for l in text(open(f, encoding='utf8').read()) if len(l) > 12]
    cut = next((i for i, l in enumerate(lines) if 'A volunteer-run civic portal' in l), len(lines))
    dupes = {k: v for k, v in collections.Counter(lines[:cut]).items() if v > 1}
    if dupes:
        print(route, '->', {k[:60]: v for k, v in sorted(dupes.items(), key=lambda x: -x[1])[:4]})
PY
```

Every line it prints is either a justified repeat from the table in §3 or a
defect. Decide which, in writing, rather than moving on.

Then check for dead code:

```bash
# any exported helper nobody imports?
for fn in $(grep -rhoP 'export function \K\w+' src/ | sort -u); do
  [ "$(grep -rlw "$fn" src/ | wc -l)" -le 1 ] && echo "possibly unused: $fn"
done
# any CSS class nothing renders?
for c in $(grep -oP '^\.\K[a-z][a-z0-9_-]*' src/styles.css | sort -u); do
  grep -rq "\"$c\|'$c\| $c" src/*.tsx src/**/*.tsx 2>/dev/null || echo "possibly unused class: .$c"
done
```

## 5. Copy tests

Before shipping any sentence, ask:

- Would the reader lose anything if this sentence were deleted? If no, delete it.
- Does it repeat the heading above it?
- Is it a fact, or a feeling about a fact? This site publishes facts.
- Could a resident in Kabugao read it aloud without stumbling?
- Does every figure name its source and date, exactly once?

## 6. Known tension: the hotline marquee

The maintainer chose an auto-scrolling marquee for the emergency bar after being
shown the trade-off. Note that taste-skill's anti-default list includes
"infinite-loop micro-animations everywhere" — so this skill and that choice are
in tension, deliberately, and it was a maintainer decision.

It is defensible because it is **one** element rather than motion everywhere, and
because every pause path is implemented: hover, focus, touch, a visible Pause
button, and `prefers-reduced-motion`. If a second piece of auto-motion is ever
proposed, that defence stops working — say so.
