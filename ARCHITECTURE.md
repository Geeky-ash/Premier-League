# System Architecture Specification (ARCHITECTURE.md)

This document outlines the directory structure, component modularity, state flow, and data contracts governing the Unified Premier League Analytics Platform.

---

### 1. Directory Tree & Modularity

The platform enforces strict separation of concerns across ingestion, modeling, interactive exploration, and UI rendering:

```
Premier League/
├── PRD.md                       # Product Requirements Document
├── AGENTS.md                    # Multi-agent roles & handoff directives
├── DESIGN.md                    # UI/UX design tokens & glassmorphism specs
├── ARCHITECTURE.md              # System architecture & data flow
├── RULES.md                     # PEP-8, typing, and resilience standards
├── MEMORY.md                    # Tech stack & live integration ledger
├── DECISIONS.md                 # Architectural decision records (ADR)
├── TESTING.md                   # Unit tests & model validation gates
├── requirements.txt             # Frozen dependency manifest
├── app.py                       # Unified Streamlit application entrypoint
│
├── data/
│   ├── raw/                     # Pristine raw API responses & CSV dumps
│   └── processed/               # Imputed, cleaned, and engineered tables
│
├── data_ingestion/              # Ingestion & preprocessing engine
│   ├── __init__.py
│   ├── fetch_api_data.py        # football-data.org / requests client
│   ├── clean_pipeline.py        # Missing value imputation & validation
│   └── feature_engineering.py   # Rolling form, ratios, and encodings
│
├── models/                      # ML pipeline training & inference wrappers
│   ├── __init__.py
│   ├── transfer_predictor.py    # Linear Regression pipeline & serialization
│   ├── match_predictor.py       # XGBoost classifier pipeline
│   ├── player_scouting.py       # K-Means clustering & similarity matcher
│   └── saved/                   # Serialized .pkl artifacts (models + scalers)
│       ├── transfer_model.pkl
│       ├── match_model.pkl
│       └── cluster_model.pkl
│
├── notebooks/                   # Exploratory analysis & baseline sandbox
│   ├── 01_transfer_eda.ipynb
│   ├── 02_match_prediction_eda.ipynb
│   └── 03_scouting_clustering_eda.ipynb
│
├── frontend/                    # Streamlit modular presentation layer
│   ├── __init__.py
│   ├── components/              # Shared glass cards, headers, styling
│   │   ├── __init__.py
│   │   ├── glass_card.py
│   │   └── charts.py            # Matplotlib dark-theme charting routines
│   └── pages/                   # Module page controllers
│       ├── __init__.py
│       ├── tab_transfer.py      # Transfer value UI & sensitivity controls
│       ├── tab_match.py         # Match outcome probability dashboard
│       └── tab_scouting.py      # Player twin & cluster visualizer
│
└── tests/                       # Automated quality & validation test suite
    ├── __init__.py
    ├── test_ingestion.py        # Data schema & null-value tests
    ├── test_models.py           # Model inference & metric validation
    └── test_ui_helpers.py       # UI formatting & utility tests
```

---

### 2. State-Machine Data Flow
Data flows in a unidirectional, deterministic pipeline from raw source to interactive rendering:

```
[Raw Sources: API / Historical Data]
              │
              ▼  (Phase 1: Ingestion)
      data_ingestion/fetch_api_data.py
              │
              ▼  (Phase 2: Data Cleaning & Normalization)
      data_ingestion/clean_pipeline.py
              │
              ▼  (Phase 3: Feature Engineering & Encodings)
      data_ingestion/feature_engineering.py
              │
              ├──► [Train Phase: models/*.py ──► models/saved/*.pkl]
              │
              ▼  (Phase 4: Model Inference)
        Inference API Service (Model Wrapper)
              │
              ▼  (Phase 5: UI Presentation)
        Streamlit Frontend Components (Glassmorphism + Matplotlib)
```

#### State Transition Constraints
1. **Raw Ingestion State**: Raw JSON/CSV is cached immutably in `data/raw/`. No modifications in place.
2. **Cleaned State**: Missing values handled; types enforced; null counts must equal 0 before moving to feature engineering.
3. **Engineered State**: Features scaled, rolling averages computed, categorical variables encoded.
4. **Inference State**: Inference functions accept standard dictionaries or single-row dataframes; return calibrated prediction dicts with confidence intervals.
5. **Render State**: Streamlit UI consumes prediction dicts and renders visual widgets via pure presentation components.

---

### 3. Application Routing & Page Architecture
- The root `app.py` establishes global configuration:
  ```python
  st.set_page_config(
      page_title="Premier League Intelligence Suite",
      page_icon="⚽",
      layout="wide",
      initial_sidebar_state="expanded"
  )
  ```
- **Persistent Sidebar Navigation**:
  - Main navigation radio/tabs control module switching without resetting global app state.
  - Active module state stored in `st.session_state["active_module"]`.
  - Modules are loaded lazily using function routers to ensure minimal initial boot time.
