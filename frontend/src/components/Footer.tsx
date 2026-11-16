"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full bg-surface-container-lowest border-t border-outline-variant mt-space-xl">
      <div className="w-full px-margin-desktop py-space-xl flex flex-col md:flex-row items-start justify-between gap-space-lg">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-space-xs">
            <div className="w-5 h-5 bg-primary text-on-primary flex items-center justify-center rounded font-headline-sm text-xs font-bold">
              C
            </div>
            <span className="font-headline-sm text-headline-sm text-on-surface">
              PlayerStats Enterprise
            </span>
            <span className="font-label-xs text-label-xs px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-mono">
              Cohere Engine 2026
            </span>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md">
            High-fidelity football data terminal, live pitch telemetry, and AI probability indices engineered for professional front offices and analytical syndicates.
          </p>
          <div className="flex flex-wrap items-center gap-space-md pt-space-xs font-label-xs text-label-xs text-outline font-mono">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-primary-container" /> SYSTEM STATUS: OPERATIONAL
            </span>
            <span>LATENCY: 14MS</span>
            <span>FEED: OPTA / STATSBOMB TIER-1</span>
          </div>
        </div>

        <div className="flex flex-wrap items-start gap-space-xl">
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-xs text-label-xs uppercase text-on-surface font-semibold">
              Analytics Core
            </span>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/match-predictor">
              Pitch Telemetry
            </Link>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/player/lamine-yamal">
              xG Vector Engine
            </Link>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/simulation">
              Monte Carlo Sims
            </Link>
          </div>
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-xs text-label-xs uppercase text-on-surface font-semibold">
              Enterprise API
            </span>
            <a className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="http://localhost:8001/docs" target="_blank" rel="noreferrer">
              FastAPI Gateway
            </a>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/inplay-fouls">
              Webhook Ingest
            </Link>
            <Link className="font-body-sm text-body-sm text-on-surface-variant hover:text-primary transition-colors" href="/referees">
              Telemetry Schema
            </Link>
          </div>
          <div className="flex flex-col gap-space-xs">
            <span className="font-label-xs text-label-xs uppercase text-on-surface font-semibold">
              Governance
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Enterprise SLA 99.98%
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Data Privacy &amp; GDPR
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Security Compliance
            </span>
          </div>
        </div>
      </div>

      <div className="w-full px-margin-desktop py-space-sm border-t border-outline-variant flex flex-col sm:flex-row items-center justify-between gap-2 font-label-xs text-label-xs text-outline font-mono">
        <div className="flex items-center gap-space-md">
          <span>© 2026 Cohere Enterprise • PlayerStats Platform. All rights reserved.</span>
        </div>
        <div className="flex items-center gap-space-md">
          <span className="hover:text-on-surface cursor-pointer">Terms of License</span>
          <span className="hover:text-on-surface cursor-pointer">Security Disclosure</span>
          <span className="hover:text-on-surface cursor-pointer">API Status v2.6.4</span>
        </div>
      </div>
    </footer>
  );
}
