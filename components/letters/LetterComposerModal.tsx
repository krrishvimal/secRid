"use client";

import React, { useState } from "react";
import { X, Send, HeartHandshake, ShieldCheck, AlertCircle } from "lucide-react";
import { Secret, INTENT_CONFIGS } from "@/types";
import { evaluateSafety } from "@/lib/safety";

interface LetterComposerModalProps {
  isOpen: boolean;
  secret: Secret | null;
  onClose: () => void;
  onSubmitLetter: (secretId: string, content: string) => { success: boolean; errorReason?: string };
  onTriggerCrisis: () => void;
}

export function LetterComposerModal({
  isOpen,
  secret,
  onClose,
  onSubmitLetter,
  onTriggerCrisis,
}: LetterComposerModalProps) {
  const [content, setContent] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !secret) return null;

  const intentConfig = INTENT_CONFIGS[secret.intent];
  const charCount = content.length;
  const isTooShort = charCount < 30;
  const isTooLong = charCount > 1000;

  const handleSubmit = () => {
    setErrorMsg(null);

    if (isTooShort) {
      setErrorMsg("Please write at least 30 characters to offer meaningful perspective.");
      return;
    }

    if (isTooLong) {
      setErrorMsg("Letters are capped at 1,000 characters to keep responses focused.");
      return;
    }

    // Safety, PII, and Crisis check
    const safety = evaluateSafety(content);
    if (!safety.passed) {
      if (safety.isCrisis) {
        onTriggerCrisis();
        return;
      }
      setErrorMsg(safety.errorReason || "Please remove sensitive or abusive language.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const result = onSubmitLetter(secret.id, content);
      if (!result.success) {
        setIsSubmitting(false);
        setErrorMsg(result.errorReason || "Failed to submit letter.");
        return;
      }

      setIsSubmitting(false);
      setContent("");
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm sm:max-w-md bg-sanctuary-card border border-sanctuary-cardBorder rounded-3xl p-4 sm:p-5 shadow-2xl text-left max-h-[86dvh] flex flex-col">
        {/* 1. Header (Pinned at Top) */}
        <div className="flex items-center justify-between pb-2.5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{intentConfig.emoji}</span>
            <div>
              <h3 className="text-sm font-semibold text-white">Leave a Letter</h3>
              <p className="text-[10px] text-sanctuary-textMuted">{intentConfig.label}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-sanctuary-textMuted hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 2. Scrollable Body */}
        <div className="flex-1 min-h-0 overflow-y-auto py-2.5 space-y-2.5 pr-0.5">
          {/* Secret Excerpt */}
          <div className="p-2.5 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-400 italic line-clamp-2 leading-relaxed">
            &ldquo;{secret.content}&rdquo;
          </div>

          {/* Guidance */}
          <div className="flex items-center gap-2 p-2 rounded-xl bg-sanctuary-accent/10 border border-sanctuary-accent/20">
            <HeartHandshake className="w-3.5 h-3.5 text-sanctuary-accent shrink-0" />
            <p className="text-[11px] text-slate-300 leading-tight">
              {intentConfig.responderGuidance}
            </p>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Write with honesty and empathy. No sign-in required..."
              rows={4}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-3 text-xs sm:text-sm text-slate-100 placeholder:text-sanctuary-textFaint focus:outline-none focus:border-sanctuary-accent resize-none leading-relaxed transition-all"
            />
            <div className="flex items-center justify-between mt-1 px-1 text-[10px]">
              <span
                className={`${
                  isTooShort || isTooLong ? "text-sanctuary-rose" : "text-sanctuary-textMuted"
                }`}
              >
                {charCount} / 1000 {isTooShort && "(min 30)"}
              </span>
              <div className="flex items-center gap-1 text-emerald-400 font-medium">
                <ShieldCheck className="w-3 h-3" />
                100% Real Human
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* 3. Footer Actions (Permanently Anchored & 100% Visible) */}
        <div className="pt-2.5 border-t border-white/5 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isTooShort || isTooLong || isSubmitting}
            className="flex-1 py-2.5 rounded-2xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-all shadow-lg shadow-sanctuary-accent/20"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? "Delivering..." : "Deliver Letter"}
          </button>
        </div>
      </div>
    </div>
  );
}
