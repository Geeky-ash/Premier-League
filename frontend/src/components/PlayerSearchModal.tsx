"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Search, X, User, ChevronRight, AlertCircle } from "lucide-react";
import { fetchPlayers, PlayerRecord } from "@/lib/api";

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

  const getClubColor = useCallback((club: string) => {
    const map: Record<string, string> = {
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
    return map[club] || "#38003c";
  }, []);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="w-full max-w-lg mx-4 bg-pl-dark rounded-pl-lg border border-pl-border overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-pl-border">
          <h3 className="text-base font-bold text-white tracking-wide">
            SELECT PLAYER
          </h3>
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
              className="absolute left-3 top-1/2 -translate-y-1/2 text-pl-text-muted"
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
                  ? "bg-pl-cyan text-pl-purple"
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
              Loading players...
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-pl-text-muted text-sm">
              No players found
            </div>
          ) : (
            filtered.map((player) => (
              <button
                key={player.player_id}
                onClick={() => {
                  onSelect(player);
                  onClose();
                }}
                className="w-full flex items-center gap-3 px-5 py-3 hover:bg-pl-purple transition-colors border-b border-pl-border group"
              >
                {/* Avatar */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: getClubColor(player.club) }}
                >
                  <User size={18} className="text-white/80" />
                </div>
                {/* Info */}
                <div className="flex-1 text-left">
                  <div className="text-sm font-semibold text-white group-hover:text-pl-cyan transition-colors">
                    {player.name}
                  </div>
                  <div className="text-[11px] text-pl-text-muted">
                    {player.club} · Age {player.age} · €{player.market_value_eur_m}M
                  </div>
                </div>
                {/* Position Badge */}
                <span className="pos-badge">
                  {POS_MAP[player.position] || player.position}
                </span>
                <ChevronRight
                  size={14}
                  className="text-pl-text-muted group-hover:text-pl-cyan transition-colors"
                />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
