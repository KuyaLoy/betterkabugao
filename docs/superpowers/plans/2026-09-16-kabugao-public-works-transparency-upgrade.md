# Public Works Watch Transparency Upgrade Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the source-linked Public Works Watch easier to inspect through status filtering, strong typed-money and contractor hierarchy, newest-first evidence order, and an accessible homepage mini-ledger.

**Architecture:** Keep the 13 existing records local. Add pure helpers for evidence date, source-derived section, status filter, sort, and latest-record selection. `ProjectsPage` consumes them for two labelled ledger sections; `HomePage` consumes them for three records. No historic candidate, map coordinate, runtime API, or aggregate is added.

**Tech Stack:** React 19, TypeScript 6, Vite SSR, Vitest + Testing Library, Node contracts, Playwright, existing BetterKabugao CSS.

**Spec:** `docs/superpowers/specs/2026-09-16-kabugao-public-works-transparency-upgrade-design.md`

## Global Constraints

- The 13 records remain a curated starter with their current official links and local CSV/JSON parity.
- Permitted statuses are only planned, ongoing, completed, cancelled, and not stated. Non-empty status retains its source date; none is a live assertion.
- Money values retain their exact type and are never summed, ranked, or called total project cost.
- A contractor is verified or explicitly unavailable; never inferred.
- The existing not-stated/appropriation entries form the **Historical appropriations** evidence section. The eight FY2015/FY2017 candidates are excluded because the committed audit still requires manual primary-row release review.
- No project pin until exact official WGS84 provenance and reuse clearance exist. Keep text location only.
- Preserve SSR, native controls, keyboard access, no 320px overflow, strict CSP, existing tokens, and reduced-motion rules.
- Witness every new test fail before production code. Run focused tests per task, exactly one final gate, and one `/projects` browser pass at mobile and desktop.
- This plan is not implementation authorization. Push only after a separate Command Center release approval.

## File Map

- `src/data/projects.ts`: presentation types and pure filter/sort helpers.
- `src/App.test.tsx`: data, route, and mini-ledger behavior tests.
- `src/pages/ProjectsPage.tsx`: status control and two evidence sections.
- `src/pages/HomePage.tsx`: three-record mini-ledger and conditional category buttons.
- `src/styles.css`: evidence hierarchy and responsive styles.
- `tests/site-contracts.test.mjs`: map/aggregate regression contract.
- `scripts/qa/projects.mjs`, `package.json`: targeted browser assertions only.
- `docs/sessions/2026-09-16-kabugao-public-works-transparency-upgrade.md`: implementation evidence and limits.

---

### Task 1: Pure evidence order and status filter

**Files:**
- Modify: `src/data/projects.ts`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Produces `ProjectSection = "project-register" | "historical-appropriations"`, `ProjectStatusFilter`, `projectSection`, `projectEvidenceDate`, `sortProjectsByEvidenceDate`, and `latestProjects`.
- Extends `ProjectFilters` with `status: ProjectStatusFilter`.

- [ ] **Step 1: Write the failing tests**

```ts
it("derives sections and newest-first evidence order", () => {
  expect(projectSection(PUBLIC_WORKS_PROJECTS.find((p) => p.officialRef === "23PB0017")!)).toBe("project-register");
  expect(projectSection(PUBLIC_WORKS_PROJECTS.find((p) => p.officialRef === "P00631689LZ")!)).toBe("historical-appropriations");
  expect(sortProjectsByEvidenceDate(PUBLIC_WORKS_PROJECTS).slice(0, 2).map((p) => p.fundingYear)).toEqual([2026, 2026]);
});

it("filters status without inferring a live result", () => {
  const shown = filterProjects(PUBLIC_WORKS_PROJECTS, { query: "", category: "all", fundingYear: "all", location: "all", status: "ongoing" });
  expect(shown.map((p) => p.officialRef)).toEqual(["22PB0002"]);
});
```

- [ ] **Step 2: Run the focused tests and verify failure**

Run: `npm.cmd run test:unit -- -t "derives sections|filters status"`

Expected: FAIL because the functions and filter field do not exist.

- [ ] **Step 3: Implement minimal helpers**

```ts
export type ProjectSection = "project-register" | "historical-appropriations";
export type ProjectStatusFilter = "all" | "planned" | "ongoing" | "completed" | "cancelled" | "not stated";
export const projectSection = (p: PublicWorksProject): ProjectSection =>
  p.status.kind === "not stated" ? "historical-appropriations" : "project-register";
export const projectEvidenceDate = (p: PublicWorksProject) =>
  p.status.kind === "reported" ? p.status.asOf : `${p.fundingYear ?? 0}-01-01`;
```

