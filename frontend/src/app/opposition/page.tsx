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
    <div className="space-y-8 animate-fade-in font-body text-cohere-ink">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cohere-coral">
            <Compass size={14} /> Tactical Profiler // Opposition Analysis
          </div>
          <h2 className="text-3xl font-display font-medium text-cohere-primary tracking-tight mt-1 flex items-center gap-2">
            Opposition & Against Conceded Analytics
          </h2>
          <p className="text-sm text-cohere-body-muted mt-1 max-w-2xl">
            Detect tactical vulnerabilities: analyze shots, tackles, and key passes conceded by opposition position & formation.
          </p>
        </div>

        {/* Club Selector */}
        <div className="flex items-center gap-3 bg-white p-2.5 rounded-lg border border-cohere-hairline shrink-0 shadow-sm">
          <div className="w-10 h-10 rounded-sm bg-cohere-soft-stone border border-cohere-hairline p-1 flex items-center justify-center">
            <Image
              src={getClubCrest(selectedClub)}
              alt={selectedClub}
              width={30}
              height={30}
              unoptimized
            />
          </div>
          <div>
            <label className="text-[10px] font-mono font-bold text-cohere-muted uppercase block">
              Analyze Opponent
            </label>
            <select
              value={selectedClub}
              onChange={(e) => setSelectedClub(e.target.value)}
              className="bg-transparent text-sm font-bold text-cohere-primary cursor-pointer focus:outline-none"
            >
              {clubs.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Defensive KPI Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="cohere-card-white">
          <div className="text-xs uppercase font-mono tracking-wider font-bold text-cohere-muted">Defensive Resilience Rating</div>
          <div className="text-2xl font-bold font-mono text-cohere-coral mt-1">
            {teamData ? `${teamData.overall_defensive_rating} / 10.0` : "—"}
          </div>
          <div className="text-xs text-cohere-slate mt-1">Lower conceded rate against league average</div>
        </div>
        <div className="cohere-card-white">
          <div className="text-xs uppercase font-mono tracking-wider font-bold text-cohere-muted">Opponent Expected Shots Faced</div>
          <div className="text-2xl font-bold font-mono text-cohere-action-blue mt-1">
            {teamData?.formations[selectedFormation]?.expected_shots_against || "12.4"} / game
          </div>
          <div className="text-xs text-cohere-slate mt-1">Against {selectedFormation} formation</div>
        </div>
        <div className="cohere-card-white">
          <div className="text-xs uppercase font-mono tracking-wider font-bold text-cohere-muted">Primary Vulnerability Zone</div>
          <div className="text-2xl font-bold text-cohere-primary mt-1">
            {teamData?.formations[selectedFormation]?.weak_zone || "Left Half-Space"}
          </div>
          <div className="text-xs text-cohere-slate mt-1">Highest shot creation density conceded</div>
        </div>
      </div>

      {/* Tactical Pitch & Heatmap Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pitch Diagram (7 cols) */}
        <div className="lg:col-span-7 product-card p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-xs font-mono font-bold text-cohere-primary uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-cohere-coral" />
              <span>Tactical Formation & Positional Heatmap</span>
            </div>
            {/* Formation Pills */}
            <div className="flex gap-1.5 bg-white p-1 rounded-pill border border-cohere-hairline">
              {FORMATIONS.map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setSelectedFormation(fmt)}
                  className={`px-3 py-1 text-xs font-mono font-bold rounded-pill transition-all ${
                    selectedFormation === fmt
                      ? "bg-cohere-primary text-white"
                      : "text-cohere-muted hover:text-cohere-ink"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Pitch Board */}
          <div className="relative w-full aspect-[4/3] rounded-lg overflow-hidden border border-cohere-deep-green/40 bg-[#003c33] shadow-md">
            {/* Pitch Markings */}
            <div className="absolute inset-4 border border-white/25 rounded-md pointer-events-none" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-48 h-24 border border-white/25 border-t-0 rounded-b-md pointer-events-none" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-10 border border-white/25 border-t-0 rounded-b-sm pointer-events-none" />
            <div className="absolute top-1/2 left-4 right-4 h-px bg-white/25 -translate-y-1/2 pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border border-white/25 pointer-events-none" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-48 h-24 border border-white/25 border-b-0 rounded-t-md pointer-events-none" />

            {/* Position Nodes */}
            {POSITIONS.map((pos) => {
              const coords = pitchCoords[pos];
              if (!coords) return null;
              const posStat = teamData?.positions[pos];
              const score = posStat?.vulnerability_score || 5.0;
              const isSelected = highlightedPos === pos;

              // Color badge by vulnerability score
              const bgColor =
                score >= 7.5
                  ? "bg-cohere-coral text-white"
                  : score >= 5.5
                  ? "bg-white text-cohere-primary"
                  : "bg-cohere-pale-green text-cohere-deep-green";

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
                    className={`w-10 h-10 rounded-full flex flex-col items-center justify-center font-bold font-mono text-xs shadow-md border border-white/40 transition-transform ${bgColor}`}
                  >
                    <span>{pos}</span>
                  </div>
                  <div className="text-[9px] font-mono font-bold text-white bg-cohere-primary/90 px-1 rounded mt-0.5 tracking-tight border border-white/20 whitespace-nowrap">
                    {posStat ? `${posStat.shots_conceded_per_game} sh` : ""}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-cohere-slate pt-1 font-mono">
            <span>Click any position node to inspect tactical matchup levers</span>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cohere-coral" /> High Vulnerability
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-white border border-cohere-hairline" /> Moderate
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-cohere-pale-green border border-cohere-deep-green/30" /> Solid Zone
              </span>
            </div>
          </div>
        </div>

        {/* Positional Inspector Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="cohere-card-white p-5">
            <div className="flex items-center justify-between pb-3 border-b border-cohere-hairline">
              <div className="text-xs font-mono font-bold text-cohere-primary uppercase tracking-wider flex items-center gap-1.5">
                <Target size={14} className="text-cohere-coral" />
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
                  className="text-[11px] font-mono text-cohere-coral hover:underline"
                >
                  Clear
                </button>
              )}
            </div>

            {currentPosStat ? (
              <div className="mt-4 space-y-4">
                <div className="p-3.5 rounded-lg bg-cohere-soft-stone border border-cohere-hairline flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono text-cohere-muted uppercase font-bold">
                      Zone Exploit Rating
                    </span>
                    <div className="text-2xl font-bold font-mono text-cohere-coral">
                      {currentPosStat.vulnerability_score} / 10.0
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-cohere-primary">Target Matchup</span>
                    <div className="text-[11px] text-cohere-coral font-medium">
                      Exploit against {selectedClub}&apos;s defense
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-sm bg-cohere-soft-stone/40 border border-cohere-hairline">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-cohere-ink font-medium">Shots Conceded</span>
                      <span className="font-bold font-mono text-cohere-primary">
                        {currentPosStat.shots_conceded_per_game} / game
                      </span>
                    </div>
                    <div className="w-full bg-cohere-soft-stone h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-cohere-coral h-full rounded-full"
                        style={{ width: `${Math.min(100, currentPosStat.shots_conceded_per_game * 25)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-sm bg-cohere-soft-stone/40 border border-cohere-hairline">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-cohere-ink font-medium">Key Passes Allowed</span>
                      <span className="font-bold font-mono text-cohere-primary">
                        {currentPosStat.key_passes_conceded_per_game} / game
                      </span>
                    </div>
                    <div className="w-full bg-cohere-soft-stone h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-cohere-action-blue h-full rounded-full"
                        style={{ width: `${Math.min(100, currentPosStat.key_passes_conceded_per_game * 35)}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-3 rounded-sm bg-cohere-soft-stone/40 border border-cohere-hairline">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-cohere-ink font-medium">Tackles Conceded against Position</span>
                      <span className="font-bold font-mono text-cohere-primary">
                        {currentPosStat.tackles_conceded_per_game} / game
                      </span>
                    </div>
                    <div className="w-full bg-cohere-soft-stone h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-cohere-primary h-full rounded-full"
                        style={{ width: `${Math.min(100, currentPosStat.tackles_conceded_per_game * 16)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-cohere-muted space-y-2">
                <Info size={24} className="mx-auto text-cohere-slate opacity-60" />
                <p>Click on ST, LW, RW, CAM, CM, LB, CB, or RB on the pitch diagram to inspect conceded metric breakdowns.</p>
              </div>
            )}
          </div>

          {/* All Positions Overview List */}
          <div className="cohere-card-white p-4">
            <div className="text-xs font-mono font-bold text-cohere-primary uppercase tracking-wider mb-2.5">
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
                    className={`w-full p-2 rounded-sm text-left flex items-center justify-between transition-colors border ${
                      highlightedPos === p
                        ? "bg-cohere-soft-stone border-cohere-coral"
                        : "bg-white border-cohere-hairline hover:bg-cohere-soft-stone/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cohere-primary w-7 text-center rounded bg-cohere-soft-stone py-0.5 border border-cohere-hairline">
                        {p}
                      </span>
                      <span className="text-xs text-cohere-ink font-medium">
                        {pitchCoords[p]?.label.split(" ")[0]}
                      </span>
                    </div>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-cohere-primary">{s.shots_conceded_per_game} sh</span>
                      <span className="text-[10px] font-mono font-bold text-cohere-coral px-1.5 py-0.5 rounded bg-cohere-soft-stone border border-cohere-coral/30">
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
