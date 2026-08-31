"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight, RotateCcw, Sparkles, Heart } from "lucide-react";
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
    }, 200);
  };

  const handleResetDeck = () => {
    setCurrentIndex(0);
  };

  // If all cards swiped
  if (!currentSecret || currentIndex >= activeSecrets.length) {
    return (
      <div className="w-full max-w-sm mx-auto h-[68vh] flex flex-col items-center justify-center p-8 text-center bg-sanctuary-card border border-sanctuary-cardBorder rounded-[28px] shadow-2xl space-y-5 animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-sanctuary-accent/20 text-sanctuary-accent flex items-center justify-center">
          <Sparkles className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">You have witnessed all confessions</h3>
          <p className="text-xs text-sanctuary-textMuted leading-relaxed">
            The night is quiet. You can return to the beginning, or release something weighing on you.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 w-full pt-2">
          <button
            onClick={onGoToRelease}
            className="w-full py-3.5 rounded-2xl bg-sanctuary-accent hover:bg-sanctuary-accent/90 text-xs font-semibold text-white transition-all shadow-lg"
          >
            Release a Secret ✦
          </button>
          <button
            onClick={handleResetDeck}
            className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Rewatch Confessions
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto flex flex-col items-center justify-center px-4 py-2">
      {/* Swipeable Card Stack Container */}
      <div className="w-full h-[66vh] relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSecret.id}
            initial={{ scale: 0.95, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{
              x: exitDirection === "left" ? -350 : exitDirection === "right" ? 350 : 0,
              opacity: 0,
              scale: 0.9,
              transition: { duration: 0.25 },
            }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.7}
            onDragEnd={(_, info) => {
              if (info.offset.x > 100) {
                handleNext("right");
              } else if (info.offset.x < -100) {
                handleNext("left");
              }
            }}
          >
            <SecretCard
              secret={currentSecret}
              onToggleFeltThis={onToggleFeltThis}
              onOpenLetterModal={onOpenLetterModal}
              onOpenReportModal={onOpenReportModal}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Accessible Deck Controls */}
      <div className="w-full mt-4 flex items-center justify-between px-6">
        {/* Skip (Left) */}
        <button
          onClick={() => handleNext("left")}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-xs font-medium text-sanctuary-textMuted hover:text-white transition-all"
          aria-label="Skip to next secret"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Skip</span>
        </button>

        {/* Empathy & Advance (Right) */}
        <button
          onClick={() => handleNext("right")}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-sanctuary-accent/20 hover:bg-sanctuary-accent/30 border border-sanctuary-accent/30 text-xs font-semibold text-sanctuary-accent transition-all"
          aria-label="Relate and advance"
        >
          <span>Relate</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
