"use client";

import React, { useState } from "react";
import { Target, Activity, Zap, CheckCircle2, ShieldAlert } from "lucide-react";

export interface ShotEvent {
  id: number;
  player: string;
  team: string;
  minute: number;
  half: "1H" | "2H";
  outcome: "GOAL" | "SAVED" | "POST" | "BLOCKED" | "WIDE";
  x: number; // 0 to 1000 in SVG viewBox
  y: number; // 0 to 560 in SVG viewBox
  xg: number;
  psxg: number;
  distanceMeters: number;
  velocityKmh: number;
  trajectoryAngle: string;
  bodyPart: "Right Foot" | "Left Foot" | "Header";
}

const DEFAULT_SHOTS: ShotEvent[] = [
  {
    id: 1,
    player: "Nicolas Jackson",
    team: "Chelsea",
    minute: 12,
    half: "1H",
    outcome: "GOAL",
    x: 490,
    y: 430,
    xg: 0.42,
    psxg: 0.76,
    distanceMeters: 9.4,
    velocityKmh: 94.2,
    trajectoryAngle: "Low Central",
    bodyPart: "Right Foot",
  },
  {
    id: 2,
    player: "Gabriel Martinelli",
    team: "Arsenal",
    minute: 21,
    half: "1H",
    outcome: "GOAL",
    x: 820,
    y: 130,
    xg: 0.18,
    psxg: 0.82,
    distanceMeters: 14.8,
    velocityKmh: 104.5,
    trajectoryAngle: "Top Right Corner",
    bodyPart: "Right Foot",
  },
  {
    id: 3,
    player: "David Raya",
    team: "Arsenal",
    minute: 34,
    half: "1H",
    outcome: "SAVED",
    x: 260,
    y: 380,
    xg: 0.31,
    psxg: 0.44,
    distanceMeters: 16.2,
    velocityKmh: 88.0,
    trajectoryAngle: "Bottom Left Low",
    bodyPart: "Right Foot",
  },
  {
    id: 4,
    player: "Noni Madueke",
    team: "Chelsea",
    minute: 41,
    half: "1H",
    outcome: "WIDE",
    x: 85,
    y: 280,
    xg: 0.12,
    psxg: 0.0,
    distanceMeters: 19.1,
    velocityKmh: 98.4,
    trajectoryAngle: "Wide Left Post",
    bodyPart: "Left Foot",
  },
  {
    id: 5,
    player: "Cole Palmer",
    team: "Chelsea",
    minute: 45,
    half: "1H",
    outcome: "GOAL",
    x: 185,
    y: 445,
    xg: 0.79,
    psxg: 0.94,
    distanceMeters: 11.0,
    velocityKmh: 91.2,
    trajectoryAngle: "Bottom Left Side-netting",
    bodyPart: "Left Foot",
  },
  {
    id: 6,
    player: "Robert Sánchez",
    team: "Chelsea",
    minute: 58,
    half: "2H",
    outcome: "SAVED",
    x: 560,
    y: 280,
    xg: 0.28,
    psxg: 0.38,
    distanceMeters: 13.5,
    velocityKmh: 82.6,
    trajectoryAngle: "Center Mid-Height",
    bodyPart: "Header",
  },
  {
    id: 7,
    player: "Bukayo Saka",
    team: "Arsenal",
    minute: 62,
    half: "2H",
    outcome: "GOAL",
    x: 810,
    y: 440,
    xg: 0.24,
    psxg: 0.88,
    distanceMeters: 15.4,
    velocityKmh: 101.8,
    trajectoryAngle: "Bottom Right Low",
    bodyPart: "Left Foot",
  },
  {
    id: 8,
    player: "Kai Havertz",
    team: "Arsenal",
    minute: 69,
    half: "2H",
    outcome: "POST",
    x: 500,
    y: 82,
    xg: 0.35,
    psxg: 0.52,
    distanceMeters: 10.2,
    velocityKmh: 96.0,
    trajectoryAngle: "Crossbar Deflection",
    bodyPart: "Header",
  },
  {
    id: 9,
    player: "Cole Palmer",
    team: "Chelsea",
    minute: 66,
    half: "2H",
    outcome: "BLOCKED",
    x: 680,
    y: 340,
    xg: 0.19,
    psxg: 0.22,
    distanceMeters: 17.8,
    velocityKmh: 79.5,
    trajectoryAngle: "Deflected Block",
    bodyPart: "Left Foot",
  },
  {
    id: 10,
    player: "Bukayo Saka",
    team: "Arsenal",
    minute: 28,
    half: "1H",
    outcome: "SAVED",
    x: 340,
    y: 220,
    xg: 0.16,
    psxg: 0.31,
    distanceMeters: 18.0,
    velocityKmh: 89.2,
    trajectoryAngle: "Mid Left Dive",
    bodyPart: "Left Foot",
  },
];

