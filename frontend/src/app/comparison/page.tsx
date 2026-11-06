"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import { Plus, ArrowRight, AlertCircle, User, X, Sparkles, TrendingUp, Shield } from "lucide-react";
import {
  fetchPlayers,
  predictTransferValue,
  scoutPlayerTwin,
  PlayerRecord,
  TransferPredictResponse,
  ScoutTwinResponse,
} from "@/lib/api";
import { getClubCrest, getPlayerPhoto } from "@/lib/logos";
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
  { a: "Bruno Fernandes", b: "Declan Rice" },
  { a: "Alexander Isak", b: "Ollie Watkins" },
];

export default function ComparisonPage() {
  const [allPlayers, setAllPlayers] = useState<PlayerRecord[]>([]);
  const [playerA, setPlayerA] = useState<PlayerRecord | null>(null);
  const [playerB, setPlayerB] = useState<PlayerRecord | null>(null);
  const [modalSlot, setModalSlot] = useState<"A" | "B" | null>(null);
  const [drawerPlayer, setDrawerPlayer] = useState<PlayerRecord | null>(null);
  const comparisonRef = useRef<HTMLDivElement>(null);

  /* ML enrichment */
  const [transferA, setTransferA] = useState<TransferPredictResponse | null>(null);
  const [transferB, setTransferB] = useState<TransferPredictResponse | null>(null);
  const [scoutA, setScoutA] = useState<ScoutTwinResponse | null>(null);
  const [scoutB, setScoutB] = useState<ScoutTwinResponse | null>(null);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);

  useEffect(() => {
    fetchPlayers().then(setAllPlayers).catch(() => {});
  }, []);

  /* ── Fetch ML data when a player is selected ── */
  const enrichPlayer = useCallback(
    async (p: PlayerRecord, side: "A" | "B") => {
      if (side === "A") setLoadingA(true);
      else setLoadingB(true);

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
        setLoadingA(false);
      } else {
        setTransferB(tRes.status === "fulfilled" ? tRes.value : null);
        setScoutB(sRes.status === "fulfilled" ? sRes.value : null);
        setLoadingB(false);
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

    setTimeout(() => {
      comparisonRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 150);
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
      className={`text-stat-sm transition-all ${
        isBetter ? "text-pl-green font-bold drop-shadow-[0_0_8px_rgba(0,255,135,0.4)]" : "text-white"
      }`}
    >
      {typeof val === "number" ? val.toLocaleString() : val}
    </span>
  );

  return (
    <div className="space-y-8 animate-fade-in" ref={comparisonRef}>
      {/* ═══ Section Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2.5">
            <Shield className="text-pl-cyan" size={24} />
            Player Comparison Matrix
          </h2>
          <p className="text-sm text-pl-text-muted mt-1">
            Select two Premier League stars to compare official tracking metrics and ML AI projections side-by-side.
          </p>
        </div>
        {(playerA || playerB) && (
          <button
            onClick={() => {
              setPlayerA(null); setPlayerB(null);
              setTransferA(null); setTransferB(null);
              setScoutA(null); setScoutB(null);
            }}
            className="text-xs text-pl-magenta hover:text-white px-3 py-1.5 rounded-lg border border-pl-magenta/30 hover:border-pl-magenta transition-all w-fit"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* ═══ Slot Selection ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Slot A */}
        {playerA ? (
          <div
            className="pl-card flex items-center gap-4 cursor-pointer group hover:border-pl-cyan/50 transition-all relative overflow-hidden"
            onClick={() => setDrawerPlayer(playerA)}
          >
            <div className="relative w-16 h-16 rounded-full shrink-0 border-2 border-white/20 overflow-hidden bg-slate-900 shadow-lg">
              <Image
                src={getPlayerPhoto(playerA.name)}
                alt={playerA.name}
                width={64}
                height={64}
                className="w-full h-full object-cover object-top"
                unoptimized
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(playerA.name)}&background=38003c&color=00ff87`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 p-0.5 border border-white/20">
                <Image
                  src={getClubCrest(playerA.club)}
                  alt={playerA.club}
                  width={20}
                  height={20}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold text-white group-hover:text-pl-cyan transition-colors truncate">
                {playerA.name}
              </div>
              <div className="text-xs text-pl-text-muted flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-300">{playerA.club}</span>
                <span>•</span>
                <span>{playerA.position}</span>
                <span>•</span>
                <span>Age {playerA.age}</span>
              </div>
              <div className="text-[11px] text-pl-cyan mt-1 flex items-center gap-1">
                <span>View player dossier</span>
                <ArrowRight size={10} />
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPlayerA(null);
                setTransferA(null);
                setScoutA(null);
              }}
              className="p-2 text-pl-text-muted hover:text-pl-magenta hover:bg-white/5 rounded-full transition-colors"
              title="Remove player"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setModalSlot("A")}
            className="player-slot hover:border-pl-cyan/50 hover:bg-white/[0.03] transition-all flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-xl"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-pl-cyan mb-2 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <span className="text-sm font-semibold text-white">Select Player A</span>
            <span className="text-xs text-pl-text-muted mt-0.5">Click to choose from 500+ Premier League stars</span>
          </button>
        )}

        {/* Slot B */}
        {playerB ? (
          <div
            className="pl-card flex items-center gap-4 cursor-pointer group hover:border-pl-cyan/50 transition-all relative overflow-hidden"
            onClick={() => setDrawerPlayer(playerB)}
          >
            <div className="relative w-16 h-16 rounded-full shrink-0 border-2 border-white/20 overflow-hidden bg-slate-900 shadow-lg">
              <Image
                src={getPlayerPhoto(playerB.name)}
                alt={playerB.name}
                width={64}
                height={64}
                className="w-full h-full object-cover object-top"
                unoptimized
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(playerB.name)}&background=38003c&color=00ff87`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 p-0.5 border border-white/20">
                <Image
                  src={getClubCrest(playerB.club)}
                  alt={playerB.club}
                  width={20}
                  height={20}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-lg font-bold text-white group-hover:text-pl-cyan transition-colors truncate">
                {playerB.name}
              </div>
              <div className="text-xs text-pl-text-muted flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-slate-300">{playerB.club}</span>
                <span>•</span>
                <span>{playerB.position}</span>
                <span>•</span>
                <span>Age {playerB.age}</span>
              </div>
              <div className="text-[11px] text-pl-cyan mt-1 flex items-center gap-1">
                <span>View player dossier</span>
                <ArrowRight size={10} />
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setPlayerB(null);
                setTransferB(null);
                setScoutB(null);
              }}
              className="p-2 text-pl-text-muted hover:text-pl-magenta hover:bg-white/5 rounded-full transition-colors"
              title="Remove player"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setModalSlot("B")}
            className="player-slot hover:border-pl-cyan/50 hover:bg-white/[0.03] transition-all flex flex-col items-center justify-center p-6 border-2 border-dashed border-white/10 rounded-xl"
          >
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-pl-cyan mb-2 group-hover:scale-110 transition-transform">
              <Plus size={24} />
            </div>
            <span className="text-sm font-semibold text-white">Select Player B</span>
            <span className="text-xs text-pl-text-muted mt-0.5">Click to choose from 500+ Premier League stars</span>
          </button>
        )}
      </div>

      {/* ── Notice ── */}
      <div className="flex items-start gap-2.5 text-xs text-pl-text-muted bg-slate-900/60 rounded-xl px-4 py-3 border border-white/10 backdrop-blur-md">
        <AlertCircle size={15} className="shrink-0 mt-0.5 text-pl-cyan" />
        <span>
          ML transfer valuations, archetype cluster labels, and similarity twins are computed in real time by our FastAPI microservice.
          Click any loaded player card above to inspect their full radar profile and statistical twin breakdown.
        </span>
      </div>

      {/* ═══ Side-by-Side Stat Comparison ═══ */}
      {playerA && playerB && (
        <div className="pl-card p-0 overflow-hidden animate-slide-up border border-white/15 shadow-2xl">
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-slate-950/90 px-6 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Image
                src={getClubCrest(playerA.club)}
                alt={playerA.club}
                width={22}
                height={22}
                className="shrink-0"
                unoptimized
              />
              <span className="text-sm font-extrabold text-white truncate">{playerA.name}</span>
            </div>
            <div className="text-xs font-bold text-pl-cyan text-center uppercase tracking-wider self-center">
              Head-to-Head Matrix
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-sm font-extrabold text-white truncate">{playerB.name}</span>
              <Image
                src={getClubCrest(playerB.club)}
                alt={playerB.club}
                width={22}
                height={22}
                className="shrink-0"
                unoptimized
              />
            </div>
          </div>

          {/* Stat Rows */}
          {STAT_KEYS.map(({ key, label }) => {
            const valA = playerA[key] as number;
            const valB = playerB[key] as number;
            const aBetter = valA > valB;
            const bBetter = valB > valA;
            return (
              <div key={key} className="stat-row grid grid-cols-3 px-6 py-3 border-b border-white/5 hover:bg-white/[0.02] transition-colors items-center">
                <div>
                  <StatValue val={valA} isBetter={aBetter} />
                </div>
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
          <div className="stat-row grid grid-cols-3 px-6 py-4 bg-slate-900/60 border-b border-white/10 items-center">
            <div>
              {loadingA ? (
                <span className="text-xs text-pl-text-muted animate-pulse">Calculating...</span>
              ) : (
                <span className="text-stat-sm text-pl-green font-bold">
                  {transferA ? `€${transferA.valuation_eur_m.toFixed(1)}M` : "—"}
                </span>
              )}
            </div>
            <div className="text-xs text-pl-cyan text-center font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
              <Sparkles size={14} />
              <span>AI Predicted Valuation</span>
            </div>
            <div className="text-right">
              {loadingB ? (
                <span className="text-xs text-pl-text-muted animate-pulse">Calculating...</span>
              ) : (
                <span className="text-stat-sm text-pl-green font-bold">
                  {transferB ? `€${transferB.valuation_eur_m.toFixed(1)}M` : "—"}
                </span>
              )}
            </div>
          </div>

          <div className="stat-row grid grid-cols-3 px-6 py-4 bg-slate-900/80 items-center">
            <div>
              {loadingA ? (
                <span className="text-xs text-pl-text-muted animate-pulse">Clustering...</span>
              ) : (
                <span className="text-xs font-semibold text-pl-cyan bg-pl-cyan/10 px-2 py-1 rounded border border-pl-cyan/20">
                  {scoutA?.cluster_archetype || "—"}
                </span>
              )}
            </div>
            <div className="text-xs text-pl-cyan text-center font-bold uppercase tracking-wider flex items-center justify-center gap-1.5">
              <TrendingUp size={14} />
              <span>Tactical Archetype</span>
            </div>
            <div className="text-right">
              {loadingB ? (
                <span className="text-xs text-pl-text-muted animate-pulse">Clustering...</span>
              ) : (
                <span className="text-xs font-semibold text-pl-cyan bg-pl-cyan/10 px-2 py-1 rounded border border-pl-cyan/20">
                  {scoutB?.cluster_archetype || "—"}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Popular Player Comparisons ═══ */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-pl-text-muted font-bold mb-4 flex items-center gap-2">
          <span>Popular Premier League Battles</span>
          <span className="h-px bg-white/10 flex-1" />
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_COMPARISONS.map(({ a, b }) => {
            const pA = allPlayers.find((p) => p.name === a);
            const pB = allPlayers.find((p) => p.name === b);
            if (!pA || !pB) return null;
            return (
              <div
                key={`${a}-${b}`}
                className="comparison-card p-4 rounded-xl bg-slate-900/70 border border-white/10 hover:border-pl-cyan/40 transition-all cursor-pointer group flex flex-col justify-between"
                onClick={() => loadPreset(a, b)}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/20 bg-slate-800">
                        <Image
                          src={getPlayerPhoto(pA.name)}
                          alt={pA.name}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover object-top"
                          unoptimized
                        />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white group-hover:text-pl-cyan transition-colors truncate">
                          {pA.name}
                        </div>
                        <div className="text-[10px] text-pl-text-muted truncate flex items-center gap-1">
                          <Image
                            src={getClubCrest(pA.club)}
                            alt={pA.club}
                            width={12}
                            height={12}
                            unoptimized
                          />
                          <span>{pA.club}</span>
                        </div>
                      </div>
                    </div>

                    <span className="text-[10px] font-black text-pl-cyan px-1.5 py-0.5 rounded bg-pl-cyan/10 border border-pl-cyan/20">
                      VS
                    </span>

                    <div className="flex items-center gap-2 min-w-0 flex-row-reverse text-right">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-white/20 bg-slate-800">
                        <Image
                          src={getPlayerPhoto(pB.name)}
                          alt={pB.name}
                          width={36}
                          height={36}
                          className="w-full h-full object-cover object-top"
                          unoptimized
                        />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-white group-hover:text-pl-cyan transition-colors truncate">
                          {pB.name}
                        </div>
                        <div className="text-[10px] text-pl-text-muted truncate flex items-center justify-end gap-1">
                          <span>{pB.club}</span>
                          <Image
                            src={getClubCrest(pB.club)}
                            alt={pB.club}
                            width={12}
                            height={12}
                            unoptimized
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mini stat rows */}
                  <div className="space-y-1 text-[11px] bg-slate-950/60 p-2 rounded-lg border border-white/5">
                    {(["goals", "assists", "market_value_eur_m"] as const).map((k) => (
                      <div key={k} className="flex justify-between text-pl-text-secondary">
                        <span className="font-semibold text-white">{pA[k]}</span>
                        <span className="text-pl-text-muted capitalize text-[10px]">
                          {k === "market_value_eur_m" ? "Value (€M)" : k}
                        </span>
                        <span className="font-semibold text-white">{pB[k]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="pl-btn-white w-full mt-3 text-[11px] py-2 flex items-center justify-center gap-1.5 group-hover:bg-pl-green group-hover:text-slate-950 transition-colors"
                >
                  <span>Compare Head-to-Head</span>
                  <ArrowRight size={12} />
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
