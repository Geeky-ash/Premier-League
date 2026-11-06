"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { predictMatchOutcome, fetchClubs, MatchPredictResponse } from "@/lib/api";
import { getClubCrest } from "@/lib/logos";
import { motion } from "framer-motion";
import {
  ShieldAlert,
  Flame,
  BarChart2,
  CheckCircle,
  Play,
  RotateCcw,
  Sparkles,
  Swords,
} from "lucide-react";

const FEATURED_DERBIES = [
  { name: "North London Derby", home: "Arsenal", away: "Tottenham Hotspur" },
  { name: "Manchester Derby", home: "Manchester City", away: "Manchester United" },
  { name: "Title Showdown", home: "Manchester City", away: "Liverpool" },
  { name: "London Rivalry", home: "Arsenal", away: "Chelsea" },
  { name: "North West Classic", home: "Liverpool", away: "Manchester United" },
];

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

  useEffect(() => {
    fetchClubs().then(setClubs).catch(() => {});
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
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const t = setTimeout(triggerPredict, 150);
    return () => clearTimeout(t);
  }, [
    homeTeam,
    awayTeam,
    homePossession,
    homeShots,
    awayShots,
    homeGoals,
    awayGoals,
    homeForm,
    awayForm,
  ]);

  const loadDerby = (home: string, away: string) => {
    setHomeTeam(home);
    setAwayTeam(away);
  };

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
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
          Match Outcome Predictor
        </h2>
        <p className="text-sm text-pl-text-muted mt-1">
          Predict 3-way matchday outcomes calibrated using a multi-class XGBoost model trained on historical Premier League tactical data.
        </p>
      </div>

      {/* Featured Derbies Quick Bar */}
      <div className="pl-card p-4 bg-slate-900/60 border-white/10">
        <div className="text-xs font-bold text-pl-text-muted uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Swords size={14} className="text-pl-cyan" />
            Featured Premier League Matchups
          </span>
          <span className="text-[11px] text-pl-cyan font-normal">Click to simulate fixture</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {FEATURED_DERBIES.map((d) => {
            const isMatch = homeTeam === d.home && awayTeam === d.away;
            return (
              <button
                key={d.name}
                type="button"
                onClick={() => loadDerby(d.home, d.away)}
                className={`p-2.5 rounded-xl text-left border transition-all flex flex-col justify-between ${
                  isMatch
                    ? "bg-pl-purple/50 border-pl-green text-white shadow-lg shadow-pl-green/10"
                    : "bg-slate-950/40 border-white/5 hover:border-white/20 text-slate-300"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1.5">
                  <Image
                    src={getClubCrest(d.home)}
                    alt={d.home}
                    width={20}
                    height={20}
                    unoptimized
                  />
                  <span className="text-[10px] font-bold text-pl-cyan">VS</span>
                  <Image
                    src={getClubCrest(d.away)}
                    alt={d.away}
                    width={20}
                    height={20}
                    unoptimized
                  />
                </div>
                <div className="text-xs font-bold truncate">{d.name}</div>
                <div className="text-[10px] text-pl-text-muted truncate">
                  {d.home.split(" ")[0]} v {d.away.split(" ")[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixture Matchup Banner */}
      <div className="pl-card bg-slate-900/70 border-white/10 p-6 relative overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
          {/* Home Team */}
          <div className="md:col-span-5 flex flex-col sm:flex-row items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/10">
              <Image
                src={getClubCrest(homeTeam)}
                alt={homeTeam}
                width={52}
                height={52}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1 w-full space-y-1 text-center sm:text-left">
              <label className="text-xs font-bold text-pl-cyan uppercase tracking-wider block">
                Home Club
              </label>
              <select
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                className="pl-search text-base font-bold w-full bg-slate-900"
              >
                {clubs.map((c) => (
                  <option key={c} value={c} disabled={c === awayTeam}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* VS Divider */}
          <div className="md:col-span-1 text-center flex flex-col items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-black text-pl-green shadow-inner">
              VS
            </div>
          </div>

          {/* Away Team */}
          <div className="md:col-span-5 flex flex-col sm:flex-row-reverse items-center gap-4 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center p-2 rounded-2xl bg-white/5 border border-white/10">
              <Image
                src={getClubCrest(awayTeam)}
                alt={awayTeam}
                width={52}
                height={52}
                className="w-full h-full object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1 w-full space-y-1 text-center sm:text-right">
              <label className="text-xs font-bold text-pl-magenta uppercase tracking-wider block">
                Away Club
              </label>
              <select
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                className="pl-search text-base font-bold w-full bg-slate-900"
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

        {/* Action Button Strip */}
        <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-pl-text-muted flex items-center gap-1.5">
            <Sparkles size={14} className="text-pl-green" />
            <span>Adjust levers below to simulate in-game tactical shifts</span>
          </div>
          <button
            type="button"
            onClick={triggerPredict}
            disabled={loading}
            className="pl-btn-primary flex items-center gap-2 text-xs py-2 px-4 shadow-lg shadow-pl-green/20"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
                <span>Simulating Match...</span>
              </>
            ) : (
              <>
                <Play size={14} fill="currentColor" />
                <span>Simulate Matchday Outcome</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 2-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tactical Inputs */}
        <div className="lg:col-span-6 pl-card space-y-5 bg-slate-900/60 border-white/10">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-pl-green" /> Matchday Tactical Levers
            </div>
            {loading && <span className="text-xs text-pl-green animate-pulse">Computing XGBoost...</span>}
          </div>

          {/* Possession */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-pl-cyan font-bold flex items-center gap-1">
                <Image
                  src={getClubCrest(homeTeam)}
                  alt={homeTeam}
                  width={14}
                  height={14}
                  unoptimized
                />
                {homeTeam}: {homePossession}%
              </span>
              <span className="text-pl-text-muted">Possession Share</span>
              <span className="text-pl-magenta font-bold flex items-center gap-1">
                {awayTeam}: {100 - homePossession}%
                <Image
                  src={getClubCrest(awayTeam)}
                  alt={awayTeam}
                  width={14}
                  height={14}
                  unoptimized
                />
              </span>
            </div>
            <input
              type="range"
              min={25}
              max={75}
              value={homePossession}
              onChange={(e) => setHomePossession(Number(e.target.value))}
              className="w-full accent-[#00ff85] cursor-pointer"
            />
          </div>

          {/* Goals */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-pl-text-secondary">{homeTeam} Goals</span>
                <span className="text-pl-green font-bold">{homeGoals}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={homeGoals}
                onChange={(e) => setHomeGoals(Number(e.target.value))}
                className="w-full accent-[#00ff85] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-pl-text-secondary">{awayTeam} Goals</span>
                <span className="text-pl-magenta font-bold">{awayGoals}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={awayGoals}
                onChange={(e) => setAwayGoals(Number(e.target.value))}
                className="w-full accent-[#e90052] cursor-pointer"
              />
            </div>
          </div>

          {/* Shots */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-pl-text-secondary">{homeTeam} Shots</span>
                <span className="text-pl-green font-bold">{homeShots}</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={homeShots}
                onChange={(e) => setHomeShots(Number(e.target.value))}
                className="w-full accent-[#00ff85] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-pl-text-secondary">{awayTeam} Shots</span>
                <span className="text-pl-magenta font-bold">{awayShots}</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={awayShots}
                onChange={(e) => setAwayShots(Number(e.target.value))}
                className="w-full accent-[#e90052] cursor-pointer"
              />
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-pl-text-secondary">{homeTeam} Form (L5)</span>
                <span className="text-pl-green font-bold">{homeForm} pts</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={homeForm}
                onChange={(e) => setHomeForm(Number(e.target.value))}
                className="w-full accent-[#00ff85] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-pl-text-secondary">{awayTeam} Form (L5)</span>
                <span className="text-pl-magenta font-bold">{awayForm} pts</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={awayForm}
                onChange={(e) => setAwayForm(Number(e.target.value))}
                className="w-full accent-[#e90052] cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Outcome */}
        <div className="lg:col-span-6 space-y-5">
          {/* Hero */}
          <div className="pl-card bg-gradient-to-br from-pl-purple/90 via-slate-900 to-slate-950 border border-pl-green/30 p-6 shadow-2xl relative overflow-hidden">
            <div className="stat-label">Projected Match Result</div>
            <div className="text-stat-xl text-gradient-pl mt-2 font-black tracking-tight">
              {prediction ? prediction.predicted_outcome : "Simulating..."}
            </div>
            <div className="text-xs text-pl-text-muted mt-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-pl-green" />
              Model Confidence: {prediction ? `${prediction.confidence}%` : "—%"}
            </div>
          </div>

          {/* Probability Bars */}
          <div className="pl-card space-y-5 bg-slate-900/60 border-white/10">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-pl-green" /> Calibrated Probability Breakdown
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 items-center">
                <span className="text-pl-green font-bold flex items-center gap-1.5">
                  <Image
                    src={getClubCrest(homeTeam)}
                    alt={homeTeam}
                    width={16}
                    height={16}
                    unoptimized
                  />
                  <span>{homeTeam} Win</span>
                </span>
                <span className="text-pl-green font-extrabold">{pHome}%</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-pl-green rounded-full shadow-lg shadow-pl-green/20"
                  initial={{ width: 0 }}
                  animate={{ width: `${pHome}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 items-center">
                <span className="text-pl-cyan font-bold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-pl-cyan/20 flex items-center justify-center text-[10px] text-pl-cyan font-black">
                    =
                  </span>
                  <span>Draw</span>
                </span>
                <span className="text-pl-cyan font-extrabold">{pDraw}%</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-pl-cyan rounded-full shadow-lg shadow-pl-cyan/20"
                  initial={{ width: 0 }}
                  animate={{ width: `${pDraw}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 items-center">
                <span className="text-pl-magenta font-bold flex items-center gap-1.5">
                  <Image
                    src={getClubCrest(awayTeam)}
                    alt={awayTeam}
                    width={16}
                    height={16}
                    unoptimized
                  />
                  <span>{awayTeam} Win</span>
                </span>
                <span className="text-pl-magenta font-extrabold">{pAway}%</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-pl-magenta rounded-full shadow-lg shadow-pl-magenta/20"
                  initial={{ width: 0 }}
                  animate={{ width: `${pAway}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
