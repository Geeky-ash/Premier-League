"""Unit & Integration Tests for Premier League FastAPI Microservice (tests/test_api.py)."""

import pytest
from fastapi.testclient import TestClient
from backend.main import app


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
    """Tests match outcome prediction endpoint with XGBoost."""
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
    }
    response = client.post("/api/v1/predict/match-outcome", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["predicted_outcome"] == "Home Win"
    assert "probabilities" in data
    assert "Home Win" in data["probabilities"]


def test_scout_twin_by_name(client: TestClient):
    """Tests player scouting and twin lookup endpoint."""
    payload = {"player_name": "Saka"}
    response = client.post("/api/v1/predict/scout-twin", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "Bukayo Saka" in data["target_player"]
    assert len(data["top_twins"]) == 5
    assert len(data["all_cluster_points"]) > 0
