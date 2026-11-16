"use client";

import React, { useState } from "react";
import { Sliders, Eye, Layers } from "lucide-react";

export interface PitchPlayer {
  id: number;
  name: string;
  number: number;
  team: "home" | "away";
  teamName: string;
  position: string;
  xPercent: number; // 0 to 100%
  yPercent: number; // 0 to 100%
  stats: string;
}

const DEFAULT_HOME_PLAYERS: PitchPlayer[] = [
  { id: 1, name: "Sánchez", number: 1, team: "home", teamName: "Chelsea", position: "GK", xPercent: 6, yPercent: 50, stats: "Pass Acc: 84% | Saves: 4" },
  { id: 2, name: "Gusto", number: 27, team: "home", teamName: "Chelsea", position: "RB", xPercent: 21, yPercent: 82, stats: "Tackles: 4/5 | 9.1km" },
  { id: 3, name: "Fofana", number: 29, team: "home", teamName: "Chelsea", position: "CB", xPercent: 18, yPercent: 62, stats: "Interceptions: 3 | Duels: 7/8" },
  { id: 4, name: "Colwill", number: 6, team: "home", teamName: "Chelsea", position: "CB", xPercent: 18, yPercent: 38, stats: "Prog Passes: 7 | Long: 5/6" },
  { id: 5, name: "Cucurella", number: 3, team: "home", teamName: "Chelsea", position: "LB", xPercent: 21, yPercent: 18, stats: "Recoveries: 6 | Crosses: 2" },
  { id: 6, name: "Caicedo", number: 25, team: "home", teamName: "Chelsea", position: "DM", xPercent: 32, yPercent: 42, stats: "Duels Won: 9 | Tackles: 5" },
  { id: 7, name: "Lavia", number: 45, team: "home", teamName: "Chelsea", position: "CM", xPercent: 33, yPercent: 65, stats: "Pass Acc: 91% | Intercepts: 2" },
  { id: 8, name: "Palmer", number: 10, team: "home", teamName: "Chelsea", position: "AM", xPercent: 44, yPercent: 52, stats: "xG: 0.79 | Key Passes: 4" },
  { id: 9, name: "Madueke", number: 11, team: "home", teamName: "Chelsea", position: "RW", xPercent: 46, yPercent: 85, stats: "Take-ons: 3/4 | Shots: 2" },
  { id: 10, name: "Neto", number: 7, team: "home", teamName: "Chelsea", position: "LW", xPercent: 45, yPercent: 15, stats: "Sprints: 24 | Crosses: 3" },
  { id: 11, name: "Jackson", number: 15, team: "home", teamName: "Chelsea", position: "ST", xPercent: 48, yPercent: 50, stats: "Goals: 1 | Pressures: 18" },
];

const DEFAULT_AWAY_PLAYERS: PitchPlayer[] = [
  { id: 12, name: "Raya", number: 22, team: "away", teamName: "Arsenal", position: "GK", xPercent: 94, yPercent: 50, stats: "Pass Acc: 78% | Saves: 3" },
  { id: 13, name: "White", number: 4, team: "away", teamName: "Arsenal", position: "RB", xPercent: 78, yPercent: 18, stats: "Recoveries: 5 | Passes: 48" },
  { id: 14, name: "Saliba", number: 2, team: "away", teamName: "Arsenal", position: "CB", xPercent: 82, yPercent: 38, stats: "Duels: 5/5 | Aer: 4/4" },
  { id: 15, name: "Gabriel", number: 6, team: "away", teamName: "Arsenal", position: "CB", xPercent: 82, yPercent: 62, stats: "Clearances: 7 | Blocks: 3" },
  { id: 16, name: "Timber", number: 12, team: "away", teamName: "Arsenal", position: "LB", xPercent: 78, yPercent: 82, stats: "Tackles: 3/4 | Seam Gap: 14m" },
  { id: 17, name: "Partey", number: 5, team: "away", teamName: "Arsenal", position: "DM", xPercent: 68, yPercent: 55, stats: "Pass Acc: 89% | Duels: 6" },
  { id: 18, name: "Rice", number: 41, team: "away", teamName: "Arsenal", position: "CM", xPercent: 66, yPercent: 35, stats: "Prog Runs: 4 | Tackles: 4" },
  { id: 19, name: "Ødegaard", number: 8, team: "away", teamName: "Arsenal", position: "AM", xPercent: 57, yPercent: 28, stats: "xG+xA: 0.65 | Key Passes: 5" },
  { id: 20, name: "Saka", number: 7, team: "away", teamName: "Arsenal", position: "RW", xPercent: 54, yPercent: 15, stats: "Goals: 1 | Box Touches: 8" },
  { id: 21, name: "Martinelli", number: 11, team: "away", teamName: "Arsenal", position: "LW", xPercent: 54, yPercent: 85, stats: "Goals: 1 | Fast Breaks: 3" },
  { id: 22, name: "Havertz", number: 29, team: "away", teamName: "Arsenal", position: "ST", xPercent: 52, yPercent: 50, stats: "Aerial Duels: 6/9 | Woodwork: 1" },
];

