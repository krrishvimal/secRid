"use client";

import React, { useState } from "react";
import { Flag, X, ShieldAlert, Check } from "lucide-react";

interface ReportModalProps {
  isOpen: boolean;
  secretId: string | null;
  onClose: () => void;
  onReport: (secretId: string, reason: string) => void;
}

const REPORT_REASONS = [
  { id: "HARASSMENT", label: "Targeted Harassment or Bullying" },
  { id: "DOXXING", label: "Revealing Personal Info / Doxxing" },
  { id: "HATE", label: "Hate Speech or Discrimination" },
  { id: "SEXUAL", label: "Explicit Sexual or Non-consensual Material" },
  { id: "SELF_HARM", label: "Self-Harm or Suicide Promotion" },
  { id: "SPAM", label: "Commercial Spam or Scams" },
];

export function ReportModal({ isOpen, secretId, onClose, onReport }: ReportModalProps) {
  const [selectedReason, setSelectedReason] = useState<string>("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen || !secretId) return null;

  const handleSubmit = () => {
    if (!selectedReason) return;
    onReport(secretId, selectedReason);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setSelectedReason("");
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-sanctuary-card border border-sanctuary-cardBorder rounded-3xl p-6 shadow-2xl text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-sanctuary-textMuted hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">Report Received</h3>
            <p className="text-xs text-slate-400">
              This card has been quarantined from your deck. Thank you for protecting the sanctuary.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-500/15 flex items-center justify-center text-rose-400">
                <Flag className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Report Card</h3>
                <p className="text-xs text-sanctuary-textMuted">Why should this be removed?</p>
              </div>
            </div>

            <div className="space-y-2 mb-6">
              {REPORT_REASONS.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setSelectedReason(r.id)}
                  className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all ${
                    selectedReason === r.id
                      ? "bg-sanctuary-accent/20 border border-sanctuary-accent text-white"
                      : "bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!selectedReason}
              className="w-full py-3 rounded-2xl bg-rose-500/80 hover:bg-rose-500 disabled:opacity-40 disabled:cursor-not-allowed text-sm font-medium text-white transition-all shadow-lg"
            >
              Submit Report
            </button>
          </>
        )}
      </div>
    </div>
  );
}
