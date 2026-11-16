"use client";

import React, { useState } from "react";
import Link from "next/link";

interface Props {
  open: boolean;
  initialTab?: "signin" | "register";
  onClose: () => void;
}

export default function AuthModal({ open, initialTab = "signin", onClose }: Props) {
  const [mode, setMode] = useState<"signin" | "signup">(
    initialTab === "register" ? "signup" : "signin"
  );
  const [email, setEmail] = useState("analyst@club.com");
  const [password, setPassword] = useState("••••••••••••••••");
  const [fullName, setFullName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
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
    <div
      className="fixed inset-0 z-50 bg-[#17171c]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="w-full max-w-[440px] bg-white border border-[#d9d9dd] rounded-[22px] p-8 sm:p-9 relative z-10 shadow-2xl animate-slide-up text-[#212121]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 text-[#75758a] hover:text-[#17171c] transition-colors p-1"
          title="Close Modal"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Top Technical Mono Tag */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="inline-block w-2 h-2 rounded-full bg-[#ff7759] animate-pulse" />
          <span className="font-mono text-[12px] uppercase font-bold text-[#ff7759] tracking-[0.28px]">
            ANALYST ACCESS // MATCHDAY INTELLIGENCE
          </span>
        </div>

        {/* Headline & Subtitle */}
        <div className="mb-6">
          <h2 className="font-display font-bold text-[28px] sm:text-[32px] leading-tight text-[#17171c] tracking-[-0.32px]">
            {mode === "signin" ? "Sign in to PlayerStats" : "Create an account"}
          </h2>
          <p className="text-[14px] leading-relaxed text-[#616161] mt-2">
            {mode === "signin"
              ? "Access saved clubs, custom scouting models, and real-time referee foul alerts."
              : "Start tracking live pitch telemetry, xG models, and tactical squad benchmarks."}
          </p>
        </div>

        {/* Mode Switcher Pill Bar */}
        <div className="w-full bg-[#eeece7] p-1 rounded-[32px] flex items-center mb-6">
          <button
            type="button"
            onClick={() => {
              setMode("signin");
              setSubmitted(false);
            }}
            className={`flex-1 py-2 text-center text-[13px] font-medium rounded-[28px] transition-all cursor-pointer ${
              mode === "signin"
                ? "bg-[#17171c] text-white shadow-sm"
                : "text-[#75758a] hover:text-[#17171c]"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("signup");
              setSubmitted(false);
            }}
            className={`flex-1 py-2 text-center text-[13px] font-medium rounded-[28px] transition-all cursor-pointer ${
              mode === "signup"
                ? "bg-[#17171c] text-white shadow-sm"
                : "text-[#75758a] hover:text-[#17171c]"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Form or Confirmation */}
        {submitted ? (
          <div className="py-8 text-center space-y-3 font-mono">
            <div className="w-12 h-12 rounded-full bg-[#edfce9] text-[#003c33] flex items-center justify-center mx-auto">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[#17171c]">
              {mode === "signin" ? "Welcome Back, Analyst!" : "Registration Successful!"}
            </h3>
            <p className="text-xs text-[#75758a]">
              Authenticated session. Connecting to Matchday Intelligence Engine...
            </p>
          </div>
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Optional Name field for Signup */}
            {mode === "signup" && (
              <div className="space-y-1.5 animate-slide-up">
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#17171c]">
                  Full Name &amp; Federation Role
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Pep Guardiola (Technical Staff)"
                  className="w-full h-11 px-3.5 bg-white border border-[#d9d9dd] rounded-lg text-[14px] text-[#212121] placeholder-[#75758a] focus:outline-none focus:border-[#17171c] focus:ring-1 focus:ring-[#17171c] transition-all"
                />
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#17171c]">
                Work or Personal Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="analyst@club.com"
                  required
                  className="w-full h-11 px-3.5 bg-white border border-[#d9d9dd] rounded-lg text-[14px] text-[#212121] placeholder-[#75758a] focus:outline-none focus:border-[#17171c] focus:ring-1 focus:ring-[#17171c] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-[#17171c]">
                  Password
                </label>
                {mode === "signin" && (
                  <button
                    type="button"
                    onClick={() => alert("Password reset instructions dispatched to your email address.")}
                    className="text-[13px] font-medium text-[#1863dc] hover:underline underline-offset-2"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your security passkey"
                  required
                  className="w-full h-11 pl-3.5 pr-10 bg-white border border-[#d9d9dd] rounded-lg text-[14px] text-[#212121] placeholder-[#75758a] focus:outline-none focus:border-[#17171c] focus:ring-1 focus:ring-[#17171c] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 text-[#75758a] hover:text-[#17171c] p-1 focus:outline-none cursor-pointer"
                  title="Toggle password visibility"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {showPassword ? (
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
                      />
                    ) : (
                      <>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </>
                    )}
                  </svg>
                </button>
              </div>
            </div>

            {/* Session Checkbox Option */}
            <div className="pt-1 flex items-center justify-between">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-[#d9d9dd] text-[#17171c] focus:ring-[#17171c] accent-[#17171c] cursor-pointer"
                />
                <span className="text-[14px] text-[#212121]">Keep me signed in for 30 days</span>
              </label>
            </div>

            {/* Primary CTA Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full h-11 rounded-[32px] bg-[#17171c] hover:bg-[#2b2b33] active:scale-[0.99] text-white font-medium text-[14px] flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-sm"
              >
                <span>{mode === "signin" ? "Sign In" : "Create Account"}</span>
                <span className="font-mono text-xs">→</span>
              </button>
            </div>
          </form>
        )}

        {/* Divider Rule */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#d9d9dd]" />
          </div>
          <div className="relative flex justify-center text-[12px]">
            <span className="bg-white px-3 font-mono uppercase text-[#93939f] tracking-wider">
              OR CONTINUE WITH
            </span>
          </div>
        </div>

        {/* SSO Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Google SSO */}
          <button
            type="button"
            onClick={() => {
              setEmail("google.analyst@club.com");
              setSubmitted(true);
              setTimeout(() => {
                setSubmitted(false);
                onClose();
              }, 1200);
            }}
            className="h-10 px-4 rounded-[30px] border border-[#d9d9dd] bg-white hover:bg-[#fbf8ff] hover:border-[#17171c] text-[#17171c] text-[13px] font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.15z" />
              <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z" />
              <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z" />
              <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z" />
            </svg>
            <span>Google</span>
          </button>

          {/* GitHub SSO */}
          <button
            type="button"
            onClick={() => {
              setEmail("github.analyst@club.com");
              setSubmitted(true);
              setTimeout(() => {
                setSubmitted(false);
                onClose();
              }, 1200);
            }}
            className="h-10 px-4 rounded-[30px] border border-[#d9d9dd] bg-white hover:bg-[#fbf8ff] hover:border-[#17171c] text-[#17171c] text-[13px] font-medium flex items-center justify-center space-x-2 transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4 fill-current text-[#17171c]" viewBox="0 0 24 24">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
              />
            </svg>
            <span>GitHub</span>
          </button>
        </div>

        {/* Modal Link to Full Page */}
        <div className="mt-6 pt-4 border-t border-[#d9d9dd] text-center">
          <Link
            href="/auth"
            onClick={onClose}
            className="text-[12px] text-[#1863dc] hover:underline font-mono"
          >
            Open Dedicated Sign In Terminal ↗
          </Link>
        </div>
      </div>
    </div>
  );
}
