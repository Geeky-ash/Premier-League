"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Trophy,
  Award,
  TrendingUp,
  Sparkles,
  Target,
  Shield,
  Clock,
  ArrowRight,
} from "lucide-react";
import { fetchLeaderboards, LeaderboardsResponse, LeaderboardPlayer, PlayerRecord } from "@/lib/api";
import { getClubCrest, getPlayerPhoto } from "@/lib/logos";
import FilterBar, { FilterState } from "@/components/FilterBar";
import PlayerDetailDrawer from "@/components/PlayerDetailDrawer";

const CATEGORIES = [
  { id: "goals", label: "Goals", icon: Trophy, unit: "goals" },
  { id: "assists", label: "Assists", icon: Sparkles, unit: "assists" },
  { id: "expected_goals", label: "Expected Goals (xG)", icon: Target, unit: "xG" },
  { id: "shots_on_target", label: "Shots on Target", icon: Target, unit: "SoT" },
  { id: "tackles", label: "Tackles & Duels", icon: Shield, unit: "tackles" },
  { id: "fouls_committed", label: "Fouls Committed", icon: Shield, unit: "fouls" },
  { id: "market_value_eur_m", label: "Market Valuation", icon: TrendingUp, unit: "€M" },
];

export default function SeasonLeaderboardsPage() {
  const [selectedCategory, setSelectedCategory] = useState("goals");
  const [data, setData] = useState<LeaderboardsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerPlayer, setDrawerPlayer] = useState<PlayerRecord | null>(null);
  const [filterState, setFilterState] = useState<FilterState>({
    sample_size: "season",
    min_minutes: 1,
    started_only: false,
    venue: "all",
    competition: "PL",
  });

  useEffect(() => {
    setLoading(true);
    fetchLeaderboards(selectedCategory, 25)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const activeCategory = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pl-green">
          <Trophy size={14} /> Official Statistical Leaderboards // Season 2024/25
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
          <span>Premier League Statistical Leaders</span>
        </h2>
        <p className="text-sm text-pl-text-muted mt-1">
          Ranked leaderboards across all tracking metrics with per-90 normalized output and interactive multi-sample filters.
        </p>
      </div>

      {/* Filter Bar */}
      <FilterBar
        initialFilters={filterState}
        onChange={setFilterState}
        showVenueToggle={false}
      />

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap shrink-0 border ${
                isSelected
                  ? "bg-pl-green text-slate-950 border-pl-green shadow-lg shadow-pl-green/15"
                  : "bg-slate-900/80 text-slate-300 border-white/5 hover:border-white/20 hover:text-white"
              }`}
            >
              <Icon size={14} />
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Top 3 Podium Cards */}
      {data && data.leaders.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
          {/* Rank 2 */}
          <div
            className="pl-card bg-slate-900/60 border-white/10 p-5 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:border-pl-cyan/40 transition-all order-2 md:order-1"
            onClick={() => {
              const p = data.leaders[1];
              setDrawerPlayer({
                player_id: p.player_id,
                name: p.name,
                club: p.club,
                position: p.position,
                age: p.age,
                minutes_played: p.minutes_played,
                goals: p.stat_name.includes("GOALS") ? p.stat_value : 5,
                assists: 4,
                shots: 25,
                pass_completion: 82,
                dribbles: 20,
                tackles_interceptions: 30,
                market_value_eur_m: 45,
              });
            }}
          >
            <div className="w-8 h-8 rounded-full bg-slate-400 text-slate-950 font-black text-xs flex items-center justify-center mb-3">
              #2
            </div>
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 mb-3 bg-slate-800">
              <Image
                src={getPlayerPhoto(data.leaders[1].name)}
                alt={data.leaders[1].name}
                width={64}
                height={64}
                className="w-full h-full object-cover object-top"
                unoptimized
              />
            </div>
            <div className="text-sm font-bold text-white truncate max-w-full">
              {data.leaders[1].name}
            </div>
            <div className="text-xs text-pl-text-muted mt-0.5">{data.leaders[1].club}</div>
            <div className="text-2xl font-black text-pl-cyan mt-2">
              {data.leaders[1].stat_value}
              <span className="text-xs font-semibold text-pl-text-muted ml-1">
                ({data.leaders[1].per_90_value}/90)
              </span>
            </div>
          </div>

          {/* Rank 1 (Tall Podium) */}
          <div
            className="pl-card bg-gradient-to-b from-pl-purple/90 via-slate-900 to-slate-950 border border-pl-green/40 p-6 rounded-2xl flex flex-col items-center text-center cursor-pointer shadow-2xl hover:border-pl-green transition-all order-1 md:order-2"
            onClick={() => {
              const p = data.leaders[0];
              setDrawerPlayer({
                player_id: p.player_id,
                name: p.name,
                club: p.club,
                position: p.position,
                age: p.age,
                minutes_played: p.minutes_played,
                goals: p.stat_name.includes("GOALS") ? p.stat_value : 10,
                assists: 6,
                shots: 40,
                pass_completion: 84,
                dribbles: 25,
                tackles_interceptions: 35,
                market_value_eur_m: 60,
              });
            }}
          >
            <div className="w-9 h-9 rounded-full bg-pl-green text-slate-950 font-black text-sm flex items-center justify-center mb-3 shadow-lg shadow-pl-green/30">
              👑 #1
            </div>
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-pl-green mb-3 bg-slate-800 shadow-xl">
              <Image
                src={getPlayerPhoto(data.leaders[0].name)}
                alt={data.leaders[0].name}
                width={80}
                height={80}
                className="w-full h-full object-cover object-top"
                unoptimized
              />
            </div>
            <div className="text-base font-extrabold text-white truncate max-w-full">
              {data.leaders[0].name}
            </div>
            <div className="text-xs text-pl-text-muted mt-0.5 flex items-center gap-1">
              <Image
                src={getClubCrest(data.leaders[0].club)}
                alt={data.leaders[0].club}
                width={14}
                height={14}
                unoptimized
              />
              <span>{data.leaders[0].club}</span>
            </div>
            <div className="text-3xl font-black text-pl-green mt-2">
              {data.leaders[0].stat_value}
              <span className="text-xs font-semibold text-slate-300 ml-1">
                ({data.leaders[0].per_90_value}/90)
              </span>
            </div>
          </div>

          {/* Rank 3 */}
          <div
            className="pl-card bg-slate-900/60 border-white/10 p-5 rounded-2xl flex flex-col items-center text-center cursor-pointer hover:border-amber-400/40 transition-all order-3"
            onClick={() => {
              const p = data.leaders[2];
              setDrawerPlayer({
                player_id: p.player_id,
                name: p.name,
                club: p.club,
                position: p.position,
                age: p.age,
                minutes_played: p.minutes_played,
                goals: p.stat_name.includes("GOALS") ? p.stat_value : 4,
                assists: 3,
                shots: 20,
                pass_completion: 80,
                dribbles: 18,
                tackles_interceptions: 28,
                market_value_eur_m: 40,
              });
            }}
          >
            <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-black text-xs flex items-center justify-center mb-3">
              #3
            </div>
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/20 mb-3 bg-slate-800">
              <Image
                src={getPlayerPhoto(data.leaders[2].name)}
                alt={data.leaders[2].name}
                width={64}
                height={64}
                className="w-full h-full object-cover object-top"
                unoptimized
              />
            </div>
            <div className="text-sm font-bold text-white truncate max-w-full">
              {data.leaders[2].name}
            </div>
            <div className="text-xs text-pl-text-muted mt-0.5">{data.leaders[2].club}</div>
            <div className="text-2xl font-black text-amber-400 mt-2">
              {data.leaders[2].stat_value}
              <span className="text-xs font-semibold text-pl-text-muted ml-1">
                ({data.leaders[2].per_90_value}/90)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Full Table */}
      <div className="pl-card bg-slate-900/70 border-white/10 p-0 rounded-2xl shadow-xl overflow-hidden">
        <div className="px-6 py-4 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
          <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <span>Ranked Season Table</span>
            <span className="text-pl-cyan font-normal">({data?.leaders.length || 0} players)</span>
          </div>
          <span className="text-[11px] text-pl-text-muted">Click row to open player dossier</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-pl-cyan animate-pulse">
            Fetching ranked statistics...
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {data?.leaders.map((p) => (
              <div
                key={p.player_id}
                onClick={() => {
                  setDrawerPlayer({
                    player_id: p.player_id,
                    name: p.name,
                    club: p.club,
                    position: p.position,
                    age: p.age,
                    minutes_played: p.minutes_played,
                    goals: p.stat_name.includes("GOALS") ? p.stat_value : 5,
                    assists: 4,
                    shots: 25,
                    pass_completion: 82,
                    dribbles: 20,
                    tackles_interceptions: 30,
                    market_value_eur_m: 45,
                  });
                }}
                className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-xs font-black text-pl-text-muted w-6 text-center group-hover:text-pl-cyan transition-colors">
                    #{p.rank}
                  </span>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20 bg-slate-800">
                    <Image
                      src={getPlayerPhoto(p.name)}
                      alt={p.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover object-top"
                      unoptimized
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-950 p-0.5 border border-white/20">
                      <Image
                        src={getClubCrest(p.club)}
                        alt={p.club}
                        width={14}
                        height={14}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white group-hover:text-pl-cyan transition-colors truncate flex items-center gap-1.5">
                      <span className="truncate">{p.name}</span>
                      <span className="pos-badge shrink-0">{p.position}</span>
                    </div>
                    <div className="text-xs text-pl-text-muted truncate mt-0.5">
                      {p.club} · {p.appearances} Apps · {p.minutes_played} mins
                    </div>
                  </div>
                </div>

                <div className="text-right pl-3 shrink-0">
                  <div className="text-base font-black text-white group-hover:text-pl-green transition-colors">
                    {p.stat_value}
                  </div>
                  <div className="text-[10px] text-pl-text-muted uppercase font-bold">
                    {p.per_90_value} / 90
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
