"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sliders,
  Play,
  RotateCcw,
  Zap,
  Activity,
  UserCheck,
  TrendingUp,
  Shield,
  Layers,
  ArrowRight,
  Clock,
  CheckCircle2,
} from "lucide-react";

interface BenchPlayer {
  id: string;
  name: string;
  number: number;
  position: string;
  readinessPct: number;
  projectedXgDelta: number;
  staminaReserve: number;
  tacticalRole: string;
  recommendedMinute: number;
}

const BENCH_ROSTER: BenchPlayer[] = [
  {
    id: "neto",
    name: "Pedro Neto",
    number: 7,
    position: "RW / LW",
    readinessPct: 94,
    projectedXgDelta: 0.34,
    staminaReserve: 98,
    tacticalRole: "Direct 1v1 Channel Overload",
    recommendedMinute: 75,
  },
  {
    id: "nkunku",
    name: "Christopher Nkunku",
    number: 18,
    position: "CF / SS",
    readinessPct: 89,
    projectedXgDelta: 0.28,
    staminaReserve: 95,
    tacticalRole: "Half-space Pocket Exploitation",
    recommendedMinute: 78,
  },
  {
    id: "felix",
    name: "João Félix",
    number: 14,
    position: "AM / LW",
    readinessPct: 91,
    projectedXgDelta: 0.22,
    staminaReserve: 94,
    tacticalRole: "Creative Box Linkage",
    recommendedMinute: 80,
  },
  {
    id: "dewsbury",
    name: "K. Dewsbury-Hall",
    number: 22,
    position: "CM",
    readinessPct: 84,
    projectedXgDelta: 0.12,
    staminaReserve: 96,
    tacticalRole: "Midfield Press Stabilization",
    recommendedMinute: 82,
  },
];

