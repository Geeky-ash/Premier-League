"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, User, ArrowRight, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchPlayers, fetchClubs, PlayerRecord } from "@/lib/api";
import { getClubCrest, getPlayerPhoto } from "@/lib/logos";

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectPlayer?: (player: PlayerRecord) => void;
}

export default function GlobalSearchModal({ open, onClose, onSelectPlayer }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [clubs, setClubs] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      fetchPlayers().then(setPlayers).catch(() => {});
      fetchClubs().then(setClubs).catch(() => {});
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [open]);

  if (!open) return null;

  const filteredPlayers = players
    .filter(
      (p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.club.toLowerCase().includes(query.toLowerCase())
    )
    .slice(0, 6);

  const filteredClubs = clubs
    .filter((c) => c.toLowerCase().includes(query.toLowerCase()))
    .slice(0, 4);

  const quickTools = [
    { title: "Transfer Value Predictor", path: "/transfer-predictor", tag: "OLS Model" },
    { title: "Match Outcome Predictor", path: "/match-predictor", tag: "XGBoost" },
    { title: "Player Scouting Studio", path: "/scouting-studio", tag: "K-Means" },
    { title: "1v1 Player Comparison", path: "/comparison", tag: "Stats Centre" },
  ].filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="w-full max-w-xl mx-4 bg-pl-dark rounded-pl-lg border border-pl-border shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-pl-border bg-pl-purple/40">
          <Search size={18} className="text-pl-cyan shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search players, clubs, or analytics modules..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-white text-sm outline-none placeholder-pl-text-muted"
          />
          <button
            onClick={onClose}
            className="p-1 text-pl-text-muted hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-[420px] overflow-y-auto p-4 space-y-4">
          {/* Quick Analytics Modules */}
          {quickTools.length > 0 && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-pl-text-muted mb-2">
                Predictive AI Modules
              </div>
              <div className="grid grid-cols-2 gap-2">
                {quickTools.map((t) => (
                  <button
                    key={t.path}
                    onClick={() => {
                      router.push(t.path);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-pl bg-pl-purple border border-pl-border hover:border-pl-cyan transition-colors text-left"
                  >
                    <div>
                      <div className="text-xs font-semibold text-white">{t.title}</div>
                      <div className="text-[9px] text-pl-green font-bold">{t.tag}</div>
                    </div>
                    <ArrowRight size={12} className="text-pl-text-muted" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clubs */}
          {filteredClubs.length > 0 && query && (
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-pl-text-muted mb-2">
                Clubs
              </div>
              <div className="grid grid-cols-2 gap-2">
                {filteredClubs.map((club) => (
                  <button
                    key={club}
                    onClick={() => {
                      router.push(`/match-predictor`);
                      onClose();
                    }}
                    className="flex items-center gap-2.5 p-2 rounded-pl bg-pl-purple border border-pl-border hover:border-pl-cyan transition-colors"
                  >
                    <img
                      src={getClubCrest(club, 50)}
                      alt={club}
                      className="w-5 h-5 object-contain"
                    />
                    <span className="text-xs font-medium text-white">{club}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Players */}
          <div>
            <div className="text-[10px] font-bold uppercase tracking-wider text-pl-text-muted mb-2">
              Players ({filteredPlayers.length})
            </div>
            {filteredPlayers.length === 0 ? (
              <div className="py-6 text-center text-xs text-pl-text-muted">
                No players matching &quot;{query}&quot;
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredPlayers.map((player) => (
                  <button
                    key={player.player_id}
                    onClick={() => {
                      if (onSelectPlayer) {
                        onSelectPlayer(player);
                      } else {
                        router.push(`/comparison`);
                      }
                      onClose();
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-pl hover:bg-pl-purple transition-colors border border-transparent hover:border-pl-border group"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={getClubCrest(player.club, 50)}
                        alt={player.club}
                        className="w-6 h-6 object-contain"
                      />
                      <div className="text-left">
                        <div className="text-xs font-bold text-white group-hover:text-pl-cyan transition-colors">
                          {player.name}
                        </div>
                        <div className="text-[10px] text-pl-text-muted">
                          {player.club} · {player.position} · €{player.market_value_eur_m}M
                        </div>
                      </div>
                    </div>
                    <span className="pos-badge">{player.position}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
