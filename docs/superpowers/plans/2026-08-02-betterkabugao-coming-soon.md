# BetterKabugao Coming-Soon Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a production-ready, animated, accessible, and SEO-aware BetterKabugao coming-soon page that compiles to a static `dist` directory.

**Architecture:** Use a small React and TypeScript application built by Vite. Keep all public copy in one typed content module, compose the page from focused semantic components, reuse the approved SVG groups through same-origin `<use>` references, and isolate parallax math in a pure utility. Tailwind CSS provides the reset and design tokens; a focused stylesheet carries the bespoke editorial layout and motion.

**Tech Stack:** Node.js 22, npm, React, TypeScript, Vite, Tailwind CSS v4 with `@tailwindcss/vite`, Vitest, Testing Library, ESLint, Cloudflare Pages-compatible static assets

## Global Constraints

- Use the approved palette exactly: civic blue `#0032A0`, sunrise yellow `#F2C81D`, ink `#111827`, and white `#FFFFFF`.
- The visible status is exactly **Coming soon**; do not add a countdown or estimated launch date.
- The headline is exactly **Kabugao information, made clearer**.
- Do not collect email addresses or other personal information.
- State that BetterKabugao is an independent civic initiative and not the official Municipality of Kabugao website.
- Reuse `public/brand/betterkabugao-mark.svg`; do not copy its path data into React.
- Core content must remain understandable with reduced motion and through the `noscript` fallback.
- Build with `npm run build`; the deployment output is exactly `dist`.
- Canonical production URL is `https://betterkabugao.org/`.
- Keep the AI assistant, full portal routes, analytics, forms, database, and language switching out of this launch.
- Preserve the existing untracked `docs/superpowers/specs/2026-08-02-betterkabugao-design.md`; it is not part of this implementation.

## File Map

- `package.json` and `package-lock.json` — dependency lock and reproducible scripts.
- `.node-version` — Cloudflare/local Node version pin.
- `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json` — browser and tooling type boundaries.
- `vite.config.ts` — React, Tailwind, and Vitest configuration.
- `eslint.config.js` — flat ESLint configuration.
- `index.html` — document shell, SEO metadata, and no-JavaScript fallback.
- `src/app/site-content.ts` — the only source of visible page copy and theme-card data.
- `src/components/SiteHeader.tsx` — brand header.
- `src/components/LaunchHero.tsx` — status, headline, summary, and actions.
- `src/components/BrandArtwork.tsx` — reusable SVG groups and pointer interaction.
- `src/components/BuildThemes.tsx` — three project themes.
- `src/components/SiteFooter.tsx` — independence disclaimer and project link.
- `src/lib/parallax.ts` — pure pointer-to-offset calculation.
- `src/App.tsx` — page composition and landmarks.
- `src/main.tsx` — React entry point.
- `src/styles.css` — Tailwind import, tokens, responsive layout, and motion rules.
- `src/test/setup.ts` — Testing Library matchers.
- `src/App.test.tsx` — semantic content and accessibility contract.
- `src/components/BrandArtwork.test.tsx` — interaction contract.
- `scripts/render-social-card.mjs` — deterministic 1200×630 raster social card generated from the approved horizontal SVG.
- `tests/site-contracts.test.mjs` — foundation, stylesheet, SEO, and documentation contracts.
- `public/robots.txt`, `public/sitemap.xml`, `public/_headers` — crawler and Cloudflare static configuration.
- `README.md` — local development and Cloudflare build settings.
- `docs/superpowers/specs/2026-08-02-betterkabugao-coming-soon-design.md` — approval and implementation record.

---

### Task 1: Create the tested Vite, React, and Tailwind foundation

**Files:**
- Create: `tests/site-contracts.test.mjs`
- Create: `package.json`
- Create: `package-lock.json`
- Create: `.node-version`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `vite.config.ts`
- Create: `eslint.config.js`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/styles.css`
- Create: `src/test/setup.ts`
- Test: `tests/site-contracts.test.mjs`

**Interfaces:**
- Consumes: Node.js `22.14.0` and the existing brand-asset test suite.
- Produces: `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, and `npm test`; a minimal mountable `App` for Task 2.

- [ ] **Step 1: Write the failing foundation contract**

Create `tests/site-contracts.test.mjs`:

```js
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import test from "node:test";

const root = new URL("../", import.meta.url);

function load(relativePath) {
  const fileUrl = new URL(relativePath, root);
  assert.ok(existsSync(fileUrl), `Expected project file: ${relativePath}`);
  return readFileSync(fileUrl, "utf8");
}

test("project foundation exposes reproducible quality scripts", () => {
  const packageJson = JSON.parse(load("package.json"));

  assert.equal(packageJson.name, "betterkabugao");
  assert.equal(packageJson.private, true);
  assert.equal(packageJson.type, "module");
  assert.equal(packageJson.engines.node, ">=22.12.0 <23");
  assert.equal(packageJson.scripts.build, "tsc -b && vite build");
  assert.equal(packageJson.scripts.lint, "eslint .");
  assert.equal(packageJson.scripts.typecheck, "tsc -b --pretty false");
  assert.equal(packageJson.scripts["test:contracts"], "node --test tests/brand-assets.test.mjs tests/site-contracts.test.mjs");
  assert.equal(packageJson.scripts["test:unit"], "vitest run");
  assert.equal(packageJson.scripts.test, "npm run test:contracts && npm run test:unit");
  assert.equal(packageJson.scripts["brand:social"], "node scripts/render-social-card.mjs");
});

test("Vite loads React and the Tailwind v4 plugin", () => {
  const config = load("vite.config.ts");
  assert.match(config, /react\(\)/);
  assert.match(config, /tailwindcss\(\)/);
  assert.match(config, /environment:\s*["']jsdom["']/);
  assert.match(config, /setupFiles:\s*["']\.\/src\/test\/setup\.ts["']/);
});

test("the project pins the validated Node release", () => {
  assert.equal(load(".node-version").trim(), "22.14.0");
});
```

