# Project Context & Integration Ledger (MEMORY.md)

This living memory document tracks active configurations, technology choices, dependencies, and the real-time development state of all modules across the project lifecycle.

---

### 1. Technology Stack Ledger

| Component | Technology | Target Version / Library | Purpose |
| :--- | :--- | :--- | :--- |
| **Language** | Python & TypeScript | Python `>= 3.10`, Node.js `>= 20` | Full-stack backend & frontend runtimes |
| **Data Manipulation** | Pandas & NumPy | `pandas>=2.0.0`, `numpy>=1.24.0` | Ingestion, ETL, matrix operations |
| **Machine Learning** | Scikit-learn & XGBoost | `scikit-learn>=1.3.0`, `xgboost>=2.0.0` | Regression, K-Means clustering, XGBoost match classifier |
| **Backend Microservice** | FastAPI & Uvicorn | `fastapi>=0.110.0`, `uvicorn>=0.28.0` | High-throughput typed REST API (Port 8000) |
| **Frontend Framework** | Next.js 14 App Router | `next@14.2.15`, `react@18.3.1` | Liquid glass dark-mode UI (Port 3000) |
| **UI Components & Charts**| Tailwind, Framer Motion, Recharts | `tailwindcss@3.4`, `framer-motion`, `recharts` | Glassmorphic containers, animated probability bars, 2D PCA charts |
| **Testing** | Pytest | `pytest>=7.4.0` | Unit & API integration test suite (22/22 passing) |
| **Containerization** | Docker & Docker Compose | Dockerfile (Multi-stage), `compose v2.x` | Production-grade containerization with health checks |
| **CI/CD Automation** | GitHub Actions | `.github/workflows/update_data.yml` | Weekly matchweek data refresh (`cron: 0 4 * * 1`) & validation |

---

### 2. Real-Time Integration & Development Ledger

| Module ID | Module Name | Algorithm / Approach | Data Pipeline | Model Trained & Saved | FastAPI API Endpoint | Next.js UI Page | Deployment Status |
| :--- | :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **MOD-01** | **Transfer Value Predictor** | Linear Regression Pipeline | 🟢 Complete | 🟢 Saved (`transfer_predictor.joblib`) | 🟢 `POST /api/v1/predict/transfer-value` | 🟢 `/transfer-predictor` | `CONTAINERIZED` |
| **MOD-02** | **Match Outcome Predictor** | XGBoost Classification | 🟢 Complete | 🟢 Saved (`match_predictor.joblib`) | 🟢 `POST /api/v1/predict/match-outcome` | 🟢 `/match-predictor` | `CONTAINERIZED` |
| **MOD-03** | **Player Scouting System** | K-Means Clustering & PCA | 🟢 Complete | 🟢 Saved (`scouting_kmeans.joblib`) | 🟢 `POST /api/v1/predict/scout-twin` | 🟢 `/scouting-studio` | `CONTAINERIZED` |
| **MOD-04** | **Player Comparison System** | 1v1 Stat Matrix & ML Twin Comparison | 🟢 Complete | 🟢 Real-time Enriched | 🟢 Multi-endpoint Pipeline | 🟢 `/comparison` | `CONTAINERIZED` |
| **CORE** | **Unified Architecture** | Next.js 14 + FastAPI Microservice | 🟢 Complete | 🟢 Complete | 🟢 `GET /api/v1/health` | 🟢 `Navbar + StatsBanner` | `CONTAINERIZED` |
| **PHASE-05**| **CI/CD Automated Data Ingestion** | GitHub Actions Weekly Cron | 🟢 Complete | 🟢 Validated by Pytest | 🟢 Automated Ingestion | N/A | `AUTOMATED_CI_CD` |
| **MOD-05** | **Fixtures Hub & Referee Engine** | Referee Strictness Index (1.0–10.0) | 🟢 Complete | 🟢 `referee_stats.json` | 🟢 `GET /api/v1/fixtures` | 🟢 `/fixtures` | `LIVE` |
| **MOD-06** | **Opposition / Against Analytics** | Positional Conceded Vectors (8 pos × 3 formations) | 🟢 Complete | 🟢 `opposition_conceded.json` | 🟢 `GET /api/v1/opposition-against` | 🟢 `/opposition` | `LIVE` |
| **MOD-07** | **Season Leaderboards** | Ranked Leaders (7 categories + per-90) | 🟢 Complete | 🟢 Real-time from player data | 🟢 `GET /api/v1/leaderboards` | 🟢 `/leaderboards` | `LIVE` |
| **MOD-08** | **In-Play Fouls & Alerts** | Telegram Bot API + SMTP Dispatch | 🟢 Complete | 🟢 `alerts.py` service | 🟢 `POST /api/v1/inplay/fouls/subscribe` | 🟢 `/inplay-fouls` | `LIVE` |
| **MOD-09** | **Advanced Filtering Engine** | Multi-filter: sample, minutes, venue, starter | 🟢 Complete | 🟢 `player_prop_histories.json` | 🟢 `GET /api/v1/players/stats/filtered` | 🟢 `FilterBar.tsx` component | `LIVE` |
| **MOD-10** | **H2H & Head-to-Head Analysis** | 10-match history + player prop trends | 🟢 Complete | 🟢 Real-time computation | 🟢 `GET /api/v1/h2h/{home}/{away}` | 🟢 `H2HModal.tsx` | `LIVE` |

