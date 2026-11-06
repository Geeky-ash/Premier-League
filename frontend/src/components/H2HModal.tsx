"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ArrowRight, TrendingUp, ShieldAlert, Award, Sparkles, Layers } from "lucide-react";
import { fetchH2H, H2HResponse } from "@/lib/api";
import { getClubCrest } from "@/lib/logos";

interface H2HModalProps {
  homeTeam: string;
  awayTeam: string;
  open: boolean;
  onClose: () => void;
}

export default function H2HModal({
  homeTeam,
  awayTeam,
  open,
  onClose,
}: H2HModalProps) {
  const [data, setData] = useState<H2HResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !homeTeam || !awayTeam) return;
    setLoading(true);
    fetchH2H(homeTeam, awayTeam)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [open, homeTeam, awayTeam]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="w-full max-w-2xl mx-4 bg-slate-950 rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Club Crests */}
        <div className="relative p-6 bg-gradient-to-r from-pl-purple via-slate-900 to-pl-purple border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 p-1.5 flex items-center justify-center">
                <Image
                  src={getClubCrest(homeTeam)}
                  alt={homeTeam}
                  width={38}
                  height={38}
                  unoptimized
                />
              </div>
              <span className="text-sm font-black text-white">{homeTeam}</span>
            </div>

            <div className="text-center px-3">
              <span className="text-[10px] font-black text-pl-green uppercase tracking-widest block">
                Head-to-Head
              </span>
              <span className="text-xs font-bold text-pl-cyan">Last 10 Fixtures</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-black text-white">{awayTeam}</span>
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 p-1.5 flex items-center justify-center">
                <Image
                  src={getClubCrest(awayTeam)}
                  alt={awayTeam}
                  width={38}
                  height={38}
                  unoptimized
                />
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-xs text-pl-cyan animate-pulse">
              Computing head-to-head tracking metrics...
            </div>
          ) : data ? (
            <>
              {/* Record Summary */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <div className="text-2xl font-black text-pl-green">{data.home_wins}</div>
                  <div className="text-[10px] font-bold text-pl-text-muted uppercase">
                    {data.home_team.split(" ")[0]} Wins ({data.home_win_rate}%)
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <div className="text-2xl font-black text-pl-cyan">{data.draws}</div>
                  <div className="text-[10px] font-bold text-pl-text-muted uppercase">
                    Draws ({data.draw_rate}%)
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-white/10">
                  <div className="text-2xl font-black text-pl-magenta">{data.away_wins}</div>
                  <div className="text-[10px] font-bold text-pl-text-muted uppercase">
                    {data.away_team.split(" ")[0]} Wins ({data.away_win_rate}%)
                  </div>
                </div>
              </div>

              {/* Match Stat Averages */}
              <div className="space-y-2 p-4 rounded-xl bg-slate-900/60 border border-white/5">
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers size={13} className="text-pl-green" />
                  <span>10-Match Encounter Averages</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-pl-text-muted">Avg Goals Scored</span>
                  <span className="font-bold text-white">
                    {data.avg_goals_home} vs {data.avg_goals_away}
                  </span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-pl-text-muted">Avg Total Corners</span>
                  <span className="font-bold text-pl-cyan">{data.avg_total_corners} / game</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-white/5">
                  <span className="text-pl-text-muted">Avg Total Cards</span>
                  <span className="font-bold text-pl-magenta">{data.avg_total_cards} / game</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-pl-text-muted">Both Teams To Score (BTTS)</span>
                  <span className="font-bold text-pl-green">{data.btts_rate}%</span>
                </div>
              </div>

              {/* Top Player Props (Last 10 Games) */}
              <div>
                <div className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-pl-cyan" />
                  <span>Top Player Prop Trends (Last 10 Games)</span>
                </div>
                <div className="space-y-2">
                  {data.top_player_props.map((prop, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-900/80 border border-white/5 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2.5">
                        <Image
                          src={getClubCrest(prop.club)}
                          alt={prop.club}
                          width={20}
                          height={20}
                          unoptimized
                        />
                        <div>
                          <div className="text-xs font-bold text-white">{prop.player_name}</div>
                          <div className="text-[11px] text-pl-cyan font-semibold">{prop.prop_type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-pl-green px-2 py-0.5 rounded bg-pl-green/10 border border-pl-green/30">
                          {prop.hit_rate}
                        </span>
                        <span className="text-[10px] text-pl-text-muted block mt-0.5">
                          Avg: {prop.avg_per_game}/game
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulation CTA */}
              <Link
                href={`/match-predictor?home=${encodeURIComponent(homeTeam)}&away=${encodeURIComponent(awayTeam)}`}
                onClick={onClose}
                className="pl-btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-xs font-bold text-slate-950"
              >
                <span>Run Match Simulation in Predictor</span>
                <ArrowRight size={14} />
              </Link>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}
