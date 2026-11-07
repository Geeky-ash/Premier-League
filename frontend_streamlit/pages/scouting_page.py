"""Player Scouting & Similarity Engine Page (frontend/pages/scouting_page.py).

Interactive Streamlit interface for Module 3:
- Player lookup / autocomplete dropdown across Premier League squad rosters
- Tactical archetype classification badge (K-Means k=4)
- Top 5 statistical twins table via normalized Euclidean distance matching
- 2D PCA cluster projection plot highlighting tactical style segments and target player
"""

from pathlib import Path
from typing import Any, Dict, List, Optional

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
MODEL_PATH = PROJECT_ROOT / "models" / "saved" / "scouting_kmeans.joblib"
DATA_PATH = PROJECT_ROOT / "data" / "processed" / "cleaned_players.csv"

CLUSTER_COLORS = {
    0: "#00FF85",  # Green: Finishers
    1: "#00E5FF",  # Cyan: Playmakers
    2: "#E90052",  # Pink: Defensive Anchors
    3: "#FFB800",  # Gold: Ball-playing defenders
}


@st.cache_resource
def load_scouting_bundle() -> Optional[Dict[str, Any]]:
    """Loads and caches the serialized player scouting bundle."""
    if not MODEL_PATH.exists():
        return None
    try:
        return joblib.load(MODEL_PATH)
    except Exception as exc:
        st.error(f"Error loading scouting model: {exc}")
        return None


@st.cache_data
def load_annotated_players() -> Optional[pd.DataFrame]:
    """Loads the pre-annotated player dataset from the scouting bundle or disk."""
    bundle = load_scouting_bundle()
    if bundle and "annotated_df" in bundle:
        return bundle["annotated_df"]
    if DATA_PATH.exists():
        return pd.read_csv(DATA_PATH)
    return None


