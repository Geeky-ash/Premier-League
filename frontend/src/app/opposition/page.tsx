"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Compass,
  Shield,
  Layers,
  Crosshair,
  TrendingDown,
  Info,
  ChevronDown,
  Target,
} from "lucide-react";
import { fetchOppositionAgainst, fetchClubs, OppositionConcededTeam } from "@/lib/api";
import { getClubCrest } from "@/lib/logos";

const POSITIONS = ["ST", "LW", "RW", "CAM", "CM", "LB", "RB", "CB"];
const FORMATIONS = ["4-3-3", "4-2-3-1", "3-5-2"];

export default function OppositionAgainstPage() {
  const [clubs, setClubs] = useState<string[]>([]);
  const [selectedClub, setSelectedClub] = useState<string>("Arsenal");
  const [teamData, setTeamData] = useState<OppositionConcededTeam | null>(null);
  const [selectedFormation, setSelectedFormation] = useState<string>("4-3-3");
  const [highlightedPos, setHighlightedPos] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchClubs()
      .then((data) => {
        setClubs(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedClub) return;
    setLoading(true);
    fetchOppositionAgainst(selectedClub)
      .then((res: any) => {
        setTeamData(res);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedClub]);

  // Positional coordinates on a tactical football pitch layout
  const pitchCoords: Record<string, { top: string; left: string; label: string }> = {
    ST: { top: "18%", left: "50%", label: "Striker (ST)" },
    LW: { top: "25%", left: "18%", label: "Left Winger (LW)" },
    RW: { top: "25%", left: "82%", label: "Right Winger (RW)" },
    CAM: { top: "38%", left: "50%", label: "Attacking Mid (CAM)" },
    CM: { top: "54%", left: "50%", label: "Central Mid (CM)" },
    LB: { top: "72%", left: "20%", label: "Left Back (LB)" },
    CB: { top: "76%", left: "50%", label: "Centre Back (CB)" },
    RB: { top: "72%", left: "80%", label: "Right Back (RB)" },
  };

  const currentPosStat = highlightedPos && teamData ? teamData.positions[highlightedPos] : null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pl-cyan">
            <Compass size={14} /> Tactical Profiler // Opposition Analysis
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2">
            Opposition & Against Conceded Analytics
          </h2>
          <p className="text-sm text-pl-text-muted mt-1">
            Detect tactical vulnerabilities: analyze shots, tackles, and key passes conceded by opposition position & formation.
          </p>
        </div>

        {/* Club Selector */}
        <div className="flex items-center gap-3 bg-slate-900/80 p-2 rounded-2xl border border-white/10 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 p-1 flex items-center justify-center">
            <Image
              src={getClubCrest(selectedClub)}
              alt={selectedClub}
              width={30}
              height={30}
              unoptimized
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-pl-text-muted uppercase block">
              Analyze Opponent
            </label>
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="bg-transparent text-sm font-extrabold text-white cursor-pointer focus:outline-none"
            >
              {clubs.map((c) => (
                <option key={c} value={c} className="bg-slate-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Defensive KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="pl-card bg-slate-900/60 border-white/10">
          <div className="stat-label">Defensive Resilience Rating</div>
          <div className="text-2xl font-black text-pl-green mt-1">
            {teamData ? `${teamData.overall_defensive_rating} / 10.0` : "—"}
          </div>
          <div className="text-xs text-pl-text-muted mt-1">Lower conceded rate against league average</div>
        </div>
        <div className="pl-card bg-slate-900/60 border-white/10">
          <div className="stat-label">Opponent Expected Shots Faced</div>
          <div className="text-2xl font-black text-pl-cyan mt-1">
            {teamData?.formations[selectedFormation]?.expected_shots_against || "12.4"} / game
          </div>
          <div className="text-xs text-pl-text-muted mt-1">Against {selectedFormation} formation</div>
        </div>
        <div className="pl-card bg-slate-900/60 border-white/10">
          <div className="stat-label">Primary Vulnerability Zone</div>
          <div className="text-2xl font-black text-pl-magenta mt-1">
            {teamData?.formations[selectedFormation]?.weak_zone || "Left Half-Space"}
          </div>
          <div className="text-xs text-pl-text-muted mt-1">Highest shot creation density conceded</div>
        </div>
      </div>

      {/* Tactical Pitch & Heatmap Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pitch Diagram (7 cols) */}
        <div className="lg:col-span-7 pl-card p-6 bg-slate-900/70 border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-pl-green" />
              <span>Tactical Formation & Positional Heatmap</span>
            </div>
            {/* Formation Pills */}
            <div className="flex gap-1.5 bg-slate-950 p-1 rounded-xl border border-white/5">
              {FORMATIONS.map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormation(fmt)}
                  className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all ${
                    selectedFormation === fmt
                      ? "bg-pl-green text-slate-950"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Pitch Board */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border-2 border-white/15 bg-gradient-to-b from-emerald-950/80 via-emerald-900/50 to-emerald-950/90 shadow-2xl">
            {/* Pitch Markings */}
            <div className="absolute inset-4 border-2 border-white/20 rounded-xl pointer-events-none" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-white/20 border-t-0 rounded-b-xl pointer-events-none" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-10 border-2 border-white/20 border-t-0 rounded-b-lg pointer-events-none" />
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/20 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-white/20 pointer-events-none" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-24 border-2 border-white/20 border-b-0 rounded-t-xl pointer-events-none" />

            {/* Position Nodes */}
            {POSITIONS.map((pos) => {
              const coords = pitchCoords[pos];
              if (!coords) return null;
              const posStat = teamData?.positions[pos];
              const score = posStat?.vulnerability_score || 5.0;
              const isSelected = highlightedPos === pos;

              // Color gradient by vulnerability score
              const bgColor =
                score >= 7.5
                  ? "bg-pl-magenta shadow-pl-magenta/50 text-white"
                  : score >= 5.5
                  ? "bg-amber-400 text-slate-950 shadow-amber-400/30"
                  : "bg-pl-green text-slate-950 shadow-pl-green/30";

              return (
                <button
                  key={pos}
                  type="button"
                  style={{ top: coords.top, left: coords.left }}
                  onClick={() => setHighlightedPos(isSelected ? null : pos)}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all group z-10 ${
                    isSelected ? "scale-125 ring-4 ring-white" : "hover:scale-110"
                  }`}
                  title={`${coords.label}: ${score}/10 Vulnerability`}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex flex-col items-center justify-center font-black text-xs shadow-xl border-2 border-white/30 transition-transform ${bgColor}`}
                  >
                    <span>{pos}</span>
                  </div>
                  <div className="text-[9px] font-extrabold text-white bg-slate-950/80 px-1 rounded mt-0.5 tracking-tight border border-white/10 whitespace-nowrap">
                    {posStat ? `${posStat.shots_conceded_per_game} sh` : ""}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-pl-text-muted pt-1">
            <span>Click any position node to inspect tactical matchup levers</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pl-magenta" /> High Vulnerability
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Moderate
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-pl-green" /> Solid Zone
              </span>
            </div>
          </div>
        </div>

        {/* Positional Inspector Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="pl-card bg-slate-900/70 border-white/10 p-5 rounded-2xl shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <Target size={14} className="text-pl-cyan" />
                <span>
                  {highlightedPos
                    ? pitchCoords[highlightedPos]?.label
                    : "Select Position on Pitch"}
                </span>
              </div>
              {highlightedPos && (
                <button
                  type="button"
                  onClick={() => setHighlightedPos(null)}
                  className="text-[11px] text-pl-text-muted hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {currentPosStat ? (
              <div className="mt-4 space-y-4">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-white/5 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-pl-text-muted uppercase font-bold">
                      Zone Exploit Rating
                    </span>
                    <div className="text-xl font-black text-pl-magenta">
                      {currentPosStat.vulnerability_score} / 10.0
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-slate-300">Target Matchup</span>
                    <div className="text-[11px] text-pl-green font-semibold">
                      Exploit against {selectedClub}&apos;s defense
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-pl-text-secondary">Shots Conceded</span>
                      <span className="font-extrabold text-white">
                        {currentPosStat.shots_conceded_per_game} / game
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-pl-green h-full rounded-full"
                        style={{ width: `${Math.min(100, currentPosStat.shots_conceded_per_game * 25)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-pl-text-secondary">Key Passes Allowed</span>
                      <span className="font-extrabold text-white">
                        {currentPosStat.key_passes_conceded_per_game} / game
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-pl-cyan h-full rounded-full"
                        style={{ width: `${Math.min(100, currentPosStat.key_passes_conceded_per_game * 35)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/50 border border-white/5">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-pl-text-secondary">Tackles Conceded against Position</span>
                      <span className="font-extrabold text-white">
                        {currentPosStat.tackles_conceded_per_game} / game
                      </span>
                    </div>
                    <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-pl-magenta h-full rounded-full"
                        style={{ width: `${Math.min(100, currentPosStat.tackles_conceded_per_game * 16)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-pl-text-muted space-y-2">
                <Info size={24} className="mx-auto text-pl-cyan opacity-60" />
                <p>Click on ST, LW, RW, CAM, CM, LB, CB, or RB on the pitch diagram to inspect conceded metric breakdowns.</p>
              </div>
            )}
          </div>

          {/* All Positions Overview List */}
          <div className="pl-card bg-slate-900/70 border-white/10 p-4 rounded-2xl shadow-xl">
            <div className="text-xs font-bold text-white uppercase tracking-wider mb-2.5">
              Positional Conceded Rankings
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {POSITIONS.map((p) => {
                const s = teamData?.positions[p];
                if (!s) return null;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setHighlightedPos(p)}
                    className={`w-full p-2 rounded-xl text-left flex items-center justify-between transition-colors border ${
                      highlightedPos === p
                        ? "bg-pl-purple border-pl-green"
                        : "bg-slate-950/40 border-white/5 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white w-7 text-center rounded bg-white/10 py-0.5">
                        {p}
                      </span>
                      <span className="text-xs text-slate-300">
                        {pitchCoords[p]?.label.split(" ")[0]}
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{s.shots_conceded_per_game} shots</span>
                      <span className="text-[10px] font-black text-pl-magenta px-1.5 py-0.5 rounded bg-pl-magenta/10 border border-pl-magenta/20">
                        {s.vulnerability_score}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
