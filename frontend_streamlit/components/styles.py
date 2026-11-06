"""UI Design System, Glassmorphic CSS and Matplotlib Theming (frontend/components/styles.py).

Implements the elite sports-analytics aesthetic specified in DESIGN.md:
- Strict dark-mode palette (#0B0E14 background)
- Translucent liquid glass cards with backdrop blurs and subtle borders
- Official Premier League accent tokens (#00FF85 green, #38003C purple, #E90052 pink)
- Matplotlib theme overrides to harmonize charts with the dark glass interface
"""

from typing import Any, Tuple
import matplotlib.pyplot as plt
import streamlit as st

# Color Palette Tokens
COLOR_BG_BASE = "#0B0E14"
COLOR_BG_CARD = "rgba(18, 24, 38, 0.70)"
COLOR_BORDER_GLASS = "rgba(255, 255, 255, 0.10)"
COLOR_PL_PURPLE = "#38003C"
COLOR_PL_GREEN = "#00FF85"
COLOR_PL_PINK = "#E90052"
COLOR_PL_CYAN = "#00E5FF"
COLOR_TEXT_PRIMARY = "#F8FAFC"
COLOR_TEXT_SECONDARY = "#94A3B8"
COLOR_TEXT_MUTED = "#64748B"


def get_custom_css() -> str:
    """Returns the custom glassmorphism CSS injection string.

    Returns:
        str: Minified/structured CSS payload.
    """
    return f"""
    <style>
    /* Global App Container */
    .stApp {{
        background-color: {COLOR_BG_BASE};
        color: {COLOR_TEXT_PRIMARY};
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    }}

    /* Main Content Padding */
    .main .block-container {{
        padding-top: 1.8rem;
        padding-bottom: 3.5rem;
        max-width: 1250px;
    }}

    /* Persistent Sidebar Styling */
    section[data-testid="stSidebar"] {{
        background-color: #080A0F !important;
        border-right: 1px solid rgba(255, 255, 255, 0.08);
    }}

    section[data-testid="stSidebar"] .block-container {{
        padding-top: 2rem;
    }}

    /* Glassmorphism Container Card */
    .glass-card {{
        background: {COLOR_BG_CARD};
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        border: 1px solid {COLOR_BORDER_GLASS};
        border-radius: 14px;
        padding: 1.35rem 1.6rem;
        margin-bottom: 1.25rem;
        box-shadow: 0 8px 30px 0 rgba(0, 0, 0, 0.35);
        transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }}

    .glass-card:hover {{
        border-color: rgba(0, 255, 133, 0.35);
        box-shadow: 0 10px 35px 0 rgba(0, 255, 133, 0.10);
    }}

    /* Glass Metric Hero Card */
    .metric-hero-card {{
        background: linear-gradient(135deg, rgba(56, 0, 60, 0.40) 0%, rgba(18, 24, 38, 0.85) 100%);
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(0, 255, 133, 0.25);
        border-radius: 14px;
        padding: 1.5rem;
        text-align: center;
        box-shadow: 0 10px 32px 0 rgba(0, 0, 0, 0.45);
        margin-bottom: 1.5rem;
    }}

    .metric-hero-label {{
        font-size: 0.85rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        color: {COLOR_TEXT_SECONDARY};
        margin-bottom: 0.35rem;
        font-weight: 600;
    }}

    .metric-hero-value {{
        font-size: 2.75rem;
        font-weight: 800;
        letter-spacing: -0.04em;
        background: linear-gradient(135deg, {COLOR_PL_GREEN} 0%, {COLOR_PL_CYAN} 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        line-height: 1.1;
    }}

    .metric-hero-sub {{
        font-size: 0.82rem;
        color: {COLOR_TEXT_MUTED};
        margin-top: 0.45rem;
    }}

    /* Badges */
    .pl-badge {{
        display: inline-block;
        padding: 0.25rem 0.65rem;
        border-radius: 9999px;
        font-size: 0.75rem;
        font-weight: 700;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        border: 1px solid rgba(255, 255, 255, 0.15);
    }}

    .badge-green {{
        background: rgba(0, 255, 133, 0.12);
        color: {COLOR_PL_GREEN};
        border-color: rgba(0, 255, 133, 0.35);
    }}

    .badge-pink {{
        background: rgba(233, 0, 82, 0.15);
        color: {COLOR_PL_PINK};
        border-color: rgba(233, 0, 82, 0.40);
    }}

    .badge-purple {{
        background: rgba(56, 0, 60, 0.50);
        color: #E2D9F3;
        border-color: rgba(142, 68, 173, 0.40);
    }}

    .badge-cyan {{
        background: rgba(0, 229, 255, 0.12);
        color: {COLOR_PL_CYAN};
        border-color: rgba(0, 229, 255, 0.35);
    }}

    /* Streamlit Widget Overrides */
    div[data-testid="stMetricValue"] {{
        color: {COLOR_PL_GREEN} !important;
        font-weight: 700 !important;
    }}

    /* Selectboxes and Sliders */
    .stSelectbox label, .stSlider label {{
        color: {COLOR_TEXT_PRIMARY} !important;
        font-weight: 500;
    }}

    /* Dataframe Table styling */
    div[data-testid="stDataFrame"] {{
        border: 1px solid {COLOR_BORDER_GLASS};
        border-radius: 12px;
        overflow: hidden;
    }}

    /* Header styling */
    h1, h2, h3, h4 {{
        color: {COLOR_TEXT_PRIMARY} !important;
        letter-spacing: -0.02em;
    }}
    </style>
    """


