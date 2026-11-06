"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DollarSign, ShieldAlert, Users, Activity, ExternalLink } from "lucide-react";
import { fetchHealth, HealthStatus } from "@/lib/api";

export default function Sidebar() {
  const pathname = usePathname();
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);

  useEffect(() => {
    const checkApi = async () => {
      try {
        const data = await fetchHealth();
        setHealth(data);
        setIsOnline(data.status === "healthy");
      } catch (err) {
        setIsOnline(false);
      }
    };
    checkApi();
    const interval = setInterval(checkApi, 10000);
    return () => clearInterval(interval);
  }, []);

  const navItems = [
    {
      name: "Transfer Value Predictor",
      href: "/transfer-predictor",
      icon: DollarSign,
      code: "MOD-01",
      badge: "Linear Reg",
    },
    {
      name: "Match Outcome Predictor",
      href: "/match-predictor",
      icon: ShieldAlert,
      code: "MOD-02",
      badge: "XGBoost",
    },
    {
      name: "Scouting Studio",
      href: "/scouting-studio",
      icon: Users,
      code: "MOD-03",
      badge: "K-Means",
    },
  ];

  return (
    <aside className="w-72 flex-shrink-0 bg-[#080A0F] border-r border-white/10 flex flex-col justify-between p-5 min-h-screen">
      <div>
        {/* Branding */}
        <div className="flex items-center gap-3.5 pb-6 border-b border-white/10">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#38003C] to-[#0E131F] border border-white/15 flex items-center justify-center text-2xl shadow-inner">
            🦁
          </div>
          <div>
            <div className="font-extrabold text-lg tracking-tight text-white flex items-center gap-1.5">
              PL INTEL
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#00FF85]/15 text-[#00FF85] border border-[#00FF85]/30">
                PRO
              </span>
            </div>
            <div className="text-xs text-[#00FF85] font-semibold tracking-wide uppercase">
              Predictive AI Suite
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-7">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3 px-1">
            Machine Learning Engines
          </div>
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = pathname === item.href || (pathname === "/" && item.href === "/transfer-predictor");
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-150 ${
                    active
                      ? "bg-white/[0.08] text-white border border-[#00FF85]/40 shadow-[0_0_15px_-3px_rgba(0,255,133,0.2)]"
                      : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.03] border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-colors ${
                        active ? "text-[#00FF85]" : "text-slate-400 group-hover:text-slate-200"
                      }`}
                    />
                    <div className="text-sm font-medium">{item.name}</div>
                  </div>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      active
                        ? "bg-[#00FF85]/20 text-[#00FF85]"
                        : "bg-white/5 text-slate-400 group-hover:bg-white/10"
                    }`}
                  >
                    {item.badge}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Footer Info & API Health Indicator */}
      <div className="pt-6 border-t border-white/10 space-y-3">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Activity className={`w-4 h-4 ${isOnline ? "text-[#00FF85] animate-pulse" : "text-red-400"}`} />
            <div>
              <div className="text-xs font-semibold text-white">FastAPI ML Core</div>
              <div className="text-[10px] text-slate-400">Port 8000 (Python)</div>
            </div>
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
              isOnline
                ? "bg-[#00FF85]/15 text-[#00FF85] border-[#00FF85]/30"
                : "bg-red-500/15 text-red-400 border-red-500/30"
            }`}
          >
            {isOnline ? "ONLINE" : "OFFLINE"}
          </span>
        </div>

        <div className="text-[11px] text-slate-400 text-center">
          Unified Next.js 14 + FastAPI Microservice
        </div>
      </div>
    </aside>
  );
}
