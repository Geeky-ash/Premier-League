"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Search,
  ChevronDown,
  Menu,
  X,
  TrendingUp,
  Trophy,
  Crosshair,
  Users,
} from "lucide-react";
import { fetchHealth } from "@/lib/api";
import { getLeagueLogo, getClubCrest } from "@/lib/logos";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import AuthModal from "@/components/AuthModal";
import NewsDetailModal, { NewsItem } from "@/components/NewsDetailModal";
import UtilityInfoModal from "@/components/UtilityInfoModal";

/* ── Enriched news ticker items ── */
const TICKER_NEWS: NewsItem[] = [
  {
    club: "Arsenal",
    headline: "Bukayo Saka named Premier League Player of the Month",
    summary:
      "Bukayo Saka has won the Premier League Player of the Month award following three goals and two assists in three consecutive Arsenal victories.",
    date: "November 2026",
    category: "Player Award",
  },
  {
    club: "Man City",
    headline: "Erling Haaland reaches historic 100 Premier League goals milestone",
    summary:
      "The Norwegian striker reaches the century mark in record matches, solidifying Manchester City's attacking dominance at the summit of the table.",
    date: "November 2026",
    category: "Milestone",
  },
  {
    club: "Liverpool",
    headline: "Mohamed Salah commits future to Anfield through 2027",
    summary:
      "Liverpool have officially confirmed a contract extension for Egyptian king Mohamed Salah, keeping the forward at Anfield for three more seasons.",
    date: "November 2026",
    category: "Contract Update",
  },
  {
    club: "Chelsea",
    headline: "Cole Palmer claims Premier League Young Player of the Month",
    summary:
      "Cole Palmer's stellar playmaking orchestrates four goals in Stamford Bridge masterclass, earning unanimous recognition from the awards panel.",
    date: "November 2026",
    category: "Young Player Award",
  },
  {
    club: "Newcastle",
    headline: "Anthony Gordon selected for Senior England National Squad",
    summary:
      "Following lethal transition displays for Newcastle United, Gordon receives his international call-up for upcoming UEFA qualifiers.",
    date: "November 2026",
    category: "International Duty",
  },
  {
    club: "Bournemouth",
    headline: "Antoine Semenyo double propels Cherries into top-half contention",
    summary:
      "Antoine Semenyo delivers a clinical brace at the Vitality Stadium as Bournemouth dismantle stubborn defensive opposition.",
    date: "November 2026",
    category: "Matchday Report",
  },
  {
    club: "Crystal Palace",
    headline: "Eberechi Eze thunderbolt nominated for PL Goal of the Month",
    summary:
      "Eze's 28-yard curling free-kick into the top stanchion at Selhurst Park is shortlisted for the official Premier League Goal of the Month.",
    date: "November 2026",
    category: "Goal of the Month",
  },
];

