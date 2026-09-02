"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RefreshCw, Heart, PenTool, CheckCircle2 } from "lucide-react";

export function WeavingStoryAnimation() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Auto-advance steps every 4 seconds unless paused
  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 3);
    }, 4500);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const steps = [
    {
      id: 0,
      title: "Scattered Thoughts",
      subtitle: "Fleeting ideas, voice notes & unformatted memories",
      description: "Raw thoughts float freely — rich in emotion, but unconnected in space and time.",
      badge: "Step 1: Gathering",
    },
    {
      id: 1,
      title: "Weaving Connections",
      subtitle: "Guided by the pen engine listening deeply",
      description: "Memoiary traces patterns across temporal lines, connecting people, places, and recurring themes.",
      badge: "Step 2: Connecting",
    },
    {
      id: 2,
      title: "Woven Life Story",
      subtitle: "Integrated autobiographical meaning",
      description: "Your memories interlock into a continuous, living story that grows with you every day.",
      badge: "Step 3: Meaning",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9F6] via-[#FAF3ED] to-[#F5EBE4] border border-[#F2D5CB]/80 p-6 sm:p-8 shadow-[0_12px_35px_-10px_rgba(224,152,133,0.18)] my-8">
      {/* Background Soft Glow Orbs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#E09885]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#7C8B7B]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Side: Animated SVG Canvas */}
        <div className="md:col-span-7 flex flex-col items-center justify-center min-h-[300px] bg-white/70 backdrop-blur-md rounded-2xl p-6 border border-white/80 shadow-xs relative">
          
          <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
            <svg
              viewBox="0 0 400 400"
              className="w-full h-full drop-shadow-sm"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* STEP 0: Scattered Floating Dots */}
              <AnimatePresence>
                {(activeStep === 0 || activeStep === 1) && (
                  <g>
                    {/* Floating Scattered Node 1 */}
                    <motion.circle
                      cx="70"
                      cy="90"
                      r="7"
                      fill="#E09885"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.7, 1, 0.7],
                        y: [0, -6, 0],
                      }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <motion.circle cx="70" cy="90" r="14" stroke="#E09885" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />

                    {/* Floating Scattered Node 2 */}
                    <motion.circle
                      cx="330"
                      cy="110"
                      r="6"
                      fill="#7C8B7B"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 1, 0.6],
                        x: [0, 5, 0],
                      }}
                      transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
                    />

                    {/* Floating Scattered Node 3 */}
                    <motion.circle
                      cx="90"
                      cy="300"
                      r="8"
                      fill="#1A1D20"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.7, 1, 0.7],
                        y: [0, 8, 0],
                      }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                    />

                    {/* Floating Scattered Node 4 */}
                    <motion.circle
                      cx="310"
                      cy="310"
                      r="6.5"
                      fill="#D48875"
                      animate={{
                        scale: [1, 1.25, 1],
                        opacity: [0.8, 1, 0.8],
                      }}
                      transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 }}
                    />

                    {/* Additional floating thought particles */}
                    <motion.circle cx="160" cy="60" r="4" fill="#E09885" opacity="0.6" animate={{ y: [0, -4, 0] }} transition={{ duration: 2.5, repeat: Infinity }} />
                    <motion.circle cx="240" cy="340" r="4.5" fill="#7C8B7B" opacity="0.6" animate={{ y: [0, 4, 0] }} transition={{ duration: 3.2, repeat: Infinity }} />
                  </g>
                )}
              </AnimatePresence>

              {/* STEP 1: Connecting Lines Weaving Towards Center */}
              <AnimatePresence>
                {(activeStep === 1 || activeStep === 2) && (
                  <g>
                    {/* Bezier Line from Top Left Node to Center Heart */}
                    <motion.path
                      d="M70 90 Q 140 120, 170 180"
                      stroke="#E09885"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="6 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.9 }}
                      transition={{ duration: 1.4, ease: "easeOut" }}
                    />

                    {/* Bezier Line from Top Right Node */}
                    <motion.path
                      d="M330 110 Q 260 130, 230 180"
                      stroke="#7C8B7B"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeDasharray="6 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.9 }}
                      transition={{ duration: 1.4, delay: 0.3, ease: "easeOut" }}
                    />

                    {/* Bezier Line from Bottom Left Node */}
                    <motion.path
                      d="M90 300 Q 150 260, 185 220"
                      stroke="#1A1D20"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.8 }}
                      transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
                    />

                    {/* Bezier Line from Bottom Right Node */}
                    <motion.path
                      d="M310 310 Q 250 270, 215 220"
                      stroke="#E09885"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.9 }}
                      transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }}
                    />

                    {/* Pen Trace Curve from Bottom Pen to Heart */}
                    <motion.path
                      d="M260 270 Q 275 250, 220 210"
                      stroke="#1A1D20"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.2, delay: 0.9 }}
                    />
                  </g>
                )}
              </AnimatePresence>

              {/* STEP 2: The Woven Heart Knot & Pen Image Centerpiece */}
              <g>
                {/* Woven Heart Backdrop Glow */}
                <motion.circle
                  cx="200"
                  cy="195"
                  r="75"
                  fill="url(#roseGlow)"
                  animate={{
                    scale: activeStep === 2 ? [1, 1.08, 1] : 1,
                    opacity: activeStep === 2 ? [0.6, 0.9, 0.6] : 0.3,
                  }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />

                {/* Mark-Only Transparent Logo Image rendering the Woven Heart */}
                <motion.image
                  href="/logo-mark.png"
                  x="75"
                  y="70"
                  width="250"
                  height="250"
                  preserveAspectRatio="xMidYMid meet"
                  animate={{
                    scale: activeStep === 2 ? [1, 1.04, 1] : 1,
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
              </g>

              {/* Gradient Definitions */}
              <defs>
                <radialGradient id="roseGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#E09885" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#E09885" stopOpacity="0" />
                </radialGradient>
              </defs>
            </svg>
          </div>

          {/* Interactive Step Switcher Dots */}
          <div className="flex items-center gap-2 mt-4">
            {steps.map((s) => (
              <button
                key={s.id}
                onClick={() => {
                  setActiveStep(s.id);
                  setIsAutoPlaying(false);
                }}
                className={`h-2.5 rounded-full transition-all cursor-pointer ${
                  activeStep === s.id
                    ? "w-8 bg-[#E09885]"
                    : "w-2.5 bg-[#E8E2D9] hover:bg-[#D48875]"
                }`}
                title={s.title}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Step Content & Story Text */}
        <div className="md:col-span-5 space-y-5">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E09885]/15 border border-[#E09885]/30 text-[#B86854] text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-[#E09885]" />
              <span>{steps[activeStep].badge}</span>
            </span>

            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className={`p-1.5 rounded-full text-xs flex items-center gap-1 transition-colors cursor-pointer ${
                isAutoPlaying ? "text-[#E09885] bg-[#FAF0EB]" : "text-stone-400 hover:text-stone-700"
              }`}
              title={isAutoPlaying ? "Pause autoplay" : "Autoplay steps"}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isAutoPlaying ? "animate-spin" : ""}`} />
            </button>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-3"
            >
              <h3 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#1A1D20] leading-tight">
                {steps[activeStep].title}
              </h3>

              <p className="text-xs uppercase tracking-wider text-[#E09885] font-semibold font-sans-clean">
                {steps[activeStep].subtitle}
              </p>

              <p className="text-sm text-[#4A5056] leading-relaxed font-sans-clean">
                {steps[activeStep].description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Quick Step Select Buttons */}
          <div className="pt-2 space-y-2 border-t border-[#F2D5CB]/60">
            {steps.map((s) => {
              const isSelected = activeStep === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setActiveStep(s.id);
                    setIsAutoPlaying(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-sans-clean transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? "bg-white text-[#1A1D20] font-medium border border-[#E09885]/40 shadow-2xs"
                      : "text-[#656C75] hover:text-[#1A1D20] hover:bg-white/60"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isSelected ? "bg-[#E09885]" : "bg-stone-300"
                      }`}
                    />
                    <span>{s.title}</span>
                  </div>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#E09885]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
