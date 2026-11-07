"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  SlidersHorizontal,
  Star,
  ExternalLink,
} from "lucide-react";
import {
  fetchGlobalFixtures,
  GlobalFixturesResponse,
  GlobalCompetitionFixtures,
  GlobalFixtureMatch,
} from "@/lib/api";
import { getGlobalClubCrest, GLOBAL_LEAGUES } from "@/lib/logos";
import H2HModal from "@/components/H2HModal";

export default function GlobalFixturesPage() {
  const [selectedDateIndex, setSelectedDateIndex] = useState(2); // Default to Today
  const [fixturesData, setFixturesData] = useState<GlobalFixturesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedLeagues, setExpandedLeagues] = useState<Record<string, boolean>>({
    "premier-league": true,
    championship: true,
    "la-liga": true,
    bundesliga: true,
    "serie-a": true,
    "ligue-1": true,
    "champions-league": true,
    mls: true,
    "saudi-pro-league": true,
    eredivisie: true,
  });
  const [h2hMatch, setH2hMatch] = useState<{ home: string; away: string } | null>(null);

  // Generate 10-day date carousel: WED 04, THU 05, TODAY 06, TOMO 07, etc.
  const baseDate = new Date();
  const dateTabs = [-2, -1, 0, 1, 2, 3, 4, 5, 6, 7].map((offset, index) => {
    const d = new Date();
    d.setDate(baseDate.getDate() + offset);
    const dayNum = String(d.getDate()).padStart(2, "0");
    const weekday = d.toLocaleDateString("en-GB", { weekday: "short" }).toUpperCase();
    let label = weekday;
    if (offset === 0) label = "TODAY";
    else if (offset === 1) label = "TOMO";
    return {
      index,
      dayNum,
      label,
      isoDate: d.toISOString().split("T")[0],
    };
  });

  useEffect(() => {
    const activeTab = dateTabs[selectedDateIndex];
    if (!activeTab) return;
    setLoading(true);
    fetchGlobalFixtures(activeTab.isoDate)
      .then(setFixturesData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [selectedDateIndex]);

  const toggleLeague = (slug: string) => {
    setExpandedLeagues((prev) => ({
      ...prev,
      [slug]: !prev[slug],
    }));
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 font-body">
      {/* ── Date Navigation Carousel Ribbon ── */}
      <div className="flex items-center justify-between gap-2 border-b border-cohere-hairline pb-4">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          {dateTabs.map((tab) => {
            const isSelected = selectedDateIndex === tab.index;
            return (
              <button
                key={tab.index}
                type="button"
                onClick={() => setSelectedDateIndex(tab.index)}
                className={`flex flex-col items-center justify-center min-w-[76px] px-3.5 py-2.5 rounded-sm text-center transition-all ${
                  isSelected
                    ? "bg-cohere-primary text-white shadow-sm"
                    : "bg-white text-cohere-body-muted border border-cohere-hairline hover:border-cohere-primary hover:text-cohere-primary"
                }`}
              >
                <span
                  className={`font-mono text-[10px] uppercase tracking-wider ${
                    isSelected ? "text-cohere-coral" : "text-cohere-muted"
                  }`}
                >
                  {tab.label}
                </span>
                <span className="font-display text-base font-normal">{tab.dayNum}</span>
              </button>
            );
          })}
        </div>

        {/* Filter Options */}
        <button
          type="button"
          className="p-2.5 rounded-sm bg-white border border-cohere-hairline text-cohere-body-muted hover:text-cohere-primary hover:border-cohere-primary transition-colors shrink-0"
          title="Filter Fixture Options"
        >
          <SlidersHorizontal size={16} />
        </button>
      </div>

      {/* ── Main 2-Column Responsive Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* ── Left / Center Column: Competition Accordion ── */}
        <div className="lg:col-span-8 space-y-4">
          {loading ? (
            <div className="flex items-center justify-center p-12 text-cohere-muted text-sm bg-cohere-soft-stone rounded-lg border border-cohere-card-border">
              <Clock size={16} className="animate-spin text-cohere-coral mr-2" /> Loading matchday fixtures...
            </div>
          ) : fixturesData?.competitions && fixturesData.competitions.length > 0 ? (
            fixturesData.competitions.map((comp: GlobalCompetitionFixtures) => {
              const isExpanded = expandedLeagues[comp.league_slug] !== false;
              return (
                <div
                  key={comp.league_slug}
                  className="rounded-lg bg-white border border-cohere-hairline overflow-hidden shadow-sm"
                >
                  {/* Accordion Header */}
                  <div
                    onClick={() => toggleLeague(comp.league_slug)}
                    className="flex items-center justify-between px-5 py-3.5 bg-cohere-soft-stone cursor-pointer hover:bg-[#e7e5de] transition-colors border-b border-cohere-hairline"
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative w-5 h-5 shrink-0 flex items-center justify-center">
                        <Image
                          src={comp.crest}
                          alt={comp.league_name}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                      <Link
                        href={`/league/${comp.league_slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-display text-sm font-normal tracking-tight text-cohere-primary hover:text-cohere-action-blue transition-colors uppercase"
                      >
                        {comp.league_name}
                      </Link>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded-xs bg-white border border-cohere-hairline text-cohere-muted">
                        {comp.country_tag}
                      </span>
                    </div>

                    <button
                      type="button"
                      className="text-cohere-muted hover:text-cohere-primary transition-colors"
                    >
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>

                  {/* Match Rows */}
                  {isExpanded && (
                    <div className="divide-y divide-cohere-hairline">
                      {comp.matches.map((match: GlobalFixtureMatch) => (
                        <div
                          key={match.id}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 hover:bg-cohere-soft-stone/40 transition-colors gap-4"
                        >
                          {/* Teams & Crests */}
                          <div className="space-y-2 min-w-[220px]">
                            <div className="flex items-center gap-3">
                              <div className="relative w-5 h-5 shrink-0">
                                <Image
                                  src={getGlobalClubCrest(match.home_team)}
                                  alt={match.home_team}
                                  fill
                                  className="object-contain"
                                  unoptimized
                                />
                              </div>
                              <span className="text-sm font-medium text-cohere-primary hover:text-cohere-action-blue transition-colors cursor-pointer">
                                {match.home_team}
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="relative w-5 h-5 shrink-0">
                                <Image
                                  src={getGlobalClubCrest(match.away_team)}
                                  alt={match.away_team}
                                  fill
                                  className="object-contain"
                                  unoptimized
                                />
                              </div>
                              <span className="text-sm font-medium text-cohere-primary hover:text-cohere-action-blue transition-colors cursor-pointer">
                                {match.away_team}
                              </span>
                            </div>
                          </div>

                          {/* Controls & Referee Tag */}
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                            {/* Lineups Button */}
                            <button
                              type="button"
                              className="chip-coral flex items-center gap-1 uppercase"
                            >
                              <span>{match.lineups_status}</span>
                              <ExternalLink size={10} />
                            </button>

                            {/* View Fixture CTA */}
                            <button
                              type="button"
                              onClick={() => setH2hMatch({ home: match.home_team, away: match.away_team })}
                              className="px-3.5 py-1.5 rounded-sm bg-cohere-primary hover:bg-black text-xs font-medium text-white transition-colors"
                            >
                              View Fixture &gt;
                            </button>

                            {/* Referee Pill */}
                            {match.referee_name && (
                              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm bg-white border border-cohere-hairline text-xs">
                                <span className="font-medium text-cohere-body-muted">{match.referee_name}</span>
                                <span className="px-1.5 py-0.2 rounded-xs bg-[#fef3c7] text-[#92400e] font-mono text-[10px] font-bold">
                                  🟨 {match.referee_yellows.toFixed(2)}
                                </span>
                              </div>
                            )}

                            {/* Kickoff Clock */}
                            <span className="font-mono text-xs text-cohere-muted pl-1">
                              {match.kickoff}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-cohere-muted bg-cohere-soft-stone rounded-lg border border-cohere-card-border">
              No fixtures scheduled for this date.
            </div>
          )}
        </div>

        {/* ── Right Sidebar: Popular Leagues (Cohere Soft Stone) ── */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex items-center justify-between pb-1">
            <h3 className="font-display text-sm font-normal tracking-tight text-cohere-primary uppercase">
              Popular Leagues
            </h3>
            <button
              type="button"
              className="text-xs font-medium text-cohere-action-blue hover:underline flex items-center gap-1"
            >
              <Star size={11} /> Add Favourites
            </button>
          </div>

          <div className="space-y-4">
            {GLOBAL_LEAGUES.slice(0, 5).map((league) => (
              <div
                key={league.slug}
                className="product-card p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="relative w-7 h-7 shrink-0 flex items-center justify-center">
                      <Image
                        src={league.crest}
                        alt={league.name}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <div>
                      <Link
                        href={`/league/${league.slug}`}
                        className="font-display text-sm font-normal text-cohere-primary hover:text-cohere-action-blue transition-colors block"
                      >
                        {league.name}
                      </Link>
                      <span className="font-mono text-[10px] text-cohere-muted">{league.season}</span>
                    </div>
                  </div>

                  <Link
                    href={`/league/${league.slug}`}
                    className="w-8 h-8 rounded-full bg-white border border-cohere-hairline hover:bg-cohere-primary hover:text-white flex items-center justify-center text-cohere-primary transition-colors"
                  >
                    <ArrowRight size={13} />
                  </Link>
                </div>

                {/* Category Shortcut Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Goalscorers", "Shots", "SoT", "Tackles", "Fouls Committed", "Yellows"].map(
                    (cat) => (
                      <Link
                        key={cat}
                        href={`/league/${league.slug}?stat=${encodeURIComponent(cat)}`}
                        className="px-2.5 py-0.5 rounded-full bg-white hover:border-cohere-primary border border-cohere-hairline font-mono text-[10px] text-cohere-body-muted hover:text-cohere-primary transition-colors"
                      >
                        {cat}
                      </Link>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* H2H Modal */}
      {h2hMatch && (
        <H2HModal
          homeTeam={h2hMatch.home}
          awayTeam={h2hMatch.away}
          open={!!h2hMatch}
          onClose={() => setH2hMatch(null)}
        />
      )}
    </div>
  );
}
