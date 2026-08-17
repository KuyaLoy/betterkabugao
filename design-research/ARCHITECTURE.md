# How the BetterLGU network builds multi-page sites

Measured, not guessed. Every number below comes from reading the actual
repositories, not from looking at the rendered sites.

- **Repos cloned and analysed:** 17 (15 LGU portals + `bettergov` + `better-lgu-directory`)
- **Method:** walk every `.ts/.tsx/.js/.jsx` file outside `node_modules`,
  `dist`, `.next`, `.react-router`; collect every `path="…"` and `route("…")`
  literal; count how many repos declare each route.
- **Date:** 17 August 2026
- **Raw output:** the counts below are reproducible with the script quoted at
  the end of this file.

## 1. Route inventory

Routes declared, and how many of the 15 LGU repos declare each:

| Route | Sites | Note |
|---|---|---|
| `/services` | 11 | joint most common |
| `/government` | 11 | joint most common |
| `/` | 10 | others use a file-based index |
| `/transparency` | 8 | |
| `/sitemap` | 8 | an **HTML** sitemap page, not just `sitemap.xml` |
| `/services/:category` | 7 | |
| `/about` | 7 | |
| `/:documentSlug` | 6 | bare catch-all — see §4 |
| `/search` | 6 | |
| `/government/:category` | 5 | |
| `/government/:category/:documentSlug` | 5 | |
| `*` | 5 | explicit 404 |
| `/contact` | 5 | |
| `/accessibility` | 4 | |
| `/openlgu/officials` | 3 | the OpenLGU convention |
| `/transparency/infrastructure` | 3 | |
| `/statistics` | 3 | |
| `/tourism`, `/tourism/:category` | 3 | |
| `/admin` | 3 | |

Four repos returned no matches because they do not declare routes in code
(Next.js app-router file conventions, or Astro pages): `BetterIligan`,
`bettercalauan`, `betterlaspinas`, `bettersolano`.

## 2. Barangay pages: only one site in the network has them

```
bettercabanatuan: /government/barangays
                  /government/barangays/:barangaySlugId
```

That is the entire set. Fourteen of fifteen have no barangay route at all.
Two things follow:

1. **We adopt Cabanatuan's shape verbatim** — `/government/barangays` and
   `/government/barangays/:slug`. When exactly one prior implementation
   exists, matching it is what keeps the network navigable; inventing
   `/barangaylist/<name>` would make BetterKabugao the odd one out.
2. **A complete, sourced 21-barangay directory with a page each is new work
   in this network.** Nobody else has population + PSGC + coordinates +
   directions per barangay.

## 3. Officials pages: three competing conventions

| Pattern | Sites |
|---|---|
| `/openlgu/officials` | 3 (aklan, lb, meycauayan) |
| `/government/departments/officials` | 2 (generaltrias, indang) |
| `/government/officials` | 1 (cabanatuan) |

`/openlgu/*` is a shared-platform namespace, not a description of the page —
it only makes sense on sites that consume the OpenLGU API. We use
`/government/officials`, which reads as what it is and nests under the
`/government` hub that 11 of 15 sites already have.

## 4. What the network does that we deliberately do not

**A bare catch-all `/:documentSlug`.** Six repos declare one
(generaltrias, bacolod, indang, olongapo, tagaytay, tanay). It swallows every
unmatched URL, so a typo never produces a 404 — it produces an empty document
page. `src/App.tsx` carries a comment saying why we don't:

```tsx
// No bare catch-all like /:slug — a real 404 must stay reachable.
```

**Client-only rendering.** 10 of 16 repos ship a SPA behind a catch-all
rewrite: every URL in their own `sitemap.xml` returns the same HTML shell with
the same `<title>`. Facebook, Messenger and Viber never run JavaScript, so a
shared barangay link previews as the generic homepage. This is the network's
single biggest defect and the reason we prerender 31 routes to static HTML.
A contract test asserts no two prerendered pages share a title.

**Meilisearch.** Attempted and abandoned by peer portals (needs a server, a
key and an index host). Their fallback is Fuse.js. For a corpus of ~35 entries
we score substring matches over a module-scope index: no dependency, no
service, works in the prerendered HTML.

## 5. Page furniture we did adopt

Common across the network, and now used here:

- **A page header band** with breadcrumbs *inside* it, an eyebrow label, a
  left-aligned `<h1>`, a description, and optional actions on the right.
  Ours is `src/components/PageHeader.tsx` with `variant="hero"` (solid navy,
  for section landing pages) and `variant="compact"` (white, for detail pages).
- **A search field in the banner region of list pages** — Robin's ask, and
  consistent with how the network's list pages behave.
- **`/government` as a hub page**, not a redirect to its first child.
- **An HTML `/sitemap` page** — 8 of 15 have one. *Not yet built here;* logged
  as an open item.

Only one repo in the network emits `BreadcrumbList` JSON-LD. We emit it on
every page that has more than one crumb, at prerender time.

## 6. Reproducing the route table

```python
import os, re, collections
counter = collections.Counter()
for repo in sorted(d for d in os.listdir('.') if d.lower().startswith('better')):
    paths = set()
    for dirpath, dirnames, files in os.walk(repo):
        dirnames[:] = [d for d in dirnames
                       if d not in ('node_modules', '.git', 'dist', 'build', '.next', '.react-router')]
        for f in files:
            if not f.endswith(('.tsx', '.ts', '.jsx', '.js')):
                continue
            s = open(os.path.join(dirpath, f), encoding='utf8', errors='ignore').read()
            paths |= {m.group(1) for m in re.finditer(r'path=["\']([^"\']+)["\']', s)}
            paths |= {'/' + m.group(1).lstrip('/')
                      for m in re.finditer(r'route\(\s*["\']([^"\']*)["\']', s)}
    for p in paths:
        if p.startswith('/') or p == '*':
            counter[p] += 1
```

Run from the directory holding the clones. Visual measurements (containers,
header heights, type scale, radii) are in `RESEARCH.md` and
`_measurements.json`; this file covers structure only.
