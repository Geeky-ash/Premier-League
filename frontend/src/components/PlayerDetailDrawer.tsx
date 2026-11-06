"use client";

import React, { useEffect, useState } from "react";
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

const CLUB_COLORS: Record<string, string> = {
  Arsenal: "#ef0107", Chelsea: "#034694", "Manchester City": "#6cabdd",
  "Manchester United": "#d81920", Liverpool: "#c8102e", "Tottenham Hotspur": "#132257",
  "Newcastle United": "#241f20", "Aston Villa": "#670e36", Brighton: "#0057b8",
  "West Ham United": "#7a263a", Wolves: "#fdb913", Bournemouth: "#da291c",
  Fulham: "#000000", "Crystal Palace": "#1b458f", Brentford: "#e30613",
  Everton: "#003399", "Nottingham Forest": "#dd0000", Leicester: "#003090",
  Ipswich: "#0044aa", Southampton: "#d71920",
};

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

  const clubColor = CLUB_COLORS[player.club] || "#38003c";

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="drawer-panel animate-slide-right z-50">
        {/* Hero Header with Club Color & Official Player Cutout */}
        <div
          className="relative p-6 pb-8 border-b border-pl-border"
          style={{
            background: `linear-gradient(135deg, ${clubColor}cc 0%, #240024 70%, #190019 100%)`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/30 text-white/70 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>

          <div className="flex items-end gap-5">
            {/* Player Headshot Cutout */}
            <div className="relative w-24 h-24 rounded-full bg-black/30 border-2 border-white/20 p-1 shrink-0 overflow-hidden shadow-2xl">
              <img
                src={getPlayerPhoto(player.name)}
                alt={player.name}
                className="w-full h-full object-cover object-top"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getClubCrest(player.club, 100);
                }}
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <img
                  src={getClubCrest(player.club, 50)}
                  alt={player.club}
                  className="w-5 h-5 object-contain drop-shadow"
                />
                <span className="text-xs font-bold text-white/90 uppercase tracking-wider">
                  {player.club}
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">
                {player.name}
              </h2>
              <p className="text-xs text-white/75 mt-1 font-medium">
                {player.position} · Age {player.age} · {player.minutes_played.toLocaleString()} mins
              </p>
              <div className="mt-2.5 flex items-center gap-2">
                <span className="pos-badge bg-black/40 text-white font-bold">{player.position}</span>
                {player.cluster_archetype && (
                  <span className="pos-badge bg-pl-cyan/25 text-pl-cyan font-bold border border-pl-cyan/40">
                    {player.cluster_archetype}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Season Performance Grid */}
        <div className="p-6">
          <h3 className="text-xs uppercase tracking-widest text-pl-text-muted font-bold mb-3 flex items-center justify-between">
            <span>Season Performance</span>
            <span className="text-[10px] text-pl-green font-semibold">Premier League 2024/25</span>
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
              <div key={s.label} className="pl-card p-3 text-center border-pl-border/60">
                <div className="text-stat-md text-white">{s.value}</div>
                <div className="stat-label mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ML Transfer Valuation */}
        <div className="px-6 pb-6">
          <h3 className="text-xs uppercase tracking-widest text-pl-text-muted font-bold mb-3">
            Machine Learning Valuation
          </h3>
          <div className="pl-card bg-pl-card-gradient border-pl-green/30">
            {loading ? (
              <p className="text-sm text-pl-text-muted text-center py-4 animate-pulse">
                Evaluating Scikit-learn OLS pipeline...
              </p>
            ) : transferData ? (
              <div className="text-center">
                <div className="text-stat-xl text-pl-green font-extrabold tracking-tight">
                  €{transferData.valuation_eur_m.toFixed(1)}M
                </div>
                <div className="stat-label mt-1 text-pl-text-muted">Estimated Market Value</div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm pt-3 border-t border-pl-border">
                  <div className="text-center">
                    <div className="text-base font-bold text-white">
                      {(transferData.r2_score * 100).toFixed(0)}%
                    </div>
                    <div className="stat-label text-[10px]">Holdout R² Confidence</div>
                  </div>
                  <div className="text-center">
                    <div className="text-base font-bold text-white">
                      ±€{transferData.mae_score.toFixed(1)}M
                    </div>
                    <div className="stat-label text-[10px]">MAE Error Margin</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-pl-text-muted text-center py-4">
                Valuation currently unavailable
              </p>
            )}
          </div>
        </div>

        {/* Top 5 Statistical Twins with Club Badges */}
        <div className="px-6 pb-8">
          <h3 className="text-xs uppercase tracking-widest text-pl-text-muted font-bold mb-3">
            Top 5 Statistical Twins (K-Means Similarity)
          </h3>
          {loading ? (
            <p className="text-sm text-pl-text-muted text-center py-4 animate-pulse">
              Computing Euclidean distances in PCA space...
            </p>
          ) : scoutData && scoutData.top_twins.length > 0 ? (
            <div className="space-y-2">
              {scoutData.top_twins.map((twin, i) => (
                <div
                  key={twin.name}
                  className="flex items-center gap-3 px-4 py-3 rounded-pl bg-pl-purple border border-pl-border hover:border-pl-cyan transition-colors"
                >
                  <span className="text-xs font-bold text-pl-cyan w-5">
                    #{i + 1}
                  </span>
                  {/* Twin Club Crest */}
                  <img
                    src={getClubCrest(twin.club, 50)}
                    alt={twin.club}
                    className="w-7 h-7 object-contain shrink-0"
                  />
                  <div className="flex-1">
                    <div className="text-xs font-bold text-white">
                      {twin.name}
                    </div>
                    <div className="text-[10px] text-pl-text-muted">
                      {twin.club} · {twin.position} · Age {twin.age}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-extrabold text-pl-green">
                      {twin.similarity_pct.toFixed(1)}%
                    </div>
                    <div className="text-[9px] text-pl-text-muted uppercase font-semibold">
                      SIMILARITY
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-pl-text-muted text-center py-4">
              No similarity vectors found
            </p>
          )}
        </div>
      </div>
    </>
  );
}
