"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Trophy,
  Calendar,
  ChevronRight,
  TrendingUp,
  Clock,
  ExternalLink,
  Shield,
  ArrowRight,
} from "lucide-react";
import { fetchGlobalLeagueOverview, LeagueOverviewResponse } from "@/lib/api";
import { getGlobalClubCrest, getLeagueCrest } from "@/lib/logos";
import H2HModal from "@/components/H2HModal";

export default function LeagueOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "championship";

  const [data, setData] = useState<LeagueOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Goals");
  const [h2hMatch, setH2hMatch] = useState<{ home: string; away: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchGlobalLeagueOverview(slug)
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [slug]);

  const activeLeaders = data?.stat_categories.find((c) => c.name === selectedCategory)?.leaders || [];

  return (
    <div className="space-y-6 animate-fade-in pb-16 font-body text-cohere-ink">
      {/* ── League Title Header ── */}
      <div className="flex items-center justify-between border-b border-cohere-hairline pb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 shrink-0 flex items-center justify-center p-1 rounded-sm bg-cohere-soft-stone border border-cohere-hairline">
            <Image
              src={getLeagueCrest(slug)}
              alt={data?.league.name || slug}
              fill
              className="object-contain p-0.5"
              unoptimized
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-medium text-cohere-primary tracking-tight flex items-center gap-2">
              <span>{data?.league.name || slug.replace("-", " ").toUpperCase()} Stats</span>
            </h1>
            <p className="text-xs text-cohere-body-muted font-mono mt-0.5">
              {data?.league.country} • {data?.league.season || "2026/2027"} Matchday Overview & Intelligence
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-cohere-muted bg-cohere-soft-stone/30 rounded-lg border border-cohere-hairline flex items-center justify-center font-mono text-xs">
          <Clock size={16} className="animate-spin text-cohere-coral mr-2" /> Loading {slug} statistics...
        </div>
      ) : (
        /* ── 3-Column Structured Layout ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ── Column 1 (Left): Interactive League Standings Table ── */}
          <div className="lg:col-span-5 cohere-card-white overflow-hidden p-0">
            <div className="p-3.5 bg-cohere-soft-stone border-b border-cohere-hairline flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cohere-primary uppercase tracking-wider">
                League Standings
              </span>
              <span className="text-[10px] text-cohere-slate font-mono font-bold">2026/2027</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-cohere-hairline text-cohere-muted uppercase text-[10px] font-mono tracking-wider bg-cohere-soft-stone/40">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-2">Club</th>
                    <th className="py-2.5 px-2 text-center">MP</th>
                    <th className="py-2.5 px-2 text-center">W</th>
                    <th className="py-2.5 px-2 text-center">D</th>
                    <th className="py-2.5 px-2 text-center">L</th>
                    <th className="py-2.5 px-2 text-center font-bold text-cohere-primary">PTS</th>
                    <th className="py-2.5 px-2 text-center">Form</th>
                    <th className="py-2.5 px-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cohere-hairline font-medium">
                  {data?.standings.map((row) => (
                    <tr
                      key={row.rank}
                      onClick={() => router.push(`/team/${row.slug}`)}
                      className="hover:bg-cohere-soft-stone/30 transition-colors cursor-pointer group"
                    >
                      <td className="py-2.5 px-3 text-cohere-muted font-mono font-bold text-[11px]">
                        {row.rank}
                      </td>
                      <td className="py-2.5 px-2">
                        <div className="flex items-center gap-2 max-w-[130px] truncate">
                          <div className="relative w-4 h-4 shrink-0">
                            <Image
                              src={getGlobalClubCrest(row.club)}
                              alt={row.club}
                              fill
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                          <span className="text-cohere-primary group-hover:text-cohere-coral transition-colors font-bold truncate">
                            {row.club}
                          </span>
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-center font-mono text-cohere-slate">{row.mp}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-cohere-slate">{row.w}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-cohere-slate">{row.d}</td>
                      <td className="py-2.5 px-2 text-center font-mono text-cohere-slate">{row.l}</td>
                      <td className="py-2.5 px-2 text-center font-mono font-bold text-cohere-primary bg-cohere-soft-stone/30">
                        {row.pts}
                      </td>
                      <td className="py-2.5 px-2 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {row.form.map((res, i) => (
                            <span
                              key={i}
                              className={`w-2 h-2 rounded-full ${
                                res === "W"
                                  ? "bg-cohere-deep-green"
                                  : res === "L"
                                  ? "bg-cohere-coral"
                                  : "bg-cohere-slate"
                              }`}
                              title={`Form: ${res}`}
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-2.5 px-2 text-right text-cohere-muted group-hover:text-cohere-coral">
                        <ChevronRight size={13} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Column 2 (Center): Matchday Fixtures list grouped by date ── */}
          <div className="lg:col-span-4 space-y-4">
            {data?.fixtures.map((group, gIdx) => (
              <div
                key={gIdx}
                className="cohere-card-white overflow-hidden p-0"
              >
                {/* Date Group Heading */}
                <div className="px-4 py-2.5 bg-cohere-soft-stone border-b border-cohere-hairline text-xs font-mono font-bold tracking-wider text-cohere-slate uppercase">
                  {group.date_heading}
                </div>

                <div className="divide-y divide-cohere-hairline">
                  {group.matches.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3.5 hover:bg-cohere-soft-stone/20 transition-colors space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <div className="relative w-4 h-4 shrink-0">
                              <Image
                                src={getGlobalClubCrest(m.home_team)}
                                alt={m.home_team}
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                            <span className="text-xs font-bold text-cohere-primary">{m.home_team}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="relative w-4 h-4 shrink-0">
                              <Image
                                src={getGlobalClubCrest(m.away_team)}
                                alt={m.away_team}
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                            <span className="text-xs font-bold text-cohere-primary">{m.away_team}</span>
                          </div>
                        </div>

                        {/* H2H Button */}
                        <button
                          type="button"
                          onClick={() => setH2hMatch({ home: m.home_team, away: m.away_team })}
                          className="button-pill-outline px-2.5 py-1 text-[11px] font-mono font-bold"
                        >
                          H2H
                        </button>
                      </div>

                      {/* Referee & Kickoff Bar */}
                      <div className="flex items-center justify-between text-[11px] pt-1 text-cohere-slate border-t border-cohere-hairline font-mono">
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-cohere-ink">{m.referee}</span>
                          <span className="px-1 rounded bg-cohere-soft-stone text-cohere-primary font-bold text-[9px] border border-cohere-hairline">
                            🟨 {m.yellow_avg}
                          </span>
                          <span className="text-[10px] text-cohere-muted">{m.red_avg}</span>
                        </div>
                        <span className="font-bold text-cohere-primary">{m.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Column 3 (Right): League Stat Leaderboard Categories ── */}
          <div className="lg:col-span-3 cohere-card-white overflow-hidden p-0">
            <div className="p-3.5 bg-cohere-soft-stone border-b border-cohere-hairline">
              <span className="text-xs font-mono font-bold text-cohere-primary uppercase tracking-wider block">
                {slug.replace("-", " ").toUpperCase()} PLAYER STATS
              </span>
            </div>

            <div className="p-2 divide-y divide-cohere-hairline max-h-[600px] overflow-y-auto">
              {data?.stat_categories.map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <div key={cat.name} className="py-1">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`w-full flex items-center justify-between p-2 rounded-sm text-left transition-colors ${
                        isSelected
                          ? "bg-cohere-soft-stone text-cohere-primary font-bold"
                          : "text-cohere-ink hover:bg-cohere-soft-stone/40 font-medium text-xs"
                      }`}
                    >
                      <span className="text-xs font-mono">{cat.name}</span>
                      {cat.leaders.length > 0 && (
                        <span className="text-[10px] font-mono font-bold text-cohere-coral px-1.5 py-0.5 rounded bg-white border border-cohere-hairline">
                          {cat.leaders[0].val}
                        </span>
                      )}
                    </button>

                    {/* Preview Leader */}
                    {isSelected && cat.leaders.length > 0 && (
                      <div className="px-3 py-2 my-1 rounded-sm bg-cohere-soft-stone/40 border border-cohere-hairline text-[11px] space-y-1 animate-slide-up">
                        {cat.leaders.map((leader, i) => (
                          <div key={i} className="flex items-center justify-between text-xs">
                            <span className="font-medium text-cohere-primary">
                              {i + 1}. {leader.player} ({leader.club})
                            </span>
                            <span className="font-mono font-bold text-cohere-coral">{leader.val}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

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
