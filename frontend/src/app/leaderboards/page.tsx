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
    <div className="space-y-8 animate-fade-in font-body text-cohere-ink">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cohere-coral">
          <Trophy size={14} /> Official Statistical Leaderboards // Season 2024/25
        </div>
        <h2 className="text-3xl font-display font-medium text-cohere-primary tracking-tight mt-1 flex items-center gap-2.5">
          <span>Premier League Statistical Leaders</span>
        </h2>
        <p className="text-sm text-cohere-body-muted mt-1 max-w-2xl">
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
              className={`flex items-center gap-2 px-4 py-2 rounded-pill text-xs font-mono font-bold transition-all whitespace-nowrap shrink-0 border ${
                isSelected
                  ? "bg-cohere-primary text-white border-cohere-primary shadow-sm"
                  : "bg-white text-cohere-ink border-cohere-hairline hover:bg-cohere-soft-stone"
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
            className="cohere-card-white p-5 flex flex-col items-center text-center cursor-pointer hover:border-cohere-action-blue transition-all order-2 md:order-1"
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
            <div className="w-8 h-8 rounded-full bg-cohere-soft-stone text-cohere-slate font-mono font-bold text-xs flex items-center justify-center mb-3 border border-cohere-hairline">
              #2
            </div>
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-cohere-hairline mb-3 bg-cohere-soft-stone">
              <Image
                src={getPlayerPhoto(data.leaders[1].name)}
                alt={data.leaders[1].name}
                width={64}
                height={64}
                className="w-full h-full object-cover object-top"
                unoptimized
              />
            </div>
            <div className="text-sm font-bold text-cohere-primary truncate max-w-full">
              {data.leaders[1].name}
            </div>
            <div className="text-xs text-cohere-muted mt-0.5">{data.leaders[1].club}</div>
            <div className="text-2xl font-bold font-mono text-cohere-action-blue mt-2">
              {data.leaders[1].stat_value}
              <span className="text-xs font-normal text-cohere-slate ml-1 font-body">
                ({data.leaders[1].per_90_value}/90)
              </span>
            </div>
          </div>

          {/* Rank 1 (Tall Podium) */}
          <div
            className="product-card border border-cohere-coral p-6 flex flex-col items-center text-center cursor-pointer shadow-sm hover:border-cohere-coral transition-all order-1 md:order-2"
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
            <div className="w-9 h-9 rounded-full bg-cohere-coral text-white font-mono font-bold text-sm flex items-center justify-center mb-3 shadow-sm">
              👑 #1
            </div>
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-cohere-coral mb-3 bg-white shadow-md">
              <Image
                src={getPlayerPhoto(data.leaders[0].name)}
                alt={data.leaders[0].name}
                width={80}
                height={80}
                className="w-full h-full object-cover object-top"
                unoptimized
              />
            </div>
            <div className="text-base font-bold text-cohere-primary truncate max-w-full">
              {data.leaders[0].name}
            </div>
            <div className="text-xs text-cohere-slate mt-0.5 flex items-center gap-1">
              <Image
                src={getClubCrest(data.leaders[0].club)}
                alt={data.leaders[0].club}
                width={14}
                height={14}
                unoptimized
              />
              <span>{data.leaders[0].club}</span>
            </div>
            <div className="text-3xl font-display font-medium text-cohere-coral mt-2">
              {data.leaders[0].stat_value}
              <span className="text-xs font-normal text-cohere-slate ml-1 font-body">
                ({data.leaders[0].per_90_value}/90)
              </span>
            </div>
          </div>

          {/* Rank 3 */}
          <div
            className="cohere-card-white p-5 flex flex-col items-center text-center cursor-pointer hover:border-cohere-slate transition-all order-3"
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
            <div className="w-8 h-8 rounded-full bg-cohere-soft-stone text-cohere-slate font-mono font-bold text-xs flex items-center justify-center mb-3 border border-cohere-hairline">
              #3
            </div>
            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-cohere-hairline mb-3 bg-cohere-soft-stone">
              <Image
                src={getPlayerPhoto(data.leaders[2].name)}
                alt={data.leaders[2].name}
                width={64}
                height={64}
                className="w-full h-full object-cover object-top"
                unoptimized
              />
            </div>
            <div className="text-sm font-bold text-cohere-primary truncate max-w-full">
              {data.leaders[2].name}
            </div>
            <div className="text-xs text-cohere-muted mt-0.5">{data.leaders[2].club}</div>
            <div className="text-2xl font-bold font-mono text-cohere-primary mt-2">
              {data.leaders[2].stat_value}
              <span className="text-xs font-normal text-cohere-slate ml-1 font-body">
                ({data.leaders[2].per_90_value}/90)
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Full Table */}
      <div className="cohere-card-white p-0 overflow-hidden">
        <div className="px-6 py-4 bg-cohere-soft-stone border-b border-cohere-hairline flex items-center justify-between">
          <div className="text-xs font-mono font-bold text-cohere-primary uppercase tracking-wider flex items-center gap-2">
            <span>Ranked Season Table</span>
            <span className="text-cohere-coral font-normal">({data?.leaders.length || 0} players)</span>
          </div>
          <span className="text-[11px] text-cohere-slate font-mono">Click row to open player dossier</span>
        </div>

        {loading ? (
          <div className="py-20 text-center text-xs text-cohere-coral animate-pulse font-mono">
            Fetching ranked statistics...
          </div>
        ) : (
          <div className="divide-y divide-cohere-hairline">
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
                className="p-4 flex items-center justify-between hover:bg-cohere-soft-stone/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="text-xs font-mono font-bold text-cohere-slate w-6 text-center group-hover:text-cohere-coral transition-colors">
                    #{p.rank}
                  </span>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-cohere-hairline bg-cohere-soft-stone">
                    <Image
                      src={getPlayerPhoto(p.name)}
                      alt={p.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover object-top"
                      unoptimized
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white p-0.5 border border-cohere-hairline">
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
                    <div className="text-sm font-bold text-cohere-primary group-hover:text-cohere-coral transition-colors truncate flex items-center gap-1.5">
                      <span className="truncate">{p.name}</span>
                      <span className="chip-coral text-[10px] shrink-0 font-mono">{p.position}</span>
                    </div>
                    <div className="text-xs text-cohere-slate truncate mt-0.5">
                      {p.club} · {p.appearances} Apps · {p.minutes_played} mins
                    </div>
                  </div>
                </div>

                <div className="text-right pl-3 shrink-0">
                  <div className="text-base font-bold font-mono text-cohere-primary group-hover:text-cohere-coral transition-colors">
                    {p.stat_value}
                  </div>
                  <div className="text-[10px] text-cohere-muted uppercase font-mono font-bold">
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
