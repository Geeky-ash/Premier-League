# Product Requirements Document (PRD)
## Unified Premier League Analytics Platform

### 1. Executive Summary & Objective
The **Unified Premier League Analytics Platform** is a centralized, production-grade football intelligence suite designed for data scientists, club analysts, and football enthusiasts. It unifies three distinct machine learning capabilities into a single, high-performance Streamlit dashboard:
1. **Transfer Value Predictor** (Supervised Regression)
2. **Match Outcome Predictor** (Supervised Multi-Class Classification)
3. **Player Scouting & Similarity Engine** (Unsupervised Clustering)

---

### 2. User Personas & Core Use Cases
- **Club Technical Director / Scout**: Evaluates fair player valuation and discovers statistical player twins across tactical profiles.
- **Performance & Tactical Analyst**: Forecasts fixture probabilities (Win/Draw/Loss), stress-testing tactical and form variables.
- **Football Data Enthusiast / Pundit**: Interactively explores data-driven hypotheses on Premier League performance metrics.

---

### 3. Module Specifications

#### Module 1: Transfer Value Predictor
- **Objective**: Accurately predict fair-market transfer values (€/£) for Premier League players to prevent overpaying in transfer windows.
- **Algorithm**: Linear Regression / Regularized Ridge-Lasso baseline pipeline.
- **Data Source**: Historical Premier League stats via `requests` API integrations (e.g., football-data.org, open football repos, or curated historical datasets).
- **Key Features**:
  - `goals`, `assists`, `minutes_played`, `age`, `position` (one-hot encoded), `appearances`, `contract_length_years` (if available).
- **Target Variable**: `market_value` (continuous numeric).
- **Key Outputs**:
  - Predicted market value vs. actual benchmark comparison.
  - Valuation sensitivity slider (adjusting goals/minutes to see dynamic valuation swings).

#### Module 2: Match Outcome Predictor
- **Objective**: Predict 3-way match outcomes: Home Win (`W`), Draw (`D`), or Away Win (`L`).
- **Algorithm**: XGBoost / Random Forest Classifier with calibrated probability outputs.
- **Key Features**:
  - `home_advantage` (binary), `goals_scored_avg_last_5`, `goals_conceded_avg_last_5`, `shots_on_target_diff`, `possession_avg`, `recent_form_points_last_5`, `h2h_trend`.
- **Target Variable**: Match Result categorical (`H`, `D`, `A`).
- **Key Outputs**:
  - Probability distribution bar (e.g., 55% Win, 25% Draw, 20% Loss).
  - Feature importance breakdown highlighting key tactical levers.

#### Module 3: Player Scouting & Similarity System
- **Objective**: Group and cluster players with equivalent tactical behaviors to uncover undervalued recruitment targets.
- **Algorithm**: K-Means Clustering with automated optimal-k analysis (Elbow method & Silhouette score).
- **Key Features**:
  - `goals_per_90`, `assists_per_90`, `pass_completion_rate`, `shots_per_90`, `successful_dribbles_per_90`, `tackles_interceptions_per_90`, `aerial_duels_won_pct`.
- **Key Outputs**:
  - Interactive multi-dimensional cluster scatter plot (PCA / 2D projection).
  - "Player Twin Finder" table returning top statistical analogues for any chosen player.

---

### 4. Technical & Non-Functional Requirements
- **Latency**: Streamlit inference latency < 250ms per user interaction.
- **Portability**: Fully reproducible via self-contained Python virtual environment (`venv`) and frozen dependencies (`requirements.txt`).
- **Resilience**: Offline fallback datasets to ensure UI renders even if external football APIs hit rate limits or downtime.
- **Compliance & Integrity**: Zero data leakage between train/test splits.

---

### 5. Success Metrics
- **Module 1**: Mean Absolute Error (MAE) evaluated against holdout player valuations.
- **Module 2**: Multi-class Log Loss & F1-Score (macro) beating baseline historical home-bias priors (> 55% balanced accuracy).
- **Module 3**: Average Silhouette Score > 0.40 across tactical role clusters.
