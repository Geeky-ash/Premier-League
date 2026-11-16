"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function MatchdayHub() {
  const [selectedDay, setSelectedDay] = useState("TODAY 07");
  const [selectedFilter, setSelectedFilter] = useState("ALL MATCHES (58)");

  return (
<main className="w-full pt-[140px] bg-surface min-h-[calc(100vh-220px)]"><div className="flex flex-col w-full">
<div className="px-margin-desktop py-space-md bg-surface-container-lowest shadow-sm flex flex-col gap-space-sm">
<div className="flex flex-col md:flex-row md:items-end justify-between gap-space-sm">
<div className="flex flex-col">
<div className="flex items-center gap-space-xs font-label-xs text-label-xs uppercase tracking-wider text-outline">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
<span className="">TELEMETRY FEED • MATCHDAY WORKSPACE</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight mt-0.5">Early Kickoffs &amp; Live Matchday Hub</h1>
</div>
<div className="flex items-center gap-space-sm self-start md:self-auto">
<span className="font-label-xs text-label-xs px-2.5 py-1 rounded bg-surface-container-high text-on-surface-variant font-medium">MODEL CONF: 97.4%</span>
<button className="h-9 px-space-md rounded bg-primary text-on-primary font-label-lg text-label-lg flex items-center gap-1.5 shadow-sm hover:bg-primary-container transition-colors" type="button">
<span className="material-symbols-outlined text-[16px]">sync</span> Refresh Feed
        </button>
</div>
</div>
<div className="flex items-center justify-between gap-space-md overflow-x-auto py-space-xs">
<div className="flex items-center gap-space-xs font-label-sm text-label-sm">
<button className="px-space-md py-1.5 rounded text-on-surface-variant hover:bg-surface-container transition-colors" type="button">THU 05</button>
<button className="px-space-md py-1.5 rounded text-on-surface-variant hover:bg-surface-container transition-colors" type="button">FRI 06</button>
<button className="px-space-md py-1.5 rounded bg-surface-container text-primary font-bold shadow-sm relative" type="button">
          TODAY 07
          <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-secondary-container rounded-full"></span>
</button>
<button className="px-space-md py-1.5 rounded text-on-surface-variant hover:bg-surface-container transition-colors" type="button">TOMO 08</button>
<button className="px-space-md py-1.5 rounded text-on-surface-variant hover:bg-surface-container transition-colors" type="button">MON 09</button>
<button className="px-space-md py-1.5 rounded text-on-surface-variant hover:bg-surface-container transition-colors" type="button">TUE 10</button>
<button className="px-space-md py-1.5 rounded text-on-surface-variant hover:bg-surface-container transition-colors" type="button">WED 11</button>
</div>
<div className="flex items-center gap-1.5 shrink-0">
<button className="px-3 py-1 rounded bg-primary text-on-primary font-label-xs text-label-xs font-semibold shadow-sm" type="button">ALL MATCHES (58)</button>
<button className="px-3 py-1 rounded bg-surface-container text-secondary font-label-xs text-label-xs font-semibold flex items-center gap-1 hover:bg-secondary-fixed transition-colors" type="button">
<span className="w-1.5 h-1.5 rounded-full bg-secondary animate-ping"></span> LIVE (6)
        </button>
<button className="px-3 py-1 rounded bg-surface-container text-on-surface-variant font-label-xs text-label-xs hover:bg-surface-container-high transition-colors" type="button">TODAY&apos;S FIXTURES</button>
<button className="px-3 py-1 rounded bg-surface-container text-on-surface-variant font-label-xs text-label-xs hover:bg-surface-container-high transition-colors" type="button">COMPLETED</button>
<button className="px-3 py-1 rounded bg-surface-container text-on-surface-variant font-label-xs text-label-xs hover:bg-surface-container-high transition-colors" type="button">PREDICTIONS &amp; ODDS</button>
</div>
</div>
</div>
<div className="w-full px-margin-desktop py-space-md grid grid-cols-1 lg:grid-cols-12 gap-space-md">
<aside className="lg:col-span-3 flex flex-col gap-space-sm">
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-label-xs text-label-xs uppercase font-bold tracking-wider text-outline">PRIORITY LEAGUES</span>
<span className="font-label-xs text-label-xs text-secondary-container font-semibold">TIER-1 CORE</span>
</div>
<div className="flex flex-col gap-2">
<div className="p-space-sm rounded bg-surface-container-low hover:bg-surface-container transition-all cursor-pointer flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded bg-primary text-on-primary flex items-center justify-center font-headline-sm text-xs font-bold">PL</div>
<span className="font-headline-sm text-headline-sm text-on-surface text-sm font-semibold">Premier League</span>
</div>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-secondary-fixed text-on-secondary-fixed font-bold">3 LIVE</span>
</div>
<div className="flex flex-wrap gap-1">
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant">Goalscorers</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant">Shots</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant">SoT</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant">Tackles</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container-lowest text-on-surface-variant">Yellows</span>
</div>
</div>
<div className="p-space-sm rounded bg-surface-container-lowest hover:bg-surface-container transition-all cursor-pointer flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded bg-secondary text-on-secondary flex items-center justify-center font-headline-sm text-xs font-bold">LL</div>
<span className="font-headline-sm text-headline-sm text-on-surface text-sm font-semibold">La Liga</span>
</div>
<span className="font-label-xs text-label-xs text-outline font-medium">1 LIVE</span>
</div>
<div className="flex flex-wrap gap-1">
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Goalscorers</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Shots</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">SoT</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Yellows</span>
</div>
</div>
<div className="p-space-sm rounded bg-surface-container-lowest hover:bg-surface-container transition-all cursor-pointer flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded bg-tertiary-container text-on-tertiary flex items-center justify-center font-headline-sm text-xs font-bold">CL</div>
<span className="font-headline-sm text-headline-sm text-on-surface text-sm font-semibold">UEFA Champions League</span>
</div>
<span className="font-label-xs text-label-xs text-outline font-medium">WED</span>
</div>
<div className="flex flex-wrap gap-1">
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">xG Matchup</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Pressing Index</span>
</div>
</div>
<div className="p-space-sm rounded bg-surface-container-lowest hover:bg-surface-container transition-all cursor-pointer flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded bg-on-surface-variant text-surface-container-lowest flex items-center justify-center font-headline-sm text-xs font-bold">BL</div>
<span className="font-headline-sm text-headline-sm text-on-surface text-sm font-semibold">Bundesliga</span>
</div>
<span className="font-label-xs text-label-xs text-outline font-medium">1 LIVE</span>
</div>
<div className="flex flex-wrap gap-1">
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Shots</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Tackles</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Fouls</span>
</div>
</div>
<div className="p-space-sm rounded bg-surface-container-lowest hover:bg-surface-container transition-all cursor-pointer flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-headline-sm text-xs font-bold">SA</div>
<span className="font-headline-sm text-headline-sm text-on-surface text-sm font-semibold">Serie A</span>
</div>
<span className="font-label-xs text-label-xs text-outline font-medium">0 LIVE</span>
</div>
<div className="flex flex-wrap gap-1">
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Defensive Lines</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Cards</span>
</div>
</div>
<div className="p-space-sm rounded bg-surface-container-lowest hover:bg-surface-container transition-all cursor-pointer flex flex-col gap-1.5">
<div className="flex items-center justify-between">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded bg-surface-container-high text-on-surface flex items-center justify-center font-headline-sm text-xs font-bold">L1</div>
<span className="font-headline-sm text-headline-sm text-on-surface text-sm font-semibold">Ligue 1</span>
</div>
<span className="font-label-xs text-label-xs text-outline font-medium">1 LIVE</span>
</div>
<div className="flex flex-wrap gap-1">
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Carries</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant">Pass Accuracy</span>
</div>
</div>
</div>
</div>
<div className="bg-primary text-on-primary p-space-md rounded-lg shadow-sm flex flex-col gap-2 relative overflow-hidden">
<div className="flex items-center justify-between">
<span className="font-label-xs text-label-xs uppercase tracking-widest text-primary-fixed-dim">TELEMETRY SYNDICATE</span>
<span className="w-2 h-2 rounded-full bg-secondary-container"></span>
</div>
<p className="font-headline-sm text-headline-sm text-sm text-surface-bright">Live Expected Threat (xT) Vectoring Online</p>
<p className="font-body-sm text-body-sm text-primary-fixed-dim">Tracking 22-man player trajectory clusters with 50ms positional latency.</p>
<div className="mt-2 pt-2 bg-primary-container p-2 rounded flex items-center justify-between font-label-xs text-label-xs">
<span className="text-surface-bright">INGEST PACKETS</span>
<span className="font-bold text-secondary-fixed">8,912 / SEC</span>
</div>
</div>
</aside>
<section className="lg:col-span-5 flex flex-col gap-space-md">
<article className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col gap-space-md transition-all border border-outline-variant"><div className="flex items-center justify-between pb-space-xs flex-wrap gap-2"><div className="flex items-center gap-2"><div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary-container/10 border border-secondary-container/30 text-on-surface"><span className="w-2 h-2 rounded-full bg-secondary-container animate-pulse"></span><span className="font-label-md text-label-md font-bold text-secondary-container tracking-tight">74&apos;</span><span className="font-label-xs text-label-xs px-1 py-0.2 rounded bg-secondary-container text-on-secondary font-bold">+4&apos;</span></div><span className="font-label-xs text-label-xs text-outline uppercase font-semibold">PREMIER LEAGUE • MATCHDAY 28</span><div className="flex items-center gap-1 ml-1"><span className="px-1.5 py-0.5 rounded bg-[#ffc107] text-[#1b1b20] font-label-xs text-[10px] font-bold shadow-sm" title="Yellow card: M. Caicedo 39&apos;">🟨 2</span><span className="px-1.5 py-0.5 rounded bg-[#ba1a1a] text-on-primary font-label-xs text-[10px] font-bold shadow-sm" title="Red cards: 0">🟥 0</span></div></div><button className="bg-[#edfce9] text-[#003c33] border border-[#003c33]/20 font-label-xs text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-[#d8f5d2] transition-colors font-bold flex items-center gap-1.5 shadow-sm" type="button"><span className="">[ LINEUPS OUT ↗ ]</span></button></div><div className="grid grid-cols-7 items-center gap-2"><div className="col-span-3 flex items-center gap-3"><div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-headline-md text-headline-md font-bold text-primary shrink-0 border border-outline-variant">CHE</div><div className="flex flex-col min-w-0"><span className="font-headline-sm text-headline-sm truncate text-on-surface">Chelsea</span><span className="font-label-xs text-label-xs text-outline">xG: 1.84 • Poss: 52%</span></div></div><div className="col-span-1 flex flex-col items-center justify-center"><div className="font-display-lg text-display-lg font-bold text-on-surface leading-none flex items-center gap-1"><span className="">2</span><span className="text-outline-variant font-light">–</span><span className="">2</span></div></div><div className="col-span-3 flex items-center justify-end gap-3 text-right"><div className="flex flex-col min-w-0"><span className="font-headline-sm text-headline-sm truncate text-on-surface">Arsenal</span><span className="font-label-xs text-label-xs text-outline">xG: 1.62 • Poss: 48%</span></div><div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center font-headline-md text-headline-md font-bold text-secondary shrink-0 border border-outline-variant">ARS</div></div></div><div className="grid grid-cols-2 gap-space-sm p-space-sm bg-surface-container-low rounded border border-outline-variant/40 font-label-xs text-label-xs text-on-surface-variant"><div className="flex flex-col gap-1"><span className="">⚽ N. Jackson 12&apos;</span><span className="">⚽ C. Palmer 45&apos; (P)</span><span className="text-[10px] text-outline flex items-center gap-1"><span className="text-primary font-bold">▲</span> Nkunku 67&apos; <span className="text-error font-bold">▼</span> Mudryk 67&apos;</span><span className="text-[10px] text-outline flex items-center gap-1"><span className="px-1 rounded bg-[#ffc107] text-[#1b1b20] font-bold">🟨</span> Caicedo 39&apos;</span></div><div className="flex flex-col gap-1 text-right"><span className="">⚽ G. Martinelli 21&apos;</span><span className="">⚽ B. Saka 62&apos;</span><span className="text-[10px] text-outline flex items-center justify-end gap-1"><span className="text-primary font-bold">▲</span> Trossard 70&apos; <span className="text-error font-bold">▼</span> Martinelli 70&apos;</span><span className="text-[10px] text-outline flex items-center justify-end gap-1"><span className="px-1 rounded bg-[#ffc107] text-[#1b1b20] font-bold">🟨</span> Gabriel 54&apos;</span></div></div><div className="flex flex-col gap-1.5 p-space-sm bg-surface-container-low rounded border border-outline-variant/40"><div className="flex items-center justify-between font-label-xs text-label-xs text-outline"><span className="font-bold text-on-surface">XGBOOST WIN PROBABILITY (IN-PLAY)</span><span className="">SIMULATIONS: 50,000</span></div><div className="w-full h-2 rounded bg-surface-container-highest overflow-hidden flex"><div className="bg-primary h-full transition-all" style={{ "width": "41%" }}></div><div className="bg-outline h-full transition-all" style={{ "width": "33%" }}></div><div className="bg-secondary-container h-full transition-all" style={{ "width": "26%" }}></div></div><div className="grid grid-cols-3 text-center pt-1 font-label-sm text-label-sm"><div className="flex flex-col"><span className="font-bold text-primary">CHE 41%</span><span className="text-outline font-label-xs text-label-xs">H: 2.80</span></div><div className="flex flex-col"><span className="font-bold text-on-surface-variant">DRAW 33%</span><span className="text-outline font-label-xs text-label-xs">D: 3.10</span></div><div className="flex flex-col"><span className="font-bold text-secondary">ARS 26%</span><span className="text-outline font-label-xs text-label-xs">A: 2.60</span></div></div></div><div className="flex flex-col gap-2 p-space-sm bg-surface-container-low rounded border border-outline-variant/40"><div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">grid_view</span><span className="font-headline-sm text-headline-sm text-xs font-bold text-on-surface">11v11 Tactical Pitch Visualizer</span></div><div className="flex items-center gap-1 bg-surface-container-lowest px-1.5 py-0.5 rounded border border-outline-variant"><span className="font-label-xs text-[10px] text-primary font-bold">4-2-3-1</span><span className="text-outline-variant text-[10px]">vs</span><span className="font-label-xs text-[10px] text-secondary font-bold">4-3-3</span></div></div><div className="relative w-full rounded overflow-hidden bg-[#eeece7] border border-[#d9d9dd] shadow-inner"><svg className="w-full h-auto block select-none" viewBox="0 0 520 320"><rect fill="#eeece7" height="320" width="520"></rect><rect fill="none" height="280" stroke="#d9d9dd" strokeWidth="1.5" width="480" x="20" y="20"></rect><line stroke="#d9d9dd" strokeWidth="1.5" x1="260" x2="260" y1="20" y2="300"></line><circle cx="260" cy="160" fill="none" r="45" stroke="#d9d9dd" strokeWidth="1.5"></circle><circle cx="260" cy="160" fill="#d9d9dd" r="2.5"></circle><rect fill="none" height="130" stroke="#d9d9dd" strokeWidth="1.5" width="75" x="20" y="95"></rect><rect fill="none" height="60" stroke="#d9d9dd" strokeWidth="1.5" width="28" x="20" y="130"></rect><circle cx="75" cy="160" fill="#d9d9dd" r="2.5"></circle><path d="M 95 130 A 40 40 0 0 1 95 190" fill="none" stroke="#d9d9dd" strokeWidth="1.5"></path><rect fill="none" height="130" stroke="#d9d9dd" strokeWidth="1.5" width="75" x="425" y="95"></rect><rect fill="none" height="60" stroke="#d9d9dd" strokeWidth="1.5" width="28" x="472" y="130"></rect><circle cx="445" cy="160" fill="#d9d9dd" r="2.5"></circle><path d="M 425 130 A 40 40 0 0 0 425 190" fill="none" stroke="#d9d9dd" strokeWidth="1.5"></path><path d="M 20 28 A 8 8 0 0 1 28 20" fill="none" stroke="#d9d9dd" strokeWidth="1.5"></path><path d="M 20 292 A 8 8 0 0 0 28 300" fill="none" stroke="#d9d9dd" strokeWidth="1.5"></path><path d="M 500 28 A 8 8 0 0 0 492 20" fill="none" stroke="#d9d9dd" strokeWidth="1.5"></path><path d="M 500 292 A 8 8 0 0 1 492 300" fill="none" stroke="#d9d9dd" strokeWidth="1.5"></path><line stroke="#fc7557" strokeDasharray="4 3" strokeWidth="1.5" x1="215" x2="290" y1="100" y2="60"></line><line stroke="#003c33" strokeDasharray="4 3" strokeWidth="1.5" x1="220" x2="320" y1="160" y2="160"></line><polygon fill="#fc7557" points="288,57 296,60 290,65"></polygon><polygon fill="#003c33" points="318,157 326,160 318,163"></polygon><g><circle cx="45" cy="160" fill="#00241e" r="10" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="8" fontWeight="bold" textAnchor="middle" y="163" x="45">1</text><text fill="#1b1b20" fontFamily="Space Grotesk" fontSize="8" fontWeight="bold" textAnchor="middle" y="180" x="45">Sanchez</text><circle cx="105" cy="65" fill="#00241e" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="68" x="105">3</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="82" x="105">Cucurella</text><circle cx="100" cy="125" fill="#00241e" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="128" x="100">6</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="142" x="100">Colwill</text><circle cx="100" cy="195" fill="#00241e" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="198" x="100">29</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="212" x="100">Fofana</text><circle cx="105" cy="255" fill="#00241e" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="258" x="105">27</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="272" x="105">Gusto</text><circle cx="160" cy="130" fill="#00241e" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="133" x="160">25</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="147" x="160">Caicedo</text><circle cx="160" cy="190" fill="#00241e" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="193" x="160">45</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="207" x="160">Lavia</text><circle cx="215" cy="85" fill="#00241e" r="9" stroke="#fc7557" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="88" x="215">11</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="102" x="215">Madueke</text><circle cx="220" cy="160" fill="#00241e" r="10" stroke="#fc7557" strokeWidth="2"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="163" x="220">20</text><text fill="#00241e" fontFamily="Space Grotesk" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="177" x="220">Palmer ★</text><circle cx="215" cy="235" fill="#00241e" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="238" x="215">7</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="252" x="215">Neto</text><circle cx="260" cy="120" fill="#00241e" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="123" x="260">15</text><text fill="#00241e" fontFamily="Space Grotesk" fontSize="7" fontWeight="bold" textAnchor="middle" y="137" x="260">Jackson ⚽</text></g><g><circle cx="475" cy="160" fill="#a83820" r="10" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="8" fontWeight="bold" textAnchor="middle" y="163" x="475">22</text><text fill="#1b1b20" fontFamily="Space Grotesk" fontSize="8" fontWeight="bold" textAnchor="middle" y="180" x="475">Raya</text><circle cx="415" cy="65" fill="#a83820" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="68" x="415">4</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="82" x="415">White</text><circle cx="420" cy="125" fill="#a83820" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="128" x="420">2</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="142" x="420">Saliba</text><circle cx="420" cy="195" fill="#a83820" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="198" x="420">6</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="212" x="420">Gabriel</text><circle cx="415" cy="255" fill="#a83820" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="258" x="415">12</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="272" x="415">Timber</text><circle cx="360" cy="160" fill="#a83820" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="163" x="360">5</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="177" x="360">Partey</text><circle cx="340" cy="105" fill="#a83820" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="108" x="340">41</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="122" x="340">Rice</text><circle cx="340" cy="215" fill="#a83820" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="218" x="340">8</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="232" x="340">Ødegaard</text><circle cx="290" cy="65" fill="#a83820" r="10" stroke="#fc7557" strokeWidth="2"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="68" x="290">7</text><text fill="#a83820" fontFamily="Space Grotesk" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="82" x="290">Saka ⚽</text><circle cx="290" cy="255" fill="#a83820" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="258" x="290">11</text><text fill="#00241e" fontFamily="Space Grotesk" fontSize="7" fontWeight="bold" textAnchor="middle" y="272" x="290">Martinelli ⚽</text><circle cx="295" cy="160" fill="#a83820" r="9" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="7.5" fontWeight="bold" textAnchor="middle" y="163" x="295">29</text><text fill="#404946" fontFamily="Space Grotesk" fontSize="7" textAnchor="middle" y="177" x="295">Havertz</text></g></svg></div><div className="flex items-center justify-between text-[10px] font-label-xs text-outline px-1"><span className="">CHE Passing Channel: Overload Left (56%)</span><span className="">ARS Transition Vector: Saka Isolation (xT +0.38)</span></div></div><div className="flex flex-col gap-2 p-space-sm bg-surface-container-low rounded border border-outline-variant/40"><div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">sports</span><span className="font-headline-sm text-headline-sm text-xs font-bold text-on-surface">Referee Whistle Profile: J. Brooks</span></div><span className="font-label-xs text-label-xs px-2 py-0.5 rounded bg-surface-container font-semibold text-secondary-container">VAR: P. Tierney</span></div><div className="flex flex-col gap-1"><div className="flex items-center justify-between text-[11px] font-label-xs"><span className="text-outline">Card Strictness Index:</span><span className="font-bold text-secondary font-label-sm">6.8 / 10.0 (Above Avg)</span></div><div className="w-full h-2 rounded bg-surface-container-highest overflow-hidden relative"><div className="h-full bg-gradient-to-r from-primary via-[#ffc107] to-secondary" style={{ "width": "68%" }}></div></div><div className="flex items-center justify-between text-[9px] font-label-xs text-outline"><span className="">1.0 Lenient</span><span className="">5.0 Median</span><span className="">10.0 Draconian</span></div></div><div className="grid grid-cols-4 gap-1 text-center pt-1 font-label-xs text-[10px]"><div className="p-1 rounded bg-surface-container-lowest"><span className="text-outline block">Yellows/G</span><span className="font-bold text-on-surface">3.32</span></div><div className="p-1 rounded bg-surface-container-lowest"><span className="text-outline block">Reds/G</span><span className="font-bold text-on-surface">0.18</span></div><div className="p-1 rounded bg-surface-container-lowest"><span className="text-outline block">Fouls/Match</span><span className="font-bold text-on-surface">22.4</span></div><div className="p-1 rounded bg-surface-container-lowest"><span className="text-outline block">Penalty %</span><span className="font-bold text-on-surface">18%</span></div></div></div></article>
<article className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-xs text-label-xs font-bold">
              HALF TIME
            </span>
<span className="font-label-xs text-label-xs text-outline uppercase font-semibold">PREMIER LEAGUE</span>
</div>
<button className="font-label-xs text-label-xs font-bold text-primary hover:text-secondary-container flex items-center gap-1 transition-colors" type="button">
            STATS <span className="material-symbols-outlined text-[14px]">north_east</span>
</button>
</div>
<div className="grid grid-cols-7 items-center gap-2">
<div className="col-span-3 flex items-center gap-3">
<div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center font-headline-sm text-sm font-bold text-secondary shrink-0">LIV</div>
<div className="flex flex-col min-w-0">
<span className="font-headline-sm text-headline-sm text-sm truncate text-on-surface">Liverpool</span>
<span className="font-label-xs text-label-xs text-outline">xG: 1.15</span>
</div>
</div>
<div className="col-span-1 flex items-center justify-center">
<span className="font-headline-lg text-headline-lg font-bold text-on-surface">1 – 0</span>
</div>
<div className="col-span-3 flex items-center justify-end gap-3 text-right">
<div className="flex flex-col min-w-0">
<span className="font-headline-sm text-headline-sm text-sm truncate text-on-surface">Brentford</span>
<span className="font-label-xs text-label-xs text-outline">xG: 0.28</span>
</div>
<div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center font-headline-sm text-sm font-bold text-outline shrink-0">BRE</div>
</div>
</div>
<div className="flex items-center justify-between p-2 bg-surface-container-low rounded font-label-xs text-label-xs">
<span className="text-on-surface-variant">⚽ M. Salah 31&apos;</span>
<span className="text-outline">Possession: 64% – 36%</span>
</div>
<div className="flex items-center justify-between text-outline font-label-xs text-label-xs">
<span className="flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">sports</span>
            Referee: M. Oliver (🟨 3.58 / match)
          </span>
<span className="">Anfield, Liverpool</span>
</div>
</article>
<article className="bg-surface-container-lowest rounded-lg p-space-md shadow-sm flex flex-col gap-space-sm opacity-95">
<div className="flex items-center justify-between">
<div className="flex items-center gap-space-xs">
<span className="px-2 py-0.5 rounded bg-surface-container text-outline font-label-xs text-label-xs font-semibold">
              TODAY 20:00
            </span>
<span className="font-label-xs text-label-xs text-outline uppercase font-semibold">FA CUP FIFTH ROUND</span>
</div>
<span className="font-label-xs text-label-xs text-secondary-container font-bold">PRE-MATCH TELEMETRY</span>
</div>
<div className="grid grid-cols-7 items-center gap-2">
<div className="col-span-3 flex items-center gap-3">
<div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center font-headline-sm text-sm font-bold text-tertiary-container shrink-0">EVE</div>
<div className="flex flex-col min-w-0">
<span className="font-headline-sm text-headline-sm text-sm truncate text-on-surface">Everton</span>
<span className="font-label-xs text-label-xs text-outline">Form: W-D-L-W</span>
</div>
</div>
<div className="col-span-1 flex items-center justify-center">
<span className="font-label-md text-label-md text-outline font-bold">VS</span>
</div>
<div className="col-span-3 flex items-center justify-end gap-3 text-right">
<div className="flex flex-col min-w-0">
<span className="font-headline-sm text-headline-sm text-sm truncate text-on-surface">Coventry City</span>
<span className="font-label-xs text-label-xs text-outline">Form: W-W-W-D</span>
</div>
<div className="w-9 h-9 rounded-full bg-surface-container flex items-center justify-center font-headline-sm text-sm font-bold text-on-surface-variant shrink-0">COV</div>
</div>
</div>
<div className="flex items-center justify-between p-2 bg-surface-container-low rounded font-label-xs text-label-xs">
<span className="text-on-surface">Implied Odds: 1.55 (EVE) | 4.20 (X) | 5.80 (COV)</span>
<span className="text-secondary font-semibold">High Cross Frequency Expected</span>
</div>
</article>
</section>
<aside className="lg:col-span-4 flex flex-col gap-space-md"><div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-sm border border-outline-variant"><div className="flex items-center justify-between"><div className="flex items-center gap-1.5"><span className="material-symbols-outlined text-[16px] text-primary">sports_soccer</span><span className="font-headline-sm text-headline-sm text-sm font-bold text-on-surface">Goal Frame Shot Map</span></div><span className="font-label-xs text-label-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">POST &amp; CROSSBAR VECTOR</span></div><div className="relative w-full rounded bg-[#eeece7] p-2 flex flex-col items-center justify-center border border-[#d9d9dd]"><svg className="w-full h-36 select-none" viewBox="0 0 320 140"><defs><pattern height="8" id="goalNet" patternUnits="userSpaceOnUse" width="8"><path d="M 0 0 L 8 8 M 8 0 L 0 8" fill="none" stroke="#d9d9dd" strokeWidth="0.5"></path></pattern></defs><rect fill="url(#goalNet)" height="90" width="240" x="40" y="25"></rect><line stroke="#c0c8c5" strokeWidth="1.5" x1="20" x2="300" y1="115" y2="115"></line><rect fill="none" height="90" stroke="#1b1b20" strokeWidth="3" width="240" x="40" y="25"></rect><circle cx="40" cy="25" fill="#1b1b20" r="2.5"></circle><circle cx="280" cy="25" fill="#1b1b20" r="2.5"></circle><g><circle cx="255" cy="42" fill="#003c33" r="7" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="6.5" fontWeight="bold" textAnchor="middle" y="44.5" x="255">45&apos;</text><circle cx="65" cy="95" fill="#003c33" r="6" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="6" fontWeight="bold" textAnchor="middle" y="97" x="65">12&apos;</text></g><g><circle cx="70" cy="40" fill="#a83820" r="6.5" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="6.5" fontWeight="bold" textAnchor="middle" y="42.5" x="70">21&apos;</text><circle cx="245" cy="90" fill="#a83820" r="6.5" stroke="#ffffff" strokeWidth="1.5"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="6.5" fontWeight="bold" textAnchor="middle" y="92.5" x="245">62&apos;</text></g><g><circle cx="180" cy="75" fill="#001c4d" r="5" stroke="#ffffff" strokeWidth="1.2"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="5" fontWeight="bold" textAnchor="middle" y="77" x="180">S</text><circle cx="140" cy="55" fill="#001c4d" r="5" stroke="#ffffff" strokeWidth="1.2"></circle><text fill="#ffffff" fontFamily="Space Mono" fontSize="5" fontWeight="bold" textAnchor="middle" y="57" x="140">S</text></g><g><line stroke="#707976" strokeWidth="2" x1="160" x2="168" y1="21" y2="29"></line><line stroke="#707976" strokeWidth="2" x1="168" x2="160" y1="21" y2="29"></line><text fill="#707976" fontFamily="Space Grotesk" fontSize="6.5" fontWeight="bold" y="18" x="152">69' BAR</text></g></svg><div className="flex items-center justify-between w-full text-[9px] font-label-xs text-outline pt-1 px-1"><span className="">Post-Shot xG: 2.44</span><span className="">Target Depth: 16 Shots (8 SoT, 4 Goals)</span></div></div><div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] font-label-xs"><div className="flex items-center gap-1.5 p-1 rounded bg-surface-container"><span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0"></span><span className="text-on-surface font-semibold truncate">Goal (4)</span></div><div className="flex items-center gap-1.5 p-1 rounded bg-surface-container"><span className="w-2.5 h-2.5 rounded-full bg-tertiary shrink-0"></span><span className="text-on-surface font-semibold truncate">Saved (4)</span></div><div className="flex items-center gap-1.5 p-1 rounded bg-surface-container"><span className="text-outline font-bold shrink-0">✕</span><span className="text-outline truncate">Woodwork (1)</span></div></div></div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-headline-sm text-sm font-bold text-on-surface">In-Play Momentum</span>
<span className="font-label-xs text-label-xs px-1.5 py-0.2 rounded bg-surface-container text-outline">CHE v ARS</span>
</div>
<span className="font-label-xs text-label-xs text-secondary font-bold">CHE +0.42 xT PEAK</span>
</div>
<div className="relative w-full h-32 bg-surface-container-low rounded p-2 flex flex-col justify-between overflow-hidden">
<div className="flex items-center justify-between text-[9px] font-label-xs text-outline select-none">
<span className="">+100 INTENSITY (CHE)</span>
<span className="">NEUTRAL BALANCE</span>
<span className="">+100 INTENSITY (ARS)</span>
</div>
<svg className="w-full h-20 overflow-visible" preserveAspectRatio="none" viewBox="0 0 300 80">
<defs>
<linearGradient id="momentumGradient" x1="0" x2="0" y1="0" y2="1">
<stop offset="0%" stopColor="#003c33" stopOpacity="0.25"></stop>
<stop offset="50%" stopColor="#eeece7" stopOpacity="0"></stop>
<stop offset="100%" stopColor="#a83820" stopOpacity="0.25"></stop>
</linearGradient>
</defs>
<line stroke="#c0c8c5" strokeDasharray="3 3" strokeWidth="1" x1="0" x2="300" y1="40" y2="40"></line>
<path d="M 0 40 
                     C 25 15, 40 10, 60 25 
                     C 80 40, 95 65, 120 60 
                     C 140 55, 160 30, 185 20 
                     C 210 10, 230 55, 255 35 
                     C 270 20, 285 28, 300 30 
                     L 300 40 L 0 40 Z" fill="url(#momentumGradient)"></path>
<path d="M 0 40 
                     C 25 15, 40 10, 60 25 
                     C 80 40, 95 65, 120 60 
                     C 140 55, 160 30, 185 20 
                     C 210 10, 230 55, 255 35 
                     C 270 20, 285 28, 300 30" fill="none" stroke="#003c33" strokeWidth="2.5"></path>
<circle className="animate-ping" cx="250" cy="35" fill="#fc7557" r="4"></circle>
<circle cx="250" cy="35" fill="#a83820" r="3"></circle>
</svg>
<div className="flex items-center justify-between text-[10px] font-label-xs text-outline select-none">
<span className="">0&apos;</span>
<span className="">15&apos;</span>
<span className="">30&apos;</span>
<span className="">45&apos;</span>
<span className="">60&apos;</span>
<span className="font-bold text-secondary">74&apos; (NOW)</span>
<span className="">90&apos;</span>
</div>
</div>
<div className="grid grid-cols-2 gap-2 text-center font-label-xs text-label-xs pt-1">
<div className="p-1.5 rounded bg-surface-container">
<span className="text-outline">Attacking 3rd Dominance:</span>
<span className="font-bold text-primary block">Chelsea 56%</span>
</div>
<div className="p-1.5 rounded bg-surface-container">
<span className="text-outline">Counter-Press Recovery:</span>
<span className="font-bold text-secondary block">Arsenal 4.8s</span>
</div>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm text-sm font-bold text-on-surface">Live Standings (EPL Real-Time)</span>
<span className="font-label-xs text-label-xs px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-medium">LIVE PTS</span>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left font-label-xs text-label-xs">
<thead>
<tr className="text-outline border-b-0 pb-1">
<th className="py-1">#</th>
<th className="py-1">Club</th>
<th className="py-1 text-center">PL</th>
<th className="py-1 text-center">W</th>
<th className="py-1 text-center">D</th>
<th className="py-1 text-center">L</th>
<th className="py-1 text-right font-bold text-on-surface">PTS</th>
<th className="py-1 text-right">Form</th>
</tr>
</thead>
<tbody className="text-on-surface">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-1.5 font-bold">1</td>
<td className="py-1.5 font-semibold text-primary">Liverpool</td>
<td className="py-1.5 text-center text-outline">28</td>
<td className="py-1.5 text-center">20</td>
<td className="py-1.5 text-center">5</td>
<td className="py-1.5 text-center">3</td>
<td className="py-1.5 text-right font-bold text-primary">65</td>
<td className="py-1.5 text-right">
<div className="flex items-center justify-end gap-1">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="w-2 h-2 rounded-full bg-primary"></span>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-1.5 font-bold">2</td>
<td className="py-1.5 font-semibold text-on-surface">Arsenal</td>
<td className="py-1.5 text-center text-outline">28</td>
<td className="py-1.5 text-center">18</td>
<td className="py-1.5 text-center">7</td>
<td className="py-1.5 text-center">3</td>
<td className="py-1.5 text-right font-bold text-on-surface">61</td>
<td className="py-1.5 text-right">
<div className="flex items-center justify-end gap-1">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="w-2 h-2 rounded-full bg-outline"></span>
<span className="w-2 h-2 rounded-full bg-primary"></span>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-1.5 font-bold">3</td>
<td className="py-1.5 font-semibold text-on-surface">Man City</td>
<td className="py-1.5 text-center text-outline">27</td>
<td className="py-1.5 text-center">17</td>
<td className="py-1.5 text-center">6</td>
<td className="py-1.5 text-center">4</td>
<td className="py-1.5 text-right font-bold text-on-surface">57</td>
<td className="py-1.5 text-right">
<div className="flex items-center justify-end gap-1">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="w-2 h-2 rounded-full bg-secondary"></span>
</div>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors bg-surface-container-low/50">
<td className="py-1.5 font-bold text-secondary">4</td>
<td className="py-1.5 font-semibold text-primary">Chelsea</td>
<td className="py-1.5 text-center text-outline">28</td>
<td className="py-1.5 text-center">15</td>
<td className="py-1.5 text-center">6</td>
<td className="py-1.5 text-center">7</td>
<td className="py-1.5 text-right font-bold text-secondary">51</td>
<td className="py-1.5 text-right">
<div className="flex items-center justify-end gap-1">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="w-2 h-2 rounded-full bg-outline"></span>
<span className="w-2 h-2 rounded-full bg-outline"></span>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<div className="bg-surface-container-lowest p-space-md rounded-lg shadow-sm flex flex-col gap-space-sm">
<div className="flex items-center justify-between">
<div className="flex items-center gap-1.5">
<span className="font-headline-sm text-headline-sm text-sm font-bold text-on-surface">H2H Prop Insights</span>
<span className="font-label-xs text-label-xs px-2 py-0.5 rounded bg-primary text-on-primary font-bold">94% CONF</span>
</div>
<span className="font-label-xs text-label-xs text-outline">OPTA TIER-1</span>
</div>
<div className="flex flex-col gap-2">
<div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm font-bold text-on-surface">Cole Palmer • Chelsea</span>
<span className="font-label-sm text-label-sm font-bold text-primary">1.92</span>
</div>
<p className="font-body-sm text-body-sm text-xs text-on-surface-variant">Over 1.5 Shots on Target</p>
<div className="flex items-center justify-between pt-1 font-label-xs text-label-xs">
<span className="text-secondary font-bold">8/10 Matches Hit (80%)</span>
<span className="text-outline">Avg: 2.3 SoT / 90</span>
</div>
</div>
<div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm font-bold text-on-surface">Bukayo Saka • Arsenal</span>
<span className="font-label-sm text-label-sm font-bold text-primary">1.78</span>
</div>
<p className="font-body-sm text-body-sm text-xs text-on-surface-variant">Over 2.5 Crosses</p>
<div className="flex items-center justify-between pt-1 font-label-xs text-label-xs">
<span className="text-secondary font-bold">9/10 Matches Hit (90%)</span>
<span className="text-outline">Avg: 4.1 Crosses / 90</span>
</div>
</div>
<div className="p-space-sm rounded bg-surface-container-low flex flex-col gap-1">
<div className="flex items-center justify-between">
<span className="font-label-sm text-label-sm font-bold text-on-surface">Nicolas Jackson • Chelsea</span>
<span className="font-label-sm text-label-sm font-bold text-primary">2.10</span>
</div>
<p className="font-body-sm text-body-sm text-xs text-on-surface-variant">To be Fouled 2+ Times</p>
<div className="flex items-center justify-between pt-1 font-label-xs text-label-xs">
<span className="text-secondary font-bold">7/10 Matches Hit (70%)</span>
<span className="text-outline">Target CB: Gabriel</span>
</div>
</div>
</div>
<button className="w-full py-1.5 rounded bg-surface-container text-on-surface font-label-xs text-label-xs font-semibold hover:bg-surface-container-high transition-colors" type="button">
          EXPORT COMPLETE PROP INDEX →
        </button>
</div>
</aside>
</div>
</div></main>
  );
}
