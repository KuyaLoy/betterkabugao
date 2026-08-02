import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
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

test("generated dependency and build output paths are ignored", () => {
  for (const path of ["node_modules/.keep", "dist/.keep"]) {
    assert.doesNotThrow(() => {
      execFileSync("git", ["check-ignore", "--quiet", path], {
        cwd: fileURLToPath(root),
        env: { ...process.env, GIT_CONFIG_GLOBAL: "NUL" },
        stdio: "pipe",
      });
    });
  }
});
