import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StatsBanner from "@/components/StatsBanner";

export const metadata: Metadata = {
  title: "Cohere Analytics // Premier League & Worldwide Football Intelligence",
  description:
    "Enterprise football analytics, matchday fixtures, team logs, player radar scouting, and calibrated ML models built with Cohere web system principles.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-white text-cohere-ink font-body min-h-screen antialiased selection:bg-cohere-coral selection:text-white">
        <Navbar />
        <StatsBanner />
        <main className="max-w-[1440px] mx-auto px-4 py-8">{children}</main>

        {/* Cohere Enterprise Footer */}
        <footer className="w-full bg-cohere-primary text-white border-t border-white/10 mt-16">
          <div className="max-w-[1440px] mx-auto px-6 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-display text-xl font-normal tracking-tight text-white">Cohere Football</span>
                <span className="font-mono text-xs uppercase tracking-wider text-cohere-coral">
                  // ENTERPRISE INTELLIGENCE
                </span>
              </div>
              <p className="text-xs text-cohere-muted max-w-xl font-body leading-relaxed">
                Controlled enterprise football analytics, calibrated Bayesian match forecasting, 2D PCA tactical manifolds, and automated in-play tracking.
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs text-cohere-muted font-body">
              <span>© {new Date().getFullYear()} Cohere AI Football</span>
              <a href="https://cohere.com" target="_blank" rel="noreferrer" className="text-white hover:underline">
                cohere.com
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
