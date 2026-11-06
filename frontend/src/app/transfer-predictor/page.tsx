"use client";

import React, { useEffect, useState, useTransition } from "react";
import {
  predictTransferValue,
  fetchPlayers,
  PlayerRecord,
  TransferPredictResponse,
} from "@/lib/api";
import {
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, CartesianGrid,
} from "recharts";
import { TrendingUp, Sliders, Sparkles, CheckCircle2 } from "lucide-react";

export default function TransferPredictorPage() {
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<string>("custom");
  const [position, setPosition] = useState("FW");
  const [age, setAge] = useState(24);
  const [minutesPlayed, setMinutesPlayed] = useState(2560);
  const [goals, setGoals] = useState(20);
  const [assists, setAssists] = useState(8);
  const [prediction, setPrediction] = useState<TransferPredictResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPlayers().then(setPlayers).catch(() => {});
  }, []);

  const triggerPredict = async (pos: string, a: number, m: number, g: number, ast: number) => {
    setLoading(true);
    try {
      const res = await predictTransferValue({ position: pos, age: a, minutes_played: m, goals: g, assists: ast });
      setPrediction(res);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    const t = setTimeout(() => triggerPredict(position, age, minutesPlayed, goals, assists), 150);
    return () => clearTimeout(t);
  }, [position, age, minutesPlayed, goals, assists]);

  const handlePresetSelect = (name: string) => {
    setSelectedPreset(name);
    if (name === "custom") return;
    const found = players.find((p) => p.name === name);
    if (found) { setPosition(found.position); setAge(found.age); setMinutesPlayed(found.minutes_played); setGoals(found.goals); setAssists(found.assists); }
  };

  const chartData = (prediction?.historical_trend || []).map((pt) => ({ x: pt.actual_value, y: pt.fitted_value, name: pt.name, pos: pt.position }));
  const userPoint = prediction ? [{ x: prediction.valuation_eur_m, y: prediction.valuation_eur_m, name: "Current Estimate" }] : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pl-green">
          <Sparkles className="w-4 h-4" /> Module 01 // Supervised Valuation Model
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">Transfer Value Predictor</h2>
        <p className="text-sm text-pl-text-muted mt-1">Forecast fair player market valuations (€M) using a regularized Linear Regression pipeline.</p>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="pl-card"><div className="stat-label">Model Engine</div><div className="text-lg font-bold text-pl-cyan mt-1">Ridge / OLS Pipeline</div><div className="text-xs text-pl-text-muted mt-1">StandardScaler + OneHotEncoder</div></div>
        <div className="pl-card"><div className="stat-label">Holdout R² Score</div><div className="text-lg font-bold text-pl-green mt-1">{prediction ? `R² = ${prediction.r2_score.toFixed(3)}` : "R² = —"}</div><div className="text-xs text-pl-text-muted mt-1">Benchmark Gate ≥ 0.60</div></div>
        <div className="pl-card"><div className="stat-label">Mean Absolute Error</div><div className="text-lg font-bold text-pl-magenta mt-1">{prediction ? `± €${prediction.mae_score.toFixed(1)}M` : "± €—M"}</div><div className="text-xs text-pl-text-muted mt-1">Holdout Generalization Margin</div></div>
      </div>

      {/* 2-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Controls */}
        <div className="lg:col-span-5 pl-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-pl-border">
            <div className="flex items-center gap-2 text-sm font-bold text-white"><Sliders className="w-4 h-4 text-pl-green" /> Player Attributes</div>
            {loading && <span className="text-xs text-pl-green animate-pulse">Calculating...</span>}
          </div>

          <div>
            <label className="text-xs font-semibold text-pl-text-secondary block mb-1.5">⚡ Quick Preset</label>
            <select value={selectedPreset} onChange={(e) => handlePresetSelect(e.target.value)} className="pl-search">
              <option value="custom">Custom Parameters...</option>
              {players.slice(0, 15).map((p) => (<option key={p.player_id} value={p.name}>{p.name} ({p.club} - {p.position})</option>))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div><label className="text-xs font-semibold text-pl-text-secondary block mb-1.5">Position</label>
              <select value={position} onChange={(e) => setPosition(e.target.value)} className="pl-search"><option value="FW">Forward (FW)</option><option value="MF">Midfielder (MF)</option><option value="DF">Defender (DF)</option><option value="GK">Goalkeeper (GK)</option></select></div>
            <div><div className="flex justify-between text-xs font-semibold text-pl-text-secondary mb-1.5"><span>Age</span><span className="text-pl-green">{age} yrs</span></div>
              <input type="range" min={17} max={38} value={age} onChange={(e) => setAge(Number(e.target.value))} className="w-full accent-[#00ff85] cursor-pointer" /></div>
          </div>

          <div><div className="flex justify-between text-xs font-semibold text-pl-text-secondary mb-1.5"><span>Minutes Played</span><span className="text-pl-cyan">{minutesPlayed} mins</span></div>
            <input type="range" min={180} max={3420} step={90} value={minutesPlayed} onChange={(e) => setMinutesPlayed(Number(e.target.value))} className="w-full accent-[#00d4ff] cursor-pointer" /></div>

          <div className="grid grid-cols-2 gap-4">
            <div><div className="flex justify-between text-xs font-semibold text-pl-text-secondary mb-1.5"><span>Goals</span><span className="text-pl-green font-bold">{goals}</span></div>
              <input type="range" min={0} max={38} value={goals} onChange={(e) => setGoals(Number(e.target.value))} className="w-full accent-[#00ff85] cursor-pointer" /></div>
            <div><div className="flex justify-between text-xs font-semibold text-pl-text-secondary mb-1.5"><span>Assists</span><span className="text-pl-cyan font-bold">{assists}</span></div>
              <input type="range" min={0} max={25} value={assists} onChange={(e) => setAssists(Number(e.target.value))} className="w-full accent-[#00d4ff] cursor-pointer" /></div>
          </div>
        </div>

        {/* Right: Results */}
        <div className="lg:col-span-7 space-y-5">
          {/* Hero Valuation */}
          <div className="pl-card bg-pl-gradient-magenta border-pl-green/30">
            <div className="stat-label">Estimated Transfer Valuation</div>
            <div className="text-stat-xl text-gradient-pl mt-2">{prediction ? `€${prediction.valuation_eur_m.toFixed(1)}M` : "€—M"}</div>
            <div className="text-xs text-pl-text-muted mt-2 flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-pl-green" />
              {position} · Age {age} · {goals}G · {assists}A · {minutesPlayed} Mins
            </div>
          </div>

          {/* Scatter Chart */}
          <div className="pl-card">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm font-bold text-white flex items-center gap-2"><TrendingUp className="w-4 h-4 text-pl-green" /> Actual vs Fitted Valuations</div>
              <span className="text-[11px] text-pl-text-muted">y = x Ideal Parity</span>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                  <XAxis type="number" dataKey="x" name="Actual" unit="M" stroke="#fff6" fontSize={11} domain={[0, "auto"]} />
                  <YAxis type="number" dataKey="y" name="Predicted" unit="M" stroke="#fff6" fontSize={11} domain={[0, "auto"]} />
                  <ZAxis range={[40, 180]} />
                  <Tooltip content={({ payload }) => {
                    if (!payload?.length) return null;
                    const pt = payload[0].payload;
                    return (<div className="bg-pl-dark border border-pl-border p-2.5 rounded-pl text-xs shadow-xl"><div className="font-bold text-white">{pt.name}</div><div className="text-pl-text-secondary">Actual: €{pt.x}M</div><div className="text-pl-green">Fitted: €{pt.y}M</div></div>);
                  }} />
                  <ReferenceLine segment={[{ x: 0, y: 0 }, { x: 180, y: 180 }]} stroke="rgba(255,255,255,0.25)" strokeDasharray="4 4" />
                  <Scatter name="Historical" data={chartData} fill="#00d4ff" opacity={0.45} />
                  <Scatter name="Current" data={userPoint} fill="#00ff85" shape="star" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
