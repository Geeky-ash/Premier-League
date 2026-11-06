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
        className="w-full max-w-lg mx-4 bg-pl-dark rounded-pl-lg border border-pl-border shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-pl-border bg-pl-purple/50">
          <div>
            <span className="text-[10px] font-bold text-pl-green uppercase tracking-widest">
              Roster Search
            </span>
            <h3 className="text-base font-extrabold text-white tracking-wide">
              SELECT PLAYER FOR COMPARISON
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-pl-text-muted hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Search Input */}
        <div className="px-5 pt-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-pl-cyan"
            />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search by player name or club..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-search pl-10"
            />
          </div>
        </div>

        {/* Position Filter Tabs */}
        <div className="px-5 pt-3 flex gap-2">
          {POS_FILTERS.map((pos) => (
            <button
              key={pos}
              onClick={() => setPosFilter(pos)}
              className={`px-3 py-1 text-[11px] font-bold tracking-wider rounded-full transition-all ${
                posFilter === pos
                  ? "bg-pl-cyan text-pl-purple font-extrabold"
                  : "bg-pl-purple text-pl-text-secondary hover:text-white border border-pl-border"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>

        {/* Player List */}
        <div className="mt-3 max-h-[360px] overflow-y-auto">
          {loading ? (
            <div className="py-12 text-center text-pl-text-muted text-sm">
              Loading Premier League roster...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-pl-text-muted text-sm">
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
                className="w-full flex items-center gap-3.5 px-5 py-3 hover:bg-pl-purple transition-colors border-b border-pl-border/50 group text-left"
              >
                {/* Official Player Photo with Club Badge Overlay */}
                <div className="relative w-11 h-11 shrink-0">
                  <div className="w-11 h-11 rounded-full bg-white/5 border border-pl-border overflow-hidden flex items-center justify-center">
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
                    className="absolute -bottom-1 -right-1 w-4 h-4 object-contain drop-shadow"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="text-sm font-bold text-white group-hover:text-pl-cyan transition-colors">
                    {player.name}
                  </div>
                  <div className="text-[11px] text-pl-text-muted flex items-center gap-2">
                    <span>{player.club}</span>
                    <span>•</span>
                    <span>Age {player.age}</span>
                    <span>•</span>
                    <span className="text-pl-green font-semibold">€{player.market_value_eur_m}M</span>
                  </div>
                </div>

                {/* Position Badge */}
                <span className="pos-badge">
                  {POS_MAP[player.position] || player.position}
                </span>

                <ChevronRight
                  size={15}
                  className="text-pl-text-muted group-hover:text-pl-cyan group-hover:translate-x-0.5 transition-all"
                />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
