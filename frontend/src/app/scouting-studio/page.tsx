"use client";

import React, { useEffect, useState } from "react";
import { scoutPlayerTwin, fetchPlayers, PlayerRecord, ScoutTwinResponse } from "@/lib/api";
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
import { Users, Search, Target, Compass, Award, Star } from "lucide-react";

const CLUSTER_PALETTE: Record<number, string> = {
  0: "#00FF85", // Green: Clinical Finishers
  1: "#00E5FF", // Cyan: Playmakers
  2: "#E90052", // Pink: Defensive Anchors
  3: "#FFB800", // Gold: Ball-playing defenders
};

export default function ScoutingStudioPage() {
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState<string>("Bukayo Saka");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [scoutData, setScoutData] = useState<ScoutTwinResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchPlayers()
      .then((data) => setPlayers(data))
      .catch((err) => console.error("Error fetching player roster:", err));
  }, []);

  const triggerScout = async (name: string) => {
    if (!name) return;
    setLoading(true);
    try {
      const res = await scoutPlayerTwin(name);
      setScoutData(res);
    } catch (err) {
      console.error("Scouting query error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    triggerScout(selectedPlayer);
  }, [selectedPlayer]);

  const filteredPlayers = players.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
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
    ? [{ x: scoutData.pca_coords.x, y: scoutData.pca_coords.y, name: scoutData.target_player }]
    : [];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00FF85]">
          <Compass className="w-4 h-4" />
          Module 03 // Unsupervised Scouting Intelligence
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight mt-1">
          Player Scouting Studio
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Cluster tactical playing styles via K-Means and uncover statistical twins with normalized Euclidean metrics.
        </p>
      </div>

      {/* Player Autocomplete / Search Selector */}
      <div className="glass-panel p-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search player name (e.g., Saka, Haaland)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#121826] border border-white/15 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#00FF85]"
            />
          </div>

          <div className="md:col-span-7">
            <select
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="w-full bg-[#121826] border border-white/15 rounded-xl px-4 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-[#00FF85]"
            >
              {filteredPlayers.map((p) => (
                <option key={p.player_id} value={p.name}>
                  {p.name} ({p.club} • {p.position} • €{p.market_value_eur_m}M)
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Target Player Hero Card */}
      <div className="p-7 rounded-2xl bg-gradient-to-br from-[#38003C]/50 via-[#121826] to-[#0E131F] border border-[#00FF85]/30 shadow-glass-glow flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs uppercase font-bold tracking-widest text-slate-400">
            Target Tactical Profile
          </div>
          <div className="text-3xl font-extrabold text-white mt-1">
            {scoutData?.target_player}
          </div>
          <div className="text-xs text-slate-300 mt-1">
            {scoutData?.club} • {scoutData?.position}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-xl bg-[#00FF85]/15 border border-[#00FF85]/40 text-[#00FF85] font-bold text-sm flex items-center gap-2">
            <Award className="w-4 h-4" />
            {scoutData?.cluster_archetype}
          </div>
        </div>
      </div>

      {/* 2-Column: Left (Twin Cards Grid) / Right (2D PCA Cluster Map) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Top 5 Twins Cards Grid */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-sm font-bold text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#00FF85]" />
              Top 5 Statistical Twins (Euclidean Distance)
            </div>
            {loading && <span className="text-xs text-[#00FF85] animate-pulse">Matching...</span>}
          </div>

          <div className="space-y-3">
            {(scoutData?.top_twins || []).map((twin, idx) => (
              <div
                key={twin.name}
                className="glass-panel p-4 hover:border-[#00FF85]/40 hover:glass-glow-green transition-all duration-200 flex items-center justify-between"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-xs text-slate-300">
                    #{idx + 1}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      {twin.name}
                      <span className="text-[10px] font-semibold text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                        {twin.position}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      {twin.club} • Age {twin.age} • €{twin.valuation_eur_m}M
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-base font-extrabold text-[#00FF85]">
                    {twin.similarity_pct.toFixed(1)}%
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">
                    Match Affinity
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Recharts 2D PCA Tactical Space Chart */}
        <div className="lg:col-span-6 glass-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-[#00FF85]" />
              2D PCA Tactical Map (All 4 Clusters)
            </div>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="inline-block w-2 h-2 rounded-full bg-[#00FF85]" /> Finishers
              <span className="inline-block w-2 h-2 rounded-full bg-[#00E5FF]" /> Creators
              <span className="inline-block w-2 h-2 rounded-full bg-[#E90052]" /> Anchors
            </div>
          </div>

          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.07)" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="PC1 (Attacking / Production)"
                  stroke="#94A3B8"
                  fontSize={11}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="PC2 (Defensive Actions)"
                  stroke="#94A3B8"
                  fontSize={11}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  content={({ payload }) => {
                    if (!payload || !payload.length) return null;
                    const pt = payload[0].payload;
                    return (
                      <div className="bg-[#121826] border border-white/20 p-2.5 rounded-lg text-xs shadow-xl">
                        <div className="font-bold text-white">{pt.name}</div>
                        <div className="text-slate-300">{pt.club}</div>
                        <div className="text-[#00FF85]">{pt.archetype}</div>
                      </div>
                    );
                  }}
                />
                <Scatter data={clusterPoints}>
                  {clusterPoints.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CLUSTER_PALETTE[entry.cluster] || "#94A3B8"}
                      opacity={0.55}
                    />
                  ))}
                </Scatter>
                <Scatter data={targetPoint} fill="#00FF85" shape="star" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
