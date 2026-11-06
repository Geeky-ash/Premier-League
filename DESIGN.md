# UI/UX Design System Specification (DESIGN.md)

This document dictates the visual design language, component architecture, color tokens, and plotting guidelines for the Premier League Analytics Platform.

---

### 1. Theme & Aesthetic Principles
The platform adopts an elite sports-analytics aesthetic: **Deep Cyber Obsidian with Liquid Glassmorphism**.
- **Dark Mode Standard**: Absolute dark canvas with subtle deep slate/indigo gradients.
- **Glassmorphic Data Cards**: Translucent containers with backdrop-filter blurs, subtle border highlights, and ambient glow.
- **Minimalist Geometric Branding**: Clean sans-serif typography, geometric iconography, sharp grid layouts, and high-contrast numerical callouts.

---

### 2. Design Tokens & Palette

| Token Name | Hex Code | Visual Role |
| :--- | :--- | :--- |
| `--bg-base` | `#0B0E14` | Core dark canvas / body background |
| `--bg-card` | `rgba(18, 24, 38, 0.70)` | Glass card translucent fill |
| `--border-glass` | `rgba(255, 255, 255, 0.12)` | Subtle glass edge highlight |
| `--accent-premier` | `#38003C` | Premier League heritage purple / deep brand tone |
| `--accent-cyan` | `#00FF87` | Neon pitch electric green / positive KPI indicators |
| `--accent-magenta` | `#E90052` | Premier League magenta / alert & primary highlight |
| `--accent-electric`| `#00E5FF` | Electric cyan / scouting clusters & scatter charts |
| `--text-primary` | `#F8FAFC` | Crisp headings, primary metrics |
| `--text-secondary`| `#94A3B8` | Subtle descriptors, axis labels, legends |
| `--text-muted` | `#64748B` | Footers, captions, timestamps |

---

### 3. Glassmorphic CSS Specification
Streamlit components are styled via injected custom CSS (`markdown(..., unsafe_allow_html=True)`):

```css
/* Glassmorphism Container Card */
.glass-card {
    background: rgba(18, 24, 38, 0.65);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 14px;
    padding: 1.5rem;
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
    margin-bottom: 1.25rem;
    transition: transform 0.2s ease, border-color 0.2s ease;
}

.glass-card:hover {
    border-color: rgba(0, 255, 135, 0.35);
    transform: translateY(-2px);
}

/* KPI Value Accent */
.metric-value-highlight {
    font-size: 2.25rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    background: linear-gradient(135deg, #00FF87 0%, #00E5FF 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}
```

---

### 4. Layout & Navigation Hierarchy
- **Persistent Left Sidebar**:
  - Geometric App Crest & Title: `PL INTEL // ANALYTICS SUITE`
  - Navigation Pills / Radio selector:
    1. 💰 **Transfer Value Predictor**
    2. ⚽ **Match Outcome Predictor**
    3. 🔍 **Player Scouting & Clusters**
  - Live Model Status & Global Filters (Season / Position filters).
- **Hero Header**: Module title, one-sentence operational brief, and active model accuracy badge.
- **Top Metrics Row**: 3 to 4 glass cards displaying real-time metrics (e.g. Predicted Valuation, Confidence Interval, Top Attribute).
- **Interactive Workbench (2-Column Grid)**:
  - Left: Interactive parameter controls (sliders, select boxes).
  - Right: High-impact visualization canvas (Matplotlib styled plots).

---

### 5. Matplotlib Visualization Guidelines
All visualizations rendered with `matplotlib.pyplot` must explicitly override default white styles to blend natively into the dark glassmorphic UI.

**Standard Matplotlib Dark Theme Boilerplate**:
```python
import matplotlib.pyplot as plt

def set_premier_dark_theme(fig, ax):
    """Enforces dark-glass styling on matplotlib charts."""
    fig.patch.set_facecolor('#0B0E14')
    ax.set_facecolor('#121826')
    ax.spines['top'].set_visible(False)
    ax.spines['right'].set_visible(False)
    ax.spines['bottom'].set_color('rgba(255, 255, 255, 0.15)')
    ax.spines['left'].set_color('rgba(255, 255, 255, 0.15)')
    ax.tick_params(colors='#94A3B8', which='both', labelsize=9)
    ax.xaxis.label.set_color('#F8FAFC')
    ax.yaxis.label.set_color('#F8FAFC')
    ax.title.set_color('#F8FAFC')
    ax.grid(color='rgba(255, 255, 255, 0.05)', linestyle='--', linewidth=0.7)
```

**Chart-Specific Guidelines**:
1. **Transfer Value Predictor**: Scatter plot of *Predicted vs. Actual* transfer values with identity line (`y=x`) in `#00FF87` and dynamic residual error bars.
2. **Match Outcome Predictor**: Custom styled dark heatmap / confusion matrix with gradient colormap (`Purples` or `#38003C` to `#E90052`), along with horizontal probability bars.
3. **Player Scouting System**: 2D scatter plot (PCA or key metrics like Goals/90 vs Assists/90) with clusters colored by `#00FF87`, `#00E5FF`, `#E90052`, and `#FFB800`, with highlighted selected player marker.
