"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { RotateCcw, Sparkles, Heart, ArrowLeft } from "lucide-react";
import { Secret } from "@/types";
import { SecretCard } from "./SecretCard";

interface SecretDeckProps {
  secrets: Secret[];
  onToggleFeltThis: (id: string) => void;
  onOpenLetterModal: (secret: Secret) => void;
  onOpenReportModal: (id: string) => void;
  onMarkSwiped: (id: string) => void;
  onGoToRelease: () => void;
}

export function SecretDeck({
  secrets,
  onToggleFeltThis,
  onOpenLetterModal,
  onOpenReportModal,
  onMarkSwiped,
  onGoToRelease,
}: SecretDeckProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [exitDirection, setExitDirection] = useState<"left" | "right" | null>(null);

  const activeSecrets = secrets;
  const currentSecret = activeSecrets[currentIndex];
  const nextSecret = activeSecrets[currentIndex + 1];

  const handleNext = (direction: "left" | "right") => {
    if (!currentSecret) return;

    if (direction === "right" && !currentSecret.hasUserFelt) {
      onToggleFeltThis(currentSecret.id);
    }

    onMarkSwiped(currentSecret.id);
    setExitDirection(direction);

    setTimeout(() => {
      setExitDirection(null);
      setCurrentIndex((prev) => prev + 1);
    }, 220);
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
  };

  // If all cards swiped
  if (!currentSecret || currentIndex >= activeSecrets.length) {
    return (
      <div className="w-full max-w-sm mx-auto h-[60vh] min-h-[400px] flex flex-col items-center justify-center p-6 text-center bg-sanctuary-card border border-sanctuary-cardBorder rounded-[28px] shadow-2xl space-y-4 animate-fade-in my-auto">
        <div className="w-12 h-12 rounded-full bg-sanctuary-accent/20 text-sanctuary-accent flex items-center justify-center">
          <Sparkles className="w-6 h-6" />
        </div>
        <div className="space-y-1.5">
          <h3 className="text-base font-semibold text-white">You have witnessed all confessions</h3>
          <p className="text-xs text-sanctuary-textMuted leading-relaxed">
            The night is quiet. You can return to the beginning, or release something weighing on you.
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full pt-2">
          <button
            onClick={onGoToRelease}
            className="w-full py-3 rounded-2xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 text-xs font-semibold text-white transition-all shadow-lg"
          >
            Release a Secret ✦
          </button>
          <button
            onClick={handleResetDeck}
            className="w-full py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Rewatch Confessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto h-full flex flex-col items-center justify-center px-3 py-2 select-none">
      {/* 2-Card Stack Container (Tinder/Bumble Physical Deck Architecture) */}
      <div className="w-full h-[64vh] min-h-[420px] max-h-[580px] relative">
        {/* Next Card (Stacked Underneath with scale & depth) */}
        {nextSecret && (
          <div className="absolute inset-0 scale-[0.93] translate-y-3.5 opacity-60 pointer-events-none rounded-[28px] overflow-hidden transition-all duration-300">
            <SecretCard
              secret={nextSecret}
              onToggleFeltThis={() => {}}
              onOpenLetterModal={() => {}}
              onOpenReportModal={() => {}}
            />
          </div>
        )}

        {/* Top Active Card with 60fps Spring Physics & Stamp Overlays */}
        <AnimatePresence mode="popLayout">
          <ActiveTinderCard
            key={currentSecret.id}
            secret={currentSecret}
            exitDirection={exitDirection}
            onSwipe={handleNext}
            onToggleFeltThis={onToggleFeltThis}
            onOpenLetterModal={onOpenLetterModal}
            onOpenReportModal={onOpenReportModal}
          />
        </AnimatePresence>
      </div>
    </div>
  );
}

// 60FPS Tinder/Bumble Active Card with Live Stamp Badges & Spring Physics
function ActiveTinderCard({
  secret,
  exitDirection,
  onSwipe,
  onToggleFeltThis,
  onOpenLetterModal,
  onOpenReportModal,
}: {
  secret: Secret;
  exitDirection: "left" | "right" | null;
  onSwipe: (direction: "left" | "right") => void;
  onToggleFeltThis: (id: string) => void;
  onOpenLetterModal: (secret: Secret) => void;
  onOpenReportModal: (id: string) => void;
}) {
  const x = useMotionValue(0);

  // Dynamic transforms directly tied to drag position
  const rotate = useTransform(x, [-250, 250], [-18, 18]);
  const opacity = useTransform(x, [-300, -180, 0, 180, 300], [0, 1, 1, 1, 0]);

  // Stamp badge opacities
  const relateStampOpacity = useTransform(x, [20, 90], [0, 1]);
  const skipStampOpacity = useTransform(x, [-20, -90], [0, 1]);

  return (
    <motion.div
      style={{ x, rotate, opacity, touchAction: "none" }}
      initial={{ scale: 0.94, opacity: 0.8, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{
        x: exitDirection === "left" ? -500 : exitDirection === "right" ? 500 : 0,
        rotate: exitDirection === "left" ? -25 : exitDirection === "right" ? 25 : 0,
        opacity: 0,
        transition: { duration: 0.22, ease: "easeOut" },
      }}
      transition={{ type: "spring", stiffness: 400, damping: 26 }}
      className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing touch-none select-none z-20"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // Quick flick velocity or smooth distance threshold
        if (offset > 60 || velocity > 200) {
          onSwipe("right");
        } else if (offset < -60 || velocity < -200) {
          onSwipe("left");
        }
      }}
    >
      {/* Live "RELATE" Stamp Overlay on Right Drag */}
      <motion.div
        style={{ opacity: relateStampOpacity }}
        className="absolute top-6 left-6 z-30 pointer-events-none px-4 py-1.5 rounded-xl border-2 border-emerald-400 bg-emerald-950/80 backdrop-blur-sm -rotate-12 shadow-lg shadow-emerald-500/20"
      >
        <div className="flex items-center gap-1.5 text-emerald-300 font-extrabold text-xs tracking-wider uppercase">
          <Heart className="w-3.5 h-3.5 fill-emerald-400" />
          <span>I Felt This</span>
        </div>
      </motion.div>

      {/* Live "SKIP" Stamp Overlay on Left Drag */}
      <motion.div
        style={{ opacity: skipStampOpacity }}
        className="absolute top-6 right-6 z-30 pointer-events-none px-4 py-1.5 rounded-xl border-2 border-rose-400 bg-rose-950/80 backdrop-blur-sm rotate-12 shadow-lg shadow-rose-500/20"
      >
        <div className="flex items-center gap-1.5 text-rose-300 font-extrabold text-xs tracking-wider uppercase">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Skip</span>
        </div>
      </motion.div>

      <SecretCard
        secret={secret}
        onToggleFeltThis={onToggleFeltThis}
        onOpenLetterModal={onOpenLetterModal}
        onOpenReportModal={onOpenReportModal}
        onSkip={() => onSwipe("left")}
      />
    </motion.div>
  );
}
