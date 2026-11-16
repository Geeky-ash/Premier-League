"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShieldAlert,
  Sliders,
  AlertTriangle,
  FileDown,
  CheckCircle2,
  Calendar,
  Layers,
  Activity,
  ArrowRight,
} from "lucide-react";
import RefGauge from "@/components/RefGauge";

interface RefereeData {
  referee_name: string;
  matches_officiated: number;
  yellow_cards_per_game: number;
  red_cards_per_game: number;
  fouls_per_game: number;
  penalties_awarded_per_game: number;
  referee_strictness_index: number;
  tier: "LENIENT" | "STANDARD" | "DRACONIAN";
  var_overturns_per_game: number;
  dissent_sensitivity_percentile: number;
  avg_delay_per_stop_sec: number;
  rolling_card_history: number[];
  badge: string;
  category: string;
}

const FALLBACK_REFEREES: RefereeData[] = [
  {
    referee_name: "John Brooks",
    matches_officiated: 142,
    yellow_cards_per_game: 4.30,
    red_cards_per_game: 0.15,
    fouls_per_game: 22.0,
    penalties_awarded_per_game: 0.30,
    referee_strictness_index: 6.8,
    tier: "DRACONIAN",
    var_overturns_per_game: 0.31,
    dissent_sensitivity_percentile: 94,
    avg_delay_per_stop_sec: 28.4,
    rolling_card_history: [3, 4, 3, 5, 5, 6, 5, 7, 7, 8],
    badge: "FIFA BADGE 2026",
    category: "Select Group 1",
  },
  {
    referee_name: "Michael Oliver",
    matches_officiated: 218,
    yellow_cards_per_game: 4.10,
    red_cards_per_game: 0.13,
    fouls_per_game: 21.8,
    penalties_awarded_per_game: 0.30,
    referee_strictness_index: 5.8,
    tier: "STANDARD",
    var_overturns_per_game: 0.24,
    dissent_sensitivity_percentile: 72,
    avg_delay_per_stop_sec: 25.1,
    rolling_card_history: [4, 4, 3, 4, 5, 4, 4, 5, 4, 4],
    badge: "UEFA CATEGORY ELITE",
    category: "Select Group 1",
  },
  {
    referee_name: "Anthony Taylor",
    matches_officiated: 245,
    yellow_cards_per_game: 4.62,
    red_cards_per_game: 0.16,
    fouls_per_game: 22.4,
    penalties_awarded_per_game: 0.38,
    referee_strictness_index: 7.4,
    tier: "DRACONIAN",
    var_overturns_per_game: 0.38,
    dissent_sensitivity_percentile: 96,
    avg_delay_per_stop_sec: 29.8,
    rolling_card_history: [5, 4, 6, 5, 6, 7, 6, 7, 8, 7],
    badge: "FIFA BADGE 2026",
    category: "Select Group 1",
  },
  {
    referee_name: "Paul Tierney",
    matches_officiated: 184,
    yellow_cards_per_game: 3.85,
    red_cards_per_game: 0.08,
    fouls_per_game: 20.9,
    penalties_awarded_per_game: 0.23,
    referee_strictness_index: 5.1,
    tier: "STANDARD",
    var_overturns_per_game: 0.20,
    dissent_sensitivity_percentile: 65,
    avg_delay_per_stop_sec: 23.9,
    rolling_card_history: [3, 4, 3, 4, 3, 4, 4, 3, 4, 3],
    badge: "SELECT GROUP 1",
    category: "Select Group 1",
  },
  {
    referee_name: "Samuel Barrott",
    matches_officiated: 52,
    yellow_cards_per_game: 3.65,
    red_cards_per_game: 0.06,
    fouls_per_game: 19.2,
    penalties_awarded_per_game: 0.18,
    referee_strictness_index: 3.8,
    tier: "LENIENT",
    var_overturns_per_game: 0.14,
    dissent_sensitivity_percentile: 42,
    avg_delay_per_stop_sec: 21.4,
    rolling_card_history: [2, 3, 3, 4, 3, 2, 3, 4, 3, 2],
    badge: "SELECT GROUP 1",
    category: "Select Group 1",
  },
  {
    referee_name: "Jarred Gillett",
    matches_officiated: 88,
    yellow_cards_per_game: 4.76,
    red_cards_per_game: 0.19,
    fouls_per_game: 23.5,
    penalties_awarded_per_game: 0.35,
    referee_strictness_index: 7.8,
    tier: "DRACONIAN",
    var_overturns_per_game: 0.35,
    dissent_sensitivity_percentile: 98,
    avg_delay_per_stop_sec: 31.2,
    rolling_card_history: [5, 6, 5, 7, 6, 8, 7, 8, 7, 9],
    badge: "FIFA BADGE 2026",
    category: "Select Group 1",
  },
];

