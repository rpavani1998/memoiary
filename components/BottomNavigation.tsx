"use client";

import React from "react";
import { Home, Clock, BookOpen, Search } from "lucide-react";

export type NavTab = "home" | "timeline" | "memories" | "search" | "people" | "places" | "reflect";

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenCapture: () => void;
}

export function BottomNavigation({ activeTab, onSelectTab, onOpenCapture }: Props) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8E2D9] px-4 py-2">
      <div className="max-w-md mx-auto flex items-center justify-around relative">
        {/* Home */}
        <button
          onClick={() => onSelectTab("home")}
          className={`flex flex-col items-center gap-1 p-2 cursor-pointer transition-colors ${
            activeTab === "home" ? "text-[#E09885]" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] font-sans-clean font-medium">Home</span>
        </button>

        {/* Timeline */}
        <button
          onClick={() => onSelectTab("timeline")}
          className={`flex flex-col items-center gap-1 p-2 cursor-pointer transition-colors ${
            activeTab === "timeline" ? "text-[#E09885]" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <Clock className="w-5 h-5" />
          <span className="text-[10px] font-sans-clean font-medium">Timeline</span>
        </button>

        {/* Persistent Central Capture Elevated Action ◉ */}
        <div className="relative -top-4">
          <button
            onClick={onOpenCapture}
            className="w-13 h-13 rounded-full bg-[#E09885] hover:bg-[#D48875] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            title="Tap to talk"
          >
            <span className="text-2xl font-bold select-none leading-none">◉</span>
          </button>
        </div>

        {/* Memories */}
        <button
          onClick={() => onSelectTab("memories")}
          className={`flex flex-col items-center gap-1 p-2 cursor-pointer transition-colors ${
            activeTab === "memories" || activeTab === "people" || activeTab === "places"
              ? "text-[#E09885]"
              : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span className="text-[10px] font-sans-clean font-medium">Memories</span>
        </button>

        {/* Search */}
        <button
          onClick={() => onSelectTab("search")}
          className={`flex flex-col items-center gap-1 p-2 cursor-pointer transition-colors ${
            activeTab === "search" ? "text-[#E09885]" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <Search className="w-5 h-5" />
          <span className="text-[10px] font-sans-clean font-medium">Search</span>
        </button>
      </div>
    </div>
  );
}
