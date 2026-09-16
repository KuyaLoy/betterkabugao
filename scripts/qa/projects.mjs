import { chromium } from "playwright";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const OUT = fileURLToPath(new URL("../../docs/qa/checkpoint-projects/", import.meta.url));
if (!existsSync(fileURLToPath(new URL("../../dist/index.html", import.meta.url)))) throw new Error("Run npm run build before npm run qa:projects.");
mkdirSync(OUT, { recursive: true });
const checks = [];
const record = (name, pass, detail = "") => { checks.push({ name, pass: Boolean(pass), detail }); console.log(`${pass ? "PASS" : "FAIL"} ${name}${detail ? ` — ${detail}` : ""}`); };
const { server, base } = await startServer(0);
const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    await page.goto(`${base}/projects`, { waitUntil: "domcontentloaded" });
    record(`${viewport.width}px renders all 13 local records`, await page.locator(".projects__record").count() === 13);
    record(`${viewport.width}px separates evidence sections`, await page.getByRole("heading", { name: "Project register" }).isVisible() && await page.getByRole("heading", { name: "Historical appropriations" }).isVisible());
    record(`${viewport.width}px has no project map`, await page.locator(".projects .map").count() === 0);
    record(`${viewport.width}px exposes typed amounts and contractor availability`, await page.getByText("ABC", { exact: true }).isVisible() && await page.getByText("Contractor unavailable in the reviewed source").count() > 0);
    if (viewport.width < 761) await page.getByText(/Filter records \(0 active\)/).click();
    const statusFilter = page.getByLabel("Filter by status");
    const evidenceSort = page.getByLabel("Sort records by evidence date");
    record(`${viewport.width}px keeps secondary filters visible and operable`, await statusFilter.isVisible());
    record(`${viewport.width}px exposes evidence-date sorting`, await evidenceSort.isVisible());
    record(`${viewport.width}px keeps desktop controls in a compact toolbar`, viewport.width < 761 || await page.locator(".projects__filter-fields").evaluate((element) => getComputedStyle(element).display === "grid"));
    if (!await statusFilter.isVisible() || !await evidenceSort.isVisible()) {
      await context.close();
      continue;
    }
    await statusFilter.selectOption("ongoing");
    record(`${viewport.width}px filters source-reported status`, await page.locator(".projects__record").count() === 1 && await page.getByText(/ongoing \(as reported 2022-10-22\)/i).isVisible());
    await page.getByRole("button", { name: "Clear filters" }).click();
    record(`${viewport.width}px defaults to newest evidence`, (await page.locator(".projects__section").first().locator(".projects__record").first().innerText()).includes("23PB0014"));
    await evidenceSort.selectOption("oldest");
    record(`${viewport.width}px can order the register by oldest evidence`, (await page.locator(".projects__section").first().locator(".projects__record").first().innerText()).includes("21PB0002"));
    await evidenceSort.selectOption("newest");
    await page.getByLabel("Filter by category").selectOption("flood control/drainage");
    await page.getByLabel("Filter by funding year").selectOption("2023");
    await page.getByLabel("Search projects").fill("Badduat");
    record(`${viewport.width}px combines filters deterministically`, await page.locator(".projects__record").count() === 2);
    await page.getByRole("button", { name: "Clear filters" }).click();
    await page.getByLabel("Search projects").fill("no matching project");
    record(`${viewport.width}px exposes the empty state`, await page.getByText("No projects match those filters.").isVisible());
    await page.getByRole("button", { name: "Clear filters" }).click();
    const csv = await page.evaluate(() => fetch("/data/kabugao-public-works.csv").then((response) => response.text()));
    const json = await page.evaluate(() => fetch("/data/kabugao-public-works.json").then((response) => response.json()));
    record(`${viewport.width}px serves local CSV and JSON`, csv.includes("23PB0017") && json.recordCount === 13);
    record(`${viewport.width}px has no horizontal page overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth), `${await page.evaluate(() => document.documentElement.scrollWidth)}/${viewport.width}`);
    await page.screenshot({ path: `${OUT}/projects-${viewport.width}.png`, fullPage: true });
    if (viewport.width === 1440) {
      await page.goto(`${base}/`, { waitUntil: "domcontentloaded" });
      const preview = page.getByRole("region", { name: /Latest source-backed records/i });
      record("homepage renders three latest source-backed records", await preview.locator("article").count() === 3);
      const road = preview.getByRole("button", { name: "roads/bridges" });
      if (await road.count()) await road.click();
      record("homepage keeps the Public Works route after preview filtering", await preview.getByRole("link", { name: "View all Public Works Watch records" }).isVisible());
    }
    await context.close();
  }
} finally { await browser.close(); server.close(); }
const failed = checks.filter((check) => !check.pass);
writeFileSync(`${OUT}/report.json`, JSON.stringify({ scope: "/projects focused browser QA", overallPass: failed.length === 0, totalChecks: checks.length, passed: checks.length - failed.length, failed: failed.length, checks }, null, 2));
console.log(`${failed.length === 0 ? "ALL PASS" : "FAILURES"} — ${checks.length - failed.length}/${checks.length}`);
process.exitCode = failed.length === 0 ? 0 : 1;
