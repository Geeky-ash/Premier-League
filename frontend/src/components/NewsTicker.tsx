"use client";

import React, { useState } from "react";
import Image from "next/image";
import { getClubCrest } from "@/lib/logos";
import NewsDetailModal, { NewsItem } from "@/components/NewsDetailModal";
import { ChevronRight, Radio } from "lucide-react";

export const DEFAULT_NEWS_ITEMS: NewsItem[] = [
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

export default function NewsTicker({ news = DEFAULT_NEWS_ITEMS }: { news?: NewsItem[] }) {
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  return (
    <>
      <div className="bg-slate-950/80 border-y border-white/10 px-4 py-2 flex items-center gap-3 overflow-hidden text-xs">
        <div className="flex items-center gap-1.5 font-bold text-pl-magenta uppercase tracking-wider shrink-0 bg-pl-magenta/10 px-2 py-0.5 rounded">
          <Radio size={12} className="animate-pulse" />
          <span>Newsfeed</span>
        </div>
        <div className="flex items-center gap-6 overflow-x-auto no-scrollbar whitespace-nowrap">
          {news.map((item, idx) => (
            <button
              key={`${item.club}-${idx}`}
              type="button"
              onClick={() => setSelectedNews(item)}
              className="inline-flex items-center gap-2 text-slate-300 hover:text-pl-cyan transition-colors cursor-pointer group"
            >
              <Image
                src={getClubCrest(item.club)}
                alt={item.club}
                width={16}
                height={16}
                className="shrink-0"
                unoptimized
              />
              <span className="font-semibold text-white">{item.club}:</span>
              <span className="group-hover:underline">{item.headline}</span>
              <ChevronRight size={12} className="opacity-40 group-hover:opacity-100 text-pl-cyan" />
            </button>
          ))}
        </div>
      </div>

      <NewsDetailModal
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
      />
    </>
  );
}
