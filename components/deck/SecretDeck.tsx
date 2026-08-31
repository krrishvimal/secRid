"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCcw, Sparkles } from "lucide-react";
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
    <div className="w-full max-w-sm sm:max-w-md mx-auto h-full flex flex-col items-center justify-center px-3 py-2">
      {/* Swipeable Card Stack Container (Calculated to fit 100% inside screen) */}
      <div className="w-full h-[64vh] min-h-[420px] max-h-[580px] relative">
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
              if (info.offset.x > 90) {
                handleNext("right");
              } else if (info.offset.x < -90) {
                handleNext("left");
              }
            }}
          >
            <SecretCard
              secret={currentSecret}
              onToggleFeltThis={onToggleFeltThis}
              onOpenLetterModal={onOpenLetterModal}
              onOpenReportModal={onOpenReportModal}
              onSkip={() => handleNext("left")}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