Sort a copied array descending by evidence date, then `officialRef ?? reviewKey`, then title. Extend `filterProjects` conjunctively: `not stated` matches `kind`; other statuses match reported `value`. `latestProjects` takes the first `count` of the sorted copy. Do not mutate the source array.

- [ ] **Step 4: Run and verify pass**

Run: `npm.cmd run test:unit -- -t "derives sections|filters status"`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/data/projects.ts src/App.test.tsx
git commit -m "feat: derive public works evidence filters"
```

### Task 2: Status-filterable two-section evidence ledger

**Files:**
- Modify: `src/pages/ProjectsPage.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes Task 1 helpers.
- Produces `Filter by status`, `Project register`, `Historical appropriations`, and record evidence fields.

- [ ] **Step 1: Write failing page tests**

```ts
it("filters the ledger by source-reported status", async () => {
  const user = userEvent.setup();
  renderAt("/projects");
  await user.selectOptions(screen.getByLabelText("Filter by status"), "ongoing");
  expect(screen.getByText(/ongoing \(as reported 2022-10-22\)/i)).toBeInTheDocument();
  expect(screen.queryByText(/Apayao River Flood Control/i)).not.toBeInTheDocument();
});

it("separates appropriation evidence and exposes unavailable contractor data", () => {
  renderAt("/projects");
  expect(screen.getByRole("heading", { name: "Historical appropriations" })).toBeInTheDocument();
  expect(screen.getAllByText("Contractor unavailable in the reviewed source").length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm.cmd run test:unit -- -t "filters the ledger|separates appropriation"`

Expected: FAIL because the control and groups are absent.

- [ ] **Step 3: Implement the smallest page change**

Add a native status select with exactly All statuses, Completed, Ongoing, Planned, Cancelled, Not stated. Pass it to `filterProjects`, sort, then partition with `projectSection`. Render the project register first and appropriation copy that says appropriations do not prove award, start, or completion. Add a labelled evidence strip beneath each title: source-dated status, each typed amount, contractor. Preserve explicit missing text and official links. Add no map and no FY2015/FY2017 rows.

- [ ] **Step 4: Run and verify pass**

Run: `npm.cmd run test:unit -- -t "filters the ledger|separates appropriation"`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/ProjectsPage.tsx src/App.test.tsx
git commit -m "feat: clarify public works evidence ledger"
```

### Task 3: Accessible homepage mini-ledger

**Files:**
- Modify: `src/pages/HomePage.tsx`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Consumes `latestProjects`, `projectSection`, and categories from Task 1.
- Produces exactly three newest project-register rows, source links, and category buttons only when the three rows differ by category.

- [ ] **Step 1: Write failing homepage tests**

```ts
it("shows three newest source-backed rows and a route action", () => {
  renderAt("/");
  const section = screen.getByRole("region", { name: /Latest source-backed records/i });
  expect(within(section).getAllByRole("article")).toHaveLength(3);
  expect(within(section).getByRole("link", { name: "View all Public Works Watch records" })).toHaveAttribute("href", "/projects");
  expect(within(section).getByText(/source-reported status is not a live completion check/i)).toBeInTheDocument();
});

