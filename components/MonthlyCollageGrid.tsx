"use client";

import React, { useState, useEffect, useRef } from "react";
import { Calendar, CheckCircle2, Clock, Plus, Users, Sparkles, ChevronLeft, ChevronRight, PenLine } from "lucide-react";
import { ArtisticAvatar } from "./ArtisticAvatar";
import { useJournal } from "@/lib/context/JournalContext";

interface Props {
  monthLabel?: string;
  monthlyPeople?: string[];
  monthlySummary?: string;
  onSelectCollage?: (dateStr: string) => void;
  uniqueDaysLogged?: number;
  isUnlocked?: boolean;
  isDemoMode?: boolean;
  onOpenCapture?: (prompt?: string) => void;
  onGoReflect?: (view: any) => void;
}

interface MonthItem {
  id: string;
  name: string;
  year: number;
  isCompleted: boolean;
  summary: string;
  people: string[];
  daysCount?: number;
  unlockedDate?: string;
}

export function MonthlyCollageGrid({
  monthLabel = "September 2026",
  monthlyPeople = [],
  monthlySummary,
  onSelectCollage,
  uniqueDaysLogged = 0,
  isUnlocked = false,
  isDemoMode = false,
  onOpenCapture,
  onGoReflect,
}: Props) {
  // monthIndex: 0 = Sept 2026, -1 = Aug 2026, -2 = Jul 2026, -3 = Jun 2026, -4 = May 2026
  const [monthIndex, setMonthIndex] = useState<number>(0);
  const [userReflection, setUserReflection] = useState<string>("");
  const [savedToast, setSavedToast] = useState(false);
  const monthScrollRef = useRef<HTMLDivElement>(null);

  const dynamicHeadline =
    monthlySummary && monthlySummary.length < 90
      ? monthlySummary
      : (isDemoMode ? "Creative focus, studio priorities & grounded collaboration" : "No captured moments logged for this month yet.");
  const dynamicPeople = monthlyPeople && monthlyPeople.length > 0 ? monthlyPeople : (isDemoMode ? ["Kirti", "Mansa"] : []);

  const demoMonths: MonthItem[] = isDemoMode ? [
    {
      id: "aug-2026",
      name: "August 2026",
      year: 2026,
      isCompleted: true,
      summary: "Restorative energy, studio milestones, project planning & grounded collaboration.",
      people: ["Kirti", "Mansa"],
      daysCount: 31,
      unlockedDate: "Aug 31, 2026",
    },
    {
      id: "jul-2026",
      name: "July 2026",
      year: 2026,
      isCompleted: true,
      summary: "Mid-summer deep focus, brand architecture, and creative ideation.",
      people: ["Kirti", "Mansa", "Rohan"],
      daysCount: 31,
      unlockedDate: "Jul 31, 2026",
    }
  ] : [];

  const allMonths: MonthItem[] = [
    {
      id: "sep-2026",
      name: "September 2026",
      year: 2026,
      isCompleted: false,
      summary: dynamicHeadline,
      people: dynamicPeople,
      daysCount: uniqueDaysLogged || 0,
      unlockedDate: "Sept 30, 11:59 PM",
    },
    ...demoMonths
  ];

  const activeIndex = Math.min(allMonths.length - 1, Math.max(0, Math.abs(monthIndex)));
  const activeMonth = allMonths[activeIndex];

  let user: any = null;
  try {
    const journalContext = useJournal();
    user = journalContext?.user;
  } catch {}

  const userReflKey = user && !user.uid?.startsWith("guest_user_") && !user.uid?.startsWith("user_guest_") ? user.uid : "guest";

  // Load reflection from localStorage on month change or user change
  useEffect(() => {
    try {
      if (typeof window !== "undefined") {
        const saved = localStorage.getItem(`memoiary_user_reflection_${userReflKey}_month_${activeMonth.id}`);
        setUserReflection(saved || "");
      }
    } catch (e) {
      setUserReflection("");
    }
  }, [activeMonth.id, userReflKey]);

  const handleSaveReflection = (val: string) => {
    setUserReflection(val);
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(`memoiary_user_reflection_${userReflKey}_month_${activeMonth.id}`, val);
      }
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2000);
    } catch (e) {
      console.warn("Failed to save monthly reflection", e);
    }
  };

  const selectMonthById = (id: string) => {
    const idx = allMonths.findIndex((m) => m.id === id);
    if (idx !== -1) {
      setMonthIndex(-idx);
    }
  };

  return (
    <section className="my-6 border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-3xl p-5 sm:p-7 shadow-[4px_6px_0px_#1C1917] relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#D97706]/10 blur-3xl pointer-events-none" />

      {/* Header with Month Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-[#1C1917]/15">
        <div>
          <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#1C1917] flex items-center gap-2">
            <Calendar size={20} className="text-[#D97706]" />
            <span>Your Story This Month</span>
          </h3>
          <p className="text-xs text-[#665F56] font-sans mt-0.5">{activeMonth.name}</p>
        </div>

        {/* Month Navigator (Previous / Next Controls matching Weekly view) */}
        <div className="flex items-center gap-2 bg-white border border-[#1C1917]/20 p-1.5 rounded-2xl shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setMonthIndex((prev) => Math.max(-(allMonths.length - 1), prev - 1))}
            disabled={monthIndex === -(allMonths.length - 1)}
            className={`p-1.5 rounded-xl border transition-colors ${
              monthIndex === -(allMonths.length - 1)
                ? "border-[#1C1917]/10 bg-stone-100 text-stone-300 cursor-not-allowed"
                : "border-[#1C1917]/20 bg-[#FAF7F0] text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer"
            }`}
            title="Previous Month"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-xs font-serif font-bold text-[#1C1917] px-3 min-w-[8.5rem] text-center flex items-center justify-center gap-1.5">
            <span>{activeMonth.name}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${activeMonth.isCompleted ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
              {activeMonth.isCompleted ? "Completed" : "In Progress"}
            </span>
          </span>

          <button
            onClick={() => setMonthIndex((prev) => Math.min(0, prev + 1))}
            disabled={monthIndex === 0}
            className={`p-1.5 rounded-xl border transition-colors ${
              monthIndex === 0
                ? "border-[#1C1917]/10 bg-stone-100 text-stone-300 cursor-not-allowed"
                : "border-[#1C1917]/20 bg-[#FAF7F0] text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer"
            }`}
            title="Next Month"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* MONTH CONTENT & REFLECTION */}
      <div className="space-y-6 animate-in fade-in duration-300">
        {/* Freeform Personal Monthly Reflection Box (Matching Weekly View) */}
        <div className="p-5 sm:p-6 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C1917]/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-[#FDF2D0] text-[#D97706] rounded-xl border border-[#D97706]/30">
                <Sparkles size={18} />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97706] block">
                  Personal Monthly Reflection
                </span>
                <h4 className="font-serif text-xl font-medium text-[#1C1917]">
                  Is there anything you want to add or reflect on for this month?
                </h4>
              </div>
            </div>
            {savedToast && (
              <span className="text-xs font-mono font-bold text-[#059669] bg-[#E2EBD8] border border-[#059669]/30 px-3 py-1 rounded-full animate-in fade-in">
                ✓ Saved to your monthly story
              </span>
            )}
          </div>

          {/* Freeform Monthly Reflection Textarea */}
          <div className="space-y-3">
            <textarea
              value={userReflection}
              onChange={(e) => handleSaveReflection(e.target.value)}
              placeholder="Write your reflections here... What were the highlights, lessons, or feelings you want to add to your monthly narrative?"
              rows={3}
              className="w-full p-4 bg-[#FAF7F0] border-[1.5px] border-[#1C1917]/25 rounded-2xl font-serif text-sm text-[#1C1917] focus:outline-none focus:border-[#DE5239] placeholder:italic placeholder:text-[#665F56]/60 leading-relaxed shadow-2xs"
            />

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <span className="text-[11px] font-mono text-[#665F56]">
                {userReflection.trim() ? "✨ Saved in your monthly reflection history" : "💡 Write freely or record a quick audio/photo reflection for this month"}
              </span>

              {onOpenCapture && (
                <button
                  onClick={() => onOpenCapture(`Monthly Reflection (${activeMonth.name}): Is there anything you want to add?`)}
                  className="px-3.5 py-1.5 bg-[#DE5239] hover:bg-[#C6422A] text-white rounded-xl text-xs font-sans font-bold shadow-[1px_2px_0px_#1C1917] border border-[#1C1917] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <PenLine size={13} />
                  <span>Record Audio/Photo Reflection</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Selected Featured Month Poster */}
        <div className="border-[1.5px] border-[#1C1917] bg-white rounded-3xl p-6 shadow-[3px_4px_0px_#1C1917] space-y-5 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#1C1917]/15 pb-3">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-md font-bold text-white shadow-xs ${
                activeMonth.isCompleted ? "bg-emerald-700" : "bg-[#D97706]"
              }`}>
                {activeMonth.isCompleted ? "COMPLETED MONTH COLLAGE" : "MONTH IN PROGRESS"}
              </span>
              <span className="text-xs font-mono font-bold text-[#665F56]">
                {activeMonth.name}
              </span>
            </div>

            <span className="text-xs font-mono text-[#665F56]">
              {activeMonth.isCompleted
                ? `Generated on ${activeMonth.unlockedDate}`
                : `Generates after month completes (${activeMonth.unlockedDate})`}
            </span>
          </div>

          <div className="space-y-4 font-sans">
            <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] leading-snug">
              {activeMonth.name}: {activeMonth.summary}
            </h4>

            {!activeMonth.isCompleted && (
              <div className="p-4 bg-[#FAF7F0] border border-[#1C1917]/15 rounded-2xl text-xs text-[#665F56] space-y-1">
                <div className="font-bold text-[#1C1917] flex items-center gap-1.5">
                  <Clock size={14} className="text-[#D97706]" /> Month Still In Progress
                </div>
                <p>
                  Capturing daily thoughts, photos, and memories for {activeMonth.name}. The full hand-drawn visual collage will generate automatically once the full month completes.
                </p>
              </div>
            )}

            {/* Tagged People Avatars */}
            {activeMonth.people && activeMonth.people.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#1C1917]/10">
                <span className="text-[10px] font-mono font-bold uppercase text-[#665F56] flex items-center gap-1">
                  <Users size={12} /> People Tagged in {activeMonth.name}:
                </span>
                {activeMonth.people.map((name, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 bg-[#FAF7F0] border border-[#1C1917]/20 px-3 py-1 rounded-full text-xs font-serif font-bold text-[#1C1917] shadow-2xs">
                    <ArtisticAvatar name={name} size="sm" />
                    <span>{name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
