"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, RefreshCw, CheckCircle2 } from "lucide-react";

export function WeavingStoryAnimation() {
  const [activeStep, setActiveStep] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // Auto-advance steps every 4.5 seconds unless paused
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
      image: "/scattered-thoughts.png",
    },
    {
      id: 1,
      title: "Weaving Connections",
      subtitle: "Guided by the pen engine listening deeply",
      description: "Memoiary traces patterns across temporal lines, connecting people, places, and recurring themes.",
      badge: "Step 2: Connecting",
      image: "/weaving-connections.png",
    },
    {
      id: 2,
      title: "Woven Life Story",
      subtitle: "Integrated autobiographical meaning",
      description: "Your memories interlock into a continuous, living story that grows with you every day.",
      badge: "Step 3: Meaning",
      image: "/woven-story.png",
    },
  ];

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF9F6] via-[#FAF3ED] to-[#F5EBE4] border border-[#F2D5CB]/80 p-6 sm:p-8 shadow-[0_12px_35px_-10px_rgba(224,152,133,0.18)] my-8">
      {/* Background Soft Glow Orbs */}
      <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#E09885]/15 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-64 h-64 rounded-full bg-[#7C8B7B]/15 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Side: Animated Stage Canvas with Category Image Artwork */}
        <div className="md:col-span-7 flex flex-col items-center justify-center min-h-[320px] bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/90 shadow-xs relative overflow-hidden">
          
          <div className="w-full max-w-sm aspect-square relative flex items-center justify-center">
            {/* Animated Canvas Image Stages */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="w-full h-full relative flex items-center justify-center"
              >
                <img
                  src={steps[activeStep].image}
                  alt={steps[activeStep].title}
                  className="w-full h-full object-contain drop-shadow-md"
                />
              </motion.div>
            </AnimatePresence>

            {/* Dynamic Overlay Particles tailored to active stage */}
            <svg
              viewBox="0 0 300 300"
              className="absolute inset-0 w-full h-full pointer-events-none"
              fill="none"
            >
              {activeStep === 0 && (
                <g>
                  {/* Scattered Thoughts Floating Dots */}
                  <motion.circle cx="45" cy="65" r="7" fill="#E09885" animate={{ y: [0, -8, 0], scale: [1, 1.25, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.circle cx="120" cy="45" r="5.5" fill="#7C8B7B" animate={{ y: [0, 6, 0], scale: [1, 1.2, 1] }} transition={{ duration: 3.4, repeat: Infinity, delay: 0.3 }} />
                  <motion.circle cx="65" cy="130" r="8" fill="#1A1D20" animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3.8, repeat: Infinity, delay: 0.6 }} />
                  <motion.circle cx="40" cy="200" r="6" fill="#D48875" animate={{ y: [0, -6, 0] }} transition={{ duration: 2.8, repeat: Infinity, delay: 0.9 }} />
                  <motion.circle cx="85" cy="250" r="7.5" fill="#E09885" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 3.2, repeat: Infinity, delay: 1.2 }} />
                  <motion.circle cx="150" cy="100" r="5" fill="#7C8B7B" animate={{ y: [0, 5, 0] }} transition={{ duration: 2.5, repeat: Infinity, delay: 1.5 }} />
                  <motion.circle cx="180" cy="220" r="6.5" fill="#1A1D20" animate={{ scale: [1, 1.18, 1] }} transition={{ duration: 3.6, repeat: Infinity, delay: 1.8 }} />
                </g>
              )}

              {activeStep === 1 && (
                <g>
                  {/* Originating Scattered Dots */}
                  <motion.circle cx="45" cy="65" r="6.5" fill="#E09885" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                  <motion.circle cx="120" cy="45" r="5" fill="#7C8B7B" animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 2.2, repeat: Infinity, delay: 0.3 }} />
                  <motion.circle cx="65" cy="130" r="7" fill="#1A1D20" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2.4, repeat: Infinity, delay: 0.5 }} />
                  <motion.circle cx="40" cy="200" r="5.5" fill="#D48875" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2.1, repeat: Infinity, delay: 0.7 }} />
                  <motion.circle cx="85" cy="250" r="7" fill="#E09885" animate={{ scale: [1, 1.25, 1] }} transition={{ duration: 2.5, repeat: Infinity, delay: 0.9 }} />

                  {/* Organic Flowing Curved Lines Converging Exactly at Pen Tip (222, 225) */}
                  {/* Thread 1 from Top Left Dot (45, 65) */}
                  <motion.path
                    d="M 45 65 C 90 35, 150 70, 160 140 C 170 190, 200 215, 222 225"
                    stroke="#E09885"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="5 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: [0.4, 0.95, 0.4] }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
                  />

                  {/* Thread 2 from Top Dot (120, 45) */}
                  <motion.path
                    d="M 120 45 C 160 70, 180 110, 190 150 C 200 180, 215 210, 222 225"
                    stroke="#7C8B7B"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="5 4"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: [0.4, 0.95, 0.4] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.3, ease: "easeInOut" }}
                  />

                  {/* Thread 3 from Mid Left Dot (65, 130) */}
                  <motion.path
                    d="M 65 130 C 100 100, 140 160, 180 180 C 200 195, 215 210, 222 225"
                    stroke="#1A1D20"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: [0.4, 0.9, 0.4] }}
                    transition={{ duration: 2.3, repeat: Infinity, delay: 0.6, ease: "easeInOut" }}
                  />

                  {/* Thread 4 from Lower Left Dot (40, 200) */}
                  <motion.path
                    d="M 40 200 C 80 230, 140 210, 170 230 C 190 240, 210 235, 222 225"
                    stroke="#D48875"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeDasharray="4 3"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: [0.4, 0.95, 0.4] }}
                    transition={{ duration: 2.6, repeat: Infinity, delay: 0.8, ease: "easeInOut" }}
                  />

                  {/* Thread 5 from Bottom Dot (85, 250) */}
                  <motion.path
                    d="M 85 250 C 120 270, 170 250, 195 240 C 210 235, 218 230, 222 225"
                    stroke="#E09885"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: [0.3, 0.9, 0.3] }}
                    transition={{ duration: 2.4, repeat: Infinity, delay: 1, ease: "easeInOut" }}
                  />

                  {/* Pen Tip Convergence Focal Sparkle at (222, 225) */}
                  <motion.circle
                    cx="222"
                    cy="225"
                    r="4.5"
                    fill="#E09885"
                    animate={{ scale: [1, 1.6, 1], opacity: [0.6, 1, 0.6] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <motion.circle
                    cx="222"
                    cy="225"
                    r="9"
                    stroke="#E09885"
                    strokeWidth="1"
                    opacity="0.5"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.2, 0.6, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </g>
              )}

              {activeStep === 2 && (
                <g>
                  {/* Woven Heart Glow Pulse */}
                  <motion.circle
                    cx="170"
                    cy="140"
                    r="60"
                    fill="#E09885"
                    opacity="0.15"
                    animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.25, 0.1] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Step Switcher Dots */}
          <div className="flex items-center gap-2 mt-4 relative z-20">
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
