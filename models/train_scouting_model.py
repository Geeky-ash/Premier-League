"""Player Scouting & Similarity Engine (models/train_scouting_model.py).

Trains a K-Means clustering algorithm on standardized player performance metrics:
goals, assists, pass completion, shots, dribbles, and defensive actions (tackles/interceptions).
Includes PCA for 2D visual projection and a statistical "Player Twin" similarity matcher.
Serializes the fitted bundle to models/saved/scouting_kmeans.joblib.
"""

import logging
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import joblib
import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler

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
MODEL_OUTPUT_PATH: Path = PROJECT_ROOT / "models" / "saved" / "scouting_kmeans.joblib"

SCOUTING_METRICS: List[str] = [
    "goals",
    "assists",
    "pass_completion",
    "shots",
    "dribbles",
    "tackles_interceptions",
]

CLUSTER_ARCHETYPES: Dict[int, str] = {
    0: "Clinical Finishers & Inside Forwards",
    1: "Creative Playmakers & Wing Creators",
    2: "Defensive Anchors & Ball Winners",
    3: "Ball-Playing Defenders & Sweepers",
}


def train_scouting_model(
    data_path: Path = PROCESSED_DATA_PATH,
    n_clusters: int = 4,
    random_state: int = 42,
) -> Tuple[KMeans, StandardScaler, PCA, pd.DataFrame, Dict[str, float]]:
    """Loads player statistics, standardizes metrics, fits KMeans and PCA.

    Args:
        data_path: Path to cleaned_players.csv.
        n_clusters: Number of tactical style clusters (default: 4).
        random_state: Random state for deterministic centroid seeding.

    Returns:
        Tuple: (fitted_kmeans, fitted_scaler, fitted_pca, annotated_dataframe, metrics_dict).

    Raises:
        FileNotFoundError: If processed CSV is missing.
        ValueError: If required scouting metrics are absent.
    """
    if not data_path.exists():
        raise FileNotFoundError(
            f"Processed data file not found at {data_path}. Run clean_pipeline first."
        )

    df = pd.read_csv(data_path)
    logger.info("Loaded player dataset with shape %s for scouting", df.shape)

    missing_cols = [c for c in SCOUTING_METRICS if c not in df.columns]
    if missing_cols:
        raise ValueError(f"Player dataset missing scouting metrics: {missing_cols}")

    X_raw = df[SCOUTING_METRICS].values

    # Step 1: Standardize metrics
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_raw)

    # Step 2: Fit KMeans
    kmeans = KMeans(
        n_clusters=n_clusters,
        init="k-means++",
        n_init=10,
        random_state=random_state,
    )
    cluster_labels = kmeans.fit_predict(X_scaled)

    # Step 3: Compute Validation Metrics
    sil_score = float(silhouette_score(X_scaled, cluster_labels))
    inertia = float(kmeans.inertia_)

    # Step 4: Fit PCA (2D) for interactive frontend visualization
    pca = PCA(n_components=2, random_state=random_state)
    coords_2d = pca.fit_transform(X_scaled)

    # Annotate DataFrame
    annotated_df = df.copy()
    annotated_df["cluster_id"] = cluster_labels
    annotated_df["cluster_archetype"] = annotated_df["cluster_id"].map(
        lambda cid: CLUSTER_ARCHETYPES.get(cid, f"Cluster {cid}")
    )
    annotated_df["pca_x"] = np.round(coords_2d[:, 0], 3)
    annotated_df["pca_y"] = np.round(coords_2d[:, 1], 3)

    metrics = {
        "silhouette_score": sil_score,
        "inertia": inertia,
        "n_clusters": n_clusters,
        "pca_variance_ratio_sum": float(np.sum(pca.explained_variance_ratio_)),
    }

    logger.info(
        "Scouting KMeans Trained: Silhouette Score=%.3f, Inertia=%.1f, Explained Variance=%.2f%%",
        sil_score,
        inertia,
        metrics["pca_variance_ratio_sum"] * 100.0,
    )

    return kmeans, scaler, pca, annotated_df, metrics


def save_scouting_bundle(
    kmeans: KMeans,
    scaler: StandardScaler,
    pca: PCA,
    annotated_df: pd.DataFrame,
    metrics: Dict[str, float],
    output_path: Path = MODEL_OUTPUT_PATH,
) -> Path:
    """Serializes the KMeans model, scaler, PCA transformer, and annotated data.

    Args:
        kmeans: Fitted KMeans estimator.
        scaler: Fitted StandardScaler.
        pca: Fitted PCA transformer.
        annotated_df: DataFrame containing player records with cluster tags and 2D coordinates.
        metrics: Evaluation metrics dictionary.
        output_path: Destination path for .joblib artifact.

    Returns:
        Path: Path to the saved bundle.
    """
    output_path.parent.mkdir(parents=True, exist_ok=True)
    bundle: Dict[str, Any] = {
        "model_name": "PlayerScouting_KMeans",
        "kmeans": kmeans,
        "scaler": scaler,
        "pca": pca,
        "scouting_metrics": SCOUTING_METRICS,
        "cluster_archetypes": CLUSTER_ARCHETYPES,
        "annotated_df": annotated_df,
        "metrics": metrics,
    }

    try:
        joblib.dump(bundle, output_path)
        logger.info("Successfully serialized scouting bundle to %s", output_path)
    except (PermissionError, OSError) as exc:
        logger.warning("Filesystem write restricted for %s: %s", output_path, exc)

    return output_path


def find_similar_players(
    player_name: str,
    top_n: int = 5,
    model_bundle_path: Path = MODEL_OUTPUT_PATH,
) -> pd.DataFrame:
    """Discovers top statistical twin players using Euclidean distance in standardized feature space.

    Args:
        player_name: Name of target player (case-insensitive substring match).
        top_n: Number of nearest player twins to retrieve.
        model_bundle_path: Path to serialized scouting bundle.

    Returns:
        pd.DataFrame: Top similar players with similarity match percentages.
    """
    bundle = joblib.load(model_bundle_path)
    scaler: StandardScaler = bundle["scaler"]
    metrics_cols: List[str] = bundle["scouting_metrics"]
    df: pd.DataFrame = bundle["annotated_df"]

    matches = df[df["name"].str.contains(player_name, case=False, na=False)]
    if matches.empty:
        raise ValueError(f"No player found matching '{player_name}'.")

    target_idx = matches.index[0]
    target_row = df.loc[target_idx]

    # Standardize all players
    X_all = scaler.transform(df[metrics_cols].values)
    target_vec = X_all[target_idx]

    # Compute Euclidean distance
    distances = np.linalg.norm(X_all - target_vec, axis=1)

    result_df = df.copy()
    result_df["distance"] = distances
    # Convert distance to similarity percentage: 100 / (1 + distance)
    result_df["similarity_pct"] = np.round(100.0 / (1.0 + distances), 1)

    # Exclude the target player itself
    twins = (
        result_df[result_df.index != target_idx]
        .sort_values(by="distance")
        .head(top_n)[
            [
                "name",
                "club",
                "position",
                "age",
                "cluster_archetype",
                "similarity_pct",
                "market_value_eur_m",
            ]
        ]
    )

    return twins


if __name__ == "__main__":
    k_model, s_scaler, p_pca, a_df, e_metrics = train_scouting_model()
    saved_file = save_scouting_bundle(k_model, s_scaler, p_pca, a_df, e_metrics)
    print(f"Player Scouting Model saved to: {saved_file}")
    print(f"Silhouette Score: {e_metrics['silhouette_score']:.3f}")
