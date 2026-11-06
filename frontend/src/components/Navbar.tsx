"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, ChevronDown, Menu, X } from "lucide-react";
import { fetchHealth } from "@/lib/api";

/* ── News ticker items ── */
const TICKER_ITEMS = [
  { club: "Arsenal", text: "Saka named PL Player of the Month" },
  { club: "Man City", text: "Haaland reaches 100 PL goals milestone" },
  { club: "Liverpool", text: "Salah extends contract through 2027" },
  { club: "Chelsea", text: "Palmer wins Young Player award" },
  { club: "Newcastle", text: "Gordon called up to England squad" },
  { club: "Bournemouth", text: "Semenyo scores brace in weekend win" },
  { club: "Crystal Palace", text: "Eze shortlisted for Goal of the Month" },
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

/* ── Main navigation items ── */
const NAV_ITEMS = [
  { label: "Matches", href: "/" },
  { label: "Table", href: "/" },
  { label: "Statistics", href: "/", active: true },
  { label: "Fantasy", href: "/" },
  { label: "News", href: "/" },
  { label: "Injuries", href: "/" },
  { label: "Players", href: "/" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [apiLive, setApiLive] = useState<boolean | null>(null);

  useEffect(() => {
    fetchHealth()
      .then(() => setApiLive(true))
      .catch(() => setApiLive(false));
  }, []);

  return (
    <header className="w-full sticky top-0 z-40">
      {/* ═══ Top Utility Strip ═══ */}
      <div className="w-full bg-pl-utility border-b border-pl-border">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-8">
          <div className="hidden md:flex items-center gap-4">
            {UTILITY_LINKS.map((link) => (
              <span
                key={link}
                className="text-[11px] text-pl-text-muted hover:text-white cursor-pointer transition-colors"
              >
                {link}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-3">
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
          </div>
        </div>
      </div>

      {/* ═══ Main Navigation Bar ═══ */}
      <nav className="w-full bg-pl-dark border-b border-pl-border">
        <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-full bg-pl-purple flex items-center justify-center">
              <span className="text-lg">⚽</span>
            </div>
            <div className="flex flex-col leading-none">
              <span className="text-[13px] font-bold tracking-wide text-white">
                PREMIER LEAGUE
              </span>
              <span className="text-[9px] tracking-[0.2em] text-pl-green font-semibold">
                ANALYTICS PLATFORM
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <span
                key={item.label}
                className={`px-3 py-2 text-[13px] font-semibold cursor-pointer transition-colors ${
                  item.active
                    ? "text-white"
                    : "text-pl-text-secondary hover:text-white"
                }`}
              >
                {item.label}
              </span>
            ))}
            <span className="px-3 py-2 text-[13px] font-semibold text-pl-text-secondary hover:text-white cursor-pointer flex items-center gap-1">
              More <ChevronDown size={12} />
            </span>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="p-2 text-pl-text-secondary hover:text-white transition-colors">
              <Search size={18} />
            </button>
            <Link href="/comparison" className="hidden sm:block">
              <button className="pl-btn-magenta text-[12px] px-4 py-1.5">
                Stats Centre
              </button>
            </Link>
            <button
              className="lg:hidden p-2 text-white"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-pl-dark border-t border-pl-border px-4 py-3 animate-fade-in">
            {NAV_ITEMS.map((item) => (
              <span
                key={item.label}
                className="block py-2 text-sm text-pl-text-secondary hover:text-white cursor-pointer"
              >
                {item.label}
              </span>
            ))}
          </div>
        )}
      </nav>

      {/* ═══ News Ticker Strip ═══ */}
      <div className="ticker-strip h-9">
        <div className="flex items-center animate-ticker-scroll">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-6 shrink-0">
              <span className="text-[10px] font-bold text-pl-green uppercase">
                {item.club}
              </span>
              <span className="text-[11px] text-pl-text-secondary">
                {item.text}
              </span>
              <span className="text-pl-border mx-2">│</span>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
