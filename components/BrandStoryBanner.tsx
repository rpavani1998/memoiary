"use client";

import React from "react";
import { Sparkles, X } from "lucide-react";

interface Props {
  onClose?: () => void;
}

export function BrandStoryBanner({ onClose }: Props) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#FAF0EB] via-[#FAF7F2] to-[#F2F5F2] border border-[#F2D5CB] p-4 sm:p-6 shadow-xs my-5 animate-fade-in">
      {/* Close/Dismiss Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors cursor-pointer"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Decorative subtle background weave element */}
      <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
        <img src="/logo-mark.png" alt="" className="w-48 h-48 sm:w-56 sm:h-56 object-contain" />
      </div>

      <div className="relative z-10 space-y-4">
        {/* Header & Subtitle */}
        <div className="space-y-2 max-w-xl pr-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E09885]/15 border border-[#E09885]/30 text-[#B86854] text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#E09885]" />
            <span>Memoiary Story Weave</span>
          </div>

          <h2 className="font-serif-editorial text-xl sm:text-2xl font-medium text-[#1A1D20] leading-tight">
            Your Memories, Beautifully Connected
          </h2>

          <p className="text-xs sm:text-sm text-[#4A5056] leading-relaxed font-sans-clean">
            Raw, scattered thoughts gathered by the pen — woven into continuous threads of deep meaning that shape your living story.
          </p>
        </div>

        {/* 3-Step Visual Weave Story - Guaranteed 3-column Grid inside container bounds */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5 w-full pt-1">
          <div className="bg-white/85 backdrop-blur-xs border border-[#E8E2D9] rounded-xl p-2.5 sm:p-3 text-center space-y-1 flex flex-col items-center justify-center min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FAF0EB] flex items-center justify-center p-1 sm:p-1.5 border border-[#F2D5CB] shrink-0">
              <img src="/scattered-thoughts.png" alt="Scattered Thoughts" className="w-full h-full object-contain" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#1A1D20] block truncate w-full">Scattered Thoughts</span>
            <span className="text-[9px] sm:text-[11px] text-[#656C75] block leading-tight truncate w-full">Fleeting thoughts</span>
          </div>

          <div className="bg-white/85 backdrop-blur-xs border border-[#E8E2D9] rounded-xl p-2.5 sm:p-3 text-center space-y-1 flex flex-col items-center justify-center min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FAF0EB] flex items-center justify-center p-1 sm:p-1.5 border border-[#F2D5CB] shrink-0">
              <img src="/weaving-connections.png" alt="Weaving Connections" className="w-full h-full object-contain" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#1A1D20] block truncate w-full">Weaving Connections</span>
            <span className="text-[9px] sm:text-[11px] text-[#656C75] block leading-tight truncate w-full">Gathered by Pen</span>
          </div>

          <div className="bg-white/85 backdrop-blur-xs border border-[#E09885]/30 rounded-xl p-2.5 sm:p-3 text-center space-y-1 flex flex-col items-center justify-center min-w-0">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#E09885]/20 flex items-center justify-center p-1 sm:p-1.5 border border-[#E09885]/40 shrink-0">
              <img src="/woven-story.png" alt="Woven Life Story" className="w-full h-full object-contain" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#1A1D20] block truncate w-full">Woven Life Story</span>
            <span className="text-[9px] sm:text-[11px] text-[#656C75] block leading-tight truncate w-full">Integrated meaning</span>
          </div>
        </div>
      </div>
    </div>
  );
}
