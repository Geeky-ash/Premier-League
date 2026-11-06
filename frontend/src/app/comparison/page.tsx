"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Plus, ArrowRight, AlertCircle, User, X } from "lucide-react";
import {
  fetchPlayers,
  predictTransferValue,
  scoutPlayerTwin,
  PlayerRecord,
  TransferPredictResponse,
  ScoutTwinResponse,
} from "@/lib/api";
import PlayerSearchModal from "@/components/PlayerSearchModal";
import PlayerDetailDrawer from "@/components/PlayerDetailDrawer";

/* ── Club colors ── */
const CLUB_COLORS: Record<string, string> = {
  Arsenal: "#ef0107", Chelsea: "#034694", "Manchester City": "#6cabdd",
  "Manchester United": "#d81920", Liverpool: "#c8102e", "Tottenham Hotspur": "#132257",
  "Newcastle United": "#241f20", "Aston Villa": "#670e36", Brighton: "#0057b8",
  "West Ham United": "#7a263a", Wolves: "#fdb913", Bournemouth: "#da291c",
  Fulham: "#000000", "Crystal Palace": "#1b458f", Brentford: "#e30613",
  Everton: "#003399", "Nottingham Forest": "#dd0000", Leicester: "#003090",
  Ipswich: "#0044aa", Southampton: "#d71920",
};

/* ── Stat rows shown in comparison ── */
const STAT_KEYS: { key: keyof PlayerRecord; label: string }[] = [
  { key: "goals", label: "Goals" },
  { key: "assists", label: "Assists" },
  { key: "shots", label: "Shots" },
  { key: "minutes_played", label: "Minutes Played" },
  { key: "pass_completion", label: "Pass Completion %" },
  { key: "dribbles", label: "Dribbles" },
  { key: "tackles_interceptions", label: "Tackles & Interceptions" },
  { key: "market_value_eur_m", label: "Market Value (€M)" },
];

/* ── Popular preset comparisons ── */
const POPULAR_COMPARISONS = [
  { a: "Bukayo Saka", b: "Cole Palmer" },
  { a: "Erling Haaland", b: "Mohamed Salah" },
  { a: "Bruno Fernandes", b: "Martin Odegaard" },
  { a: "Alexander Isak", b: "Ollie Watkins" },
];

