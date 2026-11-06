import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StatsBanner from "@/components/StatsBanner";

export const metadata: Metadata = {
  title: "Stats Centre | Premier League Analytics Platform",
  description:
    "Official-style Premier League Stats Centre powered by Machine Learning — Transfer Values, Match Outcomes, and Player Scouting Intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-pl-deepest text-white min-h-screen">
        <Navbar />
        <StatsBanner />
        <main className="max-w-[1400px] mx-auto px-4 py-8">{children}</main>

        {/* Footer */}
        <footer className="w-full bg-pl-utility border-t border-pl-border mt-12">
          <div className="max-w-[1400px] mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">⚽</span>
              <span className="text-[12px] font-bold tracking-wider text-pl-text-secondary">
                PREMIER LEAGUE ANALYTICS PLATFORM
              </span>
            </div>
            <p className="text-[11px] text-pl-text-muted">
              ML-powered predictions. Not affiliated with the Premier League.
              Built for educational purposes.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
