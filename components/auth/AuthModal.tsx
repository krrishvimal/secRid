"use client";

import React, { useState } from "react";
import { ShieldCheck, Mail, X, Check, Lock } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (email: string) => void;
  actionTitle?: string;
}

export function AuthModal({
  isOpen,
  onClose,
  onAuthenticated,
  actionTitle = "Release your secret",
}: AuthModalProps) {
  const [email, setEmail] = useState("");
  const [isSent, setIsSent] = useState(false);

  if (!isOpen) return null;

  const handleDemoSignIn = (authEmail: string) => {
    onAuthenticated(authEmail || "human@sanctuary.app");
    onClose();
  };

  const handleMagicLinkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setIsSent(true);
    setTimeout(() => {
      onAuthenticated(email);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-sanctuary-card border border-sanctuary-cardBorder rounded-3xl p-6 shadow-2xl text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-sanctuary-textMuted hover:text-white hover:bg-white/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSent ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <Check className="w-6 h-6" />
            </div>
            <h3 className="text-base font-semibold text-white">Verified Human</h3>
            <p className="text-xs text-slate-400">
              Your account is verified. You remain 100% anonymous to all other users.
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-sanctuary-accent/20 flex items-center justify-center text-sanctuary-accent">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">Protecting Humans</h3>
                <p className="text-xs text-sanctuary-textMuted">Sign in to {actionTitle}</p>
              </div>
            </div>

            <div className="p-3 mb-5 rounded-2xl bg-sanctuary-accentGlow border border-sanctuary-accent/20">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-sanctuary-accent shrink-0 mt-0.5" />
                <p className="text-xs text-slate-300 leading-relaxed">
                  <strong>100% Anonymous to Strangers.</strong> Your email is strictly used for anti-bot defense. Other users will only see symbolic aliases like 🌙 or 🌊.
                </p>
              </div>
            </div>

            {/* Quick 1-tap OAuth buttons */}
            <div className="space-y-2.5 mb-4">
              <button
                onClick={() => handleDemoSignIn("google-user@sanctuary.app")}
                className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-white flex items-center justify-center gap-3 transition-all"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2s.7 5.5 1.9 7.9l3.7-2.9z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.4-6.4-5.3L1.9 16.4C3.7 20.1 7.5 23.5 12 23.5z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => handleDemoSignIn("apple-user@sanctuary.app")}
                className="w-full py-3 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-white flex items-center justify-center gap-3 transition-all"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.93-2.85-.9.04-1.99.6-2.63 1.35-.57.65-1.06 1.72-.93 2.74 1.01.08 2.02-.49 2.63-1.24z" />
                </svg>
                Continue with Apple
              </button>
            </div>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative px-2 bg-sanctuary-card text-[10px] text-sanctuary-textFaint uppercase tracking-wider">
                or email link
              </span>
            </div>

            <form onSubmit={handleMagicLinkSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 text-sanctuary-textMuted absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-3 text-xs text-white placeholder:text-sanctuary-textFaint focus:outline-none focus:border-sanctuary-accent transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={!email}
                className="w-full py-3 rounded-2xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-white transition-all shadow-lg"
              >
                Send Magic Link
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
