"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, ChevronRight } from "lucide-react";
import { fetchPlayers, PlayerRecord } from "@/lib/api";
import { getClubCrest, getPlayerPhoto } from "@/lib/logos";

const POS_FILTERS = ["ALL", "FWD", "MID", "DEF", "GK"] as const;
type PosFilter = (typeof POS_FILTERS)[number];

const POS_MAP: Record<string, PosFilter> = {
  FW: "FWD",
  MF: "MID",
  DF: "DEF",
  GK: "GK",
};

interface Props {
  open: boolean;
  onClose: () => void;
  onSelect: (player: PlayerRecord) => void;
  excludeIds?: number[];
}

export default function PlayerSearchModal({
  open,
  onClose,
  onSelect,
  excludeIds = [],
}: Props) {
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [query, setQuery] = useState("");
  const [posFilter, setPosFilter] = useState<PosFilter>("ALL");
  const [loading, setLoading] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setLoading(true);
      fetchPlayers()
        .then(setPlayers)
        .catch(() => setPlayers([]))
        .finally(() => setLoading(false));
      setTimeout(() => inputRef.current?.focus(), 150);
    } else {
      setQuery("");
      setPosFilter("ALL");
    }
  }, [open]);

  const filtered = players.filter((p) => {
    if (excludeIds.includes(p.player_id)) return false;
    const matchesQuery =
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.club.toLowerCase().includes(query.toLowerCase());
    const mappedPos = POS_MAP[p.position] || p.position;
    const matchesPos = posFilter === "ALL" || mappedPos === posFilter;
    return matchesQuery && matchesPos;
  });

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="w-full max-w-lg mx-4 bg-white rounded-lg border border-cohere-hairline shadow-2xl overflow-hidden animate-slide-up font-body text-cohere-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cohere-hairline bg-cohere-soft-stone">
          <div>
            <span className="text-[10px] font-mono font-bold text-cohere-coral uppercase tracking-widest">
              Roster Search
            </span>
            <h3 className="text-sm font-display font-medium text-cohere-primary tracking-wide">
              SELECT PLAYER FOR COMPARISON
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-cohere-muted hover:text-cohere-ink transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-5 pt-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cohere-slate"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by player name or club..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="cohere-input pl-10 w-full"
            />
          </div>
        </div>

        {/* Position Filter Tabs */}
        <div className="px-5 pt-3 flex gap-2">
          {POS_FILTERS.map((pos) => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`px-3 py-1 text-[11px] font-mono font-bold tracking-wider rounded-pill transition-all ${
                posFilter === pos
                  ? "bg-cohere-primary text-white"
                  : "bg-cohere-soft-stone text-cohere-slate hover:text-cohere-ink border border-cohere-hairline"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Player List */}
        <div className="mt-3 max-h-[360px] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-cohere-muted text-xs font-mono">
              Loading Premier League roster...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-cohere-muted text-xs font-mono">
              No players found matching your search.
            </div>
          ) : (
            filtered.map((player) => (
              <button
                key={player.player_id}
                onClick={() => {
                  onSelect(player);
                  onClose();
                }}
                className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-cohere-soft-stone/40 transition-colors border-b border-cohere-hairline group text-left"
              >
                {/* Official Player Photo with Club Badge Overlay */}
                <div className="relative w-11 h-11 shrink-0">
                  <div className="w-11 h-11 rounded-full bg-cohere-soft-stone border border-cohere-hairline overflow-hidden flex items-center justify-center">
                    <img
                      src={getPlayerPhoto(player.name)}
                      alt={player.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = getClubCrest(player.club, 50);
                      }}
                    />
                  </div>
                  <img
                    src={getClubCrest(player.club, 50)}
                    alt={player.club}
                    className="absolute -bottom-1 -right-1 w-4 h-4 object-contain"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="text-sm font-bold text-cohere-primary group-hover:text-cohere-coral transition-colors">
                    {player.name}
                  </div>
                  <div className="text-[11px] text-cohere-slate flex items-center gap-2 font-mono">
                    <span>{player.club}</span>
                    <span>•</span>
                    <span>Age {player.age}</span>
                    <span>•</span>
                    <span className="text-cohere-coral font-bold">€{player.market_value_eur_m}M</span>
                  </div>
                </div>

                {/* Position Badge */}
                <span className="chip-coral text-[10px] font-mono">
                  {POS_MAP[player.position] || player.position}
                </span>

                <ChevronRight
                  size={15}
                  className="text-cohere-muted group-hover:text-cohere-coral group-hover:translate-x-0.5 transition-all"
                />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
