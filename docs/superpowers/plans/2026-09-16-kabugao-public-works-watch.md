# Kabugao Public Works Watch Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a source-first `/projects` register and homepage preview for 13 manually reviewed Kabugao public-works records with deterministic search/filtering, provenance, downloads, and accessible static fallback.

**Architecture:** Keep the 13 records in one typed local module, derive validation/filtering from pure functions, and generate matching static CSV/JSON assets. Add a routed React page and a small homepage module using existing `PageHeader`, `metaFor`, `ALL_PATHS`, `SITEMAP_GROUPS`, and global shell patterns; use no runtime API, map, coordinates, or remote project media.

**Tech Stack:** React 19, TypeScript 6, React Router, Vite/SSR prerender, Vitest + Testing Library, Node `node:test`, ESLint, Playwright focused QA, existing BetterKabugao CSS tokens.

**Spec:** `docs/superpowers/specs/2026-09-16-kabugao-public-works-watch-design.md`

## Global Constraints

- The starter dataset is exactly 13 records with unique `officialRef` values; the six documented DPWH flood-control references are `22PB0018`, `22PB0023`, `22PB0024`, `23PB0002`, `23PB0014`, and `23PB0017`; copy the seven remaining approved research rows verbatim from the reviewed register.
- `category` uses only the ten controlled values in the spec and is explicitly derived, never an official source field.
- `amount.type` is always distinct: `FY appropriation`, `CW component appropriation`, `ABC`, or `awarded contract amount`; never aggregate or compare across types.
- `status` is source-reported with required ISO `statusAsOf`; never infer current, completed, delayed, abandoned, quality, legality, or value-for-money claims.
- Missing contractor data renders `Contractor unavailable in the reviewed source`; missing optional source data renders `Not stated in the reviewed source`.
- Official links are HTTPS primary-publisher links (DPWH, DBM, PhilGEPS, or procuring entity); BetterGov is discovery/cross-check only.
- No live API, scraper, map, coordinate, PDF/screenshot/logo/notice reproduction, or runtime remote data is introduced.
- Keep the exact site disclaimer and add the route-specific Public Works Watch clarification from the approved spec.
- Preserve static/prerendered output, keyboard access, reduced-motion standards, no 320px overflow, and existing site identity.
- Work in bounded 15–30 minute phases; use focused tests while developing, one final automated gate, and one focused browser pass at mobile + desktop maximum; no routine independent QA.
- Commit each task with a scoped message; stop after the approved MVP is committed, pushed, and minimally verified.

## File Map and Responsibilities

- Create `src/data/projects.ts` — `ProjectCategory`, `MoneyType`, `PublishedStatus`, `PublicWorksProject`, the 13-record `PUBLIC_WORKS_PROJECTS`, `validateProjects`, and deterministic filter helpers.
- Create `public/data/kabugao-public-works.csv` and `public/data/kabugao-public-works.json` — generated static exports from the typed array; no hand-edited divergent copy.
- Create `src/pages/ProjectsPage.tsx` — `/projects` heading, disclaimer clarification, controls, record list/table, source actions, empty/error states.
- Modify `src/App.tsx` — register `/projects` before the catch-all route.
- Modify `src/lib/seo.ts` — `/projects` metadata, breadcrumb label, `ALL_PATHS`, sitemap group, and any search index entry required by existing patterns.
- Modify `src/pages/HomePage.tsx` — exactly three source-linked preview cards and a crawlable View all projects link.
- Modify `src/styles.css` — scoped responsive project register/card/filter styles using existing tokens; no new remote fonts or inline colors.
- Modify `src/App.test.tsx` — route, data, search/filter, homepage, source, download, accessibility and fallback behavior tests.
- Modify `tests/site-contracts.test.mjs` only when a new route/data asset contract is required; retain strict source/network/security contracts.
- Modify `scripts/qa/projects.mjs` — one focused Playwright pass covering mobile/desktop controls, source links, download and empty state.
- Create `docs/sessions/YYYY-MM-DD-kabugao-public-works-watch.md` during implementation — values/source review date, decisions, tests, QA and push handover.

---

### Task 1: Typed register, provenance validation, and static exports

