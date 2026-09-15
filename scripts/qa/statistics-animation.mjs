/**
 * Focused browser QA for the one-time /statistics population-chart motion.
 * Run after `npm run build`; only this route is exercised.
 */
import { chromium } from "playwright";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve.mjs";

const ROOT = fileURLToPath(new URL("../../", import.meta.url));
const DIST_INDEX = fileURLToPath(new URL("../../dist/index.html", import.meta.url));
const OUT = fileURLToPath(new URL("../../docs/qa/checkpoint-statistics/", import.meta.url));
mkdirSync(OUT, { recursive: true });

if (!existsSync(DIST_INDEX)) {
  throw new Error("dist/ is missing. Run `npm run build` before `npm run qa:statistics`.");
}

const checks = [];
function record(name, pass, detail) {
  checks.push({ name, pass: Boolean(pass), detail });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
}

async function openStatistics(browser, base, viewport, options = {}) {
  const context = await browser.newContext({ viewport, ...options });
  const page = await context.newPage();
  await page.goto(`${base}/statistics`, { waitUntil: "domcontentloaded", timeout: 25000 });
  return { context, page };
}

async function triggerChart(page) {
  const chart = page.locator(".stats-chart");
  await chart.scrollIntoViewIfNeeded();
  await page.waitForFunction(() => document.querySelector(".stats-chart")?.classList.contains("is-visible"));
  return chart;
}

const { server, base } = await startServer(0);
const browser = await chromium.launch({ headless: true });

