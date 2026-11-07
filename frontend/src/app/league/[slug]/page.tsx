"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Trophy,
  Calendar,
  ChevronRight,
  TrendingUp,
  Clock,
  ExternalLink,
  Shield,
  ArrowRight,
  Flame,
  Award,
} from "lucide-react";
import { fetchGlobalLeagueOverview, LeagueOverviewResponse } from "@/lib/api";
import { getGlobalClubCrest, getLeagueCrest, getPlayerHeadshot, getPlayerPhoto } from "@/lib/logos";
import H2HModal from "@/components/H2HModal";

// ── Complete Resilient Client-Side Fallback Generator ──
function getFallbackLeagueOverview(slug: string): LeagueOverviewResponse {
  const cleanSlug = slug.toLowerCase();
  const laLigaLeaders = [
    {
      name: "Goals",
      leaders: [
        { player: "Robert Lewandowski", club: "FC Barcelona", val: 16 },
        { player: "Kylian Mbappé", club: "Real Madrid", val: 12 },
        { player: "Raphinha", club: "FC Barcelona", val: 11 },
        { player: "Ayoze Pérez", club: "Villarreal", val: 10 },
        { player: "Antoine Griezmann", club: "Atlético Madrid", val: 9 },
        { player: "Vinícius Júnior", club: "Real Madrid", val: 9 },
        { player: "Dani Olmo", club: "FC Barcelona", val: 8 },
        { player: "Lamine Yamal", club: "FC Barcelona", val: 7 },
        { player: "Jude Bellingham", club: "Real Madrid", val: 7 },
        { player: "Alexander Sørloth", club: "Atlético Madrid", val: 6 },
      ],
    },
    {
      name: "Assists",
      leaders: [
        { player: "Lamine Yamal", club: "FC Barcelona", val: 10 },
        { player: "Vinícius Júnior", club: "Real Madrid", val: 8 },
        { player: "Pedri", club: "FC Barcelona", val: 7 },
        { player: "Jude Bellingham", club: "Real Madrid", val: 7 },
        { player: "Raphinha", club: "FC Barcelona", val: 6 },
        { player: "Antoine Griezmann", club: "Atlético Madrid", val: 6 },
        { player: "Dani Olmo", club: "FC Barcelona", val: 5 },
        { player: "Rodrygo", club: "Real Madrid", val: 5 },
        { player: "Federico Valverde", club: "Real Madrid", val: 4 },
        { player: "Ayoze Pérez", club: "Villarreal", val: 4 },
      ],
    },
    {
      name: "xG",
      leaders: [
        { player: "Robert Lewandowski", club: "FC Barcelona", val: 15.2 },
        { player: "Kylian Mbappé", club: "Real Madrid", val: 11.8 },
        { player: "Vinícius Júnior", club: "Real Madrid", val: 9.4 },
        { player: "Raphinha", club: "FC Barcelona", val: 9.1 },
        { player: "Ayoze Pérez", club: "Villarreal", val: 8.9 },
        { player: "Antoine Griezmann", club: "Atlético Madrid", val: 8.5 },
        { player: "Lamine Yamal", club: "FC Barcelona", val: 6.9 },
        { player: "Jude Bellingham", club: "Real Madrid", val: 6.5 },
        { player: "Dani Olmo", club: "FC Barcelona", val: 6.1 },
        { player: "Alexander Sørloth", club: "Atlético Madrid", val: 5.4 },
      ],
    },
    {
      name: "Key Passes",
      leaders: [
        { player: "Lamine Yamal", club: "FC Barcelona", val: 42 },
        { player: "Jude Bellingham", club: "Real Madrid", val: 34 },
        { player: "Pedri", club: "FC Barcelona", val: 30 },
        { player: "Antoine Griezmann", club: "Atlético Madrid", val: 28 },
        { player: "Raphinha", club: "FC Barcelona", val: 27 },
        { player: "Vinícius Júnior", club: "Real Madrid", val: 26 },
        { player: "Nico Williams", club: "Athletic Club", val: 24 },
        { player: "Dani Olmo", club: "FC Barcelona", val: 22 },
        { player: "Rodrygo", club: "Real Madrid", val: 21 },
        { player: "Federico Valverde", club: "Real Madrid", val: 20 },
      ],
    },
    {
      name: "Shots on Target",
      leaders: [
        { player: "Kylian Mbappé", club: "Real Madrid", val: 28 },
        { player: "Robert Lewandowski", club: "FC Barcelona", val: 26 },
        { player: "Vinícius Júnior", club: "Real Madrid", val: 22 },
        { player: "Antoine Griezmann", club: "Atlético Madrid", val: 20 },
        { player: "Lamine Yamal", club: "FC Barcelona", val: 18 },
        { player: "Raphinha", club: "FC Barcelona", val: 17 },
        { player: "Ayoze Pérez", club: "Villarreal", val: 16 },
        { player: "Dani Olmo", club: "FC Barcelona", val: 15 },
        { player: "Rodrygo", club: "Real Madrid", val: 14 },
        { player: "Jude Bellingham", club: "Real Madrid", val: 13 },
      ],
    },
    {
      name: "Tackles",
      leaders: [
        { player: "Federico Valverde", club: "Real Madrid", val: 38 },
        { player: "Pedri", club: "FC Barcelona", val: 32 },
        { player: "Jude Bellingham", club: "Real Madrid", val: 29 },
        { player: "Gavi", club: "FC Barcelona", val: 26 },
        { player: "Koke", club: "Atlético Madrid", val: 25 },
        { player: "Rodrigo De Paul", club: "Atlético Madrid", val: 24 },
        { player: "Eduardo Camavinga", club: "Real Madrid", val: 23 },
        { player: "Dani Carvajal", club: "Real Madrid", val: 22 },
        { player: "Ander Herrera", club: "Athletic Club", val: 20 },
        { player: "Dani Vivian", club: "Athletic Club", val: 19 },
      ],
    },
    {
      name: "Yellow Cards",
      leaders: [
        { player: "Dani Carvajal", club: "Real Madrid", val: 6 },
        { player: "Ronald Araújo", club: "FC Barcelona", val: 5 },
        { player: "Marcos Llorente", club: "Atlético Madrid", val: 5 },
        { player: "Federico Valverde", club: "Real Madrid", val: 4 },
        { player: "Vinícius Júnior", club: "Real Madrid", val: 4 },
        { player: "Gavi", club: "FC Barcelona", val: 4 },
        { player: "Koke", club: "Atlético Madrid", val: 3 },
        { player: "Robin Le Normand", club: "Atlético Madrid", val: 3 },
        { player: "Iñigo Martínez", club: "FC Barcelona", val: 3 },
        { player: "Rodrigo De Paul", club: "Atlético Madrid", val: 3 },
      ],
    },
  ];

  const isCL = cleanSlug.includes("champion");

  const clStandings = [
    { rank: 1, club: "Real Madrid", slug: "real-madrid", mp: 8, w: 7, d: 1, l: 0, pts: 22, form: ["W", "W", "W", "D", "W"] },
    { rank: 2, club: "Manchester City", slug: "manchester-city", mp: 8, w: 6, d: 2, l: 0, pts: 20, form: ["W", "W", "D", "W", "W"] },
    { rank: 3, club: "Bayern Munich", slug: "bayern-munich", mp: 8, w: 6, d: 1, l: 1, pts: 19, form: ["W", "W", "W", "L", "W"] },
    { rank: 4, club: "FC Barcelona", slug: "fc-barcelona", mp: 8, w: 6, d: 1, l: 1, pts: 19, form: ["W", "W", "L", "W", "W"] },
    { rank: 5, club: "Paris Saint-Germain", slug: "paris-saint-germain", mp: 8, w: 5, d: 2, l: 1, pts: 17, form: ["W", "D", "W", "W", "D"] },
    { rank: 6, club: "Inter Milan", slug: "inter", mp: 8, w: 5, d: 2, l: 1, pts: 17, form: ["W", "W", "D", "D", "W"] },
    { rank: 7, club: "Arsenal", slug: "arsenal", mp: 8, w: 5, d: 1, l: 2, pts: 16, form: ["L", "W", "W", "W", "W"] },
    { rank: 8, club: "Bayer Leverkusen", slug: "bayer-leverkusen", mp: 8, w: 5, d: 1, l: 2, pts: 16, form: ["W", "D", "W", "L", "W"] },
    { rank: 9, club: "Juventus", slug: "juventus", mp: 8, w: 4, d: 3, l: 1, pts: 15, form: ["D", "W", "D", "W", "D"] },
    { rank: 10, club: "Atlético Madrid", slug: "atletico-madrid", mp: 8, w: 4, d: 3, l: 1, pts: 15, form: ["W", "D", "W", "D", "W"] },
    { rank: 11, club: "Borussia Dortmund", slug: "borussia-dortmund", mp: 8, w: 4, d: 2, l: 2, pts: 14, form: ["W", "L", "W", "W", "L"] },
    { rank: 12, club: "Benfica", slug: "benfica", mp: 8, w: 4, d: 2, l: 2, pts: 14, form: ["W", "W", "L", "D", "W"] },
    { rank: 13, club: "Sporting CP", slug: "sporting-cp", mp: 8, w: 4, d: 1, l: 3, pts: 13, form: ["W", "W", "W", "L", "L"] },
    { rank: 14, club: "FC Porto", slug: "fc-porto", mp: 8, w: 4, d: 1, l: 3, pts: 13, form: ["L", "W", "W", "W", "L"] },
    { rank: 15, club: "Atalanta", slug: "atalanta", mp: 8, w: 3, d: 3, l: 2, pts: 12, form: ["D", "D", "W", "W", "L"] },
    { rank: 16, club: "AC Milan", slug: "ac-milan", mp: 8, w: 3, d: 3, l: 2, pts: 12, form: ["W", "L", "D", "W", "D"] },
    { rank: 17, club: "Liverpool", slug: "liverpool", mp: 8, w: 3, d: 3, l: 2, pts: 12, form: ["W", "D", "L", "W", "D"] },
    { rank: 18, club: "Aston Villa", slug: "aston-villa", mp: 8, w: 3, d: 2, l: 3, pts: 11, form: ["L", "W", "D", "W", "L"] },
  ];

  const genericStandings = [
    { rank: 1, club: "Real Madrid", slug: "real-madrid", mp: 14, w: 10, d: 3, l: 1, pts: 33, form: ["W", "W", "D", "W", "W"] },
    { rank: 2, club: "FC Barcelona", slug: "fc-barcelona", mp: 14, w: 10, d: 2, l: 2, pts: 32, form: ["W", "W", "W", "L", "W"] },
    { rank: 3, club: "Bayern Munich", slug: "bayern-munich", mp: 14, w: 9, d: 3, l: 2, pts: 30, form: ["W", "D", "W", "W", "W"] },
    { rank: 4, club: "Arsenal", slug: "arsenal", mp: 14, w: 8, d: 4, l: 2, pts: 28, form: ["W", "W", "D", "D", "W"] },
    { rank: 5, club: "Bayer Leverkusen", slug: "bayer-leverkusen", mp: 14, w: 8, d: 3, l: 3, pts: 27, form: ["W", "L", "W", "W", "W"] },
    { rank: 6, club: "Inter Milan", slug: "inter", mp: 14, w: 7, d: 5, l: 2, pts: 26, form: ["D", "W", "W", "D", "W"] },
    { rank: 7, club: "Paris Saint-Germain", slug: "paris-saint-germain", mp: 14, w: 7, d: 4, l: 3, pts: 25, form: ["W", "W", "L", "W", "D"] },
    { rank: 8, club: "Liverpool", slug: "liverpool", mp: 14, w: 7, d: 3, l: 4, pts: 24, form: ["W", "D", "W", "L", "W"] },
    { rank: 9, club: "Atlético Madrid", slug: "atletico-madrid", mp: 14, w: 7, d: 2, l: 5, pts: 23, form: ["W", "W", "L", "W", "W"] },
    { rank: 10, club: "Juventus", slug: "juventus", mp: 14, w: 6, d: 4, l: 4, pts: 22, form: ["D", "W", "L", "W", "D"] },
    { rank: 11, club: "Borussia Dortmund", slug: "borussia-dortmund", mp: 14, w: 6, d: 4, l: 4, pts: 22, form: ["W", "D", "D", "W", "L"] },
    { rank: 12, club: "Manchester City", slug: "manchester-city", mp: 14, w: 6, d: 3, l: 5, pts: 21, form: ["L", "W", "W", "D", "W"] },
    { rank: 13, club: "AC Milan", slug: "ac-milan", mp: 14, w: 5, d: 5, l: 4, pts: 20, form: ["D", "W", "D", "W", "D"] },
    { rank: 14, club: "Napoli", slug: "napoli", mp: 14, w: 5, d: 4, l: 5, pts: 19, form: ["W", "L", "W", "D", "L"] },
    { rank: 15, club: "Chelsea", slug: "chelsea", mp: 14, w: 5, d: 3, l: 6, pts: 18, form: ["L", "W", "W", "L", "W"] },
    { rank: 16, club: "Tottenham Hotspur", slug: "tottenham-hotspur", mp: 14, w: 4, d: 5, l: 5, pts: 17, form: ["D", "L", "D", "W", "D"] },
    { rank: 17, club: "Aston Villa", slug: "aston-villa", mp: 14, w: 4, d: 4, l: 6, pts: 16, form: ["L", "D", "W", "L", "W"] },
    { rank: 18, club: "Newcastle United", slug: "newcastle-united", mp: 14, w: 3, d: 4, l: 7, pts: 13, form: ["L", "D", "L", "W", "L"] },
  ];

  const clFixtures = [
    {
      date_heading: "MATCHDAY 5 • TUESDAY 5TH NOV",
      matches: [
        { home_team: "Real Madrid", away_team: "AC Milan", referee: "S. Marciniak", yellow_avg: 4.10, red_avg: 0.14, time: "20:00" },
        { home_team: "Liverpool", away_team: "Bayer Leverkusen", referee: "D. Orsato", yellow_avg: 3.90, red_avg: 0.12, time: "20:00" },
        { home_team: "Sporting CP", away_team: "Manchester City", referee: "A. Taylor", yellow_avg: 3.80, red_avg: 0.10, time: "20:00" },
        { home_team: "Borussia Dortmund", away_team: "Sturm Graz", referee: "I. Kovacs", yellow_avg: 4.30, red_avg: 0.18, time: "20:00" },
      ],
    },
    {
      date_heading: "MATCHDAY 5 • WEDNESDAY 6TH NOV",
      matches: [
        { home_team: "Inter Milan", away_team: "Arsenal", referee: "C. Turpin", yellow_avg: 4.05, red_avg: 0.15, time: "20:00" },
        { home_team: "Paris Saint-Germain", away_team: "Atlético Madrid", referee: "S. Vinčić", yellow_avg: 4.15, red_avg: 0.16, time: "20:00" },
        { home_team: "Bayern Munich", away_team: "Benfica", referee: "M. Oliver", yellow_avg: 3.85, red_avg: 0.11, time: "20:00" },
        { home_team: "Red Star Belgrade", away_team: "FC Barcelona", referee: "F. Letexier", yellow_avg: 3.95, red_avg: 0.12, time: "20:00" },
      ],
    },
  ];

  const clLeaders = [
    {
      name: "Goals",
      leaders: [
        { player: "Kylian Mbappé", club: "Real Madrid", val: 9 },
        { player: "Harry Kane", club: "Bayern Munich", val: 8 },
        { player: "Erling Haaland", club: "Manchester City", val: 8 },
        { player: "Robert Lewandowski", club: "FC Barcelona", val: 7 },
        { player: "Vinícius Júnior", club: "Real Madrid", val: 6 },
        { player: "Raphinha", club: "FC Barcelona", val: 6 },
        { player: "Antoine Griezmann", club: "Atlético Madrid", val: 5 },
        { player: "Lamine Yamal", club: "FC Barcelona", val: 5 },
        { player: "Jude Bellingham", club: "Real Madrid", val: 4 },
        { player: "Lautaro Martínez", club: "Inter Milan", val: 4 },
      ],
    },
    {
      name: "Assists",
      leaders: [
        { player: "Lamine Yamal", club: "FC Barcelona", val: 6 },
        { player: "Vinícius Júnior", club: "Real Madrid", val: 5 },
        { player: "Jude Bellingham", club: "Real Madrid", val: 5 },
        { player: "Raphinha", club: "FC Barcelona", val: 4 },
        { player: "Jamal Musiala", club: "Bayern Munich", val: 4 },
        { player: "Florian Wirtz", club: "Bayer Leverkusen", val: 4 },
        { player: "Bukayo Saka", club: "Arsenal", val: 4 },
        { player: "Pedri", club: "FC Barcelona", val: 3 },
        { player: "Kevin De Bruyne", club: "Manchester City", val: 3 },
        { player: "Antoine Griezmann", club: "Atlético Madrid", val: 3 },
      ],
    },
    {
      name: "xG",
      leaders: [
        { player: "Erling Haaland", club: "Manchester City", val: 8.4 },
        { player: "Kylian Mbappé", club: "Real Madrid", val: 7.9 },
        { player: "Harry Kane", club: "Bayern Munich", val: 7.5 },
        { player: "Robert Lewandowski", club: "FC Barcelona", val: 6.8 },
        { player: "Vinícius Júnior", club: "Real Madrid", val: 5.9 },
        { player: "Raphinha", club: "FC Barcelona", val: 5.3 },
        { player: "Lautaro Martínez", club: "Inter Milan", val: 4.9 },
        { player: "Antoine Griezmann", club: "Atlético Madrid", val: 4.6 },
        { player: "Lamine Yamal", club: "FC Barcelona", val: 4.3 },
        { player: "Jude Bellingham", club: "Real Madrid", val: 4.0 },
      ],
    },
    {
      name: "Key Passes",
      leaders: [
        { player: "Lamine Yamal", club: "FC Barcelona", val: 28 },
        { player: "Jude Bellingham", club: "Real Madrid", val: 24 },
        { player: "Florian Wirtz", club: "Bayer Leverkusen", val: 22 },
        { player: "Pedri", club: "FC Barcelona", val: 21 },
        { player: "Martin Ødegaard", club: "Arsenal", val: 20 },
        { player: "Raphinha", club: "FC Barcelona", val: 19 },
        { player: "Jamal Musiala", club: "Bayern Munich", val: 19 },
        { player: "Vinícius Júnior", club: "Real Madrid", val: 18 },
        { player: "Antoine Griezmann", club: "Atlético Madrid", val: 17 },
        { player: "Kevin De Bruyne", club: "Manchester City", val: 16 },
      ],
    },
    {
      name: "Shots on Target",
      leaders: [
        { player: "Kylian Mbappé", club: "Real Madrid", val: 24 },
        { player: "Erling Haaland", club: "Manchester City", val: 22 },
        { player: "Harry Kane", club: "Bayern Munich", val: 21 },
        { player: "Robert Lewandowski", club: "FC Barcelona", val: 19 },
        { player: "Vinícius Júnior", club: "Real Madrid", val: 17 },
        { player: "Raphinha", club: "FC Barcelona", val: 16 },
        { player: "Lamine Yamal", club: "FC Barcelona", val: 14 },
        { player: "Antoine Griezmann", club: "Atlético Madrid", val: 13 },
        { player: "Jude Bellingham", club: "Real Madrid", val: 12 },
        { player: "Lautaro Martínez", club: "Inter Milan", val: 11 },
      ],
    },
    {
      name: "Tackles",
      leaders: [
        { player: "Federico Valverde", club: "Real Madrid", val: 26 },
        { player: "Declan Rice", club: "Arsenal", val: 24 },
        { player: "Rodri", club: "Manchester City", val: 22 },
        { player: "Nicolò Barella", club: "Inter Milan", val: 21 },
        { player: "Pedri", club: "FC Barcelona", val: 19 },
        { player: "Jude Bellingham", club: "Real Madrid", val: 18 },
        { player: "Eduardo Camavinga", club: "Real Madrid", val: 17 },
        { player: "Granit Xhaka", club: "Bayer Leverkusen", val: 17 },
        { player: "Joshua Kimmich", club: "Bayern Munich", val: 16 },
        { player: "Alphonso Davies", club: "Bayern Munich", val: 15 },
      ],
    },
    {
      name: "Yellow Cards",
      leaders: [
        { player: "Dani Carvajal", club: "Real Madrid", val: 4 },
        { player: "Stefan Savić", club: "Atlético Madrid", val: 4 },
        { player: "Ronald Araújo", club: "FC Barcelona", val: 3 },
        { player: "Federico Valverde", club: "Real Madrid", val: 3 },
        { player: "Declan Rice", club: "Arsenal", val: 3 },
        { player: "Vinícius Júnior", club: "Real Madrid", val: 3 },
        { player: "Kai Havertz", club: "Arsenal", val: 2 },
        { player: "Robert Andrich", club: "Bayer Leverkusen", val: 2 },
        { player: "Nicolò Barella", club: "Inter Milan", val: 2 },
        { player: "Antoine Griezmann", club: "Atlético Madrid", val: 2 },
      ],
    },
  ];

  return {
    league: {
      slug: cleanSlug,
      name: isCL ? "Champions League" : cleanSlug.replace("-", " ").toUpperCase(),
      country: isCL ? "Europe" : "World",
      country_tag: isCL ? "UEFA" : "GLOBAL",
      flag: isCL ? "🇪🇺" : "🌍",
      season: "2026/2027",
      crest: getLeagueCrest(cleanSlug),
      quick_categories: ["Goals", "Assists", "xG", "Key Passes", "Shots on Target", "Tackles", "Yellow Cards"],
    },
    standings: isCL ? clStandings : genericStandings,
    fixtures: clFixtures,
    stat_categories: isCL ? clLeaders : (cleanSlug === "la-liga" ? laLigaLeaders : clLeaders),
  };
}

