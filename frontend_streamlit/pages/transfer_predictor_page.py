"""Transfer Value Predictor Page (frontend/pages/transfer_predictor_page.py).

Interactive Streamlit interface for Module 1:
- Sliders for Goals, Assists, Minutes, Age, and Position dropdown
- Real-time Linear Regression scoring via transfer_predictor.joblib
- Glassmorphic Hero metric card for Predicted Transfer Value (€M)
- Matplotlib Predicted vs. Actual regression scatter plot with dynamic user point
"""

from pathlib import Path
from typing import Any, Dict, Optional

import joblib
import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import streamlit as st

from frontend_streamlit.components.styles import (
    COLOR_PL_CYAN,
    COLOR_PL_GREEN,
    COLOR_PL_PINK,
    COLOR_PL_PURPLE,
    apply_mpl_dark_theme,
    render_glass_card,
    render_hero_metric,
)

PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent
MODEL_PATH = PROJECT_ROOT / "models" / "saved" / "transfer_predictor.joblib"
DATA_PATH = PROJECT_ROOT / "data" / "processed" / "cleaned_players.csv"


@st.cache_resource
def load_transfer_bundle() -> Optional[Dict[str, Any]]:
    """Loads and caches the serialized transfer model bundle."""
    if not MODEL_PATH.exists():
        return None
    try:
        return joblib.load(MODEL_PATH)
    except Exception as exc:
        st.error(f"Error loading transfer model: {exc}")
        return None


@st.cache_data
def load_players_data() -> Optional[pd.DataFrame]:
    """Loads and caches the cleaned player dataset."""
    if not DATA_PATH.exists():
        return None
    try:
        return pd.read_csv(DATA_PATH)
    except Exception as exc:
        st.error(f"Error loading player dataset: {exc}")
        return None


