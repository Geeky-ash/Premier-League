# Premier League Analytics Platform ⚽📊

A production-grade, full-stack football intelligence and predictive analytics suite combining high-performance machine learning models with a modern liquid-glassmorphic Next.js 14 frontend and FastAPI microservice backend.

---

## 🌟 Key Features & ML Modules

1. **Transfer Value Predictor (Module 1)**:
   - Scikit-learn Linear Regression pipeline with `StandardScaler` & `OneHotEncoder`.
   - Predicts fair market value (€M) from performance metrics (goals, assists, minutes, age, position).
   - Dynamic comparison against league regression trendlines.

2. **Match Outcome Predictor (Module 2)**:
   - Multi-class `XGBoost` classifier predicting Home Win, Draw, or Away Win probabilities.
   - Evaluates tactical diffs: shots, possession dominance, expected goals, and 5-match rolling form.
   - Real-time animated probability distribution bars with Premier League neon branding.

3. **Player Scouting & Similarity Engine (Module 3)**:
   - Unsupervised `K-Means` clustering ($k=4$) and 2D Principal Component Analysis (PCA).
   - Generates tactical archetypes (*Elite Finisher*, *Playmaking Maestro*, *Engine Box-to-Box*, *Defensive Anchor*).
   - Euclidean vector similarity calculation to discover top-5 statistical player twins.

---

## 🛠️ Tech Stack & Architecture

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide Icons, Recharts, Framer Motion.
- **Backend**: FastAPI, Uvicorn, Pydantic v2.
- **Machine Learning**: Scikit-learn, XGBoost, NumPy, Pandas, Joblib.
- **DevOps & Containerization**: Multi-stage Dockerfiles (`python:3.11-slim`, `node:20-alpine`), Docker Compose with health checks.
- **Testing**: Pytest automated suite (22/22 unit and API integration tests passing).

---

## 🚀 Quick Start

### Option 1: Run with Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/Geeky-ash/Premier-League.git
cd Premier-League

# Launch backend and frontend containers
docker compose up --build -d

# Open in browser:
# Frontend: http://localhost:3000
# Backend API Docs: http://localhost:8000/docs
```

### Option 2: Local Development

#### 1. Backend Microservice
```bash
# Install Python dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn backend.main:app --host 127.0.0.1 --port 8000 --reload
```

#### 2. Next.js Frontend
```bash
cd frontend

# Install Node dependencies
npm install

# Run dev server
npm run dev
# Accessible at http://localhost:3000
```

---

## 🧪 Running Automated Tests

```bash
# Run complete test suite (data ingestion, ML benchmarks, API endpoints)
pytest tests/ -v
```

---

## 📄 License
MIT License. Created by [Ashirwad Sharma](https://github.com/Geeky-ash).
