/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    transparent: "transparent",
    current: "currentColor",
    extend: {
      colors: {
        pl: {
          base: "#0B0E14",
          card: "rgba(18, 24, 38, 0.70)",
          border: "rgba(255, 255, 255, 0.10)",
          green: "#00FF85",
          purple: "#38003C",
          pink: "#E90052",
          cyan: "#00E5FF",
        },
        tremor: {
          brand: {
            faint: "#0B0E14",
            muted: "#38003C",
            subtle: "#00FF85",
            DEFAULT: "#00FF85",
            emphasis: "#00E5FF",
            inverted: "#0B0E14",
          },
          background: {
            muted: "#111622",
            subtle: "#182030",
            DEFAULT: "#0E131F",
            emphasis: "#1E293B",
          },
          border: {
            DEFAULT: "rgba(255, 255, 255, 0.10)",
          },
          ring: {
            DEFAULT: "#00FF85",
          },
          content: {
            subtle: "#64748B",
            DEFAULT: "#94A3B8",
            emphasis: "#F8FAFC",
            strong: "#FFFFFF",
            inverted: "#000000",
          },
        },
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.45)",
        "glass-glow": "0 8px 32px 0 rgba(0, 255, 133, 0.15)",
        "glass-pink": "0 8px 32px 0 rgba(233, 0, 82, 0.15)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};
