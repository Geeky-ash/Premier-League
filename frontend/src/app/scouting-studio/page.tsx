"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { scoutPlayerTwin, fetchPlayers, PlayerRecord, ScoutTwinResponse } from "@/lib/api";
import { getClubCrest, getPlayerPhoto } from "@/lib/logos";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import {
  Users,
  Search,
  Target,
  Compass,
  Award,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import PlayerDetailDrawer from "@/components/PlayerDetailDrawer";

const CLUSTER_PALETTE: Record<number, string> = {
  0: "#003c33",
  1: "#1863dc",
  2: "#ff7759",
  3: "#75758a",
};

const FEATURED_SCOUT_STARS = [
  "Bukayo Saka",
  "Erling Haaland",
  "Cole Palmer",
  "Declan Rice",
  "Mohamed Salah",
  "William Saliba",
];

export default function ScoutingStudioPage() {
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState("Bukayo Saka");
  const [searchQuery, setSearchQuery] = useState("");
  const [scoutData, setScoutData] = useState<ScoutTwinResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerPlayer, setDrawerPlayer] = useState<PlayerRecord | null>(null);

  useEffect(() => {
    fetchPlayers()
      .then((data) => {
        setPlayers(data);
      })
      .catch(() => {});
  }, []);

  const triggerScout = async (name: string) => {
    if (!name) return;
    setLoading(true);
    try {
      setScoutData(await scoutPlayerTwin(name));
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    triggerScout(selectedPlayer);
  }, [selectedPlayer]);

  const filteredPlayers = players.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.club.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const clusterPoints = (scoutData?.all_cluster_points || []).map((pt) => ({
    x: pt.pca_x,
    y: pt.pca_y,
    name: pt.name,
    club: pt.club,
    cluster: pt.cluster_id,
    archetype: pt.cluster_archetype,
    val: pt.market_value,
  }));

  const targetPoint = scoutData
    ? [
        {
          x: scoutData.pca_coords.x,
          y: scoutData.pca_coords.y,
          name: scoutData.target_player,
        },
      ]
    : [];

  const handleScatterClick = (e: any) => {
    if (e && e.name) {
      const found = players.find((p) => p.name === e.name);
      if (found) {
        setDrawerPlayer(found);
      }
    }
  };

  const currentTargetRecord = players.find((p) => p.name === selectedPlayer);

  return (
    <div className="space-y-10 animate-fade-in font-body">
      {/* ── Header ── */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-cohere-coral">
          <Compass className="w-4 h-4" />
          <span>Module 03 // Unsupervised Clustering Suite</span>
        </div>
        <h2 className="font-display text-3xl sm:text-5xl font-normal text-cohere-primary tracking-tight">
          Player Scouting Studio
        </h2>
        <p className="text-sm sm:text-base text-cohere-body-muted max-w-3xl leading-relaxed">
          Cluster tactical playing styles via K-Means and uncover statistical twins with multi-dimensional Euclidean similarity metrics.
        </p>
      </div>

      {/* ── Featured Scouting Benchmarks ── */}
      <div className="cohere-card-white p-5">
        <div className="text-xs font-mono text-cohere-muted uppercase tracking-wider mb-3 flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-cohere-primary">
            <Sparkles size={14} className="text-cohere-coral" />
            Quick Scouting Benchmarks
          </span>
          <span className="text-[11px] text-cohere-action-blue font-medium">Click to scout twin profile</span>
        </div>
        <div className="flex flex-wrap gap-2.5">
          {FEATURED_SCOUT_STARS.map((starName) => {
            const isSelected = selectedPlayer === starName;
            const p = players.find((item) => item.name === starName);
            return (
              <button
                key={starName}
                type="button"
                onClick={() => setSelectedPlayer(starName)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-cohere-primary text-white border-cohere-primary shadow-sm"
                    : "bg-white border-cohere-hairline hover:border-cohere-primary text-cohere-body-muted hover:text-cohere-primary"
                }`}
              >
                <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-cohere-hairline bg-cohere-soft-stone">
                  <Image
                    src={getPlayerPhoto(starName)}
                    alt={starName}
                    width={20}
                    height={20}
                    className="w-full h-full object-cover object-top"
                    unoptimized
                  />
                </div>
                <span>{starName}</span>
                {p && (
                  <Image
                    src={getClubCrest(p.club)}
                    alt={p.club}
                    width={14}
                    height={14}
                    unoptimized
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Search / Selector ── */}
      <div className="cohere-card-white p-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-cohere-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by player name or club..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="cohere-input pl-10 w-full"
            />
          </div>
          <div className="md:col-span-7">
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="cohere-input font-medium w-full cursor-pointer"
            >
              {filteredPlayers.map((p) => (
                <option key={p.player_id} value={p.name}>
                  {p.name} ({p.club} · {p.position} · €{p.market_value_eur_m}M)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* ── Target Hero: Cohere Product Card ── */}
      <div className="product-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div
            className="relative w-20 h-20 rounded-full shrink-0 border-2 border-white overflow-hidden bg-white shadow-md cursor-pointer group"
            onClick={() => {
              if (currentTargetRecord) setDrawerPlayer(currentTargetRecord);
            }}
            title="Click to view full dossier"
          >
            <Image
              src={getPlayerPhoto(selectedPlayer)}
              alt={selectedPlayer}
              width={80}
              height={80}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform"
              unoptimized
            />
            {scoutData?.club && (
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-white p-1 border border-cohere-hairline shadow-sm">
                <Image
                  src={getClubCrest(scoutData.club)}
                  alt={scoutData.club}
                  width={20}
                  height={20}
                  className="w-full h-full object-contain"
                  unoptimized
                />
              </div>
            )}
          </div>
          <div className="space-y-1">
            <div className="font-mono text-[10px] uppercase tracking-wider text-cohere-coral">
              Target Tactical Profile
            </div>
            <div className="font-display text-2xl sm:text-3xl font-normal text-cohere-primary tracking-tight flex items-center gap-2">
              <span>{scoutData?.target_player || selectedPlayer}</span>
              {currentTargetRecord && (
                <button
                  type="button"
                  onClick={() => setDrawerPlayer(currentTargetRecord)}
                  className="text-cohere-action-blue hover:text-cohere-primary transition-colors"
                  title="View full dossier"
                >
                  <ExternalLink size={16} />
                </button>
              )}
            </div>
            <div className="text-xs text-cohere-body-muted flex items-center gap-2 flex-wrap">
              <span className="font-medium text-cohere-primary">{scoutData?.club}</span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded-xs bg-white border border-cohere-hairline font-mono text-[10px] text-cohere-primary">
                {scoutData?.position}
              </span>
              {currentTargetRecord && (
                <>
                  <span>•</span>
                  <span>Age {currentTargetRecord.age}</span>
                  <span>•</span>
                  <span className="text-cohere-coral font-medium">
                    €{currentTargetRecord.market_value_eur_m}M
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-5 py-3 rounded-md bg-white border border-cohere-hairline text-cohere-primary flex items-center gap-3 shadow-sm">
            <Award className="w-5 h-5 text-cohere-coral" />
            <div>
              <div className="font-mono text-[10px] uppercase text-cohere-muted tracking-wider">
                Cluster Archetype
              </div>
              <div className="font-display text-base font-normal text-cohere-primary">
                {scoutData?.cluster_archetype || "Analyzing..."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2-Column: Twins + PCA Chart ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Top 5 Twins */}
        <div className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-cohere-hairline">
            <div className="font-display text-base font-normal text-cohere-primary flex items-center gap-2">
              <Users className="w-4 h-4 text-cohere-coral" />
              <span>Top 5 Statistical Twins (Euclidean Distance)</span>
            </div>
            {loading && <span className="text-xs font-mono text-cohere-coral animate-pulse">Computing...</span>}
          </div>

          <div className="space-y-3">
            {(scoutData?.top_twins || []).map((twin, idx) => (
              <div
                key={twin.name}
                className="cohere-card-white p-4 hover:border-cohere-primary transition-all cursor-pointer flex items-center justify-between group rounded-sm shadow-sm"
                onClick={() => {
                  const found = players.find((p) => p.name === twin.name);
                  if (found) {
                    setDrawerPlayer(found);
                  } else {
                    setDrawerPlayer({
                      player_id: idx + 9000,
                      name: twin.name,
                      club: twin.club,
                      position: twin.position,
                      age: twin.age,
                      minutes_played: 2000,
                      goals: 5,
                      assists: 4,
                      shots: 25,
                      pass_completion: 82,
                      dribbles: 20,
                      tackles_interceptions: 30,
                      market_value_eur_m: twin.valuation_eur_m,
                    });
                  }
                }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="font-mono text-xs text-cohere-muted w-5 text-center shrink-0">
                    0{idx + 1}
                  </div>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-cohere-hairline bg-cohere-soft-stone">
                    <Image
                      src={getPlayerPhoto(twin.name)}
                      alt={twin.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover object-top"
                      unoptimized
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white p-0.5 border border-cohere-hairline">
                      <Image
                        src={getClubCrest(twin.club)}
                        alt={twin.club}
                        width={14}
                        height={14}
                        className="w-full h-full object-contain"
                        unoptimized
                      />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-sm text-cohere-primary group-hover:text-cohere-action-blue transition-colors flex items-center gap-1.5 truncate">
                      <span className="truncate">{twin.name}</span>
                      <span className="px-1.5 py-0.2 rounded-xs text-[10px] font-mono bg-cohere-soft-stone text-cohere-ink shrink-0">
                        {twin.position}
                      </span>
                    </div>
                    <div className="text-xs text-cohere-body-muted truncate flex items-center gap-1.5 mt-0.5">
                      <span>{twin.club}</span>
                      <span>•</span>
                      <span>Age {twin.age}</span>
                      <span>•</span>
                      <span className="text-cohere-coral font-medium">€{twin.valuation_eur_m}M</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-3">
                  <div className="font-display text-lg font-normal text-cohere-primary">
                    {twin.similarity_pct.toFixed(1)}%
                  </div>
                  <div className="font-mono text-[10px] uppercase text-cohere-muted">
                    Match Affinity
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: PCA Chart in Agent Console Dark Card */}
        <div className="lg:col-span-6 agent-console-card space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="text-sm font-display text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-cohere-coral" />
              <span>2D PCA Tactical Map (All 4 Clusters)</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-cohere-muted">
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-cohere-coral" /> Finishers
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-cohere-action-blue" /> Creators
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block w-2 h-2 rounded-full bg-cohere-deep-green" /> Anchors
              </span>
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                <XAxis type="number" dataKey="x" name="PC1" stroke="#93939f" fontSize={11} />
                <YAxis type="number" dataKey="y" name="PC2" stroke="#93939f" fontSize={11} />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload?.length) return null;
                    const pt = payload[0].payload;
                    return (
                      <div className="bg-cohere-primary border border-white/20 p-3 rounded-sm text-xs shadow-2xl text-white space-y-1">
                        <div className="font-bold">{pt.name}</div>
                        <div className="text-cohere-muted">{pt.club}</div>
                        <div className="text-cohere-coral font-medium">{pt.archetype}</div>
                        <div className="text-[10px] font-mono text-cohere-slate">Click dot to open dossier</div>
                      </div>
                    );
                  }}
                />
                <Scatter
                  data={clusterPoints}
                  onClick={handleScatterClick}
                  className="cursor-pointer"
                >
                  {clusterPoints.map((entry, i) => (
                    <Cell
                      key={`c-${i}`}
                      fill={CLUSTER_PALETTE[entry.cluster] || "#93939f"}
                      opacity={0.65}
                    />
                  ))}
                </Scatter>
                <Scatter
                  data={targetPoint}
                  fill="#ff7759"
                  shape="star"
                  onClick={handleScatterClick}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <PlayerDetailDrawer
        player={drawerPlayer}
        open={drawerPlayer !== null}
        onClose={() => setDrawerPlayer(null)}
      />
    </div>
  );
}
