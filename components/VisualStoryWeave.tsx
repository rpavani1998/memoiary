"use client";

import React from "react";
import { PenTool, Layers, Code, Grid, PieChart, Sun } from "lucide-react";

export function VisualStoryWeave() {
  return (
    <div className="relative my-6 overflow-hidden rounded-3xl border-[1.5px] border-[#23201C] bg-[#FAF7F0] p-4 sm:p-6 shadow-[3px_4px_0px_#23201C]">
      {/* Background paper texture & sun motif */}
      <div className="absolute top-2 right-4 w-32 h-32 rounded-full bg-[#DE5239]/10 blur-xl pointer-events-none" />

      {/* Header */}
      <div className="mb-5 space-y-1">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DE5239]/10 border border-[#DE5239]/30 text-[#DE5239] text-xs font-medium tracking-wide">
          <span className="w-2 h-2 rounded-full bg-[#DE5239] animate-pulse" />
          <span>Memoiary Synthesis Engine</span>
        </div>
        <h3 className="font-serif text-xl sm:text-2xl font-medium text-[#23201C]">
          From Raw Moments to Woven Meaning
        </h3>
        <p className="text-xs sm:text-sm text-[#6B655E] font-sans">
          Text notes, voice logs, and photos automatically connect into a living story memory graph.
        </p>
      </div>

      {/* Interactive / Visual Diagram Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Left Column: 3 Source Memory Cards */}
        <div className="md:col-span-5 space-y-3.5 z-10">
          {/* Card 1: Palette & Textures */}
          <div className="border-[1.5px] border-[#23201C] rounded-2xl bg-white p-3 shadow-xs">
            <div className="flex items-center justify-between text-xs font-semibold text-[#23201C] mb-2 font-sans">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#DE5239]" />
                Colors & Mood
              </span>
              <span className="text-[10px] text-[#6B655E] uppercase tracking-wider">Palette</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 mb-2">
              <div className="h-6 rounded-md bg-[#23201C]" />
              <div className="h-6 rounded-md bg-[#E8E2D9]" />
              <div className="h-6 rounded-md bg-[#F7EAE1]" />
              <div className="h-6 rounded-md bg-[#DE5239]" />
            </div>
            <div className="grid grid-cols-3 gap-1">
              <div className="h-4 rounded bg-[#FAF7F0] border border-[#23201C]/20 text-[9px] flex items-center justify-center font-mono text-[#6B655E]">Dots</div>
              <div className="h-4 rounded bg-[#FAF7F0] border border-[#23201C]/20 text-[9px] flex items-center justify-center font-mono text-[#6B655E]">Lines</div>
              <div className="h-4 rounded bg-[#FAF7F0] border border-[#23201C]/20 text-[9px] flex items-center justify-center font-mono text-[#6B655E]">Mesh</div>
            </div>
          </div>

          {/* Card 2: Functional Vector Icons Grid */}
          <div className="border-[1.5px] border-[#23201C] rounded-2xl bg-white p-3 shadow-xs">
            <div className="grid grid-cols-3 gap-2">
              <div className="border border-[#23201C]/20 rounded-xl p-2 flex flex-col items-center justify-center bg-[#FAF7F0]">
                <PenTool size={16} className="text-[#DE5239]" />
                <span className="text-[9px] font-sans font-medium text-[#23201C] mt-1">Refinement</span>
              </div>
              <div className="border border-[#23201C]/20 rounded-xl p-2 flex flex-col items-center justify-center bg-[#FAF7F0]">
                <Layers size={16} className="text-[#23201C]" />
                <span className="text-[9px] font-sans font-medium text-[#23201C] mt-1">Layers</span>
              </div>
              <div className="border border-[#23201C]/20 rounded-xl p-2 flex flex-col items-center justify-center bg-[#FAF7F0]">
                <Code size={16} className="text-[#23201C]" />
                <span className="text-[9px] font-sans font-medium text-[#23201C] mt-1">Logic</span>
              </div>
              <div className="border border-[#23201C]/20 rounded-xl p-2 flex flex-col items-center justify-center bg-[#FAF7F0]">
                <Grid size={16} className="text-[#23201C]" />
                <span className="text-[9px] font-sans font-medium text-[#23201C] mt-1">Grid</span>
              </div>
              <div className="border border-[#23201C]/20 rounded-xl p-2 flex flex-col items-center justify-center bg-[#FAF7F0]">
                <PieChart size={16} className="text-[#DE5239]" />
                <span className="text-[9px] font-sans font-medium text-[#23201C] mt-1">Insights</span>
              </div>
              <div className="border border-[#23201C]/20 rounded-xl p-2 flex flex-col items-center justify-center bg-[#FAF7F0]">
                <Sun size={16} className="text-[#DE5239]" />
                <span className="text-[9px] font-sans font-medium text-[#23201C] mt-1">Resurface</span>
              </div>
            </div>
          </div>

          {/* Card 3: Scenic Illustration Card */}
          <div className="border-[1.5px] border-[#23201C] rounded-2xl bg-[#FAF7F0] p-2.5 overflow-hidden relative shadow-xs">
            <div className="h-20 rounded-xl bg-gradient-to-tr from-[#E8E2D9] to-[#F7EAE1] border border-[#23201C]/20 relative overflow-hidden flex items-center justify-center">
              {/* Sun Graphic */}
              <div className="w-10 h-10 rounded-full bg-[#DE5239] absolute left-6 top-3 border border-[#23201C]/30 shadow-xs" />
              <img
                src="/images/rooftop-chai.jpg"
                alt="Memory snapshot"
                className="w-full h-full object-cover opacity-85 mix-blend-multiply"
              />
            </div>
          </div>
        </div>

        {/* Center Flow SVG Connectors */}
        <div className="hidden md:flex md:col-span-2 items-center justify-center relative h-full">
          <svg className="w-full h-48 overflow-visible" viewBox="0 0 100 200">
            {/* Flow line 1 */}
            <path
              d="M 0 35 C 50 35, 50 100, 80 100"
              fill="none"
              stroke="#23201C"
              strokeWidth="1.5"
            />
            {/* Flow line 2 */}
            <path
              d="M 0 100 C 40 100, 60 100, 80 100"
              fill="none"
              stroke="#23201C"
              strokeWidth="1.5"
            />
            {/* Flow line 3 */}
            <path
              d="M 0 165 C 50 165, 50 100, 80 100"
              fill="none"
              stroke="#23201C"
              strokeWidth="1.5"
            />
            {/* Arrow line */}
            <path
              d="M 80 100 L 100 100"
              fill="none"
              stroke="#23201C"
              strokeWidth="1.5"
            />
            {/* Arrow head */}
            <polygon points="95,95 102,100 95,105" fill="#23201C" />

            {/* Red Node Dots */}
            <circle cx="50" cy="35" r="3.5" fill="#DE5239" stroke="#23201C" strokeWidth="1" />
            <circle cx="50" cy="100" r="3.5" fill="#DE5239" stroke="#23201C" strokeWidth="1" />
            <circle cx="50" cy="165" r="3.5" fill="#DE5239" stroke="#23201C" strokeWidth="1" />
          </svg>
        </div>

        {/* Right Column: Final Framed Compiled Story Card */}
        <div className="md:col-span-5 relative z-10">
          <div className="border-[2px] border-[#23201C] rounded-3xl bg-white p-4 shadow-[4px_6px_0px_#23201C] relative">
            {/* Top right Japanese Sun Accent */}
            <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-[#DE5239] border-[1.5px] border-[#23201C] -z-10 opacity-90 shadow-sm" />

            {/* Mock Header */}
            <div className="flex items-center justify-between mb-3 border-b border-[#23201C]/15 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full bg-[#DE5239]" />
                <span className="font-serif text-sm font-semibold text-[#23201C]">Memoiary Synthesis</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-4 h-0.5 bg-[#23201C] block" />
                <span className="w-4 h-0.5 bg-[#23201C] block" />
                <span className="w-4 h-0.5 bg-[#23201C] block" />
              </div>
            </div>

            {/* Featured Image Frame */}
            <div className="border-[1.5px] border-[#23201C] rounded-2xl overflow-hidden mb-3 relative bg-[#FAF7F0]">
              <img
                src="/images/cafe-notes.jpg"
                alt="Woven memory preview"
                className="w-full h-32 object-cover"
              />
              <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-[#DE5239] border border-[#23201C]" />
            </div>

            {/* Color Swatch Badges */}
            <div className="grid grid-cols-4 gap-1.5 mb-3">
              <div className="h-5 rounded-lg bg-[#23201C] text-[8px] font-mono text-white flex items-center justify-center">INK</div>
              <div className="h-5 rounded-lg bg-[#E8E2D9] text-[8px] font-mono text-[#23201C] flex items-center justify-center">SAND</div>
              <div className="h-5 rounded-lg bg-[#F7EAE1] text-[8px] font-mono text-[#23201C] flex items-center justify-center">ROSE</div>
              <div className="h-5 rounded-lg bg-[#DE5239] text-[8px] font-mono text-white flex items-center justify-center">SUN</div>
            </div>

            {/* Typography Preview & Spark Line Graph */}
            <div className="space-y-2 border-t border-[#23201C]/15 pt-2.5">
              <div className="flex items-center justify-between">
                <div className="space-y-1 flex-1">
                  <div className="h-2 w-3/4 rounded-full bg-[#23201C]" />
                  <div className="h-1.5 w-1/2 rounded-full bg-[#6B655E]" />
                </div>
                {/* Mini spark graph */}
                <div className="w-16 h-8 border border-[#23201C]/20 rounded-lg p-1 flex items-center justify-center bg-[#FAF7F0]">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 50 20">
                    <path d="M 0 15 Q 15 5, 30 12 T 48 3" fill="none" stroke="#DE5239" strokeWidth="1.5" />
                    <circle cx="48" cy="3" r="2.5" fill="#DE5239" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
