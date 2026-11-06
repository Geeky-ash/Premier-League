"use client";

import React, { useEffect, useState } from "react";
import { scoutPlayerTwin, fetchPlayers, PlayerRecord, ScoutTwinResponse } from "@/lib/api";
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from "recharts";
import { Users, Search, Target, Compass, Award } from "lucide-react";
import PlayerDetailDrawer from "@/components/PlayerDetailDrawer";

const CLUSTER_PALETTE: Record<number, string> = {
  0: "#00ff85", 1: "#00d4ff", 2: "#e90052", 3: "#fdb913",
};

export default function ScoutingStudioPage() {
  const [players, setPlayers] = useState<PlayerRecord[]>([]);
  const [selectedPlayer, setSelectedPlayer] = useState("Bukayo Saka");
  const [searchQuery, setSearchQuery] = useState("");
  const [scoutData, setScoutData] = useState<ScoutTwinResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [drawerPlayer, setDrawerPlayer] = useState<PlayerRecord | null>(null);

  useEffect(() => { fetchPlayers().then(setPlayers).catch(() => {}); }, []);

  const triggerScout = async (name: string) => {
    if (!name) return;
    setLoading(true);
    try { setScoutData(await scoutPlayerTwin(name)); } catch {} finally { setLoading(false); }
  };

  useEffect(() => { triggerScout(selectedPlayer); }, [selectedPlayer]);

  const filteredPlayers = players.filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const clusterPoints = (scoutData?.all_cluster_points || []).map((pt) => ({
    x: pt.pca_x, y: pt.pca_y, name: pt.name, club: pt.club, cluster: pt.cluster_id, archetype: pt.cluster_archetype, val: pt.market_value,
  }));
  const targetPoint = scoutData ? [{ x: scoutData.pca_coords.x, y: scoutData.pca_coords.y, name: scoutData.target_player }] : [];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pl-green">
          <Compass className="w-4 h-4" /> Module 03 // Unsupervised Scouting Intelligence
        </div>
        <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1">Player Scouting Studio</h2>
        <p className="text-sm text-pl-text-muted mt-1">Cluster tactical playing styles via K-Means and uncover statistical twins with normalized Euclidean metrics.</p>
      </div>

      {/* Search / Selector */}
      <div className="pl-card">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-pl-text-muted absolute left-3.5 top-3.5" />
            <input type="text" placeholder="Search player name..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-search pl-10" />
          </div>
          <div className="md:col-span-7">
            <select value={selectedPlayer} onChange={(e) => setSelectedPlayer(e.target.value)} className="pl-search font-semibold">
              {filteredPlayers.map((p) => (<option key={p.player_id} value={p.name}>{p.name} ({p.club} · {p.position} · €{p.market_value_eur_m}M)</option>))}
            </select>
          </div>
        </div>
      </div>

      {/* Target Hero */}
      <div className="pl-card bg-pl-gradient border-pl-green/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="stat-label">Target Tactical Profile</div>
          <div className="text-3xl font-extrabold text-white mt-1">{scoutData?.target_player}</div>
          <div className="text-xs text-pl-text-secondary mt-1">{scoutData?.club} · {scoutData?.position}</div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 rounded-pl bg-pl-green/15 border border-pl-green/40 text-pl-green font-bold text-sm flex items-center gap-2">
            <Award className="w-4 h-4" /> {scoutData?.cluster_archetype}
          </div>
        </div>
      </div>

      {/* 2-Column: Twins + PCA Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Twins */}
        <div className="lg:col-span-6 space-y-4">
          <div className="text-sm font-bold text-white flex items-center justify-between">
            <div className="flex items-center gap-2"><Users className="w-4 h-4 text-pl-green" /> Top 5 Statistical Twins (Euclidean Distance)</div>
            {loading && <span className="text-xs text-pl-green animate-pulse">Matching...</span>}
          </div>
          <div className="space-y-2">
            {(scoutData?.top_twins || []).map((twin, idx) => (
              <div
                key={twin.name}
                className="pl-card p-4 hover:border-pl-green/40 transition-all cursor-pointer flex items-center justify-between"
                onClick={() => {
                  const found = players.find((p) => p.name === twin.name);
                  if (found) setDrawerPlayer(found);
                }}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-pl-border flex items-center justify-center font-bold text-xs text-pl-text-muted">#{idx + 1}</div>
                  <div>
                    <div className="font-bold text-sm text-white flex items-center gap-2">
                      {twin.name}
                      <span className="pos-badge">{twin.position}</span>
                    </div>
                    <div className="text-xs text-pl-text-muted">{twin.club} · Age {twin.age} · €{twin.valuation_eur_m}M</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-extrabold text-pl-green">{twin.similarity_pct.toFixed(1)}%</div>
                  <div className="text-[10px] uppercase font-semibold text-pl-text-muted">Match Affinity</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: PCA Chart */}
        <div className="lg:col-span-6 pl-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-bold text-white flex items-center gap-2"><Target className="w-4 h-4 text-pl-green" /> 2D PCA Tactical Map (All 4 Clusters)</div>
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
                <Tooltip content={({ payload }) => {
                  if (!payload?.length) return null;
                  const pt = payload[0].payload;
                  return (<div className="bg-pl-dark border border-pl-border p-2.5 rounded-pl text-xs shadow-xl"><div className="font-bold text-white">{pt.name}</div><div className="text-pl-text-secondary">{pt.club}</div><div className="text-pl-green">{pt.archetype}</div></div>);
                }} />
                <Scatter data={clusterPoints}>
                  {clusterPoints.map((entry, i) => (<Cell key={`c-${i}`} fill={CLUSTER_PALETTE[entry.cluster] || "#94A3B8"} opacity={0.55} />))}
                </Scatter>
                <Scatter data={targetPoint} fill="#00ff85" shape="star" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <PlayerDetailDrawer player={drawerPlayer} open={drawerPlayer !== null} onClose={() => setDrawerPlayer(null)} />
    </div>
  );
}
