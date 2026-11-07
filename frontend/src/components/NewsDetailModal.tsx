"use client";

import React from "react";
import Image from "next/image";
import { X, Calendar, Share2, ExternalLink, Globe } from "lucide-react";
import { getGlobalClubCrest } from "@/lib/logos";

export interface NewsItem {
  id?: string;
  club: string;
  headline: string;
  summary: string;
  date?: string;
  pub_date?: string;
  timestamp?: string;
  category: string;
  source?: string;
  link?: string;
}

interface Props {
  news: NewsItem | null;
  onClose: () => void;
}

export default function NewsDetailModal({ news, onClose }: Props) {
  if (!news) return null;

  const displayTime = news.timestamp || news.date || "Just now";
  const displaySource = news.source || "World Football Press";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg bg-white rounded-lg border border-[#e5e7eb] shadow-2xl overflow-hidden animate-slide-up font-body text-cohere-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon with club badge */}
        <div className="relative p-6 bg-cohere-soft-stone border-b border-cohere-hairline flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="relative w-12 h-12 shrink-0 flex items-center justify-center bg-white rounded-md p-1 border border-cohere-hairline shadow-2xs">
              <Image
                src={getGlobalClubCrest(news.club)}
                alt={news.club}
                width={40}
                height={40}
                className="object-contain"
                unoptimized
              />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-xs font-mono text-[11px] uppercase tracking-wider font-semibold text-white bg-cohere-coral">
                {news.category}
              </span>
              <div className="text-base font-bold text-cohere-primary mt-1 font-display tracking-tight">
                {news.club}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-cohere-muted hover:text-cohere-ink hover:bg-cohere-hairline/60 transition-colors"
            title="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono text-cohere-muted">
            <Globe size={13} className="text-cohere-coral" />
            <span className="font-medium text-cohere-primary">{displaySource}</span>
            <span>•</span>
            <Calendar size={13} />
            <span>{displayTime}</span>
          </div>

          <h3 className="text-xl font-display font-bold text-cohere-primary leading-snug">
            {news.headline}
          </h3>

          <p className="text-sm text-cohere-body-muted leading-relaxed font-body">
            {news.summary}
          </p>

          {/* Action Row */}
          <div className="pt-4 border-t border-cohere-hairline flex items-center justify-between gap-3">
            {news.link ? (
              <a
                href={news.link}
                target="_blank"
                rel="noopener noreferrer"
                className="button-primary bg-[#17171c] hover:bg-black text-white rounded-pill px-6 py-2.5 text-sm font-medium inline-flex items-center gap-2 transition-colors"
              >
                <span>Read Full Story</span>
                <ExternalLink size={14} />
              </a>
            ) : (
              <button
                type="button"
                onClick={onClose}
                className="button-primary bg-[#17171c] hover:bg-black text-white rounded-pill px-6 py-2.5 text-sm font-medium transition-colors"
              >
                Close Story
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: news.headline,
                    text: news.summary,
                    url: news.link || window.location.href,
                  }).catch(() => {});
                }
              }}
              className="p-2 text-cohere-slate hover:text-cohere-ink rounded-full hover:bg-cohere-soft-stone transition-colors"
              title="Share headline"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
