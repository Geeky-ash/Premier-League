"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search, X, User, ArrowRight, Shield } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchGlobalSearch, GlobalSearchResponse } from "@/lib/api";
import { getGlobalClubCrest, getPlayerPhoto } from "@/lib/logos";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function GlobalSearchModal({ open, onClose }: Props) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 80);
      handleSearch("lamine");
    } else {
      setQuery("");
      setResults(null);
    }
  }, [open]);

  const handleSearch = (q: string) => {
    setQuery(q);
    if (!q.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    fetchGlobalSearch(q)
      .then(setResults)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl bg-white rounded-lg border border-cohere-hairline shadow-2xl overflow-hidden animate-slide-up font-body text-cohere-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-cohere-hairline bg-cohere-soft-stone">
          <Search size={18} className="text-cohere-slate shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search players (e.g. Lamine Yamal) or teams..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-transparent text-cohere-primary text-sm font-medium outline-none placeholder:text-cohere-muted"
          />
          {query && (
            <button
              type="button"
              onClick={() => handleSearch("")}
              className="p-1 text-cohere-muted hover:text-cohere-ink transition-colors mr-1"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Results Body */}
        <div className="max-h-[460px] overflow-y-auto p-3 space-y-4">
          {/* Players Section */}
          {results && results.players.length > 0 && (
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cohere-muted px-2 py-1">
                Players
              </div>
              <div className="space-y-1 mt-1">
                {results.players.map((player) => (
                  <div
                    key={player.id}
                    onClick={() => {
                      onClose();
                      router.push(`/player/${player.id}`);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-sm hover:bg-cohere-soft-stone/50 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Player Avatar Cutout */}
                      <div className="relative w-10 h-10 rounded-full bg-cohere-soft-stone border border-cohere-hairline overflow-hidden shrink-0 flex items-center justify-center">
                        <Image
                          src={player.photo || getPlayerPhoto(player.name)}
                          alt={player.name}
                          fill
                          className="object-cover object-top"
                          unoptimized
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-cohere-primary group-hover:text-cohere-coral transition-colors">
                          {player.name}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-cohere-slate">
                          {/* Club Crest Icon */}
                          <div className="relative w-3.5 h-3.5 shrink-0">
                            <Image
                              src={getGlobalClubCrest(player.club)}
                              alt={player.club}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                          <span>{player.club}</span>
                          <span className="text-[10px] text-cohere-muted font-mono">• {player.position}</span>
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-cohere-muted group-hover:text-cohere-coral transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Teams Section */}
          {results && results.teams.length > 0 && (
            <div>
              <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-cohere-muted px-2 py-1">
                Teams
              </div>
              <div className="space-y-1 mt-1">
                {results.teams.map((team) => (
                  <div
                    key={team.slug}
                    onClick={() => {
                      onClose();
                      router.push(`/team/${team.slug}`);
                    }}
                    className="flex items-center justify-between p-2.5 rounded-sm hover:bg-cohere-soft-stone/50 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      {/* Club Crest */}
                      <div className="relative w-8 h-8 shrink-0 flex items-center justify-center">
                        <Image
                          src={team.crest || getGlobalClubCrest(team.name)}
                          alt={team.name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-cohere-primary group-hover:text-cohere-coral transition-colors">
                          {team.name}
                        </div>
                        <div className="text-xs text-cohere-slate">
                          {team.league} • {team.country}
                        </div>
                      </div>
                    </div>
                    <ArrowRight size={14} className="text-cohere-muted group-hover:text-cohere-coral transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {results && results.players.length === 0 && results.teams.length === 0 && (
            <div className="text-center py-10 text-cohere-muted text-sm font-mono">
              No matching players or clubs found for &quot;{query}&quot;
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