**Files:**
- Create: `src/data/projects.ts`
- Create: `public/data/kabugao-public-works.csv`
- Create: `public/data/kabugao-public-works.json`
- Test: `src/App.test.tsx` (new `Public Works data contract` block)
- Test: `tests/site-contracts.test.mjs` (static asset parity contract if needed)

**Interfaces:**
- Produces `PublicWorksProject`, `ProjectCategory`, `MoneyType`, `PublishedStatus`, `PUBLIC_WORKS_PROJECTS`, `validateProjects(projects): { valid: true } | { valid: false; errors: string[] }`, `searchProjects(projects, needle): readonly PublicWorksProject[]`, and `filterProjects(projects, filters): readonly PublicWorksProject[]`.
- `filters` is `{ query: string; category: ProjectCategory | "all"; fundingYear: number | "all"; location: string | "all" }`.

- [ ] **Step 1: Write the failing data-contract test.**

```ts
it("contains exactly 13 source-valid projects and preserves typed money/status", () => {
  expect(validateProjects(PUBLIC_WORKS_PROJECTS)).toEqual({ valid: true });
  expect(PUBLIC_WORKS_PROJECTS).toHaveLength(13);
  expect(new Set(PUBLIC_WORKS_PROJECTS.map((row) => row.officialRef)).size).toBe(13);
  expect(PUBLIC_WORKS_PROJECTS.find((row) => row.officialRef === "23PB0017")?.amount?.type).toBe("awarded contract amount");
  expect(PUBLIC_WORKS_PROJECTS.find((row) => row.officialRef === "23PB0017")?.statusAsOf).toMatch(/^2023-/);
});
```

- [ ] **Step 2: Run the focused test and verify the intentional failure.**

Run: `npm.cmd run test:unit -- -t "contains exactly 13 source-valid projects"`
Expected: FAIL because `src/data/projects.ts` and `validateProjects` do not exist yet.

- [ ] **Step 3: Implement the typed register and validator.** Copy all 13 approved rows from the reviewed research register. Store the six documented flood-control rows with their exact DPWH references/titles and do not invent the seven non-flood-control rows. Implement validator checks for count 13, unique refs, controlled category/status/money values, required non-empty fields, HTTPS primary URLs, ISO dates, PHP currency, numeric amounts, no coordinates, and no duplicate composite identity.

- [ ] **Step 4: Implement pure search/filter helpers.** Normalize query text with trim + lowercase; search exact fields named in the spec; apply category, year, and published-location filters conjunctively; return input order unchanged for deterministic output.

- [ ] **Step 5: Generate matching CSV/JSON exports.** Include every interface field, preserve empty optional values as empty/null, quote CSV safely, and write both assets from `PUBLIC_WORKS_PROJECTS` using a repository script or a deterministic one-off generator that is committed only through its generated outputs.

- [ ] **Step 6: Run the focused test and verify the pass.**

Run: `npm.cmd run test:unit -- -t "contains exactly 13 source-valid projects"`
Expected: PASS; the test reports one passing test.

- [ ] **Step 7: Commit the self-contained data foundation.**

```bash
git add src/data/projects.ts public/data/kabugao-public-works.csv public/data/kabugao-public-works.json src/App.test.tsx tests/site-contracts.test.mjs
git commit -m "feat: add validated public works register"
```

### Task 2: Route, metadata, sitemap, and site search wiring

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/lib/seo.ts`
- Modify: `src/lib/search.ts` if the existing static search index requires a `/projects` entry
- Test: `src/App.test.tsx` (`projects route and metadata`)

**Interfaces:**
- Consumes `ProjectsPage` from Task 3 and the existing `metaFor`, `ALL_PATHS`, `SITEMAP_GROUPS`, and `searchSite` patterns.
- Produces a prerenderable `/projects` route, canonical `https://betterkabugao.org/projects`, breadcrumb label `Public works`, and one sitemap link.

- [ ] **Step 1: Write the failing route contract.**

```ts
it("exposes a prerenderable Public Works Watch route", () => {
  renderAt("/projects");
  expect(screen.getByRole("heading", { level: 1, name: /public works watch/i })).toBeInTheDocument();
  expect(ALL_PATHS).toContain("/projects");
  expect(metaFor("/projects").canonical).toBe("https://betterkabugao.org/projects");
});
```

