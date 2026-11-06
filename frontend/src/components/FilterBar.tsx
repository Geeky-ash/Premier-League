"use client";

import React, { useState } from "react";
import { SlidersHorizontal, RotateCcw, Clock, ShieldCheck, MapPin } from "lucide-react";

export interface FilterState {
  sample_size: "last_5" | "last_10" | "last_20" | "season";
  min_minutes: number;
  started_only: boolean;
  venue: "all" | "home" | "away";
  competition: "PL" | "all";
}

interface FilterBarProps {
  initialFilters?: Partial<FilterState>;
  onChange: (filters: FilterState) => void;
  className?: string;
  showVenueToggle?: boolean;
}

export default function FilterBar({
  initialFilters,
  onChange,
  className = "",
  showVenueToggle = true,
}: FilterBarProps) {
  const [filters, setFilters] = useState<FilterState>({
    sample_size: initialFilters?.sample_size || "season",
    min_minutes: initialFilters?.min_minutes !== undefined ? initialFilters.min_minutes : 1,
    started_only: initialFilters?.started_only || false,
    venue: initialFilters?.venue || "all",
    competition: initialFilters?.competition || "PL",
  });

  const update = (partial: Partial<FilterState>) => {
    const next = { ...filters, ...partial };
    setFilters(next);
    onChange(next);
  };

  const resetFilters = () => {
    const defaultState: FilterState = {
      sample_size: "season",
      min_minutes: 1,
      started_only: false,
      venue: "all",
      competition: "PL",
    };
    setFilters(defaultState);
    onChange(defaultState);
  };

  return (
    <div className={`p-4 bg-slate-900/80 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl space-y-4 ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
          <SlidersHorizontal size={14} className="text-pl-green" />
          <span>Advanced Statistical Filter Engine</span>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-[11px] font-semibold text-pl-text-muted hover:text-white transition-colors"
        >
          <RotateCcw size={12} />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sample Size */}
        <div>
          <label className="text-[11px] font-bold text-pl-text-secondary uppercase tracking-wider block mb-1.5">
            Sample Horizon
          </label>
          <div className="grid grid-cols-4 gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/5">
            {(
              [
                { id: "last_5", label: "L5" },
                { id: "last_10", label: "L10" },
                { id: "last_20", label: "L20" },
                { id: "season", label: "Full" },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => update({ sample_size: s.id })}
                className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filters.sample_size === s.id
                    ? "bg-pl-green text-slate-950 shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Minutes Threshold */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-[11px] font-bold text-pl-text-secondary uppercase tracking-wider flex items-center gap-1">
              <Clock size={11} className="text-pl-cyan" />
              <span>Minutes Threshold</span>
            </label>
            <span className="text-xs font-extrabold text-pl-cyan">
              {filters.min_minutes}+ mins
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 45, 60].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update({ min_minutes: m })}
                className={`flex-1 py-1 text-[11px] font-semibold rounded-lg border transition-all ${
                  filters.min_minutes === m
                    ? "bg-pl-cyan/20 border-pl-cyan text-white"
                    : "bg-slate-950/40 border-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Starting XI Filter */}
        <div>
          <label className="text-[11px] font-bold text-pl-text-secondary uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <ShieldCheck size={12} className="text-pl-magenta" />
            <span>Lineup Status</span>
          </label>
          <div className="grid grid-cols-2 gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/5">
            <button
              type="button"
              onClick={() => update({ started_only: false })}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                !filters.started_only
                  ? "bg-white/15 text-white"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              All Matches
            </button>
            <button
              type="button"
              onClick={() => update({ started_only: true })}
              className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                filters.started_only
                  ? "bg-pl-magenta text-white shadow-md shadow-pl-magenta/20"
                  : "text-slate-400 hover:text-white hover:bg-white/5"
              }`}
            >
              Started Only
            </button>
          </div>
        </div>

        {/* Venue Filter */}
        {showVenueToggle && (
          <div>
            <label className="text-[11px] font-bold text-pl-text-secondary uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <MapPin size={11} className="text-pl-cyan" />
              <span>Venue Split</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-slate-950/60 p-1 rounded-xl border border-white/5">
              {(
                [
                  { id: "all", label: "All" },
                  { id: "home", label: "Home" },
                  { id: "away", label: "Away" },
                ] as const
              ).map((v) => (
                <button
                  key={v.id}
                  type="button"
                  onClick={() => update({ venue: v.id })}
                  className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                    filters.venue === v.id
                      ? "bg-pl-purple border border-pl-cyan/40 text-white"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
