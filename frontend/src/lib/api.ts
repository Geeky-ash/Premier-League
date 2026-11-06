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
  expected_goals?: number;
  shots_on_target?: number;
  fouls_committed?: number;
  yellow_cards?: number;
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
  referee_name?: string;
  referee_yellows_per_game?: number;
  referee_strictness_index?: number;
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
  referee_impact?: {
    referee_name: string;
    yellows_per_game: number;
    strictness_index: number;
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

/* ── Fixtures Hub Types ── */
export interface RefereeInfo {
  referee_name: string;
  matches_officiated: number;
  yellow_cards_per_game: number;
  red_cards_per_game: number;
  fouls_per_game: number;
  penalties_awarded_per_game?: number;
  referee_strictness_index: number;
}

export interface FixtureItem {
  fixture_id: string;
  date: string;
  kickoff_time: string;
  status: "SCHEDULED" | "LIVE" | "FT";
  minute?: number;
  home_team: string;
  away_team: string;
  home_score?: number;
  away_score?: number;
  lineups_status: "LINEUPS_CONFIRMED" | "EXPECTED_LINEUPS";
  referee: RefereeInfo;
  venue: string;
  home_win_prob: number;
  draw_prob: number;
  away_win_prob: number;
}

export interface FixturesResponse {
  date: string;
  total_fixtures: number;
  fixtures: FixtureItem[];
}

/* ── Filtered Player Stats ── */
export interface FilteredPlayerRecord {
  player_id: number;
  name: string;
  club: string;
  position: string;
  age: number;
  market_value_eur_m: number;
  sample_size: string;
  matches_filtered: number;
  minutes_played: number;
  goals: number;
  assists: number;
  shots: number;
  shots_on_target: number;
  tackles: number;
  fouls_committed: number;
  goals_per_90: number;
  assists_per_90: number;
  shots_per_90: number;
  sot_per_90: number;
  tackles_per_90: number;
  fouls_per_90: number;
  logs_preview: any[];
}

export interface FilteredPlayersResponse {
  filters_applied: Record<string, any>;
  total_players_matched: number;
  players: FilteredPlayerRecord[];
}

/* ── Opposition / Against Stats ── */
export interface PositionalConcededStat {
  shots_conceded_per_game: number;
  tackles_conceded_per_game: number;
  key_passes_conceded_per_game: number;
  vulnerability_score: number;
}

export interface OppositionConcededTeam {
  club: string;
  positions: Record<string, PositionalConcededStat>;
  formations: Record<string, { expected_shots_against: number; weak_zone: string; counter_vulnerability: string }>;
  overall_defensive_rating: number;
}

/* ── H2H Snapshot ── */
export interface H2HPlayerProp {
  player_name: string;
  club: string;
  prop_type: string;
  hit_rate: string;
  hit_percentage: number;
  avg_per_game: number;
}

export interface H2HResponse {
  home_team: string;
  away_team: string;
  total_matches_analyzed: number;
  home_wins: number;
  draws: number;
  away_wins: number;
  home_win_rate: number;
  draw_rate: number;
  away_win_rate: number;
  avg_goals_home: number;
  avg_goals_away: number;
  avg_total_corners: number;
  avg_total_cards: number;
  btts_rate: number;
  top_player_props: H2HPlayerProp[];
}

/* ── Leaderboards ── */
export interface LeaderboardPlayer {
  rank: number;
  player_id: number;
  name: string;
  club: string;
  position: string;
  age: number;
  stat_name: string;
  stat_value: number;
  per_90_value: number;
  appearances: number;
  minutes_played: number;
}

export interface LeaderboardsResponse {
  stat_category: string;
  leaders: LeaderboardPlayer[];
}

/* ── Core API Client Methods ── */
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

/* ── New Feature Suite Client Functions ── */
export async function fetchFixtures(date?: string): Promise<FixturesResponse> {
  const url = date ? `${API_BASE}/fixtures?date=${encodeURIComponent(date)}` : `${API_BASE}/fixtures`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch fixtures");
  return res.json();
}

export async function fetchFilteredPlayerStats(params: {
  sample_size?: string;
  min_minutes?: number;
  started_only?: boolean;
  venue?: string;
  competition?: string;
  club?: string;
  position?: string;
}): Promise<FilteredPlayersResponse> {
  const query = new URLSearchParams();
  if (params.sample_size) query.set("sample_size", params.sample_size);
  if (params.min_minutes !== undefined) query.set("min_minutes", params.min_minutes.toString());
  if (params.started_only !== undefined) query.set("started_only", params.started_only.toString());
  if (params.venue) query.set("venue", params.venue);
  if (params.competition) query.set("competition", params.competition);
  if (params.club) query.set("club", params.club);
  if (params.position) query.set("position", params.position);

  const res = await fetch(`${API_BASE}/players/stats/filtered?${query.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch filtered player stats");
  return res.json();
}

export async function fetchOppositionAgainst(club?: string): Promise<Record<string, OppositionConcededTeam> | OppositionConcededTeam> {
  const url = club ? `${API_BASE}/opposition-against?club=${encodeURIComponent(club)}` : `${API_BASE}/opposition-against`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch opposition conceded stats");
  return res.json();
}

export async function fetchH2H(homeTeam: string, awayTeam: string): Promise<H2HResponse> {
  const res = await fetch(`${API_BASE}/h2h/${encodeURIComponent(homeTeam)}/${encodeURIComponent(awayTeam)}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch H2H snapshot");
  return res.json();
}

export async function fetchLeaderboards(category: string = "goals", limit: number = 15): Promise<LeaderboardsResponse> {
  const res = await fetch(`${API_BASE}/leaderboards?category=${encodeURIComponent(category)}&limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch leaderboards");
  return res.json();
}

export async function fetchInPlayMatches(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/inplay/matches`, { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch in-play matches");
  return res.json();
}

export async function testTelegramAlert(chatId: string, message?: string): Promise<any> {
  const res = await fetch(`${API_BASE}/alerts/telegram/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, message }),
  });
  if (!res.ok) throw new Error("Failed to send test alert");
  return res.json();
}

export async function subscribeInPlayFouls(payload: {
  chat_id: string;
  foul_threshold: number;
  player_name?: string;
  email?: string;
}): Promise<any> {
  const res = await fetch(`${API_BASE}/inplay/fouls/subscribe`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Failed to register foul subscription");
  return res.json();
}

export async function triggerInPlayFoul(params: {
  player_name: string;
  club?: string;
  fouls?: number;
  minute?: number;
  match_str?: string;
}): Promise<any> {
  const query = new URLSearchParams({
    player_name: params.player_name,
    club: params.club || "Arsenal",
    fouls: (params.fouls || 3).toString(),
    minute: (params.minute || 65).toString(),
    match_str: params.match_str || "Arsenal vs Chelsea",
  });
  const res = await fetch(`${API_BASE}/inplay/fouls/trigger?${query.toString()}`, { method: "POST" });
  if (!res.ok) throw new Error("Failed to trigger foul event");
  return res.json();
}