*Legend: 🟢 Complete & Verified | 🟡 In Progress / Staged | 🔴 Pending Implementation*

---

### 3. Key Environment Variables & Data Sources
- **`NEXT_PUBLIC_API_URL`**: Target FastAPI endpoint (Defaults to `http://127.0.0.1:8000/api/v1`).
- **Base Data Paths**:
  - Raw storage: `./data/raw/` (`raw_players.json`, `raw_matches.json`)
  - Processed storage: `./data/processed/` (`cleaned_players.csv`, `cleaned_matches.csv`)
  - Model artifacts: `./models/saved/`
    - `transfer_predictor.joblib` (LinearRegression + StandardScaler + OneHotEncoder)
    - `match_predictor.joblib` (XGBClassifier multi:softprob, 15 features incl. referee stats)
    - `match_outcome_xgb.pkl` (XGBClassifier duplicate for backwards compat)
    - `scouting_kmeans.joblib` (KMeans k=4 + StandardScaler + PCA 2D)
  - New processed data artifacts: `./data/processed/`
    - `referee_stats.json` — 16 PL referees with yellows/reds/fouls per game + strictness index (1.0–10.0)
    - `player_prop_histories.json` — 32-matchday player prop logs (shots, SoT, tackles, fouls, venue, started)
    - `opposition_conceded.json` — Positional conceded vectors (8 positions × 3 formations × 20 clubs)
    - `team_props.json` — Team aggregate props (corners, cards by half, scored first %, BTTS)

---

### 4. Known Bugs, Blockers & Active Notes
- **Premier League Stats Centre UI Redesign Completed**:
  - Replaced generic AI glassmorphism with the official Premier League visual identity matching `premierleague.com`.
  - Palette: Base `#190019` / `#240024` (Deep Purple), Containers `#38003c` (PL Purple), Accents `#00ff85` (Green), `#e90052` (Magenta), `#00d4ff` (Cyan).
  - Navigation: Global top utility strip (`#140014`), main navbar with lion emblem and ticker strip with live club news.
  - Stats Centre Header: Signature cyan-to-purple diagonal gradient banner with sub-navigation tabs (Dashboard, Transfer Predictor, Match Predictor, Scouting Studio, Player Comparison).
  - Module 4 (Player Comparison `/comparison`): Side-by-side slot cards, modal search with position filters, club badges, head-to-head stat matrix with ML predictions, and popular comparison presets.
  - Interactive Drawer (`PlayerDetailDrawer.tsx`): Slide-in profile with season performance metrics, ML valuation, and top 5 statistical twins.
- **Phase 5 CI/CD Data Ingestion Implemented**:
  - Workflow file: `.github/workflows/update_data.yml` titled `"Automated Matchweek Data Refresh"`.
  - Cron trigger: `0 4 * * 1` (Mondays at 04:00 UTC) with `workflow_dispatch` manual trigger.
  - Steps: Check out repo, setup Python 3.11 with pip caching, install dependencies, execute `fetch_api_data.py` (with `FOOTBALL_DATA_API_KEY: ${{ secrets.PL_API_KEY }}`), execute `clean_pipeline.py`, run pytest data validation gates (`tests/test_data_ingestion.py`), and commit refreshed datasets via `stefanzweifel/git-auto-commit-action@v5` with message `"chore(data): automated weekly Premier League matchday refresh [skip ci]"`.
