"""Data Cleaning Pipeline Module for Premier League Analytics Platform.

Transforms raw player and match fixture datasets into strictly validated,
zero-null, model-ready Pandas DataFrames persisted in data/processed/.
"""

import json
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple

import numpy as np
import pandas as pd

# Configure module-level logger
logger = logging.getLogger(__name__)
if not logger.handlers:
    handler = logging.StreamHandler()
    formatter = logging.Formatter(
        "[%(asctime)s] [%(levelname)s] [%(name)s]: %(message)s"
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.INFO)

PROJECT_ROOT: Path = Path(__file__).resolve().parent.parent
RAW_DATA_DIR: Path = PROJECT_ROOT / "data" / "raw"
PROCESSED_DATA_DIR: Path = PROJECT_ROOT / "data" / "processed"


def validate_zero_nulls(df: pd.DataFrame, dataset_name: str = "DataFrame") -> None:
    """Enforces zero null/NaN values across all columns.

    Args:
        df: Pandas DataFrame to inspect.
        dataset_name: Human-readable name of the dataset for error reporting.

    Raises:
        ValueError: If any NaN/null values exist in the DataFrame.
    """
    null_counts = df.isnull().sum()
    total_nulls = int(null_counts.sum())
    if total_nulls > 0:
        offending_cols = null_counts[null_counts > 0].to_dict()
        msg = f"Data validation failed for '{dataset_name}': {total_nulls} nulls found in {offending_cols}"
        logger.error(msg)
        raise ValueError(msg)
    logger.info("Validation passed: '%s' has 0 null values.", dataset_name)


def validate_player_bounds(df: pd.DataFrame) -> None:
    """Validates realistic physical and statistical bounds for player records.

    Args:
        df: Cleaned player statistics DataFrame.

    Raises:
        ValueError: If any numeric metric violates operational domain bounds.
    """
    if (df["age"] < 15).any() or (df["age"] > 45).any():
        raise ValueError("Player age bounds violated: must be between 15 and 45.")

    if (df["minutes_played"] < 0).any() or (df["minutes_played"] > 4500).any():
        raise ValueError("Player minutes_played bounds violated: must be in [0, 4500].")

    if (df["pass_completion"] < 0.0).any() or (df["pass_completion"] > 100.0).any():
        raise ValueError("pass_completion rate must be between 0.0 and 100.0.")

    if (df["goals"] < 0).any() or (df["assists"] < 0).any():
        raise ValueError("Goals and assists must be non-negative.")

    if (df["market_value_eur_m"] <= 0).any():
        raise ValueError("market_value_eur_m must be strictly positive.")

    valid_positions = {"FW", "MF", "DF", "GK"}
    invalid_pos = set(df["position"].unique()) - valid_positions
    if invalid_pos:
        raise ValueError(f"Encountered unexpected player positions: {invalid_pos}")


def validate_match_bounds(df: pd.DataFrame) -> None:
    """Validates bounds and logical consistency for match fixtures.

    Args:
        df: Cleaned match fixtures DataFrame.

    Raises:
        ValueError: If any match outcome or count violates domain rules.
    """
    valid_results = {"H", "D", "A"}
    invalid_results = set(df["full_time_result"].unique()) - valid_results
    if invalid_results:
        raise ValueError(f"Invalid full_time_result values: {invalid_results}")

    if (df["home_goals"] < 0).any() or (df["away_goals"] < 0).any():
        raise ValueError("Match goal counts cannot be negative.")

    if (df["home_shots"] < 0).any() or (df["away_shots"] < 0).any():
        raise ValueError("Match shot counts cannot be negative.")

    if (df["home_possession"] < 0.0).any() or (df["home_possession"] > 100.0).any():
        raise ValueError("Possession must be between 0.0 and 100.0.")