- [ ] **Step 2: Run the contract and confirm the RED state**

Run: `node --test tests/site-contracts.test.mjs`

Expected: three failed tests with explicit `Expected project file` assertion messages because the foundation does not exist yet.

- [ ] **Step 3: Initialize npm and install the current packages**

Run:

```powershell
npm.cmd init -y
npm.cmd install react react-dom
npm.cmd install -D typescript vite @vitejs/plugin-react tailwindcss @tailwindcss/vite eslint @eslint/js globals typescript-eslint eslint-plugin-react-hooks eslint-plugin-react-refresh vitest jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/node @types/react @types/react-dom sharp
```

Expected: `package.json` and `package-lock.json` exist; npm exits 0.

- [ ] **Step 4: Set the exact package metadata and scripts**

Keep the dependency ranges written by npm. Set the package metadata and scripts mechanically so the dependency objects remain intact:

```powershell
npm.cmd pkg set "name=betterkabugao" "version=0.1.0" "type=module"
npm.cmd pkg set private=true --json
npm.cmd pkg set "engines.node=>=22.12.0 <23"
npm.cmd pkg set "scripts.dev=vite" "scripts.build=tsc -b && vite build" "scripts.lint=eslint ." "scripts.preview=vite preview"
npm.cmd pkg set "scripts.typecheck=tsc -b --pretty false" "scripts.test:contracts=node --test tests/brand-assets.test.mjs tests/site-contracts.test.mjs"
npm.cmd pkg set "scripts.test:unit=vitest run" "scripts.test=npm run test:contracts && npm run test:unit" "scripts.brand:social=node scripts/render-social-card.mjs"
```

- [ ] **Step 5: Create the TypeScript and Vite configuration**

Create `.node-version`:

```text
22.14.0
```

Create `tsconfig.json`:

```json
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

Create `tsconfig.app.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2022",
    "useDefineForClassFields": true,
    "lib": ["ES2022", "DOM", "DOM.Iterable"],
    "allowJs": false,
    "skipLibCheck": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "noUnusedLocals": true,
    "noUnusedParameters": true
  },
  "include": ["src"]
}
```

Create `tsconfig.node.json`:

```json
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2023",
    "lib": ["ES2023"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "skipLibCheck": true,
    "types": ["node"]
  },
  "include": ["vite.config.ts", "eslint.config.js"]
}
```

Create `vite.config.ts`:

```ts
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
});
```

- [ ] **Step 6: Create ESLint, the document shell, and the minimal app**

Create `eslint.config.js`:

```js
import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2022,
      globals: globals.browser,
    },
  },
]);
```

Create `index.html`:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>BetterKabugao</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

Create `src/main.tsx`:

```tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("BetterKabugao root element was not found");
}

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
```

Create `src/App.tsx`:

```tsx
export function App() {
  return <main id="main-content" />;
}
```

Create `src/styles.css`:

```css
@import "tailwindcss";
```

Create `src/test/setup.ts`:

```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 7: Verify the GREEN foundation**

Run:

```powershell
node --test tests/site-contracts.test.mjs
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
```

Expected: three contract tests pass; typecheck, lint, and build exit 0; `dist/index.html` exists.

- [ ] **Step 8: Commit the foundation**

```bash
git add .node-version package.json package-lock.json tsconfig.json tsconfig.app.json tsconfig.node.json vite.config.ts eslint.config.js index.html src/main.tsx src/App.tsx src/styles.css src/test/setup.ts tests/site-contracts.test.mjs
git commit -m "build: scaffold BetterKabugao launch page"
```

---

### Task 2: Build the semantic coming-soon page

**Files:**
- Create: `src/App.test.tsx`
- Create: `src/app/site-content.ts`
- Create: `src/components/SiteHeader.tsx`
- Create: `src/components/LaunchHero.tsx`
- Create: `src/components/BrandArtwork.tsx`
- Create: `src/components/BuildThemes.tsx`
- Create: `src/components/SiteFooter.tsx`
- Modify: `src/App.tsx`
- Test: `src/App.test.tsx`

**Interfaces:**
- Consumes: `App` mount point and `/brand/betterkabugao-mark.svg` from Task 1/existing assets.
- Produces: `siteContent`, five semantic page components, and the complete static reading order used by later styling and motion tasks.

- [ ] **Step 1: Write the failing semantic page test**

Create `src/App.test.tsx`:

