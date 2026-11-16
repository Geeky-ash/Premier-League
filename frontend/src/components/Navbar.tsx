"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GLOBAL_LEAGUES, getLeagueLogo, getLeagueFallbackLogo } from "@/lib/logos";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import AuthModal from "@/components/AuthModal";

export default function Navbar() {
  const pathname = usePathname();
  const [leaguesOpen, setLeaguesOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const leaguesRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (leaguesRef.current && !leaguesRef.current.contains(e.target as Node)) {
        setLeaguesOpen(false);
      }
      if (favoritesRef.current && !favoritesRef.current.contains(e.target as Node)) {
        setFavoritesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchModalOpen(true);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const isFixturesActive = pathname === "/" || pathname === "/fixtures";
  const isInPlayActive = pathname === "/inplay-fouls";
  const isLeaguesActive = pathname.startsWith("/league");
  const isPropsActive = pathname === "/transfer-predictor";
  const isRefereesActive = pathname === "/referees";
  const isScoutingActive = pathname === "/scouting-studio";
  const isSimulationActive = pathname === "/simulation";
  const isDugoutActive = pathname === "/dugout";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 flex flex-col">
        {/* ── 1. Top 36px Microcopy Announcement Bar ── */}
        <div className="h-[36px] bg-primary text-on-primary px-margin-desktop flex items-center justify-between border-b border-outline/20">
          <div className="flex items-center gap-space-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary-container animate-pulse" />
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-surface-bright">
              STATIONARY &amp; IN-PLAY STATS CENTRE — ENTERPRISE AI ANALYTICS
            </span>
          </div>
          <div className="flex items-center gap-space-md">
            <span className="font-label-xs text-label-xs text-outline-variant">
              FEED_PROTOCOL: V2.6-SSE
            </span>
            <Link
              href="/inplay-fouls"
              className="font-label-xs text-label-xs text-surface-bright hover:text-secondary-fixed underline transition-colors"
            >
              Live Webhook Feed →
            </Link>
          </div>
        </div>

        {/* ── 2. Main 64px Navigation Header ── */}
        <div className="h-[64px] bg-surface-container-lowest px-margin-desktop flex items-center justify-between border-b border-outline-variant">
          {/* Left Brand and Nav Links */}
          <div className="flex items-center gap-space-lg">
            {/* Brand Logo */}
            <Link href="/" className="flex items-center gap-space-xs group">
              <div className="w-7 h-7 bg-primary text-on-primary flex items-center justify-center rounded font-headline-sm text-headline-sm font-semibold select-none group-hover:bg-primary-container transition-colors">
                C
              </div>
              <span className="font-headline-md text-headline-md tracking-tight text-on-surface">
                PlayerStats
              </span>
              <span className="font-label-xs text-label-xs px-space-xs py-0.5 rounded bg-surface-container-high text-on-surface-variant font-medium border border-outline-variant">
                V2.6
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-space-md h-[64px]">
              {/* Fixtures */}
              <Link
                href="/"
                className={`transition-colors uppercase tracking-wide h-full flex items-center font-label-lg text-label-lg ${
                  isFixturesActive
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Fixtures
              </Link>

              {/* In-Play */}
              <Link
                href="/inplay-fouls"
                className={`transition-colors uppercase tracking-wide flex items-center gap-1.5 h-full font-label-lg text-label-lg ${
                  isInPlayActive
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <span>In-Play</span>
                <span className="px-1.5 py-0.2 rounded-full bg-secondary-container text-on-secondary font-label-xs text-label-xs font-bold leading-none">
                  6
                </span>
              </Link>

              {/* Leagues Dropdown */}
              <div className="relative h-full flex items-center" ref={leaguesRef}>
                <button
                  type="button"
                  onClick={() => setLeaguesOpen(!leaguesOpen)}
                  className={`transition-colors uppercase tracking-wide flex items-center gap-1 font-label-lg text-label-lg ${
                    isLeaguesActive || leaguesOpen
                      ? "text-primary font-semibold"
                      : "text-on-surface-variant hover:text-on-surface"
                  }`}
                >
                  <span>Leagues</span>
                  <span className="material-symbols-outlined text-[16px]">expand_more</span>
                </button>

                {leaguesOpen && (
                  <div className="absolute top-full left-0 mt-1 w-64 rounded bg-surface-container-lowest border border-outline-variant shadow-lg py-2 z-50 animate-slide-up">
                    <div className="px-3 py-1 font-label-xs text-label-xs uppercase tracking-wider text-outline border-b border-outline-variant">
                      Top Competitions
                    </div>
                    <div className="max-h-72 overflow-y-auto py-1">
                      {GLOBAL_LEAGUES.map((l) => (
                        <Link
                          key={l.slug}
                          href={`/league/${l.slug}`}
                          onClick={() => setLeaguesOpen(false)}
                          className="flex items-center justify-between px-3 py-2 hover:bg-surface-container-low transition-colors text-xs font-medium text-on-surface"
                        >
                          <div className="flex items-center gap-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={getLeagueLogo(l.slug)}
                              alt=""
                              className="w-4 h-4 object-contain"
                              onError={(e) => {
                                const fallback = getLeagueFallbackLogo(l.slug);
                                if (fallback && e.currentTarget.src !== fallback) {
                                  e.currentTarget.src = fallback;
                                }
                              }}
                            />
                            <span>{l.name}</span>
                          </div>
                          <span className="font-label-xs text-[10px] text-outline uppercase">
                            {l.countryTag}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Props Finder */}
              <Link
                href="/transfer-predictor"
                className={`transition-colors uppercase tracking-wide h-full flex items-center font-label-lg text-label-lg ${
                  isPropsActive
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Props Finder
              </Link>

              {/* Referees */}
              <Link
                href="/referees"
                className={`transition-colors uppercase tracking-wide h-full flex items-center font-label-lg text-label-lg ${
                  isRefereesActive
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Referees
              </Link>

              {/* Dugout */}
              <Link
                href="/dugout"
                className={`transition-colors uppercase tracking-wide h-full flex items-center font-label-lg text-label-lg ${
                  isDugoutActive
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Dugout
              </Link>

              {/* Scouting */}
              <Link
                href="/scouting-studio"
                className={`transition-colors uppercase tracking-wide h-full flex items-center font-label-lg text-label-lg ${
                  isScoutingActive
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Scouting
              </Link>

              {/* Simulation */}
              <Link
                href="/simulation"
                className={`transition-colors uppercase tracking-wide h-full flex items-center font-label-lg text-label-lg ${
                  isSimulationActive
                    ? "text-primary font-semibold border-b-2 border-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                Simulation
              </Link>

              {/* Transfer Predictor */}
              <Link
                href="/transfer-predictor"
                className="text-on-surface-variant hover:text-on-surface transition-colors font-label-lg text-label-lg uppercase tracking-wide h-full flex items-center"
              >
                Transfer Predictor
              </Link>
            </nav>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-space-sm">
            {/* Star Favorites */}
            <div className="relative" ref={favoritesRef}>
              <button
                type="button"
                onClick={() => setFavoritesOpen(!favoritesOpen)}
                className="w-9 h-9 rounded flex items-center justify-center text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface transition-colors"
                title="Starred Favorites"
              >
                <span className="material-symbols-outlined text-[20px]">star</span>
              </button>
              {favoritesOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded bg-surface-container-lowest border border-outline-variant shadow-lg p-3 z-50">
                  <div className="font-label-xs text-label-xs uppercase tracking-wider text-outline pb-1 border-b border-outline-variant">
                    Starred Teams &amp; Players
                  </div>
                  <div className="text-xs text-on-surface-variant py-3 text-center">
                    Star teams or players across matchday views to monitor real-time props.
                  </div>
                </div>
              )}
            </div>

            {/* Global Search Button */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="flex items-center gap-space-sm px-space-sm py-1 rounded bg-surface-container-low border border-outline-variant text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">search</span>
              <span className="font-label-sm text-label-sm">Search</span>
              <kbd className="px-1 py-0.5 rounded bg-surface-container-lowest border border-outline-variant font-label-xs text-label-xs text-outline">
                Ctrl+K
              </kbd>
            </button>

            {/* Sign In Button */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="px-space-md py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container hover:text-on-primary-container font-label-lg text-label-lg transition-colors font-semibold"
            >
              Sign In
            </button>

            {/* Profile Avatar Icon */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">
                person
              </span>
            </button>
          </div>
        </div>

        {/* ── 3. Marquee News Ribbon (40px) ── */}
        <div className="h-[40px] bg-surface-container-lowest px-margin-desktop flex items-center border-b border-outline-variant overflow-hidden">
          <div className="flex items-center gap-space-sm pr-space-md border-r border-outline-variant shrink-0 bg-surface-container-lowest z-10">
            <span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary font-label-xs text-label-xs uppercase tracking-wider font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-on-secondary animate-ping" />
              LIVE NEWS
            </span>
          </div>

          <div className="relative flex-1 overflow-hidden">
            <div className="animate-marquee flex items-center gap-space-xl font-label-sm text-label-sm">
              <div className="flex items-center gap-space-xs">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-bold text-label-xs">
                  [TRANSFERS]
                </span>
                <span className="font-semibold text-on-surface">
                  Real Madrid agree €110M terms for RB Leipzig CB prospect
                </span>
                <span className="text-outline-variant font-label-xs">• 4m ago</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-primary font-bold text-label-xs">
                  [PREMIER LEAGUE]
                </span>
                <span className="font-semibold text-on-surface">
                  Arsenal v Man City: Tactical possession model predicts 1.94 xG vs 1.82 xG
                </span>
                <span className="text-outline-variant font-label-xs">• 12m ago</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-tertiary font-bold text-label-xs">
                  [LA LIGA]
                </span>
                <span className="font-semibold text-on-surface">
                  FC Barcelona submit official squad list with 4 youth telemetry markers
                </span>
                <span className="text-outline-variant font-label-xs">• 26m ago</span>
              </div>
              <div className="flex items-center gap-space-xs">
                <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-secondary font-bold text-label-xs">
                  [TRANSFERS]
                </span>
                <span className="font-semibold text-on-surface">
                  Bayern Munich open valuation audit for defensive midfielder index
                </span>
                <span className="text-outline-variant font-label-xs">• 35m ago</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <GlobalSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </>
  );
}