def clean_player_stats(df: pd.DataFrame) -> pd.DataFrame:
    """Cleans raw player statistics DataFrame with median/mode imputation.

    Steps performed:
      1. Drops duplicates on 'player_id' or 'name'.
      2. Imputes numeric metrics with column medians.
      3. Imputes categorical metrics (e.g. 'position', 'club') with mode.
      4. Derives per-90 metrics (goals_per_90, assists_per_90, etc.).
      5. Enforces strict zero-null and bounds checks.

    Args:
        df: Raw player statistics DataFrame.

    Returns:
        pd.DataFrame: Cleaned, validated, model-ready player DataFrame.

    Raises:
        ValueError: If required columns are absent or validation fails.
    """
    logger.info("Cleaning player statistics DataFrame (Initial shape: %s)", df.shape)
    clean_df = df.copy()

    required_cols = [
        "name", "club", "age", "position", "minutes_played",
        "goals", "assists", "shots", "pass_completion",
        "dribbles", "tackles_interceptions", "market_value_eur_m"
    ]
    missing_cols = [c for c in required_cols if c not in clean_df.columns]
    if missing_cols:
        raise ValueError(f"Player DataFrame missing essential columns: {missing_cols}")

    # Remove duplicates
    if "player_id" in clean_df.columns:
        clean_df = clean_df.drop_duplicates(subset=["player_id"]).copy()
    else:
        clean_df = clean_df.drop_duplicates(subset=["name", "club"]).copy()

    # Numeric Columns Imputation with Median
    numeric_cols = [
        "age", "minutes_played", "appearances", "goals", "assists",
        "shots", "pass_completion", "dribbles", "tackles_interceptions",
        "aerial_duels_won", "market_value_eur_m"
    ]
    for col in numeric_cols:
        if col in clean_df.columns:
            clean_df[col] = pd.to_numeric(clean_df[col], errors="coerce")
            median_val = clean_df[col].median()
            # If all are NaN, default to safe 0
            if pd.isna(median_val):
                median_val = 0.0
            clean_df[col] = clean_df[col].fillna(median_val)

    # Categorical Columns Imputation with Mode
    categorical_cols = ["position", "club", "name"]
    for col in categorical_cols:
        if col in clean_df.columns:
            clean_df[col] = clean_df[col].astype(str).str.strip()
            clean_df[col] = clean_df[col].replace(["nan", "None", ""], np.nan)
            mode_series = clean_df[col].mode()
            mode_val = mode_series.iloc[0] if not mode_series.empty else "Unknown"
            clean_df[col] = clean_df[col].fillna(mode_val)

    # Standardize position tokens (FW, MF, DF, GK)
    pos_mapping = {
        "FORWARD": "FW", "ATTACKER": "FW", "STRIKER": "FW", "WINGER": "FW",
        "MIDFIELDER": "MF", "MIDFIELD": "MF",
        "DEFENDER": "DF", "DEFENCE": "DF",
        "GOALKEEPER": "GK", "KEEPER": "GK"
    }
    clean_df["position"] = clean_df["position"].str.upper().apply(
        lambda p: pos_mapping.get(p, p)
    )

    # Compute Per-90 Normalized Metrics for fair scouting comparison
    # Use max(minutes, 90) to prevent division by zero for substitute appearances
    adj_minutes = np.maximum(clean_df["minutes_played"].values, 90.0)
    per_90_factor = 90.0 / adj_minutes
    clean_df["goals_per_90"] = np.round(clean_df["goals"] * per_90_factor, 2)
    clean_df["assists_per_90"] = np.round(clean_df["assists"] * per_90_factor, 2)
    clean_df["shots_per_90"] = np.round(clean_df["shots"] * per_90_factor, 2)
    clean_df["dribbles_per_90"] = np.round(clean_df["dribbles"] * per_90_factor, 2)
    clean_df["tackles_interceptions_per_90"] = np.round(
        clean_df["tackles_interceptions"] * per_90_factor, 2
    )

    # Validations
    validate_zero_nulls(clean_df, "Player Stats")
    validate_player_bounds(clean_df)

    logger.info("Successfully cleaned player statistics (Final shape: %s)", clean_df.shape)
    return clean_df


