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
    referee_name: Optional[str] = Field("Anthony Taylor", description="Assigned match referee")
    referee_yellows_per_game: Optional[float] = Field(4.62, description="Referee historical yellow cards per game")
    referee_strictness_index: Optional[float] = Field(6.50, description="Calculated referee strictness index (1.0 - 10.0)")


class MatchPredictResponse(BaseModel):
    home_team: str
    away_team: str
    predicted_outcome: str
    outcome_code: str
    confidence: float
    probabilities: Dict[str, float]
    tactical_diffs: Dict[str, float]
    referee_impact: Optional[Dict[str, Any]] = None


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


# --- Fixtures Hub Schemas ---
class FixtureItem(BaseModel):
    fixture_id: str
    date: str
    kickoff_time: str
    status: str  # SCHEDULED, LIVE, FT
    minute: Optional[int] = None
    home_team: str
    away_team: str
    home_score: Optional[int] = None
    away_score: Optional[int] = None
    lineups_status: str  # LINEUPS_CONFIRMED, EXPECTED_LINEUPS
    referee: Dict[str, Any]
    venue: str
    home_win_prob: float
    draw_prob: float
    away_win_prob: float


class FixturesResponse(BaseModel):
    date: str
    total_fixtures: int
    fixtures: List[FixtureItem]


# --- Opposition / Against Analytics ---
class PositionalConcededStat(BaseModel):
    shots_conceded_per_game: float
    tackles_conceded_per_game: float
    key_passes_conceded_per_game: float
    vulnerability_score: float


class OppositionConcededTeam(BaseModel):
    club: str
    positions: Dict[str, PositionalConcededStat]
    formations: Dict[str, Any]
    overall_defensive_rating: float


# --- H2H Snapshot Schemas ---
class H2HPlayerProp(BaseModel):
    player_name: str
    club: str
    prop_type: str  # e.g., "2+ Shots on Target", "3+ Tackles", "1+ Foul Committed"
    hit_rate: str  # e.g. "8/10 matches"
    hit_percentage: float
    avg_per_game: float


class H2HResponse(BaseModel):
    home_team: str
    away_team: str
    total_matches_analyzed: int
    home_wins: int
    draws: int
    away_wins: int
    home_win_rate: float
    draw_rate: float
    away_win_rate: float
    avg_goals_home: float
    avg_goals_away: float
    avg_total_corners: float
    avg_total_cards: float
    btts_rate: float
    top_player_props: List[H2HPlayerProp]


# --- Season Leaderboards Schemas ---
class LeaderboardPlayer(BaseModel):
    rank: int
    player_id: int
    name: str
    club: str
    position: str
    age: int
    stat_name: str
    stat_value: float
    per_90_value: float
    appearances: int
    minutes_played: int


class LeaderboardsResponse(BaseModel):
    stat_category: str
    leaders: List[LeaderboardPlayer]


# --- Alert System Schemas ---
class TelegramAlertTestRequest(BaseModel):
    chat_id: str = Field(..., description="Target Telegram chat ID")
    message: Optional[str] = Field(None, description="Optional custom test message")


class TelegramAlertResponse(BaseModel):
    alert_id: str
    status: str
    chat_id: str
    message: str
    timestamp: str


class InPlayFoulSubscribeRequest(BaseModel):
    chat_id: str = Field(..., description="Telegram chat ID for alert delivery")
    foul_threshold: int = Field(2, ge=1, le=10, description="Notify when player hits or exceeds this foul count")
    player_name: Optional[str] = Field("ANY_PLAYER", description="Specific player name or ANY_PLAYER")
    email: Optional[str] = Field(None, description="Optional email for secondary notification dispatch")


class InPlayFoulSubscribeResponse(BaseModel):
    subscription_id: str
    chat_id: str
    foul_threshold: int
    player_name: str
    status: str = "subscribed"
    created_at: str