interface PitchCanvasProps {
  homeTeamName?: string;
  awayTeamName?: string;
  homeScore?: number;
  awayScore?: number;
  matchMinute?: string;
}

export default function PitchCanvas({
  homeTeamName = "Chelsea",
  awayTeamName = "Arsenal",
  homeScore = 2,
  awayScore = 2,
  matchMinute = "74'",
}: PitchCanvasProps) {
  const [showChannels, setShowChannels] = useState(true);
  const [showPassLines, setShowPassLines] = useState(true);
  const [showHeatZones, setShowHeatZones] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<PitchPlayer | null>(null);

  const allPlayers = [...DEFAULT_HOME_PLAYERS, ...DEFAULT_AWAY_PLAYERS];

  return (
    <div className="product-card bg-white border border-cohere-hairline rounded-lg shadow-sm p-6">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-cohere-hairline gap-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cohere-coral animate-pulse" />
            <span className="font-mono text-xs font-bold text-cohere-coral uppercase tracking-wider">
              {matchMinute} LIVE
            </span>
          </div>
          <div className="flex items-center gap-3 font-display font-bold text-lg text-cohere-primary">
            <span>{homeTeamName}</span>
            <span className="px-2 py-0.5 rounded bg-cohere-soft-stone font-mono text-sm">
              {homeScore} : {awayScore}
            </span>
            <span>{awayTeamName}</span>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowChannels(!showChannels)}
            className={`px-3 py-1 rounded-full text-xs font-mono font-medium border transition-colors ${
              showChannels
                ? "bg-cohere-primary text-white border-cohere-primary"
                : "bg-white text-cohere-slate border-cohere-hairline hover:bg-cohere-soft-stone"
            }`}
          >
            5 Channels
          </button>
          <button
            type="button"
            onClick={() => setShowPassLines(!showPassLines)}
            className={`px-3 py-1 rounded-full text-xs font-mono font-medium border transition-colors ${
              showPassLines
                ? "bg-cohere-primary text-white border-cohere-primary"
                : "bg-white text-cohere-slate border-cohere-hairline hover:bg-cohere-soft-stone"
            }`}
          >
            Passing Vectors
          </button>
          <button
            type="button"
            onClick={() => setShowHeatZones(!showHeatZones)}
            className={`px-3 py-1 rounded-full text-xs font-mono font-medium border transition-colors ${
              showHeatZones
                ? "bg-cohere-coral text-white border-cohere-coral"
                : "bg-white text-cohere-slate border-cohere-hairline hover:bg-cohere-soft-stone"
            }`}
          >
            Overload Zones
          </button>
        </div>
      </div>

      {/* Main Pitch Wrapper */}
      <div className="relative w-full aspect-[1050/680] mt-6 bg-[#f7f6f2] rounded-lg border border-cohere-hairline overflow-hidden select-none">
        {/* SVG Regulation Pitch Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          preserveAspectRatio="none"
          viewBox="0 0 1050 680"
        >
          <defs>
            <marker
              id="arrow-home"
              markerHeight="6"
              markerWidth="6"
              orient="auto-start-reverse"
              refX="6"
              refY="5"
              viewBox="0 0 10 10"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#003c33" />
            </marker>
            <marker
              id="arrow-away"
              markerHeight="6"
              markerWidth="6"
              orient="auto-start-reverse"
              refX="6"
              refY="5"
              viewBox="0 0 10 10"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#ff7759" />
            </marker>

            {/* Overload Glows */}
            <radialGradient id="homeGlow" cx="28%" cy="25%" r="20%">
              <stop offset="0%" stopColor="#003c33" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#003c33" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="awayGlow" cx="80%" cy="80%" r="22%">
              <stop offset="0%" stopColor="#ff7759" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ff7759" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Overload Glow Ellipses */}
          {showHeatZones && (
            <>
              <ellipse cx="320" cy="180" fill="url(#homeGlow)" rx="140" ry="100" />
              <ellipse cx="820" cy="520" fill="url(#awayGlow)" rx="130" ry="110" />
            </>
          )}

          {/* Regulation Pitch Markings */}
          <g fill="none" stroke="#d9d9dd" strokeWidth="2">
            <rect height="630" width="1000" x="25" y="25" />
            <line x1="525" x2="525" y1="25" y2="655" />
            <circle cx="525" cy="340" r="91.5" />
            <circle cx="525" cy="340" fill="#d9d9dd" r="2.5" />

            {/* Left Penalty Area */}
            <rect height="390" width="165" x="25" y="145" />
            <rect height="190" width="55" x="25" y="245" />
            <circle cx="135" cy="340" fill="#d9d9dd" r="2.5" />
            <path d="M 190 270 A 91.5 91.5 0 0 1 190 410" />

            {/* Right Penalty Area */}
            <rect height="390" width="165" x="860" y="145" />
            <rect height="190" width="55" x="970" y="245" />
            <circle cx="915" cy="340" fill="#d9d9dd" r="2.5" />
            <path d="M 860 270 A 91.5 91.5 0 0 0 860 410" />
          </g>

          {/* Passing Vectors */}
          {showPassLines && (
            <g opacity="0.65">
              {/* Home vectors */}
              <line
                x1="336"
                y1="285"
                x2="462"
                y2="353"
                stroke="#003c33"
                strokeWidth="2.5"
                markerEnd="url(#arrow-home)"
              />
              <line
                x1="462"
                y1="353"
                x2="504"
                y2="340"
                stroke="#003c33"
                strokeWidth="3"
                markerEnd="url(#arrow-home)"
              />
              {/* Away vectors */}
              <line
                x1="714"
                y1="374"
                x2="598"
                y2="190"
                stroke="#ff7759"
                strokeWidth="2.5"
                markerEnd="url(#arrow-away)"
              />
              <line
                x1="598"
                y1="190"
                x2="567"
                y2="102"
                stroke="#ff7759"
                strokeWidth="3"
                markerEnd="url(#arrow-away)"
              />
            </g>
          )}
        </svg>

        {/* 5 Channels Overlay */}
        {showChannels && (
          <div className="absolute inset-0 grid grid-cols-5 pointer-events-none opacity-40">
            <div className="border-r border-dashed border-[#75758a] h-full flex items-start justify-center pt-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-cohere-slate">
                Left Flank
              </span>
            </div>
            <div className="border-r border-dashed border-[#75758a] h-full flex items-start justify-center pt-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-cohere-slate">
                Half Space L
              </span>
            </div>
            <div className="border-r border-dashed border-[#75758a] h-full flex items-start justify-center pt-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-cohere-slate">
                Central Channel
              </span>
            </div>
            <div className="border-r border-dashed border-[#75758a] h-full flex items-start justify-center pt-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-cohere-slate">
                Half Space R
              </span>
            </div>
            <div className="h-full flex items-start justify-center pt-2">
              <span className="font-mono text-[9px] uppercase tracking-wider text-cohere-slate">
                Right Flank
              </span>
            </div>
          </div>
        )}

        {/* Interactive Player Pins Layer */}
        <div className="absolute inset-0 pointer-events-auto">
          {allPlayers.map((player) => {
            const isHome = player.team === "home";
            const isSelected = selectedPlayer?.id === player.id;

            return (
              <div
                key={player.id}
                onClick={() => setSelectedPlayer(player)}
                style={{
                  left: `${player.xPercent}%`,
                  top: `${player.yPercent}%`,
                }}
                className="group absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-transform hover:scale-125"
              >
                {/* Circle Pin */}
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-[11px] font-bold shadow-md border-2 ${
                    isHome
                      ? "bg-cohere-deep-green text-white border-white"
                      : "bg-cohere-coral text-white border-white"
                  } ${isSelected ? "ring-2 ring-cohere-primary scale-110" : ""}`}
                >
                  {player.number}
                </div>

                {/* Name Label */}
                <span className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap font-mono text-[9px] font-bold text-cohere-primary bg-white/95 px-1 rounded shadow-xs border border-cohere-hairline">
                  {player.name}
                </span>

                {/* Hover Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 pointer-events-none absolute bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap bg-cohere-primary text-white text-[10px] font-mono p-1.5 rounded shadow-lg transition-opacity z-30">
                  <div className="font-bold">{player.teamName} #{player.number} {player.name} ({player.position})</div>
                  <div className="text-cohere-hairline">{player.stats}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Tactical Compactness Indicators */}
        <div className="absolute left-[34%] bottom-2 bg-white/90 px-2 py-0.5 rounded border border-cohere-hairline font-mono text-[10px] font-semibold text-cohere-deep-green shadow-xs">
          CFC Compactness: 34.2m
        </div>
        <div className="absolute right-[34%] bottom-2 bg-white/90 px-2 py-0.5 rounded border border-cohere-hairline font-mono text-[10px] font-semibold text-cohere-coral shadow-xs">
          ARS Compactness: 38.6m
        </div>
      </div>

      {/* Selected Player Detail Card (if clicked) */}
      {selectedPlayer && (
        <div className="mt-4 p-4 rounded bg-cohere-soft-stone border border-cohere-hairline flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-mono font-bold ${
                selectedPlayer.team === "home" ? "bg-cohere-deep-green" : "bg-cohere-coral"
              }`}
            >
              #{selectedPlayer.number}
            </div>
            <div>
              <div className="font-display font-bold text-base text-cohere-primary">
                {selectedPlayer.name} ({selectedPlayer.position})
              </div>
              <div className="text-xs font-mono text-cohere-slate">
                {selectedPlayer.teamName} • {selectedPlayer.stats}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelectedPlayer(null)}
            className="text-xs font-mono text-cohere-slate hover:text-cohere-primary px-2 py-1 rounded bg-white border border-cohere-hairline"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
}