```tsx
import { render, screen, within } from "@testing-library/react";
import { App } from "./App";

describe("BetterKabugao launch page", () => {
  it("presents the approved message and accessible landmarks", () => {
    render(<App />);

    expect(screen.getByRole("link", { name: /skip to main content/i })).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByText("Coming soon")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Kabugao information, made clearer" })).toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("shows exactly three launch themes", () => {
    render(<App />);
    const region = screen.getByRole("region", { name: "What we’re building" });
    expect(within(region).getAllByRole("article")).toHaveLength(3);
    expect(within(region).getByRole("heading", { name: "Services and contacts" })).toBeInTheDocument();
    expect(within(region).getByRole("heading", { name: "Public information" })).toBeInTheDocument();
    expect(within(region).getByRole("heading", { name: "Culture and places" })).toBeInTheDocument();
  });

  it("links to the personal repository and states the independence disclaimer", () => {
    render(<App />);
    expect(screen.getAllByRole("link", { name: /view the project on github/i })[0]).toHaveAttribute(
      "href",
      "https://github.com/KuyaLoy/betterkabugao",
    );
    expect(screen.getByText(/not the official website of the Municipality of Kabugao/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run the test and confirm the RED state**

Run: `npm.cmd run test:unit -- src/App.test.tsx`

Expected: assertions fail because the current `App` renders only an empty `<main>`.

- [ ] **Step 3: Add the typed copy source**

Create `src/app/site-content.ts`:

```ts
export const siteContent = {
  status: "Coming soon",
  headline: "Kabugao information, made clearer",
  summary:
    "We’re building an independent, community-maintained portal for local services, public information, culture, and places in Kabugao, Apayao.",
  repositoryUrl: "https://github.com/KuyaLoy/betterkabugao",
  themes: [
    {
      number: "01",
      title: "Services and contacts",
      description: "Plain-language guides and verified contact details for everyday local needs.",
    },
    {
      number: "02",
      title: "Public information",
      description: "Clear links to public records, projects, offices, and trusted government sources.",
    },
    {
      number: "03",
      title: "Culture and places",
      description: "Responsible local stories about Kabugao’s communities, heritage, and landscape.",
    },
  ],
  disclaimer:
    "BetterKabugao is an independent civic initiative and is not the official website of the Municipality of Kabugao.",
} as const;
```

- [ ] **Step 4: Create the focused page components**

Create `src/components/SiteHeader.tsx`:

```tsx
import { siteContent } from "../app/site-content";

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand-link" href="/" aria-label="BetterKabugao home">
        <img src="/brand/betterkabugao-mark.svg" alt="" width="42" height="42" />
        <span>BetterKabugao</span>
      </a>
      <a className="header-link" href={siteContent.repositoryUrl} target="_blank" rel="noreferrer">
        View the project on GitHub
      </a>
    </header>
  );
}
```

Create `src/components/BrandArtwork.tsx`:

```tsx
export function BrandArtwork() {
  return (
    <div className="brand-stage" data-testid="brand-stage" aria-hidden="true">
      <span className="contour contour-one" />
      <span className="contour contour-two" />
      <span className="contour contour-three" />
      <svg className="brand-artwork" viewBox="0 0 160 160" focusable="false">
        <use className="brand-artwork__sunrise" href="/brand/betterkabugao-mark.svg#sunrise" fill="#F2C81D" />
        <use className="brand-artwork__silhouette" href="/brand/betterkabugao-mark.svg#kabugao-silhouette" fill="#0032A0" />
      </svg>
      <span className="stage-caption">Independent civic initiative</span>
    </div>
  );
}
```

Create `src/components/LaunchHero.tsx`:

```tsx
import { siteContent } from "../app/site-content";
import { BrandArtwork } from "./BrandArtwork";

export function LaunchHero() {
  return (
    <section className="launch-hero" aria-labelledby="launch-title">
      <div className="hero-copy">
        <p className="status-label"><span aria-hidden="true" />{siteContent.status}</p>
        <h1 id="launch-title">{siteContent.headline}</h1>
        <p className="hero-summary">{siteContent.summary}</p>
        <div className="hero-actions">
          <a className="primary-action" href="#what-we-are-building">See what we’re building</a>
          <a className="secondary-action" href={siteContent.repositoryUrl} target="_blank" rel="noreferrer">
            View the project on GitHub
          </a>
        </div>
      </div>
      <BrandArtwork />
    </section>
  );
}
```

Create `src/components/BuildThemes.tsx`:

```tsx
import { siteContent } from "../app/site-content";

