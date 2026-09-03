"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Grid, Layers, Sparkles, ChevronLeft, ChevronRight, Lock } from "lucide-react";

export type TimelineMode = "day" | "week" | "month";

interface Props {
  selectedDate: Date;
  onSelectDate: (d: Date) => void;
  activeMode: TimelineMode;
  onModeChange: (m: TimelineMode) => void;
  availableDates?: string[];
  uniqueDaysLogged?: number;
  showFullCalendar?: boolean;
  onToggleCalendar?: () => void;
}

export function TimelineViewSwitcher({
  selectedDate,
  onSelectDate,
  activeMode,
  onModeChange,
  availableDates = [],
  uniqueDaysLogged = 0,
  showFullCalendar = false,
  onToggleCalendar,
}: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfWeek = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const monthYearLabel = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isWeeklyUnlocked = uniqueDaysLogged >= 7;
  const isMonthlyUnlocked = uniqueDaysLogged >= 30;

  return (
    <div className="my-4 font-sans space-y-3">
      {/* Top Main Mode Toggle Pills: DAY | WEEK | MONTH */}
      <div className="flex items-center justify-between gap-2 p-1.5 bg-[#FAF7F0] border-[1.5px] border-[#1C1917] rounded-2xl shadow-[2px_3px_0px_#1C1917]">
        <div className="grid grid-cols-3 gap-1.5 w-full">
          <button
            onClick={() => onModeChange("day")}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === "day"
                ? "bg-[#1C1917] text-white shadow-xs"
                : "bg-transparent text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            <CalendarIcon size={13} className={activeMode === "day" ? "text-[#D97706]" : ""} />
            <span>Day View</span>
          </button>

          <button
            onClick={() => onModeChange("week")}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === "week"
                ? "bg-[#1C1917] text-white shadow-xs"
                : "bg-transparent text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            {!isWeeklyUnlocked ? (
              <Lock size={12} className="text-amber-600 shrink-0" />
            ) : (
              <Layers size={13} className={activeMode === "week" ? "text-[#D97706]" : ""} />
            )}
            <span className="truncate">Weekly {!isWeeklyUnlocked ? `(${uniqueDaysLogged}/7d)` : "View"}</span>
          </button>

          <button
            onClick={() => onModeChange("month")}
            className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              activeMode === "month"
                ? "bg-[#1C1917] text-white shadow-xs"
                : "bg-transparent text-[#665F56] hover:text-[#1C1917]"
            }`}
          >
            {!isMonthlyUnlocked ? (
              <Lock size={12} className="text-amber-600 shrink-0" />
            ) : (
              <Grid size={13} className={activeMode === "month" ? "text-[#D97706]" : ""} />
            )}
            <span className="truncate">Monthly {!isMonthlyUnlocked ? `(${uniqueDaysLogged}/30d)` : "View"}</span>
          </button>
        </div>
      </div>

      {/* Inline Month Calendar — toggled by calendar icon in LifeHome header */}
      {activeMode === "day" && showFullCalendar && (
        <div className="border-[1.5px] border-[#1C1917] bg-white rounded-2xl p-4 shadow-[2px_3px_0px_#1C1917] space-y-3">
          <div className="flex items-center justify-between">
            <button onClick={prevMonth} className="p-1 rounded-md hover:bg-stone-100 cursor-pointer">
              <ChevronLeft size={16} />
            </button>
            <h4 className="font-serif text-sm font-bold text-[#1C1917]">{monthYearLabel}</h4>
            <button onClick={nextMonth} className="p-1 rounded-md hover:bg-stone-100 cursor-pointer">
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-[#665F56] uppercase tracking-wider">
            <span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty_${i}`} className="h-8" />
            ))}

            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const dateObj = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), dayNum);
              const isoStr = dateObj.toISOString().split("T")[0];
              const hasMemories = availableDates.includes(isoStr);
              const isSelected = dateObj.toDateString() === selectedDate.toDateString();

              return (
                <button
                  key={dayNum}
                  onClick={() => {
                    onSelectDate(dateObj);
                    setShowFullCalendar(false);
                  }}
                  className={`h-8 rounded-lg text-xs font-semibold flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#D97706] text-white font-bold shadow-xs"
                      : hasMemories
                      ? "bg-[#FDF2D0] text-[#1C1917] border border-[#D97706]/40 hover:bg-[#F5E5DC]"
                      : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                  }`}
                >
                  <span>{dayNum}</span>
                  {hasMemories && !isSelected && (
                    <span className="w-1 h-1 rounded-full bg-[#D97706] absolute bottom-1" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
