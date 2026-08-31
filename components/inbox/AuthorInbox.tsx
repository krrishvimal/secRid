"use client";

import React, { useState } from "react";
import {
  Flame,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Send,
  Heart,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Secret, Letter, getQualitativeTier, INTENT_CONFIGS } from "@/types";

interface AuthorInboxProps {
  secrets: Secret[];
  onSendClosureReply: (secretId: string, letterId: string, replyText: string) => void;
  onBurnSecret: (secretId: string) => void;
  onGoToRelease: () => void;
}

export function AuthorInbox({
  secrets,
  onSendClosureReply,
  onBurnSecret,
  onGoToRelease,
}: AuthorInboxProps) {
  const [expandedSecretId, setExpandedSecretId] = useState<string | null>(null);
  const [replyTextMap, setReplyTextMap] = useState<Record<string, string>>({});
  const [confirmBurnId, setConfirmBurnId] = useState<string | null>(null);

  if (secrets.length === 0) {
    return (
      <div className="w-full max-w-sm mx-auto h-[65vh] flex flex-col items-center justify-center p-8 text-center bg-sanctuary-card border border-sanctuary-cardBorder rounded-[28px] shadow-2xl space-y-5 animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-white/5 text-sanctuary-textMuted flex items-center justify-center">
          <MessageSquare className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Your Sanctuary is Quiet</h3>
          <p className="text-xs text-sanctuary-textMuted leading-relaxed">
            You haven&apos;t released any secrets yet. When you do, letters and human resonance will arrive here in private.
          </p>
        </div>
        <button
          onClick={onGoToRelease}
          className="w-full py-3.5 rounded-2xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 text-xs font-semibold text-white transition-all shadow-lg"
        >
          Release Something ✦
        </button>
      </div>
    );
  }

  const handleReplySubmit = (secretId: string, letterId: string) => {
    const text = replyTextMap[letterId];
    if (!text || !text.trim()) return;
    onSendClosureReply(secretId, letterId, text.trim());
    setReplyTextMap((prev) => ({ ...prev, [letterId]: "" }));
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-4 space-y-4 animate-fade-in pb-20">
      <div className="px-1 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white tracking-tight">Your Releases</h2>
          <p className="text-xs text-sanctuary-textMuted">Private responses from strangers</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-white/5 text-xs text-slate-300 font-medium">
          {secrets.length} {secrets.length === 1 ? "secret" : "secrets"}
        </span>
      </div>

      <div className="space-y-4">
        {secrets.map((secret) => {
          const isExpanded = expandedSecretId === secret.id;
          const intentConfig = INTENT_CONFIGS[secret.intent];
          const qualitativeTier = getQualitativeTier(secret.rawFeltCount);
          const hasLetters = secret.letters.length > 0;

          return (
            <div
              key={secret.id}
              className="bg-sanctuary-card border border-sanctuary-cardBorder rounded-3xl p-5 shadow-xl space-y-4 transition-all"
            >
              {/* Top Meta */}
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/5 text-[11px] font-medium text-slate-300">
                  <span>{intentConfig.emoji}</span>
                  <span>{intentConfig.label}</span>
                </div>

                <div className="flex items-center gap-2">
                  {confirmBurnId === secret.id ? (
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => onBurnSecret(secret.id)}
                        className="px-2.5 py-1 rounded-full bg-rose-500 hover:bg-rose-600 text-[10px] font-semibold text-white transition-colors"
                      >
                        Confirm Burn 🔥
                      </button>
                      <button
                        onClick={() => setConfirmBurnId(null)}
                        className="px-2 py-1 rounded-full bg-white/10 text-[10px] text-slate-300 hover:bg-white/20 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmBurnId(secret.id)}
                      className="p-1.5 rounded-full text-sanctuary-textFaint hover:text-sanctuary-rose hover:bg-white/5 transition-colors"
                      title="Burn and permanently delete"
                    >
                      <Flame className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Secret Excerpt */}
              <p className="text-sm text-slate-200 font-serif leading-relaxed italic">
                &ldquo;{secret.content}&rdquo;
              </p>

              {/* Qualitative Resonance & Letter Count Bar */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                <span className="text-[11px] text-sanctuary-rose/90 font-medium flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-rose-400/20 text-rose-400" />
                  {qualitativeTier}
                </span>

                <button
                  onClick={() =>
                    setExpandedSecretId(isExpanded ? null : secret.id)
                  }
                  className="flex items-center gap-1 text-[11px] font-medium text-sanctuary-accent hover:text-sanctuary-accent/80 transition-colors"
                >
                  <span>
                    {secret.letters.length}{" "}
                    {secret.letters.length === 1 ? "Letter" : "Letters"}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="w-3.5 h-3.5" />
                  ) : (
                    <ChevronDown className="w-3.5 h-3.5" />
                  )}
                </button>
              </div>

              {/* Expandable Letters Thread */}
              {isExpanded && (
                <div className="pt-3 border-t border-white/5 space-y-3 animate-fade-in">
                  {!hasLetters ? (
                    <div className="py-4 text-center text-xs text-sanctuary-textMuted">
                      No letters have arrived yet. When someone takes the time to write, their words will appear here.
                    </div>
                  ) : (
                    secret.letters.map((letter) => (
                      <div
                        key={letter.id}
                        className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] space-y-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-sanctuary-accent">
                            {letter.responderAlias}
                          </span>
                          <span className="text-[10px] text-sanctuary-textFaint flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Just now
                          </span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans">
                          {letter.content}
                        </p>

                        {/* Author's 1-Turn Closure Reply */}
                        {letter.authorReply ? (
                          <div className="mt-2 p-3 rounded-xl bg-sanctuary-accent/10 border border-sanctuary-accent/20 space-y-1">
                            <div className="flex items-center gap-1.5 text-[10px] font-semibold text-sanctuary-accent">
                              <CheckCircle2 className="w-3 h-3" />
                              Your Closure Reply
                            </div>
                            <p className="text-xs text-slate-300 italic">
                              &ldquo;{letter.authorReply}&rdquo;
                            </p>
                          </div>
                        ) : (
                          <div className="pt-2 flex items-center gap-2">
                            <input
                              type="text"
                              maxLength={300}
                              value={replyTextMap[letter.id] || ""}
                              onChange={(e) =>
                                setReplyTextMap((prev) => ({
                                  ...prev,
                                  [letter.id]: e.target.value,
                                }))
                              }
                              placeholder="Send a one-time thank you reply..."
                              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-sanctuary-textFaint focus:outline-none focus:border-sanctuary-accent"
                            />
                            <button
                              onClick={() => handleReplySubmit(secret.id, letter.id)}
                              disabled={!replyTextMap[letter.id]?.trim()}
                              className="px-3 py-2 rounded-xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 disabled:opacity-30 text-white transition-all text-xs font-medium flex items-center gap-1"
                            >
                              <Send className="w-3 h-3" />
                              Reply
                            </button>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
