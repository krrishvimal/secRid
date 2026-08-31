"use client";

import React, { useState } from "react";
import { X, Send, HeartHandshake, ShieldCheck, AlertCircle } from "lucide-react";
import { Secret, INTENT_CONFIGS } from "@/types";
import { evaluateSafety } from "@/lib/safety";

interface LetterComposerModalProps {
  isOpen: boolean;
  secret: Secret | null;
  onClose: () => void;
  onSubmitLetter: (secretId: string, content: string) => void;
  onTriggerCrisis: () => void;
  isAuthenticated: boolean;
  onRequireAuth: () => void;
}

export function LetterComposerModal({
  isOpen,
  secret,
  onClose,
  onSubmitLetter,
  onTriggerCrisis,
  isAuthenticated,
  onRequireAuth,
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

    // Require lightweight auth if not signed in
    if (!isAuthenticated) {
      onRequireAuth();
      return;
    }

    if (isTooShort) {
      setErrorMsg("Please write at least 30 characters to offer meaningful perspective.");
      return;
    }

    if (isTooLong) {
      setErrorMsg("Letters are capped at 1,000 characters to keep responses focused.");
      return;
    }

    // Safety & PII check
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
      onSubmitLetter(secret.id, content);
      setIsSubmitting(false);
      setContent("");
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full sm:max-w-lg bg-sanctuary-card border-t sm:border border-sanctuary-cardBorder rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl text-left max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">{intentConfig.emoji}</span>
            <div>
              <h3 className="text-sm font-semibold text-white">Leave a Letter</h3>
              <p className="text-[11px] text-sanctuary-textMuted">{intentConfig.label}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-sanctuary-textMuted hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {/* Original Secret Excerpt */}
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 text-xs text-slate-400 italic line-clamp-3 leading-relaxed">
            &ldquo;{secret.content}&rdquo;
          </div>

          {/* Contextual Guidance */}
          <div className="flex items-start gap-2 p-3 rounded-2xl bg-sanctuary-accent/10 border border-sanctuary-accent/20">
            <HeartHandshake className="w-4 h-4 text-sanctuary-accent shrink-0 mt-0.5" />
            <p className="text-xs text-slate-300 leading-relaxed">
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
              placeholder="Write with honesty and empathy. Someone is waiting to read your words..."
              rows={6}
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-slate-100 placeholder:text-sanctuary-textFaint focus:outline-none focus:border-sanctuary-accent resize-none leading-relaxed transition-all"
            />
            <div className="flex items-center justify-between mt-2 px-1">
              <span
                className={`text-[11px] ${
                  isTooShort || isTooLong ? "text-sanctuary-rose" : "text-sanctuary-textMuted"
                }`}
              >
                {charCount} / 1000 {isTooShort && "(min 30)"}
              </span>
              <div className="flex items-center gap-1.5 text-[10px] text-emerald-400/90 font-medium">
                <ShieldCheck className="w-3.5 h-3.5" />
                100% Real Human Letter
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-white/5 flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={isTooShort || isTooLong || isSubmitting}
            className="flex-1 py-3 rounded-2xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-white flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Send className="w-3.5 h-3.5" />
            {isSubmitting ? "Delivering..." : "Deliver Letter"}
          </button>
        </div>
      </div>
    </div>
  );
}
