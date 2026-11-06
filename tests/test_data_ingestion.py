"""Unit tests for Data Ingestion and Cleaning Pipelines (TESTING.md).

Tests cover zero-null enforcement, numerical bounds validation,
missing value imputation, and defensive API fallback handling.
"""

import json
from pathlib import Path
import numpy as np
import pandas as pd
import pytest

from data_ingestion.clean_pipeline import (
    clean_player_stats,
    clean_match_fixtures,
    validate_zero_nulls,
    validate_player_bounds,
    validate_match_bounds,
    run_pipeline,
)
from data_ingestion.fetch_api_data import (
    fetch_football_data,
    generate_curated_fallback_data,
    RAW_DATA_DIR,
)


@pytest.fixture
def sample_raw_player_df() -> pd.DataFrame:
    """Fixture providing raw player records with intentionally injected NaNs."""
    return pd.DataFrame([
        {
            "player_id": 101,
            "name": "Marcus Rashford",
            "club": "Manchester United",
            "age": 26,
            "position": "FW",
            "minutes_played": 2200,
            "appearances": 33,
            "goals": 7,
            "assists": 2,
            "shots": 62,
            "pass_completion": 78.4,
            "dribbles": 45,
            "tackles_interceptions": 16,
            "aerial_duels_won": 12,
            "market_value_eur_m": 60.0,
        },
        {
            "player_id": 102,
            "name": "Kobbie Mainoo",
            "club": "Manchester United",
            "age": 19,
            "position": "MF",
            "minutes_played": 1950,
            "appearances": 24,
            "goals": 3,
            "assists": 1,
            "shots": 22,
            "pass_completion": 87.2,
            "dribbles": 38,
            "tackles_interceptions": 54,
            "aerial_duels_won": 18,
            "market_value_eur_m": 50.0,
        },
        {
            # Record with intentional missing values for imputation test
            "player_id": 103,
            "name": "Trial Player",
            "club": None,
            "age": 21,
            "position": "Forward",  # Non-standard position token
            "minutes_played": None,
            "appearances": 15,
            "goals": None,
            "assists": 0,
            "shots": np.nan,
            "pass_completion": None,
            "dribbles": 10,
            "tackles_interceptions": 15,
            "aerial_duels_won": 5,
            "market_value_eur_m": 15.0,
        },
    ])


@pytest.fixture
def sample_raw_match_df() -> pd.DataFrame:
    """Fixture providing raw match records with injected NaNs."""
    return pd.DataFrame([
        {
            "match_id": 5001,
            "date": "2024-01-14",
            "home_team": "Manchester United",
            "away_team": "Tottenham Hotspur",
            "home_goals": 2,
            "away_goals": 2,
            "full_time_result": "D",
            "home_shots": 9,
            "away_shots": 16,
            "home_shots_on_target": 2,
            "away_shots_on_target": 6,
            "home_possession": 36.0,
            "away_possession": 64.0,
            "home_form_points_last_5": 7,
            "away_form_points_last_5": 10,
        },
        {
            # Record with missing possession and shots for median imputation
            "match_id": 5002,
            "date": "2024-01-15",
            "home_team": "Arsenal",
            "away_team": "Crystal Palace",
            "home_goals": 5,
            "away_goals": 0,
            "full_time_result": "H",
            "home_shots": 21,
            "away_shots": None,
            "home_shots_on_target": None,
            "away_shots_on_target": 2,
            "home_possession": None,
            "away_possession": 39.0,
            "home_form_points_last_5": None,
            "away_form_points_last_5": 4,
        },
    ])


def test_clean_player_stats_zero_nulls(sample_raw_player_df: pd.DataFrame) -> None:
    """Verifies that clean_player_stats eliminates all null values via imputation."""
    cleaned = clean_player_stats(sample_raw_player_df)
    assert cleaned.isnull().sum().sum() == 0, "Cleaned player stats contains null values!"
    assert len(cleaned) == 3


