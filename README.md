# PlayerStats — Enterprise AI Football Analytics Suite ⚽📊

A production-grade, full-stack multi-league football intelligence and predictive analytics platform. Combines scikit-learn and XGBoost machine learning engines with an enterprise **Cohere Design System** Next.js 14 frontend and FastAPI microservice backend.

---

## 🌟 Key Features & Predictive Modules

### 1. Transfer Value Predictor (Module 1)
- **Engine**: Regularized Scikit-learn Linear Regression pipeline with `StandardScaler` and `OneHotEncoder`.
- **Validation Gates**: Rigorous holdout benchmark ($R^2 \ge 0.60$, $\text{MAE} \le €15.2\text{M}$).
- **Interactive Suite**: 
  - Dynamic Star Presets (*Haaland, Saka, Palmer, Yamal, Mbappé, Bellingham, Kane, Messi, Ronaldo, etc.*).
  - Searchable Combobox with real-time fuzzy matching across 25+ international star players.
  - Live Recharts actual vs. fitted valuation scatter plot with benchmark regression trendlines.
  - Real-time client-side fallback OLS valuation estimator for offline resiliency.

### 2. Match Outcome Forecaster (Module 2)
- **Engine**: Calibrated multi-class `XGBoost` classifier predicting Home Win, Draw, or Away Win probabilities.
- **Features**: Head-to-Head differential vectors, possession dominance, expected goals ($\text{xG}$), home-pitch bias, and 5-match rolling form.
- **UI**: Visual win probability distribution gauges, historical match logs, and dynamic H2H modal breakdowns.

### 3. Tactical Scouting & Player Twin Engine (Module 3)
- **Engine**: Unsupervised `K-Means` clustering ($k=4$) and 2D Principal Component Analysis (PCA).
- **Tactical Archetypes**: *Elite Finisher*, *Playmaking Maestro*, *Engine Box-to-Box*, and *Defensive Anchor*.
- **Similarity Search**: Euclidean vector distance scoring across standardized metrics to discover top-5 statistical player twins.

### 4. Global Multi-League Intelligence (10 Competitions)
Structured 3-column architecture (Standings, Matchday Fixtures, Leaderboards) across 10 global leagues:
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 **Premier League**
- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 **EFL Championship**
- 🇪🇸 **La Liga**
- 🇩🇪 **Bundesliga**
- 🇮🇹 **Serie A**
- 🇫🇷 **Ligue 1**
- 🇪🇺 **UEFA Champions League**
- 🇺🇸 **Major League Soccer (MLS)**
- 🇸🇦 **Saudi Pro League**
- 🇳🇱 **Eredivisie**

### 5. Real-Time Football News Ribbon (Ticker Tape)
- **Backend Aggregator**: Live RSS ingestion service (`backend/services/live_news.py`) fetching tier-1 global feeds (Sky Sports, BBC Sport, The Guardian).
- **Caching**: Non-blocking in-memory TTL cache (5-minute refresh cycle) preventing rate-limit stalls.
- **Animated Frontend**: Infinite CSS marquee ticker with stationary brand badge, team crests, and category tags.

### 6. Referee & In-Play Match Tracker
- Real-time card averages (🟨 / 🟥), match clocks, lineup status indicators, and tactical against-stats for all upcoming fixtures.

---

## 🎨 Enterprise Design System (Cohere Aesthetic)

The user interface follows the modern **Cohere enterprise design tokens**:
- **Background**: Crisp `#ffffff` canvas with `#eeece7` soft stone surfaces and `#17171c` high-contrast ink typography.
- **Borders**: Sharp 1px hairline dividers (`#d9d9dd`).
- **Accents**: Coral `#ff7759` primary action tag with `#00473e` deep forest green success indicators.
- **Typography**: Clean monospace numeric labels (`Space Mono`) paired with minimalist sans-serif (`Inter` / `Unica77`).

---

## 🛠️ Architecture & Tech Stack

```
[ External Data & Tier-1 RSS Feeds ]
                │
                ▼
      [ FastAPI Microservice ] (port 8000)
    ├── Services (global_football, live_news)
    ├── Serialized ML Models (.joblib)
    └── Pydantic v2 Schema Validation
                │
                ▼
      [ Next.js 14 Frontend ] (port 3000)
    ├── App Router (12 Static & Dynamic Routes)
    ├── Cohere Enterprise Tailwind Design System
    ├── Recharts Scatter & Radar Analytics
    └── Client-Side Offline Fallback Pipelines
```

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts.
- **Backend**: FastAPI, Uvicorn, Pydantic v2, HTTPX, ElementTree XML parsing.
- **Machine Learning**: Scikit-learn 1.6+, XGBoost, NumPy, Pandas, Joblib.
- **DevOps**: Docker & Docker Compose (`node:20-alpine`, `python:3.11-slim`).
- **Test Suite**: Automated Pytest suite with **42 passing tests** (100% pass rate).

---

## 🚀 Getting Started

### Option 1: Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/Geeky-ash/Premier-League.git
cd Premier-League

# Start both services
docker compose up --build -d

# Access applications:
# Frontend:          http://localhost:3000
# Backend API Docs:  http://localhost:8000/docs
```

### Option 2: Local Development Setup

#### 1. Backend API (FastAPI)
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Frontend Application (Next.js 14)
```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Accessible at http://localhost:3000
```

---

## 🧪 Automated Testing & Validation

The codebase includes an exhaustive test suite covering ETL pipelines, ML validation gates, API contracts, and frontend CSS token conformity:

```bash
# Run complete test suite (42 tests)
pytest tests/ -v
```

```
====================== 42 passed, 71 warnings in 35.66s =======================
tests/test_api.py ....................                                   [ 47%]
tests/test_data_ingestion.py .......                                     [ 64%]
tests/test_frontend.py ......                                            [ 78%]
tests/test_models.py .........                                           [100%]
```

---

## 📂 Project Structure

```
├── backend/
│   ├── main.py                    # Unified FastAPI endpoints & lifespan handlers
│   ├── schemas.py                 # Strict Pydantic v2 request/response contracts
│   └── services/
│       ├── global_football.py     # 10-league data, fixtures, radar stats & fuzzy search
│       └── live_news.py           # Real-time RSS news ingestion with TTL caching
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # Root layout with Cohere navbar, news ribbon & footer
│   │   │   ├── page.tsx           # Enterprise stats dashboard
│   │   │   ├── transfer-predictor/ # Module 1: Transfer Value Predictor with combobox
│   │   │   ├── match-predictor/   # Module 2: Match Outcome Predictor
│   │   │   ├── scouting-studio/   # Module 3: K-Means Tactical Twin Engine
│   │   │   ├── fixtures/          # Global 10-league fixtures & calendar
│   │   │   ├── leaderboards/      # Cross-league stat leaders
│   │   │   ├── opposition/        # Team concession & against-stats
│   │   │   ├── inplay-fouls/      # Referee & card disciplinary tracking
│   │   │   └── league/[slug]/     # Dynamic 3-column league overview
│   │   ├── components/            # Navbar, NewsTicker, H2HModal, Drawer, Modals
│   │   └── lib/                   # api.ts (REST client), logos.ts (CDN mappings)
├── models/                        # Serialized .joblib artifacts & training pipelines
├── data/                          # Raw, processed, and cached datasets
├── tests/                         # Pytest suite (42 unit, ML, and API test cases)
├── docker-compose.yml             # Orchestrated multi-container deployment
└── README.md
```

---

## 📄 License
MIT License. Created by [Ashirwad Sharma](https://github.com/Geeky-ash).
