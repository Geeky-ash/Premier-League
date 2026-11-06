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

*Legend: 🟢 Complete & Verified | 🟡 In Progress / Staged | 🔴 Pending Implementation*

---

### 3. Key Environment Variables & Data Sources
- **`NEXT_PUBLIC_API_URL`**: Target FastAPI endpoint (Defaults to `http://127.0.0.1:8000/api/v1`).
- **Base Data Paths**:
  - Raw storage: `./data/raw/` (`raw_players.json`, `raw_matches.json`)
  - Processed storage: `./data/processed/` (`cleaned_players.csv`, `cleaned_matches.csv`)
  - Model artifacts: `./models/saved/`
    - `transfer_predictor.joblib` (LinearRegression + StandardScaler + OneHotEncoder)
    - `match_predictor.joblib` (XGBClassifier multi:softprob)
    - `scouting_kmeans.joblib` (KMeans k=4 + StandardScaler + PCA 2D)

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
  - Full test suite verified: `pytest` passes 22/22 tests across ingestion, models, and FastAPI routes.
