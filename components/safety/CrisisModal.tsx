"use client";

import React from "react";
import { Phone, Heart, X } from "lucide-react";

interface CrisisModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CrisisModal({ isOpen, onClose }: CrisisModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
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
            <p className="text-xs text-rose-300/90 font-medium">
              Free & Confidential 24/7 National Helplines (India)
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
          If you are in distress or carrying heavy pain, please speak with a trained professional. Sanctuary is an anonymous bulletin, but real compassionate care is available across India right now:
        </p>

        {/* Indian Emergency Helplines */}
        <div className="space-y-3 mb-6">
          {/* Tele-MANAS (Govt of India Primary National Helpline) */}
          <a
            href="tel:14416"
            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-400/40 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white flex items-center gap-2">
                  <span>Tele-MANAS (Govt. of India)</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-medium">Toll-Free</span>
                </div>
                <div className="text-xs text-slate-400">Dial 14416 or 1800-891-4416 (24/7, All Indian Languages)</div>
              </div>
            </div>
            <span className="text-xs text-rose-400 font-semibold px-3 py-1.5 rounded-full bg-rose-400/10 group-hover:bg-rose-400/20">
              Call
            </span>
          </a>

          {/* Vandrevala Foundation */}
          <a
            href="tel:+919999666555"
            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-400/40 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">Vandrevala Foundation</div>
                <div className="text-xs text-slate-400">+91 9999 666 555 (24/7 Free Counseling)</div>
              </div>
            </div>
            <span className="text-xs text-rose-400 font-semibold px-3 py-1.5 rounded-full bg-rose-400/10 group-hover:bg-rose-400/20">
              Call
            </span>
          </a>

          {/* AASRA Helpline */}
          <a
            href="tel:+919820466726"
            className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-rose-400/40 hover:bg-white/10 transition-all group"
          >
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-rose-400 shrink-0" />
              <div>
                <div className="text-sm font-semibold text-white">AASRA Suicide Prevention</div>
                <div className="text-xs text-slate-400">+91 9820466726 (24/7 Crisis Support)</div>
              </div>
            </div>
            <span className="text-xs text-rose-400 font-semibold px-3 py-1.5 rounded-full bg-rose-400/10 group-hover:bg-rose-400/20">
              Call
            </span>
          </a>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-xs font-medium text-slate-300 transition-colors"
        >
          Return to Sanctuary
        </button>
      </div>
    </div>
  );
}
