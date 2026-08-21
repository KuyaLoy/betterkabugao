/**
 * Checkpoint-1 QA harness for "Kabugao in View" (committed, reproducible).
 *
 *   npm run qa            # builds, then runs this against a Cloudflare-like server
 *   node scripts/qa/checkpoint1.mjs   # runs against an already-built dist/
 *
 * Every required condition is a boolean check. The process EXITS NON-ZERO if any
 * required check fails — a failed measurement can never be reported as passed.
 * A pass/fail report is written to docs/qa/checkpoint-1/qa-report.json.
 *
 * Served the way Cloudflare Pages serves (clean URLs -> prerendered files) via
 * scripts/qa/serve.mjs, NOT vite preview's SPA fallback. External OSM tiles are
 * network-blocked in CI/sandboxes; those console errors are filtered out — pins
 * are local divIcons and attribution is DOM text/links, so both still render.
 *
 * Requires a Chromium provided by Playwright. On a fresh clone: `npm install`
 * (auto-fetches the matching browser) or `npx playwright install chromium`.
 */
import { chromium } from "playwright";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { startServer } from "./serve.mjs";

const OUT = fileURLToPath(new URL("../../docs/qa/checkpoint-1/", import.meta.url));
mkdirSync(OUT, { recursive: true });

const SIZES = [
  // 305 = a 320px Windows window minus a ~15px classic (non-overlay) scrollbar.
  // Headless Chromium uses overlay scrollbars (0px), so it never reduced the
  // content area on its own; testing 305 reproduces the classic reduction and
  // catches any element that forces a 320px min-width (horizontal overflow).
  { w: 305, h: 568 },
  { w: 320, h: 568 },
  { w: 360, h: 780 },
  { w: 390, h: 844 },
  { w: 768, h: 900 },
  { w: 1280, h: 900 },
  { w: 1440, h: 900 },
];
const ROUTES = [
  ["/", "home"],
  ["/government/barangays", "barangays"],
  ["/government/barangays/poblacion", "poblacion"],
];
const EXPECTED_ERR = /tile\.openstreetmap\.org|openstreetmap|open-meteo|Failed to load resource|net::ERR|ERR_|favicon/i;

