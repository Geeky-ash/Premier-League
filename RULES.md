# Engineering Standards & Coding Rules (RULES.md)

This document establishes the mandatory engineering standards, defensive programming patterns, and quality mandates across the entire codebase.

---

### 1. Python Standards & PEP-8 Adherence
- **Style Standard**: Strict conformance to PEP-8 guidelines (4 spaces indentation, 88-100 character max line width, lowercase snake_case for functions/variables, PascalCase for classes).
- **Type Hinting**: All function signatures must include comprehensive Python type annotations via standard `typing` (`Dict`, `List`, `Optional`, `Tuple`, `Union`, `Any`, `pd.DataFrame`, `np.ndarray`).
- **Docstrings**: Every module, class, and function must feature structured docstrings (Google or NumPy style) declaring:
  - Purpose & behavioral overview.
  - `Args`: parameter names, types, and descriptions.
  - `Returns`: return type, structure, and semantic meaning.
  - `Raises`: explicit exceptions that can be thrown.

```python
from typing import Dict, Any, Tuple
import pandas as pd

def compute_rolling_form(
    df: pd.DataFrame, 
    window: int = 5
) -> pd.DataFrame:
    """Calculates rolling average performance metrics for Premier League clubs.

    Args:
        df: Input DataFrame containing historical match results with 'team_id' and 'date'.
        window: Number of prior matches to consider for rolling statistics. Defaults to 5.

    Returns:
        pd.DataFrame: Augmented DataFrame including rolling points, goals, and goal difference.

    Raises:
        ValueError: If required columns ('team_id', 'date', 'points') are missing.
    """
    if not {'team_id', 'date', 'points'}.issubset(df.columns):
        raise ValueError("DataFrame is missing required historical columns.")
    # Implementation...
```

---

### 2. Resilience, Error Handling & Defensive Patterns
External data fetches, model loading, and file I/O must never cause unhandled crashes:

- **API Rate Limiting & Network Resilience**:
  - All calls to `requests` must specify explicit timeouts (`timeout=(3.05, 10.0)`).
  - Wrap API requests in retry loops with exponential backoff for `HTTP 429` (Too Many Requests) and `5xx` responses.
  - Provide a deterministic local offline fallback (mock/snapshot datasets in `data/raw/`) whenever network calls fail or credentials are unavailable.
- **Null Safety in Data Pipelines**:
  - Explicit assertion checks verifying zero NaN/null values in model training/inference matrices.
  - Imputation strategy must be recorded and applied systematically (e.g., median for quantitative, mode for categorical).
- **Graceful UI Failure**:
  - Streamlit components must intercept missing `.pkl` model files and display informative user-friendly warning cards (`st.warning()` / `st.error()`) guiding the user to trigger pipeline training.

```python
import logging
import requests
from typing import Optional, Dict, Any

logger = logging.getLogger(__name__)

def fetch_premier_league_fixtures(
    api_url: str, 
    api_token: Optional[str] = None
) -> Dict[str, Any]:
    """Fetches fixtures safely with timeout, rate limit handling, and fallback."""
    headers = {"X-Auth-Token": api_token} if api_token else {}
    try:
        response = requests.get(api_url, headers=headers, timeout=(3.0, 10.0))
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as http_err:
        logger.error(f"HTTP Error encountered: {http_err} (Status: {response.status_code})")
        return load_cached_fallback_fixtures()
    except requests.exceptions.RequestException as req_err:
        logger.warning(f"Network failure: {req_err}. Reverting to cached snapshot.")
        return load_cached_fallback_fixtures()
```

---

### 3. Code Style & Architecture Best Practices
- **Pure & Decoupled Functions**: Keep business logic, mathematical transformations, and feature engineering pure and isolated from UI or I/O side effects.
- **No Global Mutable State**: Pass configuration, parameters, and DataFrames explicitly through function arguments.
- **Single Responsibility Principle**: A single file or function should do one thing: ingestion scripts only ingest; training scripts only train; UI scripts only render.
- **Logging vs. Printing**: Use Python's built-in `logging` module with structured formats instead of unadorned `print()` statements in production modules.