export default function RefereesPage() {
  const [referees, setReferees] = useState<RefereeData[]>(FALLBACK_REFEREES);
  const [selectedRefName, setSelectedRefName] = useState<string>("John Brooks");
  const [leagueAvgStrictness, setLeagueAvgStrictness] = useState<number>(5.4);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchReferees() {
      try {
        setLoading(true);
        const res = await fetch("/api/v1/referees");
        if (res.ok) {
          const data = await res.json();
          if (data.referees && data.referees.length > 0) {
            setReferees(data.referees);
            if (data.league_average_strictness) {
              setLeagueAvgStrictness(data.league_average_strictness);
            }
          }
        }
      } catch (err) {
        console.warn("Using fallback referee data", err);
      } finally {
        setLoading(false);
      }
    }
    fetchReferees();
  }, []);

  const currentRef =
    referees.find((r) => r.referee_name === selectedRefName) || referees[0];

  const isDraconian = currentRef.referee_strictness_index >= 6.5;
  const isLenient = currentRef.referee_strictness_index < 4.0;

  return (
    <div className="min-h-screen bg-cohere-canvas text-cohere-primary pb-20">
      {/* ── Top Microcopy Telemetry Bar ── */}
      <div className="w-full bg-cohere-black text-white px-4 py-2 border-b border-cohere-hairline">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 rounded-full bg-cohere-coral animate-pulse" />
            <span className="text-cohere-hairline">
              TELEMETRY_REF_ID: // REF-2026-ENG-441
            </span>
            <span className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-cohere-deep-green text-[10px] text-white font-bold">
              OPTA OPTICAL LIVE
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-cohere-muted">
            <span>INDEX REFRESH: T-MINUS 02:40</span>
            <span className="text-white font-bold">PL SELECT GROUP 1</span>
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
              <Link href="/fixtures" className="hover:underline">Fixtures</Link>
              <span>/</span>
              <span className="text-cohere-primary font-bold">Referee Telemetry</span>
            </div>
            <h1 className="font-display font-bold text-3xl sm:text-4xl text-cohere-primary tracking-tight">
              Referee Tendency Dial &amp; Disciplinary Telemetry
            </h1>
            <p className="text-sm text-cohere-slate mt-1">
              Probabilistic foul thresholds, card propensity distributions &amp; matchday disciplinary variance.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                const csvData =
                  "Referee,Matches,Yellows/G,Reds/G,Fouls/G,Strictness,Tier\n" +
                  referees
                    .map(
                      (r) =>
                        `"${r.referee_name}",${r.matches_officiated},${r.yellow_cards_per_game},${r.red_cards_per_game},${r.fouls_per_game},${r.referee_strictness_index},${r.tier}`
                    )
                    .join("\n");
                const blob = new Blob([csvData], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "referee_telemetry_2026.csv";
                a.click();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-white border border-cohere-hairline hover:bg-cohere-soft-stone text-xs font-mono font-medium text-cohere-primary shadow-xs transition-colors"
            >
              <FileDown size={14} />
              <span>Export CSV</span>
            </button>
            <span className="px-3 py-1.5 rounded bg-cohere-soft-stone font-mono text-xs text-cohere-slate border border-cohere-hairline">
              PL 2026/27 Active
            </span>
          </div>
        </div>

        {/* ── Official Selector Pills ── */}
        <div className="w-full overflow-x-auto py-4 flex items-center gap-2 border-b border-cohere-hairline">
          <span className="text-xs font-mono text-cohere-slate uppercase tracking-wider shrink-0 mr-2">
            Select Official:
          </span>
          {referees.map((r) => {
            const isSelected = r.referee_name === selectedRefName;
            return (
              <button
                key={r.referee_name}
                type="button"
                onClick={() => setSelectedRefName(r.referee_name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-medium shrink-0 transition-all ${
                  isSelected
                    ? "bg-cohere-primary text-white shadow-sm font-bold scale-105"
                    : "bg-cohere-soft-stone text-cohere-ink hover:bg-cohere-hairline border border-cohere-hairline"
                }`}
              >
                {r.referee_name}
                <span
                  className={`ml-1.5 text-[10px] ${
                    r.referee_strictness_index >= 6.5
                      ? "text-cohere-coral font-bold"
                      : "text-cohere-slate"
                  }`}
                >
                  ({r.referee_strictness_index.toFixed(1)})
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Official Profile Banner ── */}
        <div className="product-card mt-6 bg-white border border-cohere-hairline rounded-lg p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-cohere-hairline">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-full bg-cohere-primary text-white font-display font-bold text-2xl flex items-center justify-center shrink-0 shadow-md">
                {currentRef.referee_name
                  .split(" ")
                  .map((p) => p[0])
                  .join("")}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-cohere-deep-green text-white text-[10px] font-mono font-bold uppercase">
                    {currentRef.badge}
                  </span>
                  <span className="text-xs font-mono text-cohere-slate">
                    {currentRef.matches_officiated} Fixtures Officiated
                  </span>
                </div>
                <h2 className="font-display font-bold text-2xl sm:text-3xl text-cohere-primary mt-1">
                  {currentRef.referee_name}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-cohere-slate mt-1">
                  <span>Premier League {currentRef.category}</span>
                  <span>•</span>
                  <span>Avg Stop Delay: {currentRef.avg_delay_per_stop_sec}s</span>
                  <span>•</span>
                  <span>
                    Dissent Sensitivity: {currentRef.dissent_sensitivity_percentile}th %ile
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Strictness Callout */}
            <div className="flex items-center gap-4 bg-cohere-soft-stone p-4 rounded-lg border border-cohere-hairline shrink-0">
              <div className="text-right">
                <span className="text-[10px] font-mono text-cohere-slate uppercase tracking-wider block">
                  Disciplinary Classification
                </span>
                <span
                  className={`font-display font-bold text-xl uppercase tracking-tight ${
                    isDraconian
                      ? "text-cohere-coral"
                      : isLenient
                      ? "text-cohere-deep-green"
                      : "text-cohere-primary"
                  }`}
                >
                  {currentRef.tier} TIER
                </span>
                <span className="text-xs font-mono text-cohere-slate block">
                  {currentRef.referee_strictness_index >= leagueAvgStrictness ? "+" : ""}
                  {(
                    currentRef.referee_strictness_index - leagueAvgStrictness
                  ).toFixed(1)}{" "}
                  vs League Median
                </span>
              </div>
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-xl text-white ${
                  isDraconian
                    ? "bg-cohere-coral"
                    : isLenient
                    ? "bg-cohere-deep-green"
                    : "bg-cohere-primary"
                }`}
              >
                {currentRef.referee_strictness_index.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Monte Carlo Predicate Callout */}
          <div className="mt-4 p-4 rounded bg-[#faf9f7] border border-cohere-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 size={16} className="text-cohere-deep-green shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-cohere-primary">
                  Monte Carlo Card Model Anticipation:
                </span>{" "}
                <span className="text-cohere-slate">
                  Projects{" "}
                  <strong className="text-cohere-primary">
                    {(currentRef.yellow_cards_per_game * 0.95).toFixed(2)} ± 0.6
                  </strong>{" "}
                  total cards for upcoming appointment.{" "}
                  {currentRef.referee_strictness_index >= 6.5
                    ? "78% probability of first-half yellow card before minute 35:00."
                    : "Lower caution rate expected in opening 45 minutes."}
                </span>
              </div>
            </div>
            <div className="shrink-0 px-2.5 py-1 rounded bg-white border border-cohere-hairline font-bold text-cohere-primary">
              CONFIDENCE: 91.4%
            </div>
          </div>
        </div>

        {/* ── Main Two-Column Telemetry Matrix ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left Column: Radial Tendency Dial (5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <RefGauge
              strictness={currentRef.referee_strictness_index}
              refereeName={currentRef.referee_name}
              leagueAverage={leagueAvgStrictness}
              recentCardsHistory={currentRef.rolling_card_history}
            />

            {/* Upcoming Assignment Card */}
            <div className="product-card bg-white border border-cohere-hairline rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-cohere-hairline">
                <span className="font-mono text-[10px] text-cohere-slate uppercase tracking-wider">
                  UPCOMING FIXTURE ASSIGNMENT
                </span>
                <span className="px-2 py-0.5 rounded bg-cohere-coral text-white text-[10px] font-mono font-bold">
                  MATCHDAY 25
                </span>
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-lg text-cohere-primary">
                    Chelsea vs Arsenal
                  </span>
                  <span className="text-xs font-mono text-cohere-slate">
                    Stamford Bridge
                  </span>
                </div>
                <p className="text-xs text-cohere-slate mt-1 font-body">
                  High-intensity London Derby. Strict foul ceiling expected; tactical booking vulnerability on transitional breaks.
                </p>
                <div className="mt-4 flex items-center justify-between pt-3 border-t border-cohere-hairline">
                  <span className="text-xs font-mono text-cohere-slate">
                    Projected Booking Points: <strong>55+</strong>
                  </span>
                  <Link
                    href="/match-predictor"
                    className="text-xs font-mono font-semibold text-cohere-coral hover:underline inline-flex items-center gap-1"
                  >
                    <span>Run Match Simulation</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Comprehensive Disciplinary Breakdown (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* 6 Key Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {/* Yellows / game */}
              <div className="bg-white p-4 rounded-lg border border-cohere-hairline shadow-sm">
                <span className="text-[10px] font-mono text-cohere-slate uppercase tracking-wider">
                  Yellow Cards / 90
                </span>
                <div className="text-2xl font-display font-bold text-cohere-primary mt-1">
                  {currentRef.yellow_cards_per_game.toFixed(2)}
                </div>
                <div className="mt-1 text-[11px] font-mono text-cohere-slate">
                  League avg: 3.95 (
                  <span className={currentRef.yellow_cards_per_game >= 3.95 ? "text-cohere-coral font-bold" : "text-cohere-deep-green font-bold"}>
                    {currentRef.yellow_cards_per_game >= 3.95 ? "+" : ""}
                    {(currentRef.yellow_cards_per_game - 3.95).toFixed(2)}
                  </span>
                  )
                </div>
              </div>

              {/* Red Cards / season */}
              <div className="bg-white p-4 rounded-lg border border-cohere-hairline shadow-sm">
                <span className="text-[10px] font-mono text-cohere-slate uppercase tracking-wider">
                  Red Cards / 90
                </span>
                <div className="text-2xl font-display font-bold text-cohere-coral mt-1">
                  {currentRef.red_cards_per_game.toFixed(2)}
                </div>
                <div className="mt-1 text-[11px] font-mono text-cohere-slate">
                  Total reds: {Math.round(currentRef.red_cards_per_game * currentRef.matches_officiated)}
                </div>
              </div>

              {/* Fouls per game */}
              <div className="bg-white p-4 rounded-lg border border-cohere-hairline shadow-sm">
                <span className="text-[10px] font-mono text-cohere-slate uppercase tracking-wider">
                  Fouls Whistled / 90
                </span>
                <div className="text-2xl font-display font-bold text-cohere-primary mt-1">
                  {currentRef.fouls_per_game.toFixed(1)}
                </div>
                <div className="mt-1 text-[11px] font-mono text-cohere-slate">
                  Threshold: {currentRef.fouls_per_game >= 22.0 ? "Tight" : "Flowing"}
                </div>
              </div>

              {/* Penalty award freq */}
              <div className="bg-white p-4 rounded-lg border border-cohere-hairline shadow-sm">
                <span className="text-[10px] font-mono text-cohere-slate uppercase tracking-wider">
                  Penalties / 90
                </span>
                <div className="text-2xl font-display font-bold text-cohere-primary mt-1">
                  {currentRef.penalties_awarded_per_game.toFixed(2)}
                </div>
                <div className="mt-1 text-[11px] font-mono text-cohere-slate">
                  1 every {(1 / currentRef.penalties_awarded_per_game).toFixed(1)} games
                </div>
              </div>

              {/* VAR overturn rate */}
              <div className="bg-white p-4 rounded-lg border border-cohere-hairline shadow-sm">
                <span className="text-[10px] font-mono text-cohere-slate uppercase tracking-wider">
                  VAR Overturns / 90
                </span>
                <div className="text-2xl font-display font-bold text-cohere-primary mt-1">
                  {currentRef.var_overturns_per_game.toFixed(2)}
                </div>
                <div className="mt-1 text-[11px] font-mono text-cohere-slate">
                  Review variance
                </div>
              </div>

              {/* Dissent sensitivity */}
              <div className="bg-white p-4 rounded-lg border border-cohere-hairline shadow-sm">
                <span className="text-[10px] font-mono text-cohere-slate uppercase tracking-wider">
                  Dissent Strictness
                </span>
                <div className="text-2xl font-display font-bold text-cohere-coral mt-1">
                  {currentRef.dissent_sensitivity_percentile}%
                </div>
                <div className="mt-1 text-[11px] font-mono text-cohere-slate">
                  Select Group 1 rank
                </div>
              </div>
            </div>

            {/* Match Phase Incident Tendency Heat Matrix */}
            <div className="product-card bg-white border border-cohere-hairline rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-cohere-hairline">
                <div>
                  <span className="font-mono text-[10px] text-cohere-slate uppercase tracking-wider">
                    TEMPORAL DISCIPLINARY PROFILE
                  </span>
                  <h3 className="font-display font-bold text-base text-cohere-primary">
                    Caution Propensity by Match Phase
                  </h3>
                </div>
                <span className="text-xs font-mono text-cohere-slate">
                  15-Min Intervals
                </span>
              </div>

              <div className="grid grid-cols-6 gap-2 mt-4 text-center">
                {[
                  { phase: "0-15'", pct: 8, label: "Lenient" },
                  { phase: "15-30'", pct: 14, label: "Warning" },
                  { phase: "30-45'+", pct: 26, label: "High" },
                  { phase: "45-60'", pct: 12, label: "Reset" },
                  { phase: "60-75'", pct: 22, label: "Strict" },
                  { phase: "75-90'+", pct: 38, label: "Peak" },
                ].map((item) => (
                  <div
                    key={item.phase}
                    className="flex flex-col items-center bg-cohere-soft-stone p-2.5 rounded border border-cohere-hairline"
                  >
                    <span className="font-mono text-xs font-bold text-cohere-primary">
                      {item.phase}
                    </span>
                    <div className="w-full bg-white h-20 rounded my-2 relative overflow-hidden flex items-end">
                      <div
                        className="w-full bg-cohere-coral transition-all duration-500 rounded-b"
                        style={{ height: `${(item.pct / 40) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono text-xs font-bold text-cohere-coral">
                      {item.pct}%
                    </span>
                    <span className="text-[10px] font-mono text-cohere-slate">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tactical Advisory & Match Impact */}
            <div className="p-5 rounded-lg bg-cohere-soft-stone border border-cohere-hairline">
              <div className="flex items-start gap-3">
                <AlertTriangle size={18} className="text-cohere-coral shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-display font-bold text-sm text-cohere-primary">
                    Tactical Advisory for In-Play Props &amp; Fouls
                  </h4>
                  <p className="text-xs text-cohere-slate mt-1 leading-relaxed">
                    With {currentRef.referee_name} officiating, players in holding midfield roles (e.g. Caicedo, Rice, Partey) carry a 42% higher probability of receiving a booking when accumulating 3+ fouls. Consider evaluating Over 3.5 total cards in high-stakes derbies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
