"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Calendar,
  ChevronRight,
  TrendingUp,
  RotateCcw,
  Shield,
  Layers,
  ArrowRight,
} from "lucide-react";
import { fetchGlobalTeamDetail, GlobalTeamDetailResponse } from "@/lib/api";
import { getGlobalClubCrest } from "@/lib/logos";

const STAT_METRICS = [
  { key: "shots", label: "Shots" },
  { key: "shots_first_half", label: "Shots (First Half)" },
  { key: "shots_on_target", label: "Shots on Target" },
  { key: "blocked_shots", label: "Blocked Shots" },
  { key: "hit_woodwork", label: "Hit Woodwork" },
  { key: "tackles", label: "Tackles" },
  { key: "interceptions", label: "Interceptions" },
  { key: "dispossessed", label: "Dispossessed" },
  { key: "duels", label: "Duels" },
  { key: "fouls_committed", label: "Fouls Committed" },
  { key: "fouls_drawn", label: "Fouls Drawn" },
  { key: "passes", label: "Passes" },
  { key: "accurate_passes", label: "Accurate Passes" },
  { key: "shots_created", label: "Shots Created (Key Passes)" },
  { key: "yellow_cards", label: "Yellow Cards" },
  { key: "red_cards", label: "Red Cards" },
];

const AGAINST_METRICS = [
  { key: "shots_conceded", label: "Shots Conceded" },
  { key: "shots_conceded_fh", label: "Shots Conceded (1st Half)" },
  { key: "sot_conceded", label: "SoT Conceded" },
  { key: "fouls_drawn_against", label: "Fouls Drawn Against" },
  { key: "tackles_faced", label: "Tackles Faced" },
  { key: "woodwork_conceded", label: "Hit Woodwork Against" },
];

