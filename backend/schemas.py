"""Pydantic Request & Response Schemas for Premier League FastAPI Microservice."""

from typing import Any, Dict, List, Optional
from pydantic import BaseModel, Field


# --- Health & Metadata ---
class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "1.0.0"
    models_loaded: Dict[str, bool]
    timestamp: str


# --- Transfer Value Predictor ---
class TransferPredictRequest(BaseModel):
    age: int = Field(24, ge=15, le=45, description="Player age in years")
    goals: int = Field(15, ge=0, le=60, description="Goals scored in season")
    assists: int = Field(8, ge=0, le=40, description="Assists in season")
    minutes_played: int = Field(2400, ge=90, le=4500, description="Total season minutes")
    position: str = Field("FW", description="Player position token: FW, MF, DF, GK")


class HistoricalTrendPoint(BaseModel):
    name: str
    actual_value: float
    fitted_value: float
    goals: int
    assists: int
    position: str


class TransferPredictResponse(BaseModel):
    valuation_eur_m: float
    age: int
    goals: int
    assists: int
    minutes_played: int
    position: str
    r2_score: float
    mae_score: float
    historical_trend: List[HistoricalTrendPoint]


# --- Match Outcome Predictor ---
class MatchPredictRequest(BaseModel):
    home_team: str = Field("Arsenal", description="Home club name")
    away_team: str = Field("Chelsea", description="Away club name")
    home_possession: float = Field(55.0, ge=20.0, le=80.0, description="Expected home possession percentage")
    home_shots: int = Field(15, ge=1, le=40, description="Expected home shots")
    away_shots: int = Field(9, ge=1, le=40, description="Expected away shots")
    home_goals: int = Field(2, ge=0, le=10, description="Recent average home goals")
    away_goals: int = Field(1, ge=0, le=10, description="Recent average away goals")
    home_form_points: float = Field(10.0, ge=0.0, le=15.0, description="Home form points over last 5 matches")
    away_form_points: float = Field(6.0, ge=0.0, le=15.0, description="Away form points over last 5 matches")


class MatchPredictResponse(BaseModel):
    home_team: str
    away_team: str
    predicted_outcome: str
    outcome_code: str
    confidence: float
    probabilities: Dict[str, float]
    tactical_diffs: Dict[str, float]


# --- Player Scouting System ---
class ScoutTwinRequest(BaseModel):
    player_name: Optional[str] = Field(None, description="Exact or partial player name match")
    goals: Optional[int] = Field(None, ge=0, le=50)
    assists: Optional[int] = Field(None, ge=0, le=30)
    pass_completion: Optional[float] = Field(None, ge=40.0, le=100.0)
    shots: Optional[int] = Field(None, ge=0, le=150)
    dribbles: Optional[int] = Field(None, ge=0, le=150)
    tackles_interceptions: Optional[int] = Field(None, ge=0, le=200)


class PlayerTwin(BaseModel):
    name: str
    club: str
    position: str
    age: int
    similarity_pct: float
    valuation_eur_m: float
    cluster_archetype: str
    pca_x: float
    pca_y: float


class ClusterMapPoint(BaseModel):
    name: str
    club: str
    position: str
    cluster_id: int
    cluster_archetype: str
    pca_x: float
    pca_y: float
    market_value: float


class ScoutTwinResponse(BaseModel):
    target_player: str
    club: str
    position: str
    cluster_id: int
    cluster_archetype: str
    pca_coords: Dict[str, float]
    top_twins: List[PlayerTwin]
    all_cluster_points: List[ClusterMapPoint]
