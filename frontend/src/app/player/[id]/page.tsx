"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  User,
  Shield,
  RotateCcw,
  Clock,
  Sparkles,
  TrendingUp,
  Activity,
  Award,
} from "lucide-react";
import { fetchGlobalPlayerStats, PlayerProfileStatsResponse } from "@/lib/api";
import { getGlobalClubCrest, getPlayerPhoto } from "@/lib/logos";

export default function PlayerProfilePage() {
  const params = useParams();
  const rawId = (params?.id as string) || "lamine-yamal";

  const [data, setData] = useState<PlayerProfileStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [selectedComps, setSelectedComps] = useState<Record<string, boolean>>({
    "Champions League": true,
    "La Liga": true,
    "UEFA Nations League": true,
    "Trofeo Joan Gamper": true,
    "World Cup": true,
    "Friendly International": true,
    "Copa Del Rey": true,
    "Super Cup": false,
    "WC Qualification Europe": false,
  });
  const [venue, setVenue] = useState<"all" | "home" | "away">("all");
  const [startedGame, setStartedGame] = useState(false);
  const [historySize, setHistorySize] = useState("last_75");

  useEffect(() => {
    setLoading(true);
    fetchGlobalPlayerStats(rawId, startedGame, historySize)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [rawId, startedGame, historySize]);

  const toggleComp = (comp: string) => {
    setSelectedComps((prev) => ({ ...prev, [comp]: !prev[comp] }));
  };

  const resetFilters = () => {
    setVenue("all");
    setStartedGame(false);
    setHistorySize("last_75");
  };

  // Helper to render SVG Radar Polygon for the 10 metrics
  const renderRadarPolygon = (metrics: Record<string, number>) => {
    const keys = Object.keys(metrics);
    const totalAxes = keys.length || 7;
    const center = 140;
    const radius = 95;

    // Generate concentric rings
    const rings = [0.25, 0.5, 0.75, 1.0];

    // Compute polygon points from percentiles (0 to 100)
    const points = keys
      .map((k, i) => {
        const val = metrics[k] || 50;
        const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
        const r = (val / 100) * radius;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

    return (
      <svg className="w-full max-w-[320px] aspect-square mx-auto" viewBox="0 0 280 280">
        {/* Background Grid Circles / Webs */}
        {rings.map((ring, idx) => (
          <circle
            key={idx}
            cx={center}
            cy={center}
            r={radius * ring}
            fill="none"
            stroke="#d9d9dd"
            strokeDasharray={idx < 3 ? "2 2" : "none"}
          />
        ))}

        {/* Axis Spokes */}
        {keys.map((_, i) => {
          const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
          const x = center + radius * Math.cos(angle);
          const y = center + radius * Math.sin(angle);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e5e7eb"
            />
          );
        })}

        {/* Data Polygon */}
        <polygon
          points={points}
          fill="rgba(255, 119, 89, 0.18)"
          stroke="#ff7759"
          strokeWidth="2"
        />

        {/* Axis Data Points */}
        {keys.map((k, i) => {
          const val = metrics[k] || 50;
          const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
          const r = (val / 100) * radius;
          const x = center + r * Math.cos(angle);
          const y = center + r * Math.sin(angle);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r="3.5"
              fill="#ff7759"
              stroke="#ffffff"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Labels */}
        {keys.map((k, i) => {
          const angle = (Math.PI * 2 / totalAxes) * i - Math.PI / 2;
          const labelDist = radius + 22;
          const x = center + labelDist * Math.cos(angle);
          const y = center + labelDist * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y + 3}
              textAnchor="middle"
              className="fill-cohere-ink text-[9px] font-mono font-bold tracking-tight"
            >
              {k}
            </text>
          );
        })}
      </svg>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 font-body text-cohere-ink">
      {/* ── Player Hero Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cohere-hairline pb-4">
        <div className="flex items-center gap-4">
          {/* Player Cutout Photo */}
          <div className="relative w-16 h-16 rounded-lg bg-cohere-soft-stone border border-cohere-hairline overflow-hidden shrink-0">
            <Image
              src={data?.player.photo || getPlayerPhoto(data?.player.name || rawId)}
              alt={data?.player.name || rawId}
              fill
              className="object-cover object-top"
              unoptimized
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-medium tracking-tight text-cohere-primary flex items-center gap-2">
              <span>{data?.player.name || "Lamine Yamal"}</span>
              <span className="text-base">{data?.player.flag || "🇪🇸"}</span>
            </h1>
            <div className="flex items-center gap-2 text-xs text-cohere-slate mt-1 font-mono">
              <span className="chip-coral font-bold text-[11px]">
                {data?.player.position || "Midfielder"}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <div className="relative w-4 h-4 shrink-0">
                  <Image
                    src={getGlobalClubCrest(data?.player.club || "FC Barcelona")}
                    alt={data?.player.club || "FC Barcelona"}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                </div>
                <span className="font-semibold text-cohere-ink">{data?.player.club || "FC Barcelona"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Overall Percentile Pill */}
        <div className="flex items-center gap-2 bg-cohere-soft-stone p-2.5 rounded-lg border border-cohere-hairline font-mono">
          <Award size={18} className="text-cohere-coral" />
          <div>
            <div className="text-[10px] text-cohere-muted uppercase font-bold">Scouting Tier</div>
            <div className="text-xs font-bold text-cohere-primary">Top 2% Worldwide Attacker</div>
          </div>
        </div>
      </div>

      {/* ── 2-Column: Filters (Left) + Radar Chart (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Multi-Filter Control Panel */}
        <div className="lg:col-span-8 space-y-5">
          <div className="p-4 rounded-lg bg-cohere-soft-stone border border-cohere-hairline space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* COMPETITIONS Checklist */}
              <div className="sm:col-span-2">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cohere-muted mb-2">
                  Competitions
                </div>
                <div className="flex flex-wrap gap-2">
                  {(
                    data?.competitions || [
                      "Champions League",
                      "La Liga",
                      "UEFA Nations League",
                      "Trofeo Joan Gamper",
                      "World Cup",
                      "Friendly International",
                      "Copa Del Rey",
                    ]
                  ).map((comp) => {
                    const active = selectedComps[comp] !== false;
                    return (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => toggleComp(comp)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-mono font-bold transition-all ${
                          active
                            ? "bg-cohere-primary text-white"
                            : "bg-white text-cohere-slate border border-cohere-hairline"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cohere-coral" />
                        <span>{comp}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VENUE & OTHER */}
              <div className="space-y-3 font-mono">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-cohere-muted mb-1.5">
                    Venue
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setVenue(venue === "home" ? "all" : "home")}
                      className={`px-3 py-1 rounded-pill text-xs font-bold transition-all ${
                        venue === "home" || venue === "all"
                          ? "bg-cohere-primary text-white"
                          : "bg-white text-cohere-slate border border-cohere-hairline"
                      }`}
                    >
                      Home
                    </button>
                    <button
                      type="button"
                      onClick={() => setVenue(venue === "away" ? "all" : "away")}
                      className={`px-3 py-1 rounded-pill text-xs font-bold transition-all ${
                        venue === "away" || venue === "all"
                          ? "bg-cohere-primary text-white"
                          : "bg-white text-cohere-slate border border-cohere-hairline"
                      }`}
                    >
                      Away
                    </button>
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-cohere-muted mb-1.5">
                    Other
                  </div>
                  <label className="flex items-center gap-2 text-xs font-medium text-cohere-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={startedGame}
                      onChange={(e) => setStartedGame(e.target.checked)}
                      className="rounded-xs accent-[#ff7759] cursor-pointer"
                    />
                    <span>Started game</span>
                  </label>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-wider text-cohere-muted mb-1.5">
                    History
                  </div>
                  <select
                    value={historySize}
                    onChange={(e) => setHistorySize(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-sm bg-white border border-cohere-hairline text-xs text-cohere-ink font-bold outline-none cursor-pointer"
                  >
                    <option value="last_10">Last 10 games</option>
                    <option value="last_20">Last 20 games</option>
                    <option value="last_30">Last 30 games</option>
                    <option value="last_50">Last 50 games</option>
                    <option value="last_75">Last 75 games</option>
                    <option value="full">Full Seasons</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-cohere-slate hover:text-cohere-coral flex items-center gap-1 transition-colors"
                >
                  <RotateCcw size={10} /> RESET ALL FILTERS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Radar Performance Polygon */}
        <div className="lg:col-span-4 cohere-card-white p-4">
          <div className="flex items-center justify-between pb-2 border-b border-cohere-hairline font-mono">
            <span className="text-xs font-bold uppercase tracking-wider text-cohere-primary">
              Percentile Radar
            </span>
            <span className="text-[10px] text-cohere-coral font-bold">vs Top European Wings</span>
          </div>

          <div className="py-2">
            {data?.radar ? (
              renderRadarPolygon(data.radar)
            ) : (
              <div className="h-56 flex items-center justify-center text-xs text-cohere-muted font-mono">
                Loading radar visualization...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Match Log Timeline Ribbon (Bottom) ── */}
      <div className="cohere-card-white overflow-hidden p-0">
        <div className="px-4 py-3 bg-cohere-soft-stone border-b border-cohere-hairline flex items-center justify-between font-mono">
          <span className="text-xs font-bold uppercase tracking-wider text-cohere-primary">
            Match Log Timeline &amp; Ratings Ribbon
          </span>
          <span className="text-[11px] text-cohere-slate font-bold">
            Showing {data?.match_history.length || 0} out of 75 games
          </span>
        </div>

        {loading ? (
          <div className="p-12 text-center text-cohere-muted text-xs font-mono">
            Loading match performance ribbon...
          </div>
        ) : (
          <div className="overflow-x-auto p-4">
            <div className="flex gap-2 min-w-max pb-2">
              {data?.match_history.map((m, idx) => (
                <div
                  key={idx}
                  className="flex flex-col items-center justify-between w-14 p-2 rounded-sm bg-cohere-soft-stone/40 border border-cohere-hairline hover:border-cohere-coral transition-all text-center space-y-1.5"
                >
                  {/* Date */}
                  <span className="text-[10px] font-mono font-bold text-cohere-slate leading-tight">
                    {m.date}
                  </span>

                  {/* Opponent Crest */}
                  <div className="relative w-6 h-6 shrink-0 my-0.5">
                    <Image
                      src={getGlobalClubCrest(m.opponent)}
                      alt={m.opponent}
                      fill
                      className="object-contain"
                      unoptimized
                    />
                  </div>

                  {/* Result Score Pill */}
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                      m.result === "W"
                        ? "bg-cohere-deep-green text-white"
                        : m.result === "L"
                        ? "bg-cohere-coral text-white"
                        : "bg-cohere-slate text-white"
                    }`}
                  >
                    {m.score}
                  </span>

                  {/* Minutes */}
                  <span className="text-[9px] font-mono font-bold px-1 rounded bg-white text-cohere-slate border border-cohere-hairline">
                    {m.min}&apos;
                  </span>

                  {/* Rating */}
                  <span className="text-[10px] font-mono font-bold text-cohere-coral pt-1 border-t border-cohere-hairline w-full">
                    {m.rating.toFixed(1)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
