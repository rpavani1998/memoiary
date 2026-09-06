"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  X,
  BookOpen,
  Calendar,
  Layers,
  GitFork,
  HeartHandshake,
  MessageSquare,
  ShieldCheck,
  Play,
  RotateCcw,
  CheckCircle2
} from "lucide-react";
import { View } from "./memoiary/MemoiaryAppShell";

export interface WalkthroughStep {
  id: number;
  title: string;
  badge: string;
  targetView: View;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  aiExplanation: string;
  highlightNote?: string;
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 1,
    title: "Home Sanctuary & Memory Feed",
    badge: "Gemini Multimodal AI",
    targetView: "life",
    icon: BookOpen,
    description: "Capture voice notes, photos, and journal entries effortlessly. Memoiary automatically organizes them into a clean chronological timeline.",
    aiExplanation: "Behind the scenes, Gemini Multimodal AI extracts key people, places, emotions, and time context from your raw input without requiring manual tags.",
    highlightNote: "Try adding a quick text or voice reflection using the '+' button below!"
  },
  {
    id: 2,
    title: "Memory Time Capsule ('On This Day')",
    badge: "Historical Date Engine",
    targetView: "life",
    icon: Calendar,
    description: "Rediscover meaningful moments from your past with automated historical date matching.",
    aiExplanation: "The Time Capsule engine compares today's date with past entries (1 month, 2 months, 3 months, or 1 year ago) and highlights nostalgic memories.",
    highlightNote: "Check the top banner on your feed for historical date reflections."
  },
  {
    id: 3,
    title: "Weekly Narrative Arc & Storyboards",
    badge: "Narrative Synthesis",
    targetView: "life",
    icon: Layers,
    description: "Transform daily logs into a structured weekly story arc presented in a clean 2-column square card grid.",
    aiExplanation: "AI synthesizes your weekly emotional trajectory, creating concise titles, highlight summaries, and key people lists for each period.",
    highlightNote: "Switch between Daily Storyboard and Weekly Recap using the top view toggle."
  },
  {
    id: 4,
    title: "AI Mind Map & Epistemic Graph",
    badge: "Entity Force Physics",
    targetView: "collections",
    icon: GitFork,
    description: "Visualize your entire memory universe as an interactive mind map with real-time force-directed physics.",
    aiExplanation: "Clusters recurring entities into 4 central category hubs: People & Bonds, Places & Spaces, Topics & Themes, and Key Moments.",
    highlightNote: "Drag graph nodes around to explore relationships between people and memories!"
  },
  {
    id: 5,
    title: "Wishlist & Action Intentions",
    badge: "Sentence Classifier",
    targetView: "entities",
    icon: HeartHandshake,
    description: "Automatically extract future dreams, recipes to try, travel spots, and commitments you made in your journal.",
    aiExplanation: "Uses sentence-level regex classification to separate past completed events from future aspirations (wishlists) and obligations (action intentions).",
    highlightNote: "Click any item to open its exact source journal entry in a popup modal!"
  },
  {
    id: 6,
    title: "AI Reflection Chatboard",
    badge: "Personal AI Guide",
    targetView: "reflect",
    icon: MessageSquare,
    description: "Have deep conversational reflections with your AI journal assistant and save threads directly to your timeline.",
    aiExplanation: "Queries past entries and user memories to provide empathetic guidance, detect life patterns, and suggest clarity questions.",
    highlightNote: "Click 'Save Chat Reflection' to persist key AI conversations directly to your journal."
  },
  {
    id: 7,
    title: "Privacy, Art Styles & Scoped State",
    badge: "User Account Isolation",
    targetView: "profile",
    icon: ShieldCheck,
    description: "Customize visual art styles (Hand-Drawn, Cyberpunk, Watercolor) with complete privacy assurance.",
    aiExplanation: "Every user account operates on isolated localStorage keys and encrypted Firestore trees, ensuring zero demo data bleed.",
    highlightNote: "Sign in with Google anytime to sync your clean personal memories across all devices."
  }
];

