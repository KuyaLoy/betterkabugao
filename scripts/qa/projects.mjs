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
    await context.close();
  }
} finally { await browser.close(); server.close(); }
const failed = checks.filter((check) => !check.pass);
writeFileSync(`${OUT}/report.json`, JSON.stringify({ scope: "/projects focused browser QA", overallPass: failed.length === 0, totalChecks: checks.length, passed: checks.length - failed.length, failed: failed.length, checks }, null, 2));
console.log(`${failed.length === 0 ? "ALL PASS" : "FAILURES"} — ${checks.length - failed.length}/${checks.length}`);
process.exitCode = failed.length === 0 ? 0 : 1;