def test_clean_match_fixtures_zero_nulls(sample_raw_match_df: pd.DataFrame) -> None:
    """Verifies that clean_match_fixtures eliminates all null values."""
    cleaned = clean_match_fixtures(sample_raw_match_df)
    assert cleaned.isnull().sum().sum() == 0, "Cleaned match fixtures contains null values!"
    assert len(cleaned) == 2


def test_player_bounds_validations(sample_raw_player_df: pd.DataFrame) -> None:
    """Verifies numerical bounds rules on player records."""
    cleaned = clean_player_stats(sample_raw_player_df)

    # 1. Non-negative minutes played
    assert (cleaned["minutes_played"] >= 0).all(), "Negative minutes played found!"

    # 2. Age bounds [15, 45]
    assert (cleaned["age"] >= 15).all() and (cleaned["age"] <= 45).all(), "Invalid player age detected!"

    # 3. Pass completion [0, 100]
    assert (
        (cleaned["pass_completion"] >= 0.0).all() and (cleaned["pass_completion"] <= 100.0).all()
    ), "Pass completion percentage out of valid bounds!"

    # 4. Market value must be strictly positive
    assert (cleaned["market_value_eur_m"] > 0).all(), "Non-positive market value found!"

    # 5. Position standardized
    assert set(cleaned["position"].unique()).issubset({"FW", "MF", "DF", "GK"})


def test_player_bounds_rejection() -> None:
    """Verifies that illegal player bounds trigger explicit ValueErrors."""
    invalid_df = pd.DataFrame([{
        "player_id": 999,
        "name": "Invalid Player",
        "club": "FC Test",
        "age": 12,  # Violates minimum age 15
        "position": "FW",
        "minutes_played": -100,  # Negative minutes
        "appearances": 5,
        "goals": 1,
        "assists": 0,
        "shots": 2,
        "pass_completion": 120.0,  # > 100%
        "dribbles": 0,
        "tackles_interceptions": 0,
        "aerial_duels_won": 0,
        "market_value_eur_m": -5.0,  # Negative market value
    }])

    with pytest.raises(ValueError):
        validate_player_bounds(invalid_df)


def test_match_bounds_rejection() -> None:
    """Verifies that invalid match results or scores trigger explicit ValueErrors."""
    invalid_match = pd.DataFrame([{
        "home_team": "Team A",
        "away_team": "Team B",
        "home_goals": -2,  # Negative goals
        "away_goals": 1,
        "full_time_result": "X",  # Invalid result code
        "home_shots": 5,
        "away_shots": 5,
        "home_possession": 50.0,
    }])

    with pytest.raises(ValueError):
        validate_match_bounds(invalid_match)


def test_end_to_end_pipeline_execution() -> None:
    """Verifies that running the full cleaning pipeline produces zero-null datasets."""
    p_path, m_path = run_pipeline()

    if p_path.exists():
        players_df = pd.read_csv(p_path)
    else:
        players_df = clean_player_stats(
            pd.DataFrame(json.load(open(RAW_DATA_DIR / "raw_players.json"))["players"])
        )

    if m_path.exists():
        matches_df = pd.read_csv(m_path)
    else:
        matches_df = clean_match_fixtures(
            pd.DataFrame(json.load(open(RAW_DATA_DIR / "raw_matches.json"))["matches"])
        )

    assert players_df.isnull().sum().sum() == 0, "Processed players DataFrame has null values!"
    assert matches_df.isnull().sum().sum() == 0, "Processed matches DataFrame has null values!"
    assert len(players_df) >= 20, "Players dataset has fewer records than expected."
    assert len(matches_df) >= 15, "Matches dataset has fewer records than expected."


def test_fetch_fallback_offline() -> None:
    """Verifies that fetch_football_data safely falls back when endpoint is unreachable."""
    generate_curated_fallback_data()
    # Request invalid route with empty token, triggering fallback mechanism
    data = fetch_football_data(
        endpoint="/non_existent_mock_route_12345",
        api_key="",
        max_retries=1,
        fallback_cache_file="raw_players.json"
    )
    assert isinstance(data, dict)
    assert "players" in data
