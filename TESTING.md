# Quality Assurance & Testing Suite (TESTING.md)

This document establishes the validation gates, metric thresholds, and automated unit testing procedures required across the platform.

---

### 1. Quality Assurance Framework Overview

The platform implements a multi-tier quality gate system:
1. **Tier 1: Data Integrity & Schema Validation**: Unit tests guaranteeing zero missing values, valid ranges, and correct dtypes.
2. **Tier 2: Model Metric Evaluation Gates**: Threshold benchmarks that all trained models must satisfy prior to serialization.
3. **Tier 3: Streamlit UI Pre-Render Assertion**: Automated checks preventing the UI from serving predictions if serialized pipelines fail sanity checks.

---

### 2. Tier 1: Data Integrity & Pipeline Unit Tests

All data cleaning routines in `data_ingestion/clean_pipeline.py` must pass automated Pytest suites:

- **Zero-Null Enforcement**:
  ```python
  def test_no_null_values_in_processed_data(processed_df):
      """Asserts that no missing values exist in model training features."""
      null_counts = processed_df.isnull().sum().sum()
      assert null_counts == 0, f"Found {null_counts} null values in processed dataset."
  ```
- **Feature Range & Sanity Assertions**:
  - `age` must strictly lie within `[15, 45]`.
  - `pass_completion_rate` must strictly lie within `[0.0, 100.0]`.
  - `minutes_played` must be `>= 0` and `<= 3800` (for a standard 38-game season).
  - Match outcomes must strictly be one of `{'H', 'D', 'A'}`.

---

### 3. Tier 2: Model Evaluation Benchmark Gates

Before any model artifact (`.pkl`) is serialized to `models/saved/`, it must pass strict automated metric evaluation:

| Module | Metric Required | Minimum Benchmark Gate | Action on Failure |
| :--- | :--- | :--- | :--- |
| **Transfer Value Predictor** | Mean Absolute Error (MAE) & $R^2$ | $R^2 \ge 0.60$, Normalized MAE $\le 18\%$ of valuation range | Halt serialization; log feature weights |
| **Match Outcome Predictor** | Confusion Matrix & Macro F1-Score | Macro $F1 \ge 0.45$, Balanced Accuracy $\ge 50\%$ | Flag underperforming class; tune weights |
| **Player Scouting System** | Silhouette Score & Inertia | Average Silhouette Score $\ge 0.35$ for optimal $k$ | Reject $k$; re-run elbow optimization |

**Automated Evaluation Gate Code Pattern**:
```python
def validate_transfer_model(model, X_test, y_test, threshold_r2=0.60):
    from sklearn.metrics import r2_score, mean_absolute_error
    predictions = model.predict(X_test)
    r2 = r2_score(y_test, predictions)
    mae = mean_absolute_error(y_test, predictions)
    
    assert r2 >= threshold_r2, f"Transfer model rejected: R2 {r2:.3f} below threshold {threshold_r2}"
    logger.info(f"Model passed validation: R2={r2:.3f}, MAE={mae:.2f}")
    return True
```

---

### 4. Tier 3: Automated UI Pre-Render Validation
The Streamlit application will not render prediction controls unless:
1. Model files exist in `models/saved/` and deserialize cleanly.
2. A synthetic smoke test prediction succeeds in $< 100$ms.
3. Feature names stored in the model artifact match the UI input payload schema exactly.

If any check fails, the UI renders an informative diagnostics card with actionable resolution steps instead of an unhandled runtime exception stack trace.

---

### 5. Test Execution Commands

```bash
# Run complete test suite
pytest tests/ -v

# Run data integrity tests exclusively
pytest tests/test_ingestion.py -v

# Run model evaluation benchmarks
pytest tests/test_models.py -v

# Run with test coverage report
pytest --cov=data_ingestion --cov=models tests/
```

---

### 6. Tier 4: Containerization & Docker Validation Gates

The containerized environment guarantees zero-drift reproducibility across cloud providers:

1. **Docker Compose Build & Run**:
   ```bash
   # Build images and start containers in the background
   docker compose up --build -d

   # Inspect real-time multi-service logs
   docker compose logs -f

   # Check health status of containers
   docker compose ps
   ```

2. **Automated Microservice Health Validation**:
   ```bash
   # Query FastAPI health status inside Docker network
   curl -f http://localhost:8000/api/v1/health

   # Expected JSON Response:
   # {
   #   "status": "healthy",
   #   "version": "1.0.0",
   #   "models_loaded": {
   #     "transfer_model": true,
   #     "match_model": true,
   #     "scouting_model": true,
   #     "players_data": true,
   #     "matches_data": true
   #   }
   # }
   ```

3. **Frontend Production Container Sanity Check**:
   ```bash
   # Verify Next.js standalone server responds with HTTP 200
   curl -I http://localhost:3000/
   ```

4. **Teardown & Cleanup**:
   ```bash
   docker compose down -v
   ```