- [ ] **Step 2: Run the focused test and verify it fails.**

Run: `npm.cmd run test:unit -- -t "prerenderable Public Works Watch route"`
Expected: FAIL because the route and metadata entry are absent.

- [ ] **Step 3: Register the route and metadata.** Add the import and `<Route path="/projects" element={<ProjectsPage />} />` before the catch-all. Add `SEGMENT_LABELS`, `STATIC_META`, `ALL_PATHS`, sitemap label/group, and an indexable description that says the records are selected, source-linked public records rather than live status.

- [ ] **Step 4: Wire existing site search.** Add one `kind: "project"` result per record using the same result shape and scoring convention as `src/lib/search.ts`; link each result to `/projects` with a useful label. Do not add a network request.

- [ ] **Step 5: Run the focused test and verify the pass.**

Run: `npm.cmd run test:unit -- -t "prerenderable Public Works Watch route"`
Expected: PASS.

- [ ] **Step 6: Commit routing and metadata.**

```bash
git add src/App.tsx src/lib/seo.ts src/lib/search.ts src/App.test.tsx
git commit -m "feat: route public works watch"
```

### Task 3: `/projects` accessible register and deterministic controls

**Files:**
- Create: `src/pages/ProjectsPage.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes `PUBLIC_WORKS_PROJECTS`, `searchProjects`, `filterProjects`, `ProjectCategory`, and existing `PageHeader`/`metaFor` conventions.
- Produces labelled controls, a result-count status region, 13 accessible records, source links, local CSV/JSON downloads, explicit missing values, duplicate warnings, and no-result/error fallbacks.

- [ ] **Step 1: Write failing interaction tests.**

```ts
it("filters projects by category, year, location, and text together", async () => {
  const user = userEvent.setup();
  renderAt("/projects");
  await user.selectOptions(screen.getByLabelText("Filter by category"), "flood control/drainage");
  await user.selectOptions(screen.getByLabelText("Filter by funding year"), "2023");
  await user.type(screen.getByLabelText("Search projects"), "Badduat");
  expect(screen.getByRole("status")).toHaveTextContent(/1 project/i);
  expect(screen.getByText("23PB0002")).toBeInTheDocument();
  expect(screen.queryByText("22PB0018")).not.toBeInTheDocument();
});

