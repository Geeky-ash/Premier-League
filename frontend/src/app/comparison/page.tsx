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

  const getClubColor = (club: string) => CLUB_COLORS[club] || "#17171c";

  /* ── Stat comparison helper ── */
  const StatValue = ({
    val,
    isBetter,
  }: {
    val: number | string;
    isBetter: boolean;
  }) => (
    <span
      className={`text-sm font-mono transition-all ${
        isBetter ? "text-cohere-coral font-bold" : "text-cohere-primary"
      }`}
    >
      {typeof val === "number" ? val.toLocaleString() : val}
    </span>
  );

  return (
    <div className="space-y-8 animate-fade-in font-body text-cohere-ink" ref={comparisonRef}>
      {/* ═══ Section Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-display font-medium text-cohere-primary tracking-tight flex items-center gap-2.5">
            <Shield className="text-cohere-coral" size={26} />
            Player Comparison Matrix
          </h2>
          <p className="text-sm text-cohere-body-muted mt-1 max-w-2xl">
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
            className="text-xs font-mono font-medium text-cohere-coral hover:text-cohere-ink px-4 py-2 rounded-pill border border-cohere-hairline hover:bg-cohere-soft-stone transition-all w-fit"
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
            className="product-card flex items-center gap-4 cursor-pointer group hover:border-cohere-coral transition-all relative overflow-hidden"
            onClick={() => setDrawerPlayer(playerA)}
          >
            <div className="relative w-16 h-16 rounded-full shrink-0 border border-cohere-hairline overflow-hidden bg-cohere-soft-stone shadow-sm">
              <Image
                src={getPlayerPhoto(playerA.name)}
                alt={playerA.name}
                width={64}
                height={64}
                className="w-full h-full object-cover object-top"
                unoptimized
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(playerA.name)}&background=eeece7&color=17171c`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white p-0.5 border border-cohere-hairline">
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
              <div className="text-lg font-bold text-cohere-primary group-hover:text-cohere-coral transition-colors truncate">
                {playerA.name}
              </div>
              <div className="text-xs text-cohere-slate flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-cohere-ink">{playerA.club}</span>
                <span>•</span>
                <span>{playerA.position}</span>
                <span>•</span>
                <span>Age {playerA.age}</span>
              </div>
              <div className="text-[11px] text-cohere-coral font-medium mt-1 flex items-center gap-1">
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
              className="p-2 text-cohere-muted hover:text-cohere-coral hover:bg-white rounded-full transition-colors"
              title="Remove player"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setModalSlot("A")}
            className="player-slot hover:border-cohere-coral hover:bg-cohere-soft-stone/40 transition-all flex flex-col items-center justify-center p-6 border-2 border-dashed border-cohere-hairline rounded-lg bg-cohere-soft-stone/20"
          >
            <div className="w-12 h-12 rounded-full bg-cohere-coral/10 flex items-center justify-center text-cohere-coral mb-2">
              <Plus size={24} />
            </div>
            <span className="text-sm font-semibold text-cohere-primary">Select Player A</span>
            <span className="text-xs text-cohere-muted mt-0.5">Click to choose from 500+ Premier League stars</span>
          </button>
        )}

        {/* Slot B */}
        {playerB ? (
          <div
            className="product-card flex items-center gap-4 cursor-pointer group hover:border-cohere-action-blue transition-all relative overflow-hidden"
            onClick={() => setDrawerPlayer(playerB)}
          >
            <div className="relative w-16 h-16 rounded-full shrink-0 border border-cohere-hairline overflow-hidden bg-cohere-soft-stone shadow-sm">
              <Image
                src={getPlayerPhoto(playerB.name)}
                alt={playerB.name}
                width={64}
                height={64}
                className="w-full h-full object-cover object-top"
                unoptimized
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(playerB.name)}&background=eeece7&color=1863dc`;
                }}
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-white p-0.5 border border-cohere-hairline">
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
              <div className="text-lg font-bold text-cohere-primary group-hover:text-cohere-action-blue transition-colors truncate">
                {playerB.name}
              </div>
              <div className="text-xs text-cohere-slate flex items-center gap-1.5 flex-wrap">
                <span className="font-semibold text-cohere-ink">{playerB.club}</span>
                <span>•</span>
                <span>{playerB.position}</span>
                <span>•</span>
                <span>Age {playerB.age}</span>
              </div>
              <div className="text-[11px] text-cohere-action-blue font-medium mt-1 flex items-center gap-1">
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
              className="p-2 text-cohere-muted hover:text-cohere-coral hover:bg-white rounded-full transition-colors"
              title="Remove player"
            >
              <X size={18} />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setModalSlot("B")}
            className="player-slot hover:border-cohere-action-blue hover:bg-cohere-soft-stone/40 transition-all flex flex-col items-center justify-center p-6 border-2 border-dashed border-cohere-hairline rounded-lg bg-cohere-soft-stone/20"
          >
            <div className="w-12 h-12 rounded-full bg-cohere-action-blue/10 flex items-center justify-center text-cohere-action-blue mb-2">
              <Plus size={24} />
            </div>
            <span className="text-sm font-semibold text-cohere-primary">Select Player B</span>
            <span className="text-xs text-cohere-muted mt-0.5">Click to choose from 500+ Premier League stars</span>
          </button>
        )}
      </div>

      {/* ── Notice ── */}
      <div className="flex items-start gap-2.5 text-xs text-cohere-body-muted bg-cohere-pale-blue rounded-lg px-4 py-3 border border-cohere-hairline">
        <AlertCircle size={15} className="shrink-0 mt-0.5 text-cohere-action-blue" />
        <span>
          ML transfer valuations, archetype cluster labels, and similarity twins are computed in real time by our FastAPI microservice.
          Click any loaded player card above to inspect their full radar profile and statistical twin breakdown.
        </span>
      </div>

      {/* ═══ Side-by-Side Stat Comparison ═══ */}
      {playerA && playerB && (
        <div className="cohere-card-white p-0 overflow-hidden animate-slide-up">
          {/* Header Row */}
          <div className="grid grid-cols-3 bg-cohere-soft-stone px-6 py-4 border-b border-cohere-hairline">
            <div className="flex items-center gap-2">
              <Image
                src={getClubCrest(playerA.club)}
                alt={playerA.club}
                width={22}
                height={22}
                className="shrink-0"
                unoptimized
              />
              <span className="text-sm font-bold text-cohere-primary truncate">{playerA.name}</span>
            </div>
            <div className="text-xs font-mono font-bold text-cohere-coral text-center uppercase tracking-wider self-center">
              Head-to-Head Matrix
            </div>
            <div className="flex items-center justify-end gap-2">
              <span className="text-sm font-bold text-cohere-primary truncate">{playerB.name}</span>
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
              <div key={key} className="stat-row grid grid-cols-3 px-6 py-3 border-b border-cohere-hairline hover:bg-cohere-soft-stone/30 transition-colors items-center">
                <div>
                  <StatValue val={valA} isBetter={aBetter} />
                </div>
                <div className="text-xs text-cohere-slate text-center font-mono font-medium">
                  {label}
                </div>
                <div className="text-right">
                  <StatValue val={valB} isBetter={bBetter} />
                </div>
              </div>
            );
          })}

          {/* ML Enrichment Rows */}
          <div className="stat-row grid grid-cols-3 px-6 py-4 bg-cohere-soft-stone/50 border-b border-cohere-hairline items-center">
            <div>
              {loadingA ? (
                <span className="text-xs text-cohere-muted animate-pulse">Calculating...</span>
              ) : (
                <span className="text-sm text-cohere-coral font-bold font-mono">
                  {transferA ? `€${transferA.valuation_eur_m.toFixed(1)}M` : "—"}
                </span>
              )}
            </div>
            <div className="text-xs text-cohere-primary text-center font-bold uppercase font-mono tracking-wider flex items-center justify-center gap-1.5">
              <Sparkles size={14} className="text-cohere-coral" />
              <span>AI Predicted Valuation</span>
            </div>
            <div className="text-right">
              {loadingB ? (
                <span className="text-xs text-cohere-muted animate-pulse">Calculating...</span>
              ) : (
                <span className="text-sm text-cohere-action-blue font-bold font-mono">
                  {transferB ? `€${transferB.valuation_eur_m.toFixed(1)}M` : "—"}
                </span>
              )}
            </div>
          </div>

          <div className="stat-row grid grid-cols-3 px-6 py-4 bg-cohere-soft-stone/70 items-center">
            <div>
              {loadingA ? (
                <span className="text-xs text-cohere-muted animate-pulse">Clustering...</span>
              ) : (
                <span className="text-xs font-semibold text-cohere-coral bg-cohere-coral/10 px-2 py-1 rounded border border-cohere-coral/20">
                  {scoutA?.cluster_archetype || "—"}
                </span>
              )}
            </div>
            <div className="text-xs text-cohere-primary text-center font-bold uppercase font-mono tracking-wider flex items-center justify-center gap-1.5">
              <TrendingUp size={14} className="text-cohere-action-blue" />
              <span>Tactical Archetype</span>
            </div>
            <div className="text-right">
              {loadingB ? (
                <span className="text-xs text-cohere-muted animate-pulse">Clustering...</span>
              ) : (
                <span className="text-xs font-semibold text-cohere-action-blue bg-cohere-action-blue/10 px-2 py-1 rounded border border-cohere-action-blue/20">
                  {scoutB?.cluster_archetype || "—"}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Popular Player Comparisons ═══ */}
      <div>
        <h3 className="text-xs uppercase tracking-widest text-cohere-slate font-mono font-bold mb-4 flex items-center gap-2">
          <span>Popular Premier League Battles</span>
          <span className="h-px bg-cohere-hairline flex-1" />
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {POPULAR_COMPARISONS.map(({ a, b }) => {
            const pA = allPlayers.find((p) => p.name === a);
            const pB = allPlayers.find((p) => p.name === b);
            if (!pA || !pB) return null;
            return (
              <div
                key={`${a}-${b}`}
                className="product-card p-4 hover:border-cohere-coral transition-all cursor-pointer group flex flex-col justify-between"
                onClick={() => loadPreset(a, b)}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-cohere-hairline bg-white">
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
                        <div className="text-xs font-bold text-cohere-primary group-hover:text-cohere-coral transition-colors truncate">
                          {pA.name}
                        </div>
                        <div className="text-[10px] text-cohere-muted truncate flex items-center gap-1">
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

                    <span className="text-[10px] font-mono font-bold text-cohere-coral px-1.5 py-0.5 rounded bg-white border border-cohere-coral/30">
                      VS
                    </span>

                    <div className="flex items-center gap-2 min-w-0 flex-row-reverse text-right">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden shrink-0 border border-cohere-hairline bg-white">
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
                        <div className="text-xs font-bold text-cohere-primary group-hover:text-cohere-action-blue transition-colors truncate">
                          {pB.name}
                        </div>
                        <div className="text-[10px] text-cohere-muted truncate flex items-center justify-end gap-1">
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
                  <div className="space-y-1 text-[11px] bg-white p-2.5 rounded-sm border border-cohere-hairline">
                    {(["goals", "assists", "market_value_eur_m"] as const).map((k) => (
                      <div key={k} className="flex justify-between text-cohere-ink">
                        <span className="font-bold text-cohere-primary">{pA[k]}</span>
                        <span className="text-cohere-muted capitalize text-[10px] font-mono">
                          {k === "market_value_eur_m" ? "Value (€M)" : k}
                        </span>
                        <span className="font-bold text-cohere-primary">{pB[k]}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="button-pill-outline w-full mt-3 text-[11px] py-1.5 flex items-center justify-center gap-1.5 hover:bg-cohere-coral hover:text-white hover:border-cohere-coral transition-colors"
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
