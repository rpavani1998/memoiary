"use client";

import React from "react";
import { Sparkles, X } from "lucide-react";

interface Props {
  onClose?: () => void;
}

export function BrandStoryBanner({ onClose }: Props) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-[#FAF7F0] border-[1.5px] border-[#23201C] p-4 sm:p-6 shadow-[3px_3px_0px_#23201C] my-5 animate-fade-in">
      {/* Close/Dismiss Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-full text-[#6B655E] hover:text-[#23201C] hover:bg-[#E8E2D9] transition-colors cursor-pointer border border-[#23201C]/20 bg-white"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Sun accent blob */}
      <div className="absolute -right-6 -bottom-6 w-36 h-36 rounded-full bg-[#DE5239]/15 pointer-events-none border border-[#23201C]/20" />

      <div className="relative z-10 space-y-4">
        {/* Header & Subtitle */}
        <div className="space-y-2 max-w-xl pr-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#DE5239]/10 border border-[#DE5239]/30 text-[#DE5239] text-xs font-semibold tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#DE5239]" />
            <span>Memoiary Story Weave</span>
          </div>

          <h2 className="font-serif text-xl sm:text-2xl font-medium text-[#23201C] leading-tight">
            Your Memories, Beautifully Connected
          </h2>

          <p className="text-xs sm:text-sm text-[#6B655E] leading-relaxed font-sans">
            Raw, scattered thoughts gathered by the pen — woven into continuous threads of deep meaning that shape your living story.
          </p>
        </div>

        {/* 3-Step Visual Weave Story */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3.5 w-full pt-1">
          <div className="bg-white border-[1.5px] border-[#23201C] rounded-2xl p-2.5 sm:p-3 text-center space-y-1 flex flex-col items-center justify-center min-w-0 shadow-xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#F7EAE1] flex items-center justify-center p-1 sm:p-1.5 border border-[#23201C]/30 shrink-0">
              <img src="/scattered-thoughts.png" alt="Scattered Thoughts" className="w-full h-full object-contain" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#23201C] block truncate w-full font-sans">Scattered Thoughts</span>
            <span className="text-[9px] sm:text-[11px] text-[#6B655E] block leading-tight truncate w-full font-sans">Fleeting thoughts</span>
          </div>

          <div className="bg-white border-[1.5px] border-[#23201C] rounded-2xl p-2.5 sm:p-3 text-center space-y-1 flex flex-col items-center justify-center min-w-0 shadow-xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#FAF7F0] flex items-center justify-center p-1 sm:p-1.5 border border-[#23201C]/30 shrink-0">
              <img src="/weaving-connections.png" alt="Weaving Connections" className="w-full h-full object-contain" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#23201C] block truncate w-full font-sans">Weaving Connections</span>
            <span className="text-[9px] sm:text-[11px] text-[#6B655E] block leading-tight truncate w-full font-sans">Gathered by Pen</span>
          </div>

          <div className="bg-[#FAF7F0] border-[1.5px] border-[#DE5239] rounded-2xl p-2.5 sm:p-3 text-center space-y-1 flex flex-col items-center justify-center min-w-0 shadow-xs">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-[#DE5239] flex items-center justify-center p-1 sm:p-1.5 border border-[#23201C]/30 shrink-0">
              <img src="/woven-story.png" alt="Woven Life Story" className="w-full h-full object-contain invert brightness-200" />
            </div>
            <span className="text-[11px] sm:text-xs font-semibold text-[#DE5239] block truncate w-full font-sans">Woven Life Story</span>
            <span className="text-[9px] sm:text-[11px] text-[#6B655E] block leading-tight truncate w-full font-sans">Integrated meaning</span>
          </div>
        </div>
      </div>
    </div>
  );
}
