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

  // Hide the banner on worldwide multi-league pages
  if (
    pathname === "/fixtures" ||
    pathname.startsWith("/league") ||
    pathname.startsWith("/team") ||
    pathname.startsWith("/player")
  ) {
    return null;
  }

  return (
    <section className="w-full bg-white border-b border-cohere-hairline">
      {/* ── Cohere Editorial Hero ── */}
      <div className="max-w-[1440px] mx-auto px-4 pt-10 pb-8 sm:pt-14 sm:pb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            {/* Technical Category Label */}
            <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cohere-coral">
              <span className="w-1.5 h-1.5 rounded-full bg-cohere-coral" />
              <span>ENTERPRISE AI PREDICTIVE SUITE</span>
            </div>

            {/* Massive tight display typography */}
            <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-normal tracking-tighter text-cohere-primary leading-none">
              Stats Centre
            </h1>

            <p className="text-sm sm:text-base text-cohere-body-muted font-body leading-relaxed max-w-2xl">
              Premier League tracking and calibrated intelligence — Regularized Transfer Valuation, XGBoost Match Forecasts, PGMOL Referee Analytics, and Tactical Heatmaps.
            </p>
          </div>

          <div className="flex flex-wrap md:flex-col items-start md:items-end gap-2 text-xs font-mono text-cohere-muted">
            <span className="chip-pale-green">Model Suite: Active</span>
            <span className="text-[11px] text-cohere-slate">20 Clubs · 540 Players Tracked</span>
          </div>
        </div>

        {/* ── Sub-Navigation Tabs as Outlined Pill Tags ── */}
        <div className="mt-8 pt-4 border-t border-cohere-hairline flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`button-pill-outline shrink-0 text-xs sm:text-sm font-medium transition-all ${
                  isActive
                    ? "bg-cohere-primary text-white border-cohere-primary"
                    : "text-cohere-primary bg-transparent hover:border-cohere-primary"
                }`}
              >
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