def inject_custom_styles() -> None:
    """Injects the glassmorphic CSS payload into the active Streamlit app."""
    st.markdown(get_custom_css(), unsafe_allow_html=True)


def render_glass_card(title: str, content_html: str, badge: str = "") -> None:
    """Renders a styled liquid glass card container with optional badge.

    Args:
        title: Card header title.
        content_html: Inner HTML/text content.
        badge: Optional badge text.
    """
    badge_html = f'<span class="pl-badge badge-green">{badge}</span>' if badge else ""
    html = f"""
    <div class="glass-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div style="font-weight: 700; font-size: 1.05rem; color: #FFFFFF;">{title}</div>
            {badge_html}
        </div>
        <div>{content_html}</div>
    </div>
    """
    st.markdown(html, unsafe_allow_html=True)


def render_hero_metric(label: str, value_str: str, subtitle: str = "") -> None:
    """Renders a premier high-contrast glass metric hero card.

    Args:
        label: Metric title / descriptor.
        value_str: Prominently formatted value (e.g. '€84.5M').
        subtitle: Supplemental benchmark note.
    """
    html = f"""
    <div class="metric-hero-card">
        <div class="metric-hero-label">{label}</div>
        <div class="metric-hero-value">{value_str}</div>
        <div class="metric-hero-sub">{subtitle}</div>
    </div>
    """
    st.markdown(html, unsafe_allow_html=True)


def apply_mpl_dark_theme(fig: plt.Figure, ax: Any) -> None:
    """Applies strict dark-mode glass styling to a Matplotlib Figure and Axis.

    Args:
        fig: Target Matplotlib Figure object.
        ax: Target Matplotlib Axes object (or array of Axes).
    """
    fig.patch.set_facecolor(COLOR_BG_BASE)

    axes_list = [ax] if not hasattr(ax, "__iter__") else ax.ravel()
    for current_ax in axes_list:
        current_ax.set_facecolor("#111622")
        current_ax.spines["top"].set_visible(False)
        current_ax.spines["right"].set_visible(False)
        current_ax.spines["bottom"].set_color((1.0, 1.0, 1.0, 0.15))
        current_ax.spines["left"].set_color((1.0, 1.0, 1.0, 0.15))
        current_ax.tick_params(colors=COLOR_TEXT_SECONDARY, which="both", labelsize=8.5)
        current_ax.xaxis.label.set_color(COLOR_TEXT_PRIMARY)
        current_ax.yaxis.label.set_color(COLOR_TEXT_PRIMARY)
        current_ax.title.set_color(COLOR_TEXT_PRIMARY)
        current_ax.title.set_fontweight("bold")
        current_ax.grid(color=(1.0, 1.0, 1.0, 0.06), linestyle="--", linewidth=0.6)
