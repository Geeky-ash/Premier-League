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

const REFEREE_OPTIONS = [
  { name: "Anthony Taylor", yellows: 4.62, strictness: 6.5 },
  { name: "Michael Oliver", yellows: 4.10, strictness: 5.8 },
  { name: "Paul Tierney", yellows: 3.85, strictness: 4.8 },
  { name: "Simon Hooper", yellows: 4.40, strictness: 6.2 },
  { name: "Jarred Gillett", yellows: 4.76, strictness: 7.2 },
  { name: "Andy Madley", yellows: 3.75, strictness: 4.2 },
];

export default function MatchPredictorPage() {
  const [clubs, setClubs] = useState<string[]>([]);
  const [homeTeam, setHomeTeam] = useState("Arsenal");
  const [awayTeam, setAwayTeam] = useState("Chelsea");
  const [selectedReferee, setSelectedReferee] = useState(REFEREE_OPTIONS[0]);
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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const h = params.get("home");
      const a = params.get("away");
      if (h) setHomeTeam(h);
      if (a) setAwayTeam(a);
    }
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
        referee_name: selectedReferee.name,
        referee_yellows_per_game: selectedReferee.yellows,
        referee_strictness_index: selectedReferee.strictness,
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
    selectedReferee,
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
    <div className="space-y-8 animate-fade-in font-body text-cohere-ink">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cohere-coral">
          <ShieldAlert className="w-4 h-4" /> Module 02 // Gradient-Boosted Classification
        </div>
        <h2 className="text-3xl font-display font-medium text-cohere-primary tracking-tight mt-1">
          Match Outcome Predictor
        </h2>
        <p className="text-sm text-cohere-body-muted mt-1 max-w-2xl">
          Predict 3-way matchday outcomes calibrated using a multi-class XGBoost model trained on historical Premier League tactical data.
        </p>
      </div>

      {/* Featured Derbies Quick Bar */}
      <div className="product-card p-5">
        <div className="text-xs font-bold text-cohere-slate uppercase tracking-wider mb-3 flex items-center justify-between font-mono">
          <span className="flex items-center gap-1.5">
            <Swords size={14} className="text-cohere-coral" />
            Featured Premier League Matchups
          </span>
          <span className="text-[11px] text-cohere-coral font-medium">Click to simulate fixture</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {FEATURED_DERBIES.map((d) => {
            const isMatch = homeTeam === d.home && awayTeam === d.away;
            return (
              <button
                key={d.name}
                type="button"
                onClick={() => loadDerby(d.home, d.away)}
                className={`p-3 rounded-lg text-left border transition-all flex flex-col justify-between ${
                  isMatch
                    ? "bg-white border-cohere-coral shadow-sm text-cohere-primary font-bold"
                    : "bg-white/80 border-cohere-hairline hover:border-cohere-primary/30 text-cohere-ink"
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-2">
                  <Image
                    src={getClubCrest(d.home)}
                    alt={d.home}
                    width={22}
                    height={22}
                    unoptimized
                  />
                  <span className="text-[10px] font-mono font-bold text-cohere-coral">VS</span>
                  <Image
                    src={getClubCrest(d.away)}
                    alt={d.away}
                    width={22}
                    height={22}
                    unoptimized
                  />
                </div>
                <div className="text-xs font-bold truncate">{d.name}</div>
                <div className="text-[10px] text-cohere-muted truncate">
                  {d.home.split(" ")[0]} v {d.away.split(" ")[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fixture Matchup Banner */}
      <div className="product-card p-6 relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-11 gap-6 items-center">
          {/* Home Team */}
          <div className="md:col-span-5 flex flex-col sm:flex-row items-center gap-4 bg-white p-4 rounded-lg border border-cohere-hairline">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center p-2 rounded-sm bg-cohere-soft-stone border border-cohere-hairline">
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
              <label className="text-xs font-mono font-bold text-cohere-coral uppercase tracking-wider block">
                Home Club
              </label>
              <select
                value={homeTeam}
                onChange={(e) => setHomeTeam(e.target.value)}
                className="cohere-input text-base font-bold w-full cursor-pointer bg-white text-cohere-ink border border-cohere-hairline rounded-sm px-3 py-2"
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
            <div className="w-10 h-10 rounded-full bg-white border border-cohere-coral flex items-center justify-center text-xs font-mono font-black text-cohere-coral shadow-sm">
              VS
            </div>
          </div>

          {/* Away Team */}
          <div className="md:col-span-5 flex flex-col sm:flex-row-reverse items-center gap-4 bg-white p-4 rounded-lg border border-cohere-hairline">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center p-2 rounded-sm bg-cohere-soft-stone border border-cohere-hairline">
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
              <label className="text-xs font-mono font-bold text-cohere-action-blue uppercase tracking-wider block">
                Away Club
              </label>
              <select
                value={awayTeam}
                onChange={(e) => setAwayTeam(e.target.value)}
                className="cohere-input text-base font-bold w-full cursor-pointer bg-white text-cohere-ink border border-cohere-hairline rounded-sm px-3 py-2"
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
        <div className="mt-5 pt-4 border-t border-cohere-hairline flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-cohere-slate flex items-center gap-1.5 font-mono">
            <Sparkles size={14} className="text-cohere-coral" />
            <span>Adjust levers below to simulate in-game tactical shifts</span>
          </div>
          <button
            type="button"
            onClick={triggerPredict}
            disabled={loading}
            className="button-primary"
          >
            {loading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
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
        <div className="lg:col-span-6 product-card space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-cohere-hairline">
            <div className="text-sm font-bold text-cohere-primary flex items-center gap-2">
              <Flame className="w-4 h-4 text-cohere-coral" /> Matchday Tactical Levers
            </div>
            {loading && <span className="text-xs text-cohere-coral animate-pulse">Computing XGBoost...</span>}
          </div>

          {/* Possession */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-cohere-coral font-bold flex items-center gap-1">
                <Image
                  src={getClubCrest(homeTeam)}
                  alt={homeTeam}
                  width={14}
                  height={14}
                  unoptimized
                />
                {homeTeam}: {homePossession}%
              </span>
              <span className="text-cohere-slate font-mono">Possession Share</span>
              <span className="text-cohere-action-blue font-bold flex items-center gap-1">
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
              className="w-full accent-[#ff7759] cursor-pointer"
            />
          </div>

          {/* Goals */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-cohere-ink">{homeTeam} Goals</span>
                <span className="text-cohere-coral font-bold">{homeGoals}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={homeGoals}
                onChange={(e) => setHomeGoals(Number(e.target.value))}
                className="w-full accent-[#ff7759] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-cohere-ink">{awayTeam} Goals</span>
                <span className="text-cohere-action-blue font-bold">{awayGoals}</span>
              </div>
              <input
                type="range"
                min={0}
                max={5}
                value={awayGoals}
                onChange={(e) => setAwayGoals(Number(e.target.value))}
                className="w-full accent-[#1863dc] cursor-pointer"
              />
            </div>
          </div>

          {/* Shots */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-cohere-ink">{homeTeam} Shots</span>
                <span className="text-cohere-coral font-bold">{homeShots}</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={homeShots}
                onChange={(e) => setHomeShots(Number(e.target.value))}
                className="w-full accent-[#ff7759] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-cohere-ink">{awayTeam} Shots</span>
                <span className="text-cohere-action-blue font-bold">{awayShots}</span>
              </div>
              <input
                type="range"
                min={2}
                max={30}
                value={awayShots}
                onChange={(e) => setAwayShots(Number(e.target.value))}
                className="w-full accent-[#1863dc] cursor-pointer"
              />
            </div>
          </div>

          {/* Form */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-cohere-ink">{homeTeam} Form (L5)</span>
                <span className="text-cohere-coral font-bold">{homeForm} pts</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={homeForm}
                onChange={(e) => setHomeForm(Number(e.target.value))}
                className="w-full accent-[#ff7759] cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5">
                <span className="text-cohere-ink">{awayTeam} Form (L5)</span>
                <span className="text-cohere-action-blue font-bold">{awayForm} pts</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={awayForm}
                onChange={(e) => setAwayForm(Number(e.target.value))}
                className="w-full accent-[#1863dc] cursor-pointer"
              />
            </div>
          </div>

          {/* Referee Selection & Impact Levers */}
          <div>
            <div className="flex justify-between text-xs font-semibold mb-1.5">
              <span className="text-cohere-ink">Assigned Match Referee</span>
              <span className="text-cohere-coral font-bold">{selectedReferee.yellows} 🟨/game (Rating: {selectedReferee.strictness})</span>
            </div>
            <select
              value={selectedReferee.name}
              onChange={(e) => {
                const found = REFEREE_OPTIONS.find((r) => r.name === e.target.value);
                if (found) setSelectedReferee(found);
              }}
              className="cohere-input w-full cursor-pointer font-medium bg-white text-cohere-ink border border-cohere-hairline rounded-sm px-3 py-2"
            >
              {REFEREE_OPTIONS.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name} · {r.yellows} Cards/game (Strictness: {r.strictness})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Outcome */}
        <div className="lg:col-span-6 space-y-5">
          {/* Hero */}
          <div className="agent-console-card p-6 relative overflow-hidden">
            <div className="text-xs uppercase font-mono tracking-wider font-bold text-cohere-muted">Projected Match Result</div>
            <div className="text-3xl sm:text-4xl text-cohere-coral mt-2 font-display font-medium tracking-tight">
              {prediction ? prediction.predicted_outcome : "Simulating..."}
            </div>
            <div className="text-xs text-white/70 mt-2 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-cohere-coral" />
              Model Confidence: {prediction ? `${prediction.confidence}%` : "—%"}
            </div>
          </div>

          {/* Probability Bars */}
          <div className="cohere-card-white space-y-5">
            <div className="text-sm font-bold text-cohere-primary flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-cohere-coral" /> Calibrated Probability Breakdown
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 items-center">
                <span className="text-cohere-coral font-bold flex items-center gap-1.5">
                  <Image
                    src={getClubCrest(homeTeam)}
                    alt={homeTeam}
                    width={16}
                    height={16}
                    unoptimized
                  />
                  <span>{homeTeam} Win</span>
                </span>
                <span className="text-cohere-coral font-extrabold">{pHome}%</span>
              </div>
              <div className="h-3 w-full bg-cohere-soft-stone rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cohere-coral rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pHome}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 items-center">
                <span className="text-cohere-ink font-bold flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-cohere-hairline flex items-center justify-center text-[10px] text-cohere-ink font-black">
                    =
                  </span>
                  <span>Draw</span>
                </span>
                <span className="text-cohere-ink font-extrabold">{pDraw}%</span>
              </div>
              <div className="h-3 w-full bg-cohere-soft-stone rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cohere-slate rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pDraw}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold mb-1.5 items-center">
                <span className="text-cohere-action-blue font-bold flex items-center gap-1.5">
                  <Image
                    src={getClubCrest(awayTeam)}
                    alt={awayTeam}
                    width={16}
                    height={16}
                    unoptimized
                  />
                  <span>{awayTeam} Win</span>
                </span>
                <span className="text-cohere-action-blue font-extrabold">{pAway}%</span>
              </div>
              <div className="h-3 w-full bg-cohere-soft-stone rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cohere-action-blue rounded-full"
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
