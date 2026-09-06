"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Sparkles, TrendingUp, Users, Heart, Lock, ChevronLeft, ChevronRight, CheckCircle2, Clock, PenLine } from "lucide-react";
import { ArtisticAvatar } from "./ArtisticAvatar";

export interface WeeklyHighlight {
  id: string;
  dayLabel: string;
  title: string;
  summary: string;
  imageUrl?: string;
  people?: string[];
  mood?: string;
}

interface Props {
  weekLabel?: string;
  highlights?: WeeklyHighlight[];
  weeklyPeople?: string[];
  weeklyInsight?: string;
  onSelectHighlight?: (id: string) => void;
  uniqueDaysLogged?: number;
  isUnlocked?: boolean;
  onOpenCapture?: (prompt?: string) => void;
  onGoReflect?: (view: any) => void;
}

export function WeeklyRecapBoard({
  weekLabel = "This Week",
  highlights = [],
  weeklyPeople = [],
  weeklyInsight,
  onSelectHighlight,
  uniqueDaysLogged = 0,
  isUnlocked = false,
  onOpenCapture,
  onGoReflect,
}: Props) {
  // weekIndex: 0 = current week (Sept 1 - Sept 7), -1 = previous week (Aug 25 - Aug 31), -2 = Aug 18 - Aug 24
  const [weekIndex, setWeekIndex] = useState<number>(0);
  const [userReflection, setUserReflection] = useState<string>("");
  const [savedToast, setSavedToast] = useState(false);

  const currentDayOfWeek = 4;
  const totalDaysInWeek = 7;

  const weekTitle = 
    weekIndex === 0 ? "Sept 1 – Sept 7, 2026 (Week 1)" :
    weekIndex === -1 ? "Aug 25 – Aug 31, 2026 (Completed)" :
    `Aug ${18 + (weekIndex + 2) * 7} – Aug ${24 + (weekIndex + 2) * 7}, 2026 (Completed)`;

  const dynamicWeeklyInsight = 
    weekIndex === 0
      ? "Your current week is taking shape. Moments captured between Sept 1st and Sept 7th will synthesize into a full weekly story once Week 1 completes."
      : (weeklyInsight || "Your past week shifted from stress into celebratory milestones and deep restorative time with friends.");

  // Load reflection from localStorage on weekIndex change
  useEffect(() => {
    try {
      const saved = localStorage.getItem(`memoiary_user_reflection_week_${weekIndex}`);
      setUserReflection(saved || "");
    } catch (e) {
      setUserReflection("");
    }
  }, [weekIndex]);

  const handleSaveReflection = (val: string) => {
    setUserReflection(val);
    try {
      localStorage.setItem(`memoiary_user_reflection_week_${weekIndex}`, val);
      setSavedToast(true);
      setTimeout(() => setSavedToast(false), 2000);
    } catch (e) {
      console.warn("Failed to save reflection", e);
    }
  };

  return (
    <section className="my-6 border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-3xl p-5 sm:p-7 shadow-[4px_6px_0px_#1C1917] relative overflow-hidden font-sans">
      {/* Background paper texture glow */}
      <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-[#DE5239]/10 blur-3xl pointer-events-none" />

      {/* Header with Week Navigation Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-[#1C1917]/15">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5E5DC] border border-[#DE5239]/30 rounded-full text-xs font-bold text-[#DE5239] uppercase tracking-wider mb-1">
            <Sparkles size={13} /> Weekly Visual Recap
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
            Your Story This Week
          </h3>
          <p className="text-xs text-[#665F56] font-sans mt-0.5">{weekTitle}</p>
        </div>

        {/* Week Navigator (Previous / Next Week Controls) */}
        <div className="flex items-center gap-2 bg-white border border-[#1C1917]/20 p-1.5 rounded-2xl shadow-xs self-start sm:self-auto">
          <button
            onClick={() => setWeekIndex((prev) => prev - 1)}
            className="p-1.5 rounded-xl border border-[#1C1917]/20 bg-[#FAF7F0] text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer transition-colors"
            title="Previous Week"
          >
            <ChevronLeft size={16} />
          </button>

          <span className="text-xs font-mono font-bold text-[#1C1917] px-2 min-w-[7.5rem] text-center">
            {weekIndex === 0 ? "Current Week" : `${Math.abs(weekIndex)} Week${Math.abs(weekIndex) > 1 ? "s" : ""} Ago`}
          </span>

          <button
            onClick={() => setWeekIndex((prev) => Math.min(0, prev + 1))}
            disabled={weekIndex === 0}
            className={`p-1.5 rounded-xl border transition-colors ${
              weekIndex === 0
                ? "border-[#1C1917]/10 bg-stone-100 text-stone-300 cursor-not-allowed"
                : "border-[#1C1917]/20 bg-[#FAF7F0] text-[#1C1917] hover:bg-[#F5E5DC] cursor-pointer"
            }`}
            title="Next Week"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* VIEW 1: CURRENT WEEK IN PROGRESS (SEPT 1 - SEPT 7) */}
      {weekIndex === 0 && !isUnlocked && (
        <div className="space-y-6">
          {/* Week In Progress Status Banner */}
          <div className="p-6 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-4 font-sans">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1C1917]/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-[#FDF2D0] border border-[#D97706]/40 rounded-2xl text-[#D97706]">
                  <Clock size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#D97706] block">
                    Week In Progress · Sept 1 – Sept 7
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#1C1917]">
                    Weekly Recap Unlocks at Week End
                  </h4>
                </div>
              </div>
              <span className="text-xs font-mono font-bold text-[#DE5239] bg-[#F5E5DC] border border-[#DE5239]/30 px-3 py-1 rounded-full w-fit">
                Day {currentDayOfWeek} of {totalDaysInWeek} Days
              </span>
            </div>

            {/* Weekly Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-[#665F56]">
                <span>Sept 1st</span>
                <span className="text-[#DE5239] font-mono">{totalDaysInWeek - currentDayOfWeek} Days Remaining</span>
                <span>Sept 7th</span>
              </div>
              <div className="w-full h-3 bg-[#FAF7F0] border border-[#1C1917]/30 rounded-full overflow-hidden p-0.5">
                <div
                  className="h-full bg-[#DE5239] rounded-full transition-all duration-500"
                  style={{ width: `${(currentDayOfWeek / totalDaysInWeek) * 100}%` }}
                />
              </div>
            </div>

            {/* Freeform Current Week Reflection */}
            <div className="pt-2 space-y-2 border-t border-stone-100">
              <label className="text-xs font-bold text-[#1C1917] flex items-center justify-between">
                <span>✍️ Add your reflections for this week</span>
                {savedToast && <span className="text-[10px] font-mono text-[#059669]">✓ Saved</span>}
              </label>
              <textarea
                value={userReflection}
                onChange={(e) => handleSaveReflection(e.target.value)}
                placeholder="How are you feeling this week? Add any personal notes or thoughts..."
                rows={2}
                className="w-full p-3 bg-[#FAF7F0] border border-[#1C1917]/20 rounded-xl font-serif text-xs text-[#1C1917] focus:outline-none focus:border-[#DE5239] placeholder:italic"
              />
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: COMPLETED WEEK VIEW (WEEK INDEX < 0 OR UNLOCKED) */}
      {(weekIndex < 0 || isUnlocked) && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Freeform Personal Weekly Reflection Box */}
          <div className="p-5 sm:p-6 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#1C1917]/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#F5E5DC] text-[#DE5239] rounded-xl border border-[#DE5239]/30">
                  <Sparkles size={18} />
                </div>
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#DE5239] block">
                    Personal Weekly Reflection
                  </span>
                  <h4 className="font-serif text-xl font-medium text-[#1C1917]">
                    How are you feeling about this period?
                  </h4>
                </div>
              </div>
              {savedToast && (
                <span className="text-xs font-mono font-bold text-[#059669] bg-[#E2EBD8] border border-[#059669]/30 px-3 py-1 rounded-full animate-in fade-in">
                  ✓ Saved to your story
                </span>
              )}
            </div>

            {/* Freeform Reflection Textarea */}
            <div className="space-y-3">
              <textarea
                value={userReflection}
                onChange={(e) => handleSaveReflection(e.target.value)}
                placeholder="Write your reflections here... How did this week feel for you? What were your favorite moments, insights, or intentions for next week?"
                rows={3}
                className="w-full p-4 bg-[#FAF7F0] border-[1.5px] border-[#1C1917]/25 rounded-2xl font-serif text-sm text-[#1C1917] focus:outline-none focus:border-[#DE5239] placeholder:italic placeholder:text-[#665F56]/60 leading-relaxed shadow-2xs"
              />

              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <span className="text-[11px] font-mono text-[#665F56]">
                  {userReflection.trim() ? "✨ Saved in your personal reflection history" : "💡 Write freely or record a quick audio/photo reflection"}
                </span>

                {onOpenCapture && (
                  <button
                    onClick={() => onOpenCapture("Weekly Reflection: How did this week feel for you?")}
                    className="px-3.5 py-1.5 bg-[#DE5239] hover:bg-[#C6422A] text-white rounded-xl text-xs font-sans font-bold shadow-[1px_2px_0px_#1C1917] border border-[#1C1917] transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <PenLine size={13} />
                    <span>Record Audio/Photo Reflection</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Weekly Emotional & Narrative Arc Synthesis Banner */}
          <div className="p-4 sm:p-5 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] flex items-start gap-3 font-sans">
            <div className="p-2 bg-[#FDF2D0] border border-[#D97706]/40 rounded-xl text-[#D97706] shrink-0 mt-0.5">
              <TrendingUp size={18} />
            </div>
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider block">
                Weekly Emotional Arc &amp; Synthesis
              </span>
              <p className="font-serif text-sm sm:text-base text-[#1C1917] leading-relaxed">
                &ldquo;{dynamicWeeklyInsight}&rdquo;
              </p>
            </div>
          </div>

          {/* Grid of Scene Highlights */}
          {highlights.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {highlights.map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectHighlight?.(item.id)}
                  className="border-[1.5px] border-[#1C1917] bg-white rounded-2xl overflow-hidden shadow-[2px_3px_0px_#1C1917] flex flex-col justify-between hover:-translate-y-0.5 transition-all cursor-pointer group font-sans"
                >
                  {item.imageUrl && (
                    <div className="h-40 w-full overflow-hidden relative">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-2 left-2 bg-[#1C1917] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
                        {item.dayLabel}
                      </div>
                      {item.mood && (
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs border border-[#1C1917]/20 text-[#1C1917] text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {item.mood}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="font-serif text-base font-medium text-[#1C1917] group-hover:text-[#DE5239] transition-colors leading-snug">
                        {item.title}
                      </h4>
                      <p className="font-serif text-xs text-[#665F56] line-clamp-2 leading-relaxed">
                        {item.summary}
                      </p>
                    </div>

                    {item.people && item.people.length > 0 && (
                      <div className="pt-2 border-t border-[#1C1917]/10 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-[#665F56] uppercase tracking-wider">
                          With:
                        </span>
                        <div className="flex items-center gap-1">
                          {item.people.map((p, idx) => (
                            <ArtisticAvatar key={idx} name={p} size="sm" />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
