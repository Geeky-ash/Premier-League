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
    <div className="space-y-8 animate-fade-in font-body text-cohere-ink">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cohere-coral">
            <Radio size={14} className="animate-pulse" /> Live In-Play Intelligence // PGMOL Tracking
          </div>
          <h2 className="text-3xl font-display font-medium text-cohere-primary tracking-tight mt-1 flex items-center gap-2.5">
            <span>In-Play Fouls & Instant Alert Webhook</span>
          </h2>
          <p className="text-sm text-cohere-body-muted mt-1 max-w-2xl">
            Real-time player foul accumulation tracking with automated Telegram bot dispatch and threshold breach monitors.
          </p>
        </div>

        {/* Telegram Config CTA */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="button-primary flex items-center gap-2 text-xs"
          >
            <Bell size={14} />
            <span>Configure Telegram Alerts</span>
          </button>
          <button
            type="button"
            onClick={loadLiveMatches}
            className="p-2.5 rounded-full bg-white border border-cohere-hairline text-cohere-slate hover:text-cohere-ink transition-colors shadow-sm"
            title="Refresh in-play scores"
          >
            <RotateCw size={14} className={loading ? "animate-spin" : ""} />
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {alertSuccessToast && (
        <div className="p-4 rounded-lg bg-cohere-pale-green border border-cohere-deep-green/20 text-cohere-deep-green text-xs flex items-center justify-between shadow-sm animate-slide-up">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 size={16} className="text-cohere-deep-green shrink-0" />
            <span className="font-medium">{alertSuccessToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setAlertSuccessToast(null)}
            className="text-cohere-deep-green/70 hover:text-cohere-deep-green"
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
            className="product-card p-5 space-y-4"
          >
            {/* Match Header */}
            <div className="flex items-center justify-between pb-3 border-b border-cohere-hairline">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-mono font-bold text-cohere-coral bg-white px-2.5 py-0.5 rounded-pill border border-cohere-coral/30 shadow-sm">
                  <Radio size={11} className="animate-pulse" />
                  <span>{match.status} {match.minute}&apos;</span>
                </span>
                <span className="text-xs font-bold text-cohere-primary">{match.fixture}</span>
              </div>
              <span className="text-sm font-mono font-bold text-cohere-primary px-2.5 py-0.5 rounded-sm bg-white border border-cohere-hairline">
                {match.score}
              </span>
            </div>

            <div className="text-[11px] text-cohere-slate flex items-center justify-between font-mono">
              <span>Referee: {match.referee}</span>
              <span className="text-cohere-action-blue font-semibold">Live Event Feed</span>
            </div>

            {/* Players In-Play Fouls Table */}
            <div className="space-y-2">
              <div className="text-[10px] uppercase font-mono font-bold text-cohere-muted tracking-wider flex justify-between px-2">
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
                    className={`p-3 rounded-lg flex items-center justify-between transition-all border ${
                      isBreached
                        ? "bg-white border-cohere-coral shadow-sm"
                        : "bg-white/80 border-cohere-hairline"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 border border-cohere-hairline bg-cohere-soft-stone">
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
                        <div className="text-xs font-bold text-cohere-primary flex items-center gap-1.5">
                          <span>{p.name}</span>
                          {p.yellow && (
                            <span className="w-2.5 h-3.5 bg-yellow-400 rounded-xs inline-block shadow-xs" title="Yellow Card" />
                          )}
                        </div>
                        <div className="text-[10px] text-cohere-muted flex items-center gap-1">
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
                        <span className="text-[10px] font-mono font-bold text-cohere-coral flex items-center gap-1 bg-cohere-soft-stone px-2 py-0.5 rounded border border-cohere-coral/30">
                          <AlertTriangle size={10} />
                          <span>THRESHOLD</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-mono text-cohere-slate">Normal</span>
                      )}

                      <span className="text-sm font-mono font-bold text-cohere-primary w-6 text-center">
                        {p.fouls}
                      </span>

                      <button
                        type="button"
                        onClick={() => handleSimulateFoulEvent(p.name, p.club, p.fouls)}
                        className="p-1.5 rounded-sm bg-cohere-soft-stone hover:bg-cohere-hairline text-cohere-primary transition-colors"
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
            className="w-full max-w-md mx-4 bg-white rounded-lg border border-cohere-hairline shadow-2xl overflow-hidden animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 bg-cohere-soft-stone border-b border-cohere-hairline flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-cohere-coral border border-cohere-hairline">
                  <Bell size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-cohere-primary">Telegram In-Play Alerts</h3>
                  <p className="text-[11px] text-cohere-slate">Instant webhook notification setup</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-cohere-muted hover:text-cohere-ink p-1"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubscribe} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-mono font-bold text-cohere-ink block mb-1.5">
                  Telegram Chat ID or Channel ID *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 123456789 or @my_pl_channel"
                  value={telegramChatId}
                  onChange={(e) => setTelegramChatId(e.target.value)}
                  className="cohere-input w-full bg-white border border-cohere-hairline text-cohere-ink px-3 py-2 rounded-sm"
                />
                <span className="text-[10px] text-cohere-muted mt-1 block">
                  Message @userinfobot on Telegram to discover your personal Chat ID.
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs font-mono font-bold text-cohere-ink mb-1.5">
                  <span>Foul Trigger Threshold</span>
                  <span className="text-cohere-coral">{foulThreshold}+ Fouls</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={5}
                  value={foulThreshold}
                  onChange={(e) => setFoulThreshold(Number(e.target.value))}
                  className="w-full accent-[#ff7759] cursor-pointer"
                />
                <span className="text-[10px] text-cohere-muted block mt-0.5">
                  An alert is instantly dispatched whenever any player reaches this count.
                </span>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-cohere-ink block mb-1.5">
                  Secondary Email Dispatch (Optional)
                </label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="cohere-input w-full bg-white border border-cohere-hairline text-cohere-ink px-3 py-2 rounded-sm"
                />
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTestAlert}
                  disabled={testingAlert || !telegramChatId}
                  className="flex-1 button-pill-outline py-2 text-xs font-bold font-mono flex items-center justify-center gap-1.5"
                >
                  <Send size={12} />
                  <span>{testingAlert ? "Testing..." : "Send Test Alert"}</span>
                </button>

                <button
                  type="submit"
                  className="flex-1 button-primary py-2 text-xs font-bold font-mono flex items-center justify-center gap-1.5"
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
