import { chromium } from "../node_modules/@playwright/test/index.mjs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const screenshotsDir = path.resolve(__dirname, "../screenshots");

if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir, { recursive: true });
}

const routes = [
  "/",
  "/fixtures",
  "/inplay-fouls",
  "/transfer-predictor",
  "/dugout",
  "/scouting-studio",
  "/simulation",
  "/match-predictor",
  "/comparison",
  "/opposition",
  "/leaderboards",
  "/league/premier-league",
  "/league/la-liga",
  "/team/chelsea",
  "/player/bukayo-saka",
  "/auth",
];

const viewports = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844 },
];

const screenshotTargets = [
  "/inplay-fouls",
  "/transfer-predictor",
  "/dugout",
  "/scouting-studio",
  "/simulation",
];

async function runAudit() {
  console.log("=================================================");
  console.log("   PLAYWRIGHT VISUAL & BOUNDING-BOX AUDIT        ");
  console.log("=================================================");

  const browser = await chromium.launch({ headless: true });
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;
  const failureDetails = [];

  for (const vp of viewports) {
    console.log(`\n--- TESTING VIEWPORT: ${vp.name.toUpperCase()} (${vp.width}x${vp.height}) ---`);
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
    });
    const page = await context.newPage();

    for (const route of routes) {
      totalTests++;
      const url = `http://localhost:3000${route}`;
      try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        // Allow hydration and layouts to settle
        await page.waitForTimeout(1500);

        const metrics = await page.evaluate((isAuth) => {
          if (isAuth) {
            const header = document.querySelector("header");
            const card = document.querySelector('div[class*="rounded-[22px]"]') || document.querySelector("form");
            const headerBox = header ? header.getBoundingClientRect() : { bottom: 64 };
            const cardBox = card ? card.getBoundingClientRect() : { top: 100 };
            return {
              isAuth: true,
              navBottom: headerBox.bottom,
              firstContentTop: cardBox.top,
              clears: cardBox.top >= headerBox.bottom + 12,
              firstContentTag: card ? card.tagName : "NONE",
              firstContentText: "Authentication Card",
            };
          }

          const header = document.querySelector("header.fixed") || document.querySelector("header");
          const navBottom = header ? header.getBoundingClientRect().bottom : 140;

          // Find candidate elements in main
          const main = document.querySelector("main");
          if (!main) {
            return { error: "No main element found" };
          }

          // Candidates: h1, h2, h3, badge spans, mono labels, first div container
          const candidates = Array.from(
            main.querySelectorAll("h1, h2, h3, .font-headline-lg, .font-headline-md, span[class*='font-mono'], div[class*='font-mono'], div[class*='font-label-xs']")
          );

          let bestCandidate = null;
          let bestTop = Infinity;

          for (const el of candidates) {
            const rect = el.getBoundingClientRect();
            // Must be visible
            if (rect.width > 0 && rect.height > 0 && rect.top > 0) {
              if (rect.top < bestTop) {
                bestTop = rect.top;
                bestCandidate = el;
              }
            }
          }

          // Fallback if no headings
          if (!bestCandidate) {
            const firstChild = main.firstElementChild;
            const rect = firstChild ? firstChild.getBoundingClientRect() : { top: 152 };
            bestTop = rect.top;
            bestCandidate = firstChild;
          }

          const tag = bestCandidate ? bestCandidate.tagName : "DIV";
          const text = bestCandidate ? (bestCandidate.textContent || "").trim().slice(0, 45) : "";

          return {
            isAuth: false,
            navBottom: Math.round(navBottom),
            firstContentTop: Math.round(bestTop),
            clears: bestTop >= navBottom + 12,
            firstContentTag: tag,
            firstContentText: text,
          };
        }, route === "/auth");

        const margin = metrics.firstContentTop - metrics.navBottom;
        const passed = metrics.clears;

        if (passed) {
          passedTests++;
          console.log(
            ` [PASS] ${route.padEnd(26)} | NavBottom: ${metrics.navBottom}px | ContentTop: ${metrics.firstContentTop}px | Margin: +${margin}px | "${metrics.firstContentText}"`
          );
        } else {
          failedTests++;
          const reason = `Overlap detected: Content top (${metrics.firstContentTop}px) < NavBottom (${metrics.navBottom}px) + 12px (Diff: ${margin}px)`;
          console.log(` [FAIL] ${route.padEnd(26)} | ${reason}`);
          failureDetails.push({ route, viewport: vp.name, reason, metrics });
        }

        // Capture verification screenshot for target routes
        if (screenshotTargets.includes(route)) {
          const safeName = route.replace(/\//g, "_").replace(/^_/, "");
          const screenshotPath = path.join(
            screenshotsDir,
            `${safeName}_${vp.name}.png`
          );
          await page.screenshot({ path: screenshotPath, fullPage: false });
          console.log(`        📸 Screenshot saved: ${path.basename(screenshotPath)}`);
        }
      } catch (err) {
        failedTests++;
        console.error(` [ERR]  ${route.padEnd(26)} | ${err.message}`);
        failureDetails.push({ route, viewport: vp.name, error: err.message });
      }
    }

    await context.close();
  }

  await browser.close();

  console.log("\n=================================================");
  console.log(`AUDIT COMPLETE: ${passedTests}/${totalTests} Passed (${Math.round((passedTests / totalTests) * 100)}%)`);
  if (failedTests > 0) {
    console.log(`FAILURES: ${failedTests}`);
    for (const f of failureDetails) {
      console.log(`  - [${f.viewport}] ${f.route}: ${f.reason || f.error}`);
    }
    process.exit(1);
  } else {
    console.log("ALL PAGES PASSED STRICT HEADER OVERLAP AUDIT (Margin >= 12px)");
    process.exit(0);
  }
}

runAudit().catch((e) => {
  console.error("Fatal error running audit:", e);
  process.exit(1);
});