it("shows explicit empty and unavailable-source states", async () => {
  const user = userEvent.setup();
  renderAt("/projects");
  await user.type(screen.getByLabelText("Search projects"), "no such Kabugao project");
  expect(screen.getByText("No projects match those filters.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Clear filters" })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the focused tests and verify failure.**

Run: `npm.cmd run test:unit -- -t "filters projects by category|shows explicit empty"`
Expected: FAIL because `ProjectsPage` and its controls do not exist.

- [ ] **Step 3: Implement the page shell.** Use `PageHeader` and existing `main`/footer shell. Add the exact route clarification: “Public Works Watch is a manually reviewed reference to published records. It does not certify completion, quality, legality, procurement compliance, or current status.” Keep the site-wide disclaimer through `SiteFooter`; do not duplicate or weaken it.

- [ ] **Step 4: Implement controlled, labelled filters.** Use `useState` for query/category/year/location, native `<label>` + `<input>`/`<select>`, a Clear filters button, and `useMemo` to call pure helpers. Announce `{shown} of 13 projects` in `role="status"`; preserve full-register count for empty results.

- [ ] **Step 5: Implement record rendering.** Show exact title, official ref, derived category label, published location, implementing/procuring office, contractor or the exact unavailable phrase, each typed amount separately, funding year/source, `Status: [value] (as reported [statusAsOf])`, scheduled dates only when present, accessed/reviewed dates, source/terms note, and descriptive HTTPS official link. Render a “Possible related phase — check the source” warning only for validator-detected overlap.

- [ ] **Step 6: Add download and static fallback links.** Render `Download CSV` to `/data/kabugao-public-works.csv` and `Download JSON` to `/data/kabugao-public-works.json` with `download` attributes. Keep all 13 records and links in server-rendered markup; no loading spinner or API error path is needed for local data. If a validator error is surfaced, show the record/field error and do not claim a complete register.

- [ ] **Step 7: Run the focused tests and verify the pass.**

Run: `npm.cmd run test:unit -- -t "filters projects by category|shows explicit empty"`
Expected: PASS.

- [ ] **Step 8: Commit the page behavior.**

```bash
git add src/pages/ProjectsPage.tsx src/App.test.tsx
git commit -m "feat: add public works register controls"
```

### Task 4: Homepage three-record preview

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes `PUBLIC_WORKS_PROJECTS` and the existing homepage task/index patterns.
- Produces exactly three source-linked cards, each with title, location, typed amount when present, status-as-of wording, a short manually reviewed note, and a crawlable `/projects` link.

- [ ] **Step 1: Write the failing homepage test.**

```ts
it("shows exactly three source-linked public works previews", () => {
  renderAt("/");
  const section = screen.getByRole("region", { name: "What’s being built in Kabugao?" });
  expect(within(section).getAllByRole("article")).toHaveLength(3);
  expect(within(section).getByRole("link", { name: "View all projects" })).toHaveAttribute("href", "/projects");
  expect(within(section).getAllByRole("link", { name: /official source/i })).toHaveLength(3);
});
```

- [ ] **Step 2: Run it and verify failure.**

Run: `npm.cmd run test:unit -- -t "three source-linked public works previews"`
Expected: FAIL because the homepage module is absent.

- [ ] **Step 3: Implement the module.** Select three deterministic records from the approved array; do not calculate a total or use a status badge implying currency. Use `<section aria-labelledby>`, `<article>`, exact source-reported wording, and descriptive external links with `target="_blank"` + `rel="noreferrer"`.

- [ ] **Step 4: Run the test and verify pass.**

Run: `npm.cmd run test:unit -- -t "three source-linked public works previews"`
Expected: PASS.

- [ ] **Step 5: Commit the homepage module.**

```bash
git add src/pages/HomePage.tsx src/App.test.tsx
git commit -m "feat: preview public works on homepage"
```

### Task 5: Responsive accessible styling and static quality contracts

**Files:**
- Modify: `src/styles.css`
- Modify: `tests/site-contracts.test.mjs`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes the rendered class names from `ProjectsPage` and the homepage module.
- Produces BetterKabugao-token styling, 320px-safe responsive layouts, visible focus, readable tables/cards, reduced-motion neutrality, and contracts for source/network/download rules.

- [ ] **Step 1: Write failing structural/style tests.** Assert `/projects` has one H1, labelled search/select controls, source links with HTTPS, both download links, the exact disclaimer clarification, and no coordinate/map text; assert the stylesheet contains every new class and no `min-width: 320px`.

- [ ] **Step 2: Run the focused test and verify the failure.**

Run: `npm.cmd run test:unit -- -t "projects accessibility"`
Expected: FAIL until the page classes and required labels are present.

- [ ] **Step 3: Add scoped CSS.** Use existing navy/gold/sand/gray variables; desktop may use a table and mobile must stack records or allow only an internal, accessible table scroll without page overflow. Keep focus outlines, source links visibly distinct, and no motion requirement for filtering.

- [ ] **Step 4: Add/extend contracts.** Verify the local CSV/JSON paths, 13-record parity, no runtime project fetch, no map/coordinates, no aggregate money wording, and the route in prerender/sitemap lists. Keep strict CSP and Cloudflare handling unchanged.

- [ ] **Step 5: Run the focused test and verify pass.**

Run: `npm.cmd run test:unit -- -t "projects accessibility"`
Expected: PASS.

- [ ] **Step 6: Commit styling/contracts.**

```bash
git add src/styles.css src/App.test.tsx tests/site-contracts.test.mjs
git commit -m "feat: make public works watch responsive and verifiable"
```

### Task 6: Focused browser QA and handover record

**Files:**
- Create: `scripts/qa/projects.mjs`
- Create: `docs/sessions/2026-09-16-kabugao-public-works-watch.md`
- Modify: `package.json` (`qa:projects` script)
- Modify: `src/App.test.tsx` only for a missing browser-discovered assertion

**Interfaces:**
- Consumes the built `dist`, `scripts/qa/serve.mjs`, and the `/projects` route.
- Produces one QA report/evidence set for mobile (390px) and desktop (1440px), with no repeated full-site sweep.

- [ ] **Step 1: Write the focused browser assertions before the script implementation.** The script must check HTTP/static visibility of 13 records, text search, category/year/location filters together, Clear filters, source link HTTPS targets, CSV/JSON responses, keyboard focus, empty state, homepage three-card entry, and no horizontal overflow at 390px/1440px.

- [ ] **Step 2: Run the not-yet-implemented script and verify the intentional failure.**

Run: `npm.cmd run build; npm.cmd run qa:projects`
Expected: FAIL with the package script or `scripts/qa/projects.mjs` missing.

- [ ] **Step 3: Implement one bounded Playwright pass.** Start the existing static server, create one context per viewport, record named checks, save only project-specific screenshots/report, and close the browser/server in `finally`. Do not inspect Cloudflare or rerun unrelated route QA.

- [ ] **Step 4: Write the handover log.** Record the selected 13-record source review date, authoritative URLs, BetterGov discovery-only rule, exact money/status rules, no-coordinate decision, changed files, focused test output, final gate output, browser report, and next quarterly review date.

- [ ] **Step 5: Run the focused browser pass and verify pass.**

Run: `npm.cmd run build; npm.cmd run qa:projects`
Expected: all named checks PASS at 390px and 1440px; no horizontal overflow; report exits 0.

- [ ] **Step 6: Commit QA and handover.**

```bash
git add scripts/qa/projects.mjs package.json docs/qa/checkpoint-projects docs/sessions/2026-09-16-kabugao-public-works-watch.md
git commit -m "test: verify public works watch surface"
```

### Task 7: One final automated gate, review, and release

**Files:**
- No new production files; review the task commits and generated assets.

**Interfaces:**
- Consumes all outputs from Tasks 1–6.
- Produces one pushed `main` release and a concise Command Center handoff with commit/SHA, test counts, browser report, and any concrete blocker.

- [ ] **Step 1: Review the approved spec against the implementation.** Confirm every acceptance criterion: homepage exactly three; `/projects` exactly 13; all filters; typed fields/invariants; source/disclaimer; CSV/JSON; empty/missing/error behavior; no inference; no map; quarterly/monthly review cadence; duplicate warning; static fallback; no aggregate money total.

- [ ] **Step 2: Run exactly one final automated gate.**

Run: `npm.cmd test; npm.cmd run typecheck; npm.cmd run lint; npm.cmd run build`
Expected: contracts and unit tests pass, TypeScript exits 0, ESLint exits 0, production build/prerender exits 0.

- [ ] **Step 3: Check the final diff and stage only approved implementation files.**

Run: `git diff --check`
Expected: no whitespace errors. Preserve unrelated dirty/untracked files.

- [ ] **Step 4: Commit the release if the task commits were intentionally squashed.** Use `feat: add Kabugao Public Works Watch` and include only the files listed in this plan; otherwise retain the scoped task commits.

- [ ] **Step 5: Push directly to `origin/main` under `KuyaLoy`.** Verify `git ls-remote origin refs/heads/main` equals the pushed commit. Do not weaken CSP/DDoS or perform another QA department handoff.

- [ ] **Step 6: Send the Command Center handoff and stop.** Include the plan/implementation paths, final SHA, exact gate result, one browser report result, source/data caveats, and no additional feature work.

## Self-review checklist

- The plan maps every spec section to a numbered task and names existing project patterns before new files.
- All interfaces and filter names are defined once and reused consistently.
- Money types, status-as-of wording, source authority, contractor absence, no-coordinate rule, and duplicate phases are explicit in data, UI, tests, and acceptance steps.
- No production implementation is included in this document; code snippets are test examples only.
- Search confirms every step is concrete, bounded, and free of unresolved instructions.
- The final gate is singular, browser QA is singular and focused, and unrelated QA/screenshots/research are explicitly excluded.
