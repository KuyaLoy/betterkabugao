# Source registry

The command-center view of where everything on the site comes from: first the
provenance of self-hosted media, then the civic-data sources of record and the
hierarchy that governs any new claim. The full 43-source research inventory
(with per-source traps) is `docs/research/DATA-SOURCES.md`; the ordered
feature roadmap is `docs/research/data-tracker.html`.

Every self-hosted image must have an entry here with its origin, licence, and
the credit string shown to visitors. Every published figure on the site must
trace to a source in the civic-data table below (or in DATA-SOURCES.md), with
the source and its date shown beside it on the page.

---

## Hero photograph — Dibagat River, Kabugao

Added: **21 August 2026**, for the "Kabugao in View" homepage hero
(`experiment/full-site-visual-rebuild-v2`).

| Field | Value |
|---|---|
| Subject | The Apayao river at **Barangay Dibagat, Kabugao, Apayao** |
| Source | Wikimedia Commons — **File:Dibagat river.JPG** |
| Source page | `https://commons.wikimedia.org/wiki/File:Dibagat_river.JPG` |
| Photographer | **Andrew Garnett** |
| Licence | **Public domain** |
| Why this image | The most widely recognised photograph of Kabugao; the river valley is the place's defining view. Chosen and confirmed by the maintainer, who lives there. |

**Credit string shown to visitors** (homepage place-band `.kv-place__source`):

> Photograph: Dibagat River, Kabugao — Andrew Garnett / Wikimedia Commons,
> Public Domain.

### Local optimised copies

A single **1280×950 public-domain master** was downloaded from Commons (the
1800 px thumbnail returned HTTP 400 — it exceeds the source width, so no
upscaling was possible or attempted). Responsive variants were produced with
`sharp` — AVIF (`quality 54`), WebP (`quality 76`), JPEG (`quality 82`,
mozjpeg) — at four widths. Served from `public/hero/`, referenced by
`src/pages/HomePage.tsx` via `<picture>` (`sizes="100vw"`, `fetchPriority="high"`
on the JPEG fallback).

| Width | AVIF | WebP | JPEG |
|---|---|---|---|
| 480 | 29,084 | 45,078 | 46,083 |
| 640 | 52,153 | 80,810 | 82,009 |
| 960 | 113,784 | 179,720 | 184,511 |
| 1280 | 197,762 | 313,358 | 332,343 |

(bytes.) The AVIF at 1280 is 197 KB — the browser picks the smallest format it
supports at the needed width.

### Map tiles — NOT self-hosted (policy)

OpenStreetMap raster tiles are **not** downloaded, bundled, prefetched, proxied,
or self-hosted. The interactive Leaflet map requests them live from
`https://tile.openstreetmap.org/{z}/{x}/{y}.png` through the browser, with the
visible "© OpenStreetMap contributors" attribution the ODbL requires. The tile
host is one of exactly two external origins in the CSP (`public/_headers`); the
provider is one line in `src/components/MapView.tsx` if it ever needs changing.
Only the hero photograph above is self-hosted.

---

## Civic data — sources of record and hierarchy

_Section added 23 August 2026 (account-migration handoff)._

**Hierarchy for any new claim, strongest first:**

1. **The LGU itself / its eLGU platform** (`elgu-kabugao-apayao-news.e.gov.ph`
   and the municipality's own published posts)
2. **PSA** — POPCEN, PSGC (CC BY 4.0)
3. **BetterGov.ph network** data and tooling (bettergov.ph · lgu.bettergov.ph)
4. **Other official government sources** — COMELEC, DILG, COA, DBM, PhilGEPS,
   NAMRIA
5. **Reliable public APIs** — OpenStreetMap (ODbL), Open-Meteo, Wikidata (CC0)

If a fact cannot be traced to one of these with a date, it is not published —
the page says the data is being prepared. Never estimate, never placeholder,
never carry a number forward without a fresh source.

### Verified facts currently in use

| Fact | Value | Source (and date) |
|---|---|---|
| Barangays | 21 (records sum-checked by contract test) | PSA / PSGC |
| Population | **16,425** (2024 POPCEN; per-barangay figures sum exactly) | PSA |
| PSGC | municipality `1408104000`; 21 barangay codes; **`1408104003` is not in use — the site says so honestly** | PSA / psgc.gitlab.io |
| Area / income class | 935.12 km² · 1st class | PSA / DILG records |
| Coordinates | 18.0246 / 121.1845 | OSM place node (ODbL) |
| Elevation | 132 m — **known source discrepancy; confirm before repeating anywhere new** | see DATA-SOURCES.md |
| Municipal officials | Mayor **Bensmar B. Ligwang**, Vice Mayor **Frederick C. Amid**, Sangguniang Bayan; term **2025–2028** | DICT eLGU platform, retrieved 17 Aug 2026 |
| Barangay officials | **withheld — no government source publishes them** (eLGU, COMELEC, DILG and the province all checked); RA 12232 moved the BSKE to 2 Nov 2026, incumbents hold over; the site states this | recorded in `src/data/officials.ts` |
| Emergency hotlines | 8 municipal offices (MDRRMO, KMPS, BFP, APH, RHU, MSWDO, RMFB 15, ICT Office) + 911 first | the LGU's Discover Kabugao Facebook post, **15 April 2026** — source + date shown on `/emergency`; single source file `src/data/hotlines.ts` |
| Cost figures | ₱0 (cost to the people) and ₱670 (developer-paid domain) — the ONLY peso figures allowed, shown on `/about` only | contract-tested |
| Weather | Open-Meteo, no key/cookies — omitted rather than faked on failure (currently unmounted in the rebuild; host still CSP-pinned) | live API |
| Hero photograph | see the media section above | Wikimedia Commons, PD |

### Prohibited, unpublished, or unverified — never ship these

- An **unqualified "capital of Apayao"** claim (neutral wording is "the
  municipality of Kabugao, Apayao") — contract-tested on every built route.
- **Flood-control / procurement / contractor / public-works / budget** wording
  or data — deferred by the maintainer; BLGF fiscal data additionally needs
  licence clearance (`lfdad@blgf.gov.ph`) before it may be redistributed.
- Any peso figure other than ₱0 / ₱670, anywhere (and none in the global
  `<noscript>`), and any percentage presented as data — contract-tested.
- A **fabricated municipal boundary** on the map (no boundary is shown; the
  legend says so). Do not claim no official boundary source exists — the
  PSA/NAMRIA set on HDX exists but is not integrated.
- **Barangay officials from unofficial lists** (the stale third-party roster is
  explicitly banned by contract test).
- Any emergency number without a named, dated, official source — and never
  upgrade the hotline wording to imply a certainty we do not have.
- New elevation or geographic claims; "one river valley" phrasing.
