# Architectural Decision Records (DECISIONS.md)

This document records the foundational architectural, technological, and algorithmic decisions made for the Premier League Analytics Platform, along with their context, trade-offs, and consequences.

---

### ADR 001: Selection of XGBoost for Match Outcome Prediction
- **Status**: Approved
- **Context**: Football match outcomes (Win, Draw, Loss) are governed by intricate, non-linear interactions among home advantage, rolling tactical form, possession, and shot efficiency metrics.
- **Decision**: Select **XGBoost** (`XGBClassifier`) as the primary classification engine over simpler logistic regression or standard decision trees.
- **Rationale**:
  - Exceptional ability to capture high-order feature interactions without requiring manual polynomial feature engineering.
  - Robust regularizations (`L1`/`L2`) mitigate overfitting on noisy sports match-day data.
  - Native handling of non-linear feature importance enables high-fidelity tactical explanations for analysts.
- **Consequences**: Requires careful tuning of tree depth (`max_depth=3-5`) and learning rates to prevent overfitting on smaller sample sizes (e.g. 380 matches/season).

---

### ADR 002: Streamlit for Unified Application Frontend
- **Status**: Approved
- **Context**: The platform requires an interactive, rapid-response visual dashboard integrating multiple ML models. We evaluated building a detached React/Next.js frontend with FastAPI backend vs. a unified Streamlit application.
- **Decision**: Select **Streamlit** as the unified presentation and UI layer.
- **Rationale**:
  - Eliminates context-switching and impedance mismatch between Python data science pipelines and frontend JavaScript runtimes.
  - Enables instant model inference and reactivity natively in Python memory, circumventing API serialization overhead.
  - Seamlessly hosts custom CSS (for glassmorphism) and embedded Matplotlib figures without requiring separate chart rendering microservices.
- **Consequences**: State management must rely on `st.session_state` and caching decorators (`@st.cache_data`, `@st.cache_resource`) to maintain sub-250ms responsiveness.

---

### ADR 003: K-Means Clustering for Player Scouting & Similarity
- **Status**: Approved
- **Context**: Scouting departments often suffer from subjective scouting bias and need an objective, unsupervised grouping of players based purely on on-pitch performance signatures.
- **Decision**: Choose **K-Means Clustering** augmented with Principal Component Analysis (PCA) for tactical player segmentation.
- **Rationale**:
  - Provides completely unsupervised, unbiased grouping of tactical styles based purely on per-90 metrics (goals, assists, passing completion, dribbles, and defensive actions).
  - High computational efficiency and deterministic cluster assignment for real-time player twin lookups.
  - Intuitive centroid interpretation allowing analysts to classify clusters into distinct tactical archetypes (e.g. "Box-to-Box Midfielder", "Target Man", "Ball-Playing Defender").
- **Consequences**: Metrics must be strictly normalized via `StandardScaler` prior to clustering to prevent high-volume stats (e.g. passes) from dominating low-volume, high-impact stats (e.g. goals).

---

### ADR 004: Linear Regression for Transfer Value Prediction
- **Status**: Approved
- **Context**: Transfer valuation models must remain transparent and interpretable so club analysts can understand the exact marginal valuation contribution of individual metrics (e.g., value of an additional goal vs. an extra year of player age).
- **Decision**: Implement a **Linear Regression** (with Ridge regularization options) pipeline.
- **Rationale**:
  - Provides clear, interpretable coefficients that can be communicated to non-technical football stakeholders.
  - Avoids "black-box" pricing anomalies and provides smooth sensitivity curves for UI sliders.
- **Consequences**: Non-linear effects (such as age degradation curves) must be handled explicitly through feature engineering (e.g., quadratic age terms).

---

### ADR 005: Dual-Mode Ingestion (Live API + Local Snapshot Fallback)
- **Status**: Approved
- **Context**: Third-party football APIs (such as `football-data.org`) have rate limits, requires API keys, or experience downtime.
- **Decision**: Design data ingestion to attempt live API fetch with automatic fallback to high-quality local curated historical datasets.
- **Rationale**:
  - Guarantees 100% platform availability and offline operability for end users and evaluation environments without credential dependencies.
- **Consequences**: Ingestion pipeline must support identical schema validation on both live JSON payloads and local CSV/Parquet snapshots.
