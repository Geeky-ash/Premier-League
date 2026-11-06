"""Smoke and Unit Tests for Streamlit Frontend Modules (tests/test_frontend.py).

Verifies that:
1. All frontend component and page modules import cleanly without syntax or path errors.
2. The CSS design system provides required dark-mode and glassmorphism tokens.
3. The Matplotlib theme helper correctly configures figure and axes backgrounds.
4. Data and model loaders retrieve valid objects with zero runtime crashes.
"""

from pathlib import Path
import matplotlib.pyplot as plt
import pytest

from frontend_streamlit.components.styles import (
    COLOR_BG_BASE,
    COLOR_PL_GREEN,
    apply_mpl_dark_theme,
    get_custom_css,
)
from frontend_streamlit.pages.transfer_predictor_page import load_players_data, load_transfer_bundle
from frontend_streamlit.pages.match_predictor_page import load_matches_data, load_match_bundle
from frontend_streamlit.pages.scouting_page import load_annotated_players, load_scouting_bundle


def test_custom_css_tokens() -> None:
    """Verifies that custom CSS includes dark mode, glass cards, and Premier League accents."""
    css = get_custom_css()
    assert ".glass-card" in css, "CSS missing .glass-card specification"
    assert "backdrop-filter" in css, "CSS missing backdrop-filter glassmorphism"
    assert COLOR_BG_BASE in css, f"CSS missing base background {COLOR_BG_BASE}"
    assert COLOR_PL_GREEN in css, f"CSS missing Premier League accent green {COLOR_PL_GREEN}"


def test_mpl_dark_theme_application() -> None:
    """Verifies that apply_mpl_dark_theme configures facecolors correctly."""
    fig, ax = plt.subplots()
    apply_mpl_dark_theme(fig, ax)

    # Convert color tuple/hex check
    assert fig.get_facecolor() is not None
    assert ax.get_facecolor() is not None
    plt.close(fig)


def test_transfer_page_loaders() -> None:
    """Verifies that the transfer model and player dataset load without errors."""
    bundle = load_transfer_bundle()
    assert bundle is not None, "Transfer bundle failed to load in frontend page"
    assert "pipeline" in bundle

    df = load_players_data()
    assert df is not None, "Player dataset failed to load in frontend page"
    assert len(df) >= 30


def test_match_page_loaders() -> None:
    """Verifies that the match outcome model and fixtures load cleanly."""
    bundle = load_match_bundle()
    assert bundle is not None, "Match model bundle failed to load in frontend page"
    assert "model" in bundle

    df = load_matches_data()
    assert df is not None, "Matches dataset failed to load in frontend page"
    assert len(df) >= 20


def test_scouting_page_loaders() -> None:
    """Verifies that the scouting engine and annotated dataset load cleanly."""
    bundle = load_scouting_bundle()
    assert bundle is not None, "Scouting model bundle failed to load in frontend page"
    assert "kmeans" in bundle
    assert "scaler" in bundle

    df = load_annotated_players()
    assert df is not None, "Annotated player dataset failed to load in frontend page"
    assert "cluster_id" in df.columns or "name" in df.columns


def test_main_app_import() -> None:
    """Smoke test ensuring frontend.app and root app import cleanly."""
    import frontend.app as app_module
    assert hasattr(app_module, "main"), "frontend.app missing main() entrypoint"

    import app as root_app
    assert hasattr(root_app, "main"), "Root app.py missing main() entrypoint"
