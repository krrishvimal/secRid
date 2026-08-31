"use client";

import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
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
    <div className="w-full max-w-sm sm:max-w-md mx-auto h-full flex flex-col items-center justify-center px-3 py-2 select-none">
      {/* Swipeable Card Stack Container */}
      <div className="w-full h-[64vh] min-h-[420px] max-h-[580px] relative touch-none">
        <AnimatePresence mode="wait">
          <CardMotionWrapper
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

// Dedicated Card Motion Wrapper with Tactile Physics & High-Sensitivity Touch Tracking
function CardMotionWrapper({
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
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const opacity = useTransform(x, [-250, -150, 0, 150, 250], [0.4, 0.9, 1, 0.9, 0.4]);

  return (
    <motion.div
      style={{ x, rotate, opacity, touchAction: "none" }}
      initial={{ scale: 0.95, opacity: 0, y: 15 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{
        x: exitDirection === "left" ? -400 : exitDirection === "right" ? 400 : 0,
        opacity: 0,
        scale: 0.85,
        transition: { duration: 0.22 },
      }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="w-full h-full cursor-grab active:cursor-grabbing touch-none select-none"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.8}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        // High sensitivity touch response across ANY part of the screen
        if (offset > 50 || velocity > 250) {
          onSwipe("right");
        } else if (offset < -50 || velocity < -250) {
          onSwipe("left");
        }
      }}
    >
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
