"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Radio,
  Sliders,
} from "lucide-react";
import { fetchFixtures, FixturesResponse, FixtureItem } from "@/lib/api";
import { getClubCrest, getLeagueLogo } from "@/lib/logos";
import H2HModal from "@/components/H2HModal";

export default function FixturesHubPage() {
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    return new Date().toISOString().split("T")[0];
  });
  const [fixturesData, setFixturesData] = useState<FixturesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [h2hMatch, setH2hMatch] = useState<{ home: string; away: string } | null>(null);

  // Generate date tab presets: Yesterday, Today, Tomorrow, +2, +3
  const today = new Date();
  const dateTabs = [-1, 0, 1, 2, 3].map((offset) => {
    const d = new Date();
    d.setDate(today.getDate() + offset);
    const iso = d.toISOString().split("T")[0];
    let label = d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
    if (offset === 0) label = "Today";
    else if (offset === -1) label = "Yesterday";
    else if (offset === 1) label = "Tomorrow";
    return { iso, label };
  });

  useEffect(() => {
    setLoading(true);
    fetchFixtures(selectedDate)
      .then(setFixturesData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedDate]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pl-green">
            <Calendar size={14} /> Official Fixtures Hub // Matchday Intelligence
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <span>Premier League Fixtures & Referees</span>
          </h2>
          <p className="text-sm text-pl-text-muted mt-1">
            Kickoff clocks, confirmed lineups, referee card tendencies, and real-time XGBoost probability forecasts.
          </p>
        </div>

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-white/10 overflow-x-auto max-w-full">
          {dateTabs.map((tab) => (
            <button
              key={tab.iso}
              type="button"
              onClick={() => setSelectedDate(tab.iso)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                selectedDate === tab.iso
                  ? "bg-pl-green text-slate-950 shadow-md shadow-pl-green/20"
                  : "text-slate-300 hover:text-white hover:bg-white/5"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notice Banner */}
      <div className="flex items-center justify-between gap-3 p-3.5 bg-slate-900/60 rounded-xl border border-white/10 text-xs text-pl-text-muted">
        <div className="flex items-center gap-2">
          <ShieldAlert size={15} className="text-pl-cyan shrink-0" />
          <span>
            Referee card ratings are computed from official PGMOL Premier League logs to predict foul impact on game momentum.
          </span>
        </div>
        <span className="hidden sm:inline-block text-[10px] text-pl-green font-bold uppercase tracking-wider bg-pl-green/10 px-2 py-0.5 rounded border border-pl-green/30">
          PGMOL Tracking
        </span>
      </div>

      {/* Fixtures List */}
      {loading ? (
        <div className="py-20 text-center text-xs text-pl-cyan animate-pulse">
          Loading matchday schedule and referee impact statistics...
        </div>
      ) : fixturesData && fixturesData.fixtures.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {fixturesData.fixtures.map((fix) => {
            const isLive = fix.status === "LIVE";
            const refStrictness = fix.referee?.referee_strictness_index || 5.0;
            const refColor =
              refStrictness >= 6.5
                ? "text-pl-magenta border-pl-magenta/30 bg-pl-magenta/10"
                : refStrictness >= 4.5
                ? "text-pl-cyan border-pl-cyan/30 bg-pl-cyan/10"
                : "text-pl-green border-pl-green/30 bg-pl-green/10";

            return (
              <div
                key={fix.fixture_id}
                className="pl-card bg-slate-900/70 border-white/10 p-5 rounded-2xl shadow-xl hover:border-pl-cyan/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Status Strip */}
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      {isLive ? (
                        <span className="flex items-center gap-1.5 text-xs font-black text-pl-magenta bg-pl-magenta/15 px-2.5 py-0.5 rounded-full border border-pl-magenta/40">
                          <Radio size={12} className="animate-pulse" />
                          <span>LIVE {fix.minute}&apos;</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-xs font-bold text-slate-300 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                          <Clock size={12} className="text-pl-cyan" />
                          <span>{fix.kickoff_time} KO</span>
                        </span>
                      )}
                      <span className="text-[11px] text-pl-text-muted">{fix.venue}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {fix.lineups_status === "LINEUPS_CONFIRMED" ? (
                        <span className="text-[10px] font-bold text-pl-green bg-pl-green/10 px-2 py-0.5 rounded-md border border-pl-green/30 flex items-center gap-1">
                          <CheckCircle2 size={11} />
                          <span>Lineups Out</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded-md border border-white/5">
                          Expected Lineups
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Teams & Score / Matchup */}
                  <div className="grid grid-cols-11 items-center gap-2 py-2">
                    {/* Home Team */}
                    <div className="col-span-5 flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-white/5 p-1.5 shrink-0 border border-white/10 flex items-center justify-center">
                        <Image
                          src={getClubCrest(fix.home_team)}
                          alt={fix.home_team}
                          width={32}
                          height={32}
                          unoptimized
                        />
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-white truncate group-hover:text-pl-cyan transition-colors">
                          {fix.home_team}
                        </div>
                        <div className="text-[11px] text-pl-green font-semibold">
                          Win Prob: {fix.home_win_prob}%
                        </div>
                      </div>
                    </div>

                    {/* Middle Score / Clock */}
                    <div className="col-span-1 text-center">
                      {isLive ? (
                        <span className="text-lg font-black text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-white/20">
                          {fix.home_score} - {fix.away_score}
                        </span>
                      ) : (
                        <span className="text-xs font-black text-pl-text-muted">VS</span>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="col-span-5 flex items-center justify-end gap-3 text-right">
                      <div className="min-w-0">
                        <div className="text-sm font-extrabold text-white truncate group-hover:text-pl-cyan transition-colors">
                          {fix.away_team}
                        </div>
                        <div className="text-[11px] text-pl-magenta font-semibold">
                          Win Prob: {fix.away_win_prob}%
                        </div>
                      </div>
                      <div className="w-11 h-11 rounded-xl bg-white/5 p-1.5 shrink-0 border border-white/10 flex items-center justify-center">
                        <Image
                          src={getClubCrest(fix.away_team)}
                          alt={fix.away_team}
                          width={32}
                          height={32}
                          unoptimized
                        />
                      </div>
                    </div>
                  </div>

                  {/* Referee Impact Badge */}
                  <div className="mt-4 p-2.5 rounded-xl bg-slate-950/60 border border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-pl-text-secondary">Referee:</span>
                      <span className="font-bold text-white">{fix.referee?.referee_name || "Anthony Taylor"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-300">
                        {fix.referee?.yellow_cards_per_game || 4.2} 🟨/game
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${refColor}`}
                        title="Strictness rating from 1.0 to 10.0"
                      >
                        Strictness: {refStrictness}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Action Strip */}
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    type="button"
                    onClick={() => setH2hMatch({ home: fix.home_team, away: fix.away_team })}
                    className="text-xs text-pl-cyan hover:text-white font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>View H2H Trends</span>
                    <ArrowRight size={11} />
                  </button>

                  <Link
                    href={`/match-predictor?home=${encodeURIComponent(fix.home_team)}&away=${encodeURIComponent(fix.away_team)}`}
                    className="pl-btn-white text-[11px] py-1.5 px-3 flex items-center gap-1.5"
                  >
                    <Sliders size={12} />
                    <span>Simulate Fixture</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center text-sm text-pl-text-muted bg-slate-900/40 rounded-2xl border border-white/5">
          No fixtures scheduled for this date. Select another matchday from the top strip.
        </div>
      )}

      {/* H2H Modal */}
      {h2hMatch && (
        <H2HModal
          homeTeam={h2hMatch.home}
          awayTeam={h2hMatch.away}
          open={true}
          onClose={() => setH2hMatch(null)}
        />
      )}
    </div>
  );
}
