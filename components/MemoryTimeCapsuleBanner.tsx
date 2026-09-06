"use client";

import React, { useMemo } from "react";
import { Sparkles, Calendar, ArrowRight, History, Clock } from "lucide-react";
import { ArtisticAvatar } from "./ArtisticAvatar";

interface MemoryTimeCapsuleBannerProps {
  captures: any[];
  onSelectCapture?: (capture: any) => void;
}

interface PastMemoryMatch {
  label: string;
  diffText: string;
  dateFormatted: string;
  capture: any;
}

export function MemoryTimeCapsuleBanner({
  captures = [],
  onSelectCapture,
}: MemoryTimeCapsuleBannerProps) {
  const match = useMemo<PastMemoryMatch | null>(() => {
    if (!captures || captures.length === 0) return null;

    const now = new Date(2026, 8, 6); // Current reference date Sept 6, 2026

    // Sort captures by date descending
    const sorted = [...captures].sort((a, b) => {
      const da = new Date(a.createdAt).getTime();
      const db = new Date(b.createdAt).getTime();
      return db - da;
    });

    for (const c of sorted) {
      if (!c.createdAt) continue;
      const cd = new Date(c.createdAt);
      
      // Calculate month difference & day match
      const monthDiff = (now.getFullYear() - cd.getFullYear()) * 12 + (now.getMonth() - cd.getMonth());
      const dayDiff = Math.abs(now.getDate() - cd.getDate());
      const isSameDayOfMonth = dayDiff <= 2; // Exact or +/- 2 days around same day of month

      if (monthDiff === 1 && isSameDayOfMonth) {
        return {
          label: "1 Month Ago Today",
          diffText: "Last Month",
          dateFormatted: cd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          capture: c,
        };
      }

      if (monthDiff === 2 && isSameDayOfMonth) {
        return {
          label: "2 Months Ago Today",
          diffText: "2 Months Ago",
          dateFormatted: cd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          capture: c,
        };
      }

      if (monthDiff === 3 && isSameDayOfMonth) {
        return {
          label: "3 Months Ago Today",
          diffText: "3 Months Ago",
          dateFormatted: cd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          capture: c,
        };
      }

      if (monthDiff === 12 && isSameDayOfMonth) {
        return {
          label: "1 Year Ago Today",
          diffText: "1 Year Ago",
          dateFormatted: cd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          capture: c,
        };
      }
    }

    // Fallback match: grab any entry from a previous month (e.g. August 2026) to make sure time capsule always offers a historical revisit
    const pastMonthEntry = sorted.find((c) => {
      const cd = new Date(c.createdAt);
      return cd.getMonth() !== now.getMonth() || cd.getFullYear() !== now.getFullYear();
    });

    if (pastMonthEntry) {
      const cd = new Date(pastMonthEntry.createdAt);
      return {
        label: "Revisiting Your Past",
        diffText: "Past Memory",
        dateFormatted: cd.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        capture: pastMonthEntry,
      };
    }

    return null;
  }, [captures]);

  if (!match || !match.capture) return null;

  const { capture, label, dateFormatted } = match;
  const title = capture.dimensions?.summary || capture.title || (capture.content ? capture.content.substring(0, 60) + "..." : "Journal Entry");
  const people = capture.dimensions?.people || capture.extractedDimensions?.people || [];

  return (
    <div
      data-tour="time-capsule"
      onClick={() => onSelectCapture?.(capture)}
      className="my-5 border-[1.5px] border-[#1C1917] bg-gradient-to-r from-[#FAF7F0] via-white to-[#FAF7F0] rounded-3xl p-5 shadow-[4px_5px_0px_#1C1917] hover:-translate-y-0.5 transition-all cursor-pointer font-sans relative overflow-hidden group"
    >
      {/* Decorative background paper glow */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-[#DE5239]/10 blur-2xl pointer-events-none" />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white bg-[#DE5239] px-2.5 py-0.5 rounded-md shadow-2xs flex items-center gap-1">
              <History size={12} /> {label}
            </span>
            <span className="text-xs font-mono font-bold text-[#665F56]">
              {dateFormatted}
            </span>
          </div>

          <h4 className="font-serif text-base sm:text-lg font-bold text-[#1C1917] group-hover:text-[#DE5239] transition-colors leading-snug line-clamp-1">
            &ldquo;{title}&rdquo;
          </h4>

          {capture.content && (
            <p className="font-serif text-xs text-[#665F56] line-clamp-2 leading-relaxed">
              {capture.content}
            </p>
          )}
        </div>

        {/* Action Button & Avatars */}
        <div className="flex items-center gap-3 shrink-0 self-start sm:self-center pt-2 sm:pt-0">
          {people.length > 0 && (
            <div className="flex items-center gap-1 hidden sm:flex">
              {people.slice(0, 2).map((p: string, idx: number) => (
                <ArtisticAvatar key={idx} name={p} size="sm" />
              ))}
            </div>
          )}

          <button
            type="button"
            className="px-3.5 py-2 bg-[#1C1917] text-white rounded-xl text-xs font-sans font-bold shadow-[2px_2px_0px_#DE5239] group-hover:bg-[#DE5239] transition-colors cursor-pointer flex items-center gap-1.5 shrink-0"
          >
            <span>Revisit Entry</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}
