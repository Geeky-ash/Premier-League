/**
 * Typed API client for FastAPI Premier League ML Microservice.
 */

const rawBase = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
const API_BASE = rawBase.endsWith("/api/v1") ? rawBase : `${rawBase.replace(/\/+$/, "")}/api/v1`;

export interface HealthStatus {
  status: string;
  version: string;
  models_loaded: {
    transfer_model: boolean;
    match_model: boolean;
    scouting_model: boolean;
    players_data: boolean;
    matches_data: boolean;
  };
  timestamp: string;
}

export interface PlayerRecord {
  player_id: number;
  name: string;
  club: string;
  age: number;
  position: string;
  minutes_played: number;
  goals: number;
  assists: number;
  shots: number;
  pass_completion: number;
  dribbles: number;
  tackles_interceptions: number;
  market_value_eur_m: number;
  cluster_id?: number;
  cluster_archetype?: string;
  pca_x?: number;
  pca_y?: number;
}

export interface TransferPredictRequest {
  age: number;
  goals: number;
  assists: number;
  minutes_played: number;
  position: string;
}

export interface HistoricalTrendPoint {
  name: string;
  actual_value: number;
  fitted_value: number;
  goals: number;
  assists: number;
  position: string;
}

export interface TransferPredictResponse {
  valuation_eur_m: number;
  age: number;
  goals: number;
  assists: number;
  minutes_played: number;
  position: string;
  r2_score: number;
  mae_score: number;
  historical_trend: HistoricalTrendPoint[];
}

export interface MatchPredictRequest {
  home_team: string;
  away_team: string;
  home_possession: number;
  home_shots: number;
  away_shots: number;
  home_goals: number;
  away_goals: number;
  home_form_points: number;
  away_form_points: number;
}

export interface MatchPredictResponse {
  home_team: string;
  away_team: string;
  predicted_outcome: string;
  outcome_code: string;
  confidence: number;
  probabilities: {
    "Home Win": number;
    Draw: number;
    "Away Win": number;
  };
  tactical_diffs: {
    goal_diff: number;
    shot_diff: number;
    possession_diff: number;
    form_diff: number;
  };
}

export interface PlayerTwin {
  name: string;
  club: string;
  position: string;
  age: number;
  similarity_pct: number;
  valuation_eur_m: number;
  cluster_archetype: string;
  pca_x: number;
  pca_y: number;
}

export interface ClusterMapPoint {
  name: string;
  club: string;
  position: string;
  cluster_id: number;
  cluster_archetype: string;
  pca_x: number;
  pca_y: number;
  market_value: number;
}

export interface ScoutTwinResponse {
  target_player: string;
  club: string;
  position: string;
  cluster_id: number;
  cluster_archetype: string;
  pca_coords: { x: number; y: number };
  top_twins: PlayerTwin[];
  all_cluster_points: ClusterMapPoint[];
}

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${API_BASE}/health`, { cache: "no-store" });
  if (!res.ok) throw new Error("FastAPI healthcheck failed");
  return res.json();
}

export async function fetchPlayers(): Promise<PlayerRecord[]> {
  const res = await fetch(`${API_BASE}/players`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch players");
  return res.json();
}

export async function fetchClubs(): Promise<string[]> {
  const res = await fetch(`${API_BASE}/clubs`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch clubs");
  return res.json();
}

export async function predictTransferValue(
  payload: TransferPredictRequest
): Promise<TransferPredictResponse> {
  const res = await fetch(`${API_BASE}/predict/transfer-value`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Transfer prediction failed");
  return res.json();
}

export async function predictMatchOutcome(
  payload: MatchPredictRequest
): Promise<MatchPredictResponse> {
  const res = await fetch(`${API_BASE}/predict/match-outcome`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Match prediction failed");
  return res.json();
}

export async function scoutPlayerTwin(
  playerName: string
): Promise<ScoutTwinResponse> {
  const res = await fetch(`${API_BASE}/predict/scout-twin`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ player_name: playerName }),
  });
  if (!res.ok) throw new Error("Player scouting query failed");
  return res.json();
}
