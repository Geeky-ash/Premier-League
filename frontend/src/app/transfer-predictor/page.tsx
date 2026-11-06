"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  predictTransferValue,
  fetchPlayers,
  PlayerRecord,
  TransferPredictResponse,
} from "@/lib/api";
import { getClubCrest, getPlayerPhoto } from "@/lib/logos";
import PlayerDetailDrawer from "@/components/PlayerDetailDrawer";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  CartesianGrid,
} from "recharts";
import {
  TrendingUp,
  Sliders,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  Shield,
  User,
} from "lucide-react";

const STAR_PRESETS = [
  { name: "Erling Haaland", club: "Manchester City", label: "Haaland" },
  { name: "Bukayo Saka", club: "Arsenal", label: "Saka" },
  { name: "Cole Palmer", club: "Chelsea", label: "Palmer" },
  { name: "Mohamed Salah", club: "Liverpool", label: "Salah" },
  { name: "Declan Rice", club: "Arsenal", label: "Rice" },
  { name: "Alexander Isak", club: "Newcastle United", label: "Isak" },
];

export default function TransferPredictorPage() {
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>("Erling Haaland");
  const [activePlayer, setActivePlayer] = useState<PlayerRecord | null>(null);
  const [position, setPosition] = useState("FW");
  const [age, setAge] = useState(24);
  const [minutesPlayed, setMinutesPlayed] = useState(2560);
  const [goals, setGoals] = useState(27);
  const [assists, setAssists] = useState(5);
  const [prediction, setPrediction] = useState<TransferPredictResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerPlayer, setDrawerPlayer] = useState<PlayerRecord | null>(null);

  useEffect(() => {
    fetchPlayers()
      .then((data) => {
        setPlayers(data);
        const haaland = data.find((p) => p.name === "Erling Haaland");
        if (haaland) {
          setActivePlayer(haaland);
          setPosition(haaland.position);
          setAge(haaland.age);
          setMinutesPlayed(haaland.minutes_played);
          setGoals(haaland.goals);
          setAssists(haaland.assists);
        }
      })
      .catch(() => {});
  }, []);

  const triggerPredict = async (
    pos: string,
    a: number,
    m: number,
    g: number,
    ast: number
  ) => {
    setLoading(true);
    try {
      const res = await predictTransferValue({
        position: pos,
        age: a,
        minutes_played: m,
        goals: g,
        assists: ast,
      });
      setPrediction(res);
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(
      () => triggerPredict(position, age, minutesPlayed, goals, assists),
      150
    );
    return () => clearTimeout(t);
  }, [position, age, minutesPlayed, goals, assists]);

  const handlePresetSelect = (name: string) => {
    setSelectedPreset(name);
    if (name === "custom") {
      setActivePlayer(null);
      return;
    }
    const found = players.find((p) => p.name === name);
    if (found) {
      setActivePlayer(found);
      setPosition(found.position);
      setAge(found.age);
      setMinutesPlayed(found.minutes_played);
      setGoals(found.goals);
      setAssists(found.assists);
    }
  };

  const chartData = (prediction?.historical_trend || []).map((pt) => ({
    x: pt.actual_value,
    y: pt.fitted_value,
    name: pt.name,
    pos: pt.position,
  }));

  const userPoint = prediction
    ? [
        {
          x: prediction.valuation_eur_m,
          y: prediction.valuation_eur_m,
          name: activePlayer ? activePlayer.name : "Current Projection",
        },
      ]
    : [];

  const handleScatterClick = (e: any) => {
    if (e && e.name) {
      const found = players.find((p) => p.name === e.name);
      if (found) {
        setDrawerPlayer(found);
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pl-green">
          <Sparkles className="w-4 h-4" /> Module 01 // Supervised Valuation Model
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
          Transfer Value Predictor
        </h2>
        <p className="text-sm text-pl-text-muted mt-1">
          Forecast fair player market valuations (€M) using a regularized Ridge & OLS Regression pipeline trained on official Premier League metrics.
        </p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="pl-card bg-slate-900/60 border-white/10">
          <div className="stat-label">Model Engine</div>
          <div className="text-lg font-bold text-pl-cyan mt-1">Ridge / OLS Pipeline</div>
          <div className="text-xs text-pl-text-muted mt-1">StandardScaler + OneHotEncoder</div>
        </div>
        <div className="pl-card bg-slate-900/60 border-white/10">
          <div className="stat-label">Holdout R² Score</div>
          <div className="text-lg font-bold text-pl-green mt-1">
            {prediction ? `R² = ${prediction.r2_score.toFixed(3)}` : "R² = —"}
          </div>
          <div className="text-xs text-pl-text-muted mt-1">Benchmark Acceptance Gate ≥ 0.60</div>
        </div>
        <div className="pl-card bg-slate-900/60 border-white/10">
          <div className="stat-label">Mean Absolute Error</div>
          <div className="text-lg font-bold text-pl-magenta mt-1">
            {prediction ? `± €${prediction.mae_score.toFixed(1)}M` : "± €—M"}
          </div>
          <div className="text-xs text-pl-text-muted mt-1">Holdout Generalization Margin</div>
        </div>
      </div>

      {/* Quick Star Presets Bar */}
      <div className="pl-card p-4 bg-slate-900/60 border-white/10">
        <div className="text-xs font-bold text-pl-text-muted uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span>Featured Star Presets (One-Click Benchmark)</span>
          <span className="text-[11px] text-pl-cyan font-normal">Click any star to simulate</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {STAR_PRESETS.map((star) => {
            const isSelected = selectedPreset === star.name;
            return (
              <button
                key={star.name}
                type="button"
                onClick={() => handlePresetSelect(star.name)}
                className={`flex items-center gap-2 p-2 rounded-xl text-left border transition-all ${
                  isSelected
                    ? "bg-pl-purple/50 border-pl-green text-white shadow-lg shadow-pl-green/10"
                    : "bg-slate-950/40 border-white/5 hover:border-white/20 text-slate-300"
                }`}
              >
                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20 bg-slate-800">
                  <Image
                    src={getPlayerPhoto(star.name)}
                    alt={star.name}
                    width={32}
                    height={32}
                    className="w-full h-full object-cover object-top"
                    unoptimized
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-950 p-0.5 border border-white/20">
                    <Image
                      src={getClubCrest(star.club)}
                      alt={star.club}
                      width={14}
                      height={14}
                      className="w-full h-full object-contain"
                      unoptimized
                    />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate">{star.label}</div>
                  <div className="text-[10px] text-pl-text-muted truncate">{star.club.split(" ")[0]}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-5 pl-card space-y-5 bg-slate-900/60 border-white/10">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sliders className="w-4 h-4 text-pl-green" /> Player Attributes
            </div>
            {loading && <span className="text-xs text-pl-green animate-pulse">Calculating...</span>}
          </div>

          <div>
            <label className="text-xs font-semibold text-pl-text-secondary block mb-1.5">
              Select Preset Player
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className="pl-search w-full"
            >
              <option value="custom">Custom Parameters (Sandbox Mode)...</option>
              {players.slice(0, 30).map((p) => (
                <option key={p.player_id} value={p.name}>
                  {p.name} ({p.club} - {p.position})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-pl-text-secondary block mb-1.5">
                Position
              </label>
              <select
                value={position}
                onChange={(e) => {
                  setSelectedPreset("custom");
                  setPosition(e.target.value);
                }}
                className="pl-search w-full"
              >
                <option value="FW">Forward (FW)</option>
                <option value="MF">Midfielder (MF)</option>
                <option value="DF">Defender (DF)</option>
                <option value="GK">Goalkeeper (GK)</option>
              </select>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-pl-text-secondary mb-1.5">
                <span>Age</span>
                <span className="text-pl-green font-bold">{age} yrs</span>
              </div>
              <input
                type="range"
                min={17}
                max={38}
                value={age}
                onChange={(e) => {
                  setSelectedPreset("custom");
                  setAge(Number(e.target.value));
                }}
                className="w-full accent-[#00ff85] cursor-pointer"
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-pl-text-secondary mb-1.5">
              <span>Minutes Played</span>
              <span className="text-pl-cyan font-bold">{minutesPlayed} mins</span>
            </div>
            <input
              type="range"
              min={180}
              max={3420}
              step={90}
              value={minutesPlayed}
              onChange={(e) => {
                setSelectedPreset("custom");
                setMinutesPlayed(Number(e.target.value));
              }}
              className="w-full accent-[#00d4ff] cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-pl-text-secondary mb-1.5">
                <span>Goals</span>
                <span className="text-pl-green font-bold">{goals}</span>
              </div>
              <input
                type="range"
                min={0}
                max={38}
                value={goals}
                onChange={(e) => {
                  setSelectedPreset("custom");
                  setGoals(Number(e.target.value));
                }}
                className="w-full accent-[#00ff85] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-pl-text-secondary mb-1.5">
                <span>Assists</span>
                <span className="text-pl-cyan font-bold">{assists}</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={assists}
                onChange={(e) => {
                  setSelectedPreset("custom");
                  setAssists(Number(e.target.value));
                }}
                className="w-full accent-[#00d4ff] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-7 space-y-5">
          {/* Hero Valuation */}
          <div className="pl-card bg-gradient-to-br from-pl-purple/90 via-slate-900 to-slate-950 border border-pl-green/30 p-6 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1">
                <div className="stat-label">Estimated Transfer Valuation</div>
                <div className="text-stat-xl text-gradient-pl mt-2 font-black tracking-tight">
                  {prediction ? `€${prediction.valuation_eur_m.toFixed(1)}M` : "€—M"}
                </div>
                <div className="text-xs text-pl-text-muted mt-2 flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-pl-green" />
                  {position} · Age {age} · {goals}G · {assists}A · {minutesPlayed} Mins
                </div>
              </div>

              {activePlayer ? (
                <div
                  className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/10 hover:border-pl-cyan/40 cursor-pointer transition-all shrink-0"
                  onClick={() => setDrawerPlayer(activePlayer)}
                  title="Click to view full dossier"
                >
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 bg-slate-800">
                    <Image
                      src={getPlayerPhoto(activePlayer.name)}
                      alt={activePlayer.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover object-top"
                      unoptimized
                    />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 p-0.5 border border-white/20">
                      <Image
                        src={getClubCrest(activePlayer.club)}
                        alt={activePlayer.club}
                        width={20}
                        height={20}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white flex items-center gap-1.5">
                      <span>{activePlayer.name}</span>
                      <ExternalLink size={12} className="text-pl-cyan" />
                    </div>
                    <div className="text-xs text-pl-text-muted">{activePlayer.club}</div>
                    <div className="text-[11px] text-pl-green font-semibold mt-0.5">
                      Actual: €{activePlayer.market_value_eur_m}M
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-xs text-pl-text-muted bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <User size={16} className="text-pl-cyan" />
                  <span>Custom Profile Simulation</span>
                </div>
              )}
            </div>
          </div>

          {/* Scatter Chart */}
          <div className="pl-card bg-slate-900/60 border-white/10">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-pl-green" /> Actual vs Fitted Valuations
              </div>
              <span className="text-[11px] text-pl-text-muted">Click dot to inspect player</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Actual"
                    unit="M"
                    stroke="#fff6"
                    fontSize={11}
                    domain={[0, "auto"]}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Predicted"
                    unit="M"
                    stroke="#fff6"
                    fontSize={11}
                    domain={[0, "auto"]}
                  />
                  <ZAxis range={[40, 180]} />
                  <Tooltip
                    content={({ payload }) => {
                      if (!payload?.length) return null;
                      const pt = payload[0].payload;
                      return (
                        <div className="bg-slate-900 border border-white/20 p-2.5 rounded-xl text-xs shadow-2xl">
                          <div className="font-bold text-white">{pt.name}</div>
                          <div className="text-pl-text-secondary">Actual: €{pt.x}M</div>
                          <div className="text-pl-green font-semibold">Fitted: €{pt.y}M</div>
                          <div className="text-[10px] text-pl-cyan mt-1">Click dot to open dossier</div>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine
                    segment={[
                      { x: 0, y: 0 },
                      { x: 180, y: 180 },
                    ]}
                    stroke="rgba(255,255,255,0.25)"
                    strokeDasharray="4 4"
                  />
                  <Scatter
                    name="Historical"
                    data={chartData}
                    fill="#00d4ff"
                    opacity={0.45}
                    onClick={handleScatterClick}
                    className="cursor-pointer"
                  />
                  <Scatter
                    name="Current"
                    data={userPoint}
                    fill="#00ff85"
                    shape="star"
                    onClick={handleScatterClick}
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Player Detail Drawer */}
      <PlayerDetailDrawer
        player={drawerPlayer}
        open={drawerPlayer !== null}
        onClose={() => setDrawerPlayer(null)}
      />
    </div>
  );
}
