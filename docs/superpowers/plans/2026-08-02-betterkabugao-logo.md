# BetterKabugao Logo Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create an editable BetterKabugao SVG logo system with a horizontal logo, standalone municipality mark, and favicon.

**Architecture:** Each deliverable is a self-contained SVG with the same named groups, flat color classes, and simplified Kabugao path. A dependency-free Node test defines the structural contract before the SVG files are created. Temporary raster previews are used only for visual review; the SVG files remain the source of truth.

**Tech Stack:** SVG, Node.js built-in test runner, PowerShell XML parsing, and the workspace-bundled Sharp renderer for temporary previews.

## Global Constraints

- Civic blue is exactly `#0032A0`.
- Sunrise yellow is exactly `#F2C81D`.
- Supporting ink is `#111827`; white is `#FFFFFF`.
- Use flat fills only: no gradients, shadows, filters, clipping effects, or 3D treatment.
- Do not embed raster images, base64 data, external fonts, or external stylesheets.
- Use the simplified Kabugao outline derived from the project owner's map reference.
- Use three short sunrise rays, not a government-style sun emblem.
- Keep the municipality outline, sunrise, and wordmark in named groups.
- The website header will use the standalone mark beside real HTML text.

## File Map

- `tests/brand-assets.test.mjs` — cross-platform structural contract for all three SVG assets.
- `public/brand/betterkabugao-mark.svg` — 160×160 standalone source mark.
- `public/brand/betterkabugao-logo.svg` — 640×160 horizontal logo with editable live-text wordmark.
- `public/favicon.svg` — 64×64 compact mark with no wordmark.
- `docs/superpowers/specs/2026-08-02-betterkabugao-logo-design.md` — implementation status and asset index.

---

### Task 1: Define the SVG asset contract

**Files:**
- Create: `tests/brand-assets.test.mjs`

**Interfaces:**
- Consumes: The three asset paths and requirements from the approved logo spec.
- Produces: A `node:test` suite that later tasks run by test name or as a whole.

- [ ] **Step 1: Write the failing structural tests**

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const definitions = {
  mark: {
    path: "../public/brand/betterkabugao-mark.svg",
    viewBox: "0 0 160 160",
    groups: ["sunrise", "kabugao-silhouette"],
  },
  logo: {
    path: "../public/brand/betterkabugao-logo.svg",
    viewBox: "0 0 640 160",
    groups: ["sunrise", "kabugao-silhouette", "wordmark"],
  },
  favicon: {
    path: "../public/favicon.svg",
    viewBox: "0 0 64 64",
    groups: ["sunrise", "kabugao-silhouette"],
  },
};

function loadSvg(relativePath) {
  const assetUrl = new URL(relativePath, import.meta.url);
  assert.ok(existsSync(assetUrl), `Expected SVG asset to exist: ${relativePath}`);
  return readFileSync(assetUrl, "utf8");
}

