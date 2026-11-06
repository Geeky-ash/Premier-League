"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Trophy,
  Crosshair,
  Users,
  ArrowRight,
  Activity,
} from "lucide-react";
import { fetchHealth, HealthStatus, fetchPlayers, PlayerRecord } from "@/lib/api";

export default function DashboardPage() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [players, setPlayers] = useState<PlayerRecord[]>([]);

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
      desc: "LinearRegression pipeline predicting fair market value from performance metrics.",
      href: "/transfer-predictor",
      icon: TrendingUp,
      color: "#00ff85",
      tag: "LINEAR REGRESSION",
    },
    {
      title: "Match Outcome Predictor",
      desc: "XGBoost multi-class classifier forecasting Home Win, Draw, or Away Win.",
      href: "/match-predictor",
      icon: Trophy,
      color: "#e90052",
      tag: "XGBOOST",
    },
    {
      title: "Player Scouting Studio",
      desc: "K-Means clustering with PCA and Euclidean similarity twin discovery.",
      href: "/scouting-studio",
      icon: Crosshair,
      color: "#00d4ff",
      tag: "K-MEANS",
    },
    {
      title: "Player Comparison",
      desc: "Side-by-side stat comparison with ML-powered insights and twin analysis.",
      href: "/comparison",
      icon: Users,
      color: "#fdb913",
      tag: "COMPARISON",
    },
  ];

  return (
    <div className="space-y-10 animate-fade-in">
      {/* ── ML Engine Status ── */}
      <div className="pl-card flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex items-center gap-3">
          <Activity size={20} className="text-pl-green" />
          <div>
            <div className="text-sm font-bold text-white">ML Engine Status</div>
            <div className="text-xs text-pl-text-muted mt-0.5">
              {health
                ? `All ${Object.values(health.models_loaded).filter(Boolean).length}/5 models loaded · v${health.version}`
                : "Connecting to ML backend..."}
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-wrap sm:ml-auto">
          {health &&
            Object.entries(health.models_loaded).map(([key, loaded]) => (
              <span
                key={key}
                className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                  loaded
                    ? "bg-pl-green/15 text-pl-green"
                    : "bg-pl-magenta/15 text-pl-magenta"
                }`}
              >
                {key.replace("_", " ").replace("_", " ")}
              </span>
            ))}
        </div>
      </div>

      {/* ── Module Cards Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {modules.map((mod) => (
          <Link key={mod.href} href={mod.href}>
            <div className="pl-card group hover:border-pl-border-light transition-all duration-200 cursor-pointer h-full">
              <div className="flex items-start justify-between">
                <div
                  className="p-2.5 rounded-pl"
                  style={{ backgroundColor: `${mod.color}18` }}
                >
                  <mod.icon size={22} style={{ color: mod.color }} />
                </div>
                <span
                  className="text-[10px] font-bold tracking-widest px-2 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${mod.color}15`,
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
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-pl-cyan opacity-0 group-hover:opacity-100 transition-opacity">
                Open module <ArrowRight size={14} />
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* ── Leaderboards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Scorers */}
        <div className="pl-card">
          <h3 className="text-xs uppercase tracking-widest text-pl-text-muted font-bold mb-4">
            Top Goal Scorers
          </h3>
          {topScorers.map((p, i) => (
            <div key={p.player_id} className="stat-row">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-pl-cyan w-5">
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-pl-text-muted">{p.club}</div>
                </div>
              </div>
              <span className="text-stat-sm text-white">{p.goals}</span>
            </div>
          ))}
        </div>

        {/* Most Valuable */}
        <div className="pl-card">
          <h3 className="text-xs uppercase tracking-widest text-pl-text-muted font-bold mb-4">
            Highest Market Valuation
          </h3>
          {topValuers.map((p, i) => (
            <div key={p.player_id} className="stat-row">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-pl-green w-5">
                  {i + 1}
                </span>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {p.name}
                  </div>
                  <div className="text-[11px] text-pl-text-muted">{p.club}</div>
                </div>
              </div>
              <span className="text-stat-sm text-pl-green">
                €{p.market_value_eur_m}M
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
