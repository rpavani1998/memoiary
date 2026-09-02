"use client";

import React from "react";
import { Sparkles, PenTool, Heart } from "lucide-react";

export function BrandStoryBanner() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#FAF0EB] via-[#FAF7F2] to-[#F2F5F2] border border-[#F2D5CB] p-6 sm:p-7 shadow-xs my-6">
      {/* Decorative subtle background weave element */}
      <div className="absolute -right-8 -bottom-8 opacity-15 pointer-events-none">
        <img src="/logo.png" alt="" className="w-56 h-56 object-contain" />
      </div>

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E09885]/15 border border-[#E09885]/30 text-[#B86854] text-xs font-medium tracking-wide">
            <Sparkles className="w-3.5 h-3.5 text-[#E09885]" />
            <span>Memoiary Story Weave</span>
          </div>

          <h2 className="font-serif-editorial text-2xl sm:text-3xl font-medium text-[#1A1D20] leading-tight">
            Your Memories, Beautifully Connected
          </h2>

          <p className="text-sm text-[#4A5056] leading-relaxed font-sans-clean">
            Raw, scattered thoughts gathered by the pen — woven into continuous threads of deep meaning that shape your living story.
          </p>
        </div>

        {/* 3-Step Visual Weave Story */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
          <div className="bg-white/80 backdrop-blur-xs border border-[#E8E2D9] rounded-xl p-3 text-center space-y-1.5 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#FAF0EB] flex items-center justify-center text-[#E09885]">
              <div className="flex gap-1 items-center">
                <span className="w-1.5 h-1.5 rounded-full bg-[#E09885] animate-pulse"></span>
                <span className="w-1 h-1 rounded-full bg-[#7C8B7B]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1A1D20]"></span>
              </div>
            </div>
            <span className="text-[11px] font-medium text-[#1A1D20] block">Scattered Dots</span>
            <span className="text-[9px] text-[#656C75] block leading-tight">Fleeting thoughts</span>
          </div>

          <div className="bg-white/80 backdrop-blur-xs border border-[#E8E2D9] rounded-xl p-3 text-center space-y-1.5 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#FAF0EB] flex items-center justify-center text-[#E09885]">
              <PenTool className="w-4 h-4 text-[#E09885]" />
            </div>
            <span className="text-[11px] font-medium text-[#1A1D20] block">Gathered by Pen</span>
            <span className="text-[9px] text-[#656C75] block leading-tight">Captured & linked</span>
          </div>

          <div className="bg-white/80 backdrop-blur-xs border border-[#E09885]/30 rounded-xl p-3 text-center space-y-1.5 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-[#E09885]/20 flex items-center justify-center text-[#B86854]">
              <Heart className="w-4 h-4 fill-[#E09885] text-[#E09885]" />
            </div>
            <span className="text-[11px] font-medium text-[#1A1D20] block">Woven Meaning</span>
            <span className="text-[9px] text-[#656C75] block leading-tight">Your story</span>
          </div>
        </div>
      </div>
    </div>
  );
}