export default function ComparisonPage() {
  const [allPlayers, setAllPlayers] = useState<PlayerRecord[]>([]);
  const [playerA, setPlayerA] = useState<PlayerRecord | null>(null);
  const [playerB, setPlayerB] = useState<PlayerRecord | null>(null);
  const [modalSlot, setModalSlot] = useState<"A" | "B" | null>(null);
  const [drawerPlayer, setDrawerPlayer] = useState<PlayerRecord | null>(null);

  /* ML enrichment */
  const [transferA, setTransferA] = useState<TransferPredictResponse | null>(null);
  const [transferB, setTransferB] = useState<TransferPredictResponse | null>(null);
  const [scoutA, setScoutA] = useState<ScoutTwinResponse | null>(null);
  const [scoutB, setScoutB] = useState<ScoutTwinResponse | null>(null);

  useEffect(() => {
    fetchPlayers().then(setAllPlayers).catch(() => {});
  }, []);

  /* ── Fetch ML data when a player is selected ── */
  const enrichPlayer = useCallback(
    async (p: PlayerRecord, side: "A" | "B") => {
      const [tRes, sRes] = await Promise.allSettled([
        predictTransferValue({
          age: p.age, goals: p.goals, assists: p.assists,
          minutes_played: p.minutes_played, position: p.position,
        }),
        scoutPlayerTwin(p.name),
      ]);
      if (side === "A") {
        setTransferA(tRes.status === "fulfilled" ? tRes.value : null);
        setScoutA(sRes.status === "fulfilled" ? sRes.value : null);
      } else {
        setTransferB(tRes.status === "fulfilled" ? tRes.value : null);
        setScoutB(sRes.status === "fulfilled" ? sRes.value : null);
      }
    },
    []
  );

  const selectPlayer = (p: PlayerRecord, slot: "A" | "B") => {
    if (slot === "A") setPlayerA(p);
    else setPlayerB(p);
    enrichPlayer(p, slot);
  };

  /* ── Load preset comparison ── */
  const loadPreset = (nameA: string, nameB: string) => {
    const a = allPlayers.find((p) => p.name === nameA);
    const b = allPlayers.find((p) => p.name === nameB);
    if (a) { setPlayerA(a); enrichPlayer(a, "A"); }
    if (b) { setPlayerB(b); enrichPlayer(b, "B"); }
  };

  const getClubColor = (club: string) => CLUB_COLORS[club] || "#38003c";

  /* ── Stat comparison helper ── */
  const StatValue = ({
    val,
    isBetter,
  }: {
    val: number | string;
    isBetter: boolean;
  }) => (
    <span
      className={`text-stat-sm ${
        isBetter ? "text-pl-green" : "text-white"
      }`}
    >
      {typeof val === "number" ? val.toLocaleString() : val}
    </span>
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ═══ Section Header ═══ */}
      <div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight">
          Player Comparison
        </h2>
        <p className="text-sm text-pl-text-muted mt-1">
          Select two players to compare season stats and ML-powered insights
          side-by-side.
        </p>
      </div>

      {/* ═══ Slot Selection ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Slot A */}
        {playerA ? (
          <div
            className="pl-card flex items-center gap-4 cursor-pointer group"
            onClick={() => setDrawerPlayer(playerA)}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-2 border-white/15"
              style={{ backgroundColor: getClubColor(playerA.club) }}
            >
              <User size={28} className="text-white/70" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-white group-hover:text-pl-cyan transition-colors">
                {playerA.name}
              </div>
              <div className="text-xs text-pl-text-muted">
                {playerA.club} · {playerA.position} · Age {playerA.age}
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setPlayerA(null); setTransferA(null); setScoutA(null); }}
              className="p-1.5 text-pl-text-muted hover:text-pl-magenta transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setModalSlot("A")}
            className="player-slot"
          >
            <Plus size={32} className="text-pl-text-muted" />
            <span className="text-sm text-pl-text-muted mt-2">
              Click + to add player
            </span>
          </button>
        )}

        {/* Slot B */}
        {playerB ? (
          <div
            className="pl-card flex items-center gap-4 cursor-pointer group"
            onClick={() => setDrawerPlayer(playerB)}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center shrink-0 border-2 border-white/15"
              style={{ backgroundColor: getClubColor(playerB.club) }}
            >
              <User size={28} className="text-white/70" />
            </div>
            <div className="flex-1">
              <div className="text-lg font-bold text-white group-hover:text-pl-cyan transition-colors">
                {playerB.name}
              </div>
              <div className="text-xs text-pl-text-muted">
                {playerB.club} · {playerB.position} · Age {playerB.age}
              </div>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setPlayerB(null); setTransferB(null); setScoutB(null); }}
              className="p-1.5 text-pl-text-muted hover:text-pl-magenta transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setModalSlot("B")}
            className="player-slot"
          >
            <Plus size={32} className="text-pl-text-muted" />
            <span className="text-sm text-pl-text-muted mt-2">
              Click + to add player
            </span>
          </button>
        )}
      </div>

      {/* ── Notice ── */}
      <div className="flex items-start gap-2 text-xs text-pl-text-muted bg-pl-purple/50 rounded-pl px-4 py-3 border border-pl-border">
        <AlertCircle size={14} className="shrink-0 mt-0.5" />
        <span>
          ML valuations and scouting archetypes are computed in real-time from
          our FastAPI microservice. Some statistics may not be available for all
          historical seasons.
        </span>
      </div>

      {/* ═══ Side-by-Side Stat Comparison ═══ */}
      {playerA && playerB && (
        <div className="pl-card p-0 overflow-hidden animate-slide-up">
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-pl-dark px-6 py-4 border-b border-pl-border">
            <div className="text-sm font-bold text-white">{playerA.name}</div>
            <div className="text-xs font-bold text-pl-text-muted text-center uppercase tracking-wider">
              Statistic
            </div>
            <div className="text-sm font-bold text-white text-right">
              {playerB.name}
            </div>
          </div>

          {/* Stat Rows */}
          {STAT_KEYS.map(({ key, label }) => {
            const valA = playerA[key] as number;
            const valB = playerB[key] as number;
            const aBetter = valA > valB;
            const bBetter = valB > valA;
            return (
              <div key={key} className="stat-row grid grid-cols-3 px-6">
                <StatValue val={valA} isBetter={aBetter} />
                <div className="text-xs text-pl-text-muted text-center font-semibold">
                  {label}
                </div>
                <div className="text-right">
                  <StatValue val={valB} isBetter={bBetter} />
                </div>
              </div>
            );
          })}

          {/* ML Enrichment Rows */}
          <div className="stat-row grid grid-cols-3 px-6 bg-pl-dark/50">
            <span className="text-stat-sm text-pl-green">
              {transferA ? `€${transferA.valuation_eur_m.toFixed(1)}M` : "—"}
            </span>
            <div className="text-xs text-pl-cyan text-center font-bold uppercase tracking-wider">
              ML Predicted Value
            </div>
            <div className="text-right">
              <span className="text-stat-sm text-pl-green">
                {transferB ? `€${transferB.valuation_eur_m.toFixed(1)}M` : "—"}
              </span>
            </div>
          </div>
          <div className="stat-row grid grid-cols-3 px-6 bg-pl-dark/50">
            <span className="text-sm font-semibold text-pl-cyan">
              {scoutA?.cluster_archetype || "—"}
            </span>
            <div className="text-xs text-pl-cyan text-center font-bold uppercase tracking-wider">
              Scouting Archetype
            </div>
            <div className="text-right">
              <span className="text-sm font-semibold text-pl-cyan">
                {scoutB?.cluster_archetype || "—"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ═══ Popular Player Comparisons ═══ */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-pl-text-muted font-bold mb-4">
          Popular Player Comparisons
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_COMPARISONS.map(({ a, b }) => {
            const pA = allPlayers.find((p) => p.name === a);
            const pB = allPlayers.find((p) => p.name === b);
            if (!pA || !pB) return null;
            return (
              <div
                key={`${a}-${b}`}
                className="comparison-card p-4"
                onClick={() => loadPreset(a, b)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: getClubColor(pA.club) }}
                    >
                      <User size={14} className="text-white/70" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{pA.name}</div>
                      <div className="text-[10px] text-pl-text-muted">{pA.club}</div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-pl-cyan">VS</span>
                  <div className="flex items-center gap-2">
                    <div>
                      <div className="text-xs font-bold text-white text-right">{pB.name}</div>
                      <div className="text-[10px] text-pl-text-muted text-right">{pB.club}</div>
                    </div>
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: getClubColor(pB.club) }}
                    >
                      <User size={14} className="text-white/70" />
                    </div>
                  </div>
                </div>
                {/* Mini stat rows */}
                <div className="space-y-1 text-[11px]">
                  {(["goals", "assists", "market_value_eur_m"] as const).map((k) => (
                    <div key={k} className="flex justify-between text-pl-text-secondary">
                      <span>{pA[k]}</span>
                      <span className="text-pl-text-muted capitalize">
                        {k === "market_value_eur_m" ? "Value (€M)" : k}
                      </span>
                      <span>{pB[k]}</span>
                    </div>
                  ))}
                </div>
                <button className="pl-btn-white w-full mt-3 text-[11px] py-1.5">
                  View full comparison <ArrowRight size={12} />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Modals & Drawer ═══ */}
      <PlayerSearchModal
        open={modalSlot !== null}
        onClose={() => setModalSlot(null)}
        onSelect={(p) => {
          if (modalSlot) selectPlayer(p, modalSlot);
        }}
        excludeIds={[playerA?.player_id, playerB?.player_id].filter(Boolean) as number[]}
      />
      <PlayerDetailDrawer
        player={drawerPlayer}
        open={drawerPlayer !== null}
        onClose={() => setDrawerPlayer(null)}
      />
    </div>
  );
}
