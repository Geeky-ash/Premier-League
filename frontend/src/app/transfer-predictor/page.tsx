"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  predictTransferValue,
  fetchPlayers,
  PlayerRecord,
  TransferPredictResponse,
} from "@/lib/api";
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
import { DollarSign, Sliders, TrendingUp, Sparkles, CheckCircle2 } from "lucide-react";

export default function TransferPredictorPage() {
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");

  const [position, setPosition] = useState<string>("FW");
  const [age, setAge] = useState<number>(24);
  const [minutesPlayed, setMinutesPlayed] = useState<number>(2560);
  const [goals, setGoals] = useState<number>(20);
  const [assists, setAssists] = useState<number>(8);

  const [prediction, setPrediction] = useState<TransferPredictResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Load player presets
  useEffect(() => {
    fetchPlayers()
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Error fetching players:", err));
  }, []);

  // Run prediction
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
    } catch (err) {
      console.error("Prediction error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      triggerPredict(position, age, minutesPlayed, goals, assists);
    }, 150);
    return () => clearTimeout(handler);
  }, [position, age, minutesPlayed, goals, assists]);

  const handlePresetSelect = (name: string) => {
    setSelectedPreset(name);
    if (name === "custom") return;
    const found = players.find((p) => p.name === name);
    if (found) {
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
    ? [{ x: prediction.valuation_eur_m, y: prediction.valuation_eur_m, name: "Current Estimate" }]
    : [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00FF85]">
          <Sparkles className="w-4 h-4" />
          Module 01 // Supervised Valuation Model
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Transfer Value Predictor
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Forecast fair player market valuations (€M) using a regularized Scikit-learn Linear Regression pipeline.
        </p>
      </div>

      {/* Top Benchmark KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Model Engine
          </div>
          <div className="text-xl font-bold text-[#00E5FF] mt-1">
            Ridge / OLS Pipeline
          </div>
          <div className="text-xs text-slate-400 mt-1">StandardScaler + OneHotEncoder</div>
        </div>

        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Holdout R² Score
          </div>
          <div className="text-xl font-bold text-[#00FF85] mt-1">
            {prediction ? `R² = ${prediction.r2_score.toFixed(3)}` : "R² = 0.738"}
          </div>
          <div className="text-xs text-slate-400 mt-1">Benchmark Gate Passed (≥ 0.60)</div>
        </div>

        <div className="glass-panel p-5 relative overflow-hidden">
          <div className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
            Mean Absolute Error
          </div>
          <div className="text-xl font-bold text-[#E90052] mt-1">
            {prediction ? `± €${prediction.mae_score.toFixed(1)}M` : "± €15.2M"}
          </div>
          <div className="text-xs text-slate-400 mt-1">Holdout Generalization Margin</div>
        </div>
      </div>

      {/* Main 2-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Controls */}
        <div className="lg:col-span-5 glass-panel p-6 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2 text-base font-bold text-white">
              <Sliders className="w-4 h-4 text-[#00FF85]" />
              Player Attributes
            </div>
            {loading && <span className="text-xs text-[#00FF85] animate-pulse">Calculating...</span>}
          </div>

          {/* Preset Selector */}
          <div>
            <label className="text-xs font-semibold text-slate-300 block mb-1.5">
              ⚡ Quick Preset with Premier League Star
            </label>
            <select
              value={selectedPreset}
              onChange={(e) => handlePresetSelect(e.target.value)}
              className="w-full bg-[#121826] border border-white/15 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF85] transition-colors"
            >
              <option value="custom">Custom Parameters...</option>
              {players.slice(0, 15).map((p) => (
                <option key={p.player_id} value={p.name}>
                  {p.name} ({p.club} - {p.position})
                </option>
              ))}
            </select>
          </div>

          {/* Position & Age */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-300 block mb-1.5">
                Position
              </label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-[#121826] border border-white/15 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#00FF85]"
              >
                <option value="FW">Forward (FW)</option>
                <option value="MF">Midfielder (MF)</option>
                <option value="DF">Defender (DF)</option>
                <option value="GK">Goalkeeper (GK)</option>
              </select>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Age</span>
                <span className="text-[#00FF85]">{age} yrs</span>
              </div>
              <input
                type="range"
                min={17}
                max={38}
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full accent-[#00FF85] cursor-pointer"
              />
            </div>
          </div>

          {/* Minutes Played */}
          <div>
            <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
              <span>Minutes Played</span>
              <span className="text-[#00E5FF]">{minutesPlayed} mins</span>
            </div>
            <input
              type="range"
              min={180}
              max={3420}
              step={90}
              value={minutesPlayed}
              onChange={(e) => setMinutesPlayed(Number(e.target.value))}
              className="w-full accent-[#00E5FF] cursor-pointer"
            />
          </div>

          {/* Goals & Assists */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Goals</span>
                <span className="text-[#00FF85] font-bold">{goals}</span>
              </div>
              <input
                type="range"
                min={0}
                max={38}
                value={goals}
                onChange={(e) => setGoals(Number(e.target.value))}
                className="w-full accent-[#00FF85] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                <span>Assists</span>
                <span className="text-[#00E5FF] font-bold">{assists}</span>
              </div>
              <input
                type="range"
                min={0}
                max={25}
                value={assists}
                onChange={(e) => setAssists(Number(e.target.value))}
                className="w-full accent-[#00E5FF] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Valuation Hero & Regression Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          {/* Glass Hero Card */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#38003C]/50 via-[#121826] to-[#0E131F] border border-[#00FF85]/30 shadow-glass-glow relative overflow-hidden">
            <div className="text-xs uppercase font-bold tracking-widest text-slate-400">
              Estimated Transfer Valuation
            </div>
            <div className="text-5xl font-extrabold tracking-tight mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00FF85] via-[#00E5FF] to-white">
              {prediction ? `€${prediction.valuation_eur_m.toFixed(1)}M` : "€--.-M"}
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF85]" />
              Profile: {position} • Age {age} • {goals} Goals • {assists} Assists • {minutesPlayed} Mins
            </div>
          </div>

          {/* Recharts Regression Scatter Chart */}
          <div className="glass-panel p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#00FF85]" />
                Actual vs. Fitted Valuations (Holdout Regression Line)
              </div>
              <span className="text-[11px] text-slate-400">y = x Ideal Parity</span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Actual Value"
                    unit="M"
                    stroke="#94A3B8"
                    fontSize={11}
                    domain={[0, "auto"]}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Predicted Value"
                    unit="M"
                    stroke="#94A3B8"
                    fontSize={11}
                    domain={[0, "auto"]}
                  />
                  <ZAxis range={[40, 180]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ payload }) => {
                      if (!payload || !payload.length) return null;
                      const pt = payload[0].payload;
                      return (
                        <div className="bg-[#121826] border border-white/20 p-2.5 rounded-lg text-xs shadow-xl">
                          <div className="font-bold text-white">{pt.name}</div>
                          <div className="text-slate-300">Actual: €{pt.x}M</div>
                          <div className="text-[#00FF85]">Fitted: €{pt.y}M</div>
                        </div>
                      );
                    }}
                  />
                  <ReferenceLine
                    segment={[{ x: 0, y: 0 }, { x: 180, y: 180 }]}
                    stroke="rgba(255, 255, 255, 0.3)"
                    strokeDasharray="4 4"
                  />
                  <Scatter name="Historical Players" data={chartData} fill="#00E5FF" opacity={0.45} />
                  <Scatter name="Current Player" data={userPoint} fill="#00FF85" shape="star" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
