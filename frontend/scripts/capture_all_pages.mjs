import { chromium } from "../node_modules/@playwright/test/index.mjs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.resolve(__dirname, "../../screenshots/new_ui");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const pagesToCapture = [
  { file: "01_matchday_hub.png", path: "/", name: "Early Kickoffs & Live Matchday Hub" },
  { file: "02_fixtures.png", path: "/fixtures", name: "Worldwide Matchday Workspace" },
  { file: "03_inplay_fouls.png", path: "/inplay-fouls", name: "In-Play Fouls & Alert Webhook" },
  { file: "04_transfer_predictor.png", path: "/transfer-predictor", name: "Transfer Value Predictor" },
  { file: "05_dugout_tactical.png", path: "/dugout", name: "Dugout Tablet Tactical View" },
  { file: "06_scouting_studio.png", path: "/scouting-studio", name: "Player Scouting Studio & Twins" },
  { file: "07_substitution_simulation.png", path: "/simulation", name: "Substitution Timeline Simulation" },
  { file: "08_match_predictor.png", path: "/match-predictor", name: "XGBoost Match Predictor & 11v11 Canvas" },
  { file: "09_player_comparison.png", path: "/comparison", name: "Player Comparison Matrix" },
  { file: "10_opposition_analytics.png", path: "/opposition", name: "Opposition & Against Conceded Analytics" },
  { file: "11_leaderboards.png", path: "/leaderboards", name: "Premier League Statistical Leaders" },
  { file: "12_referees_telemetry.png", path: "/referees", name: "Referee Tendency Dial & PGMOL Telemetry" },
  { file: "13_league_premier_league.png", path: "/league/premier-league", name: "Premier League Standings & Stats" },
  { file: "14_league_la_liga.png", path: "/league/la-liga", name: "La Liga Standings & Verified Scorers" },
  { file: "15_team_chelsea.png", path: "/team/chelsea", name: "Chelsea FC Record & Match Logs" },
  { file: "16_player_bukayo_saka.png", path: "/player/bukayo-saka", name: "Player Profile & Goal Frame Shot Map" },
  { file: "17_auth_terminal.png", path: "/auth", name: "Minimal Authentication Terminal" },
];

async function captureAll() {
  console.log("Launching Chromium for Full Suite Screenshot Capture (New UI)...");
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2, // 2x retina clarity
  });
  const page = await context.newPage();

  for (const item of pagesToCapture) {
    const url = `http://localhost:3000${item.path}`;
    console.log(`Capturing: ${item.name} (${url}) -> ${item.file}`);
    try {
      await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
      await page.waitForTimeout(1500); // Allow charts, radar, and feeds to populate
      const dest = path.join(outputDir, item.file);
      await page.screenshot({ path: dest, fullPage: false });
      console.log(`  ✓ Saved: ${dest}`);
    } catch (err) {
      console.error(`  ✗ Error capturing ${item.path}:`, err.message);
    }
  }

  await browser.close();
  console.log("\nAll 17 New UI screenshots captured successfully in /screenshots/new_ui/!");
}

captureAll().catch((e) => {
  console.error("Capture script failed:", e);
  process.exit(1);
});
