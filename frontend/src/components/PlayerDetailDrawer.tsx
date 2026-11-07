"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  X,
  TrendingUp,
  Target,
  Crosshair,
  Users,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import {
  PlayerRecord,
  predictTransferValue,
  scoutPlayerTwin,
  TransferPredictResponse,
  ScoutTwinResponse,
} from "@/lib/api";
import { getClubCrest, getPlayerPhoto } from "@/lib/logos";

interface Props {
  player: PlayerRecord | null;
  open: boolean;
  onClose: () => void;
  onCompareWith?: (twinName: string) => void;
}

export default function PlayerDetailDrawer({ player, open, onClose, onCompareWith }: Props) {
  const [transferData, setTransferData] = useState<TransferPredictResponse | null>(null);
  const [scoutData, setScoutData] = useState<ScoutTwinResponse | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (player && open) {
      setLoading(true);
      const fetchAll = async () => {
        try {
          const [tRes, sRes] = await Promise.allSettled([
            predictTransferValue({
              age: player.age,
              goals: player.goals,
              assists: player.assists,
              minutes_played: player.minutes_played,
              position: player.position,
            }),
            scoutPlayerTwin(player.name),
          ]);
          if (tRes.status === "fulfilled") setTransferData(tRes.value);
          if (sRes.status === "fulfilled") setScoutData(sRes.value);
        } catch {}
        setLoading(false);
      };
      fetchAll();
    } else {
      setTransferData(null);
      setScoutData(null);
    }
  }, [player, open]);

  if (!open || !player) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white border-l border-cohere-hairline shadow-2xl z-50 overflow-y-auto animate-slide-right font-body text-cohere-ink">
        {/* Hero Header */}
        <div className="relative p-6 bg-cohere-soft-stone border-b border-cohere-hairline">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full text-cohere-muted hover:text-cohere-ink transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-center gap-4">
            <div className="relative w-20 h-20 rounded-full bg-white border border-cohere-hairline shrink-0 overflow-hidden shadow-sm">
              <img
                src={getPlayerPhoto(player.name)}
                alt={player.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getClubCrest(player.club, 100);
                }}
              />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-1">
                <img
                  src={getClubCrest(player.club, 50)}
                  alt={player.club}
                  className="w-4 h-4 object-contain"
                />
                <span className="text-xs font-mono font-bold text-cohere-slate uppercase tracking-wider truncate">
                  {player.club}
                </span>
              </div>
              <h2 className="text-2xl font-display font-medium text-cohere-primary tracking-tight truncate">
                {player.name}
              </h2>
              <p className="text-xs text-cohere-slate font-mono mt-0.5">
                {player.position} · Age {player.age} · {player.minutes_played.toLocaleString()} mins
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="chip-coral font-mono text-[10px]">{player.position}</span>
                {player.cluster_archetype && (
                  <span className="chip-pale-green font-mono text-[10px]">
                    {player.cluster_archetype}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Season Performance Grid */}
        <div className="p-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cohere-slate mb-3 flex items-center justify-between">
            <span>Season Performance</span>
            <span className="text-[10px] text-cohere-coral">Premier League 2024/25</span>
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Goals", value: player.goals, icon: Target },
              { label: "Assists", value: player.assists, icon: Crosshair },
              { label: "Minutes", value: player.minutes_played.toLocaleString(), icon: BarChart3 },
              { label: "Shots", value: player.shots, icon: TrendingUp },
              { label: "Pass %", value: `${player.pass_completion}%`, icon: Users },
              { label: "Tackles", value: player.tackles_interceptions, icon: Users },
            ].map((s) => (
              <div key={s.label} className="p-3 text-center rounded-sm bg-cohere-soft-stone/40 border border-cohere-hairline">
                <div className="text-lg font-mono font-bold text-cohere-primary">{s.value}</div>
                <div className="text-[10px] font-mono font-semibold text-cohere-slate mt-0.5 uppercase">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ML Transfer Valuation */}
        <div className="px-6 pb-6">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cohere-slate mb-3">
            Machine Learning Valuation
          </h3>
          <div className="agent-console-card p-5">
            {loading ? (
              <p className="text-xs font-mono text-white/70 text-center py-4 animate-pulse">
                Evaluating Scikit-learn OLS pipeline...
              </p>
            ) : transferData ? (
              <div className="text-center">
                <div className="text-3xl font-display font-medium text-cohere-coral tracking-tight">
                  €{transferData.valuation_eur_m.toFixed(1)}M
                </div>
                <div className="text-[11px] font-mono text-white/70 mt-1 uppercase">Estimated Market Value</div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm pt-3 border-t border-white/10 font-mono">
                  <div className="text-center">
                    <div className="text-sm font-bold text-white">
                      {(transferData.r2_score * 100).toFixed(0)}%
                    </div>
                    <div className="text-[10px] text-white/60">Holdout R²</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-bold text-white">
                      ±€{transferData.mae_score.toFixed(1)}M
                    </div>
                    <div className="text-[10px] text-white/60">MAE Margin</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs font-mono text-white/60 text-center py-4">
                Valuation currently unavailable
              </p>
            )}
          </div>
        </div>

        {/* Top 5 Statistical Twins with Club Badges */}
        <div className="px-6 pb-8">
          <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-cohere-slate mb-3">
            Top 5 Statistical Twins (K-Means Similarity)
          </h3>
          {loading ? (
            <p className="text-xs font-mono text-cohere-muted text-center py-4 animate-pulse">
              Computing Euclidean distances in PCA space...
            </p>
          ) : scoutData && scoutData.top_twins.length > 0 ? (
            <div className="space-y-2">
              {scoutData.top_twins.map((twin, i) => (
                <div
                  key={twin.name}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-sm bg-cohere-soft-stone/40 border border-cohere-hairline hover:border-cohere-coral transition-colors"
                >
                  <span className="text-xs font-mono font-bold text-cohere-coral w-5">
                    #{i + 1}
                  </span>
                  <img
                    src={getClubCrest(twin.club, 50)}
                    alt={twin.club}
                    className="w-6 h-6 object-contain shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-cohere-primary truncate">
                      {twin.name}
                    </div>
                    <div className="text-[10px] font-mono text-cohere-slate truncate">
                      {twin.club} · {twin.position} · Age {twin.age}
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <div className="text-xs font-bold text-cohere-primary">
                      {twin.similarity_pct.toFixed(1)}%
                    </div>
                    <div className="text-[9px] text-cohere-muted uppercase font-semibold">
                      SIMILARITY
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs font-mono text-cohere-muted text-center py-4">
              No similarity vectors found
            </p>
          )}
        </div>
      </div>
    </>
  );
}
