"use client";

import React from "react";
import { Home, Clock, BookOpen, User, MapPin, MessageSquare, Plus, Search } from "lucide-react";
import { NavTab } from "./BottomNavigation";
import { HandDrawnIllustration } from "./HandDrawnIllustration";

interface Props {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenCapture: () => void;
}

export function DesktopSidebar({ activeTab, onSelectTab, onOpenCapture }: Props) {
  const links: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: "home", label: "Home", icon: <Home className="w-4 h-4" /> },
    { id: "timeline", label: "Timeline", icon: <Clock className="w-4 h-4" /> },
    { id: "memories", label: "Memories", icon: <BookOpen className="w-4 h-4" /> },
    { id: "people", label: "People", icon: <User className="w-4 h-4" /> },
    { id: "places", label: "Places", icon: <MapPin className="w-4 h-4" /> },
    { id: "reflect", label: "Reflect", icon: <MessageSquare className="w-4 h-4" /> },
    { id: "search", label: "Search", icon: <Search className="w-4 h-4" /> },
  ];

  return (
    <aside className="hidden md:flex flex-col justify-between w-60 h-screen sticky top-0 bg-[#FAF7F2] border-r border-[#E8E2D9] p-6 shrink-0 font-sans-clean">
      <div className="space-y-8">
        {/* Brand Header */}
        <div className="flex items-center gap-3">
          <HandDrawnIllustration type="notebook" size={32} />
          <div>
            <h1 className="font-serif-editorial text-xl font-medium text-stone-900 leading-none">
              Memoiary
            </h1>
            <p className="text-[10px] text-stone-500 font-sans-clean mt-0.5 tracking-wider uppercase">
              Personal Journal
            </p>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => onSelectTab(link.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  isActive
                    ? "bg-[#FDF6F0] text-[#C86D51] border border-[#E8E2D9]"
                    : "text-stone-600 hover:text-stone-900 hover:bg-white/60"
                }`}
              >
                <span className={isActive ? "text-[#C86D51]" : "text-stone-400"}>
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
          className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#C86D51] hover:bg-[#B85C42] text-white rounded-2xl text-sm font-medium shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Capture Memory</span>
        </button>
      </div>
    </aside>
  );
}
