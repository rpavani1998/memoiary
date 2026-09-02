"use client";

import React from "react";
import { motion } from "motion/react";

interface Props {
  isRecording: boolean;
  audioLevel?: number; // 0 to 1
}

export function VoiceWeaveAnimation({ isRecording, audioLevel = 0.5 }: Props) {
  const pulseScale = 1 + audioLevel * 0.35;

  return (
    <div className="relative w-64 h-64 mx-auto flex items-center justify-center pointer-events-none select-none">
      {/* Outer Rotating Weave Ring */}
      <motion.div
        className="absolute inset-0 rounded-full border border-dashed border-[#E09885]/40"
        animate={{ rotate: isRecording ? 360 : 0 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute inset-4 rounded-full border border-[#7C8B7B]/30"
        animate={{ rotate: isRecording ? -360 : 0 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      />

      {/* Pulsing Ambient Rose Glow */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-[#E09885]/20 blur-xl"
        animate={{
          scale: isRecording ? [1, pulseScale, 1] : 1,
          opacity: isRecording ? [0.4, 0.8, 0.4] : 0.2,
        }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Orbiting Scattered Dots Connecting to Center */}
      <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full">
        {/* Animated Bezier Threads linking scattered dots */}
        {isRecording && (
          <g>
            <motion.path
              d="M 30 50 Q 70 80, 100 100"
              stroke="#E09885"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              animate={{ opacity: [0.3, 0.9, 0.3], pathOffset: [0, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <motion.path
              d="M 170 40 Q 130 70, 100 100"
              stroke="#7C8B7B"
              strokeWidth="1.5"
              strokeDasharray="4 3"
              animate={{ opacity: [0.4, 1, 0.4], pathOffset: [0, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, delay: 0.3 }}
            />
            <motion.path
              d="M 40 160 Q 80 130, 100 100"
              stroke="#1A1D20"
              strokeWidth="1.5"
              animate={{ opacity: [0.2, 0.7, 0.2] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
            />
            <motion.path
              d="M 160 170 Q 130 130, 100 100"
              stroke="#E09885"
              strokeWidth="1.5"
              animate={{ opacity: [0.4, 0.9, 0.4] }}
              transition={{ duration: 2.2, repeat: Infinity, delay: 0.9 }}
            />
          </g>
        )}

        {/* Orbiting Dots */}
        <motion.circle
          cx="30"
          cy="50"
          r="4"
          fill="#E09885"
          animate={{ scale: isRecording ? [1, 1.4, 1] : 1 }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <motion.circle
          cx="170"
          cy="40"
          r="3.5"
          fill="#7C8B7B"
          animate={{ scale: isRecording ? [1, 1.3, 1] : 1 }}
          transition={{ duration: 1.8, repeat: Infinity, delay: 0.2 }}
        />
        <motion.circle
          cx="40"
          cy="160"
          r="4.5"
          fill="#1A1D20"
          animate={{ scale: isRecording ? [1, 1.35, 1] : 1 }}
          transition={{ duration: 2.1, repeat: Infinity, delay: 0.4 }}
        />
        <motion.circle
          cx="160"
          cy="170"
          r="4"
          fill="#D48875"
          animate={{ scale: isRecording ? [1, 1.4, 1] : 1 }}
          transition={{ duration: 1.6, repeat: Infinity, delay: 0.6 }}
        />
      </svg>

      {/* Central Core Recording Node */}
      <motion.div
        className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-tr from-[#D48875] via-[#E09885] to-[#F7C5B8] p-0.5 shadow-lg flex items-center justify-center"
        animate={{
          scale: isRecording ? pulseScale : 1,
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <div className="w-full h-full rounded-full bg-[#FAF0EB] flex flex-col items-center justify-center p-2 text-center">
          <motion.div
            className="w-10 h-10 rounded-full bg-[#E09885] flex items-center justify-center text-white shadow-xs"
            animate={{
              scale: isRecording ? [1, 1.1, 1] : 1,
            }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <span className="text-xl font-bold select-none">◉</span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
