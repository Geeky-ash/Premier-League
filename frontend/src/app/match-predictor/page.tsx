"use client";

import React, { useEffect, useState } from "react";
import { predictMatchOutcome, fetchClubs, MatchPredictResponse } from "@/lib/api";
import { motion } from "framer-motion";
import { ShieldAlert, Trophy, Flame, BarChart2, CheckCircle } from "lucide-react";

export default function MatchPredictorPage() {
  const [clubs, setClubs] = useState<string[]>([]);
  const [homeTeam, setHomeTeam] = useState<string>("Arsenal");
  const [awayTeam, setAwayTeam] = useState<string>("Chelsea");

  const [homePossession, setHomePossession] = useState<number>(56);
  const [homeShots, setHomeShots] = useState<number>(16);
  const [awayShots, setAwayShots] = useState<number>(9);
  const [homeGoals, setHomeGoals] = useState<number>(2);
  const [awayGoals, setAwayGoals] = useState<number>(1);
  const [homeForm, setHomeForm] = useState<number>(11);
  const [awayForm, setAwayForm] = useState<number>(6);

  const [prediction, setPrediction] = useState<MatchPredictResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchClubs()
      .then((data) => setClubs(data))
      .catch((err) => console.error("Error fetching clubs:", err));
  }, []);

  const triggerPredict = async () => {
    setLoading(true);
    try {
      const res = await predictMatchOutcome({
        home_team: homeTeam,
        away_team: awayTeam,
        home_possession: homePossession,
        home_shots: homeShots,
        away_shots: awayShots,
        home_goals: homeGoals,
        away_goals: awayGoals,
        home_form_points: homeForm,
        away_form_points: awayForm,
      });
      setPrediction(res);
    } catch (err) {
      console.error("Match prediction failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      triggerPredict();
    }, 150);
    return () => clearTimeout(handler);
  }, [homeTeam, awayTeam, homePossession, homeShots, awayShots, homeGoals, awayGoals, homeForm, awayForm]);

  const pHome = prediction?.probabilities["Home Win"] || 50;
  const pDraw = prediction?.probabilities["Draw"] || 25;
  const pAway = prediction?.probabilities["Away Win"] || 25;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00FF85]">
          <ShieldAlert className="w-4 h-4" />
          Module 02 // Gradient-Boosted Classification
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Match Outcome Predictor
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Predict 3-way matchday outcomes (Win / Draw / Loss) calibrated using multi-class XGBoost.
        </p>
      </div>

      {/* Fixture Team Selectors */}
      <div className="glass-panel p-6">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">🏟️ Home Team</label>
            <select
              value={homeTeam}
              onChange={(e) => setHomeTeam(e.target.value)}
              className="w-full bg-[#121826] border border-white/15 rounded-xl px-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-[#00FF85]"
            >
              {clubs.map((c) => (
                <option key={c} value={c} disabled={c === awayTeam}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-1 text-center font-extrabold text-sm text-[#00FF85]">
            VS
          </div>

          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-bold text-slate-300 block">✈️ Away Team</label>
            <select
              value={awayTeam}
              onChange={(e) => setAwayTeam(e.target.value)}
              className="w-full bg-[#121826] border border-white/15 rounded-xl px-4 py-2.5 text-base font-bold text-white focus:outline-none focus:border-[#E90052]"
            >
              {clubs.map((c) => (
                <option key={c} value={c} disabled={c === homeTeam}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2-Column Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Tactical Inputs */}
        <div className="lg:col-span-6 glass-panel p-6 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#00FF85]" />
              Matchday Tactical Levers
            </div>
            {loading && <span className="text-xs text-[#00FF85] animate-pulse">Computing XGBoost...</span>}
          </div>

          {/* Possession Slider */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-white">{homeTeam}: {homePossession}%</span>
              <span className="text-slate-400">Possession</span>
              <span className="text-white">{awayTeam}: {100 - homePossession}%</span>
            </div>
            <input
              type="range"
              min={25}
              max={75}
              value={homePossession}
              onChange={(e) => setHomePossession(Number(e.target.value))}
              className="w-full accent-[#00FF85] cursor-pointer"
            />
          </div>

          {/* Expected Goals */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">{homeTeam} Goals</span>
                <span className="text-[#00FF85] font-bold">{homeGoals}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={homeGoals}
                onChange={(e) => setHomeGoals(Number(e.target.value))}
                className="w-full accent-[#00FF85] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">{awayTeam} Goals</span>
                <span className="text-[#E90052] font-bold">{awayGoals}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={awayGoals}
                onChange={(e) => setAwayGoals(Number(e.target.value))}
                className="w-full accent-[#E90052] cursor-pointer"
              />
            </div>
          </div>

          {/* Shots */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">{homeTeam} Shots</span>
                <span className="text-[#00FF85] font-bold">{homeShots}</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={homeShots}
                onChange={(e) => setHomeShots(Number(e.target.value))}
                className="w-full accent-[#00FF85] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">{awayTeam} Shots</span>
                <span className="text-[#E90052] font-bold">{awayShots}</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={awayShots}
                onChange={(e) => setAwayShots(Number(e.target.value))}
                className="w-full accent-[#E90052] cursor-pointer"
              />
            </div>
          </div>

          {/* Form Points */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">{homeTeam} Form (L5)</span>
                <span className="text-[#00FF85] font-bold">{homeForm} pts</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={homeForm}
                onChange={(e) => setHomeForm(Number(e.target.value))}
                className="w-full accent-[#00FF85] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-slate-300">{awayTeam} Form (L5)</span>
                <span className="text-[#E90052] font-bold">{awayForm} pts</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={awayForm}
                onChange={(e) => setAwayForm(Number(e.target.value))}
                className="w-full accent-[#E90052] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Outcome Probabilities */}
        <div className="lg:col-span-6 space-y-6">
          {/* Hero Outcome Result */}
          <div className="p-8 rounded-2xl bg-gradient-to-br from-[#38003C]/50 via-[#121826] to-[#0E131F] border border-[#00FF85]/30 shadow-glass-glow">
            <div className="text-xs uppercase font-bold tracking-widest text-slate-400">
              Projected Match Result
            </div>
            <div className="text-4xl font-extrabold tracking-tight mt-2 text-transparent bg-clip-text bg-gradient-to-r from-[#00FF85] via-[#00E5FF] to-white">
              {prediction ? prediction.predicted_outcome : "Simulating..."}
            </div>
            <div className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-[#00FF85]" />
              Confidence Rating: {prediction ? `${prediction.confidence}%` : "--%"}
            </div>
          </div>

          {/* Animated Probability Bars */}
          <div className="glass-panel p-6 space-y-5">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-[#00FF85]" />
              Calibrated Probability Breakdown
            </div>

            {/* Home Win Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#00FF85] font-bold">🟢 {homeTeam} Win</span>
                <span className="text-[#00FF85] font-extrabold">{pHome}%</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#00FF85]"
                  initial={{ width: 0 }}
                  animate={{ width: `${pHome}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Draw Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#00E5FF] font-bold">⚪ Draw</span>
                <span className="text-[#00E5FF] font-extrabold">{pDraw}%</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#00E5FF]"
                  initial={{ width: 0 }}
                  animate={{ width: `${pDraw}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Away Win Bar */}
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1">
                <span className="text-[#E90052] font-bold">🔴 {awayTeam} Win</span>
                <span className="text-[#E90052] font-extrabold">{pAway}%</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#E90052]"
                  initial={{ width: 0 }}
                  animate={{ width: `${pAway}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
