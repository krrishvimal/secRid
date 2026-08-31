"use client";

import React from "react";
import { Download, X, Sparkles, Shield, Bell } from "lucide-react";

interface InstallPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InstallPromptModal({ isOpen, onClose }: InstallPromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-sanctuary-card border border-sanctuary-accent/30 rounded-3xl p-6 shadow-2xl text-left overflow-hidden">
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-sanctuary-accent/15 rounded-full blur-2xl" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-sanctuary-textMuted hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-sanctuary-accent/20 flex items-center justify-center text-sanctuary-accent">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-white">Add to Home Screen</h3>
            <p className="text-xs text-sanctuary-textMuted">Private, 1-tap access to your letters</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-5">
          Install Sanctuary as a discrete mobile app on your phone. Get instant access to responses without searching your browser history.
        </p>

        <div className="space-y-2.5 mb-6 text-xs text-slate-300">
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5">
            <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Private icon without revealing web history</span>
          </div>
          <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5">
            <Bell className="w-4 h-4 text-sanctuary-accent shrink-0" />
            <span>Read your letters offline anytime</span>
          </div>
        </div>

        <div className="space-y-2">
          <button
            onClick={() => {
              alert("To install on iOS: Tap 'Share' -> 'Add to Home Screen'\n\nTo install on Android: Tap the 3 dots menu -> 'Install App'");
              onClose();
            }}
            className="w-full py-3 rounded-2xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 text-xs font-medium text-white flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Download className="w-4 h-4" />
            How to Install on Phone
          </button>
          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-sanctuary-textMuted hover:text-slate-200 transition-colors"
          >
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
