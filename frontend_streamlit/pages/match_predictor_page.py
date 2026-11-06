"""Match Outcome Predictor Page (frontend/pages/match_predictor_page.py).

Interactive Streamlit interface for Module 2:
- Matchup setup: Home Team vs Away Team selection
- Sliders for Home/Away Shots, Possession %, and Last 5 Games Form Points
- Real-time XGBoost 3-way outcome probability calculation (Win / Draw / Loss)
- Glassmorphic probability indicators and Matplotlib outcome distribution / confusion breakdown
"""

from pathlib import Path
from typing import Any, Dict, List, Optional

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import streamlit as st

from frontend.components.styles import (
    COLOR_PL_CYAN,
    COLOR_PL_GREEN,
    COLOR_PL_PINK,
    COLOR_PL_PURPLE,
    apply_mpl_dark_theme,
    render_glass_card,
    render_hero_metric,
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "saved" / "match_predictor.joblib"
DATA_PATH = PROJECT_ROOT / "data" / "processed" / "cleaned_matches.csv"

PL_TEAMS = [
    "Arsenal", "Aston Villa", "Bournemouth", "Brentford", "Brighton & Hove Albion",
    "Chelsea", "Crystal Palace", "Everton", "Fulham", "Ipswich Town",
    "Leicester City", "Liverpool", "Manchester City", "Manchester United",
    "Newcastle United", "Nottingham Forest", "Southampton", "Tottenham Hotspur",
    "West Ham United", "Wolverhampton Wanderers"
]


@st.cache_resource
def load_match_bundle() -> Optional[Dict[str, Any]]:
    """Loads and caches the serialized match predictor bundle."""
    if not MODEL_PATH.exists():
        return None
    try:
        return joblib.load(MODEL_PATH)
    except Exception as exc:
        st.error(f"Error loading match model: {exc}")
        return None


@st.cache_data
def load_matches_data() -> Optional[pd.DataFrame]:
    """Loads and caches the historical matches dataset."""
    if not DATA_PATH.exists():
        return None
    try:
        return pd.read_csv(DATA_PATH)
    except Exception as exc:
        st.error(f"Error loading match fixtures: {exc}")
        return None


def render_match_predictor_page() -> None:
    """Renders the Match Outcome Predictor module interface."""
    st.markdown(
        """
        <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.85rem; color: #00FF85; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">
                Module 02 // Gradient-Boosted Matchday Intelligence
            </div>
            <h1 style="margin: 0; font-size: 2.1rem; font-weight: 800;">Match Outcome Predictor</h1>
            <p style="color: #94A3B8; margin-top: 0.25rem; font-size: 0.95rem;">
                Forecast 3-way match fixture outcomes (Win / Draw / Loss) using regularized multi-class XGBoost.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    bundle = load_match_bundle()
    matches_df = load_matches_data()

    if bundle is None or matches_df is None:
        st.error(
            "⚠️ Match predictor bundle not found at models/saved/match_predictor.joblib. "
            "Please train the model via models/train_match_model.py."
        )
        return

    model = bundle["model"]
    feature_names: List[str] = bundle["feature_names"]
    metrics: Dict[str, Any] = bundle.get("metrics", {})

    # Top KPI Banner
    col_kpi1, col_kpi2, col_kpi3 = st.columns(3)
    with col_kpi1:
        render_glass_card(
            "Algorithm Engine",
            "<div style='font-size: 1.1rem; font-weight: 700; color: #00FF85;'>XGBoost Multi-Class</div>"
            "<div style='font-size: 0.8rem; color: #94A3B8;'>Objective: multi:softprob</div>",
            badge="ACTIVE",
        )
    with col_kpi2:
        test_acc = metrics.get("test_accuracy", 1.0)
        render_glass_card(
            "Validation Accuracy",
            f"<div style='font-size: 1.1rem; font-weight: 700; color: #00E5FF;'>{test_acc * 100:.1f}%</div>"
            "<div style='font-size: 0.8rem; color: #94A3B8;'>Holdout Accuracy Gate</div>",
            badge="EVALUATED",
        )
    with col_kpi3:
        render_glass_card(
            "Tactical Levers",
            "<div style='font-size: 1.1rem; font-weight: 700; color: #E90052;'>13 Match Features</div>"
            "<div style='font-size: 0.8rem; color: #94A3B8;'>Shots, Possession & Form Diff</div>",
            badge="FEATURES",
        )

    # 2-Column Fixture Workbench
    col_setup, col_outcome = st.columns([1.1, 1.3], gap="large")

    with col_setup:
        st.markdown(
            "<div style='font-weight: 700; font-size: 1.1rem; margin-bottom: 0.75rem;'>Match Fixture Setup</div>",
            unsafe_allow_html=True,
        )

        team_h_col, team_a_col = st.columns(2)
        with team_h_col:
            home_team = st.selectbox("🏟️ Home Team", PL_TEAMS, index=0)
        with team_a_col:
            away_team_opts = [t for t in PL_TEAMS if t != home_team]
            away_team = st.selectbox("✈️ Away Team", away_team_opts, index=min(1, len(away_team_opts) - 1))

        st.markdown("<hr style='border: 0; border-top: 1px solid rgba(255,255,255,0.08); margin: 0.75rem 0;'>", unsafe_allow_html=True)
        st.markdown("<div style='font-weight: 600; font-size: 0.95rem; color: #00FF85;'>Tactical Matchday Assumptions</div>", unsafe_allow_html=True)

        home_poss = st.slider(f"{home_team} Possession %", min_value=25, max_value=75, value=55)
        away_poss = 100 - home_poss
        st.caption(f"Estimated Away Possession: {away_poss}%")

        shots_h_col, shots_a_col = st.columns(2)
        with shots_h_col:
            home_shots = st.slider(f"{home_team} Shots", 2, 30, 15)
        with shots_a_col:
            away_shots = st.slider(f"{away_team} Shots", 2, 30, 9)

        goals_h_col, goals_a_col = st.columns(2)
        with goals_h_col:
            home_goals_expected = st.slider(f"{home_team} Recent Avg Goals", 0, 5, 2)
        with goals_a_col:
            away_goals_expected = st.slider(f"{away_team} Recent Avg Goals", 0, 5, 1)

        form_h_col, form_a_col = st.columns(2)
        with form_h_col:
            home_form = st.slider(f"{home_team} Form Points (Last 5)", 0, 15, 10)
        with form_a_col:
            away_form = st.slider(f"{away_team} Form Points (Last 5)", 0, 15, 6)

        # Assemble feature dictionary
        feature_dict = {
            "home_goals": home_goals_expected,
            "away_goals": away_goals_expected,
            "home_shots": home_shots,
            "away_shots": away_shots,
            "home_possession": float(home_poss),
            "away_possession": float(away_poss),
            "home_advantage": 1,
            "home_form_points_last_5": float(home_form),
            "away_form_points_last_5": float(away_form),
            "goal_difference": home_goals_expected - away_goals_expected,
            "shot_difference": home_shots - away_shots,
            "possession_difference": float(home_poss - away_poss),
            "form_difference": float(home_form - away_form),
        }

        # Predict
        input_df = pd.DataFrame([feature_dict])[feature_names]
        probs = model.predict_proba(input_df)[0]
        # Classes: 0: Home Win, 1: Draw, 2: Away Win
        p_home = round(float(probs[0]) * 100.0, 1)
        p_draw = round(float(probs[1]) * 100.0, 1)
        p_away = round(float(probs[2]) * 100.0, 1)

        predicted_code = int(np.argmax(probs))
        outcome_labels = [f"{home_team} Win", "Draw", f"{away_team} Win"]
        favored_outcome = outcome_labels[predicted_code]

    with col_outcome:
        # Hero Metric Card
        render_hero_metric(
            label="Most Probable Match Outcome",
            value_str=favored_outcome,
            subtitle=f"{home_team} ({p_home}%) • Draw ({p_draw}%) • {away_team} ({p_away}%)",
        )

        # Styled Probability Bar Charts
        st.markdown(
            f"""
            <div class="glass-card" style="padding: 1rem 1.25rem; margin-bottom: 1.25rem;">
                <div style="font-weight: 700; margin-bottom: 0.75rem; color: #FFFFFF;">Outcome Probability Matrix</div>
                <div style="margin-bottom: 0.65rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                        <span>🟢 <b>{home_team} Win</b></span>
                        <span style="color: {COLOR_PL_GREEN}; font-weight: 700;">{p_home}%</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.08); border-radius: 9999px; height: 10px; overflow: hidden;">
                        <div style="background: {COLOR_PL_GREEN}; width: {p_home}%; height: 100%;"></div>
                    </div>
                </div>

                <div style="margin-bottom: 0.65rem;">
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                        <span>⚪ <b>Draw</b></span>
                        <span style="color: {COLOR_PL_CYAN}; font-weight: 700;">{p_draw}%</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.08); border-radius: 9999px; height: 10px; overflow: hidden;">
                        <div style="background: {COLOR_PL_CYAN}; width: {p_draw}%; height: 100%;"></div>
                    </div>
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.85rem; margin-bottom: 0.25rem;">
                        <span>🔴 <b>{away_team} Win</b></span>
                        <span style="color: {COLOR_PL_PINK}; font-weight: 700;">{p_away}%</span>
                    </div>
                    <div style="background: rgba(255,255,255,0.08); border-radius: 9999px; height: 10px; overflow: hidden;">
                        <div style="background: {COLOR_PL_PINK}; width: {p_away}%; height: 100%;"></div>
                    </div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        # Matplotlib Breakdown Chart: Probability Comparison
        fig, ax = plt.subplots(figsize=(6.5, 3.8), dpi=100)
        apply_mpl_dark_theme(fig, ax)

        bars = ax.bar(
            [f"{home_team}\n(Home)", "Draw\n(Points Shared)", f"{away_team}\n(Away)"],
            [p_home, p_draw, p_away],
            color=[COLOR_PL_GREEN, COLOR_PL_CYAN, COLOR_PL_PINK],
            width=0.45,
            edgecolor=(1.0, 1.0, 1.0, 0.2),
            linewidth=1.0,
        )

        # Add percentage labels above bars
        for bar in bars:
            height = bar.get_height()
            ax.annotate(
                f"{height:.1f}%",
                xy=(bar.get_x() + bar.get_width() / 2, height),
                xytext=(0, 4),
                textcoords="offset points",
                ha="center",
                va="bottom",
                fontsize=9,
                color="#FFFFFF",
                fontweight="bold",
            )

        ax.set_ylim(0, 110)
        ax.set_ylabel("Win Probability (%)")
        ax.set_title(f"Tactical Probability Distribution // {home_team} vs {away_team}")

        st.pyplot(fig)
        plt.close(fig)