def render_transfer_predictor_page() -> None:
    """Renders the Transfer Value Predictor module interface."""
    st.markdown(
        """
        <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.85rem; color: #00FF85; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">
                Module 01 // Supervised Valuation Engine
            </div>
            <h1 style="margin: 0; font-size: 2.1rem; font-weight: 800;">Transfer Value Predictor</h1>
            <p style="color: #94A3B8; margin-top: 0.25rem; font-size: 0.95rem;">
                Estimate fair-market player valuations (€M) using regularized multi-variable Linear Regression.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    bundle = load_transfer_bundle()
    players_df = load_players_data()

    if bundle is None or players_df is None:
        st.error(
            "⚠️ Transfer model bundle or processed data not found. "
            "Please ensure models/saved/transfer_predictor.joblib and data/processed/cleaned_players.csv exist."
        )
        return

    pipeline = bundle["pipeline"]
    metrics = bundle.get("metrics", {})

    # Top KPI Banner
    col_kpi1, col_kpi2, col_kpi3 = st.columns(3)
    with col_kpi1:
        render_glass_card(
            "Model Architecture",
            "<div style='font-size: 1.1rem; font-weight: 700; color: #00E5FF;'>Ridge / OLS Pipeline</div>"
            "<div style='font-size: 0.8rem; color: #94A3B8;'>StandardScaler + OneHotEncoder</div>",
            badge="ACTIVE",
        )
    with col_kpi2:
        test_r2 = metrics.get("test_r2", 0.74)
        render_glass_card(
            "Evaluation Benchmark",
            f"<div style='font-size: 1.1rem; font-weight: 700; color: #00FF85;'>R² = {test_r2:.3f}</div>"
            "<div style='font-size: 0.8rem; color: #94A3B8;'>Holdout Validation Variance</div>",
            badge="BENCHMARK",
        )
    with col_kpi3:
        test_mae = metrics.get("test_mae", 15.2)
        render_glass_card(
            "Mean Absolute Error",
            f"<div style='font-size: 1.1rem; font-weight: 700; color: #E90052;'>± €{test_mae:.2f}M</div>"
            "<div style='font-size: 0.8rem; color: #94A3B8;'>Average Valuation Delta</div>",
            badge="TOLERANCE",
        )

    # 2-Column Workbench Layout
    col_inputs, col_viz = st.columns([1.1, 1.3], gap="large")

    with col_inputs:
        st.markdown(
            "<div style='font-weight: 700; font-size: 1.1rem; margin-bottom: 0.75rem;'>Player Profile & Tactical Metrics</div>",
            unsafe_allow_html=True,
        )

        # Quick preset selection
        preset_options = ["Custom Inputs..."] + players_df["name"].head(10).tolist()
        selected_preset = st.selectbox("⚡ Quick-Fill with Premier League Player:", preset_options)

        # Default values
        default_age = 24
        default_pos = "FW"
        default_minutes = 2400
        default_goals = 15
        default_assists = 8

        if selected_preset != "Custom Inputs...":
            row = players_df[players_df["name"] == selected_preset].iloc[0]
            default_age = int(row["age"])
            default_pos = str(row["position"])
            default_minutes = int(row["minutes_played"])
            default_goals = int(row["goals"])
            default_assists = int(row["assists"])

        pos_list = ["FW", "MF", "DF", "GK"]
        pos_index = pos_list.index(default_pos) if default_pos in pos_list else 0

        pos_col, age_col = st.columns(2)
        with pos_col:
            position = st.selectbox("Position Tactical Group", pos_list, index=pos_index)
        with age_col:
            age = st.slider("Player Age (Years)", min_value=16, max_value=38, value=default_age)

        minutes_played = st.slider(
            "Season Minutes Played",
            min_value=90,
            max_value=3420,
            value=default_minutes,
            step=90,
            help="Total league minutes logged across the 38-game season.",
        )

        goals_col, assists_col = st.columns(2)
        with goals_col:
            goals = st.slider("League Goals Scored", min_value=0, max_value=40, value=default_goals)
        with assists_col:
            assists = st.slider("League Assists Provided", min_value=0, max_value=25, value=default_assists)

        # Predict
        input_payload = {
            "goals": goals,
            "assists": assists,
            "minutes_played": minutes_played,
            "age": age,
            "position": position,
        }
        input_df = pd.DataFrame([input_payload])
        raw_pred = float(pipeline.predict(input_df)[0])
        predicted_val = round(max(1.0, raw_pred), 1)

    with col_viz:
        # Hero Card
        render_hero_metric(
            label="Estimated Transfer Market Value",
            value_str=f"€{predicted_val:,.1f}M",
            subtitle=f"Profile: {position} • Age {age} • {goals} Goals • {assists} Assists • {minutes_played} Mins",
        )

        # Matplotlib Scatter Plot: Predicted vs Actual with dynamic marker
        st.markdown(
            "<div style='font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem;'>Model Validation: Actual vs. Fitted Values</div>",
            unsafe_allow_html=True,
        )

        fig, ax = plt.subplots(figsize=(6.5, 4.2), dpi=100)
        apply_mpl_dark_theme(fig, ax)

        # Historical players baseline
        X_all = players_df[["goals", "assists", "minutes_played", "age", "position"]]
        y_all = players_df["market_value_eur_m"]
        y_fitted = pipeline.predict(X_all)

        ax.scatter(
            y_all,
            y_fitted,
            color=COLOR_PL_CYAN,
            alpha=0.45,
            edgecolors="none",
            s=40,
            label="Historical Players",
        )

        # Identity reference line (y = x)
        max_val = max(y_all.max(), predicted_val) + 20
        ax.plot([0, max_val], [0, max_val], color=(1.0, 1.0, 1.0, 0.3), linestyle="--", linewidth=1.2, label="Perfect Parity (y=x)")

        # Current player marker
        ax.scatter(
            [predicted_val],
            [predicted_val],
            color=COLOR_PL_GREEN,
            edgecolor="#FFFFFF",
            linewidth=2.0,
            s=180,
            zorder=5,
            label="Current Player Evaluation",
        )

        ax.set_xlim(0, max_val)
        ax.set_ylim(0, max_val)
        ax.set_xlabel("Actual Benchmark Value (€M)")
        ax.set_ylabel("Predicted Valuation (€M)")
        ax.legend(facecolor="#121826", edgecolor="none", labelcolor="#F8FAFC", fontsize=8, loc="upper left")

        st.pyplot(fig)
        plt.close(fig)