try {
  {
    const { context, page } = await openStatistics(browser, base, { width: 390, height: 844 });
    await context.grantPermissions(["clipboard-read", "clipboard-write"], { origin: base });
    const snapshot = page.locator(".stats-snapshot");
    const recordText = await snapshot.innerText();
    record(
      "shows the complete 2024 Kabugao snapshot without implying missing years",
      ["16,425", "16,411", "3,662", "929.88 km²", "17.7 people/km²", "static, source-linked reference"].every((value) => recordText.includes(value)),
      recordText.replace(/\s+/g, " ").slice(0, 240),
    );
    const sourceLinks = await snapshot.locator(".stats-snapshot__source-list a").evaluateAll((links) =>
      links.map((link) => link.getAttribute("href")),
    );
    record(
      "pairs PSA OpenSTAT canon with BetterGov discovery links",
      sourceLinks.includes("https://statistics.bettergov.ph/datasets/b1b47f8cb7ceb5c50a97")
        && sourceLinks.includes("https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0151A6DTHP4.px")
        && sourceLinks.includes("https://statistics.bettergov.ph/datasets/05c931eaecec498f9756")
        && sourceLinks.includes("https://openstat.psa.gov.ph/PXWeb/pxweb/en/DB/DB__1A__PO_2024/0221A6DLPD0.px"),
      sourceLinks.join(" | "),
    );
    const csv = await page.evaluate(async () => fetch("/data/kabugao-2024-snapshot.csv").then((response) => response.text()));
    record(
      "serves a local CSV extract with the exact density",
      csv.includes("population_density,17.6636,persons per square kilometre") && csv.includes("total_population,16425,persons"),
      csv.split("\n").slice(0, 2).join(" | "),
    );
    await page.getByRole("button", { name: "Copy citation" }).click();
    await page.waitForFunction(() => document.querySelector(".stats-snapshot__status")?.textContent === "Citation copied.");
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    record(
      "copies a citation containing PSA and BetterGov provenance",
      copied.includes("PSA) OpenSTAT") && copied.includes("statistics.bettergov.ph/datasets/b1b47f8cb7ceb5c50a97"),
      copied.slice(0, 150),
    );
    await context.close();
  }

  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(`${base}/`, { waitUntil: "domcontentloaded", timeout: 25000 });
    const statisticsEntry = page.locator('a[href="/statistics"]');
    const entryText = await statisticsEntry.innerText();
    record(
      "keeps the homepage statistics entry useful and concise",
      entryText.includes("2024 snapshot: 16,425 residents"),
      entryText.replace(/\s+/g, " "),
    );
    await context.close();
  }

  // A short viewport holds the chart below the fold so the 20% observer gate
  // can be checked before the scroll that starts the sequence.
  {
    const { context, page } = await openStatistics(browser, base, { width: 390, height: 300 });
    await page.waitForTimeout(100);
    const before = await page.locator(".stats-chart").evaluate((chart) => ({
      ready: chart.classList.contains("is-motion-ready"),
      visible: chart.classList.contains("is-visible"),
    }));
    record("waits until the chart enters the viewport", before.ready && !before.visible, JSON.stringify(before));

    const chart = await triggerChart(page);
    await page.waitForFunction(() => document.querySelector(".stats-chart__line")?.getAnimations()[0]?.startTime != null);
    const sequence = await chart.evaluate((element) => {
      const line = element.querySelector(".stats-chart__line");
      const observations = [...element.querySelectorAll(".stats-chart__observation")];
      const lineStyle = getComputedStyle(line);
      return {
        lineDuration: lineStyle.animationDuration,
        lineTiming: lineStyle.animationTimingFunction,
        years: observations.map((item) => item.getAttribute("data-year")),
        delays: observations.map((item) => getComputedStyle(item.querySelector(".stats-chart__point")).animationDelay),
        lineStart: line.getAnimations()[0]?.startTime ?? null,
      };
    });
    const delays = sequence.delays.map((delay) => Number.parseFloat(delay));
    record(
      "draws for 1100ms with the approved easing",
      sequence.lineDuration === "1.1s" && sequence.lineTiming === "cubic-bezier(0.22, 0.8, 0.28, 1)",
      `${sequence.lineDuration}; ${sequence.lineTiming}`,
    );
    record(
      "reveals nine chronological points with 2024 last",
      sequence.years.length === 9 && sequence.years.at(-1) === "2024" && delays.every((delay, index) => index === 0 || delay > delays[index - 1]),
      `${sequence.years.join("→")}; last delay ${sequence.delays.at(-1)}`,
    );

    await page.waitForTimeout(1200);
    const completed = await chart.evaluate((element) => ({
      complete: element.classList.contains("is-complete"),
      activeAnimations: element.getAnimations({ subtree: true }).length,
    }));
    record("converts the finished draw into a permanent static state", completed.complete && completed.activeAnimations === 0, JSON.stringify(completed));
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
    });
    await page.waitForFunction(() => window.scrollY === 0);
    await chart.scrollIntoViewIfNeeded();
    await page.waitForTimeout(200);
    const replay = await chart.evaluate((element) => ({
      visible: element.classList.contains("is-visible"),
      complete: element.classList.contains("is-complete"),
      activeAnimations: element.getAnimations({ subtree: true }).length,
      lineStart: element.querySelector(".stats-chart__line")?.getAnimations()[0]?.startTime ?? null,
    }));
    record("does not replay after scrolling away and back", replay.visible && replay.complete && replay.activeAnimations === 0 && replay.lineStart === null, JSON.stringify(replay));
    await context.close();
  }

  for (const viewport of [{ width: 390, height: 844 }, { width: 1440, height: 900 }]) {
    const { context, page } = await openStatistics(browser, base, viewport);
    await triggerChart(page);
    await page.waitForTimeout(1150);
    const complete = await page.locator(".stats-chart").evaluate((chart) => ({
      lineOffset: getComputedStyle(chart.querySelector(".stats-chart__line")).strokeDashoffset,
      pointsVisible: [...chart.querySelectorAll(".stats-chart__point")].every((point) => Number(getComputedStyle(point).opacity) === 1),
    }));
    record(`${viewport.width}px final chart is complete`, complete.pointsVisible && Number.parseFloat(complete.lineOffset) === 0, JSON.stringify(complete));
    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, 0);
    });
    await page.waitForFunction(() => window.scrollY === 0);
    await page.screenshot({ path: `${OUT}/statistics-animation-${viewport.width}.png`, fullPage: true });
    await context.close();
  }

  {
    const { context, page } = await openStatistics(browser, base, { width: 390, height: 844 }, { reducedMotion: "reduce" });
    await page.waitForTimeout(100);
    const reduced = await page.locator(".stats-chart").evaluate((chart) => ({
      ready: chart.classList.contains("is-motion-ready"),
      visible: chart.classList.contains("is-visible"),
      lineOffset: getComputedStyle(chart.querySelector(".stats-chart__line")).strokeDashoffset,
      animationCount: chart.getAnimations({ subtree: true }).length,
      pointsVisible: [...chart.querySelectorAll(".stats-chart__point")].every((point) => Number(getComputedStyle(point).opacity) === 1),
    }));
    record(
      "reduced motion is immediately static and complete",
      !reduced.ready && !reduced.visible && Number.parseFloat(reduced.lineOffset) === 0 && reduced.animationCount === 0 && reduced.pointsVisible,
      JSON.stringify(reduced),
    );
    await page.screenshot({ path: `${OUT}/statistics-animation-390-reduced-motion.png`, fullPage: true });
    await context.close();
  }

  {
    const { context, page } = await openStatistics(browser, base, { width: 390, height: 844 });
    await page.emulateMedia({ media: "print" });
    await page.waitForTimeout(100);
    const printed = await page.locator(".stats-chart").evaluate((chart) => ({
      lineOffset: getComputedStyle(chart.querySelector(".stats-chart__line")).strokeDashoffset,
      lineDuration: getComputedStyle(chart.querySelector(".stats-chart__line")).animationDuration,
      pointsVisible: [...chart.querySelectorAll(".stats-chart__point")].every((point) => Number(getComputedStyle(point).opacity) === 1),
    }));
    record(
      "print output is immediately static and complete",
      Number.parseFloat(printed.lineOffset) === 0 && printed.lineDuration === "0s" && printed.pointsVisible,
      JSON.stringify(printed),
    );
    await context.close();
  }

  {
    const { context, page } = await openStatistics(browser, base, { width: 390, height: 844 }, { javaScriptEnabled: false });
    const staticChart = await page.locator(".stats-chart").evaluate((chart) => ({
      lineOffset: getComputedStyle(chart.querySelector(".stats-chart__line")).strokeDashoffset,
      pointCount: chart.querySelectorAll(".stats-chart__point").length,
      pointsVisible: [...chart.querySelectorAll(".stats-chart__point")].every((point) => Number(getComputedStyle(point).opacity) === 1),
    }));
    record(
      "JavaScript-off output keeps the full chart",
      Number.parseFloat(staticChart.lineOffset) === 0 && staticChart.pointCount === 9 && staticChart.pointsVisible,
      JSON.stringify(staticChart),
    );
    await context.close();
  }
} finally {
  await browser.close();
  server.close();
}

const failed = checks.filter((check) => !check.pass);
const report = {
  scope: "/statistics snapshot, provenance controls, homepage entry, and chart animation",
  sourceRoot: ROOT,
  overallPass: failed.length === 0,
  totalChecks: checks.length,
  passed: checks.length - failed.length,
  failed: failed.length,
  checks,
};
writeFileSync(`${OUT}/animation-report.json`, JSON.stringify(report, null, 2));
console.log(`\n${report.overallPass ? "ALL PASS" : "FAILURES"} — ${report.passed}/${report.totalChecks}`);
process.exitCode = report.overallPass ? 0 : 1;
