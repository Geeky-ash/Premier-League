"""Match Outcome Predictor Training Pipeline (models/train_match_model.py).

Trains an XGBoost multi-class classifier to predict 3-way match outcomes:
Home Win ('H'), Draw ('D'), or Away Win ('A') using match-day and tactical form metrics.
Serializes the trained model bundle to models/saved/match_predictor.joblib.
"""

import logging
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

# Feature definitions
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
    """Loads cleaned matches, trains XGBClassifier, and computes evaluation metrics.

    Args:
        data_path: Path to cleaned_matches.csv.
        test_size: Holdout fraction for testing.
        random_state: Random state for deterministic data split.

    Returns:
        Tuple[xgb.XGBClassifier, Dict[str, Any]]: Trained classifier and evaluation metrics dictionary.

    Raises:
        FileNotFoundError: If processed matches CSV is missing.
        ValueError: If mandatory features or target column are absent.
    """
    if not data_path.exists():
        raise FileNotFoundError(
            f"Processed matches data file not found at {data_path}. Run clean_pipeline first."
        )

    df = pd.read_csv(data_path)
    logger.info("Loaded match dataset with shape %s from %s", df.shape, data_path)

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
        n_estimators=75,
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
    """Serializes the XGBoost model and inference metadata to .joblib.

    Args:
        model: Trained XGBClassifier.
        metrics: Dictionary of test metrics and confusion matrix.
        output_path: Target path for .joblib artifact.

    Returns:
        Path: Output path of the saved bundle.
    """
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

    return output_path


def predict_match_outcome(
    features: Dict[str, Any],
    model_bundle_path: Path = MODEL_OUTPUT_PATH,
) -> Dict[str, Any]:
    """Inference helper predicting outcome probabilities for a single fixture.

    Args:
        features: Dictionary containing match feature values matching MATCH_FEATURES.
        model_bundle_path: Path to serialized model artifact.

    Returns:
        Dict[str, Any]: Formatted result with outcome probabilities and winning label.
    """
    bundle = joblib.load(model_bundle_path)
    model: xgb.XGBClassifier = bundle["model"]
    feature_names: List[str] = bundle["feature_names"]
    inv_labels: Dict[int, str] = bundle["inv_label_mapping"]

    input_df = pd.DataFrame([features])[feature_names]
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