const checks = [];
function record(name, pass, detail) {
  checks.push({ name, pass: !!pass, detail: detail === undefined ? null : String(detail) });
  console.log(`${pass ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
}

async function launchBrowser() {
  try {
    return await chromium.launch({ headless: true });
  } catch (e1) {
    try {
      return await chromium.launch({ headless: true, executablePath: "/opt/pw-browsers/chromium-1194/chrome-linux/chrome" });
    } catch {
      console.error("\nCould not launch Chromium. On a fresh clone run:  npx playwright install chromium\n" + String(e1 && e1.message));
      process.exit(2);
    }
  }
}

async function stable(page, base, path) {
  await page.goto(base + path, { waitUntil: "domcontentloaded", timeout: 25000 });
  await page.waitForTimeout(1700);
}

const menuVisible = (page) =>
  page.evaluate(() => {
    const m = document.querySelector(".mast__menu");
    if (!m) return false;
    const cs = getComputedStyle(m);
    const r = m.getBoundingClientRect();
    return cs.display !== "none" && parseFloat(cs.opacity) > 0.01 && r.height > 0;
  });

async function main() {
  // Ensure the site is built. Idempotent: the verification sequence runs
  // `npm test` first (which builds via pretest), so dist/ already exists here
  // and we do NOT rebuild; run standalone, we build once. Never twice.
  const distIndex = fileURLToPath(new URL("../../dist/index.html", import.meta.url));
  if (!existsSync(distIndex)) {
    console.log("dist/ not found — building once (npm run build)…");
    execSync("npm run build", { stdio: "inherit", cwd: fileURLToPath(new URL("../../", import.meta.url)) });
  }

  const { server, base } = await startServer(0);
  const browser = await launchBrowser();

  // 1. Layout matrix
  for (const { w, h } of SIZES) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    const errs = [];
    page.on("console", (m) => { if (m.type() === "error" && !EXPECTED_ERR.test(m.text())) errs.push(m.text()); });
    page.on("pageerror", (e) => { if (!EXPECTED_ERR.test(e.message)) errs.push("PAGEERROR: " + e.message); });
    for (const [path, name] of ROUTES) {
      await stable(page, base, path);
      const m = await page.evaluate(() => ({
        overflow: Math.ceil(document.documentElement.scrollWidth) - window.innerWidth,
        h1: document.querySelectorAll("h1").length,
        main: document.querySelectorAll("main").length,
      }));
      record(`[${w}x${h}] ${name}: no horizontal overflow`, m.overflow <= 1, `overflow=${m.overflow}px`);
      record(`[${w}x${h}] ${name}: one <h1>`, m.h1 === 1, `h1=${m.h1}`);
      record(`[${w}x${h}] ${name}: one <main>`, m.main === 1, `main=${m.main}`);
    }
    record(`[${w}x${h}] no hydration/serious console errors`, errs.length === 0, errs.slice(0, 3).join(" | ") || "clean");
    await ctx.close();
  }

  // 2. Emergency label
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await stable(page, base, "/government/barangays");
    const emg = await page.evaluate(() => {
      const a = [...document.querySelector("header").querySelectorAll("a")].find((x) =>
        (x.getAttribute("aria-label") || "").toLowerCase().includes("emergency"),
      );
      return { label: a && a.getAttribute("aria-label"), href: a && a.getAttribute("href") };
    });
    record(`emergency link name does not promise to call 911`, emg.label && !/call 911/i.test(emg.label), `aria-label="${emg.label}"`);
    record(`emergency link -> /emergency`, emg.href === "/emergency", `href=${emg.href}`);
    await ctx.close();
  }

  // 3. Directory: crawlable links + separate preview + plain click navigates
  {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await stable(page, base, "/government/barangays");
    const info = await page.evaluate(() => {
      const ul = document.querySelector("ul.kv-dir");
      const links = [...ul.querySelectorAll("a.kv-dir__link")];
      return {
        links: links.length,
        allAnchors: links.every((a) => a.tagName === "A" && /^\/government\/barangays\/[^/]+$/.test(a.getAttribute("href") || "")),
        buttons: ul.querySelectorAll("button.kv-dir__preview").length,
      };
    });
    record(`directory has 21 crawlable barangay links`, info.links === 21 && info.allAnchors, `links=${info.links}`);
    record(`directory has 21 separate preview controls`, info.buttons === 21, `buttons=${info.buttons}`);
    await page.locator("a.kv-dir__link").first().click();
    await page.waitForTimeout(400);
    const url = await page.evaluate(() => location.pathname);
    record(`plain click on a directory link navigates`, /^\/government\/barangays\/[^/]+$/.test(url) && url !== "/government/barangays", `url=${url}`);
    await ctx.close();
  }

  // 4. Search Escape (desktop + mobile): close, clear, refocus trigger
  for (const { w, h, tag } of [{ w: 1440, h: 900, tag: "desktop" }, { w: 390, h: 844, tag: "mobile" }]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    await stable(page, base, "/");
    await page.locator("#site-search-trigger").click();
    await page.waitForTimeout(250);
    const opened = await page.evaluate(() => (document.querySelector("dialog.palette") || {}).open === true);
    await page.fill("#palette-input", "poblacion");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    const after = await page.evaluate(() => ({
      open: (document.querySelector("dialog.palette") || {}).open,
      value: (document.querySelector("#palette-input") || {}).value,
      focusTrigger: document.activeElement === document.getElementById("site-search-trigger"),
    }));
    record(`[${tag}] Search opens from header`, opened);
    record(`[${tag}] Escape closes Search with a query typed`, after.open === false, `open=${after.open}`);
    record(`[${tag}] Escape clears the query`, after.value === "", `value="${after.value}"`);
    record(`[${tag}] Escape refocuses the Search trigger`, after.focusTrigger);
    await ctx.close();
  }

  // 5. LAYERED Escape (390): 1st closes only Search, 2nd closes the sheet
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await stable(page, base, "/government/barangays");
    await page.locator("button.kv-dir__preview").first().click();
    await page.waitForTimeout(250);
    const sheetOpen1 = await page.evaluate(() => !!document.querySelector(".kv-sheet"));
    await page.locator("#site-search-trigger").click();
    await page.waitForTimeout(250);
    await page.fill("#palette-input", "poblacion");
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    const afterFirst = await page.evaluate(() => ({
      searchOpen: (document.querySelector("dialog.palette") || {}).open,
      sheet: !!document.querySelector(".kv-sheet"),
      focusTrigger: document.activeElement === document.getElementById("site-search-trigger"),
    }));
    await page.keyboard.press("Escape");
    await page.waitForTimeout(250);
    const afterSecond = await page.evaluate(() => ({
      sheet: !!document.querySelector(".kv-sheet"),
      focusPreview: document.activeElement && document.activeElement.classList.contains("kv-dir__preview"),
    }));
    record(`[390] layered: sheet opens`, sheetOpen1);
    record(`[390] layered: 1st Escape closes ONLY Search`, afterFirst.searchOpen === false && afterFirst.sheet === true, `search=${afterFirst.searchOpen} sheet=${afterFirst.sheet}`);
    record(`[390] layered: 1st Escape refocuses Search trigger`, afterFirst.focusTrigger);
    record(`[390] layered: 2nd Escape closes the sheet`, afterSecond.sheet === false);
    record(`[390] layered: 2nd Escape refocuses the preview button`, afterSecond.focusPreview);
    await ctx.close();
  }

  // 6. Menu closes when Search opens via '/', stays closed after navigation
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await stable(page, base, "/government/barangays");
    await page.locator(".mast__burger").click();
    await page.waitForTimeout(200);
    const openExpanded = await page.evaluate(() => document.querySelector(".mast__burger").getAttribute("aria-expanded"));
    await page.keyboard.press("/");
    await page.waitForTimeout(250);
    const afterSlash = await page.evaluate(() => ({
      overlay: (document.querySelector("dialog.palette") || {}).open,
      expanded: document.querySelector(".mast__burger").getAttribute("aria-expanded"),
    }));
    await page.fill("#palette-input", "poblacion");
    await page.waitForTimeout(200);
    await page.locator("dialog.palette a[data-result]").first().click();
    await page.waitForTimeout(400);
    const afterNav = await page.evaluate(() => ({
      url: location.pathname,
      expanded: document.querySelector(".mast__burger").getAttribute("aria-expanded"),
    }));
    record(`[390] '/' shortcut works while menu open (menu was expanded)`, openExpanded === "true");
    record(`[390] opening Search via '/' closes the menu`, afterSlash.overlay === true && afterSlash.expanded === "false", `overlay=${afterSlash.overlay} expanded=${afterSlash.expanded}`);
    record(`[390] menu stays closed after navigating from a result`, afterNav.expanded === "false", `url=${afterNav.url} expanded=${afterNav.expanded}`);
    await ctx.close();
  }

  // 7. Menu closes on logo/Search/Emergency + resize hides it
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    for (const [selector, label] of [[".mast__menu-link", "destination"], [".mast__home", "logo"], ["#site-search-trigger", "Search"]]) {
      await stable(page, base, "/government/barangays");
      await page.locator(".mast__burger").click();
      await page.waitForTimeout(180);
      const wasOpen = await menuVisible(page);
      await page.locator(selector).first().click();
      await page.waitForTimeout(300);
      const closed = !(await menuVisible(page));
      record(`[390] activating ${label} closes the menu`, wasOpen && closed);
      await page.keyboard.press("Escape");
    }
    await stable(page, base, "/");
    await page.locator(".mast__burger").click();
    await page.waitForTimeout(180);
    const before = await menuVisible(page);
    await page.setViewportSize({ width: 1280, height: 900 });
    await page.waitForTimeout(300);
    const after = await menuVisible(page);
    const desktopNav = await page.evaluate(() => getComputedStyle(document.querySelector(".mast__nav")).display !== "none");
    record(`[390->1280] menu not visible beside desktop nav after resize`, before && !after, `before=${before} after=${after}`);
    record(`[1280] desktop nav visible`, desktopNav);
    await ctx.close();
  }

  // 8. Menu motion + inert focusability
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await stable(page, base, "/government/barangays");
    const dur = await page.evaluate(() => {
      const cs = getComputedStyle(document.querySelector(".mast__menu"));
      const secs = (cs.transitionDuration || "0s").split(",")[0];
      return Math.round(parseFloat(secs) * 1000);
    });
    record(`[390] menu has a restrained transition (180-260ms)`, dur >= 160 && dur <= 260, `${dur}ms`);
    // Closed menu links must NOT be keyboard-focusable (inert).
    const closedFocusable = await page.evaluate(() => {
      const link = document.querySelector(".mast__menu .mast__menu-link");
      if (!link) return "no-link";
      link.focus();
      return document.activeElement === link;
    });
    record(`[390] closed-menu links are not focusable (inert)`, closedFocusable === false, `focusable=${closedFocusable}`);
    await ctx.close();

    const rm = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: "reduce" });
    const p2 = await rm.newPage();
    await stable(p2, base, "/government/barangays");
    const rmDur = await p2.evaluate(() => {
      const cs = getComputedStyle(document.querySelector(".mast__menu"));
      return Math.round(parseFloat((cs.transitionDuration || "0s").split(",")[0]) * 1000);
    });
    record(`[390] reduced-motion removes the menu transition`, rmDur === 0, `${rmDur}ms`);
    await rm.close();
  }

  // 9. Logo: bigger wordmark on desktop, symbol-only on phones
  {
    const d = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const pd = await d.newPage();
    await stable(pd, base, "/");
    const desk = await pd.evaluate(() => {
      const logo = document.querySelector(".mast__logo");
      const mark = document.querySelector(".mast__mark");
      return {
        logoShown: getComputedStyle(logo).display !== "none",
        markHidden: getComputedStyle(mark).display === "none",
        logoH: Math.round(logo.getBoundingClientRect().height),
      };
    });
    record(`[1440] desktop shows the full wordmark`, desk.logoShown && desk.markHidden);
    record(`[1440] wordmark is a readable size (>=40px)`, desk.logoH >= 40, `${desk.logoH}px`);
    await d.close();

    const m = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const pm = await m.newPage();
    await stable(pm, base, "/");
    const mob = await pm.evaluate(() => {
      const logo = document.querySelector(".mast__logo");
      const mark = document.querySelector(".mast__mark");
      const home = document.querySelector(".mast__home");
      return {
        logoHidden: getComputedStyle(logo).display === "none",
        markShown: getComputedStyle(mark).display !== "none",
        markH: Math.round(mark.getBoundingClientRect().height),
        homeName: home.getAttribute("aria-label"),
      };
    });
    record(`[390] phone shows the symbol-only mark, not the wordmark`, mob.logoHidden && mob.markShown, `markH=${mob.markH}`);
    record(`[390] home link keeps its accessible name`, mob.homeName === "BetterKabugao.org home", `name="${mob.homeName}"`);
    await m.close();
  }

  // 9b. Mobile homepage header has a solid (opaque navy) surface, not transparent
  for (const { w, h } of [{ w: 320, h: 568 }, { w: 360, h: 780 }, { w: 390, h: 844 }]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    await stable(page, base, "/");
    const hdr = await page.evaluate(() => {
      const el = document.querySelector("header.mast");
      const bg = getComputedStyle(el).backgroundColor;
      const m = bg.match(/rgba?\(([^)]+)\)/);
      const parts = m ? m[1].split(",").map((n) => parseFloat(n)) : [0, 0, 0, 0];
      const alpha = parts.length >= 4 ? parts[3] : 1;
      return { bg, alpha, over: el.classList.contains("mast--over") };
    });
    record(`[${w}x${h}] homepage mobile header has an opaque navy surface`, hdr.over && hdr.alpha >= 0.99 && hdr.bg !== "rgba(0, 0, 0, 0)", `bg=${hdr.bg}`);
    if (w === 390) await page.screenshot({ path: `${OUT}/header-mobile-home.png`, fullPage: false });
    await ctx.close();
  }

  // 10. Sheet focus management (390)
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await stable(page, base, "/government/barangays");
    await page.locator("button.kv-dir__preview").first().click();
    await page.waitForTimeout(300);
    const onOpen = await page.evaluate(() => {
      const s = document.querySelector(".kv-sheet");
      return { sheet: !!s, focusIn: s ? s.contains(document.activeElement) : false };
    });
    record(`[390] preview opens the sheet`, onOpen.sheet);
    record(`[390] opening moves focus into the sheet`, onOpen.focusIn);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(200);
    const onEsc = await page.evaluate(() => ({
      sheet: !!document.querySelector(".kv-sheet"),
      focusPreview: document.activeElement && document.activeElement.classList.contains("kv-dir__preview"),
    }));
    record(`[390] Escape closes the sheet`, onEsc.sheet === false);
    record(`[390] Escape refocuses the preview button`, onEsc.focusPreview);
    await page.locator("button.kv-dir__preview").first().click();
    await page.waitForTimeout(150);
    await page.fill('input[aria-label="Filter barangays by name or PSGC code"]', "waga");
    await page.waitForTimeout(250);
    const onFilter = await page.evaluate(() => ({
      sheet: !!document.querySelector(".kv-sheet"),
      focusFilter: document.activeElement && document.activeElement.getAttribute("aria-label") === "Filter barangays by name or PSGC code",
    }));
    record(`[390] filtering out the selection closes the sheet`, onFilter.sheet === false);
    record(`[390] filtering out focuses the filter (not body)`, onFilter.focusFilter);
    await ctx.close();
  }

  // 11. Linked OSM attribution: uncovered with sheet open + present with JS off
  for (const { w, h } of [{ w: 320, h: 568 }, { w: 320, h: 640 }, { w: 390, h: 844 }, { w: 768, h: 900 }]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    await stable(page, base, "/government/barangays");
    await page.locator("button.kv-dir__preview").first().click();
    await page.waitForTimeout(400);
    const ok = await page.evaluate(() => {
      const links = [...document.querySelectorAll("a")].filter((a) => /openstreetmap\.org/i.test(a.getAttribute("href") || ""));
      return links.some((a) => {
        const r = a.getBoundingClientRect();
        const inView = r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= window.innerHeight + 0.5 && r.left >= 0 && r.right <= window.innerWidth + 0.5;
        if (!inView) return false;
        const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        return !!top && (top === a || a.contains(top) || top.contains(a));
      });
    });
    record(`[${w}x${h}] linked OSM attribution visible & uncovered with sheet open`, ok);
    if (w === 390) await page.screenshot({ path: `${OUT}/barangays-sheet-mobile.png`, fullPage: false });
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, javaScriptEnabled: false });
    const page = await ctx.newPage();
    for (const [path] of ROUTES) {
      await page.goto(base + path, { waitUntil: "domcontentloaded" });
      const linked = await page.evaluate(() =>
        [...document.querySelectorAll("a")].some((a) => /openstreetmap\.org\/copyright/i.test(a.getAttribute("href") || "")),
      );
      record(`[no-JS] ${path} has a linked OpenStreetMap attribution`, linked);
    }
    await ctx.close();
  }

  // 12. Hero search opens overlay
  {
    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await ctx.newPage();
    await stable(page, base, "/");
    await page.locator(".kv-hero__search").click();
    await page.waitForTimeout(200);
    record(`hero search opens the site overlay`, await page.evaluate(() => (document.querySelector("dialog.palette") || {}).open === true));
    await ctx.close();
  }

  // 13. reduced-motion hero + focus ring + /404 not in sitemap
  {
    const rm = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
    const p = await rm.newPage();
    await stable(p, base, "/");
    record(`reduced-motion disables hero animation`, (await p.evaluate(() => getComputedStyle(document.querySelector(".kv-hero__title")).animationName)) === "none");
    await rm.close();

    const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const p2 = await ctx.newPage();
    await stable(p2, base, "/government/barangays");
    let ring = null;
    for (let i = 0; i < 6 && !ring; i++) {
      await p2.keyboard.press("Tab");
      ring = await p2.evaluate(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        return (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || cs.boxShadow !== "none" ? cs.outline : null;
      });
    }
    record(`visible focus ring on keyboard focus`, !!ring, ring || "none");
    const sitemap = await (await fetch(base + "/sitemap.xml")).text();
    record(`/404 excluded from sitemap.xml`, !/\/404/.test(sitemap));
    await ctx.close();
  }

  // Screenshots (artifacts; non-failing)
  for (const [w, h, tag] of [[1280, 900, "desktop"], [390, 844, "mobile"]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h } });
    const page = await ctx.newPage();
    for (const [path, name] of ROUTES) {
      await stable(page, base, path);
      await page.screenshot({ path: `${OUT}/${name}-${tag}.png`, fullPage: true });
    }
    await stable(page, base, "/");
    await page.locator("#site-search-trigger").click();
    await page.waitForTimeout(250);
    await page.fill("#palette-input", "pobla");
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${OUT}/search-open-${tag}.png`, fullPage: false });
    await ctx.close();
  }
  {
    const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await ctx.newPage();
    await stable(page, base, "/");
    await page.locator(".mast__burger").click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/menu-open-mobile.png`, fullPage: false });
    await ctx.close();
  }

  await browser.close();
  server.close();

  const failed = checks.filter((c) => !c.pass);
  const report = {
    note: "Checkpoint-1 committed QA (npm run qa). Served like Cloudflare Pages (clean URLs). External OSM tiles are network-blocked here and filtered from console-error checks; pins and attribution still render.",
    sizes: SIZES.map((s) => `${s.w}x${s.h}`),
    overallPass: failed.length === 0,
    totalChecks: checks.length,
    passed: checks.length - failed.length,
    failed: failed.length,
    failures: failed.map((c) => ({ name: c.name, detail: c.detail })),
    checks,
  };
  writeFileSync(`${OUT}/qa-report.json`, JSON.stringify(report, null, 2));
  console.log(`\n===== ${report.overallPass ? "ALL PASS" : "FAILURES PRESENT"} — ${report.passed}/${report.totalChecks} checks =====`);
  if (failed.length) failed.forEach((c) => console.log(`  - ${c.name} (${c.detail})`));
  process.exit(report.overallPass ? 0 : 1);
}

main().catch((e) => {
  console.error("QA HARNESS ERROR:", e);
  process.exit(2);
});
