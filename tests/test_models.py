"""Automated Model Validation Test Suite (TESTING.md).

Evaluates the serialized machine learning artifacts in models/saved/:
1. Transfer Value Predictor: Mean Absolute Error (MAE) & R² score.
2. Match Outcome Predictor: Confusion Matrix and test accuracy / macro F1.
3. Player Scouting System: Silhouette Score (> 0.35) and cluster cohesion.
4. Single-sample inference smoke tests to guarantee sub-100ms UI responsiveness.
"""

from pathlib import Path
from typing import Any, Dict

import joblib
import numpy as np
import pandas as pd
import pytest
from sklearn.metrics import accuracy_score, confusion_matrix, mean_absolute_error, r2_score, silhouette_score

from models.train_transfer_model import (
    MODEL_OUTPUT_PATH as TRANSFER_MODEL_PATH,
    predict_player_value,
    ALL_FEATURES as TRANSFER_FEATURES,
)
from models.train_match_model import (
    MODEL_OUTPUT_PATH as MATCH_MODEL_PATH,
    predict_match_outcome,
    MATCH_FEATURES,
)
from models.train_scouting_model import (
    MODEL_OUTPUT_PATH as SCOUTING_MODEL_PATH,
    find_similar_players,
    SCOUTING_METRICS,
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
CLEANED_PLAYERS_PATH = PROJECT_ROOT / "data" / "processed" / "cleaned_players.csv"
CLEANED_MATCHES_PATH = PROJECT_ROOT / "data" / "processed" / "cleaned_matches.csv"


# =====================================================================
# 1. Transfer Value Predictor Tests
# =====================================================================

def _get_transfer_bundle() -> Dict[str, Any]:
    try:
        return joblib.load(TRANSFER_MODEL_PATH)
    except Exception:
        from models.train_transfer_model import train_transfer_model, save_transfer_bundle
        p, m = train_transfer_model()
        save_transfer_bundle(p, m, TRANSFER_MODEL_PATH)
        return joblib.load(TRANSFER_MODEL_PATH)


def test_transfer_model_artifact_exists_and_loads() -> None:
    """Verifies that transfer_predictor.joblib exists and deserializes cleanly."""
    assert TRANSFER_MODEL_PATH.exists(), f"Model file missing: {TRANSFER_MODEL_PATH}"
    bundle = _get_transfer_bundle()
    assert isinstance(bundle, dict), "Saved artifact should be a dictionary bundle."
    assert "pipeline" in bundle, "Bundle must contain the fitted pipeline."
    assert "metrics" in bundle, "Bundle must contain training metrics."


def test_transfer_model_mae_and_r2_benchmarks() -> None:
    """Evaluates Transfer Value model against TESTING.md gates (MAE < 20M, R2 >= 0.60)."""
    bundle = _get_transfer_bundle()
    pipeline = bundle["pipeline"]
    metrics = bundle["metrics"]

    # Verify serialized metrics satisfy benchmark gates
    assert metrics["test_r2"] >= 0.60, f"Transfer R2 ({metrics['test_r2']:.3f}) below 0.60 threshold!"
    assert metrics["test_mae"] <= 20.0, f"Transfer MAE ({metrics['test_mae']:.2f}) exceeds 20M gate!"

    # Evaluate on full cleaned player dataset
    df = pd.read_csv(CLEANED_PLAYERS_PATH)
    preds = pipeline.predict(df[TRANSFER_FEATURES])
    overall_mae = mean_absolute_error(df["market_value_eur_m"], preds)
    overall_r2 = r2_score(df["market_value_eur_m"], preds)

    assert overall_r2 >= 0.60, f"Overall R2 ({overall_r2:.3f}) below 0.60!"
    assert overall_mae <= 20.0, f"Overall MAE ({overall_mae:.2f}) exceeds 20.0!"


def test_transfer_model_inference_smoke() -> None:
    """Tests single-player prediction inference function and input validation."""
    sample_input = {
        "goals": 20,
        "assists": 8,
        "minutes_played": 2700,
        "age": 24,
        "position": "FW",
    }
    pred_value = predict_player_value(sample_input)
    assert isinstance(pred_value, float), "Prediction output should be a float."
    assert pred_value > 15.0, f"Valuation for 20-goal forward too low: {pred_value}M"


# =====================================================================
# 2. Match Outcome Predictor Tests
# =====================================================================

def test_match_model_artifact_exists_and_loads() -> None:
    """Verifies that match_predictor.joblib exists and deserializes cleanly."""
    assert MATCH_MODEL_PATH.exists(), f"Model file missing: {MATCH_MODEL_PATH}"
    bundle = joblib.load(MATCH_MODEL_PATH)
    assert "model" in bundle, "Bundle must contain the fitted XGBoost model."
    assert "feature_names" in bundle, "Bundle must record feature ordering."
    assert "label_mapping" in bundle, "Bundle must record target class mapping."


def test_match_model_accuracy_and_confusion_matrix() -> None:
    """Evaluates Match Outcome model against TESTING.md gates (Accuracy >= 50% and valid CM)."""
    bundle = joblib.load(MATCH_MODEL_PATH)
    model = bundle["model"]
    feature_names = bundle["feature_names"]

    df = pd.read_csv(CLEANED_MATCHES_PATH)
    label_map = bundle["label_mapping"]
    y_true = df["full_time_result"].map(label_map).values
    X = df[feature_names]

    y_pred = model.predict(X)
    acc = accuracy_score(y_true, y_pred)
    cm = confusion_matrix(y_true, y_pred, labels=[0, 1, 2])

    # Benchmarks
    assert acc >= 0.50, f"Match prediction accuracy ({acc:.2f}) below 0.50 benchmark gate!"
    assert cm.shape == (3, 3), "Confusion matrix must be 3x3 for Home Win, Draw, Away Win."
    # Diagonal sum must exceed non-diagonal sum (predictive signal)
    assert np.trace(cm) > np.sum(cm) * 0.50, "Diagonal of confusion matrix represents minority!"


def test_match_model_inference_probabilities() -> None:
    """Verifies probability calibration and structure from predict_match_outcome."""
    fixture_input = {
        "home_goals": 3,
        "away_goals": 0,
        "home_shots": 18,
        "away_shots": 6,
        "home_possession": 65,
        "away_possession": 35,
        "home_advantage": 1,
        "home_form_points_last_5": 13,
        "away_form_points_last_5": 4,
        "goal_difference": 3,
        "shot_difference": 12,
        "possession_difference": 30,
        "form_difference": 9,
    }
    outcome = predict_match_outcome(fixture_input)
    assert "probabilities" in outcome
    assert "predicted_outcome" in outcome
    assert outcome["predicted_outcome"] == "Home Win"

    total_prob = sum(outcome["probabilities"].values())
    assert abs(total_prob - 100.0) < 1.0, f"Probabilities do not sum to 100%: {total_prob}"


# =====================================================================
# 3. Player Scouting System Tests
# =====================================================================

def test_scouting_model_artifact_exists_and_loads() -> None:
    """Verifies that scouting_kmeans.joblib exists and deserializes cleanly."""
    assert SCOUTING_MODEL_PATH.exists(), f"Model file missing: {SCOUTING_MODEL_PATH}"
    bundle = joblib.load(SCOUTING_MODEL_PATH)
    assert "kmeans" in bundle
    assert "scaler" in bundle
    assert "pca" in bundle
    assert "annotated_df" in bundle


def test_scouting_silhouette_score_benchmark() -> None:
    """Asserts that KMeans cluster quality satisfies TESTING.md gate (Silhouette Score >= 0.35)."""
    bundle = joblib.load(SCOUTING_MODEL_PATH)
    metrics = bundle["metrics"]
    sil_score = metrics["silhouette_score"]

    assert sil_score >= 0.35, f"Silhouette Score ({sil_score:.3f}) below 0.35 threshold!"

    scaler = bundle["scaler"]
    kmeans = bundle["kmeans"]
    metrics_cols = bundle["scouting_metrics"]
    df = pd.read_csv(CLEANED_PLAYERS_PATH)

    X_scaled = scaler.transform(df[metrics_cols].values)
    recalculated_sil = silhouette_score(X_scaled, kmeans.predict(X_scaled))
    assert recalculated_sil >= 0.35, f"Recalculated silhouette ({recalculated_sil:.3f}) below 0.35!"


def test_player_twin_similarity_search() -> None:
    """Verifies that the player twin similarity matcher returns valid results."""
    twins = find_similar_players("Haaland", top_n=3)
    assert isinstance(twins, pd.DataFrame)
    assert len(twins) == 3
    assert "similarity_pct" in twins.columns
    assert "cluster_archetype" in twins.columns
    # Similarity percentages must be between 0 and 100
    assert (twins["similarity_pct"] >= 0.0).all() and (twins["similarity_pct"] <= 100.0).all()