export function BuildThemes() {
  return (
    <section id="what-we-are-building" className="build-themes" aria-labelledby="themes-title">
      <div className="section-heading">
        <p>First release</p>
        <h2 id="themes-title">What we’re building</h2>
      </div>
      <div className="theme-grid">
        {siteContent.themes.map((theme) => (
          <article className="theme-card" key={theme.number}>
            <span>{theme.number}</span>
            <h3>{theme.title}</h3>
            <p>{theme.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
```

Create `src/components/SiteFooter.tsx`:

```tsx
import { siteContent } from "../app/site-content";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>{siteContent.disclaimer}</p>
      <a href={siteContent.repositoryUrl} target="_blank" rel="noreferrer">View the project on GitHub</a>
    </footer>
  );
}
```

- [ ] **Step 5: Compose the page**

Replace `src/App.tsx` with:

```tsx
import { BuildThemes } from "./components/BuildThemes";
import { LaunchHero } from "./components/LaunchHero";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

export function App() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <SiteHeader />
      <main id="main-content">
        <LaunchHero />
        <BuildThemes />
      </main>
      <SiteFooter />
    </div>
  );
}
```

- [ ] **Step 6: Verify semantic GREEN**

Run:

```powershell
npm.cmd run test:unit -- src/App.test.tsx
npm.cmd run typecheck
npm.cmd run lint
```

Expected: three page tests pass; typecheck and lint exit 0.

- [ ] **Step 7: Commit the semantic page**

```bash
git add src/App.tsx src/App.test.tsx src/app/site-content.ts src/components/SiteHeader.tsx src/components/LaunchHero.tsx src/components/BrandArtwork.tsx src/components/BuildThemes.tsx src/components/SiteFooter.tsx
git commit -m "feat: add BetterKabugao launch content"
```

---

### Task 3: Add bounded pointer parallax

**Files:**
- Create: `src/components/BrandArtwork.test.tsx`
- Create: `src/lib/parallax.ts`
- Modify: `src/components/BrandArtwork.tsx`
- Test: `src/components/BrandArtwork.test.tsx`

**Interfaces:**
- Consumes: the static `BrandArtwork` stage from Task 2.
- Produces: `getParallaxOffset(clientX, clientY, rect, maxOffset)` returning `{ x: number; y: number }`; CSS variables `--parallax-x` and `--parallax-y` on the artwork stage.

- [ ] **Step 1: Write the failing interaction test**

Create `src/components/BrandArtwork.test.tsx`:

```tsx
import { fireEvent, render, screen } from "@testing-library/react";
import { BrandArtwork } from "./BrandArtwork";

describe("BrandArtwork", () => {
  it("sets bounded parallax variables and resets them", () => {
    render(<BrandArtwork />);
    const stage = screen.getByTestId("brand-stage");
    stage.getBoundingClientRect = () => ({
      left: 0,
      top: 0,
      width: 200,
      height: 100,
      right: 200,
      bottom: 100,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    });

    fireEvent.pointerMove(stage, { clientX: 200, clientY: 50 });
    expect(stage.style.getPropertyValue("--parallax-x")).toBe("10px");
    expect(stage.style.getPropertyValue("--parallax-y")).toBe("0px");

    fireEvent.pointerLeave(stage);
    expect(stage.style.getPropertyValue("--parallax-x")).toBe("0px");
    expect(stage.style.getPropertyValue("--parallax-y")).toBe("0px");
  });
});
```

- [ ] **Step 2: Run the test and confirm the RED state**

Run: `npm.cmd run test:unit -- src/components/BrandArtwork.test.tsx`

Expected: FAIL because pointer movement does not set either CSS variable.

- [ ] **Step 3: Implement the pure parallax calculation**

Create `src/lib/parallax.ts`:

```ts
type Rect = Pick<DOMRect, "left" | "top" | "width" | "height">;

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum);
}

export function getParallaxOffset(
  clientX: number,
  clientY: number,
  rect: Rect,
  maxOffset = 10,
) {
  if (rect.width <= 0 || rect.height <= 0) {
    return { x: 0, y: 0 };
  }

  const xRatio = ((clientX - rect.left) / rect.width - 0.5) * 2;
  const yRatio = ((clientY - rect.top) / rect.height - 0.5) * 2;

  return {
    x: Math.round(clamp(xRatio, -1, 1) * maxOffset * 100) / 100,
    y: Math.round(clamp(yRatio, -1, 1) * maxOffset * 100) / 100,
  };
}
```

- [ ] **Step 4: Wire pointer events without React state churn**

Update `src/components/BrandArtwork.tsx`:

```tsx
import type { PointerEvent } from "react";
import { getParallaxOffset } from "../lib/parallax";

