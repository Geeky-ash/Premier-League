"""Unified Premier League Analytics Platform - Streamlit Main Entry Point (frontend/app.py).

Central dashboard shell featuring:
- Glassmorphic dark theme CSS injection
- Persistent sidebar routing among the three machine learning modules:
  1. 💰 Transfer Value Predictor (Linear Regression)
  2. ⚽ Match Outcome Predictor (XGBoost Classifier)
  3. 🔍 Player Scouting System (K-Means Clustering)
- Model health and artifact diagnostic status indicators
"""

import sys
from pathlib import Path

# Add project root to sys.path to enable clean absolute imports
PROJECT_ROOT = Path(__file__).resolve().parent.parent
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

import streamlit as st

from frontend_streamlit.components.styles import inject_custom_styles
from frontend_streamlit.pages.match_predictor_page import render_match_predictor_page
from frontend_streamlit.pages.scouting_page import render_scouting_page
from frontend_streamlit.pages.transfer_predictor_page import render_transfer_predictor_page

# Page Configuration
st.set_page_config(
    page_title="Premier League Analytics // Intelligence Suite",
    page_icon="⚽",
    layout="wide",
    initial_sidebar_state="expanded",
)


def render_sidebar() -> str:
    """Renders the persistent dark-glass sidebar with branding and module navigation.

    Returns:
        str: Selected module identifier.
    """
    with st.sidebar:
        # Branding Header
        st.markdown(
            """
            <div style="padding: 0.5rem 0 1.25rem 0; border-bottom: 1px solid rgba(255,255,255,0.08); margin-bottom: 1.25rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span style="font-size: 2rem;">🦁</span>
                    <div>
                        <div style="font-weight: 800; font-size: 1.15rem; letter-spacing: -0.02em; color: #FFFFFF;">
                            PL INTEL
                        </div>
                        <div style="font-size: 0.72rem; color: #00FF85; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">
                            Predictive Analytics Suite
                        </div>
                    </div>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        # Module Navigation
        st.markdown("<div style='font-size: 0.8rem; font-weight: 600; color: #94A3B8; text-transform: uppercase; margin-bottom: 0.5rem;'>Analytics Modules</div>", unsafe_allow_html=True)

        nav_options = [
            "💰 Transfer Value Predictor",
            "⚽ Match Outcome Predictor",
            "🔍 Player Scouting System",
        ]

        if "active_module" not in st.session_state:
            st.session_state["active_module"] = nav_options[0]

        selected_module = st.radio(
            "Select Module",
            nav_options,
            index=nav_options.index(st.session_state["active_module"]),
            label_visibility="collapsed",
        )
        st.session_state["active_module"] = selected_module

        # Pipeline Health Status Card
        st.markdown("<div style='margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.08); padding-top: 1rem;'></div>", unsafe_allow_html=True)
        st.markdown("<div style='font-size: 0.75rem; font-weight: 600; color: #94A3B8; text-transform: uppercase; margin-bottom: 0.5rem;'>Model Health Gates</div>", unsafe_allow_html=True)

        transfer_status = "🟢 Ready" if (PROJECT_ROOT / "models" / "saved" / "transfer_predictor.joblib").exists() else "🔴 Missing"
        match_status = "🟢 Ready" if (PROJECT_ROOT / "models" / "saved" / "match_predictor.joblib").exists() else "🔴 Missing"
        scouting_status = "🟢 Ready" if (PROJECT_ROOT / "models" / "saved" / "scouting_kmeans.joblib").exists() else "🔴 Missing"

        st.markdown(
            f"""
            <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 0.75rem 0.9rem; font-size: 0.78rem;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                    <span style="color: #94A3B8;">Transfer Model</span>
                    <span><b>{transfer_status}</b></span>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.35rem;">
                    <span style="color: #94A3B8;">Match Model</span>
                    <span><b>{match_status}</b></span>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span style="color: #94A3B8;">Scouting Engine</span>
                    <span><b>{scouting_status}</b></span>
                </div>
            </div>
            """,
            unsafe_allow_html=True,
        )

        st.markdown(
            """
            <div style="margin-top: 2rem; font-size: 0.72rem; color: #64748B; text-align: center;">
                v1.0.0 • Production Release<br>
                Deep Cyber Obsidian & Liquid Glass
            </div>
            """,
            unsafe_allow_html=True,
        )

    return selected_module


def main() -> None:
    """Main execution loop for the Streamlit dashboard."""
    # Inject Custom Liquid Glass CSS
    inject_custom_styles()

    # Render Sidebar and Route Page
    selected_module = render_sidebar()

    if selected_module == "💰 Transfer Value Predictor":
        render_transfer_predictor_page()
    elif selected_module == "⚽ Match Outcome Predictor":
        render_match_predictor_page()
    elif selected_module == "🔍 Player Scouting System":
        render_scouting_page()


if __name__ == "__main__":
    main()
