"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Dashboard", href: "/" },
  { label: "Fixtures & Referees", href: "/fixtures" },
  { label: "Opposition Stats", href: "/opposition" },
  { label: "Season Leaderboards", href: "/leaderboards" },
  { label: "In-Play Fouls & Alerts", href: "/inplay-fouls" },
  { label: "Transfer Predictor", href: "/transfer-predictor" },
  { label: "Match Predictor", href: "/match-predictor" },
  { label: "Scouting Studio", href: "/scouting-studio" },
  { label: "Player Comparison", href: "/comparison" },
];

export default function StatsBanner() {
  const pathname = usePathname();

  return (
    <section className="w-full">
      {/* ── Signature Diagonal Gradient Banner ── */}
      <div className="pl-banner border-b border-pl-border/50">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-block px-2.5 py-1 rounded bg-black/30 text-white font-bold text-[10px] uppercase tracking-widest mb-3">
                Official Stats Centre
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-sm">
                Stats Centre
              </h1>
              <p className="mt-2 text-sm text-white/80 font-medium max-w-2xl">
                Official Premier League statistics and predictive artificial intelligence — Linear Valuation, XGBoost Match Forecasts, Referee Tendency Tracking, and Tactical Opposition Heatmaps.
              </p>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-xs font-semibold text-white/70">
              <span>Season 2024/25</span>
              <span>•</span>
              <span className="text-pl-green">All 20 Clubs Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Sub-Navigation Tabs with Active Highlighting ── */}
      <div className="w-full bg-pl-purple border-b border-pl-border">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-0 overflow-x-auto no-scrollbar">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href} className="shrink-0">
                <span
                  className={`nav-tab inline-block ${
                    isActive ? "active text-white border-b-2 border-white" : ""
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
