"""Unit & Integration Tests for Premier League FastAPI Microservice (tests/test_api.py)."""

import pytest
from fastapi.testclient import TestClient
from backend.main import app
from data_ingestion.fetch_referee_data import calculate_referee_strictness, get_enriched_referee_df


@pytest.fixture
def client():
    """Provides a TestClient context with lifespan initialization."""
    with TestClient(app) as test_client:
        yield test_client


def test_health_check(client: TestClient):
    """Verifies that the /api/v1/health endpoint confirms all models are loaded."""
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["models_loaded"]["transfer_model"] is True
    assert data["models_loaded"]["match_model"] is True
    assert data["models_loaded"]["scouting_model"] is True


def test_get_players(client: TestClient):
    """Verifies that /api/v1/players returns player records."""
    response = client.get("/api/v1/players")
    assert response.status_code == 200
    players = response.json()
    assert isinstance(players, list)
    assert len(players) >= 30


def test_get_clubs(client: TestClient):
    """Verifies that /api/v1/clubs returns Premier League clubs."""
    response = client.get("/api/v1/clubs")
    assert response.status_code == 200
    clubs = response.json()
    assert "Arsenal" in clubs
    assert "Manchester City" in clubs


def test_predict_transfer_value(client: TestClient):
    """Tests transfer value prediction endpoint."""
    payload = {
        "age": 24,
        "goals": 22,
        "assists": 9,
        "minutes_played": 2800,
        "position": "FW",
    }
    response = client.post("/api/v1/predict/transfer-value", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["valuation_eur_m"] > 20.0
    assert data["position"] == "FW"
    assert len(data["historical_trend"]) > 0


def test_predict_match_outcome(client: TestClient):
    """Tests match outcome prediction endpoint with XGBoost & referee impact."""
    payload = {
        "home_team": "Manchester City",
        "away_team": "Everton",
        "home_possession": 68.0,
        "home_shots": 20,
        "away_shots": 5,
        "home_goals": 3,
        "away_goals": 0,
        "home_form_points": 13.0,
        "away_form_points": 4.0,
        "referee_name": "Anthony Taylor",
        "referee_yellows_per_game": 4.62,
        "referee_strictness_index": 6.50,
    }
    response = client.post("/api/v1/predict/match-outcome", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["predicted_outcome"] == "Home Win"
    assert "probabilities" in data
    assert "Home Win" in data["probabilities"]
    assert "referee_impact" in data
    assert data["referee_impact"]["strictness_index"] == 6.50


def test_scout_twin_by_name(client: TestClient):
    """Tests player scouting and twin lookup endpoint."""
    payload = {"player_name": "Saka"}
    response = client.post("/api/v1/predict/scout-twin", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Bukayo Saka" in data["target_player"]
    assert len(data["top_twins"]) == 5
    assert len(data["all_cluster_points"]) > 0


# =====================================================================
# Tests for New Feature Suites
# =====================================================================

def test_get_fixtures(client: TestClient):
    """Verifies that /api/v1/fixtures returns scheduled/live fixtures with referee and lineups."""
    response = client.get("/api/v1/fixtures")
    assert response.status_code == 200
    data = response.json()
    assert "fixtures" in data
    assert data["total_fixtures"] >= 5
    first_fix = data["fixtures"][0]
    assert "kickoff_time" in first_fix
    assert "home_team" in first_fix
    assert "away_team" in first_fix
    assert "referee" in first_fix
    assert "yellow_cards_per_game" in first_fix["referee"]
    assert "referee_strictness_index" in first_fix["referee"]
    assert first_fix["home_win_prob"] > 0


def test_filtered_player_stats(client: TestClient):
    """Verifies that /api/v1/players/stats/filtered correctly filters by sample size and minutes."""
    response = client.get("/api/v1/players/stats/filtered?sample_size=last_5&min_minutes=45&started_only=true")
    assert response.status_code == 200
    data = response.json()
    assert "filters_applied" in data
    assert data["filters_applied"]["sample_size"] == "last_5"
    assert len(data["players"]) > 0
    first_p = data["players"][0]
    assert "goals_per_90" in first_p
    assert "shots_per_90" in first_p
    assert "fouls_per_90" in first_p


def test_opposition_against_stats(client: TestClient):
    """Verifies that /api/v1/opposition-against returns positional conceded tactical vectors."""
    # Test all clubs
    response = client.get("/api/v1/opposition-against")
    assert response.status_code == 200
    data = response.json()
    assert "Arsenal" in data

    # Test single club
    club_res = client.get("/api/v1/opposition-against?club=Arsenal")
    assert club_res.status_code == 200
    club_data = club_res.json()
    assert "positions" in club_data
    assert "formations" in club_data
    assert "ST" in club_data["positions"]
    assert "shots_conceded_per_game" in club_data["positions"]["ST"]


def test_h2h_snapshot(client: TestClient):
    """Verifies that /api/v1/h2h/{home}/{away} returns 10-match comparison and top player props."""
    response = client.get("/api/v1/h2h/Arsenal/Chelsea")
    assert response.status_code == 200
    data = response.json()
    assert data["home_team"] == "Arsenal"
    assert data["away_team"] == "Chelsea"
    assert data["total_matches_analyzed"] == 10
    assert data["home_win_rate"] >= 0
    assert len(data["top_player_props"]) == 5
    assert "hit_rate" in data["top_player_props"][0]


def test_leaderboards(client: TestClient):
    """Verifies that /api/v1/leaderboards returns ranked players across categories."""
    for category in ["goals", "assists", "expected_goals", "tackles", "fouls_committed"]:
        response = client.get(f"/api/v1/leaderboards?category={category}&limit=10")
        assert response.status_code == 200
        data = response.json()
        assert len(data["leaders"]) == 10
        assert data["leaders"][0]["rank"] == 1
        # Descending order check
        assert data["leaders"][0]["stat_value"] >= data["leaders"][1]["stat_value"]


def test_telegram_alert_and_inplay_subscribe(client: TestClient):
    """Verifies Telegram alert testing and in-play subscription dispatch."""
    # Test Telegram dispatch
    test_res = client.post("/api/v1/alerts/telegram/test", json={"chat_id": "123456789"})
    assert test_res.status_code == 200
    test_data = test_res.json()
    assert test_data["status"] in ["simulated_success", "success"]

    # Subscribe to foul alerts
    sub_res = client.post("/api/v1/inplay/fouls/subscribe", json={
        "chat_id": "987654321",
        "foul_threshold": 3,
        "player_name": "Kai Havertz"
    })
    assert sub_res.status_code == 200
    sub_data = sub_res.json()
    assert sub_data["status"] == "subscribed"
    assert sub_data["foul_threshold"] == 3

    # Trigger live foul event
    trig_res = client.post("/api/v1/inplay/fouls/trigger?player_name=Kai%20Havertz&club=Arsenal&fouls=3&minute=64")
    assert trig_res.status_code == 200
    trig_data = trig_res.json()
    assert trig_data["status"] == "evaluated"
    assert trig_data["alerts_dispatched"] >= 1


def test_referee_strictness_calculation():
    """Unit test for referee strictness formula bounds."""
    # Mild referee
    mild = calculate_referee_strictness(3.2, 0.05, 18.0)
    assert 1.0 <= mild <= 5.0

    # Strict referee
    strict = calculate_referee_strictness(5.2, 0.25, 25.0)
    assert 6.0 <= strict <= 10.0

    # DataFrame check
    df = get_enriched_referee_df()
    assert len(df) >= 15
    assert "referee_strictness_index" in df.columns


def test_global_leagues(client: TestClient):
    """Verifies /api/v1/global/leagues returns multi-league catalog."""
    res = client.get("/api/v1/global/leagues")
    assert res.status_code == 200
    data = res.json()
    assert "leagues" in data
    slugs = [l["slug"] for l in data["leagues"]]
    assert "premier-league" in slugs
    assert "championship" in slugs
    assert "la-liga" in slugs


def test_global_fixtures(client: TestClient):
    """Verifies /api/v1/global/fixtures returns competitions accordion with referee ratings."""
    res = client.get("/api/v1/global/fixtures?date=2026-11-06")
    assert res.status_code == 200
    data = res.json()
    assert data["total_matches"] >= 5
    assert len(data["competitions"]) >= 3
    # Check referee data presence
    first_match = data["competitions"][0]["matches"][0]
    assert "referee_name" in first_match
    assert "referee_yellows" in first_match


def test_global_league_standings(client: TestClient):
    """Verifies /api/v1/global/league/{slug}/standings returns 3-column layout data."""
    res = client.get("/api/v1/global/league/championship/standings")
    assert res.status_code == 200
    data = res.json()
    assert "standings" in data
    assert "fixtures" in data
    assert "stat_categories" in data
    assert len(data["standings"]) >= 10
    assert len(data["stat_categories"]) >= 10


def test_global_team_stats(client: TestClient):
    """Verifies /api/v1/global/team/{slug}/stats returns timeline logs and against metrics."""
    res = client.get("/api/v1/global/team/derby-county/stats?venue=all&history=last_30")
    assert res.status_code == 200
    data = res.json()
    assert data["team"]["name"] == "Derby County"
    assert "match_history" in data
    assert "team_stats" in data
    assert "against_stats" in data
    assert len(data["match_history"]) >= 10


def test_global_player_stats(client: TestClient):
    """Verifies /api/v1/global/player/{id}/stats returns 10-axis radar and match logs."""
    res = client.get("/api/v1/global/player/lamine-yamal/stats?history=last_75")
    assert res.status_code == 200
    data = res.json()
    assert data["player"]["name"] == "Lamine Yamal"
    assert "radar" in data
    assert "Goals" in data["radar"]
    assert "Dribbles" in data["radar"]
    assert len(data["match_history"]) >= 5


def test_global_search(client: TestClient):
    """Verifies /api/v1/global/search autocomplete returns both players and teams."""
    res = client.get("/api/v1/global/search?q=lamine")
    assert res.status_code == 200
    data = res.json()
    assert len(data["players"]) >= 1
    assert any("Lamine Yamal" in p["name"] for p in data["players"])

    res_team = client.get("/api/v1/global/search?q=derby")
    assert res_team.status_code == 200
    data_team = res_team.json()
    assert len(data_team["teams"]) >= 1


def test_live_news_feed(client: TestClient):
    """Verifies /api/v1/news/live returns aggregated live football headlines."""
    res = client.get("/api/v1/news/live")
    assert res.status_code == 200
    data = res.json()
    assert isinstance(data, list)
    assert len(data) >= 5
    first = data[0]
    assert "headline" in first
    assert "category" in first
    assert "club" in first
    assert "source" in first
    assert "timestamp" in first

    # Also test global news alias
    res_global = client.get("/api/v1/global/news")
    assert res_global.status_code == 200
    assert len(res_global.json()) >= 5


