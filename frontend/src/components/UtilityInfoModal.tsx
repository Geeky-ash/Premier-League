"use client";

import React from "react";
import { X, ExternalLink, Shield, CheckCircle } from "lucide-react";
import { getLeagueLogo } from "@/lib/logos";

interface Props {
  title: string | null;
  onClose: () => void;
}

const UTILITY_DATA: Record<string, { desc: string; highlights: string[]; linkText: string; url: string }> = {
  Shop: {
    desc: "Official Premier League online store with authentic match kits, training gear, and licensed retro collections.",
    highlights: ["Official 2024/25 Club Kits", "Custom Player Printing", "Worldwide Express Delivery"],
    linkText: "Visit Premier League Official Shop",
    url: "https://shop.premierleague.com",
  },
  "About Us": {
    desc: "The Premier League is the top tier of England's football league system, contested by 20 clubs, operating as a corporation with member clubs as shareholders.",
    highlights: ["Founded 20 February 1992", "20 Shareholder Clubs", "Global Broadcast Reach to 189 Countries"],
    linkText: "Learn more about the Governance",
    url: "https://www.premierleague.com/about",
  },
  "Football & Community": {
    desc: "Investing across the game through Premier League Primary Stars, community projects, and state-of-the-art facilities funding.",
    highlights: ["£1.6bn distributed across 2022-2025", "18,000+ Primary Schools supported", "Premier League Kicks nationwide"],
    linkText: "Explore Community Initiatives",
    url: "https://www.premierleague.com/communities",
  },
  Events: {
    desc: "Global Fan Festivals, Premier League Summer Series tours, Hall of Fame inductions, and live community activations.",
    highlights: ["Premier League Mornings Live", "Summer Series Pre-season Tours", "Hall of Fame Ceremony 2025"],
    linkText: "View Event Calendar",
    url: "https://www.premierleague.com/events",
  },
  Media: {
    desc: "Accreditation services, broadcast rights holders portals, press releases, and rights management.",
    highlights: ["Press & Media Inquiries", "Broadcast Schedule Releases", "Official Stat Packs"],
    linkText: "Access Media Centre",
    url: "https://www.premierleague.com/media",
  },
  "The Archive": {
    desc: "Explore over 30 years of Premier League history: legendary goals, classic title races, Hall of Fame inductees, and all-time records.",
    highlights: ["Every Goal from 1992 to Date", "Centurions & Golden Boot Winners", "Classic Matchday Highlights"],
    linkText: "Browse Full Historical Archives",
    url: "https://www.premierleague.com/history",
  },
  Fantasy: {
    desc: "Fantasy Premier League (FPL) — the world's biggest fantasy football game with over 11 million managers.",
    highlights: ["£100.0m Budget Management", "Weekly Transfers & Wildcards", "FPL AI Squad Analytics Integration"],
    linkText: "Play Fantasy Premier League",
    url: "https://fantasy.premierleague.com",
  },
  Injuries: {
    desc: "Official team-by-team injury tracker with medical status, expected return dates, and matchday fitness updates.",
    highlights: ["Live Squad Availability", "Hamstring & Knee Protocol Updates", "Pre-Match Press Conference Intel"],
    linkText: "View Complete Injury Roster",
    url: "https://www.premierleague.com/news",
  },
};

export default function UtilityInfoModal({ title, onClose }: Props) {
  if (!title) return null;

  const data = UTILITY_DATA[title] || {
    desc: "Official Premier League informational resource and verified portal.",
    highlights: ["Official Verified League Data", "Real-Time Updates", "Global Coverage"],
    linkText: "Visit premierleague.com",
    url: "https://www.premierleague.com",
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="w-full max-w-md mx-4 bg-white rounded-lg border border-cohere-hairline shadow-2xl overflow-hidden animate-slide-up font-body text-cohere-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 bg-cohere-soft-stone border-b border-cohere-hairline relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-cohere-muted hover:text-cohere-ink transition-colors"
          >
            <X size={18} />
          </button>
          <div className="flex items-center gap-3">
            <img
              src={getLeagueLogo()}
              alt="Premier League"
              className="w-8 h-8 object-contain"
            />
            <div>
              <span className="text-[10px] font-mono font-bold text-cohere-coral uppercase tracking-widest">
                Official Directory
              </span>
              <h3 className="text-xl font-display font-medium text-cohere-primary">{title}</h3>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-sm text-cohere-body-muted leading-relaxed">
            {data.desc}
          </p>

          <div className="space-y-2 pt-2 font-mono">
            {data.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-cohere-primary">
                <CheckCircle size={14} className="text-cohere-deep-green shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-cohere-hairline flex items-center justify-between">
            <a
              href={data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="button-primary text-xs py-2 px-4 flex items-center gap-2 font-mono"
            >
              <span>{data.linkText}</span>
              <ExternalLink size={12} />
            </a>
            <button
              onClick={onClose}
              className="text-xs font-mono text-cohere-slate hover:text-cohere-ink transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