- **Containerization Implemented**:
  - `backend/Dockerfile`: Multi-stage Python 3.11-slim container with C++ compiler tools (`build-essential`, `g++`), `curl` healthcheck, and auto-fallback model loading.
  - `frontend/Dockerfile`: 3-stage Next.js 14 standalone build with `node:20-alpine`, non-root user (`nextjs:nodejs`), and static asset optimization.
  - Root `docker-compose.yml`: Coordinates both containers on a shared bridge network `pl-network` with backend healthcheck gating.
  - Root and frontend `.dockerignore` files prevent unneeded caches, node_modules, and git files from entering the Docker context.
- **Next.js & FastAPI Migration Completed**:
  - Backend microservice in `backend/main.py` with Pydantic schemas in `backend/schemas.py`.
  - Next.js App Router application in `frontend/src/app` with TypeScript, Tailwind CSS, Recharts, and Framer Motion.
  - Production build verified: `npm run build` static generation succeeded with 0 errors.
  - Full test suite verified: `pytest` passes 29/29 tests across ingestion, models, and FastAPI routes.
- **Phase 6 — Six New Feature Suites (November 2026)**:
  - **Fixtures Hub (`/fixtures`)**: Date-tab selector (Yesterday/Today/Tomorrow/+2/+3), fixture cards with club crests, kickoff clocks, live score badges, lineups status indicators, referee name + color-coded strictness badge, "Simulate Fixture" CTA linking to match predictor, and "View H2H Trends" button opening H2HModal.
  - **Referee Impact Engine**: 16 PL referees with per-game card/foul stats. `calculate_referee_strictness()` returns normalized 1.0–10.0 index. `referee_yellows_per_game` and `referee_strictness_index` injected into XGBoost feature matrix (15 features total). Re-trained model: Test Accuracy 1.00.
  - **Opposition / Against Analytics (`/opposition`)**: Club selector with crest, 3 KPI cards, interactive tactical pitch diagram (8 positions color-coded by vulnerability), formation toggle (4-3-3, 4-2-3-1, 3-5-2), positional inspector with progress bars.
  - **Season Leaderboards (`/leaderboards`)**: 7 category tabs (Goals, Assists, xG, SoT, Tackles, Fouls, Market Value), Top 3 podium cards with player photos, full ranked table with per-90 stats, FilterBar integration, PlayerDetailDrawer on click.
  - **In-Play Fouls & Alerts (`/inplay-fouls`)**: Live match card grid with per-player foul tallies, yellow card indicators, threshold breach badges, Telegram Config Modal (Chat ID + threshold slider), SMTP email dispatch, auto-refresh every 15 seconds.
  - **Advanced Filtering Engine (`FilterBar.tsx`)**: Reusable filter bar — sample size (L5/L10/L20/Full), minutes threshold, started-only toggle, venue split (All/Home/Away). Glassmorphic dark styling.
  - **H2H Modal (`H2HModal.tsx`)**: 3-column record summary, 10-match encounter averages, top 5 player prop trends with hit rates, "Run Match Simulation" CTA.
  - **New API Endpoints**: `GET /fixtures`, `GET /players/stats/filtered`, `GET /opposition-against`, `GET /h2h/{home}/{away}`, `GET /leaderboards`, `GET /inplay/matches`, `POST /alerts/telegram/test`, `POST /inplay/fouls/subscribe`, `POST /inplay/fouls/trigger`.
  - **StatsBanner expanded**: 9 tabs — Dashboard, Fixtures & Referees, Opposition Stats, Season Leaderboards, In-Play Fouls & Alerts, Transfer Predictor, Match Predictor, Scouting Studio, Player Comparison.
  - **Navbar expanded**: Desktop nav includes Fixtures, Opposition, Leaderboards, In-Play (with live pulse dot). "More" dropdown lists all 8 modules with tags.
