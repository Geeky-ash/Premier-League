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
  TrendingUp,
} from "lucide-react";
import PlayerDetailDrawer from "@/components/PlayerDetailDrawer";

const CLUSTER_PALETTE: Record<number, string> = {
  0: "#00ff85",
  1: "#00d4ff",
  2: "#e90052",
  3: "#fdb913",
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
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pl-green">
          <Compass className="w-4 h-4" /> Module 03 // Unsupervised Scouting Intelligence
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">
          Player Scouting Studio
        </h2>
        <p className="text-sm text-pl-text-muted mt-1">
          Cluster tactical playing styles via K-Means and uncover statistical twins with multi-dimensional Euclidean similarity metrics.
        </p>
      </div>

      {/* Featured Scouting Presets */}
      <div className="pl-card p-4 bg-slate-900/60 border-white/10">
        <div className="text-xs font-bold text-pl-text-muted uppercase tracking-wider mb-2.5 flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-pl-cyan" />
            Quick Scouting Benchmarks
          </span>
          <span className="text-[11px] text-pl-cyan font-normal">Click to scout twin profile</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {FEATURED_SCOUT_STARS.map((starName) => {
            const isSelected = selectedPlayer === starName;
            const p = players.find((item) => item.name === starName);
            return (
              <button
                key={starName}
                type="button"
                onClick={() => setSelectedPlayer(starName)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  isSelected
                    ? "bg-pl-purple border-pl-green text-white shadow-lg shadow-pl-green/20"
                    : "bg-slate-950/40 border-white/10 hover:border-white/25 text-slate-300"
                }`}
              >
                <div className="relative w-5 h-5 rounded-full overflow-hidden shrink-0 border border-white/20 bg-slate-800">
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

      {/* Search / Selector */}
      <div className="pl-card bg-slate-900/60 border-white/10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-pl-text-muted absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by player name or club..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-search pl-10 w-full"
            />
          </div>
          <div className="md:col-span-7">
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="pl-search font-semibold w-full"
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

      {/* Target Hero */}
      <div className="pl-card bg-gradient-to-br from-pl-purple/90 via-slate-900 to-slate-950 border border-pl-green/30 p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden shadow-2xl">
        <div className="flex items-center gap-5">
          <div
            className="relative w-20 h-20 rounded-full shrink-0 border-2 border-white/25 overflow-hidden bg-slate-900 shadow-xl cursor-pointer group"
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
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-slate-950 p-1 border border-white/20">
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
          <div>
            <div className="stat-label">Target Tactical Profile</div>
            <div className="text-2xl sm:text-3xl font-black text-white mt-0.5 tracking-tight flex items-center gap-2">
              <span>{scoutData?.target_player || selectedPlayer}</span>
              {currentTargetRecord && (
                <button
                  type="button"
                  onClick={() => setDrawerPlayer(currentTargetRecord)}
                  className="text-pl-cyan hover:text-white transition-colors"
                  title="View full dossier"
                >
                  <ExternalLink size={16} />
                </button>
              )}
            </div>
            <div className="text-xs text-pl-text-muted mt-1 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-300">{scoutData?.club}</span>
              <span>•</span>
              <span className="pos-badge">{scoutData?.position}</span>
              {currentTargetRecord && (
                <>
                  <span>•</span>
                  <span>Age {currentTargetRecord.age}</span>
                  <span>•</span>
                  <span className="text-pl-green font-bold">
                    €{currentTargetRecord.market_value_eur_m}M
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="px-4 py-2.5 rounded-xl bg-pl-green/15 border border-pl-green/40 text-pl-green font-bold text-sm flex items-center gap-2.5 shadow-lg shadow-pl-green/10">
            <Award className="w-5 h-5 text-pl-green" />
            <div>
              <div className="text-[10px] uppercase font-bold text-pl-text-muted tracking-wider">
                Cluster Archetype
              </div>
              <div className="text-sm font-black text-white">
                {scoutData?.cluster_archetype || "Analyzing..."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2-Column: Twins + PCA Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Twins */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-sm font-bold text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-pl-green" /> Top 5 Statistical Twins (Euclidean Distance)
            </div>
            {loading && <span className="text-xs text-pl-green animate-pulse">Matching...</span>}
          </div>

          <div className="space-y-2.5">
            {(scoutData?.top_twins || []).map((twin, idx) => (
              <div
                key={twin.name}
                className="pl-card p-3.5 bg-slate-900/60 border-white/10 hover:border-pl-green/50 transition-all cursor-pointer flex items-center justify-between group rounded-xl"
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
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-pl-text-muted shrink-0">
                    #{idx + 1}
                  </div>
                  <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white/20 bg-slate-800">
                    <Image
                      src={getPlayerPhoto(twin.name)}
                      alt={twin.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover object-top"
                      unoptimized
                    />
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-950 p-0.5 border border-white/20">
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
                    <div className="font-bold text-sm text-white group-hover:text-pl-cyan transition-colors flex items-center gap-1.5 truncate">
                      <span className="truncate">{twin.name}</span>
                      <span className="pos-badge shrink-0">{twin.position}</span>
                    </div>
                    <div className="text-xs text-pl-text-muted truncate flex items-center gap-1 mt-0.5">
                      <span>{twin.club}</span>
                      <span>•</span>
                      <span>Age {twin.age}</span>
                      <span>•</span>
                      <span className="text-pl-green font-semibold">€{twin.valuation_eur_m}M</span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0 pl-2">
                  <div className="text-base font-extrabold text-pl-green">
                    {twin.similarity_pct.toFixed(1)}%
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-pl-text-muted">
                    Match Affinity
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: PCA Chart */}
        <div className="lg:col-span-6 pl-card space-y-4 bg-slate-900/60 border-white/10">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-pl-green" /> 2D PCA Tactical Map (All 4 Clusters)
            </div>
            <div className="flex items-center gap-2 text-[10px] text-pl-text-muted">
              <span className="inline-block w-2 h-2 rounded-full bg-pl-green" /> Finishers
              <span className="inline-block w-2 h-2 rounded-full bg-pl-cyan" /> Creators
              <span className="inline-block w-2 h-2 rounded-full bg-pl-magenta" /> Anchors
            </div>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" />
                <XAxis type="number" dataKey="x" name="PC1" stroke="#fff6" fontSize={11} />
                <YAxis type="number" dataKey="y" name="PC2" stroke="#fff6" fontSize={11} />
                <Tooltip
                  content={({ payload }) => {
                    if (!payload?.length) return null;
                    const pt = payload[0].payload;
                    return (
                      <div className="bg-slate-900 border border-white/20 p-2.5 rounded-xl text-xs shadow-2xl">
                        <div className="font-bold text-white">{pt.name}</div>
                        <div className="text-pl-text-secondary">{pt.club}</div>
                        <div className="text-pl-green font-semibold">{pt.archetype}</div>
                        <div className="text-[10px] text-pl-cyan mt-1">Click dot to open dossier</div>
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
                      fill={CLUSTER_PALETTE[entry.cluster] || "#94A3B8"}
                      opacity={0.55}
                    />
                  ))}
                </Scatter>
                <Scatter
                  data={targetPoint}
                  fill="#00ff85"
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