export default function TeamDetailPage() {
  const params = useParams();
  const slug = (params?.slug as string) || "derby-county";

  const [data, setData] = useState<GlobalTeamDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"for" | "against">("for");
  const [activeMetric, setActiveMetric] = useState("possession");

  // Filter state
  const [selectedComps, setSelectedComps] = useState<Record<string, boolean>>({
    Championship: true,
    "Carabao Cup": true,
  });
  const [venue, setVenue] = useState<"all" | "home" | "away">("all");
  const [historySize, setHistorySize] = useState("last_30");
  const [toggleTotals, setToggleTotals] = useState(false);
  const [h2hToggle, setH2hToggle] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchGlobalTeamDetail(slug)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const toggleComp = (comp: string) => {
    setSelectedComps((prev) => ({
      ...prev,
      [comp]: !prev[comp],
    }));
  };

  const resetFilters = () => {
    setSelectedComps({ Championship: true, "Carabao Cup": true });
    setVenue("all");
    setHistorySize("last_30");
    setToggleTotals(false);
    setH2hToggle(false);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-16 font-body text-cohere-ink">
      {/* ── Breadcrumb & Top Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cohere-hairline pb-4 font-mono text-xs">
        <div className="flex items-center gap-2 text-cohere-slate">
          <span>{data?.team.league || "Championship"}</span>
          <span>&gt;</span>
          <span className="font-bold text-cohere-primary">{data?.team.name || slug} Stats</span>
        </div>

        {/* Next Fixture Badge */}
        {data?.team.next_fixture && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cohere-soft-stone border border-cohere-hairline text-xs font-mono">
              <span className="text-cohere-muted text-[10px] uppercase font-bold">NEXT FIXTURE:</span>
              <div className="relative w-4 h-4 shrink-0">
                <Image
                  src={getGlobalClubCrest(data.team.next_fixture.opponent)}
                  alt={data.team.next_fixture.opponent}
                  fill
                  className="object-contain"
                  unoptimized
                />
              </div>
              <span className="font-bold text-cohere-primary">{data.team.next_fixture.opponent}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-cohere-primary text-white">
                {data.team.next_fixture.date}
              </span>
            </div>
            <Link
              href="/fixtures"
              className="button-pill-outline px-3 py-1.5 text-xs font-mono font-bold flex items-center gap-1.5"
            >
              <Calendar size={13} /> Fixtures
            </Link>
          </div>
        )}
      </div>

      {/* ── Team Header Hero ── */}
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 shrink-0 flex items-center justify-center p-1 bg-cohere-soft-stone rounded-sm border border-cohere-hairline">
          <Image
            src={getGlobalClubCrest(data?.team.name || slug)}
            alt={data?.team.name || slug}
            fill
            className="object-contain p-0.5"
            unoptimized
          />
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-medium tracking-tight text-cohere-primary">
            {data?.team.name || slug} Stats
          </h1>
          <p className="text-xs text-cohere-body-muted mt-0.5 max-w-xl">
            Comprehensive match log timeline, possession splits, and opposition conceded vectors.
          </p>
        </div>
      </div>

      {/* ── Main Layout: Metric Drawer (Left) + Table & Filters (Right) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* ── Left Navigation: Categorized Metric Drawer ── */}
        <div className="lg:col-span-3 space-y-3">
          {/* Main Mode Toggle: Team Stats vs Against Stats */}
          <div className="flex rounded-pill bg-cohere-soft-stone p-1 border border-cohere-hairline">
            <button
              type="button"
              onClick={() => setActiveTab("for")}
              className={`flex-1 py-1.5 px-3 rounded-pill text-xs font-mono font-bold transition-all ${
                activeTab === "for"
                  ? "bg-cohere-primary text-white shadow-sm"
                  : "text-cohere-slate hover:text-cohere-ink"
              }`}
            >
              TEAM STATS
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("against")}
              className={`flex-1 py-1.5 px-3 rounded-pill text-xs font-mono font-bold transition-all ${
                activeTab === "against"
                  ? "bg-cohere-primary text-white shadow-sm"
                  : "text-cohere-slate hover:text-cohere-ink"
              }`}
            >
              AGAINST STATS
            </button>
          </div>

          {/* Metrics List Drawer */}
          <div className="cohere-card-white p-2 space-y-1 max-h-[620px] overflow-y-auto">
            {(activeTab === "for" ? STAT_METRICS : AGAINST_METRICS).map((m) => {
              const isSelected = activeMetric === m.key;
              const val =
                activeTab === "for"
                  ? data?.team_stats?.[m.key]
                  : data?.against_stats?.[m.key];
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => setActiveMetric(m.key)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-sm text-left text-xs transition-colors ${
                    isSelected
                      ? "bg-cohere-soft-stone text-cohere-primary font-bold border border-cohere-hairline"
                      : "text-cohere-ink hover:bg-cohere-soft-stone/40 font-medium"
                  }`}
                >
                  <span className="font-mono">{m.label}</span>
                  {val !== undefined && (
                    <span className="text-[11px] font-mono font-bold text-cohere-coral px-1.5 py-0.5 rounded bg-white border border-cohere-hairline">
                      {val}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Right Content: Comprehensive Filter Bar & Match Timeline ── */}
        <div className="lg:col-span-9 space-y-5">
          {/* Comprehensive Filter Bar */}
          <div className="p-4 rounded-lg bg-cohere-soft-stone border border-cohere-hairline space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* COMPETITIONS */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cohere-muted mb-2">
                  Competitions
                </div>
                <div className="flex flex-wrap gap-2">
                  {(data?.competitions || ["Championship", "Carabao Cup"]).map((comp) => {
                    const active = selectedComps[comp] !== false;
                    return (
                      <button
                        key={comp}
                        type="button"
                        onClick={() => toggleComp(comp)}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-pill text-xs font-mono font-bold transition-all ${
                          active
                            ? "bg-cohere-primary text-white"
                            : "bg-white text-cohere-slate border border-cohere-hairline"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-cohere-coral" />
                        <span>{comp}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* VENUE */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cohere-muted mb-2">
                  Venue
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setVenue(venue === "home" ? "all" : "home")}
                    className={`px-3 py-1 rounded-pill text-xs font-mono font-bold transition-all ${
                      venue === "home" || venue === "all"
                        ? "bg-cohere-primary text-white"
                        : "bg-white text-cohere-slate border border-cohere-hairline"
                    }`}
                  >
                    Home
                  </button>
                  <button
                    type="button"
                    onClick={() => setVenue(venue === "away" ? "all" : "away")}
                    className={`px-3 py-1 rounded-pill text-xs font-mono font-bold transition-all ${
                      venue === "away" || venue === "all"
                        ? "bg-cohere-primary text-white"
                        : "bg-white text-cohere-slate border border-cohere-hairline"
                    }`}
                  >
                    Away
                  </button>
                </div>
              </div>

              {/* HISTORY */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cohere-muted mb-2">
                  History
                </div>
                <div className="space-y-1.5">
                  <select
                    value={historySize}
                    onChange={(e) => setHistorySize(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-sm bg-white border border-cohere-hairline text-xs text-cohere-ink font-mono font-bold outline-none cursor-pointer"
                  >
                    <option value="last_5">Last 5 games</option>
                    <option value="last_10">Last 10 games</option>
                    <option value="last_30">Last 30 games</option>
                    <option value="full">Full Season</option>
                  </select>
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="text-[10px] font-mono font-bold text-cohere-slate hover:text-cohere-coral flex items-center gap-1 transition-colors"
                  >
                    <RotateCcw size={10} /> RESET ALL FILTERS
                  </button>
                </div>
              </div>

              {/* OTHER CHECKBOXES */}
              <div>
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-cohere-muted mb-2">
                  Other
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-medium text-cohere-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={toggleTotals}
                      onChange={(e) => setToggleTotals(e.target.checked)}
                      className="rounded-xs accent-[#ff7759] cursor-pointer"
                    />
                    <span>Toggle Totals</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-medium text-cohere-ink cursor-pointer">
                    <input
                      type="checkbox"
                      checked={h2hToggle}
                      onChange={(e) => setH2hToggle(e.target.checked)}
                      className="rounded-xs accent-[#ff7759] cursor-pointer"
                    />
                    <span>H2H vs Opposition</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* ── Match History Horizontal Scrollable Log Strip ── */}
          <div className="cohere-card-white overflow-hidden p-0">
            <div className="px-4 py-3 bg-cohere-soft-stone border-b border-cohere-hairline flex items-center justify-between">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cohere-primary">
                Match History Timeline &amp; Performance Breakdown
              </span>
              <span className="text-[11px] text-cohere-coral font-mono font-bold">
                Showing {data?.match_history.length || 0} matches
              </span>
            </div>

            {loading ? (
              <div className="p-12 text-center text-cohere-muted text-xs font-mono">
                Loading match log strip...
              </div>
            ) : (
              <div className="overflow-x-auto p-4">
                <div className="flex gap-2 min-w-max pb-2">
                  {data?.match_history.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex flex-col items-center justify-between w-14 p-2 rounded-sm bg-cohere-soft-stone/40 border border-cohere-hairline hover:border-cohere-coral transition-all text-center space-y-1.5"
                    >
                      {/* Match Date */}
                      <span className="text-[10px] font-mono font-bold text-cohere-slate leading-tight">
                        {m.date}
                      </span>

                      {/* Opponent Crest */}
                      <div className="relative w-6 h-6 shrink-0 my-0.5">
                        <Image
                          src={getGlobalClubCrest(m.opponent)}
                          alt={m.opponent}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>

                      {/* Score Result Pill (Deep Green Win, Coral Loss, Slate Draw) */}
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                          m.result === "W"
                            ? "bg-cohere-deep-green text-white"
                            : m.result === "L"
                            ? "bg-cohere-coral text-white"
                            : "bg-cohere-slate text-white"
                        }`}
                      >
                        {m.score}
                      </span>

                      {/* Venue Tag */}
                      <span className="text-[9px] font-mono font-bold px-1 rounded bg-white text-cohere-slate border border-cohere-hairline">
                        {m.venue}
                      </span>

                      {/* Possession Percentage */}
                      <span className="text-[10px] font-mono font-bold text-cohere-coral pt-1 border-t border-cohere-hairline w-full">
                        {m.possession}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
