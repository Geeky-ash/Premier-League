"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Camera,
  Headphones,
  Send,
  Sliders,
  Layers,
  Activity,
  AlertTriangle,
  Zap,
  ArrowRight,
  Shield,
  Clock,
  UserCheck,
  TrendingUp,
} from "lucide-react";
import PitchCanvas from "@/components/PitchCanvas";

export default function DugoutPage() {
  const [activeTab, setActiveTab] = useState<
    "board" | "setpiece" | "fatigue" | "exploits"
  >("board");
  const [activeTool, setActiveTool] = useState<
    "vector" | "zone" | "press" | "erase"
  >("vector");
  const [pinsLocked, setPinsLocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="min-h-screen bg-[#111114] text-white pb-16 font-body">
      {/* ── Top Touchline Tablet Bar ── */}
      <header className="sticky top-[140px] z-40 bg-[#17171c] border-b border-[#2b2b36] px-4 py-3">
        <div className="max-w-[1560px] mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Match Score & Status */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cohere-coral animate-pulse" />
              <span className="font-mono text-xs font-bold text-cohere-coral uppercase tracking-wider">
                74&apos; +4&apos; LIVE
              </span>
            </div>
            <div className="flex items-center gap-2 bg-[#212128] px-3 py-1 rounded border border-[#2e2e3a]">
              <span className="font-display font-bold text-lg text-white">CFC</span>
              <span className="font-mono font-bold text-lg text-cohere-coral px-1.5 bg-[#17171c] rounded">
                2 : 2
              </span>
              <span className="font-display font-bold text-lg text-white">ARS</span>
            </div>
            <span className="text-xs font-mono text-cohere-muted hidden lg:inline-block">
              3 CAUTIONS • SUBS CFC: 2/5 • ARS: 3/5
            </span>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex items-center bg-[#212128] p-1 rounded-lg border border-[#2e2e3a] overflow-x-auto">
            {[
              { id: "board", label: "Tactical Board (Live)" },
              { id: "setpiece", label: "Set-Piece Audit" },
              { id: "fatigue", label: "Fatigue & Subs" },
              { id: "exploits", label: "Opponent Exploits" },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded text-xs font-mono font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? "bg-cohere-coral text-white font-bold shadow-xs"
                    : "text-cohere-hairline hover:text-white"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Touchline Quick Actions */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => showToast("Touchline tactical snapshot saved to match dossier.")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#212128] hover:bg-[#2b2b36] border border-[#2e2e3a] text-xs font-mono text-white transition-colors"
              title="Capture tactical snapshot"
            >
              <Camera size={14} className="text-cohere-hairline" />
              <span className="hidden sm:inline">Snapshot</span>
            </button>
            <button
              type="button"
              onClick={() => showToast("Touchline mic connected: Audio channel open with coaching analysts.")}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#212128] hover:bg-[#2b2b36] border border-[#2e2e3a] text-xs font-mono text-white transition-colors"
              title="Staff earpiece channel"
            >
              <Headphones size={14} className="text-cohere-coral" />
              <span className="hidden sm:inline">Earpiece</span>
            </button>
            <Link
              href="/simulation"
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-cohere-coral hover:bg-cohere-coral/90 text-xs font-mono font-bold text-white shadow-sm transition-colors"
            >
              <Send size={14} />
              <span>Dispatch Bench</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-cohere-coral text-white px-4 py-2.5 rounded-lg shadow-xl font-mono text-xs animate-slide-up flex items-center gap-2 border border-white/20">
          <Activity size={16} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── Main Tablet Grid ── */}
      <main className="max-w-[1560px] mx-auto px-4 sm:px-6 pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left/Center Tactical Canvas Viewport (8 cols) */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {/* Tactical Control Bar */}
            <div className="bg-[#17171c] p-3 rounded-lg border border-[#2b2b36] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-cohere-muted uppercase">Tactical Tools:</span>
                {[
                  { id: "vector", label: "Vector Pass" },
                  { id: "zone", label: "Zone Box" },
                  { id: "press", label: "Press Poly" },
                  { id: "erase", label: "Erase" },
                ].map((tool) => (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => setActiveTool(tool.id as any)}
                    className={`px-2.5 py-1 rounded border transition-colors ${
                      activeTool === tool.id
                        ? "bg-white text-cohere-primary border-white font-bold"
                        : "bg-[#212128] text-cohere-hairline border-[#2e2e3a] hover:bg-[#2b2b36]"
                    }`}
                  >
                    {tool.label}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-cohere-coral font-bold">
                  DEF LINE: 41.2m
                </span>
                <span className="text-cohere-muted">/ TARGET 36.0m</span>
                <button
                  type="button"
                  onClick={() => setPinsLocked(!pinsLocked)}
                  className={`px-2.5 py-1 rounded text-[11px] font-bold border transition-colors ${
                    pinsLocked
                      ? "bg-cohere-deep-green text-white border-cohere-deep-green"
                      : "bg-[#212128] text-cohere-hairline border-[#2e2e3a]"
                  }`}
                >
                  {pinsLocked ? "PINS LOCKED" : "LOCK PINS"}
                </button>
              </div>
            </div>

            {/* Pitch Canvas Rendering */}
            <div className="bg-[#17171c] rounded-lg border border-[#2b2b36] p-4 relative overflow-hidden">
              <PitchCanvas
                homeTeamName="Chelsea"
                awayTeamName="Arsenal"
                homeScore={2}
                awayScore={2}
                matchMinute="74'"
              />

              {/* In-Game Live Exploit Callouts */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                <div className="p-3 rounded bg-[#212128] border border-cohere-coral/40 flex items-start gap-2.5">
                  <AlertTriangle size={16} className="text-cohere-coral shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono text-[10px] font-bold text-cohere-coral uppercase tracking-wider">
                      EXPLOIT: GABRIEL-TIMBER SEAM
                    </div>
                    <div className="text-xs text-cohere-hairline mt-0.5">
                      Gap measured at 14.2m on wide defensive rotation. Recommend direct vertical pass from Caicedo into Pedro Neto run.
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded bg-[#212128] border border-cohere-deep-green/60 flex items-start gap-2.5">
                  <Zap size={16} className="text-cohere-deep-green shrink-0 mt-0.5" />
                  <div>
                    <div className="font-mono text-[10px] font-bold text-white uppercase tracking-wider">
                      TRIGGER: RICE 2ND TOUCH
                    </div>
                    <div className="text-xs text-cohere-hairline mt-0.5">
                      Arsenal pivot turning backward under pressure. Trigger high two-man press trap with Palmer and Lavia to force turnover.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Dugout Coaching Console (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            {/* Live Player Fatigue Matrix */}
            <div className="bg-[#17171c] border border-[#2b2b36] rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b2b36]">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-cohere-coral" />
                  <span className="font-display font-bold text-base text-white">
                    Player Fatigue Reserves
                  </span>
                </div>
                <span className="text-[10px] font-mono text-cohere-muted">
                  OPTICAL BIOMETRICS
                </span>
              </div>

              <div className="space-y-3 mt-4">
                {[
                  { name: "C. Palmer", pos: "AM", stamina: 78, km: 9.84, alert: false },
                  { name: "M. Caicedo", pos: "DM", stamina: 72, km: 10.12, alert: false },
                  { name: "N. Jackson", pos: "ST", stamina: 58, km: 9.20, alert: true },
                  { name: "N. Madueke", pos: "RW", stamina: 62, km: 8.85, alert: true },
                  { name: "R. Lavia", pos: "CM", stamina: 54, km: 8.40, alert: true },
                ].map((p) => (
                  <div key={p.name} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="font-semibold text-white">
                        {p.name} <span className="text-cohere-muted">({p.pos})</span>
                      </span>
                      <span
                        className={
                          p.stamina < 60
                            ? "text-cohere-coral font-bold"
                            : "text-cohere-hairline"
                        }
                      >
                        {p.stamina}% • {p.km} km
                      </span>
                    </div>
                    <div className="w-full bg-[#212128] h-2 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          p.stamina < 60 ? "bg-cohere-coral" : "bg-cohere-deep-green"
                        }`}
                        style={{ width: `${p.stamina}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Substitution Impact Suggestion */}
            <div className="bg-[#17171c] border border-cohere-coral/50 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#2b2b36]">
                <div className="flex items-center gap-2">
                  <UserCheck size={16} className="text-cohere-coral" />
                  <span className="font-display font-bold text-base text-white">
                    Recommended Substitution
                  </span>
                </div>
                <span className="px-2 py-0.5 rounded bg-cohere-coral text-white font-mono text-[10px] font-bold">
                  75&apos; WINDOW
                </span>
              </div>

              <div className="mt-4">
                <div className="flex items-center justify-between p-3 rounded bg-[#212128] border border-[#2e2e3a]">
                  <div>
                    <div className="text-[10px] font-mono text-cohere-coral font-bold uppercase">
                      SUB IN: PEDRO NETO (FW)
                    </div>
                    <div className="text-xs text-cohere-hairline mt-0.5">
                      Sub out: N. Jackson (58% Stamina)
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono font-bold text-white">
                      +0.34 xG
                    </div>
                    <div className="text-[10px] font-mono text-cohere-deep-green">
                      Projected Threat
                    </div>
                  </div>
                </div>

                <p className="text-xs text-cohere-muted mt-3 leading-relaxed">
                  Neto brings high sprint repeatability against Arsenal&apos;s tired left channel. Expected +18% increase in box entry crosses during final 15 minutes.
                </p>

                <Link
                  href="/simulation"
                  className="mt-4 w-full py-2 rounded bg-cohere-coral hover:bg-cohere-coral/90 text-white font-mono text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <span>Launch Detailed Substitution Simulator</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>

            {/* Press Intensity Gauge & PPDA */}
            <div className="bg-[#17171c] border border-[#2b2b36] rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between pb-2 border-b border-[#2b2b36]">
                <span className="font-display font-bold text-base text-white">
                  Pressing Intensity (PPDA)
                </span>
                <span className="text-xs font-mono text-cohere-muted">
                  PASSES PER DEF ACTION
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4 text-center">
                <div className="bg-[#212128] p-3 rounded border border-[#2e2e3a]">
                  <span className="text-[10px] font-mono text-cohere-muted uppercase">
                    Chelsea FC
                  </span>
                  <div className="font-display font-bold text-2xl text-white mt-1">
                    8.4
                  </div>
                  <span className="text-[10px] font-mono text-cohere-deep-green font-bold">
                    Aggressive Mid-Block
                  </span>
                </div>
                <div className="bg-[#212128] p-3 rounded border border-[#2e2e3a]">
                  <span className="text-[10px] font-mono text-cohere-muted uppercase">
                    Arsenal FC
                  </span>
                  <div className="font-display font-bold text-2xl text-white mt-1">
                    11.2
                  </div>
                  <span className="text-[10px] font-mono text-cohere-muted">
                    Passive Rest Defense
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
