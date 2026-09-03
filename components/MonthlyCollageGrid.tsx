"use client";

import React from "react";
import { Sparkles, Calendar, Lock } from "lucide-react";
import { ArtisticAvatar } from "./ArtisticAvatar";

interface Props {
  monthLabel?: string;
  monthlyPeople?: string[];
  onSelectCollage?: (dateStr: string) => void;
  uniqueDaysLogged?: number;
  isUnlocked?: boolean;
}

export function MonthlyCollageGrid({
  monthLabel = "This Month",
  monthlyPeople = [],
  onSelectCollage,
  uniqueDaysLogged = 0,
  isUnlocked = false
}: Props) {
  return (
    <section className="my-6 border-[1.5px] border-[#1C1917] bg-[#FAF7F0] rounded-3xl p-5 sm:p-7 shadow-[4px_6px_0px_#1C1917] relative overflow-hidden font-sans">
      {/* Background glow */}
      <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-[#D97706]/10 blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-[#1C1917]/15">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FDF2D0] border border-[#D97706]/30 rounded-full text-xs font-bold text-[#D97706] uppercase tracking-wider mb-1">
            <Calendar size={13} /> Monthly Visual Gallery
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-medium text-[#1C1917]">
            {monthLabel} · Hand-Drawn Memory Collages
          </h3>
          <p className="text-xs text-[#665F56] font-sans mt-0.5">
            A visual anthology summarizing your daily chapters in pencil sketch linework.
          </p>
        </div>

        {/* Monthly People Strip */}
        {isUnlocked && monthlyPeople && monthlyPeople.length > 0 && (
          <div className="flex items-center gap-2 bg-white border border-[#1C1917]/20 px-3.5 py-1.5 rounded-2xl shadow-xs">
            <span className="text-[11px] font-semibold text-[#665F56] uppercase tracking-wider font-sans">
              People in {monthLabel}:
            </span>
            <div className="flex items-center gap-1">
              {monthlyPeople.map((name, i) => (
                <ArtisticAvatar key={i} name={name} size="sm" />
              ))}
            </div>
          </div>
        )}
      </div>

      {!isUnlocked ? (
        /* LOCKED STATE: REQUIRES 30 COMPLETED DAYS */
        <div className="py-12 px-6 text-center space-y-4 bg-white border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917]">
          <div className="w-14 h-14 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto border border-amber-300 shadow-xs">
            <Lock size={24} />
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold text-amber-700 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
              UNLOCKS AFTER 30 DAYS OF JOURNALING
            </span>
            <h4 className="font-serif text-2xl font-medium text-[#1C1917] pt-1">
              Monthly Visual Gallery Locked ({uniqueDaysLogged} / 30 Days Logged)
            </h4>
            <p className="text-xs text-[#665F56] font-sans max-w-md mx-auto leading-relaxed">
              Monthly hand-drawn collage anthologies require a full 30 completed days of daily entries before generating your full monthly narrative collage.
            </p>
          </div>

          {/* Progress bar */}
          <div className="max-w-xs mx-auto space-y-1.5 pt-2">
            <div className="w-full bg-stone-100 rounded-full h-3 border border-[#1C1917]/20 overflow-hidden p-0.5">
              <div className="bg-[#D97706] h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (uniqueDaysLogged / 30) * 100)}%` }} />
            </div>
            <span className="text-[11px] font-bold text-[#665F56] font-mono block">
              {Math.max(0, 30 - uniqueDaysLogged)} more {30 - uniqueDaysLogged === 1 ? "day" : "days"} needed to unlock
            </span>
          </div>
        </div>
      ) : (
        /* Main Featured Monthly Hand-Drawn Narrative Collage Poster */
        <div className="border-[1.5px] border-[#1C1917] bg-[#262320] rounded-2xl overflow-hidden shadow-[3px_4px_0px_#1C1917] group relative">
          <div className="relative aspect-video w-full overflow-hidden">
            <img
              src="/collages/daily_collage_sketch_sep2.jpg"
              alt={`Hand-drawn monthly story collage for ${monthLabel}`}
              className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest bg-[#D97706] px-2.5 py-0.5 rounded-md font-bold border border-white/20">
                  Full Month Hand-Drawn Narrative Collage
                </span>
                <h4 className="font-serif text-xl font-medium mt-1 text-stone-100">
                  {monthLabel}: Product Launch, Jubliee Hills Walks &amp; Ananthagiri Campfire
                </h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