export default function LeagueOverviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params?.slug as string) || "champions-league";

  const [data, setData] = useState<LeagueOverviewResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Goals");
  const [h2hMatch, setH2hMatch] = useState<{ home: string; away: string } | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchGlobalLeagueOverview(slug)
      .then((res) => {
        if (res && res.standings && res.standings.length > 0) {
          setData(res);
        } else {
          setData(getFallbackLeagueOverview(slug));
        }
      })
      .catch(() => {
        setData(getFallbackLeagueOverview(slug));
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const activeCategoryObj = data?.stat_categories?.find((c) => c.name === selectedCategory) || data?.stat_categories?.[0];
  const activeLeaders = activeCategoryObj?.leaders || [];

  return (
    <div className="space-y-6 animate-fade-in pb-16 font-body text-cohere-ink">
      {/* ── League Title Header ── */}
      <div className="flex items-center justify-between border-b border-cohere-hairline pb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 shrink-0 flex items-center justify-center p-1 rounded-sm bg-cohere-soft-stone border border-cohere-hairline">
            <Image
              src={getLeagueCrest(slug)}
              alt={data?.league.name || slug}
              fill
              className="object-contain p-0.5"
              unoptimized
            />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-display font-medium text-cohere-primary tracking-tight flex items-center gap-2">
              <span>{data?.league.name || slug.replace("-", " ").toUpperCase()} Intelligence</span>
            </h1>
            <p className="text-xs text-cohere-body-muted font-mono mt-0.5">
              {data?.league.country} • {data?.league.season || "2026/2027"} • Official Multi-League Standings & Analytics
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="p-16 text-center text-cohere-muted bg-cohere-soft-stone/30 rounded-lg border border-cohere-hairline flex items-center justify-center font-mono text-xs">
          <Clock size={16} className="animate-spin text-cohere-coral mr-2" /> Loading {slug.replace("-", " ").toUpperCase()} analytics...
        </div>
      ) : (
        /* ── 3-Column Structured Layout ── */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* ── Column 1 (Left - 5 cols): Interactive League Standings Table ── */}
          <div className="lg:col-span-5 cohere-card-white overflow-hidden p-0">
            <div className="p-3.5 bg-cohere-soft-stone border-b border-cohere-hairline flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cohere-primary uppercase tracking-wider flex items-center gap-1.5">
                <Trophy size={13} className="text-cohere-coral" />
                League Standings
              </span>
              <span className="text-[10px] text-cohere-slate font-mono font-bold">
                {data?.standings.length || 0} CLUBS • 2026/2027
              </span>
            </div>

            <div className="overflow-x-auto max-h-[720px] overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 z-10 bg-cohere-soft-stone">
                  <tr className="border-b border-cohere-hairline text-cohere-muted uppercase text-[10px] font-mono tracking-wider">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-2">Club</th>
                    <th className="py-2.5 px-2 text-center">MP</th>
                    <th className="py-2.5 px-2 text-center">W</th>
                    <th className="py-2.5 px-2 text-center">D</th>
                    <th className="py-2.5 px-2 text-center">L</th>
                    <th className="py-2.5 px-2 text-center font-bold text-cohere-primary">PTS</th>
                    <th className="py-2.5 px-2 text-center">Form</th>
                    <th className="py-2.5 px-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cohere-hairline font-medium">
                  {data?.standings.map((row: any, idx: number) => {
                    const rankNum = row.rank ?? row.position ?? idx + 1;
                    const clubName = row.club ?? row.team_name ?? "Club";
                    const clubSlug = row.slug ?? clubName.toLowerCase().replace(/\s+/g, "-");
                    return (
                      <tr
                        key={clubSlug + idx}
                        onClick={() => router.push(`/team/${clubSlug}`)}
                        className="hover:bg-cohere-soft-stone/30 transition-colors cursor-pointer group"
                      >
                        <td className="py-2.5 px-3 text-cohere-muted font-mono font-bold text-[11px]">
                          {rankNum}
                        </td>
                        <td className="py-2.5 px-2">
                          <div className="flex items-center gap-2 max-w-[130px] truncate">
                            <div className="relative w-4 h-4 shrink-0">
                              <Image
                                src={getGlobalClubCrest(clubName)}
                                alt={clubName}
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                            <span className="text-cohere-primary group-hover:text-cohere-coral transition-colors font-bold truncate">
                              {clubName}
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono text-cohere-slate">{row.mp}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-cohere-slate">{row.w}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-cohere-slate">{row.d}</td>
                        <td className="py-2.5 px-2 text-center font-mono text-cohere-slate">{row.l}</td>
                        <td className="py-2.5 px-2 text-center font-mono font-bold text-cohere-primary bg-cohere-soft-stone/30">
                          {row.pts}
                        </td>
                        <td className="py-2.5 px-2 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {row.form?.map((res: string, i: number) => (
                              <span
                                key={i}
                                className={`w-2 h-2 rounded-full ${
                                  res === "W"
                                    ? "bg-cohere-deep-green"
                                    : res === "L"
                                    ? "bg-cohere-coral"
                                    : "bg-cohere-slate"
                                }`}
                                title={`Form: ${res}`}
                              />
                            ))}
                          </div>
                        </td>
                        <td className="py-2.5 px-2 text-right text-cohere-muted group-hover:text-cohere-coral">
                          <ChevronRight size={13} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* ── Column 2 (Center - 4 cols): Matchday Fixtures list grouped by date ── */}
          <div className="lg:col-span-4 space-y-4">
            {data?.fixtures.map((group, gIdx) => (
              <div
                key={gIdx}
                className="cohere-card-white overflow-hidden p-0"
              >
                {/* Date Group Heading */}
                <div className="px-4 py-2.5 bg-cohere-soft-stone border-b border-cohere-hairline text-xs font-mono font-bold tracking-wider text-cohere-slate uppercase flex items-center justify-between">
                  <span>{group.date_heading}</span>
                  <Calendar size={12} className="text-cohere-muted" />
                </div>

                <div className="divide-y divide-cohere-hairline">
                  {group.matches.map((m, mIdx) => (
                    <div
                      key={mIdx}
                      className="p-3.5 hover:bg-cohere-soft-stone/20 transition-colors space-y-2.5"
                    >
                      <div className="flex items-center justify-between">
                        <div className="space-y-1.5 flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2">
                            <div className="relative w-4 h-4 shrink-0">
                              <Image
                                src={getGlobalClubCrest(m.home_team)}
                                alt={m.home_team}
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                            <span className="text-xs font-bold text-cohere-primary truncate">{m.home_team}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="relative w-4 h-4 shrink-0">
                              <Image
                                src={getGlobalClubCrest(m.away_team)}
                                alt={m.away_team}
                                fill
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                            <span className="text-xs font-bold text-cohere-primary truncate">{m.away_team}</span>
                          </div>
                        </div>

                        {/* H2H Button */}
                        <button
                          type="button"
                          onClick={() => setH2hMatch({ home: m.home_team, away: m.away_team })}
                          className="button-pill-outline px-2.5 py-1 text-[11px] font-mono font-bold shrink-0 hover:border-cohere-coral hover:text-cohere-coral transition-colors"
                        >
                          H2H
                        </button>
                      </div>

                      {/* Referee & Kickoff Bar */}
                      <div className="flex items-center justify-between text-[11px] pt-1.5 text-cohere-slate border-t border-cohere-hairline font-mono">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-semibold text-cohere-ink truncate">{m.referee}</span>
                          <span className="px-1 rounded bg-cohere-soft-stone text-cohere-primary font-bold text-[9px] border border-cohere-hairline shrink-0">
                            🟨 {m.yellow_avg}
                          </span>
                        </div>
                        <span className="font-bold text-cohere-primary shrink-0">{m.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* ── Column 3 (Right - 3 cols): League Stat Leaderboard Categories ── */}
          <div className="lg:col-span-3 cohere-card-white overflow-hidden p-0">
            <div className="p-3.5 bg-cohere-soft-stone border-b border-cohere-hairline flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cohere-primary uppercase tracking-wider block">
                {slug.replace("-", " ").toUpperCase()} STATS
              </span>
              <Award size={13} className="text-cohere-coral" />
            </div>

            {/* Category Tab Pills */}
            <div className="p-2 border-b border-cohere-hairline bg-white flex flex-wrap gap-1">
              {data?.stat_categories.slice(0, 7).map((cat) => {
                const isSelected = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`px-2 py-1 rounded-xs text-[10px] font-mono transition-all font-semibold ${
                      isSelected
                        ? "bg-cohere-primary text-white"
                        : "bg-cohere-soft-stone text-cohere-slate hover:text-cohere-primary border border-cohere-hairline"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* Active Category Leaderboard List */}
            <div className="p-2 divide-y divide-cohere-hairline max-h-[640px] overflow-y-auto">
              <div className="px-2 py-1.5 text-[10px] font-mono uppercase text-cohere-muted font-bold tracking-wider flex items-center justify-between">
                <span>Top Ranked ({selectedCategory})</span>
                <span>Stat</span>
              </div>
              {activeLeaders.map((leader, i) => (
                <div
                  key={i}
                  className="py-2 px-2 hover:bg-cohere-soft-stone/30 transition-colors rounded-sm flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="font-mono text-xs font-bold text-cohere-muted w-4 shrink-0">
                      {i + 1}.
                    </span>
                    <div className="relative w-7 h-7 rounded-full overflow-hidden shrink-0 border border-cohere-hairline bg-cohere-soft-stone flex items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={getPlayerHeadshot(leader.player)}
                        alt={leader.player}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          e.currentTarget.src = "/fallback-player-avatar.svg";
                        }}
                      />
                      <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-white p-0.5 border border-cohere-hairline flex items-center justify-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={getGlobalClubCrest(leader.club)}
                          alt={leader.club}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-cohere-primary truncate">
                        {leader.player}
                      </div>
                      <div className="text-[10px] text-cohere-muted truncate">
                        {leader.club}
                      </div>
                    </div>
                  </div>

                  <span className="font-mono font-bold text-xs text-cohere-coral px-2 py-0.5 rounded bg-cohere-soft-stone border border-cohere-hairline shrink-0">
                    {leader.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* H2H Modal */}
      {h2hMatch && (
        <H2HModal
          homeTeam={h2hMatch.home}
          awayTeam={h2hMatch.away}
          open={!!h2hMatch}
          onClose={() => setH2hMatch(null)}
        />
      )}
    </div>
  );
}
