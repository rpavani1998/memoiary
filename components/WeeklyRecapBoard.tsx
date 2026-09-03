"use client";

import React from "react";
import { Calendar, Sparkles, TrendingUp, Users, Heart, Lock } from "lucide-react";
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
}

export function WeeklyRecapBoard({
  weekLabel = "This Week",
  highlights = [],
  weeklyPeople = [],
  weeklyInsight,
  onSelectHighlight,
  uniqueDaysLogged = 0,
  isUnlocked = false
}: Props) {
  return (
    <section className="my-6 border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-3xl p-5 sm:p-7 shadow-[4px_6px_0px_#1C1917] relative overflow-hidden font-sans">
      {/* Background paper texture glow */}
      <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-[#DE5239]/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#1C1917]/15">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5E5DC] border border-[#DE5239]/30 rounded-full text-xs font-bold text-[#DE5239] uppercase tracking-wider mb-1">
            <Sparkles size={13} /> Weekly Visual Recap
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
            Your Story This Week
          </h3>
          <p className="text-xs text-[#665F56] font-sans mt-0.5">{weekLabel}</p>
        </div>

        {/* Weekly People Strip */}
        {isUnlocked && weeklyPeople && weeklyPeople.length > 0 && (
          <div className="flex items-center gap-2 bg-white border border-[#1C1917]/20 px-3.5 py-1.5 rounded-2xl shadow-xs">
            <span className="text-[11px] font-semibold text-[#665F56] uppercase tracking-wider font-sans">
              People Met:
            </span>
            <div className="flex items-center gap-1">
              {weeklyPeople.map((name, i) => (
                <ArtisticAvatar key={i} name={name} size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>

      {!isUnlocked ? (
        /* LOCKED STATE: REQUIRES 7 COMPLETED DAYS */
        <div className="py-12 px-6 text-center space-y-4 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917]">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300 shadow-xs">
            <Lock size={24} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              UNLOCKS AFTER 7 DAYS OF JOURNALING
            </span>
            <h4 className="font-serif text-2xl font-medium text-[#1C1917] pt-1">
              Weekly Visual Synthesis Locked ({uniqueDaysLogged} / 7 Days Logged)
            </h4>
            <p className="text-xs text-[#665F56] font-sans max-w-md mx-auto leading-relaxed">
              Weekly storyboards require a full 7 completed days of daily entries before synthesizing your weekly emotional arc and scene highlights.
            </p>
          </div>

          {/* Progress bar */}
          <div className="max-w-xs mx-auto space-y-1.5 pt-2">
            <div className="w-full bg-stone-100 rounded-full h-3 border border-[#1C1917]/20 overflow-hidden p-0.5">
              <div className="bg-[#D97706] h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (uniqueDaysLogged / 7) * 100)}%` }} />
            </div>
            <span className="text-[11px] font-bold text-[#665F56] font-mono block">
              {Math.max(0, 7 - uniqueDaysLogged)} more {7 - uniqueDaysLogged === 1 ? "day" : "days"} needed to unlock
            </span>
          </div>
        </div>
      ) : highlights.length === 0 ? (
        <div className="py-12 px-4 text-center space-y-3 bg-white border-[1.5px] border-dashed border-[#1C1917]/30 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-[#F5E5DC] text-[#DE5239] flex items-center justify-center mx-auto border border-[#DE5239]/30">
            <Sparkles size={20} />
          </div>
          <h4 className="font-serif text-xl font-medium text-[#1C1917]">Zero entries for this week</h4>
          <p className="text-xs text-[#665F56] font-sans max-w-md mx-auto">
            Your weekly recap is a clean slate. Tap &quot;+ Capture what this moment feels like&quot; below to record your first memory!
          </p>
        </div>
      ) : (
        <>
          {/* Weekly Emotional & Narrative Arc Insight Banner */}
          {weeklyInsight && (
            <div className="mb-6 p-4 sm:p-5 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917] flex items-start gap-3">
              <div className="p-2 bg-[#FDF2D0] border border-[#D97706]/40 rounded-xl text-[#D97706] shrink-0 mt-0.5">
                <TrendingUp size={18} />
              </div>
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-[#D97706] uppercase tracking-wider font-sans">
                  Weekly Emotional Arc &amp; Synthesis
                </span>
                <p className="font-serif text-sm sm:text-base text-[#1C1917] leading-relaxed">
                  &ldquo;{weeklyInsight}&rdquo;
                </p>
              </div>
            </div>
          )}

          {/* Grid of Cropped Scene Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {highlights.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectHighlight?.(item.id)}
                className="border-[1.5px] border-[#1C1917] bg-white rounded-2xl overflow-hidden shadow-[2px_3px_0px_#1C1917] flex flex-col justify-between hover:-translate-y-0.5 transition-all cursor-pointer group"
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
                      <span className="text-[10px] font-bold text-[#665F56] uppercase tracking-wider font-sans">
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
        </>
      )}
    </section>
  );
}
