"use client";

import React, { useState } from "react";
import { X, ShieldCheck, Mail, Lock, User, ArrowRight } from "lucide-react";
import { getLeagueLogo } from "@/lib/logos";

interface Props {
  open: boolean;
  initialTab?: "signin" | "register";
  onClose: () => void;
}

export default function AuthModal({ open, initialTab = "signin", onClose }: Props) {
  const [tab, setTab] = useState<"signin" | "register">(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="w-full max-w-md mx-4 bg-white rounded-lg border border-cohere-hairline shadow-2xl overflow-hidden animate-slide-up font-body text-cohere-ink"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 bg-cohere-soft-stone border-b border-cohere-hairline relative text-center">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 text-cohere-muted hover:text-cohere-ink transition-colors"
          >
            <X size={18} />
          </button>
          <img
            src={getLeagueLogo()}
            alt="Premier League"
            className="w-10 h-10 object-contain mx-auto mb-2"
          />
          <h2 className="text-xl font-display font-medium text-cohere-primary tracking-tight">
            {tab === "signin" ? "Sign in to myPL" : "Join myPL"}
          </h2>
          <p className="text-xs text-cohere-body-muted mt-1 max-w-xs mx-auto">
            Personalize your stats, save player twins, and track AI match predictions.
          </p>

          {/* Tab Selector */}
          <div className="grid grid-cols-2 mt-4 p-1 bg-white rounded-pill border border-cohere-hairline">
            <button
              onClick={() => { setTab("signin"); setSubmitted(false); }}
              className={`py-1.5 text-xs font-mono font-bold rounded-pill transition-all ${
                tab === "signin"
                  ? "bg-cohere-primary text-white shadow-sm"
                  : "text-cohere-slate hover:text-cohere-ink"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setTab("register"); setSubmitted(false); }}
              className={`py-1.5 text-xs font-mono font-bold rounded-pill transition-all ${
                tab === "register"
                  ? "bg-cohere-primary text-white shadow-sm"
                  : "text-cohere-slate hover:text-cohere-ink"
              }`}
            >
              Join myPL
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-3 font-mono">
              <div className="w-12 h-12 rounded-full bg-cohere-pale-green text-cohere-deep-green flex items-center justify-center mx-auto">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-base font-bold text-cohere-primary">
                {tab === "signin" ? "Welcome Back!" : "Registration Successful!"}
              </h3>
              <p className="text-xs text-cohere-slate">
                Connecting session to Premier League Analytics engine...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === "register" && (
                <div>
                  <label className="text-xs font-mono font-bold text-cohere-ink block mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={15} className="text-cohere-muted absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ashirwad Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="cohere-input pl-9 w-full"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-mono font-bold text-cohere-ink block mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail size={15} className="text-cohere-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="cohere-input pl-9 w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-cohere-ink block mb-1">
                  Password
                </label>
                <div className="relative">
                  <Lock size={15} className="text-cohere-muted absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="cohere-input pl-9 w-full"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="button-primary w-full py-2.5 font-mono text-xs flex items-center justify-center gap-2"
              >
                <span>{tab === "signin" ? "Sign In" : "Create myPL Account"}</span>
                <ArrowRight size={14} />
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-cohere-muted font-mono">
                  By signing in, you agree to the Premier League Terms & Conditions.
                </span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
