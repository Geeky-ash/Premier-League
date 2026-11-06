"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Bell,
  Radio,
  Send,
  ShieldAlert,
  Flame,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCw,
  X,
  Sparkles,
} from "lucide-react";
import {
  fetchInPlayMatches,
  testTelegramAlert,
  subscribeInPlayFouls,
  triggerInPlayFoul,
} from "@/lib/api";
import { getClubCrest, getPlayerPhoto } from "@/lib/logos";

export default function InPlayFoulsPage() {
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [telegramChatId, setTelegramChatId] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [foulThreshold, setFoulThreshold] = useState(2);
  const [alertSuccessToast, setAlertSuccessToast] = useState<string | null>(null);
  const [testingAlert, setTestingAlert] = useState(false);

  const loadLiveMatches = () => {
    setLoading(true);
    fetchInPlayMatches()
      .then(setMatches)
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadLiveMatches();
    const interval = setInterval(loadLiveMatches, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleTestAlert = async () => {
    if (!telegramChatId) {
      alert("Please enter a Telegram Chat ID first!");
      return;
    }
    setTestingAlert(true);
    try {
      const res = await testTelegramAlert(telegramChatId);
      setAlertSuccessToast(`Dispatched test notification to chat ID ${telegramChatId}! (${res.status})`);
      setTimeout(() => setAlertSuccessToast(null), 5000);
    } catch (e: any) {
      alert(`Error sending test: ${e.message}`);
    } finally {
      setTestingAlert(false);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!telegramChatId) return;
    try {
      await subscribeInPlayFouls({
        chat_id: telegramChatId,
        foul_threshold: foulThreshold,
        email: emailInput || undefined,
      });
      setAlertSuccessToast(`Subscribed! You will receive live alerts when any player commits ${foulThreshold}+ fouls.`);
      setModalOpen(false);
      setTimeout(() => setAlertSuccessToast(null), 6000);
    } catch (e: any) {
      alert(`Subscription failed: ${e.message}`);
    }
  };

  const handleSimulateFoulEvent = async (playerName: string, club: string, fouls: number) => {
    try {
      const res = await triggerInPlayFoul({
        player_name: playerName,
        club: club,
        fouls: fouls + 1,
        minute: 72,
      });
      setAlertSuccessToast(
        `Foul event triggered for ${playerName} (${fouls + 1} fouls). ${res.alerts_dispatched} alert(s) dispatched to Telegram subscribers!`
      );
      loadLiveMatches();
      setTimeout(() => setAlertSuccessToast(null), 6000);
    } catch (e: any) {
      alert(`Trigger failed: ${e.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-pl-magenta">
            <Radio size={14} className="animate-pulse" /> Live In-Play Intelligence // PGMOL Tracking
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight mt-1 flex items-center gap-2.5">
            <span>In-Play Fouls & Instant Alert Webhook</span>
          </h2>
          <p className="text-sm text-pl-text-muted mt-1">
            Real-time player foul accumulation tracking with automated Telegram bot dispatch and threshold breach monitors.
          </p>
        </div>

        {/* Telegram Config CTA */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="pl-btn-primary flex items-center gap-2 py-2.5 px-4 text-xs font-bold shadow-lg shadow-pl-green/20"
          >
            <Bell size={14} />
            <span>Configure Telegram Alerts</span>
          </button>
          <button
            type="button"
            onClick={loadLiveMatches}
            className="p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white/70 hover:text-white transition-colors"
            title="Refresh in-play scores"
          >
            <RotateCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {alertSuccessToast && (
        <div className="p-4 rounded-xl bg-pl-green/15 border border-pl-green/40 text-white text-xs flex items-center justify-between shadow-xl animate-slide-up">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-pl-green shrink-0" />
            <span>{alertSuccessToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertSuccessToast(null)}
            className="text-white/60 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Live Matches Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {matches.map((match) => (
          <div
            key={match.match_id}
            className="pl-card bg-slate-900/70 border-white/10 p-5 rounded-2xl shadow-xl space-y-4"
          >
            {/* Match Header */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-black text-pl-magenta bg-pl-magenta/15 px-2.5 py-0.5 rounded-full border border-pl-magenta/30">
                  <Radio size={11} className="animate-pulse" />
                  <span>{match.status} {match.minute}&apos;</span>
                </span>
                <span className="text-xs font-bold text-white">{match.fixture}</span>
              </div>
              <span className="text-sm font-black text-white px-2.5 py-0.5 rounded-lg bg-slate-950 border border-white/15">
                {match.score}
              </span>
            </div>

            <div className="text-[11px] text-pl-text-muted flex items-center justify-between">
              <span>Referee: {match.referee}</span>
              <span className="text-pl-cyan font-semibold">Live Event Feed</span>
            </div>

            {/* Players In-Play Fouls Table */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-bold text-pl-text-muted tracking-wider flex justify-between px-2">
                <span>Player & Club</span>
                <div className="flex gap-6 pr-1">
                  <span>Status</span>
                  <span>Fouls</span>
                  <span>Action</span>
                </div>
              </div>

              {match.players.map((p: any) => {
                const isBreached = p.threshold_breached;
                return (
                  <div
                    key={p.name}
                    className={`p-3 rounded-xl flex items-center justify-between transition-all border ${
                      isBreached
                        ? "bg-pl-magenta/10 border-pl-magenta/30 shadow-lg shadow-pl-magenta/5"
                        : "bg-slate-950/60 border-white/5"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/20 bg-slate-800">
                        <Image
                          src={getPlayerPhoto(p.name)}
                          alt={p.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover object-top"
                          unoptimized
                        />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {p.yellow && (
                            <span className="w-2.5 h-3.5 bg-yellow-400 rounded-sm inline-block shadow-sm" title="Yellow Card" />
                          )}
                        </div>
                        <div className="text-[10px] text-pl-text-muted flex items-center gap-1">
                          <Image
                            src={getClubCrest(p.club)}
                            alt={p.club}
                            width={11}
                            height={11}
                            unoptimized
                          />
                          <span>{p.club}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {isBreached ? (
                        <span className="text-[10px] font-black text-pl-magenta flex items-center gap-1 bg-pl-magenta/20 px-2 py-0.5 rounded border border-pl-magenta/40 animate-pulse">
                          <AlertTriangle size={10} />
                          <span>THRESHOLD</span>
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400">Normal</span>
                      )}

                      <span className="text-sm font-black text-white w-6 text-center">
                        {p.fouls}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleSimulateFoulEvent(p.name, p.club, p.fouls)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-pl-cyan hover:text-white transition-colors"
                        title="Simulate +1 foul committed to test alert"
                      >
                        <Play size={12} fill="currentColor" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Telegram Configuration Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div
            className="w-full max-w-md mx-4 bg-slate-950 rounded-2xl border border-white/20 shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-gradient-to-r from-pl-purple to-slate-900 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-pl-green/20 flex items-center justify-center text-pl-green">
                  <Bell size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Telegram In-Play Alerts</h3>
                  <p className="text-[11px] text-pl-text-muted">Instant webhook notification setup</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-white/60 hover:text-white p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubscribe} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Telegram Chat ID or Channel ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456789 or @my_pl_channel"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  className="pl-search w-full"
                />
                <span className="text-[10px] text-pl-text-muted mt-1 block">
                  Message @userinfobot on Telegram to discover your personal Chat ID.
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-slate-300 mb-1.5">
                  <span>Foul Trigger Threshold</span>
                  <span className="text-pl-green">{foulThreshold}+ Fouls</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={foulThreshold}
                  onChange={(e) => setFoulThreshold(Number(e.target.value))}
                  className="w-full accent-[#00ff85] cursor-pointer"
                />
                <span className="text-[10px] text-pl-text-muted block mt-0.5">
                  An alert is instantly dispatched whenever any player reaches this count.
                </span>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">
                  Secondary Email Dispatch (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="pl-search w-full"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestAlert}
                  disabled={testingAlert || !telegramChatId}
                  className="flex-1 py-2 text-xs font-bold rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-1.5 disabled:opacity-40"
                >
                  <Send size={12} />
                  <span>{testingAlert ? "Testing..." : "Send Test Alert"}</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 pl-btn-primary py-2 text-xs font-bold text-slate-950 flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 size={14} />
                  <span>Save Rule</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
