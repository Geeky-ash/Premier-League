"use client";

import React from "react";
import { usePathname } from "next/navigation";

export default function MainContentWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/auth" || pathname === "/login";

  // 1. Clean full-bleed minimal layout on authentication terminal pages
  if (isAuthPage) {
    return <main className="w-full min-h-screen">{children}</main>;
  }

  // 2. Full-bleed Stitch Matchday Hub on / and /fixtures
  const isMatchdayHub = pathname === "/" || pathname === "/fixtures";
  if (isMatchdayHub) {
    return (
      <main className="w-full pt-[140px] bg-surface min-h-[calc(100vh-220px)]">
        {children}
      </main>
    );
  }

  // 3. Specialized full-bleed tactical workspaces (/dugout, /referees, /simulation)
  const isFullBleedCustom =
    pathname === "/dugout" ||
    pathname === "/referees" ||
    pathname === "/simulation";

  if (isFullBleedCustom) {
    return (
      <main className="w-full pt-[148px] min-h-[calc(100vh-220px)]">
        {children}
      </main>
    );
  }

  // 4. Standard content routes (/inplay-fouls, /transfer-predictor, /scouting-studio, /match-predictor, /comparison, /opposition, /leaderboards, /league/[slug], /team/[slug], /player/[id])
  // pt-[140px] + pt-6 provides 164px total top clearance (>= 140 + 12 = 152px), guaranteeing zero text/headings under the sticky 140px header stack
  return (
    <main className="w-full pt-[140px] min-h-[calc(100vh-220px)]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {children}
      </div>
    </main>
  );
}