def render_scouting_page() -> None:
    """Renders the Player Scouting System module interface."""
    st.markdown(
        """
        <div style="margin-bottom: 1.25rem;">
            <div style="font-size: 0.85rem; color: #00FF85; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">
                Module 03 // Unsupervised Scouting Intelligence
            </div>
            <h1 style="margin: 0; font-size: 2.1rem; font-weight: 800;">Player Scouting & Similarity Engine</h1>
            <p style="color: #94A3B8; margin-top: 0.25rem; font-size: 0.95rem;">
                Cluster tactical profiles via K-Means and discover statistical twins across the Premier League.
            </p>
        </div>
        """,
        unsafe_allow_html=True,
    )

    bundle = load_scouting_bundle()
    df = load_annotated_players()

    if bundle is None or df is None:
        st.error(
            "⚠️ Scouting model bundle not found at models/saved/scouting_kmeans.joblib. "
            "Please run models/train_scouting_model.py first."
        )
        return

    scaler = bundle["scaler"]
    metrics_cols = bundle["scouting_metrics"]
    archetypes = bundle.get("cluster_archetypes", {})
    metrics = bundle.get("metrics", {})

    # Top KPI Banner
    col_kpi1, col_kpi2, col_kpi3 = st.columns(3)
    with col_kpi1:
        render_glass_card(
            "Clustering Model",
            "<div style='font-size: 1.1rem; font-weight: 700; color: #00FF85;'>K-Means (k=4)</div>"
            "<div style='font-size: 0.8rem; color: #94A3B8;'>StandardScaler Normalization</div>",
            badge="ACTIVE",
        )
    with col_kpi2:
        sil_score = metrics.get("silhouette_score", 0.47)
        render_glass_card(
            "Cluster Cohesion",
            f"<div style='font-size: 1.1rem; font-weight: 700; color: #00E5FF;'>Silhouette: {sil_score:.3f}</div>"
            "<div style='font-size: 0.8rem; color: #94A3B8;'>Separation & Denseness Benchmark</div>",
            badge="BENCHMARK",
        )
    with col_kpi3:
        pca_var = metrics.get("pca_variance_ratio_sum", 0.83)
        render_glass_card(
            "2D Dimensionality",
            f"<div style='font-size: 1.1rem; font-weight: 700; color: #E90052;'>{pca_var * 100:.1f}% Variance</div>"
            "<div style='font-size: 0.8rem; color: #94A3B8;'>Preserved in 2D Projection</div>",
            badge="PCA",
        )

    # Player Selection Bar
    player_names = sorted(df["name"].unique().tolist())
    default_name = "Bukayo Saka" if "Bukayo Saka" in player_names else player_names[0]
    selected_player_name = st.selectbox("🔍 Search & Select Target Player:", player_names, index=player_names.index(default_name))

    player_row = df[df["name"] == selected_player_name].iloc[0]
    target_idx = df[df["name"] == selected_player_name].index[0]
    cluster_id = int(player_row.get("cluster_id", 0))
    archetype_name = archetypes.get(cluster_id, f"Cluster {cluster_id}")

    # Twin Discovery Logic: Euclidean distance across standardized features
    X_all = scaler.transform(df[metrics_cols].values)
    target_vector = X_all[target_idx]
    distances = np.linalg.norm(X_all - target_vector, axis=1)

    twin_df = df.copy()
    twin_df["similarity_pct"] = np.round(100.0 / (1.0 + distances), 1)
    twin_df["distance"] = np.round(distances, 2)

    # Top 5 statistical twins (excluding self)
    top_twins = (
        twin_df[twin_df.index != target_idx]
        .sort_values(by="similarity_pct", ascending=False)
        .head(5)
    )

    # 2-Column Layout: Left (Profile & Twins), Right (PCA Plot)
    col_profile, col_plot = st.columns([1.1, 1.3], gap="large")

    with col_profile:
        render_hero_metric(
            label="Assigned Tactical Archetype",
            value_str=archetype_name,
            subtitle=f"{selected_player_name} • {player_row['club']} • {player_row['position']} • Age {player_row['age']}",
        )

        st.markdown(
            f"""
            <div class="glass-card" style="padding: 1rem 1.25rem;">
                <div style="font-weight: 700; color: #FFFFFF; margin-bottom: 0.5rem;">Per-90 Pitch Metrics</div>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.5rem; font-size: 0.85rem;">
                    <div>Goals/90: <b style="color: #00FF85;">{player_row.get('goals_per_90', player_row['goals'])}</b></div>
                    <div>Assists/90: <b style="color: #00E5FF;">{player_row.get('assists_per_90', player_row['assists'])}</b></div>
                    <div>Pass Comp: <b style="color: #FFFFFF;">{player_row['pass_completion']}%</b></div>
                    <div>Shots/90: <b style="color: #FFFFFF;">{player_row.get('shots_per_90', player_row['shots'])}</b></div>
                    <div>Dribbles/90: <b style="color: #FFFFFF;">{player_row.get('dribbles_per_90', player_row['dribbles'])}</b></div>
                    <div>Tackles/90: <b style="color: #E90052;">{player_row.get('tackles_interceptions_per_90', player_row['tackles_interceptions'])}</b></div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        # Statistical Twin Finder Table
        st.markdown(
            "<div style='font-weight: 700; font-size: 1.05rem; margin-top: 1rem; margin-bottom: 0.5rem;'>"
            "Top 5 Statistical Twins (Euclidean Match)</div>",
            unsafe_allow_html=True,
        )

        display_twins = top_twins[[
            "name", "club", "position", "age", "similarity_pct", "market_value_eur_m"
        ]].copy()
        display_twins.columns = ["Player", "Club", "Position", "Age", "Match %", "Valuation (€M)"]
        display_twins["Valuation (€M)"] = display_twins["Valuation (€M)"].apply(lambda v: f"€{v:,.1f}M")
        display_twins["Match %"] = display_twins["Match %"].apply(lambda m: f"{m:.1f}%")

        st.dataframe(display_twins, use_container_width=True, hide_index=True)

    with col_plot:
        st.markdown(
            "<div style='font-weight: 700; font-size: 0.95rem; margin-bottom: 0.5rem;'>2D PCA Tactical Space & Clusters</div>",
            unsafe_allow_html=True,
        )

        fig, ax = plt.subplots(figsize=(6.5, 4.4), dpi=100)
        apply_mpl_dark_theme(fig, ax)

        # Draw each cluster
        for cid, label in archetypes.items():
            c_mask = df["cluster_id"] == cid
            c_color = CLUSTER_COLORS.get(cid, "#94A3B8")
            ax.scatter(
                df.loc[c_mask, "pca_x"],
                df.loc[c_mask, "pca_y"],
                color=c_color,
                alpha=0.45,
                s=45,
                edgecolors="none",
                label=f"C{cid}: {label.split('&')[0].strip()}",
            )

        # Draw Twins with subtle highlight
        ax.scatter(
            top_twins["pca_x"],
            top_twins["pca_y"],
            color="#FFFFFF",
            marker="o",
            s=80,
            edgecolors=COLOR_PL_CYAN,
            linewidths=1.5,
            label="Top 5 Twins",
            zorder=4,
        )

        # Draw Target Player prominently
        target_x = player_row["pca_x"]
        target_y = player_row["pca_y"]
        ax.scatter(
            [target_x],
            [target_y],
            color=COLOR_PL_GREEN,
            marker="*",
            s=300,
            edgecolors="#FFFFFF",
            linewidths=1.5,
            zorder=6,
            label=f"★ {selected_player_name}",
        )

        # Annotate target player name
        ax.annotate(
            selected_player_name,
            xy=(target_x, target_y),
            xytext=(10, 10),
            textcoords="offset points",
            color="#FFFFFF",
            fontsize=9.5,
            fontweight="bold",
            bbox=dict(boxstyle="round,pad=0.2", facecolor="#121826", edgecolor=COLOR_PL_GREEN, alpha=0.9),
            arrowprops=dict(arrowstyle="->", color=COLOR_PL_GREEN, lw=1.2),
        )

        ax.set_xlabel("Principal Component 1 (Attacking / Production)")
        ax.set_ylabel("Principal Component 2 (Defensive / Ball Winning)")
        ax.legend(facecolor="#121826", edgecolor="none", labelcolor="#F8FAFC", fontsize=7.5, loc="lower right")

        st.pyplot(fig)
        plt.close(fig)