export function BrandArtwork() {
  const setOffset = (element: HTMLDivElement, x: number, y: number) => {
    element.style.setProperty("--parallax-x", `${x}px`);
    element.style.setProperty("--parallax-y", `${y}px`);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    const { x, y } = getParallaxOffset(
      event.clientX,
      event.clientY,
      event.currentTarget.getBoundingClientRect(),
    );
    setOffset(event.currentTarget, x, y);
  };

  const handlePointerLeave = (event: PointerEvent<HTMLDivElement>) => {
    setOffset(event.currentTarget, 0, 0);
  };

  return (
    <div
      className="brand-stage"
      data-testid="brand-stage"
      aria-hidden="true"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <span className="contour contour-one" />
      <span className="contour contour-two" />
      <span className="contour contour-three" />
      <svg className="brand-artwork" viewBox="0 0 160 160" focusable="false">
        <use className="brand-artwork__sunrise" href="/brand/betterkabugao-mark.svg#sunrise" fill="#F2C81D" />
        <use className="brand-artwork__silhouette" href="/brand/betterkabugao-mark.svg#kabugao-silhouette" fill="#0032A0" />
      </svg>
      <span className="stage-caption">Independent civic initiative</span>
    </div>
  );
}
```

- [ ] **Step 5: Verify interaction GREEN**

Run:

```powershell
npm.cmd run test:unit -- src/components/BrandArtwork.test.tsx
npm.cmd run typecheck
npm.cmd run lint
```

Expected: the interaction test passes; typecheck and lint exit 0.

- [ ] **Step 6: Commit the interaction**

```bash
git add src/components/BrandArtwork.tsx src/components/BrandArtwork.test.tsx src/lib/parallax.ts
git commit -m "feat: add reduced parallax interaction"
```

---

### Task 4: Apply the responsive civic visual system

**Files:**
- Modify: `tests/site-contracts.test.mjs`
- Modify: `src/styles.css`
- Test: `tests/site-contracts.test.mjs`

**Interfaces:**
- Consumes: all semantic class names and parallax CSS variables from Tasks 2–3.
- Produces: the complete desktop/mobile layout, staged mark reveal, slow contour motion, card focus/hover states, coarse-pointer behavior, and reduced-motion override.

- [ ] **Step 1: Extend the static contract with failing style assertions**

Append to `tests/site-contracts.test.mjs`:

```js
test("stylesheet carries the approved palette and motion safeguards", () => {
  const css = load("src/styles.css");

  assert.match(css, /@import\s+["']tailwindcss["']/);
  assert.match(css, /#0032A0/i);
  assert.match(css, /#F2C81D/i);
  assert.match(css, /#111827/i);
  assert.match(css, /@keyframes\s+mark-reveal/);
  assert.match(css, /@keyframes\s+contour-drift/);
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
  assert.match(css, /pointer:\s*coarse/);
  assert.match(css, /--parallax-x/);
  assert.match(css, /--parallax-y/);
});
```

- [ ] **Step 2: Run the contract and confirm the RED state**

Run: `node --test --test-name-pattern="stylesheet" tests/site-contracts.test.mjs`

Expected: FAIL because `src/styles.css` contains only the Tailwind import.

- [ ] **Step 3: Replace the stylesheet with the complete visual system**

Replace `src/styles.css` with:

```css
@import "tailwindcss";

@theme {
  --color-civic: #0032A0;
  --color-sunrise: #F2C81D;
  --color-ink: #111827;
  --color-paper: #FFFFFF;
  --font-sans: "Aptos", "Segoe UI", Arial, sans-serif;
}

:root {
  color: #111827;
  background: #f4f7fb;
  font-family: "Aptos", "Segoe UI", Arial, sans-serif;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; min-width: 320px; min-height: 100vh; background: #f4f7fb; }
a { color: inherit; }
button, a { -webkit-tap-highlight-color: transparent; }

body::before {
  position: fixed;
  inset: 0;
  z-index: -2;
  content: "";
  background:
    linear-gradient(rgba(0, 50, 160, 0.045) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 50, 160, 0.045) 1px, transparent 1px),
    #f4f7fb;
  background-size: 44px 44px;
}

.site-shell { width: min(100% - 32px, 1200px); margin-inline: auto; }
.skip-link { position: fixed; top: 12px; left: 12px; z-index: 20; padding: 10px 14px; color: #FFFFFF; background: #0032A0; border-radius: 8px; transform: translateY(-160%); }
.skip-link:focus { transform: translateY(0); }

.site-header { display: flex; align-items: center; justify-content: space-between; min-height: 86px; border-bottom: 1px solid rgba(17, 24, 39, 0.12); }
.brand-link { display: inline-flex; gap: 12px; align-items: center; color: #111827; font-size: 1.05rem; font-weight: 800; text-decoration: none; letter-spacing: -0.02em; }
.brand-link img { width: 42px; height: 42px; }
.header-link, .site-footer a { color: #0032A0; font-size: 0.9rem; font-weight: 700; text-underline-offset: 4px; }

.launch-hero { display: grid; grid-template-columns: minmax(0, 1fr) minmax(360px, 0.86fr); gap: clamp(40px, 7vw, 104px); align-items: center; min-height: min(720px, calc(100vh - 86px)); padding-block: clamp(64px, 10vw, 120px); }
.hero-copy { max-width: 700px; }
.status-label { display: inline-flex; gap: 10px; align-items: center; margin: 0 0 24px; color: #0032A0; font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.16em; }
.status-label span { width: 9px; height: 9px; background: #F2C81D; border: 2px solid #0032A0; border-radius: 999px; box-shadow: 0 0 0 5px rgba(242, 200, 29, 0.24); }
.hero-copy h1 { max-width: 760px; margin: 0; color: #111827; font-size: clamp(3.1rem, 7vw, 6.7rem); line-height: 0.94; letter-spacing: -0.068em; }
.hero-summary { max-width: 670px; margin: 30px 0 0; color: #344054; font-size: clamp(1.03rem, 1.6vw, 1.25rem); line-height: 1.72; }
.hero-actions { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 34px; }
.primary-action, .secondary-action { display: inline-flex; align-items: center; justify-content: center; min-height: 50px; padding: 0 20px; border-radius: 10px; font-weight: 800; text-decoration: none; transition: transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease; }
.primary-action { color: #FFFFFF; background: #0032A0; box-shadow: 0 12px 28px rgba(0, 50, 160, 0.2); }
.secondary-action { color: #0032A0; background: #FFFFFF; border: 1px solid rgba(0, 50, 160, 0.18); }
.primary-action:hover, .secondary-action:hover { transform: translateY(-2px); }
.primary-action:focus-visible, .secondary-action:focus-visible, .brand-link:focus-visible, .header-link:focus-visible, .site-footer a:focus-visible { outline: 3px solid #F2C81D; outline-offset: 4px; }

.brand-stage { --parallax-x: 0px; --parallax-y: 0px; position: relative; isolation: isolate; display: grid; place-items: center; aspect-ratio: 1; border: 1px solid rgba(0, 50, 160, 0.12); border-radius: 34% 18% 31% 22%; background: rgba(255, 255, 255, 0.72); box-shadow: 0 36px 80px rgba(0, 50, 160, 0.13); overflow: hidden; }
.brand-stage::before { position: absolute; inset: 8%; z-index: -1; content: ""; border: 1px dashed rgba(0, 50, 160, 0.22); border-radius: 50%; }
.brand-artwork { width: 66%; transform: translate3d(var(--parallax-x), var(--parallax-y), 0); transition: transform 160ms ease-out; filter: drop-shadow(0 20px 22px rgba(0, 50, 160, 0.14)); }
.brand-artwork__sunrise { transform-origin: 88px 30px; animation: mark-reveal 760ms 220ms both cubic-bezier(.2,.8,.2,1); }
.brand-artwork__silhouette { transform-origin: center; animation: mark-reveal 820ms 80ms both cubic-bezier(.2,.8,.2,1); }
.stage-caption { position: absolute; right: 24px; bottom: 20px; color: #0032A0; font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; }
.contour { position: absolute; border: 1px solid rgba(0, 50, 160, 0.14); border-radius: 50%; animation: contour-drift 15s infinite alternate ease-in-out; }
.contour-one { width: 88%; height: 46%; transform: rotate(18deg); }
.contour-two { width: 66%; height: 86%; animation-delay: -4s; }
.contour-three { width: 112%; height: 72%; animation-delay: -8s; }

.build-themes { padding-block: 32px clamp(72px, 10vw, 132px); }
.section-heading { display: flex; gap: 24px; align-items: baseline; margin-bottom: 28px; }
.section-heading p { margin: 0; color: #0032A0; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.16em; }
.section-heading h2 { margin: 0; color: #111827; font-size: clamp(2rem, 4vw, 3.25rem); letter-spacing: -0.045em; }
.theme-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
.theme-card { min-height: 240px; padding: 28px; background: rgba(255, 255, 255, 0.84); border: 1px solid rgba(17, 24, 39, 0.1); border-radius: 18px; transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease; }
.theme-card:hover { transform: translateY(-4px); border-color: rgba(0, 50, 160, 0.3); box-shadow: 0 20px 40px rgba(17, 24, 39, 0.07); }
.theme-card > span { color: #0032A0; font-size: 0.72rem; font-weight: 900; letter-spacing: 0.16em; }
.theme-card h3 { margin: 58px 0 12px; color: #111827; font-size: 1.3rem; }
.theme-card p { margin: 0; color: #4b5565; line-height: 1.65; }

.site-footer { display: flex; gap: 32px; align-items: center; justify-content: space-between; padding-block: 28px 40px; border-top: 1px solid rgba(17, 24, 39, 0.12); }
.site-footer p { max-width: 760px; margin: 0; color: #667085; font-size: 0.86rem; line-height: 1.6; }

@keyframes mark-reveal { from { opacity: 0; transform: translateY(16px) scale(0.96); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes contour-drift { from { transform: translate3d(-2%, -1%, 0) rotate(8deg); } to { transform: translate3d(2%, 2%, 0) rotate(22deg); } }

@media (max-width: 820px) {
  .site-shell { width: min(100% - 24px, 680px); }
  .site-header { min-height: 76px; }
  .header-link { display: none; }
  .launch-hero { grid-template-columns: 1fr; min-height: auto; padding-block: 54px 72px; }
  .hero-copy h1 { font-size: clamp(3rem, 14vw, 5.5rem); }
  .brand-stage { width: min(100%, 560px); margin-inline: auto; order: -1; }
  .theme-grid { grid-template-columns: 1fr; }
  .theme-card { min-height: 200px; }
  .theme-card h3 { margin-top: 38px; }
  .site-footer { align-items: flex-start; flex-direction: column; }
}

@media (max-width: 480px) {
  .launch-hero { gap: 36px; }
  .hero-copy h1 { letter-spacing: -0.058em; }
  .hero-actions { align-items: stretch; flex-direction: column; }
  .primary-action, .secondary-action { width: 100%; }
  .section-heading { align-items: flex-start; flex-direction: column; gap: 8px; }
}

@media (pointer: coarse) {
  .brand-artwork { transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { scroll-behavior: auto !important; animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
  .brand-artwork { transform: none; }
  .contour { animation: none; }
}
```

- [ ] **Step 4: Verify the visual contract and build**

Run:

```powershell
node --test --test-name-pattern="stylesheet" tests/site-contracts.test.mjs
npm.cmd test
npm.cmd run build
```

Expected: stylesheet contract passes; all tests pass; build exits 0.

- [ ] **Step 5: Commit the visual system**

```bash
git add src/styles.css tests/site-contracts.test.mjs
git commit -m "feat: style BetterKabugao launch page"
```

---

### Task 5: Add SEO, crawler, fallback, and Cloudflare headers

**Files:**
- Modify: `tests/site-contracts.test.mjs`
- Modify: `index.html`
- Create: `scripts/render-social-card.mjs`
- Create: `public/brand/betterkabugao-social.png` (generated)
- Create: `public/robots.txt`
- Create: `public/sitemap.xml`
- Create: `public/_headers`
- Test: `tests/site-contracts.test.mjs`

**Interfaces:**
- Consumes: canonical URL and approved copy from the global constraints.
- Produces: complete document metadata, a 1200×630 PNG social card, favicon link, no-JavaScript fallback, crawler files, and safe static response headers copied into `dist`.

- [ ] **Step 1: Add failing SEO and static-file assertions**

Append to `tests/site-contracts.test.mjs`:

```js
test("document metadata uses the production identity", () => {
  const html = load("index.html");

  assert.match(html, /<title>BetterKabugao — Kabugao information, made clearer<\/title>/);
  assert.match(html, /name="description"/);
  assert.match(html, /rel="canonical" href="https:\/\/betterkabugao\.org\/"/);
  assert.match(html, /property="og:title"/);
  assert.match(html, /property="og:image" content="https:\/\/betterkabugao\.org\/brand\/betterkabugao-social\.png"/);
  assert.match(html, /property="og:image:width" content="1200"/);
  assert.match(html, /property="og:image:height" content="630"/);
  assert.match(html, /name="twitter:card" content="summary_large_image"/);
  assert.match(html, /rel="icon" href="\/favicon\.svg"/);
  assert.match(html, /<noscript>[\s\S]*Coming soon[\s\S]*independent civic initiative[\s\S]*<\/noscript>/i);
});

test("crawler and Cloudflare files reference the canonical domain", () => {
  assert.match(load("public/robots.txt"), /Sitemap: https:\/\/betterkabugao\.org\/sitemap\.xml/);
  assert.match(load("public/sitemap.xml"), /<loc>https:\/\/betterkabugao\.org\/<\/loc>/);
  const headers = load("public/_headers");
  assert.match(headers, /X-Content-Type-Options: nosniff/);
  assert.match(headers, /Referrer-Policy: strict-origin-when-cross-origin/);
  assert.match(headers, /Permissions-Policy: geolocation=\(\), camera=\(\), microphone=\(\)/);
});

test("social preview is a 1200 by 630 PNG", async () => {
  const socialCard = new URL("public/brand/betterkabugao-social.png", root);
  assert.ok(existsSync(socialCard), "Expected generated social preview PNG");
  const { default: sharp } = await import("sharp");
  const metadata = await sharp(readFileSync(socialCard)).metadata();
  assert.equal(metadata.format, "png");
  assert.equal(metadata.width, 1200);
  assert.equal(metadata.height, 630);
});
```

- [ ] **Step 2: Run the SEO tests and confirm the RED state**

Run: `node --test --test-name-pattern="metadata|crawler|social preview" tests/site-contracts.test.mjs`

Expected: all three selected tests fail because the metadata, static files, and social card are absent.

- [ ] **Step 3: Add the deterministic social-card renderer**

Create `scripts/render-social-card.mjs`:

```js
import sharp from "sharp";

const logo = await sharp("public/brand/betterkabugao-logo.svg")
  .resize({ width: 900 })
  .png()
  .toBuffer();

const label = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
    <text x="600" y="530" text-anchor="middle"
      font-family="Arial, sans-serif" font-size="34" font-weight="700"
      letter-spacing="5" fill="#0032A0">COMING SOON · BETTERKABUGAO.ORG</text>
  </svg>
`);

await sharp({
  create: {
    width: 1200,
    height: 630,
    channels: 4,
    background: "#F4F7FB",
  },
})
  .composite([
    { input: logo, gravity: "center" },
    { input: label, left: 0, top: 0 },
  ])
  .png()
  .toFile("public/brand/betterkabugao-social.png");

console.log("SOCIAL_CARD_OK 1200x630");
```

Run: `npm.cmd run brand:social`

Expected: `SOCIAL_CARD_OK 1200x630` and `public/brand/betterkabugao-social.png` exists.

- [ ] **Step 4: Replace the document head and add the fallback**

Replace `index.html` with:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#0032A0" />
    <meta name="description" content="BetterKabugao is an independent, community-maintained portal for services, public information, culture, and places in Kabugao, Apayao." />
    <link rel="canonical" href="https://betterkabugao.org/" />
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="BetterKabugao" />
    <meta property="og:title" content="BetterKabugao — Kabugao information, made clearer" />
    <meta property="og:description" content="An independent, community-maintained portal for Kabugao, Apayao. Coming soon." />
    <meta property="og:url" content="https://betterkabugao.org/" />
    <meta property="og:image" content="https://betterkabugao.org/brand/betterkabugao-social.png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="BetterKabugao — Kabugao information, made clearer" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="BetterKabugao — Kabugao information, made clearer" />
    <meta name="twitter:description" content="An independent, community-maintained portal for Kabugao, Apayao. Coming soon." />
    <meta name="twitter:image" content="https://betterkabugao.org/brand/betterkabugao-social.png" />
    <title>BetterKabugao — Kabugao information, made clearer</title>
  </head>
  <body>
    <div id="root"></div>
    <noscript>
      <main>
        <p>Coming soon</p>
        <h1>BetterKabugao — Kabugao information, made clearer</h1>
        <p>BetterKabugao is an independent civic initiative and is not the official website of the Municipality of Kabugao.</p>
        <a href="https://github.com/KuyaLoy/betterkabugao">View the project on GitHub</a>
      </main>
    </noscript>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 5: Add crawler files and Cloudflare headers**

Create `public/robots.txt`:

```text
User-agent: *
Allow: /
Sitemap: https://betterkabugao.org/sitemap.xml
```

Create `public/sitemap.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://betterkabugao.org/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
```

Create `public/_headers`:

```text
/*
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Permissions-Policy: geolocation=(), camera=(), microphone=()
```

- [ ] **Step 6: Verify SEO GREEN and output copying**

Run:

```powershell
node --test --test-name-pattern="metadata|crawler|social preview" tests/site-contracts.test.mjs
npm.cmd test
npm.cmd run build
Test-Path -LiteralPath dist\robots.txt
Test-Path -LiteralPath dist\sitemap.xml
Test-Path -LiteralPath dist\_headers
Test-Path -LiteralPath dist\brand\betterkabugao-social.png
```

Expected: selected and full suites pass; build exits 0; all four `Test-Path` commands return `True`.

- [ ] **Step 7: Commit SEO and static configuration**

```bash
git add index.html scripts/render-social-card.mjs public/brand/betterkabugao-social.png public/robots.txt public/sitemap.xml public/_headers tests/site-contracts.test.mjs
git commit -m "feat: add BetterKabugao launch metadata"
```

---

### Task 6: Document, render, and obtain visual approval

**Files:**
- Create: `README.md`
- Modify: `tests/site-contracts.test.mjs`
- Modify after visual approval: `docs/superpowers/specs/2026-08-02-betterkabugao-coming-soon-design.md`
- Verify: all source files and `dist`

**Interfaces:**
- Consumes: the completed page, quality scripts, and static output from Tasks 1–5.
- Produces: contributor documentation, final quality evidence, desktop/mobile/reduced-motion visual evidence, and the implementation approval record used by the Cloudflare launch plan.

- [ ] **Step 1: Add a failing README contract**

Append to `tests/site-contracts.test.mjs`:

```js
test("README documents local and Cloudflare build settings", () => {
  const readme = load("README.md");
  assert.match(readme, /npm install/);
  assert.match(readme, /npm run dev/);
  assert.match(readme, /npm run build/);
  assert.match(readme, /Production branch:\s*`main`/);
  assert.match(readme, /Build output directory:\s*`dist`/);
  assert.match(readme, /independent civic initiative/i);
});
```

- [ ] **Step 2: Run the README test and confirm the RED state**

Run: `node --test --test-name-pattern="README" tests/site-contracts.test.mjs`

Expected: FAIL with `Expected project file: README.md`.

- [ ] **Step 3: Create the concise contributor README**

Create `README.md`:

````markdown
# BetterKabugao

BetterKabugao is an independent, community-maintained civic portal for Kabugao, Apayao. It is not the official website of the Municipality of Kabugao.

The current release is a responsive coming-soon page while sourced local content and public-information features are prepared.

## Local development

Requirements: Node.js 22.14.0 and npm.

```bash
npm install
npm run dev
```

## Quality checks

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

The production build is written to `dist`.

## Cloudflare Pages

- Production branch: `main`
- Build command: `npm run build`
- Build output directory: `dist`
- Root directory: repository root

The generated `pages.dev` deployment must be verified before `betterkabugao.org` is attached through the Pages project’s Custom domains screen.

## Brand assets

- `public/brand/betterkabugao-mark.svg` — page header and compact identity
- `public/brand/betterkabugao-logo.svg` — horizontal lockup
- `public/brand/betterkabugao-social.png` — social preview card
- `public/favicon.svg` — browser icon

## Project status

The full civic portal, sourced local content, search, language support, and the grounded AI assistant are planned separately from this launch page.
````

- [ ] **Step 4: Run the full local verification gate**

Run:

```powershell
npm.cmd ci
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
git diff --check
```

Expected: npm install from the lockfile succeeds; all tests, typecheck, lint, build, and whitespace checks exit 0.

- [ ] **Step 5: Render and inspect the production build**

Run: `npm.cmd run preview -- --host 127.0.0.1 --port 4173`

Use the in-app browser to inspect `http://127.0.0.1:4173/` at:

- mobile: `375 × 812`;
- desktop: `1440 × 900`;
- keyboard-only navigation from the skip link through both GitHub links;
- browser-level reduced-motion emulation; and
- a coarse-pointer/mobile profile.

Required observations:

- no horizontal overflow;
- no cropped mark or headline;
- three SVG rays and the silhouette render from the approved asset;
- exactly three launch cards are visible;
- focus rings remain visible;
- pointer parallax is small and resets on leave;
- parallax and long animation stop under reduced motion/coarse pointer; and
- the disclaimer and GitHub link remain readable at 375 px.

Capture one desktop and one mobile screenshot, present both to the project owner, and pause for visual approval.

- [ ] **Step 6: Record approval after the owner accepts the previews**

Change the spec status to:

```markdown
- **Status:** Approved and implemented
```

Append:

```markdown
## Implementation

- Application: React, TypeScript, Vite, and Tailwind CSS
- Build command: `npm run build`
- Output directory: `dist`
- Deployment plan: [`docs/superpowers/plans/2026-08-02-betterkabugao-cloudflare-launch.md`](../plans/2026-08-02-betterkabugao-cloudflare-launch.md)
```

- [ ] **Step 7: Re-run verification and commit the record**

Run:

```powershell
npm.cmd test
npm.cmd run typecheck
npm.cmd run lint
npm.cmd run build
git diff --check
```

Expected: every command exits 0.

```bash
git add README.md tests/site-contracts.test.mjs docs/superpowers/specs/2026-08-02-betterkabugao-coming-soon-design.md
git commit -m "docs: record BetterKabugao launch setup"
```
