"use client";

import React, { useEffect } from "react";
import { Sparkles, MessageSquare, Compass, HeartHandshake, Shield } from "lucide-react";
import { ActiveTab } from "@/types";

interface AppShellProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  children: React.ReactNode;
  onOpenCrisis: () => void;
  unreadCount?: number;
}

export function AppShell({
  activeTab,
  setActiveTab,
  children,
  onOpenCrisis,
  unreadCount = 0,
}: AppShellProps) {
  // Register Service Worker for PWA
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => console.log("PWA Service Worker registered:", reg.scope))
        .catch((err) => console.warn("PWA Service Worker registration failed:", err));
    }
  }, []);

  return (
    <div className="min-h-[100dvh] w-full bg-sanctuary-dark flex flex-col items-center justify-between text-slate-100 atmospheric-bg relative overflow-x-hidden">
      {/* Top Header Bar */}
      <header className="w-full max-w-md h-14 px-4 flex items-center justify-between z-30 border-b border-white/[0.04] backdrop-blur-md sticky top-0 bg-sanctuary-dark/80">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-sanctuary-accent/20 border border-sanctuary-accent/40 flex items-center justify-center">
            <span className="text-xs">🌙</span>
          </div>
          <div>
            <h1 className="text-sm font-semibold tracking-wider uppercase text-gradient">
              Sanctuary
            </h1>
          </div>
        </div>

        {/* Crisis Help Trigger */}
        <button
          onClick={onOpenCrisis}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.04] hover:bg-rose-500/10 border border-white/[0.08] hover:border-rose-500/30 text-xs text-sanctuary-textMuted hover:text-rose-300 transition-all"
          title="Crisis Support Helpline"
        >
          <HeartHandshake className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium">Need Help?</span>
        </button>
      </header>

      {/* Main Screen Content */}
      <main className="w-full max-w-md flex-1 flex flex-col justify-center relative z-10 pb-20">
        {children}
      </main>

      {/* Sticky Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center pointer-events-none">
        <div className="w-full max-w-md pointer-events-auto bg-[#0F121C]/90 backdrop-blur-xl border-t border-white/[0.08] px-6 py-2.5 flex items-center justify-around shadow-2xl safe-area-pb">
          {/* Tab 1: Deck */}
          <button
            onClick={() => setActiveTab("deck")}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all ${
              activeTab === "deck"
                ? "text-sanctuary-accent font-semibold scale-105"
                : "text-sanctuary-textMuted hover:text-slate-200"
            }`}
          >
            <Compass className="w-5 h-5" />
            <span className="text-[10px]">Deck</span>
          </button>

          {/* Tab 2: Release (Hero Center Action) */}
          <button
            onClick={() => setActiveTab("release")}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl transition-all ${
              activeTab === "release"
                ? "text-sanctuary-accent font-semibold scale-105"
                : "text-sanctuary-textMuted hover:text-slate-200"
            }`}
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                activeTab === "release"
                  ? "bg-sanctuary-accent text-white shadow-lg shadow-sanctuary-accent/30"
                  : "bg-white/10 text-slate-300 hover:bg-white/15"
              }`}
            >
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-[10px]">Release</span>
          </button>

          {/* Tab 3: Responses Inbox */}
          <button
            onClick={() => setActiveTab("inbox")}
            className={`flex flex-col items-center gap-1 py-1 px-4 rounded-2xl relative transition-all ${
              activeTab === "inbox"
                ? "text-sanctuary-accent font-semibold scale-105"
                : "text-sanctuary-textMuted hover:text-slate-200"
            }`}
          >
            <div className="relative">
              <MessageSquare className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1.5 w-2.5 h-2.5 rounded-full bg-sanctuary-rose ring-2 ring-[#0F121C] animate-pulse" />
              )}
            </div>
            <span className="text-[10px]">Responses</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
