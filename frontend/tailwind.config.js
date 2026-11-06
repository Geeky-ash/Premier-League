/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        /* ── Official Premier League Core Palette ── */
        pl: {
          "deepest": "#190019",
          "dark": "#240024",
          "purple": "#38003c",
          "purple-light": "#4a0050",
          "utility": "#140014",
          green: "#00ff85",
          magenta: "#e90052",
          cyan: "#00d4ff",
          white: "#ffffff",
          "text-secondary": "rgba(255, 255, 255, 0.75)",
          "text-muted": "rgba(255, 255, 255, 0.50)",
          "border": "rgba(255, 255, 255, 0.10)",
          "border-light": "rgba(255, 255, 255, 0.18)",
        },
        /* ── Club Brand Colors ── */
        club: {
          "man-utd": "#d81920",
          "man-city": "#6cabdd",
          arsenal: "#ef0107",
          chelsea: "#034694",
          liverpool: "#c8102e",
          spurs: "#132257",
          newcastle: "#241f20",
          "west-ham": "#7a263a",
          "aston-villa": "#670e36",
          brighton: "#0057b8",
          wolves: "#fdb913",
          bournemouth: "#da291c",
          fulham: "#000000",
          "crystal-palace": "#1b458f",
          brentford: "#e30613",
          everton: "#003399",
          forest: "#dd0000",
          leicester: "#003090",
          ipswich: "#0044aa",
          southampton: "#d71920",
        },
      },
      fontFamily: {
        sans: [
          "PremierLeague",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        display: [
          "PremierLeague",
          "Impact",
          "Haettenschweiler",
          "Arial Narrow Bold",
          "sans-serif",
        ],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        "stat-xl": ["3.5rem", { lineHeight: "1", fontWeight: "800" }],
        "stat-lg": ["2.25rem", { lineHeight: "1", fontWeight: "700" }],
        "stat-md": ["1.5rem", { lineHeight: "1.2", fontWeight: "700" }],
        "stat-sm": ["1.125rem", { lineHeight: "1.2", fontWeight: "600" }],
      },
      backgroundImage: {
        "pl-gradient": "linear-gradient(135deg, #00d4ff 0%, #38003c 100%)",
        "pl-gradient-h": "linear-gradient(90deg, #00d4ff 0%, #38003c 60%, #190019 100%)",
        "pl-gradient-magenta": "linear-gradient(135deg, #e90052 0%, #38003c 100%)",
        "pl-card-gradient": "linear-gradient(180deg, rgba(56,0,60,0.9) 0%, rgba(25,0,25,0.95) 100%)",
      },
      borderRadius: {
        pl: "8px",
        "pl-lg": "12px",
      },
      boxShadow: {
        pl: "0 4px 24px rgba(0, 0, 0, 0.35)",
        "pl-card": "0 2px 12px rgba(0, 0, 0, 0.3)",
        "pl-hover": "0 8px 32px rgba(0, 212, 255, 0.15)",
      },
      animation: {
        "ticker-scroll": "ticker 30s linear infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-right": "slideRight 0.35s ease-out",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideRight: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(0, 255, 133, 0.2)" },
          "50%": { boxShadow: "0 0 20px rgba(0, 255, 133, 0.45)" },
        },
      },
    },
  },
  plugins: [],
};
