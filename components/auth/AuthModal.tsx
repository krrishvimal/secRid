"use client";

import React, { useState } from "react";
import { ShieldCheck, Mail, X, Check, Lock, Loader2, AlertCircle } from "lucide-react";
import { getSupabaseClient } from "@/lib/supabase";

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
  const [loadingGoogle, setLoadingGoogle] = useState(false);
  const [loadingEmail, setLoadingEmail] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  // Real Supabase Google OAuth
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setLoadingGoogle(true);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
          },
        });

        if (error) {
          console.error("Google OAuth error:", error);
          setErrorMsg(error.message || "Failed to initiate Google Sign-In.");
          setLoadingGoogle(false);
        }
      } catch (err: any) {
        console.error("Google sign in exception:", err);
        setErrorMsg("Could not connect to Google. Please check your Supabase settings.");
        setLoadingGoogle(false);
      }
    } else {
      // Local demo fallback if no Supabase keys configured
      onAuthenticated("google-user@sanctuary.app");
      setLoadingGoogle(false);
      onClose();
    }
  };

  // Real Supabase Email Magic Link OTP
  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !email.includes("@")) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setLoadingEmail(true);

    const supabase = getSupabaseClient();
    if (supabase) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: email.trim(),
          options: {
            emailRedirectTo: typeof window !== "undefined" ? window.location.origin : undefined,
          },
        });

        if (error) {
          console.error("Magic link error:", error);
          setErrorMsg(error.message || "Failed to send magic link.");
          setLoadingEmail(false);
        } else {
          setIsSent(true);
          setLoadingEmail(false);
        }
      } catch (err: any) {
        console.error("Magic link exception:", err);
        setErrorMsg("Failed to send login email. Please try again.");
        setLoadingEmail(false);
      }
    } else {
      // Local fallback
      setIsSent(true);
      setLoadingEmail(false);
      setTimeout(() => {
        onAuthenticated(email);
        onClose();
      }, 1200);
    }
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
            <h3 className="text-base font-semibold text-white">Check Your Email</h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              We sent a private sign-in link to <strong>{email}</strong>. Click the link in your email to continue.
            </p>
            <button
              onClick={onClose}
              className="mt-4 px-5 py-2 rounded-xl bg-white/10 text-xs text-slate-300 hover:bg-white/15 transition-colors"
            >
              Close
            </button>
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

            {/* Error Message if any */}
            {errorMsg && (
              <div className="mb-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Real Google OAuth Button */}
            <div className="space-y-2.5 mb-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loadingGoogle}
                className="w-full py-3.5 px-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-medium text-white flex items-center justify-center gap-3 transition-all disabled:opacity-50"
              >
                {loadingGoogle ? (
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                ) : (
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
                )}
                <span>{loadingGoogle ? "Connecting to Google..." : "Continue with Google"}</span>
              </button>
            </div>

            <div className="relative my-4 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <span className="relative px-2 bg-sanctuary-card text-[10px] text-sanctuary-textFaint uppercase tracking-wider">
                or sign in with email
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
                disabled={!email || loadingEmail}
                className="w-full py-3 rounded-2xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium text-white transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loadingEmail && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{loadingEmail ? "Sending Magic Link..." : "Send Magic Link"}</span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
