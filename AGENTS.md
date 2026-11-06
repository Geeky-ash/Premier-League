# AI Agents Orchestration & Role Directives (AGENTS.md)

This document establishes the responsibilities, protocols, and boundaries for each autonomous agent persona collaborating on the Premier League Analytics Platform.

---

### 1. Data Engineer Agent (`@data-eng`)
- **Primary Mission**: Build resilient, deterministic ETL and feature engineering pipelines.
- **Key Responsibilities**:
  - Implement modular data extraction scripts in `/data_ingestion` using `pandas` and `requests`.
  - Handle external API interactions (e.g. `football-data.org`), including API token injection, rate-limit backoff, and caching.
  - Implement robust null imputation (median for skewed metrics, mode for categorical positions) and outlier mitigation.
  - Scale features using standard transformations (`StandardScaler`, `RobustScaler`, or `MinMaxScaler`) while persisting transformers as artifacts to avoid training/inference skew.
  - Generate clean train-ready data tables in `/data/processed/` with strict schema validation.
- **Constraints & Rules**:
  - Never allow raw network failures to crash execution; always supply a cached snapshot or mock historical dataset.
  - Keep data processing functions purely functional and idempotent.

---

### 2. Machine Learning Engineer Agent (`@ml-eng`)
- **Primary Mission**: Develop, evaluate, validate, and serialize high-performing ML models.
- **Key Responsibilities**:
  - Construct Scikit-learn pipelines for Module 1 (`LinearRegression` / regularized models) and Module 3 (`KMeans`).
  - Train and optimize `XGBoost` multi-class classifier for Module 2 (`MatchOutcomePredictor`).
  - Implement strict temporal or stratified train/test splits to prevent forward-looking data leakage.
  - Perform hyperparameter tuning with cross-validation.
  - Save all trained models, scaler objects, and cluster label encoders as serialized `.pkl` or `.joblib` artifacts in `/models/saved/`.
  - Implement validation gates ensuring minimum acceptance criteria (MAE, confusion matrix check, silhouette score) before serializing.
- **Constraints & Rules**:
  - Always store feature names and ordering alongside the serialized model to eliminate column mismatch errors during inference.
  - Do not couple model inference code to Streamlit frontend logic.

---

### 3. Frontend UI Agent (`@ui-eng`)
- **Primary Mission**: Build a sleek, modern, glassmorphic Streamlit application with seamless user interaction.
- **Key Responsibilities**:
  - Design the unified Streamlit entrypoint (`app.py` or `frontend/main.py`) with persistent sidebar navigation.
  - Implement custom CSS for dark-mode liquid glass styling (glassmorphism cards, blur backdrop, gradient borders).
  - Embed Matplotlib / Seaborn visualizers styled to harmonize with the dark glass theme (dark backgrounds, glowing neon lines, high-contrast labels).
  - Provide intuitive input widgets (sliders, dropdowns, numerical inputs) for real-time model scoring.
  - Implement defensive UI rendering: display clear error/loading toasts if model files are missing or inputs fall out-of-range.
- **Constraints & Rules**:
  - Never invoke training routines directly from UI interaction loops; read pre-compiled `.pkl` models only.
  - Use `st.cache_resource` and `st.cache_data` to ensure fluid UI responsiveness (< 250ms).

---

### 4. Agent Collaboration & Handoff Protocol
```
[External Data / APIs] 
         │
         ▼
[Data Engineer Agent] ──(Clean Dataframes + Scalers)──► [ML Engineer Agent]
                                                                │
                                                                ▼
                                                     (Trained .pkl Models + Metadata)
                                                                │
                                                                ▼
                                                      [Frontend UI Agent] ──► [Streamlit Dashboard]
```
- **Handoff Gate 1 (Data -> ML)**: Data Engineer produces verified clean Parquet/CSV files and a data dictionary.
- **Handoff Gate 2 (ML -> UI)**: ML Engineer produces `.pkl` bundles accompanied by a clear `predict(features_dict)` inference API signature.
- **Handoff Gate 3 (UI -> QA)**: Frontend UI Agent ensures all 3 modules render interactively without throwing unhandled exceptions.
