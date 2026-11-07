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
        className="w-full max-w-2xl mx-4 bg-white rounded-lg border border-cohere-hairline shadow-2xl overflow-hidden animate-slide-up font-body text-cohere-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with Club Crests */}
        <div className="relative p-6 bg-cohere-soft-stone border-b border-cohere-hairline">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-sm bg-white border border-cohere-hairline p-1.5 flex items-center justify-center shadow-xs">
                <Image
                  src={getClubCrest(homeTeam)}
                  alt={homeTeam}
                  width={38}
                  height={38}
                  unoptimized
                />
              </div>
              <span className="text-sm font-bold text-cohere-primary">{homeTeam}</span>
            </div>

            <div className="text-center px-3 font-mono">
              <span className="text-[10px] font-bold text-cohere-coral uppercase tracking-widest block">
                Head-to-Head
              </span>
              <span className="text-xs font-bold text-cohere-primary">Last 10 Fixtures</span>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-cohere-primary">{awayTeam}</span>
              <div className="w-12 h-12 rounded-sm bg-white border border-cohere-hairline p-1.5 flex items-center justify-center shadow-xs">
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
            className="absolute top-4 right-4 p-1.5 rounded-full text-cohere-muted hover:text-cohere-ink transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-cohere-coral animate-pulse">
              Computing head-to-head tracking metrics...
            </div>
          ) : data ? (
            <>
              {/* Record Summary */}
              <div className="grid grid-cols-3 gap-3 text-center font-mono">
                <div className="p-3 rounded-sm bg-cohere-soft-stone/40 border border-cohere-hairline">
                  <div className="text-2xl font-bold text-cohere-coral">{data.home_wins}</div>
                  <div className="text-[10px] font-bold text-cohere-slate uppercase mt-0.5">
                    {data.home_team.split(" ")[0]} Wins ({data.home_win_rate}%)
                  </div>
                </div>
                <div className="p-3 rounded-sm bg-cohere-soft-stone/40 border border-cohere-hairline">
                  <div className="text-2xl font-bold text-cohere-slate">{data.draws}</div>
                  <div className="text-[10px] font-bold text-cohere-slate uppercase mt-0.5">
                    Draws ({data.draw_rate}%)
                  </div>
                </div>
                <div className="p-3 rounded-sm bg-cohere-soft-stone/40 border border-cohere-hairline">
                  <div className="text-2xl font-bold text-cohere-action-blue">{data.away_wins}</div>
                  <div className="text-[10px] font-bold text-cohere-slate uppercase mt-0.5">
                    {data.away_team.split(" ")[0]} Wins ({data.away_win_rate}%)
                  </div>
                </div>
              </div>

              {/* Match Stat Averages */}
              <div className="space-y-2 p-4 rounded-sm bg-cohere-soft-stone/30 border border-cohere-hairline">
                <div className="text-xs font-mono font-bold text-cohere-primary uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Layers size={13} className="text-cohere-coral" />
                  <span>10-Match Encounter Averages</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-cohere-hairline">
                  <span className="text-cohere-slate">Avg Goals Scored</span>
                  <span className="font-mono font-bold text-cohere-primary">
                    {data.avg_goals_home} vs {data.avg_goals_away}
                  </span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-cohere-hairline">
                  <span className="text-cohere-slate">Avg Total Corners</span>
                  <span className="font-mono font-bold text-cohere-primary">{data.avg_total_corners} / game</span>
                </div>
                <div className="flex justify-between text-xs py-1 border-b border-cohere-hairline">
                  <span className="text-cohere-slate">Avg Total Cards</span>
                  <span className="font-mono font-bold text-cohere-coral">{data.avg_total_cards} / game</span>
                </div>
                <div className="flex justify-between text-xs py-1">
                  <span className="text-cohere-slate">Both Teams To Score (BTTS)</span>
                  <span className="font-mono font-bold text-cohere-deep-green">{data.btts_rate}%</span>
                </div>
              </div>

              {/* Top Player Props (Last 10 Games) */}
              <div>
                <div className="text-xs font-mono font-bold text-cohere-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Sparkles size={13} className="text-cohere-coral" />
                  <span>Top Player Prop Trends (Last 10 Games)</span>
                </div>
                <div className="space-y-2">
                  {data.top_player_props.map((prop, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-sm bg-white border border-cohere-hairline flex items-center justify-between"
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
                          <div className="text-xs font-bold text-cohere-primary">{prop.player_name}</div>
                          <div className="text-[11px] text-cohere-slate font-mono">{prop.prop_type}</div>
                        </div>
                      </div>
                      <div className="text-right font-mono">
                        <span className="text-xs font-bold text-cohere-coral px-2 py-0.5 rounded bg-cohere-soft-stone border border-cohere-coral/30">
                          {prop.hit_rate}
                        </span>
                        <span className="text-[10px] text-cohere-muted block mt-0.5">
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
                className="button-primary w-full py-2.5 flex items-center justify-center gap-2 text-xs font-mono font-bold"
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
