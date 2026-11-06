"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { label: "Dashboard", href: "/" },
  { label: "Transfer Predictor", href: "/transfer-predictor" },
  { label: "Match Predictor", href: "/match-predictor" },
  { label: "Scouting Studio", href: "/scouting-studio" },
  { label: "Player Comparison", href: "/comparison" },
];

export default function StatsBanner() {
  const pathname = usePathname();

  return (
    <section className="w-full">
      {/* ── Gradient Banner ── */}
      <div className="pl-banner">
        <div className="max-w-[1400px] mx-auto">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Stats Centre
          </h1>
          <p className="mt-2 text-sm text-white/70 font-medium">
            Powered by Machine Learning — Transfer Values · Match Outcomes · Player Scouting
          </p>
        </div>
      </div>

      {/* ── Sub-Navigation Tabs ── */}
      <div className="w-full bg-pl-purple border-b border-pl-border">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center gap-0 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => {
            const isActive = pathname === tab.href;
            return (
              <Link key={tab.href} href={tab.href}>
                <span
                  className={`nav-tab ${isActive ? "active" : ""}`}
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
