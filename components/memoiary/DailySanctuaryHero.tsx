"use client";

import React, { useMemo, useState } from "react";
import { Camera, ChevronRight, Flame, Mic, MessageSquarePlus, PenLine, Sparkles } from "lucide-react";
import { View } from "./GlobalAppHeader";

export function DailySanctuaryHero({
  user,
  streak,
  openCapture,
  go,
  capturesCount,
  captures = [],
  mode = "day",
}: {
  user: any;
  streak: any;
  openCapture: (prompt?: string, targetDate?: Date) => void;
  go: (view: View) => void;
  capturesCount: number;
  captures?: any[];
  mode?: "day" | "week" | "month";
}) {
  const currentHour = new Date().getHours();
  const timeGreeting =
    currentHour < 12 ? "Good morning" : currentHour < 17 ? "Good afternoon" : "Good evening";
  const timeIcon = currentHour < 12 ? "☀️" : currentHour < 17 ? "☕" : "🌙";
  const firstName = user?.displayName ? user.displayName.split(" ")[0] : "Journaler";

  const dailyPrompts = [
    "What surprised you about today?",
    "Record a 30-second audio thought on your mind",
    "Who brought energy or warmth into your day?",
    "What is one small win from this afternoon?",
  ];
  const weeklyPrompts = [
    "How are you feeling about your weekly progress?",
    "What was the most memorable moment of this week?",
    "What is one intention for next week?",
  ];
  const monthlyPrompts = [
    "What was your biggest breakthrough this month?",
    "Who played a special role in your story this month?",
    "What feeling do you want to carry into next month?",
  ];

  const [promptIdx, setPromptIdx] = useState(0);

  const activePrompt =
    mode === "week"
      ? weeklyPrompts[promptIdx % weeklyPrompts.length]
      : mode === "month"
      ? monthlyPrompts[promptIdx % monthlyPrompts.length]
      : dailyPrompts[promptIdx % dailyPrompts.length];

  const subtitleText =
    mode === "week"
      ? "Review your story, moments & reflections for this week"
      : mode === "month"
      ? "Synthesize your visual narrative collage & monthly reflections"
      : capturesCount > 0
      ? "✓ Daily thought logged"
      : "Capture today's moments & thoughts";

  const headerTitle =
    mode === "week"
      ? "Weekly Story & Reflections"
      : mode === "month"
      ? "Monthly Visual Anthology"
      : `${timeIcon} ${timeGreeting}, ${firstName}`;

  return (
    <div className="mb-3 rounded-2xl border border-[#1C1917]/20 bg-gradient-to-r from-[#FAF7F0] via-[#F5E5DC]/60 to-[#FAF7F0] p-3.5 sm:p-4 shadow-2xs font-sans relative overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Compact Title & Streak */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#DE5239] text-white shadow-2xs shrink-0">
            <Flame size={18} className="fill-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif font-bold text-[#1C1917]">
                {headerTitle}
              </span>
              <span className="text-[10px] font-mono font-bold text-[#DE5239] bg-[#F5E5DC] border border-[#DE5239]/20 px-2 py-0.2 rounded-full">
                {streak?.currentStreak || 1}d Streak
              </span>
            </div>
            <p className="text-[11px] text-[#665F56] font-sans mt-0.5">
              {subtitleText}
            </p>
          </div>
        </div>

        {/* Quick Action Pills */}
        <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
          <button
            onClick={() => openCapture(activePrompt)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#DE5239] text-white text-xs font-sans font-bold shadow-2xs hover:bg-[#C6422A] cursor-pointer transition-transform active:scale-95"
            title="Answer Prompt"
          >
            <Sparkles size={13} />
            <span className="hidden sm:inline">
              {mode === "week" ? "Weekly Prompt" : mode === "month" ? "Monthly Prompt" : "Prompt"}
            </span>
          </button>

          <button
            onClick={() => openCapture("Voice note reflection")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#1C1917]/20 text-xs font-sans font-semibold text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer shadow-2xs"
            title="Record Voice Note"
          >
            <Mic size={13} className="text-[#DE5239]" />
            <span className="hidden xs:inline">Voice</span>
          </button>

          <button
            onClick={() => openCapture()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white border border-[#1C1917]/20 text-xs font-sans font-semibold text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer shadow-2xs"
            title="Write Entry"
          >
            <PenLine size={13} className="text-[#D97706]" />
            <span className="hidden xs:inline">Write</span>
          </button>

          <button
            onClick={() => go("reflect")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-[#1C1917] text-white text-xs font-sans font-semibold hover:bg-stone-800 cursor-pointer shadow-2xs"
            title="Talk With AI"
          >
            <MessageSquarePlus size={13} className="text-[#F5E5DC]" />
            <span className="hidden xs:inline">Talk AI</span>
          </button>
        </div>
      </div>
    </div>
  );
}
