"use client";

import React from "react";
import { Home, Clock, Layers, MessageSquare, Search } from "lucide-react";
import { ThoughtBubbleIcon } from "@/components/ThoughtBubbleIcon";

export type NavTab = "home" | "timeline" | "memories" | "search" | "people" | "places" | "reflect" | "collections";

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenCapture: () => void;
}

export function BottomNavigation({ activeTab, onSelectTab, onOpenCapture }: Props) {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F0]/95 backdrop-blur-lg border-t-[1.5px] border-[#1C1917] px-6 py-3 shadow-lg">
      <div className="max-w-md mx-auto flex items-center justify-between relative px-2">
        {/* 1. Home / Daily Sanctuary */}
        <button
          onClick={() => onSelectTab("home")}
          title="Home Sanctuary"
          aria-label="Home Sanctuary"
          className={`flex flex-col items-center justify-center w-11 h-11 rounded-full cursor-pointer transition-all relative ${
            activeTab === "home"
              ? "text-[#DE5239] bg-[#F5E5DC] border border-[#DE5239]/20 scale-105"
              : "text-[#665F56] hover:text-[#1C1917] hover:bg-[#F5F1E8]"
          }`}
        >
          <Home className="w-5.5 h-5.5" />
          {activeTab === "home" && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#DE5239]" />
          )}
        </button>

        {/* 2. Timeline */}
        <button
          onClick={() => onSelectTab("timeline")}
          title="Timeline"
          aria-label="Timeline"
          className={`flex flex-col items-center justify-center w-11 h-11 rounded-full cursor-pointer transition-all relative ${
            activeTab === "timeline"
              ? "text-[#DE5239] bg-[#F5E5DC] border border-[#DE5239]/20 scale-105"
              : "text-[#665F56] hover:text-[#1C1917] hover:bg-[#F5F1E8]"
          }`}
        >
          <Clock className="w-5.5 h-5.5" />
          {activeTab === "timeline" && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#DE5239]" />
          )}
        </button>

        {/* 3. Persistent Central Capture Action */}
        <div className="relative -top-3">
          <div className="absolute inset-0 rounded-full bg-[#DE5239]/20 blur-md animate-pulse" />
          <button
            onClick={onOpenCapture}
            className="relative w-13 h-13 rounded-full bg-[#DE5239] hover:bg-[#C6422A] text-white border-[1.5px] border-[#1C1917] flex items-center justify-center shadow-[2px_3px_0px_#1C1917] transition-transform active:scale-90 cursor-pointer"
            title="Add a thought"
            aria-label="Add a thought"
          >
            <ThoughtBubbleIcon className="w-6.5 h-6.5 text-white" />
          </button>
        </div>

        {/* 4. Elements (People, Places, Wishlist & Intentions) */}
        <button
          onClick={() => onSelectTab("memories")}
          title="Elements (People, Places & Wishlist)"
          aria-label="Elements"
          className={`flex flex-col items-center justify-center w-11 h-11 rounded-full cursor-pointer transition-all relative ${
            activeTab === "memories" || activeTab === "people" || activeTab === "places"
              ? "text-[#DE5239] bg-[#F5E5DC] border border-[#DE5239]/20 scale-105"
              : "text-[#665F56] hover:text-[#1C1917] hover:bg-[#F5F1E8]"
          }`}
        >
          <Layers className="w-5.5 h-5.5" />
          {(activeTab === "memories" || activeTab === "people" || activeTab === "places") && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#DE5239]" />
          )}
        </button>

        {/* 5. Talk AI / Reflect */}
        <button
          onClick={() => onSelectTab("reflect")}
          title="AI Reflect & Chat"
          aria-label="AI Reflect & Chat"
          className={`flex flex-col items-center justify-center w-11 h-11 rounded-full cursor-pointer transition-all relative ${
            activeTab === "reflect"
              ? "text-[#DE5239] bg-[#F5E5DC] border border-[#DE5239]/20 scale-105"
              : "text-[#665F56] hover:text-[#1C1917] hover:bg-[#F5F1E8]"
          }`}
        >
          <MessageSquare className="w-5.5 h-5.5" />
          {activeTab === "reflect" && (
            <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#DE5239]" />
          )}
        </button>
      </div>
    </div>
  );
}
