"use client";

import React, { useState, useEffect, useRef } from "react";
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
  CheckCircle2,
  Plus,
  History,
  Users
} from "lucide-react";
import { View } from "./memoiary/MemoiaryAppShell";

export interface WalkthroughStep {
  id: number;
  title: string;
  badge: string;
  targetView: View;
  selector: string;
  subTabSelector?: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  description: string;
  aiExplanation: string;
  highlightNote?: string;
}

export const WALKTHROUGH_STEPS: WalkthroughStep[] = [
  {
    id: 1,
    title: "Journal Sanctuary Feed & Timeline",
    badge: "Chronological Sanctuary Feed",
    targetView: "life",
    selector: "[data-tour='nav-sanctuary']",
    icon: BookOpen,
    description: "Welcome to your primary Journal Sanctuary feed! All recorded text, audio, and photo memories are rendered chronologically here.",
    aiExplanation: "Gemini Multimodal AI parses your raw voice/text in real-time, automatically extracting people involved, location context, emotional valence, and key memory moments.",
    highlightNote: "Tap this sanctuary icon anytime to return to your main memory feed."
  },
  {
    id: 2,
    title: "Memory Time Capsule ('On This Day')",
    badge: "Historical Date Engine",
    targetView: "life",
    selector: "[data-tour='time-capsule']",
    icon: History,
    description: "Revisit your past! This banner automatically surfaces memories recorded on this exact date 1 month, 2 months, 3 months, or 1 year ago.",
    aiExplanation: "The Time Capsule matching engine queries your memory graph chronologically, highlighting nostalgic reflections so you can trace emotional growth over time.",
    highlightNote: "Click any Time Capsule match to revisit that day's entry!"
  },
  {
    id: 3,
    title: "Weekly Storyboard & Narrative Arc",
    badge: "Narrative Synthesis Engine",
    targetView: "life",
    selector: "[data-tour='weekly-recap']",
    icon: Layers,
    description: "View your weekly story arc in a clean 2-column square collage grid with bold titles, summaries, and key companion tags.",
    aiExplanation: "AI synthesizes your weekly emotional trajectory, creating concise titles, highlight summaries, and key people lists for each period.",
    highlightNote: "Click any highlight card to inspect the full journal detail."
  },
  {
    id: 4,
    title: "Quick Capture (+ Button)",
    badge: "Multimodal Voice & Text AI",
    targetView: "life",
    selector: "[data-tour='nav-capture']",
    icon: Plus,
    description: "Tap the central '+' button anytime to record voice notes, upload photos, or write personal memories.",
    aiExplanation: "Processes voice audio and text with zero delay, extracting structured dimensions without requiring manual tags.",
    highlightNote: "Try clicking '+' to record a quick voice note or write a thought!"
  },
  {
    id: 5,
    title: "Elements Hub (Events, People, Places & Wishlists)",
    badge: "Multimodal Entity & Intention Matrix",
    targetView: "entities",
    selector: "[data-tour='nav-elements']",
    icon: Layers,
    description: "Your central hub for all structured elements extracted from your story — featuring Events & Milestones Calendar, People & Places Network, and Wishlists & Action Intentions.",
    aiExplanation: "Gemini AI parses your journal text and audio in real-time, categorizing recurring companions, geo-locations, upcoming event milestones, and future commitments into interactive boards.",
    highlightNote: "Tap this Elements icon anytime to view your Events, People, Places, and Wishlists!"
  },
  {
    id: 6,
    title: "AI Mind Map & Epistemic Graph",
    badge: "Force Physics Clustering",
    targetView: "collections",
    selector: "[data-tour='graph-canvas']",
    icon: GitFork,
    description: "Your memory universe visualized as an interactive mind map. Central hub branches out into People, Places, Topics, and Key Moments.",
    aiExplanation: "Clusters recurring entity mentions across all journal entries, executing dynamic force physics so you can drag and explore connected memories.",
    highlightNote: "Drag any node on the graph to explore connections!"
  },
  {
    id: 7,
    title: "AI Reflection Chatboard",
    badge: "Personal AI Guide",
    targetView: "reflect",
    selector: "[data-tour='chat-reflect']",
    icon: MessageSquare,
    description: "Chat directly with your personal journal AI assistant. Ask questions about past memories, synthesize patterns, and save chat threads to your timeline.",
    aiExplanation: "Queries your encrypted memory context to provide empathetic, context-aware answers, allowing one-click saving of chat threads back into your journal feed.",
    highlightNote: "Click 'Save Chat Reflection' to persist key AI conversations directly to your timeline."
  },
  {
    id: 8,
    title: "Privacy & User Account Isolation",
    badge: "Encrypted Storage Scoping",
    targetView: "profile",
    selector: "[data-tour='profile-section']",
    icon: ShieldCheck,
    description: "Customize visual art styles (Hand-Drawn Vintage, Cyberpunk, Watercolor) with complete privacy control.",
    aiExplanation: "Memoiary scopes all localStorage keys and Firestore document collections to your unique user UID, ensuring guest/demo data never leaks into your account.",
    highlightNote: "Sign in with Google anytime to sync your clean personal memories across devices!"
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
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const step = WALKTHROUGH_STEPS[currentStepIdx];
  const StepIcon = step?.icon || Plus;

  // Navigate view and calculate target element bounding rect with retry interval
  useEffect(() => {
    if (!isOpen || !step) return;

    onNavigateView(step.targetView);

    let attempts = 0;
    const maxAttempts = 25;

    const findAndTarget = () => {
      if (step.subTabSelector) {
        const subTabEl = document.querySelector(step.subTabSelector) as HTMLElement | null;
        if (subTabEl) {
          subTabEl.click();
        }
      }

      const el = document.querySelector(step.selector);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
        
        // Track smooth scroll animation ticks
        let ticks = 0;
        const anim = setInterval(() => {
          const rect = el.getBoundingClientRect();
          setTargetRect(rect);
          ticks++;
          if (ticks > 12) clearInterval(anim);
        }, 50);

        return true;
      }
      return false;
    };

    if (!findAndTarget()) {
      const interval = setInterval(() => {
        attempts++;
        if (findAndTarget() || attempts >= maxAttempts) {
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [currentStepIdx, isOpen, step, onNavigateView]);

  // Continuously recalculate target rect on scroll/resize
  useEffect(() => {
    if (!isOpen || !step) return;

    const updatePosition = () => {
      const el = document.querySelector(step.selector);
      if (el) {
        setTargetRect(el.getBoundingClientRect());
      }
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen, step]);

  if (!isOpen || !step) return null;

  const handleNext = () => {
    if (currentStepIdx < WALKTHROUGH_STEPS.length - 1) {
      setCurrentStepIdx((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStepIdx > 0) {
      setCurrentStepIdx((prev) => prev - 1);
    }
  };

  // Measured card dimensions for exact viewport clamping
  const cardHeight = popoverRef.current?.offsetHeight || 270;
  const cardWidth = Math.min(360, window.innerWidth - 32);

  let top = window.innerHeight / 2 - cardHeight / 2;
  let left = window.innerWidth / 2 - cardWidth / 2;
  let arrowPlacement: "top" | "bottom" | "none" = "none";
  let arrowLeftPx = "50%";

  if (targetRect) {
    const spaceAbove = targetRect.top;
    const spaceBelow = window.innerHeight - targetRect.bottom;

    if (spaceAbove > cardHeight + 16) {
      top = targetRect.top - cardHeight - 14;
      arrowPlacement = "bottom";
    } else if (spaceBelow > cardHeight + 16) {
      top = targetRect.bottom + 14;
      arrowPlacement = "top";
    } else {
      top = targetRect.top - 20;
      arrowPlacement = "none";
    }

    // Clamp top & left strictly inside visible screen viewport
    top = Math.max(16, Math.min(window.innerHeight - cardHeight - 75, top));
    left = targetRect.left + targetRect.width / 2 - cardWidth / 2;
    left = Math.max(16, Math.min(window.innerWidth - cardWidth - 16, left));

    // Dynamic pointer arrow alignment relative to card
    const targetCenterX = targetRect.left + targetRect.width / 2;
    const arrowPosInCard = targetCenterX - left;
    const clampedArrowPos = Math.max(24, Math.min(cardWidth - 24, arrowPosInCard));
    arrowLeftPx = `${clampedArrowPos}px`;
  }

  const popoverStyle: React.CSSProperties = {
    position: "fixed",
    top: `${top}px`,
    left: `${left}px`,
    width: `${cardWidth}px`,
    maxHeight: `calc(100vh - ${top + 20}px)`
  };

  return (
    <div className="fixed inset-0 z-50 pointer-events-none font-sans select-none">
      {/* Target Element Spotlight Ring */}
      {targetRect && (
        <div
          className="fixed pointer-events-none z-50 rounded-2xl border-3 border-[#DE5239] shadow-[0_0_20px_rgba(222,82,57,0.7)] transition-all duration-200 animate-pulse"
          style={{
            top: targetRect.top - 6,
            left: targetRect.left - 6,
            width: targetRect.width + 12,
            height: targetRect.height + 12
          }}
        />
      )}

      {/* Element-Anchored Popover Tooltip Speech Bubble */}
      <div
        ref={popoverRef}
        className="pointer-events-auto bg-[#FAF7F0] border-2 border-[#1C1917] rounded-3xl p-4 sm:p-5 shadow-[6px_8px_0px_#1C1917] z-50 font-sans transition-all duration-200 animate-fade-in relative flex flex-col"
        style={popoverStyle}
      >
        {/* Pointer Arrow */}
        {targetRect && arrowPlacement === "bottom" && (
          <div
            className="absolute -bottom-3 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-[#1C1917]"
            style={{ left: arrowLeftPx, transform: "translateX(-50%)" }}
          />
        )}
        {targetRect && arrowPlacement === "top" && (
          <div
            className="absolute -top-3 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-b-8 border-b-[#1C1917]"
            style={{ left: arrowLeftPx, transform: "translateX(-50%)" }}
          />
        )}

        {/* Step Badge & Close */}
        <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="bg-[#DE5239] text-white px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider shadow-2xs flex items-center gap-1">
              <Sparkles size={11} className="animate-spin-slow" />
              <span>Step {step.id} of {WALKTHROUGH_STEPS.length}</span>
            </span>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DE5239] bg-[#DE5239]/10 px-2 py-0.5 rounded-md border border-[#DE5239]/20 truncate max-w-[140px]">
              {step.badge}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#1C1917]/60 hover:text-[#1C1917] hover:bg-[#1C1917]/10 rounded-full transition-colors cursor-pointer shrink-0"
            title="Exit Tour"
          >
            <X size={16} />
          </button>
        </div>

        {/* Feature Title & Icon */}
        <div className="flex items-start gap-2.5 my-1.5 shrink-0">
          <div className="p-2 bg-[#DE5239]/10 text-[#DE5239] border border-[#DE5239]/30 rounded-xl shrink-0 mt-0.5">
            <StepIcon size={18} />
          </div>
          <div>
            <h3 className="font-serif text-lg sm:text-xl font-bold text-[#1C1917] leading-tight">
              {step.title}
            </h3>
            <p className="text-xs text-[#1C1917]/85 mt-1 leading-relaxed font-sans">
              {step.description}
            </p>
          </div>
        </div>

        {/* AI Insight Technical Box */}
        <div className="my-2 bg-white/90 border border-[#1C1917]/20 rounded-2xl p-2.5 shadow-2xs shrink-0">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#DE5239] font-sans mb-1">
            <Sparkles size={13} className="fill-[#DE5239]" />
            <span>AI Behind The Scenes</span>
          </div>
          <p className="text-[11px] text-stone-700 leading-relaxed font-sans">
            {step.aiExplanation}
          </p>
          {step.highlightNote && (
            <div className="mt-1.5 pt-1.5 border-t border-stone-200 flex items-start gap-1 text-[10px] text-[#4D7C0F] font-semibold font-sans">
              <CheckCircle2 size={12} className="shrink-0 mt-0.5" />
              <span>{step.highlightNote}</span>
            </div>
          )}
        </div>

        {/* Step Controls */}
        <div className="mt-2 pt-2 border-t border-[#1C1917]/15 flex items-center justify-between gap-2 shrink-0">
          {/* Step Dots */}
          <div className="flex items-center gap-1">
            {WALKTHROUGH_STEPS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentStepIdx(idx)}
                className={`w-2 h-2 rounded-full transition-all cursor-pointer ${
                  idx === currentStepIdx
                    ? "bg-[#DE5239] w-4"
                    : idx < currentStepIdx
                    ? "bg-[#1C1917]"
                    : "bg-[#1C1917]/20"
                }`}
                title={`Step ${s.id}: ${s.title}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1.5">
            {currentStepIdx > 0 && (
              <button
                onClick={handlePrev}
                className="px-2.5 py-1 border border-[#1C1917] bg-white hover:bg-stone-100 text-[#1C1917] rounded-lg text-xs font-bold font-sans flex items-center gap-0.5 cursor-pointer active:scale-95 transition-all"
              >
                <ChevronLeft size={13} />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className="px-3.5 py-1 border border-[#1C1917] bg-[#DE5239] hover:bg-[#C6422A] text-white rounded-lg text-xs font-bold font-sans flex items-center gap-1 cursor-pointer shadow-[2px_2px_0px_#1C1917] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all"
            >
              <span>{currentStepIdx === WALKTHROUGH_STEPS.length - 1 ? "Finish Tour 🎉" : "Next Step"}</span>
              {currentStepIdx < WALKTHROUGH_STEPS.length - 1 && <ChevronRight size={13} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
