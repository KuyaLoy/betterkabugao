# Source registry — self-hosted media

Provenance for media files committed into this repository (as opposed to the
build-time/API data inventoried in `docs/research/DATA-SOURCES.md`). Every
self-hosted image must have an entry here with its origin, licence, and the
credit string shown to visitors.

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
