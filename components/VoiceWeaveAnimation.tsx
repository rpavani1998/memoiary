"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface Props {
  isRecording: boolean;
  audioLevel?: number; // 0 to 1
}

export function VoiceWeaveAnimation({ isRecording, audioLevel = 0.5 }: Props) {
  const [stageIndex, setStageIndex] = useState<number>(0);

  // Cycle through the 3 artwork stages when recording is active
  useEffect(() => {
    if (!isRecording) {
      setStageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setStageIndex((prev) => (prev + 1) % 3);
    }, 3200);
    return () => clearInterval(interval);
  }, [isRecording]);

  const stageImages = [
    "/scattered-thoughts.png",
    "/weaving-connections.png",
    "/woven-story.png",
  ];

  const stageLabels = [
    "Gathering Scattered Thoughts...",
    "Weaving Connections...",
    "Shaping Your Life Story...",
  ];

  const pulseScale = 1 + audioLevel * 0.25;

  return (
    <div className="relative w-72 h-72 mx-auto flex flex-col items-center justify-center select-none">
      {/* Outer Rotating Weave Rings */}
      <motion.div
        className="absolute inset-0 rounded-full border border-dashed border-[#E09885]/40"
        animate={{ rotate: isRecording ? 360 : 0 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />
      <motion.div
        className="absolute inset-3 rounded-full border border-[#7C8B7B]/30"
        animate={{ rotate: isRecording ? -360 : 0 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      {/* Pulsing Ambient Rose Glow */}
      <motion.div
        className="absolute w-48 h-48 rounded-full bg-[#E09885]/20 blur-xl"
        animate={{
          scale: isRecording ? [1, pulseScale, 1] : 1,
          opacity: isRecording ? [0.4, 0.8, 0.4] : 0.2,
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Animated Image Canvas displaying Category Artwork Transition */}
      <div className="relative w-48 h-48 flex items-center justify-center overflow-hidden rounded-full bg-white/75 backdrop-blur-md border border-[#F2D5CB] shadow-sm">
        <AnimatePresence mode="wait">
          <motion.img
            key={stageIndex}
            src={stageImages[stageIndex]}
            alt="Memoiary Weaving"
            className="w-40 h-40 object-contain drop-shadow-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.5 }}
          />
        </AnimatePresence>

        {/* Drawn SVG connecting lines over the image when recording */}
        {isRecording && (
          <svg viewBox="0 0 160 160" className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Exactly 3 Originating Scattered Dots */}
            <motion.circle cx="55" cy="30" r="3" fill="#7C8B7B" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1.6, repeat: Infinity }} />
            <motion.circle cx="25" cy="60" r="3.5" fill="#E09885" animate={{ scale: [1, 1.4, 1] }} transition={{ duration: 1.4, repeat: Infinity, delay: 0.3 }} />
            <motion.circle cx="35" cy="105" r="3.5" fill="#1A1D20" animate={{ scale: [1, 1.35, 1] }} transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }} />

            {/* Organic Flowing Curved Lines Converging Exactly at Pen Tip (120, 108) */}
            {/* Thread 1 from Green Dot (55, 30) */}
            <motion.path
              d="M 55 30 C 75 40, 95 65, 105 85 C 112 100, 116 104, 120 108"
              stroke="#7C8B7B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 3"
              animate={{ opacity: [0.4, 0.95, 0.4], pathOffset: [0, 1] }}
              transition={{ duration: 2.3, repeat: Infinity, ease: "easeInOut" }}
            />

            {/* Thread 2 from Red Dot (25, 60) */}
            <motion.path
              d="M 25 60 C 50 45, 80 75, 95 90 C 108 100, 115 104, 120 108"
              stroke="#E09885"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="4 3"
              animate={{ opacity: [0.4, 0.95, 0.4], pathOffset: [0, 1] }}
              transition={{ duration: 2.1, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
            />

            {/* Thread 3 from Black Dot (35, 105) */}
            <motion.path
              d="M 35 105 C 60 120, 85 110, 100 112 C 110 112, 116 110, 120 108"
              stroke="#1A1D20"
              strokeWidth="2"
              strokeLinecap="round"
              animate={{ opacity: [0.35, 0.9, 0.35], pathOffset: [0, 1] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
            />

            {/* Focal Convergence Glow at Pen Tip (120, 108) */}
            <motion.circle
              cx="120"
              cy="108"
              r="3.5"
              fill="#E09885"
              animate={{ scale: [1, 1.5, 1], opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            />
          </svg>
        )}

        {/* Central Micro Record Indicator Overlay */}
        <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-xs p-1.5 rounded-full border border-[#E8E2D9] shadow-2xs">
          <motion.div
            className="w-3.5 h-3.5 rounded-full bg-[#E09885]"
            animate={{ scale: isRecording ? [1, 1.3, 1] : 1 }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        </div>
      </div>

      {/* Stage Status Text Indicator */}
      <div className="mt-3 text-center">
        <span className="text-[11px] font-medium text-[#E09885] font-sans-clean uppercase tracking-wider block">
          {isRecording ? stageLabels[stageIndex] : "Tap to start recording"}
        </span>
      </div>
    </div>
  );
}