export function InteractiveProductWalkthrough({
  isOpen,
  onClose,
  onNavigateView
}: {
  isOpen: boolean;
  onClose: () => void;
  onNavigateView: (view: View) => void;
}) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);

  const step = WALKTHROUGH_STEPS[currentStepIdx];
  const StepIcon = step.icon;

  useEffect(() => {
    if (isOpen && step) {
      onNavigateView(step.targetView);
    }
  }, [currentStepIdx, isOpen, step, onNavigateView]);

  if (!isOpen || !step) return null;

  const handleNext = () => {
    if (currentStepIdx < WALKTHROUGH_STEPS.length - 1) {
      const nextIdx = currentStepIdx + 1;
      setCurrentStepIdx(nextIdx);
      onNavigateView(WALKTHROUGH_STEPS[nextIdx].targetView);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      const prevIdx = currentStepIdx - 1;
      setCurrentStepIdx(prevIdx);
      onNavigateView(WALKTHROUGH_STEPS[prevIdx].targetView);
    }
  };

  const handleRestart = () => {
    setCurrentStepIdx(0);
    onNavigateView(WALKTHROUGH_STEPS[0].targetView);
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none flex items-end sm:items-center justify-center p-3 sm:p-6 font-sans">
      {/* Semi-transparent backdrop overlay with subtle blur */}
      <div
        className="absolute inset-0 bg-[#1C1917]/35 backdrop-blur-[2px] pointer-events-auto transition-opacity"
        onClick={onClose}
      />

      {/* Floating Interactive Walkthrough Card */}
      <div className="relative pointer-events-auto w-full max-w-lg bg-[#FAF7F0] border-2 border-[#1C1917] rounded-3xl p-5 sm:p-7 shadow-[6px_8px_0px_#1C1917] z-10 animate-fade-in font-sans overflow-hidden">
        {/* Decorative corner accent badge */}
        <div className="absolute top-0 right-0 bg-[#DE5239] text-white px-4 py-1.5 rounded-bl-2xl font-mono text-[11px] font-bold tracking-wider uppercase flex items-center gap-1.5 shadow-2xs">
          <Sparkles size={12} className="animate-spin-slow" />
          <span>Step {step.id} of {WALKTHROUGH_STEPS.length}</span>
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1.5 text-[#1C1917]/60 hover:text-[#1C1917] hover:bg-[#1C1917]/5 rounded-full transition-colors cursor-pointer"
          title="Exit Walkthrough"
        >
          <X size={18} />
        </button>

        {/* Step Content Header */}
        <div className="mt-5 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-2 bg-[#DE5239]/10 text-[#DE5239] border border-[#DE5239]/30 rounded-xl">
              <StepIcon size={20} />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#DE5239] bg-[#DE5239]/10 px-2 py-0.5 rounded-md border border-[#DE5239]/20">
                {step.badge}
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] leading-snug mt-0.5">
                {step.title}
              </h3>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#1C1917]/85 mt-3 leading-relaxed font-sans font-normal">
            {step.description}
          </p>
        </div>

        {/* AI Behind-the-Scenes Technical Insight Box */}
        <div className="my-4 bg-white/90 border border-[#1C1917]/20 rounded-2xl p-3.5 sm:p-4 shadow-2xs relative">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#DE5239] font-sans mb-1.5">
            <Sparkles size={14} className="fill-[#DE5239]" />
            <span>AI Behind The Scenes</span>
          </div>
          <p className="text-xs text-stone-700 leading-relaxed font-sans">
            {step.aiExplanation}
          </p>
          {step.highlightNote && (
            <div className="mt-2.5 pt-2 border-t border-stone-200/80 flex items-start gap-1.5 text-[11px] text-[#4D7C0F] font-medium font-sans">
              <CheckCircle2 size={13} className="shrink-0 mt-0.5" />
              <span>{step.highlightNote}</span>
            </div>
          )}
        </div>

        {/* Step Progress Indicators & Controls */}
        <div className="mt-5 pt-3 border-t border-[#1C1917]/15 flex items-center justify-between gap-3 font-sans">
          {/* Step Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {WALKTHROUGH_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  setCurrentStepIdx(idx);
                  onNavigateView(s.targetView);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIdx
                    ? "bg-[#DE5239] w-6"
                    : idx < currentStepIdx
                    ? "bg-[#1C1917]"
                    : "bg-[#1C1917]/20 hover:bg-[#1C1917]/40"
                }`}
                title={`Go to step ${s.id}: ${s.title}`}
              />
            ))}
          </div>

          {/* Prev & Next Buttons */}
          <div className="flex items-center gap-2">
            {currentStepIdx > 0 && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 border-[1.5px] border-[#1C1917] bg-white hover:bg-stone-100 text-[#1C1917] rounded-xl text-xs font-bold font-sans flex items-center gap-1 cursor-pointer shadow-2xs active:scale-95 transition-all"
              >
                <ChevronLeft size={14} />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-4 py-1.5 border-[1.5px] border-[#1C1917] bg-[#DE5239] hover:bg-[#C6422A] text-white rounded-xl text-xs font-bold font-sans flex items-center gap-1.5 cursor-pointer shadow-[2px_3px_0px_#1C1917] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>{currentStepIdx === WALKTHROUGH_STEPS.length - 1 ? "Finish Tour 🎉" : "Next Step"}</span>
              {currentStepIdx < WALKTHROUGH_STEPS.length - 1 && <ChevronRight size={14} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
