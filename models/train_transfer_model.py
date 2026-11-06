"""Transfer Value Predictor Training Pipeline (models/train_transfer_model.py).

Trains a regularized/standard Linear Regression pipeline with StandardScaler
and OneHotEncoder to forecast fair-market player valuations in millions (€).
Serializes the trained pipeline artifact to models/saved/transfer_predictor.joblib.
"""

import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression, Ridge
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

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
PROCESSED_DATA_PATH: Path = PROJECT_ROOT / "data" / "processed" / "cleaned_players.csv"
MODEL_OUTPUT_PATH: Path = PROJECT_ROOT / "models" / "saved" / "transfer_predictor.joblib"

NUMERIC_FEATURES: List[str] = ["goals", "assists", "minutes_played", "age"]
CATEGORICAL_FEATURES: List[str] = ["position"]
ALL_FEATURES: List[str] = NUMERIC_FEATURES + CATEGORICAL_FEATURES
TARGET_COLUMN: str = "market_value_eur_m"


def build_transfer_pipeline() -> Pipeline:
    """Constructs the Scikit-learn preprocessing and regression pipeline.

    Applies StandardScaler to numeric stats and OneHotEncoder to categorical
    position tokens, followed by a Linear Regression estimator.

    Returns:
        Pipeline: Unfitted Scikit-learn Pipeline object.
    """
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), NUMERIC_FEATURES),
            (
                "cat",
                OneHotEncoder(handle_unknown="ignore", sparse_output=False),
                CATEGORICAL_FEATURES,
            ),
        ]
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("regressor", LinearRegression()),
        ]
    )
    return pipeline


def train_transfer_model(
    data_path: Path = PROCESSED_DATA_PATH,
    test_size: float = 0.2,
    random_state: int = 42,
) -> Tuple[Pipeline, Dict[str, float]]:
    """Loads player statistics, trains the linear regression pipeline, and evaluates metrics.

    Args:
        data_path: Path to the cleaned players CSV dataset.
        test_size: Proportion of the dataset allocated to the holdout test set.
        random_state: Seed for reproducible train/test split.

    Returns:
        Tuple[Pipeline, Dict[str, float]]: Trained pipeline and evaluation metrics dictionary.

    Raises:
        FileNotFoundError: If the processed CSV does not exist.
        ValueError: If required feature or target columns are missing.
    """
    if not data_path.exists():
        raise FileNotFoundError(
            f"Processed data file not found at {data_path}. Run clean_pipeline first."
        )

    df = pd.read_csv(data_path)
    logger.info("Loaded player dataset with shape %s from %s", df.shape, data_path)

    missing_cols = [c for c in ALL_FEATURES + [TARGET_COLUMN] if c not in df.columns]
    if missing_cols:
        raise ValueError(f"Player dataset missing expected columns: {missing_cols}")

    X = df[ALL_FEATURES]
    y = df[TARGET_COLUMN]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )

    pipeline = build_transfer_pipeline()
    pipeline.fit(X_train, y_train)

    train_preds = pipeline.predict(X_train)
    test_preds = pipeline.predict(X_test)

    train_mae = float(mean_absolute_error(y_train, train_preds))
    test_mae = float(mean_absolute_error(y_test, test_preds))
    train_r2 = float(r2_score(y_train, train_preds))
    test_r2 = float(r2_score(y_test, test_preds))

    metrics: Dict[str, float] = {
        "train_mae": train_mae,
        "test_mae": test_mae,
        "train_r2": train_r2,
        "test_r2": test_r2,
    }

    logger.info(
        "Transfer Model Trained: Train MAE=%.2f, Test MAE=%.2f, Test R2=%.3f",
        train_mae,
        test_mae,
        test_r2,
    )

    return pipeline, metrics


def save_transfer_bundle(
    pipeline: Pipeline,
    metrics: Dict[str, float],
    output_path: Path = MODEL_OUTPUT_PATH,
) -> Path:
    """Serializes the trained pipeline, feature metadata, and metrics bundle.

    Args:
        pipeline: Fitted Scikit-learn Pipeline.
        metrics: Dictionary of evaluation metrics.
        output_path: Destination path for the .joblib file.

    Returns:
        Path: Destination path of the saved bundle.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)
    bundle: Dict[str, Any] = {
        "model_name": "TransferValuePredictor_LinearRegression",
        "pipeline": pipeline,
        "numeric_features": NUMERIC_FEATURES,
        "categorical_features": CATEGORICAL_FEATURES,
        "all_features": ALL_FEATURES,
        "target_column": TARGET_COLUMN,
        "metrics": metrics,
    }

    try:
        joblib.dump(bundle, output_path)
        logger.info("Successfully serialized transfer model bundle to %s", output_path)
    except (PermissionError, OSError) as exc:
        logger.warning("Filesystem write restricted for %s: %s", output_path, exc)

    return output_path


def predict_player_value(
    features: Dict[str, Any],
    model_bundle_path: Path = MODEL_OUTPUT_PATH,
) -> float:
    """Inference helper predicting transfer value (€M) from a single player feature dictionary.

    Args:
        features: Dictionary containing keys: 'goals', 'assists', 'minutes_played', 'age', 'position'.
        model_bundle_path: Path to serialized model artifact.

    Returns:
        float: Predicted player transfer valuation in millions of Euros (clamped >= 1.0).
    """
    try:
        bundle = joblib.load(model_bundle_path)
    except Exception:
        trained_pipe, metrics = train_transfer_model()
        save_transfer_bundle(trained_pipe, metrics, model_bundle_path)
        bundle = joblib.load(model_bundle_path)

    pipeline: Pipeline = bundle["pipeline"]

    input_df = pd.DataFrame([features])
    raw_pred = float(pipeline.predict(input_df)[0])
    # Valuations are strictly positive with a baseline floor of €1.0M
    return round(max(1.0, raw_pred), 2)


if __name__ == "__main__":
    trained_pipeline, eval_metrics = train_transfer_model()
    saved_file = save_transfer_bundle(trained_pipeline, eval_metrics)
    print(f"Transfer Value Predictor saved to: {saved_file}")
    print(f"Metrics: {eval_metrics}")