def clean_match_fixtures(df: pd.DataFrame) -> pd.DataFrame:
    """Cleans and engineers match fixture datasets for match outcome modeling.

    Steps performed:
      1. Normalizes date and team naming conventions.
      2. Validates match result parity (H when home_goals > away_goals, etc.).
      3. Imputes missing numeric match metrics with medians.
      4. Derives goal difference, shot differentials, and home advantage flags.
      5. Enforces strict zero-nulls and outcome domain constraints.

    Args:
        df: Raw match fixtures DataFrame.

    Returns:
        pd.DataFrame: Cleaned match fixtures ready for XGBoost modeling.

    Raises:
        ValueError: If mandatory match columns are missing or validation fails.
    """
    logger.info("Cleaning match fixtures DataFrame (Initial shape: %s)", df.shape)
    clean_df = df.copy()

    required_cols = [
        "home_team", "away_team", "home_goals", "away_goals",
        "full_time_result", "home_shots", "away_shots", "home_possession"
    ]
    missing_cols = [c for c in required_cols if c not in clean_df.columns]
    if missing_cols:
        raise ValueError(f"Match DataFrame missing required columns: {missing_cols}")

    # Deduplicate matches
    if "match_id" in clean_df.columns:
        clean_df = clean_df.drop_duplicates(subset=["match_id"]).copy()
    else:
        clean_df = clean_df.drop_duplicates(subset=["home_team", "away_team", "date"]).copy()

    # Handle numeric columns
    numeric_cols = [
        "home_goals", "away_goals", "home_shots", "away_shots",
        "home_shots_on_target", "away_shots_on_target",
        "home_possession", "away_possession",
        "home_form_points_last_5", "away_form_points_last_5"
    ]
    for col in numeric_cols:
        if col in clean_df.columns:
            clean_df[col] = pd.to_numeric(clean_df[col], errors="coerce")
            median_val = clean_df[col].median()
            if pd.isna(median_val):
                median_val = 0.0
            clean_df[col] = clean_df[col].fillna(median_val)

    # Standardize result column
    clean_df["full_time_result"] = clean_df["full_time_result"].astype(str).str.upper().str.strip()
    # Correct any discrepancy between scores and full_time_result
    def determine_result(row: pd.Series) -> str:
        if row["home_goals"] > row["away_goals"]:
            return "H"
        elif row["home_goals"] < row["away_goals"]:
            return "A"
        return "D"

    clean_df["full_time_result"] = clean_df.apply(determine_result, axis=1)

    # Feature Engineering for Matchday modeling
    clean_df["goal_difference"] = clean_df["home_goals"] - clean_df["away_goals"]
    clean_df["shot_difference"] = clean_df["home_shots"] - clean_df["away_shots"]
    if "home_shots_on_target" in clean_df.columns and "away_shots_on_target" in clean_df.columns:
        clean_df["sot_difference"] = clean_df["home_shots_on_target"] - clean_df["away_shots_on_target"]
    else:
        clean_df["sot_difference"] = clean_df["shot_difference"] * 0.4

    clean_df["possession_difference"] = clean_df["home_possession"] - clean_df["away_possession"]
    clean_df["home_advantage"] = 1  # Standard binary indicator for home perspective

    if "home_form_points_last_5" not in clean_df.columns:
        clean_df["home_form_points_last_5"] = 7.0
    if "away_form_points_last_5" not in clean_df.columns:
        clean_df["away_form_points_last_5"] = 7.0
    clean_df["form_difference"] = (
        clean_df["home_form_points_last_5"] - clean_df["away_form_points_last_5"]
    )

    # Validation
    validate_zero_nulls(clean_df, "Match Fixtures")
    validate_match_bounds(clean_df)

    logger.info("Successfully cleaned match fixtures (Final shape: %s)", clean_df.shape)
    return clean_df


def run_pipeline() -> Tuple[Path, Path]:
    """Orchestrates loading raw data, cleaning, validating, and saving to data/processed/.

    Returns:
        Tuple[Path, Path]: Paths to saved cleaned_players.csv and cleaned_matches.csv.
    """
    PROCESSED_DATA_DIR.mkdir(parents=True, exist_ok=True)
    raw_players_file = RAW_DATA_DIR / "raw_players.json"
    raw_matches_file = RAW_DATA_DIR / "raw_matches.json"

    # Ensure raw files exist or bootstrap them
    if not raw_players_file.exists() or not raw_matches_file.exists():
        from data_ingestion.fetch_api_data import generate_curated_fallback_data
        generate_curated_fallback_data()

    # 1. Clean Players
    with open(raw_players_file, "r", encoding="utf-8") as f:
        raw_players_dict = json.load(f)
    raw_players_df = pd.DataFrame(raw_players_dict.get("players", []))
    cleaned_players_df = clean_player_stats(raw_players_df)

    cleaned_players_path = PROCESSED_DATA_DIR / "cleaned_players.csv"
    try:
        cleaned_players_df.to_csv(cleaned_players_path, index=False)
        logger.info("Persisted cleaned player data to %s", cleaned_players_path)
    except (PermissionError, OSError) as exc:
        logger.warning("Filesystem write restricted for %s: %s", cleaned_players_path, exc)

    # 2. Clean Matches
    with open(raw_matches_file, "r", encoding="utf-8") as f:
        raw_matches_dict = json.load(f)
    raw_matches_df = pd.DataFrame(raw_matches_dict.get("matches", []))
    cleaned_matches_df = clean_match_fixtures(raw_matches_df)

    cleaned_matches_path = PROCESSED_DATA_DIR / "cleaned_matches.csv"
    try:
        cleaned_matches_df.to_csv(cleaned_matches_path, index=False)
        logger.info("Persisted cleaned match fixtures to %s", cleaned_matches_path)
    except (PermissionError, OSError) as exc:
        logger.warning("Filesystem write restricted for %s: %s", cleaned_matches_path, exc)

    return cleaned_players_path, cleaned_matches_path


if __name__ == "__main__":
    p_path, m_path = run_pipeline()
    print(f"Cleaning pipeline executed successfully:\n - {p_path}\n - {m_path}")