interface GoalShotMapProps {
  shots?: ShotEvent[];
  title?: string;
  subtitle?: string;
}

export default function GoalShotMap({
  shots = DEFAULT_SHOTS,
  title = "Goal Frame Shot Map Visualizer",
  subtitle = "Post-Shot Frame Vector Projection & 7.32m x 2.44m Spatial Telemetry",
}: GoalShotMapProps) {
  const [selectedHalf, setSelectedHalf] = useState<"ALL" | "1H" | "2H">("ALL");
  const [selectedOutcome, setSelectedOutcome] = useState<string>("ALL");
  const [selectedShotId, setSelectedShotId] = useState<number>(shots[0]?.id || 1);

  const filteredShots = shots.filter((s) => {
    if (selectedHalf !== "ALL" && s.half !== selectedHalf) return false;
    if (selectedOutcome !== "ALL" && s.outcome !== selectedOutcome) return false;
    return true;
  });

  const selectedShot = shots.find((s) => s.id === selectedShotId) || shots[0];

  return (
    <div className="product-card bg-white border border-cohere-hairline rounded-lg shadow-sm p-6">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-cohere-hairline gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cohere-coral animate-pulse" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-cohere-slate">
              OPTICAL TRACKING V4.1 // REGULATION FRAME
            </span>
          </div>
          <h3 className="font-display font-bold text-xl text-cohere-primary tracking-tight mt-0.5">
            {title}
          </h3>
          <p className="text-xs text-cohere-slate">{subtitle}</p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Half Pill Selector */}
          <div className="flex items-center bg-cohere-soft-stone rounded-full p-0.5 border border-cohere-hairline">
            {(["ALL", "1H", "2H"] as const).map((half) => (
              <button
                key={half}
                type="button"
                onClick={() => setSelectedHalf(half)}
                className={`px-3 py-1 text-xs font-mono font-medium rounded-full transition-colors ${
                  selectedHalf === half
                    ? "bg-white text-cohere-primary shadow-xs font-bold"
                    : "text-cohere-slate hover:text-cohere-primary"
                }`}
              >
                {half === "ALL" ? "Full Match" : half}
              </button>
            ))}
          </div>

          {/* Outcome Dropdown / Pills */}
          <div className="flex items-center gap-1">
            {["ALL", "GOAL", "SAVED", "POST"].map((outcome) => (
              <button
                key={outcome}
                type="button"
                onClick={() => setSelectedOutcome(outcome)}
                className={`px-2.5 py-1 text-xs font-mono rounded-full border transition-colors ${
                  selectedOutcome === outcome
                    ? outcome === "GOAL"
                      ? "bg-cohere-coral text-white border-cohere-coral font-bold"
                      : "bg-cohere-primary text-white border-cohere-primary font-bold"
                    : "bg-white text-cohere-slate border-cohere-hairline hover:bg-cohere-soft-stone"
                }`}
              >
                {outcome}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Goal Canvas + Shot Telemetry Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        {/* SVG Goal Canvas (8 cols on lg) */}
        <div className="lg:col-span-8 bg-[#faf9f7] rounded-lg border border-cohere-hairline p-4 flex flex-col justify-center relative overflow-hidden">
          <svg
            className="w-full h-auto max-h-[460px] select-none"
            id="goal-canvas"
            preserveAspectRatio="xMidYMid meet"
            viewBox="0 0 1000 560"
          >
            <defs>
              <pattern
                id="net-hex"
                width="22"
                height="22"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 11,0 L 22,6.35 L 22,19.05 L 11,25.4 L 0,19.05 L 0,6.35 Z"
                  fill="none"
                  opacity="0.65"
                  stroke="#dcd9e0"
                  strokeWidth="0.8"
                />
              </pattern>
              <radialGradient id="halo-coral" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ff7759" stopOpacity="0.9" />
                <stop offset="60%" stopColor="#ff7759" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#ff7759" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="halo-blue" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#003c33" stopOpacity="0.85" />
                <stop offset="70%" stopColor="#1863dc" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#1863dc" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Grass Pitch Base Behind Goal */}
            <rect fill="#eeece7" height="70" width="1000" x="0" y="490" />
            <line
              stroke="#d9d9dd"
              strokeDasharray="4,4"
              strokeWidth="1.5"
              x1="0"
              x2="1000"
              y1="490"
              y2="490"
            />

            {/* Goal Netting */}
            <rect fill="url(#net-hex)" height="400" width="720" x="140" y="90" />
            <line stroke="#d9d9dd" strokeWidth="1.2" x1="140" x2="210" y1="90" y2="50" />
            <line stroke="#d9d9dd" strokeWidth="1.2" x1="860" x2="790" y1="90" y2="50" />
            <line stroke="#d9d9dd" strokeWidth="1.2" x1="210" x2="790" y1="50" y2="50" />
            <line
              stroke="#d9d9dd"
              strokeDasharray="2,2"
              strokeWidth="0.8"
              x1="210"
              x2="210"
              y1="50"
              y2="490"
            />
            <line
              stroke="#d9d9dd"
              strokeDasharray="2,2"
              strokeWidth="0.8"
              x1="790"
              x2="790"
              y1="50"
              y2="490"
            />

            {/* 9-Quadrant Tactical Breakdown Guides */}
            <rect
              fill="none"
              height="406"
              stroke="#75758a"
              strokeDasharray="6,4"
              strokeWidth="0.75"
              width="728"
              x="136"
              y="86"
            />
            <line opacity="0.4" stroke="#d9d9dd" strokeWidth="0.7" x1="380" x2="380" y1="90" y2="490" />
            <line opacity="0.4" stroke="#d9d9dd" strokeWidth="0.7" x1="620" x2="620" y1="90" y2="490" />
            <line opacity="0.4" stroke="#d9d9dd" strokeWidth="0.7" x1="140" x2="860" y1="223" y2="223" />
            <line opacity="0.4" stroke="#d9d9dd" strokeWidth="0.7" x1="140" x2="860" y1="356" y2="356" />

            {/* Solid Posts and Crossbar */}
            <rect fill="#17171c" height="12" rx="3" width="736" x="132" y="82" />
            <rect fill="#17171c" height="410" rx="3" width="12" x="132" y="82" />
            <rect fill="#17171c" height="410" rx="3" width="12" x="856" y="82" />
            <rect fill="#003c33" height="6" rx="1" width="24" x="126" y="488" />
            <rect fill="#003c33" height="6" rx="1" width="24" x="850" y="488" />

            {/* Dimension Markers */}
            <g id="dimension-markers">
              {/* Width: 7.32m */}
              <line stroke="#75758a" strokeWidth="1" x1="140" x2="860" y1="40" y2="40" />
              <line stroke="#75758a" strokeWidth="1" x1="140" x2="140" y1="35" y2="45" />
              <line stroke="#75758a" strokeWidth="1" x1="860" x2="860" y1="35" y2="45" />
              <rect fill="#ffffff" height="20" rx="4" width="124" x="438" y="30" stroke="#d9d9dd" />
              <text
                fill="#17171c"
                fontFamily="Space Mono"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
                x="500"
                y="44"
              >
                7.32m (24.0 FT)
              </text>

              {/* Height: 2.44m */}
              <line stroke="#75758a" strokeWidth="1" x1="900" x2="900" y1="90" y2="490" />
              <line stroke="#75758a" strokeWidth="1" x1="895" x2="905" y1="90" y2="90" />
              <line stroke="#75758a" strokeWidth="1" x1="895" x2="905" y1="490" y2="490" />
              <rect fill="#ffffff" height="22" rx="4" width="90" x="870" y="278" stroke="#d9d9dd" />
              <text
                fill="#17171c"
                fontFamily="Space Mono"
                fontSize="10"
                fontWeight="700"
                textAnchor="middle"
                x="915"
                y="293"
              >
                2.44m (8FT)
              </text>
            </g>

            {/* Shot Nodes */}
            <g className="cursor-pointer" id="shot-nodes">
              {filteredShots.map((shot) => {
                const isSelected = shot.id === selectedShotId;
                const isGoal = shot.outcome === "GOAL";
                const isSaved = shot.outcome === "SAVED";
                const isPost = shot.outcome === "POST";
                const isWide = shot.outcome === "WIDE";
                const haloRadius = Math.max(18, Math.min(36, shot.xg * 40 + 16));

                if (isWide) {
                  return (
                    <g
                      key={shot.id}
                      className="transition-transform hover:scale-110"
                      onClick={() => setSelectedShotId(shot.id)}
                    >
                      <line
                        stroke="#75758a"
                        strokeWidth="3"
                        x1={shot.x - 12}
                        x2={shot.x + 12}
                        y1={shot.y - 12}
                        y2={shot.y + 12}
                      />
                      <line
                        stroke="#75758a"
                        strokeWidth="3"
                        x1={shot.x + 12}
                        x2={shot.x - 12}
                        y1={shot.y - 12}
                        y2={shot.y + 12}
                      />
                      <text
                        fill="#75758a"
                        fontFamily="Space Mono"
                        fontSize="9"
                        textAnchor="middle"
                        x={shot.x}
                        y={shot.y + 26}
                      >
                        {shot.player.split(" ").pop()} (W)
                      </text>
                    </g>
                  );
                }

                if (isPost) {
                  return (
                    <g
                      key={shot.id}
                      className="transition-transform hover:scale-110"
                      onClick={() => setSelectedShotId(shot.id)}
                    >
                      <line
                        stroke="#ff7759"
                        strokeWidth="3"
                        x1={shot.x - 12}
                        x2={shot.x + 12}
                        y1={shot.y - 12}
                        y2={shot.y + 12}
                      />
                      <line
                        stroke="#ff7759"
                        strokeWidth="3"
                        x1={shot.x + 12}
                        x2={shot.x - 12}
                        y1={shot.y - 12}
                        y2={shot.y + 12}
                      />
                      <circle
                        cx={shot.x}
                        cy={shot.y}
                        fill="none"
                        r="18"
                        stroke="#ff7759"
                        strokeDasharray="3,3"
                        strokeWidth="1.5"
                      />
                      <text
                        fill="#ff7759"
                        fontFamily="Space Mono"
                        fontSize="9"
                        fontWeight="700"
                        textAnchor="middle"
                        x={shot.x}
                        y={shot.y - 18}
                      >
                        {shot.player.split(" ").pop()} (BAR)
                      </text>
                    </g>
                  );
                }

                return (
                  <g
                    key={shot.id}
                    className="transition-transform hover:scale-110"
                    onClick={() => setSelectedShotId(shot.id)}
                  >
                    {/* Glow Halo */}
                    <circle
                      cx={shot.x}
                      cy={shot.y}
                      fill={isGoal ? "url(#halo-coral)" : "url(#halo-blue)"}
                      r={haloRadius}
                    />

                    {/* Shot Token Circle */}
                    <circle
                      cx={shot.x}
                      cy={shot.y}
                      fill={isGoal ? "#ff7759" : isSaved ? "#003c33" : "#17171c"}
                      r={isSelected ? 16 : 13}
                      stroke={isSelected ? "#ffffff" : "#ffffff"}
                      strokeWidth={isSelected ? "3.5" : "2"}
                    />

                    {/* Node Text */}
                    <text
                      fill="#ffffff"
                      fontFamily="Space Grotesk"
                      fontSize={isSelected ? "11" : "9"}
                      fontWeight="700"
                      textAnchor="middle"
                      x={shot.x}
                      y={shot.y + (isSelected ? 4 : 3)}
                    >
                      {isGoal ? "G" : isSaved ? "S" : "B"}
                    </text>

                    {/* Label below */}
                    <text
                      fill="#17171c"
                      fontFamily="Space Mono"
                      fontSize="9"
                      fontWeight={isSelected ? "700" : "500"}
                      textAnchor="middle"
                      x={shot.x}
                      y={shot.y + 26}
                    >
                      {shot.player.split(" ").pop()} {shot.minute}&apos;
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Quick Legend Bar */}
          <div className="flex items-center justify-between text-[11px] font-mono text-cohere-slate pt-3 border-t border-cohere-hairline mt-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cohere-coral inline-block" />
                Goal (G)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full bg-cohere-deep-green inline-block" />
                Saved (S)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-full border border-cohere-coral inline-block" />
                Woodwork
              </span>
            </div>
            <span>Radius = xG Volume</span>
          </div>
        </div>

        {/* Shot Telemetry Inspector Panel (4 cols on lg) */}
        {selectedShot && (
          <div className="lg:col-span-4 flex flex-col justify-between bg-cohere-soft-stone rounded-lg p-5 border border-cohere-hairline">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-cohere-hairline">
                <span className="font-mono text-[10px] text-cohere-slate uppercase tracking-wider">
                  POST-SHOT VECTOR TELEMETRY
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    selectedShot.outcome === "GOAL"
                      ? "bg-cohere-coral text-white"
                      : selectedShot.outcome === "SAVED"
                      ? "bg-cohere-deep-green text-white"
                      : "bg-white text-cohere-primary border border-cohere-hairline"
                  }`}
                >
                  {selectedShot.outcome}
                </span>
              </div>

              {/* Player and timing */}
              <div className="mt-4">
                <h4 className="font-display font-bold text-lg text-cohere-primary leading-tight">
                  {selectedShot.player}
                </h4>
                <div className="flex items-center gap-2 mt-1 text-xs font-mono text-cohere-slate">
                  <span>{selectedShot.team}</span>
                  <span>•</span>
                  <span>Minute {selectedShot.minute}&apos; ({selectedShot.half})</span>
                  <span>•</span>
                  <span>{selectedShot.bodyPart}</span>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="bg-white p-3 rounded border border-cohere-hairline">
                  <span className="text-[10px] font-mono text-cohere-slate uppercase">
                    Expected Goals (xG)
                  </span>
                  <div className="text-xl font-display font-bold text-cohere-primary mt-0.5">
                    {selectedShot.xg.toFixed(2)}
                  </div>
                  <span className="text-[10px] font-mono text-cohere-slate">
                    Pre-shot probability
                  </span>
                </div>

                <div className="bg-white p-3 rounded border border-cohere-hairline">
                  <span className="text-[10px] font-mono text-cohere-slate uppercase">
                    Post-Shot xG (PSxG)
                  </span>
                  <div className="text-xl font-display font-bold text-cohere-coral mt-0.5">
                    {selectedShot.psxg.toFixed(2)}
                  </div>
                  <span className="text-[10px] font-mono font-semibold text-cohere-deep-green">
                    {selectedShot.psxg >= selectedShot.xg ? "+" : ""}
                    {(selectedShot.psxg - selectedShot.xg).toFixed(2)} Added Value
                  </span>
                </div>

                <div className="bg-white p-3 rounded border border-cohere-hairline">
                  <span className="text-[10px] font-mono text-cohere-slate uppercase">
                    Shot Distance
                  </span>
                  <div className="text-lg font-display font-bold text-cohere-primary mt-0.5">
                    {selectedShot.distanceMeters.toFixed(1)}m
                  </div>
                  <span className="text-[10px] font-mono text-cohere-slate">
                    To center goal line
                  </span>
                </div>

                <div className="bg-white p-3 rounded border border-cohere-hairline">
                  <span className="text-[10px] font-mono text-cohere-slate uppercase">
                    Exit Velocity
                  </span>
                  <div className="text-lg font-display font-bold text-cohere-primary mt-0.5">
                    {selectedShot.velocityKmh.toFixed(1)} km/h
                  </div>
                  <span className="text-[10px] font-mono text-cohere-slate">
                    High-speed release
                  </span>
                </div>
              </div>

              {/* Trajectory vector */}
              <div className="mt-4 p-3 bg-white rounded border border-cohere-hairline">
                <div className="text-[10px] font-mono text-cohere-slate uppercase">
                  Goal Frame Placement
                </div>
                <div className="text-xs font-semibold text-cohere-primary mt-1">
                  {selectedShot.trajectoryAngle}
                </div>
              </div>
            </div>

            {/* Bottom note */}
            <div className="mt-4 pt-3 border-t border-cohere-hairline flex items-center justify-between text-[11px] font-mono text-cohere-slate">
              <span>Shot Event ID: #{selectedShot.id}</span>
              <span className="text-cohere-coral font-semibold">Optical Calibrated</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
