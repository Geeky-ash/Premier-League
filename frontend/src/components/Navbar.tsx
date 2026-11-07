"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Search,
  Star,
  User,
  ChevronDown,
  Clock,
  Radio,
  Trophy,
  Sliders,
  Crosshair,
  Menu,
  X,
  ArrowRight,
} from "lucide-react";
import { GLOBAL_LEAGUES, getLeagueLogo, getLeagueFallbackLogo } from "@/lib/logos";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import AuthModal from "@/components/AuthModal";
import NewsTicker from "@/components/NewsTicker";

export default function Navbar() {
  const pathname = usePathname();

  const [leaguesOpen, setLeaguesOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<"signin" | "register">("signin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const leaguesRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (leaguesRef.current && !leaguesRef.current.contains(e.target as Node)) {
        setLeaguesOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
      if (favoritesRef.current && !favoritesRef.current.contains(e.target as Node)) {
        setFavoritesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut Ctrl+K to open Global Search
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

  const isFixturesActive = pathname === "/fixtures" || pathname === "/";
  const isInPlayActive = pathname === "/inplay-fouls";
  const isPropsActive = pathname === "/transfer-predictor";
  const isLeaguesActive = pathname.startsWith("/league");

  return (
    <>
      {/* ── Top Announcement Strip (Cohere Microcopy Bar) ── */}
      <aside className="w-full h-9 bg-cohere-black text-white px-4 flex items-center justify-between text-xs font-body tracking-tight z-50">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 truncate">
            <span className="w-1.5 h-1.5 rounded-full bg-cohere-coral shrink-0" />
            <span className="font-mono text-[11px] uppercase tracking-wider text-cohere-hairline">
              STATIONARY & IN-PLAY STATS CENTRE — ENTERPRISE AI ANALYTICS
            </span>
          </div>
          <Link
            href="/inplay-fouls"
            className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-white hover:text-cohere-coral underline transition-colors shrink-0"
          >
            <span>Live Webhook Feed</span>
            <ArrowRight size={12} />
          </Link>
        </div>
      </aside>

      {/* ── Main Header Bar ── */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-cohere-hairline">
        <div className="max-w-[1440px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* ── Left Brand Area ── */}
          <div className="flex items-center gap-6 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2.5 group transition-transform active:scale-95"
            >
              <div className="w-7 h-7 rounded-xs bg-cohere-primary text-white flex items-center justify-center font-display font-bold text-xs tracking-tight">
                C
              </div>
              <span className="font-display font-bold text-lg tracking-tight text-cohere-primary group-hover:text-cohere-coral transition-colors">
                PlayerStats
              </span>
              <span className="font-mono text-[10px] uppercase text-cohere-slate border border-cohere-hairline px-1.5 py-0.5 rounded-xs">
                v2.6
              </span>
            </Link>
          </div>

          {/* ── Center View Tabs ── */}
          <nav className="hidden md:flex items-center gap-2">
            {/* Fixtures Tab */}
            <Link
              href="/fixtures"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all ${
                isFixturesActive
                  ? "blog-filter-chip font-semibold"
                  : "text-cohere-ink hover:underline hover:text-cohere-primary"
              }`}
            >
              <Clock size={14} className={isFixturesActive ? "text-cohere-coral" : "text-cohere-slate"} />
              <span>Fixtures</span>
            </Link>

            {/* In-Play Tab with Active Badge */}
            <Link
              href="/inplay-fouls"
              className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium transition-all ${
                isInPlayActive
                  ? "blog-filter-chip font-semibold"
                  : "text-cohere-ink hover:underline hover:text-cohere-primary"
              }`}
            >
              <Radio size={14} className={isInPlayActive ? "text-cohere-coral" : "text-cohere-coral"} />
              <span>In-Play</span>
              <span className="chip-coral px-1.5 py-0 text-[10px]">
                4
              </span>
            </Link>

            {/* Leagues Dropdown */}
            <div className="relative" ref={leaguesRef}>
              <button
                type="button"
                onClick={() => setLeaguesOpen(!leaguesOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all ${
                  isLeaguesActive || leaguesOpen
                    ? "blog-filter-chip font-semibold"
                    : "text-cohere-ink hover:underline hover:text-cohere-primary"
                }`}
              >
                <Trophy size={14} className={isLeaguesActive ? "text-cohere-coral" : "text-cohere-slate"} />
                <span>Leagues</span>
                <ChevronDown
                  size={12}
                  className={`transition-transform duration-200 ${
                    leaguesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {leaguesOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 sm:w-80 rounded-sm bg-white border border-cohere-hairline shadow-xl py-2 z-50 animate-slide-up">
                  <div className="px-4 py-1.5 text-[10px] font-mono uppercase tracking-wider text-cohere-muted border-b border-cohere-hairline">
                    World Competitions
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1">
                    {GLOBAL_LEAGUES.map((league) => (
                      <Link
                        key={league.slug}
                        href={`/league/${league.slug}`}
                        onClick={() => setLeaguesOpen(false)}
                        className="flex items-center justify-between w-full px-4 py-2 text-sm hover:bg-[#eeece7] transition-colors"
                      >
                        <div className="flex items-center min-w-0 pr-3">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getLeagueLogo(league.slug)}
                            alt=""
                            className="w-5 h-5 flex-shrink-0 object-contain mr-3"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              const fallback = getLeagueFallbackLogo(league.slug);
                              if (fallback && e.currentTarget.src !== fallback) {
                                e.currentTarget.src = fallback;
                              } else {
                                e.currentTarget.style.display = "none";
                              }
                            }}
                          />
                          <span className="font-medium text-cohere-primary truncate">
                            {league.name}
                          </span>
                        </div>
                        <span className="text-[10px] font-mono text-cohere-muted shrink-0 uppercase tracking-wider">
                          {league.countryTag}
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
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all ${
                isPropsActive
                  ? "blog-filter-chip font-semibold"
                  : "text-cohere-ink hover:underline hover:text-cohere-primary"
              }`}
            >
              <Crosshair size={14} className={isPropsActive ? "text-cohere-coral" : "text-cohere-slate"} />
              <span>Props Finder</span>
            </Link>

            {/* Referees */}
            <Link
              href="/fixtures"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-cohere-ink hover:underline hover:text-cohere-primary transition-all"
            >
              <Sliders size={14} className="text-cohere-slate" />
              <span>Referees</span>
            </Link>

            {/* Scouting Studio */}
            <Link
              href="/scouting-studio"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all ${
                pathname === "/scouting-studio"
                  ? "blog-filter-chip font-semibold"
                  : "text-cohere-ink hover:underline hover:text-cohere-primary"
              }`}
            >
              <span>Scouting</span>
            </Link>

            {/* Match Predictor */}
            <Link
              href="/match-predictor"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium transition-all ${
                pathname === "/match-predictor"
                  ? "blog-filter-chip font-semibold"
                  : "text-cohere-ink hover:underline hover:text-cohere-primary"
              }`}
            >
              <span>Simulation</span>
            </Link>
          </nav>

          {/* ── Right Action Controls ── */}
          <div className="flex items-center gap-3">
            {/* Favorites (Star button) */}
            <div className="relative" ref={favoritesRef}>
              <button
                type="button"
                onClick={() => setFavoritesOpen(!favoritesOpen)}
                className="w-9 h-9 rounded-full flex items-center justify-center text-cohere-slate hover:text-cohere-ink hover:bg-cohere-soft-stone transition-colors"
                title="Favorite Teams & Players"
                aria-label="Favorites"
              >
                <Star size={16} />
              </button>

              {favoritesOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-sm bg-white border border-cohere-hairline shadow-lg p-3 z-50 animate-slide-up">
                  <div className="flex items-center justify-between pb-2 border-b border-cohere-hairline">
                    <span className="text-xs font-semibold text-cohere-primary flex items-center gap-1.5">
                      <Star size={12} className="text-cohere-coral fill-cohere-coral" /> Saved Favorites
                    </span>
                    <span className="text-[10px] font-mono text-cohere-muted">3 pinned</span>
                  </div>
                  <div className="py-2 space-y-1">
                    <Link
                      href="/team/derby-county"
                      onClick={() => setFavoritesOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xs hover:bg-cohere-soft-stone text-xs text-cohere-ink transition-colors"
                    >
                      <span className="font-medium">Derby County</span>
                      <span className="text-[10px] font-mono text-cohere-coral">Championship</span>
                    </Link>
                    <Link
                      href="/player/lamine-yamal"
                      onClick={() => setFavoritesOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xs hover:bg-cohere-soft-stone text-xs text-cohere-ink transition-colors"
                    >
                      <span className="font-medium">Lamine Yamal</span>
                      <span className="text-[10px] font-mono text-cohere-coral">FC Barcelona</span>
                    </Link>
                    <Link
                      href="/team/bolton-wanderers"
                      onClick={() => setFavoritesOpen(false)}
                      className="flex items-center justify-between p-2 rounded-xs hover:bg-cohere-soft-stone text-xs text-cohere-ink transition-colors"
                    >
                      <span className="font-medium">Bolton Wanderers</span>
                      <span className="text-[10px] font-mono text-cohere-coral">Championship</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Global Search Trigger (Magnifying Glass) */}
            <button
              type="button"
              onClick={() => setSearchModalOpen(true)}
              className="w-9 h-9 rounded-full flex items-center justify-center text-cohere-slate hover:text-cohere-ink hover:bg-cohere-soft-stone transition-colors"
              title="Global Search (Ctrl+K)"
              aria-label="Search"
            >
              <Search size={16} />
            </button>

            {/* Primary CTA ("Sign In" / "Start Free Trial") */}
            <button
              type="button"
              onClick={() => {
                setAuthInitialTab("signin");
                setAuthModalOpen(true);
              }}
              className="button-primary hidden sm:inline-flex"
            >
              <span>Sign In</span>
            </button>

            {/* User Profile Menu */}
            <div className="relative" ref={profileRef}>
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="w-9 h-9 rounded-full bg-cohere-soft-stone border border-cohere-hairline flex items-center justify-center text-cohere-primary hover:border-cohere-primary transition-colors"
                title="Account Menu"
                aria-label="Account"
              >
                <User size={15} />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-sm bg-white border border-cohere-hairline shadow-lg p-2 z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-cohere-hairline">
                    <div className="text-xs font-semibold text-cohere-primary">Enterprise Account</div>
                    <div className="text-[10px] font-mono text-cohere-coral">Free Prototyping Tier</div>
                  </div>
                  <div className="py-1">
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setAuthInitialTab("signin");
                        setAuthModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-cohere-ink hover:bg-cohere-soft-stone rounded-xs transition-colors"
                    >
                      Sign In
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileOpen(false);
                        setAuthInitialTab("register");
                        setAuthModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 text-xs text-cohere-coral hover:bg-cohere-coral/10 rounded-xs font-semibold transition-colors"
                    >
                      Start Free Trial &rarr;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-cohere-slate hover:text-cohere-ink hover:bg-cohere-soft-stone transition-colors"
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* ── Mobile Navigation Drawer ── */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-cohere-hairline px-4 py-4 space-y-2 animate-slide-up shadow-md">
            <Link
              href="/fixtures"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-xs text-sm font-medium text-cohere-ink hover:bg-cohere-soft-stone"
            >
              <Clock size={14} className="text-cohere-coral" /> Fixtures Hub
            </Link>
            <Link
              href="/inplay-fouls"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between p-2 rounded-xs text-sm font-medium text-cohere-ink hover:bg-cohere-soft-stone"
            >
              <div className="flex items-center gap-2">
                <Radio size={14} className="text-cohere-coral" /> In-Play Live
              </div>
              <span className="chip-coral px-1.5 py-0 text-[10px]">4 Live</span>
            </Link>
            <Link
              href="/transfer-predictor"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-xs text-sm font-medium text-cohere-ink hover:bg-cohere-soft-stone"
            >
              <Crosshair size={14} className="text-cohere-coral" /> Props Finder
            </Link>
            <Link
              href="/scouting-studio"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-xs text-sm font-medium text-cohere-ink hover:bg-cohere-soft-stone"
            >
              Scouting Studio
            </Link>
            <Link
              href="/match-predictor"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 p-2 rounded-xs text-sm font-medium text-cohere-ink hover:bg-cohere-soft-stone"
            >
              Match Simulation
            </Link>
            <div className="pt-3 border-t border-cohere-hairline">
              <div className="text-[10px] font-mono uppercase text-cohere-muted px-2 pb-1.5">
                Competitions
              </div>
              <div className="grid grid-cols-2 gap-1">
                {GLOBAL_LEAGUES.slice(0, 6).map((l) => (
                  <Link
                    key={l.slug}
                    href={`/league/${l.slug}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-xs text-xs text-cohere-body-muted hover:text-cohere-ink hover:bg-cohere-soft-stone flex items-center gap-2"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={getLeagueLogo(l.slug)}
                      alt=""
                      className="w-4 h-4 flex-shrink-0 object-contain mr-1.5"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        const fallback = getLeagueFallbackLogo(l.slug);
                        if (fallback && e.currentTarget.src !== fallback) {
                          e.currentTarget.src = fallback;
                        } else {
                          e.currentTarget.style.display = "none";
                        }
                      }}
                    />
                    <span>{l.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ── Real-Time Animated World Football News Ribbon ── */}
      <NewsTicker />

      {/* Global Autocomplete Search Modal */}
      <GlobalSearchModal
        open={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      {/* Auth Modal */}
      <AuthModal
        open={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialTab={authInitialTab}
      />
    </>
  );
}
