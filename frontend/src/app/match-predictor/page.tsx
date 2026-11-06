"use client";

import React, { useEffect, useState } from "react";
import { predictMatchOutcome, fetchClubs, MatchPredictResponse } from "@/lib/api";
import { motion } from "framer-motion";
import { ShieldAlert, Trophy, Flame, BarChart2, CheckCircle } from "lucide-react";

export default function MatchPredictorPage() {
  const [clubs, setClubs] = useState<string[]>([]);
  const [homeTeam, setHomeTeam] = useState("Arsenal");
  const [awayTeam, setAwayTeam] = useState("Chelsea");
  const [homePossession, setHomePossession] = useState(56);
  const [homeShots, setHomeShots] = useState(16);
  const [awayShots, setAwayShots] = useState(9);
  const [homeGoals, setHomeGoals] = useState(2);
  const [awayGoals, setAwayGoals] = useState(1);
  const [homeForm, setHomeForm] = useState(11);
  const [awayForm, setAwayForm] = useState(6);
  const [prediction, setPrediction] = useState<MatchPredictResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => { fetchClubs().then(setClubs).catch(() => {}); }, []);

  const triggerPredict = async () => {
    setLoading(true);
    try {
      const res = await predictMatchOutcome({ home_team: homeTeam, away_team: awayTeam, home_possession: homePossession, home_shots: homeShots, away_shots: awayShots, home_goals: homeGoals, away_goals: awayGoals, home_form_points: homeForm, away_form_points: awayForm });
      setPrediction(res);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => {
    const t = setTimeout(triggerPredict, 150);
    return () => clearTimeout(t);
  }, [homeTeam, awayTeam, homePossession, homeShots, awayShots, homeGoals, awayGoals, homeForm, awayForm]);

  const pHome = prediction?.probabilities["Home Win"] || 50;
  const pDraw = prediction?.probabilities["Draw"] || 25;
  const pAway = prediction?.probabilities["Away Win"] || 25;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pl-green">
          <ShieldAlert className="w-4 h-4" /> Module 02 // Gradient-Boosted Classification
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">Match Outcome Predictor</h2>
        <p className="text-sm text-pl-text-muted mt-1">Predict 3-way matchday outcomes calibrated using multi-class XGBoost.</p>
      </div>

      {/* Fixture Selectors */}
      <div className="pl-card">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-pl-text-secondary block">🏟️ Home Team</label>
            <select value={homeTeam} onChange={(e) => setHomeTeam(e.target.value)} className="pl-search text-base font-bold">
              {clubs.map((c) => (<option key={c} value={c} disabled={c === awayTeam}>{c}</option>))}
            </select>
          </div>
          <div className="md:col-span-1 text-center font-extrabold text-sm text-pl-green">VS</div>
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-pl-text-secondary block">✈️ Away Team</label>
            <select value={awayTeam} onChange={(e) => setAwayTeam(e.target.value)} className="pl-search text-base font-bold">
              {clubs.map((c) => (<option key={c} value={c} disabled={c === homeTeam}>{c}</option>))}
            </select>
          </div>
        </div>
      </div>

      {/* 2-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tactical Inputs */}
        <div className="lg:col-span-6 pl-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-pl-border">
            <div className="text-sm font-bold text-white flex items-center gap-2"><Flame className="w-4 h-4 text-pl-green" /> Matchday Tactical Levers</div>
            {loading && <span className="text-xs text-pl-green animate-pulse">Computing XGBoost...</span>}
          </div>

          {/* Possession */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-white">{homeTeam}: {homePossession}%</span>
              <span className="text-pl-text-muted">Possession</span>
              <span className="text-white">{awayTeam}: {100 - homePossession}%</span>
            </div>
            <input type="range" min={25} max={75} value={homePossession} onChange={(e) => setHomePossession(Number(e.target.value))} className="w-full accent-[#00ff85] cursor-pointer" />
          </div>

          {/* Goals */}
          <div className="grid grid-cols-2 gap-4">
            <div><div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-pl-text-secondary">{homeTeam} Goals</span><span className="text-pl-green font-bold">{homeGoals}</span></div>
              <input type="range" min={0} max={5} value={homeGoals} onChange={(e) => setHomeGoals(Number(e.target.value))} className="w-full accent-[#00ff85] cursor-pointer" /></div>
            <div><div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-pl-text-secondary">{awayTeam} Goals</span><span className="text-pl-magenta font-bold">{awayGoals}</span></div>
              <input type="range" min={0} max={5} value={awayGoals} onChange={(e) => setAwayGoals(Number(e.target.value))} className="w-full accent-[#e90052] cursor-pointer" /></div>
          </div>

          {/* Shots */}
          <div className="grid grid-cols-2 gap-4">
            <div><div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-pl-text-secondary">{homeTeam} Shots</span><span className="text-pl-green font-bold">{homeShots}</span></div>
              <input type="range" min={2} max={30} value={homeShots} onChange={(e) => setHomeShots(Number(e.target.value))} className="w-full accent-[#00ff85] cursor-pointer" /></div>
            <div><div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-pl-text-secondary">{awayTeam} Shots</span><span className="text-pl-magenta font-bold">{awayShots}</span></div>
              <input type="range" min={2} max={30} value={awayShots} onChange={(e) => setAwayShots(Number(e.target.value))} className="w-full accent-[#e90052] cursor-pointer" /></div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-4">
            <div><div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-pl-text-secondary">{homeTeam} Form (L5)</span><span className="text-pl-green font-bold">{homeForm} pts</span></div>
              <input type="range" min={0} max={15} value={homeForm} onChange={(e) => setHomeForm(Number(e.target.value))} className="w-full accent-[#00ff85] cursor-pointer" /></div>
            <div><div className="flex justify-between text-xs font-semibold mb-1.5"><span className="text-pl-text-secondary">{awayTeam} Form (L5)</span><span className="text-pl-magenta font-bold">{awayForm} pts</span></div>
              <input type="range" min={0} max={15} value={awayForm} onChange={(e) => setAwayForm(Number(e.target.value))} className="w-full accent-[#e90052] cursor-pointer" /></div>
          </div>
        </div>

        {/* Right: Outcome */}
        <div className="lg:col-span-6 space-y-5">
          {/* Hero */}
          <div className="pl-card bg-pl-gradient border-pl-green/30">
            <div className="stat-label">Projected Match Result</div>
            <div className="text-stat-xl text-gradient-pl mt-2">{prediction ? prediction.predicted_outcome : "Simulating..."}</div>
            <div className="text-xs text-pl-text-muted mt-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-pl-green" />
              Confidence: {prediction ? `${prediction.confidence}%` : "—%"}
            </div>
          </div>

          {/* Probability Bars */}
          <div className="pl-card space-y-5">
            <div className="text-sm font-bold text-white flex items-center gap-2"><BarChart2 className="w-4 h-4 text-pl-green" /> Calibrated Probability Breakdown</div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1"><span className="text-pl-green font-bold">🟢 {homeTeam} Win</span><span className="text-pl-green font-extrabold">{pHome}%</span></div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden"><motion.div className="h-full bg-pl-green rounded-full" initial={{ width: 0 }} animate={{ width: `${pHome}%` }} transition={{ duration: 0.5 }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1"><span className="text-pl-cyan font-bold">⚪ Draw</span><span className="text-pl-cyan font-extrabold">{pDraw}%</span></div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden"><motion.div className="h-full bg-pl-cyan rounded-full" initial={{ width: 0 }} animate={{ width: `${pDraw}%` }} transition={{ duration: 0.5 }} /></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1"><span className="text-pl-magenta font-bold">🔴 {awayTeam} Win</span><span className="text-pl-magenta font-extrabold">{pAway}%</span></div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden"><motion.div className="h-full bg-pl-magenta rounded-full" initial={{ width: 0 }} animate={{ width: `${pAway}%` }} transition={{ duration: 0.5 }} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