function assertCommonContract(svg, definition) {
  assert.match(svg, /<svg\b/);
  assert.match(svg, new RegExp(`viewBox=["']${definition.viewBox}["']`));
  assert.match(svg, /#0032A0/);
  assert.match(svg, /#F2C81D/);
  assert.doesNotMatch(
    svg,
    /<(?:image|foreignObject|filter|linearGradient|radialGradient)\b/i,
  );
  assert.doesNotMatch(svg, /(?:href|src)\s*=\s*["'](?:https?:|data:)/i);

  for (const group of definition.groups) {
    assert.match(svg, new RegExp(`id=["']${group}["']`));
  }
}

test("standalone mark follows the vector contract", () => {
  const svg = loadSvg(definitions.mark.path);
  assertCommonContract(svg, definitions.mark);
  assert.doesNotMatch(svg, /<text\b/i);
});

test("horizontal logo includes accessible editable wordmark", () => {
  const svg = loadSvg(definitions.logo.path);
  assertCommonContract(svg, definitions.logo);
  assert.match(svg, /<title[^>]*>BetterKabugao logo<\/title>/);
  assert.match(svg, /<desc[^>]*>.*Kabugao.*<\/desc>/);
  assert.match(svg, /<text\b[^>]*>BetterKabugao<\/text>/);
});

test("favicon follows the compact vector contract", () => {
  const svg = loadSvg(definitions.favicon.path);
  assertCommonContract(svg, definitions.favicon);
  assert.doesNotMatch(svg, /<text\b/i);
});
```

- [ ] **Step 2: Run the suite and confirm the red state**

Run: `node --test tests/brand-assets.test.mjs`

Expected: three failed tests with `AssertionError` messages confirming that none of the SVG assets exist yet.

- [ ] **Step 3: Commit the contract**

```bash
git add tests/brand-assets.test.mjs
git commit -m "test: define BetterKabugao brand asset contract"
```

### Task 2: Create the standalone Kabugao mark

**Files:**
- Create: `public/brand/betterkabugao-mark.svg`
- Test: `tests/brand-assets.test.mjs`

**Interfaces:**
- Consumes: The exact 17-point Kabugao outline and color contract below.
- Produces: A 160×160 mark reused visually by the horizontal logo and favicon.

- [ ] **Step 1: Run only the mark test and confirm it fails**

Run: `node --test --test-name-pattern="standalone mark" tests/brand-assets.test.mjs`

Expected: FAIL with an `AssertionError` for the missing `public/brand/betterkabugao-mark.svg` asset.

- [ ] **Step 2: Create the minimal standalone SVG**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
  <style>
    .bk-primary { fill: #0032A0; }
    .bk-accent { fill: #F2C81D; }
  </style>
  <g id="sunrise" class="bk-accent">
    <path d="M69 29 58 15 65 10 77 28Z" />
    <path d="M85 24V4h9v20Z" />
    <path d="m101 28 13-18 7 6-12 16Z" />
  </g>
  <g id="kabugao-silhouette" class="bk-primary">
    <path d="M88.8 23.5 97.7 24.1 102.4 54.8 144 97.4 133.6 122.9 112.3 111.5 106.5 112 75.8 120.8 58.7 136.5 51.9 132.8 37.9 135.4 34.2 129.7 32.1 108.9 16 95.9 36.3 95.3 49.8 79.7 80 24.6Z" />
  </g>
</svg>
```

- [ ] **Step 3: Run the targeted test and confirm the green state**

Run: `node --test --test-name-pattern="standalone mark" tests/brand-assets.test.mjs`

Expected: one passed test and two skipped tests.

- [ ] **Step 4: Commit the mark**

```bash
git add public/brand/betterkabugao-mark.svg
git commit -m "feat: add BetterKabugao standalone mark"
```

### Task 3: Create the horizontal logo

**Files:**
- Create: `public/brand/betterkabugao-logo.svg`
- Test: `tests/brand-assets.test.mjs`

**Interfaces:**
- Consumes: The same mark geometry and palette as Task 2.
- Produces: A 640×160 accessible lockup with editable `BetterKabugao` live text.

- [ ] **Step 1: Run only the horizontal-logo test and confirm it fails**

Run: `node --test --test-name-pattern="horizontal logo" tests/brand-assets.test.mjs`

Expected: FAIL with an `AssertionError` for the missing `public/brand/betterkabugao-logo.svg` asset.

- [ ] **Step 2: Create the horizontal SVG**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 160" role="img" aria-labelledby="logo-title logo-description">
  <title id="logo-title">BetterKabugao logo</title>
  <desc id="logo-description">A blue silhouette of Kabugao with three yellow sunrise rays beside the BetterKabugao name.</desc>
  <style>
    .bk-primary { fill: #0032A0; }
    .bk-accent { fill: #F2C81D; }
  </style>
  <g id="sunrise" class="bk-accent">
    <path d="M69 29 58 15 65 10 77 28Z" />
    <path d="M85 24V4h9v20Z" />
    <path d="m101 28 13-18 7 6-12 16Z" />
  </g>
  <g id="kabugao-silhouette" class="bk-primary">
    <path d="M88.8 23.5 97.7 24.1 102.4 54.8 144 97.4 133.6 122.9 112.3 111.5 106.5 112 75.8 120.8 58.7 136.5 51.9 132.8 37.9 135.4 34.2 129.7 32.1 108.9 16 95.9 36.3 95.3 49.8 79.7 80 24.6Z" />
  </g>
  <g id="wordmark" class="bk-primary">
    <text x="176" y="102" font-family="Inter, Noto Sans, Arial, sans-serif" font-size="56" font-weight="800" letter-spacing="-1.5">BetterKabugao</text>
  </g>
</svg>
```

- [ ] **Step 3: Run the targeted test and confirm the green state**

Run: `node --test --test-name-pattern="horizontal logo" tests/brand-assets.test.mjs`

Expected: one passed test and two skipped tests.

- [ ] **Step 4: Commit the horizontal logo**

```bash
git add public/brand/betterkabugao-logo.svg
git commit -m "feat: add BetterKabugao horizontal logo"
```

### Task 4: Create the favicon

**Files:**
- Create: `public/favicon.svg`
- Test: `tests/brand-assets.test.mjs`

**Interfaces:**
- Consumes: The same standalone mark, scaled into a square-safe 64×64 viewBox.
- Produces: A compact favicon with no wordmark.

- [ ] **Step 1: Run only the favicon test and confirm it fails**

Run: `node --test --test-name-pattern="favicon" tests/brand-assets.test.mjs`

Expected: FAIL with an `AssertionError` for the missing `public/favicon.svg` asset.

- [ ] **Step 2: Create the compact SVG**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <style>
    .bk-primary { fill: #0032A0; }
    .bk-accent { fill: #F2C81D; }
  </style>
  <g transform="matrix(.4 0 0 .4 0 3)">
    <g id="sunrise" class="bk-accent">
      <path d="M69 29 58 15 65 10 77 28Z" />
      <path d="M85 24V4h9v20Z" />
      <path d="m101 28 13-18 7 6-12 16Z" />
    </g>
    <g id="kabugao-silhouette" class="bk-primary">
      <path d="M88.8 23.5 97.7 24.1 102.4 54.8 144 97.4 133.6 122.9 112.3 111.5 106.5 112 75.8 120.8 58.7 136.5 51.9 132.8 37.9 135.4 34.2 129.7 32.1 108.9 16 95.9 36.3 95.3 49.8 79.7 80 24.6Z" />
    </g>
  </g>
</svg>
```

- [ ] **Step 3: Run the targeted test and confirm the green state**

Run: `node --test --test-name-pattern="favicon" tests/brand-assets.test.mjs`

Expected: one passed test and two skipped tests.

- [ ] **Step 4: Commit the favicon**

```bash
git add public/favicon.svg
git commit -m "feat: add BetterKabugao favicon"
```

### Task 5: Validate and visually review the logo system

**Files:**
- Modify after visual approval: `docs/superpowers/specs/2026-08-02-betterkabugao-logo-design.md`
- Verify: `tests/brand-assets.test.mjs`
- Verify: `public/brand/betterkabugao-mark.svg`
- Verify: `public/brand/betterkabugao-logo.svg`
- Verify: `public/favicon.svg`

**Interfaces:**
- Consumes: All SVG deliverables from Tasks 2–4.
- Produces: A fully verified logo system and an implementation record in the approved spec.

- [ ] **Step 1: Run the full structural suite**

Run: `node --test tests/brand-assets.test.mjs`

Expected: three passed tests and zero failures.

- [ ] **Step 2: Parse all SVG files as XML**

```powershell
$brandAssets = @(
  'public\brand\betterkabugao-mark.svg',
  'public\brand\betterkabugao-logo.svg',
  'public\favicon.svg'
)
foreach ($asset in $brandAssets) {
  $null = [xml](Get-Content -Raw $asset)
  Write-Output "XML_OK $asset"
}
```

Expected: three `XML_OK` lines and exit code 0.

- [ ] **Step 3: Run repository hygiene checks**

Run: `git diff --check`

Run: `node --test tests/brand-assets.test.mjs`

Expected: no whitespace errors and three passed tests.

- [ ] **Step 4: Render temporary PNG previews**

```powershell
$brandPreviewDir = Join-Path $env:TEMP 'betterkabugao-brand-previews'
$brandNodePath = 'C:\Users\Robin Tapiru\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\node_modules'
$brandNodeExe = 'C:\Users\Robin Tapiru\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
$env:NODE_PATH = $brandNodePath
$env:BRAND_PREVIEW_DIR = $brandPreviewDir
New-Item -ItemType Directory -Force -Path $brandPreviewDir | Out-Null

& $brandNodeExe -e "const fs=require('node:fs'); const sharp=require('sharp'); const output=process.env.BRAND_PREVIEW_DIR.replace(/\\/g,'/'); const mark='public/brand/betterkabugao-mark.svg'; const sizes=[16,32,48,160]; const jobs=sizes.map(size=>sharp(mark).resize(size,size).png().toFile(output+'/mark-'+size+'.png')); jobs.push(sharp('public/brand/betterkabugao-logo.svg').resize(1280,320).png().toFile(output+'/logo-1280x320.png')); const reversed=fs.readFileSync(mark,'utf8').replaceAll('#0032A0','#FFFFFF').replaceAll('#F2C81D','#FFFFFF'); jobs.push(sharp({create:{width:320,height:320,channels:4,background:'#0032A0'}}).composite([{input:Buffer.from(reversed),gravity:'center'}]).png().toFile(output+'/mark-reversed-on-blue.png')); Promise.all(jobs).then(()=>console.log('PREVIEWS_OK '+jobs.length));"
```

Expected: `PREVIEWS_OK 6`, four colored mark sizes, one horizontal logo, and one temporary white-on-blue reversed preview.

- [ ] **Step 5: Inspect and present the previews**

Open the 16-pixel, 48-pixel, 160-pixel, and horizontal PNG previews. Confirm that the Kabugao silhouette remains recognizable, the three rays remain separated, and the wordmark is not cropped. Present the horizontal and compact previews to the project owner and pause for visual approval.

- [ ] **Step 6: Record approval in the design spec**

After the project owner approves the rendered previews, change the status to:

```markdown
- **Status:** Approved and implemented
```

Append this exact section:

```markdown
## Assets

- [`public/brand/betterkabugao-logo.svg`](../../../public/brand/betterkabugao-logo.svg) — horizontal lockup
- [`public/brand/betterkabugao-mark.svg`](../../../public/brand/betterkabugao-mark.svg) — standalone mark
- [`public/favicon.svg`](../../../public/favicon.svg) — compact favicon
```

- [ ] **Step 7: Run the final verification and commit the record**

Run: `git diff --check`

Run: `node --test tests/brand-assets.test.mjs`

Expected: no whitespace errors and three passed tests.

```bash
git add docs/superpowers/specs/2026-08-02-betterkabugao-logo-design.md
git commit -m "docs: record BetterKabugao logo assets"
```

### Task 6: Acknowledge the BetterLGU maintainer note

**Files:**
- None.

**Interfaces:**
- Consumes: Visual approval of the completed logo and the maintainer comment on BetterLGU PR #147.
- Produces: One concise reply from `@KuyaLoy` on the merged pull request.

- [ ] **Step 1: Check that the planned reply is not already present**

Run:

```bash
gh pr view 147 --repo jmacj/better-lgu-directory --json comments --jq '.comments[] | select(.author.login == "KuyaLoy") | .body'
```

Expected: no existing comment with the exact reply below. If the exact reply already exists, do not post a duplicate and continue to Step 3.

- [ ] **Step 2: Post the approved reply**

```bash
gh pr comment 147 --repo jmacj/better-lgu-directory --body "Noted — I’ll use the repository’s PR template for future directory updates and include the full context and checklist.

I recently purchased betterkabugao.org and I’m currently creating a coming-soon page for the BetterKabugao portal. I’ll update this thread once the site is live so the remaining verification can be completed. Thank you!"
```

- [ ] **Step 3: Verify the reply**

Run:

```bash
gh pr view 147 --repo jmacj/better-lgu-directory --json comments --jq '.comments[-1] | {author: .author.login, body: .body, url: .url}'
```

Expected: author `KuyaLoy`, the approved two-paragraph update, and a GitHub comment URL. The `needs-verification` label remains until the domain serves the portal and a maintainer completes verification.
