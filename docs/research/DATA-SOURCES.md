# Kabugao data-source inventory

Research date: **16–17 August 2026.** Method: four parallel research passes — one
reading all 17 BetterGov/BetterLGU repositories, three probing live government
and civic sources with real HTTP requests. Every claim below was verified, or is
explicitly marked unverified.

Read this before building any data feature. It records what is genuinely
retrievable, what looks retrievable but is not, and the traps that silently
produce wrong numbers.

---

## 1. Corrections to facts currently published on betterkabugao.org

| Field | Currently on site | Research finding | Action |
|---|---|---|---|
| Population | 16,215 (2020 census) | **16,425 (2024 POPCEN)** — PSA PSGC page, sum of all 21 barangays verified; corroborated by OSM node 198512492 (`population:date=2024-07-01`) and Wikidata Q30053 (preferred rank) | Update, label as 2024 POPCEN. 16,215 stays correct *for 2020*. |
| Elevation | 135.7 m | Three divergent values: **132 m** (Open-Meteo / Copernicus DEM at the poblacion, verified), 262 m (Wikidata), 78–689 m range (Wikipedia) | Pick one, state the method and datum, or drop it |
| Coordinates | 18.0229° N, 121.1841° E | OSM town node: **18.0246159, 121.1845310** | Minor; adopt OSM or cite the current source |
| Income class | not stated | **1st class municipality** — DOF Department Order 074.2024, First General Income Reclassification under RA 11964, `CAR / Apayao / Kabugao / 1st / 1st` | Safe to publish with that citation |
| PSGC | not stated | **1408104000** (legacy 9-digit 148104000) | Add — it is the join key for nearly every dataset here |

**Governance caution — do not publish yet.** BetterGov's directory lists
Kabugao's vice-mayor as FABULOUS B. TUCJANG. Rappler, citing the COMELEC
Transparency Media Server at 100% of precincts (15 May 2025), reports the 2025
vice-mayoral winner as **AMID, Frederick (IND) 4,991** over Tucjang (NPC) 4,418.
Tucjang appears to be the 2022–2025 term holder. Mayor **LIGWANG, Bensmar
(NPC) 7,014 / 58.06%** is consistent across sources. Verify against COMELEC's
official canvass before naming any official.

---

## 2. Tier 1 — retrievable now, open licence, no backend

These need no API key, return CORS-friendly responses or can be fetched at build
time, and carry a usable licence.

### 2.1 DPWH ArcGIS Online — the authoritative infrastructure source

Organisation `IwZZTMxZCmAmFYvF`, 172 public items, **no key**,
`Access-Control-Allow-Origin: *`. Note that `dpwh.gov.ph`,
`apps.dpwh.gov.ph` and `transparency.dpwh.gov.ph` are all bot-blocked
(Imperva/Cloudflare) — but this ArcGIS org is wide open.

| Layer | Kabugao content |
|---|---|
| `FloodControl_Data_20250802_v6_corrected_coordinates_for_uploading/FeatureServer/0` | **6 projects, ₱219,872,800** (Apayao: 34, ₱1,951,896,262) |
| `Detailed_Bridge_Inventory/FeatureServer/3` | **17 bridges** (Apayao: 78) with condition, length, type, load limit |
| `City_Municipal_Boundaries/FeatureServer/0` | Municipal polygon, PSGC 148104000, ~4.2 KB GeoJSON |
| `Road_Classification`, `Road_Condition_2021`, `Carriageway_Width`, `Number_of_Lanes`, `Kilometer_Post` | National road network attributes (probable) |

Verified query:

```
https://services1.arcgis.com/IwZZTMxZCmAmFYvF/arcgis/rest/services/FloodControl_Data_20250802_v6_corrected_coordinates_for_uploading/FeatureServer/0/query?where=Province%3D%27APAYAO%27&outFields=*&outSR=4326&f=geojson
```

Supports `f=geojson`, `returnDistinctValues`, and server-side `outStatistics` +
`groupByFieldsForStatistics` — totals without downloading rows.
`maxRecordCount` 1000. **Licence: `licenseInfo` is blank on every item** —
clear with DPWH before republishing bulk copies.

**Difficulty: EASY.**

### 2.2 api.dpwh.bettergov.ph — the whole project spine, all sectors