/* ── Top utility strip links ── */
const UTILITY_LINKS = [
  "Premier League",
  "Shop",
  "About Us",
  "Football & Community",
  "Events",
  "Media",
  "The Archive",
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [moreDropdownOpen, setMoreDropdownOpen] = useState(false);
  const [apiLive, setApiLive] = useState<boolean | null>(null);

  // Modals state
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: "signin" | "register" }>({
    open: false,
    tab: "signin",
  });
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);
  const [utilityModalTitle, setUtilityModalTitle] = useState<string | null>(null);

  useEffect(() => {
    fetchHealth()
      .then(() => setApiLive(true))
      .catch(() => setApiLive(false));
  }, []);

  const moreTools = [
    { label: "Fixtures & Referees", href: "/fixtures", icon: Trophy, tag: "PGMOL" },
    { label: "Opposition Stats", href: "/opposition", icon: Crosshair, tag: "Heatmap" },
    { label: "Season Leaderboards", href: "/leaderboards", icon: Trophy, tag: "Leaders" },
    { label: "In-Play Fouls & Alerts", href: "/inplay-fouls", icon: TrendingUp, tag: "Live" },
    { label: "Transfer Predictor", href: "/transfer-predictor", icon: TrendingUp, tag: "OLS" },
    { label: "Match Predictor", href: "/match-predictor", icon: Trophy, tag: "XGBoost" },
    { label: "Scouting Studio", href: "/scouting-studio", icon: Crosshair, tag: "K-Means" },
    { label: "1v1 Player Comparison", href: "/comparison", icon: Users, tag: "Matrix" },
  ];

  return (
    <>
      <header className="w-full sticky top-0 z-40">
        {/* ═══ 1. Top Utility Strip ═══ */}
        <div className="w-full bg-pl-utility border-b border-pl-border">
          <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-8">
            <div className="hidden md:flex items-center gap-4">
              {UTILITY_LINKS.map((link) => (
                <button
                  key={link}
                  onClick={() => {
                    if (link === "Premier League") router.push("/");
                    else setUtilityModalTitle(link);
                  }}
                  className="text-[11px] text-pl-text-muted hover:text-white transition-colors"
                >
                  {link}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-4">
              {/* API Health Indicator */}
              <div className="flex items-center gap-1.5">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    apiLive === true
                      ? "bg-pl-green animate-pulse-glow"
                      : apiLive === false
                      ? "bg-pl-magenta"
                      : "bg-pl-text-muted"
                  }`}
                />
                <span className="text-[10px] text-pl-text-muted">
                  ML Engine {apiLive ? "Live" : apiLive === false ? "Offline" : "…"}
                </span>
              </div>

              {/* Utility Auth Pill */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setAuthModal({ open: true, tab: "signin" })}
                  className="text-[11px] text-pl-text-secondary hover:text-white transition-colors"
                >
                  Sign in
                </button>
                <span className="text-pl-border">|</span>
                <button
                  onClick={() => setAuthModal({ open: true, tab: "register" })}
                  className="text-[11px] font-bold text-pl-magenta hover:underline"
                >
                  Join myPL
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══ 2. Main Navigation Bar ═══ */}
        <nav className="w-full bg-pl-dark border-b border-pl-border">
          <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-16">
            {/* Official Logo Brand */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-10 h-10 rounded-full bg-white/10 p-1.5 flex items-center justify-center border border-pl-border group-hover:border-pl-cyan transition-colors">
                <img
                  src={getLeagueLogo()}
                  alt="Premier League Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-[14px] font-extrabold tracking-wide text-white group-hover:text-pl-cyan transition-colors">
                  PREMIER LEAGUE
                </span>
                <span className="text-[9px] tracking-[0.25em] text-pl-green font-bold">
                  ANALYTICS PLATFORM
                </span>
              </div>
            </Link>

            {/* Desktop Nav Items */}
            <div className="hidden lg:flex items-center gap-1">
              <Link
                href="/fixtures"
                className={`px-3 py-2 text-[13px] font-semibold transition-colors ${
                  pathname === "/fixtures" ? "text-white font-bold" : "text-pl-text-secondary hover:text-white"
                }`}
              >
                Fixtures
              </Link>
              <Link
                href="/match-predictor"
                className={`px-3 py-2 text-[13px] font-semibold transition-colors ${
                  pathname === "/match-predictor" ? "text-white" : "text-pl-text-secondary hover:text-white"
                }`}
              >
                Matches
              </Link>
              <Link
                href="/opposition"
                className={`px-3 py-2 text-[13px] font-semibold transition-colors ${
                  pathname === "/opposition" ? "text-white" : "text-pl-text-secondary hover:text-white"
                }`}
              >
                Opposition
              </Link>
              <Link
                href="/leaderboards"
                className={`px-3 py-2 text-[13px] font-semibold transition-colors ${
                  pathname === "/leaderboards" ? "text-white" : "text-pl-text-secondary hover:text-white"
                }`}
              >
                Leaderboards
              </Link>
              <Link
                href="/inplay-fouls"
                className={`px-3 py-2 text-[13px] font-semibold transition-colors flex items-center gap-1.5 ${
                  pathname === "/inplay-fouls" ? "text-pl-magenta font-bold" : "text-pl-text-secondary hover:text-pl-magenta"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-pl-magenta animate-pulse" />
                <span>In-Play</span>
              </Link>
              <Link
                href="/"
                className={`px-3 py-2 text-[13px] font-semibold transition-colors ${
                  pathname === "/" ? "text-white font-bold" : "text-pl-text-secondary hover:text-white"
                }`}
              >
                Stats Centre
              </Link>
              <Link
                href="/scouting-studio"
                className={`px-3 py-2 text-[13px] font-semibold transition-colors ${
                  pathname === "/scouting-studio" ? "text-white" : "text-pl-text-secondary hover:text-white"
                }`}
              >
                Scouting
              </Link>

              {/* More Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMoreDropdownOpen(!moreDropdownOpen)}
                  onBlur={() => setTimeout(() => setMoreDropdownOpen(false), 200)}
                  className="px-3 py-2 text-[13px] font-semibold text-pl-text-secondary hover:text-white flex items-center gap-1 transition-colors"
                >
                  More <ChevronDown size={12} className={`transition-transform ${moreDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {moreDropdownOpen && (
                  <div className="absolute right-0 top-full mt-1 w-64 bg-pl-dark border border-pl-border rounded-pl shadow-2xl p-2 space-y-1 animate-slide-up z-50">
                    <div className="text-[10px] font-bold text-pl-text-muted uppercase px-2 py-1">
                      Predictive Modules
                    </div>
                    {moreTools.map((t) => (
                      <Link
                        key={t.href}
                        href={t.href}
                        className="flex items-center justify-between p-2 rounded hover:bg-pl-purple transition-colors group"
                      >
                        <div className="flex items-center gap-2">
                          <t.icon size={15} className="text-pl-cyan" />
                          <span className="text-xs font-semibold text-white group-hover:text-pl-cyan">
                            {t.label}
                          </span>
                        </div>
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-pl-purple text-pl-green">
                          {t.tag}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 text-pl-text-secondary hover:text-white transition-colors rounded-full hover:bg-white/5"
                title="Search players and modules"
              >
                <Search size={18} />
              </button>

              <Link href="/comparison" className="hidden sm:block">
                <button className="pl-btn-magenta text-[12px] px-4 py-1.5 shadow">
                  Stats Centre
                </button>
              </Link>

              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 text-white"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileOpen && (
            <div className="lg:hidden bg-pl-dark border-t border-pl-border px-4 py-4 space-y-2 animate-fade-in">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-semibold text-white"
              >
                Statistics (Dashboard)
              </Link>
              <Link
                href="/transfer-predictor"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-semibold text-pl-text-secondary hover:text-white"
              >
                Transfer Value Predictor
              </Link>
              <Link
                href="/match-predictor"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-semibold text-pl-text-secondary hover:text-white"
              >
                Match Outcome Predictor
              </Link>
              <Link
                href="/scouting-studio"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-semibold text-pl-text-secondary hover:text-white"
              >
                Scouting Studio
              </Link>
              <Link
                href="/comparison"
                onClick={() => setMobileOpen(false)}
                className="block py-2 text-sm font-semibold text-pl-text-secondary hover:text-white"
              >
                Player Comparison
              </Link>
              <div className="pt-2 border-t border-pl-border flex gap-2">
                <button
                  onClick={() => { setAuthModal({ open: true, tab: "signin" }); setMobileOpen(false); }}
                  className="flex-1 py-2 text-xs font-bold rounded-full bg-pl-purple text-white border border-pl-border"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { setAuthModal({ open: true, tab: "register" }); setMobileOpen(false); }}
                  className="flex-1 py-2 text-xs font-bold rounded-full bg-pl-magenta text-white"
                >
                  Join myPL
                </button>
              </div>
            </div>
          )}
        </nav>

        {/* ═══ 3. Animated News Ticker Strip with Official Club Crests ═══ */}
        <div className="ticker-strip h-10 border-b border-pl-border">
          <div className="flex items-center animate-ticker-scroll cursor-pointer">
            {[...TICKER_NEWS, ...TICKER_NEWS].map((item, i) => (
              <button
                key={i}
                onClick={() => setSelectedNews(item)}
                className="flex items-center gap-2.5 px-6 shrink-0 hover:bg-white/5 transition-colors h-10 text-left"
              >
                <img
                  src={getClubCrest(item.club, 50)}
                  alt={item.club}
                  className="w-4 h-4 object-contain shrink-0"
                />
                <span className="text-[10px] font-bold text-pl-green uppercase tracking-wider">
                  {item.club}
                </span>
                <span className="text-[11px] text-pl-text-secondary hover:text-white transition-colors">
                  {item.headline}
                </span>
                <span className="text-pl-border mx-3">│</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Global Modals */}
      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <AuthModal
        open={authModal.open}
        initialTab={authModal.tab}
        onClose={() => setAuthModal({ open: false, tab: "signin" })}
      />
      <NewsDetailModal news={selectedNews} onClose={() => setSelectedNews(null)} />
      <UtilityInfoModal title={utilityModalTitle} onClose={() => setUtilityModalTitle(null)} />
    </>
  );
}
