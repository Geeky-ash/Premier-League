"use client";

import React, { useEffect, useState } from "react";
import {
  X,
  User,
  TrendingUp,
  Target,
  Crosshair,
  Users,
  BarChart3,
} from "lucide-react";
import {
  PlayerRecord,
  predictTransferValue,
  scoutPlayerTwin,
  TransferPredictResponse,
  ScoutTwinResponse,
} from "@/lib/api";

interface Props {
  player: PlayerRecord | null;
  open: boolean;
  onClose: () => void;
}

const CLUB_COLORS: Record<string, string> = {
  Arsenal: "#ef0107",
  Chelsea: "#034694",
  "Manchester City": "#6cabdd",
  "Manchester United": "#d81920",
  Liverpool: "#c8102e",
  "Tottenham Hotspur": "#132257",
  "Newcastle United": "#241f20",
  "Aston Villa": "#670e36",
  Brighton: "#0057b8",
  "West Ham United": "#7a263a",
  Wolves: "#fdb913",
  Bournemouth: "#da291c",
  Fulham: "#000000",
  "Crystal Palace": "#1b458f",
  Brentford: "#e30613",
  Everton: "#003399",
  "Nottingham Forest": "#dd0000",
  Leicester: "#003090",
  Ipswich: "#0044aa",
  Southampton: "#d71920",
};

export default function PlayerDetailDrawer({ player, open, onClose }: Props) {
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
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="drawer-panel animate-slide-right">
        {/* Hero Header */}
        <div
          className="relative p-6 pb-8"
          style={{
            background: `linear-gradient(135deg, ${clubColor}dd 0%, #190019 100%)`,
          }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-end gap-5">
            <div
              className="w-24 h-24 rounded-full flex items-center justify-center border-2 border-white/20"
              style={{ backgroundColor: clubColor }}
            >
              <User size={40} className="text-white/70" />
            </div>
            <div>
              <h2 className="text-2xl font-extrabold text-white tracking-tight">
                {player.name}
              </h2>
              <p className="text-sm text-white/70 mt-1">
                {player.club} · {player.position} · Age {player.age}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span className="pos-badge">{player.position}</span>
                {player.cluster_archetype && (
                  <span className="pos-badge bg-pl-cyan/20 text-pl-cyan">
                    {player.cluster_archetype}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="p-6">
          <h3 className="text-xs uppercase tracking-widest text-pl-text-muted font-bold mb-4">
            Season Performance
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
              <div key={s.label} className="pl-card p-3 text-center">
                <div className="text-stat-md text-white">{s.value}</div>
                <div className="stat-label mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ML Transfer Valuation */}
        <div className="px-6 pb-6">
          <h3 className="text-xs uppercase tracking-widest text-pl-text-muted font-bold mb-4">
            ML Transfer Valuation
          </h3>
          <div className="pl-card">
            {loading ? (
              <p className="text-sm text-pl-text-muted text-center py-4">
                Running model inference...
              </p>
            ) : transferData ? (
              <div className="text-center">
                <div className="text-stat-xl text-pl-green">
                  €{transferData.valuation_eur_m.toFixed(1)}M
                </div>
                <div className="stat-label mt-2">Predicted Market Value</div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      {(transferData.r2_score * 100).toFixed(0)}%
                    </div>
                    <div className="stat-label">Model R²</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-white">
                      €{transferData.mae_score.toFixed(1)}M
                    </div>
                    <div className="stat-label">MAE</div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-pl-text-muted text-center py-4">
                Valuation unavailable
              </p>
            )}
          </div>
        </div>

        {/* Top 5 Statistical Twins */}
        <div className="px-6 pb-8">
          <h3 className="text-xs uppercase tracking-widest text-pl-text-muted font-bold mb-4">
            Top 5 Statistical Twins
          </h3>
          {loading ? (
            <p className="text-sm text-pl-text-muted text-center py-4">
              Computing similarity vectors...
            </p>
          ) : scoutData && scoutData.top_twins.length > 0 ? (
            <div className="space-y-2">
              {scoutData.top_twins.map((twin, i) => (
                <div
                  key={twin.name}
                  className="flex items-center gap-3 px-4 py-3 rounded-pl bg-pl-purple border border-pl-border"
                >
                  <span className="text-sm font-bold text-pl-cyan w-6">
                    #{i + 1}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{
                      backgroundColor: CLUB_COLORS[twin.club] || "#38003c",
                    }}
                  >
                    <User size={14} className="text-white/70" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">
                      {twin.name}
                    </div>
                    <div className="text-[11px] text-pl-text-muted">
                      {twin.club} · {twin.position}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-pl-green">
                      {twin.similarity_pct.toFixed(1)}%
                    </div>
                    <div className="text-[10px] text-pl-text-muted">MATCH</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-pl-text-muted text-center py-4">
              No twin data available
            </p>
          )}
        </div>
      </div>
    </>
  );
}
