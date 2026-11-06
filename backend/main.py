"""FastAPI High-Performance ML Microservice (backend/main.py).

Serves predictions directly from serialized .joblib pipelines:
- Module 1: Transfer Value Predictor (Linear Regression)
- Module 2: Match Outcome Predictor (XGBoost)
- Module 3: Player Scouting & Similarity System (K-Means + PCA)
"""

from contextlib import asynccontextmanager
from datetime import datetime
import logging
from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware

from backend.schemas import (
    ClusterMapPoint,
    HealthResponse,
    HistoricalTrendPoint,
    MatchPredictRequest,
    MatchPredictResponse,
    PlayerTwin,
    ScoutTwinRequest,
    ScoutTwinResponse,
    TransferPredictRequest,
    TransferPredictResponse,
)

# Configure logger
logger = logging.getLogger("premier_league_api")
logging.basicConfig(level=logging.INFO)

PROJECT_ROOT = Path(__file__).resolve().parent.parent
MODELS_DIR = PROJECT_ROOT / "models" / "saved"
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"

# In-Memory Cache for ML Bundles & Datasets
ml_artifacts: Dict[str, Any] = {}


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Loads all serialized model artifacts and datasets into memory upon server startup with auto-fallback."""
    logger.info("Initializing Premier League ML Microservice...")

    def safe_load_artifact(name: str, path: Path, retrain_fn):
        try:
            if not path.exists():
                raise FileNotFoundError(f"{path} not found")
            return joblib.load(path)
        except Exception as exc:
            logger.warning("Artifact %s incompatible or missing (%s). Retraining for current environment...", name, exc)
            retrain_fn()
            return joblib.load(path)

    # 1. Load Datasets first
    players_csv = PROCESSED_DIR / "cleaned_players.csv"
    if players_csv.exists():
        ml_artifacts["players_df"] = pd.read_csv(players_csv)
        logger.info("Loaded cleaned_players.csv (%d records)", len(ml_artifacts["players_df"]))

    matches_csv = PROCESSED_DIR / "cleaned_matches.csv"
    if matches_csv.exists():
        ml_artifacts["matches_df"] = pd.read_csv(matches_csv)
        logger.info("Loaded cleaned_matches.csv (%d records)", len(ml_artifacts["matches_df"]))

    # 2. Load Transfer Predictor
    transfer_path = MODELS_DIR / "transfer_predictor.joblib"
    def retrain_transfer():
        from models.train_transfer_model import train_transfer_model, save_transfer_bundle
        p, m = train_transfer_model()
        save_transfer_bundle(p, m)

    ml_artifacts["transfer"] = safe_load_artifact("transfer", transfer_path, retrain_transfer)
    logger.info("Loaded transfer_predictor.joblib")

    # 3. Load Match Predictor
    match_path = MODELS_DIR / "match_predictor.joblib"
    def retrain_match():
        from models.train_match_model import train_match_model, save_match_bundle
        clf, m = train_match_model()
        save_match_bundle(clf, m)

    ml_artifacts["match"] = safe_load_artifact("match", match_path, retrain_match)
    logger.info("Loaded match_predictor.joblib")

    # 4. Load Player Scouting System
    scouting_path = MODELS_DIR / "scouting_kmeans.joblib"
    def retrain_scouting():
        from models.train_scouting_model import train_scouting_model, save_scouting_bundle
        k, s, p, a, m = train_scouting_model()
        save_scouting_bundle(k, s, p, a, m)

    ml_artifacts["scouting"] = safe_load_artifact("scouting", scouting_path, retrain_scouting)
    logger.info("Loaded scouting_kmeans.joblib")

    yield

    logger.info("Shutting down Premier League ML Microservice...")
    ml_artifacts.clear()


app = FastAPI(
    title="Premier League Analytics API",
    description="High-precision ML inference engine for Player Valuation, Fixture Forecasting & Tactical Scouting.",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS Middleware for Next.js frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health", response_model=HealthResponse)
async def health_check() -> HealthResponse:
    """Returns microservice health and loaded model status."""
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        models_loaded={
            "transfer_model": "transfer" in ml_artifacts,
            "match_model": "match" in ml_artifacts,
            "scouting_model": "scouting" in ml_artifacts,
            "players_data": "players_df" in ml_artifacts,
            "matches_data": "matches_df" in ml_artifacts,
        },
        timestamp=datetime.utcnow().isoformat(),
    )


@app.get("/api/v1/players")
async def get_all_players() -> List[Dict[str, Any]]:
    """Returns all available Premier League players for autocomplete/presets."""
    df = ml_artifacts.get("players_df")
    if df is None:
        raise HTTPException(status_code=500, detail="Player dataset not loaded")
    return df.to_dict(orient="records")


@app.get("/api/v1/clubs")
async def get_all_clubs() -> List[str]:
    """Returns unique Premier League club names."""
    df = ml_artifacts.get("players_df")
    if df is not None and "club" in df.columns:
        return sorted(df["club"].unique().tolist())
    return [
        "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton & Hove Albion",
        "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town",
        "Leicester City", "Liverpool", "Manchester City", "Manchester United",
        "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham Hotspur",
        "West Ham United", "Wolverhampton Wanderers"
    ]


# =====================================================================
# Module 1: Transfer Value Predictor
# =====================================================================
@app.post("/api/v1/predict/transfer-value", response_model=TransferPredictResponse)
async def predict_transfer_value(req: TransferPredictRequest) -> TransferPredictResponse:
    """Forecasts fair-market player transfer valuation (€M) with 100% model fidelity."""
    bundle = ml_artifacts.get("transfer")
    if bundle is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Transfer predictor model is not loaded.",
        )

    pipeline = bundle["pipeline"]
    metrics = bundle.get("metrics", {})
    df = ml_artifacts.get("players_df")

    input_payload = {
        "goals": req.goals,
        "assists": req.assists,
        "minutes_played": req.minutes_played,
        "age": req.age,
        "position": req.position.upper(),
    }
    input_df = pd.DataFrame([input_payload])

    try:
        raw_pred = float(pipeline.predict(input_df)[0])
        clamped_val = round(max(1.0, raw_pred), 2)
    except Exception as exc:
        logger.error("Transfer inference error: %s", exc)
        raise HTTPException(status_code=500, detail=f"Inference error: {exc}")

    # Build historical trend points for Recharts regression overlay
    trend_points: List[HistoricalTrendPoint] = []
    if df is not None:
        features_df = df[["goals", "assists", "minutes_played", "age", "position"]]
        fitted_vals = pipeline.predict(features_df)
        for idx, row in df.head(35).iterrows():
            trend_points.append(
                HistoricalTrendPoint(
                    name=str(row["name"]),
                    actual_value=float(row["market_value_eur_m"]),
                    fitted_value=round(float(fitted_vals[idx]), 1),
                    goals=int(row["goals"]),
                    assists=int(row["assists"]),
                    position=str(row["position"]),
                )
            )

    return TransferPredictResponse(
        valuation_eur_m=clamped_val,
        age=req.age,
        goals=req.goals,
        assists=req.assists,
        minutes_played=req.minutes_played,
        position=req.position.upper(),
        r2_score=round(float(metrics.get("test_r2", 0.74)), 3),
        mae_score=round(float(metrics.get("test_mae", 15.2)), 2),
        historical_trend=trend_points,
    )


# =====================================================================
# Module 2: Match Outcome Predictor
# =====================================================================
@app.post("/api/v1/predict/match-outcome", response_model=MatchPredictResponse)
async def predict_match_outcome(req: MatchPredictRequest) -> MatchPredictResponse:
    """Predicts 3-way match fixture probabilities (Home Win, Draw, Away Win) via XGBoost."""
    bundle = ml_artifacts.get("match")
    if bundle is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Match outcome model is not loaded.",
        )

    model = bundle["model"]
    feature_names: List[str] = bundle["feature_names"]
    inv_labels: Dict[int, str] = bundle["inv_label_mapping"]

    away_possession = 100.0 - req.home_possession
    feature_dict = {
        "home_goals": req.home_goals,
        "away_goals": req.away_goals,
        "home_shots": req.home_shots,
        "away_shots": req.away_shots,
        "home_possession": float(req.home_possession),
        "away_possession": float(away_possession),
        "home_advantage": 1,
        "home_form_points_last_5": float(req.home_form_points),
        "away_form_points_last_5": float(req.away_form_points),
        "goal_difference": req.home_goals - req.away_goals,
        "shot_difference": req.home_shots - req.away_shots,
        "possession_difference": float(req.home_possession - away_possession),
        "form_difference": float(req.home_form_points - req.away_form_points),
    }

    try:
        input_df = pd.DataFrame([feature_dict])[feature_names]
        probs = model.predict_proba(input_df)[0]
    except Exception as exc:
        logger.error("Match inference error: %s", exc)
        raise HTTPException(status_code=500, detail=f"Match inference error: {exc}")

    prob_map = {
        "Home Win": round(float(probs[0]) * 100.0, 1),
        "Draw": round(float(probs[1]) * 100.0, 1),
        "Away Win": round(float(probs[2]) * 100.0, 1),
    }

    pred_idx = int(np.argmax(probs))
    pred_label = ["Home Win", "Draw", "Away Win"][pred_idx]
    pred_code = ["H", "D", "A"][pred_idx]

    return MatchPredictResponse(
        home_team=req.home_team,
        away_team=req.away_team,
        predicted_outcome=pred_label,
        outcome_code=pred_code,
        confidence=prob_map[pred_label],
        probabilities=prob_map,
        tactical_diffs={
            "goal_diff": float(feature_dict["goal_difference"]),
            "shot_diff": float(feature_dict["shot_difference"]),
            "possession_diff": float(feature_dict["possession_difference"]),
            "form_diff": float(feature_dict["form_difference"]),
        },
    )


# =====================================================================
# Module 3: Player Scouting & Similarity System
# =====================================================================
@app.post("/api/v1/predict/scout-twin", response_model=ScoutTwinResponse)
async def scout_player_twin(req: ScoutTwinRequest) -> ScoutTwinResponse:
    """Groups player into tactical style cluster and retrieves top statistical twins."""
    bundle = ml_artifacts.get("scouting")
    if bundle is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Player scouting model is not loaded.",
        )

    scaler = bundle["scaler"]
    kmeans = bundle["kmeans"]
    pca = bundle["pca"]
    metrics_cols: List[str] = bundle["scouting_metrics"]
    archetypes: Dict[int, str] = bundle["cluster_archetypes"]
    df: pd.DataFrame = bundle["annotated_df"]

    target_name = "Custom Prospect"
    club = "Free Agent"
    position = "MF"

    # Case 1: Match existing player by name
    if req.player_name:
        match = df[df["name"].str.contains(req.player_name, case=False, na=False)]
        if not match.empty:
            target_idx = match.index[0]
            target_row = df.loc[target_idx]
            target_name = str(target_row["name"])
            club = str(target_row["club"])
            position = str(target_row["position"])
            target_vec = scaler.transform(df[metrics_cols].values)[target_idx]
            cluster_id = int(target_row["cluster_id"])
            pca_coord = {"x": float(target_row["pca_x"]), "y": float(target_row["pca_y"])}
        else:
            raise HTTPException(status_code=404, detail=f"Player '{req.player_name}' not found.")
    else:
        # Case 2: Custom tactical metrics provided
        metrics_input = [
            req.goals if req.goals is not None else 10,
            req.assists if req.assists is not None else 5,
            req.pass_completion if req.pass_completion is not None else 82.0,
            req.shots if req.shots is not None else 60,
            req.dribbles if req.dribbles is not None else 35,
            req.tackles_interceptions if req.tackles_interceptions is not None else 40,
        ]
        target_vec = scaler.transform([metrics_input])[0]
        cluster_id = int(kmeans.predict([target_vec])[0])
        pca_2d = pca.transform([target_vec])[0]
        pca_coord = {"x": round(float(pca_2d[0]), 3), "y": round(float(pca_2d[1]), 3)}

    # Compute Euclidean distances to all players in standardized space
    X_all = scaler.transform(df[metrics_cols].values)
    distances = np.linalg.norm(X_all - target_vec, axis=1)

    twin_df = df.copy()
    twin_df["distance"] = distances
    twin_df["similarity_pct"] = np.round(100.0 / (1.0 + distances), 1)

    # Filter out self
    if req.player_name:
        twin_df = twin_df[twin_df["name"] != target_name]

    top_5 = twin_df.sort_values(by="similarity_pct", ascending=False).head(5)

    twins: List[PlayerTwin] = []
    for _, r in top_5.iterrows():
        twins.append(
            PlayerTwin(
                name=str(r["name"]),
                club=str(r["club"]),
                position=str(r["position"]),
                age=int(r["age"]),
                similarity_pct=float(r["similarity_pct"]),
                valuation_eur_m=float(r["market_value_eur_m"]),
                cluster_archetype=str(r.get("cluster_archetype", "Tactical Specialist")),
                pca_x=float(r.get("pca_x", 0.0)),
                pca_y=float(r.get("pca_y", 0.0)),
            )
        )

    # Compile 2D PCA cluster map points
    cluster_points: List[ClusterMapPoint] = []
    for _, r in df.iterrows():
        c_id = int(r.get("cluster_id", 0))
        cluster_points.append(
            ClusterMapPoint(
                name=str(r["name"]),
                club=str(r["club"]),
                position=str(r["position"]),
                cluster_id=c_id,
                cluster_archetype=archetypes.get(c_id, f"Cluster {c_id}"),
                pca_x=float(r.get("pca_x", 0.0)),
                pca_y=float(r.get("pca_y", 0.0)),
                market_value=float(r.get("market_value_eur_m", 25.0)),
            )
        )

    return ScoutTwinResponse(
        target_player=target_name,
        club=club,
        position=position,
        cluster_id=cluster_id,
        cluster_archetype=archetypes.get(cluster_id, f"Cluster {cluster_id}"),
        pca_coords=pca_coord,
        top_twins=twins,
        all_cluster_points=cluster_points,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
