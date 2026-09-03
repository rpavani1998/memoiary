"use client";

import React from "react";
import { Home, Clock, BookOpen, User, MapPin, MessageSquare, Search } from "lucide-react";
import { NavTab } from "./BottomNavigation";
import { ThoughtBubbleIcon } from "./ThoughtBubbleIcon";

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenCapture: () => void;
}

export function DesktopSidebar({ activeTab, onSelectTab, onOpenCapture }: Props) {
  const links: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home className="w-5 h-5" /> },
    { id: "timeline", label: "Timeline", icon: <Clock className="w-5 h-5" /> },
    { id: "memories", label: "Memories", icon: <BookOpen className="w-5 h-5" /> },
    { id: "people", label: "People", icon: <User className="w-5 h-5" /> },
    { id: "places", label: "Places", icon: <MapPin className="w-5 h-5" /> },
    { id: "reflect", label: "Reflect", icon: <MessageSquare className="w-5 h-5" /> },
    { id: "search", label: "Search", icon: <Search className="w-5 h-5" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-64 h-screen sticky top-0 bg-[#FAF7F2] border-r border-[#E8E2D9] p-6 shrink-0 font-sans-clean">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <img src="/logo-mark.png" alt="Memoiary Icon" className="h-13 w-auto object-contain shrink-0 scale-110 -my-1" />
          <div>
            <h1 className="font-serif-editorial text-2xl font-semibold text-stone-900 leading-none">
              Memoiary
            </h1>
            <p className="text-xs text-stone-500 font-sans-clean mt-1 tracking-wider uppercase font-medium">
              Memories Beautifully Connected
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          {links.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-base font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FAF0EB] text-[#E09885] border border-[#F2D5CB] font-semibold"
                    : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
                }`}
              >
                <span className={isActive ? "text-[#E09885]" : "text-stone-400"}>
                  {link.icon}
                </span>
                <span>{link.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Primary Capture Action Button */}
      <div className="pt-4">
        <button
          onClick={onOpenCapture}
          className="w-full flex items-center justify-center gap-2.5 py-3.5 px-4 bg-[#E09885] hover:bg-[#D48875] text-white rounded-2xl text-base font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <ThoughtBubbleIcon className="w-5 h-5 text-white" />
          <span>Add Thought</span>
        </button>
      </div>
    </aside>
  );
}
