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
    <div className={`p-4 product-card space-y-4 font-body text-cohere-ink ${className}`}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-cohere-hairline">
        <div className="flex items-center gap-2 text-xs font-mono font-bold text-cohere-primary uppercase tracking-wider">
          <SlidersHorizontal size={14} className="text-cohere-coral" />
          <span>Advanced Statistical Filter Engine</span>
        </div>
        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-cohere-slate hover:text-cohere-coral transition-colors"
        >
          <RotateCcw size={12} />
          <span>Reset Filters</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sample Size */}
        <div>
          <label className="text-[11px] font-mono font-bold text-cohere-muted uppercase tracking-wider block mb-1.5">
            Sample Horizon
          </label>
          <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded-pill border border-cohere-hairline">
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
                className={`py-1.5 text-xs font-mono font-bold rounded-pill transition-all ${
                  filters.sample_size === s.id
                    ? "bg-cohere-primary text-white shadow-sm"
                    : "text-cohere-slate hover:text-cohere-ink"
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
            <label className="text-[11px] font-mono font-bold text-cohere-muted uppercase tracking-wider flex items-center gap-1">
              <Clock size={11} className="text-cohere-coral" />
              <span>Minutes Threshold</span>
            </label>
            <span className="text-xs font-mono font-bold text-cohere-coral">
              {filters.min_minutes}+ mins
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 45, 60].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update({ min_minutes: m })}
                className={`flex-1 py-1 text-[11px] font-mono font-bold rounded-sm border transition-all ${
                  filters.min_minutes === m
                    ? "bg-cohere-primary text-white border-cohere-primary"
                    : "bg-white border-cohere-hairline text-cohere-slate hover:text-cohere-ink"
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Starting XI Filter */}
        <div>
          <label className="text-[11px] font-mono font-bold text-cohere-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1">
            <ShieldCheck size={12} className="text-cohere-action-blue" />
            <span>Lineup Status</span>
          </label>
          <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-pill border border-cohere-hairline">
            <button
              type="button"
              onClick={() => update({ started_only: false })}
              className={`py-1.5 text-xs font-mono font-bold rounded-pill transition-all ${
                !filters.started_only
                  ? "bg-cohere-primary text-white shadow-sm"
                  : "text-cohere-slate hover:text-cohere-ink"
              }`}
            >
              All Matches
            </button>
            <button
              type="button"
              onClick={() => update({ started_only: true })}
              className={`py-1.5 text-xs font-mono font-bold rounded-pill transition-all ${
                filters.started_only
                  ? "bg-cohere-primary text-white shadow-sm"
                  : "text-cohere-slate hover:text-cohere-ink"
              }`}
            >
              Started Only
            </button>
          </div>
        </div>

        {/* Venue Filter */}
        {showVenueToggle && (
          <div>
            <label className="text-[11px] font-mono font-bold text-cohere-muted uppercase tracking-wider block mb-1.5 flex items-center gap-1">
              <MapPin size={11} className="text-cohere-coral" />
              <span>Venue Split</span>
            </label>
            <div className="grid grid-cols-3 gap-1 bg-white p-1 rounded-pill border border-cohere-hairline">
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
                  className={`py-1.5 text-xs font-mono font-bold rounded-pill transition-all ${
                    filters.venue === v.id
                      ? "bg-cohere-primary text-white shadow-sm"
                      : "text-cohere-slate hover:text-cohere-ink"
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
