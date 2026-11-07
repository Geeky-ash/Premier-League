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
      desc: "Regularized Ridge & OLS Regression pipeline estimating fair market valuation from on-pitch tracking metrics.",
      href: "/transfer-predictor",
      icon: TrendingUp,
      tag: "SUPERVISED REGRESSION",
    },
    {
      title: "Match Outcome Predictor",
      desc: "Multi-class XGBoost model calibrated to project 3-way matchday probability distributions (Win/Draw/Loss).",
      href: "/match-predictor",
      icon: Trophy,
      tag: "GRADIENT BOOSTING",
    },
    {
      title: "Player Scouting Studio",
      desc: "Unsupervised K-Means clustering across 2D PCA tactical manifolds for algorithmic player twin discovery.",
      href: "/scouting-studio",
      icon: Crosshair,
      tag: "K-MEANS & PCA",
    },
    {
      title: "Player Comparison Matrix",
      desc: "Direct 1v1 statistical matrix with real-time ML transfer valuation and archetype cluster enrichment.",
      href: "/comparison",
      icon: Users,
      tag: "HEAD-TO-HEAD MATRIX",
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in font-body">
      {/* ── ML Engine Status: Agent Console Card (Dark Band) ── */}
      <div className="agent-console-card flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-11 h-11 rounded-sm bg-cohere-deep-green flex items-center justify-center text-cohere-coral border border-white/10 shrink-0">
            <Activity size={22} />
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-display text-base font-normal text-white tracking-tight">
                Cohere Inference Core // Python 3.10+
              </span>
              <span className="w-2 h-2 rounded-full bg-cohere-coral animate-pulse" />
            </div>
            <p className="text-xs text-cohere-muted font-body">
              {health
                ? `All ${Object.values(health.models_loaded).filter(Boolean).length}/5 serialized inference pipelines active & served via FastAPI REST Gateway`
                : "Connecting to ML inference microservice..."}
            </p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {health &&
            Object.entries(health.models_loaded).map(([key, loaded]) => (
              <span
                key={key}
                className={loaded ? "chip-coral" : "chip-pale-green opacity-50"}
              >
                {key.replace(/_/g, " ").toUpperCase()}
              </span>
            ))}
        </div>
      </div>

      {/* ── Product & Module Cards: Cohere Soft Stone (22px radius) ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <span className="font-mono text-xs uppercase tracking-wider text-cohere-coral">
              Core Capabilities
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-normal tracking-tight text-cohere-primary">
              Statistical Intelligence Modules
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {modules.map((mod) => (
            <Link key={mod.href} href={mod.href} className="group block h-full">
              <div className="product-card h-full flex flex-col justify-between hover:border-cohere-hairline transition-all duration-200">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="w-10 h-10 rounded-sm bg-white border border-cohere-hairline flex items-center justify-center text-cohere-primary shrink-0">
                      <mod.icon size={20} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-wider text-cohere-coral border border-cohere-coral/30 bg-cohere-coral/10 px-2.5 py-1 rounded-sm">
                      {mod.tag}
                    </span>
                  </div>

                  <h3 className="font-display text-xl font-normal text-cohere-primary mt-6 tracking-tight group-hover:text-cohere-coral transition-colors">
                    {mod.title}
                  </h3>
                  <p className="text-sm text-cohere-body-muted mt-2 font-body leading-relaxed">
                    {mod.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-cohere-hairline flex items-center gap-1.5 text-sm font-medium text-cohere-action-blue group-hover:translate-x-1 transition-transform">
                  <span>Explore Module</span>
                  <ArrowRight size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Leaderboards: Editorial White Surface & Rule Rows ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Scorers */}
        <div className="cohere-card-white p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-cohere-hairline">
            <div className="flex items-center gap-2 font-display text-lg font-normal text-cohere-primary">
              <Trophy size={18} className="text-cohere-coral" />
              <span>Top Goal Scorers (Golden Boot)</span>
            </div>
            <span className="font-mono text-[11px] text-cohere-muted">Season 2024/25</span>
          </div>

          <div className="divide-y divide-cohere-hairline">
            {topScorers.map((p, i) => (
              <div
                key={p.player_id}
                className="research-table-row flex items-center justify-between px-2 cursor-pointer transition-colors"
                onClick={() => setDrawerPlayer(p)}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-cohere-muted w-5 text-center">
                    0{i + 1}
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
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-medium text-cohere-primary hover:text-cohere-action-blue transition-colors truncate">
                      {p.name}
                    </div>
                    <div className="text-xs text-cohere-body-muted flex items-center gap-1.5">
                      <span>{p.club}</span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">{p.position}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right pl-3 shrink-0">
                  <span className="font-display text-xl font-normal text-cohere-primary">{p.goals}</span>
                  <span className="font-mono text-[10px] text-cohere-muted block uppercase">Goals</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Most Valuable Players */}
        <div className="cohere-card-white p-6 sm:p-8">
          <div className="flex items-center justify-between pb-4 border-b border-cohere-hairline">
            <div className="flex items-center gap-2 font-display text-lg font-normal text-cohere-primary">
              <Sparkles size={18} className="text-cohere-coral" />
              <span>Highest Market Valuations</span>
            </div>
            <span className="font-mono text-[11px] text-cohere-muted">Ridge Projected</span>
          </div>

          <div className="divide-y divide-cohere-hairline">
            {topValuers.map((p, i) => (
              <div
                key={p.player_id}
                className="research-table-row flex items-center justify-between px-2 cursor-pointer transition-colors"
                onClick={() => setDrawerPlayer(p)}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span className="font-mono text-xs font-bold text-cohere-muted w-5 text-center">
                    0{i + 1}
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
                  </div>
                  <div className="truncate">
                    <div className="text-sm font-medium text-cohere-primary hover:text-cohere-action-blue transition-colors truncate">
                      {p.name}
                    </div>
                    <div className="text-xs text-cohere-body-muted flex items-center gap-1.5">
                      <span>{p.club}</span>
                      <span>·</span>
                      <span className="font-mono text-[11px]">{p.position}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right pl-3 shrink-0">
                  <span className="font-display text-xl font-normal text-cohere-coral">
                    €{p.market_value_eur_m}M
                  </span>
                  <span className="font-mono text-[10px] text-cohere-muted block uppercase">Fair Value</span>
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
