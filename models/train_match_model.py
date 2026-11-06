"""Match Outcome Predictor Training Pipeline (models/train_match_model.py).

Trains an XGBoost multi-class classifier to predict 3-way match outcomes:
Home Win ('H'), Draw ('D'), or Away Win ('A') using match-day, tactical form metrics,
and official referee strictness impact factors.
Serializes the trained model bundle to models/saved/match_predictor.joblib and models/saved/match_outcome_xgb.pkl.
"""

import logging
import pickle
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.model_selection import train_test_split
import xgboost as xgb

# Configure logger
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
PROCESSED_DATA_PATH: Path = PROJECT_ROOT / "data" / "processed" / "cleaned_matches.csv"
MODEL_OUTPUT_PATH: Path = PROJECT_ROOT / "models" / "saved" / "match_predictor.joblib"
MODEL_PKL_PATH: Path = PROJECT_ROOT / "models" / "saved" / "match_outcome_xgb.pkl"

# Feature definitions including Referee Impact Engine features
MATCH_FEATURES: List[str] = [
    "home_goals",
    "away_goals",
    "home_shots",
    "away_shots",
    "home_possession",
    "away_possession",
    "home_advantage",
    "home_form_points_last_5",
    "away_form_points_last_5",
    "goal_difference",
    "shot_difference",
    "possession_difference",
    "form_difference",
    "referee_yellows_per_game",
    "referee_strictness_index",
]
TARGET_COLUMN: str = "full_time_result"

LABEL_MAPPING: Dict[str, int] = {"H": 0, "D": 1, "A": 2}
INV_LABEL_MAPPING: Dict[int, str] = {0: "Home Win", 1: "Draw", 2: "Away Win"}
TARGET_NAMES: List[str] = ["Home Win", "Draw", "Away Win"]


def train_match_model(
    data_path: Path = PROCESSED_DATA_PATH,
    test_size: float = 0.25,
    random_state: int = 42,
) -> Tuple[xgb.XGBClassifier, Dict[str, Any]]:
    """Loads cleaned matches, trains XGBClassifier, and computes evaluation metrics."""
    if not data_path.exists():
        raise FileNotFoundError(
            f"Processed matches data file not found at {data_path}. Run clean_pipeline first."
        )

    df = pd.read_csv(data_path)
    logger.info("Loaded match dataset with shape %s from %s", df.shape, data_path)

    # Ensure referee features exist if legacy CSV loaded
    if "referee_yellows_per_game" not in df.columns:
        df["referee_yellows_per_game"] = 4.20
    if "referee_strictness_index" not in df.columns:
        df["referee_strictness_index"] = 5.00

    missing_cols = [c for c in MATCH_FEATURES + [TARGET_COLUMN] if c not in df.columns]
    if missing_cols:
        raise ValueError(f"Match dataset missing required columns: {missing_cols}")

    X = df[MATCH_FEATURES]
    y_raw = df[TARGET_COLUMN].map(LABEL_MAPPING)

    if y_raw.isnull().any():
        raise ValueError("Invalid target class label found in full_time_result.")

    y = y_raw.astype(int)

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state, stratify=y
    )

    classifier = xgb.XGBClassifier(
        n_estimators=85,
        max_depth=3,
        learning_rate=0.08,
        objective="multi:softprob",
        num_class=3,
        eval_metric="mlogloss",
        random_state=random_state,
    )

    classifier.fit(X_train, y_train)

    train_preds = classifier.predict(X_train)
    test_preds = classifier.predict(X_test)

    train_acc = float(accuracy_score(y_train, train_preds))
    test_acc = float(accuracy_score(y_test, test_preds))
    cm = confusion_matrix(y_test, test_preds, labels=[0, 1, 2]).tolist()
    report = classification_report(
        y_test,
        test_preds,
        labels=[0, 1, 2],
        target_names=TARGET_NAMES,
        output_dict=True,
        zero_division=0,
    )

    metrics: Dict[str, Any] = {
        "train_accuracy": train_acc,
        "test_accuracy": test_acc,
        "confusion_matrix": cm,
        "classification_report": report,
    }

    logger.info(
        "Match Model Trained: Train Acc=%.2f, Test Acc=%.2f",
        train_acc,
        test_acc,
    )

    return classifier, metrics


def save_match_bundle(
    model: xgb.XGBClassifier,
    metrics: Dict[str, Any],
    output_path: Path = MODEL_OUTPUT_PATH,
) -> Path:
    """Serializes the XGBoost model and inference metadata to .joblib and .pkl."""
    output_path.parent.mkdir(parents=True, exist_ok=True)
    bundle: Dict[str, Any] = {
        "model_name": "MatchOutcomePredictor_XGBoost",
        "model": model,
        "feature_names": MATCH_FEATURES,
        "label_mapping": LABEL_MAPPING,
        "inv_label_mapping": INV_LABEL_MAPPING,
        "target_names": TARGET_NAMES,
        "metrics": metrics,
    }

    try:
        joblib.dump(bundle, output_path)
        logger.info("Successfully serialized match outcome model to %s", output_path)
    except (PermissionError, OSError) as exc:
        logger.warning("Filesystem write restricted for %s: %s", output_path, exc)

    # Also persist to match_outcome_xgb.pkl
    try:
        with open(MODEL_PKL_PATH, "wb") as f:
            pickle.dump(bundle, f)
        logger.info("Successfully serialized match outcome model to %s", MODEL_PKL_PATH)
    except Exception as exc:
        logger.warning("Could not persist pkl to %s: %s", MODEL_PKL_PATH, exc)

    return output_path


def predict_match_outcome(
    features: Dict[str, Any],
    model_bundle_path: Path = MODEL_OUTPUT_PATH,
) -> Dict[str, Any]:
    """Inference helper predicting outcome probabilities for a single fixture."""
    bundle = joblib.load(model_bundle_path)
    model: xgb.XGBClassifier = bundle["model"]
    feature_names: List[str] = bundle["feature_names"]
    inv_labels: Dict[int, str] = bundle["inv_label_mapping"]

    # Provide safe defaults for referee impact levers if omitted
    feat_copy = dict(features)
    if "referee_yellows_per_game" not in feat_copy or feat_copy["referee_yellows_per_game"] is None:
        feat_copy["referee_yellows_per_game"] = 4.10
    if "referee_strictness_index" not in feat_copy or feat_copy["referee_strictness_index"] is None:
        feat_copy["referee_strictness_index"] = 5.20

    input_df = pd.DataFrame([feat_copy])[feature_names]
    probs = model.predict_proba(input_df)[0]
    pred_idx = int(np.argmax(probs))

    prob_dict = {
        inv_labels[idx]: round(float(probs[idx]) * 100.0, 1)
        for idx in range(len(probs))
    }

    return {
        "predicted_outcome": inv_labels[pred_idx],
        "outcome_code": ["H", "D", "A"][pred_idx],
        "probabilities": prob_dict,
        "confidence": prob_dict[inv_labels[pred_idx]],
    }


if __name__ == "__main__":
    trained_model, eval_metrics = train_match_model()
    saved_file = save_match_bundle(trained_model, eval_metrics)
    print(f"Match Outcome Predictor saved to: {saved_file}")
    print(f"Test Accuracy: {eval_metrics['test_accuracy']:.2f}")
    print(f"Confusion Matrix: {eval_metrics['confusion_matrix']}")
