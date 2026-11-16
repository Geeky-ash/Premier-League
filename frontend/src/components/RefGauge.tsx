"use client";

import React from "react";

interface RefGaugeProps {
  strictness: number; // 1.0 to 10.0
  refereeName?: string;
  confidenceMin?: number;
  confidenceMax?: number;
  leagueAverage?: number;
  recentCardsHistory?: number[]; // last 10 matches card counts
  showHistory?: boolean;
}

export default function RefGauge({
  strictness = 6.8,
  refereeName = "Referee Official",
  confidenceMin = 6.4,
  confidenceMax = 7.1,
  leagueAverage = 5.4,
  recentCardsHistory = [3, 4, 3, 5, 5, 6, 5, 7, 7, 8],
  showHistory = true,
}: RefGaugeProps) {
  // Clamp strictness between 1.0 and 10.0
  const clampedStrict = Math.min(10.0, Math.max(1.0, strictness));
  
  // Calculate needle rotation angle:
  // 1.0 is far left (-90 deg), 5.5 is top (0 deg), 10.0 is far right (+90 deg)
  const needleAngle = ((clampedStrict - 1.0) / 9.0) * 180 - 90;

  // Determine tier label and color
  let tierLabel = "STANDARD TIER";
  let tierColor = "#75758a";
  let tierBg = "#eeece7";
  if (clampedStrict < 4.0) {
    tierLabel = "LENIENT TIER";
    tierColor = "#003c33";
    tierBg = "#edfce9";
  } else if (clampedStrict >= 6.5) {
    tierLabel = "DRACONIAN TIER";
    tierColor = "#ff7759";
    tierBg = "#fff1ee";
  }

  const diffFromAvg = (clampedStrict - leagueAverage).toFixed(1);
  const diffSign = clampedStrict >= leagueAverage ? "+" : "";

  return (
    <div className="product-card flex flex-col items-center justify-between p-6 bg-white border border-cohere-hairline rounded-lg shadow-sm">
      {/* Header */}
      <div className="w-full flex items-center justify-between pb-3 border-b border-cohere-hairline">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-wider text-cohere-slate">
            PRIMARY TELEMETRY VECTOR
          </span>
          <h4 className="font-display font-bold text-base text-cohere-primary">
            Strictness Tendency Dial
          </h4>
        </div>
        <div
          className="px-2.5 py-1 rounded text-xs font-mono font-bold uppercase tracking-wider"
          style={{ backgroundColor: tierBg, color: tierColor }}
        >
          {tierLabel}
        </div>
      </div>

      {/* Radial Gauge SVG */}
      <div className="w-full max-w-[380px] my-4 flex flex-col items-center">
        <svg
          className="w-full overflow-visible select-none"
          viewBox="0 0 400 220"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background Tracks (Zones) */}
          {/* Zone 1: Lenient (1.0 - 4.0) -> Arc 180° to 126° */}
          <path
            d="M 40 200 A 160 160 0 0 1 123 68"
            fill="none"
            stroke="#edfce9"
            strokeWidth="28"
            strokeLinecap="round"
          />
          <path
            d="M 40 200 A 160 160 0 0 1 123 68"
            fill="none"
            stroke="#003c33"
            strokeWidth="6"
            strokeOpacity="0.4"
          />

          {/* Zone 2: Standard (4.0 - 7.0) -> Arc 126° to 72° */}
          <path
            d="M 132 61 A 160 160 0 0 1 268 61"
            fill="none"
            stroke="#eeece7"
            strokeWidth="28"
          />

          {/* Zone 3: Draconian (7.0 - 10.0) -> Arc 72° to 0° */}
          <path
            d="M 277 68 A 160 160 0 0 1 360 200"
            fill="none"
            stroke="#ff7759"
            strokeWidth="28"
            strokeLinecap="round"
          />

          {/* Subtle tick guides */}
          <line
            x1="200"
            y1="200"
            x2="200"
            y2="46"
            stroke="#d9d9dd"
            strokeDasharray="2 6"
            strokeWidth="1.5"
          />
          <circle
            cx="200"
            cy="200"
            r="160"
            fill="none"
            stroke="#eeece7"
            strokeDasharray="4 6"
            strokeWidth="1"
          />

          {/* Needle Pointer */}
          <g
            transform={`rotate(${needleAngle}, 200, 200)`}
            className="transition-transform duration-700 ease-out"
          >
            <polygon fill="#17171c" points="196,200 200,52 204,200" />
            <circle cx="200" cy="52" fill={tierColor} r="5" />
          </g>

          {/* Pivot Center */}
          <circle cx="200" cy="200" fill="#17171c" r="14" />
          <circle cx="200" cy="200" fill="#ffffff" r="5" />

          {/* Gauge Scale Labels */}
          <text
            className="font-mono text-[11px] font-medium"
            fill="#75758a"
            x="32"
            y="218"
          >
            1.0
          </text>
          <text
            className="font-mono text-[10px] font-semibold"
            fill="#003c33"
            x="96"
            y="42"
          >
            LENIENT (4.0)
          </text>
          <text
            className="font-mono text-[10px] font-semibold"
            fill="#75758a"
            x="176"
            y="30"
          >
            STD (5.5)
          </text>
          <text
            className="font-mono text-[10px] font-semibold"
            fill="#ff7759"
            x="266"
            y="42"
          >
            DRACONIAN (7.0+)
          </text>
          <text
            className="font-mono text-[11px] font-medium"
            fill="#75758a"
            x="356"
            y="218"
          >
            10.0
          </text>
        </svg>

        {/* Big strictness display value */}
        <div className="text-center mt-2">
          <div className="flex items-baseline justify-center gap-1">
            <span className="font-display font-bold text-4xl text-cohere-primary tracking-tight">
              {clampedStrict.toFixed(1)}
            </span>
            <span className="font-mono text-sm text-cohere-slate">/ 10.0</span>
          </div>
          <div className="mt-1 flex items-center justify-center gap-2 text-xs font-mono">
            <span
              className={`font-semibold ${
                clampedStrict >= leagueAverage
                  ? "text-cohere-coral"
                  : "text-cohere-deep-green"
              }`}
            >
              {diffSign}
              {diffFromAvg} vs League Median ({leagueAverage.toFixed(1)})
            </span>
          </div>
        </div>
      </div>

      {/* 10-Match Rolling Trend Line Chart */}
      {showHistory && recentCardsHistory.length > 0 && (
        <div className="w-full pt-4 border-t border-cohere-hairline mt-2">
          <div className="flex items-center justify-between text-xs font-mono text-cohere-slate mb-2">
            <span>10-MATCH CARD TRAJECTORY</span>
            <span className="font-semibold text-cohere-primary">
              RECENT: {recentCardsHistory[recentCardsHistory.length - 1]} CARDS
            </span>
          </div>
          <div className="w-full h-24">
            <svg
              className="w-full h-full overflow-visible"
              viewBox="0 0 340 100"
              preserveAspectRatio="none"
            >
              {/* Grid Lines */}
              <line
                x1="0"
                y1="20"
                x2="340"
                y2="20"
                stroke="#eeece7"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="50"
                x2="340"
                y2="50"
                stroke="#eeece7"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="80"
                x2="340"
                y2="80"
                stroke="#eeece7"
                strokeWidth="1"
              />

              {/* Benchmark Line (League average ~4.5 cards -> y=52) */}
              <line
                x1="0"
                y1="52"
                x2="340"
                y2="52"
                stroke="#d9d9dd"
                strokeDasharray="3 3"
                strokeWidth="1.5"
              />

              {/* Line Polyline & Area */}
              {(() => {
                const maxVal = 10;
                const minVal = 0;
                const stepX = 340 / (recentCardsHistory.length - 1);
                const points = recentCardsHistory.map((val, idx) => {
                  const x = idx * stepX;
                  const y = 90 - (val / maxVal) * 80;
                  return `${x},${y}`;
                });
                const pointsStr = points.join(" ");
                const areaStr = `0,95 ${pointsStr} 340,95`;

                return (
                  <>
                    <polygon
                      fill="#ff7759"
                      opacity="0.12"
                      points={areaStr}
                    />
                    <polyline
                      fill="none"
                      points={pointsStr}
                      stroke="#ff7759"
                      strokeWidth="2.5"
                    />
                    {recentCardsHistory.map((val, idx) => {
                      const x = idx * stepX;
                      const y = 90 - (val / maxVal) * 80;
                      const isLast = idx === recentCardsHistory.length - 1;
                      return (
                        <circle
                          key={idx}
                          cx={x}
                          cy={y}
                          r={isLast ? 4 : 2.5}
                          fill={isLast ? "#ff7759" : "#17171c"}
                        />
                      );
                    })}
                  </>
                );
              })()}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
