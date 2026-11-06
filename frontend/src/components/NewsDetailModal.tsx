"use client";

import React from "react";
import { X, Calendar, Share2, ArrowRight } from "lucide-react";
import { getClubCrest } from "@/lib/logos";

export interface NewsItem {
  club: string;
  headline: string;
  summary: string;
  date: string;
  category: string;
}

interface Props {
  news: NewsItem | null;
  onClose: () => void;
}

export default function NewsDetailModal({ news, onClose }: Props) {
  if (!news) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="w-full max-w-lg mx-4 bg-pl-dark rounded-pl-lg border border-pl-border shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner with club crest */}
        <div className="relative p-6 bg-pl-gradient flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={getClubCrest(news.club, 70)}
              alt={news.club}
              className="w-12 h-12 object-contain drop-shadow"
            />
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-black/30 text-pl-green">
                {news.category}
              </span>
              <div className="text-sm font-extrabold text-white mt-1">
                {news.club}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-black/20 text-white/80 hover:text-white hover:bg-black/40 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 text-xs text-pl-text-muted">
            <Calendar size={13} />
            <span>{news.date}</span>
            <span>•</span>
            <span>Official Premier League Club Bulletin</span>
          </div>

          <h3 className="text-xl font-extrabold text-white leading-tight">
            {news.headline}
          </h3>

          <p className="text-sm text-pl-text-secondary leading-relaxed">
            {news.summary}
          </p>

          <div className="pt-4 border-t border-pl-border flex items-center justify-between">
            <button
              onClick={onClose}
              className="pl-btn-white text-xs py-2 px-5"
            >
              Continue to Analytics <ArrowRight size={13} />
            </button>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: news.headline, text: news.summary, url: window.location.href });
                }
              }}
              className="p-2 text-pl-text-muted hover:text-white transition-colors"
            >
              <Share2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