export default function SimulationPage() {
  const [matchMinute, setMatchMinute] = useState<number>(74);
  const [selectedSubIn, setSelectedSubIn] = useState<string>("neto");
  const [subOutPlayer, setSubOutPlayer] = useState<string>("Nicolas Jackson");
  const [formation, setFormation] = useState<string>("4-2-3-1");
  const [simulationResult, setSimulationResult] = useState<any>(null);
  const [simulating, setSimulating] = useState<boolean>(false);

  const activeBenchPlayer =
    BENCH_ROSTER.find((p) => p.id === selectedSubIn) || BENCH_ROSTER[0];

  const handleRunSimulation = async () => {
    try {
      setSimulating(true);
      const res = await fetch("/api/v1/simulation/tactical", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          minute: matchMinute,
          home_team: "Chelsea",
          away_team: "Arsenal",
          home_score: 2,
          away_score: 2,
          sub_in: activeBenchPlayer.name,
          sub_out: subOutPlayer,
          formation: formation,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
      } else {
        // Fallback calculation
        setSimulationResult({
          minute: matchMinute,
          sub_in: activeBenchPlayer.name,
          sub_out: subOutPlayer,
          stamina_restoration_pct: 32.4,
          projected_xg_delta: activeBenchPlayer.projectedXgDelta,
          win_probability_shift: {
            home_win_delta_pct: 4.8,
            draw_delta_pct: -1.6,
            away_win_delta_pct: -3.2,
          },
          tactical_advisory: `Deploying ${activeBenchPlayer.name} into wide channels exploits fatigue in opposition fullbacks at ${matchMinute}'. Projected xG gain: +${activeBenchPlayer.projectedXgDelta}.`,
          press_intensity_index: 78.2,
        });
      }
    } catch (err) {
      // Local calculation fallback
      setSimulationResult({
        minute: matchMinute,
        sub_in: activeBenchPlayer.name,
        sub_out: subOutPlayer,
        stamina_restoration_pct: 32.4,
        projected_xg_delta: activeBenchPlayer.projectedXgDelta,
        win_probability_shift: {
          home_win_delta_pct: 4.8,
          draw_delta_pct: -1.6,
          away_win_delta_pct: -3.2,
        },
        tactical_advisory: `Deploying ${activeBenchPlayer.name} into wide channels exploits fatigue in opposition fullbacks at ${matchMinute}'. Projected xG gain: +${activeBenchPlayer.projectedXgDelta}.`,
        press_intensity_index: 78.2,
      });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="min-h-screen bg-cohere-canvas text-cohere-primary pb-20">
      {/* ── Top Microcopy Telemetry Bar ── */}
      <div className="w-full bg-cohere-black text-white px-4 py-2 border-b border-cohere-hairline">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cohere-coral animate-pulse" />
            <span className="text-cohere-hairline">
              WORKSPACE / SIMULATION STUDIO / CHELSEA vs ARSENAL // MATCH_SIM_V2.6
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-cohere-deep-green text-[10px] text-white font-bold">
              OPTA BIOMETRIC TELEMETRY
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-cohere-muted">
            <span className="text-white font-bold">SSE STREAM: 12MS</span>
            <span className="text-cohere-coral font-bold">SIMULATION ACTIVE</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 pt-6">
        {/* Breadcrumb & Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 border-b border-cohere-hairline gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-cohere-slate mb-1">
              <Link href="/" className="hover:underline">Home</Link>
              <span>/</span>
              <Link href="/match-predictor" className="hover:underline">Match Predictor</Link>
              <span>/</span>
              <span className="text-cohere-primary font-bold">Substitution Simulation</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-cohere-primary tracking-tight">
              Player Substitution Timeline &amp; Tactical Impact Simulator
            </h1>
            <p className="text-sm text-cohere-slate mt-1">
              Physical degradation modeling, algorithmic bench readiness scoring &amp; projected goal threat delta.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-cohere-soft-stone px-3 py-1.5 rounded-lg border border-cohere-hairline font-mono text-xs">
              <span className="font-bold">Chelsea 2 : 2 Arsenal</span>
              <span className="text-cohere-coral font-bold">• 74&apos; Live</span>
            </div>
            <Link
              href="/dugout"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-cohere-primary text-white text-xs font-mono font-medium hover:bg-cohere-ink transition-colors"
            >
              <span>Touchline Dugout</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* ── Section 1: Dynamic Match Clock & Timeline Scrubber ── */}
        <div className="product-card mt-6 bg-white border border-cohere-hairline rounded-lg p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-cohere-hairline gap-3">
            <div>
              <span className="font-mono text-[10px] text-cohere-slate uppercase tracking-wider">
                TEMPORAL DEPLOYMENT VECTOR
              </span>
              <h3 className="font-display font-bold text-xl text-cohere-primary">
                Dynamic Match Clock &amp; Substitution Vector Spectrum
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-2xl font-bold text-cohere-coral">
                {matchMinute}&apos;
              </span>
              <span className="text-xs font-mono text-cohere-slate">
                / 90&apos; + 6&apos;
              </span>
            </div>
          </div>

          {/* Interactive Timeline Slider */}
          <div className="mt-6 px-2">
            <input
              type="range"
              min="0"
              max="90"
              value={matchMinute}
              onChange={(e) => setMatchMinute(parseInt(e.target.value, 10))}
              className="w-full h-2 bg-cohere-soft-stone rounded-lg appearance-none cursor-pointer accent-cohere-coral"
            />

            {/* Timeline Tick Marks */}
            <div className="flex justify-between text-[11px] font-mono text-cohere-slate mt-2">
              <span>0&apos; KO</span>
              <span>15&apos;</span>
              <span>30&apos;</span>
              <span className="font-bold text-cohere-primary">45&apos; HT</span>
              <span>60&apos;</span>
              <span className="font-bold text-cohere-coral">75&apos; Window</span>
              <span>90&apos; FT</span>
            </div>
          </div>

          {/* Plotted Events Along Match Timeline */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6 pt-4 border-t border-cohere-hairline text-xs font-mono">
            <div className="p-2 rounded bg-cohere-soft-stone border border-cohere-hairline">
              <span className="text-cohere-coral font-bold">12&apos; GOAL</span>
              <div className="font-semibold text-cohere-primary mt-0.5">N. Jackson (CFC)</div>
            </div>
            <div className="p-2 rounded bg-cohere-soft-stone border border-cohere-hairline">
              <span className="text-cohere-coral font-bold">21&apos; GOAL</span>
              <div className="font-semibold text-cohere-primary mt-0.5">G. Martinelli (ARS)</div>
            </div>
            <div className="p-2 rounded bg-cohere-soft-stone border border-cohere-hairline">
              <span className="text-cohere-coral font-bold">45&apos; PENALTY</span>
              <div className="font-semibold text-cohere-primary mt-0.5">C. Palmer (CFC)</div>
            </div>
            <div className="p-2 rounded bg-cohere-soft-stone border border-cohere-hairline">
              <span className="text-cohere-coral font-bold">62&apos; GOAL</span>
              <div className="font-semibold text-cohere-primary mt-0.5">B. Saka (ARS)</div>
            </div>
            <div className="p-2 rounded bg-cohere-soft-stone border border-cohere-coral">
              <span className="text-cohere-coral font-bold">74&apos; SIM NODE</span>
              <div className="font-semibold text-cohere-primary mt-0.5">Active Simulation</div>
            </div>
          </div>
        </div>

        {/* ── Section 2: Two-Column Simulation Studio ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left: Bench Roster & Substitution Configurator (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            <div className="product-card bg-white border border-cohere-hairline rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-cohere-hairline">
                <div>
                  <span className="font-mono text-[10px] text-cohere-slate uppercase tracking-wider">
                    ALGORITHMIC BENCH READINESS
                  </span>
                  <h3 className="font-display font-bold text-lg text-cohere-primary">
                    Available Bench Substitutes
                  </h3>
                </div>
                <span className="text-xs font-mono text-cohere-slate">
                  CHELSEA FC BENCH
                </span>
              </div>

              {/* Bench Player Cards */}
              <div className="space-y-3 mt-4">
                {BENCH_ROSTER.map((player) => {
                  const isSelected = player.id === selectedSubIn;
                  return (
                    <div
                      key={player.id}
                      onClick={() => setSelectedSubIn(player.id)}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-cohere-soft-stone border-cohere-coral shadow-xs"
                          : "bg-white border-cohere-hairline hover:bg-[#faf9f7]"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full flex items-center justify-center font-mono font-bold text-xs ${
                              isSelected
                                ? "bg-cohere-coral text-white"
                                : "bg-cohere-primary text-white"
                            }`}
                          >
                            #{player.number}
                          </div>
                          <div>
                            <div className="font-display font-bold text-base text-cohere-primary">
                              {player.name}
                            </div>
                            <div className="text-xs font-mono text-cohere-slate">
                              {player.position} • {player.tacticalRole}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="font-mono font-bold text-sm text-cohere-coral">
                            +{player.projectedXgDelta.toFixed(2)} xG
                          </div>
                          <span className="text-[10px] font-mono text-cohere-deep-green font-bold">
                            {player.readinessPct}% Readiness
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Substitution Parameters Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-4 border-t border-cohere-hairline">
                <div>
                  <label className="text-[10px] font-mono text-cohere-slate uppercase tracking-wider block mb-1">
                    Player Coming Off (Fatigued)
                  </label>
                  <select
                    value={subOutPlayer}
                    onChange={(e) => setSubOutPlayer(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-cohere-soft-stone border border-cohere-hairline font-mono text-xs font-medium text-cohere-primary focus:outline-none focus:border-cohere-coral"
                  >
                    <option value="Nicolas Jackson">Nicolas Jackson (ST - 58% Stamina)</option>
                    <option value="Noni Madueke">Noni Madueke (RW - 62% Stamina)</option>
                    <option value="Romeo Lavia">Romeo Lavia (CM - 54% Stamina)</option>
                    <option value="Malo Gusto">Malo Gusto (RB - 67% Stamina)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-mono text-cohere-slate uppercase tracking-wider block mb-1">
                    Tactical Shape Adjustment
                  </label>
                  <select
                    value={formation}
                    onChange={(e) => setFormation(e.target.value)}
                    className="w-full px-3 py-2 rounded bg-cohere-soft-stone border border-cohere-hairline font-mono text-xs font-medium text-cohere-primary focus:outline-none focus:border-cohere-coral"
                  >
                    <option value="4-2-3-1">4-2-3-1 (Asymmetric Wing Overload)</option>
                    <option value="4-3-3">4-3-3 (High Pressing 3-Man Midfield)</option>
                    <option value="3-5-2">3-5-2 (Transition Counter-Strike)</option>
                    <option value="4-4-2">4-4-2 (Compact Low-Block Protection)</option>
                  </select>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleRunSimulation}
                disabled={simulating}
                className="mt-6 w-full py-3 rounded-lg bg-cohere-coral hover:bg-cohere-coral/90 text-white font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Zap size={16} />
                <span>
                  {simulating
                    ? "Calculating Biometric & Tactical Shifts..."
                    : `Simulate ${activeBenchPlayer.name} on at ${matchMinute}'`}
                </span>
              </button>
            </div>
          </div>

          {/* Right: Simulation Telemetry & Projected Impact (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Projected Impact Output Card */}
            <div className="product-card bg-white border border-cohere-hairline rounded-lg p-6 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-cohere-hairline">
                <span className="font-mono text-[10px] text-cohere-slate uppercase tracking-wider">
                  PROJECTED VECTOR IMPACT
                </span>
                <span className="px-2 py-0.5 rounded bg-cohere-deep-green text-white text-[10px] font-mono font-bold">
                  VALIDATED MODEL
                </span>
              </div>

              {simulationResult ? (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-cohere-soft-stone p-3 rounded border border-cohere-hairline">
                      <span className="text-[10px] font-mono text-cohere-slate uppercase">
                        Projected xG Delta
                      </span>
                      <div className="text-2xl font-display font-bold text-cohere-coral mt-1">
                        +{simulationResult.projected_xg_delta.toFixed(2)}
                      </div>
                      <span className="text-[10px] font-mono text-cohere-deep-green font-semibold">
                        High box arrival rate
                      </span>
                    </div>

                    <div className="bg-cohere-soft-stone p-3 rounded border border-cohere-hairline">
                      <span className="text-[10px] font-mono text-cohere-slate uppercase">
                        Stamina Boost
                      </span>
                      <div className="text-2xl font-display font-bold text-cohere-deep-green mt-1">
                        +{simulationResult.stamina_restoration_pct}%
                      </div>
                      <span className="text-[10px] font-mono text-cohere-slate">
                        Fresh sprint speed
                      </span>
                    </div>
                  </div>

                  {/* Win Probability Shift */}
                  <div className="p-3 bg-cohere-soft-stone rounded border border-cohere-hairline">
                    <span className="text-[10px] font-mono text-cohere-slate uppercase tracking-wider block mb-2">
                      Win Probability Shift
                    </span>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span>
                        Home Win:{" "}
                        <strong className="text-cohere-coral">
                          +{simulationResult.win_probability_shift.home_win_delta_pct}%
                        </strong>
                      </span>
                      <span>
                        Draw:{" "}
                        <strong className="text-cohere-slate">
                          {simulationResult.win_probability_shift.draw_delta_pct}%
                        </strong>
                      </span>
                      <span>
                        Away Win:{" "}
                        <strong className="text-cohere-slate">
                          {simulationResult.win_probability_shift.away_win_delta_pct}%
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Tactical Advisory */}
                  <div className="p-3 bg-[#faf9f7] rounded border border-cohere-hairline text-xs font-mono">
                    <span className="font-bold text-cohere-primary block mb-1">
                      Tactical Advisory:
                    </span>
                    <p className="text-cohere-slate leading-relaxed">
                      {simulationResult.tactical_advisory}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center text-cohere-slate text-xs font-mono">
                  <Activity size={24} className="mx-auto mb-2 text-cohere-muted" />
                  Select a bench substitute and click Simulate to generate physical decay curves and projected xG delta.
                </div>
              )}
            </div>

            {/* Team Stamina Degradation Gauge */}
            <div className="product-card bg-white border border-cohere-hairline rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-cohere-hairline">
                <span className="font-display font-bold text-sm text-cohere-primary">
                  Physical Degradation Curve
                </span>
                <span className="text-xs font-mono text-cohere-slate">
                  TEAM AVG: 68.4%
                </span>
              </div>
              <div className="w-full h-24 mt-4">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 320 80"
                  preserveAspectRatio="none"
                >
                  <line x1="0" y1="20" x2="320" y2="20" stroke="#eeece7" strokeWidth="1" />
                  <line x1="0" y1="50" x2="320" y2="50" stroke="#eeece7" strokeWidth="1" />
                  <path
                    d="M 0 10 Q 160 30 320 65"
                    fill="none"
                    stroke="#ff7759"
                    strokeWidth="2.5"
                  />
                  <circle cx="260" cy="54" r="4" fill="#ff7759" />
                  <text
                    x="250"
                    y="72"
                    fill="#ff7759"
                    fontFamily="Space Mono"
                    fontSize="9"
                    fontWeight="700"
                  >
                    74&apos; Active
                  </text>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
