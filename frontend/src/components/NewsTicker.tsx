"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getGlobalClubCrest } from "@/lib/logos";
import NewsDetailModal, { NewsItem } from "@/components/NewsDetailModal";
import { fetchLiveNews, LiveNewsItem } from "@/lib/api";

export const DEFAULT_NEWS_ITEMS: NewsItem[] = [
  {
    id: "def_1",
    club: "Arsenal",
    headline: "Bukayo Saka named Premier League Player of the Month following masterclass displays",
    summary:
      "Bukayo Saka has won the Premier League Player of the Month award following three goals and two assists in three consecutive Arsenal victories.",
    timestamp: "12m ago",
    category: "PREMIER LEAGUE",
    source: "BBC Football",
    link: "https://www.bbc.co.uk/sport/football",
  },
  {
    id: "def_2",
    club: "Man City",
    headline: "Erling Haaland reaches historic 100-goal European milestone in record appearances",
    summary:
      "The Norwegian striker reaches the century mark in record matches, solidifying Manchester City's attacking dominance at the summit.",
    timestamp: "45m ago",
    category: "CHAMPIONS LEAGUE",
    source: "The Guardian",
    link: "https://www.theguardian.com/football",
  },
  {
    id: "def_3",
    club: "Real Madrid",
    headline: "Agreement reached for summer transfer window target after evaluation",
    summary:
      "Full tactical and valuation breakdown from our predictive algorithms on prospective marquee midfield acquisition.",
    timestamp: "1h ago",
    category: "TRANSFERS",
    source: "Sky Sports",
    link: "https://www.skysports.com/football",
  },
  {
    id: "def_4",
    club: "Liverpool",
    headline: "Mohamed Salah commits future to Anfield through 2027 season",
    summary:
      "Liverpool have officially confirmed a contract extension for Egyptian king Mohamed Salah, keeping the forward at Anfield for three more seasons.",
    timestamp: "2h ago",
    category: "CONTRACT UPDATE",
    source: "The Guardian",
    link: "https://www.theguardian.com/football",
  },
  {
    id: "def_5",
    club: "Everton",
    headline: "Kiernan Dewsbury-Hall inspires Everton to 3-1 comeback victory over Coventry City",
    summary:
      "Everton produced a spirited second-half revival at Goodison Park, clinical in offensive transitions with Dewsbury-Hall orchestrating key passes.",
    timestamp: "3h ago",
    category: "MATCHDAY",
    source: "BBC Football",
    link: "https://www.bbc.co.uk/sport/football",
  },
  {
    id: "def_6",
    club: "Chelsea",
    headline: "Cole Palmer claims Premier League Young Player of the Month recognition",
    summary:
      "Cole Palmer's stellar playmaking orchestrates four goals in Stamford Bridge masterclass, earning unanimous recognition from the awards panel.",
    timestamp: "4h ago",
    category: "YOUNG PLAYER",
    source: "BBC Football",
    link: "https://www.bbc.co.uk/sport/football",
  },
  {
    id: "def_7",
    club: "Barcelona",
    headline: "Lamine Yamal radar evaluation shows unprecedented 96th-percentile playmaking metrics",
    summary:
      "Our Cohere tactical scout engine analyzes 75 consecutive appearances from Barcelona's teen sensation, detailing exceptional offensive output.",
    timestamp: "5h ago",
    category: "LA LIGA",
    source: "Sky Sports",
    link: "https://www.skysports.com/football",
  },
];

export default function NewsTicker({ initialNews = DEFAULT_NEWS_ITEMS }: { initialNews?: NewsItem[] }) {
  const [news, setNews] = useState<NewsItem[]>(initialNews);
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadLiveNews = async () => {
      try {
        const liveItems: LiveNewsItem[] = await fetchLiveNews();
        if (isMounted && liveItems && liveItems.length > 0) {
          setNews(liveItems);
        }
      } catch (err) {
        // Graceful fallback to default news snapshot on network error
      }
    };

    // Initial live fetch
    loadLiveNews();

    // Auto-poll live news every 5 minutes (300,000 ms)
    const intervalId = setInterval(loadLiveNews, 300000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  // Duplicate items array once to enable seamless mathematical loop at -50% translateX
  const tickerItems = [...news, ...news];

  return (
    <>
      <div className="w-full h-10 bg-white border-y border-[#d9d9dd] flex items-center overflow-hidden font-body text-cohere-ink select-none relative z-20">
        {/* Fixed Left Badge */}
        <div className="h-full shrink-0 px-4 flex items-center gap-2 bg-white border-r border-[#d9d9dd] z-10 shadow-[2px_0_6px_rgba(0,0,0,0.02)]">
          <span className="w-2 h-2 rounded-full bg-cohere-coral animate-pulse" />
          <span className="font-mono text-[11px] uppercase tracking-mono text-cohere-coral font-bold whitespace-nowrap">
            LIVE NEWS
          </span>
        </div>

        {/* Continuous Smooth Scrolling Marquee */}
        <div className="flex-1 overflow-hidden relative flex items-center h-full">
          <div className="animate-marquee flex items-center h-full whitespace-nowrap hover:[animation-play-state:paused] cursor-pointer">
            {tickerItems.map((item, idx) => (
              <div
                key={`${item.id || item.club}-${idx}`}
                onClick={() => setSelectedNews(item)}
                className="inline-flex items-center gap-2.5 px-3 py-1 text-xs group transition-colors"
              >
                {/* Category Pill Tag */}
                <span className="rounded-xs text-[10px] font-mono uppercase px-2 py-0.5 font-bold tracking-wider text-cohere-coral bg-cohere-soft-stone border border-cohere-card-border shrink-0">
                  {item.category}
                </span>

                {/* Club Crest Icon (18x18) */}
                <div className="relative w-[18px] h-[18px] shrink-0 flex items-center justify-center">
                  <Image
                    src={getGlobalClubCrest(item.club)}
                    alt={item.club}
                    width={18}
                    height={18}
                    className="object-contain"
                    unoptimized
                  />
                </div>

                {/* Headline Text */}
                <span className="font-body text-xs text-[#17171c] hover:text-cohere-coral font-medium transition-colors">
                  {item.headline}
                </span>

                {/* Timestamp microcopy */}
                {item.timestamp && (
                  <span className="font-mono text-[10px] text-cohere-muted font-normal">
                    {item.timestamp}
                  </span>
                )}

                {/* Vertical Divider */}
                <span className="border-r border-[#d9d9dd] h-4 mx-3 shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interactive Modal Drawer */}
      <NewsDetailModal
        news={selectedNews}
        onClose={() => setSelectedNews(null)}
      />
    </>
  );
}
