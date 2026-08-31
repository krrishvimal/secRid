"use client";

import React from "react";
import { Phone, Heart, X, MessageSquare } from "lucide-react";

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-sanctuary-card border border-rose-500/30 rounded-3xl p-6 shadow-2xl text-left overflow-hidden">
        {/* Ambient Warm Glow */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-rose-500/10 rounded-full blur-2xl" />
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-sanctuary-textMuted hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon & Title */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-400">
            <Heart className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-white">You are not alone</h2>
            <p className="text-xs text-rose-300/80">Support is available 24/7. Free & confidential.</p>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-6">
          If you are in distress or carrying overwhelming pain, please let a trained human support you tonight. Sanctuary is an anonymous bulletin, but real compassionate help is waiting:
        </p>

        {/* Emergency Resources */}
        <div className="space-y-3 mb-6">
          {/* AASRA Helpline */}
          <a
            href="tel:+919820466726"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-400/40 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-rose-400" />
              <div>
                <div className="text-sm font-medium text-white">AASRA Helpline (India)</div>
                <div className="text-xs text-slate-400">+91 9820466726 (24/7)</div>
              </div>
            </div>
            <span className="text-xs text-rose-400 font-medium px-2.5 py-1 rounded-full bg-rose-400/10 group-hover:bg-rose-400/20">Call</span>
          </a>

          {/* Vandrevala Foundation */}
          <a
            href="tel:+919999666555"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-400/40 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-rose-400" />
              <div>
                <div className="text-sm font-medium text-white">Vandrevala Foundation</div>
                <div className="text-xs text-slate-400">+91 9999 666 555 (24/7)</div>
              </div>
            </div>
            <span className="text-xs text-rose-400 font-medium px-2.5 py-1 rounded-full bg-rose-400/10 group-hover:bg-rose-400/20">Call</span>
          </a>

          {/* US / Global 988 */}
          <a
            href="tel:988"
            className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-400/40 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-rose-400" />
              <div>
                <div className="text-sm font-medium text-white">Suicide & Crisis Lifeline (US)</div>
                <div className="text-xs text-slate-400">Dial 988 (Call or Text)</div>
              </div>
            </div>
            <span className="text-xs text-rose-400 font-medium px-2.5 py-1 rounded-full bg-rose-400/10 group-hover:bg-rose-400/20">Call</span>
          </a>

          {/* Crisis Text Line */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-4 h-4 text-rose-400" />
              <div>
                <div className="text-sm font-medium text-white">Crisis Text Line</div>
                <div className="text-xs text-slate-400">Text HOME to 741741</div>
              </div>
            </div>
            <span className="text-xs text-slate-400 font-medium px-2.5 py-1 rounded-full bg-white/5">Text</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-sm font-medium text-slate-300 transition-colors"
        >
          Return to Sanctuary
        </button>
      </div>
    </div>
  );
}