it("switches preview categories only when categories differ", async () => {
  const user = userEvent.setup();
  renderAt("/");
  const section = screen.getByRole("region", { name: /Latest source-backed records/i });
  const road = within(section).queryByRole("button", { name: "roads/bridges" });
  if (road) await user.click(road);
  expect(within(section).getByRole("link", { name: "View all Public Works Watch records" })).toBeVisible();
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm.cmd run test:unit -- -t "shows three newest|switches preview"`

Expected: FAIL because the static card preview does not meet the mini-ledger contract.

- [ ] **Step 3: Implement bounded interaction**

Select `latestProjects(PUBLIC_WORKS_PROJECTS.filter((p) => projectSection(p) === "project-register"), 3)`. If the rows have more than one category, render `All shown` and category buttons with `aria-pressed`; selection filters only these three rows and never hides the route action. Each row shows source-dated status, one typed amount or explicit unavailable wording, contractor availability, and `Open official source`. No carousel, autoplay, animation, map, or aggregate.

- [ ] **Step 4: Run and verify pass**

Run: `npm.cmd run test:unit -- -t "shows three newest|switches preview"`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/pages/HomePage.tsx src/App.test.tsx
git commit -m "feat: add public works homepage mini-ledger"
```

### Task 4: Responsive evidence hierarchy and regression contracts

**Files:**
- Modify: `src/styles.css`
- Modify: `tests/site-contracts.test.mjs`
- Modify: `src/App.test.tsx`

**Interfaces:**
- Produces evidence-strip and mini-ledger classes, text-plus-colour statuses, typed money hierarchy, and map/aggregate safeguards.

- [ ] **Step 1: Write failing structural test**

```ts
it("keeps Public Works money typed, status labelled, and map-free", () => {
  renderAt("/projects");
  expect(screen.getByLabelText("Filter by status")).toBeInTheDocument();
  expect(document.querySelector(".projects__evidence")).not.toBeNull();
  expect(document.querySelector(".projects .map")).toBeNull();
  expect(screen.queryByText(/total project cost|total spend/i)).not.toBeInTheDocument();
});
```

- [ ] **Step 2: Run and verify failure**

Run: `npm.cmd run test:unit -- -t "keeps Public Works money typed"`

Expected: FAIL because `.projects__evidence` is absent.

- [ ] **Step 3: Implement CSS and contracts**

Add `.projects__section`, `.projects__evidence`, `.projects__status`, `.projects__amount`, `.projects__contractor`, and `.works-preview__ledger` rules. Use existing navy/gold/gray tokens; tabular money; square status keys with text; 44px buttons and visible focus. At 640px stack status, amount, contractor. Avoid pills, bento grids, gradients, glass, remote resources, and non-functional motion. Add static contract coverage that `/projects` remains map-free and has no aggregate-spend phrase.

- [ ] **Step 4: Run and verify pass**

Run: `npm.cmd run test:unit -- -t "keeps Public Works money typed"`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/styles.css tests/site-contracts.test.mjs src/App.test.tsx
git commit -m "feat: emphasize public works evidence"
```

### Task 5: Focused QA, durable handover, and separately approved release

**Files:**
- Modify: `scripts/qa/projects.mjs`
- Modify: `package.json` only if required
- Modify: `docs/sessions/2026-09-16-kabugao-public-works-transparency-upgrade.md`

**Interfaces:**
- Produces one report at 390px/1440px covering status, sections, mini-ledger, downloads, map absence, and overflow.

- [ ] **Step 1: Add failing browser assertions before implementation**

Add checks for status ongoing showing only `22PB0002`, source date, typed amount, contractor-unavailable text, both section headings, no `.projects .map`, CSV/JSON responses, and no overflow at both viewports. At one viewport, verify homepage three-row initial state, optional category button behavior, and persistent route action.

- [ ] **Step 2: Run and verify current script failure**

Run: `npm.cmd run build; npm.cmd run qa:projects`

Expected: FAIL because the new controls/markup do not exist.

- [ ] **Step 3: Update focused QA and handover note**

Keep exactly two project screenshots and one report. In the session note record commits, focused tests, final-gate result, browser result, status meanings, 13-row boundary, exclusion of FY2015/FY2017 candidates, and map/rights/FOI limitations.

- [ ] **Step 4: Run focused browser pass**

Run: `npm.cmd run build; npm.cmd run qa:projects`

Expected: PASS at 390px and 1440px.

- [ ] **Step 5: Run one final automated gate**

Run: `npm.cmd test; npm.cmd run typecheck; npm.cmd run lint; npm.cmd run build`

Expected: all exit 0; rerun only a failed gate after its fix.

- [ ] **Step 6: After separate release approval, check, commit, and push**

```bash
git diff --check
git add scripts/qa/projects.mjs package.json docs/sessions/2026-09-16-kabugao-public-works-transparency-upgrade.md docs/qa/checkpoint-projects
git commit -m "test: verify public works transparency upgrade"
gh auth switch --user KuyaLoy
git push origin main
git ls-remote origin refs/heads/main
```

Expected: only scoped files are staged and the remote SHA equals the final commit. Report SHA, tests, browser result, and source/map/FOI limits to Command Center, then stop.

## Self-review

- Tasks 1–2 cover status, date, section, source, money, contractor, and no-new-row rules; Task 3 covers the homepage interaction; Task 4 covers visual/accessibility safeguards; Task 5 covers QA, continuity, and release.
- The historic candidate gate is explicit: the existing report is not treated as an importable packet.
- All later task names match Task 1 interfaces. No placeholder, guessed coordinate, fabricated historic value, or unbounded test is present.
