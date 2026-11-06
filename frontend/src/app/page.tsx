"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  TrendingUp,
  Trophy,
  Crosshair,
  Users,
  ArrowRight,
  Activity,
  Sparkles,
} from "lucide-react";
import { fetchHealth, HealthStatus, fetchPlayers, PlayerRecord } from "@/lib/api";
import { getClubCrest, getPlayerPhoto } from "@/lib/logos";
import PlayerDetailDrawer from "@/components/PlayerDetailDrawer";

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [drawerPlayer, setDrawerPlayer] = useState<PlayerRecord | null>(null);

  useEffect(() => {
    fetchHealth().then(setHealth).catch(() => {});
    fetchPlayers().then(setPlayers).catch(() => {});
  }, []);

  const topScorers = [...players]
    .sort((a, b) => b.goals - a.goals)
    .slice(0, 5);
  const topValuers = [...players]
    .sort((a, b) => b.market_value_eur_m - a.market_value_eur_m)
    .slice(0, 5);

  const modules = [
    {
      title: "Transfer Value Predictor",
      desc: "Regularized Ridge & OLS Regression pipeline estimating fair market value from tracking metrics.",
      href: "/transfer-predictor",
      icon: TrendingUp,
      color: "#00ff85",
      tag: "SUPERVISED ML",
    },
    {
      title: "Match Outcome Predictor",
      desc: "XGBoost multi-class classifier forecasting Home Win, Draw, or Away Win probabilities.",
      href: "/match-predictor",
      icon: Trophy,
      color: "#e90052",
      tag: "XGBOOST CORE",
    },
    {
      title: "Player Scouting Studio",
      desc: "K-Means tactical clustering with 2D PCA projection and Euclidean similarity twin discovery.",
      href: "/scouting-studio",
      icon: Crosshair,
      color: "#00d4ff",
      tag: "UNSUPERVISED CLUSTERING",
    },
    {
      title: "Player Comparison",
      desc: "Side-by-side head-to-head metric comparison with ML valuation and tactical archetype enrichment.",
      href: "/comparison",
      icon: Users,
      color: "#fdb913",
      tag: "HEAD-TO-HEAD MATRIX",
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* ── ML Engine Status ── */}
      <div className="pl-card bg-slate-900/60 border-white/10 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-pl-green/10 border border-pl-green/20 flex items-center justify-center text-pl-green">
            <Activity size={20} />
          </div>
          <div>
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <span>FastAPI Machine Learning Core</span>
              <span className="w-2 h-2 rounded-full bg-pl-green animate-pulse" />
            </div>
            <div className="text-xs text-pl-text-muted mt-0.5">
              {health
                ? `All ${Object.values(health.models_loaded).filter(Boolean).length}/5 serialized models active & served via REST API`
                : "Connecting to ML microservice..."}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap sm:ml-auto">
          {health &&
            Object.entries(health.models_loaded).map(([key, loaded]) => (
              <span
                key={key}
                className={`text-[10px] px-2.5 py-1 rounded-full font-semibold border ${
                  loaded
                    ? "bg-pl-green/15 text-pl-green border-pl-green/30"
                    : "bg-pl-magenta/15 text-pl-magenta border-pl-magenta/30"
                }`}
              >
                {key.replace(/_/g, " ").toUpperCase()}
              </span>
            ))}
        </div>
      </div>

      {/* ── Module Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href} className="group">
            <div className="pl-card bg-slate-900/60 border-white/10 hover:border-pl-cyan/50 hover:bg-slate-900/80 transition-all duration-200 cursor-pointer h-full flex flex-col justify-between rounded-2xl shadow-xl">
              <div>
                <div className="flex items-start justify-between">
                  <div
                    className="p-3 rounded-xl border border-white/10"
                    style={{ backgroundColor: `${mod.color}15` }}
                  >
                    <mod.icon size={22} style={{ color: mod.color }} />
                  </div>
                  <span
                    className="text-[10px] font-bold tracking-widest px-2.5 py-1 rounded-full border border-white/10"
                    style={{
                      backgroundColor: `${mod.color}12`,
                      color: mod.color,
                    }}
                  >
                    {mod.tag}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-4 group-hover:text-pl-cyan transition-colors">
                  {mod.title}
                </h3>
                <p className="text-sm text-pl-text-muted mt-1.5 leading-relaxed">
                  {mod.desc}
                </p>
              </div>
              <div className="mt-5 pt-3 border-t border-white/5 flex items-center gap-1.5 text-xs font-bold text-pl-cyan group-hover:translate-x-1 transition-transform">
                <span>Launch Interactive Module</span>
                <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Leaderboards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Scorers */}
        <div className="pl-card bg-slate-900/60 border-white/10 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-widest text-pl-text-muted font-bold flex items-center gap-2">
              <Trophy size={14} className="text-pl-cyan" />
              <span>Top Goal Scorers (Golden Boot)</span>
            </h3>
            <span className="text-[10px] text-pl-cyan">Click player for dossier</span>
          </div>
          <div className="space-y-1.5">
            {topScorers.map((p, i) => (
              <div
                key={p.player_id}
                className="stat-row p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors flex items-center justify-between"
                onClick={() => setDrawerPlayer(p)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-black text-pl-cyan w-5 text-center">
                    #{i + 1}
                  </span>
                  <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/20 bg-slate-800">
                    <Image
                      src={getPlayerPhoto(p.name)}
                      alt={p.name}
                      width={36}
                      height={36}
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
                  <div className="truncate">
                    <div className="text-sm font-bold text-white hover:text-pl-cyan transition-colors truncate">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-pl-text-muted truncate">
                      {p.club} · {p.position}
                    </div>
                  </div>
                </div>
                <div className="text-right pl-3 shrink-0">
                  <span className="text-base font-black text-white">{p.goals}</span>
                  <span className="text-[10px] text-pl-text-muted block uppercase font-bold">Goals</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Valuable */}
        <div className="pl-card bg-slate-900/60 border-white/10 rounded-2xl shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs uppercase tracking-widest text-pl-text-muted font-bold flex items-center gap-2">
              <Sparkles size={14} className="text-pl-green" />
              <span>Highest Market Valuations</span>
            </h3>
            <span className="text-[10px] text-pl-green">Click player for dossier</span>
          </div>
          <div className="space-y-1.5">
            {topValuers.map((p, i) => (
              <div
                key={p.player_id}
                className="stat-row p-2.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors flex items-center justify-between"
                onClick={() => setDrawerPlayer(p)}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-black text-pl-green w-5 text-center">
                    #{i + 1}
                  </span>
                  <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/20 bg-slate-800">
                    <Image
                      src={getPlayerPhoto(p.name)}
                      alt={p.name}
                      width={36}
                      height={36}
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
                  <div className="truncate">
                    <div className="text-sm font-bold text-white hover:text-pl-cyan transition-colors truncate">
                      {p.name}
                    </div>
                    <div className="text-[11px] text-pl-text-muted truncate">
                      {p.club} · {p.position}
                    </div>
                  </div>
                </div>
                <div className="text-right pl-3 shrink-0">
                  <span className="text-base font-black text-pl-green">
                    €{p.market_value_eur_m}M
                  </span>
                  <span className="text-[10px] text-pl-text-muted block uppercase font-bold">Valuation</span>
                </div>
              </div>
            ))}
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
