"use client";

import React from "react";
import { Home, Clock, BookOpen, Search } from "lucide-react";
import { ThoughtBubbleIcon } from "@/components/ThoughtBubbleIcon";

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
          <Home className="w-6 h-6" />
          <span className="text-xs font-sans-clean font-semibold">Home</span>
        </button>

        {/* Timeline */}
        <button
          onClick={() => onSelectTab("timeline")}
          className={`flex flex-col items-center gap-1 p-2 cursor-pointer transition-colors ${
            activeTab === "timeline" ? "text-[#E09885]" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <Clock className="w-6 h-6" />
          <span className="text-xs font-sans-clean font-semibold">Timeline</span>
        </button>

        {/* Persistent Central Action */}
        <div className="relative -top-4">
          <button
            onClick={onOpenCapture}
            className="w-14 h-14 rounded-full bg-[#E09885] hover:bg-[#D48875] text-white flex items-center justify-center shadow-lg transition-transform active:scale-95 cursor-pointer"
            title="Add a thought"
            aria-label="Add a thought"
          >
            <ThoughtBubbleIcon className="w-7 h-7 text-white" />
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
          <BookOpen className="w-6 h-6" />
          <span className="text-xs font-sans-clean font-semibold">Memories</span>
        </button>

        {/* Search */}
        <button
          onClick={() => onSelectTab("search")}
          className={`flex flex-col items-center gap-1 p-2 cursor-pointer transition-colors ${
            activeTab === "search" ? "text-[#E09885]" : "text-stone-500 hover:text-stone-800"
          }`}
        >
          <Search className="w-6 h-6" />
          <span className="text-xs font-sans-clean font-semibold">Search</span>
        </button>
      </div>
    </div>
  );
}
