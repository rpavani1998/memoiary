"use client";

import React, { useState } from "react";
import { Sparkles, Calendar, Lock, CheckCircle2, ChevronRight, Clock, Plus } from "lucide-react";
import { ArtisticAvatar } from "./ArtisticAvatar";

interface Props {
  monthLabel?: string;
  monthlyPeople?: string[];
  monthlySummary?: string;
  onSelectCollage?: (dateStr: string) => void;
  uniqueDaysLogged?: number;
  isUnlocked?: boolean;
  onOpenCapture?: (prompt?: string) => void;
  onGoReflect?: (view: any) => void;
}

export function MonthlyCollageGrid({
  monthLabel = "September 2026",
  monthlyPeople = [],
  monthlySummary,
  onSelectCollage,
  uniqueDaysLogged = 0,
  isUnlocked = false,
  onOpenCapture,
  onGoReflect,
}: Props) {
  const [selectedMonthView, setSelectedMonthView] = useState<"current" | "august">("current");

  // Current date parameters for September 2026
  const now = new Date();
  const currentDayOfMonth = now.getDate(); // 4
  const totalDaysInMonth = 30; // September has 30 days
  const isMonthComplete = isUnlocked || currentDayOfMonth >= totalDaysInMonth;
  const monthProgressPercent = Math.min(100, Math.round((currentDayOfMonth / totalDaysInMonth) * 100));

  const dynamicHeadline = monthlySummary || "A rich monthly summary synthesizes as daily moments unfold.";

  return (
    <section className="my-6 border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-3xl p-5 sm:p-7 shadow-[4px_6px_0px_#1C1917] relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#D97706]/10 blur-3xl pointer-events-none" />

      {/* Header with Month Selector Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1C1917]/15">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF2D0] border border-[#D97706]/30 rounded-full text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
            <Calendar size={13} /> Monthly Visual Anthology
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
            {selectedMonthView === "current" ? "September 2026" : "August 2026 (Completed)"}
          </h3>
          <p className="text-xs text-[#665F56] font-sans mt-0.5">
            Cumulative monthly story collages generate once the full month completes (Sept 1 – Sept 30).
          </p>
        </div>

        {/* Month Selector Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-[#1C1917]/20 rounded-2xl shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setSelectedMonthView("current")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer ${
              selectedMonthView === "current"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917] border border-[#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            September (In Progress)
          </button>
          <button
            onClick={() => setSelectedMonthView("august")}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-sans transition-all cursor-pointer flex items-center gap-1 ${
              selectedMonthView === "august"
                ? "bg-[#DE5239] text-white shadow-[1px_2px_0px_#1C1917] border border-[#1C1917]"
                : "text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <CheckCircle2 size={12} className={selectedMonthView === "august" ? "text-white" : "text-emerald-600"} />
            August (Completed)
          </button>
        </div>
      </div>

      {/* VIEW 1: CURRENT MONTH IN PROGRESS (SEPTEMBER 1ST TO SEPTEMBER 30TH) */}
      {selectedMonthView === "current" && !isMonthComplete && (
        <div className="space-y-6">
          {/* Month In Progress Status Card */}
          <div className="p-6 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1917]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#FDF2D0] border border-[#D97706]/40 rounded-2xl text-[#D97706]">
                  <Clock size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97706] block">
                    Month In Progress · September 1 – September 30
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#1C1917]">
                    September Collage Unlocks at Month End
                  </h4>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#DE5239] bg-[#F5E5DC] border border-[#DE5239]/30 px-3 py-1 rounded-full w-fit">
                Day {currentDayOfMonth} of {totalDaysInMonth} Days
              </span>
            </div>

            {/* Live Monthly Timeline Progress Bar */}
            <div className="space-y-2 font-sans">
              <div className="flex justify-between text-xs font-bold text-[#665F56]">
                <span>September 1st</span>
                <span className="text-[#DE5239] font-mono">{totalDaysInMonth - currentDayOfMonth} Days Remaining</span>
                <span>September 30th</span>
              </div>
              <div className="w-full h-3 bg-[#FAF7F0] border border-[#1C1917]/30 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#DE5239] rounded-full transition-all duration-500"
                  style={{ width: `${monthProgressPercent}%` }}
                />
              </div>
            </div>

            {/* Explanatory Banner */}
            <div className="p-4 bg-[#FAF7F0] border border-[#1C1917]/15 rounded-xl space-y-2 font-sans">
              <p className="text-xs text-[#1C1917] leading-relaxed">
                ✨ <strong className="font-bold text-[#1C1917]">Cumulative Monthly Collage Rule:</strong> The full September visual story collage generates automatically at 11:59 PM on September 30th after the entire month is completed.
              </p>
              <p className="text-xs text-[#665F56] leading-relaxed">
                Continue capturing daily thoughts, photos, and voice notes. All daily moments captured between Sept 1st and Sept 30th will be synthesized into your September hand-drawn narrative collage!
              </p>
            </div>

            {/* People Tagged So Far in September */}
            {monthlyPeople && monthlyPeople.length > 0 && (
              <div className="pt-1 space-y-2 font-sans border-t border-[#1C1917]/10">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#665F56] block">
                  People Tagged in September Memories So Far:
                </span>
                <div className="flex flex-wrap gap-2">
                  {monthlyPeople.map((name, i) => (
                    <div key={i} className="flex items-center gap-1.5 bg-[#FAF7F0] border border-[#1C1917]/20 px-3 py-1 rounded-full text-xs">
                      <ArtisticAvatar name={name} size="sm" />
                      <span className="font-serif font-bold text-[#1C1917]">{name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Call to Action */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#665F56] font-sans">
                {uniqueDaysLogged > 0 ? `Captured memories on ${uniqueDaysLogged} days in September.` : "Start capturing daily memories for September."}
              </span>
              {onOpenCapture && (
                <button
                  onClick={() => onOpenCapture("menu")}
                  className="px-4 py-2.5 bg-[#DE5239] hover:bg-[#C6422A] text-white rounded-xl text-xs font-sans font-bold shadow-[2px_3px_0px_#1C1917] border border-[#1C1917] transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <Plus size={14} /> Add September Memory
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COMPLETED MONTH COLLAGE (AUGUST OR COMPLETED MONTH) */}
      {(selectedMonthView === "august" || isMonthComplete) && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Main Featured Monthly Hand-Drawn Narrative Collage Poster */}
          {/* Main Featured Monthly Hand-Drawn Narrative Collage Poster (Generated from User Entries) */}
          <div className="border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-3xl p-6 shadow-[3px_4px_0px_#1C1917] space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#1C1917]/15 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-widest bg-[#D97706] text-white px-2.5 py-0.5 rounded-md font-bold shadow-xs">
                  GENERATED FROM YOUR USER ENTRIES
                </span>
                <span className="text-xs font-mono font-bold text-[#665F56]">
                  {selectedMonthView === "august" ? "August 2026" : monthLabel}
                </span>
              </div>
              <span className="text-xs text-[#DE5239] font-sans font-bold flex items-center gap-1">
                <Sparkles size={13} /> Synthesized Story Canvas
              </span>
            </div>

            <div className="space-y-3 font-sans">
              <h4 className="font-serif text-xl sm:text-2xl font-bold text-[#1C1917] leading-snug">
                {selectedMonthView === "august" ? "August 2026: Restorative energy, creative milestones & team reflection" : `${monthLabel}: ${dynamicHeadline}`}
              </h4>

              {/* Tagged People Avatars */}
              {monthlyPeople && monthlyPeople.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <span className="text-[10px] font-mono font-bold uppercase text-[#665F56]">Key People:</span>
                  {monthlyPeople.map((name, idx) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-white border border-[#1C1917]/20 px-2.5 py-1 rounded-full text-xs font-serif font-bold text-[#1C1917]">
                      <ArtisticAvatar name={name} size="sm" />
                      <span>{name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Guided Monthly Reflection & Review Section */}
          <div className="p-5 sm:p-6 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C1917]/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#FDF2D0] text-[#D97706] rounded-xl border border-[#D97706]/30">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97706] block">
                    Completed Month Synthesis
                  </span>
                  <h4 className="font-serif text-xl font-medium text-[#1C1917]">
                    Full Month Story Breakdown
                  </h4>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#1C1917]/15 space-y-1">
                <span className="text-xs font-bold text-[#D97706] font-mono block">1. MONTHLY NARRATIVE ARC</span>
                <p className="font-serif italic text-xs text-stone-800 leading-snug">
                  &quot;Synthesized all key moments captured across the full 30 days.&quot;
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#1C1917]/15 space-y-1">
                <span className="text-xs font-bold text-[#DE5239] font-mono block">2. BREAKTHROUGHS &amp; GROWTH</span>
                <p className="font-serif italic text-xs text-stone-800 leading-snug">
                  &quot;Shifted from stress into creative energy and team connection.&quot;
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F0] border border-[#1C1917]/15 space-y-1">
                <span className="text-xs font-bold text-[#059669] font-mono block">3. FUTURE INTENTIONS</span>
                <p className="font-serif italic text-xs text-stone-800 leading-snug">
                  &quot;Sustaining personal rest &amp; creative focus for upcoming projects.&quot;
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
