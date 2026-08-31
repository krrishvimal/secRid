"use client";

import React from "react";
import { Heart, MessageSquare, Flag, ArrowLeft, UserCheck } from "lucide-react";
import { Secret, INTENT_CONFIGS, getQualitativeTier } from "@/types";

interface SecretCardProps {
  secret: Secret;
  onToggleFeltThis: (id: string) => void;
  onOpenLetterModal: (secret: Secret) => void;
  onOpenReportModal: (id: string) => void;
  onSkip?: () => void;
}

export function SecretCard({
  secret,
  onToggleFeltThis,
  onOpenLetterModal,
  onOpenReportModal,
  onSkip,
}: SecretCardProps) {
  const intentConfig = INTENT_CONFIGS[secret.intent];
  const qualitativeTier = getQualitativeTier(secret.rawFeltCount);
  const isAuthor = Boolean(secret.isUserAuthor);

  // Dynamic typography sizing based on confession length
  const charLength = secret.content.length;
  let fontClasses = "text-base sm:text-lg leading-relaxed sm:leading-loose";
  if (charLength > 350) {
    fontClasses = "text-xs sm:text-sm leading-relaxed";
  } else if (charLength < 140) {
    fontClasses = "text-lg sm:text-xl leading-relaxed";
  }

  return (
    <div className="w-full h-full flex flex-col justify-between p-4 sm:p-6 rounded-[28px] bg-gradient-to-b from-[#151924] to-[#0D1017] border border-[#232A3B] shadow-2xl relative overflow-hidden select-none">
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute -top-24 -left-24 w-52 h-52 bg-sanctuary-accent/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-sanctuary-rose/10 rounded-full blur-3xl pointer-events-none" />

      {/* 1. Card Top Bar: Intent Pill & Report Button */}
      <div className="flex items-center justify-between z-10 shrink-0 pb-2">
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-xs font-medium text-slate-200">
            <span>{intentConfig.emoji}</span>
            <span>{intentConfig.label}</span>
          </div>
          {isAuthor && (
            <span className="px-2 py-0.5 rounded-full bg-sanctuary-accent/20 border border-sanctuary-accent/40 text-[10px] text-sanctuary-accent font-semibold flex items-center gap-1">
              <UserCheck className="w-3 h-3" />
              You
            </span>
          )}
        </div>

        {!isAuthor && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onOpenReportModal(secret.id);
            }}
            className="p-1.5 rounded-full text-sanctuary-textFaint hover:text-sanctuary-rose hover:bg-white/5 transition-colors"
            title="Report this card"
          >
            <Flag className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* 2. Hero Secret Text (Scrollable for long confessions) */}
      <div className="flex-1 min-h-0 my-auto py-2 z-10 flex flex-col justify-center overflow-y-auto px-1">
        <p
          className={`${fontClasses} text-slate-100 font-serif text-center font-normal tracking-wide`}
        >
          &ldquo;{secret.content}&rdquo;
        </p>

        {/* Qualitative Resonance Soft Indicator */}
        <div className="mt-3 text-center shrink-0">
          <span className="text-[11px] text-sanctuary-textMuted/80 italic">
            ✦ {qualitativeTier}
          </span>
        </div>
      </div>

      {/* 3. Primary Action Bar */}
      <div className="pt-3 border-t border-white/[0.08] flex items-center justify-between gap-2 z-10 shrink-0">
        {/* Skip Action */}
        {onSkip && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSkip();
            }}
            className="py-2.5 px-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] text-sanctuary-textMuted hover:text-white border border-white/[0.06] text-xs font-medium flex items-center gap-1 transition-all"
            title="Skip to next card"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Skip</span>
          </button>
        )}

        {/* Author Safeguard: If this is the author's own card */}
        {isAuthor ? (
          <div className="flex-1 py-2.5 px-3 rounded-2xl bg-white/[0.03] border border-white/[0.06] text-center">
            <span className="text-xs text-sanctuary-textMuted italic">
              Your confession (responses arrive in Inbox)
            </span>
          </div>
        ) : (
          <>
            {/* Relate / "I Felt This" Action */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFeltThis(secret.id);
              }}
              className={`flex-1 py-2.5 px-3 rounded-2xl flex items-center justify-center gap-1.5 text-xs font-semibold transition-all ${
                secret.hasUserFelt
                  ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-lg shadow-rose-500/10"
                  : "bg-white/[0.05] hover:bg-white/[0.09] text-slate-200 border border-white/[0.08]"
              }`}
            >
              <Heart
                className={`w-4 h-4 transition-transform ${
                  secret.hasUserFelt ? "fill-rose-400 text-rose-400 scale-110" : "text-rose-400/80"
                }`}
              />
              <span>{secret.hasUserFelt ? "You Felt This" : "I Felt This"}</span>
            </button>

            {/* Leave a Letter Action */}
            {intentConfig.allowLetters ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenLetterModal(secret);
                }}
                className="flex-1 py-2.5 px-3 rounded-2xl bg-sanctuary-accent/20 hover:bg-sanctuary-accent/30 text-sanctuary-accent border border-sanctuary-accent/40 flex items-center justify-center gap-1.5 text-xs font-semibold transition-all shadow-lg shadow-sanctuary-accent/10"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Leave Letter</span>
              </button>
            ) : (
              <div className="py-2.5 px-2 rounded-2xl bg-white/[0.02] border border-white/[0.04] text-center">
                <span className="text-[10px] text-sanctuary-textFaint">Listening only</span>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
