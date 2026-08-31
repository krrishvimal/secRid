"use client";

import React, { useState } from "react";
import { Sparkles, AlertCircle, Lock, Check, ShieldCheck } from "lucide-react";
import { IntentType, INTENT_CONFIGS } from "@/types";
import { evaluateSafety } from "@/lib/safety";

interface ReleaseComposerProps {
  onRelease: (content: string, intent: IntentType) => { success: boolean; errorReason?: string };
  onTriggerCrisis: () => void;
  onSuccess: () => void;
}

const PROMPTS = [
  "What are you carrying that you've never said out loud?",
  "What truth are you hiding to keep others comfortable?",
  "What decision are you secretly dreading?",
  "What is the apology you never got to make?",
];

export function ReleaseComposer({
  onRelease,
  onTriggerCrisis,
  onSuccess,
}: ReleaseComposerProps) {
  const [content, setContent] = useState("");
  const [selectedIntent, setSelectedIntent] = useState<IntentType>("GIVE_ADVICE");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isReleasing, setIsReleasing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [promptIndex] = useState(() => Math.floor(Math.random() * PROMPTS.length));

  const charCount = content.length;
  const isTooShort = charCount < 50;
  const isTooLong = charCount > 1500;

  const handleRelease = () => {
    setErrorMsg(null);

    if (isTooShort) {
      setErrorMsg("Please write at least 50 characters so others can understand your context.");
      return;
    }

    if (isTooLong) {
      setErrorMsg("Secrets are limited to 1,500 characters to keep discovery focused.");
      return;
    }

    // Pre-Publication Safety, PII, and Crisis screening
    const safety = evaluateSafety(content);
    if (!safety.passed) {
      if (safety.isCrisis) {
        onTriggerCrisis();
        return;
      }
      setErrorMsg(safety.errorReason || "Please remove identifying or abusive content.");
      return;
    }

    setIsReleasing(true);
    setTimeout(() => {
      const result = onRelease(content, selectedIntent);
      if (!result.success) {
        setIsReleasing(false);
        setErrorMsg(result.errorReason || "Failed to release. Please try again.");
        return;
      }

      setIsReleasing(false);
      setIsDone(true);
      setTimeout(() => {
        setIsDone(false);
        setContent("");
        onSuccess();
      }, 1500);
    }, 400);
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 space-y-4 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-1.5 pt-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sanctuary-accent/15 border border-sanctuary-accent/25 text-sanctuary-accent text-[11px] font-medium">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Release into the Night</span>
        </div>
        <h2 className="text-lg sm:text-xl font-semibold text-white tracking-tight">
          Say what you can&apos;t say anywhere else
        </h2>
        <p className="text-xs text-sanctuary-textMuted italic px-2">
          &ldquo;{PROMPTS[promptIndex]}&rdquo;
        </p>
      </div>

      {isDone ? (
        <div className="py-16 text-center space-y-4 bg-sanctuary-card border border-emerald-500/20 rounded-3xl p-8 shadow-2xl">
          <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
            <Check className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-semibold text-white">Your secret is resting among strangers</h3>
          <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            You are completely anonymous. Check your inbox later to see human perspectives.
          </p>
        </div>
      ) : (
        <>
          {/* Main Writing Canvas */}
          <div className="relative bg-sanctuary-card border border-sanctuary-cardBorder rounded-3xl p-4 sm:p-5 shadow-xl space-y-3">
            <textarea
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Start writing without filter. No account or identity is required..."
              rows={7}
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-sanctuary-textFaint focus:outline-none resize-none leading-relaxed"
            />

            <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[11px]">
              <span
                className={`${
                  isTooShort || isTooLong ? "text-sanctuary-rose" : "text-sanctuary-textMuted"
                }`}
              >
                {charCount} / 1500 {isTooShort && "(min 50)"}
              </span>
              <div className="flex items-center gap-1.5 text-sanctuary-textFaint">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400/90" />
                <span>100% Zero-Identity Anonymous</span>
              </div>
            </div>
          </div>

          {/* Intent Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 block px-1">
              What do you need from strangers?
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {(Object.keys(INTENT_CONFIGS) as IntentType[]).map((type) => {
                const config = INTENT_CONFIGS[type];
                const isSelected = selectedIntent === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedIntent(type)}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? "bg-sanctuary-accent/20 border-sanctuary-accent text-white shadow-lg shadow-sanctuary-accent/10"
                        : "bg-sanctuary-card border-sanctuary-cardBorder text-slate-300 hover:border-white/20 hover:bg-sanctuary-cardHover"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm">{config.emoji}</span>
                      <span className="text-xs font-semibold">{config.label}</span>
                    </div>
                    <p className="text-[10px] text-sanctuary-textMuted leading-tight">
                      {config.tagline}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Error Banner */}
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 animate-fade-in">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Submit CTA */}
          <button
            type="button"
            onClick={handleRelease}
            disabled={isTooShort || isTooLong || isReleasing}
            className="w-full py-3.5 rounded-2xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all shadow-xl shadow-sanctuary-accent/20"
          >
            <Sparkles className="w-4 h-4" />
            {isReleasing ? "Releasing into the night..." : "Release Anonymously ✦"}
          </button>
        </>
      )}
    </div>
  );
}