Undocumented but public, CORS `*`. Mirrors the entire DPWH transparency
dataset: **264,063 projects, ₱6.5T** — not just flood control.

- `GET /projects?province=APAYAO` → 1,224 projects, ₱23,987,743,776
- `GET /projects?search=Kabugao&limit=200&page=N` → **301 projects, ₱8,620,685,554**, InfraYear **2016–2026**
- `GET /projects/{contractId}` → ABC, advertisement date, bid deadline, **date of award, award amount, bidder list with PCAB licence IDs**, funding instrument, source of funds
- `GET /projects/{contractId}/images` → S3 photo URLs (Kabugao's six projects have **315 photos**)

Other agencies' work appears here where DPWH implements it, via
`category` / `programName`: **`GAA 2024/2025 DA FMR`** (farm-to-market roads),
**`GAA 2024/2025 DepEd BEFF`** (school buildings), SSP/CSSP/CP, `GAA 2017 NDRRMF`.

Reproducible snapshot (**CC0 1.0**): dataset 19 at `data.bettergov.ph`, or
`huggingface.co/datasets/bettergovph/dpwh-transparency-data` — 21.8 MB Parquet,
248,220 rows, snapshot 2025-11-29. Pin the Parquet for anything published as a
citable record; the live API is unversioned.

**Difficulty: EASY.**

### 2.3 BLGF fiscal data — the money foundation

`https://blgf.gov.ph/lgu-fiscal-data/` — 54 XLSX + 4 PDF direct links, no auth,
no blocking. Kabugao is **row 271** of 1,732 in the SRE sheet
(`CAR | Apayao | Kabugao | Municipality`).

FY2025 (preliminary), verified arithmetically self-consistent:

| Line | FY2025 (₱) |
|---|---|
| Total Tax Revenue | 2,012,210.93 |
| **Total Local Sources** | **2,702,191.00** |
| **National Tax Allotment** | **377,579,369.00** |
| **Total Current Operating Income** | **380,281,560.00** |
| General Public Services | 156,084,345.26 |
| Social Services *(Health 19,422,440.69 · Social Welfare 19,342,645.45 · **Education 0**)* | 38,765,086.14 |
| Economic Services | 23,055,682.29 |
| **Total Current Operating Expenditures** | **217,905,113.69** |
| Capital outlay | 69,089,217.99 |
| Cash balance, beginning | 236,640,714.50 |
| **Fund/Cash Balance, End** | **328,080,151.98** |

Two findings worth leading with: **NTA is 99.29% of operating income; local
sources are 0.71%.** And the **year-end cash balance is 86% of a full year's
income** — Kabugao takes in far more than it spends.

FY2025 LDRRMF (a mandated FDP document, published here in bulk):
70% fund ₱13,309,575.68 appropriated / ₱10,689,238.06 spent; 30% Quick Response
Fund ₱5,704,103.86 / ₱5,654,857.00. **Total ₱19,013,679.54 / ₱16,344,095.06.**

Also available per-LGU: ARI + NTA dependency, SEF income/expenditure, Real
Property Assessment (RPAR), FY2011–2025 time series.

**Three traps:** the SRE header says *"In Php Million"* but **values are in
pesos**; headers are **merged across rows 7–11** with a **leading blank column
A**, so a naive `read_excel` shifts every column; figures are self-reported by
the local treasurer and marked **Preliminary**.

**Licence — the one real legal constraint found.** The workbook's own Metadata
sheet: *"Acknowledgement of the Bureau of Local Government Finance as the
source… Users are restricted from reselling, redistributing, or creating
plagiaristic works… without the expressed or written permission of BLGF."*
Publishing derived figures with attribution is within "cited or reproduced…
provided BLGF is recognized". **Re-hosting the XLSX is redistribution.** Email
`lfdad@blgf.gov.ph` (Local Financial Data Analysis Division, (02) 5318-2531)
before launch — it satisfies "duly informed" and settles the question.

**Difficulty: EASY.** Copy the pattern in
`/root/work/lgu/BetterIligan/scripts/extract-budget-data.mjs` (needs a browser
User-Agent or BLGF returns 403; find Kabugao's row rather than hardcoding it).

### 2.4 Wikidata Q30053 — highest value per unit of effort

**CC0**, no auth, CORS, one request:
`https://www.wikidata.org/wiki/Special:EntityData/Q30053.json`

Carries full time series: population **1918→2024** (15 censuses), households
1960→2020, registered voters 1998→2025, **COA fiscal series 2010→2024**
(2024: revenue ₱323,195,522.78 · expenditure ₱255,526,757.09 · assets
₱927,699,788.05), and **poverty incidence 2000→2021** sourced to PSA Small Area
Estimates: **19.11% (2021)**, 35.34% (2018), 24.88% (2015), 63.90% (2012).

**Difficulty: EASY.**

### 2.5 psgc.gitlab.io — the 21 barangays

`https://psgc.gitlab.io/api/municipalities/148104000/barangays.json` — no auth,
`access-control-allow-origin: *` verified, JSON. All 21 match PSA exactly.
Vintage is dated (`last-modified: 2022-08-27`) so it lacks 2024 POPCEN figures.

**The 21 barangays with 2024 POPCEN population:** Badduat 1,087 · Baliwanan 439 ·
Bulu 573 · Dagara 528 · Dibagat 701 · Cabetayan 622 · Karagawan 612 · Kumao 513 ·
Laco 487 · Lenneng 2,709 *(old name Liyyeng)* · Lucab 652 · Luttuacan 1,070 ·
Madatag 916 · Madduang 603 · Magabta 187 · Maragat 418 · Musimut 846 ·
Nagbabalayan 374 · Poblacion 2,724 · Tuyangan 205 · Waga 159.

Codes run `1408104001`–`1408104022`. **`1408104003` is absent from both PSA and
psgc.gitlab.io** — 22 slots, 21 barangays. Cause undetermined; do not invent an
explanation.

**Difficulty: EASY.**

### 2.6 Project NOAH flood hazard — maps with no backend

`huggingface.co/datasets/bettergovph/project-noah-hazard-maps` — **ODbL**,
594 files, last modified 2026-04-11.

`PMTiles/layers/flood_100yr.pmtiles` verified end to end: PMTiles v3, MVT vector
tiles, zoom 0–14, layer `flood_100yr`, single attribute `Var` ∈ {1,2,3}
(susceptibility class), bbox covers Kabugao. **HTTP range requests work**
(`206`, `accept-ranges: bytes`) and the CDN sends `access-control-allow-origin: *`
— so MapLibre GL + `pmtiles.js` streams it directly, no backend, no 1 GB
download. Also `flood_5yr`, `flood_25yr`, `landslide`, `debris_flow`,
`storm_surge_ssa1–4`.

Province-clipped shapefiles for build-time clipping: `Flood/{5yr,25yr,100yr}/Apayao.zip`,
`Landslide/LandslideHazards/Apayao.zip`.

**Attribution required.** **Difficulty: EASY–MEDIUM.**

### 2.7 OpenStreetMap — local geography

Kabugao boundary = **relation 20429167** (`admin_level=6`, `ref=1408104000`,
`wikidata=Q30053`, `postal_code=3809`); town node 198512492. ODbL.

Town-centre bbox sample (3.0 MB via the OSM read API): 13,905 nodes, 1,386 ways
— `building` ×1,197, `power` ×117, `highway` ×60, `waterway` ×10, but
**`amenity` only ×6 and zero healthcare features**. Buildings and the power grid
are well mapped; POIs are thin; **health facilities are unmapped**.

Barangays exist as `place` nodes with PSGC `ref` and 2024 populations (verified
against PSA) — **but no barangay boundary polygons**. Mapped: Apayao–Ilocos
Norte Road, Conner–Kabugao Road, Kalinga–Kabugao; Apayao/Karagawan/Lacu/
Malabanig rivers; Malabanig and Tammang bridges; Kabugao Substation; Madarang
Shrine. Schools present: Kabugao Central School, Binuan ES, Iyapan Primary
(`ref=220023`), Laco ES, Magabta ES — currently the most reliable
machine-readable school list for Kabugao.

**Difficulty: EASY** (read API; Overpass was unreliable during research).

### 2.8 Open-Meteo — weather, climate, elevation

Already in production for the utility strip. Also verified: `/v1/elevation`
returns 132.0 m for Kabugao, and the ERA5 archive gives 2024 totals of
**2,720.5 mm precipitation, 25.87 °C mean**. No key, CORS by design.
Free for non-commercial use.

Do not mix ERA5 2024 with Wikipedia's 1,695 mm annual average — different period
and method.

**Difficulty: EASY.**

### 2.9 BetterGov Meilisearch + directory

`search2.bettergov.ph` indexes: `bettergov`, `bettergov_flood_control`,
`contractors`, `philgeps`, `philgeps_organizations`, `dpwh`. **Requires a bearer
token** that is not in any repo — the ecosystem's integration guide says to take
it from `transparency.bettergov.ph` via DevTools. Proxy it through a Cloudflare
Pages Function (as bettermeycauayan does) rather than shipping it in a `VITE_`
variable.

Kabugao's mayor and vice-mayor are already in
`bettergov/src/data/directory/lgu/cordillera-administrative-region.json`
(subject to the vice-mayor caution above), along with all 7 Apayao
municipalities and zip code 3809.

**Difficulty: MEDIUM** (token acquisition + proxy).

---

## 3. Tier 2 — real but manual, or licence-restricted

| Source | Kabugao status | Access | Difficulty |
|---|---|---|---|
| **COA Annual Audit Reports** — `coa.gov.ph/phocadownloadpap/userupload/annual_audit_report/LGUs/{YEAR}/CAR/Municipalities/Apayao/Kabugao_Apayao_ES{YEAR}.pdf` | **Confirmed** (2016 file indexed; coverage 2012–2023). Part II Observations = unliquidated cash advances, 20% Development Fund misuse, LDRRMF/SEF findings, procurement violations, Notices of Suspension/Disallowance. Part III = what the LGU ignored last year. | Manual download; Cloudflare blocks automation | MEDIUM — highest editorial value per hour |
| **PCAB contractor licences** — `pcab.construction.gov.ph/verify/` | **All 7 of Kabugao's contractors verified.** Current: R.S. SEPIAN (20519), CMG JR BUILDERS (41683), PRIME MASTER (43456), E.C.V. CONSTRUCTION (46688, expires 2026-08-27). Not in current licences (lapsed, **not** sanctioned): TAGEL (43554), OMENGAN (5119), PBO CONSTRUCTION (41870). `SuspendedLicenses` grid holds only 25 nationally; none are Kabugao's. **The `(41870)` number in DPWH contractor strings is the PCAB licence number** — a clean join key. | phpGrid JSON needs a PHP session cookie; **no CORS** → build-time only | MEDIUM |
| **PCAB JV registry** | `ProjectLocation` search for "Kabugao" returns a live JV: **JV-26-19627**, Isnag Builders & Dev't Corp / GKA Engineering, DPWH Apayao First Engineering District, valid to 2027-07-01. "Apayao" returns 19. | as above | MEDIUM |
| **OpenHalalan elections** — `RobertRLeung/OpenHalalan`, DOI 10.5281/zenodo.17783099 | 2001–2025, 1,642 municipalities. Winners CSV 13 MB + vote counts 42 MB (2010–2025). **ODbL.** Note: an independent academic project, **not** a BetterGov product. | Build-time fetch, filter PSGC 1408104000 | MEDIUM |
| **PSA Small Area Estimates (poverty)** | 2023 SAE posted 06 Feb 2026, XLSX keyed by PSGC; 2021 SAE covers 1,484 municipalities. Cloudflare blocked download during research — **a fresher 2023 figure than Wikidata's 19.11% (2021) almost certainly exists.** | Manual browser download | MEDIUM |
| **PSA PSGC HTML** — `psa.gov.ph/classification/psgc/barangays/1408104000` | Authoritative, **CC BY 4.0**, quarterly. Source of the 2024 POPCEN figures. | Cloudflare-blocks curl; scrape at build | MEDIUM |
| **DILG CAR regional site** — `car.dilg.gov.ph` | Ordinary WordPress, no blocking. Publishes Good Financial Housekeeping / SGLG passer lists **naming Kabugao** (passed 2023 and 2025). Best verifiable DILG-side source. In CAR's 2025 GFH round, 71 of 83 LGUs passed (85.5%); **Apayao was 100% in both cycles.** | Scrape / WP REST API | EASY |
| **DTI CMCI** — `cmci.dti.gov.ph/lgu-profile.php?lgu=Kabugao&year=2024` | Per-municipality competitiveness, 5 pillars. Data embedded in page JS; CSV is built client-side (no server endpoint). | Scrape | MEDIUM |
| **PAGASA climate normals** — `pubfiles.pagasa.dost.gov.ph` | Direct unauthenticated PDF download verified. **No PAGASA station in Apayao** — nearest normals are Tuguegarao (1991–2020). | PDF parse | MEDIUM |
| **Apayao provincial tourism** — `apayao.gov.ph/tourism/municipalities/kabugao` | Gololan Falls, Apayao River, Old Provincial Capitol. Describes Kabugao as the province's cultural melting pot of Isnag and Igorot culture. | Manual | EASY |
| **Glottolog** — `diba1241` | Records a dialect literally named **"Dibagat-Kabugao"** (level: Dialect). Isnag = ISO 639-3 `isd`, Glottolog `isna1241`. CC BY. | Manual | EASY |
| **UNESCO MAB — yApayaos Biosphere Reserve** | Designated **2024** (36th MAB-ICC, Agadir, 5 July 2024), 395,975 ha, population 119,184, centred 18.085 N / 121.1897 E — adjacent to Kabugao. Documents the Isneg **"Lapat"** customary resource-management system. **UNESCO does not name constituent municipalities — Kabugao's inclusion is NOT confirmed; do not assert it.** Date conflict: unesco.gov.ph says announced Feb 2026; prefer UNESCO's 2024. | Manual | EASY |

---

## 4. Tier 3 — false promises and dead ends

State these plainly on a methodology page. A volunteer must not build on them,
and citizens should know why the data is missing.

| Source | Reality |
|---|---|
| **PhilGEPS "Open Data"** | Seven embedded **Power BI dashboards**. Zero CSV/JSON/XLSX. The only file is a PDF bulletin. |
| **PhilGEPS "Standard Reports and Data Sheets"** | Renders *"No Record Found… 0 record(s) out of 0 total."* The facility exists and is empty. |
| **`data.philgeps.gov.ph`** | HTTP 522 — origin unreachable. Offline. |
| **PhilGEPS internal ASMX layer** | Every unauthenticated call returned HTTP 500. Gated, undocumented, unversioned. Notice pages are ASP.NET WebForms + ExtJS; automating means replaying `__VIEWSTATE`. |
| **data.gov.ph** | Angular SPA, **no public read API** — all CKAN endpoints return the HTML shell. The JS bundle contains only `/api/logout`, `/api/tag/create`, `/api/user/create`. It is a link directory to other portals. No LGU fiscal data. |
| **DBM per-LGU NTA** | **Does not exist.** LBM 94 (10 June 2026) Annex A is region-level by LGU tier only — no municipal row; "Kabugao" and "Apayao" appear nowhere in the text. PDFs are scanned with poor OCR. Get Kabugao's NTA from BLGF instead. |
| **DILG FDP Portal** | No API, no bulk download, **no per-LGU URL pattern** — and the host resets connections to non-browser clients. PDF only, transcribed by hand. Kabugao *is* almost certainly compliant (DILG certified its FDP posting twice via GFH) — but retrieval is manual. |
| **eFOI for LGU records** | **EO 2 s.2016 does not bind LGUs** — they are only "encouraged to observe" it. You cannot compel the Municipality of Kabugao through eFOI. Route requests to COA, BLGF, DBM, DILG, which *are* covered. Leverage over the LGU is the Full Disclosure Policy (non-compliance is a suspension/removal ground), not FOI. |
| **ICI flood-control final report** | **Not public.** ICI ceased operations 31 March 2026; release is with the Ombudsman/DOJ. Its FOI page 404s. No public ICI database exists. |
| **Blacklisted-contractor registry** | No public machine-readable list. DPWH announced blacklisting up to 60 contractors (Feb 2026); nothing published. GPPB's portal returns a 9 KB JS shell (probably login-gated); PhilGEPS's blacklist sits under buyer-coordinator help. |
| **Sumbong sa Pangulo** | Cloudflare-blocked, and **its coordinates are wrong.** For Kabugao's 23PB0017 the portal coordinate is **27.7 km** from the ArcGIS coordinate; the ArcGIS one lands 70 m from "Madduang Br." in DPWH's independent bridge inventory. **Use ArcGIS coordinates.** |
| **Project DIME** | `dime.gov.ph` has no public projects route; `/api/*` 404s; `projectdime.dbm.gov.ph` does not resolve. Effectively login-gated. |
| **DOH NHFR** | `www.nhfr.doh.gov.ph` fails TLS entirely; non-`www` returns 403. No API, no export. |
| **DepEd EBEIS** | POST-driven form, no municipality filter, masterlist PDF 403s. Login-gated. |
| **HazardHunterPH** | Laravel app, `/api` 404s, no JSON endpoints, needs session + POST. `api.georisk.gov.ph` refused connection. Per-point PDF tool only. |
| **DA farm-to-market roads / DepEd school buildings / LGSF-SBDP** | No public per-municipality datasets found. Partially covered where DPWH implements them (see 2.2). |

**Not tested at all — do not treat as absent:** DOH HFEP, NIA irrigation,
NEA/electric cooperatives, LWUA, DICT/NTC coverage, UP NOAH portal, NAMRIA and
Philippine Geoportal OGC endpoints, NCIP CADT records, PSA OpenSTAT bulk access.

**Confirmed absent / not found online:** any Kabugao municipal DRRM plan or
LCCAP; any NHCP historical marker or National Museum declaration in Kabugao; any
DOT-accredited establishment in Kabugao; any standalone Kabugao municipal
website hosting FDP documents (the LGU uses DICT's eLGU at
`elgu-kabugao-apayao.e.gov.ph`, which carries services but **no finance
disclosure**). The **province's** own FDP portal at
`apayao.gov.ph/full-disclosure-portal` renders **"No documents found"** — a
cautionary example of a disclosure portal that exists and holds nothing.

---

## 5. Query traps that silently produce wrong numbers

1. **`Municipality = 'KABUGAO'` returns ZERO.** The value is
   **`KABUGAO (CAPITAL) (APAYAO)`**.
2. **7 of Apayao's 34 flood-control records have `Municipality = NULL`**
   (₱319.6M). A municipality-only filter silently drops 16% of the province's
   money. Match `ProjectDescription` too.
3. **`api.dpwh.bettergov.ph` has no `municipality` parameter** — passing one is
   silently ignored and returns national totals.
4. **`search=Kabugao` over-matches**: the 301 rows include Calanasan and Conner
   projects on the *Claveria–Calanasan–Kabugao Road*. Breakdown: Apayao 1st DEO
   139, Apayao 2nd DEO 120, Upper Kalinga 7, Cagayan 2nd 11, CAR 23, MIMAROPA 1.
   Filter `location.province ∈ {Apayao 1st DEO, Apayao 2nd DEO}` **and** require
   `KABUGAO` in the description.
5. **`location.province` is a DEO name, not a province.**
6. **`amountPaid` is 0 for every record** — unpopulated, not "unpaid". Never
   render it as a payment figure.
7. **BLGF SRE says "In Php Million" but values are in pesos.**
8. **BLGF headers are merged across rows 7–11 with a leading blank column A** —
   naive parsing shifts every column by one.
9. **Sumbong sa Pangulo coordinates are unreliable** (see above).

---

## 6. Kabugao's six flood-control projects (verified, primary source)

| Contract | Yr | Project | ₱ Contract | Contractor(s) | Completed |
|---|---|---|---|---|---|
| 22PB0018 | 2022 | Apayao River FC, Sta. 82+292–82+592, Brgy. Nagbabalayan | 23,872,800 | TAGEL CORPORATION | 2022-11-28 |
| 22PB0023 | 2022 | Sicapo River FC, Sta. 88+632–88+932 (L/S) | 24,500,000 | OMENGAN CONSTRUCTION & DEV. CORP | 2023-04-30 |
| 22PB0024 | 2022 | Madduang River FC, Sta. 84+680–84+835 (B/S) | 24,500,000 | OMENGAN CONSTRUCTION & DEV. CORP | 2023-03-28 |
| 23PB0002 | 2023 | Badduat River FC revetment, Sta. 83+292–83+532 | 49,000,000 | TAGEL CORP / E.C.V. CONSTRUCTION | 2023-09-08 |
| 23PB0014 | 2023 | Badduat River FC revetment (upstream), Sta. 83+232–83+292 | 49,000,000 | CMG JR. BUILDERS / PRIME MASTER | 2023-12-07 |
| 23PB0017 | 2023 | Madduang River FC revetment, Sta. 88+535–88+680 / 89+133–89+633 | 49,000,000 | PBO CONSTRUCTION / R.S. SEPIAN | 2023-11-22 |

All: Apayao 1st DEO, Apayao–Abulug River Basin, 100% progress,
**₱219,872,800 total.** Award amounts run 2.5–5% below ABC (23PB0017: awarded
₱47,772,728.44 against ₱49,000,000 ABC, **1 bidder** — a JV of the two firms,
JV-23-9902).

**On the scandal:** none of the seven firms appear in the flood-control scandal
reporting searched, and none are on PCAB's suspended/revoked list. State this as
**"no evidence found"**, never as "cleared" — the ICI and Ombudsman files are
sealed, so absence of public evidence proves nothing.

---

## 7. What the ecosystem already solved, and what it never has

From reading all 17 repositories. The network converged on a
**filter-downstream** architecture: BetterGov hosts national datasets in
Meilisearch; each LGU portal queries them filtered to its own LGU and hosts no
national data. Documented in `docs/MEILISEARCH_INTEGRATION_GUIDE.md` (present in
betterlb, betteraklan, bettermeycauayan).

**Genuinely automated feeds exist for:** procurement (PhilGEPS via Meilisearch),
infrastructure (DPWH), weather, forex. The reference implementation is
**bettermeycauayan** — `functions/api/transparency/procurement.ts` +
`functions/utils/meilisearch-proxy.ts` (server-side filter, key never reaches
the browser).

**Manually curated per LGU, with no feed anywhere:** services / Citizens Charter,
department contacts, barangay officials, ordinances and resolutions, tourism,
local history, local hotlines, hazard maps, Annual Procurement Plan.

**The ecosystem has no hazard dataset at all** — no PAGASA, PHIVOLCS, NOAH or
GeoRisk integration in any of the 17 repos. The NOAH PMTiles route in §2.6 would
be **new to the network**, not just to Kabugao.

**Anti-pattern to avoid:** several portals hand-transcribe DPWH rows into YAML or
JSON (bettercabanatuan, betterbacolod, bettersolano, bettercalauan,
betterlaspinas) instead of querying the index. One even stores cost as the
string `'PHP 95,052,371.10'`. Query the source.

**The gap worth naming publicly:** the **20% Development Fund utilisation** —
the discretionary capital money, and arguably the most politically interesting
FDP document — is **not** in BLGF's per-LGU files. It exists only on the FDP
Portal or with the LGU. BLGF gives you the totals; FDPP gives you the
composition; there is no machine-readable path to the composition.

---

## 8. Sources

BLGF LGU Fiscal Data · DOF DO 074.2024 · COA AAR LGU index · DBM LBM 94 / 92 ·
DILG FDPP · DILG CAR (GFH/SGLG) · PhilGEPS notices + Open Data · data.gov.ph ·
data.bettergov.ph (datasets 5, 9, 19, 20, 23, 25) · DPWH ArcGIS Online org
`IwZZTMxZCmAmFYvF` · api.dpwh.bettergov.ph · huggingface.co/datasets/bettergovph/
{dpwh-transparency-data, project-noah-hazard-maps} · PCAB verification portal ·
PSA PSGC 1408104000 · PSA SAE 2021/2023 · psgc.gitlab.io · Wikidata Q30053 ·
OSM relation 20429167 / node 198512492 · Open-Meteo · OpenHalalan (Zenodo
10.5281/zenodo.17783099) · Rappler Kabugao 2025 · DTI CMCI · PAGASA pubfiles ·
UNESCO MAB yApayaos · Glottolog isna1241 / diba1241 · apayao.gov.ph tourism ·
Apayao Provincial Tourism Office · elgu-kabugao-apayao.e.gov.ph · eFOI +
FOI People's Manual · Sumbong sa Pangulo · ICI reporting (Inquirer, Rappler,
Philstar) · PhilAtlas Kabugao.
